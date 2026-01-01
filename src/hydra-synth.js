
import WebGPUOutput from './webgpu-output.js'
import loop from 'raf-loop'
import Source from './hydra-source.js'
import MouseTools from './lib/mouse.js'
import Audio from './lib/audio.js'
import VidRecorder from './lib/video-recorder.js'
import ArrayUtils from './lib/array-utils.js'
import Sandbox from './eval-sandbox.js'
import Generator from './generator-factory.js'
import { preloadNaga } from './shader-transpiler.js'

const Mouse = MouseTools()

/**
 * HydraRenderer - WebGPU-based visual synth
 * Constructor is synchronous for backward compatibility
 * WebGPU initialization happens lazily in background
 */
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
    extendTransforms = {} // add your own functions on init
  } = {}) {

    ArrayUtils.init()

    this.pb = pb
    this.width = width
    this.height = height
    this.renderAll = false
    this.detectAudio = detectAudio

    // WebGPU state
    this._gpuReady = false
    this._gpuInitPromise = null
    this._pendingRenders = []
    this.adapter = null
    this.device = null
    this.gpuContext = null
    this.gpuFormat = null

    this._initCanvas(canvas)

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
    } else {
      let isIOS =
        (/iPad|iPhone|iPod/.test(navigator.platform) ||
          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
        !window.MSStream;
      this.precision = isIOS ? 'highp' : 'mediump'
    }

    this.extendTransforms = extendTransforms

    // boolean to store when to save screenshot
    this.saveFrame = false

    // if stream capture is enabled, this object contains the capture stream
    this.captureStream = null

    this.generator = undefined

    // Start WebGPU initialization in background (non-blocking)
    this._initWebGPU().then(() => {
      this._initOutputs(numOutputs)
      this._initSources(numSources)
      this._generateGlslTransforms()
      this._flushPendingRenders()
    }).catch(err => {
      console.error('[Hydra] WebGPU initialization failed:', err)
    })

    // Preload naga-wasm in background for GLSL transpilation
    preloadNaga()

    this.synth.screencap = () => {
      this.saveFrame = true
    }

    if (enableStreamCapture) {
      try {
        this.captureStream = this.canvas.captureStream(25)
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

  /**
   * Initialize WebGPU - called in background, doesn't block constructor
   */
  async _initWebGPU() {
    if (this._gpuInitPromise) return this._gpuInitPromise

    this._gpuInitPromise = (async () => {
      // Check WebGPU support
      if (!navigator.gpu) {
        throw new Error('WebGPU not supported in this browser')
      }

      console.log('[Hydra] Initializing WebGPU...')

      // Request adapter
      this.adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance'
      })

      if (!this.adapter) {
        throw new Error('Failed to get WebGPU adapter')
      }

      // Request device
      this.device = await this.adapter.requestDevice()

      // Configure canvas context
      this.gpuContext = this.canvas.getContext('webgpu')
      this.gpuFormat = navigator.gpu.getPreferredCanvasFormat()

      this.gpuContext.configure({
        device: this.device,
        format: this.gpuFormat,
        alphaMode: 'premultiplied',
      })

      this._gpuReady = true
      console.log('[Hydra] WebGPU initialized successfully')
      console.log('[Hydra] Adapter:', this.adapter.info || 'info not available')

      return this.device
    })()

    return this._gpuInitPromise
  }

  /**
   * Execute any pending renders that were queued before GPU was ready
   */
  _flushPendingRenders() {
    if (!this._gpuReady) return

    while (this._pendingRenders.length > 0) {
      const pendingFn = this._pendingRenders.shift()
      try {
        pendingFn()
      } catch (e) {
        console.error('[Hydra] Error executing pending render:', e)
      }
    }
  }

  eval(code) {
    this.sandbox.eval(code)
  }

  getScreenImage(callback) {
    this.imageCallback = callback
    this.saveFrame = true
  }

  hush() {
    if (!this._gpuReady) {
      this._pendingRenders.push(() => this.hush())
      return
    }

    this.s.forEach((source) => {
      source.clear()
    })
    this.o.forEach((output) => {
      this.synth.solid(0, 0, 0, 0).out(output)
    })
    this.synth.render(this.o[0])
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

    if (this._gpuReady) {
      // Reconfigure WebGPU context
      this.gpuContext.configure({
        device: this.device,
        format: this.gpuFormat,
        alphaMode: 'premultiplied',
      })

      this.o.forEach((output) => {
        output.resize(width, height)
      })
      this.s.forEach((source) => {
        source.resize(width, height)
      })
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

  _initOutputs(numOutputs) {
    const self = this
    this.o = (Array(numOutputs)).fill().map((el, index) => {
      var o = new WebGPUOutput({
        device: this.device,
        context: this.gpuContext,
        format: this.gpuFormat,
        width: this.width,
        height: this.height,
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
      device: this.device,
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
      defaultUniforms: this.o[0] ? this.o[0].uniforms : {},
      extendTransforms: this.extendTransforms,
      changeListener: ({ type, method, synth }) => {
        if (type === 'add') {
          self.synth[method] = synth.generators[method]
          if (self.sandbox) self.sandbox.add(method)
        } else if (type === 'remove') {
          // what to do here? dangerously deleting window methods
        }
      }
    })
    this.synth.setFunction = this.generator.setFunction.bind(this.generator)
  }

  _render(output) {
    if (!this._gpuReady) {
      this._pendingRenders.push(() => this._render(output))
      return
    }

    if (output) {
      this.output = output
      this.isRenderingAll = false
    } else {
      this.isRenderingAll = true
    }
  }

  // dt in ms
  tick(dt, uniforms) {
    // Skip rendering if WebGPU not ready
    if (!this._gpuReady) {
      return
    }

    try {
      this.sandbox.tick()
      if (this.detectAudio === true) this.synth.a.tick()

      this.sandbox.set('time', this.synth.time += dt * 0.001 * this.synth.speed)
      this.timeSinceLastUpdate += dt

      if (!this.synth.fps || this.timeSinceLastUpdate >= 1000 / this.synth.fps) {
        this.synth.stats.fps = Math.ceil(1000 / this.timeSinceLastUpdate)

        if (this.synth.update) {
          try { this.synth.update(this.timeSinceLastUpdate) } catch (e) { console.log(e) }
        }

        for (let i = 0; i < this.s.length; i++) {
          this.s[i].tick(this.synth.time)
        }

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
          this._renderAll()
        } else {
          this._renderOutput()
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
    }
  }

  /**
   * Render all outputs in a 2x2 grid
   */
  _renderAll() {
    // TODO: Implement WebGPU version of render all
    // For now, just render the first output
    this._renderOutput()
  }

  /**
   * Render single output to screen
   */
  _renderOutput() {
    if (!this.output) return

    this.output.renderToScreen({
      time: this.synth.time,
      resolution: [this.canvas.width, this.canvas.height]
    })
  }

  /**
   * Wait for WebGPU to be ready
   * @returns {Promise} Resolves when WebGPU is initialized
   */
  async ready() {
    return this._gpuInitPromise
  }
}

export default HydraRenderer
