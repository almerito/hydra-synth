import Webcam from './lib/webcam.js'
import Screen from './lib/screenmedia.js'

class HydraSource {
  constructor({ engine, regl, width, height, pb, label = "" }) {
    this.label = label
    this.engine = engine
    this.regl = regl || (engine && engine.regl) // backward compatibility
    this.src = null
    this.dynamic = true
    this.width = width
    this.height = height
    this.tex = this._createTexture({ shape: [1, 1] })
    this.pb = pb
  }

  // Helper method to create textures using engine or regl
  _createTexture(options) {
    if (this.engine && this.engine.createTexture) {
      return this.engine.createTexture(options)
    }
    return this.regl.texture(options)
  }

  init(opts, params) {
    if ('src' in opts) {
      this.src = opts.src
      this.tex = this._createTexture({ data: this.src, ...params })
    }
    if ('dynamic' in opts) this.dynamic = opts.dynamic
  }

  initCam(index, params) {
    const self = this
    Webcam(index)
      .then(response => {
        self.src = response.video
        self.dynamic = true
        self.tex = self._createTexture({ data: self.src, ...params })
      })
      .catch(err => console.log('could not get camera', err))
  }

  initVideo(url = '', params) {
    const vid = document.createElement('video')
    vid.crossOrigin = 'anonymous'
    vid.autoplay = true
    vid.loop = true
    vid.muted = true
    const onload = vid.addEventListener('loadeddata', () => {
      this.src = vid
      vid.play()
      this.tex = this._createTexture({ data: this.src, ...params })
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
      this.tex = this._createTexture({ data: this.src, ...params })
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
          self.tex = self._createTexture({ data: self.src, ...params })
        }
      })
    }
  }

  initScreen(index = 0, params) {
    const self = this
    Screen()
      .then(function (response) {
        self.src = response.video
        self.tex = self._createTexture({ data: self.src, ...params })
        self.dynamic = true
      })
      .catch(err => console.log('could not get screen', err))
  }

  canvases = {}

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
    this.tex = this._createTexture({ shape: [1, 1] })
  }

  tick(time) {
    if (this.src && this.dynamic === true) {
      if (this.src.videoWidth && this.src.videoWidth !== this.tex.width) {
        console.log(
          this.src.videoWidth,
          this.src.videoHeight,
          this.tex.width,
          this.tex.height
        )
        this.tex.resize(this.src.videoWidth, this.src.videoHeight)
      }

      if (this.src.width && this.src.width !== this.tex.width) {
        this.tex.resize(this.src.width, this.src.height)
      }

      this.tex.subimage(this.src)
    }
  }

  getTexture() {
    return this.tex
  }
}

export default HydraSource

