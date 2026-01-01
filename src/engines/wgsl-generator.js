import formatArguments from '../format-arguments.js'

// converts a tree of javascript functions to a WGSL shader
export default function (transforms) {
    var shaderParams = {
        uniforms: [], // list of uniforms used in shader
        glslFunctions: [], // list of functions used in shader (actually WGSL functions in this case)
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
        if (!contains(transform, shaderParams.glslFunctions)) shaderParams.glslFunctions.push(transform)

        var prev = generator

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
                // combining two generated shader strings (i.e. for blend, mult, add funtions)
                `${generateInputs(inputs, shaderParams)(`${c}${i}`, uv)}
         ${prev(c, uv)}
         ${c} = ${shaderString(`${c}${i}`, `${c}`, transform.name, inputs)};`
        } else if (transform.transform.type === 'combineCoord') {
            // combining two generated shader strings (i.e. for modulate functions)
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
        if (input.value && input.value.transforms) {
            prev = generator
            generator = (c, uv) => {
                let ci = generateInputName(c, i)
                let uvi = generateInputName(`${uv}_${c}`, i)
                return `var ${uvi}: vec2<f32> = ${uv};${prev(c, uv)}
         ${generateWgsl(input.value.transforms, shaderParams)(ci, uvi)}`
            }
        }
    })

    return generator
}

// assembles a shader string containing the arguments and the function name, i.e. 'osc(uv, frequency)'
function shaderString(c, uv, method, inputs) {
    const str = inputs.map((input, i) => {
        if (input.isUniform) {
            return input.name
        } else if (input.value && input.value.transforms) {
            // this by definition needs to be a generator
            // use the variable created for generator inputs in `generateInputs`
            return generateInputName(c, i)
        }
        // Handle undefined/null values - use a sensible default based on type
        if (input.value === undefined || input.value === null) {
            // Return default value if available, otherwise type-appropriate default
            if (input.default !== undefined) {
                const val = String(input.default)
                return input.type === 'float' && !val.includes('.') ? val + '.' : val
            }
            return input.type === 'float' ? '0.0' : '0'
        }
        return input.value
    }).reduce((p, c) => `${p}, ${c}`, '')

    return `${method}(${uv}${str})`
}

// check whether array
function contains(object, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (object.name == arr[i].name) return true
    }
    return false
}
