
import generateWgsl from './generate-wgsl.js'
import WgslSource from './wgsl-source.js'
import glslFunctions from './glsl/glsl-functions.js'

// This factory handles creating WGSL shaders and wrappers
// It replaces the GLSL-only logic from the original generator-factory
// but maintains the same API for the Hydra runtime
class GeneratorFactory {
  constructor({
    defaultUniforms,
    defaultOutput,
    extendTransforms = [],
    changeListener = (() => { })
  } = {}
  ) {
    this.defaultOutput = defaultOutput
    this.defaultUniforms = defaultUniforms
    this.changeListener = changeListener
    this.extendTransforms = extendTransforms
    this.generators = {}
    this.init()
  }

  init() {
    // We import the functions which now have .wgsl property
    // We can filter/map them if needed to ensure they are WGSL-ready
    const functions = glslFunctions()

    this.wgslTransforms = {}
    this.generators = Object.entries(this.generators).reduce((prev, [method, transform]) => {
      this.changeListener({ type: 'remove', synth: this, method })
      return prev
    }, {})

    this.sourceClass = WgslSource

    // add user definied transforms
    if (Array.isArray(this.extendTransforms)) {
      functions.concat(this.extendTransforms)
    } else if (typeof this.extendTransforms === 'object' && this.extendTransforms.type) {
      functions.push(this.extendTransforms)
    }

    return functions.map((transform) => this.setFunction(transform))
  }

  _addMethod(method, transform) {
    const self = this
    this.wgslTransforms[method] = transform
    if (transform.type === 'src') {
      const func = (...args) => new this.sourceClass({
        name: method,
        transform: transform,
        userArgs: args,
        defaultOutput: this.defaultOutput,
        defaultUniforms: this.defaultUniforms,
        synth: self
      })
      this.generators[method] = func
      this.changeListener({ type: 'add', synth: this, method })
      return func
    } else {
      this.sourceClass.prototype[method] = function (...args) {
        this.transforms.push({ name: method, transform: transform, userArgs: args, synth: self })
        return this
      }
    }
    return undefined
  }

  setFunction(obj) {
    // In WGSL mode, we might not need "processGlsl" type checking as strictly 
    // if we trust the wgsl string, but we should validate or prepare it.
    // For now, pass it through.
    if (obj.wgsl || obj.glsl) {
      this._addMethod(obj.name, obj)
    }
  }
}

export default GeneratorFactory
