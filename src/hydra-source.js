import Webcam from './lib/webcam.js'
import Screen from './lib/screenmedia.js'

/**
 * HydraSource - WebGPU texture source for external media (video, image, webcam)
 */
class HydraSource {
  constructor({ device, width, height, pb, label = "" }) {
    this.label = label
    this.device = device
    this.src = null
    this.dynamic = true
    this.width = width
    this.height = height
    this.pb = pb

    // Create initial 1x1 WebGPU texture
    this.tex = this._createTexture(1, 1)
  }

  _createTexture(width, height) {
    if (!this.device) {
      console.warn('[HydraSource] Device not available, texture creation deferred')
      return null
    }

    return this.device.createTexture({
      size: { width, height },
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT
    })
  }

  _updateTexture(source, params = {}) {
    if (!this.device || !source) return

    // Get source dimensions
    const width = source.videoWidth || source.width || this.width
    const height = source.videoHeight || source.height || this.height

    // Resize texture if needed
    if (!this.tex || this.tex.width !== width || this.tex.height !== height) {
      if (this.tex) this.tex.destroy()
      this.tex = this._createTexture(width, height)
    }

    // Copy image data to texture
    if (source instanceof HTMLVideoElement ||
      source instanceof HTMLCanvasElement ||
      source instanceof ImageBitmap ||
      source instanceof HTMLImageElement) {
      this.device.queue.copyExternalImageToTexture(
        { source: source, flipY: params.flipY || false },
        { texture: this.tex },
        { width, height }
      )
    }
  }

  init(opts, params) {
    if ('src' in opts) {
      this.src = opts.src
      this._updateTexture(this.src, params)
    }
    if ('dynamic' in opts) this.dynamic = opts.dynamic
  }

  initCam(index, params) {
    const self = this
    Webcam(index)
      .then(response => {
        self.src = response.video
        self.dynamic = true
        self._updateTexture(self.src, params)
      })
      .catch(err => console.log('could not get camera', err))
  }

  initVideo(url = '', params) {
    const vid = document.createElement('video')
    vid.crossOrigin = 'anonymous'
    vid.autoplay = true
    vid.loop = true
    vid.muted = true // mute in order to load without user interaction

    vid.addEventListener('loadeddata', () => {
      this.src = vid
      vid.play()
      this._updateTexture(this.src, params)
      this.dynamic = true
    })
    vid.src = url
  }

  initImage(url = '', params) {
    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    img.src = url
    img.onload = () => {
      this.src = img
      this.dynamic = false
      this._updateTexture(this.src, params)
    }
  }

  initStream(streamName, params) {
    let self = this
    if (streamName && this.pb) {
      this.pb.initSource(streamName)

      this.pb.on('got video', function (nick, video) {
        if (nick === streamName) {
          self.src = video
          self.dynamic = true
          self._updateTexture(self.src, params)
        }
      })
    }
  }

  // index only relevant in atom-hydra + desktop apps
  initScreen(index = 0, params) {
    const self = this
    Screen()
      .then(function (response) {
        self.src = response.video
        self._updateTexture(self.src, params)
        self.dynamic = true
      })
      .catch(err => console.log('could not get screen', err))
  }

  // cache for the canvases, so we don't create them every time
  canvases = {}

  // Creates a canvas and returns the 2d context
  initCanvas(width = 1000, height = 1000) {
    if (this.canvases[this.label] == undefined) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext('2d')
      if (ctx != null)
        this.canvases[this.label] = ctx
    }

    const ctx = this.canvases[this.label]
    const canvas = ctx.canvas
    if (canvas.width !== width && canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    } else {
      ctx.clearRect(0, 0, width, height)
    }
    this.init({ src: canvas })

    this.dynamic = true
    return ctx
  }

  resize(width, height) {
    this.width = width
    this.height = height
  }

  clear() {
    if (this.src && this.src.srcObject) {
      if (this.src.srcObject.getTracks) {
        this.src.srcObject.getTracks().forEach(track => track.stop())
      }
    }
    this.src = null
    if (this.tex) {
      this.tex.destroy()
      this.tex = this._createTexture(1, 1)
    }
  }

  tick(time) {
    if (this.src && this.dynamic === true && this.device) {
      this._updateTexture(this.src)
    }
  }

  getTexture() {
    return this.tex
  }
}

export default HydraSource
