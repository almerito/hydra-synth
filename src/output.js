//const transforms = require('./glsl-transforms.js')

var Output = function ({ engine, regl, precision, label = "", width, height }) {
  // Support both engine abstraction and direct regl reference
  this.engine = engine
  this.regl = regl || (engine && engine.regl) // backward compatibility
  this.precision = precision
  this.label = label
  this.width = width
  this.height = height

  // Create position buffer using engine or regl
  if (this.engine && this.engine.createBuffer) {
    this.positionBuffer = this.engine.createBuffer([
      [-2, 0],
      [0, -2],
      [2, 2]
    ])
  } else {
    this.positionBuffer = this.regl.buffer([
      [-2, 0],
      [0, -2],
      [2, 2]
    ])
  }

  this.draw = () => { }
  this.init()
  this.pingPongIndex = 0

  // Create framebuffers for pingponging using engine or regl
  if (this.engine && this.engine.createFramebuffer) {
    this.fbos = (Array(2)).fill().map(() => this.engine.createFramebuffer({
      width: width,
      height: height
    }))
  } else {
    this.fbos = (Array(2)).fill().map(() => this.regl.framebuffer({
      color: this.regl.texture({
        mag: 'nearest',
        width: width,
        height: height,
        format: 'rgba'
      }),
      depthStencil: false
    }))
  }
}

Output.prototype.resize = function (width, height) {
  this.width = width
  this.height = height
  this.fbos.forEach((fbo) => {
    fbo.resize(width, height)
  })
}


Output.prototype.getCurrent = function () {
  return this.fbos[this.pingPongIndex]
}

Output.prototype.getTexture = function () {
  var index = this.pingPongIndex ? 0 : 1
  return this.fbos[index]
}

Output.prototype.init = function () {
  this.transformIndex = 0

  // Get vertex shader from engine if available
  if (this.engine && this.engine.getDefaultVertexShader) {
    this.vert = this.engine.getDefaultVertexShader()
  } else {
    this.vert = `
  precision ${this.precision} float;
  attribute vec2 position;
  varying vec2 uv;

  void main () {
    uv = position;
    gl_Position = vec4(2.0 * position - 1.0, 0, 1);
  }`
  }

  this.attributes = {
    position: this.positionBuffer
  }

  // Create uniform accessors using engine or regl
  if (this.engine && this.engine.prop) {
    this.uniforms = {
      time: this.engine.prop('time'),
      resolution: this.engine.prop('resolution')
    }
  } else {
    this.uniforms = {
      time: this.regl.prop('time'),
      resolution: this.regl.prop('resolution')
    }
  }

  return this
}


Output.prototype.render = function (passes) {
  let pass = passes[0]
  var self = this
  var uniforms = Object.assign(pass.uniforms, {
    prevBuffer: () => {
      return self.fbos[self.pingPongIndex]
    }
  })

  // Create draw command using engine or regl
  if (this.engine && this.engine.createDrawCommand) {
    self.draw = self.engine.createDrawCommand({
      frag: pass.frag,
      vert: self.vert,
      attributes: self.attributes,
      uniforms: uniforms,
      count: 3,
      framebuffer: () => {
        self.pingPongIndex = self.pingPongIndex ? 0 : 1
        return self.fbos[self.pingPongIndex]
      }
    })
  } else {
    self.draw = self.regl({
      frag: pass.frag,
      vert: self.vert,
      attributes: self.attributes,
      uniforms: uniforms,
      count: 3,
      framebuffer: () => {
        self.pingPongIndex = self.pingPongIndex ? 0 : 1
        return self.fbos[self.pingPongIndex]
      }
    })
  }
}


Output.prototype.tick = function (props) {
  this.draw(props)
}

export default Output

