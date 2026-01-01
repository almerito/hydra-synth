import generateGlsl from './generate-glsl.js'
// const formatArguments = require('./glsl-utils.js').formatArguments

// const glslTransforms = require('./glsl/composable-glsl-functions.js')
import utilityGlsl from './shaders/utility-functions.js'

var GlslSource = function (obj) {
  this.transforms = []
  this.transforms.push(obj)
  this.defaultOutput = obj.defaultOutput
  this.synth = obj.synth
  this.engine = obj.engine || (obj.defaultOutput && obj.defaultOutput.engine) // get engine from obj or output
  this.type = 'GlslSource'
  this.defaultUniforms = obj.defaultUniforms
  return this
}

GlslSource.prototype.addTransform = function (obj) {
  this.transforms.push(obj)
}

GlslSource.prototype.out = function (_output) {
  var output = _output || this.defaultOutput

  // output.renderPasses(glsl)
  if (output) try {
    var glsl = this.glsl(output)
    this.synth.currentFunctions = []
    output.render(glsl)
  } catch (error) {
    console.warn('shader could not compile', error)
  }
}

GlslSource.prototype.glsl = function () {
  var self = this
  var passes = []
  var transforms = []

  this.transforms.forEach((transform) => {
    if (transform.transform.type === 'renderpass') {
      console.warn('no support for renderpass')
    } else {
      transforms.push(transform)
    }
  })

  if (transforms.length > 0) passes.push(this.compile(transforms))

  return passes
}

GlslSource.prototype.compile = function (transforms) {
  var shaderInfo
  if (this.engine && this.engine.generateShader) {
    shaderInfo = this.engine.generateShader(transforms)
  } else {
    shaderInfo = generateGlsl(transforms, this.synth)
  }
  var uniforms = {}
  shaderInfo.uniforms.forEach((uniform) => { uniforms[uniform.name] = uniform.value })

  // If engine provides compileShader, use it for engine-specific shader generation
  if (this.engine && this.engine.compileShader) {
    return this.engine.compileShader({
      shaderInfo: shaderInfo,
      defaultUniforms: this.defaultUniforms
    })
  }

  // Default GLSL1 compilation (backward compatibility)
  var utilFunctions = this.engine && this.engine.getUtilityFunctions
    ? this.engine.getUtilityFunctions()
    : utilityGlsl

  var frag = `
  precision ${this.defaultOutput.precision} float;
  ${Object.values(shaderInfo.uniforms).map((uniform) => {
    let type = uniform.type
    switch (uniform.type) {
      case 'texture':
        type = 'sampler2D'
        break
    }
    return `
      uniform ${type} ${uniform.name};`
  }).join('')}
  uniform float time;
  uniform vec2 resolution;
  varying vec2 uv;
  uniform sampler2D prevBuffer;

  ${Object.values(utilFunctions).map((transform) => {
    return `
            ${transform.glsl}
          `
  }).join('')}

  ${shaderInfo.glslFunctions.map((transform) => {
    return `
            ${transform.transform.glsl}
          `
  }).join('')}

  void main () {
    vec2 st = gl_FragCoord.xy/resolution.xy;

    ${shaderInfo.fragColor}
    gl_FragColor = c;
  }
  `

  return {
    frag: frag,
    uniforms: Object.assign({}, this.defaultUniforms, uniforms)
  }

}

export default GlslSource

