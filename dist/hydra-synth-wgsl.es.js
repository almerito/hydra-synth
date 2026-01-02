var Ae = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports);
var mt = Ae((dt, Ee) => {
  class Re {
    constructor({ device: e, context: r, format: n, label: o = "", width: i, height: h }) {
      this.device = e, this.context = r, this.format = n, this.label = o, this.width = i, this.height = h, this.pingPongIndex = 0, this.fbos = [], this.pipeline = null, this.bindGroup = null, this.uniformBuffer = null, this.vertexBuffer = null, this.sampler = null, this.device && this.initDevice(this.device, this.context, this.format);
    }
    setDevice(e, r, n) {
      this.device = e, this.context = r, this.format = n || this.format, this.initDevice(e, r, this.format);
    }
    initDevice(e, r, n) {
      this.fbos = [
        this._createFramebuffer(),
        this._createFramebuffer()
      ], this.vertexBuffer = this._createVertexBuffer(), this.sampler = e.createSampler({
        magFilter: "nearest",
        minFilter: "nearest"
      }), this.init();
    }
    _createFramebuffer() {
      return this.device ? this.device.createTexture({
        size: { width: this.width, height: this.height },
        format: this.format,
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
      }) : null;
    }
    _createVertexBuffer() {
      if (!this.device) return null;
      const e = new Float32Array([
        -1,
        -1,
        3,
        -1,
        -1,
        3
      ]), r = this.device.createBuffer({
        size: e.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: !0
      });
      return new Float32Array(r.getMappedRange()).set(e), r.unmap(), r;
    }
    init() {
      this.device && (this.uniformBuffer = this.device.createBuffer({
        size: 16,
        // vec2 resolution + float time + padding
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      }));
    }
    resize(e, r) {
      this.width = e, this.height = r, !(!this.device || this.fbos.length === 0) && (this.fbos.forEach((n) => n && n.destroy()), this.fbos = [
        this._createFramebuffer(),
        this._createFramebuffer()
      ]);
    }
    getCurrent() {
      return this.fbos.length === 0 ? null : this.fbos[this.pingPongIndex];
    }
    getTexture() {
      if (this.fbos.length === 0) return null;
      const e = this.pingPongIndex ? 0 : 1;
      return this.fbos[e];
    }
    getPrevBuffer() {
      return this.fbos.length === 0 ? null : this.fbos[this.pingPongIndex];
    }
    /**
     * Compile and set up a render pipeline from WGSL shader code
     * @param {object} pass - Render pass with shader code and uniforms
     */
    async render(e) {
      if (!this.device) return;
      const { wgsl: r, uniforms: n = {}, textureUniforms: o = [] } = e;
      this.textureUniforms = o, this.scalarUniforms = n;
      let i = "", h = "";
      typeof r == "object" ? (i = r.header || "", h = r.body || "") : h = r || "";
      let f = "";
      o.forEach((z, $) => {
        const w = 3 + $;
        f += `@group(0) @binding(${w}) var ${z.name}: texture_2d<f32>;
`;
      });
      const d = Object.keys(n).filter((z) => z !== "time" && z !== "resolution"), m = 16, E = d.length * 4, g = Math.ceil((m + E) / 16) * 16;
      (!this.uniformBuffer || this.uniformBufferSize !== g) && (this.uniformBuffer && this.uniformBuffer.destroy(), this.uniformBuffer = this.device.createBuffer({
        size: g,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      }), this.uniformBufferSize = g), this.scalarUniformNames = d;
      const b = this.device.createShaderModule({
        code: this._buildFullShader(i, h, f, d)
      }), T = [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: { type: "uniform" }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: { type: "filtering" }
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float" }
        }
      ];
      o.forEach((z, $) => {
        T.push({
          binding: 3 + $,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float" }
        });
      });
      const _ = this.device.createBindGroupLayout({
        entries: T
      }), F = this.device.createPipelineLayout({
        bindGroupLayouts: [_]
      });
      this.pipeline = this.device.createRenderPipeline({
        layout: F,
        vertex: {
          module: b,
          entryPoint: "vs_main",
          buffers: [{
            arrayStride: 8,
            attributes: [{
              format: "float32x2",
              offset: 0,
              shaderLocation: 0
            }]
          }]
        },
        fragment: {
          module: b,
          entryPoint: "fs_main",
          targets: [{ format: this.format }]
        },
        primitive: {
          topology: "triangle-list"
        }
      });
    }
    _buildFullShader(e, r, n = "", o = []) {
      return `
// Uniforms
struct Uniforms {
  resolution: vec2<f32>,
  time: f32,
  _padding: f32,
${o.map((h) => `  ${h}: f32,`).join(`
`)}
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var texSampler: sampler;
@group(0) @binding(2) var prevBuffer: texture_2d<f32>;

// Dynamic texture bindings
${n}

// Vertex shader
struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@vertex
fn vs_main(@location(0) pos: vec2<f32>) -> VertexOutput {
  var output: VertexOutput;
  output.position = vec4<f32>(pos, 0.0, 1.0);
  output.uv = (pos + 1.0) * 0.5;
  return output;
}

// Fragment shader Helper Functions
${e}

// Main Fragment Shader
@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
  let time = uniforms.time;
  let resolution = uniforms.resolution;
  var _st = input.uv;
  var c = vec4<f32>(0.0, 0.0, 0.0, 0.0);
  
  ${r}
  
  return c;
}
`;
    }
    /**
     * Execute a render pass with current pipeline
     * @param {object} props - Render properties (time, resolution)
     */
    tick(e) {
      if (!this.pipeline) return;
      const r = [
        e.resolution[0],
        e.resolution[1],
        e.time,
        0
        // padding
      ];
      for (this.scalarUniformNames && this.scalarUniforms && this.scalarUniformNames.forEach((E) => {
        const g = this.scalarUniforms[E], b = typeof g == "function" ? g(null, e, 0) : g;
        r.push(typeof b == "number" ? b : 0);
      }); r.length * 4 < (this.uniformBufferSize || 16); )
        r.push(0);
      const n = new Float32Array(r);
      this.device.queue.writeBuffer(this.uniformBuffer, 0, n);
      const o = this.fbos[this.pingPongIndex];
      this.pingPongIndex = this.pingPongIndex ? 0 : 1;
      const i = this.fbos[this.pingPongIndex], h = [
        { binding: 0, resource: { buffer: this.uniformBuffer } },
        { binding: 1, resource: this.sampler },
        { binding: 2, resource: o.createView() }
      ];
      this.textureUniforms && this.textureUniforms.forEach((E, g) => {
        const b = E.value();
        b && b.createView && h.push({
          binding: 3 + g,
          resource: b.createView()
        });
      });
      const f = this.device.createBindGroup({
        layout: this.pipeline.getBindGroupLayout(0),
        entries: h
      }), d = this.device.createCommandEncoder(), m = d.beginRenderPass({
        colorAttachments: [{
          view: i.createView(),
          loadOp: "clear",
          storeOp: "store",
          clearValue: { r: 0, g: 0, b: 0, a: 1 }
        }]
      });
      m.setPipeline(this.pipeline), m.setBindGroup(0, f), m.setVertexBuffer(0, this.vertexBuffer), m.draw(3), m.end(), this.device.queue.submit([d.finish()]);
    }
    /**
     * Render to the screen (final pass)
     * @param {object} props - Render properties
     */
    renderToScreen(e) {
      if (!this.pipeline) return;
      const r = this.fbos[this.pingPongIndex], n = [
        { binding: 0, resource: { buffer: this.uniformBuffer } },
        { binding: 1, resource: this.sampler },
        { binding: 2, resource: r.createView() }
      ];
      this.textureUniforms && this.textureUniforms.forEach((f, d) => {
        const m = f.value();
        m && m.createView && n.push({
          binding: 3 + d,
          resource: m.createView()
        });
      });
      const o = this.device.createBindGroup({
        layout: this.pipeline.getBindGroupLayout(0),
        entries: n
      }), i = this.device.createCommandEncoder(), h = i.beginRenderPass({
        colorAttachments: [{
          view: this.context.getCurrentTexture().createView(),
          loadOp: "clear",
          storeOp: "store",
          clearValue: { r: 0, g: 0, b: 0, a: 1 }
        }]
      });
      h.setPipeline(this.pipeline), h.setBindGroup(0, o), h.setVertexBuffer(0, this.vertexBuffer), h.draw(3), h.end(), this.device.queue.submit([i.finish()]);
    }
    destroy() {
      this.fbos.forEach((e) => e.destroy()), this.vertexBuffer.destroy(), this.uniformBuffer.destroy();
    }
  }
  var he = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
  function we(t) {
    return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
  }
  var H = { exports: {} }, de;
  function ze() {
    return de || (de = 1, typeof Object.create == "function" ? H.exports = function(e, r) {
      r && (e.super_ = r, e.prototype = Object.create(r.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }));
    } : H.exports = function(e, r) {
      if (r) {
        e.super_ = r;
        var n = function() {
        };
        n.prototype = r.prototype, e.prototype = new n(), e.prototype.constructor = e;
      }
    }), H.exports;
  }
  var ie, ve;
  function Fe() {
    if (ve) return ie;
    ve = 1;
    function t() {
      this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0;
    }
    ie = t, t.EventEmitter = t, t.prototype._events = void 0, t.prototype._maxListeners = void 0, t.defaultMaxListeners = 10, t.prototype.setMaxListeners = function(i) {
      if (!r(i) || i < 0 || isNaN(i))
        throw TypeError("n must be a positive number");
      return this._maxListeners = i, this;
    }, t.prototype.emit = function(i) {
      var h, f, d, m, E, g;
      if (this._events || (this._events = {}), i === "error" && (!this._events.error || n(this._events.error) && !this._events.error.length)) {
        if (h = arguments[1], h instanceof Error)
          throw h;
        var b = new Error('Uncaught, unspecified "error" event. (' + h + ")");
        throw b.context = h, b;
      }
      if (f = this._events[i], o(f))
        return !1;
      if (e(f))
        switch (arguments.length) {
          // fast cases
          case 1:
            f.call(this);
            break;
          case 2:
            f.call(this, arguments[1]);
            break;
          case 3:
            f.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            m = Array.prototype.slice.call(arguments, 1), f.apply(this, m);
        }
      else if (n(f))
        for (m = Array.prototype.slice.call(arguments, 1), g = f.slice(), d = g.length, E = 0; E < d; E++)
          g[E].apply(this, m);
      return !0;
    }, t.prototype.addListener = function(i, h) {
      var f;
      if (!e(h))
        throw TypeError("listener must be a function");
      return this._events || (this._events = {}), this._events.newListener && this.emit(
        "newListener",
        i,
        e(h.listener) ? h.listener : h
      ), this._events[i] ? n(this._events[i]) ? this._events[i].push(h) : this._events[i] = [this._events[i], h] : this._events[i] = h, n(this._events[i]) && !this._events[i].warned && (o(this._maxListeners) ? f = t.defaultMaxListeners : f = this._maxListeners, f && f > 0 && this._events[i].length > f && (this._events[i].warned = !0, console.error(
        "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
        this._events[i].length
      ), typeof console.trace == "function" && console.trace())), this;
    }, t.prototype.on = t.prototype.addListener, t.prototype.once = function(i, h) {
      if (!e(h))
        throw TypeError("listener must be a function");
      var f = !1;
      function d() {
        this.removeListener(i, d), f || (f = !0, h.apply(this, arguments));
      }
      return d.listener = h, this.on(i, d), this;
    }, t.prototype.removeListener = function(i, h) {
      var f, d, m, E;
      if (!e(h))
        throw TypeError("listener must be a function");
      if (!this._events || !this._events[i])
        return this;
      if (f = this._events[i], m = f.length, d = -1, f === h || e(f.listener) && f.listener === h)
        delete this._events[i], this._events.removeListener && this.emit("removeListener", i, h);
      else if (n(f)) {
        for (E = m; E-- > 0; )
          if (f[E] === h || f[E].listener && f[E].listener === h) {
            d = E;
            break;
          }
        if (d < 0)
          return this;
        f.length === 1 ? (f.length = 0, delete this._events[i]) : f.splice(d, 1), this._events.removeListener && this.emit("removeListener", i, h);
      }
      return this;
    }, t.prototype.removeAllListeners = function(i) {
      var h, f;
      if (!this._events)
        return this;
      if (!this._events.removeListener)
        return arguments.length === 0 ? this._events = {} : this._events[i] && delete this._events[i], this;
      if (arguments.length === 0) {
        for (h in this._events)
          h !== "removeListener" && this.removeAllListeners(h);
        return this.removeAllListeners("removeListener"), this._events = {}, this;
      }
      if (f = this._events[i], e(f))
        this.removeListener(i, f);
      else if (f)
        for (; f.length; )
          this.removeListener(i, f[f.length - 1]);
      return delete this._events[i], this;
    }, t.prototype.listeners = function(i) {
      var h;
      return !this._events || !this._events[i] ? h = [] : e(this._events[i]) ? h = [this._events[i]] : h = this._events[i].slice(), h;
    }, t.prototype.listenerCount = function(i) {
      if (this._events) {
        var h = this._events[i];
        if (e(h))
          return 1;
        if (h)
          return h.length;
      }
      return 0;
    }, t.listenerCount = function(i, h) {
      return i.listenerCount(h);
    };
    function e(i) {
      return typeof i == "function";
    }
    function r(i) {
      return typeof i == "number";
    }
    function n(i) {
      return typeof i == "object" && i !== null;
    }
    function o(i) {
      return i === void 0;
    }
    return ie;
  }
  var ae, ge;
  function Be() {
    return ge || (ge = 1, ae = he.performance && he.performance.now ? function() {
      return performance.now();
    } : Date.now || function() {
      return +/* @__PURE__ */ new Date();
    }), ae;
  }
  var X = { exports: {} }, G = { exports: {} }, $e = G.exports, ye;
  function Ue() {
    return ye || (ye = 1, (function() {
      var t, e, r, n, o, i;
      typeof performance < "u" && performance !== null && performance.now ? G.exports = function() {
        return performance.now();
      } : typeof process < "u" && process !== null && process.hrtime ? (G.exports = function() {
        return (t() - o) / 1e6;
      }, e = process.hrtime, t = function() {
        var h;
        return h = e(), h[0] * 1e9 + h[1];
      }, n = t(), i = process.uptime() * 1e9, o = n - i) : Date.now ? (G.exports = function() {
        return Date.now() - r;
      }, r = Date.now()) : (G.exports = function() {
        return (/* @__PURE__ */ new Date()).getTime() - r;
      }, r = (/* @__PURE__ */ new Date()).getTime());
    }).call($e)), G.exports;
  }
  var _e;
  function Le() {
    if (_e) return X.exports;
    _e = 1;
    for (var t = Ue(), e = typeof window > "u" ? he : window, r = ["moz", "webkit"], n = "AnimationFrame", o = e["request" + n], i = e["cancel" + n] || e["cancelRequest" + n], h = 0; !o && h < r.length; h++)
      o = e[r[h] + "Request" + n], i = e[r[h] + "Cancel" + n] || e[r[h] + "CancelRequest" + n];
    if (!o || !i) {
      var f = 0, d = 0, m = [], E = 1e3 / 60;
      o = function(g) {
        if (m.length === 0) {
          var b = t(), T = Math.max(0, E - (b - f));
          f = T + b, setTimeout(function() {
            var _ = m.slice(0);
            m.length = 0;
            for (var F = 0; F < _.length; F++)
              if (!_[F].cancelled)
                try {
                  _[F].callback(f);
                } catch (z) {
                  setTimeout(function() {
                    throw z;
                  }, 0);
                }
          }, Math.round(T));
        }
        return m.push({
          handle: ++d,
          callback: g,
          cancelled: !1
        }), d;
      }, i = function(g) {
        for (var b = 0; b < m.length; b++)
          m[b].handle === g && (m[b].cancelled = !0);
      };
    }
    return X.exports = function(g) {
      return o.call(e, g);
    }, X.exports.cancel = function() {
      i.apply(e, arguments);
    }, X.exports.polyfill = function(g) {
      g || (g = e), g.requestAnimationFrame = o, g.cancelAnimationFrame = i;
    }, X.exports;
  }
  var oe, xe;
  function Oe() {
    if (xe) return oe;
    xe = 1;
    var t = ze(), e = Fe().EventEmitter, r = Be(), n = Le();
    oe = o;
    function o(i) {
      if (!(this instanceof o))
        return new o(i);
      this.running = !1, this.last = r(), this._frame = 0, this._tick = this.tick.bind(this), i && this.on("tick", i);
    }
    return t(o, e), o.prototype.start = function() {
      if (!this.running)
        return this.running = !0, this.last = r(), this._frame = n(this._tick), this;
    }, o.prototype.stop = function() {
      return this.running = !1, this._frame !== 0 && n.cancel(this._frame), this._frame = 0, this;
    }, o.prototype.tick = function() {
      this._frame = n(this._tick);
      var i = r(), h = i - this.last;
      this.emit("tick", h), this.last = i;
    }, oe;
  }
  var ke = Oe();
  const Ie = /* @__PURE__ */ we(ke);
  function Pe(t) {
    return navigator.mediaDevices.enumerateDevices().then((e) => e.filter((r) => r.kind === "videoinput")).then((e) => {
      let r = { audio: !1, video: !0 };
      return e[t] && (r.video = {
        deviceId: { exact: e[t].deviceId }
      }), window.navigator.mediaDevices.getUserMedia(r);
    }).then((e) => {
      const r = document.createElement("video");
      return r.setAttribute("autoplay", ""), r.setAttribute("muted", ""), r.setAttribute("playsinline", ""), r.srcObject = e, new Promise((n, o) => {
        r.addEventListener("loadedmetadata", () => {
          r.play().then(() => n({ video: r }));
        });
      });
    }).catch(console.log.bind(console));
  }
  function De(t) {
    return new Promise(function(e, r) {
      navigator.mediaDevices.getDisplayMedia(t).then((n) => {
        const o = document.createElement("video");
        o.srcObject = n, o.addEventListener("loadedmetadata", () => {
          o.play(), e({ video: o });
        });
      }).catch((n) => r(n));
    });
  }
  class je {
    constructor({ device: e, width: r, height: n, pb: o, label: i = "" }) {
      this.label = i, this.device = e, this.src = null, this.dynamic = !0, this.width = r, this.height = n, this.pb = o, this.tex = this._createTexture(1, 1), this._deferred = {
        width: r,
        height: n
      };
    }
    setDevice(e) {
      this.device = e, this._deferred && (this.tex = this._createTexture(this._deferred.width, this._deferred.height), this.src && this._updateTexture(this.src));
    }
    _createTexture(e, r) {
      return this.device ? this.device.createTexture({
        size: { width: e, height: r },
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
      }) : (e && r && (this._deferred = { width: e, height: r }), null);
    }
    _updateTexture(e, r = {}) {
      if (!this.device || !e) return;
      const n = e.videoWidth || e.width || this.width, o = e.videoHeight || e.height || this.height;
      (!this.tex || this.tex.width !== n || this.tex.height !== o) && (this.tex && this.tex.destroy(), this.tex = this._createTexture(n, o)), this.tex && (e instanceof HTMLVideoElement || e instanceof HTMLCanvasElement || e instanceof ImageBitmap || e instanceof HTMLImageElement) && this.device.queue.copyExternalImageToTexture(
        { source: e, flipY: r.flipY || !1 },
        { texture: this.tex },
        { width: n, height: o }
      );
    }
    init(e, r) {
      "src" in e && (this.src = e.src, this._updateTexture(this.src, r)), "dynamic" in e && (this.dynamic = e.dynamic);
    }
    initCam(e, r) {
      const n = this;
      Pe(e).then((o) => {
        n.src = o.video, n.dynamic = !0, n._updateTexture(n.src, r);
      }).catch((o) => console.log("could not get camera", o));
    }
    initVideo(e = "", r) {
      const n = document.createElement("video");
      n.crossOrigin = "anonymous", n.autoplay = !0, n.loop = !0, n.muted = !0, n.addEventListener("loadeddata", () => {
        this.src = n, n.play(), this._updateTexture(this.src, r), this.dynamic = !0;
      }), n.src = e;
    }
    initImage(e = "", r) {
      const n = document.createElement("img");
      n.crossOrigin = "anonymous", n.src = e, n.onload = () => {
        this.src = n, this.dynamic = !1, this._updateTexture(this.src, r);
      };
    }
    initStream(e, r) {
      let n = this;
      e && this.pb && (this.pb.initSource(e), this.pb.on("got video", function(o, i) {
        o === e && (n.src = i, n.dynamic = !0, n._updateTexture(n.src, r));
      }));
    }
    // index only relevant in atom-hydra + desktop apps
    initScreen(e = 0, r) {
      const n = this;
      De().then(function(o) {
        n.src = o.video, n._updateTexture(n.src, r), n.dynamic = !0;
      }).catch((o) => console.log("could not get screen", o));
    }
    // cache for the canvases, so we don't create them every time
    canvases = {};
    // Creates a canvas and returns the 2d context
    initCanvas(e = 1e3, r = 1e3) {
      if (this.canvases[this.label] == null) {
        const h = document.createElement("canvas").getContext("2d");
        h != null && (this.canvases[this.label] = h);
      }
      const n = this.canvases[this.label], o = n.canvas;
      return o.width !== e && o.height !== r ? (o.width = e, o.height = r) : n.clearRect(0, 0, e, r), this.init({ src: o }), this.dynamic = !0, n;
    }
    resize(e, r) {
      this.width = e, this.height = r;
    }
    clear() {
      this.src && this.src.srcObject && this.src.srcObject.getTracks && this.src.srcObject.getTracks().forEach((e) => e.stop()), this.src = null, this.tex && (this.tex.destroy(), this.tex = this._createTexture(1, 1));
    }
    tick(e) {
      this.src && this.dynamic === !0 && this.device && this._updateTexture(this.src);
    }
    getTexture() {
      return this.tex;
    }
  }
  const j = {};
  function qe(t) {
    if (typeof t == "object") {
      if ("buttons" in t)
        return t.buttons;
      if ("which" in t) {
        var e = t.which;
        if (e === 2)
          return 4;
        if (e === 3)
          return 2;
        if (e > 0)
          return 1 << e - 1;
      } else if ("button" in t) {
        var e = t.button;
        if (e === 1)
          return 4;
        if (e === 2)
          return 2;
        if (e >= 0)
          return 1 << e;
      }
    }
    return 0;
  }
  j.buttons = qe;
  function Ge(t) {
    return t.target || t.srcElement || window;
  }
  j.element = Ge;
  function Ne(t) {
    return typeof t == "object" && "pageX" in t ? t.pageX : 0;
  }
  j.x = Ne;
  function Ye(t) {
    return typeof t == "object" && "pageY" in t ? t.pageY : 0;
  }
  j.y = Ye;
  function Xe(t, e) {
    e || (e = t, t = window);
    var r = 0, n = 0, o = 0, i = {
      shift: !1,
      alt: !1,
      control: !1,
      meta: !1
    }, h = !1;
    function f(w) {
      var B = !1;
      return "altKey" in w && (B = B || w.altKey !== i.alt, i.alt = !!w.altKey), "shiftKey" in w && (B = B || w.shiftKey !== i.shift, i.shift = !!w.shiftKey), "ctrlKey" in w && (B = B || w.ctrlKey !== i.control, i.control = !!w.ctrlKey), "metaKey" in w && (B = B || w.metaKey !== i.meta, i.meta = !!w.metaKey), B;
    }
    function d(w, B) {
      var W = j.x(B), N = j.y(B);
      "buttons" in B && (w = B.buttons | 0), (w !== r || W !== n || N !== o || f(B)) && (r = w | 0, n = W || 0, o = N || 0, e && e(r, n, o, i));
    }
    function m(w) {
      d(0, w);
    }
    function E() {
      (r || n || o || i.shift || i.alt || i.meta || i.control) && (n = o = 0, r = 0, i.shift = i.alt = i.control = i.meta = !1, e && e(0, 0, 0, i));
    }
    function g(w) {
      f(w) && e && e(r, n, o, i);
    }
    function b(w) {
      j.buttons(w) === 0 ? d(0, w) : d(r, w);
    }
    function T(w) {
      d(r | j.buttons(w), w);
    }
    function _(w) {
      d(r & ~j.buttons(w), w);
    }
    function F() {
      h || (h = !0, t.addEventListener("mousemove", b), t.addEventListener("mousedown", T), t.addEventListener("mouseup", _), t.addEventListener("mouseleave", m), t.addEventListener("mouseenter", m), t.addEventListener("mouseout", m), t.addEventListener("mouseover", m), t.addEventListener("blur", E), t.addEventListener("keyup", g), t.addEventListener("keydown", g), t.addEventListener("keypress", g), t !== window && (window.addEventListener("blur", E), window.addEventListener("keyup", g), window.addEventListener("keydown", g), window.addEventListener("keypress", g)));
    }
    function z() {
      h && (h = !1, t.removeEventListener("mousemove", b), t.removeEventListener("mousedown", T), t.removeEventListener("mouseup", _), t.removeEventListener("mouseleave", m), t.removeEventListener("mouseenter", m), t.removeEventListener("mouseout", m), t.removeEventListener("mouseover", m), t.removeEventListener("blur", E), t.removeEventListener("keyup", g), t.removeEventListener("keydown", g), t.removeEventListener("keypress", g), t !== window && (window.removeEventListener("blur", E), window.removeEventListener("keyup", g), window.removeEventListener("keydown", g), window.removeEventListener("keypress", g)));
    }
    F();
    var $ = {
      element: t
    };
    return Object.defineProperties($, {
      enabled: {
        get: function() {
          return h;
        },
        set: function(w) {
          w ? F() : z();
        },
        enumerable: !0
      },
      buttons: {
        get: function() {
          return r;
        },
        enumerable: !0
      },
      x: {
        get: function() {
          return n;
        },
        enumerable: !0
      },
      y: {
        get: function() {
          return o;
        },
        enumerable: !0
      },
      mods: {
        get: function() {
          return i;
        },
        enumerable: !0
      }
    }), $;
  }
  var J = { exports: {} }, Ve = J.exports, be;
  function Ke() {
    return be || (be = 1, (function(t, e) {
      (function(r, n) {
        t.exports = n();
      })(Ve, (function() {
        function r(c, s, u) {
          for (var l, p = 0, v = s.length; p < v; p++) !l && p in s || (l || (l = Array.prototype.slice.call(s, 0, p)), l[p] = s[p]);
          return c.concat(l || Array.prototype.slice.call(s));
        }
        var n = Object.freeze({ __proto__: null, blackman: function(c) {
          for (var s = new Float32Array(c), u = 2 * Math.PI / (c - 1), l = 2 * u, p = 0; p < c / 2; p++) s[p] = 0.42 - 0.5 * Math.cos(p * u) + 0.08 * Math.cos(p * l);
          for (p = Math.ceil(c / 2); p > 0; p--) s[c - p] = s[p - 1];
          return s;
        }, hamming: function(c) {
          for (var s = new Float32Array(c), u = 0; u < c; u++) s[u] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (u / c - 1));
          return s;
        }, hanning: function(c) {
          for (var s = new Float32Array(c), u = 0; u < c; u++) s[u] = 0.5 - 0.5 * Math.cos(2 * Math.PI * u / (c - 1));
          return s;
        }, sine: function(c) {
          for (var s = Math.PI / (c - 1), u = new Float32Array(c), l = 0; l < c; l++) u[l] = Math.sin(s * l);
          return u;
        } }), o = {};
        function i(c) {
          for (; c % 2 == 0 && c > 1; ) c /= 2;
          return c === 1;
        }
        function h(c, s) {
          if (s !== "rect") {
            if (s !== "" && s || (s = "hanning"), o[s] || (o[s] = {}), !o[s][c.length]) try {
              o[s][c.length] = n[s](c.length);
            } catch {
              throw new Error("Invalid windowing function");
            }
            c = (function(u, l) {
              for (var p = [], v = 0; v < Math.min(u.length, l.length); v++) p[v] = u[v] * l[v];
              return p;
            })(c, o[s][c.length]);
          }
          return c;
        }
        function f(c, s, u) {
          for (var l = new Float32Array(c), p = 0; p < l.length; p++) l[p] = p * s / u, l[p] = 13 * Math.atan(l[p] / 1315.8) + 3.5 * Math.atan(Math.pow(l[p] / 7518, 2));
          return l;
        }
        function d(c) {
          return Float32Array.from(c);
        }
        function m(c) {
          return 1125 * Math.log(1 + c / 700);
        }
        function E(c, s, u) {
          for (var l, p = new Float32Array(c + 2), v = new Float32Array(c + 2), M = s / 2, A = m(0), S = (m(M) - A) / (c + 1), y = new Array(c + 2), R = 0; R < p.length; R++) p[R] = R * S, v[R] = (l = p[R], 700 * (Math.exp(l / 1125) - 1)), y[R] = Math.floor((u + 1) * v[R] / s);
          for (var O = new Array(c), C = 0; C < O.length; C++) {
            for (O[C] = new Array(u / 2 + 1).fill(0), R = y[C]; R < y[C + 1]; R++) O[C][R] = (R - y[C]) / (y[C + 1] - y[C]);
            for (R = y[C + 1]; R < y[C + 2]; R++) O[C][R] = (y[C + 2] - R) / (y[C + 2] - y[C + 1]);
          }
          return O;
        }
        function g(c, s, u, l, p, v, M) {
          l === void 0 && (l = 5), p === void 0 && (p = 2), v === void 0 && (v = !0), M === void 0 && (M = 440);
          var A = Math.floor(u / 2) + 1, S = new Array(u).fill(0).map((function(U, L) {
            return c * (function(k, q) {
              return Math.log2(16 * k / q);
            })(s * L / u, M);
          }));
          S[0] = S[1] - 1.5 * c;
          var y, R, O, C = S.slice(1).map((function(U, L) {
            return Math.max(U - S[L]);
          }), 1).concat([1]), D = Math.round(c / 2), I = new Array(c).fill(0).map((function(U, L) {
            return S.map((function(k) {
              return (10 * c + D + k - L) % c - D;
            }));
          })), P = I.map((function(U, L) {
            return U.map((function(k, q) {
              return Math.exp(-0.5 * Math.pow(2 * I[L][q] / C[q], 2));
            }));
          }));
          if (R = (y = P)[0].map((function() {
            return 0;
          })), O = y.reduce((function(U, L) {
            return L.forEach((function(k, q) {
              U[q] += Math.pow(k, 2);
            })), U;
          }), R).map(Math.sqrt), P = y.map((function(U, L) {
            return U.map((function(k, q) {
              return k / (O[q] || 1);
            }));
          })), p) {
            var ne = S.map((function(U) {
              return Math.exp(-0.5 * Math.pow((U / c - l) / p, 2));
            }));
            P = P.map((function(U) {
              return U.map((function(L, k) {
                return L * ne[k];
              }));
            }));
          }
          return v && (P = r(r([], P.slice(3), !0), P.slice(0, 3))), P.map((function(U) {
            return U.slice(0, A);
          }));
        }
        function b(c, s) {
          for (var u = 0, l = 0, p = 0; p < s.length; p++) u += Math.pow(p, c) * Math.abs(s[p]), l += s[p];
          return u / l;
        }
        function T(c) {
          var s = c.ampSpectrum, u = c.barkScale, l = c.numberOfBarkBands, p = l === void 0 ? 24 : l;
          if (typeof s != "object" || typeof u != "object") throw new TypeError();
          var v = p, M = new Float32Array(v), A = 0, S = s, y = new Int32Array(v + 1);
          y[0] = 0;
          for (var R = u[S.length - 1] / v, O = 1, C = 0; C < S.length; C++) for (; u[C] > R; ) y[O++] = C, R = O * u[S.length - 1] / v;
          for (y[v] = S.length - 1, C = 0; C < v; C++) {
            for (var D = 0, I = y[C]; I < y[C + 1]; I++) D += S[I];
            M[C] = Math.pow(D, 0.23);
          }
          for (C = 0; C < M.length; C++) A += M[C];
          return { specific: M, total: A };
        }
        function _(c) {
          var s = c.ampSpectrum;
          if (typeof s != "object") throw new TypeError();
          for (var u = new Float32Array(s.length), l = 0; l < u.length; l++) u[l] = Math.pow(s[l], 2);
          return u;
        }
        function F(c) {
          var s = c.ampSpectrum, u = c.melFilterBank, l = c.bufferSize;
          if (typeof s != "object") throw new TypeError("Valid ampSpectrum is required to generate melBands");
          if (typeof u != "object") throw new TypeError("Valid melFilterBank is required to generate melBands");
          for (var p = _({ ampSpectrum: s }), v = u.length, M = Array(v), A = new Float32Array(v), S = 0; S < A.length; S++) {
            M[S] = new Float32Array(l / 2), A[S] = 0;
            for (var y = 0; y < l / 2; y++) M[S][y] = u[S][y] * p[y], A[S] += M[S][y];
            A[S] = Math.log(A[S] + 1);
          }
          return Array.prototype.slice.call(A);
        }
        function z(c) {
          return c && c.__esModule && Object.prototype.hasOwnProperty.call(c, "default") ? c.default : c;
        }
        var $ = null, w = z((function(c, s) {
          var u = c.length;
          return s = s || 2, $ && $[u] || (function(l) {
            ($ = $ || {})[l] = new Array(l * l);
            for (var p = Math.PI / l, v = 0; v < l; v++) for (var M = 0; M < l; M++) $[l][M + v * l] = Math.cos(p * (M + 0.5) * v);
          })(u), c.map((function() {
            return 0;
          })).map((function(l, p) {
            return s * c.reduce((function(v, M, A, S) {
              return v + M * $[u][A + p * u];
            }), 0);
          }));
        })), B = Object.freeze({ __proto__: null, amplitudeSpectrum: function(c) {
          return c.ampSpectrum;
        }, buffer: function(c) {
          return c.signal;
        }, chroma: function(c) {
          var s = c.ampSpectrum, u = c.chromaFilterBank;
          if (typeof s != "object") throw new TypeError("Valid ampSpectrum is required to generate chroma");
          if (typeof u != "object") throw new TypeError("Valid chromaFilterBank is required to generate chroma");
          var l = u.map((function(v, M) {
            return s.reduce((function(A, S, y) {
              return A + S * v[y];
            }), 0);
          })), p = Math.max.apply(Math, l);
          return p ? l.map((function(v) {
            return v / p;
          })) : l;
        }, complexSpectrum: function(c) {
          return c.complexSpectrum;
        }, energy: function(c) {
          var s = c.signal;
          if (typeof s != "object") throw new TypeError();
          for (var u = 0, l = 0; l < s.length; l++) u += Math.pow(Math.abs(s[l]), 2);
          return u;
        }, loudness: T, melBands: F, mfcc: function(c) {
          var s = c.ampSpectrum, u = c.melFilterBank, l = c.numberOfMFCCCoefficients, p = c.bufferSize, v = Math.min(40, Math.max(1, l || 13));
          if (u.length < v) throw new Error("Insufficient filter bank for requested number of coefficients");
          var M = F({ ampSpectrum: s, melFilterBank: u, bufferSize: p });
          return w(M).slice(0, v);
        }, perceptualSharpness: function(c) {
          for (var s = T({ ampSpectrum: c.ampSpectrum, barkScale: c.barkScale }), u = s.specific, l = 0, p = 0; p < u.length; p++) l += p < 15 ? (p + 1) * u[p + 1] : 0.066 * Math.exp(0.171 * (p + 1));
          return l *= 0.11 / s.total;
        }, perceptualSpread: function(c) {
          for (var s = T({ ampSpectrum: c.ampSpectrum, barkScale: c.barkScale }), u = 0, l = 0; l < s.specific.length; l++) s.specific[l] > u && (u = s.specific[l]);
          return Math.pow((s.total - u) / s.total, 2);
        }, powerSpectrum: _, rms: function(c) {
          var s = c.signal;
          if (typeof s != "object") throw new TypeError();
          for (var u = 0, l = 0; l < s.length; l++) u += Math.pow(s[l], 2);
          return u /= s.length, u = Math.sqrt(u);
        }, spectralCentroid: function(c) {
          var s = c.ampSpectrum;
          if (typeof s != "object") throw new TypeError();
          return b(1, s);
        }, spectralCrest: function(c) {
          var s = c.ampSpectrum;
          if (typeof s != "object") throw new TypeError();
          var u = 0, l = -1 / 0;
          return s.forEach((function(p) {
            u += Math.pow(p, 2), l = p > l ? p : l;
          })), u /= s.length, u = Math.sqrt(u), l / u;
        }, spectralFlatness: function(c) {
          var s = c.ampSpectrum;
          if (typeof s != "object") throw new TypeError();
          for (var u = 0, l = 0, p = 0; p < s.length; p++) u += Math.log(s[p]), l += s[p];
          return Math.exp(u / s.length) * s.length / l;
        }, spectralFlux: function(c) {
          var s = c.signal, u = c.previousSignal, l = c.bufferSize;
          if (typeof s != "object" || typeof u != "object") throw new TypeError();
          for (var p = 0, v = -l / 2; v < s.length / 2 - 1; v++) x = Math.abs(s[v]) - Math.abs(u[v]), p += (x + Math.abs(x)) / 2;
          return p;
        }, spectralKurtosis: function(c) {
          var s = c.ampSpectrum;
          if (typeof s != "object") throw new TypeError();
          var u = s, l = b(1, u), p = b(2, u), v = b(3, u), M = b(4, u);
          return (-3 * Math.pow(l, 4) + 6 * l * p - 4 * l * v + M) / Math.pow(Math.sqrt(p - Math.pow(l, 2)), 4);
        }, spectralRolloff: function(c) {
          var s = c.ampSpectrum, u = c.sampleRate;
          if (typeof s != "object") throw new TypeError();
          for (var l = s, p = u / (2 * (l.length - 1)), v = 0, M = 0; M < l.length; M++) v += l[M];
          for (var A = 0.99 * v, S = l.length - 1; v > A && S >= 0; ) v -= l[S], --S;
          return (S + 1) * p;
        }, spectralSkewness: function(c) {
          var s = c.ampSpectrum;
          if (typeof s != "object") throw new TypeError();
          var u = b(1, s), l = b(2, s), p = b(3, s);
          return (2 * Math.pow(u, 3) - 3 * u * l + p) / Math.pow(Math.sqrt(l - Math.pow(u, 2)), 3);
        }, spectralSlope: function(c) {
          var s = c.ampSpectrum, u = c.sampleRate, l = c.bufferSize;
          if (typeof s != "object") throw new TypeError();
          for (var p = 0, v = 0, M = new Float32Array(s.length), A = 0, S = 0, y = 0; y < s.length; y++) {
            p += s[y];
            var R = y * u / l;
            M[y] = R, A += R * R, v += R, S += R * s[y];
          }
          return (s.length * S - v * p) / (p * (A - Math.pow(v, 2)));
        }, spectralSpread: function(c) {
          var s = c.ampSpectrum;
          if (typeof s != "object") throw new TypeError();
          return Math.sqrt(b(2, s) - Math.pow(b(1, s), 2));
        }, zcr: function(c) {
          var s = c.signal;
          if (typeof s != "object") throw new TypeError();
          for (var u = 0, l = 1; l < s.length; l++) (s[l - 1] >= 0 && s[l] < 0 || s[l - 1] < 0 && s[l] >= 0) && u++;
          return u;
        } });
        function W(c) {
          if (Array.isArray(c)) {
            for (var s = 0, u = Array(c.length); s < c.length; s++) u[s] = c[s];
            return u;
          }
          return Array.from(c);
        }
        var N = {}, re = {}, Y = { bitReverseArray: function(c) {
          if (N[c] === void 0) {
            for (var s = (c - 1).toString(2).length, u = "0".repeat(s), l = {}, p = 0; p < c; p++) {
              var v = p.toString(2);
              v = u.substr(v.length) + v, v = [].concat(W(v)).reverse().join(""), l[p] = parseInt(v, 2);
            }
            N[c] = l;
          }
          return N[c];
        }, multiply: function(c, s) {
          return { real: c.real * s.real - c.imag * s.imag, imag: c.real * s.imag + c.imag * s.real };
        }, add: function(c, s) {
          return { real: c.real + s.real, imag: c.imag + s.imag };
        }, subtract: function(c, s) {
          return { real: c.real - s.real, imag: c.imag - s.imag };
        }, euler: function(c, s) {
          var u = -2 * Math.PI * c / s;
          return { real: Math.cos(u), imag: Math.sin(u) };
        }, conj: function(c) {
          return c.imag *= -1, c;
        }, constructComplexArray: function(c) {
          var s = {};
          s.real = c.real === void 0 ? c.slice() : c.real.slice();
          var u = s.real.length;
          return re[u] === void 0 && (re[u] = Array.apply(null, Array(u)).map(Number.prototype.valueOf, 0)), s.imag = re[u].slice(), s;
        } }, Me = function(c) {
          var s = {};
          c.real === void 0 || c.imag === void 0 ? s = Y.constructComplexArray(c) : (s.real = c.real.slice(), s.imag = c.imag.slice());
          var u = s.real.length, l = Math.log2(u);
          if (Math.round(l) != l) throw new Error("Input size must be a power of 2.");
          if (s.real.length != s.imag.length) throw new Error("Real and imaginary components must have the same length.");
          for (var p = Y.bitReverseArray(u), v = { real: [], imag: [] }, M = 0; M < u; M++) v.real[p[M]] = s.real[M], v.imag[p[M]] = s.imag[M];
          for (var A = 0; A < u; A++) s.real[A] = v.real[A], s.imag[A] = v.imag[A];
          for (var S = 1; S <= l; S++) for (var y = Math.pow(2, S), R = 0; R < y / 2; R++) for (var O = Y.euler(R, y), C = 0; C < u / y; C++) {
            var D = y * C + R, I = y * C + R + y / 2, P = { real: s.real[D], imag: s.imag[D] }, ne = { real: s.real[I], imag: s.imag[I] }, U = Y.multiply(O, ne), L = Y.subtract(P, U);
            s.real[I] = L.real, s.imag[I] = L.imag;
            var k = Y.add(U, P);
            s.real[D] = k.real, s.imag[D] = k.imag;
          }
          return s;
        }, Te = Me, Ce = (function() {
          function c(s, u) {
            var l = this;
            if (this._m = u, !s.audioContext) throw this._m.errors.noAC;
            if (s.bufferSize && !i(s.bufferSize)) throw this._m._errors.notPow2;
            if (!s.source) throw this._m._errors.noSource;
            this._m.audioContext = s.audioContext, this._m.bufferSize = s.bufferSize || this._m.bufferSize || 256, this._m.hopSize = s.hopSize || this._m.hopSize || this._m.bufferSize, this._m.sampleRate = s.sampleRate || this._m.audioContext.sampleRate || 44100, this._m.callback = s.callback, this._m.windowingFunction = s.windowingFunction || "hanning", this._m.featureExtractors = B, this._m.EXTRACTION_STARTED = s.startImmediately || !1, this._m.channel = typeof s.channel == "number" ? s.channel : 0, this._m.inputs = s.inputs || 1, this._m.outputs = s.outputs || 1, this._m.numberOfMFCCCoefficients = s.numberOfMFCCCoefficients || this._m.numberOfMFCCCoefficients || 13, this._m.numberOfBarkBands = s.numberOfBarkBands || this._m.numberOfBarkBands || 24, this._m.spn = this._m.audioContext.createScriptProcessor(this._m.bufferSize, this._m.inputs, this._m.outputs), this._m.spn.connect(this._m.audioContext.destination), this._m._featuresToExtract = s.featureExtractors || [], this._m.barkScale = f(this._m.bufferSize, this._m.sampleRate, this._m.bufferSize), this._m.melFilterBank = E(Math.max(this._m.melBands, this._m.numberOfMFCCCoefficients), this._m.sampleRate, this._m.bufferSize), this._m.inputData = null, this._m.previousInputData = null, this._m.frame = null, this._m.previousFrame = null, this.setSource(s.source), this._m.spn.onaudioprocess = function(p) {
              var v;
              l._m.inputData !== null && (l._m.previousInputData = l._m.inputData), l._m.inputData = p.inputBuffer.getChannelData(l._m.channel), l._m.previousInputData ? ((v = new Float32Array(l._m.previousInputData.length + l._m.inputData.length - l._m.hopSize)).set(l._m.previousInputData.slice(l._m.hopSize)), v.set(l._m.inputData, l._m.previousInputData.length - l._m.hopSize)) : v = l._m.inputData;
              var M = (function(A, S, y) {
                if (A.length < S) throw new Error("Buffer is too short for frame length");
                if (y < 1) throw new Error("Hop length cannot be less that 1");
                if (S < 1) throw new Error("Frame length cannot be less that 1");
                var R = 1 + Math.floor((A.length - S) / y);
                return new Array(R).fill(0).map((function(O, C) {
                  return A.slice(C * y, C * y + S);
                }));
              })(v, l._m.bufferSize, l._m.hopSize);
              M.forEach((function(A) {
                l._m.frame = A;
                var S = l._m.extract(l._m._featuresToExtract, l._m.frame, l._m.previousFrame);
                typeof l._m.callback == "function" && l._m.EXTRACTION_STARTED && l._m.callback(S), l._m.previousFrame = l._m.frame;
              }));
            };
          }
          return c.prototype.start = function(s) {
            this._m._featuresToExtract = s || this._m._featuresToExtract, this._m.EXTRACTION_STARTED = !0;
          }, c.prototype.stop = function() {
            this._m.EXTRACTION_STARTED = !1;
          }, c.prototype.setSource = function(s) {
            this._m.source && this._m.source.disconnect(this._m.spn), this._m.source = s, this._m.source.connect(this._m.spn);
          }, c.prototype.setChannel = function(s) {
            s <= this._m.inputs ? this._m.channel = s : console.error("Channel ".concat(s, " does not exist. Make sure you've provided a value for 'inputs' that is greater than ").concat(s, " when instantiating the MeydaAnalyzer"));
          }, c.prototype.get = function(s) {
            return this._m.inputData ? this._m.extract(s || this._m._featuresToExtract, this._m.inputData, this._m.previousInputData) : null;
          }, c;
        })(), se = { audioContext: null, spn: null, bufferSize: 512, sampleRate: 44100, melBands: 26, chromaBands: 12, callback: null, windowingFunction: "hanning", featureExtractors: B, EXTRACTION_STARTED: !1, numberOfMFCCCoefficients: 13, numberOfBarkBands: 24, _featuresToExtract: [], windowing: h, _errors: { notPow2: new Error("Meyda: Buffer size must be a power of 2, e.g. 64 or 512"), featureUndef: new Error("Meyda: No features defined."), invalidFeatureFmt: new Error("Meyda: Invalid feature format"), invalidInput: new Error("Meyda: Invalid input."), noAC: new Error("Meyda: No AudioContext specified."), noSource: new Error("Meyda: No source node specified.") }, createMeydaAnalyzer: function(c) {
          return new Ce(c, Object.assign({}, se));
        }, listAvailableFeatureExtractors: function() {
          return Object.keys(this.featureExtractors);
        }, extract: function(c, s, u) {
          var l = this;
          if (!s) throw this._errors.invalidInput;
          if (typeof s != "object") throw this._errors.invalidInput;
          if (!c) throw this._errors.featureUndef;
          if (!i(s.length)) throw this._errors.notPow2;
          this.barkScale !== void 0 && this.barkScale.length == this.bufferSize || (this.barkScale = f(this.bufferSize, this.sampleRate, this.bufferSize)), this.melFilterBank !== void 0 && this.barkScale.length == this.bufferSize && this.melFilterBank.length == this.melBands || (this.melFilterBank = E(Math.max(this.melBands, this.numberOfMFCCCoefficients), this.sampleRate, this.bufferSize)), this.chromaFilterBank !== void 0 && this.chromaFilterBank.length == this.chromaBands || (this.chromaFilterBank = g(this.chromaBands, this.sampleRate, this.bufferSize)), "buffer" in s && s.buffer === void 0 ? this.signal = d(s) : this.signal = s;
          var p = pe(s, this.windowingFunction, this.bufferSize);
          if (this.signal = p.windowedSignal, this.complexSpectrum = p.complexSpectrum, this.ampSpectrum = p.ampSpectrum, u) {
            var v = pe(u, this.windowingFunction, this.bufferSize);
            this.previousSignal = v.windowedSignal, this.previousComplexSpectrum = v.complexSpectrum, this.previousAmpSpectrum = v.ampSpectrum;
          }
          var M = function(A) {
            return l.featureExtractors[A]({ ampSpectrum: l.ampSpectrum, chromaFilterBank: l.chromaFilterBank, complexSpectrum: l.complexSpectrum, signal: l.signal, bufferSize: l.bufferSize, sampleRate: l.sampleRate, barkScale: l.barkScale, melFilterBank: l.melFilterBank, previousSignal: l.previousSignal, previousAmpSpectrum: l.previousAmpSpectrum, previousComplexSpectrum: l.previousComplexSpectrum, numberOfMFCCCoefficients: l.numberOfMFCCCoefficients, numberOfBarkBands: l.numberOfBarkBands });
          };
          if (typeof c == "object") return c.reduce((function(A, S) {
            var y;
            return Object.assign({}, A, ((y = {})[S] = M(S), y));
          }), {});
          if (typeof c == "string") return M(c);
          throw this._errors.invalidFeatureFmt;
        } }, pe = function(c, s, u) {
          var l = {};
          c.buffer === void 0 ? l.signal = d(c) : l.signal = c, l.windowedSignal = h(l.signal, s), l.complexSpectrum = Te(l.windowedSignal), l.ampSpectrum = new Float32Array(u / 2);
          for (var p = 0; p < u / 2; p++) l.ampSpectrum[p] = Math.sqrt(Math.pow(l.complexSpectrum.real[p], 2) + Math.pow(l.complexSpectrum.imag[p], 2));
          return l;
        };
        return typeof window < "u" && (window.Meyda = se), se;
      }));
    })(J)), J.exports;
  }
  var We = Ke();
  const He = /* @__PURE__ */ we(We);
  class Qe {
    constructor({
      numBins: e = 4,
      cutoff: r = 2,
      smooth: n = 0.4,
      max: o = 15,
      scale: i = 10,
      isDrawing: h = !1,
      parentEl: f = document.body
    }) {
      this.vol = 0, this.scale = i, this.max = o, this.cutoff = r, this.smooth = n, this.setBins(e), this.beat = {
        holdFrames: 20,
        threshold: 40,
        _cutoff: 0,
        // adaptive based on sound state
        decay: 0.98,
        _framesSinceBeat: 0
        // keeps track of frames
      }, this.onBeat = () => {
      }, this.canvas = document.createElement("canvas"), this.canvas.width = 100, this.canvas.height = 80, this.canvas.style.width = "100px", this.canvas.style.height = "80px", this.canvas.style.position = "absolute", this.canvas.style.right = "0px", this.canvas.style.bottom = "0px", f.appendChild(this.canvas), this.isDrawing = h, this.ctx = this.canvas.getContext("2d"), this.ctx.fillStyle = "#DFFFFF", this.ctx.strokeStyle = "#0ff", this.ctx.lineWidth = 0.5, window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia({ video: !1, audio: !0 }).then((d) => {
        this.stream = d, this.context = new AudioContext();
        let m = this.context.createMediaStreamSource(d);
        this.meyda = He.createMeydaAnalyzer({
          audioContext: this.context,
          source: m,
          featureExtractors: [
            "loudness"
            //  'perceptualSpread',
            //  'perceptualSharpness',
            //  'spectralCentroid'
          ]
        });
      }).catch((d) => console.log("ERROR", d));
    }
    detectBeat(e) {
      e > this.beat._cutoff && e > this.beat.threshold ? (this.onBeat(), this.beat._cutoff = e * 1.2, this.beat._framesSinceBeat = 0) : this.beat._framesSinceBeat <= this.beat.holdFrames ? this.beat._framesSinceBeat++ : (this.beat._cutoff *= this.beat.decay, this.beat._cutoff = Math.max(this.beat._cutoff, this.beat.threshold));
    }
    tick() {
      if (this.meyda) {
        var e = this.meyda.get();
        if (e && e !== null) {
          this.vol = e.loudness.total, this.detectBeat(this.vol);
          const r = (o, i) => o + i;
          let n = Math.floor(e.loudness.specific.length / this.bins.length);
          this.prevBins = this.bins.slice(0), this.bins = this.bins.map((o, i) => e.loudness.specific.slice(i * n, (i + 1) * n).reduce(r)).map((o, i) => o * (1 - this.settings[i].smooth) + this.prevBins[i] * this.settings[i].smooth), this.fft = this.bins.map((o, i) => (
            // Math.max(0, (bin - this.cutoff) / (this.max - this.cutoff))
            Math.max(0, (o - this.settings[i].cutoff) / this.settings[i].scale)
          )), this.isDrawing && this.draw();
        }
      }
    }
    setCutoff(e) {
      this.cutoff = e, this.settings = this.settings.map((r) => (r.cutoff = e, r));
    }
    setSmooth(e) {
      this.smooth = e, this.settings = this.settings.map((r) => (r.smooth = e, r));
    }
    setBins(e) {
      this.bins = Array(e).fill(0), this.prevBins = Array(e).fill(0), this.fft = Array(e).fill(0), this.settings = Array(e).fill(0).map(() => ({
        cutoff: this.cutoff,
        scale: this.scale,
        smooth: this.smooth
      })), this.bins.forEach((r, n) => {
        window["a" + n] = (o = 1, i = 0) => () => a.fft[n] * o + i;
      });
    }
    setScale(e) {
      this.scale = e, this.settings = this.settings.map((r) => (r.scale = e, r));
    }
    setMax(e) {
      this.max = e, console.log("set max is deprecated");
    }
    hide() {
      this.isDrawing = !1, this.canvas.style.display = "none";
    }
    show() {
      this.isDrawing = !0, this.canvas.style.display = "block";
    }
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var e = this.canvas.width / this.bins.length, r = this.canvas.height / (this.max * 2);
      this.bins.forEach((n, o) => {
        var i = n * r;
        this.ctx.fillRect(o * e, this.canvas.height - i, e, i);
        var h = this.canvas.height - r * this.settings[o].cutoff;
        this.ctx.beginPath(), this.ctx.moveTo(o * e, h), this.ctx.lineTo((o + 1) * e, h), this.ctx.stroke();
        var f = this.canvas.height - r * (this.settings[o].scale + this.settings[o].cutoff);
        this.ctx.beginPath(), this.ctx.moveTo(o * e, f), this.ctx.lineTo((o + 1) * e, f), this.ctx.stroke();
      });
    }
  }
  class Ze {
    constructor(e) {
      this.mediaSource = new MediaSource(), this.stream = e, this.output = document.createElement("video"), this.output.autoplay = !0, this.output.loop = !0;
      let r = this;
      this.mediaSource.addEventListener("sourceopen", () => {
        console.log("MediaSource opened"), r.sourceBuffer = r.mediaSource.addSourceBuffer('video/webm; codecs="vp8"'), console.log("Source buffer: ", sourceBuffer);
      });
    }
    start() {
      let e = { mimeType: "video/webm;codecs=vp9" };
      this.recordedBlobs = [];
      try {
        this.mediaRecorder = new MediaRecorder(this.stream, e);
      } catch (r) {
        console.log("Unable to create MediaRecorder with options Object: ", r);
        try {
          e = { mimeType: "video/webm,codecs=vp9" }, this.mediaRecorder = new MediaRecorder(this.stream, e);
        } catch (n) {
          console.log("Unable to create MediaRecorder with options Object: ", n);
          try {
            e = "video/vp8", this.mediaRecorder = new MediaRecorder(this.stream, e);
          } catch (o) {
            alert(`MediaRecorder is not supported by this browser.

Try Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags.`), console.error("Exception while creating MediaRecorder:", o);
            return;
          }
        }
      }
      console.log("Created MediaRecorder", this.mediaRecorder, "with options", e), this.mediaRecorder.onstop = this._handleStop.bind(this), this.mediaRecorder.ondataavailable = this._handleDataAvailable.bind(this), this.mediaRecorder.start(100), console.log("MediaRecorder started", this.mediaRecorder);
    }
    stop() {
      this.mediaRecorder.stop();
    }
    _handleStop() {
      const e = new Blob(this.recordedBlobs, { type: this.mediaRecorder.mimeType }), r = window.URL.createObjectURL(e);
      this.output.src = r;
      const n = document.createElement("a");
      n.style.display = "none", n.href = r;
      let o = /* @__PURE__ */ new Date();
      n.download = `hydra-${o.getFullYear()}-${o.getMonth() + 1}-${o.getDate()}-${o.getHours()}.${o.getMinutes()}.${o.getSeconds()}.webm`, document.body.appendChild(n), n.click(), setTimeout(() => {
        document.body.removeChild(n), window.URL.revokeObjectURL(r);
      }, 300);
    }
    _handleDataAvailable(e) {
      e.data && e.data.size > 0 && this.recordedBlobs.push(e.data);
    }
  }
  const ce = {
    // no easing, no acceleration
    linear: function(t) {
      return t;
    },
    // accelerating from zero velocity
    easeInQuad: function(t) {
      return t * t;
    },
    // decelerating to zero velocity
    easeOutQuad: function(t) {
      return t * (2 - t);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    // accelerating from zero velocity
    easeInCubic: function(t) {
      return t * t * t;
    },
    // decelerating to zero velocity
    easeOutCubic: function(t) {
      return --t * t * t + 1;
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    // accelerating from zero velocity
    easeInQuart: function(t) {
      return t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuart: function(t) {
      return 1 - --t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    // accelerating from zero velocity
    easeInQuint: function(t) {
      return t * t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuint: function(t) {
      return 1 + --t * t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    },
    // sin shape
    sin: function(t) {
      return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
    }
  };
  var Je = (t, e, r, n, o) => (t - e) * (o - n) / (r - e) + n, le = (t, e) => (t % e + e) % e;
  const Se = {
    init: () => {
      Array.prototype.fast = function(t = 1) {
        return this._speed = t, this;
      }, Array.prototype.smooth = function(t = 1) {
        return this._smooth = t, this;
      }, Array.prototype.ease = function(t = "linear") {
        return typeof t == "function" ? (this._smooth = 1, this._ease = t) : ce[t] && (this._smooth = 1, this._ease = ce[t]), this;
      }, Array.prototype.offset = function(t = 0.5) {
        return this._offset = t % 1, this;
      }, Array.prototype.fit = function(t = 0, e = 1) {
        let r = Math.min(...this), n = Math.max(...this);
        var o = this.map((i) => Je(i, r, n, t, e));
        return o._speed = this._speed, o._smooth = this._smooth, o._ease = this._ease, o;
      };
    },
    getValue: (t = []) => ({ time: e, bpm: r }) => {
      let n = t._speed ? t._speed : 1, o = t._smooth ? t._smooth : 0, i = e * n * (r / 60) + (t._offset || 0);
      if (o !== 0) {
        let h = t._ease ? t._ease : ce.linear, f = i - o / 2, d = t[Math.floor(le(f, t.length))], m = t[Math.floor(le(f + 1, t.length))], E = Math.min(le(f, 1) / o, 1);
        return h(E) * (m - d) + d;
      } else
        return t[Math.floor(i % t.length)], t[Math.floor(i % t.length)];
    }
  }, et = (t) => {
    var e = "", r = o(e), n = (i, h) => {
      e += `
      var ${i} = ${h}
    `, r = o(e);
    };
    return {
      addToContext: n,
      eval: (i) => r.eval(i)
    };
    function o(i) {
      globalThis.eval(i);
      var h = function(f) {
        globalThis.eval(f);
      };
      return {
        eval: h
      };
    }
  };
  class tt {
    constructor(e, r, n = []) {
      this.makeGlobal = r, this.sandbox = et(), this.parent = e;
      var o = Object.keys(e);
      o.forEach((i) => this.add(i)), this.userProps = n;
    }
    add(e) {
      this.makeGlobal && (window[e] = this.parent[e]);
    }
    // sets on window as well as synth object if global (not needed for objects, which can be set directly)
    set(e, r) {
      this.makeGlobal && (window[e] = r), this.parent[e] = r;
    }
    tick() {
      this.makeGlobal && this.userProps.forEach((e) => {
        this.parent[e] = window[e];
      });
    }
    eval(e) {
      this.sandbox.eval(e);
    }
  }
  const rt = {
    float: {
      vec4: { name: "sum", args: [[1, 1, 1, 1]] },
      vec2: { name: "sum", args: [[1, 1]] }
    }
  }, ue = (t) => (t = t.toString(), t.indexOf(".") < 0 && (t += "."), t);
  function fe(t, e, r) {
    const n = t.transform.inputs, o = t.userArgs, { generators: i } = t.synth, { src: h } = i;
    return n.map((f, d) => {
      const m = {
        value: f.default,
        type: f.type,
        //
        isUniform: !1,
        name: f.name,
        vecLen: 0
        //  generateGlsl: null // function for creating glsl
      };
      if (m.type === "float" && (m.value = ue(f.default)), f.type.startsWith("vec"))
        try {
          m.vecLen = Number.parseInt(f.type.substr(3));
        } catch {
          console.log(`Error determining length of vector input type ${f.type} (${f.name})`);
        }
      const g = t.transform.type === "combine" || t.transform.type === "combineCoord" ? d + 1 : d;
      if (o.length > g) {
        if (m.value = o[g], m.type === "vec4" && !(m.value.type === "GlslSource" || m.value.getTexture || m.value.transforms))
          throw new Error("Arguments must be a texture or GlslSource");
        typeof o[g] == "function" ? (m.value = (_, F, z) => {
          try {
            const $ = o[g](F);
            return typeof $ == "number" ? $ : (console.warn("function does not return a number", o[g]), f.default);
          } catch ($) {
            return console.warn("ERROR", $), f.default;
          }
        }, m.isUniform = !0) : o[g].constructor === Array && (m.value = (_, F, z) => Se.getValue(o[g])(F), m.isUniform = !0);
      }
      if (!(e < 0)) {
        if (m.value && m.value.transforms) {
          const _ = m.value.transforms[m.value.transforms.length - 1];
          if (_.transform.glsl_return_type !== f.type) {
            const F = rt[f.type];
            if (typeof F < "u") {
              const z = F[_.transform.glsl_return_type];
              if (typeof z < "u") {
                const { name: $, args: w } = z;
                m.value = m.value[$](...w);
              }
            }
          }
          m.isUniform = !1;
        } else if (m.type === "float" && typeof m.value == "number")
          m.value = ue(m.value);
        else if (m.type.startsWith("vec") && typeof m.value == "object" && Array.isArray(m.value))
          m.isUniform = !1, m.value = `${m.type}(${m.value.map(ue).join(", ")})`;
        else if (m.value && m.value.getTexture)
          if (f.type === "sampler2D") {
            var b = m.value;
            m.value = () => b.getTexture(), m.isUniform = !0, m.isTexture = !0;
          } else {
            var T = m.value;
            m.value = h(T), m.isUniform = !1;
          }
        m.isUniform && (m.name += e);
      }
      return m;
    });
  }
  function st(t) {
    var e = {
      uniforms: [],
      // list of uniforms used in shader
      wgslFunctions: [],
      // list of functions used in shader
      fragColor: ""
    }, r = ee(t, e)("c", "_st");
    e.fragColor = r;
    let n = {};
    return e.uniforms.forEach((o) => n[o.name] = o), e.uniforms = Object.values(n), e;
  }
  function me(t, e) {
    return `${t}_i${e}`;
  }
  function ee(t, e) {
    var r = (n, o) => "";
    return t.forEach((n, o) => {
      let i = fe(n, e.uniforms.length);
      i.forEach((f) => {
        f.isUniform && e.uniforms.push(f);
      }), nt(n, e.wgslFunctions) || e.wgslFunctions.push(n);
      var h = r;
      n.transform.type === "src" ? r = (f, d) => `${V(i, e)(`${f}${o}`, d)}
         ${f} = ${K(`${f}${o}`, d, n.name, i)};` : n.transform.type === "color" ? r = (f, d) => `${V(i, e)(`${f}${o}`, d)}
         ${h(f, d)}
         ${f} = ${K(`${f}${o}`, `${d}, ${f}`, n.name, i)};` : n.transform.type === "coord" ? r = (f, d) => `${V(i, e)(`${f}${o}`, d)}
         ${d} = ${K(`${f}${o}`, `${d}`, n.name, i)};
         ${h(f, d)}` : n.transform.type === "combine" ? r = (f, d) => {
        let m = "", E = "vec4<f32>(0.0)";
        if (n.userArgs.length > 0) {
          let g = {
            transform: { inputs: [{ type: "vec4", name: "mod", default: 0 }] },
            userArgs: [n.userArgs[0]],
            synth: n.synth
          }, b = fe(g, e.uniforms.length, n.synth);
          b.forEach((_) => {
            _.isUniform && e.uniforms.push(_);
          });
          let T = b[0];
          if (T.value && T.value.transforms) {
            let _ = `${f}${o}_mod`;
            m = `var ${_}: vec4<f32> = vec4<f32>(0.0);
                         ${ee(T.value.transforms, e)(_, d)}`, E = _;
          } else T.isUniform ? E = `uniforms.${T.name}` : E = T.value;
        }
        return `${V(i, e)(`${f}${o}`, d)}
         ${m}
         ${h(f, d)}
         ${f} = ${K(`${f}${o}`, `${f}, ${E}`, n.name, i)};`;
      } : n.transform.type === "combineCoord" && (r = (f, d) => {
        let m = "", E = "vec4<f32>(0.0)";
        if (n.userArgs.length > 0) {
          let g = {
            transform: { inputs: [{ type: "vec4", name: "mod", default: 0 }] },
            userArgs: [n.userArgs[0]],
            synth: n.synth
          }, b = fe(g, e.uniforms.length, n.synth);
          b.forEach((_) => {
            _.isUniform && e.uniforms.push(_);
          });
          let T = b[0];
          if (T.value && T.value.transforms) {
            let _ = `${f}${o}_mod`;
            m = `var ${_}: vec4<f32> = vec4<f32>(0.0);
                         ${ee(T.value.transforms, e)(_, d)}`, E = _;
          } else T.isUniform ? E = `uniforms.${T.name}` : E = T.value;
        }
        return `${V(i, e)(`${f}${o}`, d)}
                 ${m}
         ${d} = ${K(`${f}${o}`, `${d}, ${E}`, n.name, i)};
         ${h(f, d)}`;
      });
    }), r;
  }
  function V(t, e) {
    let r = (o, i) => "";
    var n = r;
    return t.forEach((o, i) => {
      o.value.transforms && (n = r, r = (h, f) => {
        let d = me(h, i), m = me(`${f}_${h}`, i);
        return `var ${m}: vec2<f32> = ${f};
          var ${d}: vec4<f32> = vec4<f32>(0.0);
         ${n(h, f)}
         ${ee(o.value.transforms, e)(d, m)}`;
      });
    }), r;
  }
  function K(t, e, r, n) {
    const o = n.map((i, h) => i.isUniform ? i.isTexture ? i.name : `uniforms.${i.name}` : i.value && i.value.transforms ? me(t, h) : i.value).reduce((i, h) => `${i}, ${h}`, "");
    return `${r}(${e}${o})`;
  }
  function nt(t, e) {
    for (var r = 0; r < e.length; r++)
      if (t.name == e[r].name) return !0;
    return !1;
  }
  const it = {
    _luminance: {
      type: "util",
      glsl: `float _luminance(vec3 rgb){
      const vec3 W = vec3(0.2125, 0.7154, 0.0721);
      return dot(rgb, W);
    }`,
      wgsl: `fn _luminance(rgb: vec3<f32>) -> f32 {
      let W = vec3<f32>(0.2125, 0.7154, 0.0721);
      return dot(rgb, W);
    }`
    },
    _noise: {
      type: "util",
      glsl: `
    //	Simplex 3D Noise
    //	by Ian McEwan, Ashima Arts
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float _noise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //  x0 = x0 - 0. + 0.0 * C
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

  // Permutations
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients
  // ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

  // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }
    `,
      wgsl: `
    // Simplex 3D Noise
    // by Ian McEwan, Ashima Arts - WGSL version
    fn permute_wgsl(x: vec4<f32>) -> vec4<f32> {
      return ((x * 34.0 + 1.0) * x) % vec4<f32>(289.0);
    }
    fn taylorInvSqrt_wgsl(r: vec4<f32>) -> vec4<f32> {
      return vec4<f32>(1.79284291400159) - 0.85373472095314 * r;
    }

    fn _noise(v: vec3<f32>) -> f32 {
      let C = vec2<f32>(1.0/6.0, 1.0/3.0);
      let D = vec4<f32>(0.0, 0.5, 1.0, 2.0);

      // First corner
      var i = floor(v + dot(v, vec3<f32>(C.y, C.y, C.y)));
      let x0 = v - i + dot(i, vec3<f32>(C.x, C.x, C.x));

      // Other corners
      let g = step(x0.yzx, x0.xyz);
      let l = vec3<f32>(1.0) - g;
      let i1 = min(g.xyz, l.zxy);
      let i2 = max(g.xyz, l.zxy);

      let x1 = x0 - i1 + vec3<f32>(C.x, C.x, C.x);
      let x2 = x0 - i2 + 2.0 * vec3<f32>(C.x, C.x, C.x);
      let x3 = x0 - vec3<f32>(1.0) + 3.0 * vec3<f32>(C.x, C.x, C.x);

      // Permutations
      i = i % vec3<f32>(289.0);
      let p = permute_wgsl(permute_wgsl(permute_wgsl(
                 i.z + vec4<f32>(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4<f32>(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4<f32>(0.0, i1.x, i2.x, 1.0));

      // Gradients
      let n_: f32 = 1.0/7.0;
      let ns = n_ * D.wyz - D.xzx;

      let j = p - 49.0 * floor(p * ns.z * ns.z);

      let x_ = floor(j * ns.z);
      let y_ = floor(j - 7.0 * x_);

      let xx = x_ * ns.x + vec4<f32>(ns.y, ns.y, ns.y, ns.y);
      let yy = y_ * ns.x + vec4<f32>(ns.y, ns.y, ns.y, ns.y);
      let h = vec4<f32>(1.0) - abs(xx) - abs(yy);

      let b0 = vec4<f32>(xx.xy, yy.xy);
      let b1 = vec4<f32>(xx.zw, yy.zw);

      let s0 = floor(b0) * 2.0 + vec4<f32>(1.0);
      let s1 = floor(b1) * 2.0 + vec4<f32>(1.0);
      let sh = -step(h, vec4<f32>(0.0));

      let a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      let a1 = b1.xzyw + s1.xzyw * sh.zzww;

      var p0 = vec3<f32>(a0.xy, h.x);
      var p1 = vec3<f32>(a0.zw, h.y);
      var p2 = vec3<f32>(a1.xy, h.z);
      var p3 = vec3<f32>(a1.zw, h.w);

      // Normalise gradients
      let norm = taylorInvSqrt_wgsl(vec4<f32>(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 = p0 * norm.x;
      p1 = p1 * norm.y;
      p2 = p2 * norm.z;
      p3 = p3 * norm.w;

      // Mix final noise value
      var m = max(vec4<f32>(0.6) - vec4<f32>(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), vec4<f32>(0.0));
      m = m * m;
      return 42.0 * dot(m*m, vec4<f32>(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    `
    },
    _rgbToHsv: {
      type: "util",
      glsl: `vec3 _rgbToHsv(vec3 c){
            vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
            vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

            float d = q.x - min(q.w, q.y);
            float e = 1.0e-10;
            return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }`,
      wgsl: `fn _rgbToHsv(c: vec3<f32>) -> vec3<f32> {
            let K = vec4<f32>(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            let p = mix(vec4<f32>(c.bg, K.wz), vec4<f32>(c.gb, K.xy), step(c.b, c.g));
            let q = mix(vec4<f32>(p.xyw, c.r), vec4<f32>(c.r, p.yzx), step(p.x, c.r));

            let d = q.x - min(q.w, q.y);
            let e: f32 = 1.0e-10;
            return vec3<f32>(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }`
    },
    _hsvToRgb: {
      type: "util",
      glsl: `vec3 _hsvToRgb(vec3 c){
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }`,
      wgsl: `fn _hsvToRgb(c: vec3<f32>) -> vec3<f32> {
        let K = vec4<f32>(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        let p = abs(fract(vec3<f32>(c.x, c.x, c.x) + K.xyz) * 6.0 - vec3<f32>(K.w, K.w, K.w));
        return c.z * mix(vec3<f32>(K.x, K.x, K.x), clamp(p - vec3<f32>(K.x, K.x, K.x), vec3<f32>(0.0), vec3<f32>(1.0)), c.y);
    }`
    }
  };
  let Q = null, Z = null;
  async function at() {
    return Q || Z || (Z = (async () => {
      try {
        const t = await import("./web_naga-CH1sjz7U.js");
        return await t.default(), Q = t, console.log("[Hydra] Naga initialized (GLSL -> WGSL)"), Q;
      } catch (t) {
        throw console.error("[Hydra] Failed to initialize Naga:", t), t;
      }
    })(), Z);
  }
  async function ot() {
    try {
      return await at(), !0;
    } catch {
      return !1;
    }
  }
  const ct = ot;
  var te = function(t) {
    return this.transforms = [], t.transform && this.transforms.push(t), this.defaultOutput = t.defaultOutput, this.synth = t.synth, this.type = "WgslSource", this.defaultUniforms = t.defaultUniforms, this;
  };
  te.prototype.addTransform = function(t) {
    this.transforms.push(t);
  };
  te.prototype.out = function(t) {
    var e = t || this.defaultOutput;
    if (e) try {
      var r = this.compile(e);
      this.synth.currentFunctions = [], e.render(r);
    } catch (n) {
      console.warn("shader could not compile", n);
    }
  };
  te.prototype.compile = function(t) {
    var e = st(this.transforms), r = {};
    e.uniforms.forEach((d) => {
      r[d.name] = d.value;
    });
    const n = Object.values(it).map((d) => d.wgsl).join(`
`), o = e.wgslFunctions.map((d) => {
      const m = d.transform || d, E = m.name, g = m.type, b = m.wgsl;
      if (!b) return "// missing wgsl for " + E;
      let T = [], _ = "vec4<f32>";
      g === "src" ? (T.push("_st: vec2<f32>"), _ = "vec4<f32>") : g === "coord" ? (T.push("_st: vec2<f32>"), _ = "vec2<f32>") : g === "color" ? (T.push("_st: vec2<f32>"), T.push("_c0: vec4<f32>"), _ = "vec4<f32>") : g === "combine" ? (T.push("_c0: vec4<f32>"), T.push("_c1: vec4<f32>"), _ = "vec4<f32>") : g === "combineCoord" && (T.push("_st: vec2<f32>"), T.push("_c0: vec4<f32>"), _ = "vec2<f32>"), m.inputs && m.inputs.forEach((w) => {
        let B = w.type === "float" ? "f32" : w.type;
        w.type === "sampler2D" && (B = "texture_2d<f32>"), T.push(`${w.name}: ${B}`);
      });
      let F = b.replace(/([^a-zA-Z0-9_.])time([^a-zA-Z0-9_])/g, "$1uniforms.time$2"), z = "";
      (g === "src" || g === "coord" || g === "combineCoord" || g === "color") && (z += `    var _st = _st_param;
`), (g === "color" || g === "combine" || g === "combineCoord") && (z += `    var _c0 = _c0_param;
`), g === "combine" && (z += `    var _c1 = _c1_param;
`);
      let $ = T.map((w) => w.startsWith("_st:") ? "_st_param: vec2<f32>" : w.startsWith("_c0:") ? "_c0_param: vec4<f32>" : w.startsWith("_c1:") ? "_c1_param: vec4<f32>" : w);
      return `
fn ${E}(${$.join(", ")}) -> ${_} {
${z}${F}
}
`;
    }).join(`
`), i = `
    ${e.fragColor}
    c = c; // Ensure c is used
  `;
    var h = {}, f = [];
    return e.uniforms.forEach((d) => {
      d.isTexture ? f.push(d) : h[d.name] = d.value;
    }), {
      wgsl: {
        header: n + `
` + o,
        body: i
      },
      uniforms: Object.assign({}, this.defaultUniforms, h),
      textureUniforms: f
    };
  };
  const lt = () => [
    {
      name: "noise",
      type: "src",
      inputs: [
        {
          type: "float",
          name: "scale",
          default: 10
        },
        {
          type: "float",
          name: "offset",
          default: 0.1
        }
      ],
      glsl: "   return vec4(vec3(_noise(vec3(_st*scale, offset*time))), 1.0);",
      wgsl: "   return vec4<f32>(vec3<f32>(_noise(vec3<f32>(_st*scale, offset*time))), 1.0);"
    },
    {
      name: "voronoi",
      type: "src",
      inputs: [
        {
          type: "float",
          name: "scale",
          default: 5
        },
        {
          type: "float",
          name: "speed",
          default: 0.3
        },
        {
          type: "float",
          name: "blending",
          default: 0.3
        }
      ],
      glsl: `   vec3 color = vec3(.0);
   // Scale
   _st *= scale;
   // Tile the space
   vec2 i_st = floor(_st);
   vec2 f_st = fract(_st);
   float m_dist = 10.;  // minimun distance
   vec2 m_point;        // minimum point
   for (int j=-1; j<=1; j++ ) {
   for (int i=-1; i<=1; i++ ) {
   vec2 neighbor = vec2(float(i),float(j));
   vec2 p = i_st + neighbor;
   vec2 point = fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
   point = 0.5 + 0.5*sin(time*speed + 6.2831*point);
   vec2 diff = neighbor + point - f_st;
   float dist = length(diff);
   if( dist < m_dist ) {
   m_dist = dist;
   m_point = point;
   }
   }
   }
   // Assign a color using the closest point position
   color += dot(m_point,vec2(.3,.6));
   color *= 1.0 - blending*m_dist;
   return vec4(color, 1.0);`,
      wgsl: `   var color = vec3<f32>(0.0);
   var st = _st * scale;
   let i_st = floor(st);
   let f_st = fract(st);
   var m_dist: f32 = 10.0;
   var m_point: vec2<f32> = vec2<f32>(0.0);
   for (var j: i32 = -1; j <= 1; j = j + 1) {
     for (var i: i32 = -1; i <= 1; i = i + 1) {
       let neighbor = vec2<f32>(f32(i), f32(j));
       let p = i_st + neighbor;
       var point = fract(sin(vec2<f32>(dot(p, vec2<f32>(127.1, 311.7)), dot(p, vec2<f32>(269.5, 183.3)))) * 43758.5453);
       point = 0.5 + 0.5 * sin(time * speed + 6.2831 * point);
       let diff = neighbor + point - f_st;
       let dist = length(diff);
       if (dist < m_dist) {
         m_dist = dist;
         m_point = point;
       }
     }
   }
   color = color + vec3<f32>(dot(m_point, vec2<f32>(0.3, 0.6)));
   color = color * (1.0 - blending * m_dist);
   return vec4<f32>(color, 1.0);`
    },
    {
      name: "osc",
      type: "src",
      inputs: [
        {
          type: "float",
          name: "frequency",
          default: 60
        },
        {
          type: "float",
          name: "sync",
          default: 0.1
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: `   vec2 st = _st;
   float r = sin((st.x-offset/frequency+time*sync)*frequency)*0.5  + 0.5;
   float g = sin((st.x+time*sync)*frequency)*0.5 + 0.5;
   float b = sin((st.x+offset/frequency+time*sync)*frequency)*0.5  + 0.5;
   return vec4(r, g, b, 1.0);`,
      wgsl: `   let st = _st;
   let r = sin((st.x - offset/frequency + time*sync) * frequency) * 0.5 + 0.5;
   let g = sin((st.x + time*sync) * frequency) * 0.5 + 0.5;
   let b = sin((st.x + offset/frequency + time*sync) * frequency) * 0.5 + 0.5;
   return vec4<f32>(r, g, b, 1.0);`
    },
    {
      name: "shape",
      type: "src",
      inputs: [
        {
          type: "float",
          name: "sides",
          default: 3
        },
        {
          type: "float",
          name: "radius",
          default: 0.3
        },
        {
          type: "float",
          name: "smoothing",
          default: 0.01
        }
      ],
      glsl: `   vec2 st = _st * 2. - 1.;
   // Angle and radius from the current pixel
   float a = atan(st.x,st.y)+3.1416;
   float r = (2.*3.1416)/sides;
   float d = cos(floor(.5+a/r)*r-a)*length(st);
   return vec4(vec3(1.0-smoothstep(radius,radius + smoothing + 0.0000001,d)), 1.0);`,
      wgsl: `   let st = _st * 2.0 - 1.0;
   let a = atan2(st.x, st.y) + 3.1416;
   let r = (2.0 * 3.1416) / sides;
   let d = cos(floor(0.5 + a/r) * r - a) * length(st);
   return vec4<f32>(vec3<f32>(1.0 - smoothstep(radius, radius + smoothing + 0.0000001, d)), 1.0);`
    },
    {
      name: "gradient",
      type: "src",
      inputs: [
        {
          type: "float",
          name: "speed",
          default: 0
        }
      ],
      glsl: "   return vec4(_st, sin(time*speed), 1.0);",
      wgsl: "   return vec4<f32>(_st, sin(time*speed), 1.0);"
    },
    {
      name: "src",
      type: "src",
      inputs: [
        {
          type: "sampler2D",
          name: "tex",
          default: NaN
        }
      ],
      glsl: `   //  vec2 uv = gl_FragCoord.xy/vec2(1280., 720.);
   return texture2D(tex, fract(_st));`,
      wgsl: "   return textureSample(tex, texSampler, fract(_st));"
    },
    {
      name: "solid",
      type: "src",
      inputs: [
        {
          type: "float",
          name: "r",
          default: 0
        },
        {
          type: "float",
          name: "g",
          default: 0
        },
        {
          type: "float",
          name: "b",
          default: 0
        },
        {
          type: "float",
          name: "a",
          default: 1
        }
      ],
      glsl: "   return vec4(r, g, b, a);",
      wgsl: "   return vec4<f32>(r, g, b, a);"
    },
    {
      name: "rotate",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "angle",
          default: 10
        },
        {
          type: "float",
          name: "speed",
          default: 0
        }
      ],
      glsl: `   vec2 xy = _st - vec2(0.5);
   float ang = angle + speed *time;
   xy = mat2(cos(ang),-sin(ang), sin(ang),cos(ang))*xy;
   xy += 0.5;
   return xy;`,
      wgsl: `   var xy = _st - vec2<f32>(0.5);
   let ang = angle + speed * time;
   let rotMat = mat2x2<f32>(cos(ang), -sin(ang), sin(ang), cos(ang));
   xy = rotMat * xy;
   xy = xy + vec2<f32>(0.5);
   return xy;`
    },
    {
      name: "scale",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 1.5
        },
        {
          type: "float",
          name: "xMult",
          default: 1
        },
        {
          type: "float",
          name: "yMult",
          default: 1
        },
        {
          type: "float",
          name: "offsetX",
          default: 0.5
        },
        {
          type: "float",
          name: "offsetY",
          default: 0.5
        }
      ],
      glsl: `   vec2 xy = _st - vec2(offsetX, offsetY);
   xy*=(1.0/vec2(amount*xMult, amount*yMult));
   xy+=vec2(offsetX, offsetY);
   return xy;
   `,
      wgsl: `   var xy = _st - vec2<f32>(offsetX, offsetY);
   xy = xy * (1.0 / vec2<f32>(amount * xMult, amount * yMult));
   xy = xy + vec2<f32>(offsetX, offsetY);
   return xy;`
    },
    {
      name: "pixelate",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "pixelX",
          default: 20
        },
        {
          type: "float",
          name: "pixelY",
          default: 20
        }
      ],
      glsl: `   vec2 xy = vec2(pixelX, pixelY);
   return (floor(_st * xy) + 0.5)/xy;`,
      wgsl: `   let xy = vec2<f32>(pixelX, pixelY);
   return (floor(_st * xy) + 0.5) / xy;`
    },
    {
      name: "posterize",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "bins",
          default: 3
        },
        {
          type: "float",
          name: "gamma",
          default: 0.6
        }
      ],
      glsl: `   vec4 c2 = pow(_c0, vec4(gamma));
   c2 *= vec4(bins);
   c2 = floor(c2);
   c2/= vec4(bins);
   c2 = pow(c2, vec4(1.0/gamma));
   return vec4(c2.xyz, _c0.a);`,
      wgsl: `   var c2 = pow(_c0, vec4<f32>(gamma));
   c2 = c2 * vec4<f32>(bins);
   c2 = floor(c2);
   c2 = c2 / vec4<f32>(bins);
   c2 = pow(c2, vec4<f32>(1.0/gamma));
   return vec4<f32>(c2.xyz, _c0.a);`
    },
    {
      name: "shift",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "r",
          default: 0.5
        },
        {
          type: "float",
          name: "g",
          default: 0
        },
        {
          type: "float",
          name: "b",
          default: 0
        },
        {
          type: "float",
          name: "a",
          default: 0
        }
      ],
      glsl: `   vec4 c2 = vec4(_c0);
   c2.r += fract(r);
   c2.g += fract(g);
   c2.b += fract(b);
   c2.a += fract(a);
   return vec4(c2.rgba);`,
      wgsl: `   var c2 = _c0;
   c2.r = c2.r + fract(r);
   c2.g = c2.g + fract(g);
   c2.b = c2.b + fract(b);
   c2.a = c2.a + fract(a);
   return c2;`
    },
    {
      name: "repeat",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "repeatX",
          default: 3
        },
        {
          type: "float",
          name: "repeatY",
          default: 3
        },
        {
          type: "float",
          name: "offsetX",
          default: 0
        },
        {
          type: "float",
          name: "offsetY",
          default: 0
        }
      ],
      glsl: `   vec2 st = _st * vec2(repeatX, repeatY);
   st.x += step(1., mod(st.y,2.0)) * offsetX;
   st.y += step(1., mod(st.x,2.0)) * offsetY;
   return fract(st);`,
      wgsl: `   var st = _st * vec2<f32>(repeatX, repeatY);
   st.x = st.x + step(1.0, st.y % 2.0) * offsetX;
   st.y = st.y + step(1.0, st.x % 2.0) * offsetY;
   return fract(st);`
    },
    {
      name: "modulateRepeat",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "repeatX",
          default: 3
        },
        {
          type: "float",
          name: "repeatY",
          default: 3
        },
        {
          type: "float",
          name: "offsetX",
          default: 0.5
        },
        {
          type: "float",
          name: "offsetY",
          default: 0.5
        }
      ],
      glsl: `   vec2 st = _st * vec2(repeatX, repeatY);
   st.x += step(1., mod(st.y,2.0)) + _c0.r * offsetX;
   st.y += step(1., mod(st.x,2.0)) + _c0.g * offsetY;
   return fract(st);`,
      wgsl: `   var st = _st * vec2<f32>(repeatX, repeatY);
   st.x = st.x + step(1.0, st.y % 2.0) + _c0.r * offsetX;
   st.y = st.y + step(1.0, st.x % 2.0) + _c0.g * offsetY;
   return fract(st);`
    },
    {
      name: "repeatX",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "reps",
          default: 3
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: `   vec2 st = _st * vec2(reps, 1.0);
   //  float f =  mod(_st.y,2.0);
   st.y += step(1., mod(st.x,2.0))* offset;
   return fract(st);`,
      wgsl: `   var st = _st * vec2<f32>(reps, 1.0);
   st.y = st.y + step(1.0, st.x % 2.0) * offset;
   return fract(st);`
    },
    {
      name: "modulateRepeatX",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "reps",
          default: 3
        },
        {
          type: "float",
          name: "offset",
          default: 0.5
        }
      ],
      glsl: `   vec2 st = _st * vec2(reps, 1.0);
   //  float f =  mod(_st.y,2.0);
   st.y += step(1., mod(st.x,2.0)) + _c0.r * offset;
   return fract(st);`,
      wgsl: `   var st = _st * vec2<f32>(reps, 1.0);
   st.y = st.y + step(1.0, st.x % 2.0) + _c0.r * offset;
   return fract(st);`
    },
    {
      name: "repeatY",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "reps",
          default: 3
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: `   vec2 st = _st * vec2(1.0, reps);
   //  float f =  mod(_st.y,2.0);
   st.x += step(1., mod(st.y,2.0))* offset;
   return fract(st);`,
      wgsl: `   var st = _st * vec2<f32>(1.0, reps);
   st.x = st.x + step(1.0, st.y % 2.0) * offset;
   return fract(st);`
    },
    {
      name: "modulateRepeatY",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "reps",
          default: 3
        },
        {
          type: "float",
          name: "offset",
          default: 0.5
        }
      ],
      glsl: `   vec2 st = _st * vec2(reps, 1.0);
   //  float f =  mod(_st.y,2.0);
   st.x += step(1., mod(st.y,2.0)) + _c0.r * offset;
   return fract(st);`,
      wgsl: `   var st = _st * vec2<f32>(reps, 1.0);
   st.x = st.x + step(1.0, st.y % 2.0) + _c0.r * offset;
   return fract(st);`
    },
    {
      name: "kaleid",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "nSides",
          default: 4
        }
      ],
      glsl: `   vec2 st = _st;
   st -= 0.5;
   float r = length(st);
   float a = atan(st.y, st.x);
   float pi = 2.*3.1416;
   a = mod(a,pi/nSides);
   a = abs(a-pi/nSides/2.);
   return r*vec2(cos(a), sin(a));`,
      wgsl: `   var st = _st - vec2<f32>(0.5);
   let r = length(st);
   var a = atan2(st.y, st.x);
   let pi: f32 = 2.0 * 3.1416;
   a = a % (pi / nSides);
   a = abs(a - pi / nSides / 2.0);
   return r * vec2<f32>(cos(a), sin(a));`
    },
    {
      name: "modulateKaleid",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "nSides",
          default: 4
        }
      ],
      glsl: `   vec2 st = _st - 0.5;
   float r = length(st);
   float a = atan(st.y, st.x);
   float pi = 2.*3.1416;
   a = mod(a,pi/nSides);
   a = abs(a-pi/nSides/2.);
   return (_c0.r+r)*vec2(cos(a), sin(a));`,
      wgsl: `   let st = _st - vec2<f32>(0.5);
   let r = length(st);
   var a = atan2(st.y, st.x);
   let pi: f32 = 2.0 * 3.1416;
   a = a % (pi / nSides);
   a = abs(a - pi / nSides / 2.0);
   return (_c0.r + r) * vec2<f32>(cos(a), sin(a));`
    },
    {
      name: "scroll",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "scrollX",
          default: 0.5
        },
        {
          type: "float",
          name: "scrollY",
          default: 0.5
        },
        {
          type: "float",
          name: "speedX",
          default: 0
        },
        {
          type: "float",
          name: "speedY",
          default: 0
        }
      ],
      glsl: `
   _st.x += scrollX + time*speedX;
   _st.y += scrollY + time*speedY;
   return fract(_st);`,
      wgsl: `   var st = _st;
   st.x = st.x + scrollX + time * speedX;
   st.y = st.y + scrollY + time * speedY;
   return fract(st);`
    },
    {
      name: "scrollX",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "scrollX",
          default: 0.5
        },
        {
          type: "float",
          name: "speed",
          default: 0
        }
      ],
      glsl: `   _st.x += scrollX + time*speed;
   return fract(_st);`,
      wgsl: `   var st = _st;
   st.x = st.x + scrollX + time * speed;
   return fract(st);`
    },
    {
      name: "modulateScrollX",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "scrollX",
          default: 0.5
        },
        {
          type: "float",
          name: "speed",
          default: 0
        }
      ],
      glsl: `   _st.x += _c0.r*scrollX + time*speed;
   return fract(_st);`,
      wgsl: `   var st = _st;
   st.x = st.x + _c0.r * scrollX + time * speed;
   return fract(st);`
    },
    {
      name: "scrollY",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "scrollY",
          default: 0.5
        },
        {
          type: "float",
          name: "speed",
          default: 0
        }
      ],
      glsl: `   _st.y += scrollY + time*speed;
   return fract(_st);`,
      wgsl: `   var st = _st;
   st.y = st.y + scrollY + time * speed;
   return fract(st);`
    },
    {
      name: "modulateScrollY",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "scrollY",
          default: 0.5
        },
        {
          type: "float",
          name: "speed",
          default: 0
        }
      ],
      glsl: `   _st.y += _c0.r*scrollY + time*speed;
   return fract(_st);`,
      wgsl: `   var st = _st;
   st.y = st.y + _c0.r * scrollY + time * speed;
   return fract(st);`
    },
    {
      name: "add",
      type: "combine",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 1
        }
      ],
      glsl: "   return (_c0+_c1)*amount + _c0*(1.0-amount);",
      wgsl: "   return (_c0 + _c1) * amount + _c0 * (1.0 - amount);"
    },
    {
      name: "sub",
      type: "combine",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 1
        }
      ],
      glsl: "   return (_c0-_c1)*amount + _c0*(1.0-amount);",
      wgsl: "   return (_c0 - _c1) * amount + _c0 * (1.0 - amount);"
    },
    {
      name: "layer",
      type: "combine",
      inputs: [],
      glsl: "   return vec4(mix(_c0.rgb, _c1.rgb, _c1.a), clamp(_c0.a + _c1.a, 0.0, 1.0));",
      wgsl: "   return vec4<f32>(mix(_c0.rgb, _c1.rgb, _c1.a), clamp(_c0.a + _c1.a, 0.0, 1.0));"
    },
    {
      name: "blend",
      type: "combine",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 0.5
        }
      ],
      glsl: "   return _c0*(1.0-amount)+_c1*amount;",
      wgsl: "   return _c0 * (1.0 - amount) + _c1 * amount;"
    },
    {
      name: "mult",
      type: "combine",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 1
        }
      ],
      glsl: "   return _c0*(1.0-amount)+(_c0*_c1)*amount;",
      wgsl: "   return _c0 * (1.0 - amount) + (_c0 * _c1) * amount;"
    },
    {
      name: "diff",
      type: "combine",
      inputs: [],
      glsl: "   return vec4(abs(_c0.rgb-_c1.rgb), max(_c0.a, _c1.a));",
      wgsl: "   return vec4<f32>(abs(_c0.rgb - _c1.rgb), max(_c0.a, _c1.a));"
    },
    {
      name: "modulate",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 0.1
        }
      ],
      glsl: `   //  return fract(st+(_c0.xy-0.5)*amount);
   return _st + _c0.xy*amount;`,
      wgsl: "   return _st + _c0.xy * amount;"
    },
    {
      name: "modulateScale",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "multiple",
          default: 1
        },
        {
          type: "float",
          name: "offset",
          default: 1
        }
      ],
      glsl: `   vec2 xy = _st - vec2(0.5);
   xy*=(1.0/vec2(offset + multiple*_c0.r, offset + multiple*_c0.g));
   xy+=vec2(0.5);
   return xy;`,
      wgsl: `   var xy = _st - vec2<f32>(0.5);
   xy = xy * (1.0 / vec2<f32>(offset + multiple * _c0.r, offset + multiple * _c0.g));
   xy = xy + vec2<f32>(0.5);
   return xy;`
    },
    {
      name: "modulatePixelate",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "multiple",
          default: 10
        },
        {
          type: "float",
          name: "offset",
          default: 3
        }
      ],
      glsl: `   vec2 xy = vec2(offset + _c0.x*multiple, offset + _c0.y*multiple);
   return (floor(_st * xy) + 0.5)/xy;`,
      wgsl: `   let xy = vec2<f32>(offset + _c0.x * multiple, offset + _c0.y * multiple);
   return (floor(_st * xy) + 0.5) / xy;`
    },
    {
      name: "modulateRotate",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "multiple",
          default: 1
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: `   vec2 xy = _st - vec2(0.5);
   float angle = offset + _c0.x * multiple;
   xy = mat2(cos(angle),-sin(angle), sin(angle),cos(angle))*xy;
   xy += 0.5;
   return xy;`,
      wgsl: `   var xy = _st - vec2<f32>(0.5);
   let angle = offset + _c0.x * multiple;
   let rotMat = mat2x2<f32>(cos(angle), -sin(angle), sin(angle), cos(angle));
   xy = rotMat * xy;
   xy = xy + vec2<f32>(0.5);
   return xy;`
    },
    {
      name: "modulateHue",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 1
        }
      ],
      glsl: "   return _st + (vec2(_c0.g - _c0.r, _c0.b - _c0.g) * amount * 1.0/resolution);",
      wgsl: "   return _st + (vec2<f32>(_c0.g - _c0.r, _c0.b - _c0.g) * amount * 1.0 / resolution);"
    },
    {
      name: "invert",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 1
        }
      ],
      glsl: "   return vec4((1.0-_c0.rgb)*amount + _c0.rgb*(1.0-amount), _c0.a);",
      wgsl: "   return vec4<f32>((1.0 - _c0.rgb) * amount + _c0.rgb * (1.0 - amount), _c0.a);"
    },
    {
      name: "contrast",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 1.6
        }
      ],
      glsl: `   vec4 c = (_c0-vec4(0.5))*vec4(amount) + vec4(0.5);
   return vec4(c.rgb, _c0.a);`,
      wgsl: `   let c = (_c0 - vec4<f32>(0.5)) * vec4<f32>(amount) + vec4<f32>(0.5);
   return vec4<f32>(c.rgb, _c0.a);`
    },
    {
      name: "brightness",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 0.4
        }
      ],
      glsl: "   return vec4(_c0.rgb + vec3(amount), _c0.a);",
      wgsl: "   return vec4<f32>(_c0.rgb + vec3<f32>(amount), _c0.a);"
    },
    {
      name: "mask",
      type: "combine",
      inputs: [],
      glsl: `   float a = _luminance(_c1.rgb);
  return vec4(_c0.rgb*a, a*_c0.a);`,
      wgsl: `   let a = _luminance(_c1.rgb);
  return vec4<f32>(_c0.rgb * a, a * _c0.a);`
    },
    {
      name: "luma",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "threshold",
          default: 0.5
        },
        {
          type: "float",
          name: "tolerance",
          default: 0.1
        }
      ],
      glsl: `   float a = smoothstep(threshold-(tolerance+0.0000001), threshold+(tolerance+0.0000001), _luminance(_c0.rgb));
   return vec4(_c0.rgb*a, a);`,
      wgsl: `   let a = smoothstep(threshold - (tolerance + 0.0000001), threshold + (tolerance + 0.0000001), _luminance(_c0.rgb));
   return vec4<f32>(_c0.rgb * a, a);`
    },
    {
      name: "thresh",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "threshold",
          default: 0.5
        },
        {
          type: "float",
          name: "tolerance",
          default: 0.04
        }
      ],
      glsl: "   return vec4(vec3(smoothstep(threshold-(tolerance+0.0000001), threshold+(tolerance+0.0000001), _luminance(_c0.rgb))), _c0.a);",
      wgsl: "   return vec4<f32>(vec3<f32>(smoothstep(threshold - (tolerance + 0.0000001), threshold + (tolerance + 0.0000001), _luminance(_c0.rgb))), _c0.a);"
    },
    {
      name: "color",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "r",
          default: 1
        },
        {
          type: "float",
          name: "g",
          default: 1
        },
        {
          type: "float",
          name: "b",
          default: 1
        },
        {
          type: "float",
          name: "a",
          default: 1
        }
      ],
      glsl: `   vec4 c = vec4(r, g, b, a);
   vec4 pos = step(0.0, c); // detect whether negative
   // if > 0, return r * _c0
   // if < 0 return (1.0-r) * _c0
   return vec4(mix((1.0-_c0)*abs(c), c*_c0, pos));`,
      wgsl: `   let c = vec4<f32>(r, g, b, a);
   let pos = step(vec4<f32>(0.0), c);
   return mix((vec4<f32>(1.0) - _c0) * abs(c), c * _c0, pos);`
    },
    {
      name: "saturate",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 2
        }
      ],
      glsl: `   const vec3 W = vec3(0.2125, 0.7154, 0.0721);
   vec3 intensity = vec3(dot(_c0.rgb, W));
   return vec4(mix(intensity, _c0.rgb, amount), _c0.a);`,
      wgsl: `   let W = vec3<f32>(0.2125, 0.7154, 0.0721);
   let intensity = vec3<f32>(dot(_c0.rgb, W));
   return vec4<f32>(mix(intensity, _c0.rgb, amount), _c0.a);`
    },
    {
      name: "hue",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "hue",
          default: 0.4
        }
      ],
      glsl: `   vec3 c = _rgbToHsv(_c0.rgb);
   c.r += hue;
   //  c.r = fract(c.r);
   return vec4(_hsvToRgb(c), _c0.a);`,
      wgsl: `   var c = _rgbToHsv(_c0.rgb);
   c.r = c.r + hue;
   return vec4<f32>(_hsvToRgb(c), _c0.a);`
    },
    {
      name: "colorama",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 5e-3
        }
      ],
      glsl: `   vec3 c = _rgbToHsv(_c0.rgb);
   c += vec3(amount);
   c = _hsvToRgb(c);
   c = fract(c);
   return vec4(c, _c0.a);`,
      wgsl: `   var c = _rgbToHsv(_c0.rgb);
   c = c + vec3<f32>(amount);
   c = _hsvToRgb(c);
   c = fract(c);
   return vec4<f32>(c, _c0.a);`
    },
    {
      name: "prev",
      type: "src",
      inputs: [],
      glsl: "   return texture2D(prevBuffer, fract(_st));",
      wgsl: "   return textureSample(prevBuffer, texSampler, fract(_st));"
    },
    {
      name: "sum",
      type: "color",
      inputs: [
        {
          type: "vec4",
          name: "scale",
          default: 1
        }
      ],
      glsl: `   vec4 v = _c0 * s;
   return v.r + v.g + v.b + v.a;
   }
   float sum(vec2 _st, vec4 s) { // vec4 is not a typo, because argument type is not overloaded
   vec2 v = _st.xy * s.xy;
   return v.x + v.y;`,
      wgsl: `   let v = _c0 * scale;
   return vec4<f32>(v.r + v.g + v.b + v.a);`
    },
    {
      name: "r",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "scale",
          default: 1
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: "   return vec4(_c0.r * scale + offset);",
      wgsl: "   return vec4<f32>(_c0.r * scale + offset);"
    },
    {
      name: "g",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "scale",
          default: 1
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: "   return vec4(_c0.g * scale + offset);",
      wgsl: "   return vec4<f32>(_c0.g * scale + offset);"
    },
    {
      name: "b",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "scale",
          default: 1
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: "   return vec4(_c0.b * scale + offset);",
      wgsl: "   return vec4<f32>(_c0.b * scale + offset);"
    },
    {
      name: "a",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "scale",
          default: 1
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: "   return vec4(_c0.a * scale + offset);",
      wgsl: "   return vec4<f32>(_c0.a * scale + offset);"
    }
  ];
  class ut {
    constructor({
      defaultUniforms: e,
      defaultOutput: r,
      extendTransforms: n = [],
      changeListener: o = (() => {
      })
    } = {}) {
      this.defaultOutput = r, this.defaultUniforms = e, this.changeListener = o, this.extendTransforms = n, this.generators = {}, this.init();
    }
    init() {
      const e = lt();
      return this.wgslTransforms = {}, this.generators = Object.entries(this.generators).reduce((r, [n, o]) => (this.changeListener({ type: "remove", synth: this, method: n }), r), {}), this.sourceClass = te, Array.isArray(this.extendTransforms) ? e.concat(this.extendTransforms) : typeof this.extendTransforms == "object" && this.extendTransforms.type && e.push(this.extendTransforms), e.map((r) => this.setFunction(r));
    }
    _addMethod(e, r) {
      const n = this;
      if (this.wgslTransforms[e] = r, r.type === "src") {
        const o = (...i) => new this.sourceClass({
          name: e,
          transform: r,
          userArgs: i,
          defaultOutput: this.defaultOutput,
          defaultUniforms: this.defaultUniforms,
          synth: n
        });
        return this.generators[e] = o, this.changeListener({ type: "add", synth: this, method: e }), o;
      } else
        this.sourceClass.prototype[e] = function(...o) {
          return this.transforms.push({ name: e, transform: r, userArgs: o, synth: n }), this;
        };
    }
    setFunction(e) {
      (e.wgsl || e.glsl) && this._addMethod(e.name, e);
    }
  }
  const ft = Xe();
  class ht {
    constructor({
      pb: e = null,
      width: r = 1280,
      height: n = 720,
      numSources: o = 4,
      numOutputs: i = 4,
      makeGlobal: h = !0,
      autoLoop: f = !0,
      detectAudio: d = !0,
      enableStreamCapture: m = !0,
      canvas: E,
      precision: g,
      extendTransforms: b = {}
      // add your own functions on init
    } = {}) {
      if (Se.init(), this.pb = e, this.width = r, this.height = n, this.renderAll = !1, this.detectAudio = d, this._gpuReady = !1, this._gpuInitPromise = null, this._pendingRenders = [], this.adapter = null, this.device = null, this.gpuContext = null, this.gpuFormat = null, this._initCanvas(E), this.synth = {
        time: 0,
        bpm: 30,
        width: this.width,
        height: this.height,
        fps: void 0,
        stats: {
          fps: 0
        },
        speed: 1,
        mouse: ft,
        render: this._render.bind(this),
        setResolution: this.setResolution.bind(this),
        update: (_) => {
        },
        // user defined update function
        afterUpdate: (_) => {
        },
        // user defined function run after update
        hush: this.hush.bind(this),
        tick: this.tick.bind(this)
      }, h && (window.loadScript = this.loadScript), this.timeSinceLastUpdate = 0, this._time = 0, g && ["lowp", "mediump", "highp"].includes(g.toLowerCase()))
        this.precision = g.toLowerCase();
      else {
        let _ = (/iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
        this.precision = _ ? "highp" : "mediump";
      }
      if (this.extendTransforms = b, this.saveFrame = !1, this.captureStream = null, this.generator = void 0, this._initOutputs(i), this._initSources(o), this._generateGlslTransforms(), this._initWebGPU().then((_) => {
        this.o.forEach((F) => F.setDevice(_, this.gpuContext, this.gpuFormat)), this.s.forEach((F) => F.setDevice(_)), this._flushPendingRenders();
      }).catch((_) => {
        console.error("[Hydra] WebGPU initialization failed:", _);
      }), ct(), this.synth.screencap = () => {
        this.saveFrame = !0;
      }, m)
        try {
          this.captureStream = this.canvas.captureStream(25), this.synth.vidRecorder = new Ze(this.captureStream);
        } catch (_) {
          console.warn(`[hydra-synth warning]
new MediaSource() is not currently supported on iOS.`), console.error(_);
        }
      d && this._initAudio(), f && Ie(this.tick.bind(this)).start(), this.sandbox = new tt(this.synth, h, ["speed", "update", "afterUpdate", "bpm", "fps"]);
    }
    /**
     * Initialize WebGPU - called in background, doesn't block constructor
     */
    async _initWebGPU() {
      return this._gpuInitPromise ? this._gpuInitPromise : (this._gpuInitPromise = (async () => {
        if (!navigator.gpu)
          throw new Error("WebGPU not supported in this browser");
        if (console.log("[Hydra] Initializing WebGPU..."), this.adapter = await navigator.gpu.requestAdapter({
          powerPreference: "high-performance"
        }), !this.adapter)
          throw new Error("Failed to get WebGPU adapter");
        return this.device = await this.adapter.requestDevice(), this.gpuContext = this.canvas.getContext("webgpu"), this.gpuFormat = navigator.gpu.getPreferredCanvasFormat(), this.gpuContext.configure({
          device: this.device,
          format: this.gpuFormat,
          alphaMode: "premultiplied"
        }), this._gpuReady = !0, console.log("[Hydra] WebGPU initialized successfully"), console.log("[Hydra] Adapter:", this.adapter.info || "info not available"), this.device;
      })(), this._gpuInitPromise);
    }
    /**
     * Execute any pending renders that were queued before GPU was ready
     */
    _flushPendingRenders() {
      if (this._gpuReady)
        for (; this._pendingRenders.length > 0; ) {
          const e = this._pendingRenders.shift();
          try {
            e();
          } catch (r) {
            console.error("[Hydra] Error executing pending render:", r);
          }
        }
    }
    eval(e) {
      this.sandbox.eval(e);
    }
    getScreenImage(e) {
      this.imageCallback = e, this.saveFrame = !0;
    }
    hush() {
      if (!this._gpuReady) {
        this._pendingRenders.push(() => this.hush());
        return;
      }
      this.s.forEach((e) => {
        e.clear();
      }), this.o.forEach((e) => {
        this.synth.solid(0, 0, 0, 0).out(e);
      }), this.synth.render(this.o[0]), this.sandbox.set("update", (e) => {
      }), this.sandbox.set("afterUpdate", (e) => {
      });
    }
    loadScript(e = "") {
      return new Promise((n, o) => {
        var i = document.createElement("script");
        i.onload = function() {
          console.log(`loaded script ${e}`), n();
        }, i.onerror = (h) => {
          console.log(`error loading script ${e}`, "log-error"), n();
        }, i.src = e, document.head.appendChild(i);
      });
    }
    setResolution(e, r) {
      this.canvas.width = e, this.canvas.height = r, this.width = e, this.height = r, this.sandbox.set("width", e), this.sandbox.set("height", r), this._gpuReady && (this.gpuContext.configure({
        device: this.device,
        format: this.gpuFormat,
        alphaMode: "premultiplied"
      }), this.o.forEach((n) => {
        n.resize(e, r);
      }), this.s.forEach((n) => {
        n.resize(e, r);
      }));
    }
    canvasToImage(e) {
      const r = document.createElement("a");
      r.style.display = "none";
      let n = /* @__PURE__ */ new Date();
      r.download = `hydra-${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}-${n.getHours()}.${n.getMinutes()}.${n.getSeconds()}.png`, document.body.appendChild(r);
      var o = this;
      this.canvas.toBlob((i) => {
        o.imageCallback ? (o.imageCallback(i), delete o.imageCallback) : (r.href = URL.createObjectURL(i), console.log(r.href), r.click());
      }, "image/png"), setTimeout(() => {
        document.body.removeChild(r), window.URL.revokeObjectURL(r.href);
      }, 300);
    }
    _initAudio() {
      this.synth.a = new Qe({
        numBins: 4,
        parentEl: this.canvas.parentNode
      });
    }
    // create main output canvas and add to screen
    _initCanvas(e) {
      e ? (this.canvas = e, this.width = e.width, this.height = e.height) : (this.canvas = document.createElement("canvas"), this.canvas.width = this.width, this.canvas.height = this.height, this.canvas.style.width = "100%", this.canvas.style.height = "100%", this.canvas.style.imageRendering = "pixelated", document.body.appendChild(this.canvas));
    }
    _initOutputs(e) {
      const r = this;
      this.o = Array(e).fill().map((n, o) => {
        var i = new Re({
          device: this.device,
          context: this.gpuContext,
          format: this.gpuFormat,
          width: this.width,
          height: this.height,
          label: `o${o}`
        });
        return i.id = o, r.synth["o" + o] = i, i;
      }), this.output = this.o[0];
    }
    _initSources(e) {
      this.s = [];
      for (var r = 0; r < e; r++)
        this.createSource(r);
    }
    createSource(e) {
      let r = new je({
        device: this.device,
        pb: this.pb,
        width: this.width,
        height: this.height,
        label: `s${e}`
      });
      return this.synth["s" + this.s.length] = r, this.s.push(r), r;
    }
    _generateGlslTransforms() {
      var e = this;
      this.generator = new ut({
        defaultOutput: this.o[0],
        defaultUniforms: this.o[0] ? this.o[0].uniforms : {},
        extendTransforms: this.extendTransforms,
        changeListener: ({ type: r, method: n, synth: o }) => {
          r === "add" && (e.synth[n] = o.generators[n], e.sandbox && e.sandbox.add(n));
        }
      }), this.synth.setFunction = this.generator.setFunction.bind(this.generator);
    }
    _render(e) {
      if (!this._gpuReady) {
        this._pendingRenders.push(() => this._render(e));
        return;
      }
      e ? (this.output = e, this.isRenderingAll = !1) : this.isRenderingAll = !0;
    }
    // dt in ms
    tick(e, r) {
      if (this._gpuReady)
        try {
          if (this.sandbox.tick(), this.detectAudio === !0 && this.synth.a.tick(), this.sandbox.set("time", this.synth.time += e * 1e-3 * this.synth.speed), this.timeSinceLastUpdate += e, !this.synth.fps || this.timeSinceLastUpdate >= 1e3 / this.synth.fps) {
            if (this.synth.stats.fps = Math.ceil(1e3 / this.timeSinceLastUpdate), this.synth.update)
              try {
                this.synth.update(this.timeSinceLastUpdate);
              } catch (o) {
                console.log(o);
              }
            for (let o = 0; o < this.s.length; o++)
              this.s[o].tick(this.synth.time);
            const n = this.synth.time;
            for (let o = 0; o < this.o.length; o++)
              this.o[o].tick({
                time: n,
                mouse: this.synth.mouse,
                bpm: this.synth.bpm,
                resolution: [this.canvas.width, this.canvas.height]
              });
            if (this.isRenderingAll ? this._renderAll() : this._renderOutput(), this.synth.afterUpdate)
              try {
                this.synth.afterUpdate(this.timeSinceLastUpdate);
              } catch (o) {
                console.log(o);
              }
            this.timeSinceLastUpdate = 0;
          }
          this.saveFrame === !0 && (this.canvasToImage(), this.saveFrame = !1);
        } catch (n) {
          console.warn("Error during tick():", n);
        }
    }
    /**
     * Render all outputs in a 2x2 grid
     */
    _renderAll() {
      if (!this._gpuReady) return;
      const e = this.canvas.width, r = this.canvas.height, n = Math.floor(e / 2), o = Math.floor(r / 2), i = this.device.createCommandEncoder(), h = this.gpuContext.getCurrentTexture();
      i.beginRenderPass({
        colorAttachments: [{
          view: h.createView(),
          loadOp: "clear",
          storeOp: "store",
          clearValue: { r: 0, g: 0, b: 0, a: 1 }
        }]
      }).end(), this.device.queue.submit([i.finish()]), [
        { output: this.o[0], x: 0, y: 0 },
        // o0: top-left
        { output: this.o[1], x: n, y: 0 },
        // o1: top-right
        { output: this.o[2], x: 0, y: o },
        // o2: bottom-left
        { output: this.o[3], x: n, y: o }
        // o3: bottom-right
      ].forEach(({ output: m, x: E, y: g }) => {
        if (!m || !m.pipeline) return;
        const b = m.fbos[m.pingPongIndex];
        if (!b) return;
        const T = [
          { binding: 0, resource: { buffer: m.uniformBuffer } },
          { binding: 1, resource: m.sampler },
          { binding: 2, resource: b.createView() }
        ];
        m.textureUniforms && m.textureUniforms.forEach(($, w) => {
          const B = $.value();
          B && B.createView && T.push({
            binding: 3 + w,
            resource: B.createView()
          });
        });
        const _ = this.device.createBindGroup({
          layout: m.pipeline.getBindGroupLayout(0),
          entries: T
        }), F = this.device.createCommandEncoder(), z = F.beginRenderPass({
          colorAttachments: [{
            view: h.createView(),
            loadOp: "load",
            // Load existing content (don't clear)
            storeOp: "store"
          }]
        });
        z.setViewport(E, g, n, o, 0, 1), z.setScissorRect(E, g, n, o), z.setPipeline(m.pipeline), z.setBindGroup(0, _), z.setVertexBuffer(0, m.vertexBuffer), z.draw(3), z.end(), this.device.queue.submit([F.finish()]);
      });
    }
    /**
     * Render single output to screen
     */
    _renderOutput() {
      this.output && this.output.renderToScreen({
        time: this.synth.time,
        resolution: [this.canvas.width, this.canvas.height]
      });
    }
    /**
     * Wait for WebGPU to be ready
     * @returns {Promise} Resolves when WebGPU is initialized
     */
    async ready() {
      return this._gpuInitPromise;
    }
  }
  Ee.exports = ht;
});
export default mt();
