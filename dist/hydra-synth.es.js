var Sc = Object.defineProperty;
var Lc = (i, r, l) => r in i ? Sc(i, r, { enumerable: !0, configurable: !0, writable: !0, value: l }) : i[r] = l;
var Rc = (i, r) => () => (r || i((r = { exports: {} }).exports, r), r.exports);
var Qo = (i, r, l) => Lc(i, typeof r != "symbol" ? r + "" : r, l);
var pl = Rc((yl, os) => {
  var dr = function({ regl: i, precision: r, label: l = "", width: g, height: A }) {
    this.regl = i, this.precision = r, this.label = l, this.positionBuffer = this.regl.buffer([
      [-2, 0],
      [0, -2],
      [2, 2]
    ]), this.draw = () => {
    }, this.init(), this.pingPongIndex = 0, this.fbos = Array(2).fill().map(() => this.regl.framebuffer({
      color: this.regl.texture({
        mag: "nearest",
        width: g,
        height: A,
        format: "rgba"
      }),
      depthStencil: !1
    }));
  };
  dr.prototype.resize = function(i, r) {
    this.fbos.forEach((l) => {
      l.resize(i, r);
    });
  };
  dr.prototype.getCurrent = function() {
    return this.fbos[this.pingPongIndex];
  };
  dr.prototype.getTexture = function() {
    var i = this.pingPongIndex ? 0 : 1;
    return this.fbos[i];
  };
  dr.prototype.init = function() {
    return this.transformIndex = 0, this.fragHeader = `#version 300 es
  precision ${this.precision} float;

  uniform float time;
  uniform vec2 resolution;
  in vec2 uv;
  out vec4 fragColor;
  `, this.fragBody = "", this.vert = `#version 300 es
  precision ${this.precision} float;
  in vec2 position;
  out vec2 uv;

  void main () {
    uv = position;
    gl_Position = vec4(2.0 * position - 1.0, 0, 1);
  }`, this.attributes = {
      position: this.positionBuffer
    }, this.uniforms = {
      time: this.regl.prop("time"),
      resolution: this.regl.prop("resolution")
    }, this.frag = `
       ${this.fragHeader}

      void main () {
        vec4 c = vec4(0, 0, 0, 0);
        vec2 st = uv;
        ${this.fragBody}
        fragColor = c;
      }
  `, this;
  };
  dr.prototype.render = function(i) {
    let r = i[0];
    var l = this, g = Object.assign(r.uniforms, {
      prevBuffer: () => l.fbos[l.pingPongIndex]
    });
    l.draw = l.regl({
      frag: r.frag,
      vert: l.vert,
      attributes: l.attributes,
      uniforms: g,
      count: 3,
      framebuffer: () => (l.pingPongIndex = l.pingPongIndex ? 0 : 1, l.fbos[l.pingPongIndex])
    });
  };
  dr.prototype.tick = function(i) {
    this.draw(i);
  };
  var Xa = typeof globalThis < "u" ? globalThis : typeof window < "u" || typeof window < "u" ? window : typeof self < "u" ? self : {};
  function Va(i) {
    return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
  }
  var za = { exports: {} };
  typeof Object.create == "function" ? za.exports = function(r, l) {
    l && (r.super_ = l, r.prototype = Object.create(l.prototype, {
      constructor: {
        value: r,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  } : za.exports = function(r, l) {
    if (l) {
      r.super_ = l;
      var g = function() {
      };
      g.prototype = l.prototype, r.prototype = new g(), r.prototype.constructor = r;
    }
  };
  var Oc = za.exports;
  function lt() {
    this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0;
  }
  var Cc = lt;
  lt.EventEmitter = lt;
  lt.prototype._events = void 0;
  lt.prototype._maxListeners = void 0;
  lt.defaultMaxListeners = 10;
  lt.prototype.setMaxListeners = function(i) {
    if (!Fc(i) || i < 0 || isNaN(i))
      throw TypeError("n must be a positive number");
    return this._maxListeners = i, this;
  };
  lt.prototype.emit = function(i) {
    var r, l, g, A, z, ve;
    if (this._events || (this._events = {}), i === "error" && (!this._events.error || nn(this._events.error) && !this._events.error.length)) {
      if (r = arguments[1], r instanceof Error)
        throw r;
      var oe = new Error('Uncaught, unspecified "error" event. (' + r + ")");
      throw oe.context = r, oe;
    }
    if (l = this._events[i], ts(l))
      return !1;
    if (Xt(l))
      switch (arguments.length) {
        case 1:
          l.call(this);
          break;
        case 2:
          l.call(this, arguments[1]);
          break;
        case 3:
          l.call(this, arguments[1], arguments[2]);
          break;
        default:
          A = Array.prototype.slice.call(arguments, 1), l.apply(this, A);
      }
    else if (nn(l))
      for (A = Array.prototype.slice.call(arguments, 1), ve = l.slice(), g = ve.length, z = 0; z < g; z++)
        ve[z].apply(this, A);
    return !0;
  };
  lt.prototype.addListener = function(i, r) {
    var l;
    if (!Xt(r))
      throw TypeError("listener must be a function");
    return this._events || (this._events = {}), this._events.newListener && this.emit(
      "newListener",
      i,
      Xt(r.listener) ? r.listener : r
    ), this._events[i] ? nn(this._events[i]) ? this._events[i].push(r) : this._events[i] = [this._events[i], r] : this._events[i] = r, nn(this._events[i]) && !this._events[i].warned && (ts(this._maxListeners) ? l = lt.defaultMaxListeners : l = this._maxListeners, l && l > 0 && this._events[i].length > l && (this._events[i].warned = !0, console.error(
      "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
      this._events[i].length
    ), typeof console.trace == "function" && console.trace())), this;
  };
  lt.prototype.on = lt.prototype.addListener;
  lt.prototype.once = function(i, r) {
    if (!Xt(r))
      throw TypeError("listener must be a function");
    var l = !1;
    function g() {
      this.removeListener(i, g), l || (l = !0, r.apply(this, arguments));
    }
    return g.listener = r, this.on(i, g), this;
  };
  lt.prototype.removeListener = function(i, r) {
    var l, g, A, z;
    if (!Xt(r))
      throw TypeError("listener must be a function");
    if (!this._events || !this._events[i])
      return this;
    if (l = this._events[i], A = l.length, g = -1, l === r || Xt(l.listener) && l.listener === r)
      delete this._events[i], this._events.removeListener && this.emit("removeListener", i, r);
    else if (nn(l)) {
      for (z = A; z-- > 0; )
        if (l[z] === r || l[z].listener && l[z].listener === r) {
          g = z;
          break;
        }
      if (g < 0)
        return this;
      l.length === 1 ? (l.length = 0, delete this._events[i]) : l.splice(g, 1), this._events.removeListener && this.emit("removeListener", i, r);
    }
    return this;
  };
  lt.prototype.removeAllListeners = function(i) {
    var r, l;
    if (!this._events)
      return this;
    if (!this._events.removeListener)
      return arguments.length === 0 ? this._events = {} : this._events[i] && delete this._events[i], this;
    if (arguments.length === 0) {
      for (r in this._events)
        r !== "removeListener" && this.removeAllListeners(r);
      return this.removeAllListeners("removeListener"), this._events = {}, this;
    }
    if (l = this._events[i], Xt(l))
      this.removeListener(i, l);
    else if (l)
      for (; l.length; )
        this.removeListener(i, l[l.length - 1]);
    return delete this._events[i], this;
  };
  lt.prototype.listeners = function(i) {
    var r;
    return !this._events || !this._events[i] ? r = [] : Xt(this._events[i]) ? r = [this._events[i]] : r = this._events[i].slice(), r;
  };
  lt.prototype.listenerCount = function(i) {
    if (this._events) {
      var r = this._events[i];
      if (Xt(r))
        return 1;
      if (r)
        return r.length;
    }
    return 0;
  };
  lt.listenerCount = function(i, r) {
    return i.listenerCount(r);
  };
  function Xt(i) {
    return typeof i == "function";
  }
  function Fc(i) {
    return typeof i == "number";
  }
  function nn(i) {
    return typeof i == "object" && i !== null;
  }
  function ts(i) {
    return i === void 0;
  }
  var Gc = window.performance && window.performance.now ? function() {
    return performance.now();
  } : Date.now || function() {
    return +/* @__PURE__ */ new Date();
  }, Dn = { exports: {} }, rn = { exports: {} };
  (function() {
    var i, r, l, g, A, z;
    typeof performance < "u" && performance !== null && performance.now ? rn.exports = function() {
      return performance.now();
    } : typeof process < "u" && process !== null && process.hrtime ? (rn.exports = function() {
      return (i() - A) / 1e6;
    }, r = process.hrtime, i = function() {
      var ve;
      return ve = r(), ve[0] * 1e9 + ve[1];
    }, g = i(), z = process.uptime() * 1e9, A = g - z) : Date.now ? (rn.exports = function() {
      return Date.now() - l;
    }, l = Date.now()) : (rn.exports = function() {
      return (/* @__PURE__ */ new Date()).getTime() - l;
    }, l = (/* @__PURE__ */ new Date()).getTime());
  }).call(Xa);
  var Mc = rn.exports, kc = Mc, jt = window, Nn = ["moz", "webkit"], Cr = "AnimationFrame", Fr = jt["request" + Cr], an = jt["cancel" + Cr] || jt["cancelRequest" + Cr];
  for (var Jr = 0; !Fr && Jr < Nn.length; Jr++)
    Fr = jt[Nn[Jr] + "Request" + Cr], an = jt[Nn[Jr] + "Cancel" + Cr] || jt[Nn[Jr] + "CancelRequest" + Cr];
  if (!Fr || !an) {
    var Da = 0, Zo = 0, cr = [], Bc = 1e3 / 60;
    Fr = function(i) {
      if (cr.length === 0) {
        var r = kc(), l = Math.max(0, Bc - (r - Da));
        Da = l + r, setTimeout(function() {
          var g = cr.slice(0);
          cr.length = 0;
          for (var A = 0; A < g.length; A++)
            if (!g[A].cancelled)
              try {
                g[A].callback(Da);
              } catch (z) {
                setTimeout(function() {
                  throw z;
                }, 0);
              }
        }, Math.round(l));
      }
      return cr.push({
        handle: ++Zo,
        callback: i,
        cancelled: !1
      }), Zo;
    }, an = function(i) {
      for (var r = 0; r < cr.length; r++)
        cr[r].handle === i && (cr[r].cancelled = !0);
    };
  }
  Dn.exports = function(i) {
    return Fr.call(jt, i);
  };
  Dn.exports.cancel = function() {
    an.apply(jt, arguments);
  };
  Dn.exports.polyfill = function(i) {
    i || (i = jt), i.requestAnimationFrame = Fr, i.cancelAnimationFrame = an;
  };
  var Ic = Dn.exports, Nc = Oc, Dc = Cc.EventEmitter, Ha = Gc, Wa = Ic, Pc = lr;
  function lr(i) {
    if (!(this instanceof lr))
      return new lr(i);
    this.running = !1, this.last = Ha(), this._frame = 0, this._tick = this.tick.bind(this), i && this.on("tick", i);
  }
  Nc(lr, Dc);
  lr.prototype.start = function() {
    if (!this.running)
      return this.running = !0, this.last = Ha(), this._frame = Wa(this._tick), this;
  };
  lr.prototype.stop = function() {
    return this.running = !1, this._frame !== 0 && Wa.cancel(this._frame), this._frame = 0, this;
  };
  lr.prototype.tick = function() {
    this._frame = Wa(this._tick);
    var i = Ha(), r = i - this.last;
    this.emit("tick", r), this.last = i;
  };
  const Uc = /* @__PURE__ */ Va(Pc);
  function $c(i) {
    return navigator.mediaDevices.enumerateDevices().then((r) => r.filter((l) => l.kind === "videoinput")).then((r) => {
      let l = { audio: !1, video: !0 };
      return r[i] && (l.video = {
        deviceId: { exact: r[i].deviceId }
      }), window.navigator.mediaDevices.getUserMedia(l);
    }).then((r) => {
      const l = document.createElement("video");
      return l.setAttribute("autoplay", ""), l.setAttribute("muted", ""), l.setAttribute("playsinline", ""), l.srcObject = r, new Promise((g, A) => {
        l.addEventListener("loadedmetadata", () => {
          l.play().then(() => g({ video: l }));
        });
      });
    }).catch(console.log.bind(console));
  }
  function zc(i) {
    return new Promise(function(r, l) {
      navigator.mediaDevices.getDisplayMedia(i).then((g) => {
        const A = document.createElement("video");
        A.srcObject = g, A.addEventListener("loadedmetadata", () => {
          A.play(), r({ video: A });
        });
      }).catch((g) => l(g));
    });
  }
  class jc {
    constructor({ regl: r, width: l, height: g, pb: A, label: z = "" }) {
      // cache for the canvases, so we don't create them every time
      Qo(this, "canvases", {});
      this.label = z, this.regl = r, this.src = null, this.dynamic = !0, this.width = l, this.height = g, this.tex = this.regl.texture({
        //  shape: [width, height]
        shape: [1, 1]
      }), this.pb = A;
    }
    init(r, l) {
      "src" in r && (this.src = r.src, this.tex = this.regl.texture({ data: this.src, ...l })), "dynamic" in r && (this.dynamic = r.dynamic);
    }
    initCam(r, l) {
      const g = this;
      $c(r).then((A) => {
        g.src = A.video, g.dynamic = !0, g.tex = g.regl.texture({ data: g.src, ...l });
      }).catch((A) => console.log("could not get camera", A));
    }
    initVideo(r = "", l) {
      const g = document.createElement("video");
      g.crossOrigin = "anonymous", g.autoplay = !0, g.loop = !0, g.muted = !0, g.addEventListener("loadeddata", () => {
        this.src = g, g.play(), this.tex = this.regl.texture({ data: this.src, ...l }), this.dynamic = !0;
      }), g.src = r;
    }
    initImage(r = "", l) {
      const g = document.createElement("img");
      g.crossOrigin = "anonymous", g.src = r, g.onload = () => {
        this.src = g, this.dynamic = !1, this.tex = this.regl.texture({ data: this.src, ...l });
      };
    }
    initStream(r, l) {
      let g = this;
      r && this.pb && (this.pb.initSource(r), this.pb.on("got video", function(A, z) {
        A === r && (g.src = z, g.dynamic = !0, g.tex = g.regl.texture({ data: g.src, ...l }));
      }));
    }
    // index only relevant in atom-hydra + desktop apps
    initScreen(r = 0, l) {
      const g = this;
      zc().then(function(A) {
        g.src = A.video, g.tex = g.regl.texture({ data: g.src, ...l }), g.dynamic = !0;
      }).catch((A) => console.log("could not get screen", A));
    }
    // Creates a canvas and returns the 2d context
    initCanvas(r = 1e3, l = 1e3) {
      if (this.canvases[this.label] == null) {
        const ve = document.createElement("canvas").getContext("2d");
        ve != null && (this.canvases[this.label] = ve);
      }
      const g = this.canvases[this.label], A = g.canvas;
      return A.width !== r && A.height !== l ? (A.width = r, A.height = l) : g.clearRect(0, 0, r, l), this.init({ src: A }), this.dynamic = !0, g;
    }
    resize(r, l) {
      this.width = r, this.height = l;
    }
    clear() {
      this.src && this.src.srcObject && this.src.srcObject.getTracks && this.src.srcObject.getTracks().forEach((r) => r.stop()), this.src = null, this.tex = this.regl.texture({ shape: [1, 1] });
    }
    tick(r) {
      this.src && this.dynamic === !0 && (this.src.videoWidth && this.src.videoWidth !== this.tex.width && (console.log(
        this.src.videoWidth,
        this.src.videoHeight,
        this.tex.width,
        this.tex.height
      ), this.tex.resize(this.src.videoWidth, this.src.videoHeight)), this.src.width && this.src.width !== this.tex.width && this.tex.resize(this.src.width, this.src.height), this.tex.subimage(this.src));
    }
    getTexture() {
      return this.tex;
    }
  }
  const zt = {};
  function Xc(i) {
    if (typeof i == "object") {
      if ("buttons" in i)
        return i.buttons;
      if ("which" in i) {
        var r = i.which;
        if (r === 2)
          return 4;
        if (r === 3)
          return 2;
        if (r > 0)
          return 1 << r - 1;
      } else if ("button" in i) {
        var r = i.button;
        if (r === 1)
          return 4;
        if (r === 2)
          return 2;
        if (r >= 0)
          return 1 << r;
      }
    }
    return 0;
  }
  zt.buttons = Xc;
  function Vc(i) {
    return i.target || i.srcElement || window;
  }
  zt.element = Vc;
  function Hc(i) {
    return typeof i == "object" && "pageX" in i ? i.pageX : 0;
  }
  zt.x = Hc;
  function Wc(i) {
    return typeof i == "object" && "pageY" in i ? i.pageY : 0;
  }
  zt.y = Wc;
  function Yc(i, r) {
    r || (r = i, i = window);
    var l = 0, g = 0, A = 0, z = {
      shift: !1,
      alt: !1,
      control: !1,
      meta: !1
    }, ve = !1;
    function oe(Pe) {
      var et = !1;
      return "altKey" in Pe && (et = et || Pe.altKey !== z.alt, z.alt = !!Pe.altKey), "shiftKey" in Pe && (et = et || Pe.shiftKey !== z.shift, z.shift = !!Pe.shiftKey), "ctrlKey" in Pe && (et = et || Pe.ctrlKey !== z.control, z.control = !!Pe.ctrlKey), "metaKey" in Pe && (et = et || Pe.metaKey !== z.meta, z.meta = !!Pe.metaKey), et;
    }
    function ge(Pe, et) {
      var Qt = zt.x(et), Et = zt.y(et);
      "buttons" in et && (Pe = et.buttons | 0), (Pe !== l || Qt !== g || Et !== A || oe(et)) && (l = Pe | 0, g = Qt || 0, A = Et || 0, r && r(l, g, A, z));
    }
    function ye(Pe) {
      ge(0, Pe);
    }
    function yt() {
      (l || g || A || z.shift || z.alt || z.meta || z.control) && (g = A = 0, l = 0, z.shift = z.alt = z.control = z.meta = !1, r && r(0, 0, 0, z));
    }
    function Ve(Pe) {
      oe(Pe) && r && r(l, g, A, z);
    }
    function He(Pe) {
      zt.buttons(Pe) === 0 ? ge(0, Pe) : ge(l, Pe);
    }
    function ht(Pe) {
      ge(l | zt.buttons(Pe), Pe);
    }
    function it(Pe) {
      ge(l & ~zt.buttons(Pe), Pe);
    }
    function _t() {
      ve || (ve = !0, i.addEventListener("mousemove", He), i.addEventListener("mousedown", ht), i.addEventListener("mouseup", it), i.addEventListener("mouseleave", ye), i.addEventListener("mouseenter", ye), i.addEventListener("mouseout", ye), i.addEventListener("mouseover", ye), i.addEventListener("blur", yt), i.addEventListener("keyup", Ve), i.addEventListener("keydown", Ve), i.addEventListener("keypress", Ve), i !== window && (window.addEventListener("blur", yt), window.addEventListener("keyup", Ve), window.addEventListener("keydown", Ve), window.addEventListener("keypress", Ve)));
    }
    function Kt() {
      ve && (ve = !1, i.removeEventListener("mousemove", He), i.removeEventListener("mousedown", ht), i.removeEventListener("mouseup", it), i.removeEventListener("mouseleave", ye), i.removeEventListener("mouseenter", ye), i.removeEventListener("mouseout", ye), i.removeEventListener("mouseover", ye), i.removeEventListener("blur", yt), i.removeEventListener("keyup", Ve), i.removeEventListener("keydown", Ve), i.removeEventListener("keypress", Ve), i !== window && (window.removeEventListener("blur", yt), window.removeEventListener("keyup", Ve), window.removeEventListener("keydown", Ve), window.removeEventListener("keypress", Ve)));
    }
    _t();
    var mt = {
      element: i
    };
    return Object.defineProperties(mt, {
      enabled: {
        get: function() {
          return ve;
        },
        set: function(Pe) {
          Pe ? _t() : Kt();
        },
        enumerable: !0
      },
      buttons: {
        get: function() {
          return l;
        },
        enumerable: !0
      },
      x: {
        get: function() {
          return g;
        },
        enumerable: !0
      },
      y: {
        get: function() {
          return A;
        },
        enumerable: !0
      },
      mods: {
        get: function() {
          return z;
        },
        enumerable: !0
      }
    }), mt;
  }
  var rs = { exports: {} };
  (function(i, r) {
    (function(l, g) {
      i.exports = g();
    })(Xa, function() {
      function l(L, y, $) {
        for (var O, J = 0, de = y.length; J < de; J++) !O && J in y || (O || (O = Array.prototype.slice.call(y, 0, J)), O[J] = y[J]);
        return L.concat(O || Array.prototype.slice.call(y));
      }
      var g = Object.freeze({ __proto__: null, blackman: function(L) {
        for (var y = new Float32Array(L), $ = 2 * Math.PI / (L - 1), O = 2 * $, J = 0; J < L / 2; J++) y[J] = 0.42 - 0.5 * Math.cos(J * $) + 0.08 * Math.cos(J * O);
        for (J = Math.ceil(L / 2); J > 0; J--) y[L - J] = y[J - 1];
        return y;
      }, hamming: function(L) {
        for (var y = new Float32Array(L), $ = 0; $ < L; $++) y[$] = 0.54 - 0.46 * Math.cos(2 * Math.PI * ($ / L - 1));
        return y;
      }, hanning: function(L) {
        for (var y = new Float32Array(L), $ = 0; $ < L; $++) y[$] = 0.5 - 0.5 * Math.cos(2 * Math.PI * $ / (L - 1));
        return y;
      }, sine: function(L) {
        for (var y = Math.PI / (L - 1), $ = new Float32Array(L), O = 0; O < L; O++) $[O] = Math.sin(y * O);
        return $;
      } }), A = {};
      function z(L) {
        for (; L % 2 == 0 && L > 1; ) L /= 2;
        return L === 1;
      }
      function ve(L, y) {
        if (y !== "rect") {
          if (y !== "" && y || (y = "hanning"), A[y] || (A[y] = {}), !A[y][L.length]) try {
            A[y][L.length] = g[y](L.length);
          } catch {
            throw new Error("Invalid windowing function");
          }
          L = function($, O) {
            for (var J = [], de = 0; de < Math.min($.length, O.length); de++) J[de] = $[de] * O[de];
            return J;
          }(L, A[y][L.length]);
        }
        return L;
      }
      function oe(L, y, $) {
        for (var O = new Float32Array(L), J = 0; J < O.length; J++) O[J] = J * y / $, O[J] = 13 * Math.atan(O[J] / 1315.8) + 3.5 * Math.atan(Math.pow(O[J] / 7518, 2));
        return O;
      }
      function ge(L) {
        return Float32Array.from(L);
      }
      function ye(L) {
        return 1125 * Math.log(1 + L / 700);
      }
      function yt(L, y, $) {
        for (var O, J = new Float32Array(L + 2), de = new Float32Array(L + 2), Ce = y / 2, ke = ye(0), Te = (ye(Ce) - ke) / (L + 1), xe = new Array(L + 2), Ne = 0; Ne < J.length; Ne++) J[Ne] = Ne * Te, de[Ne] = (O = J[Ne], 700 * (Math.exp(O / 1125) - 1)), xe[Ne] = Math.floor(($ + 1) * de[Ne] / y);
        for (var pt = new Array(L), Ie = 0; Ie < pt.length; Ie++) {
          for (pt[Ie] = new Array($ / 2 + 1).fill(0), Ne = xe[Ie]; Ne < xe[Ie + 1]; Ne++) pt[Ie][Ne] = (Ne - xe[Ie]) / (xe[Ie + 1] - xe[Ie]);
          for (Ne = xe[Ie + 1]; Ne < xe[Ie + 2]; Ne++) pt[Ie][Ne] = (xe[Ie + 2] - Ne) / (xe[Ie + 2] - xe[Ie + 1]);
        }
        return pt;
      }
      function Ve(L, y, $, O, J, de, Ce) {
        O === void 0 && (O = 5), J === void 0 && (J = 2), de === void 0 && (de = !0), Ce === void 0 && (Ce = 440);
        var ke = Math.floor($ / 2) + 1, Te = new Array($).fill(0).map(function(tt, dt) {
          return L * function(vt, Gt) {
            return Math.log2(16 * vt / Gt);
          }(y * dt / $, Ce);
        });
        Te[0] = Te[1] - 1.5 * L;
        var xe, Ne, pt, Ie = Te.slice(1).map(function(tt, dt) {
          return Math.max(tt - Te[dt]);
        }, 1).concat([1]), Ot = Math.round(L / 2), Tt = new Array(L).fill(0).map(function(tt, dt) {
          return Te.map(function(vt) {
            return (10 * L + Ot + vt - dt) % L - Ot;
          });
        }), At = Tt.map(function(tt, dt) {
          return tt.map(function(vt, Gt) {
            return Math.exp(-0.5 * Math.pow(2 * Tt[dt][Gt] / Ie[Gt], 2));
          });
        });
        if (Ne = (xe = At)[0].map(function() {
          return 0;
        }), pt = xe.reduce(function(tt, dt) {
          return dt.forEach(function(vt, Gt) {
            tt[Gt] += Math.pow(vt, 2);
          }), tt;
        }, Ne).map(Math.sqrt), At = xe.map(function(tt, dt) {
          return tt.map(function(vt, Gt) {
            return vt / (pt[Gt] || 1);
          });
        }), J) {
          var kr = Te.map(function(tt) {
            return Math.exp(-0.5 * Math.pow((tt / L - O) / J, 2));
          });
          At = At.map(function(tt) {
            return tt.map(function(dt, vt) {
              return dt * kr[vt];
            });
          });
        }
        return de && (At = l(l([], At.slice(3), !0), At.slice(0, 3))), At.map(function(tt) {
          return tt.slice(0, ke);
        });
      }
      function He(L, y) {
        for (var $ = 0, O = 0, J = 0; J < y.length; J++) $ += Math.pow(J, L) * Math.abs(y[J]), O += y[J];
        return $ / O;
      }
      function ht(L) {
        var y = L.ampSpectrum, $ = L.barkScale, O = L.numberOfBarkBands, J = O === void 0 ? 24 : O;
        if (typeof y != "object" || typeof $ != "object") throw new TypeError();
        var de = J, Ce = new Float32Array(de), ke = 0, Te = y, xe = new Int32Array(de + 1);
        xe[0] = 0;
        for (var Ne = $[Te.length - 1] / de, pt = 1, Ie = 0; Ie < Te.length; Ie++) for (; $[Ie] > Ne; ) xe[pt++] = Ie, Ne = pt * $[Te.length - 1] / de;
        for (xe[de] = Te.length - 1, Ie = 0; Ie < de; Ie++) {
          for (var Ot = 0, Tt = xe[Ie]; Tt < xe[Ie + 1]; Tt++) Ot += Te[Tt];
          Ce[Ie] = Math.pow(Ot, 0.23);
        }
        for (Ie = 0; Ie < Ce.length; Ie++) ke += Ce[Ie];
        return { specific: Ce, total: ke };
      }
      function it(L) {
        var y = L.ampSpectrum;
        if (typeof y != "object") throw new TypeError();
        for (var $ = new Float32Array(y.length), O = 0; O < $.length; O++) $[O] = Math.pow(y[O], 2);
        return $;
      }
      function _t(L) {
        var y = L.ampSpectrum, $ = L.melFilterBank, O = L.bufferSize;
        if (typeof y != "object") throw new TypeError("Valid ampSpectrum is required to generate melBands");
        if (typeof $ != "object") throw new TypeError("Valid melFilterBank is required to generate melBands");
        for (var J = it({ ampSpectrum: y }), de = $.length, Ce = Array(de), ke = new Float32Array(de), Te = 0; Te < ke.length; Te++) {
          Ce[Te] = new Float32Array(O / 2), ke[Te] = 0;
          for (var xe = 0; xe < O / 2; xe++) Ce[Te][xe] = $[Te][xe] * J[xe], ke[Te] += Ce[Te][xe];
          ke[Te] = Math.log(ke[Te] + 1);
        }
        return Array.prototype.slice.call(ke);
      }
      function Kt(L) {
        return L && L.__esModule && Object.prototype.hasOwnProperty.call(L, "default") ? L.default : L;
      }
      var mt = null, Pe = Kt(function(L, y) {
        var $ = L.length;
        return y = y || 2, mt && mt[$] || function(O) {
          (mt = mt || {})[O] = new Array(O * O);
          for (var J = Math.PI / O, de = 0; de < O; de++) for (var Ce = 0; Ce < O; Ce++) mt[O][Ce + de * O] = Math.cos(J * (Ce + 0.5) * de);
        }($), L.map(function() {
          return 0;
        }).map(function(O, J) {
          return y * L.reduce(function(de, Ce, ke, Te) {
            return de + Ce * mt[$][ke + J * $];
          }, 0);
        });
      }), et = Object.freeze({ __proto__: null, amplitudeSpectrum: function(L) {
        return L.ampSpectrum;
      }, buffer: function(L) {
        return L.signal;
      }, chroma: function(L) {
        var y = L.ampSpectrum, $ = L.chromaFilterBank;
        if (typeof y != "object") throw new TypeError("Valid ampSpectrum is required to generate chroma");
        if (typeof $ != "object") throw new TypeError("Valid chromaFilterBank is required to generate chroma");
        var O = $.map(function(de, Ce) {
          return y.reduce(function(ke, Te, xe) {
            return ke + Te * de[xe];
          }, 0);
        }), J = Math.max.apply(Math, O);
        return J ? O.map(function(de) {
          return de / J;
        }) : O;
      }, complexSpectrum: function(L) {
        return L.complexSpectrum;
      }, energy: function(L) {
        var y = L.signal;
        if (typeof y != "object") throw new TypeError();
        for (var $ = 0, O = 0; O < y.length; O++) $ += Math.pow(Math.abs(y[O]), 2);
        return $;
      }, loudness: ht, melBands: _t, mfcc: function(L) {
        var y = L.ampSpectrum, $ = L.melFilterBank, O = L.numberOfMFCCCoefficients, J = L.bufferSize, de = Math.min(40, Math.max(1, O || 13));
        if ($.length < de) throw new Error("Insufficient filter bank for requested number of coefficients");
        var Ce = _t({ ampSpectrum: y, melFilterBank: $, bufferSize: J });
        return Pe(Ce).slice(0, de);
      }, perceptualSharpness: function(L) {
        for (var y = ht({ ampSpectrum: L.ampSpectrum, barkScale: L.barkScale }), $ = y.specific, O = 0, J = 0; J < $.length; J++) O += J < 15 ? (J + 1) * $[J + 1] : 0.066 * Math.exp(0.171 * (J + 1));
        return O *= 0.11 / y.total;
      }, perceptualSpread: function(L) {
        for (var y = ht({ ampSpectrum: L.ampSpectrum, barkScale: L.barkScale }), $ = 0, O = 0; O < y.specific.length; O++) y.specific[O] > $ && ($ = y.specific[O]);
        return Math.pow((y.total - $) / y.total, 2);
      }, powerSpectrum: it, rms: function(L) {
        var y = L.signal;
        if (typeof y != "object") throw new TypeError();
        for (var $ = 0, O = 0; O < y.length; O++) $ += Math.pow(y[O], 2);
        return $ /= y.length, $ = Math.sqrt($);
      }, spectralCentroid: function(L) {
        var y = L.ampSpectrum;
        if (typeof y != "object") throw new TypeError();
        return He(1, y);
      }, spectralCrest: function(L) {
        var y = L.ampSpectrum;
        if (typeof y != "object") throw new TypeError();
        var $ = 0, O = -1 / 0;
        return y.forEach(function(J) {
          $ += Math.pow(J, 2), O = J > O ? J : O;
        }), $ /= y.length, $ = Math.sqrt($), O / $;
      }, spectralFlatness: function(L) {
        var y = L.ampSpectrum;
        if (typeof y != "object") throw new TypeError();
        for (var $ = 0, O = 0, J = 0; J < y.length; J++) $ += Math.log(y[J]), O += y[J];
        return Math.exp($ / y.length) * y.length / O;
      }, spectralFlux: function(L) {
        var y = L.signal, $ = L.previousSignal, O = L.bufferSize;
        if (typeof y != "object" || typeof $ != "object") throw new TypeError();
        for (var J = 0, de = -O / 2; de < y.length / 2 - 1; de++) x = Math.abs(y[de]) - Math.abs($[de]), J += (x + Math.abs(x)) / 2;
        return J;
      }, spectralKurtosis: function(L) {
        var y = L.ampSpectrum;
        if (typeof y != "object") throw new TypeError();
        var $ = y, O = He(1, $), J = He(2, $), de = He(3, $), Ce = He(4, $);
        return (-3 * Math.pow(O, 4) + 6 * O * J - 4 * O * de + Ce) / Math.pow(Math.sqrt(J - Math.pow(O, 2)), 4);
      }, spectralRolloff: function(L) {
        var y = L.ampSpectrum, $ = L.sampleRate;
        if (typeof y != "object") throw new TypeError();
        for (var O = y, J = $ / (2 * (O.length - 1)), de = 0, Ce = 0; Ce < O.length; Ce++) de += O[Ce];
        for (var ke = 0.99 * de, Te = O.length - 1; de > ke && Te >= 0; ) de -= O[Te], --Te;
        return (Te + 1) * J;
      }, spectralSkewness: function(L) {
        var y = L.ampSpectrum;
        if (typeof y != "object") throw new TypeError();
        var $ = He(1, y), O = He(2, y), J = He(3, y);
        return (2 * Math.pow($, 3) - 3 * $ * O + J) / Math.pow(Math.sqrt(O - Math.pow($, 2)), 3);
      }, spectralSlope: function(L) {
        var y = L.ampSpectrum, $ = L.sampleRate, O = L.bufferSize;
        if (typeof y != "object") throw new TypeError();
        for (var J = 0, de = 0, Ce = new Float32Array(y.length), ke = 0, Te = 0, xe = 0; xe < y.length; xe++) {
          J += y[xe];
          var Ne = xe * $ / O;
          Ce[xe] = Ne, ke += Ne * Ne, de += Ne, Te += Ne * y[xe];
        }
        return (y.length * Te - de * J) / (J * (ke - Math.pow(de, 2)));
      }, spectralSpread: function(L) {
        var y = L.ampSpectrum;
        if (typeof y != "object") throw new TypeError();
        return Math.sqrt(He(2, y) - Math.pow(He(1, y), 2));
      }, zcr: function(L) {
        var y = L.signal;
        if (typeof y != "object") throw new TypeError();
        for (var $ = 0, O = 1; O < y.length; O++) (y[O - 1] >= 0 && y[O] < 0 || y[O - 1] < 0 && y[O] >= 0) && $++;
        return $;
      } });
      function Qt(L) {
        if (Array.isArray(L)) {
          for (var y = 0, $ = Array(L.length); y < L.length; y++) $[y] = L[y];
          return $;
        }
        return Array.from(L);
      }
      var Et = {}, hr = {}, It = { bitReverseArray: function(L) {
        if (Et[L] === void 0) {
          for (var y = (L - 1).toString(2).length, $ = "0".repeat(y), O = {}, J = 0; J < L; J++) {
            var de = J.toString(2);
            de = $.substr(de.length) + de, de = [].concat(Qt(de)).reverse().join(""), O[J] = parseInt(de, 2);
          }
          Et[L] = O;
        }
        return Et[L];
      }, multiply: function(L, y) {
        return { real: L.real * y.real - L.imag * y.imag, imag: L.real * y.imag + L.imag * y.real };
      }, add: function(L, y) {
        return { real: L.real + y.real, imag: L.imag + y.imag };
      }, subtract: function(L, y) {
        return { real: L.real - y.real, imag: L.imag - y.imag };
      }, euler: function(L, y) {
        var $ = -2 * Math.PI * L / y;
        return { real: Math.cos($), imag: Math.sin($) };
      }, conj: function(L) {
        return L.imag *= -1, L;
      }, constructComplexArray: function(L) {
        var y = {};
        y.real = L.real === void 0 ? L.slice() : L.real.slice();
        var $ = y.real.length;
        return hr[$] === void 0 && (hr[$] = Array.apply(null, Array($)).map(Number.prototype.valueOf, 0)), y.imag = hr[$].slice(), y;
      } }, Pn = function(L) {
        var y = {};
        L.real === void 0 || L.imag === void 0 ? y = It.constructComplexArray(L) : (y.real = L.real.slice(), y.imag = L.imag.slice());
        var $ = y.real.length, O = Math.log2($);
        if (Math.round(O) != O) throw new Error("Input size must be a power of 2.");
        if (y.real.length != y.imag.length) throw new Error("Real and imaginary components must have the same length.");
        for (var J = It.bitReverseArray($), de = { real: [], imag: [] }, Ce = 0; Ce < $; Ce++) de.real[J[Ce]] = y.real[Ce], de.imag[J[Ce]] = y.imag[Ce];
        for (var ke = 0; ke < $; ke++) y.real[ke] = de.real[ke], y.imag[ke] = de.imag[ke];
        for (var Te = 1; Te <= O; Te++) for (var xe = Math.pow(2, Te), Ne = 0; Ne < xe / 2; Ne++) for (var pt = It.euler(Ne, xe), Ie = 0; Ie < $ / xe; Ie++) {
          var Ot = xe * Ie + Ne, Tt = xe * Ie + Ne + xe / 2, At = { real: y.real[Ot], imag: y.imag[Ot] }, kr = { real: y.real[Tt], imag: y.imag[Tt] }, tt = It.multiply(pt, kr), dt = It.subtract(At, tt);
          y.real[Tt] = dt.real, y.imag[Tt] = dt.imag;
          var vt = It.add(tt, At);
          y.real[Ot] = vt.real, y.imag[Ot] = vt.imag;
        }
        return y;
      }, Un = Pn, $n = function() {
        function L(y, $) {
          var O = this;
          if (this._m = $, !y.audioContext) throw this._m.errors.noAC;
          if (y.bufferSize && !z(y.bufferSize)) throw this._m._errors.notPow2;
          if (!y.source) throw this._m._errors.noSource;
          this._m.audioContext = y.audioContext, this._m.bufferSize = y.bufferSize || this._m.bufferSize || 256, this._m.hopSize = y.hopSize || this._m.hopSize || this._m.bufferSize, this._m.sampleRate = y.sampleRate || this._m.audioContext.sampleRate || 44100, this._m.callback = y.callback, this._m.windowingFunction = y.windowingFunction || "hanning", this._m.featureExtractors = et, this._m.EXTRACTION_STARTED = y.startImmediately || !1, this._m.channel = typeof y.channel == "number" ? y.channel : 0, this._m.inputs = y.inputs || 1, this._m.outputs = y.outputs || 1, this._m.numberOfMFCCCoefficients = y.numberOfMFCCCoefficients || this._m.numberOfMFCCCoefficients || 13, this._m.numberOfBarkBands = y.numberOfBarkBands || this._m.numberOfBarkBands || 24, this._m.spn = this._m.audioContext.createScriptProcessor(this._m.bufferSize, this._m.inputs, this._m.outputs), this._m.spn.connect(this._m.audioContext.destination), this._m._featuresToExtract = y.featureExtractors || [], this._m.barkScale = oe(this._m.bufferSize, this._m.sampleRate, this._m.bufferSize), this._m.melFilterBank = yt(Math.max(this._m.melBands, this._m.numberOfMFCCCoefficients), this._m.sampleRate, this._m.bufferSize), this._m.inputData = null, this._m.previousInputData = null, this._m.frame = null, this._m.previousFrame = null, this.setSource(y.source), this._m.spn.onaudioprocess = function(J) {
            var de;
            O._m.inputData !== null && (O._m.previousInputData = O._m.inputData), O._m.inputData = J.inputBuffer.getChannelData(O._m.channel), O._m.previousInputData ? ((de = new Float32Array(O._m.previousInputData.length + O._m.inputData.length - O._m.hopSize)).set(O._m.previousInputData.slice(O._m.hopSize)), de.set(O._m.inputData, O._m.previousInputData.length - O._m.hopSize)) : de = O._m.inputData;
            var Ce = function(ke, Te, xe) {
              if (ke.length < Te) throw new Error("Buffer is too short for frame length");
              if (xe < 1) throw new Error("Hop length cannot be less that 1");
              if (Te < 1) throw new Error("Frame length cannot be less that 1");
              var Ne = 1 + Math.floor((ke.length - Te) / xe);
              return new Array(Ne).fill(0).map(function(pt, Ie) {
                return ke.slice(Ie * xe, Ie * xe + Te);
              });
            }(de, O._m.bufferSize, O._m.hopSize);
            Ce.forEach(function(ke) {
              O._m.frame = ke;
              var Te = O._m.extract(O._m._featuresToExtract, O._m.frame, O._m.previousFrame);
              typeof O._m.callback == "function" && O._m.EXTRACTION_STARTED && O._m.callback(Te), O._m.previousFrame = O._m.frame;
            });
          };
        }
        return L.prototype.start = function(y) {
          this._m._featuresToExtract = y || this._m._featuresToExtract, this._m.EXTRACTION_STARTED = !0;
        }, L.prototype.stop = function() {
          this._m.EXTRACTION_STARTED = !1;
        }, L.prototype.setSource = function(y) {
          this._m.source && this._m.source.disconnect(this._m.spn), this._m.source = y, this._m.source.connect(this._m.spn);
        }, L.prototype.setChannel = function(y) {
          y <= this._m.inputs ? this._m.channel = y : console.error("Channel ".concat(y, " does not exist. Make sure you've provided a value for 'inputs' that is greater than ").concat(y, " when instantiating the MeydaAnalyzer"));
        }, L.prototype.get = function(y) {
          return this._m.inputData ? this._m.extract(y || this._m._featuresToExtract, this._m.inputData, this._m.previousInputData) : null;
        }, L;
      }(), Gr = { audioContext: null, spn: null, bufferSize: 512, sampleRate: 44100, melBands: 26, chromaBands: 12, callback: null, windowingFunction: "hanning", featureExtractors: et, EXTRACTION_STARTED: !1, numberOfMFCCCoefficients: 13, numberOfBarkBands: 24, _featuresToExtract: [], windowing: ve, _errors: { notPow2: new Error("Meyda: Buffer size must be a power of 2, e.g. 64 or 512"), featureUndef: new Error("Meyda: No features defined."), invalidFeatureFmt: new Error("Meyda: Invalid feature format"), invalidInput: new Error("Meyda: Invalid input."), noAC: new Error("Meyda: No AudioContext specified."), noSource: new Error("Meyda: No source node specified.") }, createMeydaAnalyzer: function(L) {
        return new $n(L, Object.assign({}, Gr));
      }, listAvailableFeatureExtractors: function() {
        return Object.keys(this.featureExtractors);
      }, extract: function(L, y, $) {
        var O = this;
        if (!y) throw this._errors.invalidInput;
        if (typeof y != "object") throw this._errors.invalidInput;
        if (!L) throw this._errors.featureUndef;
        if (!z(y.length)) throw this._errors.notPow2;
        this.barkScale !== void 0 && this.barkScale.length == this.bufferSize || (this.barkScale = oe(this.bufferSize, this.sampleRate, this.bufferSize)), this.melFilterBank !== void 0 && this.barkScale.length == this.bufferSize && this.melFilterBank.length == this.melBands || (this.melFilterBank = yt(Math.max(this.melBands, this.numberOfMFCCCoefficients), this.sampleRate, this.bufferSize)), this.chromaFilterBank !== void 0 && this.chromaFilterBank.length == this.chromaBands || (this.chromaFilterBank = Ve(this.chromaBands, this.sampleRate, this.bufferSize)), "buffer" in y && y.buffer === void 0 ? this.signal = ge(y) : this.signal = y;
        var J = Mr(y, this.windowingFunction, this.bufferSize);
        if (this.signal = J.windowedSignal, this.complexSpectrum = J.complexSpectrum, this.ampSpectrum = J.ampSpectrum, $) {
          var de = Mr($, this.windowingFunction, this.bufferSize);
          this.previousSignal = de.windowedSignal, this.previousComplexSpectrum = de.complexSpectrum, this.previousAmpSpectrum = de.ampSpectrum;
        }
        var Ce = function(ke) {
          return O.featureExtractors[ke]({ ampSpectrum: O.ampSpectrum, chromaFilterBank: O.chromaFilterBank, complexSpectrum: O.complexSpectrum, signal: O.signal, bufferSize: O.bufferSize, sampleRate: O.sampleRate, barkScale: O.barkScale, melFilterBank: O.melFilterBank, previousSignal: O.previousSignal, previousAmpSpectrum: O.previousAmpSpectrum, previousComplexSpectrum: O.previousComplexSpectrum, numberOfMFCCCoefficients: O.numberOfMFCCCoefficients, numberOfBarkBands: O.numberOfBarkBands });
        };
        if (typeof L == "object") return L.reduce(function(ke, Te) {
          var xe;
          return Object.assign({}, ke, ((xe = {})[Te] = Ce(Te), xe));
        }, {});
        if (typeof L == "string") return Ce(L);
        throw this._errors.invalidFeatureFmt;
      } }, Mr = function(L, y, $) {
        var O = {};
        L.buffer === void 0 ? O.signal = ge(L) : O.signal = L, O.windowedSignal = ve(O.signal, y), O.complexSpectrum = Un(O.windowedSignal), O.ampSpectrum = new Float32Array($ / 2);
        for (var J = 0; J < $ / 2; J++) O.ampSpectrum[J] = Math.sqrt(Math.pow(O.complexSpectrum.real[J], 2) + Math.pow(O.complexSpectrum.imag[J], 2));
        return O;
      };
      return typeof window < "u" && (window.Meyda = Gr), Gr;
    });
  })(rs);
  var qc = rs.exports;
  const Kc = /* @__PURE__ */ Va(qc);
  class Qc {
    constructor({
      numBins: r = 4,
      cutoff: l = 2,
      smooth: g = 0.4,
      max: A = 15,
      scale: z = 10,
      isDrawing: ve = !1,
      parentEl: oe = document.body
    }) {
      this.vol = 0, this.scale = z, this.max = A, this.cutoff = l, this.smooth = g, this.setBins(r), this.beat = {
        holdFrames: 20,
        threshold: 40,
        _cutoff: 0,
        // adaptive based on sound state
        decay: 0.98,
        _framesSinceBeat: 0
        // keeps track of frames
      }, this.onBeat = () => {
      }, this.canvas = document.createElement("canvas"), this.canvas.width = 100, this.canvas.height = 80, this.canvas.style.width = "100px", this.canvas.style.height = "80px", this.canvas.style.position = "absolute", this.canvas.style.right = "0px", this.canvas.style.bottom = "0px", oe.appendChild(this.canvas), this.isDrawing = ve, this.ctx = this.canvas.getContext("2d"), this.ctx.fillStyle = "#DFFFFF", this.ctx.strokeStyle = "#0ff", this.ctx.lineWidth = 0.5, window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia({ video: !1, audio: !0 }).then((ge) => {
        this.stream = ge, this.context = new AudioContext();
        let ye = this.context.createMediaStreamSource(ge);
        this.meyda = Kc.createMeydaAnalyzer({
          audioContext: this.context,
          source: ye,
          featureExtractors: [
            "loudness"
            //  'perceptualSpread',
            //  'perceptualSharpness',
            //  'spectralCentroid'
          ]
        });
      }).catch((ge) => console.log("ERROR", ge));
    }
    detectBeat(r) {
      r > this.beat._cutoff && r > this.beat.threshold ? (this.onBeat(), this.beat._cutoff = r * 1.2, this.beat._framesSinceBeat = 0) : this.beat._framesSinceBeat <= this.beat.holdFrames ? this.beat._framesSinceBeat++ : (this.beat._cutoff *= this.beat.decay, this.beat._cutoff = Math.max(this.beat._cutoff, this.beat.threshold));
    }
    tick() {
      if (this.meyda) {
        var r = this.meyda.get();
        if (r && r !== null) {
          this.vol = r.loudness.total, this.detectBeat(this.vol);
          const l = (A, z) => A + z;
          let g = Math.floor(r.loudness.specific.length / this.bins.length);
          this.prevBins = this.bins.slice(0), this.bins = this.bins.map((A, z) => r.loudness.specific.slice(z * g, (z + 1) * g).reduce(l)).map((A, z) => A * (1 - this.settings[z].smooth) + this.prevBins[z] * this.settings[z].smooth), this.fft = this.bins.map((A, z) => (
            // Math.max(0, (bin - this.cutoff) / (this.max - this.cutoff))
            Math.max(0, (A - this.settings[z].cutoff) / this.settings[z].scale)
          )), this.isDrawing && this.draw();
        }
      }
    }
    setCutoff(r) {
      this.cutoff = r, this.settings = this.settings.map((l) => (l.cutoff = r, l));
    }
    setSmooth(r) {
      this.smooth = r, this.settings = this.settings.map((l) => (l.smooth = r, l));
    }
    setBins(r) {
      this.bins = Array(r).fill(0), this.prevBins = Array(r).fill(0), this.fft = Array(r).fill(0), this.settings = Array(r).fill(0).map(() => ({
        cutoff: this.cutoff,
        scale: this.scale,
        smooth: this.smooth
      })), this.bins.forEach((l, g) => {
        window["a" + g] = (A = 1, z = 0) => () => a.fft[g] * A + z;
      });
    }
    setScale(r) {
      this.scale = r, this.settings = this.settings.map((l) => (l.scale = r, l));
    }
    setMax(r) {
      this.max = r, console.log("set max is deprecated");
    }
    hide() {
      this.isDrawing = !1, this.canvas.style.display = "none";
    }
    show() {
      this.isDrawing = !0, this.canvas.style.display = "block";
    }
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var r = this.canvas.width / this.bins.length, l = this.canvas.height / (this.max * 2);
      this.bins.forEach((g, A) => {
        var z = g * l;
        this.ctx.fillRect(A * r, this.canvas.height - z, r, z);
        var ve = this.canvas.height - l * this.settings[A].cutoff;
        this.ctx.beginPath(), this.ctx.moveTo(A * r, ve), this.ctx.lineTo((A + 1) * r, ve), this.ctx.stroke();
        var oe = this.canvas.height - l * (this.settings[A].scale + this.settings[A].cutoff);
        this.ctx.beginPath(), this.ctx.moveTo(A * r, oe), this.ctx.lineTo((A + 1) * r, oe), this.ctx.stroke();
      });
    }
  }
  class Zc {
    constructor(r) {
      this.mediaSource = new MediaSource(), this.stream = r, this.output = document.createElement("video"), this.output.autoplay = !0, this.output.loop = !0;
      let l = this;
      this.mediaSource.addEventListener("sourceopen", () => {
        console.log("MediaSource opened"), l.sourceBuffer = l.mediaSource.addSourceBuffer('video/webm; codecs="vp8"'), console.log("Source buffer: ", sourceBuffer);
      });
    }
    start() {
      let r = { mimeType: "video/webm;codecs=vp9" };
      this.recordedBlobs = [];
      try {
        this.mediaRecorder = new MediaRecorder(this.stream, r);
      } catch (l) {
        console.log("Unable to create MediaRecorder with options Object: ", l);
        try {
          r = { mimeType: "video/webm,codecs=vp9" }, this.mediaRecorder = new MediaRecorder(this.stream, r);
        } catch (g) {
          console.log("Unable to create MediaRecorder with options Object: ", g);
          try {
            r = "video/vp8", this.mediaRecorder = new MediaRecorder(this.stream, r);
          } catch (A) {
            alert(`MediaRecorder is not supported by this browser.

Try Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags.`), console.error("Exception while creating MediaRecorder:", A);
            return;
          }
        }
      }
      console.log("Created MediaRecorder", this.mediaRecorder, "with options", r), this.mediaRecorder.onstop = this._handleStop.bind(this), this.mediaRecorder.ondataavailable = this._handleDataAvailable.bind(this), this.mediaRecorder.start(100), console.log("MediaRecorder started", this.mediaRecorder);
    }
    stop() {
      this.mediaRecorder.stop();
    }
    _handleStop() {
      const r = new Blob(this.recordedBlobs, { type: this.mediaRecorder.mimeType }), l = window.URL.createObjectURL(r);
      this.output.src = l;
      const g = document.createElement("a");
      g.style.display = "none", g.href = l;
      let A = /* @__PURE__ */ new Date();
      g.download = `hydra-${A.getFullYear()}-${A.getMonth() + 1}-${A.getDate()}-${A.getHours()}.${A.getMinutes()}.${A.getSeconds()}.webm`, document.body.appendChild(g), g.click(), setTimeout(() => {
        document.body.removeChild(g), window.URL.revokeObjectURL(l);
      }, 300);
    }
    _handleDataAvailable(r) {
      r.data && r.data.size > 0 && this.recordedBlobs.push(r.data);
    }
  }
  const Pa = {
    // no easing, no acceleration
    linear: function(i) {
      return i;
    },
    // accelerating from zero velocity
    easeInQuad: function(i) {
      return i * i;
    },
    // decelerating to zero velocity
    easeOutQuad: function(i) {
      return i * (2 - i);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function(i) {
      return i < 0.5 ? 2 * i * i : -1 + (4 - 2 * i) * i;
    },
    // accelerating from zero velocity
    easeInCubic: function(i) {
      return i * i * i;
    },
    // decelerating to zero velocity
    easeOutCubic: function(i) {
      return --i * i * i + 1;
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function(i) {
      return i < 0.5 ? 4 * i * i * i : (i - 1) * (2 * i - 2) * (2 * i - 2) + 1;
    },
    // accelerating from zero velocity
    easeInQuart: function(i) {
      return i * i * i * i;
    },
    // decelerating to zero velocity
    easeOutQuart: function(i) {
      return 1 - --i * i * i * i;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function(i) {
      return i < 0.5 ? 8 * i * i * i * i : 1 - 8 * --i * i * i * i;
    },
    // accelerating from zero velocity
    easeInQuint: function(i) {
      return i * i * i * i * i;
    },
    // decelerating to zero velocity
    easeOutQuint: function(i) {
      return 1 + --i * i * i * i * i;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function(i) {
      return i < 0.5 ? 16 * i * i * i * i * i : 1 + 16 * --i * i * i * i * i;
    },
    // sin shape
    sin: function(i) {
      return (1 + Math.sin(Math.PI * i - Math.PI / 2)) / 2;
    }
  };
  var Jc = (i, r, l, g, A) => (i - r) * (A - g) / (l - r) + g, Ua = (i, r) => (i % r + r) % r;
  const ns = {
    init: () => {
      Array.prototype.fast = function(i = 1) {
        return this._speed = i, this;
      }, Array.prototype.smooth = function(i = 1) {
        return this._smooth = i, this;
      }, Array.prototype.ease = function(i = "linear") {
        return typeof i == "function" ? (this._smooth = 1, this._ease = i) : Pa[i] && (this._smooth = 1, this._ease = Pa[i]), this;
      }, Array.prototype.offset = function(i = 0.5) {
        return this._offset = i % 1, this;
      }, Array.prototype.fit = function(i = 0, r = 1) {
        let l = Math.min(...this), g = Math.max(...this);
        var A = this.map((z) => Jc(z, l, g, i, r));
        return A._speed = this._speed, A._smooth = this._smooth, A._ease = this._ease, A;
      };
    },
    getValue: (i = []) => ({ time: r, bpm: l }) => {
      let g = i._speed ? i._speed : 1, A = i._smooth ? i._smooth : 0, z = r * g * (l / 60) + (i._offset || 0);
      if (A !== 0) {
        let ve = i._ease ? i._ease : Pa.linear, oe = z - A / 2, ge = i[Math.floor(Ua(oe, i.length))], ye = i[Math.floor(Ua(oe + 1, i.length))], yt = Math.min(Ua(oe, 1) / A, 1);
        return ve(yt) * (ye - ge) + ge;
      } else
        return i[Math.floor(z % i.length)], i[Math.floor(z % i.length)];
    }
  }, el = (i) => {
    var r = "", l = A(r), g = (z, ve) => {
      r += `
      var ${z} = ${ve}
    `, l = A(r);
    };
    return {
      addToContext: g,
      eval: (z) => l.eval(z)
    };
    function A(z) {
      globalThis.eval(z);
      var ve = function(oe) {
        globalThis.eval(oe);
      };
      return {
        eval: ve
      };
    }
  };
  class tl {
    constructor(r, l, g = []) {
      this.makeGlobal = l, this.sandbox = el(), this.parent = r;
      var A = Object.keys(r);
      A.forEach((z) => this.add(z)), this.userProps = g;
    }
    add(r) {
      this.makeGlobal && (window[r] = this.parent[r]);
    }
    // sets on window as well as synth object if global (not needed for objects, which can be set directly)
    set(r, l) {
      this.makeGlobal && (window[r] = l), this.parent[r] = l;
    }
    tick() {
      this.makeGlobal && this.userProps.forEach((r) => {
        this.parent[r] = window[r];
      });
    }
    eval(r) {
      this.sandbox.eval(r);
    }
  }
  const rl = {
    float: {
      vec4: { name: "sum", args: [[1, 1, 1, 1]] },
      vec2: { name: "sum", args: [[1, 1]] }
    }
  }, $a = (i) => (i = i.toString(), i.indexOf(".") < 0 && (i += "."), i);
  function nl(i, r, l) {
    const g = i.transform.inputs, A = i.userArgs, { generators: z } = i.synth, { src: ve } = z;
    return g.map((oe, ge) => {
      const ye = {
        value: oe.default,
        type: oe.type,
        //
        isUniform: !1,
        name: oe.name,
        vecLen: 0
        //  generateGlsl: null // function for creating glsl
      };
      if (ye.type === "float" && (ye.value = $a(oe.default)), oe.type.startsWith("vec"))
        try {
          ye.vecLen = Number.parseInt(oe.type.substr(3));
        } catch {
          console.log(`Error determining length of vector input type ${oe.type} (${oe.name})`);
        }
      if (A.length > ge) {
        if (ye.value = A[ge], ye.type === "vec4" && !(ye.value.type === "GlslSource" || ye.value.getTexture))
          throw new Error("Arguments must be a texture or GlslSource");
        typeof A[ge] == "function" ? (ye.value = (He, ht, it) => {
          try {
            const _t = A[ge](ht);
            return typeof _t == "number" ? _t : (console.warn("function does not return a number", A[ge]), oe.default);
          } catch (_t) {
            return console.warn("ERROR", _t), oe.default;
          }
        }, ye.isUniform = !0) : A[ge].constructor === Array && (ye.value = (He, ht, it) => ns.getValue(A[ge])(ht), ye.isUniform = !0);
      }
      if (!(r < 0)) {
        if (ye.value && ye.value.transforms) {
          const He = ye.value.transforms[ye.value.transforms.length - 1];
          if (He.transform.glsl_return_type !== oe.type) {
            const ht = rl[oe.type];
            if (typeof ht < "u") {
              const it = ht[He.transform.glsl_return_type];
              if (typeof it < "u") {
                const { name: _t, args: Kt } = it;
                ye.value = ye.value[_t](...Kt);
              }
            }
          }
          ye.isUniform = !1;
        } else if (ye.type === "float" && typeof ye.value == "number")
          ye.value = $a(ye.value);
        else if (ye.type.startsWith("vec") && typeof ye.value == "object" && Array.isArray(ye.value))
          ye.isUniform = !1, ye.value = `${ye.type}(${ye.value.map($a).join(", ")})`;
        else if (oe.type === "sampler2D") {
          var yt = ye.value;
          ye.value = () => yt.getTexture(), ye.isUniform = !0;
        } else if (ye.value.getTexture && oe.type === "vec4") {
          var Ve = ye.value;
          ye.value = ve(Ve), ye.isUniform = !1;
        }
        ye.isUniform && (ye.name += r);
      }
      return ye;
    });
  }
  function al(i) {
    var r = {
      uniforms: [],
      // list of uniforms used in shader
      glslFunctions: [],
      // list of functions used in shader
      fragColor: ""
    }, l = as(i, r)("c", "st");
    r.fragColor = l;
    let g = {};
    return r.uniforms.forEach((A) => g[A.name] = A), r.uniforms = Object.values(g), r;
  }
  function ja(i, r) {
    return `${i}_i${r}`;
  }
  function as(i, r) {
    var l = (g, A) => "";
    return i.forEach((g, A) => {
      let z = nl(g, r.uniforms.length);
      z.forEach((oe) => {
        oe.isUniform && r.uniforms.push(oe);
      }), il(g, r.glslFunctions) || r.glslFunctions.push(g);
      var ve = l;
      g.transform.type === "src" ? l = (oe, ge) => `${en(z, r)(`${oe}${A}`, ge)}
         vec4 ${oe} = ${tn(`${oe}${A}`, ge, g.name, z)};` : g.transform.type === "color" ? l = (oe, ge) => `${en(z, r)(`${oe}${A}`, ge)}
         ${ve(oe, ge)}
         ${oe} = ${tn(`${oe}${A}`, `${oe}`, g.name, z)};` : g.transform.type === "coord" ? l = (oe, ge) => `${en(z, r)(`${oe}${A}`, ge)}
         ${ge} = ${tn(`${oe}${A}`, `${ge}`, g.name, z)};
         ${ve(oe, ge)}` : g.transform.type === "combine" ? l = (oe, ge) => (
        // combining two generated shader strings (i.e. for blend, mult, add funtions)
        `${en(z, r)(`${oe}${A}`, ge)}
         ${ve(oe, ge)}
         ${oe} = ${tn(`${oe}${A}`, `${oe}`, g.name, z)};`
      ) : g.transform.type === "combineCoord" && (l = (oe, ge) => `${en(z, r)(`${oe}${A}`, ge)}
         ${ge} = ${tn(`${oe}${A}`, `${ge}`, g.name, z)};
         ${ve(oe, ge)}`);
    }), l;
  }
  function en(i, r) {
    let l = (A, z) => "";
    var g = l;
    return i.forEach((A, z) => {
      A.value.transforms && (g = l, l = (ve, oe) => {
        let ge = ja(ve, z), ye = ja(`${oe}_${ve}`, z);
        return `vec2 ${ye} = ${oe};${g(ve, oe)}
         ${as(A.value.transforms, r)(ge, ye)}`;
      });
    }), l;
  }
  function tn(i, r, l, g) {
    const A = g.map((z, ve) => z.isUniform ? z.name : z.value && z.value.transforms ? ja(i, ve) : z.value).reduce((z, ve) => `${z}, ${ve}`, "");
    return `${l}(${r}${A})`;
  }
  function il(i, r) {
    for (var l = 0; l < r.length; l++)
      if (i.name == r[l].name) return !0;
    return !1;
  }
  const ol = {
    _luminance: {
      type: "util",
      glsl: `float _luminance(vec3 rgb){
      const vec3 W = vec3(0.2125, 0.7154, 0.0721);
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
        }`
    },
    _hsvToRgb: {
      type: "util",
      glsl: `vec3 _hsvToRgb(vec3 c){
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }`
    }
  };
  var on = function(i) {
    return this.transforms = [], this.transforms.push(i), this.defaultOutput = i.defaultOutput, this.synth = i.synth, this.type = "GlslSource", this.defaultUniforms = i.defaultUniforms, this;
  };
  on.prototype.addTransform = function(i) {
    this.transforms.push(i);
  };
  on.prototype.out = function(i) {
    var r = i || this.defaultOutput;
    if (r) try {
      var l = this.glsl(r);
      this.synth.currentFunctions = [], r.render(l);
    } catch (g) {
      console.warn("shader could not compile", g);
    }
  };
  on.prototype.glsl = function() {
    var i = [], r = [];
    return this.transforms.forEach((l) => {
      l.transform.type === "renderpass" ? console.warn("no support for renderpass") : r.push(l);
    }), r.length > 0 && i.push(this.compile(r)), i;
  };
  on.prototype.compile = function(i) {
    var r = al(i, this.synth), l = {};
    r.uniforms.forEach((A) => {
      l[A.name] = A.value;
    });
    var g = `#version 300 es
  precision ${this.defaultOutput.precision} float;
  ${Object.values(r.uniforms).map((A) => {
      let z = A.type;
      switch (A.type) {
        case "texture":
          z = "sampler2D";
          break;
      }
      return `
      uniform ${z} ${A.name};`;
    }).join("")}
  uniform float time;
  uniform vec2 resolution;
  in vec2 uv;
  out vec4 fragColor;
  uniform sampler2D prevBuffer;

  ${Object.values(ol).map((A) => `
            ${A.glsl}
          `).join("")}

  ${r.glslFunctions.map((A) => `
            ${A.transform.glsl}
          `).join("")}

  void main () {
    vec2 st = gl_FragCoord.xy/resolution.xy;

    ${r.fragColor}
    fragColor = c;
  }
  `;
    return {
      frag: g,
      uniforms: Object.assign({}, this.defaultUniforms, l)
    };
  };
  const sl = () => [
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
      glsl: "   return vec4(vec3(_noise(vec3(_st*scale, offset*time))), 1.0);"
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
   return vec4(color, 1.0);`
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
   return vec4(r, g, b, 1.0);`
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
   return vec4(vec3(1.0-smoothstep(radius,radius + smoothing + 0.0000001,d)), 1.0);`
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
      glsl: "   return vec4(_st, sin(time*speed), 1.0);"
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
      glsl3: `   //  vec2 uv = gl_FragCoord.xy/vec2(1280., 720.);
   return texture(tex, fract(_st));`
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
      glsl: "   return vec4(r, g, b, a);"
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
   `
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
   return (floor(_st * xy) + 0.5)/xy;`
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
   return vec4(c2.xyz, _c0.a);`
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
   return vec4(c2.rgba);`
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
   return r*vec2(cos(a), sin(a));`
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
   return (_c0.r+r)*vec2(cos(a), sin(a));`
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
   return fract(_st);`
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
   return fract(_st);`
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
   return fract(_st);`
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
   return fract(_st);`
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
   return fract(_st);`
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
      glsl: "   return (_c0+_c1)*amount + _c0*(1.0-amount);"
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
      glsl: "   return (_c0-_c1)*amount + _c0*(1.0-amount);"
    },
    {
      name: "layer",
      type: "combine",
      inputs: [],
      glsl: "   return vec4(mix(_c0.rgb, _c1.rgb, _c1.a), clamp(_c0.a + _c1.a, 0.0, 1.0));"
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
      glsl: "   return _c0*(1.0-amount)+_c1*amount;"
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
      glsl: "   return _c0*(1.0-amount)+(_c0*_c1)*amount;"
    },
    {
      name: "diff",
      type: "combine",
      inputs: [],
      glsl: "   return vec4(abs(_c0.rgb-_c1.rgb), max(_c0.a, _c1.a));"
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
   return _st + _c0.xy*amount;`
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
   return (floor(_st * xy) + 0.5)/xy;`
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
      glsl: "   return _st + (vec2(_c0.g - _c0.r, _c0.b - _c0.g) * amount * 1.0/resolution);"
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
      glsl: "   return vec4((1.0-_c0.rgb)*amount + _c0.rgb*(1.0-amount), _c0.a);"
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
   return vec4(c.rgb, _c0.a);`
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
      glsl: "   return vec4(_c0.rgb + vec3(amount), _c0.a);"
    },
    {
      name: "mask",
      type: "combine",
      inputs: [],
      glsl: `   float a = _luminance(_c1.rgb);
  return vec4(_c0.rgb*a, a*_c0.a);`
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
   return vec4(_c0.rgb*a, a);`
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
      glsl: "   return vec4(vec3(smoothstep(threshold-(tolerance+0.0000001), threshold+(tolerance+0.0000001), _luminance(_c0.rgb))), _c0.a);"
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
   return vec4(mix((1.0-_c0)*abs(c), c*_c0, pos));`
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
   return vec4(mix(intensity, _c0.rgb, amount), _c0.a);`
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
   return vec4(_hsvToRgb(c), _c0.a);`
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
   return vec4(c, _c0.a);`
    },
    {
      name: "prev",
      type: "src",
      inputs: [],
      glsl: "   return texture2D(prevBuffer, fract(_st));",
      glsl3: "   return texture(prevBuffer, fract(_st));"
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
   return v.x + v.y;`
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
      glsl: "   return vec4(_c0.r * scale + offset);"
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
      glsl: "   return vec4(_c0.g * scale + offset);"
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
      glsl: "   return vec4(_c0.b * scale + offset);"
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
      glsl: "   return vec4(_c0.a * scale + offset);"
    }
  ];
  function fl(i) {
    if (!i || typeof i != "string")
      return i;
    let r = i;
    return r = r.replace(/\btexture2D\s*\(/g, "texture("), r = r.replace(/\btexture2DLod\s*\(/g, "textureLod("), r = r.replace(/\btexture2DProj\s*\(/g, "textureProj("), r = r.replace(/\btextureCube\s*\(/g, "texture("), r = r.replace(/\btextureCubeLod\s*\(/g, "textureLod("), r = r.replace(/\bshadow2D\s*\(/g, "texture("), r = r.replace(/\bshadow2DProj\s*\(/g, "textureProj("), r;
  }
  function ul(i) {
    return !i || typeof i != "string" ? !1 : [
      /\btexture2D\s*\(/,
      /\btexture2DLod\s*\(/,
      /\btexture2DProj\s*\(/,
      /\btextureCube\s*\(/,
      /\btextureCubeLod\s*\(/,
      /\bshadow2D\s*\(/,
      /\bshadow2DProj\s*\(/
    ].some((l) => l.test(i));
  }
  class cl {
    constructor({
      defaultUniforms: r,
      defaultOutput: l,
      extendTransforms: g = [],
      changeListener: A = () => {
      }
    } = {}) {
      this.defaultOutput = l, this.defaultUniforms = r, this.changeListener = A, this.extendTransforms = g, this.generators = {}, this.init();
    }
    init() {
      const r = sl();
      return this.glslTransforms = {}, this.generators = Object.entries(this.generators).reduce((l, [g, A]) => (this.changeListener({ type: "remove", synth: this, method: g }), l), {}), this.sourceClass = class extends on {
      }, Array.isArray(this.extendTransforms) ? r.concat(this.extendTransforms) : typeof this.extendTransforms == "object" && this.extendTransforms.type && r.push(this.extendTransforms), r.map((l) => this.setFunction(l));
    }
    _addMethod(r, l) {
      const g = this;
      if (this.glslTransforms[r] = l, l.type === "src") {
        const A = (...z) => new this.sourceClass({
          name: r,
          transform: l,
          userArgs: z,
          defaultOutput: this.defaultOutput,
          defaultUniforms: this.defaultUniforms,
          synth: g
        });
        return this.generators[r] = A, this.changeListener({ type: "add", synth: this, method: r }), A;
      } else
        this.sourceClass.prototype[r] = function(...A) {
          return this.transforms.push({ name: r, transform: l, userArgs: A, synth: g }), this;
        };
    }
    setFunction(r) {
      var l = ll(r);
      l && this._addMethod(r.name, l);
    }
  }
  const Jo = {
    src: {
      returnType: "vec4",
      args: [{ type: "vec2", name: "_st" }]
    },
    coord: {
      returnType: "vec2",
      args: [{ type: "vec2", name: "_st" }]
    },
    color: {
      returnType: "vec4",
      args: [{ type: "vec4", name: "_c0" }]
    },
    combine: {
      returnType: "vec4",
      args: [
        { type: "vec4", name: "_c0" },
        { type: "vec4", name: "_c1" }
      ]
    },
    combineCoord: {
      returnType: "vec2",
      args: [
        { type: "vec2", name: "_st" },
        { type: "vec4", name: "_c0" }
      ]
    }
  };
  function ll(i) {
    let r = Jo[i.type];
    if (r) {
      let l = r.args.concat(i.inputs), g = l.map((ve) => `${ve.type} ${ve.name}`).join(", "), A = i.glsl3 || i.glsl;
      !i.glsl3 && ul(A) && (A = fl(A));
      let z = `
  ${r.returnType} ${i.name}(${g}) {
      ${A}
  }
`;
      return i.inputs = l.slice(1), Object.assign({}, i, { glsl: z });
    } else
      console.warn(`type ${i.type} not recognized`, i, Jo);
  }
  var is = { exports: {} };
  (function(i, r) {
    (function(l, g) {
      i.exports = g();
    })(Xa, function() {
      var l = function(e) {
        return e instanceof Uint8Array || e instanceof Uint16Array || e instanceof Uint32Array || e instanceof Int8Array || e instanceof Int16Array || e instanceof Int32Array || e instanceof Float32Array || e instanceof Float64Array || e instanceof Uint8ClampedArray;
      }, g = function(e, n) {
        for (var d = Object.keys(n), F = 0; F < d.length; ++F)
          e[d[F]] = n[d[F]];
        return e;
      }, A = `
`;
      function z(e) {
        return typeof atob < "u" ? atob(e) : "base64:" + e;
      }
      function ve(e) {
        var n = new Error("(regl) " + e);
        throw console.error(n), n;
      }
      function oe(e, n) {
        e || ve(n);
      }
      function ge(e) {
        return e ? ": " + e : "";
      }
      function ye(e, n, d) {
        e in n || ve("unknown parameter (" + e + ")" + ge(d) + ". possible values: " + Object.keys(n).join());
      }
      function yt(e, n) {
        l(e) || ve(
          "invalid parameter type" + ge(n) + ". must be a typed array"
        );
      }
      function Ve(e, n) {
        switch (n) {
          case "number":
            return typeof e == "number";
          case "object":
            return typeof e == "object";
          case "string":
            return typeof e == "string";
          case "boolean":
            return typeof e == "boolean";
          case "function":
            return typeof e == "function";
          case "undefined":
            return typeof e > "u";
          case "symbol":
            return typeof e == "symbol";
        }
      }
      function He(e, n, d) {
        Ve(e, n) || ve(
          "invalid parameter type" + ge(d) + ". expected " + n + ", got " + typeof e
        );
      }
      function ht(e, n) {
        e >= 0 && (e | 0) === e || ve("invalid parameter type, (" + e + ")" + ge(n) + ". must be a nonnegative integer");
      }
      function it(e, n, d) {
        n.indexOf(e) < 0 && ve("invalid value" + ge(d) + ". must be one of: " + n);
      }
      var _t = [
        "gl",
        "canvas",
        "container",
        "attributes",
        "pixelRatio",
        "extensions",
        "optionalExtensions",
        "profile",
        "onDone"
      ];
      function Kt(e) {
        Object.keys(e).forEach(function(n) {
          _t.indexOf(n) < 0 && ve('invalid regl constructor argument "' + n + '". must be one of ' + _t);
        });
      }
      function mt(e, n) {
        for (e = e + ""; e.length < n; )
          e = " " + e;
        return e;
      }
      function Pe() {
        this.name = "unknown", this.lines = [], this.index = {}, this.hasErrors = !1;
      }
      function et(e, n) {
        this.number = e, this.line = n, this.errors = [];
      }
      function Qt(e, n, d) {
        this.file = e, this.line = n, this.message = d;
      }
      function Et() {
        var e = new Error(), n = (e.stack || e).toString(), d = /compileProcedure.*\n\s*at.*\((.*)\)/.exec(n);
        if (d)
          return d[1];
        var F = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(n);
        return F ? F[1] : "unknown";
      }
      function hr() {
        var e = new Error(), n = (e.stack || e).toString(), d = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(n);
        if (d)
          return d[1];
        var F = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(n);
        return F ? F[1] : "unknown";
      }
      function It(e, n) {
        var d = e.split(`
`), F = 1, N = 0, C = {
          unknown: new Pe(),
          0: new Pe()
        };
        C.unknown.name = C[0].name = n || Et(), C.unknown.lines.push(new et(0, ""));
        for (var M = 0; M < d.length; ++M) {
          var V = d[M], W = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(V);
          if (W)
            switch (W[1]) {
              case "line":
                var Q = /(\d+)(\s+\d+)?/.exec(W[2]);
                Q && (F = Q[1] | 0, Q[2] && (N = Q[2] | 0, N in C || (C[N] = new Pe())));
                break;
              case "define":
                var Y = /SHADER_NAME(_B64)?\s+(.*)$/.exec(W[2]);
                Y && (C[N].name = Y[1] ? z(Y[2]) : Y[2]);
                break;
            }
          C[N].lines.push(new et(F++, V));
        }
        return Object.keys(C).forEach(function(ee) {
          var ae = C[ee];
          ae.lines.forEach(function(H) {
            ae.index[H.number] = H;
          });
        }), C;
      }
      function Pn(e) {
        var n = [];
        return e.split(`
`).forEach(function(d) {
          if (!(d.length < 5)) {
            var F = /^ERROR:\s+(\d+):(\d+):\s*(.*)$/.exec(d);
            F ? n.push(new Qt(
              F[1] | 0,
              F[2] | 0,
              F[3].trim()
            )) : d.length > 0 && n.push(new Qt("unknown", 0, d));
          }
        }), n;
      }
      function Un(e, n) {
        n.forEach(function(d) {
          var F = e[d.file];
          if (F) {
            var N = F.index[d.line];
            if (N) {
              N.errors.push(d), F.hasErrors = !0;
              return;
            }
          }
          e.unknown.hasErrors = !0, e.unknown.lines[0].errors.push(d);
        });
      }
      function $n(e, n, d, F, N) {
        if (!e.getShaderParameter(n, e.COMPILE_STATUS)) {
          var C = e.getShaderInfoLog(n), M = F === e.FRAGMENT_SHADER ? "fragment" : "vertex";
          J(d, "string", M + " shader source must be a string", N);
          var V = It(d, N), W = Pn(C);
          Un(V, W), Object.keys(V).forEach(function(Q) {
            var Y = V[Q];
            if (!Y.hasErrors)
              return;
            var ee = [""], ae = [""];
            function H(te, w) {
              ee.push(te), ae.push(w || "");
            }
            H("file number " + Q + ": " + Y.name + `
`, "color:red;text-decoration:underline;font-weight:bold"), Y.lines.forEach(function(te) {
              if (te.errors.length > 0) {
                H(mt(te.number, 4) + "|  ", "background-color:yellow; font-weight:bold"), H(te.line + A, "color:red; background-color:yellow; font-weight:bold");
                var w = 0;
                te.errors.forEach(function(k) {
                  var K = k.message, se = /^\s*'(.*)'\s*:\s*(.*)$/.exec(K);
                  if (se) {
                    var U = se[1];
                    switch (K = se[2], U) {
                      case "assign":
                        U = "=";
                        break;
                    }
                    w = Math.max(te.line.indexOf(U, w), 0);
                  } else
                    w = 0;
                  H(mt("| ", 6)), H(mt("^^^", w + 3) + A, "font-weight:bold"), H(mt("| ", 6)), H(K + A, "font-weight:bold");
                }), H(mt("| ", 6) + A);
              } else
                H(mt(te.number, 4) + "|  "), H(te.line + A, "color:red");
            }), typeof document < "u" && !window.chrome ? (ae[0] = ee.join("%c"), console.log.apply(console, ae)) : console.log(ee.join(""));
          }), oe.raise("Error compiling " + M + " shader, " + V[0].name);
        }
      }
      function Gr(e, n, d, F, N) {
        if (!e.getProgramParameter(n, e.LINK_STATUS)) {
          var C = e.getProgramInfoLog(n), M = It(d, N), V = It(F, N), W = 'Error linking program with vertex shader, "' + V[0].name + '", and fragment shader "' + M[0].name + '"';
          typeof document < "u" ? console.log(
            "%c" + W + A + "%c" + C,
            "color:red;text-decoration:underline;font-weight:bold",
            "color:red"
          ) : console.log(W + A + C), oe.raise(W);
        }
      }
      function Mr(e) {
        e._commandRef = Et();
      }
      function L(e, n, d, F) {
        Mr(e);
        function N(W) {
          return W ? F.id(W) : 0;
        }
        e._fragId = N(e.static.frag), e._vertId = N(e.static.vert);
        function C(W, Q) {
          Object.keys(Q).forEach(function(Y) {
            W[F.id(Y)] = !0;
          });
        }
        var M = e._uniformSet = {};
        C(M, n.static), C(M, n.dynamic);
        var V = e._attributeSet = {};
        C(V, d.static), C(V, d.dynamic), e._hasCount = "count" in e.static || "count" in e.dynamic || "elements" in e.static || "elements" in e.dynamic;
      }
      function y(e, n) {
        var d = hr();
        ve(e + " in command " + (n || Et()) + (d === "unknown" ? "" : " called from " + d));
      }
      function $(e, n, d) {
        e || y(n, d || Et());
      }
      function O(e, n, d, F) {
        e in n || y(
          "unknown parameter (" + e + ")" + ge(d) + ". possible values: " + Object.keys(n).join(),
          F || Et()
        );
      }
      function J(e, n, d, F) {
        Ve(e, n) || y(
          "invalid parameter type" + ge(d) + ". expected " + n + ", got " + typeof e,
          F || Et()
        );
      }
      function de(e) {
        e();
      }
      function Ce(e, n, d) {
        e.texture ? it(
          e.texture._texture.internalformat,
          n,
          "unsupported texture format for attachment"
        ) : it(
          e.renderbuffer._renderbuffer.format,
          d,
          "unsupported renderbuffer format for attachment"
        );
      }
      var ke = 33071, Te = 9728, xe = 9984, Ne = 9985, pt = 9986, Ie = 9987, Ot = 5120, Tt = 5121, At = 5122, kr = 5123, tt = 5124, dt = 5125, vt = 5126, Gt = 32819, Ya = 32820, qa = 33635, Ka = 34042, ss = 36193, St = {};
      St[Ot] = St[Tt] = 1, St[At] = St[kr] = St[ss] = St[qa] = St[Gt] = St[Ya] = 2, St[tt] = St[dt] = St[vt] = St[Ka] = 4;
      function Qa(e, n) {
        return e === Ya || e === Gt || e === qa ? 2 : e === Ka ? 4 : St[e] * n;
      }
      function sn(e) {
        return !(e & e - 1) && !!e;
      }
      function fs(e, n, d) {
        var F, N = n.width, C = n.height, M = n.channels;
        oe(
          N > 0 && N <= d.maxTextureSize && C > 0 && C <= d.maxTextureSize,
          "invalid texture shape"
        ), (e.wrapS !== ke || e.wrapT !== ke) && oe(
          sn(N) && sn(C),
          "incompatible wrap mode for texture, both width and height must be power of 2"
        ), n.mipmask === 1 ? N !== 1 && C !== 1 && oe(
          e.minFilter !== xe && e.minFilter !== pt && e.minFilter !== Ne && e.minFilter !== Ie,
          "min filter requires mipmap"
        ) : (oe(
          sn(N) && sn(C),
          "texture must be a square power of 2 to support mipmapping"
        ), oe(
          n.mipmask === (N << 1) - 1,
          "missing or incomplete mipmap data"
        )), n.type === vt && (d.extensions.indexOf("oes_texture_float_linear") < 0 && oe(
          e.minFilter === Te && e.magFilter === Te,
          "filter not supported, must enable oes_texture_float_linear"
        ), oe(
          !e.genMipmaps,
          "mipmap generation not supported with float textures"
        ));
        var V = n.images;
        for (F = 0; F < 16; ++F)
          if (V[F]) {
            var W = N >> F, Q = C >> F;
            oe(n.mipmask & 1 << F, "missing mipmap data");
            var Y = V[F];
            if (oe(
              Y.width === W && Y.height === Q,
              "invalid shape for mip images"
            ), oe(
              Y.format === n.format && Y.internalformat === n.internalformat && Y.type === n.type,
              "incompatible type for mip image"
            ), !Y.compressed) if (Y.data) {
              var ee = Math.ceil(Qa(Y.type, M) * W / Y.unpackAlignment) * Y.unpackAlignment;
              oe(
                Y.data.byteLength === ee * Q,
                "invalid data for image, buffer size is inconsistent with image format"
              );
            } else Y.element || Y.copy;
          } else e.genMipmaps || oe((n.mipmask & 1 << F) === 0, "extra mipmap data");
        n.compressed && oe(
          !e.genMipmaps,
          "mipmap generation for compressed images not supported"
        );
      }
      function us(e, n, d, F) {
        var N = e.width, C = e.height, M = e.channels;
        oe(
          N > 0 && N <= F.maxTextureSize && C > 0 && C <= F.maxTextureSize,
          "invalid texture shape"
        ), oe(
          N === C,
          "cube map must be square"
        ), oe(
          n.wrapS === ke && n.wrapT === ke,
          "wrap mode not supported by cube map"
        );
        for (var V = 0; V < d.length; ++V) {
          var W = d[V];
          oe(
            W.width === N && W.height === C,
            "inconsistent cube map face shape"
          ), n.genMipmaps && (oe(
            !W.compressed,
            "can not generate mipmap for compressed textures"
          ), oe(
            W.mipmask === 1,
            "can not specify mipmaps and generate mipmaps"
          ));
          for (var Q = W.images, Y = 0; Y < 16; ++Y) {
            var ee = Q[Y];
            if (ee) {
              var ae = N >> Y, H = C >> Y;
              oe(W.mipmask & 1 << Y, "missing mipmap data"), oe(
                ee.width === ae && ee.height === H,
                "invalid shape for mip images"
              ), oe(
                ee.format === e.format && ee.internalformat === e.internalformat && ee.type === e.type,
                "incompatible type for mip image"
              ), ee.compressed || (ee.data ? oe(
                ee.data.byteLength === ae * H * Math.max(Qa(ee.type, M), ee.unpackAlignment),
                "invalid data for image, buffer size is inconsistent with image format"
              ) : ee.element || ee.copy);
            }
          }
        }
      }
      var u = g(oe, {
        optional: de,
        raise: ve,
        commandRaise: y,
        command: $,
        parameter: ye,
        commandParameter: O,
        constructor: Kt,
        type: He,
        commandType: J,
        isTypedArray: yt,
        nni: ht,
        oneOf: it,
        shaderError: $n,
        linkError: Gr,
        callSite: hr,
        saveCommandRef: Mr,
        saveDrawInfo: L,
        framebufferFormat: Ce,
        guessCommand: Et,
        texture2D: fs,
        textureCube: us
      }), cs = 0, ls = 0, ds = 5, hs = 6;
      function Zt(e, n) {
        this.id = cs++, this.type = e, this.data = n;
      }
      function Za(e) {
        return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      }
      function Br(e) {
        if (e.length === 0)
          return [];
        var n = e.charAt(0), d = e.charAt(e.length - 1);
        if (e.length > 1 && n === d && (n === '"' || n === "'"))
          return ['"' + Za(e.substr(1, e.length - 2)) + '"'];
        var F = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(e);
        if (F)
          return Br(e.substr(0, F.index)).concat(Br(F[1])).concat(Br(e.substr(F.index + F[0].length)));
        var N = e.split(".");
        if (N.length === 1)
          return ['"' + Za(e) + '"'];
        for (var C = [], M = 0; M < N.length; ++M)
          C = C.concat(Br(N[M]));
        return C;
      }
      function Ja(e) {
        return "[" + Br(e).join("][") + "]";
      }
      function ms(e, n) {
        return new Zt(e, Ja(n + ""));
      }
      function ps(e) {
        return typeof e == "function" && !e._reglType || e instanceof Zt;
      }
      function ei(e, n) {
        if (typeof e == "function")
          return new Zt(ls, e);
        if (typeof e == "number" || typeof e == "boolean")
          return new Zt(ds, e);
        if (Array.isArray(e))
          return new Zt(hs, e.map((d, F) => ei(d, n + "[" + F + "]")));
        if (e instanceof Zt)
          return e;
        u(!1, "invalid option type in uniform " + n);
      }
      var Lt = {
        DynamicVariable: Zt,
        define: ms,
        isDynamic: ps,
        unbox: ei,
        accessor: Ja
      }, zn = {
        next: typeof requestAnimationFrame == "function" ? function(e) {
          return requestAnimationFrame(e);
        } : function(e) {
          return setTimeout(e, 16);
        },
        cancel: typeof cancelAnimationFrame == "function" ? function(e) {
          return cancelAnimationFrame(e);
        } : clearTimeout
      }, ti = typeof performance < "u" && performance.now ? function() {
        return performance.now();
      } : function() {
        return +/* @__PURE__ */ new Date();
      };
      function vs() {
        var e = { "": 0 }, n = [""];
        return {
          id: function(d) {
            var F = e[d];
            return F || (F = e[d] = n.length, n.push(d), F);
          },
          str: function(d) {
            return n[d];
          }
        };
      }
      function ys(e, n, d) {
        var F = document.createElement("canvas");
        g(F.style, {
          border: 0,
          margin: 0,
          padding: 0,
          top: 0,
          left: 0
        }), e.appendChild(F), e === document.body && (F.style.position = "absolute", g(e.style, {
          margin: 0,
          padding: 0
        }));
        function N() {
          var V = window.innerWidth, W = window.innerHeight;
          if (e !== document.body) {
            var Q = e.getBoundingClientRect();
            V = Q.right - Q.left, W = Q.bottom - Q.top;
          }
          F.width = d * V, F.height = d * W, g(F.style, {
            width: V + "px",
            height: W + "px"
          });
        }
        var C;
        e !== document.body && typeof ResizeObserver == "function" ? (C = new ResizeObserver(function() {
          setTimeout(N);
        }), C.observe(e)) : window.addEventListener("resize", N, !1);
        function M() {
          C ? C.disconnect() : window.removeEventListener("resize", N), e.removeChild(F);
        }
        return N(), {
          canvas: F,
          onDestroy: M
        };
      }
      function _s(e, n) {
        function d(F) {
          try {
            return e.getContext(F, n);
          } catch {
            return null;
          }
        }
        return d("webgl") || d("experimental-webgl") || d("webgl-experimental");
      }
      function bs(e) {
        return typeof e.nodeName == "string" && typeof e.appendChild == "function" && typeof e.getBoundingClientRect == "function";
      }
      function gs(e) {
        return typeof e.drawArrays == "function" || typeof e.drawElements == "function";
      }
      function ri(e) {
        return typeof e == "string" ? e.split() : (u(Array.isArray(e), "invalid extension array"), e);
      }
      function ni(e) {
        return typeof e == "string" ? (u(typeof document < "u", "not supported outside of DOM"), document.querySelector(e)) : e;
      }
      function Es(e) {
        var n = e || {}, d, F, N, C, M = {}, V = [], W = [], Q = typeof window > "u" ? 1 : window.devicePixelRatio, Y = !1, ee = function(te) {
          te && u.raise(te);
        }, ae = function() {
        };
        if (typeof n == "string" ? (u(
          typeof document < "u",
          "selector queries only supported in DOM enviroments"
        ), d = document.querySelector(n), u(d, "invalid query string for element")) : typeof n == "object" ? bs(n) ? d = n : gs(n) ? (C = n, N = C.canvas) : (u.constructor(n), "gl" in n ? C = n.gl : "canvas" in n ? N = ni(n.canvas) : "container" in n && (F = ni(n.container)), "attributes" in n && (M = n.attributes, u.type(M, "object", "invalid context attributes")), "extensions" in n && (V = ri(n.extensions)), "optionalExtensions" in n && (W = ri(n.optionalExtensions)), "onDone" in n && (u.type(
          n.onDone,
          "function",
          "invalid or missing onDone callback"
        ), ee = n.onDone), "profile" in n && (Y = !!n.profile), "pixelRatio" in n && (Q = +n.pixelRatio, u(Q > 0, "invalid pixel ratio"))) : u.raise("invalid arguments to regl"), d && (d.nodeName.toLowerCase() === "canvas" ? N = d : F = d), !C) {
          if (!N) {
            u(
              typeof document < "u",
              "must manually specify webgl context outside of DOM environments"
            );
            var H = ys(F || document.body, ee, Q);
            if (!H)
              return null;
            N = H.canvas, ae = H.onDestroy;
          }
          M.premultipliedAlpha === void 0 && (M.premultipliedAlpha = !0), C = _s(N, M);
        }
        return C ? {
          gl: C,
          canvas: N,
          container: F,
          extensions: V,
          optionalExtensions: W,
          pixelRatio: Q,
          profile: Y,
          onDone: ee,
          onDestroy: ae
        } : (ae(), ee("webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org"), null);
      }
      function xs(e, n) {
        var d = {};
        function F(M) {
          u.type(M, "string", "extension name must be string");
          var V = M.toLowerCase(), W;
          try {
            W = d[V] = e.getExtension(V);
          } catch {
          }
          return !!W;
        }
        for (var N = 0; N < n.extensions.length; ++N) {
          var C = n.extensions[N];
          if (!F(C))
            return n.onDestroy(), n.onDone('"' + C + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser'), null;
        }
        return n.optionalExtensions.forEach(F), {
          extensions: d,
          restore: function() {
            Object.keys(d).forEach(function(M) {
              if (d[M] && !F(M))
                throw new Error("(regl): error restoring extension " + M);
            });
          }
        };
      }
      function xt(e, n) {
        for (var d = Array(e), F = 0; F < e; ++F)
          d[F] = n(F);
        return d;
      }
      var ws = 5120, Ts = 5121, As = 5122, Ss = 5123, Ls = 5124, Rs = 5125, Os = 5126;
      function Cs(e) {
        for (var n = 16; n <= 1 << 28; n *= 16)
          if (e <= n)
            return n;
        return 0;
      }
      function ai(e) {
        var n, d;
        return n = (e > 65535) << 4, e >>>= n, d = (e > 255) << 3, e >>>= d, n |= d, d = (e > 15) << 2, e >>>= d, n |= d, d = (e > 3) << 1, e >>>= d, n |= d, n | e >> 1;
      }
      function ii() {
        var e = xt(8, function() {
          return [];
        });
        function n(C) {
          var M = Cs(C), V = e[ai(M) >> 2];
          return V.length > 0 ? V.pop() : new ArrayBuffer(M);
        }
        function d(C) {
          e[ai(C.byteLength) >> 2].push(C);
        }
        function F(C, M) {
          var V = null;
          switch (C) {
            case ws:
              V = new Int8Array(n(M), 0, M);
              break;
            case Ts:
              V = new Uint8Array(n(M), 0, M);
              break;
            case As:
              V = new Int16Array(n(2 * M), 0, M);
              break;
            case Ss:
              V = new Uint16Array(n(2 * M), 0, M);
              break;
            case Ls:
              V = new Int32Array(n(4 * M), 0, M);
              break;
            case Rs:
              V = new Uint32Array(n(4 * M), 0, M);
              break;
            case Os:
              V = new Float32Array(n(4 * M), 0, M);
              break;
            default:
              return null;
          }
          return V.length !== M ? V.subarray(0, M) : V;
        }
        function N(C) {
          d(C.buffer);
        }
        return {
          alloc: n,
          free: d,
          allocType: F,
          freeType: N
        };
      }
      var Ke = ii();
      Ke.zero = ii();
      var Fs = 3408, Gs = 3410, Ms = 3411, ks = 3412, Bs = 3413, Is = 3414, Ns = 3415, Ds = 33901, Ps = 33902, Us = 3379, $s = 3386, zs = 34921, js = 36347, Xs = 36348, Vs = 35661, Hs = 35660, Ws = 34930, Ys = 36349, qs = 34076, Ks = 34024, Qs = 7936, Zs = 7937, Js = 7938, ef = 35724, tf = 34047, rf = 36063, nf = 34852, fn = 3553, oi = 34067, af = 34069, of = 33984, Ir = 6408, jn = 5126, si = 5121, Xn = 36160, sf = 36053, ff = 36064, uf = 16384, cf = function(e, n) {
        var d = 1;
        n.ext_texture_filter_anisotropic && (d = e.getParameter(tf));
        var F = 1, N = 1;
        n.webgl_draw_buffers && (F = e.getParameter(nf), N = e.getParameter(rf));
        var C = !!n.oes_texture_float;
        if (C) {
          var M = e.createTexture();
          e.bindTexture(fn, M), e.texImage2D(fn, 0, Ir, 1, 1, 0, Ir, jn, null);
          var V = e.createFramebuffer();
          if (e.bindFramebuffer(Xn, V), e.framebufferTexture2D(Xn, ff, fn, M, 0), e.bindTexture(fn, null), e.checkFramebufferStatus(Xn) !== sf) C = !1;
          else {
            e.viewport(0, 0, 1, 1), e.clearColor(1, 0, 0, 1), e.clear(uf);
            var W = Ke.allocType(jn, 4);
            e.readPixels(0, 0, 1, 1, Ir, jn, W), e.getError() ? C = !1 : (e.deleteFramebuffer(V), e.deleteTexture(M), C = W[0] === 1), Ke.freeType(W);
          }
        }
        var Q = typeof navigator < "u" && (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion) || /Edge/.test(navigator.userAgent)), Y = !0;
        if (!Q) {
          var ee = e.createTexture(), ae = Ke.allocType(si, 36);
          e.activeTexture(of), e.bindTexture(oi, ee), e.texImage2D(af, 0, Ir, 3, 3, 0, Ir, si, ae), Ke.freeType(ae), e.bindTexture(oi, null), e.deleteTexture(ee), Y = !e.getError();
        }
        return {
          // drawing buffer bit depth
          colorBits: [
            e.getParameter(Gs),
            e.getParameter(Ms),
            e.getParameter(ks),
            e.getParameter(Bs)
          ],
          depthBits: e.getParameter(Is),
          stencilBits: e.getParameter(Ns),
          subpixelBits: e.getParameter(Fs),
          // supported extensions
          extensions: Object.keys(n).filter(function(H) {
            return !!n[H];
          }),
          // max aniso samples
          maxAnisotropic: d,
          // max draw buffers
          maxDrawbuffers: F,
          maxColorAttachments: N,
          // point and line size ranges
          pointSizeDims: e.getParameter(Ds),
          lineWidthDims: e.getParameter(Ps),
          maxViewportDims: e.getParameter($s),
          maxCombinedTextureUnits: e.getParameter(Vs),
          maxCubeMapSize: e.getParameter(qs),
          maxRenderbufferSize: e.getParameter(Ks),
          maxTextureUnits: e.getParameter(Ws),
          maxTextureSize: e.getParameter(Us),
          maxAttributes: e.getParameter(zs),
          maxVertexUniforms: e.getParameter(js),
          maxVertexTextureUnits: e.getParameter(Hs),
          maxVaryingVectors: e.getParameter(Xs),
          maxFragmentUniforms: e.getParameter(Ys),
          // vendor info
          glsl: e.getParameter(ef),
          renderer: e.getParameter(Zs),
          vendor: e.getParameter(Qs),
          version: e.getParameter(Js),
          // quirks
          readFloat: C,
          npotTextureCube: Y
        };
      };
      function Mt(e) {
        return !!e && typeof e == "object" && Array.isArray(e.shape) && Array.isArray(e.stride) && typeof e.offset == "number" && e.shape.length === e.stride.length && (Array.isArray(e.data) || l(e.data));
      }
      var Rt = function(e) {
        return Object.keys(e).map(function(n) {
          return e[n];
        });
      }, un = {
        shape: mf,
        flatten: hf
      };
      function lf(e, n, d) {
        for (var F = 0; F < n; ++F)
          d[F] = e[F];
      }
      function df(e, n, d, F) {
        for (var N = 0, C = 0; C < n; ++C)
          for (var M = e[C], V = 0; V < d; ++V)
            F[N++] = M[V];
      }
      function fi(e, n, d, F, N, C) {
        for (var M = C, V = 0; V < n; ++V)
          for (var W = e[V], Q = 0; Q < d; ++Q)
            for (var Y = W[Q], ee = 0; ee < F; ++ee)
              N[M++] = Y[ee];
      }
      function ui(e, n, d, F, N) {
        for (var C = 1, M = d + 1; M < n.length; ++M)
          C *= n[M];
        var V = n[d];
        if (n.length - d === 4) {
          var W = n[d + 1], Q = n[d + 2], Y = n[d + 3];
          for (M = 0; M < V; ++M)
            fi(e[M], W, Q, Y, F, N), N += C;
        } else
          for (M = 0; M < V; ++M)
            ui(e[M], n, d + 1, F, N), N += C;
      }
      function hf(e, n, d, F) {
        var N = 1;
        if (n.length)
          for (var C = 0; C < n.length; ++C)
            N *= n[C];
        else
          N = 0;
        var M = F || Ke.allocType(d, N);
        switch (n.length) {
          case 0:
            break;
          case 1:
            lf(e, n[0], M);
            break;
          case 2:
            df(e, n[0], n[1], M);
            break;
          case 3:
            fi(e, n[0], n[1], n[2], M, 0);
            break;
          default:
            ui(e, n, 0, M, 0);
        }
        return M;
      }
      function mf(e) {
        for (var n = [], d = e; d.length; d = d[0])
          n.push(d.length);
        return n;
      }
      var Vn = {
        "[object Int8Array]": 5120,
        "[object Int16Array]": 5122,
        "[object Int32Array]": 5124,
        "[object Uint8Array]": 5121,
        "[object Uint8ClampedArray]": 5121,
        "[object Uint16Array]": 5123,
        "[object Uint32Array]": 5125,
        "[object Float32Array]": 5126,
        "[object Float64Array]": 5121,
        "[object ArrayBuffer]": 5121
      }, pf = 5120, vf = 5122, yf = 5124, _f = 5121, bf = 5123, gf = 5125, Ef = 5126, xf = 5126, Jt = {
        int8: pf,
        int16: vf,
        int32: yf,
        uint8: _f,
        uint16: bf,
        uint32: gf,
        float: Ef,
        float32: xf
      }, wf = 35048, Tf = 35040, cn = {
        dynamic: wf,
        stream: Tf,
        static: 35044
      }, Hn = un.flatten, ci = un.shape, li = 35044, Af = 35040, Wn = 5121, Yn = 5126, Vt = [];
      Vt[5120] = 1, Vt[5122] = 2, Vt[5124] = 4, Vt[5121] = 1, Vt[5123] = 2, Vt[5125] = 4, Vt[5126] = 4;
      function ln(e) {
        return Vn[Object.prototype.toString.call(e)] | 0;
      }
      function di(e, n) {
        for (var d = 0; d < n.length; ++d)
          e[d] = n[d];
      }
      function hi(e, n, d, F, N, C, M) {
        for (var V = 0, W = 0; W < d; ++W)
          for (var Q = 0; Q < F; ++Q)
            e[V++] = n[N * W + C * Q + M];
      }
      function Sf(e, n, d, F) {
        var N = 0, C = {};
        function M(w) {
          this.id = N++, this.buffer = e.createBuffer(), this.type = w, this.usage = li, this.byteLength = 0, this.dimension = 1, this.dtype = Wn, this.persistentData = null, d.profile && (this.stats = { size: 0 });
        }
        M.prototype.bind = function() {
          e.bindBuffer(this.type, this.buffer);
        }, M.prototype.destroy = function() {
          ae(this);
        };
        var V = [];
        function W(w, k) {
          var K = V.pop();
          return K || (K = new M(w)), K.bind(), ee(K, k, Af, 0, 1, !1), K;
        }
        function Q(w) {
          V.push(w);
        }
        function Y(w, k, K) {
          w.byteLength = k.byteLength, e.bufferData(w.type, k, K);
        }
        function ee(w, k, K, se, U, fe) {
          var X;
          if (w.usage = K, Array.isArray(k)) {
            if (w.dtype = se || Yn, k.length > 0) {
              var re;
              if (Array.isArray(k[0])) {
                X = ci(k);
                for (var j = 1, ne = 1; ne < X.length; ++ne)
                  j *= X[ne];
                w.dimension = j, re = Hn(k, X, w.dtype), Y(w, re, K), fe ? w.persistentData = re : Ke.freeType(re);
              } else if (typeof k[0] == "number") {
                w.dimension = U;
                var me = Ke.allocType(w.dtype, k.length);
                di(me, k), Y(w, me, K), fe ? w.persistentData = me : Ke.freeType(me);
              } else l(k[0]) ? (w.dimension = k[0].length, w.dtype = se || ln(k[0]) || Yn, re = Hn(
                k,
                [k.length, k[0].length],
                w.dtype
              ), Y(w, re, K), fe ? w.persistentData = re : Ke.freeType(re)) : u.raise("invalid buffer data");
            }
          } else if (l(k))
            w.dtype = se || ln(k), w.dimension = U, Y(w, k, K), fe && (w.persistentData = new Uint8Array(new Uint8Array(k.buffer)));
          else if (Mt(k)) {
            X = k.shape;
            var Ee = k.stride, ie = k.offset, Z = 0, P = 0, be = 0, Se = 0;
            X.length === 1 ? (Z = X[0], P = 1, be = Ee[0], Se = 0) : X.length === 2 ? (Z = X[0], P = X[1], be = Ee[0], Se = Ee[1]) : u.raise("invalid shape"), w.dtype = se || ln(k.data) || Yn, w.dimension = P;
            var ce = Ke.allocType(w.dtype, Z * P);
            hi(
              ce,
              k.data,
              Z,
              P,
              be,
              Se,
              ie
            ), Y(w, ce, K), fe ? w.persistentData = ce : Ke.freeType(ce);
          } else k instanceof ArrayBuffer ? (w.dtype = Wn, w.dimension = U, Y(w, k, K), fe && (w.persistentData = new Uint8Array(new Uint8Array(k)))) : u.raise("invalid buffer data");
        }
        function ae(w) {
          n.bufferCount--, F(w);
          var k = w.buffer;
          u(k, "buffer must not be deleted already"), e.deleteBuffer(k), w.buffer = null, delete C[w.id];
        }
        function H(w, k, K, se) {
          n.bufferCount++;
          var U = new M(k);
          C[U.id] = U;
          function fe(j) {
            var ne = li, me = null, Ee = 0, ie = 0, Z = 1;
            return Array.isArray(j) || l(j) || Mt(j) || j instanceof ArrayBuffer ? me = j : typeof j == "number" ? Ee = j | 0 : j && (u.type(
              j,
              "object",
              "buffer arguments must be an object, a number or an array"
            ), "data" in j && (u(
              me === null || Array.isArray(me) || l(me) || Mt(me),
              "invalid data for buffer"
            ), me = j.data), "usage" in j && (u.parameter(j.usage, cn, "invalid buffer usage"), ne = cn[j.usage]), "type" in j && (u.parameter(j.type, Jt, "invalid buffer type"), ie = Jt[j.type]), "dimension" in j && (u.type(j.dimension, "number", "invalid dimension"), Z = j.dimension | 0), "length" in j && (u.nni(Ee, "buffer length must be a nonnegative integer"), Ee = j.length | 0)), U.bind(), me ? ee(U, me, ne, ie, Z, se) : (Ee && e.bufferData(U.type, Ee, ne), U.dtype = ie || Wn, U.usage = ne, U.dimension = Z, U.byteLength = Ee), d.profile && (U.stats.size = U.byteLength * Vt[U.dtype]), fe;
          }
          function X(j, ne) {
            u(
              ne + j.byteLength <= U.byteLength,
              "invalid buffer subdata call, buffer is too small.  Can't write data of size " + j.byteLength + " starting from offset " + ne + " to a buffer of size " + U.byteLength
            ), e.bufferSubData(U.type, ne, j);
          }
          function re(j, ne) {
            var me = (ne || 0) | 0, Ee;
            if (U.bind(), l(j) || j instanceof ArrayBuffer)
              X(j, me);
            else if (Array.isArray(j)) {
              if (j.length > 0)
                if (typeof j[0] == "number") {
                  var ie = Ke.allocType(U.dtype, j.length);
                  di(ie, j), X(ie, me), Ke.freeType(ie);
                } else if (Array.isArray(j[0]) || l(j[0])) {
                  Ee = ci(j);
                  var Z = Hn(j, Ee, U.dtype);
                  X(Z, me), Ke.freeType(Z);
                } else
                  u.raise("invalid buffer data");
            } else if (Mt(j)) {
              Ee = j.shape;
              var P = j.stride, be = 0, Se = 0, ce = 0, Fe = 0;
              Ee.length === 1 ? (be = Ee[0], Se = 1, ce = P[0], Fe = 0) : Ee.length === 2 ? (be = Ee[0], Se = Ee[1], ce = P[0], Fe = P[1]) : u.raise("invalid shape");
              var we = Array.isArray(j.data) ? U.dtype : ln(j.data), Oe = Ke.allocType(we, be * Se);
              hi(
                Oe,
                j.data,
                be,
                Se,
                ce,
                Fe,
                j.offset
              ), X(Oe, me), Ke.freeType(Oe);
            } else
              u.raise("invalid data for buffer subdata");
            return fe;
          }
          return K || fe(w), fe._reglType = "buffer", fe._buffer = U, fe.subdata = re, d.profile && (fe.stats = U.stats), fe.destroy = function() {
            ae(U);
          }, fe;
        }
        function te() {
          Rt(C).forEach(function(w) {
            w.buffer = e.createBuffer(), e.bindBuffer(w.type, w.buffer), e.bufferData(
              w.type,
              w.persistentData || w.byteLength,
              w.usage
            );
          });
        }
        return d.profile && (n.getTotalBufferSize = function() {
          var w = 0;
          return Object.keys(C).forEach(function(k) {
            w += C[k].stats.size;
          }), w;
        }), {
          create: H,
          createStream: W,
          destroyStream: Q,
          clear: function() {
            Rt(C).forEach(ae), V.forEach(ae);
          },
          getBuffer: function(w) {
            return w && w._buffer instanceof M ? w._buffer : null;
          },
          restore: te,
          _initBuffer: ee
        };
      }
      var Lf = 0, Rf = 0, Of = 1, Cf = 1, Ff = 4, Gf = 4, mr = {
        points: Lf,
        point: Rf,
        lines: Of,
        line: Cf,
        triangles: Ff,
        triangle: Gf,
        "line loop": 2,
        "line strip": 3,
        "triangle strip": 5,
        "triangle fan": 6
      }, Mf = 0, kf = 1, Nr = 4, Bf = 5120, pr = 5121, mi = 5122, vr = 5123, pi = 5124, er = 5125, qn = 34963, If = 35040, Nf = 35044;
      function Df(e, n, d, F) {
        var N = {}, C = 0, M = {
          uint8: pr,
          uint16: vr
        };
        n.oes_element_index_uint && (M.uint32 = er);
        function V(te) {
          this.id = C++, N[this.id] = this, this.buffer = te, this.primType = Nr, this.vertCount = 0, this.type = 0;
        }
        V.prototype.bind = function() {
          this.buffer.bind();
        };
        var W = [];
        function Q(te) {
          var w = W.pop();
          return w || (w = new V(d.create(
            null,
            qn,
            !0,
            !1
          )._buffer)), ee(w, te, If, -1, -1, 0, 0), w;
        }
        function Y(te) {
          W.push(te);
        }
        function ee(te, w, k, K, se, U, fe) {
          te.buffer.bind();
          var X;
          if (w) {
            var re = fe;
            !fe && (!l(w) || Mt(w) && !l(w.data)) && (re = n.oes_element_index_uint ? er : vr), d._initBuffer(
              te.buffer,
              w,
              k,
              re,
              3
            );
          } else
            e.bufferData(qn, U, k), te.buffer.dtype = X || pr, te.buffer.usage = k, te.buffer.dimension = 3, te.buffer.byteLength = U;
          if (X = fe, !fe) {
            switch (te.buffer.dtype) {
              case pr:
              case Bf:
                X = pr;
                break;
              case vr:
              case mi:
                X = vr;
                break;
              case er:
              case pi:
                X = er;
                break;
              default:
                u.raise("unsupported type for element array");
            }
            te.buffer.dtype = X;
          }
          te.type = X, u(
            X !== er || !!n.oes_element_index_uint,
            "32 bit element buffers not supported, enable oes_element_index_uint first"
          );
          var j = se;
          j < 0 && (j = te.buffer.byteLength, X === vr ? j >>= 1 : X === er && (j >>= 2)), te.vertCount = j;
          var ne = K;
          if (K < 0) {
            ne = Nr;
            var me = te.buffer.dimension;
            me === 1 && (ne = Mf), me === 2 && (ne = kf), me === 3 && (ne = Nr);
          }
          te.primType = ne;
        }
        function ae(te) {
          F.elementsCount--, u(te.buffer !== null, "must not double destroy elements"), delete N[te.id], te.buffer.destroy(), te.buffer = null;
        }
        function H(te, w) {
          var k = d.create(null, qn, !0), K = new V(k._buffer);
          F.elementsCount++;
          function se(U) {
            if (!U)
              k(), K.primType = Nr, K.vertCount = 0, K.type = pr;
            else if (typeof U == "number")
              k(U), K.primType = Nr, K.vertCount = U | 0, K.type = pr;
            else {
              var fe = null, X = Nf, re = -1, j = -1, ne = 0, me = 0;
              Array.isArray(U) || l(U) || Mt(U) ? fe = U : (u.type(U, "object", "invalid arguments for elements"), "data" in U && (fe = U.data, u(
                Array.isArray(fe) || l(fe) || Mt(fe),
                "invalid data for element buffer"
              )), "usage" in U && (u.parameter(
                U.usage,
                cn,
                "invalid element buffer usage"
              ), X = cn[U.usage]), "primitive" in U && (u.parameter(
                U.primitive,
                mr,
                "invalid element buffer primitive"
              ), re = mr[U.primitive]), "count" in U && (u(
                typeof U.count == "number" && U.count >= 0,
                "invalid vertex count for elements"
              ), j = U.count | 0), "type" in U && (u.parameter(
                U.type,
                M,
                "invalid buffer type"
              ), me = M[U.type]), "length" in U ? ne = U.length | 0 : (ne = j, me === vr || me === mi ? ne *= 2 : (me === er || me === pi) && (ne *= 4))), ee(
                K,
                fe,
                X,
                re,
                j,
                ne,
                me
              );
            }
            return se;
          }
          return se(te), se._reglType = "elements", se._elements = K, se.subdata = function(U, fe) {
            return k.subdata(U, fe), se;
          }, se.destroy = function() {
            ae(K);
          }, se;
        }
        return {
          create: H,
          createStream: Q,
          destroyStream: Y,
          getElements: function(te) {
            return typeof te == "function" && te._elements instanceof V ? te._elements : null;
          },
          clear: function() {
            Rt(N).forEach(ae);
          }
        };
      }
      var vi = new Float32Array(1), Pf = new Uint32Array(vi.buffer), Uf = 5123;
      function yi(e) {
        for (var n = Ke.allocType(Uf, e.length), d = 0; d < e.length; ++d)
          if (isNaN(e[d]))
            n[d] = 65535;
          else if (e[d] === 1 / 0)
            n[d] = 31744;
          else if (e[d] === -1 / 0)
            n[d] = 64512;
          else {
            vi[0] = e[d];
            var F = Pf[0], N = F >>> 31 << 15, C = (F << 1 >>> 24) - 127, M = F >> 13 & 1023;
            if (C < -24)
              n[d] = N;
            else if (C < -14) {
              var V = -14 - C;
              n[d] = N + (M + 1024 >> V);
            } else C > 15 ? n[d] = N + 31744 : n[d] = N + (C + 15 << 10) + M;
          }
        return n;
      }
      function We(e) {
        return Array.isArray(e) || l(e);
      }
      var _i = function(e) {
        return !(e & e - 1) && !!e;
      }, $f = 34467, Nt = 3553, Kn = 34067, dn = 34069, tr = 6408, Qn = 6406, hn = 6407, Dr = 6409, mn = 6410, bi = 32854, Zn = 32855, gi = 36194, zf = 32819, jf = 32820, Xf = 33635, Vf = 34042, Jn = 6402, pn = 34041, ea = 35904, ta = 35906, yr = 36193, ra = 33776, na = 33777, aa = 33778, ia = 33779, Ei = 35986, xi = 35987, wi = 34798, Ti = 35840, Ai = 35841, Si = 35842, Li = 35843, Ri = 36196, _r = 5121, oa = 5123, sa = 5125, Pr = 5126, Hf = 10242, Wf = 10243, Yf = 10497, fa = 33071, qf = 33648, Kf = 10240, Qf = 10241, ua = 9728, Zf = 9729, ca = 9984, Oi = 9985, Ci = 9986, la = 9987, Jf = 33170, vn = 4352, eu = 4353, tu = 4354, ru = 34046, nu = 3317, au = 37440, iu = 37441, ou = 37443, Fi = 37444, Ur = 33984, su = [
        ca,
        Ci,
        Oi,
        la
      ], yn = [
        0,
        Dr,
        mn,
        hn,
        tr
      ], Ct = {};
      Ct[Dr] = Ct[Qn] = Ct[Jn] = 1, Ct[pn] = Ct[mn] = 2, Ct[hn] = Ct[ea] = 3, Ct[tr] = Ct[ta] = 4;
      function br(e) {
        return "[object " + e + "]";
      }
      var Gi = br("HTMLCanvasElement"), Mi = br("OffscreenCanvas"), ki = br("CanvasRenderingContext2D"), Bi = br("ImageBitmap"), Ii = br("HTMLImageElement"), Ni = br("HTMLVideoElement"), fu = Object.keys(Vn).concat([
        Gi,
        Mi,
        ki,
        Bi,
        Ii,
        Ni
      ]), gr = [];
      gr[_r] = 1, gr[Pr] = 4, gr[yr] = 2, gr[oa] = 2, gr[sa] = 4;
      var ft = [];
      ft[bi] = 2, ft[Zn] = 2, ft[gi] = 2, ft[pn] = 4, ft[ra] = 0.5, ft[na] = 0.5, ft[aa] = 1, ft[ia] = 1, ft[Ei] = 0.5, ft[xi] = 1, ft[wi] = 1, ft[Ti] = 0.5, ft[Ai] = 0.25, ft[Si] = 0.5, ft[Li] = 0.25, ft[Ri] = 0.5;
      function Di(e) {
        return Array.isArray(e) && (e.length === 0 || typeof e[0] == "number");
      }
      function Pi(e) {
        if (!Array.isArray(e))
          return !1;
        var n = e.length;
        return !(n === 0 || !We(e[0]));
      }
      function rr(e) {
        return Object.prototype.toString.call(e);
      }
      function Ui(e) {
        return rr(e) === Gi;
      }
      function $i(e) {
        return rr(e) === Mi;
      }
      function uu(e) {
        return rr(e) === ki;
      }
      function cu(e) {
        return rr(e) === Bi;
      }
      function lu(e) {
        return rr(e) === Ii;
      }
      function du(e) {
        return rr(e) === Ni;
      }
      function da(e) {
        if (!e)
          return !1;
        var n = rr(e);
        return fu.indexOf(n) >= 0 ? !0 : Di(e) || Pi(e) || Mt(e);
      }
      function zi(e) {
        return Vn[Object.prototype.toString.call(e)] | 0;
      }
      function hu(e, n) {
        var d = n.length;
        switch (e.type) {
          case _r:
          case oa:
          case sa:
          case Pr:
            var F = Ke.allocType(e.type, d);
            F.set(n), e.data = F;
            break;
          case yr:
            e.data = yi(n);
            break;
          default:
            u.raise("unsupported texture type, must specify a typed array");
        }
      }
      function ji(e, n) {
        return Ke.allocType(
          e.type === yr ? Pr : e.type,
          n
        );
      }
      function Xi(e, n) {
        e.type === yr ? (e.data = yi(n), Ke.freeType(n)) : e.data = n;
      }
      function mu(e, n, d, F, N, C) {
        for (var M = e.width, V = e.height, W = e.channels, Q = M * V * W, Y = ji(e, Q), ee = 0, ae = 0; ae < V; ++ae)
          for (var H = 0; H < M; ++H)
            for (var te = 0; te < W; ++te)
              Y[ee++] = n[d * H + F * ae + N * te + C];
        Xi(e, Y);
      }
      function _n(e, n, d, F, N, C) {
        var M;
        if (typeof ft[e] < "u" ? M = ft[e] : M = Ct[e] * gr[n], C && (M *= 6), N) {
          for (var V = 0, W = d; W >= 1; )
            V += M * W * W, W /= 2;
          return V;
        } else
          return M * d * F;
      }
      function pu(e, n, d, F, N, C, M) {
        var V = {
          "don't care": vn,
          "dont care": vn,
          nice: tu,
          fast: eu
        }, W = {
          repeat: Yf,
          clamp: fa,
          mirror: qf
        }, Q = {
          nearest: ua,
          linear: Zf
        }, Y = g({
          mipmap: la,
          "nearest mipmap nearest": ca,
          "linear mipmap nearest": Oi,
          "nearest mipmap linear": Ci,
          "linear mipmap linear": la
        }, Q), ee = {
          none: 0,
          browser: Fi
        }, ae = {
          uint8: _r,
          rgba4: zf,
          rgb565: Xf,
          "rgb5 a1": jf
        }, H = {
          alpha: Qn,
          luminance: Dr,
          "luminance alpha": mn,
          rgb: hn,
          rgba: tr,
          rgba4: bi,
          "rgb5 a1": Zn,
          rgb565: gi
        }, te = {};
        n.ext_srgb && (H.srgb = ea, H.srgba = ta), n.oes_texture_float && (ae.float32 = ae.float = Pr), n.oes_texture_half_float && (ae.float16 = ae["half float"] = yr), n.webgl_depth_texture && (g(H, {
          depth: Jn,
          "depth stencil": pn
        }), g(ae, {
          uint16: oa,
          uint32: sa,
          "depth stencil": Vf
        })), n.webgl_compressed_texture_s3tc && g(te, {
          "rgb s3tc dxt1": ra,
          "rgba s3tc dxt1": na,
          "rgba s3tc dxt3": aa,
          "rgba s3tc dxt5": ia
        }), n.webgl_compressed_texture_atc && g(te, {
          "rgb atc": Ei,
          "rgba atc explicit alpha": xi,
          "rgba atc interpolated alpha": wi
        }), n.webgl_compressed_texture_pvrtc && g(te, {
          "rgb pvrtc 4bppv1": Ti,
          "rgb pvrtc 2bppv1": Ai,
          "rgba pvrtc 4bppv1": Si,
          "rgba pvrtc 2bppv1": Li
        }), n.webgl_compressed_texture_etc1 && (te["rgb etc1"] = Ri);
        var w = Array.prototype.slice.call(
          e.getParameter($f)
        );
        Object.keys(te).forEach(function(c) {
          var G = te[c];
          w.indexOf(G) >= 0 && (H[c] = G);
        });
        var k = Object.keys(H);
        d.textureFormats = k;
        var K = [];
        Object.keys(H).forEach(function(c) {
          var G = H[c];
          K[G] = c;
        });
        var se = [];
        Object.keys(ae).forEach(function(c) {
          var G = ae[c];
          se[G] = c;
        });
        var U = [];
        Object.keys(Q).forEach(function(c) {
          var G = Q[c];
          U[G] = c;
        });
        var fe = [];
        Object.keys(Y).forEach(function(c) {
          var G = Y[c];
          fe[G] = c;
        });
        var X = [];
        Object.keys(W).forEach(function(c) {
          var G = W[c];
          X[G] = c;
        });
        var re = k.reduce(function(c, G) {
          var R = H[G];
          return R === Dr || R === Qn || R === Dr || R === mn || R === Jn || R === pn || n.ext_srgb && (R === ea || R === ta) ? c[R] = R : R === Zn || G.indexOf("rgba") >= 0 ? c[R] = tr : c[R] = hn, c;
        }, {});
        function j() {
          this.internalformat = tr, this.format = tr, this.type = _r, this.compressed = !1, this.premultiplyAlpha = !1, this.flipY = !1, this.unpackAlignment = 1, this.colorSpace = Fi, this.width = 0, this.height = 0, this.channels = 0;
        }
        function ne(c, G) {
          c.internalformat = G.internalformat, c.format = G.format, c.type = G.type, c.compressed = G.compressed, c.premultiplyAlpha = G.premultiplyAlpha, c.flipY = G.flipY, c.unpackAlignment = G.unpackAlignment, c.colorSpace = G.colorSpace, c.width = G.width, c.height = G.height, c.channels = G.channels;
        }
        function me(c, G) {
          if (!(typeof G != "object" || !G)) {
            if ("premultiplyAlpha" in G && (u.type(
              G.premultiplyAlpha,
              "boolean",
              "invalid premultiplyAlpha"
            ), c.premultiplyAlpha = G.premultiplyAlpha), "flipY" in G && (u.type(
              G.flipY,
              "boolean",
              "invalid texture flip"
            ), c.flipY = G.flipY), "alignment" in G && (u.oneOf(
              G.alignment,
              [1, 2, 4, 8],
              "invalid texture unpack alignment"
            ), c.unpackAlignment = G.alignment), "colorSpace" in G && (u.parameter(
              G.colorSpace,
              ee,
              "invalid colorSpace"
            ), c.colorSpace = ee[G.colorSpace]), "type" in G) {
              var R = G.type;
              u(
                n.oes_texture_float || !(R === "float" || R === "float32"),
                "you must enable the OES_texture_float extension in order to use floating point textures."
              ), u(
                n.oes_texture_half_float || !(R === "half float" || R === "float16"),
                "you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures."
              ), u(
                n.webgl_depth_texture || !(R === "uint16" || R === "uint32" || R === "depth stencil"),
                "you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures."
              ), u.parameter(
                R,
                ae,
                "invalid texture type"
              ), c.type = ae[R];
            }
            var ue = c.width, Ge = c.height, s = c.channels, t = !1;
            "shape" in G ? (u(
              Array.isArray(G.shape) && G.shape.length >= 2,
              "shape must be an array"
            ), ue = G.shape[0], Ge = G.shape[1], G.shape.length === 3 && (s = G.shape[2], u(s > 0 && s <= 4, "invalid number of channels"), t = !0), u(ue >= 0 && ue <= d.maxTextureSize, "invalid width"), u(Ge >= 0 && Ge <= d.maxTextureSize, "invalid height")) : ("radius" in G && (ue = Ge = G.radius, u(ue >= 0 && ue <= d.maxTextureSize, "invalid radius")), "width" in G && (ue = G.width, u(ue >= 0 && ue <= d.maxTextureSize, "invalid width")), "height" in G && (Ge = G.height, u(Ge >= 0 && Ge <= d.maxTextureSize, "invalid height")), "channels" in G && (s = G.channels, u(s > 0 && s <= 4, "invalid number of channels"), t = !0)), c.width = ue | 0, c.height = Ge | 0, c.channels = s | 0;
            var m = !1;
            if ("format" in G) {
              var E = G.format;
              u(
                n.webgl_depth_texture || !(E === "depth" || E === "depth stencil"),
                "you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures."
              ), u.parameter(
                E,
                H,
                "invalid texture format"
              );
              var T = c.internalformat = H[E];
              c.format = re[T], E in ae && ("type" in G || (c.type = ae[E])), E in te && (c.compressed = !0), m = !0;
            }
            !t && m ? c.channels = Ct[c.format] : t && !m ? c.channels !== yn[c.format] && (c.format = c.internalformat = yn[c.channels]) : m && t && u(
              c.channels === Ct[c.format],
              "number of channels inconsistent with specified format"
            );
          }
        }
        function Ee(c) {
          e.pixelStorei(au, c.flipY), e.pixelStorei(iu, c.premultiplyAlpha), e.pixelStorei(ou, c.colorSpace), e.pixelStorei(nu, c.unpackAlignment);
        }
        function ie() {
          j.call(this), this.xOffset = 0, this.yOffset = 0, this.data = null, this.needsFree = !1, this.element = null, this.needsCopy = !1;
        }
        function Z(c, G) {
          var R = null;
          if (da(G) ? R = G : G && (u.type(G, "object", "invalid pixel data type"), me(c, G), "x" in G && (c.xOffset = G.x | 0), "y" in G && (c.yOffset = G.y | 0), da(G.data) && (R = G.data)), u(
            !c.compressed || R instanceof Uint8Array,
            "compressed texture data must be stored in a uint8array"
          ), G.copy) {
            u(!R, "can not specify copy and data field for the same texture");
            var ue = N.viewportWidth, Ge = N.viewportHeight;
            c.width = c.width || ue - c.xOffset, c.height = c.height || Ge - c.yOffset, c.needsCopy = !0, u(
              c.xOffset >= 0 && c.xOffset < ue && c.yOffset >= 0 && c.yOffset < Ge && c.width > 0 && c.width <= ue && c.height > 0 && c.height <= Ge,
              "copy texture read out of bounds"
            );
          } else if (!R)
            c.width = c.width || 1, c.height = c.height || 1, c.channels = c.channels || 4;
          else if (l(R))
            c.channels = c.channels || 4, c.data = R, !("type" in G) && c.type === _r && (c.type = zi(R));
          else if (Di(R))
            c.channels = c.channels || 4, hu(c, R), c.alignment = 1, c.needsFree = !0;
          else if (Mt(R)) {
            var s = R.data;
            !Array.isArray(s) && c.type === _r && (c.type = zi(s));
            var t = R.shape, m = R.stride, E, T, v, p, _, f;
            t.length === 3 ? (v = t[2], f = m[2]) : (u(t.length === 2, "invalid ndarray pixel data, must be 2 or 3D"), v = 1, f = 1), E = t[0], T = t[1], p = m[0], _ = m[1], c.alignment = 1, c.width = E, c.height = T, c.channels = v, c.format = c.internalformat = yn[v], c.needsFree = !0, mu(c, s, p, _, f, R.offset);
          } else if (Ui(R) || $i(R) || uu(R))
            Ui(R) || $i(R) ? c.element = R : c.element = R.canvas, c.width = c.element.width, c.height = c.element.height, c.channels = 4;
          else if (cu(R))
            c.element = R, c.width = R.width, c.height = R.height, c.channels = 4;
          else if (lu(R))
            c.element = R, c.width = R.naturalWidth, c.height = R.naturalHeight, c.channels = 4;
          else if (du(R))
            c.element = R, c.width = R.videoWidth, c.height = R.videoHeight, c.channels = 4;
          else if (Pi(R)) {
            var h = c.width || R[0].length, o = c.height || R.length, b = c.channels;
            We(R[0][0]) ? b = b || R[0][0].length : b = b || 1;
            for (var S = un.shape(R), I = 1, D = 0; D < S.length; ++D)
              I *= S[D];
            var B = ji(c, I);
            un.flatten(R, S, "", B), Xi(c, B), c.alignment = 1, c.width = h, c.height = o, c.channels = b, c.format = c.internalformat = yn[b], c.needsFree = !0;
          }
          c.type === Pr ? u(
            d.extensions.indexOf("oes_texture_float") >= 0,
            "oes_texture_float extension not enabled"
          ) : c.type === yr && u(
            d.extensions.indexOf("oes_texture_half_float") >= 0,
            "oes_texture_half_float extension not enabled"
          );
        }
        function P(c, G, R) {
          var ue = c.element, Ge = c.data, s = c.internalformat, t = c.format, m = c.type, E = c.width, T = c.height;
          Ee(c), ue ? e.texImage2D(G, R, t, t, m, ue) : c.compressed ? e.compressedTexImage2D(G, R, s, E, T, 0, Ge) : c.needsCopy ? (F(), e.copyTexImage2D(
            G,
            R,
            t,
            c.xOffset,
            c.yOffset,
            E,
            T,
            0
          )) : e.texImage2D(G, R, t, E, T, 0, t, m, Ge || null);
        }
        function be(c, G, R, ue, Ge) {
          var s = c.element, t = c.data, m = c.internalformat, E = c.format, T = c.type, v = c.width, p = c.height;
          Ee(c), s ? e.texSubImage2D(
            G,
            Ge,
            R,
            ue,
            E,
            T,
            s
          ) : c.compressed ? e.compressedTexSubImage2D(
            G,
            Ge,
            R,
            ue,
            m,
            v,
            p,
            t
          ) : c.needsCopy ? (F(), e.copyTexSubImage2D(
            G,
            Ge,
            R,
            ue,
            c.xOffset,
            c.yOffset,
            v,
            p
          )) : e.texSubImage2D(
            G,
            Ge,
            R,
            ue,
            v,
            p,
            E,
            T,
            t
          );
        }
        var Se = [];
        function ce() {
          return Se.pop() || new ie();
        }
        function Fe(c) {
          c.needsFree && Ke.freeType(c.data), ie.call(c), Se.push(c);
        }
        function we() {
          j.call(this), this.genMipmaps = !1, this.mipmapHint = vn, this.mipmask = 0, this.images = Array(16);
        }
        function Oe(c, G, R) {
          var ue = c.images[0] = ce();
          c.mipmask = 1, ue.width = c.width = G, ue.height = c.height = R, ue.channels = c.channels = 4;
        }
        function Ue(c, G) {
          var R = null;
          if (da(G))
            R = c.images[0] = ce(), ne(R, c), Z(R, G), c.mipmask = 1;
          else if (me(c, G), Array.isArray(G.mipmap))
            for (var ue = G.mipmap, Ge = 0; Ge < ue.length; ++Ge)
              R = c.images[Ge] = ce(), ne(R, c), R.width >>= Ge, R.height >>= Ge, Z(R, ue[Ge]), c.mipmask |= 1 << Ge;
          else
            R = c.images[0] = ce(), ne(R, c), Z(R, G), c.mipmask = 1;
          ne(c, c.images[0]), c.compressed && (c.internalformat === ra || c.internalformat === na || c.internalformat === aa || c.internalformat === ia) && u(
            c.width % 4 === 0 && c.height % 4 === 0,
            "for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4"
          );
        }
        function Ze(c, G) {
          for (var R = c.images, ue = 0; ue < R.length; ++ue) {
            if (!R[ue])
              return;
            P(R[ue], G, ue);
          }
        }
        var ot = [];
        function Be() {
          var c = ot.pop() || new we();
          j.call(c), c.mipmask = 0;
          for (var G = 0; G < 16; ++G)
            c.images[G] = null;
          return c;
        }
        function rt(c) {
          for (var G = c.images, R = 0; R < G.length; ++R)
            G[R] && Fe(G[R]), G[R] = null;
          ot.push(c);
        }
        function je() {
          this.minFilter = ua, this.magFilter = ua, this.wrapS = fa, this.wrapT = fa, this.anisotropic = 1, this.genMipmaps = !1, this.mipmapHint = vn;
        }
        function Je(c, G) {
          if ("min" in G) {
            var R = G.min;
            u.parameter(R, Y), c.minFilter = Y[R], su.indexOf(c.minFilter) >= 0 && !("faces" in G) && (c.genMipmaps = !0);
          }
          if ("mag" in G) {
            var ue = G.mag;
            u.parameter(ue, Q), c.magFilter = Q[ue];
          }
          var Ge = c.wrapS, s = c.wrapT;
          if ("wrap" in G) {
            var t = G.wrap;
            typeof t == "string" ? (u.parameter(t, W), Ge = s = W[t]) : Array.isArray(t) && (u.parameter(t[0], W), u.parameter(t[1], W), Ge = W[t[0]], s = W[t[1]]);
          } else {
            if ("wrapS" in G) {
              var m = G.wrapS;
              u.parameter(m, W), Ge = W[m];
            }
            if ("wrapT" in G) {
              var E = G.wrapT;
              u.parameter(E, W), s = W[E];
            }
          }
          if (c.wrapS = Ge, c.wrapT = s, "anisotropic" in G) {
            var T = G.anisotropic;
            u(
              typeof T == "number" && T >= 1 && T <= d.maxAnisotropic,
              "aniso samples must be between 1 and "
            ), c.anisotropic = G.anisotropic;
          }
          if ("mipmap" in G) {
            var v = !1;
            switch (typeof G.mipmap) {
              case "string":
                u.parameter(
                  G.mipmap,
                  V,
                  "invalid mipmap hint"
                ), c.mipmapHint = V[G.mipmap], c.genMipmaps = !0, v = !0;
                break;
              case "boolean":
                v = c.genMipmaps = G.mipmap;
                break;
              case "object":
                u(Array.isArray(G.mipmap), "invalid mipmap type"), c.genMipmaps = !1, v = !0;
                break;
              default:
                u.raise("invalid mipmap type");
            }
            v && !("min" in G) && (c.minFilter = ca);
          }
        }
        function nt(c, G) {
          e.texParameteri(G, Qf, c.minFilter), e.texParameteri(G, Kf, c.magFilter), e.texParameteri(G, Hf, c.wrapS), e.texParameteri(G, Wf, c.wrapT), n.ext_texture_filter_anisotropic && e.texParameteri(G, ru, c.anisotropic), c.genMipmaps && (e.hint(Jf, c.mipmapHint), e.generateMipmap(G));
        }
        var at = 0, st = {}, ut = d.maxTextureUnits, Ye = Array(ut).map(function() {
          return null;
        });
        function Le(c) {
          j.call(this), this.mipmask = 0, this.internalformat = tr, this.id = at++, this.refCount = 1, this.target = c, this.texture = e.createTexture(), this.unit = -1, this.bindCount = 0, this.texInfo = new je(), M.profile && (this.stats = { size: 0 });
        }
        function ct(c) {
          e.activeTexture(Ur), e.bindTexture(c.target, c.texture);
        }
        function ze() {
          var c = Ye[0];
          c ? e.bindTexture(c.target, c.texture) : e.bindTexture(Nt, null);
        }
        function pe(c) {
          var G = c.texture;
          u(G, "must not double destroy texture");
          var R = c.unit, ue = c.target;
          R >= 0 && (e.activeTexture(Ur + R), e.bindTexture(ue, null), Ye[R] = null), e.deleteTexture(G), c.texture = null, c.params = null, c.pixels = null, c.refCount = 0, delete st[c.id], C.textureCount--;
        }
        g(Le.prototype, {
          bind: function() {
            var c = this;
            c.bindCount += 1;
            var G = c.unit;
            if (G < 0) {
              for (var R = 0; R < ut; ++R) {
                var ue = Ye[R];
                if (ue) {
                  if (ue.bindCount > 0)
                    continue;
                  ue.unit = -1;
                }
                Ye[R] = c, G = R;
                break;
              }
              G >= ut && u.raise("insufficient number of texture units"), M.profile && C.maxTextureUnits < G + 1 && (C.maxTextureUnits = G + 1), c.unit = G, e.activeTexture(Ur + G), e.bindTexture(c.target, c.texture);
            }
            return G;
          },
          unbind: function() {
            this.bindCount -= 1;
          },
          decRef: function() {
            --this.refCount <= 0 && pe(this);
          }
        });
        function Me(c, G) {
          var R = new Le(Nt);
          st[R.id] = R, C.textureCount++;
          function ue(t, m) {
            var E = R.texInfo;
            je.call(E);
            var T = Be();
            return typeof t == "number" ? typeof m == "number" ? Oe(T, t | 0, m | 0) : Oe(T, t | 0, t | 0) : t ? (u.type(t, "object", "invalid arguments to regl.texture"), Je(E, t), Ue(T, t)) : Oe(T, 1, 1), E.genMipmaps && (T.mipmask = (T.width << 1) - 1), R.mipmask = T.mipmask, ne(R, T), u.texture2D(E, T, d), R.internalformat = T.internalformat, ue.width = T.width, ue.height = T.height, ct(R), Ze(T, Nt), nt(E, Nt), ze(), rt(T), M.profile && (R.stats.size = _n(
              R.internalformat,
              R.type,
              T.width,
              T.height,
              E.genMipmaps,
              !1
            )), ue.format = K[R.internalformat], ue.type = se[R.type], ue.mag = U[E.magFilter], ue.min = fe[E.minFilter], ue.wrapS = X[E.wrapS], ue.wrapT = X[E.wrapT], ue;
          }
          function Ge(t, m, E, T) {
            u(!!t, "must specify image data");
            var v = m | 0, p = E | 0, _ = T | 0, f = ce();
            return ne(f, R), f.width = 0, f.height = 0, Z(f, t), f.width = f.width || (R.width >> _) - v, f.height = f.height || (R.height >> _) - p, u(
              R.type === f.type && R.format === f.format && R.internalformat === f.internalformat,
              "incompatible format for texture.subimage"
            ), u(
              v >= 0 && p >= 0 && v + f.width <= R.width && p + f.height <= R.height,
              "texture.subimage write out of bounds"
            ), u(
              R.mipmask & 1 << _,
              "missing mipmap data"
            ), u(
              f.data || f.element || f.needsCopy,
              "missing image data"
            ), ct(R), be(f, Nt, v, p, _), ze(), Fe(f), ue;
          }
          function s(t, m) {
            var E = t | 0, T = m | 0 || E;
            if (E === R.width && T === R.height)
              return ue;
            ue.width = R.width = E, ue.height = R.height = T, ct(R);
            for (var v = 0; R.mipmask >> v; ++v) {
              var p = E >> v, _ = T >> v;
              if (!p || !_) break;
              e.texImage2D(
                Nt,
                v,
                R.format,
                p,
                _,
                0,
                R.format,
                R.type,
                null
              );
            }
            return ze(), M.profile && (R.stats.size = _n(
              R.internalformat,
              R.type,
              E,
              T,
              !1,
              !1
            )), ue;
          }
          return ue(c, G), ue.subimage = Ge, ue.resize = s, ue._reglType = "texture2d", ue._texture = R, M.profile && (ue.stats = R.stats), ue.destroy = function() {
            R.decRef();
          }, ue;
        }
        function De(c, G, R, ue, Ge, s) {
          var t = new Le(Kn);
          st[t.id] = t, C.cubeCount++;
          var m = new Array(6);
          function E(p, _, f, h, o, b) {
            var S, I = t.texInfo;
            for (je.call(I), S = 0; S < 6; ++S)
              m[S] = Be();
            if (typeof p == "number" || !p) {
              var D = p | 0 || 1;
              for (S = 0; S < 6; ++S)
                Oe(m[S], D, D);
            } else if (typeof p == "object")
              if (_)
                Ue(m[0], p), Ue(m[1], _), Ue(m[2], f), Ue(m[3], h), Ue(m[4], o), Ue(m[5], b);
              else if (Je(I, p), me(t, p), "faces" in p) {
                var B = p.faces;
                for (u(
                  Array.isArray(B) && B.length === 6,
                  "cube faces must be a length 6 array"
                ), S = 0; S < 6; ++S)
                  u(
                    typeof B[S] == "object" && !!B[S],
                    "invalid input for cube map face"
                  ), ne(m[S], t), Ue(m[S], B[S]);
              } else
                for (S = 0; S < 6; ++S)
                  Ue(m[S], p);
            else
              u.raise("invalid arguments to cube map");
            for (ne(t, m[0]), d.npotTextureCube || u(_i(t.width) && _i(t.height), "your browser does not support non power or two texture dimensions"), I.genMipmaps ? t.mipmask = (m[0].width << 1) - 1 : t.mipmask = m[0].mipmask, u.textureCube(t, I, m, d), t.internalformat = m[0].internalformat, E.width = m[0].width, E.height = m[0].height, ct(t), S = 0; S < 6; ++S)
              Ze(m[S], dn + S);
            for (nt(I, Kn), ze(), M.profile && (t.stats.size = _n(
              t.internalformat,
              t.type,
              E.width,
              E.height,
              I.genMipmaps,
              !0
            )), E.format = K[t.internalformat], E.type = se[t.type], E.mag = U[I.magFilter], E.min = fe[I.minFilter], E.wrapS = X[I.wrapS], E.wrapT = X[I.wrapT], S = 0; S < 6; ++S)
              rt(m[S]);
            return E;
          }
          function T(p, _, f, h, o) {
            u(!!_, "must specify image data"), u(typeof p == "number" && p === (p | 0) && p >= 0 && p < 6, "invalid face");
            var b = f | 0, S = h | 0, I = o | 0, D = ce();
            return ne(D, t), D.width = 0, D.height = 0, Z(D, _), D.width = D.width || (t.width >> I) - b, D.height = D.height || (t.height >> I) - S, u(
              t.type === D.type && t.format === D.format && t.internalformat === D.internalformat,
              "incompatible format for texture.subimage"
            ), u(
              b >= 0 && S >= 0 && b + D.width <= t.width && S + D.height <= t.height,
              "texture.subimage write out of bounds"
            ), u(
              t.mipmask & 1 << I,
              "missing mipmap data"
            ), u(
              D.data || D.element || D.needsCopy,
              "missing image data"
            ), ct(t), be(D, dn + p, b, S, I), ze(), Fe(D), E;
          }
          function v(p) {
            var _ = p | 0;
            if (_ !== t.width) {
              E.width = t.width = _, E.height = t.height = _, ct(t);
              for (var f = 0; f < 6; ++f)
                for (var h = 0; t.mipmask >> h; ++h)
                  e.texImage2D(
                    dn + f,
                    h,
                    t.format,
                    _ >> h,
                    _ >> h,
                    0,
                    t.format,
                    t.type,
                    null
                  );
              return ze(), M.profile && (t.stats.size = _n(
                t.internalformat,
                t.type,
                E.width,
                E.height,
                !1,
                !0
              )), E;
            }
          }
          return E(c, G, R, ue, Ge, s), E.subimage = T, E.resize = v, E._reglType = "textureCube", E._texture = t, M.profile && (E.stats = t.stats), E.destroy = function() {
            t.decRef();
          }, E;
        }
        function qe() {
          for (var c = 0; c < ut; ++c)
            e.activeTexture(Ur + c), e.bindTexture(Nt, null), Ye[c] = null;
          Rt(st).forEach(pe), C.cubeCount = 0, C.textureCount = 0;
        }
        M.profile && (C.getTotalTextureSize = function() {
          var c = 0;
          return Object.keys(st).forEach(function(G) {
            c += st[G].stats.size;
          }), c;
        });
        function Pt() {
          for (var c = 0; c < ut; ++c) {
            var G = Ye[c];
            G && (G.bindCount = 0, G.unit = -1, Ye[c] = null);
          }
          Rt(st).forEach(function(R) {
            R.texture = e.createTexture(), e.bindTexture(R.target, R.texture);
            for (var ue = 0; ue < 32; ++ue)
              if (R.mipmask & 1 << ue)
                if (R.target === Nt)
                  e.texImage2D(
                    Nt,
                    ue,
                    R.internalformat,
                    R.width >> ue,
                    R.height >> ue,
                    0,
                    R.internalformat,
                    R.type,
                    null
                  );
                else
                  for (var Ge = 0; Ge < 6; ++Ge)
                    e.texImage2D(
                      dn + Ge,
                      ue,
                      R.internalformat,
                      R.width >> ue,
                      R.height >> ue,
                      0,
                      R.internalformat,
                      R.type,
                      null
                    );
            nt(R.texInfo, R.target);
          });
        }
        function ur() {
          for (var c = 0; c < ut; ++c) {
            var G = Ye[c];
            G && (G.bindCount = 0, G.unit = -1, Ye[c] = null), e.activeTexture(Ur + c), e.bindTexture(Nt, null), e.bindTexture(Kn, null);
          }
        }
        return {
          create2D: Me,
          createCube: De,
          clear: qe,
          getTexture: function(c) {
            return null;
          },
          restore: Pt,
          refresh: ur
        };
      }
      var Ht = 36161, bn = 32854, Vi = 32855, Hi = 36194, Wi = 33189, Yi = 36168, qi = 34041, Ki = 35907, Qi = 34836, Zi = 34842, Ji = 34843, kt = [];
      kt[bn] = 2, kt[Vi] = 2, kt[Hi] = 2, kt[Wi] = 2, kt[Yi] = 1, kt[qi] = 4, kt[Ki] = 4, kt[Qi] = 16, kt[Zi] = 8, kt[Ji] = 6;
      function eo(e, n, d) {
        return kt[e] * n * d;
      }
      var vu = function(e, n, d, F, N) {
        var C = {
          rgba4: bn,
          rgb565: Hi,
          "rgb5 a1": Vi,
          depth: Wi,
          stencil: Yi,
          "depth stencil": qi
        };
        n.ext_srgb && (C.srgba = Ki), n.ext_color_buffer_half_float && (C.rgba16f = Zi, C.rgb16f = Ji), n.webgl_color_buffer_float && (C.rgba32f = Qi);
        var M = [];
        Object.keys(C).forEach(function(H) {
          var te = C[H];
          M[te] = H;
        });
        var V = 0, W = {};
        function Q(H) {
          this.id = V++, this.refCount = 1, this.renderbuffer = H, this.format = bn, this.width = 0, this.height = 0, N.profile && (this.stats = { size: 0 });
        }
        Q.prototype.decRef = function() {
          --this.refCount <= 0 && Y(this);
        };
        function Y(H) {
          var te = H.renderbuffer;
          u(te, "must not double destroy renderbuffer"), e.bindRenderbuffer(Ht, null), e.deleteRenderbuffer(te), H.renderbuffer = null, H.refCount = 0, delete W[H.id], F.renderbufferCount--;
        }
        function ee(H, te) {
          var w = new Q(e.createRenderbuffer());
          W[w.id] = w, F.renderbufferCount++;
          function k(se, U) {
            var fe = 0, X = 0, re = bn;
            if (typeof se == "object" && se) {
              var j = se;
              if ("shape" in j) {
                var ne = j.shape;
                u(
                  Array.isArray(ne) && ne.length >= 2,
                  "invalid renderbuffer shape"
                ), fe = ne[0] | 0, X = ne[1] | 0;
              } else
                "radius" in j && (fe = X = j.radius | 0), "width" in j && (fe = j.width | 0), "height" in j && (X = j.height | 0);
              "format" in j && (u.parameter(
                j.format,
                C,
                "invalid renderbuffer format"
              ), re = C[j.format]);
            } else typeof se == "number" ? (fe = se | 0, typeof U == "number" ? X = U | 0 : X = fe) : se ? u.raise("invalid arguments to renderbuffer constructor") : fe = X = 1;
            if (u(
              fe > 0 && X > 0 && fe <= d.maxRenderbufferSize && X <= d.maxRenderbufferSize,
              "invalid renderbuffer size"
            ), !(fe === w.width && X === w.height && re === w.format))
              return k.width = w.width = fe, k.height = w.height = X, w.format = re, e.bindRenderbuffer(Ht, w.renderbuffer), e.renderbufferStorage(Ht, re, fe, X), u(
                e.getError() === 0,
                "invalid render buffer format"
              ), N.profile && (w.stats.size = eo(w.format, w.width, w.height)), k.format = M[w.format], k;
          }
          function K(se, U) {
            var fe = se | 0, X = U | 0 || fe;
            return fe === w.width && X === w.height || (u(
              fe > 0 && X > 0 && fe <= d.maxRenderbufferSize && X <= d.maxRenderbufferSize,
              "invalid renderbuffer size"
            ), k.width = w.width = fe, k.height = w.height = X, e.bindRenderbuffer(Ht, w.renderbuffer), e.renderbufferStorage(Ht, w.format, fe, X), u(
              e.getError() === 0,
              "invalid render buffer format"
            ), N.profile && (w.stats.size = eo(
              w.format,
              w.width,
              w.height
            ))), k;
          }
          return k(H, te), k.resize = K, k._reglType = "renderbuffer", k._renderbuffer = w, N.profile && (k.stats = w.stats), k.destroy = function() {
            w.decRef();
          }, k;
        }
        N.profile && (F.getTotalRenderbufferSize = function() {
          var H = 0;
          return Object.keys(W).forEach(function(te) {
            H += W[te].stats.size;
          }), H;
        });
        function ae() {
          Rt(W).forEach(function(H) {
            H.renderbuffer = e.createRenderbuffer(), e.bindRenderbuffer(Ht, H.renderbuffer), e.renderbufferStorage(Ht, H.format, H.width, H.height);
          }), e.bindRenderbuffer(Ht, null);
        }
        return {
          create: ee,
          clear: function() {
            Rt(W).forEach(Y);
          },
          restore: ae
        };
      }, Ut = 36160, ha = 36161, nr = 3553, gn = 34069, to = 36064, ro = 36096, no = 36128, ao = 33306, io = 36053, yu = 36054, _u = 36055, bu = 36057, gu = 36061, Eu = 36193, xu = 5121, wu = 5126, oo = 6407, so = 6408, Tu = 6402, Au = [
        oo,
        so
      ], ma = [];
      ma[so] = 4, ma[oo] = 3;
      var En = [];
      En[xu] = 1, En[wu] = 4, En[Eu] = 2;
      var Su = 32854, Lu = 32855, Ru = 36194, Ou = 33189, Cu = 36168, fo = 34041, Fu = 35907, Gu = 34836, Mu = 34842, ku = 34843, Bu = [
        Su,
        Lu,
        Ru,
        Fu,
        Mu,
        ku,
        Gu
      ], Er = {};
      Er[io] = "complete", Er[yu] = "incomplete attachment", Er[bu] = "incomplete dimensions", Er[_u] = "incomplete, missing attachment", Er[gu] = "unsupported";
      function Iu(e, n, d, F, N, C) {
        var M = {
          cur: null,
          next: null,
          dirty: !1,
          setFBO: null
        }, V = ["rgba"], W = ["rgba4", "rgb565", "rgb5 a1"];
        n.ext_srgb && W.push("srgba"), n.ext_color_buffer_half_float && W.push("rgba16f", "rgb16f"), n.webgl_color_buffer_float && W.push("rgba32f");
        var Q = ["uint8"];
        n.oes_texture_half_float && Q.push("half float", "float16"), n.oes_texture_float && Q.push("float", "float32");
        function Y(ie, Z, P) {
          this.target = ie, this.texture = Z, this.renderbuffer = P;
          var be = 0, Se = 0;
          Z ? (be = Z.width, Se = Z.height) : P && (be = P.width, Se = P.height), this.width = be, this.height = Se;
        }
        function ee(ie) {
          ie && (ie.texture && ie.texture._texture.decRef(), ie.renderbuffer && ie.renderbuffer._renderbuffer.decRef());
        }
        function ae(ie, Z, P) {
          if (ie)
            if (ie.texture) {
              var be = ie.texture._texture, Se = Math.max(1, be.width), ce = Math.max(1, be.height);
              u(
                Se === Z && ce === P,
                "inconsistent width/height for supplied texture"
              ), be.refCount += 1;
            } else {
              var Fe = ie.renderbuffer._renderbuffer;
              u(
                Fe.width === Z && Fe.height === P,
                "inconsistent width/height for renderbuffer"
              ), Fe.refCount += 1;
            }
        }
        function H(ie, Z) {
          Z && (Z.texture ? e.framebufferTexture2D(
            Ut,
            ie,
            Z.target,
            Z.texture._texture.texture,
            0
          ) : e.framebufferRenderbuffer(
            Ut,
            ie,
            ha,
            Z.renderbuffer._renderbuffer.renderbuffer
          ));
        }
        function te(ie) {
          var Z = nr, P = null, be = null, Se = ie;
          typeof ie == "object" && (Se = ie.data, "target" in ie && (Z = ie.target | 0)), u.type(Se, "function", "invalid attachment data");
          var ce = Se._reglType;
          return ce === "texture2d" ? (P = Se, u(Z === nr)) : ce === "textureCube" ? (P = Se, u(
            Z >= gn && Z < gn + 6,
            "invalid cube map target"
          )) : ce === "renderbuffer" ? (be = Se, Z = ha) : u.raise("invalid regl object for attachment"), new Y(Z, P, be);
        }
        function w(ie, Z, P, be, Se) {
          if (P) {
            var ce = F.create2D({
              width: ie,
              height: Z,
              format: be,
              type: Se
            });
            return ce._texture.refCount = 0, new Y(nr, ce, null);
          } else {
            var Fe = N.create({
              width: ie,
              height: Z,
              format: be
            });
            return Fe._renderbuffer.refCount = 0, new Y(ha, null, Fe);
          }
        }
        function k(ie) {
          return ie && (ie.texture || ie.renderbuffer);
        }
        function K(ie, Z, P) {
          ie && (ie.texture ? ie.texture.resize(Z, P) : ie.renderbuffer && ie.renderbuffer.resize(Z, P), ie.width = Z, ie.height = P);
        }
        var se = 0, U = {};
        function fe() {
          this.id = se++, U[this.id] = this, this.framebuffer = e.createFramebuffer(), this.width = 0, this.height = 0, this.colorAttachments = [], this.depthAttachment = null, this.stencilAttachment = null, this.depthStencilAttachment = null;
        }
        function X(ie) {
          ie.colorAttachments.forEach(ee), ee(ie.depthAttachment), ee(ie.stencilAttachment), ee(ie.depthStencilAttachment);
        }
        function re(ie) {
          var Z = ie.framebuffer;
          u(Z, "must not double destroy framebuffer"), e.deleteFramebuffer(Z), ie.framebuffer = null, C.framebufferCount--, delete U[ie.id];
        }
        function j(ie) {
          var Z;
          e.bindFramebuffer(Ut, ie.framebuffer);
          var P = ie.colorAttachments;
          for (Z = 0; Z < P.length; ++Z)
            H(to + Z, P[Z]);
          for (Z = P.length; Z < d.maxColorAttachments; ++Z)
            e.framebufferTexture2D(
              Ut,
              to + Z,
              nr,
              null,
              0
            );
          e.framebufferTexture2D(
            Ut,
            ao,
            nr,
            null,
            0
          ), e.framebufferTexture2D(
            Ut,
            ro,
            nr,
            null,
            0
          ), e.framebufferTexture2D(
            Ut,
            no,
            nr,
            null,
            0
          ), H(ro, ie.depthAttachment), H(no, ie.stencilAttachment), H(ao, ie.depthStencilAttachment);
          var be = e.checkFramebufferStatus(Ut);
          !e.isContextLost() && be !== io && u.raise("framebuffer configuration not supported, status = " + Er[be]), e.bindFramebuffer(Ut, M.next ? M.next.framebuffer : null), M.cur = M.next, e.getError();
        }
        function ne(ie, Z) {
          var P = new fe();
          C.framebufferCount++;
          function be(ce, Fe) {
            var we;
            u(
              M.next !== P,
              "can not update framebuffer which is currently in use"
            );
            var Oe = 0, Ue = 0, Ze = !0, ot = !0, Be = null, rt = !0, je = "rgba", Je = "uint8", nt = 1, at = null, st = null, ut = null, Ye = !1;
            if (typeof ce == "number")
              Oe = ce | 0, Ue = Fe | 0 || Oe;
            else if (!ce)
              Oe = Ue = 1;
            else {
              u.type(ce, "object", "invalid arguments for framebuffer");
              var Le = ce;
              if ("shape" in Le) {
                var ct = Le.shape;
                u(
                  Array.isArray(ct) && ct.length >= 2,
                  "invalid shape for framebuffer"
                ), Oe = ct[0], Ue = ct[1];
              } else
                "radius" in Le && (Oe = Ue = Le.radius), "width" in Le && (Oe = Le.width), "height" in Le && (Ue = Le.height);
              ("color" in Le || "colors" in Le) && (Be = Le.color || Le.colors, Array.isArray(Be) && u(
                Be.length === 1 || n.webgl_draw_buffers,
                "multiple render targets not supported"
              )), Be || ("colorCount" in Le && (nt = Le.colorCount | 0, u(nt > 0, "invalid color buffer count")), "colorTexture" in Le && (rt = !!Le.colorTexture, je = "rgba4"), "colorType" in Le && (Je = Le.colorType, rt ? (u(
                n.oes_texture_float || !(Je === "float" || Je === "float32"),
                "you must enable OES_texture_float in order to use floating point framebuffer objects"
              ), u(
                n.oes_texture_half_float || !(Je === "half float" || Je === "float16"),
                "you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects"
              )) : Je === "half float" || Je === "float16" ? (u(
                n.ext_color_buffer_half_float,
                "you must enable EXT_color_buffer_half_float to use 16-bit render buffers"
              ), je = "rgba16f") : (Je === "float" || Je === "float32") && (u(
                n.webgl_color_buffer_float,
                "you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers"
              ), je = "rgba32f"), u.oneOf(Je, Q, "invalid color type")), "colorFormat" in Le && (je = Le.colorFormat, V.indexOf(je) >= 0 ? rt = !0 : W.indexOf(je) >= 0 ? rt = !1 : rt ? u.oneOf(
                Le.colorFormat,
                V,
                "invalid color format for texture"
              ) : u.oneOf(
                Le.colorFormat,
                W,
                "invalid color format for renderbuffer"
              ))), ("depthTexture" in Le || "depthStencilTexture" in Le) && (Ye = !!(Le.depthTexture || Le.depthStencilTexture), u(
                !Ye || n.webgl_depth_texture,
                "webgl_depth_texture extension not supported"
              )), "depth" in Le && (typeof Le.depth == "boolean" ? Ze = Le.depth : (at = Le.depth, ot = !1)), "stencil" in Le && (typeof Le.stencil == "boolean" ? ot = Le.stencil : (st = Le.stencil, Ze = !1)), "depthStencil" in Le && (typeof Le.depthStencil == "boolean" ? Ze = ot = Le.depthStencil : (ut = Le.depthStencil, Ze = !1, ot = !1));
            }
            var ze = null, pe = null, Me = null, De = null;
            if (Array.isArray(Be))
              ze = Be.map(te);
            else if (Be)
              ze = [te(Be)];
            else
              for (ze = new Array(nt), we = 0; we < nt; ++we)
                ze[we] = w(
                  Oe,
                  Ue,
                  rt,
                  je,
                  Je
                );
            u(
              n.webgl_draw_buffers || ze.length <= 1,
              "you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers."
            ), u(
              ze.length <= d.maxColorAttachments,
              "too many color attachments, not supported"
            ), Oe = Oe || ze[0].width, Ue = Ue || ze[0].height, at ? pe = te(at) : Ze && !ot && (pe = w(
              Oe,
              Ue,
              Ye,
              "depth",
              "uint32"
            )), st ? Me = te(st) : ot && !Ze && (Me = w(
              Oe,
              Ue,
              !1,
              "stencil",
              "uint8"
            )), ut ? De = te(ut) : !at && !st && ot && Ze && (De = w(
              Oe,
              Ue,
              Ye,
              "depth stencil",
              "depth stencil"
            )), u(
              !!at + !!st + !!ut <= 1,
              "invalid framebuffer configuration, can specify exactly one depth/stencil attachment"
            );
            var qe = null;
            for (we = 0; we < ze.length; ++we)
              if (ae(ze[we], Oe, Ue), u(
                !ze[we] || ze[we].texture && Au.indexOf(ze[we].texture._texture.format) >= 0 || ze[we].renderbuffer && Bu.indexOf(ze[we].renderbuffer._renderbuffer.format) >= 0,
                "framebuffer color attachment " + we + " is invalid"
              ), ze[we] && ze[we].texture) {
                var Pt = ma[ze[we].texture._texture.format] * En[ze[we].texture._texture.type];
                qe === null ? qe = Pt : u(
                  qe === Pt,
                  "all color attachments much have the same number of bits per pixel."
                );
              }
            return ae(pe, Oe, Ue), u(
              !pe || pe.texture && pe.texture._texture.format === Tu || pe.renderbuffer && pe.renderbuffer._renderbuffer.format === Ou,
              "invalid depth attachment for framebuffer object"
            ), ae(Me, Oe, Ue), u(
              !Me || Me.renderbuffer && Me.renderbuffer._renderbuffer.format === Cu,
              "invalid stencil attachment for framebuffer object"
            ), ae(De, Oe, Ue), u(
              !De || De.texture && De.texture._texture.format === fo || De.renderbuffer && De.renderbuffer._renderbuffer.format === fo,
              "invalid depth-stencil attachment for framebuffer object"
            ), X(P), P.width = Oe, P.height = Ue, P.colorAttachments = ze, P.depthAttachment = pe, P.stencilAttachment = Me, P.depthStencilAttachment = De, be.color = ze.map(k), be.depth = k(pe), be.stencil = k(Me), be.depthStencil = k(De), be.width = P.width, be.height = P.height, j(P), be;
          }
          function Se(ce, Fe) {
            u(
              M.next !== P,
              "can not resize a framebuffer which is currently in use"
            );
            var we = Math.max(ce | 0, 1), Oe = Math.max(Fe | 0 || we, 1);
            if (we === P.width && Oe === P.height)
              return be;
            for (var Ue = P.colorAttachments, Ze = 0; Ze < Ue.length; ++Ze)
              K(Ue[Ze], we, Oe);
            return K(P.depthAttachment, we, Oe), K(P.stencilAttachment, we, Oe), K(P.depthStencilAttachment, we, Oe), P.width = be.width = we, P.height = be.height = Oe, j(P), be;
          }
          return be(ie, Z), g(be, {
            resize: Se,
            _reglType: "framebuffer",
            _framebuffer: P,
            destroy: function() {
              re(P), X(P);
            },
            use: function(ce) {
              M.setFBO({
                framebuffer: be
              }, ce);
            }
          });
        }
        function me(ie) {
          var Z = Array(6);
          function P(Se) {
            var ce;
            u(
              Z.indexOf(M.next) < 0,
              "can not update framebuffer which is currently in use"
            );
            var Fe = {
              color: null
            }, we = 0, Oe = null, Ue = "rgba", Ze = "uint8", ot = 1;
            if (typeof Se == "number")
              we = Se | 0;
            else if (!Se)
              we = 1;
            else {
              u.type(Se, "object", "invalid arguments for framebuffer");
              var Be = Se;
              if ("shape" in Be) {
                var rt = Be.shape;
                u(
                  Array.isArray(rt) && rt.length >= 2,
                  "invalid shape for framebuffer"
                ), u(
                  rt[0] === rt[1],
                  "cube framebuffer must be square"
                ), we = rt[0];
              } else
                "radius" in Be && (we = Be.radius | 0), "width" in Be ? (we = Be.width | 0, "height" in Be && u(Be.height === we, "must be square")) : "height" in Be && (we = Be.height | 0);
              ("color" in Be || "colors" in Be) && (Oe = Be.color || Be.colors, Array.isArray(Oe) && u(
                Oe.length === 1 || n.webgl_draw_buffers,
                "multiple render targets not supported"
              )), Oe || ("colorCount" in Be && (ot = Be.colorCount | 0, u(ot > 0, "invalid color buffer count")), "colorType" in Be && (u.oneOf(
                Be.colorType,
                Q,
                "invalid color type"
              ), Ze = Be.colorType), "colorFormat" in Be && (Ue = Be.colorFormat, u.oneOf(
                Be.colorFormat,
                V,
                "invalid color format for texture"
              ))), "depth" in Be && (Fe.depth = Be.depth), "stencil" in Be && (Fe.stencil = Be.stencil), "depthStencil" in Be && (Fe.depthStencil = Be.depthStencil);
            }
            var je;
            if (Oe)
              if (Array.isArray(Oe))
                for (je = [], ce = 0; ce < Oe.length; ++ce)
                  je[ce] = Oe[ce];
              else
                je = [Oe];
            else {
              je = Array(ot);
              var Je = {
                radius: we,
                format: Ue,
                type: Ze
              };
              for (ce = 0; ce < ot; ++ce)
                je[ce] = F.createCube(Je);
            }
            for (Fe.color = Array(je.length), ce = 0; ce < je.length; ++ce) {
              var nt = je[ce];
              u(
                typeof nt == "function" && nt._reglType === "textureCube",
                "invalid cube map"
              ), we = we || nt.width, u(
                nt.width === we && nt.height === we,
                "invalid cube map shape"
              ), Fe.color[ce] = {
                target: gn,
                data: je[ce]
              };
            }
            for (ce = 0; ce < 6; ++ce) {
              for (var at = 0; at < je.length; ++at)
                Fe.color[at].target = gn + ce;
              ce > 0 && (Fe.depth = Z[0].depth, Fe.stencil = Z[0].stencil, Fe.depthStencil = Z[0].depthStencil), Z[ce] ? Z[ce](Fe) : Z[ce] = ne(Fe);
            }
            return g(P, {
              width: we,
              height: we,
              color: je
            });
          }
          function be(Se) {
            var ce, Fe = Se | 0;
            if (u(
              Fe > 0 && Fe <= d.maxCubeMapSize,
              "invalid radius for cube fbo"
            ), Fe === P.width)
              return P;
            var we = P.color;
            for (ce = 0; ce < we.length; ++ce)
              we[ce].resize(Fe);
            for (ce = 0; ce < 6; ++ce)
              Z[ce].resize(Fe);
            return P.width = P.height = Fe, P;
          }
          return P(ie), g(P, {
            faces: Z,
            resize: be,
            _reglType: "framebufferCube",
            destroy: function() {
              Z.forEach(function(Se) {
                Se.destroy();
              });
            }
          });
        }
        function Ee() {
          M.cur = null, M.next = null, M.dirty = !0, Rt(U).forEach(function(ie) {
            ie.framebuffer = e.createFramebuffer(), j(ie);
          });
        }
        return g(M, {
          getFramebuffer: function(ie) {
            if (typeof ie == "function" && ie._reglType === "framebuffer") {
              var Z = ie._framebuffer;
              if (Z instanceof fe)
                return Z;
            }
            return null;
          },
          create: ne,
          createCube: me,
          clear: function() {
            Rt(U).forEach(re);
          },
          restore: Ee
        });
      }
      var Nu = 5126, uo = 34962;
      function pa() {
        this.state = 0, this.x = 0, this.y = 0, this.z = 0, this.w = 0, this.buffer = null, this.size = 0, this.normalized = !1, this.type = Nu, this.offset = 0, this.stride = 0, this.divisor = 0;
      }
      function Du(e, n, d, F, N) {
        for (var C = d.maxAttributes, M = new Array(C), V = 0; V < C; ++V)
          M[V] = new pa();
        var W = 0, Q = {}, Y = {
          Record: pa,
          scope: {},
          state: M,
          currentVAO: null,
          targetVAO: null,
          restore: ae() ? U : function() {
          },
          createVAO: fe,
          getVAO: te,
          destroyBuffer: ee,
          setVAO: ae() ? w : k,
          clear: ae() ? K : function() {
          }
        };
        function ee(X) {
          for (var re = 0; re < M.length; ++re) {
            var j = M[re];
            j.buffer === X && (e.disableVertexAttribArray(re), j.buffer = null);
          }
        }
        function ae() {
          return n.oes_vertex_array_object;
        }
        function H() {
          return n.angle_instanced_arrays;
        }
        function te(X) {
          return typeof X == "function" && X._vao ? X._vao : null;
        }
        function w(X) {
          if (X !== Y.currentVAO) {
            var re = ae();
            X ? re.bindVertexArrayOES(X.vao) : re.bindVertexArrayOES(null), Y.currentVAO = X;
          }
        }
        function k(X) {
          if (X !== Y.currentVAO) {
            if (X)
              X.bindAttrs();
            else
              for (var re = H(), j = 0; j < M.length; ++j) {
                var ne = M[j];
                ne.buffer ? (e.enableVertexAttribArray(j), e.vertexAttribPointer(j, ne.size, ne.type, ne.normalized, ne.stride, ne.offfset), re && ne.divisor && re.vertexAttribDivisorANGLE(j, ne.divisor)) : (e.disableVertexAttribArray(j), e.vertexAttrib4f(j, ne.x, ne.y, ne.z, ne.w));
              }
            Y.currentVAO = X;
          }
        }
        function K() {
          Rt(Q).forEach(function(X) {
            X.destroy();
          });
        }
        function se() {
          this.id = ++W, this.attributes = [];
          var X = ae();
          X ? this.vao = X.createVertexArrayOES() : this.vao = null, Q[this.id] = this, this.buffers = [];
        }
        se.prototype.bindAttrs = function() {
          for (var X = H(), re = this.attributes, j = 0; j < re.length; ++j) {
            var ne = re[j];
            ne.buffer ? (e.enableVertexAttribArray(j), e.bindBuffer(uo, ne.buffer.buffer), e.vertexAttribPointer(j, ne.size, ne.type, ne.normalized, ne.stride, ne.offset), X && ne.divisor && X.vertexAttribDivisorANGLE(j, ne.divisor)) : (e.disableVertexAttribArray(j), e.vertexAttrib4f(j, ne.x, ne.y, ne.z, ne.w));
          }
          for (var me = re.length; me < C; ++me)
            e.disableVertexAttribArray(me);
        }, se.prototype.refresh = function() {
          var X = ae();
          X && (X.bindVertexArrayOES(this.vao), this.bindAttrs(), Y.currentVAO = this);
        }, se.prototype.destroy = function() {
          if (this.vao) {
            var X = ae();
            this === Y.currentVAO && (Y.currentVAO = null, X.bindVertexArrayOES(null)), X.deleteVertexArrayOES(this.vao), this.vao = null;
          }
          Q[this.id] && (delete Q[this.id], F.vaoCount -= 1);
        };
        function U() {
          var X = ae();
          X && Rt(Q).forEach(function(re) {
            re.refresh();
          });
        }
        function fe(X) {
          var re = new se();
          F.vaoCount += 1;
          function j(ne) {
            u(Array.isArray(ne), "arguments to vertex array constructor must be an array"), u(ne.length < C, "too many attributes"), u(ne.length > 0, "must specify at least one attribute");
            var me = {}, Ee = re.attributes;
            Ee.length = ne.length;
            for (var ie = 0; ie < ne.length; ++ie) {
              var Z = ne[ie], P = Ee[ie] = new pa(), be = Z.data || Z;
              if (Array.isArray(be) || l(be) || Mt(be)) {
                var Se;
                re.buffers[ie] && (Se = re.buffers[ie], l(be) && Se._buffer.byteLength >= be.byteLength ? Se.subdata(be) : (Se.destroy(), re.buffers[ie] = null)), re.buffers[ie] || (Se = re.buffers[ie] = N.create(Z, uo, !1, !0)), P.buffer = N.getBuffer(Se), P.size = P.buffer.dimension | 0, P.normalized = !1, P.type = P.buffer.dtype, P.offset = 0, P.stride = 0, P.divisor = 0, P.state = 1, me[ie] = 1;
              } else N.getBuffer(Z) ? (P.buffer = N.getBuffer(Z), P.size = P.buffer.dimension | 0, P.normalized = !1, P.type = P.buffer.dtype, P.offset = 0, P.stride = 0, P.divisor = 0, P.state = 1) : N.getBuffer(Z.buffer) ? (P.buffer = N.getBuffer(Z.buffer), P.size = (+Z.size || P.buffer.dimension) | 0, P.normalized = !!Z.normalized || !1, "type" in Z ? (u.parameter(Z.type, Jt, "invalid buffer type"), P.type = Jt[Z.type]) : P.type = P.buffer.dtype, P.offset = (Z.offset || 0) | 0, P.stride = (Z.stride || 0) | 0, P.divisor = (Z.divisor || 0) | 0, P.state = 1, u(P.size >= 1 && P.size <= 4, "size must be between 1 and 4"), u(P.offset >= 0, "invalid offset"), u(P.stride >= 0 && P.stride <= 255, "stride must be between 0 and 255"), u(P.divisor >= 0, "divisor must be positive"), u(!P.divisor || !!n.angle_instanced_arrays, "ANGLE_instanced_arrays must be enabled to use divisor")) : "x" in Z ? (u(ie > 0, "first attribute must not be a constant"), P.x = +Z.x || 0, P.y = +Z.y || 0, P.z = +Z.z || 0, P.w = +Z.w || 0, P.state = 2) : u(!1, "invalid attribute spec for location " + ie);
            }
            for (var ce = 0; ce < re.buffers.length; ++ce)
              !me[ce] && re.buffers[ce] && (re.buffers[ce].destroy(), re.buffers[ce] = null);
            return re.refresh(), j;
          }
          return j.destroy = function() {
            for (var ne = 0; ne < re.buffers.length; ++ne)
              re.buffers[ne] && re.buffers[ne].destroy();
            re.buffers.length = 0, re.destroy();
          }, j._vao = re, j._reglType = "vao", j(X);
        }
        return Y;
      }
      var co = 35632, Pu = 35633, Uu = 35718, $u = 35721;
      function zu(e, n, d, F) {
        var N = {}, C = {};
        function M(w, k, K, se) {
          this.name = w, this.id = k, this.location = K, this.info = se;
        }
        function V(w, k) {
          for (var K = 0; K < w.length; ++K)
            if (w[K].id === k.id) {
              w[K].location = k.location;
              return;
            }
          w.push(k);
        }
        function W(w, k, K) {
          var se = w === co ? N : C, U = se[k];
          if (!U) {
            var fe = n.str(k);
            U = e.createShader(w), e.shaderSource(U, fe), e.compileShader(U), u.shaderError(e, U, fe, w, K), se[k] = U;
          }
          return U;
        }
        var Q = {}, Y = [], ee = 0;
        function ae(w, k) {
          this.id = ee++, this.fragId = w, this.vertId = k, this.program = null, this.uniforms = [], this.attributes = [], this.refCount = 1, F.profile && (this.stats = {
            uniformsCount: 0,
            attributesCount: 0
          });
        }
        function H(w, k, K) {
          var se, U, fe = W(co, w.fragId), X = W(Pu, w.vertId), re = w.program = e.createProgram();
          if (e.attachShader(re, fe), e.attachShader(re, X), K)
            for (se = 0; se < K.length; ++se) {
              var j = K[se];
              e.bindAttribLocation(re, j[0], j[1]);
            }
          e.linkProgram(re), u.linkError(
            e,
            re,
            n.str(w.fragId),
            n.str(w.vertId),
            k
          );
          var ne = e.getProgramParameter(re, Uu);
          F.profile && (w.stats.uniformsCount = ne);
          var me = w.uniforms;
          for (se = 0; se < ne; ++se)
            if (U = e.getActiveUniform(re, se), U)
              if (U.size > 1)
                for (var Ee = 0; Ee < U.size; ++Ee) {
                  var ie = U.name.replace("[0]", "[" + Ee + "]");
                  V(me, new M(
                    ie,
                    n.id(ie),
                    e.getUniformLocation(re, ie),
                    U
                  ));
                }
              else
                V(me, new M(
                  U.name,
                  n.id(U.name),
                  e.getUniformLocation(re, U.name),
                  U
                ));
          var Z = e.getProgramParameter(re, $u);
          F.profile && (w.stats.attributesCount = Z);
          var P = w.attributes;
          for (se = 0; se < Z; ++se)
            U = e.getActiveAttrib(re, se), U && V(P, new M(
              U.name,
              n.id(U.name),
              e.getAttribLocation(re, U.name),
              U
            ));
        }
        F.profile && (d.getMaxUniformsCount = function() {
          var w = 0;
          return Y.forEach(function(k) {
            k.stats.uniformsCount > w && (w = k.stats.uniformsCount);
          }), w;
        }, d.getMaxAttributesCount = function() {
          var w = 0;
          return Y.forEach(function(k) {
            k.stats.attributesCount > w && (w = k.stats.attributesCount);
          }), w;
        });
        function te() {
          N = {}, C = {};
          for (var w = 0; w < Y.length; ++w)
            H(Y[w], null, Y[w].attributes.map(function(k) {
              return [k.location, k.name];
            }));
        }
        return {
          clear: function() {
            var w = e.deleteShader.bind(e);
            Rt(N).forEach(w), N = {}, Rt(C).forEach(w), C = {}, Y.forEach(function(k) {
              e.deleteProgram(k.program);
            }), Y.length = 0, Q = {}, d.shaderCount = 0;
          },
          program: function(w, k, K, se) {
            u.command(w >= 0, "missing vertex shader", K), u.command(k >= 0, "missing fragment shader", K);
            var U = Q[k];
            U || (U = Q[k] = {});
            var fe = U[w];
            if (fe && (fe.refCount++, !se))
              return fe;
            var X = new ae(k, w);
            return d.shaderCount++, H(X, K, se), fe || (U[w] = X), Y.push(X), g(X, {
              destroy: function() {
                if (X.refCount--, X.refCount <= 0) {
                  e.deleteProgram(X.program);
                  var re = Y.indexOf(X);
                  Y.splice(re, 1), d.shaderCount--;
                }
                U[X.vertId].refCount <= 0 && (e.deleteShader(C[X.vertId]), delete C[X.vertId], delete Q[X.fragId][X.vertId]), Object.keys(Q[X.fragId]).length || (e.deleteShader(N[X.fragId]), delete N[X.fragId], delete Q[X.fragId]);
              }
            });
          },
          restore: te,
          shader: W,
          frag: -1,
          vert: -1
        };
      }
      var ju = 6408, $r = 5121, Xu = 3333, xn = 5126;
      function Vu(e, n, d, F, N, C, M) {
        function V(Y) {
          var ee;
          n.next === null ? (u(
            N.preserveDrawingBuffer,
            'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer'
          ), ee = $r) : (u(
            n.next.colorAttachments[0].texture !== null,
            "You cannot read from a renderbuffer"
          ), ee = n.next.colorAttachments[0].texture._texture.type, C.oes_texture_float ? (u(
            ee === $r || ee === xn,
            "Reading from a framebuffer is only allowed for the types 'uint8' and 'float'"
          ), ee === xn && u(M.readFloat, "Reading 'float' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float")) : u(
            ee === $r,
            "Reading from a framebuffer is only allowed for the type 'uint8'"
          ));
          var ae = 0, H = 0, te = F.framebufferWidth, w = F.framebufferHeight, k = null;
          l(Y) ? k = Y : Y && (u.type(Y, "object", "invalid arguments to regl.read()"), ae = Y.x | 0, H = Y.y | 0, u(
            ae >= 0 && ae < F.framebufferWidth,
            "invalid x offset for regl.read"
          ), u(
            H >= 0 && H < F.framebufferHeight,
            "invalid y offset for regl.read"
          ), te = (Y.width || F.framebufferWidth - ae) | 0, w = (Y.height || F.framebufferHeight - H) | 0, k = Y.data || null), k && (ee === $r ? u(
            k instanceof Uint8Array,
            "buffer must be 'Uint8Array' when reading from a framebuffer of type 'uint8'"
          ) : ee === xn && u(
            k instanceof Float32Array,
            "buffer must be 'Float32Array' when reading from a framebuffer of type 'float'"
          )), u(
            te > 0 && te + ae <= F.framebufferWidth,
            "invalid width for read pixels"
          ), u(
            w > 0 && w + H <= F.framebufferHeight,
            "invalid height for read pixels"
          ), d();
          var K = te * w * 4;
          return k || (ee === $r ? k = new Uint8Array(K) : ee === xn && (k = k || new Float32Array(K))), u.isTypedArray(k, "data buffer for regl.read() must be a typedarray"), u(k.byteLength >= K, "data buffer for regl.read() too small"), e.pixelStorei(Xu, 4), e.readPixels(
            ae,
            H,
            te,
            w,
            ju,
            ee,
            k
          ), k;
        }
        function W(Y) {
          var ee;
          return n.setFBO({
            framebuffer: Y.framebuffer
          }, function() {
            ee = V(Y);
          }), ee;
        }
        function Q(Y) {
          return !Y || !("framebuffer" in Y) ? V(Y) : W(Y);
        }
        return Q;
      }
      function xr(e) {
        return Array.prototype.slice.call(e);
      }
      function wr(e) {
        return xr(e).join("");
      }
      function Hu() {
        var e = 0, n = [], d = [];
        function F(ee) {
          for (var ae = 0; ae < d.length; ++ae)
            if (d[ae] === ee)
              return n[ae];
          var H = "g" + e++;
          return n.push(H), d.push(ee), H;
        }
        function N() {
          var ee = [];
          function ae() {
            ee.push.apply(ee, xr(arguments));
          }
          var H = [];
          function te() {
            var w = "v" + e++;
            return H.push(w), arguments.length > 0 && (ee.push(w, "="), ee.push.apply(ee, xr(arguments)), ee.push(";")), w;
          }
          return g(ae, {
            def: te,
            toString: function() {
              return wr([
                H.length > 0 ? "var " + H.join(",") + ";" : "",
                wr(ee)
              ]);
            }
          });
        }
        function C() {
          var ee = N(), ae = N(), H = ee.toString, te = ae.toString;
          function w(k, K) {
            ae(k, K, "=", ee.def(k, K), ";");
          }
          return g(function() {
            ee.apply(ee, xr(arguments));
          }, {
            def: ee.def,
            entry: ee,
            exit: ae,
            save: w,
            set: function(k, K, se) {
              w(k, K), ee(k, K, "=", se, ";");
            },
            toString: function() {
              return H() + te();
            }
          });
        }
        function M() {
          var ee = wr(arguments), ae = C(), H = C(), te = ae.toString, w = H.toString;
          return g(ae, {
            then: function() {
              return ae.apply(ae, xr(arguments)), this;
            },
            else: function() {
              return H.apply(H, xr(arguments)), this;
            },
            toString: function() {
              var k = w();
              return k && (k = "else{" + k + "}"), wr([
                "if(",
                ee,
                "){",
                te(),
                "}",
                k
              ]);
            }
          });
        }
        var V = N(), W = {};
        function Q(ee, ae) {
          var H = [];
          function te() {
            var U = "a" + H.length;
            return H.push(U), U;
          }
          ae = ae || 0;
          for (var w = 0; w < ae; ++w)
            te();
          var k = C(), K = k.toString, se = W[ee] = g(k, {
            arg: te,
            toString: function() {
              return wr([
                "function(",
                H.join(),
                "){",
                K(),
                "}"
              ]);
            }
          });
          return se;
        }
        function Y() {
          var ee = [
            '"use strict";',
            V,
            "return {"
          ];
          Object.keys(W).forEach(function(te) {
            ee.push('"', te, '":', W[te].toString(), ",");
          }), ee.push("}");
          var ae = wr(ee).replace(/;/g, `;
`).replace(/}/g, `}
`).replace(/{/g, `{
`), H = Function.apply(null, n.concat(ae));
          return H.apply(null, d);
        }
        return {
          global: V,
          link: F,
          block: N,
          proc: Q,
          scope: C,
          cond: M,
          compile: Y
        };
      }
      var Tr = "xyzw".split(""), lo = 5121, Ar = 1, va = 2, ya = 0, _a = 1, ba = 2, ga = 3, wn = 4, ho = 5, mo = 6, po = "dither", vo = "blend.enable", yo = "blend.color", Ea = "blend.equation", xa = "blend.func", _o = "depth.enable", bo = "depth.func", go = "depth.range", Eo = "depth.mask", wa = "colorMask", xo = "cull.enable", wo = "cull.face", Ta = "frontFace", Aa = "lineWidth", To = "polygonOffset.enable", Sa = "polygonOffset.offset", Ao = "sample.alpha", So = "sample.enable", La = "sample.coverage", Lo = "stencil.enable", Ro = "stencil.mask", Ra = "stencil.func", Oa = "stencil.opFront", zr = "stencil.opBack", Oo = "scissor.enable", Tn = "scissor.box", $t = "viewport", jr = "profile", ar = "framebuffer", Xr = "vert", Vr = "frag", ir = "elements", or = "primitive", sr = "count", An = "offset", Sn = "instances", Hr = "vao", Ca = "Width", Fa = "Height", Sr = ar + Ca, Lr = ar + Fa, Wu = $t + Ca, Yu = $t + Fa, Co = "drawingBuffer", Fo = Co + Ca, Go = Co + Fa, qu = [
        xa,
        Ea,
        Ra,
        Oa,
        zr,
        La,
        $t,
        Tn,
        Sa
      ], Rr = 34962, Ku = 34963, Qu = 35632, Zu = 35633, Mo = 3553, Ju = 34067, ec = 2884, tc = 3042, rc = 3024, nc = 2960, ac = 2929, ic = 3089, oc = 32823, sc = 32926, fc = 32928, Ga = 5126, Ln = 35664, Rn = 35665, On = 35666, Ma = 5124, Cn = 35667, Fn = 35668, Gn = 35669, ka = 35670, Mn = 35671, kn = 35672, Bn = 35673, Wr = 35674, Yr = 35675, qr = 35676, Kr = 35678, Qr = 35680, ko = 4, Zr = 1028, fr = 1029, Bo = 2304, Ba = 2305, uc = 32775, cc = 32776, lc = 519, Wt = 7680, Io = 0, No = 1, Do = 32774, dc = 513, Po = 36160, hc = 36064, Dt = {
        0: 0,
        1: 1,
        zero: 0,
        one: 1,
        "src color": 768,
        "one minus src color": 769,
        "src alpha": 770,
        "one minus src alpha": 771,
        "dst color": 774,
        "one minus dst color": 775,
        "dst alpha": 772,
        "one minus dst alpha": 773,
        "constant color": 32769,
        "one minus constant color": 32770,
        "constant alpha": 32771,
        "one minus constant alpha": 32772,
        "src alpha saturate": 776
      }, Uo = [
        "constant color, constant alpha",
        "one minus constant color, constant alpha",
        "constant color, one minus constant alpha",
        "one minus constant color, one minus constant alpha",
        "constant alpha, constant color",
        "constant alpha, one minus constant color",
        "one minus constant alpha, constant color",
        "one minus constant alpha, one minus constant color"
      ], Or = {
        never: 512,
        less: 513,
        "<": 513,
        equal: 514,
        "=": 514,
        "==": 514,
        "===": 514,
        lequal: 515,
        "<=": 515,
        greater: 516,
        ">": 516,
        notequal: 517,
        "!=": 517,
        "!==": 517,
        gequal: 518,
        ">=": 518,
        always: 519
      }, Yt = {
        0: 0,
        zero: 0,
        keep: 7680,
        replace: 7681,
        increment: 7682,
        decrement: 7683,
        "increment wrap": 34055,
        "decrement wrap": 34056,
        invert: 5386
      }, $o = {
        frag: Qu,
        vert: Zu
      }, Ia = {
        cw: Bo,
        ccw: Ba
      };
      function In(e) {
        return Array.isArray(e) || l(e) || Mt(e);
      }
      function zo(e) {
        return e.sort(function(n, d) {
          return n === $t ? -1 : d === $t ? 1 : n < d ? -1 : 1;
        });
      }
      function bt(e, n, d, F) {
        this.thisDep = e, this.contextDep = n, this.propDep = d, this.append = F;
      }
      function qt(e) {
        return e && !(e.thisDep || e.contextDep || e.propDep);
      }
      function Qe(e) {
        return new bt(!1, !1, !1, e);
      }
      function wt(e, n) {
        var d = e.type;
        if (d === ya) {
          var F = e.data.length;
          return new bt(
            !0,
            F >= 1,
            F >= 2,
            n
          );
        } else if (d === wn) {
          var N = e.data;
          return new bt(
            N.thisDep,
            N.contextDep,
            N.propDep,
            n
          );
        } else {
          if (d === ho)
            return new bt(
              !1,
              !1,
              !1,
              n
            );
          if (d === mo) {
            for (var C = !1, M = !1, V = !1, W = 0; W < e.data.length; ++W) {
              var Q = e.data[W];
              if (Q.type === _a)
                V = !0;
              else if (Q.type === ba)
                M = !0;
              else if (Q.type === ga)
                C = !0;
              else if (Q.type === ya) {
                C = !0;
                var Y = Q.data;
                Y >= 1 && (M = !0), Y >= 2 && (V = !0);
              } else Q.type === wn && (C = C || Q.data.thisDep, M = M || Q.data.contextDep, V = V || Q.data.propDep);
            }
            return new bt(
              C,
              M,
              V,
              n
            );
          } else
            return new bt(
              d === ga,
              d === ba,
              d === _a,
              n
            );
        }
      }
      var jo = new bt(!1, !1, !1, function() {
      });
      function mc(e, n, d, F, N, C, M, V, W, Q, Y, ee, ae, H, te) {
        var w = Q.Record, k = {
          add: 32774,
          subtract: 32778,
          "reverse subtract": 32779
        };
        d.ext_blend_minmax && (k.min = uc, k.max = cc);
        var K = d.angle_instanced_arrays, se = d.webgl_draw_buffers, U = {
          dirty: !0,
          profile: te.profile
        }, fe = {}, X = [], re = {}, j = {};
        function ne(s) {
          return s.replace(".", "_");
        }
        function me(s, t, m) {
          var E = ne(s);
          X.push(s), fe[E] = U[E] = !!m, re[E] = t;
        }
        function Ee(s, t, m) {
          var E = ne(s);
          X.push(s), Array.isArray(m) ? (U[E] = m.slice(), fe[E] = m.slice()) : U[E] = fe[E] = m, j[E] = t;
        }
        me(po, rc), me(vo, tc), Ee(yo, "blendColor", [0, 0, 0, 0]), Ee(
          Ea,
          "blendEquationSeparate",
          [Do, Do]
        ), Ee(
          xa,
          "blendFuncSeparate",
          [No, Io, No, Io]
        ), me(_o, ac, !0), Ee(bo, "depthFunc", dc), Ee(go, "depthRange", [0, 1]), Ee(Eo, "depthMask", !0), Ee(wa, wa, [!0, !0, !0, !0]), me(xo, ec), Ee(wo, "cullFace", fr), Ee(Ta, Ta, Ba), Ee(Aa, Aa, 1), me(To, oc), Ee(Sa, "polygonOffset", [0, 0]), me(Ao, sc), me(So, fc), Ee(La, "sampleCoverage", [1, !1]), me(Lo, nc), Ee(Ro, "stencilMask", -1), Ee(Ra, "stencilFunc", [lc, 0, -1]), Ee(
          Oa,
          "stencilOpSeparate",
          [Zr, Wt, Wt, Wt]
        ), Ee(
          zr,
          "stencilOpSeparate",
          [fr, Wt, Wt, Wt]
        ), me(Oo, ic), Ee(
          Tn,
          "scissor",
          [0, 0, e.drawingBufferWidth, e.drawingBufferHeight]
        ), Ee(
          $t,
          $t,
          [0, 0, e.drawingBufferWidth, e.drawingBufferHeight]
        );
        var ie = {
          gl: e,
          context: ae,
          strings: n,
          next: fe,
          current: U,
          draw: ee,
          elements: C,
          buffer: N,
          shader: Y,
          attributes: Q.state,
          vao: Q,
          uniforms: W,
          framebuffer: V,
          extensions: d,
          timer: H,
          isBufferArgs: In
        }, Z = {
          primTypes: mr,
          compareFuncs: Or,
          blendFuncs: Dt,
          blendEquations: k,
          stencilOps: Yt,
          glTypes: Jt,
          orientationType: Ia
        };
        u.optional(function() {
          ie.isArrayLike = We;
        }), se && (Z.backBuffer = [fr], Z.drawBuffer = xt(F.maxDrawbuffers, function(s) {
          return s === 0 ? [0] : xt(s, function(t) {
            return hc + t;
          });
        }));
        var P = 0;
        function be() {
          var s = Hu(), t = s.link, m = s.global;
          s.id = P++, s.batchId = "0";
          var E = t(ie), T = s.shared = {
            props: "a0"
          };
          Object.keys(ie).forEach(function(h) {
            T[h] = m.def(E, ".", h);
          }), u.optional(function() {
            s.CHECK = t(u), s.commandStr = u.guessCommand(), s.command = t(s.commandStr), s.assert = function(h, o, b) {
              h(
                "if(!(",
                o,
                "))",
                this.CHECK,
                ".commandRaise(",
                t(b),
                ",",
                this.command,
                ");"
              );
            }, Z.invalidBlendCombinations = Uo;
          });
          var v = s.next = {}, p = s.current = {};
          Object.keys(j).forEach(function(h) {
            Array.isArray(U[h]) && (v[h] = m.def(T.next, ".", h), p[h] = m.def(T.current, ".", h));
          });
          var _ = s.constants = {};
          Object.keys(Z).forEach(function(h) {
            _[h] = m.def(JSON.stringify(Z[h]));
          }), s.invoke = function(h, o) {
            switch (o.type) {
              case ya:
                var b = [
                  "this",
                  T.context,
                  T.props,
                  s.batchId
                ];
                return h.def(
                  t(o.data),
                  ".call(",
                  b.slice(0, Math.max(o.data.length + 1, 4)),
                  ")"
                );
              case _a:
                return h.def(T.props, o.data);
              case ba:
                return h.def(T.context, o.data);
              case ga:
                return h.def("this", o.data);
              case wn:
                return o.data.append(s, h), o.data.ref;
              case ho:
                return o.data.toString();
              case mo:
                return o.data.map(function(S) {
                  return s.invoke(h, S);
                });
            }
          }, s.attribCache = {};
          var f = {};
          return s.scopeAttrib = function(h) {
            var o = n.id(h);
            if (o in f)
              return f[o];
            var b = Q.scope[o];
            b || (b = Q.scope[o] = new w());
            var S = f[o] = t(b);
            return S;
          }, s;
        }
        function Se(s) {
          var t = s.static, m = s.dynamic, E;
          if (jr in t) {
            var T = !!t[jr];
            E = Qe(function(p, _) {
              return T;
            }), E.enable = T;
          } else if (jr in m) {
            var v = m[jr];
            E = wt(v, function(p, _) {
              return p.invoke(_, v);
            });
          }
          return E;
        }
        function ce(s, t) {
          var m = s.static, E = s.dynamic;
          if (ar in m) {
            var T = m[ar];
            return T ? (T = V.getFramebuffer(T), u.command(T, "invalid framebuffer object"), Qe(function(p, _) {
              var f = p.link(T), h = p.shared;
              _.set(
                h.framebuffer,
                ".next",
                f
              );
              var o = h.context;
              return _.set(
                o,
                "." + Sr,
                f + ".width"
              ), _.set(
                o,
                "." + Lr,
                f + ".height"
              ), f;
            })) : Qe(function(p, _) {
              var f = p.shared;
              _.set(
                f.framebuffer,
                ".next",
                "null"
              );
              var h = f.context;
              return _.set(
                h,
                "." + Sr,
                h + "." + Fo
              ), _.set(
                h,
                "." + Lr,
                h + "." + Go
              ), "null";
            });
          } else if (ar in E) {
            var v = E[ar];
            return wt(v, function(p, _) {
              var f = p.invoke(_, v), h = p.shared, o = h.framebuffer, b = _.def(
                o,
                ".getFramebuffer(",
                f,
                ")"
              );
              u.optional(function() {
                p.assert(
                  _,
                  "!" + f + "||" + b,
                  "invalid framebuffer object"
                );
              }), _.set(
                o,
                ".next",
                b
              );
              var S = h.context;
              return _.set(
                S,
                "." + Sr,
                b + "?" + b + ".width:" + S + "." + Fo
              ), _.set(
                S,
                "." + Lr,
                b + "?" + b + ".height:" + S + "." + Go
              ), b;
            });
          } else
            return null;
        }
        function Fe(s, t, m) {
          var E = s.static, T = s.dynamic;
          function v(f) {
            if (f in E) {
              var h = E[f];
              u.commandType(h, "object", "invalid " + f, m.commandStr);
              var o = !0, b = h.x | 0, S = h.y | 0, I, D;
              return "width" in h ? (I = h.width | 0, u.command(I >= 0, "invalid " + f, m.commandStr)) : o = !1, "height" in h ? (D = h.height | 0, u.command(D >= 0, "invalid " + f, m.commandStr)) : o = !1, new bt(
                !o && t && t.thisDep,
                !o && t && t.contextDep,
                !o && t && t.propDep,
                function(he, Re) {
                  var le = he.shared.context, _e = I;
                  "width" in h || (_e = Re.def(le, ".", Sr, "-", b));
                  var Ae = D;
                  return "height" in h || (Ae = Re.def(le, ".", Lr, "-", S)), [b, S, _e, Ae];
                }
              );
            } else if (f in T) {
              var B = T[f], q = wt(B, function(he, Re) {
                var le = he.invoke(Re, B);
                u.optional(function() {
                  he.assert(
                    Re,
                    le + "&&typeof " + le + '==="object"',
                    "invalid " + f
                  );
                });
                var _e = he.shared.context, Ae = Re.def(le, ".x|0"), $e = Re.def(le, ".y|0"), Xe = Re.def(
                  '"width" in ',
                  le,
                  "?",
                  le,
                  ".width|0:",
                  "(",
                  _e,
                  ".",
                  Sr,
                  "-",
                  Ae,
                  ")"
                ), gt = Re.def(
                  '"height" in ',
                  le,
                  "?",
                  le,
                  ".height|0:",
                  "(",
                  _e,
                  ".",
                  Lr,
                  "-",
                  $e,
                  ")"
                );
                return u.optional(function() {
                  he.assert(
                    Re,
                    Xe + ">=0&&" + gt + ">=0",
                    "invalid " + f
                  );
                }), [Ae, $e, Xe, gt];
              });
              return t && (q.thisDep = q.thisDep || t.thisDep, q.contextDep = q.contextDep || t.contextDep, q.propDep = q.propDep || t.propDep), q;
            } else return t ? new bt(
              t.thisDep,
              t.contextDep,
              t.propDep,
              function(he, Re) {
                var le = he.shared.context;
                return [
                  0,
                  0,
                  Re.def(le, ".", Sr),
                  Re.def(le, ".", Lr)
                ];
              }
            ) : null;
          }
          var p = v($t);
          if (p) {
            var _ = p;
            p = new bt(
              p.thisDep,
              p.contextDep,
              p.propDep,
              function(f, h) {
                var o = _.append(f, h), b = f.shared.context;
                return h.set(
                  b,
                  "." + Wu,
                  o[2]
                ), h.set(
                  b,
                  "." + Yu,
                  o[3]
                ), o;
              }
            );
          }
          return {
            viewport: p,
            scissor_box: v(Tn)
          };
        }
        function we(s, t) {
          var m = s.static, E = typeof m[Vr] == "string" && typeof m[Xr] == "string";
          if (E) {
            if (Object.keys(t.dynamic).length > 0)
              return null;
            var T = t.static, v = Object.keys(T);
            if (v.length > 0 && typeof T[v[0]] == "number") {
              for (var p = [], _ = 0; _ < v.length; ++_)
                u(typeof T[v[_]] == "number", "must specify all vertex attribute locations when using vaos"), p.push([T[v[_]] | 0, v[_]]);
              return p;
            }
          }
          return null;
        }
        function Oe(s, t, m) {
          var E = s.static, T = s.dynamic;
          function v(o) {
            if (o in E) {
              var b = n.id(E[o]);
              u.optional(function() {
                Y.shader($o[o], b, u.guessCommand());
              });
              var S = Qe(function() {
                return b;
              });
              return S.id = b, S;
            } else if (o in T) {
              var I = T[o];
              return wt(I, function(D, B) {
                var q = D.invoke(B, I), he = B.def(D.shared.strings, ".id(", q, ")");
                return u.optional(function() {
                  B(
                    D.shared.shader,
                    ".shader(",
                    $o[o],
                    ",",
                    he,
                    ",",
                    D.command,
                    ");"
                  );
                }), he;
              });
            }
            return null;
          }
          var p = v(Vr), _ = v(Xr), f = null, h;
          return qt(p) && qt(_) ? (f = Y.program(_.id, p.id, null, m), h = Qe(function(o, b) {
            return o.link(f);
          })) : h = new bt(
            p && p.thisDep || _ && _.thisDep,
            p && p.contextDep || _ && _.contextDep,
            p && p.propDep || _ && _.propDep,
            function(o, b) {
              var S = o.shared.shader, I;
              p ? I = p.append(o, b) : I = b.def(S, ".", Vr);
              var D;
              _ ? D = _.append(o, b) : D = b.def(S, ".", Xr);
              var B = S + ".program(" + D + "," + I;
              return u.optional(function() {
                B += "," + o.command;
              }), b.def(B + ")");
            }
          ), {
            frag: p,
            vert: _,
            progVar: h,
            program: f
          };
        }
        function Ue(s, t) {
          var m = s.static, E = s.dynamic;
          function T() {
            if (ir in m) {
              var o = m[ir];
              In(o) ? o = C.getElements(C.create(o, !0)) : o && (o = C.getElements(o), u.command(o, "invalid elements", t.commandStr));
              var b = Qe(function(I, D) {
                if (o) {
                  var B = I.link(o);
                  return I.ELEMENTS = B, B;
                }
                return I.ELEMENTS = null, null;
              });
              return b.value = o, b;
            } else if (ir in E) {
              var S = E[ir];
              return wt(S, function(I, D) {
                var B = I.shared, q = B.isBufferArgs, he = B.elements, Re = I.invoke(D, S), le = D.def("null"), _e = D.def(q, "(", Re, ")"), Ae = I.cond(_e).then(le, "=", he, ".createStream(", Re, ");").else(le, "=", he, ".getElements(", Re, ");");
                return u.optional(function() {
                  I.assert(
                    Ae.else,
                    "!" + Re + "||" + le,
                    "invalid elements"
                  );
                }), D.entry(Ae), D.exit(
                  I.cond(_e).then(he, ".destroyStream(", le, ");")
                ), I.ELEMENTS = le, le;
              });
            }
            return null;
          }
          var v = T();
          function p() {
            if (or in m) {
              var o = m[or];
              return u.commandParameter(o, mr, "invalid primitve", t.commandStr), Qe(function(S, I) {
                return mr[o];
              });
            } else if (or in E) {
              var b = E[or];
              return wt(b, function(S, I) {
                var D = S.constants.primTypes, B = S.invoke(I, b);
                return u.optional(function() {
                  S.assert(
                    I,
                    B + " in " + D,
                    "invalid primitive, must be one of " + Object.keys(mr)
                  );
                }), I.def(D, "[", B, "]");
              });
            } else if (v)
              return qt(v) ? v.value ? Qe(function(S, I) {
                return I.def(S.ELEMENTS, ".primType");
              }) : Qe(function() {
                return ko;
              }) : new bt(
                v.thisDep,
                v.contextDep,
                v.propDep,
                function(S, I) {
                  var D = S.ELEMENTS;
                  return I.def(D, "?", D, ".primType:", ko);
                }
              );
            return null;
          }
          function _(o, b) {
            if (o in m) {
              var S = m[o] | 0;
              return u.command(!b || S >= 0, "invalid " + o, t.commandStr), Qe(function(D, B) {
                return b && (D.OFFSET = S), S;
              });
            } else if (o in E) {
              var I = E[o];
              return wt(I, function(D, B) {
                var q = D.invoke(B, I);
                return b && (D.OFFSET = q, u.optional(function() {
                  D.assert(
                    B,
                    q + ">=0",
                    "invalid " + o
                  );
                })), q;
              });
            } else if (b && v)
              return Qe(function(D, B) {
                return D.OFFSET = "0", 0;
              });
            return null;
          }
          var f = _(An, !0);
          function h() {
            if (sr in m) {
              var o = m[sr] | 0;
              return u.command(
                typeof o == "number" && o >= 0,
                "invalid vertex count",
                t.commandStr
              ), Qe(function() {
                return o;
              });
            } else if (sr in E) {
              var b = E[sr];
              return wt(b, function(D, B) {
                var q = D.invoke(B, b);
                return u.optional(function() {
                  D.assert(
                    B,
                    "typeof " + q + '==="number"&&' + q + ">=0&&" + q + "===(" + q + "|0)",
                    "invalid vertex count"
                  );
                }), q;
              });
            } else if (v)
              if (qt(v)) {
                if (v)
                  return f ? new bt(
                    f.thisDep,
                    f.contextDep,
                    f.propDep,
                    function(D, B) {
                      var q = B.def(
                        D.ELEMENTS,
                        ".vertCount-",
                        D.OFFSET
                      );
                      return u.optional(function() {
                        D.assert(
                          B,
                          q + ">=0",
                          "invalid vertex offset/element buffer too small"
                        );
                      }), q;
                    }
                  ) : Qe(function(D, B) {
                    return B.def(D.ELEMENTS, ".vertCount");
                  });
                var S = Qe(function() {
                  return -1;
                });
                return u.optional(function() {
                  S.MISSING = !0;
                }), S;
              } else {
                var I = new bt(
                  v.thisDep || f.thisDep,
                  v.contextDep || f.contextDep,
                  v.propDep || f.propDep,
                  function(D, B) {
                    var q = D.ELEMENTS;
                    return D.OFFSET ? B.def(
                      q,
                      "?",
                      q,
                      ".vertCount-",
                      D.OFFSET,
                      ":-1"
                    ) : B.def(q, "?", q, ".vertCount:-1");
                  }
                );
                return u.optional(function() {
                  I.DYNAMIC = !0;
                }), I;
              }
            return null;
          }
          return {
            elements: v,
            primitive: p(),
            count: h(),
            instances: _(Sn, !1),
            offset: f
          };
        }
        function Ze(s, t) {
          var m = s.static, E = s.dynamic, T = {};
          return X.forEach(function(v) {
            var p = ne(v);
            function _(f, h) {
              if (v in m) {
                var o = f(m[v]);
                T[p] = Qe(function() {
                  return o;
                });
              } else if (v in E) {
                var b = E[v];
                T[p] = wt(b, function(S, I) {
                  return h(S, I, S.invoke(I, b));
                });
              }
            }
            switch (v) {
              case xo:
              case vo:
              case po:
              case Lo:
              case _o:
              case Oo:
              case To:
              case Ao:
              case So:
              case Eo:
                return _(
                  function(f) {
                    return u.commandType(f, "boolean", v, t.commandStr), f;
                  },
                  function(f, h, o) {
                    return u.optional(function() {
                      f.assert(
                        h,
                        "typeof " + o + '==="boolean"',
                        "invalid flag " + v,
                        f.commandStr
                      );
                    }), o;
                  }
                );
              case bo:
                return _(
                  function(f) {
                    return u.commandParameter(f, Or, "invalid " + v, t.commandStr), Or[f];
                  },
                  function(f, h, o) {
                    var b = f.constants.compareFuncs;
                    return u.optional(function() {
                      f.assert(
                        h,
                        o + " in " + b,
                        "invalid " + v + ", must be one of " + Object.keys(Or)
                      );
                    }), h.def(b, "[", o, "]");
                  }
                );
              case go:
                return _(
                  function(f) {
                    return u.command(
                      We(f) && f.length === 2 && typeof f[0] == "number" && typeof f[1] == "number" && f[0] <= f[1],
                      "depth range is 2d array",
                      t.commandStr
                    ), f;
                  },
                  function(f, h, o) {
                    u.optional(function() {
                      f.assert(
                        h,
                        f.shared.isArrayLike + "(" + o + ")&&" + o + ".length===2&&typeof " + o + '[0]==="number"&&typeof ' + o + '[1]==="number"&&' + o + "[0]<=" + o + "[1]",
                        "depth range must be a 2d array"
                      );
                    });
                    var b = h.def("+", o, "[0]"), S = h.def("+", o, "[1]");
                    return [b, S];
                  }
                );
              case xa:
                return _(
                  function(f) {
                    u.commandType(f, "object", "blend.func", t.commandStr);
                    var h = "srcRGB" in f ? f.srcRGB : f.src, o = "srcAlpha" in f ? f.srcAlpha : f.src, b = "dstRGB" in f ? f.dstRGB : f.dst, S = "dstAlpha" in f ? f.dstAlpha : f.dst;
                    return u.commandParameter(h, Dt, p + ".srcRGB", t.commandStr), u.commandParameter(o, Dt, p + ".srcAlpha", t.commandStr), u.commandParameter(b, Dt, p + ".dstRGB", t.commandStr), u.commandParameter(S, Dt, p + ".dstAlpha", t.commandStr), u.command(
                      Uo.indexOf(h + ", " + b) === -1,
                      "unallowed blending combination (srcRGB, dstRGB) = (" + h + ", " + b + ")",
                      t.commandStr
                    ), [
                      Dt[h],
                      Dt[b],
                      Dt[o],
                      Dt[S]
                    ];
                  },
                  function(f, h, o) {
                    var b = f.constants.blendFuncs;
                    u.optional(function() {
                      f.assert(
                        h,
                        o + "&&typeof " + o + '==="object"',
                        "invalid blend func, must be an object"
                      );
                    });
                    function S(le, _e) {
                      var Ae = h.def(
                        '"',
                        le,
                        _e,
                        '" in ',
                        o,
                        "?",
                        o,
                        ".",
                        le,
                        _e,
                        ":",
                        o,
                        ".",
                        le
                      );
                      return u.optional(function() {
                        f.assert(
                          h,
                          Ae + " in " + b,
                          "invalid " + v + "." + le + _e + ", must be one of " + Object.keys(Dt)
                        );
                      }), Ae;
                    }
                    var I = S("src", "RGB"), D = S("dst", "RGB");
                    u.optional(function() {
                      var le = f.constants.invalidBlendCombinations;
                      f.assert(
                        h,
                        le + ".indexOf(" + I + '+", "+' + D + ") === -1 ",
                        "unallowed blending combination for (srcRGB, dstRGB)"
                      );
                    });
                    var B = h.def(b, "[", I, "]"), q = h.def(b, "[", S("src", "Alpha"), "]"), he = h.def(b, "[", D, "]"), Re = h.def(b, "[", S("dst", "Alpha"), "]");
                    return [B, he, q, Re];
                  }
                );
              case Ea:
                return _(
                  function(f) {
                    if (typeof f == "string")
                      return u.commandParameter(f, k, "invalid " + v, t.commandStr), [
                        k[f],
                        k[f]
                      ];
                    if (typeof f == "object")
                      return u.commandParameter(
                        f.rgb,
                        k,
                        v + ".rgb",
                        t.commandStr
                      ), u.commandParameter(
                        f.alpha,
                        k,
                        v + ".alpha",
                        t.commandStr
                      ), [
                        k[f.rgb],
                        k[f.alpha]
                      ];
                    u.commandRaise("invalid blend.equation", t.commandStr);
                  },
                  function(f, h, o) {
                    var b = f.constants.blendEquations, S = h.def(), I = h.def(), D = f.cond("typeof ", o, '==="string"');
                    return u.optional(function() {
                      function B(q, he, Re) {
                        f.assert(
                          q,
                          Re + " in " + b,
                          "invalid " + he + ", must be one of " + Object.keys(k)
                        );
                      }
                      B(D.then, v, o), f.assert(
                        D.else,
                        o + "&&typeof " + o + '==="object"',
                        "invalid " + v
                      ), B(D.else, v + ".rgb", o + ".rgb"), B(D.else, v + ".alpha", o + ".alpha");
                    }), D.then(
                      S,
                      "=",
                      I,
                      "=",
                      b,
                      "[",
                      o,
                      "];"
                    ), D.else(
                      S,
                      "=",
                      b,
                      "[",
                      o,
                      ".rgb];",
                      I,
                      "=",
                      b,
                      "[",
                      o,
                      ".alpha];"
                    ), h(D), [S, I];
                  }
                );
              case yo:
                return _(
                  function(f) {
                    return u.command(
                      We(f) && f.length === 4,
                      "blend.color must be a 4d array",
                      t.commandStr
                    ), xt(4, function(h) {
                      return +f[h];
                    });
                  },
                  function(f, h, o) {
                    return u.optional(function() {
                      f.assert(
                        h,
                        f.shared.isArrayLike + "(" + o + ")&&" + o + ".length===4",
                        "blend.color must be a 4d array"
                      );
                    }), xt(4, function(b) {
                      return h.def("+", o, "[", b, "]");
                    });
                  }
                );
              case Ro:
                return _(
                  function(f) {
                    return u.commandType(f, "number", p, t.commandStr), f | 0;
                  },
                  function(f, h, o) {
                    return u.optional(function() {
                      f.assert(
                        h,
                        "typeof " + o + '==="number"',
                        "invalid stencil.mask"
                      );
                    }), h.def(o, "|0");
                  }
                );
              case Ra:
                return _(
                  function(f) {
                    u.commandType(f, "object", p, t.commandStr);
                    var h = f.cmp || "keep", o = f.ref || 0, b = "mask" in f ? f.mask : -1;
                    return u.commandParameter(h, Or, v + ".cmp", t.commandStr), u.commandType(o, "number", v + ".ref", t.commandStr), u.commandType(b, "number", v + ".mask", t.commandStr), [
                      Or[h],
                      o,
                      b
                    ];
                  },
                  function(f, h, o) {
                    var b = f.constants.compareFuncs;
                    u.optional(function() {
                      function B() {
                        f.assert(
                          h,
                          Array.prototype.join.call(arguments, ""),
                          "invalid stencil.func"
                        );
                      }
                      B(o + "&&typeof ", o, '==="object"'), B(
                        '!("cmp" in ',
                        o,
                        ")||(",
                        o,
                        ".cmp in ",
                        b,
                        ")"
                      );
                    });
                    var S = h.def(
                      '"cmp" in ',
                      o,
                      "?",
                      b,
                      "[",
                      o,
                      ".cmp]",
                      ":",
                      Wt
                    ), I = h.def(o, ".ref|0"), D = h.def(
                      '"mask" in ',
                      o,
                      "?",
                      o,
                      ".mask|0:-1"
                    );
                    return [S, I, D];
                  }
                );
              case Oa:
              case zr:
                return _(
                  function(f) {
                    u.commandType(f, "object", p, t.commandStr);
                    var h = f.fail || "keep", o = f.zfail || "keep", b = f.zpass || "keep";
                    return u.commandParameter(h, Yt, v + ".fail", t.commandStr), u.commandParameter(o, Yt, v + ".zfail", t.commandStr), u.commandParameter(b, Yt, v + ".zpass", t.commandStr), [
                      v === zr ? fr : Zr,
                      Yt[h],
                      Yt[o],
                      Yt[b]
                    ];
                  },
                  function(f, h, o) {
                    var b = f.constants.stencilOps;
                    u.optional(function() {
                      f.assert(
                        h,
                        o + "&&typeof " + o + '==="object"',
                        "invalid " + v
                      );
                    });
                    function S(I) {
                      return u.optional(function() {
                        f.assert(
                          h,
                          '!("' + I + '" in ' + o + ")||(" + o + "." + I + " in " + b + ")",
                          "invalid " + v + "." + I + ", must be one of " + Object.keys(Yt)
                        );
                      }), h.def(
                        '"',
                        I,
                        '" in ',
                        o,
                        "?",
                        b,
                        "[",
                        o,
                        ".",
                        I,
                        "]:",
                        Wt
                      );
                    }
                    return [
                      v === zr ? fr : Zr,
                      S("fail"),
                      S("zfail"),
                      S("zpass")
                    ];
                  }
                );
              case Sa:
                return _(
                  function(f) {
                    u.commandType(f, "object", p, t.commandStr);
                    var h = f.factor | 0, o = f.units | 0;
                    return u.commandType(h, "number", p + ".factor", t.commandStr), u.commandType(o, "number", p + ".units", t.commandStr), [h, o];
                  },
                  function(f, h, o) {
                    u.optional(function() {
                      f.assert(
                        h,
                        o + "&&typeof " + o + '==="object"',
                        "invalid " + v
                      );
                    });
                    var b = h.def(o, ".factor|0"), S = h.def(o, ".units|0");
                    return [b, S];
                  }
                );
              case wo:
                return _(
                  function(f) {
                    var h = 0;
                    return f === "front" ? h = Zr : f === "back" && (h = fr), u.command(!!h, p, t.commandStr), h;
                  },
                  function(f, h, o) {
                    return u.optional(function() {
                      f.assert(
                        h,
                        o + '==="front"||' + o + '==="back"',
                        "invalid cull.face"
                      );
                    }), h.def(o, '==="front"?', Zr, ":", fr);
                  }
                );
              case Aa:
                return _(
                  function(f) {
                    return u.command(
                      typeof f == "number" && f >= F.lineWidthDims[0] && f <= F.lineWidthDims[1],
                      "invalid line width, must be a positive number between " + F.lineWidthDims[0] + " and " + F.lineWidthDims[1],
                      t.commandStr
                    ), f;
                  },
                  function(f, h, o) {
                    return u.optional(function() {
                      f.assert(
                        h,
                        "typeof " + o + '==="number"&&' + o + ">=" + F.lineWidthDims[0] + "&&" + o + "<=" + F.lineWidthDims[1],
                        "invalid line width"
                      );
                    }), o;
                  }
                );
              case Ta:
                return _(
                  function(f) {
                    return u.commandParameter(f, Ia, p, t.commandStr), Ia[f];
                  },
                  function(f, h, o) {
                    return u.optional(function() {
                      f.assert(
                        h,
                        o + '==="cw"||' + o + '==="ccw"',
                        "invalid frontFace, must be one of cw,ccw"
                      );
                    }), h.def(o + '==="cw"?' + Bo + ":" + Ba);
                  }
                );
              case wa:
                return _(
                  function(f) {
                    return u.command(
                      We(f) && f.length === 4,
                      "color.mask must be length 4 array",
                      t.commandStr
                    ), f.map(function(h) {
                      return !!h;
                    });
                  },
                  function(f, h, o) {
                    return u.optional(function() {
                      f.assert(
                        h,
                        f.shared.isArrayLike + "(" + o + ")&&" + o + ".length===4",
                        "invalid color.mask"
                      );
                    }), xt(4, function(b) {
                      return "!!" + o + "[" + b + "]";
                    });
                  }
                );
              case La:
                return _(
                  function(f) {
                    u.command(typeof f == "object" && f, p, t.commandStr);
                    var h = "value" in f ? f.value : 1, o = !!f.invert;
                    return u.command(
                      typeof h == "number" && h >= 0 && h <= 1,
                      "sample.coverage.value must be a number between 0 and 1",
                      t.commandStr
                    ), [h, o];
                  },
                  function(f, h, o) {
                    u.optional(function() {
                      f.assert(
                        h,
                        o + "&&typeof " + o + '==="object"',
                        "invalid sample.coverage"
                      );
                    });
                    var b = h.def(
                      '"value" in ',
                      o,
                      "?+",
                      o,
                      ".value:1"
                    ), S = h.def("!!", o, ".invert");
                    return [b, S];
                  }
                );
            }
          }), T;
        }
        function ot(s, t) {
          var m = s.static, E = s.dynamic, T = {};
          return Object.keys(m).forEach(function(v) {
            var p = m[v], _;
            if (typeof p == "number" || typeof p == "boolean")
              _ = Qe(function() {
                return p;
              });
            else if (typeof p == "function") {
              var f = p._reglType;
              f === "texture2d" || f === "textureCube" ? _ = Qe(function(h) {
                return h.link(p);
              }) : f === "framebuffer" || f === "framebufferCube" ? (u.command(
                p.color.length > 0,
                'missing color attachment for framebuffer sent to uniform "' + v + '"',
                t.commandStr
              ), _ = Qe(function(h) {
                return h.link(p.color[0]);
              })) : u.commandRaise('invalid data for uniform "' + v + '"', t.commandStr);
            } else We(p) ? _ = Qe(function(h) {
              var o = h.global.def(
                "[",
                xt(p.length, function(b) {
                  return u.command(
                    typeof p[b] == "number" || typeof p[b] == "boolean",
                    "invalid uniform " + v,
                    h.commandStr
                  ), p[b];
                }),
                "]"
              );
              return o;
            }) : u.commandRaise('invalid or missing data for uniform "' + v + '"', t.commandStr);
            _.value = p, T[v] = _;
          }), Object.keys(E).forEach(function(v) {
            var p = E[v];
            T[v] = wt(p, function(_, f) {
              return _.invoke(f, p);
            });
          }), T;
        }
        function Be(s, t) {
          var m = s.static, E = s.dynamic, T = {};
          return Object.keys(m).forEach(function(v) {
            var p = m[v], _ = n.id(v), f = new w();
            if (In(p))
              f.state = Ar, f.buffer = N.getBuffer(
                N.create(p, Rr, !1, !0)
              ), f.type = 0;
            else {
              var h = N.getBuffer(p);
              if (h)
                f.state = Ar, f.buffer = h, f.type = 0;
              else if (u.command(
                typeof p == "object" && p,
                "invalid data for attribute " + v,
                t.commandStr
              ), "constant" in p) {
                var o = p.constant;
                f.buffer = "null", f.state = va, typeof o == "number" ? f.x = o : (u.command(
                  We(o) && o.length > 0 && o.length <= 4,
                  "invalid constant for attribute " + v,
                  t.commandStr
                ), Tr.forEach(function(he, Re) {
                  Re < o.length && (f[he] = o[Re]);
                }));
              } else {
                In(p.buffer) ? h = N.getBuffer(
                  N.create(p.buffer, Rr, !1, !0)
                ) : h = N.getBuffer(p.buffer), u.command(!!h, 'missing buffer for attribute "' + v + '"', t.commandStr);
                var b = p.offset | 0;
                u.command(
                  b >= 0,
                  'invalid offset for attribute "' + v + '"',
                  t.commandStr
                );
                var S = p.stride | 0;
                u.command(
                  S >= 0 && S < 256,
                  'invalid stride for attribute "' + v + '", must be integer betweeen [0, 255]',
                  t.commandStr
                );
                var I = p.size | 0;
                u.command(
                  !("size" in p) || I > 0 && I <= 4,
                  'invalid size for attribute "' + v + '", must be 1,2,3,4',
                  t.commandStr
                );
                var D = !!p.normalized, B = 0;
                "type" in p && (u.commandParameter(
                  p.type,
                  Jt,
                  "invalid type for attribute " + v,
                  t.commandStr
                ), B = Jt[p.type]);
                var q = p.divisor | 0;
                "divisor" in p && (u.command(
                  q === 0 || K,
                  'cannot specify divisor for attribute "' + v + '", instancing not supported',
                  t.commandStr
                ), u.command(
                  q >= 0,
                  'invalid divisor for attribute "' + v + '"',
                  t.commandStr
                )), u.optional(function() {
                  var he = t.commandStr, Re = [
                    "buffer",
                    "offset",
                    "divisor",
                    "normalized",
                    "type",
                    "size",
                    "stride"
                  ];
                  Object.keys(p).forEach(function(le) {
                    u.command(
                      Re.indexOf(le) >= 0,
                      'unknown parameter "' + le + '" for attribute pointer "' + v + '" (valid parameters are ' + Re + ")",
                      he
                    );
                  });
                }), f.buffer = h, f.state = Ar, f.size = I, f.normalized = D, f.type = B || h.dtype, f.offset = b, f.stride = S, f.divisor = q;
              }
            }
            T[v] = Qe(function(he, Re) {
              var le = he.attribCache;
              if (_ in le)
                return le[_];
              var _e = {
                isStream: !1
              };
              return Object.keys(f).forEach(function(Ae) {
                _e[Ae] = f[Ae];
              }), f.buffer && (_e.buffer = he.link(f.buffer), _e.type = _e.type || _e.buffer + ".dtype"), le[_] = _e, _e;
            });
          }), Object.keys(E).forEach(function(v) {
            var p = E[v];
            function _(f, h) {
              var o = f.invoke(h, p), b = f.shared, S = f.constants, I = b.isBufferArgs, D = b.buffer;
              u.optional(function() {
                f.assert(
                  h,
                  o + "&&(typeof " + o + '==="object"||typeof ' + o + '==="function")&&(' + I + "(" + o + ")||" + D + ".getBuffer(" + o + ")||" + D + ".getBuffer(" + o + ".buffer)||" + I + "(" + o + '.buffer)||("constant" in ' + o + "&&(typeof " + o + '.constant==="number"||' + b.isArrayLike + "(" + o + ".constant))))",
                  'invalid dynamic attribute "' + v + '"'
                );
              });
              var B = {
                isStream: h.def(!1)
              }, q = new w();
              q.state = Ar, Object.keys(q).forEach(function(_e) {
                B[_e] = h.def("" + q[_e]);
              });
              var he = B.buffer, Re = B.type;
              h(
                "if(",
                I,
                "(",
                o,
                ")){",
                B.isStream,
                "=true;",
                he,
                "=",
                D,
                ".createStream(",
                Rr,
                ",",
                o,
                ");",
                Re,
                "=",
                he,
                ".dtype;",
                "}else{",
                he,
                "=",
                D,
                ".getBuffer(",
                o,
                ");",
                "if(",
                he,
                "){",
                Re,
                "=",
                he,
                ".dtype;",
                '}else if("constant" in ',
                o,
                "){",
                B.state,
                "=",
                va,
                ";",
                "if(typeof " + o + '.constant === "number"){',
                B[Tr[0]],
                "=",
                o,
                ".constant;",
                Tr.slice(1).map(function(_e) {
                  return B[_e];
                }).join("="),
                "=0;",
                "}else{",
                Tr.map(function(_e, Ae) {
                  return B[_e] + "=" + o + ".constant.length>" + Ae + "?" + o + ".constant[" + Ae + "]:0;";
                }).join(""),
                "}}else{",
                "if(",
                I,
                "(",
                o,
                ".buffer)){",
                he,
                "=",
                D,
                ".createStream(",
                Rr,
                ",",
                o,
                ".buffer);",
                "}else{",
                he,
                "=",
                D,
                ".getBuffer(",
                o,
                ".buffer);",
                "}",
                Re,
                '="type" in ',
                o,
                "?",
                S.glTypes,
                "[",
                o,
                ".type]:",
                he,
                ".dtype;",
                B.normalized,
                "=!!",
                o,
                ".normalized;"
              );
              function le(_e) {
                h(B[_e], "=", o, ".", _e, "|0;");
              }
              return le("size"), le("offset"), le("stride"), le("divisor"), h("}}"), h.exit(
                "if(",
                B.isStream,
                "){",
                D,
                ".destroyStream(",
                he,
                ");",
                "}"
              ), B;
            }
            T[v] = wt(p, _);
          }), T;
        }
        function rt(s, t) {
          var m = s.static, E = s.dynamic;
          if (Hr in m) {
            var T = m[Hr];
            return T !== null && Q.getVAO(T) === null && (T = Q.createVAO(T)), Qe(function(p) {
              return p.link(Q.getVAO(T));
            });
          } else if (Hr in E) {
            var v = E[Hr];
            return wt(v, function(p, _) {
              var f = p.invoke(_, v);
              return _.def(p.shared.vao + ".getVAO(" + f + ")");
            });
          }
          return null;
        }
        function je(s) {
          var t = s.static, m = s.dynamic, E = {};
          return Object.keys(t).forEach(function(T) {
            var v = t[T];
            E[T] = Qe(function(p, _) {
              return typeof v == "number" || typeof v == "boolean" ? "" + v : p.link(v);
            });
          }), Object.keys(m).forEach(function(T) {
            var v = m[T];
            E[T] = wt(v, function(p, _) {
              return p.invoke(_, v);
            });
          }), E;
        }
        function Je(s, t, m, E, T) {
          var v = s.static, p = s.dynamic;
          u.optional(function() {
            var le = [
              ar,
              Xr,
              Vr,
              ir,
              or,
              An,
              sr,
              Sn,
              jr,
              Hr
            ].concat(X);
            function _e(Ae) {
              Object.keys(Ae).forEach(function($e) {
                u.command(
                  le.indexOf($e) >= 0,
                  'unknown parameter "' + $e + '"',
                  T.commandStr
                );
              });
            }
            _e(v), _e(p);
          });
          var _ = we(s, t), f = ce(s), h = Fe(s, f, T), o = Ue(s, T), b = Ze(s, T), S = Oe(s, T, _);
          function I(le) {
            var _e = h[le];
            _e && (b[le] = _e);
          }
          I($t), I(ne(Tn));
          var D = Object.keys(b).length > 0, B = {
            framebuffer: f,
            draw: o,
            shader: S,
            state: b,
            dirty: D,
            scopeVAO: null,
            drawVAO: null,
            useVAO: !1,
            attributes: {}
          };
          if (B.profile = Se(s), B.uniforms = ot(m, T), B.drawVAO = B.scopeVAO = rt(s), !B.drawVAO && S.program && !_ && d.angle_instanced_arrays) {
            var q = !0, he = S.program.attributes.map(function(le) {
              var _e = t.static[le];
              return q = q && !!_e, _e;
            });
            if (q && he.length > 0) {
              var Re = Q.getVAO(Q.createVAO(he));
              B.drawVAO = new bt(null, null, null, function(le, _e) {
                return le.link(Re);
              }), B.useVAO = !0;
            }
          }
          return _ ? B.useVAO = !0 : B.attributes = Be(t, T), B.context = je(E), B;
        }
        function nt(s, t, m) {
          var E = s.shared, T = E.context, v = s.scope();
          Object.keys(m).forEach(function(p) {
            t.save(T, "." + p);
            var _ = m[p], f = _.append(s, t);
            Array.isArray(f) ? v(T, ".", p, "=[", f.join(), "];") : v(T, ".", p, "=", f, ";");
          }), t(v);
        }
        function at(s, t, m, E) {
          var T = s.shared, v = T.gl, p = T.framebuffer, _;
          se && (_ = t.def(T.extensions, ".webgl_draw_buffers"));
          var f = s.constants, h = f.drawBuffer, o = f.backBuffer, b;
          m ? b = m.append(s, t) : b = t.def(p, ".next"), E || t("if(", b, "!==", p, ".cur){"), t(
            "if(",
            b,
            "){",
            v,
            ".bindFramebuffer(",
            Po,
            ",",
            b,
            ".framebuffer);"
          ), se && t(
            _,
            ".drawBuffersWEBGL(",
            h,
            "[",
            b,
            ".colorAttachments.length]);"
          ), t(
            "}else{",
            v,
            ".bindFramebuffer(",
            Po,
            ",null);"
          ), se && t(_, ".drawBuffersWEBGL(", o, ");"), t(
            "}",
            p,
            ".cur=",
            b,
            ";"
          ), E || t("}");
        }
        function st(s, t, m) {
          var E = s.shared, T = E.gl, v = s.current, p = s.next, _ = E.current, f = E.next, h = s.cond(_, ".dirty");
          X.forEach(function(o) {
            var b = ne(o);
            if (!(b in m.state)) {
              var S, I;
              if (b in p) {
                S = p[b], I = v[b];
                var D = xt(U[b].length, function(q) {
                  return h.def(S, "[", q, "]");
                });
                h(s.cond(D.map(function(q, he) {
                  return q + "!==" + I + "[" + he + "]";
                }).join("||")).then(
                  T,
                  ".",
                  j[b],
                  "(",
                  D,
                  ");",
                  D.map(function(q, he) {
                    return I + "[" + he + "]=" + q;
                  }).join(";"),
                  ";"
                ));
              } else {
                S = h.def(f, ".", b);
                var B = s.cond(S, "!==", _, ".", b);
                h(B), b in re ? B(
                  s.cond(S).then(T, ".enable(", re[b], ");").else(T, ".disable(", re[b], ");"),
                  _,
                  ".",
                  b,
                  "=",
                  S,
                  ";"
                ) : B(
                  T,
                  ".",
                  j[b],
                  "(",
                  S,
                  ");",
                  _,
                  ".",
                  b,
                  "=",
                  S,
                  ";"
                );
              }
            }
          }), Object.keys(m.state).length === 0 && h(_, ".dirty=false;"), t(h);
        }
        function ut(s, t, m, E) {
          var T = s.shared, v = s.current, p = T.current, _ = T.gl;
          zo(Object.keys(m)).forEach(function(f) {
            var h = m[f];
            if (!(E && !E(h))) {
              var o = h.append(s, t);
              if (re[f]) {
                var b = re[f];
                qt(h) ? o ? t(_, ".enable(", b, ");") : t(_, ".disable(", b, ");") : t(s.cond(o).then(_, ".enable(", b, ");").else(_, ".disable(", b, ");")), t(p, ".", f, "=", o, ";");
              } else if (We(o)) {
                var S = v[f];
                t(
                  _,
                  ".",
                  j[f],
                  "(",
                  o,
                  ");",
                  o.map(function(I, D) {
                    return S + "[" + D + "]=" + I;
                  }).join(";"),
                  ";"
                );
              } else
                t(
                  _,
                  ".",
                  j[f],
                  "(",
                  o,
                  ");",
                  p,
                  ".",
                  f,
                  "=",
                  o,
                  ";"
                );
            }
          });
        }
        function Ye(s, t) {
          K && (s.instancing = t.def(
            s.shared.extensions,
            ".angle_instanced_arrays"
          ));
        }
        function Le(s, t, m, E, T) {
          var v = s.shared, p = s.stats, _ = v.current, f = v.timer, h = m.profile;
          function o() {
            return typeof performance > "u" ? "Date.now()" : "performance.now()";
          }
          var b, S;
          function I(le) {
            b = t.def(), le(b, "=", o(), ";"), typeof T == "string" ? le(p, ".count+=", T, ";") : le(p, ".count++;"), H && (E ? (S = t.def(), le(S, "=", f, ".getNumPendingQueries();")) : le(f, ".beginQuery(", p, ");"));
          }
          function D(le) {
            le(p, ".cpuTime+=", o(), "-", b, ";"), H && (E ? le(
              f,
              ".pushScopeStats(",
              S,
              ",",
              f,
              ".getNumPendingQueries(),",
              p,
              ");"
            ) : le(f, ".endQuery();"));
          }
          function B(le) {
            var _e = t.def(_, ".profile");
            t(_, ".profile=", le, ";"), t.exit(_, ".profile=", _e, ";");
          }
          var q;
          if (h) {
            if (qt(h)) {
              h.enable ? (I(t), D(t.exit), B("true")) : B("false");
              return;
            }
            q = h.append(s, t), B(q);
          } else
            q = t.def(_, ".profile");
          var he = s.block();
          I(he), t("if(", q, "){", he, "}");
          var Re = s.block();
          D(Re), t.exit("if(", q, "){", Re, "}");
        }
        function ct(s, t, m, E, T) {
          var v = s.shared;
          function p(f) {
            switch (f) {
              case Ln:
              case Cn:
              case Mn:
                return 2;
              case Rn:
              case Fn:
              case kn:
                return 3;
              case On:
              case Gn:
              case Bn:
                return 4;
              default:
                return 1;
            }
          }
          function _(f, h, o) {
            var b = v.gl, S = t.def(f, ".location"), I = t.def(v.attributes, "[", S, "]"), D = o.state, B = o.buffer, q = [
              o.x,
              o.y,
              o.z,
              o.w
            ], he = [
              "buffer",
              "normalized",
              "offset",
              "stride"
            ];
            function Re() {
              t(
                "if(!",
                I,
                ".buffer){",
                b,
                ".enableVertexAttribArray(",
                S,
                ");}"
              );
              var _e = o.type, Ae;
              if (o.size ? Ae = t.def(o.size, "||", h) : Ae = h, t(
                "if(",
                I,
                ".type!==",
                _e,
                "||",
                I,
                ".size!==",
                Ae,
                "||",
                he.map(function(Xe) {
                  return I + "." + Xe + "!==" + o[Xe];
                }).join("||"),
                "){",
                b,
                ".bindBuffer(",
                Rr,
                ",",
                B,
                ".buffer);",
                b,
                ".vertexAttribPointer(",
                [
                  S,
                  Ae,
                  _e,
                  o.normalized,
                  o.stride,
                  o.offset
                ],
                ");",
                I,
                ".type=",
                _e,
                ";",
                I,
                ".size=",
                Ae,
                ";",
                he.map(function(Xe) {
                  return I + "." + Xe + "=" + o[Xe] + ";";
                }).join(""),
                "}"
              ), K) {
                var $e = o.divisor;
                t(
                  "if(",
                  I,
                  ".divisor!==",
                  $e,
                  "){",
                  s.instancing,
                  ".vertexAttribDivisorANGLE(",
                  [S, $e],
                  ");",
                  I,
                  ".divisor=",
                  $e,
                  ";}"
                );
              }
            }
            function le() {
              t(
                "if(",
                I,
                ".buffer){",
                b,
                ".disableVertexAttribArray(",
                S,
                ");",
                I,
                ".buffer=null;",
                "}if(",
                Tr.map(function(_e, Ae) {
                  return I + "." + _e + "!==" + q[Ae];
                }).join("||"),
                "){",
                b,
                ".vertexAttrib4f(",
                S,
                ",",
                q,
                ");",
                Tr.map(function(_e, Ae) {
                  return I + "." + _e + "=" + q[Ae] + ";";
                }).join(""),
                "}"
              );
            }
            D === Ar ? Re() : D === va ? le() : (t("if(", D, "===", Ar, "){"), Re(), t("}else{"), le(), t("}"));
          }
          E.forEach(function(f) {
            var h = f.name, o = m.attributes[h], b;
            if (o) {
              if (!T(o))
                return;
              b = o.append(s, t);
            } else {
              if (!T(jo))
                return;
              var S = s.scopeAttrib(h);
              u.optional(function() {
                s.assert(
                  t,
                  S + ".state",
                  "missing attribute " + h
                );
              }), b = {}, Object.keys(new w()).forEach(function(I) {
                b[I] = t.def(S, ".", I);
              });
            }
            _(
              s.link(f),
              p(f.info.type),
              b
            );
          });
        }
        function ze(s, t, m, E, T) {
          for (var v = s.shared, p = v.gl, _, f = 0; f < E.length; ++f) {
            var h = E[f], o = h.name, b = h.info.type, S = m.uniforms[o], I = s.link(h), D = I + ".location", B;
            if (S) {
              if (!T(S))
                continue;
              if (qt(S)) {
                var q = S.value;
                if (u.command(
                  q !== null && typeof q < "u",
                  'missing uniform "' + o + '"',
                  s.commandStr
                ), b === Kr || b === Qr) {
                  u.command(
                    typeof q == "function" && (b === Kr && (q._reglType === "texture2d" || q._reglType === "framebuffer") || b === Qr && (q._reglType === "textureCube" || q._reglType === "framebufferCube")),
                    "invalid texture for uniform " + o,
                    s.commandStr
                  );
                  var he = s.link(q._texture || q.color[0]._texture);
                  t(p, ".uniform1i(", D, ",", he + ".bind());"), t.exit(he, ".unbind();");
                } else if (b === Wr || b === Yr || b === qr) {
                  u.optional(function() {
                    u.command(
                      We(q),
                      "invalid matrix for uniform " + o,
                      s.commandStr
                    ), u.command(
                      b === Wr && q.length === 4 || b === Yr && q.length === 9 || b === qr && q.length === 16,
                      "invalid length for matrix uniform " + o,
                      s.commandStr
                    );
                  });
                  var Re = s.global.def("new Float32Array([" + Array.prototype.slice.call(q) + "])"), le = 2;
                  b === Yr ? le = 3 : b === qr && (le = 4), t(
                    p,
                    ".uniformMatrix",
                    le,
                    "fv(",
                    D,
                    ",false,",
                    Re,
                    ");"
                  );
                } else {
                  switch (b) {
                    case Ga:
                      u.commandType(q, "number", "uniform " + o, s.commandStr), _ = "1f";
                      break;
                    case Ln:
                      u.command(
                        We(q) && q.length === 2,
                        "uniform " + o,
                        s.commandStr
                      ), _ = "2f";
                      break;
                    case Rn:
                      u.command(
                        We(q) && q.length === 3,
                        "uniform " + o,
                        s.commandStr
                      ), _ = "3f";
                      break;
                    case On:
                      u.command(
                        We(q) && q.length === 4,
                        "uniform " + o,
                        s.commandStr
                      ), _ = "4f";
                      break;
                    case ka:
                      u.commandType(q, "boolean", "uniform " + o, s.commandStr), _ = "1i";
                      break;
                    case Ma:
                      u.commandType(q, "number", "uniform " + o, s.commandStr), _ = "1i";
                      break;
                    case Mn:
                      u.command(
                        We(q) && q.length === 2,
                        "uniform " + o,
                        s.commandStr
                      ), _ = "2i";
                      break;
                    case Cn:
                      u.command(
                        We(q) && q.length === 2,
                        "uniform " + o,
                        s.commandStr
                      ), _ = "2i";
                      break;
                    case kn:
                      u.command(
                        We(q) && q.length === 3,
                        "uniform " + o,
                        s.commandStr
                      ), _ = "3i";
                      break;
                    case Fn:
                      u.command(
                        We(q) && q.length === 3,
                        "uniform " + o,
                        s.commandStr
                      ), _ = "3i";
                      break;
                    case Bn:
                      u.command(
                        We(q) && q.length === 4,
                        "uniform " + o,
                        s.commandStr
                      ), _ = "4i";
                      break;
                    case Gn:
                      u.command(
                        We(q) && q.length === 4,
                        "uniform " + o,
                        s.commandStr
                      ), _ = "4i";
                      break;
                  }
                  t(
                    p,
                    ".uniform",
                    _,
                    "(",
                    D,
                    ",",
                    We(q) ? Array.prototype.slice.call(q) : q,
                    ");"
                  );
                }
                continue;
              } else
                B = S.append(s, t);
            } else {
              if (!T(jo))
                continue;
              B = t.def(v.uniforms, "[", n.id(o), "]");
            }
            b === Kr ? (u(!Array.isArray(B), "must specify a scalar prop for textures"), t(
              "if(",
              B,
              "&&",
              B,
              '._reglType==="framebuffer"){',
              B,
              "=",
              B,
              ".color[0];",
              "}"
            )) : b === Qr && (u(!Array.isArray(B), "must specify a scalar prop for cube maps"), t(
              "if(",
              B,
              "&&",
              B,
              '._reglType==="framebufferCube"){',
              B,
              "=",
              B,
              ".color[0];",
              "}"
            )), u.optional(function() {
              function gt(Bt, Ko) {
                s.assert(
                  t,
                  Bt,
                  'bad data or missing for uniform "' + o + '".  ' + Ko
                );
              }
              function Na(Bt) {
                u(!Array.isArray(B), "must not specify an array type for uniform"), gt(
                  "typeof " + B + '==="' + Bt + '"',
                  "invalid type, expected " + Bt
                );
              }
              function Ft(Bt, Ko) {
                Array.isArray(B) ? u(B.length === Bt, "must have length " + Bt) : gt(
                  v.isArrayLike + "(" + B + ")&&" + B + ".length===" + Bt,
                  "invalid vector, should have length " + Bt,
                  s.commandStr
                );
              }
              function qo(Bt) {
                u(!Array.isArray(B), "must not specify a value type"), gt(
                  "typeof " + B + '==="function"&&' + B + '._reglType==="texture' + (Bt === Mo ? "2d" : "Cube") + '"',
                  "invalid texture type",
                  s.commandStr
                );
              }
              switch (b) {
                case Ma:
                  Na("number");
                  break;
                case Cn:
                  Ft(2);
                  break;
                case Fn:
                  Ft(3);
                  break;
                case Gn:
                  Ft(4);
                  break;
                case Ga:
                  Na("number");
                  break;
                case Ln:
                  Ft(2);
                  break;
                case Rn:
                  Ft(3);
                  break;
                case On:
                  Ft(4);
                  break;
                case ka:
                  Na("boolean");
                  break;
                case Mn:
                  Ft(2);
                  break;
                case kn:
                  Ft(3);
                  break;
                case Bn:
                  Ft(4);
                  break;
                case Wr:
                  Ft(4);
                  break;
                case Yr:
                  Ft(9);
                  break;
                case qr:
                  Ft(16);
                  break;
                case Kr:
                  qo(Mo);
                  break;
                case Qr:
                  qo(Ju);
                  break;
              }
            });
            var _e = 1;
            switch (b) {
              case Kr:
              case Qr:
                var Ae = t.def(B, "._texture");
                t(p, ".uniform1i(", D, ",", Ae, ".bind());"), t.exit(Ae, ".unbind();");
                continue;
              case Ma:
              case ka:
                _ = "1i";
                break;
              case Cn:
              case Mn:
                _ = "2i", _e = 2;
                break;
              case Fn:
              case kn:
                _ = "3i", _e = 3;
                break;
              case Gn:
              case Bn:
                _ = "4i", _e = 4;
                break;
              case Ga:
                _ = "1f";
                break;
              case Ln:
                _ = "2f", _e = 2;
                break;
              case Rn:
                _ = "3f", _e = 3;
                break;
              case On:
                _ = "4f", _e = 4;
                break;
              case Wr:
                _ = "Matrix2fv";
                break;
              case Yr:
                _ = "Matrix3fv";
                break;
              case qr:
                _ = "Matrix4fv";
                break;
            }
            if (t(p, ".uniform", _, "(", D, ","), _.charAt(0) === "M") {
              var $e = Math.pow(b - Wr + 2, 2), Xe = s.global.def("new Float32Array(", $e, ")");
              Array.isArray(B) ? t(
                "false,(",
                xt($e, function(gt) {
                  return Xe + "[" + gt + "]=" + B[gt];
                }),
                ",",
                Xe,
                ")"
              ) : t(
                "false,(Array.isArray(",
                B,
                ")||",
                B,
                " instanceof Float32Array)?",
                B,
                ":(",
                xt($e, function(gt) {
                  return Xe + "[" + gt + "]=" + B + "[" + gt + "]";
                }),
                ",",
                Xe,
                ")"
              );
            } else _e > 1 ? t(xt(_e, function(gt) {
              return Array.isArray(B) ? B[gt] : B + "[" + gt + "]";
            })) : (u(!Array.isArray(B), "uniform value must not be an array"), t(B));
            t(");");
          }
        }
        function pe(s, t, m, E) {
          var T = s.shared, v = T.gl, p = T.draw, _ = E.draw;
          function f() {
            var Ae = _.elements, $e, Xe = t;
            return Ae ? ((Ae.contextDep && E.contextDynamic || Ae.propDep) && (Xe = m), $e = Ae.append(s, Xe)) : $e = Xe.def(p, ".", ir), $e && Xe(
              "if(" + $e + ")" + v + ".bindBuffer(" + Ku + "," + $e + ".buffer.buffer);"
            ), $e;
          }
          function h() {
            var Ae = _.count, $e, Xe = t;
            return Ae ? ((Ae.contextDep && E.contextDynamic || Ae.propDep) && (Xe = m), $e = Ae.append(s, Xe), u.optional(function() {
              Ae.MISSING && s.assert(t, "false", "missing vertex count"), Ae.DYNAMIC && s.assert(Xe, $e + ">=0", "missing vertex count");
            })) : ($e = Xe.def(p, ".", sr), u.optional(function() {
              s.assert(Xe, $e + ">=0", "missing vertex count");
            })), $e;
          }
          var o = f();
          function b(Ae) {
            var $e = _[Ae];
            return $e ? $e.contextDep && E.contextDynamic || $e.propDep ? $e.append(s, m) : $e.append(s, t) : t.def(p, ".", Ae);
          }
          var S = b(or), I = b(An), D = h();
          if (typeof D == "number") {
            if (D === 0)
              return;
          } else
            m("if(", D, "){"), m.exit("}");
          var B, q;
          K && (B = b(Sn), q = s.instancing);
          var he = o + ".type", Re = _.elements && qt(_.elements);
          function le() {
            function Ae() {
              m(q, ".drawElementsInstancedANGLE(", [
                S,
                D,
                he,
                I + "<<((" + he + "-" + lo + ")>>1)",
                B
              ], ");");
            }
            function $e() {
              m(
                q,
                ".drawArraysInstancedANGLE(",
                [S, I, D, B],
                ");"
              );
            }
            o ? Re ? Ae() : (m("if(", o, "){"), Ae(), m("}else{"), $e(), m("}")) : $e();
          }
          function _e() {
            function Ae() {
              m(v + ".drawElements(" + [
                S,
                D,
                he,
                I + "<<((" + he + "-" + lo + ")>>1)"
              ] + ");");
            }
            function $e() {
              m(v + ".drawArrays(" + [S, I, D] + ");");
            }
            o ? Re ? Ae() : (m("if(", o, "){"), Ae(), m("}else{"), $e(), m("}")) : $e();
          }
          K && (typeof B != "number" || B >= 0) ? typeof B == "string" ? (m("if(", B, ">0){"), le(), m("}else if(", B, "<0){"), _e(), m("}")) : le() : _e();
        }
        function Me(s, t, m, E, T) {
          var v = be(), p = v.proc("body", T);
          return u.optional(function() {
            v.commandStr = t.commandStr, v.command = v.link(t.commandStr);
          }), K && (v.instancing = p.def(
            v.shared.extensions,
            ".angle_instanced_arrays"
          )), s(v, p, m, E), v.compile().body;
        }
        function De(s, t, m, E) {
          Ye(s, t), m.useVAO ? m.drawVAO ? t(s.shared.vao, ".setVAO(", m.drawVAO.append(s, t), ");") : t(s.shared.vao, ".setVAO(", s.shared.vao, ".targetVAO);") : (t(s.shared.vao, ".setVAO(null);"), ct(s, t, m, E.attributes, function() {
            return !0;
          })), ze(s, t, m, E.uniforms, function() {
            return !0;
          }), pe(s, t, t, m);
        }
        function qe(s, t) {
          var m = s.proc("draw", 1);
          Ye(s, m), nt(s, m, t.context), at(s, m, t.framebuffer), st(s, m, t), ut(s, m, t.state), Le(s, m, t, !1, !0);
          var E = t.shader.progVar.append(s, m);
          if (m(s.shared.gl, ".useProgram(", E, ".program);"), t.shader.program)
            De(s, m, t, t.shader.program);
          else {
            m(s.shared.vao, ".setVAO(null);");
            var T = s.global.def("{}"), v = m.def(E, ".id"), p = m.def(T, "[", v, "]");
            m(
              s.cond(p).then(p, ".call(this,a0);").else(
                p,
                "=",
                T,
                "[",
                v,
                "]=",
                s.link(function(_) {
                  return Me(De, s, t, _, 1);
                }),
                "(",
                E,
                ");",
                p,
                ".call(this,a0);"
              )
            );
          }
          Object.keys(t.state).length > 0 && m(s.shared.current, ".dirty=true;");
        }
        function Pt(s, t, m, E) {
          s.batchId = "a1", Ye(s, t);
          function T() {
            return !0;
          }
          ct(s, t, m, E.attributes, T), ze(s, t, m, E.uniforms, T), pe(s, t, t, m);
        }
        function ur(s, t, m, E) {
          Ye(s, t);
          var T = m.contextDep, v = t.def(), p = "a0", _ = "a1", f = t.def();
          s.shared.props = f, s.batchId = v;
          var h = s.scope(), o = s.scope();
          t(
            h.entry,
            "for(",
            v,
            "=0;",
            v,
            "<",
            _,
            ";++",
            v,
            "){",
            f,
            "=",
            p,
            "[",
            v,
            "];",
            o,
            "}",
            h.exit
          );
          function b(he) {
            return he.contextDep && T || he.propDep;
          }
          function S(he) {
            return !b(he);
          }
          if (m.needsContext && nt(s, o, m.context), m.needsFramebuffer && at(s, o, m.framebuffer), ut(s, o, m.state, b), m.profile && b(m.profile) && Le(s, o, m, !1, !0), E)
            m.useVAO ? m.drawVAO ? b(m.drawVAO) ? o(s.shared.vao, ".setVAO(", m.drawVAO.append(s, o), ");") : h(s.shared.vao, ".setVAO(", m.drawVAO.append(s, h), ");") : h(s.shared.vao, ".setVAO(", s.shared.vao, ".targetVAO);") : (h(s.shared.vao, ".setVAO(null);"), ct(s, h, m, E.attributes, S), ct(s, o, m, E.attributes, b)), ze(s, h, m, E.uniforms, S), ze(s, o, m, E.uniforms, b), pe(s, h, o, m);
          else {
            var I = s.global.def("{}"), D = m.shader.progVar.append(s, o), B = o.def(D, ".id"), q = o.def(I, "[", B, "]");
            o(
              s.shared.gl,
              ".useProgram(",
              D,
              ".program);",
              "if(!",
              q,
              "){",
              q,
              "=",
              I,
              "[",
              B,
              "]=",
              s.link(function(he) {
                return Me(
                  Pt,
                  s,
                  m,
                  he,
                  2
                );
              }),
              "(",
              D,
              ");}",
              q,
              ".call(this,a0[",
              v,
              "],",
              v,
              ");"
            );
          }
        }
        function c(s, t) {
          var m = s.proc("batch", 2);
          s.batchId = "0", Ye(s, m);
          var E = !1, T = !0;
          Object.keys(t.context).forEach(function(I) {
            E = E || t.context[I].propDep;
          }), E || (nt(s, m, t.context), T = !1);
          var v = t.framebuffer, p = !1;
          v ? (v.propDep ? E = p = !0 : v.contextDep && E && (p = !0), p || at(s, m, v)) : at(s, m, null), t.state.viewport && t.state.viewport.propDep && (E = !0);
          function _(I) {
            return I.contextDep && E || I.propDep;
          }
          st(s, m, t), ut(s, m, t.state, function(I) {
            return !_(I);
          }), (!t.profile || !_(t.profile)) && Le(s, m, t, !1, "a1"), t.contextDep = E, t.needsContext = T, t.needsFramebuffer = p;
          var f = t.shader.progVar;
          if (f.contextDep && E || f.propDep)
            ur(
              s,
              m,
              t,
              null
            );
          else {
            var h = f.append(s, m);
            if (m(s.shared.gl, ".useProgram(", h, ".program);"), t.shader.program)
              ur(
                s,
                m,
                t,
                t.shader.program
              );
            else {
              m(s.shared.vao, ".setVAO(null);");
              var o = s.global.def("{}"), b = m.def(h, ".id"), S = m.def(o, "[", b, "]");
              m(
                s.cond(S).then(S, ".call(this,a0,a1);").else(
                  S,
                  "=",
                  o,
                  "[",
                  b,
                  "]=",
                  s.link(function(I) {
                    return Me(ur, s, t, I, 2);
                  }),
                  "(",
                  h,
                  ");",
                  S,
                  ".call(this,a0,a1);"
                )
              );
            }
          }
          Object.keys(t.state).length > 0 && m(s.shared.current, ".dirty=true;");
        }
        function G(s, t) {
          var m = s.proc("scope", 3);
          s.batchId = "a2";
          var E = s.shared, T = E.current;
          nt(s, m, t.context), t.framebuffer && t.framebuffer.append(s, m), zo(Object.keys(t.state)).forEach(function(p) {
            var _ = t.state[p], f = _.append(s, m);
            We(f) ? f.forEach(function(h, o) {
              m.set(s.next[p], "[" + o + "]", h);
            }) : m.set(E.next, "." + p, f);
          }), Le(s, m, t, !0, !0), [ir, An, sr, Sn, or].forEach(
            function(p) {
              var _ = t.draw[p];
              _ && m.set(E.draw, "." + p, "" + _.append(s, m));
            }
          ), Object.keys(t.uniforms).forEach(function(p) {
            var _ = t.uniforms[p].append(s, m);
            Array.isArray(_) && (_ = "[" + _.join() + "]"), m.set(
              E.uniforms,
              "[" + n.id(p) + "]",
              _
            );
          }), Object.keys(t.attributes).forEach(function(p) {
            var _ = t.attributes[p].append(s, m), f = s.scopeAttrib(p);
            Object.keys(new w()).forEach(function(h) {
              m.set(f, "." + h, _[h]);
            });
          }), t.scopeVAO && m.set(E.vao, ".targetVAO", t.scopeVAO.append(s, m));
          function v(p) {
            var _ = t.shader[p];
            _ && m.set(E.shader, "." + p, _.append(s, m));
          }
          v(Xr), v(Vr), Object.keys(t.state).length > 0 && (m(T, ".dirty=true;"), m.exit(T, ".dirty=true;")), m("a1(", s.shared.context, ",a0,", s.batchId, ");");
        }
        function R(s) {
          if (!(typeof s != "object" || We(s))) {
            for (var t = Object.keys(s), m = 0; m < t.length; ++m)
              if (Lt.isDynamic(s[t[m]]))
                return !0;
            return !1;
          }
        }
        function ue(s, t, m) {
          var E = t.static[m];
          if (!E || !R(E))
            return;
          var T = s.global, v = Object.keys(E), p = !1, _ = !1, f = !1, h = s.global.def("{}");
          v.forEach(function(b) {
            var S = E[b];
            if (Lt.isDynamic(S)) {
              typeof S == "function" && (S = E[b] = Lt.unbox(S));
              var I = wt(S, null);
              p = p || I.thisDep, f = f || I.propDep, _ = _ || I.contextDep;
            } else {
              switch (T(h, ".", b, "="), typeof S) {
                case "number":
                  T(S);
                  break;
                case "string":
                  T('"', S, '"');
                  break;
                case "object":
                  Array.isArray(S) && T("[", S.join(), "]");
                  break;
                default:
                  T(s.link(S));
                  break;
              }
              T(";");
            }
          });
          function o(b, S) {
            v.forEach(function(I) {
              var D = E[I];
              if (Lt.isDynamic(D)) {
                var B = b.invoke(S, D);
                S(h, ".", I, "=", B, ";");
              }
            });
          }
          t.dynamic[m] = new Lt.DynamicVariable(wn, {
            thisDep: p,
            contextDep: _,
            propDep: f,
            ref: h,
            append: o
          }), delete t.static[m];
        }
        function Ge(s, t, m, E, T) {
          var v = be();
          v.stats = v.link(T), Object.keys(t.static).forEach(function(_) {
            ue(v, t, _);
          }), qu.forEach(function(_) {
            ue(v, s, _);
          });
          var p = Je(s, t, m, E, v);
          return qe(v, p), G(v, p), c(v, p), g(v.compile(), {
            destroy: function() {
              p.shader.program.destroy();
            }
          });
        }
        return {
          next: fe,
          current: U,
          procs: function() {
            var s = be(), t = s.proc("poll"), m = s.proc("refresh"), E = s.block();
            t(E), m(E);
            var T = s.shared, v = T.gl, p = T.next, _ = T.current;
            E(_, ".dirty=false;"), at(s, t), at(s, m, null, !0);
            var f;
            K && (f = s.link(K)), d.oes_vertex_array_object && m(s.link(d.oes_vertex_array_object), ".bindVertexArrayOES(null);");
            for (var h = 0; h < F.maxAttributes; ++h) {
              var o = m.def(T.attributes, "[", h, "]"), b = s.cond(o, ".buffer");
              b.then(
                v,
                ".enableVertexAttribArray(",
                h,
                ");",
                v,
                ".bindBuffer(",
                Rr,
                ",",
                o,
                ".buffer.buffer);",
                v,
                ".vertexAttribPointer(",
                h,
                ",",
                o,
                ".size,",
                o,
                ".type,",
                o,
                ".normalized,",
                o,
                ".stride,",
                o,
                ".offset);"
              ).else(
                v,
                ".disableVertexAttribArray(",
                h,
                ");",
                v,
                ".vertexAttrib4f(",
                h,
                ",",
                o,
                ".x,",
                o,
                ".y,",
                o,
                ".z,",
                o,
                ".w);",
                o,
                ".buffer=null;"
              ), m(b), K && m(
                f,
                ".vertexAttribDivisorANGLE(",
                h,
                ",",
                o,
                ".divisor);"
              );
            }
            return m(
              s.shared.vao,
              ".currentVAO=null;",
              s.shared.vao,
              ".setVAO(",
              s.shared.vao,
              ".targetVAO);"
            ), Object.keys(re).forEach(function(S) {
              var I = re[S], D = E.def(p, ".", S), B = s.block();
              B(
                "if(",
                D,
                "){",
                v,
                ".enable(",
                I,
                ")}else{",
                v,
                ".disable(",
                I,
                ")}",
                _,
                ".",
                S,
                "=",
                D,
                ";"
              ), m(B), t(
                "if(",
                D,
                "!==",
                _,
                ".",
                S,
                "){",
                B,
                "}"
              );
            }), Object.keys(j).forEach(function(S) {
              var I = j[S], D = U[S], B, q, he = s.block();
              if (he(v, ".", I, "("), We(D)) {
                var Re = D.length;
                B = s.global.def(p, ".", S), q = s.global.def(_, ".", S), he(
                  xt(Re, function(le) {
                    return B + "[" + le + "]";
                  }),
                  ");",
                  xt(Re, function(le) {
                    return q + "[" + le + "]=" + B + "[" + le + "];";
                  }).join("")
                ), t(
                  "if(",
                  xt(Re, function(le) {
                    return B + "[" + le + "]!==" + q + "[" + le + "]";
                  }).join("||"),
                  "){",
                  he,
                  "}"
                );
              } else
                B = E.def(p, ".", S), q = E.def(_, ".", S), he(
                  B,
                  ");",
                  _,
                  ".",
                  S,
                  "=",
                  B,
                  ";"
                ), t(
                  "if(",
                  B,
                  "!==",
                  q,
                  "){",
                  he,
                  "}"
                );
              m(he);
            }), s.compile();
          }(),
          compile: Ge
        };
      }
      function pc() {
        return {
          vaoCount: 0,
          bufferCount: 0,
          elementsCount: 0,
          framebufferCount: 0,
          shaderCount: 0,
          textureCount: 0,
          cubeCount: 0,
          renderbufferCount: 0,
          maxTextureUnits: 0
        };
      }
      var vc = 34918, yc = 34919, Xo = 35007, _c = function(e, n) {
        if (!n.ext_disjoint_timer_query)
          return null;
        var d = [];
        function F() {
          return d.pop() || n.ext_disjoint_timer_query.createQueryEXT();
        }
        function N(K) {
          d.push(K);
        }
        var C = [];
        function M(K) {
          var se = F();
          n.ext_disjoint_timer_query.beginQueryEXT(Xo, se), C.push(se), H(C.length - 1, C.length, K);
        }
        function V() {
          n.ext_disjoint_timer_query.endQueryEXT(Xo);
        }
        function W() {
          this.startQueryIndex = -1, this.endQueryIndex = -1, this.sum = 0, this.stats = null;
        }
        var Q = [];
        function Y() {
          return Q.pop() || new W();
        }
        function ee(K) {
          Q.push(K);
        }
        var ae = [];
        function H(K, se, U) {
          var fe = Y();
          fe.startQueryIndex = K, fe.endQueryIndex = se, fe.sum = 0, fe.stats = U, ae.push(fe);
        }
        var te = [], w = [];
        function k() {
          var K, se, U = C.length;
          if (U !== 0) {
            w.length = Math.max(w.length, U + 1), te.length = Math.max(te.length, U + 1), te[0] = 0, w[0] = 0;
            var fe = 0;
            for (K = 0, se = 0; se < C.length; ++se) {
              var X = C[se];
              n.ext_disjoint_timer_query.getQueryObjectEXT(X, yc) ? (fe += n.ext_disjoint_timer_query.getQueryObjectEXT(X, vc), N(X)) : C[K++] = X, te[se + 1] = fe, w[se + 1] = K;
            }
            for (C.length = K, K = 0, se = 0; se < ae.length; ++se) {
              var re = ae[se], j = re.startQueryIndex, ne = re.endQueryIndex;
              re.sum += te[ne] - te[j];
              var me = w[j], Ee = w[ne];
              Ee === me ? (re.stats.gpuTime += re.sum / 1e6, ee(re)) : (re.startQueryIndex = me, re.endQueryIndex = Ee, ae[K++] = re);
            }
            ae.length = K;
          }
        }
        return {
          beginQuery: M,
          endQuery: V,
          pushScopeStats: H,
          update: k,
          getNumPendingQueries: function() {
            return C.length;
          },
          clear: function() {
            d.push.apply(d, C);
            for (var K = 0; K < d.length; K++)
              n.ext_disjoint_timer_query.deleteQueryEXT(d[K]);
            C.length = 0, d.length = 0;
          },
          restore: function() {
            C.length = 0, d.length = 0;
          }
        };
      }, bc = 16384, gc = 256, Ec = 1024, xc = 34962, Vo = "webglcontextlost", Ho = "webglcontextrestored", Wo = 1, wc = 2, Tc = 3;
      function Yo(e, n) {
        for (var d = 0; d < e.length; ++d)
          if (e[d] === n)
            return d;
        return -1;
      }
      function Ac(e) {
        var n = Es(e);
        if (!n)
          return null;
        var d = n.gl, F = d.getContextAttributes(), N = d.isContextLost(), C = xs(d, n);
        if (!C)
          return null;
        var M = vs(), V = pc(), W = C.extensions, Q = _c(d, W), Y = ti(), ee = d.drawingBufferWidth, ae = d.drawingBufferHeight, H = {
          tick: 0,
          time: 0,
          viewportWidth: ee,
          viewportHeight: ae,
          framebufferWidth: ee,
          framebufferHeight: ae,
          drawingBufferWidth: ee,
          drawingBufferHeight: ae,
          pixelRatio: n.pixelRatio
        }, te = {}, w = {
          elements: null,
          primitive: 4,
          // GL_TRIANGLES
          count: -1,
          offset: 0,
          instances: -1
        }, k = cf(d, W), K = Sf(
          d,
          V,
          n,
          U
        ), se = Du(
          d,
          W,
          k,
          V,
          K
        );
        function U(pe) {
          return se.destroyBuffer(pe);
        }
        var fe = Df(d, W, K, V), X = zu(d, M, V, n), re = pu(
          d,
          W,
          k,
          function() {
            me.procs.poll();
          },
          H,
          V,
          n
        ), j = vu(d, W, k, V, n), ne = Iu(
          d,
          W,
          k,
          re,
          j,
          V
        ), me = mc(
          d,
          M,
          W,
          k,
          K,
          fe,
          re,
          ne,
          te,
          se,
          X,
          w,
          H,
          Q,
          n
        ), Ee = Vu(
          d,
          ne,
          me.procs.poll,
          H,
          F,
          W,
          k
        ), ie = me.next, Z = d.canvas, P = [], be = [], Se = [], ce = [n.onDestroy], Fe = null;
        function we() {
          if (P.length === 0) {
            Q && Q.update(), Fe = null;
            return;
          }
          Fe = zn.next(we), ut();
          for (var pe = P.length - 1; pe >= 0; --pe) {
            var Me = P[pe];
            Me && Me(H, null, 0);
          }
          d.flush(), Q && Q.update();
        }
        function Oe() {
          !Fe && P.length > 0 && (Fe = zn.next(we));
        }
        function Ue() {
          Fe && (zn.cancel(we), Fe = null);
        }
        function Ze(pe) {
          pe.preventDefault(), N = !0, Ue(), be.forEach(function(Me) {
            Me();
          });
        }
        function ot(pe) {
          d.getError(), N = !1, C.restore(), X.restore(), K.restore(), re.restore(), j.restore(), ne.restore(), se.restore(), Q && Q.restore(), me.procs.refresh(), Oe(), Se.forEach(function(Me) {
            Me();
          });
        }
        Z && (Z.addEventListener(Vo, Ze, !1), Z.addEventListener(Ho, ot, !1));
        function Be() {
          P.length = 0, Ue(), Z && (Z.removeEventListener(Vo, Ze), Z.removeEventListener(Ho, ot)), X.clear(), ne.clear(), j.clear(), re.clear(), fe.clear(), K.clear(), se.clear(), Q && Q.clear(), ce.forEach(function(pe) {
            pe();
          });
        }
        function rt(pe) {
          u(!!pe, "invalid args to regl({...})"), u.type(pe, "object", "invalid args to regl({...})");
          function Me(T) {
            var v = g({}, T);
            delete v.uniforms, delete v.attributes, delete v.context, delete v.vao, "stencil" in v && v.stencil.op && (v.stencil.opBack = v.stencil.opFront = v.stencil.op, delete v.stencil.op);
            function p(_) {
              if (_ in v) {
                var f = v[_];
                delete v[_], Object.keys(f).forEach(function(h) {
                  v[_ + "." + h] = f[h];
                });
              }
            }
            return p("blend"), p("depth"), p("cull"), p("stencil"), p("polygonOffset"), p("scissor"), p("sample"), "vao" in T && (v.vao = T.vao), v;
          }
          function De(T, v) {
            var p = {}, _ = {};
            return Object.keys(T).forEach(function(f) {
              var h = T[f];
              if (Lt.isDynamic(h)) {
                _[f] = Lt.unbox(h, f);
                return;
              } else if (v && Array.isArray(h)) {
                for (var o = 0; o < h.length; ++o)
                  if (Lt.isDynamic(h[o])) {
                    _[f] = Lt.unbox(h, f);
                    return;
                  }
              }
              p[f] = h;
            }), {
              dynamic: _,
              static: p
            };
          }
          var qe = De(pe.context || {}, !0), Pt = De(pe.uniforms || {}, !0), ur = De(pe.attributes || {}, !1), c = De(Me(pe), !1), G = {
            gpuTime: 0,
            cpuTime: 0,
            count: 0
          }, R = me.compile(c, ur, Pt, qe, G), ue = R.draw, Ge = R.batch, s = R.scope, t = [];
          function m(T) {
            for (; t.length < T; )
              t.push(null);
            return t;
          }
          function E(T, v) {
            var p;
            if (N && u.raise("context lost"), typeof T == "function")
              return s.call(this, null, T, 0);
            if (typeof v == "function")
              if (typeof T == "number")
                for (p = 0; p < T; ++p)
                  s.call(this, null, v, p);
              else if (Array.isArray(T))
                for (p = 0; p < T.length; ++p)
                  s.call(this, T[p], v, p);
              else
                return s.call(this, T, v, 0);
            else if (typeof T == "number") {
              if (T > 0)
                return Ge.call(this, m(T | 0), T | 0);
            } else if (Array.isArray(T)) {
              if (T.length)
                return Ge.call(this, T, T.length);
            } else
              return ue.call(this, T);
          }
          return g(E, {
            stats: G,
            destroy: function() {
              R.destroy();
            }
          });
        }
        var je = ne.setFBO = rt({
          framebuffer: Lt.define.call(null, Wo, "framebuffer")
        });
        function Je(pe, Me) {
          var De = 0;
          me.procs.poll();
          var qe = Me.color;
          qe && (d.clearColor(+qe[0] || 0, +qe[1] || 0, +qe[2] || 0, +qe[3] || 0), De |= bc), "depth" in Me && (d.clearDepth(+Me.depth), De |= gc), "stencil" in Me && (d.clearStencil(Me.stencil | 0), De |= Ec), u(!!De, "called regl.clear with no buffer specified"), d.clear(De);
        }
        function nt(pe) {
          if (u(
            typeof pe == "object" && pe,
            "regl.clear() takes an object as input"
          ), "framebuffer" in pe)
            if (pe.framebuffer && pe.framebuffer_reglType === "framebufferCube")
              for (var Me = 0; Me < 6; ++Me)
                je(g({
                  framebuffer: pe.framebuffer.faces[Me]
                }, pe), Je);
            else
              je(pe, Je);
          else
            Je(null, pe);
        }
        function at(pe) {
          u.type(pe, "function", "regl.frame() callback must be a function"), P.push(pe);
          function Me() {
            var De = Yo(P, pe);
            u(De >= 0, "cannot cancel a frame twice");
            function qe() {
              var Pt = Yo(P, qe);
              P[Pt] = P[P.length - 1], P.length -= 1, P.length <= 0 && Ue();
            }
            P[De] = qe;
          }
          return Oe(), {
            cancel: Me
          };
        }
        function st() {
          var pe = ie.viewport, Me = ie.scissor_box;
          pe[0] = pe[1] = Me[0] = Me[1] = 0, H.viewportWidth = H.framebufferWidth = H.drawingBufferWidth = pe[2] = Me[2] = d.drawingBufferWidth, H.viewportHeight = H.framebufferHeight = H.drawingBufferHeight = pe[3] = Me[3] = d.drawingBufferHeight;
        }
        function ut() {
          H.tick += 1, H.time = Le(), st(), me.procs.poll();
        }
        function Ye() {
          re.refresh(), st(), me.procs.refresh(), Q && Q.update();
        }
        function Le() {
          return (ti() - Y) / 1e3;
        }
        Ye();
        function ct(pe, Me) {
          u.type(Me, "function", "listener callback must be a function");
          var De;
          switch (pe) {
            case "frame":
              return at(Me);
            case "lost":
              De = be;
              break;
            case "restore":
              De = Se;
              break;
            case "destroy":
              De = ce;
              break;
            default:
              u.raise("invalid event, must be one of frame,lost,restore,destroy");
          }
          return De.push(Me), {
            cancel: function() {
              for (var qe = 0; qe < De.length; ++qe)
                if (De[qe] === Me) {
                  De[qe] = De[De.length - 1], De.pop();
                  return;
                }
            }
          };
        }
        var ze = g(rt, {
          // Clear current FBO
          clear: nt,
          // Short cuts for dynamic variables
          prop: Lt.define.bind(null, Wo),
          context: Lt.define.bind(null, wc),
          this: Lt.define.bind(null, Tc),
          // executes an empty draw command
          draw: rt({}),
          // Resources
          buffer: function(pe) {
            return K.create(pe, xc, !1, !1);
          },
          elements: function(pe) {
            return fe.create(pe, !1);
          },
          texture: re.create2D,
          cube: re.createCube,
          renderbuffer: j.create,
          framebuffer: ne.create,
          framebufferCube: ne.createCube,
          vao: se.createVAO,
          // Expose context attributes
          attributes: F,
          // Frame rendering
          frame: at,
          on: ct,
          // System limits
          limits: k,
          hasExtension: function(pe) {
            return k.extensions.indexOf(pe.toLowerCase()) >= 0;
          },
          // Read pixels
          read: Ee,
          // Destroy regl and all associated resources
          destroy: Be,
          // Direct GL state manipulation
          _gl: d,
          _refresh: Ye,
          poll: function() {
            ut(), Q && Q.update();
          },
          // Current time
          now: Le,
          // regl Statistics Information
          stats: V
        });
        return n.onDone(null, ze), ze;
      }
      return Ac;
    });
  })(is);
  var dl = is.exports;
  const es = /* @__PURE__ */ Va(dl), hl = Yc();
  class ml {
    constructor({
      pb: r = null,
      width: l = 1280,
      height: g = 720,
      numSources: A = 4,
      numOutputs: z = 4,
      makeGlobal: ve = !0,
      autoLoop: oe = !0,
      detectAudio: ge = !0,
      enableStreamCapture: ye = !0,
      canvas: yt,
      precision: Ve,
      extendTransforms: He = {}
      // add your own functions on init
    } = {}) {
      if (ns.init(), this.pb = r, this.width = l, this.height = g, this.renderAll = !1, this.detectAudio = ge, this._initCanvas(yt), this.synth = {
        time: 0,
        bpm: 30,
        width: this.width,
        height: this.height,
        fps: void 0,
        stats: {
          fps: 0
        },
        speed: 1,
        mouse: hl,
        render: this._render.bind(this),
        setResolution: this.setResolution.bind(this),
        update: (it) => {
        },
        // user defined update function
        afterUpdate: (it) => {
        },
        // user defined function run after update
        hush: this.hush.bind(this),
        tick: this.tick.bind(this)
      }, ve && (window.loadScript = this.loadScript), this.timeSinceLastUpdate = 0, this._time = 0, Ve && ["lowp", "mediump", "highp"].includes(Ve.toLowerCase()))
        this.precision = Ve.toLowerCase();
      else {
        let it = (/iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
        this.precision = it ? "highp" : "mediump";
      }
      if (this.extendTransforms = He, this.saveFrame = !1, this.captureStream = null, this.generator = void 0, this._initRegl(), this._initOutputs(z), this._initSources(A), this._generateGlslTransforms(), this.synth.screencap = () => {
        this.saveFrame = !0;
      }, ye)
        try {
          this.captureStream = this.canvas.captureStream(25), this.synth.vidRecorder = new Zc(this.captureStream);
        } catch (it) {
          console.warn(`[hydra-synth warning]
new MediaSource() is not currently supported on iOS.`), console.error(it);
        }
      ge && this._initAudio(), oe && Uc(this.tick.bind(this)).start(), this.sandbox = new tl(this.synth, ve, ["speed", "update", "afterUpdate", "bpm", "fps"]);
    }
    eval(r) {
      this.sandbox.eval(r);
    }
    getScreenImage(r) {
      this.imageCallback = r, this.saveFrame = !0;
    }
    hush() {
      this.s.forEach((r) => {
        r.clear();
      }), this.o.forEach((r) => {
        this.synth.solid(0, 0, 0, 0).out(r);
      }), this.synth.render(this.o[0]), this.sandbox.set("update", (r) => {
      }), this.sandbox.set("afterUpdate", (r) => {
      });
    }
    loadScript(r = "") {
      return new Promise((g, A) => {
        var z = document.createElement("script");
        z.onload = function() {
          console.log(`loaded script ${r}`), g();
        }, z.onerror = (ve) => {
          console.log(`error loading script ${r}`, "log-error"), g();
        }, z.src = r, document.head.appendChild(z);
      });
    }
    setResolution(r, l) {
      this.canvas.width = r, this.canvas.height = l, this.width = r, this.height = l, this.sandbox.set("width", r), this.sandbox.set("height", l), console.log(this.width), this.o.forEach((g) => {
        g.resize(r, l);
      }), this.s.forEach((g) => {
        g.resize(r, l);
      }), this.regl._refresh(), console.log(this.canvas.width);
    }
    canvasToImage(r) {
      const l = document.createElement("a");
      l.style.display = "none";
      let g = /* @__PURE__ */ new Date();
      l.download = `hydra-${g.getFullYear()}-${g.getMonth() + 1}-${g.getDate()}-${g.getHours()}.${g.getMinutes()}.${g.getSeconds()}.png`, document.body.appendChild(l);
      var A = this;
      this.canvas.toBlob((z) => {
        A.imageCallback ? (A.imageCallback(z), delete A.imageCallback) : (l.href = URL.createObjectURL(z), console.log(l.href), l.click());
      }, "image/png"), setTimeout(() => {
        document.body.removeChild(l), window.URL.revokeObjectURL(l.href);
      }, 300);
    }
    _initAudio() {
      this.synth.a = new Qc({
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
      });
    }
    // create main output canvas and add to screen
    _initCanvas(r) {
      r ? (this.canvas = r, this.width = r.width, this.height = r.height) : (this.canvas = document.createElement("canvas"), this.canvas.width = this.width, this.canvas.height = this.height, this.canvas.style.width = "100%", this.canvas.style.height = "100%", this.canvas.style.imageRendering = "pixelated", document.body.appendChild(this.canvas));
    }
    _initRegl() {
      const r = this.canvas.getContext("webgl2", {
        alpha: !0,
        antialias: !1,
        premultipliedAlpha: !1,
        preserveDrawingBuffer: !0
      });
      r ? this.regl = es({
        gl: r,
        pixelRatio: 1
      }) : (console.warn("[hydra-synth] WebGL2 not available, falling back to WebGL1"), this.regl = es({
        canvas: this.canvas,
        pixelRatio: 1
        // extensions: [
        //   'oes_texture_half_float',
        //   'oes_texture_half_float_linear'
        // ],
        // optionalExtensions: [
        //   'oes_texture_float',
        //   'oes_texture_float_linear'
        //]
      })), this.regl.clear({
        color: [0, 0, 0, 1]
      }), this.renderAll = this.regl({
        frag: `#version 300 es
      precision ${this.precision} float;
      in vec2 uv;
      out vec4 fragColor;
      uniform sampler2D tex0;
      uniform sampler2D tex1;
      uniform sampler2D tex2;
      uniform sampler2D tex3;

      void main () {
        vec2 st = vec2(1.0 - uv.x, uv.y);
        st*= vec2(2);
        vec2 q = floor(st).xy*(vec2(2.0, 1.0));
        int quad = int(q.x) + int(q.y);
        st.x += step(1., mod(st.y,2.0));
        st.y += step(1., mod(st.x,2.0));
        st = fract(st);
        if(quad==0){
          fragColor = texture(tex0, st);
        } else if(quad==1){
          fragColor = texture(tex1, st);
        } else if (quad==2){
          fragColor = texture(tex2, st);
        } else {
          fragColor = texture(tex3, st);
        }

      }
      `,
        vert: `#version 300 es
      precision ${this.precision} float;
      in vec2 position;
      out vec2 uv;

      void main () {
        uv = position;
        gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
      }`,
        attributes: {
          position: [
            [-2, 0],
            [0, -2],
            [2, 2]
          ]
        },
        uniforms: {
          tex0: this.regl.prop("tex0"),
          tex1: this.regl.prop("tex1"),
          tex2: this.regl.prop("tex2"),
          tex3: this.regl.prop("tex3")
        },
        count: 3,
        depth: { enable: !1 }
      }), this.renderFbo = this.regl({
        frag: `#version 300 es
      precision ${this.precision} float;
      in vec2 uv;
      out vec4 fragColor;
      uniform vec2 resolution;
      uniform sampler2D tex0;

      void main () {
        fragColor = texture(tex0, vec2(1.0 - uv.x, uv.y));
      }
      `,
        vert: `#version 300 es
      precision ${this.precision} float;
      in vec2 position;
      out vec2 uv;

      void main () {
        uv = position;
        gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
      }`,
        attributes: {
          position: [
            [-2, 0],
            [0, -2],
            [2, 2]
          ]
        },
        uniforms: {
          tex0: this.regl.prop("tex0"),
          resolution: this.regl.prop("resolution")
        },
        count: 3,
        depth: { enable: !1 }
      });
    }
    _initOutputs(r) {
      const l = this;
      this.o = Array(r).fill().map((g, A) => {
        var z = new dr({
          regl: this.regl,
          width: this.width,
          height: this.height,
          precision: this.precision,
          label: `o${A}`
        });
        return z.id = A, l.synth["o" + A] = z, z;
      }), this.output = this.o[0];
    }
    _initSources(r) {
      this.s = [];
      for (var l = 0; l < r; l++)
        this.createSource(l);
    }
    createSource(r) {
      let l = new jc({ regl: this.regl, pb: this.pb, width: this.width, height: this.height, label: `s${r}` });
      return this.synth["s" + this.s.length] = l, this.s.push(l), l;
    }
    _generateGlslTransforms() {
      var r = this;
      this.generator = new cl({
        defaultOutput: this.o[0],
        defaultUniforms: this.o[0].uniforms,
        extendTransforms: this.extendTransforms,
        changeListener: ({ type: l, method: g, synth: A }) => {
          l === "add" && (r.synth[g] = A.generators[g], r.sandbox && r.sandbox.add(g));
        }
      }), this.synth.setFunction = this.generator.setFunction.bind(this.generator);
    }
    _render(r) {
      r ? (this.output = r, this.isRenderingAll = !1) : this.isRenderingAll = !0;
    }
    // dt in ms
    tick(r, l) {
      try {
        if (this.sandbox.tick(), this.detectAudio === !0 && this.synth.a.tick(), this.sandbox.set("time", this.synth.time += r * 1e-3 * this.synth.speed), this.timeSinceLastUpdate += r, !this.synth.fps || this.timeSinceLastUpdate >= 1e3 / this.synth.fps) {
          if (this.synth.stats.fps = Math.ceil(1e3 / this.timeSinceLastUpdate), this.synth.update)
            try {
              this.synth.update(this.timeSinceLastUpdate);
            } catch (A) {
              console.log(A);
            }
          for (let A = 0; A < this.s.length; A++)
            this.s[A].tick(this.synth.time);
          const g = this.synth.time;
          for (let A = 0; A < this.o.length; A++)
            this.o[A].tick({
              time: g,
              mouse: this.synth.mouse,
              bpm: this.synth.bpm,
              resolution: [this.canvas.width, this.canvas.height]
            });
          if (this.isRenderingAll ? this.renderAll({
            tex0: this.o[0].getCurrent(),
            tex1: this.o[1].getCurrent(),
            tex2: this.o[2].getCurrent(),
            tex3: this.o[3].getCurrent(),
            resolution: [this.canvas.width, this.canvas.height]
          }) : this.renderFbo({
            tex0: this.output.getCurrent(),
            resolution: [this.canvas.width, this.canvas.height]
          }), this.synth.afterUpdate)
            try {
              this.synth.afterUpdate(this.timeSinceLastUpdate);
            } catch (A) {
              console.log(A);
            }
          this.timeSinceLastUpdate = 0;
        }
        this.saveFrame === !0 && (this.canvasToImage(), this.saveFrame = !1);
      } catch (g) {
        console.warn("Error during tick():", g);
      }
    }
  }
  os.exports = ml;
});
export default pl();
