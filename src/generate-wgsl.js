
import formatArguments from './format-arguments.js'

// converts a tree of javascript functions to a WGSL shader
export default function (transforms) {
    var shaderParams = {
        uniforms: [], // list of uniforms used in shader
        wgslFunctions: [], // list of functions used in shader
        fragColor: ''
    }

    var gen = generateWgsl(transforms, shaderParams)('c', 'st')

    shaderParams.fragColor = gen

    // remove uniforms with duplicate names
    let uniforms = {}
    shaderParams.uniforms.forEach((uniform) => uniforms[uniform.name] = uniform)
    shaderParams.uniforms = Object.values(uniforms)
    return shaderParams
}

function generateInputName(v, index) {
    return `${v}_i${index}`
}

function generateWgsl(transforms, shaderParams) {
    var generator = (c, uv) => ''

    transforms.forEach((transform, i) => {
        // Accumulate uniforms to lazily add them to the output shader
        let inputs = formatArguments(transform, shaderParams.uniforms.length)
        inputs.forEach((input) => {
            if (input.isUniform) shaderParams.uniforms.push(input)
        })

        // Lazily generate wgsl function definition
        if (!contains(transform, shaderParams.wgslFunctions)) shaderParams.wgslFunctions.push(transform)

        var prev = generator

        // WGSL Glue Code Generation
        // Note: WGSL uses 'var' or 'let' for declarations. 
        // Return types are explicit in function defs, but here we invoke them.
        // 'src', 'color', 'combine' return vec4<f32>
        // 'coord', 'combineCoord' return vec2<f32>

        if (transform.transform.type === 'src') {
            generator = (c, uv) =>
                `${generateInputs(inputs, shaderParams)(`${c}${i}`, uv)}
         var ${c}: vec4<f32> = ${shaderString(`${c}${i}`, uv, transform.name, inputs)};`
        } else if (transform.transform.type === 'color') {
            generator = (c, uv) =>
                `${generateInputs(inputs, shaderParams)(`${c}${i}`, uv)}
         ${prev(c, uv)}
         ${c} = ${shaderString(`${c}${i}`, `${c}`, transform.name, inputs)};`
        } else if (transform.transform.type === 'coord') {
            generator = (c, uv) =>
                `${generateInputs(inputs, shaderParams)(`${c}${i}`, uv)}
         ${uv} = ${shaderString(`${c}${i}`, `${uv}`, transform.name, inputs)};
         ${prev(c, uv)}`
        } else if (transform.transform.type === 'combine') {
            generator = (c, uv) =>
                `${generateInputs(inputs, shaderParams)(`${c}${i}`, uv)}
         ${prev(c, uv)}
         ${c} = ${shaderString(`${c}${i}`, `${c}`, transform.name, inputs)};`
        } else if (transform.transform.type === 'combineCoord') {
            generator = (c, uv) =>
                `${generateInputs(inputs, shaderParams)(`${c}${i}`, uv)}
         ${uv} = ${shaderString(`${c}${i}`, `${uv}`, transform.name, inputs)};
         ${prev(c, uv)}`
        }
    })

    return generator
}

function generateInputs(inputs, shaderParams) {
    let generator = (c, uv) => ''
    var prev = generator
    inputs.forEach((input, i) => {
        if (input.value.transforms) {
            prev = generator
            generator = (c, uv) => {
                let ci = generateInputName(c, i)
                let uvi = generateInputName(`${uv}_${c}`, i)
                // WGSL: var uvi: vec2<f32> = uv;
                return `var ${uvi}: vec2<f32> = ${uv};
         ${prev(c, uv)}
         ${generateWgsl(input.value.transforms, shaderParams)(ci, uvi)}`
            }
        }
    })

    return generator
}

// assembles a shader string containing the arguments and the function name
function shaderString(c, uv, method, inputs) {
    const str = inputs.map((input, i) => {
        if (input.isUniform) {
            // In WGSL uniforms are usually in a struct/block access
            // But here we rely on the shader wrapper to define 'var<uniform> name' or similar?
            // Actually in our webgpu-output.js we put all uniforms in a single block 'uniforms.name'
            // But existing hydra uniform object structure (name, type, value) needs adaption.
            // For now, let's assume global access or we prepending 'uniforms.'
            return `uniforms.${input.name}`
        } else if (input.value && input.value.transforms) {
            return generateInputName(c, i)
        }
        return input.value
    }).reduce((p, c) => `${p}, ${c}`, '')

    return `${method}(${uv}${str})`
}

function contains(object, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (object.name == arr[i].name) return true
    }
    return false
}
