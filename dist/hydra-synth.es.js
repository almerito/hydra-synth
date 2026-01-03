var gc = (c, n) => () => (n || c((n = { exports: {} }).exports, n), n.exports);
var ul = gc((ll, es) => {
  class Ec {
    constructor({ regl: n, precision: y, label: p = "", width: w, height: b }) {
      this.regl = n, this.precision = y, this.label = p, this.positionBuffer = this.regl.buffer([
        [-2, 0],
        [0, -2],
        [2, 2]
      ]), this.draw = () => {
      }, this.init(), this.pingPongIndex = 0, this.fbos = Array(2).fill().map(() => this.regl.framebuffer({
        color: this.regl.texture({
          mag: "nearest",
          width: w,
          height: b,
          format: "rgba"
        }),
        depthStencil: !1
      }));
    }
    resize(n, y) {
      this.fbos.forEach((p) => {
        p.resize(n, y);
      });
    }
    getCurrent() {
      return this.fbos[this.pingPongIndex];
    }
    getTexture() {
      var n = this.pingPongIndex ? 0 : 1;
      return this.fbos[n];
    }
    init() {
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
    }
    render(n) {
      let y = n[0];
      var p = this, w = Object.assign(y.uniforms, {
        prevBuffer: () => p.fbos[p.pingPongIndex]
      });
      p.draw = p.regl({
        frag: y.frag,
        vert: p.vert,
        attributes: p.attributes,
        uniforms: w,
        count: 3,
        framebuffer: () => (p.pingPongIndex = p.pingPongIndex ? 0 : 1, p.fbos[p.pingPongIndex])
      });
    }
    tick(n) {
      this.draw(n);
    }
  }
  function Ba(c) {
    return c && c.__esModule && Object.prototype.hasOwnProperty.call(c, "default") ? c.default : c;
  }
  var Ln = { exports: {} }, $o;
  function xc() {
    return $o || ($o = 1, typeof Object.create == "function" ? Ln.exports = function(n, y) {
      y && (n.super_ = y, n.prototype = Object.create(y.prototype, {
        constructor: {
          value: n,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }));
    } : Ln.exports = function(n, y) {
      if (y) {
        n.super_ = y;
        var p = function() {
        };
        p.prototype = y.prototype, n.prototype = new p(), n.prototype.constructor = n;
      }
    }), Ln.exports;
  }
  var Oa, Uo;
  function wc() {
    if (Uo) return Oa;
    Uo = 1;
    function c() {
      this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0;
    }
    Oa = c, c.EventEmitter = c, c.prototype._events = void 0, c.prototype._maxListeners = void 0, c.defaultMaxListeners = 10, c.prototype.setMaxListeners = function(b) {
      if (!y(b) || b < 0 || isNaN(b))
        throw TypeError("n must be a positive number");
      return this._maxListeners = b, this;
    }, c.prototype.emit = function(b) {
      var H, N, ee, ce, Xe, Se;
      if (this._events || (this._events = {}), b === "error" && (!this._events.error || p(this._events.error) && !this._events.error.length)) {
        if (H = arguments[1], H instanceof Error)
          throw H;
        var Ie = new Error('Uncaught, unspecified "error" event. (' + H + ")");
        throw Ie.context = H, Ie;
      }
      if (N = this._events[b], w(N))
        return !1;
      if (n(N))
        switch (arguments.length) {
          // fast cases
          case 1:
            N.call(this);
            break;
          case 2:
            N.call(this, arguments[1]);
            break;
          case 3:
            N.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            ce = Array.prototype.slice.call(arguments, 1), N.apply(this, ce);
        }
      else if (p(N))
        for (ce = Array.prototype.slice.call(arguments, 1), Se = N.slice(), ee = Se.length, Xe = 0; Xe < ee; Xe++)
          Se[Xe].apply(this, ce);
      return !0;
    }, c.prototype.addListener = function(b, H) {
      var N;
      if (!n(H))
        throw TypeError("listener must be a function");
      return this._events || (this._events = {}), this._events.newListener && this.emit(
        "newListener",
        b,
        n(H.listener) ? H.listener : H
      ), this._events[b] ? p(this._events[b]) ? this._events[b].push(H) : this._events[b] = [this._events[b], H] : this._events[b] = H, p(this._events[b]) && !this._events[b].warned && (w(this._maxListeners) ? N = c.defaultMaxListeners : N = this._maxListeners, N && N > 0 && this._events[b].length > N && (this._events[b].warned = !0, console.error(
        "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
        this._events[b].length
      ), typeof console.trace == "function" && console.trace())), this;
    }, c.prototype.on = c.prototype.addListener, c.prototype.once = function(b, H) {
      if (!n(H))
        throw TypeError("listener must be a function");
      var N = !1;
      function ee() {
        this.removeListener(b, ee), N || (N = !0, H.apply(this, arguments));
      }
      return ee.listener = H, this.on(b, ee), this;
    }, c.prototype.removeListener = function(b, H) {
      var N, ee, ce, Xe;
      if (!n(H))
        throw TypeError("listener must be a function");
      if (!this._events || !this._events[b])
        return this;
      if (N = this._events[b], ce = N.length, ee = -1, N === H || n(N.listener) && N.listener === H)
        delete this._events[b], this._events.removeListener && this.emit("removeListener", b, H);
      else if (p(N)) {
        for (Xe = ce; Xe-- > 0; )
          if (N[Xe] === H || N[Xe].listener && N[Xe].listener === H) {
            ee = Xe;
            break;
          }
        if (ee < 0)
          return this;
        N.length === 1 ? (N.length = 0, delete this._events[b]) : N.splice(ee, 1), this._events.removeListener && this.emit("removeListener", b, H);
      }
      return this;
    }, c.prototype.removeAllListeners = function(b) {
      var H, N;
      if (!this._events)
        return this;
      if (!this._events.removeListener)
        return arguments.length === 0 ? this._events = {} : this._events[b] && delete this._events[b], this;
      if (arguments.length === 0) {
        for (H in this._events)
          H !== "removeListener" && this.removeAllListeners(H);
        return this.removeAllListeners("removeListener"), this._events = {}, this;
      }
      if (N = this._events[b], n(N))
        this.removeListener(b, N);
      else if (N)
        for (; N.length; )
          this.removeListener(b, N[N.length - 1]);
      return delete this._events[b], this;
    }, c.prototype.listeners = function(b) {
      var H;
      return !this._events || !this._events[b] ? H = [] : n(this._events[b]) ? H = [this._events[b]] : H = this._events[b].slice(), H;
    }, c.prototype.listenerCount = function(b) {
      if (this._events) {
        var H = this._events[b];
        if (n(H))
          return 1;
        if (H)
          return H.length;
      }
      return 0;
    }, c.listenerCount = function(b, H) {
      return b.listenerCount(H);
    };
    function n(b) {
      return typeof b == "function";
    }
    function y(b) {
      return typeof b == "number";
    }
    function p(b) {
      return typeof b == "object" && b !== null;
    }
    function w(b) {
      return b === void 0;
    }
    return Oa;
  }
  var Ca, zo;
  function Ac() {
    return zo || (zo = 1, Ca = window.performance && window.performance.now ? function() {
      return performance.now();
    } : Date.now || function() {
      return +/* @__PURE__ */ new Date();
    }), Ca;
  }
  var Hr = { exports: {} }, sr = { exports: {} }, Tc = sr.exports, jo;
  function Sc() {
    return jo || (jo = 1, (function() {
      var c, n, y, p, w, b;
      typeof performance < "u" && performance !== null && performance.now ? sr.exports = function() {
        return performance.now();
      } : typeof process < "u" && process !== null && process.hrtime ? (sr.exports = function() {
        return (c() - w) / 1e6;
      }, n = process.hrtime, c = function() {
        var H;
        return H = n(), H[0] * 1e9 + H[1];
      }, p = c(), b = process.uptime() * 1e9, w = p - b) : Date.now ? (sr.exports = function() {
        return Date.now() - y;
      }, y = Date.now()) : (sr.exports = function() {
        return (/* @__PURE__ */ new Date()).getTime() - y;
      }, y = (/* @__PURE__ */ new Date()).getTime());
    }).call(Tc)), sr.exports;
  }
  var Xo;
  function Lc() {
    if (Xo) return Hr.exports;
    Xo = 1;
    for (var c = Sc(), n = window, y = ["moz", "webkit"], p = "AnimationFrame", w = n["request" + p], b = n["cancel" + p] || n["cancelRequest" + p], H = 0; !w && H < y.length; H++)
      w = n[y[H] + "Request" + p], b = n[y[H] + "Cancel" + p] || n[y[H] + "CancelRequest" + p];
    if (!w || !b) {
      var N = 0, ee = 0, ce = [], Xe = 1e3 / 60;
      w = function(Se) {
        if (ce.length === 0) {
          var Ie = c(), We = Math.max(0, Xe - (Ie - N));
          N = We + Ie, setTimeout(function() {
            var Ye = ce.slice(0);
            ce.length = 0;
            for (var Je = 0; Je < Ye.length; Je++)
              if (!Ye[Je].cancelled)
                try {
                  Ye[Je].callback(N);
                } catch (Pt) {
                  setTimeout(function() {
                    throw Pt;
                  }, 0);
                }
          }, Math.round(We));
        }
        return ce.push({
          handle: ++ee,
          callback: Se,
          cancelled: !1
        }), ee;
      }, b = function(Se) {
        for (var Ie = 0; Ie < ce.length; Ie++)
          ce[Ie].handle === Se && (ce[Ie].cancelled = !0);
      };
    }
    return Hr.exports = function(Se) {
      return w.call(n, Se);
    }, Hr.exports.cancel = function() {
      b.apply(n, arguments);
    }, Hr.exports.polyfill = function(Se) {
      Se || (Se = n), Se.requestAnimationFrame = w, Se.cancelAnimationFrame = b;
    }, Hr.exports;
  }
  var Fa, Vo;
  function Rc() {
    if (Vo) return Fa;
    Vo = 1;
    var c = xc(), n = wc().EventEmitter, y = Ac(), p = Lc();
    Fa = w;
    function w(b) {
      if (!(this instanceof w))
        return new w(b);
      this.running = !1, this.last = y(), this._frame = 0, this._tick = this.tick.bind(this), b && this.on("tick", b);
    }
    return c(w, n), w.prototype.start = function() {
      if (!this.running)
        return this.running = !0, this.last = y(), this._frame = p(this._tick), this;
    }, w.prototype.stop = function() {
      return this.running = !1, this._frame !== 0 && p.cancel(this._frame), this._frame = 0, this;
    }, w.prototype.tick = function() {
      this._frame = p(this._tick);
      var b = y(), H = b - this.last;
      this.emit("tick", H), this.last = b;
    }, Fa;
  }
  var Oc = Rc();
  const Cc = /* @__PURE__ */ Ba(Oc);
  function Fc(c) {
    return navigator.mediaDevices.enumerateDevices().then((n) => n.filter((y) => y.kind === "videoinput")).then((n) => {
      let y = { audio: !1, video: !0 };
      return n[c] && (y.video = {
        deviceId: { exact: n[c].deviceId }
      }), window.navigator.mediaDevices.getUserMedia(y);
    }).then((n) => {
      const y = document.createElement("video");
      return y.setAttribute("autoplay", ""), y.setAttribute("muted", ""), y.setAttribute("playsinline", ""), y.srcObject = n, new Promise((p, w) => {
        y.addEventListener("loadedmetadata", () => {
          y.play().then(() => p({ video: y }));
        });
      });
    }).catch(console.log.bind(console));
  }
  function Gc(c) {
    return new Promise(function(n, y) {
      navigator.mediaDevices.getDisplayMedia(c).then((p) => {
        const w = document.createElement("video");
        w.srcObject = p, w.addEventListener("loadedmetadata", () => {
          w.play(), n({ video: w });
        });
      }).catch((p) => y(p));
    });
  }
  class Mc {
    constructor({ regl: n, width: y, height: p, pb: w, label: b = "" }) {
      this.label = b, this.regl = n, this.src = null, this.dynamic = !0, this.width = y, this.height = p, this.tex = this.regl.texture({
        //  shape: [width, height]
        shape: [1, 1]
      }), this.pb = w;
    }
    init(n, y) {
      "src" in n && (this.src = n.src, this.tex = this.regl.texture({ data: this.src, ...y })), "dynamic" in n && (this.dynamic = n.dynamic);
    }
    initCam(n, y) {
      const p = this;
      Fc(n).then((w) => {
        p.src = w.video, p.dynamic = !0, p.tex = p.regl.texture({ data: p.src, ...y });
      }).catch((w) => console.log("could not get camera", w));
    }
    initVideo(n = "", y) {
      const p = document.createElement("video");
      p.crossOrigin = "anonymous", p.autoplay = !0, p.loop = !0, p.muted = !0, p.addEventListener("loadeddata", () => {
        this.src = p, p.play(), this.tex = this.regl.texture({ data: this.src, ...y }), this.dynamic = !0;
      }), p.src = n;
    }
    initImage(n = "", y) {
      const p = document.createElement("img");
      p.crossOrigin = "anonymous", p.src = n, p.onload = () => {
        this.src = p, this.dynamic = !1, this.tex = this.regl.texture({ data: this.src, ...y });
      };
    }
    initStream(n, y) {
      let p = this;
      n && this.pb && (this.pb.initSource(n), this.pb.on("got video", function(w, b) {
        w === n && (p.src = b, p.dynamic = !0, p.tex = p.regl.texture({ data: p.src, ...y }));
      }));
    }
    // index only relevant in atom-hydra + desktop apps
    initScreen(n = 0, y) {
      const p = this;
      Gc().then(function(w) {
        p.src = w.video, p.tex = p.regl.texture({ data: p.src, ...y }), p.dynamic = !0;
      }).catch((w) => console.log("could not get screen", w));
    }
    // cache for the canvases, so we don't create them every time
    canvases = {};
    // Creates a canvas and returns the 2d context
    initCanvas(n = 1e3, y = 1e3) {
      if (this.canvases[this.label] == null) {
        const H = document.createElement("canvas").getContext("2d");
        H != null && (this.canvases[this.label] = H);
      }
      const p = this.canvases[this.label], w = p.canvas;
      return w.width !== n && w.height !== y ? (w.width = n, w.height = y) : p.clearRect(0, 0, n, y), this.init({ src: w }), this.dynamic = !0, p;
    }
    resize(n, y) {
      this.width = n, this.height = y;
    }
    clear() {
      this.src && this.src.srcObject && this.src.srcObject.getTracks && this.src.srcObject.getTracks().forEach((n) => n.stop()), this.src = null, this.tex = this.regl.texture({ shape: [1, 1] });
    }
    tick(n) {
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
  function kc(c) {
    if (typeof c == "object") {
      if ("buttons" in c)
        return c.buttons;
      if ("which" in c) {
        var n = c.which;
        if (n === 2)
          return 4;
        if (n === 3)
          return 2;
        if (n > 0)
          return 1 << n - 1;
      } else if ("button" in c) {
        var n = c.button;
        if (n === 1)
          return 4;
        if (n === 2)
          return 2;
        if (n >= 0)
          return 1 << n;
      }
    }
    return 0;
  }
  zt.buttons = kc;
  function Ic(c) {
    return c.target || c.srcElement || window;
  }
  zt.element = Ic;
  function Bc(c) {
    return typeof c == "object" && "pageX" in c ? c.pageX : 0;
  }
  zt.x = Bc;
  function Nc(c) {
    return typeof c == "object" && "pageY" in c ? c.pageY : 0;
  }
  zt.y = Nc;
  function Dc(c, n) {
    n || (n = c, c = window);
    var y = 0, p = 0, w = 0, b = {
      shift: !1,
      alt: !1,
      control: !1,
      meta: !1
    }, H = !1;
    function N(Ue) {
      var at = !1;
      return "altKey" in Ue && (at = at || Ue.altKey !== b.alt, b.alt = !!Ue.altKey), "shiftKey" in Ue && (at = at || Ue.shiftKey !== b.shift, b.shift = !!Ue.shiftKey), "ctrlKey" in Ue && (at = at || Ue.ctrlKey !== b.control, b.control = !!Ue.ctrlKey), "metaKey" in Ue && (at = at || Ue.metaKey !== b.meta, b.meta = !!Ue.metaKey), at;
    }
    function ee(Ue, at) {
      var Yt = zt.x(at), gt = zt.y(at);
      "buttons" in at && (Ue = at.buttons | 0), (Ue !== y || Yt !== p || gt !== w || N(at)) && (y = Ue | 0, p = Yt || 0, w = gt || 0, n && n(y, p, w, b));
    }
    function ce(Ue) {
      ee(0, Ue);
    }
    function Xe() {
      (y || p || w || b.shift || b.alt || b.meta || b.control) && (p = w = 0, y = 0, b.shift = b.alt = b.control = b.meta = !1, n && n(0, 0, 0, b));
    }
    function Se(Ue) {
      N(Ue) && n && n(y, p, w, b);
    }
    function Ie(Ue) {
      zt.buttons(Ue) === 0 ? ee(0, Ue) : ee(y, Ue);
    }
    function We(Ue) {
      ee(y | zt.buttons(Ue), Ue);
    }
    function Ye(Ue) {
      ee(y & ~zt.buttons(Ue), Ue);
    }
    function Je() {
      H || (H = !0, c.addEventListener("mousemove", Ie), c.addEventListener("mousedown", We), c.addEventListener("mouseup", Ye), c.addEventListener("mouseleave", ce), c.addEventListener("mouseenter", ce), c.addEventListener("mouseout", ce), c.addEventListener("mouseover", ce), c.addEventListener("blur", Xe), c.addEventListener("keyup", Se), c.addEventListener("keydown", Se), c.addEventListener("keypress", Se), c !== window && (window.addEventListener("blur", Xe), window.addEventListener("keyup", Se), window.addEventListener("keydown", Se), window.addEventListener("keypress", Se)));
    }
    function Pt() {
      H && (H = !1, c.removeEventListener("mousemove", Ie), c.removeEventListener("mousedown", We), c.removeEventListener("mouseup", Ye), c.removeEventListener("mouseleave", ce), c.removeEventListener("mouseenter", ce), c.removeEventListener("mouseout", ce), c.removeEventListener("mouseover", ce), c.removeEventListener("blur", Xe), c.removeEventListener("keyup", Se), c.removeEventListener("keydown", Se), c.removeEventListener("keypress", Se), c !== window && (window.removeEventListener("blur", Xe), window.removeEventListener("keyup", Se), window.removeEventListener("keydown", Se), window.removeEventListener("keypress", Se)));
    }
    Je();
    var pt = {
      element: c
    };
    return Object.defineProperties(pt, {
      enabled: {
        get: function() {
          return H;
        },
        set: function(Ue) {
          Ue ? Je() : Pt();
        },
        enumerable: !0
      },
      buttons: {
        get: function() {
          return y;
        },
        enumerable: !0
      },
      x: {
        get: function() {
          return p;
        },
        enumerable: !0
      },
      y: {
        get: function() {
          return w;
        },
        enumerable: !0
      },
      mods: {
        get: function() {
          return b;
        },
        enumerable: !0
      }
    }), pt;
  }
  var Rn = { exports: {} }, Pc = Rn.exports, Ho;
  function $c() {
    return Ho || (Ho = 1, (function(c, n) {
      (function(y, p) {
        c.exports = p();
      })(Pc, (function() {
        function y(R, _, j) {
          for (var C, re = 0, pe = _.length; re < pe; re++) !C && re in _ || (C || (C = Array.prototype.slice.call(_, 0, re)), C[re] = _[re]);
          return R.concat(C || Array.prototype.slice.call(_));
        }
        var p = Object.freeze({ __proto__: null, blackman: function(R) {
          for (var _ = new Float32Array(R), j = 2 * Math.PI / (R - 1), C = 2 * j, re = 0; re < R / 2; re++) _[re] = 0.42 - 0.5 * Math.cos(re * j) + 0.08 * Math.cos(re * C);
          for (re = Math.ceil(R / 2); re > 0; re--) _[R - re] = _[re - 1];
          return _;
        }, hamming: function(R) {
          for (var _ = new Float32Array(R), j = 0; j < R; j++) _[j] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (j / R - 1));
          return _;
        }, hanning: function(R) {
          for (var _ = new Float32Array(R), j = 0; j < R; j++) _[j] = 0.5 - 0.5 * Math.cos(2 * Math.PI * j / (R - 1));
          return _;
        }, sine: function(R) {
          for (var _ = Math.PI / (R - 1), j = new Float32Array(R), C = 0; C < R; C++) j[C] = Math.sin(_ * C);
          return j;
        } }), w = {};
        function b(R) {
          for (; R % 2 == 0 && R > 1; ) R /= 2;
          return R === 1;
        }
        function H(R, _) {
          if (_ !== "rect") {
            if (_ !== "" && _ || (_ = "hanning"), w[_] || (w[_] = {}), !w[_][R.length]) try {
              w[_][R.length] = p[_](R.length);
            } catch {
              throw new Error("Invalid windowing function");
            }
            R = (function(j, C) {
              for (var re = [], pe = 0; pe < Math.min(j.length, C.length); pe++) re[pe] = j[pe] * C[pe];
              return re;
            })(R, w[_][R.length]);
          }
          return R;
        }
        function N(R, _, j) {
          for (var C = new Float32Array(R), re = 0; re < C.length; re++) C[re] = re * _ / j, C[re] = 13 * Math.atan(C[re] / 1315.8) + 3.5 * Math.atan(Math.pow(C[re] / 7518, 2));
          return C;
        }
        function ee(R) {
          return Float32Array.from(R);
        }
        function ce(R) {
          return 1125 * Math.log(1 + R / 700);
        }
        function Xe(R, _, j) {
          for (var C, re = new Float32Array(R + 2), pe = new Float32Array(R + 2), Fe = _ / 2, Be = ce(0), Ae = (ce(Fe) - Be) / (R + 1), xe = new Array(R + 2), Pe = 0; Pe < re.length; Pe++) re[Pe] = Pe * Ae, pe[Pe] = (C = re[Pe], 700 * (Math.exp(C / 1125) - 1)), xe[Pe] = Math.floor((j + 1) * pe[Pe] / _);
          for (var vt = new Array(R), De = 0; De < vt.length; De++) {
            for (vt[De] = new Array(j / 2 + 1).fill(0), Pe = xe[De]; Pe < xe[De + 1]; Pe++) vt[De][Pe] = (Pe - xe[De]) / (xe[De + 1] - xe[De]);
            for (Pe = xe[De + 1]; Pe < xe[De + 2]; Pe++) vt[De][Pe] = (xe[De + 2] - Pe) / (xe[De + 2] - xe[De + 1]);
          }
          return vt;
        }
        function Se(R, _, j, C, re, pe, Fe) {
          C === void 0 && (C = 5), re === void 0 && (re = 2), pe === void 0 && (pe = !0), Fe === void 0 && (Fe = 440);
          var Be = Math.floor(j / 2) + 1, Ae = new Array(j).fill(0).map((function(it, mt) {
            return R * (function(yt, Ft) {
              return Math.log2(16 * yt / Ft);
            })(_ * mt / j, Fe);
          }));
          Ae[0] = Ae[1] - 1.5 * R;
          var xe, Pe, vt, De = Ae.slice(1).map((function(it, mt) {
            return Math.max(it - Ae[mt]);
          }), 1).concat([1]), Rt = Math.round(R / 2), wt = new Array(R).fill(0).map((function(it, mt) {
            return Ae.map((function(yt) {
              return (10 * R + Rt + yt - mt) % R - Rt;
            }));
          })), At = wt.map((function(it, mt) {
            return it.map((function(yt, Ft) {
              return Math.exp(-0.5 * Math.pow(2 * wt[mt][Ft] / De[Ft], 2));
            }));
          }));
          if (Pe = (xe = At)[0].map((function() {
            return 0;
          })), vt = xe.reduce((function(it, mt) {
            return mt.forEach((function(yt, Ft) {
              it[Ft] += Math.pow(yt, 2);
            })), it;
          }), Pe).map(Math.sqrt), At = xe.map((function(it, mt) {
            return it.map((function(yt, Ft) {
              return yt / (vt[Ft] || 1);
            }));
          })), re) {
            var Lr = Ae.map((function(it) {
              return Math.exp(-0.5 * Math.pow((it / R - C) / re, 2));
            }));
            At = At.map((function(it) {
              return it.map((function(mt, yt) {
                return mt * Lr[yt];
              }));
            }));
          }
          return pe && (At = y(y([], At.slice(3), !0), At.slice(0, 3))), At.map((function(it) {
            return it.slice(0, Be);
          }));
        }
        function Ie(R, _) {
          for (var j = 0, C = 0, re = 0; re < _.length; re++) j += Math.pow(re, R) * Math.abs(_[re]), C += _[re];
          return j / C;
        }
        function We(R) {
          var _ = R.ampSpectrum, j = R.barkScale, C = R.numberOfBarkBands, re = C === void 0 ? 24 : C;
          if (typeof _ != "object" || typeof j != "object") throw new TypeError();
          var pe = re, Fe = new Float32Array(pe), Be = 0, Ae = _, xe = new Int32Array(pe + 1);
          xe[0] = 0;
          for (var Pe = j[Ae.length - 1] / pe, vt = 1, De = 0; De < Ae.length; De++) for (; j[De] > Pe; ) xe[vt++] = De, Pe = vt * j[Ae.length - 1] / pe;
          for (xe[pe] = Ae.length - 1, De = 0; De < pe; De++) {
            for (var Rt = 0, wt = xe[De]; wt < xe[De + 1]; wt++) Rt += Ae[wt];
            Fe[De] = Math.pow(Rt, 0.23);
          }
          for (De = 0; De < Fe.length; De++) Be += Fe[De];
          return { specific: Fe, total: Be };
        }
        function Ye(R) {
          var _ = R.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          for (var j = new Float32Array(_.length), C = 0; C < j.length; C++) j[C] = Math.pow(_[C], 2);
          return j;
        }
        function Je(R) {
          var _ = R.ampSpectrum, j = R.melFilterBank, C = R.bufferSize;
          if (typeof _ != "object") throw new TypeError("Valid ampSpectrum is required to generate melBands");
          if (typeof j != "object") throw new TypeError("Valid melFilterBank is required to generate melBands");
          for (var re = Ye({ ampSpectrum: _ }), pe = j.length, Fe = Array(pe), Be = new Float32Array(pe), Ae = 0; Ae < Be.length; Ae++) {
            Fe[Ae] = new Float32Array(C / 2), Be[Ae] = 0;
            for (var xe = 0; xe < C / 2; xe++) Fe[Ae][xe] = j[Ae][xe] * re[xe], Be[Ae] += Fe[Ae][xe];
            Be[Ae] = Math.log(Be[Ae] + 1);
          }
          return Array.prototype.slice.call(Be);
        }
        function Pt(R) {
          return R && R.__esModule && Object.prototype.hasOwnProperty.call(R, "default") ? R.default : R;
        }
        var pt = null, Ue = Pt((function(R, _) {
          var j = R.length;
          return _ = _ || 2, pt && pt[j] || (function(C) {
            (pt = pt || {})[C] = new Array(C * C);
            for (var re = Math.PI / C, pe = 0; pe < C; pe++) for (var Fe = 0; Fe < C; Fe++) pt[C][Fe + pe * C] = Math.cos(re * (Fe + 0.5) * pe);
          })(j), R.map((function() {
            return 0;
          })).map((function(C, re) {
            return _ * R.reduce((function(pe, Fe, Be, Ae) {
              return pe + Fe * pt[j][Be + re * j];
            }), 0);
          }));
        })), at = Object.freeze({ __proto__: null, amplitudeSpectrum: function(R) {
          return R.ampSpectrum;
        }, buffer: function(R) {
          return R.signal;
        }, chroma: function(R) {
          var _ = R.ampSpectrum, j = R.chromaFilterBank;
          if (typeof _ != "object") throw new TypeError("Valid ampSpectrum is required to generate chroma");
          if (typeof j != "object") throw new TypeError("Valid chromaFilterBank is required to generate chroma");
          var C = j.map((function(pe, Fe) {
            return _.reduce((function(Be, Ae, xe) {
              return Be + Ae * pe[xe];
            }), 0);
          })), re = Math.max.apply(Math, C);
          return re ? C.map((function(pe) {
            return pe / re;
          })) : C;
        }, complexSpectrum: function(R) {
          return R.complexSpectrum;
        }, energy: function(R) {
          var _ = R.signal;
          if (typeof _ != "object") throw new TypeError();
          for (var j = 0, C = 0; C < _.length; C++) j += Math.pow(Math.abs(_[C]), 2);
          return j;
        }, loudness: We, melBands: Je, mfcc: function(R) {
          var _ = R.ampSpectrum, j = R.melFilterBank, C = R.numberOfMFCCCoefficients, re = R.bufferSize, pe = Math.min(40, Math.max(1, C || 13));
          if (j.length < pe) throw new Error("Insufficient filter bank for requested number of coefficients");
          var Fe = Je({ ampSpectrum: _, melFilterBank: j, bufferSize: re });
          return Ue(Fe).slice(0, pe);
        }, perceptualSharpness: function(R) {
          for (var _ = We({ ampSpectrum: R.ampSpectrum, barkScale: R.barkScale }), j = _.specific, C = 0, re = 0; re < j.length; re++) C += re < 15 ? (re + 1) * j[re + 1] : 0.066 * Math.exp(0.171 * (re + 1));
          return C *= 0.11 / _.total;
        }, perceptualSpread: function(R) {
          for (var _ = We({ ampSpectrum: R.ampSpectrum, barkScale: R.barkScale }), j = 0, C = 0; C < _.specific.length; C++) _.specific[C] > j && (j = _.specific[C]);
          return Math.pow((_.total - j) / _.total, 2);
        }, powerSpectrum: Ye, rms: function(R) {
          var _ = R.signal;
          if (typeof _ != "object") throw new TypeError();
          for (var j = 0, C = 0; C < _.length; C++) j += Math.pow(_[C], 2);
          return j /= _.length, j = Math.sqrt(j);
        }, spectralCentroid: function(R) {
          var _ = R.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          return Ie(1, _);
        }, spectralCrest: function(R) {
          var _ = R.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          var j = 0, C = -1 / 0;
          return _.forEach((function(re) {
            j += Math.pow(re, 2), C = re > C ? re : C;
          })), j /= _.length, j = Math.sqrt(j), C / j;
        }, spectralFlatness: function(R) {
          var _ = R.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          for (var j = 0, C = 0, re = 0; re < _.length; re++) j += Math.log(_[re]), C += _[re];
          return Math.exp(j / _.length) * _.length / C;
        }, spectralFlux: function(R) {
          var _ = R.signal, j = R.previousSignal, C = R.bufferSize;
          if (typeof _ != "object" || typeof j != "object") throw new TypeError();
          for (var re = 0, pe = -C / 2; pe < _.length / 2 - 1; pe++) x = Math.abs(_[pe]) - Math.abs(j[pe]), re += (x + Math.abs(x)) / 2;
          return re;
        }, spectralKurtosis: function(R) {
          var _ = R.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          var j = _, C = Ie(1, j), re = Ie(2, j), pe = Ie(3, j), Fe = Ie(4, j);
          return (-3 * Math.pow(C, 4) + 6 * C * re - 4 * C * pe + Fe) / Math.pow(Math.sqrt(re - Math.pow(C, 2)), 4);
        }, spectralRolloff: function(R) {
          var _ = R.ampSpectrum, j = R.sampleRate;
          if (typeof _ != "object") throw new TypeError();
          for (var C = _, re = j / (2 * (C.length - 1)), pe = 0, Fe = 0; Fe < C.length; Fe++) pe += C[Fe];
          for (var Be = 0.99 * pe, Ae = C.length - 1; pe > Be && Ae >= 0; ) pe -= C[Ae], --Ae;
          return (Ae + 1) * re;
        }, spectralSkewness: function(R) {
          var _ = R.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          var j = Ie(1, _), C = Ie(2, _), re = Ie(3, _);
          return (2 * Math.pow(j, 3) - 3 * j * C + re) / Math.pow(Math.sqrt(C - Math.pow(j, 2)), 3);
        }, spectralSlope: function(R) {
          var _ = R.ampSpectrum, j = R.sampleRate, C = R.bufferSize;
          if (typeof _ != "object") throw new TypeError();
          for (var re = 0, pe = 0, Fe = new Float32Array(_.length), Be = 0, Ae = 0, xe = 0; xe < _.length; xe++) {
            re += _[xe];
            var Pe = xe * j / C;
            Fe[xe] = Pe, Be += Pe * Pe, pe += Pe, Ae += Pe * _[xe];
          }
          return (_.length * Ae - pe * re) / (re * (Be - Math.pow(pe, 2)));
        }, spectralSpread: function(R) {
          var _ = R.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          return Math.sqrt(Ie(2, _) - Math.pow(Ie(1, _), 2));
        }, zcr: function(R) {
          var _ = R.signal;
          if (typeof _ != "object") throw new TypeError();
          for (var j = 0, C = 1; C < _.length; C++) (_[C - 1] >= 0 && _[C] < 0 || _[C - 1] < 0 && _[C] >= 0) && j++;
          return j;
        } });
        function Yt(R) {
          if (Array.isArray(R)) {
            for (var _ = 0, j = Array(R.length); _ < R.length; _++) j[_] = R[_];
            return j;
          }
          return Array.from(R);
        }
        var gt = {}, fr = {}, It = { bitReverseArray: function(R) {
          if (gt[R] === void 0) {
            for (var _ = (R - 1).toString(2).length, j = "0".repeat(_), C = {}, re = 0; re < R; re++) {
              var pe = re.toString(2);
              pe = j.substr(pe.length) + pe, pe = [].concat(Yt(pe)).reverse().join(""), C[re] = parseInt(pe, 2);
            }
            gt[R] = C;
          }
          return gt[R];
        }, multiply: function(R, _) {
          return { real: R.real * _.real - R.imag * _.imag, imag: R.real * _.imag + R.imag * _.real };
        }, add: function(R, _) {
          return { real: R.real + _.real, imag: R.imag + _.imag };
        }, subtract: function(R, _) {
          return { real: R.real - _.real, imag: R.imag - _.imag };
        }, euler: function(R, _) {
          var j = -2 * Math.PI * R / _;
          return { real: Math.cos(j), imag: Math.sin(j) };
        }, conj: function(R) {
          return R.imag *= -1, R;
        }, constructComplexArray: function(R) {
          var _ = {};
          _.real = R.real === void 0 ? R.slice() : R.real.slice();
          var j = _.real.length;
          return fr[j] === void 0 && (fr[j] = Array.apply(null, Array(j)).map(Number.prototype.valueOf, 0)), _.imag = fr[j].slice(), _;
        } }, Cn = function(R) {
          var _ = {};
          R.real === void 0 || R.imag === void 0 ? _ = It.constructComplexArray(R) : (_.real = R.real.slice(), _.imag = R.imag.slice());
          var j = _.real.length, C = Math.log2(j);
          if (Math.round(C) != C) throw new Error("Input size must be a power of 2.");
          if (_.real.length != _.imag.length) throw new Error("Real and imaginary components must have the same length.");
          for (var re = It.bitReverseArray(j), pe = { real: [], imag: [] }, Fe = 0; Fe < j; Fe++) pe.real[re[Fe]] = _.real[Fe], pe.imag[re[Fe]] = _.imag[Fe];
          for (var Be = 0; Be < j; Be++) _.real[Be] = pe.real[Be], _.imag[Be] = pe.imag[Be];
          for (var Ae = 1; Ae <= C; Ae++) for (var xe = Math.pow(2, Ae), Pe = 0; Pe < xe / 2; Pe++) for (var vt = It.euler(Pe, xe), De = 0; De < j / xe; De++) {
            var Rt = xe * De + Pe, wt = xe * De + Pe + xe / 2, At = { real: _.real[Rt], imag: _.imag[Rt] }, Lr = { real: _.real[wt], imag: _.imag[wt] }, it = It.multiply(vt, Lr), mt = It.subtract(At, it);
            _.real[wt] = mt.real, _.imag[wt] = mt.imag;
            var yt = It.add(it, At);
            _.real[Rt] = yt.real, _.imag[Rt] = yt.imag;
          }
          return _;
        }, Fn = Cn, Gn = (function() {
          function R(_, j) {
            var C = this;
            if (this._m = j, !_.audioContext) throw this._m.errors.noAC;
            if (_.bufferSize && !b(_.bufferSize)) throw this._m._errors.notPow2;
            if (!_.source) throw this._m._errors.noSource;
            this._m.audioContext = _.audioContext, this._m.bufferSize = _.bufferSize || this._m.bufferSize || 256, this._m.hopSize = _.hopSize || this._m.hopSize || this._m.bufferSize, this._m.sampleRate = _.sampleRate || this._m.audioContext.sampleRate || 44100, this._m.callback = _.callback, this._m.windowingFunction = _.windowingFunction || "hanning", this._m.featureExtractors = at, this._m.EXTRACTION_STARTED = _.startImmediately || !1, this._m.channel = typeof _.channel == "number" ? _.channel : 0, this._m.inputs = _.inputs || 1, this._m.outputs = _.outputs || 1, this._m.numberOfMFCCCoefficients = _.numberOfMFCCCoefficients || this._m.numberOfMFCCCoefficients || 13, this._m.numberOfBarkBands = _.numberOfBarkBands || this._m.numberOfBarkBands || 24, this._m.spn = this._m.audioContext.createScriptProcessor(this._m.bufferSize, this._m.inputs, this._m.outputs), this._m.spn.connect(this._m.audioContext.destination), this._m._featuresToExtract = _.featureExtractors || [], this._m.barkScale = N(this._m.bufferSize, this._m.sampleRate, this._m.bufferSize), this._m.melFilterBank = Xe(Math.max(this._m.melBands, this._m.numberOfMFCCCoefficients), this._m.sampleRate, this._m.bufferSize), this._m.inputData = null, this._m.previousInputData = null, this._m.frame = null, this._m.previousFrame = null, this.setSource(_.source), this._m.spn.onaudioprocess = function(re) {
              var pe;
              C._m.inputData !== null && (C._m.previousInputData = C._m.inputData), C._m.inputData = re.inputBuffer.getChannelData(C._m.channel), C._m.previousInputData ? ((pe = new Float32Array(C._m.previousInputData.length + C._m.inputData.length - C._m.hopSize)).set(C._m.previousInputData.slice(C._m.hopSize)), pe.set(C._m.inputData, C._m.previousInputData.length - C._m.hopSize)) : pe = C._m.inputData;
              var Fe = (function(Be, Ae, xe) {
                if (Be.length < Ae) throw new Error("Buffer is too short for frame length");
                if (xe < 1) throw new Error("Hop length cannot be less that 1");
                if (Ae < 1) throw new Error("Frame length cannot be less that 1");
                var Pe = 1 + Math.floor((Be.length - Ae) / xe);
                return new Array(Pe).fill(0).map((function(vt, De) {
                  return Be.slice(De * xe, De * xe + Ae);
                }));
              })(pe, C._m.bufferSize, C._m.hopSize);
              Fe.forEach((function(Be) {
                C._m.frame = Be;
                var Ae = C._m.extract(C._m._featuresToExtract, C._m.frame, C._m.previousFrame);
                typeof C._m.callback == "function" && C._m.EXTRACTION_STARTED && C._m.callback(Ae), C._m.previousFrame = C._m.frame;
              }));
            };
          }
          return R.prototype.start = function(_) {
            this._m._featuresToExtract = _ || this._m._featuresToExtract, this._m.EXTRACTION_STARTED = !0;
          }, R.prototype.stop = function() {
            this._m.EXTRACTION_STARTED = !1;
          }, R.prototype.setSource = function(_) {
            this._m.source && this._m.source.disconnect(this._m.spn), this._m.source = _, this._m.source.connect(this._m.spn);
          }, R.prototype.setChannel = function(_) {
            _ <= this._m.inputs ? this._m.channel = _ : console.error("Channel ".concat(_, " does not exist. Make sure you've provided a value for 'inputs' that is greater than ").concat(_, " when instantiating the MeydaAnalyzer"));
          }, R.prototype.get = function(_) {
            return this._m.inputData ? this._m.extract(_ || this._m._featuresToExtract, this._m.inputData, this._m.previousInputData) : null;
          }, R;
        })(), Tr = { audioContext: null, spn: null, bufferSize: 512, sampleRate: 44100, melBands: 26, chromaBands: 12, callback: null, windowingFunction: "hanning", featureExtractors: at, EXTRACTION_STARTED: !1, numberOfMFCCCoefficients: 13, numberOfBarkBands: 24, _featuresToExtract: [], windowing: H, _errors: { notPow2: new Error("Meyda: Buffer size must be a power of 2, e.g. 64 or 512"), featureUndef: new Error("Meyda: No features defined."), invalidFeatureFmt: new Error("Meyda: Invalid feature format"), invalidInput: new Error("Meyda: Invalid input."), noAC: new Error("Meyda: No AudioContext specified."), noSource: new Error("Meyda: No source node specified.") }, createMeydaAnalyzer: function(R) {
          return new Gn(R, Object.assign({}, Tr));
        }, listAvailableFeatureExtractors: function() {
          return Object.keys(this.featureExtractors);
        }, extract: function(R, _, j) {
          var C = this;
          if (!_) throw this._errors.invalidInput;
          if (typeof _ != "object") throw this._errors.invalidInput;
          if (!R) throw this._errors.featureUndef;
          if (!b(_.length)) throw this._errors.notPow2;
          this.barkScale !== void 0 && this.barkScale.length == this.bufferSize || (this.barkScale = N(this.bufferSize, this.sampleRate, this.bufferSize)), this.melFilterBank !== void 0 && this.barkScale.length == this.bufferSize && this.melFilterBank.length == this.melBands || (this.melFilterBank = Xe(Math.max(this.melBands, this.numberOfMFCCCoefficients), this.sampleRate, this.bufferSize)), this.chromaFilterBank !== void 0 && this.chromaFilterBank.length == this.chromaBands || (this.chromaFilterBank = Se(this.chromaBands, this.sampleRate, this.bufferSize)), "buffer" in _ && _.buffer === void 0 ? this.signal = ee(_) : this.signal = _;
          var re = Sr(_, this.windowingFunction, this.bufferSize);
          if (this.signal = re.windowedSignal, this.complexSpectrum = re.complexSpectrum, this.ampSpectrum = re.ampSpectrum, j) {
            var pe = Sr(j, this.windowingFunction, this.bufferSize);
            this.previousSignal = pe.windowedSignal, this.previousComplexSpectrum = pe.complexSpectrum, this.previousAmpSpectrum = pe.ampSpectrum;
          }
          var Fe = function(Be) {
            return C.featureExtractors[Be]({ ampSpectrum: C.ampSpectrum, chromaFilterBank: C.chromaFilterBank, complexSpectrum: C.complexSpectrum, signal: C.signal, bufferSize: C.bufferSize, sampleRate: C.sampleRate, barkScale: C.barkScale, melFilterBank: C.melFilterBank, previousSignal: C.previousSignal, previousAmpSpectrum: C.previousAmpSpectrum, previousComplexSpectrum: C.previousComplexSpectrum, numberOfMFCCCoefficients: C.numberOfMFCCCoefficients, numberOfBarkBands: C.numberOfBarkBands });
          };
          if (typeof R == "object") return R.reduce((function(Be, Ae) {
            var xe;
            return Object.assign({}, Be, ((xe = {})[Ae] = Fe(Ae), xe));
          }), {});
          if (typeof R == "string") return Fe(R);
          throw this._errors.invalidFeatureFmt;
        } }, Sr = function(R, _, j) {
          var C = {};
          R.buffer === void 0 ? C.signal = ee(R) : C.signal = R, C.windowedSignal = H(C.signal, _), C.complexSpectrum = Fn(C.windowedSignal), C.ampSpectrum = new Float32Array(j / 2);
          for (var re = 0; re < j / 2; re++) C.ampSpectrum[re] = Math.sqrt(Math.pow(C.complexSpectrum.real[re], 2) + Math.pow(C.complexSpectrum.imag[re], 2));
          return C;
        };
        return typeof window < "u" && (window.Meyda = Tr), Tr;
      }));
    })(Rn)), Rn.exports;
  }
  var Uc = $c();
  const zc = /* @__PURE__ */ Ba(Uc);
  class jc {
    constructor({
      numBins: n = 4,
      cutoff: y = 2,
      smooth: p = 0.4,
      max: w = 15,
      scale: b = 10,
      isDrawing: H = !1,
      parentEl: N = document.body
    }) {
      this.vol = 0, this.scale = b, this.max = w, this.cutoff = y, this.smooth = p, this.setBins(n), this.beat = {
        holdFrames: 20,
        threshold: 40,
        _cutoff: 0,
        // adaptive based on sound state
        decay: 0.98,
        _framesSinceBeat: 0
        // keeps track of frames
      }, this.onBeat = () => {
      }, this.canvas = document.createElement("canvas"), this.canvas.width = 100, this.canvas.height = 80, this.canvas.style.width = "100px", this.canvas.style.height = "80px", this.canvas.style.position = "absolute", this.canvas.style.right = "0px", this.canvas.style.bottom = "0px", N.appendChild(this.canvas), this.isDrawing = H, this.ctx = this.canvas.getContext("2d"), this.ctx.fillStyle = "#DFFFFF", this.ctx.strokeStyle = "#0ff", this.ctx.lineWidth = 0.5, window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia({ video: !1, audio: !0 }).then((ee) => {
        this.stream = ee, this.context = new AudioContext();
        let ce = this.context.createMediaStreamSource(ee);
        this.meyda = zc.createMeydaAnalyzer({
          audioContext: this.context,
          source: ce,
          featureExtractors: [
            "loudness"
            //  'perceptualSpread',
            //  'perceptualSharpness',
            //  'spectralCentroid'
          ]
        });
      }).catch((ee) => console.log("ERROR", ee));
    }
    detectBeat(n) {
      n > this.beat._cutoff && n > this.beat.threshold ? (this.onBeat(), this.beat._cutoff = n * 1.2, this.beat._framesSinceBeat = 0) : this.beat._framesSinceBeat <= this.beat.holdFrames ? this.beat._framesSinceBeat++ : (this.beat._cutoff *= this.beat.decay, this.beat._cutoff = Math.max(this.beat._cutoff, this.beat.threshold));
    }
    tick() {
      if (this.meyda) {
        var n = this.meyda.get();
        if (n && n !== null) {
          this.vol = n.loudness.total, this.detectBeat(this.vol);
          const y = (w, b) => w + b;
          let p = Math.floor(n.loudness.specific.length / this.bins.length);
          this.prevBins = this.bins.slice(0), this.bins = this.bins.map((w, b) => n.loudness.specific.slice(b * p, (b + 1) * p).reduce(y)).map((w, b) => w * (1 - this.settings[b].smooth) + this.prevBins[b] * this.settings[b].smooth), this.fft = this.bins.map((w, b) => (
            // Math.max(0, (bin - this.cutoff) / (this.max - this.cutoff))
            Math.max(0, (w - this.settings[b].cutoff) / this.settings[b].scale)
          )), this.isDrawing && this.draw();
        }
      }
    }
    setCutoff(n) {
      this.cutoff = n, this.settings = this.settings.map((y) => (y.cutoff = n, y));
    }
    setSmooth(n) {
      this.smooth = n, this.settings = this.settings.map((y) => (y.smooth = n, y));
    }
    setBins(n) {
      this.bins = Array(n).fill(0), this.prevBins = Array(n).fill(0), this.fft = Array(n).fill(0), this.settings = Array(n).fill(0).map(() => ({
        cutoff: this.cutoff,
        scale: this.scale,
        smooth: this.smooth
      })), this.bins.forEach((y, p) => {
        window["a" + p] = (w = 1, b = 0) => () => a.fft[p] * w + b;
      });
    }
    setScale(n) {
      this.scale = n, this.settings = this.settings.map((y) => (y.scale = n, y));
    }
    setMax(n) {
      this.max = n, console.log("set max is deprecated");
    }
    hide() {
      this.isDrawing = !1, this.canvas.style.display = "none";
    }
    show() {
      this.isDrawing = !0, this.canvas.style.display = "block";
    }
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var n = this.canvas.width / this.bins.length, y = this.canvas.height / (this.max * 2);
      this.bins.forEach((p, w) => {
        var b = p * y;
        this.ctx.fillRect(w * n, this.canvas.height - b, n, b);
        var H = this.canvas.height - y * this.settings[w].cutoff;
        this.ctx.beginPath(), this.ctx.moveTo(w * n, H), this.ctx.lineTo((w + 1) * n, H), this.ctx.stroke();
        var N = this.canvas.height - y * (this.settings[w].scale + this.settings[w].cutoff);
        this.ctx.beginPath(), this.ctx.moveTo(w * n, N), this.ctx.lineTo((w + 1) * n, N), this.ctx.stroke();
      });
    }
  }
  class Xc {
    constructor(n) {
      this.mediaSource = new MediaSource(), this.stream = n, this.output = document.createElement("video"), this.output.autoplay = !0, this.output.loop = !0;
      let y = this;
      this.mediaSource.addEventListener("sourceopen", () => {
        console.log("MediaSource opened"), y.sourceBuffer = y.mediaSource.addSourceBuffer('video/webm; codecs="vp8"'), console.log("Source buffer: ", sourceBuffer);
      });
    }
    start() {
      let n = { mimeType: "video/webm;codecs=vp9" };
      this.recordedBlobs = [];
      try {
        this.mediaRecorder = new MediaRecorder(this.stream, n);
      } catch (y) {
        console.log("Unable to create MediaRecorder with options Object: ", y);
        try {
          n = { mimeType: "video/webm,codecs=vp9" }, this.mediaRecorder = new MediaRecorder(this.stream, n);
        } catch (p) {
          console.log("Unable to create MediaRecorder with options Object: ", p);
          try {
            n = "video/vp8", this.mediaRecorder = new MediaRecorder(this.stream, n);
          } catch (w) {
            alert(`MediaRecorder is not supported by this browser.

Try Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags.`), console.error("Exception while creating MediaRecorder:", w);
            return;
          }
        }
      }
      console.log("Created MediaRecorder", this.mediaRecorder, "with options", n), this.mediaRecorder.onstop = this._handleStop.bind(this), this.mediaRecorder.ondataavailable = this._handleDataAvailable.bind(this), this.mediaRecorder.start(100), console.log("MediaRecorder started", this.mediaRecorder);
    }
    stop() {
      this.mediaRecorder.stop();
    }
    _handleStop() {
      const n = new Blob(this.recordedBlobs, { type: this.mediaRecorder.mimeType }), y = window.URL.createObjectURL(n);
      this.output.src = y;
      const p = document.createElement("a");
      p.style.display = "none", p.href = y;
      let w = /* @__PURE__ */ new Date();
      p.download = `hydra-${w.getFullYear()}-${w.getMonth() + 1}-${w.getDate()}-${w.getHours()}.${w.getMinutes()}.${w.getSeconds()}.webm`, document.body.appendChild(p), p.click(), setTimeout(() => {
        document.body.removeChild(p), window.URL.revokeObjectURL(y);
      }, 300);
    }
    _handleDataAvailable(n) {
      n.data && n.data.size > 0 && this.recordedBlobs.push(n.data);
    }
  }
  const Ga = {
    // no easing, no acceleration
    linear: function(c) {
      return c;
    },
    // accelerating from zero velocity
    easeInQuad: function(c) {
      return c * c;
    },
    // decelerating to zero velocity
    easeOutQuad: function(c) {
      return c * (2 - c);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function(c) {
      return c < 0.5 ? 2 * c * c : -1 + (4 - 2 * c) * c;
    },
    // accelerating from zero velocity
    easeInCubic: function(c) {
      return c * c * c;
    },
    // decelerating to zero velocity
    easeOutCubic: function(c) {
      return --c * c * c + 1;
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function(c) {
      return c < 0.5 ? 4 * c * c * c : (c - 1) * (2 * c - 2) * (2 * c - 2) + 1;
    },
    // accelerating from zero velocity
    easeInQuart: function(c) {
      return c * c * c * c;
    },
    // decelerating to zero velocity
    easeOutQuart: function(c) {
      return 1 - --c * c * c * c;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function(c) {
      return c < 0.5 ? 8 * c * c * c * c : 1 - 8 * --c * c * c * c;
    },
    // accelerating from zero velocity
    easeInQuint: function(c) {
      return c * c * c * c * c;
    },
    // decelerating to zero velocity
    easeOutQuint: function(c) {
      return 1 + --c * c * c * c * c;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function(c) {
      return c < 0.5 ? 16 * c * c * c * c * c : 1 + 16 * --c * c * c * c * c;
    },
    // sin shape
    sin: function(c) {
      return (1 + Math.sin(Math.PI * c - Math.PI / 2)) / 2;
    }
  };
  var Vc = (c, n, y, p, w) => (c - n) * (w - p) / (y - n) + p, Ma = (c, n) => (c % n + n) % n;
  const Zo = {
    init: () => {
      Array.prototype.fast = function(c = 1) {
        return this._speed = c, this;
      }, Array.prototype.smooth = function(c = 1) {
        return this._smooth = c, this;
      }, Array.prototype.ease = function(c = "linear") {
        return typeof c == "function" ? (this._smooth = 1, this._ease = c) : Ga[c] && (this._smooth = 1, this._ease = Ga[c]), this;
      }, Array.prototype.offset = function(c = 0.5) {
        return this._offset = c % 1, this;
      }, Array.prototype.fit = function(c = 0, n = 1) {
        let y = Math.min(...this), p = Math.max(...this);
        var w = this.map((b) => Vc(b, y, p, c, n));
        return w._speed = this._speed, w._smooth = this._smooth, w._ease = this._ease, w;
      };
    },
    getValue: (c = []) => ({ time: n, bpm: y }) => {
      let p = c._speed ? c._speed : 1, w = c._smooth ? c._smooth : 0, b = n * p * (y / 60) + (c._offset || 0);
      if (w !== 0) {
        let H = c._ease ? c._ease : Ga.linear, N = b - w / 2, ee = c[Math.floor(Ma(N, c.length))], ce = c[Math.floor(Ma(N + 1, c.length))], Xe = Math.min(Ma(N, 1) / w, 1);
        return H(Xe) * (ce - ee) + ee;
      } else
        return c[Math.floor(b % c.length)], c[Math.floor(b % c.length)];
    }
  }, Hc = (c) => {
    var n = "", y = w(n), p = (b, H) => {
      n += `
      var ${b} = ${H}
    `, y = w(n);
    };
    return {
      addToContext: p,
      eval: (b) => y.eval(b)
    };
    function w(b) {
      globalThis.eval(b);
      var H = function(N) {
        globalThis.eval(N);
      };
      return {
        eval: H
      };
    }
  };
  class Wc {
    constructor(n, y, p = []) {
      this.makeGlobal = y, this.sandbox = Hc(), this.parent = n;
      var w = Object.keys(n);
      w.forEach((b) => this.add(b)), this.userProps = p;
    }
    add(n) {
      this.makeGlobal && (window[n] = this.parent[n]);
    }
    // sets on window as well as synth object if global (not needed for objects, which can be set directly)
    set(n, y) {
      this.makeGlobal && (window[n] = y), this.parent[n] = y;
    }
    tick() {
      this.makeGlobal && this.userProps.forEach((n) => {
        this.parent[n] = window[n];
      });
    }
    eval(n) {
      this.sandbox.eval(n);
    }
  }
  const Yc = {
    float: {
      vec4: { name: "sum", args: [[1, 1, 1, 1]] },
      vec2: { name: "sum", args: [[1, 1]] }
    }
  }, ka = (c) => (c = c.toString(), c.indexOf(".") < 0 && (c += "."), c);
  function qc(c, n, y) {
    const p = c.transform.inputs, w = c.userArgs, { generators: b } = c.synth, { src: H } = b;
    return p.map((N, ee) => {
      const ce = {
        value: N.default,
        type: N.type,
        //
        isUniform: !1,
        name: N.name,
        vecLen: 0
        //  generateGlsl: null // function for creating glsl
      };
      if (ce.type === "float" && (ce.value = ka(N.default)), N.type.startsWith("vec"))
        try {
          ce.vecLen = Number.parseInt(N.type.substr(3));
        } catch {
          console.log(`Error determining length of vector input type ${N.type} (${N.name})`);
        }
      if (w.length > ee) {
        if (ce.value = w[ee], ce.type === "vec4" && !(ce.value.type === "GlslSource" || ce.value.getTexture))
          throw new Error("Arguments must be a texture or GlslSource");
        typeof w[ee] == "function" ? (ce.value = (Ie, We, Ye) => {
          try {
            const Je = w[ee](We);
            return typeof Je == "number" ? Je : (console.warn("function does not return a number", w[ee]), N.default);
          } catch (Je) {
            return console.warn("ERROR", Je), N.default;
          }
        }, ce.isUniform = !0) : w[ee].constructor === Array && (ce.value = (Ie, We, Ye) => Zo.getValue(w[ee])(We), ce.isUniform = !0);
      }
      if (!(n < 0)) {
        if (ce.value && ce.value.transforms) {
          const Ie = ce.value.transforms[ce.value.transforms.length - 1];
          if (Ie.transform.glsl_return_type !== N.type) {
            const We = Yc[N.type];
            if (typeof We < "u") {
              const Ye = We[Ie.transform.glsl_return_type];
              if (typeof Ye < "u") {
                const { name: Je, args: Pt } = Ye;
                ce.value = ce.value[Je](...Pt);
              }
            }
          }
          ce.isUniform = !1;
        } else if (ce.type === "float" && typeof ce.value == "number")
          ce.value = ka(ce.value);
        else if (ce.type.startsWith("vec") && typeof ce.value == "object" && Array.isArray(ce.value))
          ce.isUniform = !1, ce.value = `${ce.type}(${ce.value.map(ka).join(", ")})`;
        else if (N.type === "sampler2D") {
          var Xe = ce.value;
          ce.value = () => Xe.getTexture(), ce.isUniform = !0;
        } else if (ce.value.getTexture && N.type === "vec4") {
          var Se = ce.value;
          ce.value = H(Se), ce.isUniform = !1;
        }
        ce.isUniform && (ce.name += n);
      }
      return ce;
    });
  }
  function Kc(c) {
    var n = {
      uniforms: [],
      // list of uniforms used in shader
      glslFunctions: [],
      // list of functions used in shader
      fragColor: ""
    }, y = Jo(c, n)("c", "st");
    n.fragColor = y;
    let p = {};
    return n.uniforms.forEach((w) => p[w.name] = w), n.uniforms = Object.values(p), n;
  }
  function Ia(c, n) {
    return `${c}_i${n}`;
  }
  function Jo(c, n) {
    var y = (p, w) => "";
    return c.forEach((p, w) => {
      let b = qc(p, n.uniforms.length);
      b.forEach((N) => {
        N.isUniform && n.uniforms.push(N);
      }), Qc(p, n.glslFunctions) || n.glslFunctions.push(p);
      var H = y;
      p.transform.type === "src" ? y = (N, ee) => `${Wr(b, n)(`${N}${w}`, ee)}
         vec4 ${N} = ${Yr(`${N}${w}`, ee, p.name, b)};` : p.transform.type === "color" ? y = (N, ee) => `${Wr(b, n)(`${N}${w}`, ee)}
         ${H(N, ee)}
         ${N} = ${Yr(`${N}${w}`, `${N}`, p.name, b)};` : p.transform.type === "coord" ? y = (N, ee) => `${Wr(b, n)(`${N}${w}`, ee)}
         ${ee} = ${Yr(`${N}${w}`, `${ee}`, p.name, b)};
         ${H(N, ee)}` : p.transform.type === "combine" ? y = (N, ee) => (
        // combining two generated shader strings (i.e. for blend, mult, add funtions)
        `${Wr(b, n)(`${N}${w}`, ee)}
         ${H(N, ee)}
         ${N} = ${Yr(`${N}${w}`, `${N}`, p.name, b)};`
      ) : p.transform.type === "combineCoord" && (y = (N, ee) => `${Wr(b, n)(`${N}${w}`, ee)}
         ${ee} = ${Yr(`${N}${w}`, `${ee}`, p.name, b)};
         ${H(N, ee)}`);
    }), y;
  }
  function Wr(c, n) {
    let y = (w, b) => "";
    var p = y;
    return c.forEach((w, b) => {
      w.value.transforms && (p = y, y = (H, N) => {
        let ee = Ia(H, b), ce = Ia(`${N}_${H}`, b);
        return `vec2 ${ce} = ${N};${p(H, N)}
         ${Jo(w.value.transforms, n)(ee, ce)}`;
      });
    }), y;
  }
  function Yr(c, n, y, p) {
    const w = p.map((b, H) => b.isUniform ? b.name : b.value && b.value.transforms ? Ia(c, H) : b.value).reduce((b, H) => `${b}, ${H}`, "");
    return `${y}(${n}${w})`;
  }
  function Qc(c, n) {
    for (var y = 0; y < n.length; y++)
      if (c.name == n[y].name) return !0;
    return !1;
  }
  const Zc = {
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
  var qr = function(c) {
    return this.transforms = [], this.transforms.push(c), this.defaultOutput = c.defaultOutput, this.synth = c.synth, this.type = "GlslSource", this.defaultUniforms = c.defaultUniforms, this;
  };
  qr.prototype.addTransform = function(c) {
    this.transforms.push(c);
  };
  qr.prototype.out = function(c) {
    var n = c || this.defaultOutput;
    if (n) try {
      var y = this.glsl(n);
      this.synth.currentFunctions = [], n.render(y);
    } catch (p) {
      console.warn("shader could not compile", p);
    }
  };
  qr.prototype.glsl = function() {
    var c = [], n = [];
    return this.transforms.forEach((y) => {
      y.transform.type === "renderpass" ? console.warn("no support for renderpass") : n.push(y);
    }), n.length > 0 && c.push(this.compile(n)), c;
  };
  qr.prototype.compile = function(c) {
    var n = Kc(c, this.synth), y = {};
    n.uniforms.forEach((b) => {
      y[b.name] = b.value;
    });
    const p = el(n.glslFunctions);
    p.renames.forEach(({ shaderName: b, oldName: H, newName: N }) => {
      const ee = n.glslFunctions.find((ce) => ce.name === b);
      if (ee && ee.transform) {
        const ce = new RegExp(`\\b${H}\\b`, "g");
        ee.transform.glsl = ee.transform.glsl.replace(ce, N);
      }
    });
    var w = `#version 300 es
  precision ${this.defaultOutput.precision} float;
  ${Object.values(n.uniforms).map((b) => {
      let H = b.type;
      return b.type === "texture" && (H = "sampler2D"), `
      uniform ${H} ${b.name};`;
    }).join("")}
  uniform float time;
  uniform vec2 resolution;
  in vec2 uv;
  out vec4 fragColor;
  uniform sampler2D prevBuffer;

  ${Object.values(Zc).map((b) => `
            ${b.glsl}
          `).join("")}

  ${p.helpers}

  ${n.glslFunctions.map((b) => `
            ${b.transform.glsl}
          `).join("")}

  void main () {
    vec2 st = gl_FragCoord.xy/resolution.xy;

    ${n.fragColor}
    fragColor = c;
  }
  `;
    return {
      frag: w,
      uniforms: Object.assign({}, this.defaultUniforms, y)
    };
  };
  function Jc(c) {
    const n = [];
    if (!c || typeof c != "string") return n;
    const y = /^\s*#define\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+(.*)$/gm;
    let p;
    for (; (p = y.exec(c)) !== null; )
      n.push({
        type: "define",
        name: p[1],
        value: p[2].trim(),
        fullCode: p[0].trim()
      });
    const w = /\b(const\s+)?(float|int|vec2|vec3|vec4|mat2|mat3|mat4|bool)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^;]+);/g;
    for (; (p = w.exec(c)) !== null; )
      n.push({
        type: "var",
        isConst: !!p[1],
        dataType: p[2],
        name: p[3],
        value: p[4].trim(),
        fullCode: p[0].trim()
      });
    const b = /\b(void|float|int|vec2|vec3|vec4|mat2|mat3|mat4|bool|sampler2D)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*\{/g;
    for (; (p = b.exec(c)) !== null; ) {
      const H = p[1], N = p[2], ee = p[3], ce = p.index, Xe = p.index + p[0].length;
      let Se = 1, Ie = Xe;
      for (; Ie < c.length && Se > 0; )
        c[Ie] === "{" ? Se++ : c[Ie] === "}" && Se--, Ie++;
      const We = c.substring(Xe, Ie - 1), Ye = c.substring(ce, Ie), Je = `${H} ${N}(${ee})`;
      n.push({
        type: "function",
        name: N,
        returnType: H,
        params: ee,
        signature: Je,
        body: We.trim(),
        fullCode: Ye
      });
    }
    return n;
  }
  function el(c) {
    const n = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Set(), p = [], w = [];
    return c.forEach((b) => {
      if (!b.transform.helpers) return;
      const H = b.name;
      Jc(b.transform.helpers).forEach((ee) => {
        const ce = n.get(ee.name);
        if (!ce)
          n.set(ee.name, ee), y.add(ee.name), w.push(ee.fullCode);
        else {
          let Xe = !1;
          if (ce.type === ee.type && (ee.type === "define" ? Xe = ce.value === ee.value : ee.type === "var" ? Xe = ce.value === ee.value && ce.dataType === ee.dataType : ee.type === "function" && (Xe = ce.signature === ee.signature && ce.body === ee.body)), Xe)
            return;
          {
            let Se = `${H}_${ee.name}`, Ie = 1;
            for (; y.has(Se); )
              Se = `${H}_${ee.name}_${Ie}`, Ie++;
            let We = ee.fullCode;
            ee.type === "define" ? We = ee.fullCode.replace(
              new RegExp(`(#define\\s+)${ee.name}(\\s+)`),
              `$1${Se}$2`
            ) : ee.type === "var" ? We = ee.fullCode.replace(
              new RegExp(`\\b${ee.name}\\b(\\s*=)`),
              `${Se}$1`
            ) : ee.type === "function" && (We = ee.fullCode.replace(
              new RegExp(`\\b${ee.name}\\b`),
              Se
            )), n.set(Se, Object.assign({}, ee, { name: Se, fullCode: We })), y.add(Se), w.push(We), p.push({
              shaderName: H,
              oldName: ee.name,
              newName: Se
            });
          }
        }
      });
    }), {
      helpers: w.join(`

`),
      renames: p
    };
  }
  const tl = () => [
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
  function Wo(c) {
    if (!c || typeof c != "string")
      return c;
    let n = c;
    return n = n.replace(/\btexture2D\s*\(/g, "texture("), n = n.replace(/\btexture2DLod\s*\(/g, "textureLod("), n = n.replace(/\btexture2DProj\s*\(/g, "textureProj("), n = n.replace(/\btextureCube\s*\(/g, "texture("), n = n.replace(/\btextureCubeLod\s*\(/g, "textureLod("), n = n.replace(/\bshadow2D\s*\(/g, "texture("), n = n.replace(/\bshadow2DProj\s*\(/g, "textureProj("), n;
  }
  function Yo(c) {
    return !c || typeof c != "string" ? !1 : [
      /\btexture2D\s*\(/,
      /\btexture2DLod\s*\(/,
      /\btexture2DProj\s*\(/,
      /\btextureCube\s*\(/,
      /\btextureCubeLod\s*\(/,
      /\bshadow2D\s*\(/,
      /\bshadow2DProj\s*\(/
    ].some((y) => y.test(c));
  }
  class rl {
    constructor({
      defaultUniforms: n,
      defaultOutput: y,
      extendTransforms: p = [],
      changeListener: w = (() => {
      })
    } = {}) {
      this.defaultOutput = y, this.defaultUniforms = n, this.changeListener = w, this.extendTransforms = p, this.generators = {}, this.init();
    }
    init() {
      const n = tl();
      return this.glslTransforms = {}, this.generators = Object.entries(this.generators).reduce((y, [p, w]) => (this.changeListener({ type: "remove", synth: this, method: p }), y), {}), this.sourceClass = class extends qr {
      }, Array.isArray(this.extendTransforms) ? n.concat(this.extendTransforms) : typeof this.extendTransforms == "object" && this.extendTransforms.type && n.push(this.extendTransforms), n.map((y) => this.setFunction(y));
    }
    _addMethod(n, y) {
      const p = this;
      if (this.glslTransforms[n] = y, y.type === "src") {
        const w = (...b) => new this.sourceClass({
          name: n,
          transform: y,
          userArgs: b,
          defaultOutput: this.defaultOutput,
          defaultUniforms: this.defaultUniforms,
          synth: p
        });
        return this.generators[n] = w, this.changeListener({ type: "add", synth: this, method: n }), w;
      } else
        this.sourceClass.prototype[n] = function(...w) {
          return this.transforms.push({ name: n, transform: y, userArgs: w, synth: p }), this;
        };
    }
    setFunction(n) {
      var y = nl(n);
      y && this._addMethod(n.name, y);
    }
  }
  const qo = {
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
  function nl(c) {
    let n = qo[c.type];
    if (n) {
      let y = n.args.concat(c.inputs), p = y.map((N) => `${N.type} ${N.name}`).join(", "), w = c.glsl3 || c.glsl;
      !c.glsl3 && Yo(w) && (w = Wo(w));
      let b = "";
      c.helpers && (b = c.helpers, Yo(b) && (b = Wo(b)));
      let H = `
  ${n.returnType} ${c.name}(${p}) {
      ${w}
  }
`;
      return c.inputs = y.slice(1), Object.assign({}, c, { glsl: H, helpers: b });
    } else
      console.warn(`type ${c.type} not recognized`, c, qo);
  }
  var On = { exports: {} }, al = On.exports, Ko;
  function il() {
    return Ko || (Ko = 1, (function(c, n) {
      (function(y, p) {
        c.exports = p();
      })(al, (function() {
        var y = function(e) {
          return e instanceof Uint8Array || e instanceof Uint16Array || e instanceof Uint32Array || e instanceof Int8Array || e instanceof Int16Array || e instanceof Int32Array || e instanceof Float32Array || e instanceof Float64Array || e instanceof Uint8ClampedArray;
        }, p = function(e, r) {
          for (var l = Object.keys(r), G = 0; G < l.length; ++G)
            e[l[G]] = r[l[G]];
          return e;
        }, w = `
`;
        function b(e) {
          return typeof atob < "u" ? atob(e) : "base64:" + e;
        }
        function H(e) {
          var r = new Error("(regl) " + e);
          throw console.error(r), r;
        }
        function N(e, r) {
          e || H(r);
        }
        function ee(e) {
          return e ? ": " + e : "";
        }
        function ce(e, r, l) {
          e in r || H("unknown parameter (" + e + ")" + ee(l) + ". possible values: " + Object.keys(r).join());
        }
        function Xe(e, r) {
          y(e) || H(
            "invalid parameter type" + ee(r) + ". must be a typed array"
          );
        }
        function Se(e, r) {
          switch (r) {
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
        function Ie(e, r, l) {
          Se(e, r) || H(
            "invalid parameter type" + ee(l) + ". expected " + r + ", got " + typeof e
          );
        }
        function We(e, r) {
          e >= 0 && (e | 0) === e || H("invalid parameter type, (" + e + ")" + ee(r) + ". must be a nonnegative integer");
        }
        function Ye(e, r, l) {
          r.indexOf(e) < 0 && H("invalid value" + ee(l) + ". must be one of: " + r);
        }
        var Je = [
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
        function Pt(e) {
          Object.keys(e).forEach(function(r) {
            Je.indexOf(r) < 0 && H('invalid regl constructor argument "' + r + '". must be one of ' + Je);
          });
        }
        function pt(e, r) {
          for (e = e + ""; e.length < r; )
            e = " " + e;
          return e;
        }
        function Ue() {
          this.name = "unknown", this.lines = [], this.index = {}, this.hasErrors = !1;
        }
        function at(e, r) {
          this.number = e, this.line = r, this.errors = [];
        }
        function Yt(e, r, l) {
          this.file = e, this.line = r, this.message = l;
        }
        function gt() {
          var e = new Error(), r = (e.stack || e).toString(), l = /compileProcedure.*\n\s*at.*\((.*)\)/.exec(r);
          if (l)
            return l[1];
          var G = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(r);
          return G ? G[1] : "unknown";
        }
        function fr() {
          var e = new Error(), r = (e.stack || e).toString(), l = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(r);
          if (l)
            return l[1];
          var G = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(r);
          return G ? G[1] : "unknown";
        }
        function It(e, r) {
          var l = e.split(`
`), G = 1, P = 0, F = {
            unknown: new Ue(),
            0: new Ue()
          };
          F.unknown.name = F[0].name = r || gt(), F.unknown.lines.push(new at(0, ""));
          for (var k = 0; k < l.length; ++k) {
            var W = l[k], q = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(W);
            if (q)
              switch (q[1]) {
                case "line":
                  var J = /(\d+)(\s+\d+)?/.exec(q[2]);
                  J && (G = J[1] | 0, J[2] && (P = J[2] | 0, P in F || (F[P] = new Ue())));
                  break;
                case "define":
                  var K = /SHADER_NAME(_B64)?\s+(.*)$/.exec(q[2]);
                  K && (F[P].name = K[1] ? b(K[2]) : K[2]);
                  break;
              }
            F[P].lines.push(new at(G++, W));
          }
          return Object.keys(F).forEach(function(ne) {
            var se = F[ne];
            se.lines.forEach(function(Y) {
              se.index[Y.number] = Y;
            });
          }), F;
        }
        function Cn(e) {
          var r = [];
          return e.split(`
`).forEach(function(l) {
            if (!(l.length < 5)) {
              var G = /^ERROR:\s+(\d+):(\d+):\s*(.*)$/.exec(l);
              G ? r.push(new Yt(
                G[1] | 0,
                G[2] | 0,
                G[3].trim()
              )) : l.length > 0 && r.push(new Yt("unknown", 0, l));
            }
          }), r;
        }
        function Fn(e, r) {
          r.forEach(function(l) {
            var G = e[l.file];
            if (G) {
              var P = G.index[l.line];
              if (P) {
                P.errors.push(l), G.hasErrors = !0;
                return;
              }
            }
            e.unknown.hasErrors = !0, e.unknown.lines[0].errors.push(l);
          });
        }
        function Gn(e, r, l, G, P) {
          if (!e.getShaderParameter(r, e.COMPILE_STATUS)) {
            var F = e.getShaderInfoLog(r), k = G === e.FRAGMENT_SHADER ? "fragment" : "vertex";
            re(l, "string", k + " shader source must be a string", P);
            var W = It(l, P), q = Cn(F);
            Fn(W, q), Object.keys(W).forEach(function(J) {
              var K = W[J];
              if (!K.hasErrors)
                return;
              var ne = [""], se = [""];
              function Y(ae, T) {
                ne.push(ae), se.push(T || "");
              }
              Y("file number " + J + ": " + K.name + `
`, "color:red;text-decoration:underline;font-weight:bold"), K.lines.forEach(function(ae) {
                if (ae.errors.length > 0) {
                  Y(pt(ae.number, 4) + "|  ", "background-color:yellow; font-weight:bold"), Y(ae.line + w, "color:red; background-color:yellow; font-weight:bold");
                  var T = 0;
                  ae.errors.forEach(function(I) {
                    var Z = I.message, ue = /^\s*'(.*)'\s*:\s*(.*)$/.exec(Z);
                    if (ue) {
                      var z = ue[1];
                      Z = ue[2], z === "assign" && (z = "="), T = Math.max(ae.line.indexOf(z, T), 0);
                    } else
                      T = 0;
                    Y(pt("| ", 6)), Y(pt("^^^", T + 3) + w, "font-weight:bold"), Y(pt("| ", 6)), Y(Z + w, "font-weight:bold");
                  }), Y(pt("| ", 6) + w);
                } else
                  Y(pt(ae.number, 4) + "|  "), Y(ae.line + w, "color:red");
              }), typeof document < "u" && !window.chrome ? (se[0] = ne.join("%c"), console.log.apply(console, se)) : console.log(ne.join(""));
            }), N.raise("Error compiling " + k + " shader, " + W[0].name);
          }
        }
        function Tr(e, r, l, G, P) {
          if (!e.getProgramParameter(r, e.LINK_STATUS)) {
            var F = e.getProgramInfoLog(r), k = It(l, P), W = It(G, P), q = 'Error linking program with vertex shader, "' + W[0].name + '", and fragment shader "' + k[0].name + '"';
            typeof document < "u" ? console.log(
              "%c" + q + w + "%c" + F,
              "color:red;text-decoration:underline;font-weight:bold",
              "color:red"
            ) : console.log(q + w + F), N.raise(q);
          }
        }
        function Sr(e) {
          e._commandRef = gt();
        }
        function R(e, r, l, G) {
          Sr(e);
          function P(q) {
            return q ? G.id(q) : 0;
          }
          e._fragId = P(e.static.frag), e._vertId = P(e.static.vert);
          function F(q, J) {
            Object.keys(J).forEach(function(K) {
              q[G.id(K)] = !0;
            });
          }
          var k = e._uniformSet = {};
          F(k, r.static), F(k, r.dynamic);
          var W = e._attributeSet = {};
          F(W, l.static), F(W, l.dynamic), e._hasCount = "count" in e.static || "count" in e.dynamic || "elements" in e.static || "elements" in e.dynamic;
        }
        function _(e, r) {
          var l = fr();
          H(e + " in command " + (r || gt()) + (l === "unknown" ? "" : " called from " + l));
        }
        function j(e, r, l) {
          e || _(r, l || gt());
        }
        function C(e, r, l, G) {
          e in r || _(
            "unknown parameter (" + e + ")" + ee(l) + ". possible values: " + Object.keys(r).join(),
            G || gt()
          );
        }
        function re(e, r, l, G) {
          Se(e, r) || _(
            "invalid parameter type" + ee(l) + ". expected " + r + ", got " + typeof e,
            G || gt()
          );
        }
        function pe(e) {
          e();
        }
        function Fe(e, r, l) {
          e.texture ? Ye(
            e.texture._texture.internalformat,
            r,
            "unsupported texture format for attachment"
          ) : Ye(
            e.renderbuffer._renderbuffer.format,
            l,
            "unsupported renderbuffer format for attachment"
          );
        }
        var Be = 33071, Ae = 9728, xe = 9984, Pe = 9985, vt = 9986, De = 9987, Rt = 5120, wt = 5121, At = 5122, Lr = 5123, it = 5124, mt = 5125, yt = 5126, Ft = 32819, Na = 32820, Da = 33635, Pa = 34042, ts = 36193, Tt = {};
        Tt[Rt] = Tt[wt] = 1, Tt[At] = Tt[Lr] = Tt[ts] = Tt[Da] = Tt[Ft] = Tt[Na] = 2, Tt[it] = Tt[mt] = Tt[yt] = Tt[Pa] = 4;
        function $a(e, r) {
          return e === Na || e === Ft || e === Da ? 2 : e === Pa ? 4 : Tt[e] * r;
        }
        function Kr(e) {
          return !(e & e - 1) && !!e;
        }
        function rs(e, r, l) {
          var G, P = r.width, F = r.height, k = r.channels;
          N(
            P > 0 && P <= l.maxTextureSize && F > 0 && F <= l.maxTextureSize,
            "invalid texture shape"
          ), (e.wrapS !== Be || e.wrapT !== Be) && N(
            Kr(P) && Kr(F),
            "incompatible wrap mode for texture, both width and height must be power of 2"
          ), r.mipmask === 1 ? P !== 1 && F !== 1 && N(
            e.minFilter !== xe && e.minFilter !== vt && e.minFilter !== Pe && e.minFilter !== De,
            "min filter requires mipmap"
          ) : (N(
            Kr(P) && Kr(F),
            "texture must be a square power of 2 to support mipmapping"
          ), N(
            r.mipmask === (P << 1) - 1,
            "missing or incomplete mipmap data"
          )), r.type === yt && (l.extensions.indexOf("oes_texture_float_linear") < 0 && N(
            e.minFilter === Ae && e.magFilter === Ae,
            "filter not supported, must enable oes_texture_float_linear"
          ), N(
            !e.genMipmaps,
            "mipmap generation not supported with float textures"
          ));
          var W = r.images;
          for (G = 0; G < 16; ++G)
            if (W[G]) {
              var q = P >> G, J = F >> G;
              N(r.mipmask & 1 << G, "missing mipmap data");
              var K = W[G];
              if (N(
                K.width === q && K.height === J,
                "invalid shape for mip images"
              ), N(
                K.format === r.format && K.internalformat === r.internalformat && K.type === r.type,
                "incompatible type for mip image"
              ), !K.compressed) if (K.data) {
                var ne = Math.ceil($a(K.type, k) * q / K.unpackAlignment) * K.unpackAlignment;
                N(
                  K.data.byteLength === ne * J,
                  "invalid data for image, buffer size is inconsistent with image format"
                );
              } else K.element || K.copy;
            } else e.genMipmaps || N((r.mipmask & 1 << G) === 0, "extra mipmap data");
          r.compressed && N(
            !e.genMipmaps,
            "mipmap generation for compressed images not supported"
          );
        }
        function ns(e, r, l, G) {
          var P = e.width, F = e.height, k = e.channels;
          N(
            P > 0 && P <= G.maxTextureSize && F > 0 && F <= G.maxTextureSize,
            "invalid texture shape"
          ), N(
            P === F,
            "cube map must be square"
          ), N(
            r.wrapS === Be && r.wrapT === Be,
            "wrap mode not supported by cube map"
          );
          for (var W = 0; W < l.length; ++W) {
            var q = l[W];
            N(
              q.width === P && q.height === F,
              "inconsistent cube map face shape"
            ), r.genMipmaps && (N(
              !q.compressed,
              "can not generate mipmap for compressed textures"
            ), N(
              q.mipmask === 1,
              "can not specify mipmaps and generate mipmaps"
            ));
            for (var J = q.images, K = 0; K < 16; ++K) {
              var ne = J[K];
              if (ne) {
                var se = P >> K, Y = F >> K;
                N(q.mipmask & 1 << K, "missing mipmap data"), N(
                  ne.width === se && ne.height === Y,
                  "invalid shape for mip images"
                ), N(
                  ne.format === e.format && ne.internalformat === e.internalformat && ne.type === e.type,
                  "incompatible type for mip image"
                ), ne.compressed || (ne.data ? N(
                  ne.data.byteLength === se * Y * Math.max($a(ne.type, k), ne.unpackAlignment),
                  "invalid data for image, buffer size is inconsistent with image format"
                ) : ne.element || ne.copy);
              }
            }
          }
        }
        var f = p(N, {
          optional: pe,
          raise: H,
          commandRaise: _,
          command: j,
          parameter: ce,
          commandParameter: C,
          constructor: Pt,
          type: Ie,
          commandType: re,
          isTypedArray: Xe,
          nni: We,
          oneOf: Ye,
          shaderError: Gn,
          linkError: Tr,
          callSite: fr,
          saveCommandRef: Sr,
          saveDrawInfo: R,
          framebufferFormat: Fe,
          guessCommand: gt,
          texture2D: rs,
          textureCube: ns
        }), as = 0, is = 0, os = 5, ss = 6;
        function qt(e, r) {
          this.id = as++, this.type = e, this.data = r;
        }
        function Ua(e) {
          return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        }
        function Rr(e) {
          if (e.length === 0)
            return [];
          var r = e.charAt(0), l = e.charAt(e.length - 1);
          if (e.length > 1 && r === l && (r === '"' || r === "'"))
            return ['"' + Ua(e.substr(1, e.length - 2)) + '"'];
          var G = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(e);
          if (G)
            return Rr(e.substr(0, G.index)).concat(Rr(G[1])).concat(Rr(e.substr(G.index + G[0].length)));
          var P = e.split(".");
          if (P.length === 1)
            return ['"' + Ua(e) + '"'];
          for (var F = [], k = 0; k < P.length; ++k)
            F = F.concat(Rr(P[k]));
          return F;
        }
        function za(e) {
          return "[" + Rr(e).join("][") + "]";
        }
        function fs(e, r) {
          return new qt(e, za(r + ""));
        }
        function us(e) {
          return typeof e == "function" && !e._reglType || e instanceof qt;
        }
        function ja(e, r) {
          if (typeof e == "function")
            return new qt(is, e);
          if (typeof e == "number" || typeof e == "boolean")
            return new qt(os, e);
          if (Array.isArray(e))
            return new qt(ss, e.map((l, G) => ja(l, r + "[" + G + "]")));
          if (e instanceof qt)
            return e;
          f(!1, "invalid option type in uniform " + r);
        }
        var St = {
          DynamicVariable: qt,
          define: fs,
          isDynamic: us,
          unbox: ja,
          accessor: za
        }, Mn = {
          next: typeof requestAnimationFrame == "function" ? function(e) {
            return requestAnimationFrame(e);
          } : function(e) {
            return setTimeout(e, 16);
          },
          cancel: typeof cancelAnimationFrame == "function" ? function(e) {
            return cancelAnimationFrame(e);
          } : clearTimeout
        }, Xa = typeof performance < "u" && performance.now ? function() {
          return performance.now();
        } : function() {
          return +/* @__PURE__ */ new Date();
        };
        function cs() {
          var e = { "": 0 }, r = [""];
          return {
            id: function(l) {
              var G = e[l];
              return G || (G = e[l] = r.length, r.push(l), G);
            },
            str: function(l) {
              return r[l];
            }
          };
        }
        function ls(e, r, l) {
          var G = document.createElement("canvas");
          p(G.style, {
            border: 0,
            margin: 0,
            padding: 0,
            top: 0,
            left: 0
          }), e.appendChild(G), e === document.body && (G.style.position = "absolute", p(e.style, {
            margin: 0,
            padding: 0
          }));
          function P() {
            var W = window.innerWidth, q = window.innerHeight;
            if (e !== document.body) {
              var J = e.getBoundingClientRect();
              W = J.right - J.left, q = J.bottom - J.top;
            }
            G.width = l * W, G.height = l * q, p(G.style, {
              width: W + "px",
              height: q + "px"
            });
          }
          var F;
          e !== document.body && typeof ResizeObserver == "function" ? (F = new ResizeObserver(function() {
            setTimeout(P);
          }), F.observe(e)) : window.addEventListener("resize", P, !1);
          function k() {
            F ? F.disconnect() : window.removeEventListener("resize", P), e.removeChild(G);
          }
          return P(), {
            canvas: G,
            onDestroy: k
          };
        }
        function ds(e, r) {
          function l(G) {
            try {
              return e.getContext(G, r);
            } catch {
              return null;
            }
          }
          return l("webgl") || l("experimental-webgl") || l("webgl-experimental");
        }
        function hs(e) {
          return typeof e.nodeName == "string" && typeof e.appendChild == "function" && typeof e.getBoundingClientRect == "function";
        }
        function ms(e) {
          return typeof e.drawArrays == "function" || typeof e.drawElements == "function";
        }
        function Va(e) {
          return typeof e == "string" ? e.split() : (f(Array.isArray(e), "invalid extension array"), e);
        }
        function Ha(e) {
          return typeof e == "string" ? (f(typeof document < "u", "not supported outside of DOM"), document.querySelector(e)) : e;
        }
        function ps(e) {
          var r = e || {}, l, G, P, F, k = {}, W = [], q = [], J = typeof window > "u" ? 1 : window.devicePixelRatio, K = !1, ne = function(ae) {
            ae && f.raise(ae);
          }, se = function() {
          };
          if (typeof r == "string" ? (f(
            typeof document < "u",
            "selector queries only supported in DOM enviroments"
          ), l = document.querySelector(r), f(l, "invalid query string for element")) : typeof r == "object" ? hs(r) ? l = r : ms(r) ? (F = r, P = F.canvas) : (f.constructor(r), "gl" in r ? F = r.gl : "canvas" in r ? P = Ha(r.canvas) : "container" in r && (G = Ha(r.container)), "attributes" in r && (k = r.attributes, f.type(k, "object", "invalid context attributes")), "extensions" in r && (W = Va(r.extensions)), "optionalExtensions" in r && (q = Va(r.optionalExtensions)), "onDone" in r && (f.type(
            r.onDone,
            "function",
            "invalid or missing onDone callback"
          ), ne = r.onDone), "profile" in r && (K = !!r.profile), "pixelRatio" in r && (J = +r.pixelRatio, f(J > 0, "invalid pixel ratio"))) : f.raise("invalid arguments to regl"), l && (l.nodeName.toLowerCase() === "canvas" ? P = l : G = l), !F) {
            if (!P) {
              f(
                typeof document < "u",
                "must manually specify webgl context outside of DOM environments"
              );
              var Y = ls(G || document.body, ne, J);
              if (!Y)
                return null;
              P = Y.canvas, se = Y.onDestroy;
            }
            k.premultipliedAlpha === void 0 && (k.premultipliedAlpha = !0), F = ds(P, k);
          }
          return F ? {
            gl: F,
            canvas: P,
            container: G,
            extensions: W,
            optionalExtensions: q,
            pixelRatio: J,
            profile: K,
            onDone: ne,
            onDestroy: se
          } : (se(), ne("webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org"), null);
        }
        function vs(e, r) {
          var l = {};
          function G(k) {
            f.type(k, "string", "extension name must be string");
            var W = k.toLowerCase(), q;
            try {
              q = l[W] = e.getExtension(W);
            } catch {
            }
            return !!q;
          }
          for (var P = 0; P < r.extensions.length; ++P) {
            var F = r.extensions[P];
            if (!G(F))
              return r.onDestroy(), r.onDone('"' + F + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser'), null;
          }
          return r.optionalExtensions.forEach(G), {
            extensions: l,
            restore: function() {
              Object.keys(l).forEach(function(k) {
                if (l[k] && !G(k))
                  throw new Error("(regl): error restoring extension " + k);
              });
            }
          };
        }
        function Et(e, r) {
          for (var l = Array(e), G = 0; G < e; ++G)
            l[G] = r(G);
          return l;
        }
        var ys = 5120, _s = 5121, bs = 5122, gs = 5123, Es = 5124, xs = 5125, ws = 5126;
        function As(e) {
          for (var r = 16; r <= 1 << 28; r *= 16)
            if (e <= r)
              return r;
          return 0;
        }
        function Wa(e) {
          var r, l;
          return r = (e > 65535) << 4, e >>>= r, l = (e > 255) << 3, e >>>= l, r |= l, l = (e > 15) << 2, e >>>= l, r |= l, l = (e > 3) << 1, e >>>= l, r |= l, r | e >> 1;
        }
        function Ya() {
          var e = Et(8, function() {
            return [];
          });
          function r(F) {
            var k = As(F), W = e[Wa(k) >> 2];
            return W.length > 0 ? W.pop() : new ArrayBuffer(k);
          }
          function l(F) {
            e[Wa(F.byteLength) >> 2].push(F);
          }
          function G(F, k) {
            var W = null;
            switch (F) {
              case ys:
                W = new Int8Array(r(k), 0, k);
                break;
              case _s:
                W = new Uint8Array(r(k), 0, k);
                break;
              case bs:
                W = new Int16Array(r(2 * k), 0, k);
                break;
              case gs:
                W = new Uint16Array(r(2 * k), 0, k);
                break;
              case Es:
                W = new Int32Array(r(4 * k), 0, k);
                break;
              case xs:
                W = new Uint32Array(r(4 * k), 0, k);
                break;
              case ws:
                W = new Float32Array(r(4 * k), 0, k);
                break;
              default:
                return null;
            }
            return W.length !== k ? W.subarray(0, k) : W;
          }
          function P(F) {
            l(F.buffer);
          }
          return {
            alloc: r,
            free: l,
            allocType: G,
            freeType: P
          };
        }
        var et = Ya();
        et.zero = Ya();
        var Ts = 3408, Ss = 3410, Ls = 3411, Rs = 3412, Os = 3413, Cs = 3414, Fs = 3415, Gs = 33901, Ms = 33902, ks = 3379, Is = 3386, Bs = 34921, Ns = 36347, Ds = 36348, Ps = 35661, $s = 35660, Us = 34930, zs = 36349, js = 34076, Xs = 34024, Vs = 7936, Hs = 7937, Ws = 7938, Ys = 35724, qs = 34047, Ks = 36063, Qs = 34852, Qr = 3553, qa = 34067, Zs = 34069, Js = 33984, Or = 6408, kn = 5126, Ka = 5121, In = 36160, ef = 36053, tf = 36064, rf = 16384, nf = function(e, r) {
          var l = 1;
          r.ext_texture_filter_anisotropic && (l = e.getParameter(qs));
          var G = 1, P = 1;
          r.webgl_draw_buffers && (G = e.getParameter(Qs), P = e.getParameter(Ks));
          var F = !!r.oes_texture_float;
          if (F) {
            var k = e.createTexture();
            e.bindTexture(Qr, k), e.texImage2D(Qr, 0, Or, 1, 1, 0, Or, kn, null);
            var W = e.createFramebuffer();
            if (e.bindFramebuffer(In, W), e.framebufferTexture2D(In, tf, Qr, k, 0), e.bindTexture(Qr, null), e.checkFramebufferStatus(In) !== ef) F = !1;
            else {
              e.viewport(0, 0, 1, 1), e.clearColor(1, 0, 0, 1), e.clear(rf);
              var q = et.allocType(kn, 4);
              e.readPixels(0, 0, 1, 1, Or, kn, q), e.getError() ? F = !1 : (e.deleteFramebuffer(W), e.deleteTexture(k), F = q[0] === 1), et.freeType(q);
            }
          }
          var J = typeof navigator < "u" && (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion) || /Edge/.test(navigator.userAgent)), K = !0;
          if (!J) {
            var ne = e.createTexture(), se = et.allocType(Ka, 36);
            e.activeTexture(Js), e.bindTexture(qa, ne), e.texImage2D(Zs, 0, Or, 3, 3, 0, Or, Ka, se), et.freeType(se), e.bindTexture(qa, null), e.deleteTexture(ne), K = !e.getError();
          }
          return {
            // drawing buffer bit depth
            colorBits: [
              e.getParameter(Ss),
              e.getParameter(Ls),
              e.getParameter(Rs),
              e.getParameter(Os)
            ],
            depthBits: e.getParameter(Cs),
            stencilBits: e.getParameter(Fs),
            subpixelBits: e.getParameter(Ts),
            // supported extensions
            extensions: Object.keys(r).filter(function(Y) {
              return !!r[Y];
            }),
            // max aniso samples
            maxAnisotropic: l,
            // max draw buffers
            maxDrawbuffers: G,
            maxColorAttachments: P,
            // point and line size ranges
            pointSizeDims: e.getParameter(Gs),
            lineWidthDims: e.getParameter(Ms),
            maxViewportDims: e.getParameter(Is),
            maxCombinedTextureUnits: e.getParameter(Ps),
            maxCubeMapSize: e.getParameter(js),
            maxRenderbufferSize: e.getParameter(Xs),
            maxTextureUnits: e.getParameter(Us),
            maxTextureSize: e.getParameter(ks),
            maxAttributes: e.getParameter(Bs),
            maxVertexUniforms: e.getParameter(Ns),
            maxVertexTextureUnits: e.getParameter($s),
            maxVaryingVectors: e.getParameter(Ds),
            maxFragmentUniforms: e.getParameter(zs),
            // vendor info
            glsl: e.getParameter(Ys),
            renderer: e.getParameter(Hs),
            vendor: e.getParameter(Vs),
            version: e.getParameter(Ws),
            // quirks
            readFloat: F,
            npotTextureCube: K
          };
        };
        function Gt(e) {
          return !!e && typeof e == "object" && Array.isArray(e.shape) && Array.isArray(e.stride) && typeof e.offset == "number" && e.shape.length === e.stride.length && (Array.isArray(e.data) || y(e.data));
        }
        var Lt = function(e) {
          return Object.keys(e).map(function(r) {
            return e[r];
          });
        }, Zr = {
          shape: ff,
          flatten: sf
        };
        function af(e, r, l) {
          for (var G = 0; G < r; ++G)
            l[G] = e[G];
        }
        function of(e, r, l, G) {
          for (var P = 0, F = 0; F < r; ++F)
            for (var k = e[F], W = 0; W < l; ++W)
              G[P++] = k[W];
        }
        function Qa(e, r, l, G, P, F) {
          for (var k = F, W = 0; W < r; ++W)
            for (var q = e[W], J = 0; J < l; ++J)
              for (var K = q[J], ne = 0; ne < G; ++ne)
                P[k++] = K[ne];
        }
        function Za(e, r, l, G, P) {
          for (var F = 1, k = l + 1; k < r.length; ++k)
            F *= r[k];
          var W = r[l];
          if (r.length - l === 4) {
            var q = r[l + 1], J = r[l + 2], K = r[l + 3];
            for (k = 0; k < W; ++k)
              Qa(e[k], q, J, K, G, P), P += F;
          } else
            for (k = 0; k < W; ++k)
              Za(e[k], r, l + 1, G, P), P += F;
        }
        function sf(e, r, l, G) {
          var P = 1;
          if (r.length)
            for (var F = 0; F < r.length; ++F)
              P *= r[F];
          else
            P = 0;
          var k = G || et.allocType(l, P);
          switch (r.length) {
            case 0:
              break;
            case 1:
              af(e, r[0], k);
              break;
            case 2:
              of(e, r[0], r[1], k);
              break;
            case 3:
              Qa(e, r[0], r[1], r[2], k, 0);
              break;
            default:
              Za(e, r, 0, k, 0);
          }
          return k;
        }
        function ff(e) {
          for (var r = [], l = e; l.length; l = l[0])
            r.push(l.length);
          return r;
        }
        var Bn = {
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
        }, uf = 5120, cf = 5122, lf = 5124, df = 5121, hf = 5123, mf = 5125, pf = 5126, vf = 5126, Kt = {
          int8: uf,
          int16: cf,
          int32: lf,
          uint8: df,
          uint16: hf,
          uint32: mf,
          float: pf,
          float32: vf
        }, yf = 35048, _f = 35040, Jr = {
          dynamic: yf,
          stream: _f,
          static: 35044
        }, Nn = Zr.flatten, Ja = Zr.shape, ei = 35044, bf = 35040, Dn = 5121, Pn = 5126, jt = [];
        jt[5120] = 1, jt[5122] = 2, jt[5124] = 4, jt[5121] = 1, jt[5123] = 2, jt[5125] = 4, jt[5126] = 4;
        function en(e) {
          return Bn[Object.prototype.toString.call(e)] | 0;
        }
        function ti(e, r) {
          for (var l = 0; l < r.length; ++l)
            e[l] = r[l];
        }
        function ri(e, r, l, G, P, F, k) {
          for (var W = 0, q = 0; q < l; ++q)
            for (var J = 0; J < G; ++J)
              e[W++] = r[P * q + F * J + k];
        }
        function gf(e, r, l, G) {
          var P = 0, F = {};
          function k(T) {
            this.id = P++, this.buffer = e.createBuffer(), this.type = T, this.usage = ei, this.byteLength = 0, this.dimension = 1, this.dtype = Dn, this.persistentData = null, l.profile && (this.stats = { size: 0 });
          }
          k.prototype.bind = function() {
            e.bindBuffer(this.type, this.buffer);
          }, k.prototype.destroy = function() {
            se(this);
          };
          var W = [];
          function q(T, I) {
            var Z = W.pop();
            return Z || (Z = new k(T)), Z.bind(), ne(Z, I, bf, 0, 1, !1), Z;
          }
          function J(T) {
            W.push(T);
          }
          function K(T, I, Z) {
            T.byteLength = I.byteLength, e.bufferData(T.type, I, Z);
          }
          function ne(T, I, Z, ue, z, le) {
            var V;
            if (T.usage = Z, Array.isArray(I)) {
              if (T.dtype = ue || Pn, I.length > 0) {
                var ie;
                if (Array.isArray(I[0])) {
                  V = Ja(I);
                  for (var X = 1, oe = 1; oe < V.length; ++oe)
                    X *= V[oe];
                  T.dimension = X, ie = Nn(I, V, T.dtype), K(T, ie, Z), le ? T.persistentData = ie : et.freeType(ie);
                } else if (typeof I[0] == "number") {
                  T.dimension = z;
                  var ye = et.allocType(T.dtype, I.length);
                  ti(ye, I), K(T, ye, Z), le ? T.persistentData = ye : et.freeType(ye);
                } else y(I[0]) ? (T.dimension = I[0].length, T.dtype = ue || en(I[0]) || Pn, ie = Nn(
                  I,
                  [I.length, I[0].length],
                  T.dtype
                ), K(T, ie, Z), le ? T.persistentData = ie : et.freeType(ie)) : f.raise("invalid buffer data");
              }
            } else if (y(I))
              T.dtype = ue || en(I), T.dimension = z, K(T, I, Z), le && (T.persistentData = new Uint8Array(new Uint8Array(I.buffer)));
            else if (Gt(I)) {
              V = I.shape;
              var Ee = I.stride, fe = I.offset, te = 0, U = 0, ge = 0, Le = 0;
              V.length === 1 ? (te = V[0], U = 1, ge = Ee[0], Le = 0) : V.length === 2 ? (te = V[0], U = V[1], ge = Ee[0], Le = Ee[1]) : f.raise("invalid shape"), T.dtype = ue || en(I.data) || Pn, T.dimension = U;
              var he = et.allocType(T.dtype, te * U);
              ri(
                he,
                I.data,
                te,
                U,
                ge,
                Le,
                fe
              ), K(T, he, Z), le ? T.persistentData = he : et.freeType(he);
            } else I instanceof ArrayBuffer ? (T.dtype = Dn, T.dimension = z, K(T, I, Z), le && (T.persistentData = new Uint8Array(new Uint8Array(I)))) : f.raise("invalid buffer data");
          }
          function se(T) {
            r.bufferCount--, G(T);
            var I = T.buffer;
            f(I, "buffer must not be deleted already"), e.deleteBuffer(I), T.buffer = null, delete F[T.id];
          }
          function Y(T, I, Z, ue) {
            r.bufferCount++;
            var z = new k(I);
            F[z.id] = z;
            function le(X) {
              var oe = ei, ye = null, Ee = 0, fe = 0, te = 1;
              return Array.isArray(X) || y(X) || Gt(X) || X instanceof ArrayBuffer ? ye = X : typeof X == "number" ? Ee = X | 0 : X && (f.type(
                X,
                "object",
                "buffer arguments must be an object, a number or an array"
              ), "data" in X && (f(
                ye === null || Array.isArray(ye) || y(ye) || Gt(ye),
                "invalid data for buffer"
              ), ye = X.data), "usage" in X && (f.parameter(X.usage, Jr, "invalid buffer usage"), oe = Jr[X.usage]), "type" in X && (f.parameter(X.type, Kt, "invalid buffer type"), fe = Kt[X.type]), "dimension" in X && (f.type(X.dimension, "number", "invalid dimension"), te = X.dimension | 0), "length" in X && (f.nni(Ee, "buffer length must be a nonnegative integer"), Ee = X.length | 0)), z.bind(), ye ? ne(z, ye, oe, fe, te, ue) : (Ee && e.bufferData(z.type, Ee, oe), z.dtype = fe || Dn, z.usage = oe, z.dimension = te, z.byteLength = Ee), l.profile && (z.stats.size = z.byteLength * jt[z.dtype]), le;
            }
            function V(X, oe) {
              f(
                oe + X.byteLength <= z.byteLength,
                "invalid buffer subdata call, buffer is too small.  Can't write data of size " + X.byteLength + " starting from offset " + oe + " to a buffer of size " + z.byteLength
              ), e.bufferSubData(z.type, oe, X);
            }
            function ie(X, oe) {
              var ye = (oe || 0) | 0, Ee;
              if (z.bind(), y(X) || X instanceof ArrayBuffer)
                V(X, ye);
              else if (Array.isArray(X)) {
                if (X.length > 0)
                  if (typeof X[0] == "number") {
                    var fe = et.allocType(z.dtype, X.length);
                    ti(fe, X), V(fe, ye), et.freeType(fe);
                  } else if (Array.isArray(X[0]) || y(X[0])) {
                    Ee = Ja(X);
                    var te = Nn(X, Ee, z.dtype);
                    V(te, ye), et.freeType(te);
                  } else
                    f.raise("invalid buffer data");
              } else if (Gt(X)) {
                Ee = X.shape;
                var U = X.stride, ge = 0, Le = 0, he = 0, Ge = 0;
                Ee.length === 1 ? (ge = Ee[0], Le = 1, he = U[0], Ge = 0) : Ee.length === 2 ? (ge = Ee[0], Le = Ee[1], he = U[0], Ge = U[1]) : f.raise("invalid shape");
                var we = Array.isArray(X.data) ? z.dtype : en(X.data), Ce = et.allocType(we, ge * Le);
                ri(
                  Ce,
                  X.data,
                  ge,
                  Le,
                  he,
                  Ge,
                  X.offset
                ), V(Ce, ye), et.freeType(Ce);
              } else
                f.raise("invalid data for buffer subdata");
              return le;
            }
            return Z || le(T), le._reglType = "buffer", le._buffer = z, le.subdata = ie, l.profile && (le.stats = z.stats), le.destroy = function() {
              se(z);
            }, le;
          }
          function ae() {
            Lt(F).forEach(function(T) {
              T.buffer = e.createBuffer(), e.bindBuffer(T.type, T.buffer), e.bufferData(
                T.type,
                T.persistentData || T.byteLength,
                T.usage
              );
            });
          }
          return l.profile && (r.getTotalBufferSize = function() {
            var T = 0;
            return Object.keys(F).forEach(function(I) {
              T += F[I].stats.size;
            }), T;
          }), {
            create: Y,
            createStream: q,
            destroyStream: J,
            clear: function() {
              Lt(F).forEach(se), W.forEach(se);
            },
            getBuffer: function(T) {
              return T && T._buffer instanceof k ? T._buffer : null;
            },
            restore: ae,
            _initBuffer: ne
          };
        }
        var Ef = 0, xf = 0, wf = 1, Af = 1, Tf = 4, Sf = 4, ur = {
          points: Ef,
          point: xf,
          lines: wf,
          line: Af,
          triangles: Tf,
          triangle: Sf,
          "line loop": 2,
          "line strip": 3,
          "triangle strip": 5,
          "triangle fan": 6
        }, Lf = 0, Rf = 1, Cr = 4, Of = 5120, cr = 5121, ni = 5122, lr = 5123, ai = 5124, Qt = 5125, $n = 34963, Cf = 35040, Ff = 35044;
        function Gf(e, r, l, G) {
          var P = {}, F = 0, k = {
            uint8: cr,
            uint16: lr
          };
          r.oes_element_index_uint && (k.uint32 = Qt);
          function W(ae) {
            this.id = F++, P[this.id] = this, this.buffer = ae, this.primType = Cr, this.vertCount = 0, this.type = 0;
          }
          W.prototype.bind = function() {
            this.buffer.bind();
          };
          var q = [];
          function J(ae) {
            var T = q.pop();
            return T || (T = new W(l.create(
              null,
              $n,
              !0,
              !1
            )._buffer)), ne(T, ae, Cf, -1, -1, 0, 0), T;
          }
          function K(ae) {
            q.push(ae);
          }
          function ne(ae, T, I, Z, ue, z, le) {
            ae.buffer.bind();
            var V;
            if (T) {
              var ie = le;
              !le && (!y(T) || Gt(T) && !y(T.data)) && (ie = r.oes_element_index_uint ? Qt : lr), l._initBuffer(
                ae.buffer,
                T,
                I,
                ie,
                3
              );
            } else
              e.bufferData($n, z, I), ae.buffer.dtype = V || cr, ae.buffer.usage = I, ae.buffer.dimension = 3, ae.buffer.byteLength = z;
            if (V = le, !le) {
              switch (ae.buffer.dtype) {
                case cr:
                case Of:
                  V = cr;
                  break;
                case lr:
                case ni:
                  V = lr;
                  break;
                case Qt:
                case ai:
                  V = Qt;
                  break;
                default:
                  f.raise("unsupported type for element array");
              }
              ae.buffer.dtype = V;
            }
            ae.type = V, f(
              V !== Qt || !!r.oes_element_index_uint,
              "32 bit element buffers not supported, enable oes_element_index_uint first"
            );
            var X = ue;
            X < 0 && (X = ae.buffer.byteLength, V === lr ? X >>= 1 : V === Qt && (X >>= 2)), ae.vertCount = X;
            var oe = Z;
            if (Z < 0) {
              oe = Cr;
              var ye = ae.buffer.dimension;
              ye === 1 && (oe = Lf), ye === 2 && (oe = Rf), ye === 3 && (oe = Cr);
            }
            ae.primType = oe;
          }
          function se(ae) {
            G.elementsCount--, f(ae.buffer !== null, "must not double destroy elements"), delete P[ae.id], ae.buffer.destroy(), ae.buffer = null;
          }
          function Y(ae, T) {
            var I = l.create(null, $n, !0), Z = new W(I._buffer);
            G.elementsCount++;
            function ue(z) {
              if (!z)
                I(), Z.primType = Cr, Z.vertCount = 0, Z.type = cr;
              else if (typeof z == "number")
                I(z), Z.primType = Cr, Z.vertCount = z | 0, Z.type = cr;
              else {
                var le = null, V = Ff, ie = -1, X = -1, oe = 0, ye = 0;
                Array.isArray(z) || y(z) || Gt(z) ? le = z : (f.type(z, "object", "invalid arguments for elements"), "data" in z && (le = z.data, f(
                  Array.isArray(le) || y(le) || Gt(le),
                  "invalid data for element buffer"
                )), "usage" in z && (f.parameter(
                  z.usage,
                  Jr,
                  "invalid element buffer usage"
                ), V = Jr[z.usage]), "primitive" in z && (f.parameter(
                  z.primitive,
                  ur,
                  "invalid element buffer primitive"
                ), ie = ur[z.primitive]), "count" in z && (f(
                  typeof z.count == "number" && z.count >= 0,
                  "invalid vertex count for elements"
                ), X = z.count | 0), "type" in z && (f.parameter(
                  z.type,
                  k,
                  "invalid buffer type"
                ), ye = k[z.type]), "length" in z ? oe = z.length | 0 : (oe = X, ye === lr || ye === ni ? oe *= 2 : (ye === Qt || ye === ai) && (oe *= 4))), ne(
                  Z,
                  le,
                  V,
                  ie,
                  X,
                  oe,
                  ye
                );
              }
              return ue;
            }
            return ue(ae), ue._reglType = "elements", ue._elements = Z, ue.subdata = function(z, le) {
              return I.subdata(z, le), ue;
            }, ue.destroy = function() {
              se(Z);
            }, ue;
          }
          return {
            create: Y,
            createStream: J,
            destroyStream: K,
            getElements: function(ae) {
              return typeof ae == "function" && ae._elements instanceof W ? ae._elements : null;
            },
            clear: function() {
              Lt(P).forEach(se);
            }
          };
        }
        var ii = new Float32Array(1), Mf = new Uint32Array(ii.buffer), kf = 5123;
        function oi(e) {
          for (var r = et.allocType(kf, e.length), l = 0; l < e.length; ++l)
            if (isNaN(e[l]))
              r[l] = 65535;
            else if (e[l] === 1 / 0)
              r[l] = 31744;
            else if (e[l] === -1 / 0)
              r[l] = 64512;
            else {
              ii[0] = e[l];
              var G = Mf[0], P = G >>> 31 << 15, F = (G << 1 >>> 24) - 127, k = G >> 13 & 1023;
              if (F < -24)
                r[l] = P;
              else if (F < -14) {
                var W = -14 - F;
                r[l] = P + (k + 1024 >> W);
              } else F > 15 ? r[l] = P + 31744 : r[l] = P + (F + 15 << 10) + k;
            }
          return r;
        }
        function Ke(e) {
          return Array.isArray(e) || y(e);
        }
        var si = function(e) {
          return !(e & e - 1) && !!e;
        }, If = 34467, Bt = 3553, Un = 34067, tn = 34069, Zt = 6408, zn = 6406, rn = 6407, Fr = 6409, nn = 6410, fi = 32854, jn = 32855, ui = 36194, Bf = 32819, Nf = 32820, Df = 33635, Pf = 34042, Xn = 6402, an = 34041, Vn = 35904, Hn = 35906, dr = 36193, Wn = 33776, Yn = 33777, qn = 33778, Kn = 33779, ci = 35986, li = 35987, di = 34798, hi = 35840, mi = 35841, pi = 35842, vi = 35843, yi = 36196, hr = 5121, Qn = 5123, Zn = 5125, Gr = 5126, $f = 10242, Uf = 10243, zf = 10497, Jn = 33071, jf = 33648, Xf = 10240, Vf = 10241, ea = 9728, Hf = 9729, ta = 9984, _i = 9985, bi = 9986, ra = 9987, Wf = 33170, on = 4352, Yf = 4353, qf = 4354, Kf = 34046, Qf = 3317, Zf = 37440, Jf = 37441, eu = 37443, gi = 37444, Mr = 33984, tu = [
          ta,
          bi,
          _i,
          ra
        ], sn = [
          0,
          Fr,
          nn,
          rn,
          Zt
        ], Ot = {};
        Ot[Fr] = Ot[zn] = Ot[Xn] = 1, Ot[an] = Ot[nn] = 2, Ot[rn] = Ot[Vn] = 3, Ot[Zt] = Ot[Hn] = 4;
        function mr(e) {
          return "[object " + e + "]";
        }
        var Ei = mr("HTMLCanvasElement"), xi = mr("OffscreenCanvas"), wi = mr("CanvasRenderingContext2D"), Ai = mr("ImageBitmap"), Ti = mr("HTMLImageElement"), Si = mr("HTMLVideoElement"), ru = Object.keys(Bn).concat([
          Ei,
          xi,
          wi,
          Ai,
          Ti,
          Si
        ]), pr = [];
        pr[hr] = 1, pr[Gr] = 4, pr[dr] = 2, pr[Qn] = 2, pr[Zn] = 4;
        var lt = [];
        lt[fi] = 2, lt[jn] = 2, lt[ui] = 2, lt[an] = 4, lt[Wn] = 0.5, lt[Yn] = 0.5, lt[qn] = 1, lt[Kn] = 1, lt[ci] = 0.5, lt[li] = 1, lt[di] = 1, lt[hi] = 0.5, lt[mi] = 0.25, lt[pi] = 0.5, lt[vi] = 0.25, lt[yi] = 0.5;
        function Li(e) {
          return Array.isArray(e) && (e.length === 0 || typeof e[0] == "number");
        }
        function Ri(e) {
          if (!Array.isArray(e))
            return !1;
          var r = e.length;
          return !(r === 0 || !Ke(e[0]));
        }
        function Jt(e) {
          return Object.prototype.toString.call(e);
        }
        function Oi(e) {
          return Jt(e) === Ei;
        }
        function Ci(e) {
          return Jt(e) === xi;
        }
        function nu(e) {
          return Jt(e) === wi;
        }
        function au(e) {
          return Jt(e) === Ai;
        }
        function iu(e) {
          return Jt(e) === Ti;
        }
        function ou(e) {
          return Jt(e) === Si;
        }
        function na(e) {
          if (!e)
            return !1;
          var r = Jt(e);
          return ru.indexOf(r) >= 0 ? !0 : Li(e) || Ri(e) || Gt(e);
        }
        function Fi(e) {
          return Bn[Object.prototype.toString.call(e)] | 0;
        }
        function su(e, r) {
          var l = r.length;
          switch (e.type) {
            case hr:
            case Qn:
            case Zn:
            case Gr:
              var G = et.allocType(e.type, l);
              G.set(r), e.data = G;
              break;
            case dr:
              e.data = oi(r);
              break;
            default:
              f.raise("unsupported texture type, must specify a typed array");
          }
        }
        function Gi(e, r) {
          return et.allocType(
            e.type === dr ? Gr : e.type,
            r
          );
        }
        function Mi(e, r) {
          e.type === dr ? (e.data = oi(r), et.freeType(r)) : e.data = r;
        }
        function fu(e, r, l, G, P, F) {
          for (var k = e.width, W = e.height, q = e.channels, J = k * W * q, K = Gi(e, J), ne = 0, se = 0; se < W; ++se)
            for (var Y = 0; Y < k; ++Y)
              for (var ae = 0; ae < q; ++ae)
                K[ne++] = r[l * Y + G * se + P * ae + F];
          Mi(e, K);
        }
        function fn(e, r, l, G, P, F) {
          var k;
          if (typeof lt[e] < "u" ? k = lt[e] : k = Ot[e] * pr[r], F && (k *= 6), P) {
            for (var W = 0, q = l; q >= 1; )
              W += k * q * q, q /= 2;
            return W;
          } else
            return k * l * G;
        }
        function uu(e, r, l, G, P, F, k) {
          var W = {
            "don't care": on,
            "dont care": on,
            nice: qf,
            fast: Yf
          }, q = {
            repeat: zf,
            clamp: Jn,
            mirror: jf
          }, J = {
            nearest: ea,
            linear: Hf
          }, K = p({
            mipmap: ra,
            "nearest mipmap nearest": ta,
            "linear mipmap nearest": _i,
            "nearest mipmap linear": bi,
            "linear mipmap linear": ra
          }, J), ne = {
            none: 0,
            browser: gi
          }, se = {
            uint8: hr,
            rgba4: Bf,
            rgb565: Df,
            "rgb5 a1": Nf
          }, Y = {
            alpha: zn,
            luminance: Fr,
            "luminance alpha": nn,
            rgb: rn,
            rgba: Zt,
            rgba4: fi,
            "rgb5 a1": jn,
            rgb565: ui
          }, ae = {};
          r.ext_srgb && (Y.srgb = Vn, Y.srgba = Hn), r.oes_texture_float && (se.float32 = se.float = Gr), r.oes_texture_half_float && (se.float16 = se["half float"] = dr), r.webgl_depth_texture && (p(Y, {
            depth: Xn,
            "depth stencil": an
          }), p(se, {
            uint16: Qn,
            uint32: Zn,
            "depth stencil": Pf
          })), r.webgl_compressed_texture_s3tc && p(ae, {
            "rgb s3tc dxt1": Wn,
            "rgba s3tc dxt1": Yn,
            "rgba s3tc dxt3": qn,
            "rgba s3tc dxt5": Kn
          }), r.webgl_compressed_texture_atc && p(ae, {
            "rgb atc": ci,
            "rgba atc explicit alpha": li,
            "rgba atc interpolated alpha": di
          }), r.webgl_compressed_texture_pvrtc && p(ae, {
            "rgb pvrtc 4bppv1": hi,
            "rgb pvrtc 2bppv1": mi,
            "rgba pvrtc 4bppv1": pi,
            "rgba pvrtc 2bppv1": vi
          }), r.webgl_compressed_texture_etc1 && (ae["rgb etc1"] = yi);
          var T = Array.prototype.slice.call(
            e.getParameter(If)
          );
          Object.keys(ae).forEach(function(u) {
            var M = ae[u];
            T.indexOf(M) >= 0 && (Y[u] = M);
          });
          var I = Object.keys(Y);
          l.textureFormats = I;
          var Z = [];
          Object.keys(Y).forEach(function(u) {
            var M = Y[u];
            Z[M] = u;
          });
          var ue = [];
          Object.keys(se).forEach(function(u) {
            var M = se[u];
            ue[M] = u;
          });
          var z = [];
          Object.keys(J).forEach(function(u) {
            var M = J[u];
            z[M] = u;
          });
          var le = [];
          Object.keys(K).forEach(function(u) {
            var M = K[u];
            le[M] = u;
          });
          var V = [];
          Object.keys(q).forEach(function(u) {
            var M = q[u];
            V[M] = u;
          });
          var ie = I.reduce(function(u, M) {
            var O = Y[M];
            return O === Fr || O === zn || O === Fr || O === nn || O === Xn || O === an || r.ext_srgb && (O === Vn || O === Hn) ? u[O] = O : O === jn || M.indexOf("rgba") >= 0 ? u[O] = Zt : u[O] = rn, u;
          }, {});
          function X() {
            this.internalformat = Zt, this.format = Zt, this.type = hr, this.compressed = !1, this.premultiplyAlpha = !1, this.flipY = !1, this.unpackAlignment = 1, this.colorSpace = gi, this.width = 0, this.height = 0, this.channels = 0;
          }
          function oe(u, M) {
            u.internalformat = M.internalformat, u.format = M.format, u.type = M.type, u.compressed = M.compressed, u.premultiplyAlpha = M.premultiplyAlpha, u.flipY = M.flipY, u.unpackAlignment = M.unpackAlignment, u.colorSpace = M.colorSpace, u.width = M.width, u.height = M.height, u.channels = M.channels;
          }
          function ye(u, M) {
            if (!(typeof M != "object" || !M)) {
              if ("premultiplyAlpha" in M && (f.type(
                M.premultiplyAlpha,
                "boolean",
                "invalid premultiplyAlpha"
              ), u.premultiplyAlpha = M.premultiplyAlpha), "flipY" in M && (f.type(
                M.flipY,
                "boolean",
                "invalid texture flip"
              ), u.flipY = M.flipY), "alignment" in M && (f.oneOf(
                M.alignment,
                [1, 2, 4, 8],
                "invalid texture unpack alignment"
              ), u.unpackAlignment = M.alignment), "colorSpace" in M && (f.parameter(
                M.colorSpace,
                ne,
                "invalid colorSpace"
              ), u.colorSpace = ne[M.colorSpace]), "type" in M) {
                var O = M.type;
                f(
                  r.oes_texture_float || !(O === "float" || O === "float32"),
                  "you must enable the OES_texture_float extension in order to use floating point textures."
                ), f(
                  r.oes_texture_half_float || !(O === "half float" || O === "float16"),
                  "you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures."
                ), f(
                  r.webgl_depth_texture || !(O === "uint16" || O === "uint32" || O === "depth stencil"),
                  "you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures."
                ), f.parameter(
                  O,
                  se,
                  "invalid texture type"
                ), u.type = se[O];
              }
              var de = u.width, Me = u.height, o = u.channels, t = !1;
              "shape" in M ? (f(
                Array.isArray(M.shape) && M.shape.length >= 2,
                "shape must be an array"
              ), de = M.shape[0], Me = M.shape[1], M.shape.length === 3 && (o = M.shape[2], f(o > 0 && o <= 4, "invalid number of channels"), t = !0), f(de >= 0 && de <= l.maxTextureSize, "invalid width"), f(Me >= 0 && Me <= l.maxTextureSize, "invalid height")) : ("radius" in M && (de = Me = M.radius, f(de >= 0 && de <= l.maxTextureSize, "invalid radius")), "width" in M && (de = M.width, f(de >= 0 && de <= l.maxTextureSize, "invalid width")), "height" in M && (Me = M.height, f(Me >= 0 && Me <= l.maxTextureSize, "invalid height")), "channels" in M && (o = M.channels, f(o > 0 && o <= 4, "invalid number of channels"), t = !0)), u.width = de | 0, u.height = Me | 0, u.channels = o | 0;
              var h = !1;
              if ("format" in M) {
                var A = M.format;
                f(
                  r.webgl_depth_texture || !(A === "depth" || A === "depth stencil"),
                  "you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures."
                ), f.parameter(
                  A,
                  Y,
                  "invalid texture format"
                );
                var S = u.internalformat = Y[A];
                u.format = ie[S], A in se && ("type" in M || (u.type = se[A])), A in ae && (u.compressed = !0), h = !0;
              }
              !t && h ? u.channels = Ot[u.format] : t && !h ? u.channels !== sn[u.format] && (u.format = u.internalformat = sn[u.channels]) : h && t && f(
                u.channels === Ot[u.format],
                "number of channels inconsistent with specified format"
              );
            }
          }
          function Ee(u) {
            e.pixelStorei(Zf, u.flipY), e.pixelStorei(Jf, u.premultiplyAlpha), e.pixelStorei(eu, u.colorSpace), e.pixelStorei(Qf, u.unpackAlignment);
          }
          function fe() {
            X.call(this), this.xOffset = 0, this.yOffset = 0, this.data = null, this.needsFree = !1, this.element = null, this.needsCopy = !1;
          }
          function te(u, M) {
            var O = null;
            if (na(M) ? O = M : M && (f.type(M, "object", "invalid pixel data type"), ye(u, M), "x" in M && (u.xOffset = M.x | 0), "y" in M && (u.yOffset = M.y | 0), na(M.data) && (O = M.data)), f(
              !u.compressed || O instanceof Uint8Array,
              "compressed texture data must be stored in a uint8array"
            ), M.copy) {
              f(!O, "can not specify copy and data field for the same texture");
              var de = P.viewportWidth, Me = P.viewportHeight;
              u.width = u.width || de - u.xOffset, u.height = u.height || Me - u.yOffset, u.needsCopy = !0, f(
                u.xOffset >= 0 && u.xOffset < de && u.yOffset >= 0 && u.yOffset < Me && u.width > 0 && u.width <= de && u.height > 0 && u.height <= Me,
                "copy texture read out of bounds"
              );
            } else if (!O)
              u.width = u.width || 1, u.height = u.height || 1, u.channels = u.channels || 4;
            else if (y(O))
              u.channels = u.channels || 4, u.data = O, !("type" in M) && u.type === hr && (u.type = Fi(O));
            else if (Li(O))
              u.channels = u.channels || 4, su(u, O), u.alignment = 1, u.needsFree = !0;
            else if (Gt(O)) {
              var o = O.data;
              !Array.isArray(o) && u.type === hr && (u.type = Fi(o));
              var t = O.shape, h = O.stride, A, S, v, m, g, s;
              t.length === 3 ? (v = t[2], s = h[2]) : (f(t.length === 2, "invalid ndarray pixel data, must be 2 or 3D"), v = 1, s = 1), A = t[0], S = t[1], m = h[0], g = h[1], u.alignment = 1, u.width = A, u.height = S, u.channels = v, u.format = u.internalformat = sn[v], u.needsFree = !0, fu(u, o, m, g, s, O.offset);
            } else if (Oi(O) || Ci(O) || nu(O))
              Oi(O) || Ci(O) ? u.element = O : u.element = O.canvas, u.width = u.element.width, u.height = u.element.height, u.channels = 4;
            else if (au(O))
              u.element = O, u.width = O.width, u.height = O.height, u.channels = 4;
            else if (iu(O))
              u.element = O, u.width = O.naturalWidth, u.height = O.naturalHeight, u.channels = 4;
            else if (ou(O))
              u.element = O, u.width = O.videoWidth, u.height = O.videoHeight, u.channels = 4;
            else if (Ri(O)) {
              var d = u.width || O[0].length, i = u.height || O.length, E = u.channels;
              Ke(O[0][0]) ? E = E || O[0][0].length : E = E || 1;
              for (var L = Zr.shape(O), D = 1, $ = 0; $ < L.length; ++$)
                D *= L[$];
              var B = Gi(u, D);
              Zr.flatten(O, L, "", B), Mi(u, B), u.alignment = 1, u.width = d, u.height = i, u.channels = E, u.format = u.internalformat = sn[E], u.needsFree = !0;
            }
            u.type === Gr ? f(
              l.extensions.indexOf("oes_texture_float") >= 0,
              "oes_texture_float extension not enabled"
            ) : u.type === dr && f(
              l.extensions.indexOf("oes_texture_half_float") >= 0,
              "oes_texture_half_float extension not enabled"
            );
          }
          function U(u, M, O) {
            var de = u.element, Me = u.data, o = u.internalformat, t = u.format, h = u.type, A = u.width, S = u.height;
            Ee(u), de ? e.texImage2D(M, O, t, t, h, de) : u.compressed ? e.compressedTexImage2D(M, O, o, A, S, 0, Me) : u.needsCopy ? (G(), e.copyTexImage2D(
              M,
              O,
              t,
              u.xOffset,
              u.yOffset,
              A,
              S,
              0
            )) : e.texImage2D(M, O, t, A, S, 0, t, h, Me || null);
          }
          function ge(u, M, O, de, Me) {
            var o = u.element, t = u.data, h = u.internalformat, A = u.format, S = u.type, v = u.width, m = u.height;
            Ee(u), o ? e.texSubImage2D(
              M,
              Me,
              O,
              de,
              A,
              S,
              o
            ) : u.compressed ? e.compressedTexSubImage2D(
              M,
              Me,
              O,
              de,
              h,
              v,
              m,
              t
            ) : u.needsCopy ? (G(), e.copyTexSubImage2D(
              M,
              Me,
              O,
              de,
              u.xOffset,
              u.yOffset,
              v,
              m
            )) : e.texSubImage2D(
              M,
              Me,
              O,
              de,
              v,
              m,
              A,
              S,
              t
            );
          }
          var Le = [];
          function he() {
            return Le.pop() || new fe();
          }
          function Ge(u) {
            u.needsFree && et.freeType(u.data), fe.call(u), Le.push(u);
          }
          function we() {
            X.call(this), this.genMipmaps = !1, this.mipmapHint = on, this.mipmask = 0, this.images = Array(16);
          }
          function Ce(u, M, O) {
            var de = u.images[0] = he();
            u.mipmask = 1, de.width = u.width = M, de.height = u.height = O, de.channels = u.channels = 4;
          }
          function ze(u, M) {
            var O = null;
            if (na(M))
              O = u.images[0] = he(), oe(O, u), te(O, M), u.mipmask = 1;
            else if (ye(u, M), Array.isArray(M.mipmap))
              for (var de = M.mipmap, Me = 0; Me < de.length; ++Me)
                O = u.images[Me] = he(), oe(O, u), O.width >>= Me, O.height >>= Me, te(O, de[Me]), u.mipmask |= 1 << Me;
            else
              O = u.images[0] = he(), oe(O, u), te(O, M), u.mipmask = 1;
            oe(u, u.images[0]), u.compressed && (u.internalformat === Wn || u.internalformat === Yn || u.internalformat === qn || u.internalformat === Kn) && f(
              u.width % 4 === 0 && u.height % 4 === 0,
              "for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4"
            );
          }
          function rt(u, M) {
            for (var O = u.images, de = 0; de < O.length; ++de) {
              if (!O[de])
                return;
              U(O[de], M, de);
            }
          }
          var ut = [];
          function Ne() {
            var u = ut.pop() || new we();
            X.call(u), u.mipmask = 0;
            for (var M = 0; M < 16; ++M)
              u.images[M] = null;
            return u;
          }
          function ot(u) {
            for (var M = u.images, O = 0; O < M.length; ++O)
              M[O] && Ge(M[O]), M[O] = null;
            ut.push(u);
          }
          function He() {
            this.minFilter = ea, this.magFilter = ea, this.wrapS = Jn, this.wrapT = Jn, this.anisotropic = 1, this.genMipmaps = !1, this.mipmapHint = on;
          }
          function nt(u, M) {
            if ("min" in M) {
              var O = M.min;
              f.parameter(O, K), u.minFilter = K[O], tu.indexOf(u.minFilter) >= 0 && !("faces" in M) && (u.genMipmaps = !0);
            }
            if ("mag" in M) {
              var de = M.mag;
              f.parameter(de, J), u.magFilter = J[de];
            }
            var Me = u.wrapS, o = u.wrapT;
            if ("wrap" in M) {
              var t = M.wrap;
              typeof t == "string" ? (f.parameter(t, q), Me = o = q[t]) : Array.isArray(t) && (f.parameter(t[0], q), f.parameter(t[1], q), Me = q[t[0]], o = q[t[1]]);
            } else {
              if ("wrapS" in M) {
                var h = M.wrapS;
                f.parameter(h, q), Me = q[h];
              }
              if ("wrapT" in M) {
                var A = M.wrapT;
                f.parameter(A, q), o = q[A];
              }
            }
            if (u.wrapS = Me, u.wrapT = o, "anisotropic" in M) {
              var S = M.anisotropic;
              f(
                typeof S == "number" && S >= 1 && S <= l.maxAnisotropic,
                "aniso samples must be between 1 and "
              ), u.anisotropic = M.anisotropic;
            }
            if ("mipmap" in M) {
              var v = !1;
              switch (typeof M.mipmap) {
                case "string":
                  f.parameter(
                    M.mipmap,
                    W,
                    "invalid mipmap hint"
                  ), u.mipmapHint = W[M.mipmap], u.genMipmaps = !0, v = !0;
                  break;
                case "boolean":
                  v = u.genMipmaps = M.mipmap;
                  break;
                case "object":
                  f(Array.isArray(M.mipmap), "invalid mipmap type"), u.genMipmaps = !1, v = !0;
                  break;
                default:
                  f.raise("invalid mipmap type");
              }
              v && !("min" in M) && (u.minFilter = ta);
            }
          }
          function st(u, M) {
            e.texParameteri(M, Vf, u.minFilter), e.texParameteri(M, Xf, u.magFilter), e.texParameteri(M, $f, u.wrapS), e.texParameteri(M, Uf, u.wrapT), r.ext_texture_filter_anisotropic && e.texParameteri(M, Kf, u.anisotropic), u.genMipmaps && (e.hint(Wf, u.mipmapHint), e.generateMipmap(M));
          }
          var ft = 0, ct = {}, dt = l.maxTextureUnits, Qe = Array(dt).map(function() {
            return null;
          });
          function Re(u) {
            X.call(this), this.mipmask = 0, this.internalformat = Zt, this.id = ft++, this.refCount = 1, this.target = u, this.texture = e.createTexture(), this.unit = -1, this.bindCount = 0, this.texInfo = new He(), k.profile && (this.stats = { size: 0 });
          }
          function ht(u) {
            e.activeTexture(Mr), e.bindTexture(u.target, u.texture);
          }
          function Ve() {
            var u = Qe[0];
            u ? e.bindTexture(u.target, u.texture) : e.bindTexture(Bt, null);
          }
          function _e(u) {
            var M = u.texture;
            f(M, "must not double destroy texture");
            var O = u.unit, de = u.target;
            O >= 0 && (e.activeTexture(Mr + O), e.bindTexture(de, null), Qe[O] = null), e.deleteTexture(M), u.texture = null, u.params = null, u.pixels = null, u.refCount = 0, delete ct[u.id], F.textureCount--;
          }
          p(Re.prototype, {
            bind: function() {
              var u = this;
              u.bindCount += 1;
              var M = u.unit;
              if (M < 0) {
                for (var O = 0; O < dt; ++O) {
                  var de = Qe[O];
                  if (de) {
                    if (de.bindCount > 0)
                      continue;
                    de.unit = -1;
                  }
                  Qe[O] = u, M = O;
                  break;
                }
                M >= dt && f.raise("insufficient number of texture units"), k.profile && F.maxTextureUnits < M + 1 && (F.maxTextureUnits = M + 1), u.unit = M, e.activeTexture(Mr + M), e.bindTexture(u.target, u.texture);
              }
              return M;
            },
            unbind: function() {
              this.bindCount -= 1;
            },
            decRef: function() {
              --this.refCount <= 0 && _e(this);
            }
          });
          function ke(u, M) {
            var O = new Re(Bt);
            ct[O.id] = O, F.textureCount++;
            function de(t, h) {
              var A = O.texInfo;
              He.call(A);
              var S = Ne();
              return typeof t == "number" ? typeof h == "number" ? Ce(S, t | 0, h | 0) : Ce(S, t | 0, t | 0) : t ? (f.type(t, "object", "invalid arguments to regl.texture"), nt(A, t), ze(S, t)) : Ce(S, 1, 1), A.genMipmaps && (S.mipmask = (S.width << 1) - 1), O.mipmask = S.mipmask, oe(O, S), f.texture2D(A, S, l), O.internalformat = S.internalformat, de.width = S.width, de.height = S.height, ht(O), rt(S, Bt), st(A, Bt), Ve(), ot(S), k.profile && (O.stats.size = fn(
                O.internalformat,
                O.type,
                S.width,
                S.height,
                A.genMipmaps,
                !1
              )), de.format = Z[O.internalformat], de.type = ue[O.type], de.mag = z[A.magFilter], de.min = le[A.minFilter], de.wrapS = V[A.wrapS], de.wrapT = V[A.wrapT], de;
            }
            function Me(t, h, A, S) {
              f(!!t, "must specify image data");
              var v = h | 0, m = A | 0, g = S | 0, s = he();
              return oe(s, O), s.width = 0, s.height = 0, te(s, t), s.width = s.width || (O.width >> g) - v, s.height = s.height || (O.height >> g) - m, f(
                O.type === s.type && O.format === s.format && O.internalformat === s.internalformat,
                "incompatible format for texture.subimage"
              ), f(
                v >= 0 && m >= 0 && v + s.width <= O.width && m + s.height <= O.height,
                "texture.subimage write out of bounds"
              ), f(
                O.mipmask & 1 << g,
                "missing mipmap data"
              ), f(
                s.data || s.element || s.needsCopy,
                "missing image data"
              ), ht(O), ge(s, Bt, v, m, g), Ve(), Ge(s), de;
            }
            function o(t, h) {
              var A = t | 0, S = h | 0 || A;
              if (A === O.width && S === O.height)
                return de;
              de.width = O.width = A, de.height = O.height = S, ht(O);
              for (var v = 0; O.mipmask >> v; ++v) {
                var m = A >> v, g = S >> v;
                if (!m || !g) break;
                e.texImage2D(
                  Bt,
                  v,
                  O.format,
                  m,
                  g,
                  0,
                  O.format,
                  O.type,
                  null
                );
              }
              return Ve(), k.profile && (O.stats.size = fn(
                O.internalformat,
                O.type,
                A,
                S,
                !1,
                !1
              )), de;
            }
            return de(u, M), de.subimage = Me, de.resize = o, de._reglType = "texture2d", de._texture = O, k.profile && (de.stats = O.stats), de.destroy = function() {
              O.decRef();
            }, de;
          }
          function $e(u, M, O, de, Me, o) {
            var t = new Re(Un);
            ct[t.id] = t, F.cubeCount++;
            var h = new Array(6);
            function A(m, g, s, d, i, E) {
              var L, D = t.texInfo;
              for (He.call(D), L = 0; L < 6; ++L)
                h[L] = Ne();
              if (typeof m == "number" || !m) {
                var $ = m | 0 || 1;
                for (L = 0; L < 6; ++L)
                  Ce(h[L], $, $);
              } else if (typeof m == "object")
                if (g)
                  ze(h[0], m), ze(h[1], g), ze(h[2], s), ze(h[3], d), ze(h[4], i), ze(h[5], E);
                else if (nt(D, m), ye(t, m), "faces" in m) {
                  var B = m.faces;
                  for (f(
                    Array.isArray(B) && B.length === 6,
                    "cube faces must be a length 6 array"
                  ), L = 0; L < 6; ++L)
                    f(
                      typeof B[L] == "object" && !!B[L],
                      "invalid input for cube map face"
                    ), oe(h[L], t), ze(h[L], B[L]);
                } else
                  for (L = 0; L < 6; ++L)
                    ze(h[L], m);
              else
                f.raise("invalid arguments to cube map");
              for (oe(t, h[0]), l.npotTextureCube || f(si(t.width) && si(t.height), "your browser does not support non power or two texture dimensions"), D.genMipmaps ? t.mipmask = (h[0].width << 1) - 1 : t.mipmask = h[0].mipmask, f.textureCube(t, D, h, l), t.internalformat = h[0].internalformat, A.width = h[0].width, A.height = h[0].height, ht(t), L = 0; L < 6; ++L)
                rt(h[L], tn + L);
              for (st(D, Un), Ve(), k.profile && (t.stats.size = fn(
                t.internalformat,
                t.type,
                A.width,
                A.height,
                D.genMipmaps,
                !0
              )), A.format = Z[t.internalformat], A.type = ue[t.type], A.mag = z[D.magFilter], A.min = le[D.minFilter], A.wrapS = V[D.wrapS], A.wrapT = V[D.wrapT], L = 0; L < 6; ++L)
                ot(h[L]);
              return A;
            }
            function S(m, g, s, d, i) {
              f(!!g, "must specify image data"), f(typeof m == "number" && m === (m | 0) && m >= 0 && m < 6, "invalid face");
              var E = s | 0, L = d | 0, D = i | 0, $ = he();
              return oe($, t), $.width = 0, $.height = 0, te($, g), $.width = $.width || (t.width >> D) - E, $.height = $.height || (t.height >> D) - L, f(
                t.type === $.type && t.format === $.format && t.internalformat === $.internalformat,
                "incompatible format for texture.subimage"
              ), f(
                E >= 0 && L >= 0 && E + $.width <= t.width && L + $.height <= t.height,
                "texture.subimage write out of bounds"
              ), f(
                t.mipmask & 1 << D,
                "missing mipmap data"
              ), f(
                $.data || $.element || $.needsCopy,
                "missing image data"
              ), ht(t), ge($, tn + m, E, L, D), Ve(), Ge($), A;
            }
            function v(m) {
              var g = m | 0;
              if (g !== t.width) {
                A.width = t.width = g, A.height = t.height = g, ht(t);
                for (var s = 0; s < 6; ++s)
                  for (var d = 0; t.mipmask >> d; ++d)
                    e.texImage2D(
                      tn + s,
                      d,
                      t.format,
                      g >> d,
                      g >> d,
                      0,
                      t.format,
                      t.type,
                      null
                    );
                return Ve(), k.profile && (t.stats.size = fn(
                  t.internalformat,
                  t.type,
                  A.width,
                  A.height,
                  !1,
                  !0
                )), A;
              }
            }
            return A(u, M, O, de, Me, o), A.subimage = S, A.resize = v, A._reglType = "textureCube", A._texture = t, k.profile && (A.stats = t.stats), A.destroy = function() {
              t.decRef();
            }, A;
          }
          function Ze() {
            for (var u = 0; u < dt; ++u)
              e.activeTexture(Mr + u), e.bindTexture(Bt, null), Qe[u] = null;
            Lt(ct).forEach(_e), F.cubeCount = 0, F.textureCount = 0;
          }
          k.profile && (F.getTotalTextureSize = function() {
            var u = 0;
            return Object.keys(ct).forEach(function(M) {
              u += ct[M].stats.size;
            }), u;
          });
          function Dt() {
            for (var u = 0; u < dt; ++u) {
              var M = Qe[u];
              M && (M.bindCount = 0, M.unit = -1, Qe[u] = null);
            }
            Lt(ct).forEach(function(O) {
              O.texture = e.createTexture(), e.bindTexture(O.target, O.texture);
              for (var de = 0; de < 32; ++de)
                if ((O.mipmask & 1 << de) !== 0)
                  if (O.target === Bt)
                    e.texImage2D(
                      Bt,
                      de,
                      O.internalformat,
                      O.width >> de,
                      O.height >> de,
                      0,
                      O.internalformat,
                      O.type,
                      null
                    );
                  else
                    for (var Me = 0; Me < 6; ++Me)
                      e.texImage2D(
                        tn + Me,
                        de,
                        O.internalformat,
                        O.width >> de,
                        O.height >> de,
                        0,
                        O.internalformat,
                        O.type,
                        null
                      );
              st(O.texInfo, O.target);
            });
          }
          function or() {
            for (var u = 0; u < dt; ++u) {
              var M = Qe[u];
              M && (M.bindCount = 0, M.unit = -1, Qe[u] = null), e.activeTexture(Mr + u), e.bindTexture(Bt, null), e.bindTexture(Un, null);
            }
          }
          return {
            create2D: ke,
            createCube: $e,
            clear: Ze,
            getTexture: function(u) {
              return null;
            },
            restore: Dt,
            refresh: or
          };
        }
        var Xt = 36161, un = 32854, ki = 32855, Ii = 36194, Bi = 33189, Ni = 36168, Di = 34041, Pi = 35907, $i = 34836, Ui = 34842, zi = 34843, Mt = [];
        Mt[un] = 2, Mt[ki] = 2, Mt[Ii] = 2, Mt[Bi] = 2, Mt[Ni] = 1, Mt[Di] = 4, Mt[Pi] = 4, Mt[$i] = 16, Mt[Ui] = 8, Mt[zi] = 6;
        function ji(e, r, l) {
          return Mt[e] * r * l;
        }
        var cu = function(e, r, l, G, P) {
          var F = {
            rgba4: un,
            rgb565: Ii,
            "rgb5 a1": ki,
            depth: Bi,
            stencil: Ni,
            "depth stencil": Di
          };
          r.ext_srgb && (F.srgba = Pi), r.ext_color_buffer_half_float && (F.rgba16f = Ui, F.rgb16f = zi), r.webgl_color_buffer_float && (F.rgba32f = $i);
          var k = [];
          Object.keys(F).forEach(function(Y) {
            var ae = F[Y];
            k[ae] = Y;
          });
          var W = 0, q = {};
          function J(Y) {
            this.id = W++, this.refCount = 1, this.renderbuffer = Y, this.format = un, this.width = 0, this.height = 0, P.profile && (this.stats = { size: 0 });
          }
          J.prototype.decRef = function() {
            --this.refCount <= 0 && K(this);
          };
          function K(Y) {
            var ae = Y.renderbuffer;
            f(ae, "must not double destroy renderbuffer"), e.bindRenderbuffer(Xt, null), e.deleteRenderbuffer(ae), Y.renderbuffer = null, Y.refCount = 0, delete q[Y.id], G.renderbufferCount--;
          }
          function ne(Y, ae) {
            var T = new J(e.createRenderbuffer());
            q[T.id] = T, G.renderbufferCount++;
            function I(ue, z) {
              var le = 0, V = 0, ie = un;
              if (typeof ue == "object" && ue) {
                var X = ue;
                if ("shape" in X) {
                  var oe = X.shape;
                  f(
                    Array.isArray(oe) && oe.length >= 2,
                    "invalid renderbuffer shape"
                  ), le = oe[0] | 0, V = oe[1] | 0;
                } else
                  "radius" in X && (le = V = X.radius | 0), "width" in X && (le = X.width | 0), "height" in X && (V = X.height | 0);
                "format" in X && (f.parameter(
                  X.format,
                  F,
                  "invalid renderbuffer format"
                ), ie = F[X.format]);
              } else typeof ue == "number" ? (le = ue | 0, typeof z == "number" ? V = z | 0 : V = le) : ue ? f.raise("invalid arguments to renderbuffer constructor") : le = V = 1;
              if (f(
                le > 0 && V > 0 && le <= l.maxRenderbufferSize && V <= l.maxRenderbufferSize,
                "invalid renderbuffer size"
              ), !(le === T.width && V === T.height && ie === T.format))
                return I.width = T.width = le, I.height = T.height = V, T.format = ie, e.bindRenderbuffer(Xt, T.renderbuffer), e.renderbufferStorage(Xt, ie, le, V), f(
                  e.getError() === 0,
                  "invalid render buffer format"
                ), P.profile && (T.stats.size = ji(T.format, T.width, T.height)), I.format = k[T.format], I;
            }
            function Z(ue, z) {
              var le = ue | 0, V = z | 0 || le;
              return le === T.width && V === T.height || (f(
                le > 0 && V > 0 && le <= l.maxRenderbufferSize && V <= l.maxRenderbufferSize,
                "invalid renderbuffer size"
              ), I.width = T.width = le, I.height = T.height = V, e.bindRenderbuffer(Xt, T.renderbuffer), e.renderbufferStorage(Xt, T.format, le, V), f(
                e.getError() === 0,
                "invalid render buffer format"
              ), P.profile && (T.stats.size = ji(
                T.format,
                T.width,
                T.height
              ))), I;
            }
            return I(Y, ae), I.resize = Z, I._reglType = "renderbuffer", I._renderbuffer = T, P.profile && (I.stats = T.stats), I.destroy = function() {
              T.decRef();
            }, I;
          }
          P.profile && (G.getTotalRenderbufferSize = function() {
            var Y = 0;
            return Object.keys(q).forEach(function(ae) {
              Y += q[ae].stats.size;
            }), Y;
          });
          function se() {
            Lt(q).forEach(function(Y) {
              Y.renderbuffer = e.createRenderbuffer(), e.bindRenderbuffer(Xt, Y.renderbuffer), e.renderbufferStorage(Xt, Y.format, Y.width, Y.height);
            }), e.bindRenderbuffer(Xt, null);
          }
          return {
            create: ne,
            clear: function() {
              Lt(q).forEach(K);
            },
            restore: se
          };
        }, $t = 36160, aa = 36161, er = 3553, cn = 34069, Xi = 36064, Vi = 36096, Hi = 36128, Wi = 33306, Yi = 36053, lu = 36054, du = 36055, hu = 36057, mu = 36061, pu = 36193, vu = 5121, yu = 5126, qi = 6407, Ki = 6408, _u = 6402, bu = [
          qi,
          Ki
        ], ia = [];
        ia[Ki] = 4, ia[qi] = 3;
        var ln = [];
        ln[vu] = 1, ln[yu] = 4, ln[pu] = 2;
        var gu = 32854, Eu = 32855, xu = 36194, wu = 33189, Au = 36168, Qi = 34041, Tu = 35907, Su = 34836, Lu = 34842, Ru = 34843, Ou = [
          gu,
          Eu,
          xu,
          Tu,
          Lu,
          Ru,
          Su
        ], vr = {};
        vr[Yi] = "complete", vr[lu] = "incomplete attachment", vr[hu] = "incomplete dimensions", vr[du] = "incomplete, missing attachment", vr[mu] = "unsupported";
        function Cu(e, r, l, G, P, F) {
          var k = {
            cur: null,
            next: null,
            dirty: !1,
            setFBO: null
          }, W = ["rgba"], q = ["rgba4", "rgb565", "rgb5 a1"];
          r.ext_srgb && q.push("srgba"), r.ext_color_buffer_half_float && q.push("rgba16f", "rgb16f"), r.webgl_color_buffer_float && q.push("rgba32f");
          var J = ["uint8"];
          r.oes_texture_half_float && J.push("half float", "float16"), r.oes_texture_float && J.push("float", "float32");
          function K(fe, te, U) {
            this.target = fe, this.texture = te, this.renderbuffer = U;
            var ge = 0, Le = 0;
            te ? (ge = te.width, Le = te.height) : U && (ge = U.width, Le = U.height), this.width = ge, this.height = Le;
          }
          function ne(fe) {
            fe && (fe.texture && fe.texture._texture.decRef(), fe.renderbuffer && fe.renderbuffer._renderbuffer.decRef());
          }
          function se(fe, te, U) {
            if (fe)
              if (fe.texture) {
                var ge = fe.texture._texture, Le = Math.max(1, ge.width), he = Math.max(1, ge.height);
                f(
                  Le === te && he === U,
                  "inconsistent width/height for supplied texture"
                ), ge.refCount += 1;
              } else {
                var Ge = fe.renderbuffer._renderbuffer;
                f(
                  Ge.width === te && Ge.height === U,
                  "inconsistent width/height for renderbuffer"
                ), Ge.refCount += 1;
              }
          }
          function Y(fe, te) {
            te && (te.texture ? e.framebufferTexture2D(
              $t,
              fe,
              te.target,
              te.texture._texture.texture,
              0
            ) : e.framebufferRenderbuffer(
              $t,
              fe,
              aa,
              te.renderbuffer._renderbuffer.renderbuffer
            ));
          }
          function ae(fe) {
            var te = er, U = null, ge = null, Le = fe;
            typeof fe == "object" && (Le = fe.data, "target" in fe && (te = fe.target | 0)), f.type(Le, "function", "invalid attachment data");
            var he = Le._reglType;
            return he === "texture2d" ? (U = Le, f(te === er)) : he === "textureCube" ? (U = Le, f(
              te >= cn && te < cn + 6,
              "invalid cube map target"
            )) : he === "renderbuffer" ? (ge = Le, te = aa) : f.raise("invalid regl object for attachment"), new K(te, U, ge);
          }
          function T(fe, te, U, ge, Le) {
            if (U) {
              var he = G.create2D({
                width: fe,
                height: te,
                format: ge,
                type: Le
              });
              return he._texture.refCount = 0, new K(er, he, null);
            } else {
              var Ge = P.create({
                width: fe,
                height: te,
                format: ge
              });
              return Ge._renderbuffer.refCount = 0, new K(aa, null, Ge);
            }
          }
          function I(fe) {
            return fe && (fe.texture || fe.renderbuffer);
          }
          function Z(fe, te, U) {
            fe && (fe.texture ? fe.texture.resize(te, U) : fe.renderbuffer && fe.renderbuffer.resize(te, U), fe.width = te, fe.height = U);
          }
          var ue = 0, z = {};
          function le() {
            this.id = ue++, z[this.id] = this, this.framebuffer = e.createFramebuffer(), this.width = 0, this.height = 0, this.colorAttachments = [], this.depthAttachment = null, this.stencilAttachment = null, this.depthStencilAttachment = null;
          }
          function V(fe) {
            fe.colorAttachments.forEach(ne), ne(fe.depthAttachment), ne(fe.stencilAttachment), ne(fe.depthStencilAttachment);
          }
          function ie(fe) {
            var te = fe.framebuffer;
            f(te, "must not double destroy framebuffer"), e.deleteFramebuffer(te), fe.framebuffer = null, F.framebufferCount--, delete z[fe.id];
          }
          function X(fe) {
            var te;
            e.bindFramebuffer($t, fe.framebuffer);
            var U = fe.colorAttachments;
            for (te = 0; te < U.length; ++te)
              Y(Xi + te, U[te]);
            for (te = U.length; te < l.maxColorAttachments; ++te)
              e.framebufferTexture2D(
                $t,
                Xi + te,
                er,
                null,
                0
              );
            e.framebufferTexture2D(
              $t,
              Wi,
              er,
              null,
              0
            ), e.framebufferTexture2D(
              $t,
              Vi,
              er,
              null,
              0
            ), e.framebufferTexture2D(
              $t,
              Hi,
              er,
              null,
              0
            ), Y(Vi, fe.depthAttachment), Y(Hi, fe.stencilAttachment), Y(Wi, fe.depthStencilAttachment);
            var ge = e.checkFramebufferStatus($t);
            !e.isContextLost() && ge !== Yi && f.raise("framebuffer configuration not supported, status = " + vr[ge]), e.bindFramebuffer($t, k.next ? k.next.framebuffer : null), k.cur = k.next, e.getError();
          }
          function oe(fe, te) {
            var U = new le();
            F.framebufferCount++;
            function ge(he, Ge) {
              var we;
              f(
                k.next !== U,
                "can not update framebuffer which is currently in use"
              );
              var Ce = 0, ze = 0, rt = !0, ut = !0, Ne = null, ot = !0, He = "rgba", nt = "uint8", st = 1, ft = null, ct = null, dt = null, Qe = !1;
              if (typeof he == "number")
                Ce = he | 0, ze = Ge | 0 || Ce;
              else if (!he)
                Ce = ze = 1;
              else {
                f.type(he, "object", "invalid arguments for framebuffer");
                var Re = he;
                if ("shape" in Re) {
                  var ht = Re.shape;
                  f(
                    Array.isArray(ht) && ht.length >= 2,
                    "invalid shape for framebuffer"
                  ), Ce = ht[0], ze = ht[1];
                } else
                  "radius" in Re && (Ce = ze = Re.radius), "width" in Re && (Ce = Re.width), "height" in Re && (ze = Re.height);
                ("color" in Re || "colors" in Re) && (Ne = Re.color || Re.colors, Array.isArray(Ne) && f(
                  Ne.length === 1 || r.webgl_draw_buffers,
                  "multiple render targets not supported"
                )), Ne || ("colorCount" in Re && (st = Re.colorCount | 0, f(st > 0, "invalid color buffer count")), "colorTexture" in Re && (ot = !!Re.colorTexture, He = "rgba4"), "colorType" in Re && (nt = Re.colorType, ot ? (f(
                  r.oes_texture_float || !(nt === "float" || nt === "float32"),
                  "you must enable OES_texture_float in order to use floating point framebuffer objects"
                ), f(
                  r.oes_texture_half_float || !(nt === "half float" || nt === "float16"),
                  "you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects"
                )) : nt === "half float" || nt === "float16" ? (f(
                  r.ext_color_buffer_half_float,
                  "you must enable EXT_color_buffer_half_float to use 16-bit render buffers"
                ), He = "rgba16f") : (nt === "float" || nt === "float32") && (f(
                  r.webgl_color_buffer_float,
                  "you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers"
                ), He = "rgba32f"), f.oneOf(nt, J, "invalid color type")), "colorFormat" in Re && (He = Re.colorFormat, W.indexOf(He) >= 0 ? ot = !0 : q.indexOf(He) >= 0 ? ot = !1 : ot ? f.oneOf(
                  Re.colorFormat,
                  W,
                  "invalid color format for texture"
                ) : f.oneOf(
                  Re.colorFormat,
                  q,
                  "invalid color format for renderbuffer"
                ))), ("depthTexture" in Re || "depthStencilTexture" in Re) && (Qe = !!(Re.depthTexture || Re.depthStencilTexture), f(
                  !Qe || r.webgl_depth_texture,
                  "webgl_depth_texture extension not supported"
                )), "depth" in Re && (typeof Re.depth == "boolean" ? rt = Re.depth : (ft = Re.depth, ut = !1)), "stencil" in Re && (typeof Re.stencil == "boolean" ? ut = Re.stencil : (ct = Re.stencil, rt = !1)), "depthStencil" in Re && (typeof Re.depthStencil == "boolean" ? rt = ut = Re.depthStencil : (dt = Re.depthStencil, rt = !1, ut = !1));
              }
              var Ve = null, _e = null, ke = null, $e = null;
              if (Array.isArray(Ne))
                Ve = Ne.map(ae);
              else if (Ne)
                Ve = [ae(Ne)];
              else
                for (Ve = new Array(st), we = 0; we < st; ++we)
                  Ve[we] = T(
                    Ce,
                    ze,
                    ot,
                    He,
                    nt
                  );
              f(
                r.webgl_draw_buffers || Ve.length <= 1,
                "you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers."
              ), f(
                Ve.length <= l.maxColorAttachments,
                "too many color attachments, not supported"
              ), Ce = Ce || Ve[0].width, ze = ze || Ve[0].height, ft ? _e = ae(ft) : rt && !ut && (_e = T(
                Ce,
                ze,
                Qe,
                "depth",
                "uint32"
              )), ct ? ke = ae(ct) : ut && !rt && (ke = T(
                Ce,
                ze,
                !1,
                "stencil",
                "uint8"
              )), dt ? $e = ae(dt) : !ft && !ct && ut && rt && ($e = T(
                Ce,
                ze,
                Qe,
                "depth stencil",
                "depth stencil"
              )), f(
                !!ft + !!ct + !!dt <= 1,
                "invalid framebuffer configuration, can specify exactly one depth/stencil attachment"
              );
              var Ze = null;
              for (we = 0; we < Ve.length; ++we)
                if (se(Ve[we], Ce, ze), f(
                  !Ve[we] || Ve[we].texture && bu.indexOf(Ve[we].texture._texture.format) >= 0 || Ve[we].renderbuffer && Ou.indexOf(Ve[we].renderbuffer._renderbuffer.format) >= 0,
                  "framebuffer color attachment " + we + " is invalid"
                ), Ve[we] && Ve[we].texture) {
                  var Dt = ia[Ve[we].texture._texture.format] * ln[Ve[we].texture._texture.type];
                  Ze === null ? Ze = Dt : f(
                    Ze === Dt,
                    "all color attachments much have the same number of bits per pixel."
                  );
                }
              return se(_e, Ce, ze), f(
                !_e || _e.texture && _e.texture._texture.format === _u || _e.renderbuffer && _e.renderbuffer._renderbuffer.format === wu,
                "invalid depth attachment for framebuffer object"
              ), se(ke, Ce, ze), f(
                !ke || ke.renderbuffer && ke.renderbuffer._renderbuffer.format === Au,
                "invalid stencil attachment for framebuffer object"
              ), se($e, Ce, ze), f(
                !$e || $e.texture && $e.texture._texture.format === Qi || $e.renderbuffer && $e.renderbuffer._renderbuffer.format === Qi,
                "invalid depth-stencil attachment for framebuffer object"
              ), V(U), U.width = Ce, U.height = ze, U.colorAttachments = Ve, U.depthAttachment = _e, U.stencilAttachment = ke, U.depthStencilAttachment = $e, ge.color = Ve.map(I), ge.depth = I(_e), ge.stencil = I(ke), ge.depthStencil = I($e), ge.width = U.width, ge.height = U.height, X(U), ge;
            }
            function Le(he, Ge) {
              f(
                k.next !== U,
                "can not resize a framebuffer which is currently in use"
              );
              var we = Math.max(he | 0, 1), Ce = Math.max(Ge | 0 || we, 1);
              if (we === U.width && Ce === U.height)
                return ge;
              for (var ze = U.colorAttachments, rt = 0; rt < ze.length; ++rt)
                Z(ze[rt], we, Ce);
              return Z(U.depthAttachment, we, Ce), Z(U.stencilAttachment, we, Ce), Z(U.depthStencilAttachment, we, Ce), U.width = ge.width = we, U.height = ge.height = Ce, X(U), ge;
            }
            return ge(fe, te), p(ge, {
              resize: Le,
              _reglType: "framebuffer",
              _framebuffer: U,
              destroy: function() {
                ie(U), V(U);
              },
              use: function(he) {
                k.setFBO({
                  framebuffer: ge
                }, he);
              }
            });
          }
          function ye(fe) {
            var te = Array(6);
            function U(Le) {
              var he;
              f(
                te.indexOf(k.next) < 0,
                "can not update framebuffer which is currently in use"
              );
              var Ge = {
                color: null
              }, we = 0, Ce = null, ze = "rgba", rt = "uint8", ut = 1;
              if (typeof Le == "number")
                we = Le | 0;
              else if (!Le)
                we = 1;
              else {
                f.type(Le, "object", "invalid arguments for framebuffer");
                var Ne = Le;
                if ("shape" in Ne) {
                  var ot = Ne.shape;
                  f(
                    Array.isArray(ot) && ot.length >= 2,
                    "invalid shape for framebuffer"
                  ), f(
                    ot[0] === ot[1],
                    "cube framebuffer must be square"
                  ), we = ot[0];
                } else
                  "radius" in Ne && (we = Ne.radius | 0), "width" in Ne ? (we = Ne.width | 0, "height" in Ne && f(Ne.height === we, "must be square")) : "height" in Ne && (we = Ne.height | 0);
                ("color" in Ne || "colors" in Ne) && (Ce = Ne.color || Ne.colors, Array.isArray(Ce) && f(
                  Ce.length === 1 || r.webgl_draw_buffers,
                  "multiple render targets not supported"
                )), Ce || ("colorCount" in Ne && (ut = Ne.colorCount | 0, f(ut > 0, "invalid color buffer count")), "colorType" in Ne && (f.oneOf(
                  Ne.colorType,
                  J,
                  "invalid color type"
                ), rt = Ne.colorType), "colorFormat" in Ne && (ze = Ne.colorFormat, f.oneOf(
                  Ne.colorFormat,
                  W,
                  "invalid color format for texture"
                ))), "depth" in Ne && (Ge.depth = Ne.depth), "stencil" in Ne && (Ge.stencil = Ne.stencil), "depthStencil" in Ne && (Ge.depthStencil = Ne.depthStencil);
              }
              var He;
              if (Ce)
                if (Array.isArray(Ce))
                  for (He = [], he = 0; he < Ce.length; ++he)
                    He[he] = Ce[he];
                else
                  He = [Ce];
              else {
                He = Array(ut);
                var nt = {
                  radius: we,
                  format: ze,
                  type: rt
                };
                for (he = 0; he < ut; ++he)
                  He[he] = G.createCube(nt);
              }
              for (Ge.color = Array(He.length), he = 0; he < He.length; ++he) {
                var st = He[he];
                f(
                  typeof st == "function" && st._reglType === "textureCube",
                  "invalid cube map"
                ), we = we || st.width, f(
                  st.width === we && st.height === we,
                  "invalid cube map shape"
                ), Ge.color[he] = {
                  target: cn,
                  data: He[he]
                };
              }
              for (he = 0; he < 6; ++he) {
                for (var ft = 0; ft < He.length; ++ft)
                  Ge.color[ft].target = cn + he;
                he > 0 && (Ge.depth = te[0].depth, Ge.stencil = te[0].stencil, Ge.depthStencil = te[0].depthStencil), te[he] ? te[he](Ge) : te[he] = oe(Ge);
              }
              return p(U, {
                width: we,
                height: we,
                color: He
              });
            }
            function ge(Le) {
              var he, Ge = Le | 0;
              if (f(
                Ge > 0 && Ge <= l.maxCubeMapSize,
                "invalid radius for cube fbo"
              ), Ge === U.width)
                return U;
              var we = U.color;
              for (he = 0; he < we.length; ++he)
                we[he].resize(Ge);
              for (he = 0; he < 6; ++he)
                te[he].resize(Ge);
              return U.width = U.height = Ge, U;
            }
            return U(fe), p(U, {
              faces: te,
              resize: ge,
              _reglType: "framebufferCube",
              destroy: function() {
                te.forEach(function(Le) {
                  Le.destroy();
                });
              }
            });
          }
          function Ee() {
            k.cur = null, k.next = null, k.dirty = !0, Lt(z).forEach(function(fe) {
              fe.framebuffer = e.createFramebuffer(), X(fe);
            });
          }
          return p(k, {
            getFramebuffer: function(fe) {
              if (typeof fe == "function" && fe._reglType === "framebuffer") {
                var te = fe._framebuffer;
                if (te instanceof le)
                  return te;
              }
              return null;
            },
            create: oe,
            createCube: ye,
            clear: function() {
              Lt(z).forEach(ie);
            },
            restore: Ee
          });
        }
        var Fu = 5126, Zi = 34962;
        function oa() {
          this.state = 0, this.x = 0, this.y = 0, this.z = 0, this.w = 0, this.buffer = null, this.size = 0, this.normalized = !1, this.type = Fu, this.offset = 0, this.stride = 0, this.divisor = 0;
        }
        function Gu(e, r, l, G, P) {
          for (var F = l.maxAttributes, k = new Array(F), W = 0; W < F; ++W)
            k[W] = new oa();
          var q = 0, J = {}, K = {
            Record: oa,
            scope: {},
            state: k,
            currentVAO: null,
            targetVAO: null,
            restore: se() ? z : function() {
            },
            createVAO: le,
            getVAO: ae,
            destroyBuffer: ne,
            setVAO: se() ? T : I,
            clear: se() ? Z : function() {
            }
          };
          function ne(V) {
            for (var ie = 0; ie < k.length; ++ie) {
              var X = k[ie];
              X.buffer === V && (e.disableVertexAttribArray(ie), X.buffer = null);
            }
          }
          function se() {
            return r.oes_vertex_array_object;
          }
          function Y() {
            return r.angle_instanced_arrays;
          }
          function ae(V) {
            return typeof V == "function" && V._vao ? V._vao : null;
          }
          function T(V) {
            if (V !== K.currentVAO) {
              var ie = se();
              V ? ie.bindVertexArrayOES(V.vao) : ie.bindVertexArrayOES(null), K.currentVAO = V;
            }
          }
          function I(V) {
            if (V !== K.currentVAO) {
              if (V)
                V.bindAttrs();
              else
                for (var ie = Y(), X = 0; X < k.length; ++X) {
                  var oe = k[X];
                  oe.buffer ? (e.enableVertexAttribArray(X), e.vertexAttribPointer(X, oe.size, oe.type, oe.normalized, oe.stride, oe.offfset), ie && oe.divisor && ie.vertexAttribDivisorANGLE(X, oe.divisor)) : (e.disableVertexAttribArray(X), e.vertexAttrib4f(X, oe.x, oe.y, oe.z, oe.w));
                }
              K.currentVAO = V;
            }
          }
          function Z() {
            Lt(J).forEach(function(V) {
              V.destroy();
            });
          }
          function ue() {
            this.id = ++q, this.attributes = [];
            var V = se();
            V ? this.vao = V.createVertexArrayOES() : this.vao = null, J[this.id] = this, this.buffers = [];
          }
          ue.prototype.bindAttrs = function() {
            for (var V = Y(), ie = this.attributes, X = 0; X < ie.length; ++X) {
              var oe = ie[X];
              oe.buffer ? (e.enableVertexAttribArray(X), e.bindBuffer(Zi, oe.buffer.buffer), e.vertexAttribPointer(X, oe.size, oe.type, oe.normalized, oe.stride, oe.offset), V && oe.divisor && V.vertexAttribDivisorANGLE(X, oe.divisor)) : (e.disableVertexAttribArray(X), e.vertexAttrib4f(X, oe.x, oe.y, oe.z, oe.w));
            }
            for (var ye = ie.length; ye < F; ++ye)
              e.disableVertexAttribArray(ye);
          }, ue.prototype.refresh = function() {
            var V = se();
            V && (V.bindVertexArrayOES(this.vao), this.bindAttrs(), K.currentVAO = this);
          }, ue.prototype.destroy = function() {
            if (this.vao) {
              var V = se();
              this === K.currentVAO && (K.currentVAO = null, V.bindVertexArrayOES(null)), V.deleteVertexArrayOES(this.vao), this.vao = null;
            }
            J[this.id] && (delete J[this.id], G.vaoCount -= 1);
          };
          function z() {
            var V = se();
            V && Lt(J).forEach(function(ie) {
              ie.refresh();
            });
          }
          function le(V) {
            var ie = new ue();
            G.vaoCount += 1;
            function X(oe) {
              f(Array.isArray(oe), "arguments to vertex array constructor must be an array"), f(oe.length < F, "too many attributes"), f(oe.length > 0, "must specify at least one attribute");
              var ye = {}, Ee = ie.attributes;
              Ee.length = oe.length;
              for (var fe = 0; fe < oe.length; ++fe) {
                var te = oe[fe], U = Ee[fe] = new oa(), ge = te.data || te;
                if (Array.isArray(ge) || y(ge) || Gt(ge)) {
                  var Le;
                  ie.buffers[fe] && (Le = ie.buffers[fe], y(ge) && Le._buffer.byteLength >= ge.byteLength ? Le.subdata(ge) : (Le.destroy(), ie.buffers[fe] = null)), ie.buffers[fe] || (Le = ie.buffers[fe] = P.create(te, Zi, !1, !0)), U.buffer = P.getBuffer(Le), U.size = U.buffer.dimension | 0, U.normalized = !1, U.type = U.buffer.dtype, U.offset = 0, U.stride = 0, U.divisor = 0, U.state = 1, ye[fe] = 1;
                } else P.getBuffer(te) ? (U.buffer = P.getBuffer(te), U.size = U.buffer.dimension | 0, U.normalized = !1, U.type = U.buffer.dtype, U.offset = 0, U.stride = 0, U.divisor = 0, U.state = 1) : P.getBuffer(te.buffer) ? (U.buffer = P.getBuffer(te.buffer), U.size = (+te.size || U.buffer.dimension) | 0, U.normalized = !!te.normalized || !1, "type" in te ? (f.parameter(te.type, Kt, "invalid buffer type"), U.type = Kt[te.type]) : U.type = U.buffer.dtype, U.offset = (te.offset || 0) | 0, U.stride = (te.stride || 0) | 0, U.divisor = (te.divisor || 0) | 0, U.state = 1, f(U.size >= 1 && U.size <= 4, "size must be between 1 and 4"), f(U.offset >= 0, "invalid offset"), f(U.stride >= 0 && U.stride <= 255, "stride must be between 0 and 255"), f(U.divisor >= 0, "divisor must be positive"), f(!U.divisor || !!r.angle_instanced_arrays, "ANGLE_instanced_arrays must be enabled to use divisor")) : "x" in te ? (f(fe > 0, "first attribute must not be a constant"), U.x = +te.x || 0, U.y = +te.y || 0, U.z = +te.z || 0, U.w = +te.w || 0, U.state = 2) : f(!1, "invalid attribute spec for location " + fe);
              }
              for (var he = 0; he < ie.buffers.length; ++he)
                !ye[he] && ie.buffers[he] && (ie.buffers[he].destroy(), ie.buffers[he] = null);
              return ie.refresh(), X;
            }
            return X.destroy = function() {
              for (var oe = 0; oe < ie.buffers.length; ++oe)
                ie.buffers[oe] && ie.buffers[oe].destroy();
              ie.buffers.length = 0, ie.destroy();
            }, X._vao = ie, X._reglType = "vao", X(V);
          }
          return K;
        }
        var Ji = 35632, Mu = 35633, ku = 35718, Iu = 35721;
        function Bu(e, r, l, G) {
          var P = {}, F = {};
          function k(T, I, Z, ue) {
            this.name = T, this.id = I, this.location = Z, this.info = ue;
          }
          function W(T, I) {
            for (var Z = 0; Z < T.length; ++Z)
              if (T[Z].id === I.id) {
                T[Z].location = I.location;
                return;
              }
            T.push(I);
          }
          function q(T, I, Z) {
            var ue = T === Ji ? P : F, z = ue[I];
            if (!z) {
              var le = r.str(I);
              z = e.createShader(T), e.shaderSource(z, le), e.compileShader(z), f.shaderError(e, z, le, T, Z), ue[I] = z;
            }
            return z;
          }
          var J = {}, K = [], ne = 0;
          function se(T, I) {
            this.id = ne++, this.fragId = T, this.vertId = I, this.program = null, this.uniforms = [], this.attributes = [], this.refCount = 1, G.profile && (this.stats = {
              uniformsCount: 0,
              attributesCount: 0
            });
          }
          function Y(T, I, Z) {
            var ue, z, le = q(Ji, T.fragId), V = q(Mu, T.vertId), ie = T.program = e.createProgram();
            if (e.attachShader(ie, le), e.attachShader(ie, V), Z)
              for (ue = 0; ue < Z.length; ++ue) {
                var X = Z[ue];
                e.bindAttribLocation(ie, X[0], X[1]);
              }
            e.linkProgram(ie), f.linkError(
              e,
              ie,
              r.str(T.fragId),
              r.str(T.vertId),
              I
            );
            var oe = e.getProgramParameter(ie, ku);
            G.profile && (T.stats.uniformsCount = oe);
            var ye = T.uniforms;
            for (ue = 0; ue < oe; ++ue)
              if (z = e.getActiveUniform(ie, ue), z)
                if (z.size > 1)
                  for (var Ee = 0; Ee < z.size; ++Ee) {
                    var fe = z.name.replace("[0]", "[" + Ee + "]");
                    W(ye, new k(
                      fe,
                      r.id(fe),
                      e.getUniformLocation(ie, fe),
                      z
                    ));
                  }
                else
                  W(ye, new k(
                    z.name,
                    r.id(z.name),
                    e.getUniformLocation(ie, z.name),
                    z
                  ));
            var te = e.getProgramParameter(ie, Iu);
            G.profile && (T.stats.attributesCount = te);
            var U = T.attributes;
            for (ue = 0; ue < te; ++ue)
              z = e.getActiveAttrib(ie, ue), z && W(U, new k(
                z.name,
                r.id(z.name),
                e.getAttribLocation(ie, z.name),
                z
              ));
          }
          G.profile && (l.getMaxUniformsCount = function() {
            var T = 0;
            return K.forEach(function(I) {
              I.stats.uniformsCount > T && (T = I.stats.uniformsCount);
            }), T;
          }, l.getMaxAttributesCount = function() {
            var T = 0;
            return K.forEach(function(I) {
              I.stats.attributesCount > T && (T = I.stats.attributesCount);
            }), T;
          });
          function ae() {
            P = {}, F = {};
            for (var T = 0; T < K.length; ++T)
              Y(K[T], null, K[T].attributes.map(function(I) {
                return [I.location, I.name];
              }));
          }
          return {
            clear: function() {
              var T = e.deleteShader.bind(e);
              Lt(P).forEach(T), P = {}, Lt(F).forEach(T), F = {}, K.forEach(function(I) {
                e.deleteProgram(I.program);
              }), K.length = 0, J = {}, l.shaderCount = 0;
            },
            program: function(T, I, Z, ue) {
              f.command(T >= 0, "missing vertex shader", Z), f.command(I >= 0, "missing fragment shader", Z);
              var z = J[I];
              z || (z = J[I] = {});
              var le = z[T];
              if (le && (le.refCount++, !ue))
                return le;
              var V = new se(I, T);
              return l.shaderCount++, Y(V, Z, ue), le || (z[T] = V), K.push(V), p(V, {
                destroy: function() {
                  if (V.refCount--, V.refCount <= 0) {
                    e.deleteProgram(V.program);
                    var ie = K.indexOf(V);
                    K.splice(ie, 1), l.shaderCount--;
                  }
                  z[V.vertId].refCount <= 0 && (e.deleteShader(F[V.vertId]), delete F[V.vertId], delete J[V.fragId][V.vertId]), Object.keys(J[V.fragId]).length || (e.deleteShader(P[V.fragId]), delete P[V.fragId], delete J[V.fragId]);
                }
              });
            },
            restore: ae,
            shader: q,
            frag: -1,
            vert: -1
          };
        }
        var Nu = 6408, kr = 5121, Du = 3333, dn = 5126;
        function Pu(e, r, l, G, P, F, k) {
          function W(K) {
            var ne;
            r.next === null ? (f(
              P.preserveDrawingBuffer,
              'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer'
            ), ne = kr) : (f(
              r.next.colorAttachments[0].texture !== null,
              "You cannot read from a renderbuffer"
            ), ne = r.next.colorAttachments[0].texture._texture.type, F.oes_texture_float ? (f(
              ne === kr || ne === dn,
              "Reading from a framebuffer is only allowed for the types 'uint8' and 'float'"
            ), ne === dn && f(k.readFloat, "Reading 'float' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float")) : f(
              ne === kr,
              "Reading from a framebuffer is only allowed for the type 'uint8'"
            ));
            var se = 0, Y = 0, ae = G.framebufferWidth, T = G.framebufferHeight, I = null;
            y(K) ? I = K : K && (f.type(K, "object", "invalid arguments to regl.read()"), se = K.x | 0, Y = K.y | 0, f(
              se >= 0 && se < G.framebufferWidth,
              "invalid x offset for regl.read"
            ), f(
              Y >= 0 && Y < G.framebufferHeight,
              "invalid y offset for regl.read"
            ), ae = (K.width || G.framebufferWidth - se) | 0, T = (K.height || G.framebufferHeight - Y) | 0, I = K.data || null), I && (ne === kr ? f(
              I instanceof Uint8Array,
              "buffer must be 'Uint8Array' when reading from a framebuffer of type 'uint8'"
            ) : ne === dn && f(
              I instanceof Float32Array,
              "buffer must be 'Float32Array' when reading from a framebuffer of type 'float'"
            )), f(
              ae > 0 && ae + se <= G.framebufferWidth,
              "invalid width for read pixels"
            ), f(
              T > 0 && T + Y <= G.framebufferHeight,
              "invalid height for read pixels"
            ), l();
            var Z = ae * T * 4;
            return I || (ne === kr ? I = new Uint8Array(Z) : ne === dn && (I = I || new Float32Array(Z))), f.isTypedArray(I, "data buffer for regl.read() must be a typedarray"), f(I.byteLength >= Z, "data buffer for regl.read() too small"), e.pixelStorei(Du, 4), e.readPixels(
              se,
              Y,
              ae,
              T,
              Nu,
              ne,
              I
            ), I;
          }
          function q(K) {
            var ne;
            return r.setFBO({
              framebuffer: K.framebuffer
            }, function() {
              ne = W(K);
            }), ne;
          }
          function J(K) {
            return !K || !("framebuffer" in K) ? W(K) : q(K);
          }
          return J;
        }
        function yr(e) {
          return Array.prototype.slice.call(e);
        }
        function _r(e) {
          return yr(e).join("");
        }
        function $u() {
          var e = 0, r = [], l = [];
          function G(ne) {
            for (var se = 0; se < l.length; ++se)
              if (l[se] === ne)
                return r[se];
            var Y = "g" + e++;
            return r.push(Y), l.push(ne), Y;
          }
          function P() {
            var ne = [];
            function se() {
              ne.push.apply(ne, yr(arguments));
            }
            var Y = [];
            function ae() {
              var T = "v" + e++;
              return Y.push(T), arguments.length > 0 && (ne.push(T, "="), ne.push.apply(ne, yr(arguments)), ne.push(";")), T;
            }
            return p(se, {
              def: ae,
              toString: function() {
                return _r([
                  Y.length > 0 ? "var " + Y.join(",") + ";" : "",
                  _r(ne)
                ]);
              }
            });
          }
          function F() {
            var ne = P(), se = P(), Y = ne.toString, ae = se.toString;
            function T(I, Z) {
              se(I, Z, "=", ne.def(I, Z), ";");
            }
            return p(function() {
              ne.apply(ne, yr(arguments));
            }, {
              def: ne.def,
              entry: ne,
              exit: se,
              save: T,
              set: function(I, Z, ue) {
                T(I, Z), ne(I, Z, "=", ue, ";");
              },
              toString: function() {
                return Y() + ae();
              }
            });
          }
          function k() {
            var ne = _r(arguments), se = F(), Y = F(), ae = se.toString, T = Y.toString;
            return p(se, {
              then: function() {
                return se.apply(se, yr(arguments)), this;
              },
              else: function() {
                return Y.apply(Y, yr(arguments)), this;
              },
              toString: function() {
                var I = T();
                return I && (I = "else{" + I + "}"), _r([
                  "if(",
                  ne,
                  "){",
                  ae(),
                  "}",
                  I
                ]);
              }
            });
          }
          var W = P(), q = {};
          function J(ne, se) {
            var Y = [];
            function ae() {
              var z = "a" + Y.length;
              return Y.push(z), z;
            }
            se = se || 0;
            for (var T = 0; T < se; ++T)
              ae();
            var I = F(), Z = I.toString, ue = q[ne] = p(I, {
              arg: ae,
              toString: function() {
                return _r([
                  "function(",
                  Y.join(),
                  "){",
                  Z(),
                  "}"
                ]);
              }
            });
            return ue;
          }
          function K() {
            var ne = [
              '"use strict";',
              W,
              "return {"
            ];
            Object.keys(q).forEach(function(ae) {
              ne.push('"', ae, '":', q[ae].toString(), ",");
            }), ne.push("}");
            var se = _r(ne).replace(/;/g, `;
`).replace(/}/g, `}
`).replace(/{/g, `{
`), Y = Function.apply(null, r.concat(se));
            return Y.apply(null, l);
          }
          return {
            global: W,
            link: G,
            block: P,
            proc: J,
            scope: F,
            cond: k,
            compile: K
          };
        }
        var br = "xyzw".split(""), eo = 5121, gr = 1, sa = 2, fa = 0, ua = 1, ca = 2, la = 3, hn = 4, to = 5, ro = 6, no = "dither", ao = "blend.enable", io = "blend.color", da = "blend.equation", ha = "blend.func", oo = "depth.enable", so = "depth.func", fo = "depth.range", uo = "depth.mask", ma = "colorMask", co = "cull.enable", lo = "cull.face", pa = "frontFace", va = "lineWidth", ho = "polygonOffset.enable", ya = "polygonOffset.offset", mo = "sample.alpha", po = "sample.enable", _a = "sample.coverage", vo = "stencil.enable", yo = "stencil.mask", ba = "stencil.func", ga = "stencil.opFront", Ir = "stencil.opBack", _o = "scissor.enable", mn = "scissor.box", Ut = "viewport", Br = "profile", tr = "framebuffer", Nr = "vert", Dr = "frag", rr = "elements", nr = "primitive", ar = "count", pn = "offset", vn = "instances", Pr = "vao", Ea = "Width", xa = "Height", Er = tr + Ea, xr = tr + xa, Uu = Ut + Ea, zu = Ut + xa, bo = "drawingBuffer", go = bo + Ea, Eo = bo + xa, ju = [
          ha,
          da,
          ba,
          ga,
          Ir,
          _a,
          Ut,
          mn,
          ya
        ], wr = 34962, Xu = 34963, Vu = 35632, Hu = 35633, xo = 3553, Wu = 34067, Yu = 2884, qu = 3042, Ku = 3024, Qu = 2960, Zu = 2929, Ju = 3089, ec = 32823, tc = 32926, rc = 32928, wa = 5126, yn = 35664, _n = 35665, bn = 35666, Aa = 5124, gn = 35667, En = 35668, xn = 35669, Ta = 35670, wn = 35671, An = 35672, Tn = 35673, $r = 35674, Ur = 35675, zr = 35676, jr = 35678, Xr = 35680, wo = 4, Vr = 1028, ir = 1029, Ao = 2304, Sa = 2305, nc = 32775, ac = 32776, ic = 519, Vt = 7680, To = 0, So = 1, Lo = 32774, oc = 513, Ro = 36160, sc = 36064, Nt = {
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
        }, Oo = [
          "constant color, constant alpha",
          "one minus constant color, constant alpha",
          "constant color, one minus constant alpha",
          "one minus constant color, one minus constant alpha",
          "constant alpha, constant color",
          "constant alpha, one minus constant color",
          "one minus constant alpha, constant color",
          "one minus constant alpha, one minus constant color"
        ], Ar = {
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
        }, Ht = {
          0: 0,
          zero: 0,
          keep: 7680,
          replace: 7681,
          increment: 7682,
          decrement: 7683,
          "increment wrap": 34055,
          "decrement wrap": 34056,
          invert: 5386
        }, Co = {
          frag: Vu,
          vert: Hu
        }, La = {
          cw: Ao,
          ccw: Sa
        };
        function Sn(e) {
          return Array.isArray(e) || y(e) || Gt(e);
        }
        function Fo(e) {
          return e.sort(function(r, l) {
            return r === Ut ? -1 : l === Ut ? 1 : r < l ? -1 : 1;
          });
        }
        function _t(e, r, l, G) {
          this.thisDep = e, this.contextDep = r, this.propDep = l, this.append = G;
        }
        function Wt(e) {
          return e && !(e.thisDep || e.contextDep || e.propDep);
        }
        function tt(e) {
          return new _t(!1, !1, !1, e);
        }
        function xt(e, r) {
          var l = e.type;
          if (l === fa) {
            var G = e.data.length;
            return new _t(
              !0,
              G >= 1,
              G >= 2,
              r
            );
          } else if (l === hn) {
            var P = e.data;
            return new _t(
              P.thisDep,
              P.contextDep,
              P.propDep,
              r
            );
          } else {
            if (l === to)
              return new _t(
                !1,
                !1,
                !1,
                r
              );
            if (l === ro) {
              for (var F = !1, k = !1, W = !1, q = 0; q < e.data.length; ++q) {
                var J = e.data[q];
                if (J.type === ua)
                  W = !0;
                else if (J.type === ca)
                  k = !0;
                else if (J.type === la)
                  F = !0;
                else if (J.type === fa) {
                  F = !0;
                  var K = J.data;
                  K >= 1 && (k = !0), K >= 2 && (W = !0);
                } else J.type === hn && (F = F || J.data.thisDep, k = k || J.data.contextDep, W = W || J.data.propDep);
              }
              return new _t(
                F,
                k,
                W,
                r
              );
            } else
              return new _t(
                l === la,
                l === ca,
                l === ua,
                r
              );
          }
        }
        var Go = new _t(!1, !1, !1, function() {
        });
        function fc(e, r, l, G, P, F, k, W, q, J, K, ne, se, Y, ae) {
          var T = J.Record, I = {
            add: 32774,
            subtract: 32778,
            "reverse subtract": 32779
          };
          l.ext_blend_minmax && (I.min = nc, I.max = ac);
          var Z = l.angle_instanced_arrays, ue = l.webgl_draw_buffers, z = {
            dirty: !0,
            profile: ae.profile
          }, le = {}, V = [], ie = {}, X = {};
          function oe(o) {
            return o.replace(".", "_");
          }
          function ye(o, t, h) {
            var A = oe(o);
            V.push(o), le[A] = z[A] = !!h, ie[A] = t;
          }
          function Ee(o, t, h) {
            var A = oe(o);
            V.push(o), Array.isArray(h) ? (z[A] = h.slice(), le[A] = h.slice()) : z[A] = le[A] = h, X[A] = t;
          }
          ye(no, Ku), ye(ao, qu), Ee(io, "blendColor", [0, 0, 0, 0]), Ee(
            da,
            "blendEquationSeparate",
            [Lo, Lo]
          ), Ee(
            ha,
            "blendFuncSeparate",
            [So, To, So, To]
          ), ye(oo, Zu, !0), Ee(so, "depthFunc", oc), Ee(fo, "depthRange", [0, 1]), Ee(uo, "depthMask", !0), Ee(ma, ma, [!0, !0, !0, !0]), ye(co, Yu), Ee(lo, "cullFace", ir), Ee(pa, pa, Sa), Ee(va, va, 1), ye(ho, ec), Ee(ya, "polygonOffset", [0, 0]), ye(mo, tc), ye(po, rc), Ee(_a, "sampleCoverage", [1, !1]), ye(vo, Qu), Ee(yo, "stencilMask", -1), Ee(ba, "stencilFunc", [ic, 0, -1]), Ee(
            ga,
            "stencilOpSeparate",
            [Vr, Vt, Vt, Vt]
          ), Ee(
            Ir,
            "stencilOpSeparate",
            [ir, Vt, Vt, Vt]
          ), ye(_o, Ju), Ee(
            mn,
            "scissor",
            [0, 0, e.drawingBufferWidth, e.drawingBufferHeight]
          ), Ee(
            Ut,
            Ut,
            [0, 0, e.drawingBufferWidth, e.drawingBufferHeight]
          );
          var fe = {
            gl: e,
            context: se,
            strings: r,
            next: le,
            current: z,
            draw: ne,
            elements: F,
            buffer: P,
            shader: K,
            attributes: J.state,
            vao: J,
            uniforms: q,
            framebuffer: W,
            extensions: l,
            timer: Y,
            isBufferArgs: Sn
          }, te = {
            primTypes: ur,
            compareFuncs: Ar,
            blendFuncs: Nt,
            blendEquations: I,
            stencilOps: Ht,
            glTypes: Kt,
            orientationType: La
          };
          f.optional(function() {
            fe.isArrayLike = Ke;
          }), ue && (te.backBuffer = [ir], te.drawBuffer = Et(G.maxDrawbuffers, function(o) {
            return o === 0 ? [0] : Et(o, function(t) {
              return sc + t;
            });
          }));
          var U = 0;
          function ge() {
            var o = $u(), t = o.link, h = o.global;
            o.id = U++, o.batchId = "0";
            var A = t(fe), S = o.shared = {
              props: "a0"
            };
            Object.keys(fe).forEach(function(d) {
              S[d] = h.def(A, ".", d);
            }), f.optional(function() {
              o.CHECK = t(f), o.commandStr = f.guessCommand(), o.command = t(o.commandStr), o.assert = function(d, i, E) {
                d(
                  "if(!(",
                  i,
                  "))",
                  this.CHECK,
                  ".commandRaise(",
                  t(E),
                  ",",
                  this.command,
                  ");"
                );
              }, te.invalidBlendCombinations = Oo;
            });
            var v = o.next = {}, m = o.current = {};
            Object.keys(X).forEach(function(d) {
              Array.isArray(z[d]) && (v[d] = h.def(S.next, ".", d), m[d] = h.def(S.current, ".", d));
            });
            var g = o.constants = {};
            Object.keys(te).forEach(function(d) {
              g[d] = h.def(JSON.stringify(te[d]));
            }), o.invoke = function(d, i) {
              switch (i.type) {
                case fa:
                  var E = [
                    "this",
                    S.context,
                    S.props,
                    o.batchId
                  ];
                  return d.def(
                    t(i.data),
                    ".call(",
                    E.slice(0, Math.max(i.data.length + 1, 4)),
                    ")"
                  );
                case ua:
                  return d.def(S.props, i.data);
                case ca:
                  return d.def(S.context, i.data);
                case la:
                  return d.def("this", i.data);
                case hn:
                  return i.data.append(o, d), i.data.ref;
                case to:
                  return i.data.toString();
                case ro:
                  return i.data.map(function(L) {
                    return o.invoke(d, L);
                  });
              }
            }, o.attribCache = {};
            var s = {};
            return o.scopeAttrib = function(d) {
              var i = r.id(d);
              if (i in s)
                return s[i];
              var E = J.scope[i];
              E || (E = J.scope[i] = new T());
              var L = s[i] = t(E);
              return L;
            }, o;
          }
          function Le(o) {
            var t = o.static, h = o.dynamic, A;
            if (Br in t) {
              var S = !!t[Br];
              A = tt(function(m, g) {
                return S;
              }), A.enable = S;
            } else if (Br in h) {
              var v = h[Br];
              A = xt(v, function(m, g) {
                return m.invoke(g, v);
              });
            }
            return A;
          }
          function he(o, t) {
            var h = o.static, A = o.dynamic;
            if (tr in h) {
              var S = h[tr];
              return S ? (S = W.getFramebuffer(S), f.command(S, "invalid framebuffer object"), tt(function(m, g) {
                var s = m.link(S), d = m.shared;
                g.set(
                  d.framebuffer,
                  ".next",
                  s
                );
                var i = d.context;
                return g.set(
                  i,
                  "." + Er,
                  s + ".width"
                ), g.set(
                  i,
                  "." + xr,
                  s + ".height"
                ), s;
              })) : tt(function(m, g) {
                var s = m.shared;
                g.set(
                  s.framebuffer,
                  ".next",
                  "null"
                );
                var d = s.context;
                return g.set(
                  d,
                  "." + Er,
                  d + "." + go
                ), g.set(
                  d,
                  "." + xr,
                  d + "." + Eo
                ), "null";
              });
            } else if (tr in A) {
              var v = A[tr];
              return xt(v, function(m, g) {
                var s = m.invoke(g, v), d = m.shared, i = d.framebuffer, E = g.def(
                  i,
                  ".getFramebuffer(",
                  s,
                  ")"
                );
                f.optional(function() {
                  m.assert(
                    g,
                    "!" + s + "||" + E,
                    "invalid framebuffer object"
                  );
                }), g.set(
                  i,
                  ".next",
                  E
                );
                var L = d.context;
                return g.set(
                  L,
                  "." + Er,
                  E + "?" + E + ".width:" + L + "." + go
                ), g.set(
                  L,
                  "." + xr,
                  E + "?" + E + ".height:" + L + "." + Eo
                ), E;
              });
            } else
              return null;
          }
          function Ge(o, t, h) {
            var A = o.static, S = o.dynamic;
            function v(s) {
              if (s in A) {
                var d = A[s];
                f.commandType(d, "object", "invalid " + s, h.commandStr);
                var i = !0, E = d.x | 0, L = d.y | 0, D, $;
                return "width" in d ? (D = d.width | 0, f.command(D >= 0, "invalid " + s, h.commandStr)) : i = !1, "height" in d ? ($ = d.height | 0, f.command($ >= 0, "invalid " + s, h.commandStr)) : i = !1, new _t(
                  !i && t && t.thisDep,
                  !i && t && t.contextDep,
                  !i && t && t.propDep,
                  function(ve, Oe) {
                    var me = ve.shared.context, be = D;
                    "width" in d || (be = Oe.def(me, ".", Er, "-", E));
                    var Te = $;
                    return "height" in d || (Te = Oe.def(me, ".", xr, "-", L)), [E, L, be, Te];
                  }
                );
              } else if (s in S) {
                var B = S[s], Q = xt(B, function(ve, Oe) {
                  var me = ve.invoke(Oe, B);
                  f.optional(function() {
                    ve.assert(
                      Oe,
                      me + "&&typeof " + me + '==="object"',
                      "invalid " + s
                    );
                  });
                  var be = ve.shared.context, Te = Oe.def(me, ".x|0"), je = Oe.def(me, ".y|0"), qe = Oe.def(
                    '"width" in ',
                    me,
                    "?",
                    me,
                    ".width|0:",
                    "(",
                    be,
                    ".",
                    Er,
                    "-",
                    Te,
                    ")"
                  ), bt = Oe.def(
                    '"height" in ',
                    me,
                    "?",
                    me,
                    ".height|0:",
                    "(",
                    be,
                    ".",
                    xr,
                    "-",
                    je,
                    ")"
                  );
                  return f.optional(function() {
                    ve.assert(
                      Oe,
                      qe + ">=0&&" + bt + ">=0",
                      "invalid " + s
                    );
                  }), [Te, je, qe, bt];
                });
                return t && (Q.thisDep = Q.thisDep || t.thisDep, Q.contextDep = Q.contextDep || t.contextDep, Q.propDep = Q.propDep || t.propDep), Q;
              } else return t ? new _t(
                t.thisDep,
                t.contextDep,
                t.propDep,
                function(ve, Oe) {
                  var me = ve.shared.context;
                  return [
                    0,
                    0,
                    Oe.def(me, ".", Er),
                    Oe.def(me, ".", xr)
                  ];
                }
              ) : null;
            }
            var m = v(Ut);
            if (m) {
              var g = m;
              m = new _t(
                m.thisDep,
                m.contextDep,
                m.propDep,
                function(s, d) {
                  var i = g.append(s, d), E = s.shared.context;
                  return d.set(
                    E,
                    "." + Uu,
                    i[2]
                  ), d.set(
                    E,
                    "." + zu,
                    i[3]
                  ), i;
                }
              );
            }
            return {
              viewport: m,
              scissor_box: v(mn)
            };
          }
          function we(o, t) {
            var h = o.static, A = typeof h[Dr] == "string" && typeof h[Nr] == "string";
            if (A) {
              if (Object.keys(t.dynamic).length > 0)
                return null;
              var S = t.static, v = Object.keys(S);
              if (v.length > 0 && typeof S[v[0]] == "number") {
                for (var m = [], g = 0; g < v.length; ++g)
                  f(typeof S[v[g]] == "number", "must specify all vertex attribute locations when using vaos"), m.push([S[v[g]] | 0, v[g]]);
                return m;
              }
            }
            return null;
          }
          function Ce(o, t, h) {
            var A = o.static, S = o.dynamic;
            function v(i) {
              if (i in A) {
                var E = r.id(A[i]);
                f.optional(function() {
                  K.shader(Co[i], E, f.guessCommand());
                });
                var L = tt(function() {
                  return E;
                });
                return L.id = E, L;
              } else if (i in S) {
                var D = S[i];
                return xt(D, function($, B) {
                  var Q = $.invoke(B, D), ve = B.def($.shared.strings, ".id(", Q, ")");
                  return f.optional(function() {
                    B(
                      $.shared.shader,
                      ".shader(",
                      Co[i],
                      ",",
                      ve,
                      ",",
                      $.command,
                      ");"
                    );
                  }), ve;
                });
              }
              return null;
            }
            var m = v(Dr), g = v(Nr), s = null, d;
            return Wt(m) && Wt(g) ? (s = K.program(g.id, m.id, null, h), d = tt(function(i, E) {
              return i.link(s);
            })) : d = new _t(
              m && m.thisDep || g && g.thisDep,
              m && m.contextDep || g && g.contextDep,
              m && m.propDep || g && g.propDep,
              function(i, E) {
                var L = i.shared.shader, D;
                m ? D = m.append(i, E) : D = E.def(L, ".", Dr);
                var $;
                g ? $ = g.append(i, E) : $ = E.def(L, ".", Nr);
                var B = L + ".program(" + $ + "," + D;
                return f.optional(function() {
                  B += "," + i.command;
                }), E.def(B + ")");
              }
            ), {
              frag: m,
              vert: g,
              progVar: d,
              program: s
            };
          }
          function ze(o, t) {
            var h = o.static, A = o.dynamic;
            function S() {
              if (rr in h) {
                var i = h[rr];
                Sn(i) ? i = F.getElements(F.create(i, !0)) : i && (i = F.getElements(i), f.command(i, "invalid elements", t.commandStr));
                var E = tt(function(D, $) {
                  if (i) {
                    var B = D.link(i);
                    return D.ELEMENTS = B, B;
                  }
                  return D.ELEMENTS = null, null;
                });
                return E.value = i, E;
              } else if (rr in A) {
                var L = A[rr];
                return xt(L, function(D, $) {
                  var B = D.shared, Q = B.isBufferArgs, ve = B.elements, Oe = D.invoke($, L), me = $.def("null"), be = $.def(Q, "(", Oe, ")"), Te = D.cond(be).then(me, "=", ve, ".createStream(", Oe, ");").else(me, "=", ve, ".getElements(", Oe, ");");
                  return f.optional(function() {
                    D.assert(
                      Te.else,
                      "!" + Oe + "||" + me,
                      "invalid elements"
                    );
                  }), $.entry(Te), $.exit(
                    D.cond(be).then(ve, ".destroyStream(", me, ");")
                  ), D.ELEMENTS = me, me;
                });
              }
              return null;
            }
            var v = S();
            function m() {
              if (nr in h) {
                var i = h[nr];
                return f.commandParameter(i, ur, "invalid primitve", t.commandStr), tt(function(L, D) {
                  return ur[i];
                });
              } else if (nr in A) {
                var E = A[nr];
                return xt(E, function(L, D) {
                  var $ = L.constants.primTypes, B = L.invoke(D, E);
                  return f.optional(function() {
                    L.assert(
                      D,
                      B + " in " + $,
                      "invalid primitive, must be one of " + Object.keys(ur)
                    );
                  }), D.def($, "[", B, "]");
                });
              } else if (v)
                return Wt(v) ? v.value ? tt(function(L, D) {
                  return D.def(L.ELEMENTS, ".primType");
                }) : tt(function() {
                  return wo;
                }) : new _t(
                  v.thisDep,
                  v.contextDep,
                  v.propDep,
                  function(L, D) {
                    var $ = L.ELEMENTS;
                    return D.def($, "?", $, ".primType:", wo);
                  }
                );
              return null;
            }
            function g(i, E) {
              if (i in h) {
                var L = h[i] | 0;
                return f.command(!E || L >= 0, "invalid " + i, t.commandStr), tt(function($, B) {
                  return E && ($.OFFSET = L), L;
                });
              } else if (i in A) {
                var D = A[i];
                return xt(D, function($, B) {
                  var Q = $.invoke(B, D);
                  return E && ($.OFFSET = Q, f.optional(function() {
                    $.assert(
                      B,
                      Q + ">=0",
                      "invalid " + i
                    );
                  })), Q;
                });
              } else if (E && v)
                return tt(function($, B) {
                  return $.OFFSET = "0", 0;
                });
              return null;
            }
            var s = g(pn, !0);
            function d() {
              if (ar in h) {
                var i = h[ar] | 0;
                return f.command(
                  typeof i == "number" && i >= 0,
                  "invalid vertex count",
                  t.commandStr
                ), tt(function() {
                  return i;
                });
              } else if (ar in A) {
                var E = A[ar];
                return xt(E, function($, B) {
                  var Q = $.invoke(B, E);
                  return f.optional(function() {
                    $.assert(
                      B,
                      "typeof " + Q + '==="number"&&' + Q + ">=0&&" + Q + "===(" + Q + "|0)",
                      "invalid vertex count"
                    );
                  }), Q;
                });
              } else if (v)
                if (Wt(v)) {
                  if (v)
                    return s ? new _t(
                      s.thisDep,
                      s.contextDep,
                      s.propDep,
                      function($, B) {
                        var Q = B.def(
                          $.ELEMENTS,
                          ".vertCount-",
                          $.OFFSET
                        );
                        return f.optional(function() {
                          $.assert(
                            B,
                            Q + ">=0",
                            "invalid vertex offset/element buffer too small"
                          );
                        }), Q;
                      }
                    ) : tt(function($, B) {
                      return B.def($.ELEMENTS, ".vertCount");
                    });
                  var L = tt(function() {
                    return -1;
                  });
                  return f.optional(function() {
                    L.MISSING = !0;
                  }), L;
                } else {
                  var D = new _t(
                    v.thisDep || s.thisDep,
                    v.contextDep || s.contextDep,
                    v.propDep || s.propDep,
                    function($, B) {
                      var Q = $.ELEMENTS;
                      return $.OFFSET ? B.def(
                        Q,
                        "?",
                        Q,
                        ".vertCount-",
                        $.OFFSET,
                        ":-1"
                      ) : B.def(Q, "?", Q, ".vertCount:-1");
                    }
                  );
                  return f.optional(function() {
                    D.DYNAMIC = !0;
                  }), D;
                }
              return null;
            }
            return {
              elements: v,
              primitive: m(),
              count: d(),
              instances: g(vn, !1),
              offset: s
            };
          }
          function rt(o, t) {
            var h = o.static, A = o.dynamic, S = {};
            return V.forEach(function(v) {
              var m = oe(v);
              function g(s, d) {
                if (v in h) {
                  var i = s(h[v]);
                  S[m] = tt(function() {
                    return i;
                  });
                } else if (v in A) {
                  var E = A[v];
                  S[m] = xt(E, function(L, D) {
                    return d(L, D, L.invoke(D, E));
                  });
                }
              }
              switch (v) {
                case co:
                case ao:
                case no:
                case vo:
                case oo:
                case _o:
                case ho:
                case mo:
                case po:
                case uo:
                  return g(
                    function(s) {
                      return f.commandType(s, "boolean", v, t.commandStr), s;
                    },
                    function(s, d, i) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          "typeof " + i + '==="boolean"',
                          "invalid flag " + v,
                          s.commandStr
                        );
                      }), i;
                    }
                  );
                case so:
                  return g(
                    function(s) {
                      return f.commandParameter(s, Ar, "invalid " + v, t.commandStr), Ar[s];
                    },
                    function(s, d, i) {
                      var E = s.constants.compareFuncs;
                      return f.optional(function() {
                        s.assert(
                          d,
                          i + " in " + E,
                          "invalid " + v + ", must be one of " + Object.keys(Ar)
                        );
                      }), d.def(E, "[", i, "]");
                    }
                  );
                case fo:
                  return g(
                    function(s) {
                      return f.command(
                        Ke(s) && s.length === 2 && typeof s[0] == "number" && typeof s[1] == "number" && s[0] <= s[1],
                        "depth range is 2d array",
                        t.commandStr
                      ), s;
                    },
                    function(s, d, i) {
                      f.optional(function() {
                        s.assert(
                          d,
                          s.shared.isArrayLike + "(" + i + ")&&" + i + ".length===2&&typeof " + i + '[0]==="number"&&typeof ' + i + '[1]==="number"&&' + i + "[0]<=" + i + "[1]",
                          "depth range must be a 2d array"
                        );
                      });
                      var E = d.def("+", i, "[0]"), L = d.def("+", i, "[1]");
                      return [E, L];
                    }
                  );
                case ha:
                  return g(
                    function(s) {
                      f.commandType(s, "object", "blend.func", t.commandStr);
                      var d = "srcRGB" in s ? s.srcRGB : s.src, i = "srcAlpha" in s ? s.srcAlpha : s.src, E = "dstRGB" in s ? s.dstRGB : s.dst, L = "dstAlpha" in s ? s.dstAlpha : s.dst;
                      return f.commandParameter(d, Nt, m + ".srcRGB", t.commandStr), f.commandParameter(i, Nt, m + ".srcAlpha", t.commandStr), f.commandParameter(E, Nt, m + ".dstRGB", t.commandStr), f.commandParameter(L, Nt, m + ".dstAlpha", t.commandStr), f.command(
                        Oo.indexOf(d + ", " + E) === -1,
                        "unallowed blending combination (srcRGB, dstRGB) = (" + d + ", " + E + ")",
                        t.commandStr
                      ), [
                        Nt[d],
                        Nt[E],
                        Nt[i],
                        Nt[L]
                      ];
                    },
                    function(s, d, i) {
                      var E = s.constants.blendFuncs;
                      f.optional(function() {
                        s.assert(
                          d,
                          i + "&&typeof " + i + '==="object"',
                          "invalid blend func, must be an object"
                        );
                      });
                      function L(me, be) {
                        var Te = d.def(
                          '"',
                          me,
                          be,
                          '" in ',
                          i,
                          "?",
                          i,
                          ".",
                          me,
                          be,
                          ":",
                          i,
                          ".",
                          me
                        );
                        return f.optional(function() {
                          s.assert(
                            d,
                            Te + " in " + E,
                            "invalid " + v + "." + me + be + ", must be one of " + Object.keys(Nt)
                          );
                        }), Te;
                      }
                      var D = L("src", "RGB"), $ = L("dst", "RGB");
                      f.optional(function() {
                        var me = s.constants.invalidBlendCombinations;
                        s.assert(
                          d,
                          me + ".indexOf(" + D + '+", "+' + $ + ") === -1 ",
                          "unallowed blending combination for (srcRGB, dstRGB)"
                        );
                      });
                      var B = d.def(E, "[", D, "]"), Q = d.def(E, "[", L("src", "Alpha"), "]"), ve = d.def(E, "[", $, "]"), Oe = d.def(E, "[", L("dst", "Alpha"), "]");
                      return [B, ve, Q, Oe];
                    }
                  );
                case da:
                  return g(
                    function(s) {
                      if (typeof s == "string")
                        return f.commandParameter(s, I, "invalid " + v, t.commandStr), [
                          I[s],
                          I[s]
                        ];
                      if (typeof s == "object")
                        return f.commandParameter(
                          s.rgb,
                          I,
                          v + ".rgb",
                          t.commandStr
                        ), f.commandParameter(
                          s.alpha,
                          I,
                          v + ".alpha",
                          t.commandStr
                        ), [
                          I[s.rgb],
                          I[s.alpha]
                        ];
                      f.commandRaise("invalid blend.equation", t.commandStr);
                    },
                    function(s, d, i) {
                      var E = s.constants.blendEquations, L = d.def(), D = d.def(), $ = s.cond("typeof ", i, '==="string"');
                      return f.optional(function() {
                        function B(Q, ve, Oe) {
                          s.assert(
                            Q,
                            Oe + " in " + E,
                            "invalid " + ve + ", must be one of " + Object.keys(I)
                          );
                        }
                        B($.then, v, i), s.assert(
                          $.else,
                          i + "&&typeof " + i + '==="object"',
                          "invalid " + v
                        ), B($.else, v + ".rgb", i + ".rgb"), B($.else, v + ".alpha", i + ".alpha");
                      }), $.then(
                        L,
                        "=",
                        D,
                        "=",
                        E,
                        "[",
                        i,
                        "];"
                      ), $.else(
                        L,
                        "=",
                        E,
                        "[",
                        i,
                        ".rgb];",
                        D,
                        "=",
                        E,
                        "[",
                        i,
                        ".alpha];"
                      ), d($), [L, D];
                    }
                  );
                case io:
                  return g(
                    function(s) {
                      return f.command(
                        Ke(s) && s.length === 4,
                        "blend.color must be a 4d array",
                        t.commandStr
                      ), Et(4, function(d) {
                        return +s[d];
                      });
                    },
                    function(s, d, i) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          s.shared.isArrayLike + "(" + i + ")&&" + i + ".length===4",
                          "blend.color must be a 4d array"
                        );
                      }), Et(4, function(E) {
                        return d.def("+", i, "[", E, "]");
                      });
                    }
                  );
                case yo:
                  return g(
                    function(s) {
                      return f.commandType(s, "number", m, t.commandStr), s | 0;
                    },
                    function(s, d, i) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          "typeof " + i + '==="number"',
                          "invalid stencil.mask"
                        );
                      }), d.def(i, "|0");
                    }
                  );
                case ba:
                  return g(
                    function(s) {
                      f.commandType(s, "object", m, t.commandStr);
                      var d = s.cmp || "keep", i = s.ref || 0, E = "mask" in s ? s.mask : -1;
                      return f.commandParameter(d, Ar, v + ".cmp", t.commandStr), f.commandType(i, "number", v + ".ref", t.commandStr), f.commandType(E, "number", v + ".mask", t.commandStr), [
                        Ar[d],
                        i,
                        E
                      ];
                    },
                    function(s, d, i) {
                      var E = s.constants.compareFuncs;
                      f.optional(function() {
                        function B() {
                          s.assert(
                            d,
                            Array.prototype.join.call(arguments, ""),
                            "invalid stencil.func"
                          );
                        }
                        B(i + "&&typeof ", i, '==="object"'), B(
                          '!("cmp" in ',
                          i,
                          ")||(",
                          i,
                          ".cmp in ",
                          E,
                          ")"
                        );
                      });
                      var L = d.def(
                        '"cmp" in ',
                        i,
                        "?",
                        E,
                        "[",
                        i,
                        ".cmp]",
                        ":",
                        Vt
                      ), D = d.def(i, ".ref|0"), $ = d.def(
                        '"mask" in ',
                        i,
                        "?",
                        i,
                        ".mask|0:-1"
                      );
                      return [L, D, $];
                    }
                  );
                case ga:
                case Ir:
                  return g(
                    function(s) {
                      f.commandType(s, "object", m, t.commandStr);
                      var d = s.fail || "keep", i = s.zfail || "keep", E = s.zpass || "keep";
                      return f.commandParameter(d, Ht, v + ".fail", t.commandStr), f.commandParameter(i, Ht, v + ".zfail", t.commandStr), f.commandParameter(E, Ht, v + ".zpass", t.commandStr), [
                        v === Ir ? ir : Vr,
                        Ht[d],
                        Ht[i],
                        Ht[E]
                      ];
                    },
                    function(s, d, i) {
                      var E = s.constants.stencilOps;
                      f.optional(function() {
                        s.assert(
                          d,
                          i + "&&typeof " + i + '==="object"',
                          "invalid " + v
                        );
                      });
                      function L(D) {
                        return f.optional(function() {
                          s.assert(
                            d,
                            '!("' + D + '" in ' + i + ")||(" + i + "." + D + " in " + E + ")",
                            "invalid " + v + "." + D + ", must be one of " + Object.keys(Ht)
                          );
                        }), d.def(
                          '"',
                          D,
                          '" in ',
                          i,
                          "?",
                          E,
                          "[",
                          i,
                          ".",
                          D,
                          "]:",
                          Vt
                        );
                      }
                      return [
                        v === Ir ? ir : Vr,
                        L("fail"),
                        L("zfail"),
                        L("zpass")
                      ];
                    }
                  );
                case ya:
                  return g(
                    function(s) {
                      f.commandType(s, "object", m, t.commandStr);
                      var d = s.factor | 0, i = s.units | 0;
                      return f.commandType(d, "number", m + ".factor", t.commandStr), f.commandType(i, "number", m + ".units", t.commandStr), [d, i];
                    },
                    function(s, d, i) {
                      f.optional(function() {
                        s.assert(
                          d,
                          i + "&&typeof " + i + '==="object"',
                          "invalid " + v
                        );
                      });
                      var E = d.def(i, ".factor|0"), L = d.def(i, ".units|0");
                      return [E, L];
                    }
                  );
                case lo:
                  return g(
                    function(s) {
                      var d = 0;
                      return s === "front" ? d = Vr : s === "back" && (d = ir), f.command(!!d, m, t.commandStr), d;
                    },
                    function(s, d, i) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          i + '==="front"||' + i + '==="back"',
                          "invalid cull.face"
                        );
                      }), d.def(i, '==="front"?', Vr, ":", ir);
                    }
                  );
                case va:
                  return g(
                    function(s) {
                      return f.command(
                        typeof s == "number" && s >= G.lineWidthDims[0] && s <= G.lineWidthDims[1],
                        "invalid line width, must be a positive number between " + G.lineWidthDims[0] + " and " + G.lineWidthDims[1],
                        t.commandStr
                      ), s;
                    },
                    function(s, d, i) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          "typeof " + i + '==="number"&&' + i + ">=" + G.lineWidthDims[0] + "&&" + i + "<=" + G.lineWidthDims[1],
                          "invalid line width"
                        );
                      }), i;
                    }
                  );
                case pa:
                  return g(
                    function(s) {
                      return f.commandParameter(s, La, m, t.commandStr), La[s];
                    },
                    function(s, d, i) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          i + '==="cw"||' + i + '==="ccw"',
                          "invalid frontFace, must be one of cw,ccw"
                        );
                      }), d.def(i + '==="cw"?' + Ao + ":" + Sa);
                    }
                  );
                case ma:
                  return g(
                    function(s) {
                      return f.command(
                        Ke(s) && s.length === 4,
                        "color.mask must be length 4 array",
                        t.commandStr
                      ), s.map(function(d) {
                        return !!d;
                      });
                    },
                    function(s, d, i) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          s.shared.isArrayLike + "(" + i + ")&&" + i + ".length===4",
                          "invalid color.mask"
                        );
                      }), Et(4, function(E) {
                        return "!!" + i + "[" + E + "]";
                      });
                    }
                  );
                case _a:
                  return g(
                    function(s) {
                      f.command(typeof s == "object" && s, m, t.commandStr);
                      var d = "value" in s ? s.value : 1, i = !!s.invert;
                      return f.command(
                        typeof d == "number" && d >= 0 && d <= 1,
                        "sample.coverage.value must be a number between 0 and 1",
                        t.commandStr
                      ), [d, i];
                    },
                    function(s, d, i) {
                      f.optional(function() {
                        s.assert(
                          d,
                          i + "&&typeof " + i + '==="object"',
                          "invalid sample.coverage"
                        );
                      });
                      var E = d.def(
                        '"value" in ',
                        i,
                        "?+",
                        i,
                        ".value:1"
                      ), L = d.def("!!", i, ".invert");
                      return [E, L];
                    }
                  );
              }
            }), S;
          }
          function ut(o, t) {
            var h = o.static, A = o.dynamic, S = {};
            return Object.keys(h).forEach(function(v) {
              var m = h[v], g;
              if (typeof m == "number" || typeof m == "boolean")
                g = tt(function() {
                  return m;
                });
              else if (typeof m == "function") {
                var s = m._reglType;
                s === "texture2d" || s === "textureCube" ? g = tt(function(d) {
                  return d.link(m);
                }) : s === "framebuffer" || s === "framebufferCube" ? (f.command(
                  m.color.length > 0,
                  'missing color attachment for framebuffer sent to uniform "' + v + '"',
                  t.commandStr
                ), g = tt(function(d) {
                  return d.link(m.color[0]);
                })) : f.commandRaise('invalid data for uniform "' + v + '"', t.commandStr);
              } else Ke(m) ? g = tt(function(d) {
                var i = d.global.def(
                  "[",
                  Et(m.length, function(E) {
                    return f.command(
                      typeof m[E] == "number" || typeof m[E] == "boolean",
                      "invalid uniform " + v,
                      d.commandStr
                    ), m[E];
                  }),
                  "]"
                );
                return i;
              }) : f.commandRaise('invalid or missing data for uniform "' + v + '"', t.commandStr);
              g.value = m, S[v] = g;
            }), Object.keys(A).forEach(function(v) {
              var m = A[v];
              S[v] = xt(m, function(g, s) {
                return g.invoke(s, m);
              });
            }), S;
          }
          function Ne(o, t) {
            var h = o.static, A = o.dynamic, S = {};
            return Object.keys(h).forEach(function(v) {
              var m = h[v], g = r.id(v), s = new T();
              if (Sn(m))
                s.state = gr, s.buffer = P.getBuffer(
                  P.create(m, wr, !1, !0)
                ), s.type = 0;
              else {
                var d = P.getBuffer(m);
                if (d)
                  s.state = gr, s.buffer = d, s.type = 0;
                else if (f.command(
                  typeof m == "object" && m,
                  "invalid data for attribute " + v,
                  t.commandStr
                ), "constant" in m) {
                  var i = m.constant;
                  s.buffer = "null", s.state = sa, typeof i == "number" ? s.x = i : (f.command(
                    Ke(i) && i.length > 0 && i.length <= 4,
                    "invalid constant for attribute " + v,
                    t.commandStr
                  ), br.forEach(function(ve, Oe) {
                    Oe < i.length && (s[ve] = i[Oe]);
                  }));
                } else {
                  Sn(m.buffer) ? d = P.getBuffer(
                    P.create(m.buffer, wr, !1, !0)
                  ) : d = P.getBuffer(m.buffer), f.command(!!d, 'missing buffer for attribute "' + v + '"', t.commandStr);
                  var E = m.offset | 0;
                  f.command(
                    E >= 0,
                    'invalid offset for attribute "' + v + '"',
                    t.commandStr
                  );
                  var L = m.stride | 0;
                  f.command(
                    L >= 0 && L < 256,
                    'invalid stride for attribute "' + v + '", must be integer betweeen [0, 255]',
                    t.commandStr
                  );
                  var D = m.size | 0;
                  f.command(
                    !("size" in m) || D > 0 && D <= 4,
                    'invalid size for attribute "' + v + '", must be 1,2,3,4',
                    t.commandStr
                  );
                  var $ = !!m.normalized, B = 0;
                  "type" in m && (f.commandParameter(
                    m.type,
                    Kt,
                    "invalid type for attribute " + v,
                    t.commandStr
                  ), B = Kt[m.type]);
                  var Q = m.divisor | 0;
                  "divisor" in m && (f.command(
                    Q === 0 || Z,
                    'cannot specify divisor for attribute "' + v + '", instancing not supported',
                    t.commandStr
                  ), f.command(
                    Q >= 0,
                    'invalid divisor for attribute "' + v + '"',
                    t.commandStr
                  )), f.optional(function() {
                    var ve = t.commandStr, Oe = [
                      "buffer",
                      "offset",
                      "divisor",
                      "normalized",
                      "type",
                      "size",
                      "stride"
                    ];
                    Object.keys(m).forEach(function(me) {
                      f.command(
                        Oe.indexOf(me) >= 0,
                        'unknown parameter "' + me + '" for attribute pointer "' + v + '" (valid parameters are ' + Oe + ")",
                        ve
                      );
                    });
                  }), s.buffer = d, s.state = gr, s.size = D, s.normalized = $, s.type = B || d.dtype, s.offset = E, s.stride = L, s.divisor = Q;
                }
              }
              S[v] = tt(function(ve, Oe) {
                var me = ve.attribCache;
                if (g in me)
                  return me[g];
                var be = {
                  isStream: !1
                };
                return Object.keys(s).forEach(function(Te) {
                  be[Te] = s[Te];
                }), s.buffer && (be.buffer = ve.link(s.buffer), be.type = be.type || be.buffer + ".dtype"), me[g] = be, be;
              });
            }), Object.keys(A).forEach(function(v) {
              var m = A[v];
              function g(s, d) {
                var i = s.invoke(d, m), E = s.shared, L = s.constants, D = E.isBufferArgs, $ = E.buffer;
                f.optional(function() {
                  s.assert(
                    d,
                    i + "&&(typeof " + i + '==="object"||typeof ' + i + '==="function")&&(' + D + "(" + i + ")||" + $ + ".getBuffer(" + i + ")||" + $ + ".getBuffer(" + i + ".buffer)||" + D + "(" + i + '.buffer)||("constant" in ' + i + "&&(typeof " + i + '.constant==="number"||' + E.isArrayLike + "(" + i + ".constant))))",
                    'invalid dynamic attribute "' + v + '"'
                  );
                });
                var B = {
                  isStream: d.def(!1)
                }, Q = new T();
                Q.state = gr, Object.keys(Q).forEach(function(be) {
                  B[be] = d.def("" + Q[be]);
                });
                var ve = B.buffer, Oe = B.type;
                d(
                  "if(",
                  D,
                  "(",
                  i,
                  ")){",
                  B.isStream,
                  "=true;",
                  ve,
                  "=",
                  $,
                  ".createStream(",
                  wr,
                  ",",
                  i,
                  ");",
                  Oe,
                  "=",
                  ve,
                  ".dtype;",
                  "}else{",
                  ve,
                  "=",
                  $,
                  ".getBuffer(",
                  i,
                  ");",
                  "if(",
                  ve,
                  "){",
                  Oe,
                  "=",
                  ve,
                  ".dtype;",
                  '}else if("constant" in ',
                  i,
                  "){",
                  B.state,
                  "=",
                  sa,
                  ";",
                  "if(typeof " + i + '.constant === "number"){',
                  B[br[0]],
                  "=",
                  i,
                  ".constant;",
                  br.slice(1).map(function(be) {
                    return B[be];
                  }).join("="),
                  "=0;",
                  "}else{",
                  br.map(function(be, Te) {
                    return B[be] + "=" + i + ".constant.length>" + Te + "?" + i + ".constant[" + Te + "]:0;";
                  }).join(""),
                  "}}else{",
                  "if(",
                  D,
                  "(",
                  i,
                  ".buffer)){",
                  ve,
                  "=",
                  $,
                  ".createStream(",
                  wr,
                  ",",
                  i,
                  ".buffer);",
                  "}else{",
                  ve,
                  "=",
                  $,
                  ".getBuffer(",
                  i,
                  ".buffer);",
                  "}",
                  Oe,
                  '="type" in ',
                  i,
                  "?",
                  L.glTypes,
                  "[",
                  i,
                  ".type]:",
                  ve,
                  ".dtype;",
                  B.normalized,
                  "=!!",
                  i,
                  ".normalized;"
                );
                function me(be) {
                  d(B[be], "=", i, ".", be, "|0;");
                }
                return me("size"), me("offset"), me("stride"), me("divisor"), d("}}"), d.exit(
                  "if(",
                  B.isStream,
                  "){",
                  $,
                  ".destroyStream(",
                  ve,
                  ");",
                  "}"
                ), B;
              }
              S[v] = xt(m, g);
            }), S;
          }
          function ot(o, t) {
            var h = o.static, A = o.dynamic;
            if (Pr in h) {
              var S = h[Pr];
              return S !== null && J.getVAO(S) === null && (S = J.createVAO(S)), tt(function(m) {
                return m.link(J.getVAO(S));
              });
            } else if (Pr in A) {
              var v = A[Pr];
              return xt(v, function(m, g) {
                var s = m.invoke(g, v);
                return g.def(m.shared.vao + ".getVAO(" + s + ")");
              });
            }
            return null;
          }
          function He(o) {
            var t = o.static, h = o.dynamic, A = {};
            return Object.keys(t).forEach(function(S) {
              var v = t[S];
              A[S] = tt(function(m, g) {
                return typeof v == "number" || typeof v == "boolean" ? "" + v : m.link(v);
              });
            }), Object.keys(h).forEach(function(S) {
              var v = h[S];
              A[S] = xt(v, function(m, g) {
                return m.invoke(g, v);
              });
            }), A;
          }
          function nt(o, t, h, A, S) {
            var v = o.static, m = o.dynamic;
            f.optional(function() {
              var me = [
                tr,
                Nr,
                Dr,
                rr,
                nr,
                pn,
                ar,
                vn,
                Br,
                Pr
              ].concat(V);
              function be(Te) {
                Object.keys(Te).forEach(function(je) {
                  f.command(
                    me.indexOf(je) >= 0,
                    'unknown parameter "' + je + '"',
                    S.commandStr
                  );
                });
              }
              be(v), be(m);
            });
            var g = we(o, t), s = he(o), d = Ge(o, s, S), i = ze(o, S), E = rt(o, S), L = Ce(o, S, g);
            function D(me) {
              var be = d[me];
              be && (E[me] = be);
            }
            D(Ut), D(oe(mn));
            var $ = Object.keys(E).length > 0, B = {
              framebuffer: s,
              draw: i,
              shader: L,
              state: E,
              dirty: $,
              scopeVAO: null,
              drawVAO: null,
              useVAO: !1,
              attributes: {}
            };
            if (B.profile = Le(o), B.uniforms = ut(h, S), B.drawVAO = B.scopeVAO = ot(o), !B.drawVAO && L.program && !g && l.angle_instanced_arrays) {
              var Q = !0, ve = L.program.attributes.map(function(me) {
                var be = t.static[me];
                return Q = Q && !!be, be;
              });
              if (Q && ve.length > 0) {
                var Oe = J.getVAO(J.createVAO(ve));
                B.drawVAO = new _t(null, null, null, function(me, be) {
                  return me.link(Oe);
                }), B.useVAO = !0;
              }
            }
            return g ? B.useVAO = !0 : B.attributes = Ne(t, S), B.context = He(A), B;
          }
          function st(o, t, h) {
            var A = o.shared, S = A.context, v = o.scope();
            Object.keys(h).forEach(function(m) {
              t.save(S, "." + m);
              var g = h[m], s = g.append(o, t);
              Array.isArray(s) ? v(S, ".", m, "=[", s.join(), "];") : v(S, ".", m, "=", s, ";");
            }), t(v);
          }
          function ft(o, t, h, A) {
            var S = o.shared, v = S.gl, m = S.framebuffer, g;
            ue && (g = t.def(S.extensions, ".webgl_draw_buffers"));
            var s = o.constants, d = s.drawBuffer, i = s.backBuffer, E;
            h ? E = h.append(o, t) : E = t.def(m, ".next"), A || t("if(", E, "!==", m, ".cur){"), t(
              "if(",
              E,
              "){",
              v,
              ".bindFramebuffer(",
              Ro,
              ",",
              E,
              ".framebuffer);"
            ), ue && t(
              g,
              ".drawBuffersWEBGL(",
              d,
              "[",
              E,
              ".colorAttachments.length]);"
            ), t(
              "}else{",
              v,
              ".bindFramebuffer(",
              Ro,
              ",null);"
            ), ue && t(g, ".drawBuffersWEBGL(", i, ");"), t(
              "}",
              m,
              ".cur=",
              E,
              ";"
            ), A || t("}");
          }
          function ct(o, t, h) {
            var A = o.shared, S = A.gl, v = o.current, m = o.next, g = A.current, s = A.next, d = o.cond(g, ".dirty");
            V.forEach(function(i) {
              var E = oe(i);
              if (!(E in h.state)) {
                var L, D;
                if (E in m) {
                  L = m[E], D = v[E];
                  var $ = Et(z[E].length, function(Q) {
                    return d.def(L, "[", Q, "]");
                  });
                  d(o.cond($.map(function(Q, ve) {
                    return Q + "!==" + D + "[" + ve + "]";
                  }).join("||")).then(
                    S,
                    ".",
                    X[E],
                    "(",
                    $,
                    ");",
                    $.map(function(Q, ve) {
                      return D + "[" + ve + "]=" + Q;
                    }).join(";"),
                    ";"
                  ));
                } else {
                  L = d.def(s, ".", E);
                  var B = o.cond(L, "!==", g, ".", E);
                  d(B), E in ie ? B(
                    o.cond(L).then(S, ".enable(", ie[E], ");").else(S, ".disable(", ie[E], ");"),
                    g,
                    ".",
                    E,
                    "=",
                    L,
                    ";"
                  ) : B(
                    S,
                    ".",
                    X[E],
                    "(",
                    L,
                    ");",
                    g,
                    ".",
                    E,
                    "=",
                    L,
                    ";"
                  );
                }
              }
            }), Object.keys(h.state).length === 0 && d(g, ".dirty=false;"), t(d);
          }
          function dt(o, t, h, A) {
            var S = o.shared, v = o.current, m = S.current, g = S.gl;
            Fo(Object.keys(h)).forEach(function(s) {
              var d = h[s];
              if (!(A && !A(d))) {
                var i = d.append(o, t);
                if (ie[s]) {
                  var E = ie[s];
                  Wt(d) ? i ? t(g, ".enable(", E, ");") : t(g, ".disable(", E, ");") : t(o.cond(i).then(g, ".enable(", E, ");").else(g, ".disable(", E, ");")), t(m, ".", s, "=", i, ";");
                } else if (Ke(i)) {
                  var L = v[s];
                  t(
                    g,
                    ".",
                    X[s],
                    "(",
                    i,
                    ");",
                    i.map(function(D, $) {
                      return L + "[" + $ + "]=" + D;
                    }).join(";"),
                    ";"
                  );
                } else
                  t(
                    g,
                    ".",
                    X[s],
                    "(",
                    i,
                    ");",
                    m,
                    ".",
                    s,
                    "=",
                    i,
                    ";"
                  );
              }
            });
          }
          function Qe(o, t) {
            Z && (o.instancing = t.def(
              o.shared.extensions,
              ".angle_instanced_arrays"
            ));
          }
          function Re(o, t, h, A, S) {
            var v = o.shared, m = o.stats, g = v.current, s = v.timer, d = h.profile;
            function i() {
              return typeof performance > "u" ? "Date.now()" : "performance.now()";
            }
            var E, L;
            function D(me) {
              E = t.def(), me(E, "=", i(), ";"), typeof S == "string" ? me(m, ".count+=", S, ";") : me(m, ".count++;"), Y && (A ? (L = t.def(), me(L, "=", s, ".getNumPendingQueries();")) : me(s, ".beginQuery(", m, ");"));
            }
            function $(me) {
              me(m, ".cpuTime+=", i(), "-", E, ";"), Y && (A ? me(
                s,
                ".pushScopeStats(",
                L,
                ",",
                s,
                ".getNumPendingQueries(),",
                m,
                ");"
              ) : me(s, ".endQuery();"));
            }
            function B(me) {
              var be = t.def(g, ".profile");
              t(g, ".profile=", me, ";"), t.exit(g, ".profile=", be, ";");
            }
            var Q;
            if (d) {
              if (Wt(d)) {
                d.enable ? (D(t), $(t.exit), B("true")) : B("false");
                return;
              }
              Q = d.append(o, t), B(Q);
            } else
              Q = t.def(g, ".profile");
            var ve = o.block();
            D(ve), t("if(", Q, "){", ve, "}");
            var Oe = o.block();
            $(Oe), t.exit("if(", Q, "){", Oe, "}");
          }
          function ht(o, t, h, A, S) {
            var v = o.shared;
            function m(s) {
              switch (s) {
                case yn:
                case gn:
                case wn:
                  return 2;
                case _n:
                case En:
                case An:
                  return 3;
                case bn:
                case xn:
                case Tn:
                  return 4;
                default:
                  return 1;
              }
            }
            function g(s, d, i) {
              var E = v.gl, L = t.def(s, ".location"), D = t.def(v.attributes, "[", L, "]"), $ = i.state, B = i.buffer, Q = [
                i.x,
                i.y,
                i.z,
                i.w
              ], ve = [
                "buffer",
                "normalized",
                "offset",
                "stride"
              ];
              function Oe() {
                t(
                  "if(!",
                  D,
                  ".buffer){",
                  E,
                  ".enableVertexAttribArray(",
                  L,
                  ");}"
                );
                var be = i.type, Te;
                if (i.size ? Te = t.def(i.size, "||", d) : Te = d, t(
                  "if(",
                  D,
                  ".type!==",
                  be,
                  "||",
                  D,
                  ".size!==",
                  Te,
                  "||",
                  ve.map(function(qe) {
                    return D + "." + qe + "!==" + i[qe];
                  }).join("||"),
                  "){",
                  E,
                  ".bindBuffer(",
                  wr,
                  ",",
                  B,
                  ".buffer);",
                  E,
                  ".vertexAttribPointer(",
                  [
                    L,
                    Te,
                    be,
                    i.normalized,
                    i.stride,
                    i.offset
                  ],
                  ");",
                  D,
                  ".type=",
                  be,
                  ";",
                  D,
                  ".size=",
                  Te,
                  ";",
                  ve.map(function(qe) {
                    return D + "." + qe + "=" + i[qe] + ";";
                  }).join(""),
                  "}"
                ), Z) {
                  var je = i.divisor;
                  t(
                    "if(",
                    D,
                    ".divisor!==",
                    je,
                    "){",
                    o.instancing,
                    ".vertexAttribDivisorANGLE(",
                    [L, je],
                    ");",
                    D,
                    ".divisor=",
                    je,
                    ";}"
                  );
                }
              }
              function me() {
                t(
                  "if(",
                  D,
                  ".buffer){",
                  E,
                  ".disableVertexAttribArray(",
                  L,
                  ");",
                  D,
                  ".buffer=null;",
                  "}if(",
                  br.map(function(be, Te) {
                    return D + "." + be + "!==" + Q[Te];
                  }).join("||"),
                  "){",
                  E,
                  ".vertexAttrib4f(",
                  L,
                  ",",
                  Q,
                  ");",
                  br.map(function(be, Te) {
                    return D + "." + be + "=" + Q[Te] + ";";
                  }).join(""),
                  "}"
                );
              }
              $ === gr ? Oe() : $ === sa ? me() : (t("if(", $, "===", gr, "){"), Oe(), t("}else{"), me(), t("}"));
            }
            A.forEach(function(s) {
              var d = s.name, i = h.attributes[d], E;
              if (i) {
                if (!S(i))
                  return;
                E = i.append(o, t);
              } else {
                if (!S(Go))
                  return;
                var L = o.scopeAttrib(d);
                f.optional(function() {
                  o.assert(
                    t,
                    L + ".state",
                    "missing attribute " + d
                  );
                }), E = {}, Object.keys(new T()).forEach(function(D) {
                  E[D] = t.def(L, ".", D);
                });
              }
              g(
                o.link(s),
                m(s.info.type),
                E
              );
            });
          }
          function Ve(o, t, h, A, S) {
            for (var v = o.shared, m = v.gl, g, s = 0; s < A.length; ++s) {
              var d = A[s], i = d.name, E = d.info.type, L = h.uniforms[i], D = o.link(d), $ = D + ".location", B;
              if (L) {
                if (!S(L))
                  continue;
                if (Wt(L)) {
                  var Q = L.value;
                  if (f.command(
                    Q !== null && typeof Q < "u",
                    'missing uniform "' + i + '"',
                    o.commandStr
                  ), E === jr || E === Xr) {
                    f.command(
                      typeof Q == "function" && (E === jr && (Q._reglType === "texture2d" || Q._reglType === "framebuffer") || E === Xr && (Q._reglType === "textureCube" || Q._reglType === "framebufferCube")),
                      "invalid texture for uniform " + i,
                      o.commandStr
                    );
                    var ve = o.link(Q._texture || Q.color[0]._texture);
                    t(m, ".uniform1i(", $, ",", ve + ".bind());"), t.exit(ve, ".unbind();");
                  } else if (E === $r || E === Ur || E === zr) {
                    f.optional(function() {
                      f.command(
                        Ke(Q),
                        "invalid matrix for uniform " + i,
                        o.commandStr
                      ), f.command(
                        E === $r && Q.length === 4 || E === Ur && Q.length === 9 || E === zr && Q.length === 16,
                        "invalid length for matrix uniform " + i,
                        o.commandStr
                      );
                    });
                    var Oe = o.global.def("new Float32Array([" + Array.prototype.slice.call(Q) + "])"), me = 2;
                    E === Ur ? me = 3 : E === zr && (me = 4), t(
                      m,
                      ".uniformMatrix",
                      me,
                      "fv(",
                      $,
                      ",false,",
                      Oe,
                      ");"
                    );
                  } else {
                    switch (E) {
                      case wa:
                        f.commandType(Q, "number", "uniform " + i, o.commandStr), g = "1f";
                        break;
                      case yn:
                        f.command(
                          Ke(Q) && Q.length === 2,
                          "uniform " + i,
                          o.commandStr
                        ), g = "2f";
                        break;
                      case _n:
                        f.command(
                          Ke(Q) && Q.length === 3,
                          "uniform " + i,
                          o.commandStr
                        ), g = "3f";
                        break;
                      case bn:
                        f.command(
                          Ke(Q) && Q.length === 4,
                          "uniform " + i,
                          o.commandStr
                        ), g = "4f";
                        break;
                      case Ta:
                        f.commandType(Q, "boolean", "uniform " + i, o.commandStr), g = "1i";
                        break;
                      case Aa:
                        f.commandType(Q, "number", "uniform " + i, o.commandStr), g = "1i";
                        break;
                      case wn:
                        f.command(
                          Ke(Q) && Q.length === 2,
                          "uniform " + i,
                          o.commandStr
                        ), g = "2i";
                        break;
                      case gn:
                        f.command(
                          Ke(Q) && Q.length === 2,
                          "uniform " + i,
                          o.commandStr
                        ), g = "2i";
                        break;
                      case An:
                        f.command(
                          Ke(Q) && Q.length === 3,
                          "uniform " + i,
                          o.commandStr
                        ), g = "3i";
                        break;
                      case En:
                        f.command(
                          Ke(Q) && Q.length === 3,
                          "uniform " + i,
                          o.commandStr
                        ), g = "3i";
                        break;
                      case Tn:
                        f.command(
                          Ke(Q) && Q.length === 4,
                          "uniform " + i,
                          o.commandStr
                        ), g = "4i";
                        break;
                      case xn:
                        f.command(
                          Ke(Q) && Q.length === 4,
                          "uniform " + i,
                          o.commandStr
                        ), g = "4i";
                        break;
                    }
                    t(
                      m,
                      ".uniform",
                      g,
                      "(",
                      $,
                      ",",
                      Ke(Q) ? Array.prototype.slice.call(Q) : Q,
                      ");"
                    );
                  }
                  continue;
                } else
                  B = L.append(o, t);
              } else {
                if (!S(Go))
                  continue;
                B = t.def(v.uniforms, "[", r.id(i), "]");
              }
              E === jr ? (f(!Array.isArray(B), "must specify a scalar prop for textures"), t(
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
              )) : E === Xr && (f(!Array.isArray(B), "must specify a scalar prop for cube maps"), t(
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
              )), f.optional(function() {
                function bt(kt, Po) {
                  o.assert(
                    t,
                    kt,
                    'bad data or missing for uniform "' + i + '".  ' + Po
                  );
                }
                function Ra(kt) {
                  f(!Array.isArray(B), "must not specify an array type for uniform"), bt(
                    "typeof " + B + '==="' + kt + '"',
                    "invalid type, expected " + kt
                  );
                }
                function Ct(kt, Po) {
                  Array.isArray(B) ? f(B.length === kt, "must have length " + kt) : bt(
                    v.isArrayLike + "(" + B + ")&&" + B + ".length===" + kt,
                    "invalid vector, should have length " + kt,
                    o.commandStr
                  );
                }
                function Do(kt) {
                  f(!Array.isArray(B), "must not specify a value type"), bt(
                    "typeof " + B + '==="function"&&' + B + '._reglType==="texture' + (kt === xo ? "2d" : "Cube") + '"',
                    "invalid texture type",
                    o.commandStr
                  );
                }
                switch (E) {
                  case Aa:
                    Ra("number");
                    break;
                  case gn:
                    Ct(2);
                    break;
                  case En:
                    Ct(3);
                    break;
                  case xn:
                    Ct(4);
                    break;
                  case wa:
                    Ra("number");
                    break;
                  case yn:
                    Ct(2);
                    break;
                  case _n:
                    Ct(3);
                    break;
                  case bn:
                    Ct(4);
                    break;
                  case Ta:
                    Ra("boolean");
                    break;
                  case wn:
                    Ct(2);
                    break;
                  case An:
                    Ct(3);
                    break;
                  case Tn:
                    Ct(4);
                    break;
                  case $r:
                    Ct(4);
                    break;
                  case Ur:
                    Ct(9);
                    break;
                  case zr:
                    Ct(16);
                    break;
                  case jr:
                    Do(xo);
                    break;
                  case Xr:
                    Do(Wu);
                    break;
                }
              });
              var be = 1;
              switch (E) {
                case jr:
                case Xr:
                  var Te = t.def(B, "._texture");
                  t(m, ".uniform1i(", $, ",", Te, ".bind());"), t.exit(Te, ".unbind();");
                  continue;
                case Aa:
                case Ta:
                  g = "1i";
                  break;
                case gn:
                case wn:
                  g = "2i", be = 2;
                  break;
                case En:
                case An:
                  g = "3i", be = 3;
                  break;
                case xn:
                case Tn:
                  g = "4i", be = 4;
                  break;
                case wa:
                  g = "1f";
                  break;
                case yn:
                  g = "2f", be = 2;
                  break;
                case _n:
                  g = "3f", be = 3;
                  break;
                case bn:
                  g = "4f", be = 4;
                  break;
                case $r:
                  g = "Matrix2fv";
                  break;
                case Ur:
                  g = "Matrix3fv";
                  break;
                case zr:
                  g = "Matrix4fv";
                  break;
              }
              if (t(m, ".uniform", g, "(", $, ","), g.charAt(0) === "M") {
                var je = Math.pow(E - $r + 2, 2), qe = o.global.def("new Float32Array(", je, ")");
                Array.isArray(B) ? t(
                  "false,(",
                  Et(je, function(bt) {
                    return qe + "[" + bt + "]=" + B[bt];
                  }),
                  ",",
                  qe,
                  ")"
                ) : t(
                  "false,(Array.isArray(",
                  B,
                  ")||",
                  B,
                  " instanceof Float32Array)?",
                  B,
                  ":(",
                  Et(je, function(bt) {
                    return qe + "[" + bt + "]=" + B + "[" + bt + "]";
                  }),
                  ",",
                  qe,
                  ")"
                );
              } else be > 1 ? t(Et(be, function(bt) {
                return Array.isArray(B) ? B[bt] : B + "[" + bt + "]";
              })) : (f(!Array.isArray(B), "uniform value must not be an array"), t(B));
              t(");");
            }
          }
          function _e(o, t, h, A) {
            var S = o.shared, v = S.gl, m = S.draw, g = A.draw;
            function s() {
              var Te = g.elements, je, qe = t;
              return Te ? ((Te.contextDep && A.contextDynamic || Te.propDep) && (qe = h), je = Te.append(o, qe)) : je = qe.def(m, ".", rr), je && qe(
                "if(" + je + ")" + v + ".bindBuffer(" + Xu + "," + je + ".buffer.buffer);"
              ), je;
            }
            function d() {
              var Te = g.count, je, qe = t;
              return Te ? ((Te.contextDep && A.contextDynamic || Te.propDep) && (qe = h), je = Te.append(o, qe), f.optional(function() {
                Te.MISSING && o.assert(t, "false", "missing vertex count"), Te.DYNAMIC && o.assert(qe, je + ">=0", "missing vertex count");
              })) : (je = qe.def(m, ".", ar), f.optional(function() {
                o.assert(qe, je + ">=0", "missing vertex count");
              })), je;
            }
            var i = s();
            function E(Te) {
              var je = g[Te];
              return je ? je.contextDep && A.contextDynamic || je.propDep ? je.append(o, h) : je.append(o, t) : t.def(m, ".", Te);
            }
            var L = E(nr), D = E(pn), $ = d();
            if (typeof $ == "number") {
              if ($ === 0)
                return;
            } else
              h("if(", $, "){"), h.exit("}");
            var B, Q;
            Z && (B = E(vn), Q = o.instancing);
            var ve = i + ".type", Oe = g.elements && Wt(g.elements);
            function me() {
              function Te() {
                h(Q, ".drawElementsInstancedANGLE(", [
                  L,
                  $,
                  ve,
                  D + "<<((" + ve + "-" + eo + ")>>1)",
                  B
                ], ");");
              }
              function je() {
                h(
                  Q,
                  ".drawArraysInstancedANGLE(",
                  [L, D, $, B],
                  ");"
                );
              }
              i ? Oe ? Te() : (h("if(", i, "){"), Te(), h("}else{"), je(), h("}")) : je();
            }
            function be() {
              function Te() {
                h(v + ".drawElements(" + [
                  L,
                  $,
                  ve,
                  D + "<<((" + ve + "-" + eo + ")>>1)"
                ] + ");");
              }
              function je() {
                h(v + ".drawArrays(" + [L, D, $] + ");");
              }
              i ? Oe ? Te() : (h("if(", i, "){"), Te(), h("}else{"), je(), h("}")) : je();
            }
            Z && (typeof B != "number" || B >= 0) ? typeof B == "string" ? (h("if(", B, ">0){"), me(), h("}else if(", B, "<0){"), be(), h("}")) : me() : be();
          }
          function ke(o, t, h, A, S) {
            var v = ge(), m = v.proc("body", S);
            return f.optional(function() {
              v.commandStr = t.commandStr, v.command = v.link(t.commandStr);
            }), Z && (v.instancing = m.def(
              v.shared.extensions,
              ".angle_instanced_arrays"
            )), o(v, m, h, A), v.compile().body;
          }
          function $e(o, t, h, A) {
            Qe(o, t), h.useVAO ? h.drawVAO ? t(o.shared.vao, ".setVAO(", h.drawVAO.append(o, t), ");") : t(o.shared.vao, ".setVAO(", o.shared.vao, ".targetVAO);") : (t(o.shared.vao, ".setVAO(null);"), ht(o, t, h, A.attributes, function() {
              return !0;
            })), Ve(o, t, h, A.uniforms, function() {
              return !0;
            }), _e(o, t, t, h);
          }
          function Ze(o, t) {
            var h = o.proc("draw", 1);
            Qe(o, h), st(o, h, t.context), ft(o, h, t.framebuffer), ct(o, h, t), dt(o, h, t.state), Re(o, h, t, !1, !0);
            var A = t.shader.progVar.append(o, h);
            if (h(o.shared.gl, ".useProgram(", A, ".program);"), t.shader.program)
              $e(o, h, t, t.shader.program);
            else {
              h(o.shared.vao, ".setVAO(null);");
              var S = o.global.def("{}"), v = h.def(A, ".id"), m = h.def(S, "[", v, "]");
              h(
                o.cond(m).then(m, ".call(this,a0);").else(
                  m,
                  "=",
                  S,
                  "[",
                  v,
                  "]=",
                  o.link(function(g) {
                    return ke($e, o, t, g, 1);
                  }),
                  "(",
                  A,
                  ");",
                  m,
                  ".call(this,a0);"
                )
              );
            }
            Object.keys(t.state).length > 0 && h(o.shared.current, ".dirty=true;");
          }
          function Dt(o, t, h, A) {
            o.batchId = "a1", Qe(o, t);
            function S() {
              return !0;
            }
            ht(o, t, h, A.attributes, S), Ve(o, t, h, A.uniforms, S), _e(o, t, t, h);
          }
          function or(o, t, h, A) {
            Qe(o, t);
            var S = h.contextDep, v = t.def(), m = "a0", g = "a1", s = t.def();
            o.shared.props = s, o.batchId = v;
            var d = o.scope(), i = o.scope();
            t(
              d.entry,
              "for(",
              v,
              "=0;",
              v,
              "<",
              g,
              ";++",
              v,
              "){",
              s,
              "=",
              m,
              "[",
              v,
              "];",
              i,
              "}",
              d.exit
            );
            function E(ve) {
              return ve.contextDep && S || ve.propDep;
            }
            function L(ve) {
              return !E(ve);
            }
            if (h.needsContext && st(o, i, h.context), h.needsFramebuffer && ft(o, i, h.framebuffer), dt(o, i, h.state, E), h.profile && E(h.profile) && Re(o, i, h, !1, !0), A)
              h.useVAO ? h.drawVAO ? E(h.drawVAO) ? i(o.shared.vao, ".setVAO(", h.drawVAO.append(o, i), ");") : d(o.shared.vao, ".setVAO(", h.drawVAO.append(o, d), ");") : d(o.shared.vao, ".setVAO(", o.shared.vao, ".targetVAO);") : (d(o.shared.vao, ".setVAO(null);"), ht(o, d, h, A.attributes, L), ht(o, i, h, A.attributes, E)), Ve(o, d, h, A.uniforms, L), Ve(o, i, h, A.uniforms, E), _e(o, d, i, h);
            else {
              var D = o.global.def("{}"), $ = h.shader.progVar.append(o, i), B = i.def($, ".id"), Q = i.def(D, "[", B, "]");
              i(
                o.shared.gl,
                ".useProgram(",
                $,
                ".program);",
                "if(!",
                Q,
                "){",
                Q,
                "=",
                D,
                "[",
                B,
                "]=",
                o.link(function(ve) {
                  return ke(
                    Dt,
                    o,
                    h,
                    ve,
                    2
                  );
                }),
                "(",
                $,
                ");}",
                Q,
                ".call(this,a0[",
                v,
                "],",
                v,
                ");"
              );
            }
          }
          function u(o, t) {
            var h = o.proc("batch", 2);
            o.batchId = "0", Qe(o, h);
            var A = !1, S = !0;
            Object.keys(t.context).forEach(function(D) {
              A = A || t.context[D].propDep;
            }), A || (st(o, h, t.context), S = !1);
            var v = t.framebuffer, m = !1;
            v ? (v.propDep ? A = m = !0 : v.contextDep && A && (m = !0), m || ft(o, h, v)) : ft(o, h, null), t.state.viewport && t.state.viewport.propDep && (A = !0);
            function g(D) {
              return D.contextDep && A || D.propDep;
            }
            ct(o, h, t), dt(o, h, t.state, function(D) {
              return !g(D);
            }), (!t.profile || !g(t.profile)) && Re(o, h, t, !1, "a1"), t.contextDep = A, t.needsContext = S, t.needsFramebuffer = m;
            var s = t.shader.progVar;
            if (s.contextDep && A || s.propDep)
              or(
                o,
                h,
                t,
                null
              );
            else {
              var d = s.append(o, h);
              if (h(o.shared.gl, ".useProgram(", d, ".program);"), t.shader.program)
                or(
                  o,
                  h,
                  t,
                  t.shader.program
                );
              else {
                h(o.shared.vao, ".setVAO(null);");
                var i = o.global.def("{}"), E = h.def(d, ".id"), L = h.def(i, "[", E, "]");
                h(
                  o.cond(L).then(L, ".call(this,a0,a1);").else(
                    L,
                    "=",
                    i,
                    "[",
                    E,
                    "]=",
                    o.link(function(D) {
                      return ke(or, o, t, D, 2);
                    }),
                    "(",
                    d,
                    ");",
                    L,
                    ".call(this,a0,a1);"
                  )
                );
              }
            }
            Object.keys(t.state).length > 0 && h(o.shared.current, ".dirty=true;");
          }
          function M(o, t) {
            var h = o.proc("scope", 3);
            o.batchId = "a2";
            var A = o.shared, S = A.current;
            st(o, h, t.context), t.framebuffer && t.framebuffer.append(o, h), Fo(Object.keys(t.state)).forEach(function(m) {
              var g = t.state[m], s = g.append(o, h);
              Ke(s) ? s.forEach(function(d, i) {
                h.set(o.next[m], "[" + i + "]", d);
              }) : h.set(A.next, "." + m, s);
            }), Re(o, h, t, !0, !0), [rr, pn, ar, vn, nr].forEach(
              function(m) {
                var g = t.draw[m];
                g && h.set(A.draw, "." + m, "" + g.append(o, h));
              }
            ), Object.keys(t.uniforms).forEach(function(m) {
              var g = t.uniforms[m].append(o, h);
              Array.isArray(g) && (g = "[" + g.join() + "]"), h.set(
                A.uniforms,
                "[" + r.id(m) + "]",
                g
              );
            }), Object.keys(t.attributes).forEach(function(m) {
              var g = t.attributes[m].append(o, h), s = o.scopeAttrib(m);
              Object.keys(new T()).forEach(function(d) {
                h.set(s, "." + d, g[d]);
              });
            }), t.scopeVAO && h.set(A.vao, ".targetVAO", t.scopeVAO.append(o, h));
            function v(m) {
              var g = t.shader[m];
              g && h.set(A.shader, "." + m, g.append(o, h));
            }
            v(Nr), v(Dr), Object.keys(t.state).length > 0 && (h(S, ".dirty=true;"), h.exit(S, ".dirty=true;")), h("a1(", o.shared.context, ",a0,", o.batchId, ");");
          }
          function O(o) {
            if (!(typeof o != "object" || Ke(o))) {
              for (var t = Object.keys(o), h = 0; h < t.length; ++h)
                if (St.isDynamic(o[t[h]]))
                  return !0;
              return !1;
            }
          }
          function de(o, t, h) {
            var A = t.static[h];
            if (!A || !O(A))
              return;
            var S = o.global, v = Object.keys(A), m = !1, g = !1, s = !1, d = o.global.def("{}");
            v.forEach(function(E) {
              var L = A[E];
              if (St.isDynamic(L)) {
                typeof L == "function" && (L = A[E] = St.unbox(L));
                var D = xt(L, null);
                m = m || D.thisDep, s = s || D.propDep, g = g || D.contextDep;
              } else {
                switch (S(d, ".", E, "="), typeof L) {
                  case "number":
                    S(L);
                    break;
                  case "string":
                    S('"', L, '"');
                    break;
                  case "object":
                    Array.isArray(L) && S("[", L.join(), "]");
                    break;
                  default:
                    S(o.link(L));
                    break;
                }
                S(";");
              }
            });
            function i(E, L) {
              v.forEach(function(D) {
                var $ = A[D];
                if (St.isDynamic($)) {
                  var B = E.invoke(L, $);
                  L(d, ".", D, "=", B, ";");
                }
              });
            }
            t.dynamic[h] = new St.DynamicVariable(hn, {
              thisDep: m,
              contextDep: g,
              propDep: s,
              ref: d,
              append: i
            }), delete t.static[h];
          }
          function Me(o, t, h, A, S) {
            var v = ge();
            v.stats = v.link(S), Object.keys(t.static).forEach(function(g) {
              de(v, t, g);
            }), ju.forEach(function(g) {
              de(v, o, g);
            });
            var m = nt(o, t, h, A, v);
            return Ze(v, m), M(v, m), u(v, m), p(v.compile(), {
              destroy: function() {
                m.shader.program.destroy();
              }
            });
          }
          return {
            next: le,
            current: z,
            procs: (function() {
              var o = ge(), t = o.proc("poll"), h = o.proc("refresh"), A = o.block();
              t(A), h(A);
              var S = o.shared, v = S.gl, m = S.next, g = S.current;
              A(g, ".dirty=false;"), ft(o, t), ft(o, h, null, !0);
              var s;
              Z && (s = o.link(Z)), l.oes_vertex_array_object && h(o.link(l.oes_vertex_array_object), ".bindVertexArrayOES(null);");
              for (var d = 0; d < G.maxAttributes; ++d) {
                var i = h.def(S.attributes, "[", d, "]"), E = o.cond(i, ".buffer");
                E.then(
                  v,
                  ".enableVertexAttribArray(",
                  d,
                  ");",
                  v,
                  ".bindBuffer(",
                  wr,
                  ",",
                  i,
                  ".buffer.buffer);",
                  v,
                  ".vertexAttribPointer(",
                  d,
                  ",",
                  i,
                  ".size,",
                  i,
                  ".type,",
                  i,
                  ".normalized,",
                  i,
                  ".stride,",
                  i,
                  ".offset);"
                ).else(
                  v,
                  ".disableVertexAttribArray(",
                  d,
                  ");",
                  v,
                  ".vertexAttrib4f(",
                  d,
                  ",",
                  i,
                  ".x,",
                  i,
                  ".y,",
                  i,
                  ".z,",
                  i,
                  ".w);",
                  i,
                  ".buffer=null;"
                ), h(E), Z && h(
                  s,
                  ".vertexAttribDivisorANGLE(",
                  d,
                  ",",
                  i,
                  ".divisor);"
                );
              }
              return h(
                o.shared.vao,
                ".currentVAO=null;",
                o.shared.vao,
                ".setVAO(",
                o.shared.vao,
                ".targetVAO);"
              ), Object.keys(ie).forEach(function(L) {
                var D = ie[L], $ = A.def(m, ".", L), B = o.block();
                B(
                  "if(",
                  $,
                  "){",
                  v,
                  ".enable(",
                  D,
                  ")}else{",
                  v,
                  ".disable(",
                  D,
                  ")}",
                  g,
                  ".",
                  L,
                  "=",
                  $,
                  ";"
                ), h(B), t(
                  "if(",
                  $,
                  "!==",
                  g,
                  ".",
                  L,
                  "){",
                  B,
                  "}"
                );
              }), Object.keys(X).forEach(function(L) {
                var D = X[L], $ = z[L], B, Q, ve = o.block();
                if (ve(v, ".", D, "("), Ke($)) {
                  var Oe = $.length;
                  B = o.global.def(m, ".", L), Q = o.global.def(g, ".", L), ve(
                    Et(Oe, function(me) {
                      return B + "[" + me + "]";
                    }),
                    ");",
                    Et(Oe, function(me) {
                      return Q + "[" + me + "]=" + B + "[" + me + "];";
                    }).join("")
                  ), t(
                    "if(",
                    Et(Oe, function(me) {
                      return B + "[" + me + "]!==" + Q + "[" + me + "]";
                    }).join("||"),
                    "){",
                    ve,
                    "}"
                  );
                } else
                  B = A.def(m, ".", L), Q = A.def(g, ".", L), ve(
                    B,
                    ");",
                    g,
                    ".",
                    L,
                    "=",
                    B,
                    ";"
                  ), t(
                    "if(",
                    B,
                    "!==",
                    Q,
                    "){",
                    ve,
                    "}"
                  );
                h(ve);
              }), o.compile();
            })(),
            compile: Me
          };
        }
        function uc() {
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
        var cc = 34918, lc = 34919, Mo = 35007, dc = function(e, r) {
          if (!r.ext_disjoint_timer_query)
            return null;
          var l = [];
          function G() {
            return l.pop() || r.ext_disjoint_timer_query.createQueryEXT();
          }
          function P(Z) {
            l.push(Z);
          }
          var F = [];
          function k(Z) {
            var ue = G();
            r.ext_disjoint_timer_query.beginQueryEXT(Mo, ue), F.push(ue), Y(F.length - 1, F.length, Z);
          }
          function W() {
            r.ext_disjoint_timer_query.endQueryEXT(Mo);
          }
          function q() {
            this.startQueryIndex = -1, this.endQueryIndex = -1, this.sum = 0, this.stats = null;
          }
          var J = [];
          function K() {
            return J.pop() || new q();
          }
          function ne(Z) {
            J.push(Z);
          }
          var se = [];
          function Y(Z, ue, z) {
            var le = K();
            le.startQueryIndex = Z, le.endQueryIndex = ue, le.sum = 0, le.stats = z, se.push(le);
          }
          var ae = [], T = [];
          function I() {
            var Z, ue, z = F.length;
            if (z !== 0) {
              T.length = Math.max(T.length, z + 1), ae.length = Math.max(ae.length, z + 1), ae[0] = 0, T[0] = 0;
              var le = 0;
              for (Z = 0, ue = 0; ue < F.length; ++ue) {
                var V = F[ue];
                r.ext_disjoint_timer_query.getQueryObjectEXT(V, lc) ? (le += r.ext_disjoint_timer_query.getQueryObjectEXT(V, cc), P(V)) : F[Z++] = V, ae[ue + 1] = le, T[ue + 1] = Z;
              }
              for (F.length = Z, Z = 0, ue = 0; ue < se.length; ++ue) {
                var ie = se[ue], X = ie.startQueryIndex, oe = ie.endQueryIndex;
                ie.sum += ae[oe] - ae[X];
                var ye = T[X], Ee = T[oe];
                Ee === ye ? (ie.stats.gpuTime += ie.sum / 1e6, ne(ie)) : (ie.startQueryIndex = ye, ie.endQueryIndex = Ee, se[Z++] = ie);
              }
              se.length = Z;
            }
          }
          return {
            beginQuery: k,
            endQuery: W,
            pushScopeStats: Y,
            update: I,
            getNumPendingQueries: function() {
              return F.length;
            },
            clear: function() {
              l.push.apply(l, F);
              for (var Z = 0; Z < l.length; Z++)
                r.ext_disjoint_timer_query.deleteQueryEXT(l[Z]);
              F.length = 0, l.length = 0;
            },
            restore: function() {
              F.length = 0, l.length = 0;
            }
          };
        }, hc = 16384, mc = 256, pc = 1024, vc = 34962, ko = "webglcontextlost", Io = "webglcontextrestored", Bo = 1, yc = 2, _c = 3;
        function No(e, r) {
          for (var l = 0; l < e.length; ++l)
            if (e[l] === r)
              return l;
          return -1;
        }
        function bc(e) {
          var r = ps(e);
          if (!r)
            return null;
          var l = r.gl, G = l.getContextAttributes(), P = l.isContextLost(), F = vs(l, r);
          if (!F)
            return null;
          var k = cs(), W = uc(), q = F.extensions, J = dc(l, q), K = Xa(), ne = l.drawingBufferWidth, se = l.drawingBufferHeight, Y = {
            tick: 0,
            time: 0,
            viewportWidth: ne,
            viewportHeight: se,
            framebufferWidth: ne,
            framebufferHeight: se,
            drawingBufferWidth: ne,
            drawingBufferHeight: se,
            pixelRatio: r.pixelRatio
          }, ae = {}, T = {
            elements: null,
            primitive: 4,
            // GL_TRIANGLES
            count: -1,
            offset: 0,
            instances: -1
          }, I = nf(l, q), Z = gf(
            l,
            W,
            r,
            z
          ), ue = Gu(
            l,
            q,
            I,
            W,
            Z
          );
          function z(_e) {
            return ue.destroyBuffer(_e);
          }
          var le = Gf(l, q, Z, W), V = Bu(l, k, W, r), ie = uu(
            l,
            q,
            I,
            function() {
              ye.procs.poll();
            },
            Y,
            W,
            r
          ), X = cu(l, q, I, W, r), oe = Cu(
            l,
            q,
            I,
            ie,
            X,
            W
          ), ye = fc(
            l,
            k,
            q,
            I,
            Z,
            le,
            ie,
            oe,
            ae,
            ue,
            V,
            T,
            Y,
            J,
            r
          ), Ee = Pu(
            l,
            oe,
            ye.procs.poll,
            Y,
            G,
            q,
            I
          ), fe = ye.next, te = l.canvas, U = [], ge = [], Le = [], he = [r.onDestroy], Ge = null;
          function we() {
            if (U.length === 0) {
              J && J.update(), Ge = null;
              return;
            }
            Ge = Mn.next(we), dt();
            for (var _e = U.length - 1; _e >= 0; --_e) {
              var ke = U[_e];
              ke && ke(Y, null, 0);
            }
            l.flush(), J && J.update();
          }
          function Ce() {
            !Ge && U.length > 0 && (Ge = Mn.next(we));
          }
          function ze() {
            Ge && (Mn.cancel(we), Ge = null);
          }
          function rt(_e) {
            _e.preventDefault(), P = !0, ze(), ge.forEach(function(ke) {
              ke();
            });
          }
          function ut(_e) {
            l.getError(), P = !1, F.restore(), V.restore(), Z.restore(), ie.restore(), X.restore(), oe.restore(), ue.restore(), J && J.restore(), ye.procs.refresh(), Ce(), Le.forEach(function(ke) {
              ke();
            });
          }
          te && (te.addEventListener(ko, rt, !1), te.addEventListener(Io, ut, !1));
          function Ne() {
            U.length = 0, ze(), te && (te.removeEventListener(ko, rt), te.removeEventListener(Io, ut)), V.clear(), oe.clear(), X.clear(), ie.clear(), le.clear(), Z.clear(), ue.clear(), J && J.clear(), he.forEach(function(_e) {
              _e();
            });
          }
          function ot(_e) {
            f(!!_e, "invalid args to regl({...})"), f.type(_e, "object", "invalid args to regl({...})");
            function ke(S) {
              var v = p({}, S);
              delete v.uniforms, delete v.attributes, delete v.context, delete v.vao, "stencil" in v && v.stencil.op && (v.stencil.opBack = v.stencil.opFront = v.stencil.op, delete v.stencil.op);
              function m(g) {
                if (g in v) {
                  var s = v[g];
                  delete v[g], Object.keys(s).forEach(function(d) {
                    v[g + "." + d] = s[d];
                  });
                }
              }
              return m("blend"), m("depth"), m("cull"), m("stencil"), m("polygonOffset"), m("scissor"), m("sample"), "vao" in S && (v.vao = S.vao), v;
            }
            function $e(S, v) {
              var m = {}, g = {};
              return Object.keys(S).forEach(function(s) {
                var d = S[s];
                if (St.isDynamic(d)) {
                  g[s] = St.unbox(d, s);
                  return;
                } else if (v && Array.isArray(d)) {
                  for (var i = 0; i < d.length; ++i)
                    if (St.isDynamic(d[i])) {
                      g[s] = St.unbox(d, s);
                      return;
                    }
                }
                m[s] = d;
              }), {
                dynamic: g,
                static: m
              };
            }
            var Ze = $e(_e.context || {}, !0), Dt = $e(_e.uniforms || {}, !0), or = $e(_e.attributes || {}, !1), u = $e(ke(_e), !1), M = {
              gpuTime: 0,
              cpuTime: 0,
              count: 0
            }, O = ye.compile(u, or, Dt, Ze, M), de = O.draw, Me = O.batch, o = O.scope, t = [];
            function h(S) {
              for (; t.length < S; )
                t.push(null);
              return t;
            }
            function A(S, v) {
              var m;
              if (P && f.raise("context lost"), typeof S == "function")
                return o.call(this, null, S, 0);
              if (typeof v == "function")
                if (typeof S == "number")
                  for (m = 0; m < S; ++m)
                    o.call(this, null, v, m);
                else if (Array.isArray(S))
                  for (m = 0; m < S.length; ++m)
                    o.call(this, S[m], v, m);
                else
                  return o.call(this, S, v, 0);
              else if (typeof S == "number") {
                if (S > 0)
                  return Me.call(this, h(S | 0), S | 0);
              } else if (Array.isArray(S)) {
                if (S.length)
                  return Me.call(this, S, S.length);
              } else
                return de.call(this, S);
            }
            return p(A, {
              stats: M,
              destroy: function() {
                O.destroy();
              }
            });
          }
          var He = oe.setFBO = ot({
            framebuffer: St.define.call(null, Bo, "framebuffer")
          });
          function nt(_e, ke) {
            var $e = 0;
            ye.procs.poll();
            var Ze = ke.color;
            Ze && (l.clearColor(+Ze[0] || 0, +Ze[1] || 0, +Ze[2] || 0, +Ze[3] || 0), $e |= hc), "depth" in ke && (l.clearDepth(+ke.depth), $e |= mc), "stencil" in ke && (l.clearStencil(ke.stencil | 0), $e |= pc), f(!!$e, "called regl.clear with no buffer specified"), l.clear($e);
          }
          function st(_e) {
            if (f(
              typeof _e == "object" && _e,
              "regl.clear() takes an object as input"
            ), "framebuffer" in _e)
              if (_e.framebuffer && _e.framebuffer_reglType === "framebufferCube")
                for (var ke = 0; ke < 6; ++ke)
                  He(p({
                    framebuffer: _e.framebuffer.faces[ke]
                  }, _e), nt);
              else
                He(_e, nt);
            else
              nt(null, _e);
          }
          function ft(_e) {
            f.type(_e, "function", "regl.frame() callback must be a function"), U.push(_e);
            function ke() {
              var $e = No(U, _e);
              f($e >= 0, "cannot cancel a frame twice");
              function Ze() {
                var Dt = No(U, Ze);
                U[Dt] = U[U.length - 1], U.length -= 1, U.length <= 0 && ze();
              }
              U[$e] = Ze;
            }
            return Ce(), {
              cancel: ke
            };
          }
          function ct() {
            var _e = fe.viewport, ke = fe.scissor_box;
            _e[0] = _e[1] = ke[0] = ke[1] = 0, Y.viewportWidth = Y.framebufferWidth = Y.drawingBufferWidth = _e[2] = ke[2] = l.drawingBufferWidth, Y.viewportHeight = Y.framebufferHeight = Y.drawingBufferHeight = _e[3] = ke[3] = l.drawingBufferHeight;
          }
          function dt() {
            Y.tick += 1, Y.time = Re(), ct(), ye.procs.poll();
          }
          function Qe() {
            ie.refresh(), ct(), ye.procs.refresh(), J && J.update();
          }
          function Re() {
            return (Xa() - K) / 1e3;
          }
          Qe();
          function ht(_e, ke) {
            f.type(ke, "function", "listener callback must be a function");
            var $e;
            switch (_e) {
              case "frame":
                return ft(ke);
              case "lost":
                $e = ge;
                break;
              case "restore":
                $e = Le;
                break;
              case "destroy":
                $e = he;
                break;
              default:
                f.raise("invalid event, must be one of frame,lost,restore,destroy");
            }
            return $e.push(ke), {
              cancel: function() {
                for (var Ze = 0; Ze < $e.length; ++Ze)
                  if ($e[Ze] === ke) {
                    $e[Ze] = $e[$e.length - 1], $e.pop();
                    return;
                  }
              }
            };
          }
          var Ve = p(ot, {
            // Clear current FBO
            clear: st,
            // Short cuts for dynamic variables
            prop: St.define.bind(null, Bo),
            context: St.define.bind(null, yc),
            this: St.define.bind(null, _c),
            // executes an empty draw command
            draw: ot({}),
            // Resources
            buffer: function(_e) {
              return Z.create(_e, vc, !1, !1);
            },
            elements: function(_e) {
              return le.create(_e, !1);
            },
            texture: ie.create2D,
            cube: ie.createCube,
            renderbuffer: X.create,
            framebuffer: oe.create,
            framebufferCube: oe.createCube,
            vao: ue.createVAO,
            // Expose context attributes
            attributes: G,
            // Frame rendering
            frame: ft,
            on: ht,
            // System limits
            limits: I,
            hasExtension: function(_e) {
              return I.extensions.indexOf(_e.toLowerCase()) >= 0;
            },
            // Read pixels
            read: Ee,
            // Destroy regl and all associated resources
            destroy: Ne,
            // Direct GL state manipulation
            _gl: l,
            _refresh: Qe,
            poll: function() {
              dt(), J && J.update();
            },
            // Current time
            now: Re,
            // regl Statistics Information
            stats: W
          });
          return r.onDone(null, Ve), Ve;
        }
        return bc;
      }));
    })(On)), On.exports;
  }
  var ol = il();
  const Qo = /* @__PURE__ */ Ba(ol), sl = Dc();
  class fl {
    constructor({
      pb: n = null,
      width: y = 1280,
      height: p = 720,
      numSources: w = 4,
      numOutputs: b = 4,
      makeGlobal: H = !0,
      autoLoop: N = !0,
      detectAudio: ee = !0,
      enableStreamCapture: ce = !0,
      canvas: Xe,
      precision: Se,
      extendTransforms: Ie = {}
      // add your own functions on init
    } = {}) {
      if (Zo.init(), this.pb = n, this.width = y, this.height = p, this.renderAll = !1, this.detectAudio = ee, this._initCanvas(Xe), this.synth = {
        time: 0,
        bpm: 30,
        width: this.width,
        height: this.height,
        fps: void 0,
        stats: {
          fps: 0
        },
        speed: 1,
        mouse: sl,
        render: this._render.bind(this),
        setResolution: this.setResolution.bind(this),
        update: (Ye) => {
        },
        // user defined update function
        afterUpdate: (Ye) => {
        },
        // user defined function run after update
        hush: this.hush.bind(this),
        tick: this.tick.bind(this)
      }, H && (window.loadScript = this.loadScript), this.timeSinceLastUpdate = 0, this._time = 0, Se && ["lowp", "mediump", "highp"].includes(Se.toLowerCase()))
        this.precision = Se.toLowerCase();
      else {
        let Ye = (/iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
        this.precision = Ye ? "highp" : "mediump";
      }
      if (this.extendTransforms = Ie, this.saveFrame = !1, this.captureStream = null, this.generator = void 0, this.numOutputs = Math.max(1, b), this._initRegl(), this._initOutputs(this.numOutputs), this._initSources(w), this._generateGlslTransforms(), this.synth.screencap = () => {
        this.saveFrame = !0;
      }, ce)
        try {
          this.captureStream = this.canvas.captureStream(25), this.synth.vidRecorder = new Xc(this.captureStream);
        } catch (Ye) {
          console.warn(`[hydra-synth warning]
new MediaSource() is not currently supported on iOS.`), console.error(Ye);
        }
      ee && this._initAudio(), N && Cc(this.tick.bind(this)).start(), this.sandbox = new Wc(this.synth, H, ["speed", "update", "afterUpdate", "bpm", "fps"]);
    }
    eval(n) {
      this.sandbox.eval(n);
    }
    getScreenImage(n) {
      this.imageCallback = n, this.saveFrame = !0;
    }
    hush() {
      this.s.forEach((n) => {
        n.clear();
      }), this.o.forEach((n) => {
        this.synth.solid(0, 0, 0, 0).out(n);
      }), this.synth.render(this.o[0]), this.sandbox.set("update", (n) => {
      }), this.sandbox.set("afterUpdate", (n) => {
      });
    }
    loadScript(n = "") {
      return new Promise((p, w) => {
        var b = document.createElement("script");
        b.onload = function() {
          console.log(`loaded script ${n}`), p();
        }, b.onerror = (H) => {
          console.log(`error loading script ${n}`, "log-error"), p();
        }, b.src = n, document.head.appendChild(b);
      });
    }
    setResolution(n, y) {
      this.canvas.width = n, this.canvas.height = y, this.width = n, this.height = y, this.sandbox.set("width", n), this.sandbox.set("height", y), console.log(this.width), this.o.forEach((p) => {
        p.resize(n, y);
      }), this.s.forEach((p) => {
        p.resize(n, y);
      }), this.regl._refresh(), console.log(this.canvas.width);
    }
    canvasToImage(n) {
      const y = document.createElement("a");
      y.style.display = "none";
      let p = /* @__PURE__ */ new Date();
      y.download = `hydra-${p.getFullYear()}-${p.getMonth() + 1}-${p.getDate()}-${p.getHours()}.${p.getMinutes()}.${p.getSeconds()}.png`, document.body.appendChild(y);
      var w = this;
      this.canvas.toBlob((b) => {
        w.imageCallback ? (w.imageCallback(b), delete w.imageCallback) : (y.href = URL.createObjectURL(b), console.log(y.href), y.click());
      }, "image/png"), setTimeout(() => {
        document.body.removeChild(y), window.URL.revokeObjectURL(y.href);
      }, 300);
    }
    _initAudio() {
      this.synth.a = new jc({
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
    _initCanvas(n) {
      n ? (this.canvas = n, this.width = n.width, this.height = n.height) : (this.canvas = document.createElement("canvas"), this.canvas.width = this.width, this.canvas.height = this.height, this.canvas.style.width = "100%", this.canvas.style.height = "100%", this.canvas.style.imageRendering = "pixelated", document.body.appendChild(this.canvas));
    }
    _initRegl() {
      const n = this.canvas.getContext("webgl2", {
        alpha: !0,
        antialias: !1,
        premultipliedAlpha: !1,
        preserveDrawingBuffer: !0
      });
      n ? this.regl = Qo({
        gl: n,
        pixelRatio: 1
      }) : (console.warn("[hydra-synth] WebGL2 not available, falling back to WebGL1"), this.regl = Qo({
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
      });
      const y = {};
      for (let w = 0; w < this.numOutputs; w++)
        y[`tex[${w}]`] = this.regl.prop(`tex${w}`);
      let p;
      if (this.numOutputs === 1)
        p = `#version 300 es
        precision ${this.precision} float;
        in vec2 uv;
        out vec4 fragColor;
        uniform sampler2D tex[1]; // Array of size 1

        void main () {
          // Simple full-screen render (flipped Y for texture coords as usual)
          fragColor = texture(tex[0], vec2(1.0 - uv.x, uv.y));
        }
        `;
      else {
        const w = Math.ceil(Math.sqrt(this.numOutputs)), b = Math.ceil(this.numOutputs / w);
        let H = "";
        for (let N = 0; N < this.numOutputs; N++) {
          const ee = `if(index==${N}){ fragColor = texture(tex[${N}], st); }`;
          N === 0 ? H += ee : H += " else " + ee;
        }
        H += " else { fragColor = vec4(0.0); }", p = `#version 300 es
        precision ${this.precision} float;
        in vec2 uv;
        out vec4 fragColor;
        uniform sampler2D tex[${this.numOutputs}];

        void main () {
          vec2 st = vec2(1.0 - uv.x, uv.y);
          st *= vec2(${w}.0, ${b}.0);
          vec2 gridPos = floor(st);
          
          // Column-major indexing (y + x * rows) to preserve visual layout of previous 2x2 grid (0=TL, 1=BL, 2=TR, 3=BR)
          int index = int(gridPos.y) + int(gridPos.x) * ${b};
          
          st = fract(st);
          
          ${H}
        }
        `;
      }
      this.renderAll = this.regl({
        frag: p,
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
        uniforms: y,
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
    _initOutputs(n) {
      const y = this;
      this.o = Array(n).fill().map((p, w) => {
        var b = new Ec({
          regl: this.regl,
          width: this.width,
          height: this.height,
          precision: this.precision,
          label: `o${w}`
        });
        return b.id = w, y.synth["o" + w] = b, b;
      }), this.output = this.o[0];
    }
    _initSources(n) {
      this.s = [];
      for (var y = 0; y < n; y++)
        this.createSource(y);
    }
    createSource(n) {
      let y = new Mc({ regl: this.regl, pb: this.pb, width: this.width, height: this.height, label: `s${n}` });
      return this.synth["s" + this.s.length] = y, this.s.push(y), y;
    }
    _generateGlslTransforms() {
      var n = this;
      this.generator = new rl({
        defaultOutput: this.o[0],
        defaultUniforms: this.o[0].uniforms,
        extendTransforms: this.extendTransforms,
        changeListener: ({ type: y, method: p, synth: w }) => {
          y === "add" && (n.synth[p] = w.generators[p], n.sandbox && n.sandbox.add(p));
        }
      }), this.synth.setFunction = this.generator.setFunction.bind(this.generator);
    }
    _render(n) {
      n ? (this.output = n, this.isRenderingAll = !1) : this.isRenderingAll = !0;
    }
    // dt in ms
    tick(n, y) {
      try {
        if (this.sandbox.tick(), this.detectAudio === !0 && this.synth.a.tick(), this.sandbox.set("time", this.synth.time += n * 1e-3 * this.synth.speed), this.timeSinceLastUpdate += n, !this.synth.fps || this.timeSinceLastUpdate >= 1e3 / this.synth.fps) {
          if (this.synth.stats.fps = Math.ceil(1e3 / this.timeSinceLastUpdate), this.synth.update)
            try {
              this.synth.update(this.timeSinceLastUpdate);
            } catch (w) {
              console.log(w);
            }
          for (let w = 0; w < this.s.length; w++)
            this.s[w].tick(this.synth.time);
          const p = this.synth.time;
          for (let w = 0; w < this.o.length; w++)
            this.o[w].tick({
              time: p,
              mouse: this.synth.mouse,
              bpm: this.synth.bpm,
              resolution: [this.canvas.width, this.canvas.height]
            });
          if (this.isRenderingAll) {
            const w = {
              resolution: [this.canvas.width, this.canvas.height]
            };
            for (let b = 0; b < this.o.length; b++)
              w[`tex${b}`] = this.o[b].getCurrent();
            this.renderAll(w);
          } else
            this.renderFbo({
              tex0: this.output.getCurrent(),
              resolution: [this.canvas.width, this.canvas.height]
            });
          if (this.synth.afterUpdate)
            try {
              this.synth.afterUpdate(this.timeSinceLastUpdate);
            } catch (w) {
              console.log(w);
            }
          this.timeSinceLastUpdate = 0;
        }
        this.saveFrame === !0 && (this.canvasToImage(), this.saveFrame = !1);
      } catch (p) {
        console.warn("Error during tick():", p);
      }
    }
  }
  es.exports = fl;
});
export default ul();
