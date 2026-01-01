
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
        // transform.transform.wgsl should be present
        return t.transform.wgsl || '// missing wgsl for ' + t.name
    }).join('\n')

    const fragmentBody = `
    ${helpers}
    ${functions}
    
    ${shaderInfo.fragColor}
    c = c; // Ensure c is used
  `

    return {
        wgslCode: fragmentBody,
        uniforms: Object.assign({}, this.defaultUniforms, uniforms)
    }
}

export default WgslSource
