
import formatArguments from './format-arguments.js'

// converts a tree of javascript functions to a WGSL shader
export default function (transforms) {
    var shaderParams = {
        uniforms: [], // list of uniforms used in shader
        wgslFunctions: [], // list of functions used in shader
        fragColor: ''
    }

    var gen = generateWgsl(transforms, shaderParams)('c', '_st')

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
         ${c} = ${shaderString(`${c}${i}`, uv, transform.name, inputs)};`
        } else if (transform.transform.type === 'color') {
            // Color functions receive both _st and _c0 for texture sampling operations
            generator = (c, uv) =>
                `${generateInputs(inputs, shaderParams)(`${c}${i}`, uv)}
         ${prev(c, uv)}
         ${c} = ${shaderString(`${c}${i}`, `${uv}, ${c}`, transform.name, inputs)};`
        } else if (transform.transform.type === 'coord') {
            generator = (c, uv) =>
                `${generateInputs(inputs, shaderParams)(`${c}${i}`, uv)}
         ${uv} = ${shaderString(`${c}${i}`, `${uv}`, transform.name, inputs)};
         ${prev(c, uv)}`
        } else if (transform.transform.type === 'combine') {
            generator = (c, uv) => {
                // For combine, userArgs[0] (modulator) was skipped by formatArguments
                // We generate code for it here
                let modSetup = '';
                let modVar = 'vec4<f32>(0.0)';

                if (transform.userArgs.length > 0) {
                    let dummyTransform = {
                        transform: { inputs: [{ type: 'vec4', name: 'mod', default: 0 }] },
                        userArgs: [transform.userArgs[0]],
                        synth: transform.synth
                    };
                    // Use formatArguments to robustly handle the input (texture, number, transform chain)
                    let formattedArgs = formatArguments(dummyTransform, shaderParams.uniforms.length, transform.synth);
                    formattedArgs.forEach(arg => { if (arg.isUniform) shaderParams.uniforms.push(arg); });

                    let modArg = formattedArgs[0];
                    if (modArg.value && modArg.value.transforms) {
                        let modC = `${c}${i}_mod`;
                        modSetup = `var ${modC}: vec4<f32> = vec4<f32>(0.0);
                         ${generateWgsl(modArg.value.transforms, shaderParams)(modC, uv)}`;
                        modVar = modC;
                    } else if (modArg.isUniform) {
                        modVar = `uniforms.${modArg.name}`;
                    } else {
                        modVar = modArg.value;
                    }
                }

                // Inject modVar into shaderString call. 
                // We pass `${c}, ${modVar}` as the 'uv' argument so it becomes name(c, modVar, inputs...)
                return `${generateInputs(inputs, shaderParams)(`${c}${i}`, uv)}
         ${modSetup}
         ${prev(c, uv)}
         ${c} = ${shaderString(`${c}${i}`, `${c}, ${modVar}`, transform.name, inputs)};`
            }
        } else if (transform.transform.type === 'combineCoord') {
            generator = (c, uv) => {
                let modSetup = '';
                let modVar = 'vec4<f32>(0.0)';

                if (transform.userArgs.length > 0) {
                    let dummyTransform = {
                        transform: { inputs: [{ type: 'vec4', name: 'mod', default: 0 }] },
                        userArgs: [transform.userArgs[0]],
                        synth: transform.synth
                    };
                    let formattedArgs = formatArguments(dummyTransform, shaderParams.uniforms.length, transform.synth);
                    formattedArgs.forEach(arg => { if (arg.isUniform) shaderParams.uniforms.push(arg); });

                    let modArg = formattedArgs[0];
                    if (modArg.value && modArg.value.transforms) {
                        let modC = `${c}${i}_mod`;
                        modSetup = `var ${modC}: vec4<f32> = vec4<f32>(0.0);
                         ${generateWgsl(modArg.value.transforms, shaderParams)(modC, uv)}`;
                        modVar = modC; // Modulator is a color (vec4)
                    } else if (modArg.isUniform) {
                        modVar = `uniforms.${modArg.name}`;
                    } else {
                        modVar = modArg.value;
                    }
                }

                // shaderString(c, uv, method, inputs) -> name(uv, inputs...)
                // We pass `${uv}, ${modVar}` as the 'uv' argument so it becomes name(uv, modVar, inputs...)
                return `${generateInputs(inputs, shaderParams)(`${c}${i}`, uv)}
                 ${modSetup}
         ${uv} = ${shaderString(`${c}${i}`, `${uv}, ${modVar}`, transform.name, inputs)};
         ${prev(c, uv)}`
            }
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
                // WGSL: var ci: vec4<f32> = vec4<f32>(0.0);
                return `var ${uvi}: vec2<f32> = ${uv};
          var ${ci}: vec4<f32> = vec4<f32>(0.0);
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
            // Texture uniforms are separate bindings, not in the uniforms struct
            if (input.isTexture) {
                return input.name  // Direct reference, no uniforms. prefix
            }
            // Scalar uniforms are in the uniforms struct
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
