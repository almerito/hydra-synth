
import generateWgsl from './generate-wgsl.js'
import utilityFunctions from './glsl/utility-functions.js'
import { getShaderCodeSync, loadShaderCode } from './shader-loader.js'

// WGSL Source class
// Handles compositing transforms and generating the final WGSL shader string
// Replaces GlslSource
var WgslSource = function (obj) {
    this.transforms = []
    if (obj.transform) this.transforms.push(obj)
    this.defaultOutput = obj.defaultOutput
    this.synth = obj.synth
    this.type = 'WgslSource'
    this.defaultUniforms = obj.defaultUniforms
    return this
}

WgslSource.prototype.addTransform = function (obj) {
    this.transforms.push(obj)
}

WgslSource.prototype.out = function (_output) {
    var output = _output || this.defaultOutput

    if (output) try {
        var pass = this.compile(output)
        this.synth.currentFunctions = []
        output.render(pass)
    } catch (error) {
        console.warn('shader could not compile', error)
    }
}

WgslSource.prototype.compile = function (output) {
    // Generate the main shader body from transforms
    var shaderInfo = generateWgsl(this.transforms, {
        uniforms: [],
        wgslFunctions: [],
        fragColor: ''
    })

    // Collect uniforms
    var uniforms = {}
    shaderInfo.uniforms.forEach((uniform) => { uniforms[uniform.name] = uniform.value })

    // NOTE: In WebGPU output module, we wrap this code in a full shader.
    // Here we only need to provide the fragment shader body logic and helper functions strings.

    // We need to resolve utility functions and transform functions code
    // Some might be pure WGSL, others might need transpilation.
    // Ideally this should be async if transpilation is needed, but .out() is sync.
    // So we rely on pre-loaded/cached shaders or sync getters where possible.
    // For now, we assume critical shaders are already WGSL or converted.

    // Build helper functions string
    const helpers = Object.values(utilityFunctions).map(f => f.wgsl).join('\n')

    const functions = shaderInfo.wgslFunctions.map(t => {
        // Handle case where t.transform might be undefined if t is just the transform itself
        const def = t.transform || t;
        const name = def.name;
        const type = def.type;
        const body = def.wgsl;

        if (!body) return '// missing wgsl for ' + name;

        // Determine implicit arguments and return type based on function type
        let args = [];
        let returnType = 'vec4<f32>';

        if (type === 'src') {
            args.push('_st: vec2<f32>');
            returnType = 'vec4<f32>';
        } else if (type === 'coord') {
            args.push('_st: vec2<f32>');
            returnType = 'vec2<f32>';
        } else if (type === 'color') {
            args.push('_c0: vec4<f32>');
            returnType = 'vec4<f32>';
        } else if (type === 'combine') {
            args.push('_c0: vec4<f32>');
            args.push('_c1: vec4<f32>');
            returnType = 'vec4<f32>';
        } else if (type === 'combineCoord') {
            args.push('_st: vec2<f32>');
            args.push('_c0: vec4<f32>');
            returnType = 'vec2<f32>';
        }

        // Add explicit inputs
        if (def.inputs) {
            def.inputs.forEach(input => {
                let inputType = input.type === 'float' ? 'f32' : input.type;
                if (input.type === 'sampler2D') inputType = 'texture_2d<f32>';
                args.push(`${input.name}: ${inputType}`);
            });
        }

        // Replace global 'time' with 'uniforms.time' in the body
        // Basic regex replacement, might need to be more robust for edge cases but sufficient for standard hydra functions
        // avoiding replacing if it's already uniforms.time or part of another word
        let processedBody = body.replace(/([^a-zA-Z0-9_.])time([^a-zA-Z0-9_])/g, '$1uniforms.time$2');

        return `
fn ${name}(${args.join(', ')}) -> ${returnType} {
${processedBody}
}
`;
    }).join('\n')

    const fragmentBody = `
    ${shaderInfo.fragColor}
    c = c; // Ensure c is used
  `

    return {
        wgsl: {
            header: helpers + '\n' + functions,
            body: fragmentBody
        },
        uniforms: Object.assign({}, this.defaultUniforms, uniforms)
    }
}

export default WgslSource
