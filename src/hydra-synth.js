
import Output from './output.js'
import loop from 'raf-loop'
import Source from './hydra-source.js'
import MouseTools from './lib/mouse.js'
import Audio from './lib/audio.js'
import VidRecorder from './lib/video-recorder.js'
import ArrayUtils from './lib/array-utils.js'
// import strudel from './lib/strudel.js'
import Sandbox from './eval-sandbox.js'
import Generator from './generator-factory.js'
import { createEngine, ReglEngine, WebGL2Engine } from './engines/index.js'
// const window = global.window



const Mouse = MouseTools()
// to do: add ability to pass in certain uniforms and transforms
class HydraRenderer {

  constructor({
    pb = null,
    width = 1280,
    height = 720,
    numSources = 4,
    numOutputs = 4,
    makeGlobal = true,
    autoLoop = true,
    detectAudio = true,
    enableStreamCapture = true,
    canvas,
    precision,
    engine = 'glsl1', // 'glsl1' | 'glsl3' | 'webgl1' | 'webgl2' | ReglEngine | WebGL2Engine | custom engine class
    extendTransforms = {} // add your own functions on init
  } = {}) {

    ArrayUtils.init()

    this.pb = pb

    this.width = width
    this.height = height
    this.renderAll = false
    this.detectAudio = detectAudio

    this._initCanvas(canvas)

    //global.window.test = 'hi'
    // object that contains all properties that will be made available on the global context and during local evaluation
    this.synth = {
      time: 0,
      bpm: 30,
      width: this.width,
      height: this.height,
      fps: undefined,
      stats: {
        fps: 0
      },
      speed: 1,
      mouse: Mouse,
      render: this._render.bind(this),
      setResolution: this.setResolution.bind(this),
      update: (dt) => { },// user defined update function
      afterUpdate: (dt) => { },// user defined function run after update
      hush: this.hush.bind(this),
      tick: this.tick.bind(this)
    }

    if (makeGlobal) window.loadScript = this.loadScript


    this.timeSinceLastUpdate = 0
    this._time = 0 // for internal use, only to use for deciding when to render frames

    // only allow valid precision options
    let precisionOptions = ['lowp', 'mediump', 'highp']
    if (precision && precisionOptions.includes(precision.toLowerCase())) {
      this.precision = precision.toLowerCase()
      //
      // if(!precisionValid){
      //   console.warn('[hydra-synth warning]\nConstructor was provided an invalid floating point precision value of "' + precision + '". Using default value of "mediump" instead.')
      // }
    } else {
      let isIOS =
        (/iPad|iPhone|iPod/.test(navigator.platform) ||
          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
        !window.MSStream;
      this.precision = isIOS ? 'highp' : 'mediump'
    }



    this.extendTransforms = extendTransforms
    this.engineOption = engine // Store the engine option

    // boolean to store when to save screenshot
    this.saveFrame = false

    // if stream capture is enabled, this object contains the capture stream
    this.captureStream = null

    this.generator = undefined

    // Initialize engine (async for WebGPU support)
    this.engineReady = this._initEngine().then(() => {
      this._initOutputs(numOutputs)
      this._initSources(numSources)
      this._generateGlslTransforms()
    }).catch(e => {
      console.error('[hydra-synth] Engine initialization failed:', e)
    })

    this.synth.screencap = () => {
      this.saveFrame = true
    }

    if (enableStreamCapture) {
      try {
        this.captureStream = this.canvas.captureStream(25)
        // to do: enable capture stream of specific sources and outputs
        this.synth.vidRecorder = new VidRecorder(this.captureStream)
      } catch (e) {
        console.warn('[hydra-synth warning]\nnew MediaSource() is not currently supported on iOS.')
        console.error(e)
      }
    }

    if (detectAudio) this._initAudio()

    if (autoLoop) loop(this.tick.bind(this)).start()

    // final argument is properties that the user can set, all others are treated as read-only
    this.sandbox = new Sandbox(this.synth, makeGlobal, ['speed', 'update', 'afterUpdate', 'bpm', 'fps'])
  }

  eval(code) {
    this.sandbox.eval(code)
  }

  getScreenImage(callback) {
    this.imageCallback = callback
    this.saveFrame = true
  }

  hush() {
    this.s.forEach((source) => {
      source.clear()
    })
    this.o.forEach((output) => {
      this.synth.solid(0, 0, 0, 0).out(output)
    })
    this.synth.render(this.o[0])
    // this.synth.update = (dt) => {}
    this.sandbox.set('update', (dt) => { })
    this.sandbox.set('afterUpdate', (dt) => { })
  }

  loadScript(url = "") {
    const p = new Promise((res, rej) => {
      var script = document.createElement("script");
      script.onload = function () {
        console.log(`loaded script ${url}`);
        res();
      };
      script.onerror = (err) => {
        console.log(`error loading script ${url}`, "log-error");
        res()
      };
      script.src = url;
      document.head.appendChild(script);
    });
    return p;
  }

  setResolution(width, height) {
    this.canvas.width = width
    this.canvas.height = height
    this.width = width
    this.height = height
    this.sandbox.set('width', width)
    this.sandbox.set('height', height)
    this.o.forEach((output) => {
      output.resize(width, height)
    })
    this.s.forEach((source) => {
      source.resize(width, height)
    })
    // Use engine refresh if available, fallback to regl._refresh for backward compat
    if (this.engine && this.engine.refresh) {
      this.engine.refresh()
    } else if (this.regl) {
      this.regl._refresh()
    }
  }

  canvasToImage(callback) {
    const a = document.createElement('a')
    a.style.display = 'none'

    let d = new Date()
    a.download = `hydra-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}.png`
    document.body.appendChild(a)
    var self = this
    this.canvas.toBlob((blob) => {
      if (self.imageCallback) {
        self.imageCallback(blob)
        delete self.imageCallback
      } else {
        a.href = URL.createObjectURL(blob)
        console.log(a.href)
        a.click()
      }
    }, 'image/png')
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    }, 300);
  }

  _initAudio() {
    const that = this
    this.synth.a = new Audio({
      numBins: 4,
      parentEl: this.canvas.parentNode
      // changeListener: ({audio}) => {
      //   that.a = audio.bins.map((_, index) =>
      //     (scale = 1, offset = 0) => () => (audio.fft[index] * scale + offset)
      //   )
      //
      //   if (that.makeGlobal) {
      //     that.a.forEach((a, index) => {
      //       const aname = `a${index}`
      //       window[aname] = a
      //     })
      //   }
      // }
    })
  }

  // create main output canvas and add to screen
  _initCanvas(canvas) {
    if (canvas) {
      this.canvas = canvas
      this.width = canvas.width
      this.height = canvas.height
    } else {
      this.canvas = document.createElement('canvas')
      this.canvas.width = this.width
      this.canvas.height = this.height
      this.canvas.style.width = '100%'
      this.canvas.style.height = '100%'
      this.canvas.style.imageRendering = 'pixelated'
      document.body.appendChild(this.canvas)
    }
  }

  async _initEngine() {
    // Create engine instance from string identifier, class, or instance
    this.engine = createEngine(this.engineOption, {
      canvas: this.canvas,
      width: this.width,
      height: this.height,
      precision: this.precision
    })

    // Initialize the engine (await for async engines like WebGPU)
    await this.engine.init()

    // For backward compatibility, expose regl if using ReglEngine
    if (this.engine.regl) {
      this.regl = this.engine.regl
    }

    // Store shader language info
    this.shaderLanguage = this.engine.getShaderLanguage()

    // Create render commands using the engine
    this.renderAll = this.engine.createDrawCommand({
      frag: this.engine.getRenderAllShader(),
      vert: this.engine.getDefaultVertexShader(),
      attributes: {
        position: [
          [-2, 0],
          [0, -2],
          [2, 2]
        ]
      },
      uniforms: {
        tex0: this.engine.prop('tex0'),
        tex1: this.engine.prop('tex1'),
        tex2: this.engine.prop('tex2'),
        tex3: this.engine.prop('tex3')
      },
      count: 3,
      depth: { enable: false }
    })

    this.renderFbo = this.engine.createDrawCommand({
      frag: this.engine.getRenderFboShader(),
      vert: this.engine.getDefaultVertexShader(),
      attributes: {
        position: [
          [-2, 0],
          [0, -2],
          [2, 2]
        ]
      },
      uniforms: {
        tex0: this.engine.prop('tex0'),
        resolution: this.engine.prop('resolution')
      },
      count: 3,
      depth: { enable: false }
    })
  }

  _initOutputs(numOutputs) {
    const self = this
    this.o = (Array(numOutputs)).fill().map((el, index) => {
      var o = new Output({
        engine: this.engine,
        regl: this.regl, // backward compatibility
        width: this.width,
        height: this.height,
        precision: this.precision,
        label: `o${index}`
      })
      o.id = index
      self.synth['o' + index] = o
      return o
    })

    // set default output
    this.output = this.o[0]
  }

  _initSources(numSources) {
    this.s = []
    for (var i = 0; i < numSources; i++) {
      this.createSource(i)
    }
  }

  createSource(i) {
    let s = new Source({
      engine: this.engine,
      regl: this.regl, // backward compatibility
      pb: this.pb,
      width: this.width,
      height: this.height,
      label: `s${i}`
    })
    this.synth['s' + this.s.length] = s
    this.s.push(s)
    return s
  }

  _generateGlslTransforms() {
    var self = this
    this.generator = new Generator({
      defaultOutput: this.o[0],
      defaultUniforms: this.o[0].uniforms,
      extendTransforms: this.extendTransforms,
      engine: this.engine, // pass engine to generator
      changeListener: ({ type, method, synth }) => {
        if (type === 'add') {
          self.synth[method] = synth.generators[method]
          if (self.sandbox) self.sandbox.add(method)
        } else if (type === 'remove') {
          // what to do here? dangerously deleting window methods
          //delete window[method]
        }
        //  }
      }
    })
    this.synth.setFunction = this.generator.setFunction.bind(this.generator)
  }

  _render(output) {
    if (output) {
      this.output = output
      this.isRenderingAll = false
    } else {
      this.isRenderingAll = true
    }
  }

  // dt in ms
  tick(dt, uniforms) {
    try {
      this.sandbox.tick()
      if (this.detectAudio === true) this.synth.a.tick()
      //  let updateInterval = 1000/this.synth.fps // ms
      this.sandbox.set('time', this.synth.time += dt * 0.001 * this.synth.speed)
      this.timeSinceLastUpdate += dt
      if (!this.synth.fps || this.timeSinceLastUpdate >= 1000 / this.synth.fps) {
        //  console.log(1000/this.timeSinceLastUpdate)
        this.synth.stats.fps = Math.ceil(1000 / this.timeSinceLastUpdate)
        if (this.synth.update) {
          try { this.synth.update(this.timeSinceLastUpdate) } catch (e) { console.log(e) }
        }
        //  console.log(this.synth.speed, this.synth.time)
        for (let i = 0; i < this.s.length; i++) {
          this.s[i].tick(this.synth.time)
        }
        //  console.log(this.canvas.width, this.canvas.height)
        const currentTime = this.synth.time;
        for (let i = 0; i < this.o.length; i++) {
          this.o[i].tick({
            time: currentTime,
            mouse: this.synth.mouse,
            bpm: this.synth.bpm,
            resolution: [this.canvas.width, this.canvas.height]
          })
        }
        if (this.isRenderingAll) {
          this.renderAll({
            tex0: this.o[0].getCurrent(),
            tex1: this.o[1].getCurrent(),
            tex2: this.o[2].getCurrent(),
            tex3: this.o[3].getCurrent(),
            resolution: [this.canvas.width, this.canvas.height]
          })
        } else {

          this.renderFbo({
            tex0: this.output.getCurrent(),
            resolution: [this.canvas.width, this.canvas.height]
          })
        }
        if (this.synth.afterUpdate) {
          try { this.synth.afterUpdate(this.timeSinceLastUpdate) } catch (e) { console.log(e) }
        }
        this.timeSinceLastUpdate = 0
      }
      if (this.saveFrame === true) {
        this.canvasToImage()
        this.saveFrame = false
      }
    } catch (e) {
      console.warn('Error during tick():', e)
      //  this.regl.poll()
    }
  }


}

export default HydraRenderer
