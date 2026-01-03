var gc = (c, n) => () => (n || c((n = { exports: {} }).exports, n), n.exports);
var ul = gc((ll, es) => {
  class Ec {
    constructor({ regl: n, precision: v, label: y = "", width: T, height: b }) {
      this.regl = n, this.precision = v, this.label = y, this.positionBuffer = this.regl.buffer([
        [-2, 0],
        [0, -2],
        [2, 2]
      ]), this.draw = () => {
      }, this.init(), this.pingPongIndex = 0, this.fbos = Array(2).fill().map(() => this.regl.framebuffer({
        color: this.regl.texture({
          mag: "nearest",
          width: T,
          height: b,
          format: "rgba"
        }),
        depthStencil: !1
      }));
    }
    resize(n, v) {
      this.fbos.forEach((y) => {
        y.resize(n, v);
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
      let v = n[0];
      var y = this, T = Object.assign(v.uniforms, {
        prevBuffer: () => y.fbos[y.pingPongIndex]
      });
      y.draw = y.regl({
        frag: v.frag,
        vert: y.vert,
        attributes: y.attributes,
        uniforms: T,
        count: 3,
        framebuffer: () => (y.pingPongIndex = y.pingPongIndex ? 0 : 1, y.fbos[y.pingPongIndex])
      });
    }
    tick(n) {
      this.draw(n);
    }
  }
  function Ia(c) {
    return c && c.__esModule && Object.prototype.hasOwnProperty.call(c, "default") ? c.default : c;
  }
  var Ln = { exports: {} }, $o;
  function xc() {
    return $o || ($o = 1, typeof Object.create == "function" ? Ln.exports = function(n, v) {
      v && (n.super_ = v, n.prototype = Object.create(v.prototype, {
        constructor: {
          value: n,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }));
    } : Ln.exports = function(n, v) {
      if (v) {
        n.super_ = v;
        var y = function() {
        };
        y.prototype = v.prototype, n.prototype = new y(), n.prototype.constructor = n;
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
      if (!v(b) || b < 0 || isNaN(b))
        throw TypeError("n must be a positive number");
      return this._maxListeners = b, this;
    }, c.prototype.emit = function(b) {
      var z, N, fe, ce, ke, Ne;
      if (this._events || (this._events = {}), b === "error" && (!this._events.error || y(this._events.error) && !this._events.error.length)) {
        if (z = arguments[1], z instanceof Error)
          throw z;
        var Ue = new Error('Uncaught, unspecified "error" event. (' + z + ")");
        throw Ue.context = z, Ue;
      }
      if (N = this._events[b], T(N))
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
      else if (y(N))
        for (ce = Array.prototype.slice.call(arguments, 1), Ne = N.slice(), fe = Ne.length, ke = 0; ke < fe; ke++)
          Ne[ke].apply(this, ce);
      return !0;
    }, c.prototype.addListener = function(b, z) {
      var N;
      if (!n(z))
        throw TypeError("listener must be a function");
      return this._events || (this._events = {}), this._events.newListener && this.emit(
        "newListener",
        b,
        n(z.listener) ? z.listener : z
      ), this._events[b] ? y(this._events[b]) ? this._events[b].push(z) : this._events[b] = [this._events[b], z] : this._events[b] = z, y(this._events[b]) && !this._events[b].warned && (T(this._maxListeners) ? N = c.defaultMaxListeners : N = this._maxListeners, N && N > 0 && this._events[b].length > N && (this._events[b].warned = !0, console.error(
        "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
        this._events[b].length
      ), typeof console.trace == "function" && console.trace())), this;
    }, c.prototype.on = c.prototype.addListener, c.prototype.once = function(b, z) {
      if (!n(z))
        throw TypeError("listener must be a function");
      var N = !1;
      function fe() {
        this.removeListener(b, fe), N || (N = !0, z.apply(this, arguments));
      }
      return fe.listener = z, this.on(b, fe), this;
    }, c.prototype.removeListener = function(b, z) {
      var N, fe, ce, ke;
      if (!n(z))
        throw TypeError("listener must be a function");
      if (!this._events || !this._events[b])
        return this;
      if (N = this._events[b], ce = N.length, fe = -1, N === z || n(N.listener) && N.listener === z)
        delete this._events[b], this._events.removeListener && this.emit("removeListener", b, z);
      else if (y(N)) {
        for (ke = ce; ke-- > 0; )
          if (N[ke] === z || N[ke].listener && N[ke].listener === z) {
            fe = ke;
            break;
          }
        if (fe < 0)
          return this;
        N.length === 1 ? (N.length = 0, delete this._events[b]) : N.splice(fe, 1), this._events.removeListener && this.emit("removeListener", b, z);
      }
      return this;
    }, c.prototype.removeAllListeners = function(b) {
      var z, N;
      if (!this._events)
        return this;
      if (!this._events.removeListener)
        return arguments.length === 0 ? this._events = {} : this._events[b] && delete this._events[b], this;
      if (arguments.length === 0) {
        for (z in this._events)
          z !== "removeListener" && this.removeAllListeners(z);
        return this.removeAllListeners("removeListener"), this._events = {}, this;
      }
      if (N = this._events[b], n(N))
        this.removeListener(b, N);
      else if (N)
        for (; N.length; )
          this.removeListener(b, N[N.length - 1]);
      return delete this._events[b], this;
    }, c.prototype.listeners = function(b) {
      var z;
      return !this._events || !this._events[b] ? z = [] : n(this._events[b]) ? z = [this._events[b]] : z = this._events[b].slice(), z;
    }, c.prototype.listenerCount = function(b) {
      if (this._events) {
        var z = this._events[b];
        if (n(z))
          return 1;
        if (z)
          return z.length;
      }
      return 0;
    }, c.listenerCount = function(b, z) {
      return b.listenerCount(z);
    };
    function n(b) {
      return typeof b == "function";
    }
    function v(b) {
      return typeof b == "number";
    }
    function y(b) {
      return typeof b == "object" && b !== null;
    }
    function T(b) {
      return b === void 0;
    }
    return Oa;
  }
  var Ca, zo;
  function Tc() {
    return zo || (zo = 1, Ca = window.performance && window.performance.now ? function() {
      return performance.now();
    } : Date.now || function() {
      return +/* @__PURE__ */ new Date();
    }), Ca;
  }
  var Hr = { exports: {} }, sr = { exports: {} }, Ac = sr.exports, jo;
  function Sc() {
    return jo || (jo = 1, (function() {
      var c, n, v, y, T, b;
      typeof performance < "u" && performance !== null && performance.now ? sr.exports = function() {
        return performance.now();
      } : typeof process < "u" && process !== null && process.hrtime ? (sr.exports = function() {
        return (c() - T) / 1e6;
      }, n = process.hrtime, c = function() {
        var z;
        return z = n(), z[0] * 1e9 + z[1];
      }, y = c(), b = process.uptime() * 1e9, T = y - b) : Date.now ? (sr.exports = function() {
        return Date.now() - v;
      }, v = Date.now()) : (sr.exports = function() {
        return (/* @__PURE__ */ new Date()).getTime() - v;
      }, v = (/* @__PURE__ */ new Date()).getTime());
    }).call(Ac)), sr.exports;
  }
  var Xo;
  function Lc() {
    if (Xo) return Hr.exports;
    Xo = 1;
    for (var c = Sc(), n = window, v = ["moz", "webkit"], y = "AnimationFrame", T = n["request" + y], b = n["cancel" + y] || n["cancelRequest" + y], z = 0; !T && z < v.length; z++)
      T = n[v[z] + "Request" + y], b = n[v[z] + "Cancel" + y] || n[v[z] + "CancelRequest" + y];
    if (!T || !b) {
      var N = 0, fe = 0, ce = [], ke = 1e3 / 60;
      T = function(Ne) {
        if (ce.length === 0) {
          var Ue = c(), rt = Math.max(0, ke - (Ue - N));
          N = rt + Ue, setTimeout(function() {
            var We = ce.slice(0);
            ce.length = 0;
            for (var ft = 0; ft < We.length; ft++)
              if (!We[ft].cancelled)
                try {
                  We[ft].callback(N);
                } catch (Pt) {
                  setTimeout(function() {
                    throw Pt;
                  }, 0);
                }
          }, Math.round(rt));
        }
        return ce.push({
          handle: ++fe,
          callback: Ne,
          cancelled: !1
        }), fe;
      }, b = function(Ne) {
        for (var Ue = 0; Ue < ce.length; Ue++)
          ce[Ue].handle === Ne && (ce[Ue].cancelled = !0);
      };
    }
    return Hr.exports = function(Ne) {
      return T.call(n, Ne);
    }, Hr.exports.cancel = function() {
      b.apply(n, arguments);
    }, Hr.exports.polyfill = function(Ne) {
      Ne || (Ne = n), Ne.requestAnimationFrame = T, Ne.cancelAnimationFrame = b;
    }, Hr.exports;
  }
  var Fa, Vo;
  function Rc() {
    if (Vo) return Fa;
    Vo = 1;
    var c = xc(), n = wc().EventEmitter, v = Tc(), y = Lc();
    Fa = T;
    function T(b) {
      if (!(this instanceof T))
        return new T(b);
      this.running = !1, this.last = v(), this._frame = 0, this._tick = this.tick.bind(this), b && this.on("tick", b);
    }
    return c(T, n), T.prototype.start = function() {
      if (!this.running)
        return this.running = !0, this.last = v(), this._frame = y(this._tick), this;
    }, T.prototype.stop = function() {
      return this.running = !1, this._frame !== 0 && y.cancel(this._frame), this._frame = 0, this;
    }, T.prototype.tick = function() {
      this._frame = y(this._tick);
      var b = v(), z = b - this.last;
      this.emit("tick", z), this.last = b;
    }, Fa;
  }
  var Oc = Rc();
  const Cc = /* @__PURE__ */ Ia(Oc);
  function Fc(c) {
    return navigator.mediaDevices.enumerateDevices().then((n) => n.filter((v) => v.kind === "videoinput")).then((n) => {
      let v = { audio: !1, video: !0 };
      return n[c] && (v.video = {
        deviceId: { exact: n[c].deviceId }
      }), window.navigator.mediaDevices.getUserMedia(v);
    }).then((n) => {
      const v = document.createElement("video");
      return v.setAttribute("autoplay", ""), v.setAttribute("muted", ""), v.setAttribute("playsinline", ""), v.srcObject = n, new Promise((y, T) => {
        v.addEventListener("loadedmetadata", () => {
          v.play().then(() => y({ video: v }));
        });
      });
    }).catch(console.log.bind(console));
  }
  function Gc(c) {
    return new Promise(function(n, v) {
      navigator.mediaDevices.getDisplayMedia(c).then((y) => {
        const T = document.createElement("video");
        T.srcObject = y, T.addEventListener("loadedmetadata", () => {
          T.play(), n({ video: T });
        });
      }).catch((y) => v(y));
    });
  }
  class Mc {
    constructor({ regl: n, width: v, height: y, pb: T, label: b = "" }) {
      this.label = b, this.regl = n, this.src = null, this.dynamic = !0, this.width = v, this.height = y, this.tex = this.regl.texture({
        //  shape: [width, height]
        shape: [1, 1]
      }), this.pb = T;
    }
    init(n, v) {
      "src" in n && (this.src = n.src, this.tex = this.regl.texture({ data: this.src, ...v })), "dynamic" in n && (this.dynamic = n.dynamic);
    }
    initCam(n, v) {
      const y = this;
      Fc(n).then((T) => {
        y.src = T.video, y.dynamic = !0, y.tex = y.regl.texture({ data: y.src, ...v });
      }).catch((T) => console.log("could not get camera", T));
    }
    initVideo(n = "", v) {
      const y = document.createElement("video");
      y.crossOrigin = "anonymous", y.autoplay = !0, y.loop = !0, y.muted = !0, y.addEventListener("loadeddata", () => {
        this.src = y, y.play(), this.tex = this.regl.texture({ data: this.src, ...v }), this.dynamic = !0;
      }), y.src = n;
    }
    initImage(n = "", v) {
      const y = document.createElement("img");
      y.crossOrigin = "anonymous", y.src = n, y.onload = () => {
        this.src = y, this.dynamic = !1, this.tex = this.regl.texture({ data: this.src, ...v });
      };
    }
    initStream(n, v) {
      let y = this;
      n && this.pb && (this.pb.initSource(n), this.pb.on("got video", function(T, b) {
        T === n && (y.src = b, y.dynamic = !0, y.tex = y.regl.texture({ data: y.src, ...v }));
      }));
    }
    // index only relevant in atom-hydra + desktop apps
    initScreen(n = 0, v) {
      const y = this;
      Gc().then(function(T) {
        y.src = T.video, y.tex = y.regl.texture({ data: y.src, ...v }), y.dynamic = !0;
      }).catch((T) => console.log("could not get screen", T));
    }
    // cache for the canvases, so we don't create them every time
    canvases = {};
    // Creates a canvas and returns the 2d context
    initCanvas(n = 1e3, v = 1e3) {
      if (this.canvases[this.label] == null) {
        const z = document.createElement("canvas").getContext("2d");
        z != null && (this.canvases[this.label] = z);
      }
      const y = this.canvases[this.label], T = y.canvas;
      return T.width !== n && T.height !== v ? (T.width = n, T.height = v) : y.clearRect(0, 0, n, v), this.init({ src: T }), this.dynamic = !0, y;
    }
    resize(n, v) {
      this.width = n, this.height = v;
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
  function Bc(c) {
    return c.target || c.srcElement || window;
  }
  zt.element = Bc;
  function Ic(c) {
    return typeof c == "object" && "pageX" in c ? c.pageX : 0;
  }
  zt.x = Ic;
  function Nc(c) {
    return typeof c == "object" && "pageY" in c ? c.pageY : 0;
  }
  zt.y = Nc;
  function Dc(c, n) {
    n || (n = c, c = window);
    var v = 0, y = 0, T = 0, b = {
      shift: !1,
      alt: !1,
      control: !1,
      meta: !1
    }, z = !1;
    function N(ze) {
      var nt = !1;
      return "altKey" in ze && (nt = nt || ze.altKey !== b.alt, b.alt = !!ze.altKey), "shiftKey" in ze && (nt = nt || ze.shiftKey !== b.shift, b.shift = !!ze.shiftKey), "ctrlKey" in ze && (nt = nt || ze.ctrlKey !== b.control, b.control = !!ze.ctrlKey), "metaKey" in ze && (nt = nt || ze.metaKey !== b.meta, b.meta = !!ze.metaKey), nt;
    }
    function fe(ze, nt) {
      var Yt = zt.x(nt), gt = zt.y(nt);
      "buttons" in nt && (ze = nt.buttons | 0), (ze !== v || Yt !== y || gt !== T || N(nt)) && (v = ze | 0, y = Yt || 0, T = gt || 0, n && n(v, y, T, b));
    }
    function ce(ze) {
      fe(0, ze);
    }
    function ke() {
      (v || y || T || b.shift || b.alt || b.meta || b.control) && (y = T = 0, v = 0, b.shift = b.alt = b.control = b.meta = !1, n && n(0, 0, 0, b));
    }
    function Ne(ze) {
      N(ze) && n && n(v, y, T, b);
    }
    function Ue(ze) {
      zt.buttons(ze) === 0 ? fe(0, ze) : fe(v, ze);
    }
    function rt(ze) {
      fe(v | zt.buttons(ze), ze);
    }
    function We(ze) {
      fe(v & ~zt.buttons(ze), ze);
    }
    function ft() {
      z || (z = !0, c.addEventListener("mousemove", Ue), c.addEventListener("mousedown", rt), c.addEventListener("mouseup", We), c.addEventListener("mouseleave", ce), c.addEventListener("mouseenter", ce), c.addEventListener("mouseout", ce), c.addEventListener("mouseover", ce), c.addEventListener("blur", ke), c.addEventListener("keyup", Ne), c.addEventListener("keydown", Ne), c.addEventListener("keypress", Ne), c !== window && (window.addEventListener("blur", ke), window.addEventListener("keyup", Ne), window.addEventListener("keydown", Ne), window.addEventListener("keypress", Ne)));
    }
    function Pt() {
      z && (z = !1, c.removeEventListener("mousemove", Ue), c.removeEventListener("mousedown", rt), c.removeEventListener("mouseup", We), c.removeEventListener("mouseleave", ce), c.removeEventListener("mouseenter", ce), c.removeEventListener("mouseout", ce), c.removeEventListener("mouseover", ce), c.removeEventListener("blur", ke), c.removeEventListener("keyup", Ne), c.removeEventListener("keydown", Ne), c.removeEventListener("keypress", Ne), c !== window && (window.removeEventListener("blur", ke), window.removeEventListener("keyup", Ne), window.removeEventListener("keydown", Ne), window.removeEventListener("keypress", Ne)));
    }
    ft();
    var pt = {
      element: c
    };
    return Object.defineProperties(pt, {
      enabled: {
        get: function() {
          return z;
        },
        set: function(ze) {
          ze ? ft() : Pt();
        },
        enumerable: !0
      },
      buttons: {
        get: function() {
          return v;
        },
        enumerable: !0
      },
      x: {
        get: function() {
          return y;
        },
        enumerable: !0
      },
      y: {
        get: function() {
          return T;
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
      (function(v, y) {
        c.exports = y();
      })(Pc, (function() {
        function v(R, _, X) {
          for (var C, te = 0, pe = _.length; te < pe; te++) !C && te in _ || (C || (C = Array.prototype.slice.call(_, 0, te)), C[te] = _[te]);
          return R.concat(C || Array.prototype.slice.call(_));
        }
        var y = Object.freeze({ __proto__: null, blackman: function(R) {
          for (var _ = new Float32Array(R), X = 2 * Math.PI / (R - 1), C = 2 * X, te = 0; te < R / 2; te++) _[te] = 0.42 - 0.5 * Math.cos(te * X) + 0.08 * Math.cos(te * C);
          for (te = Math.ceil(R / 2); te > 0; te--) _[R - te] = _[te - 1];
          return _;
        }, hamming: function(R) {
          for (var _ = new Float32Array(R), X = 0; X < R; X++) _[X] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (X / R - 1));
          return _;
        }, hanning: function(R) {
          for (var _ = new Float32Array(R), X = 0; X < R; X++) _[X] = 0.5 - 0.5 * Math.cos(2 * Math.PI * X / (R - 1));
          return _;
        }, sine: function(R) {
          for (var _ = Math.PI / (R - 1), X = new Float32Array(R), C = 0; C < R; C++) X[C] = Math.sin(_ * C);
          return X;
        } }), T = {};
        function b(R) {
          for (; R % 2 == 0 && R > 1; ) R /= 2;
          return R === 1;
        }
        function z(R, _) {
          if (_ !== "rect") {
            if (_ !== "" && _ || (_ = "hanning"), T[_] || (T[_] = {}), !T[_][R.length]) try {
              T[_][R.length] = y[_](R.length);
            } catch {
              throw new Error("Invalid windowing function");
            }
            R = (function(X, C) {
              for (var te = [], pe = 0; pe < Math.min(X.length, C.length); pe++) te[pe] = X[pe] * C[pe];
              return te;
            })(R, T[_][R.length]);
          }
          return R;
        }
        function N(R, _, X) {
          for (var C = new Float32Array(R), te = 0; te < C.length; te++) C[te] = te * _ / X, C[te] = 13 * Math.atan(C[te] / 1315.8) + 3.5 * Math.atan(Math.pow(C[te] / 7518, 2));
          return C;
        }
        function fe(R) {
          return Float32Array.from(R);
        }
        function ce(R) {
          return 1125 * Math.log(1 + R / 700);
        }
        function ke(R, _, X) {
          for (var C, te = new Float32Array(R + 2), pe = new Float32Array(R + 2), Ce = _ / 2, Be = ce(0), Te = (ce(Ce) - Be) / (R + 1), xe = new Array(R + 2), Pe = 0; Pe < te.length; Pe++) te[Pe] = Pe * Te, pe[Pe] = (C = te[Pe], 700 * (Math.exp(C / 1125) - 1)), xe[Pe] = Math.floor((X + 1) * pe[Pe] / _);
          for (var vt = new Array(R), De = 0; De < vt.length; De++) {
            for (vt[De] = new Array(X / 2 + 1).fill(0), Pe = xe[De]; Pe < xe[De + 1]; Pe++) vt[De][Pe] = (Pe - xe[De]) / (xe[De + 1] - xe[De]);
            for (Pe = xe[De + 1]; Pe < xe[De + 2]; Pe++) vt[De][Pe] = (xe[De + 2] - Pe) / (xe[De + 2] - xe[De + 1]);
          }
          return vt;
        }
        function Ne(R, _, X, C, te, pe, Ce) {
          C === void 0 && (C = 5), te === void 0 && (te = 2), pe === void 0 && (pe = !0), Ce === void 0 && (Ce = 440);
          var Be = Math.floor(X / 2) + 1, Te = new Array(X).fill(0).map((function(at, mt) {
            return R * (function(yt, Ft) {
              return Math.log2(16 * yt / Ft);
            })(_ * mt / X, Ce);
          }));
          Te[0] = Te[1] - 1.5 * R;
          var xe, Pe, vt, De = Te.slice(1).map((function(at, mt) {
            return Math.max(at - Te[mt]);
          }), 1).concat([1]), Rt = Math.round(R / 2), wt = new Array(R).fill(0).map((function(at, mt) {
            return Te.map((function(yt) {
              return (10 * R + Rt + yt - mt) % R - Rt;
            }));
          })), Tt = wt.map((function(at, mt) {
            return at.map((function(yt, Ft) {
              return Math.exp(-0.5 * Math.pow(2 * wt[mt][Ft] / De[Ft], 2));
            }));
          }));
          if (Pe = (xe = Tt)[0].map((function() {
            return 0;
          })), vt = xe.reduce((function(at, mt) {
            return mt.forEach((function(yt, Ft) {
              at[Ft] += Math.pow(yt, 2);
            })), at;
          }), Pe).map(Math.sqrt), Tt = xe.map((function(at, mt) {
            return at.map((function(yt, Ft) {
              return yt / (vt[Ft] || 1);
            }));
          })), te) {
            var Lr = Te.map((function(at) {
              return Math.exp(-0.5 * Math.pow((at / R - C) / te, 2));
            }));
            Tt = Tt.map((function(at) {
              return at.map((function(mt, yt) {
                return mt * Lr[yt];
              }));
            }));
          }
          return pe && (Tt = v(v([], Tt.slice(3), !0), Tt.slice(0, 3))), Tt.map((function(at) {
            return at.slice(0, Be);
          }));
        }
        function Ue(R, _) {
          for (var X = 0, C = 0, te = 0; te < _.length; te++) X += Math.pow(te, R) * Math.abs(_[te]), C += _[te];
          return X / C;
        }
        function rt(R) {
          var _ = R.ampSpectrum, X = R.barkScale, C = R.numberOfBarkBands, te = C === void 0 ? 24 : C;
          if (typeof _ != "object" || typeof X != "object") throw new TypeError();
          var pe = te, Ce = new Float32Array(pe), Be = 0, Te = _, xe = new Int32Array(pe + 1);
          xe[0] = 0;
          for (var Pe = X[Te.length - 1] / pe, vt = 1, De = 0; De < Te.length; De++) for (; X[De] > Pe; ) xe[vt++] = De, Pe = vt * X[Te.length - 1] / pe;
          for (xe[pe] = Te.length - 1, De = 0; De < pe; De++) {
            for (var Rt = 0, wt = xe[De]; wt < xe[De + 1]; wt++) Rt += Te[wt];
            Ce[De] = Math.pow(Rt, 0.23);
          }
          for (De = 0; De < Ce.length; De++) Be += Ce[De];
          return { specific: Ce, total: Be };
        }
        function We(R) {
          var _ = R.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          for (var X = new Float32Array(_.length), C = 0; C < X.length; C++) X[C] = Math.pow(_[C], 2);
          return X;
        }
        function ft(R) {
          var _ = R.ampSpectrum, X = R.melFilterBank, C = R.bufferSize;
          if (typeof _ != "object") throw new TypeError("Valid ampSpectrum is required to generate melBands");
          if (typeof X != "object") throw new TypeError("Valid melFilterBank is required to generate melBands");
          for (var te = We({ ampSpectrum: _ }), pe = X.length, Ce = Array(pe), Be = new Float32Array(pe), Te = 0; Te < Be.length; Te++) {
            Ce[Te] = new Float32Array(C / 2), Be[Te] = 0;
            for (var xe = 0; xe < C / 2; xe++) Ce[Te][xe] = X[Te][xe] * te[xe], Be[Te] += Ce[Te][xe];
            Be[Te] = Math.log(Be[Te] + 1);
          }
          return Array.prototype.slice.call(Be);
        }
        function Pt(R) {
          return R && R.__esModule && Object.prototype.hasOwnProperty.call(R, "default") ? R.default : R;
        }
        var pt = null, ze = Pt((function(R, _) {
          var X = R.length;
          return _ = _ || 2, pt && pt[X] || (function(C) {
            (pt = pt || {})[C] = new Array(C * C);
            for (var te = Math.PI / C, pe = 0; pe < C; pe++) for (var Ce = 0; Ce < C; Ce++) pt[C][Ce + pe * C] = Math.cos(te * (Ce + 0.5) * pe);
          })(X), R.map((function() {
            return 0;
          })).map((function(C, te) {
            return _ * R.reduce((function(pe, Ce, Be, Te) {
              return pe + Ce * pt[X][Be + te * X];
            }), 0);
          }));
        })), nt = Object.freeze({ __proto__: null, amplitudeSpectrum: function(R) {
          return R.ampSpectrum;
        }, buffer: function(R) {
          return R.signal;
        }, chroma: function(R) {
          var _ = R.ampSpectrum, X = R.chromaFilterBank;
          if (typeof _ != "object") throw new TypeError("Valid ampSpectrum is required to generate chroma");
          if (typeof X != "object") throw new TypeError("Valid chromaFilterBank is required to generate chroma");
          var C = X.map((function(pe, Ce) {
            return _.reduce((function(Be, Te, xe) {
              return Be + Te * pe[xe];
            }), 0);
          })), te = Math.max.apply(Math, C);
          return te ? C.map((function(pe) {
            return pe / te;
          })) : C;
        }, complexSpectrum: function(R) {
          return R.complexSpectrum;
        }, energy: function(R) {
          var _ = R.signal;
          if (typeof _ != "object") throw new TypeError();
          for (var X = 0, C = 0; C < _.length; C++) X += Math.pow(Math.abs(_[C]), 2);
          return X;
        }, loudness: rt, melBands: ft, mfcc: function(R) {
          var _ = R.ampSpectrum, X = R.melFilterBank, C = R.numberOfMFCCCoefficients, te = R.bufferSize, pe = Math.min(40, Math.max(1, C || 13));
          if (X.length < pe) throw new Error("Insufficient filter bank for requested number of coefficients");
          var Ce = ft({ ampSpectrum: _, melFilterBank: X, bufferSize: te });
          return ze(Ce).slice(0, pe);
        }, perceptualSharpness: function(R) {
          for (var _ = rt({ ampSpectrum: R.ampSpectrum, barkScale: R.barkScale }), X = _.specific, C = 0, te = 0; te < X.length; te++) C += te < 15 ? (te + 1) * X[te + 1] : 0.066 * Math.exp(0.171 * (te + 1));
          return C *= 0.11 / _.total;
        }, perceptualSpread: function(R) {
          for (var _ = rt({ ampSpectrum: R.ampSpectrum, barkScale: R.barkScale }), X = 0, C = 0; C < _.specific.length; C++) _.specific[C] > X && (X = _.specific[C]);
          return Math.pow((_.total - X) / _.total, 2);
        }, powerSpectrum: We, rms: function(R) {
          var _ = R.signal;
          if (typeof _ != "object") throw new TypeError();
          for (var X = 0, C = 0; C < _.length; C++) X += Math.pow(_[C], 2);
          return X /= _.length, X = Math.sqrt(X);
        }, spectralCentroid: function(R) {
          var _ = R.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          return Ue(1, _);
        }, spectralCrest: function(R) {
          var _ = R.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          var X = 0, C = -1 / 0;
          return _.forEach((function(te) {
            X += Math.pow(te, 2), C = te > C ? te : C;
          })), X /= _.length, X = Math.sqrt(X), C / X;
        }, spectralFlatness: function(R) {
          var _ = R.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          for (var X = 0, C = 0, te = 0; te < _.length; te++) X += Math.log(_[te]), C += _[te];
          return Math.exp(X / _.length) * _.length / C;
        }, spectralFlux: function(R) {
          var _ = R.signal, X = R.previousSignal, C = R.bufferSize;
          if (typeof _ != "object" || typeof X != "object") throw new TypeError();
          for (var te = 0, pe = -C / 2; pe < _.length / 2 - 1; pe++) x = Math.abs(_[pe]) - Math.abs(X[pe]), te += (x + Math.abs(x)) / 2;
          return te;
        }, spectralKurtosis: function(R) {
          var _ = R.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          var X = _, C = Ue(1, X), te = Ue(2, X), pe = Ue(3, X), Ce = Ue(4, X);
          return (-3 * Math.pow(C, 4) + 6 * C * te - 4 * C * pe + Ce) / Math.pow(Math.sqrt(te - Math.pow(C, 2)), 4);
        }, spectralRolloff: function(R) {
          var _ = R.ampSpectrum, X = R.sampleRate;
          if (typeof _ != "object") throw new TypeError();
          for (var C = _, te = X / (2 * (C.length - 1)), pe = 0, Ce = 0; Ce < C.length; Ce++) pe += C[Ce];
          for (var Be = 0.99 * pe, Te = C.length - 1; pe > Be && Te >= 0; ) pe -= C[Te], --Te;
          return (Te + 1) * te;
        }, spectralSkewness: function(R) {
          var _ = R.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          var X = Ue(1, _), C = Ue(2, _), te = Ue(3, _);
          return (2 * Math.pow(X, 3) - 3 * X * C + te) / Math.pow(Math.sqrt(C - Math.pow(X, 2)), 3);
        }, spectralSlope: function(R) {
          var _ = R.ampSpectrum, X = R.sampleRate, C = R.bufferSize;
          if (typeof _ != "object") throw new TypeError();
          for (var te = 0, pe = 0, Ce = new Float32Array(_.length), Be = 0, Te = 0, xe = 0; xe < _.length; xe++) {
            te += _[xe];
            var Pe = xe * X / C;
            Ce[xe] = Pe, Be += Pe * Pe, pe += Pe, Te += Pe * _[xe];
          }
          return (_.length * Te - pe * te) / (te * (Be - Math.pow(pe, 2)));
        }, spectralSpread: function(R) {
          var _ = R.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          return Math.sqrt(Ue(2, _) - Math.pow(Ue(1, _), 2));
        }, zcr: function(R) {
          var _ = R.signal;
          if (typeof _ != "object") throw new TypeError();
          for (var X = 0, C = 1; C < _.length; C++) (_[C - 1] >= 0 && _[C] < 0 || _[C - 1] < 0 && _[C] >= 0) && X++;
          return X;
        } });
        function Yt(R) {
          if (Array.isArray(R)) {
            for (var _ = 0, X = Array(R.length); _ < R.length; _++) X[_] = R[_];
            return X;
          }
          return Array.from(R);
        }
        var gt = {}, fr = {}, Bt = { bitReverseArray: function(R) {
          if (gt[R] === void 0) {
            for (var _ = (R - 1).toString(2).length, X = "0".repeat(_), C = {}, te = 0; te < R; te++) {
              var pe = te.toString(2);
              pe = X.substr(pe.length) + pe, pe = [].concat(Yt(pe)).reverse().join(""), C[te] = parseInt(pe, 2);
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
          var X = -2 * Math.PI * R / _;
          return { real: Math.cos(X), imag: Math.sin(X) };
        }, conj: function(R) {
          return R.imag *= -1, R;
        }, constructComplexArray: function(R) {
          var _ = {};
          _.real = R.real === void 0 ? R.slice() : R.real.slice();
          var X = _.real.length;
          return fr[X] === void 0 && (fr[X] = Array.apply(null, Array(X)).map(Number.prototype.valueOf, 0)), _.imag = fr[X].slice(), _;
        } }, Cn = function(R) {
          var _ = {};
          R.real === void 0 || R.imag === void 0 ? _ = Bt.constructComplexArray(R) : (_.real = R.real.slice(), _.imag = R.imag.slice());
          var X = _.real.length, C = Math.log2(X);
          if (Math.round(C) != C) throw new Error("Input size must be a power of 2.");
          if (_.real.length != _.imag.length) throw new Error("Real and imaginary components must have the same length.");
          for (var te = Bt.bitReverseArray(X), pe = { real: [], imag: [] }, Ce = 0; Ce < X; Ce++) pe.real[te[Ce]] = _.real[Ce], pe.imag[te[Ce]] = _.imag[Ce];
          for (var Be = 0; Be < X; Be++) _.real[Be] = pe.real[Be], _.imag[Be] = pe.imag[Be];
          for (var Te = 1; Te <= C; Te++) for (var xe = Math.pow(2, Te), Pe = 0; Pe < xe / 2; Pe++) for (var vt = Bt.euler(Pe, xe), De = 0; De < X / xe; De++) {
            var Rt = xe * De + Pe, wt = xe * De + Pe + xe / 2, Tt = { real: _.real[Rt], imag: _.imag[Rt] }, Lr = { real: _.real[wt], imag: _.imag[wt] }, at = Bt.multiply(vt, Lr), mt = Bt.subtract(Tt, at);
            _.real[wt] = mt.real, _.imag[wt] = mt.imag;
            var yt = Bt.add(at, Tt);
            _.real[Rt] = yt.real, _.imag[Rt] = yt.imag;
          }
          return _;
        }, Fn = Cn, Gn = (function() {
          function R(_, X) {
            var C = this;
            if (this._m = X, !_.audioContext) throw this._m.errors.noAC;
            if (_.bufferSize && !b(_.bufferSize)) throw this._m._errors.notPow2;
            if (!_.source) throw this._m._errors.noSource;
            this._m.audioContext = _.audioContext, this._m.bufferSize = _.bufferSize || this._m.bufferSize || 256, this._m.hopSize = _.hopSize || this._m.hopSize || this._m.bufferSize, this._m.sampleRate = _.sampleRate || this._m.audioContext.sampleRate || 44100, this._m.callback = _.callback, this._m.windowingFunction = _.windowingFunction || "hanning", this._m.featureExtractors = nt, this._m.EXTRACTION_STARTED = _.startImmediately || !1, this._m.channel = typeof _.channel == "number" ? _.channel : 0, this._m.inputs = _.inputs || 1, this._m.outputs = _.outputs || 1, this._m.numberOfMFCCCoefficients = _.numberOfMFCCCoefficients || this._m.numberOfMFCCCoefficients || 13, this._m.numberOfBarkBands = _.numberOfBarkBands || this._m.numberOfBarkBands || 24, this._m.spn = this._m.audioContext.createScriptProcessor(this._m.bufferSize, this._m.inputs, this._m.outputs), this._m.spn.connect(this._m.audioContext.destination), this._m._featuresToExtract = _.featureExtractors || [], this._m.barkScale = N(this._m.bufferSize, this._m.sampleRate, this._m.bufferSize), this._m.melFilterBank = ke(Math.max(this._m.melBands, this._m.numberOfMFCCCoefficients), this._m.sampleRate, this._m.bufferSize), this._m.inputData = null, this._m.previousInputData = null, this._m.frame = null, this._m.previousFrame = null, this.setSource(_.source), this._m.spn.onaudioprocess = function(te) {
              var pe;
              C._m.inputData !== null && (C._m.previousInputData = C._m.inputData), C._m.inputData = te.inputBuffer.getChannelData(C._m.channel), C._m.previousInputData ? ((pe = new Float32Array(C._m.previousInputData.length + C._m.inputData.length - C._m.hopSize)).set(C._m.previousInputData.slice(C._m.hopSize)), pe.set(C._m.inputData, C._m.previousInputData.length - C._m.hopSize)) : pe = C._m.inputData;
              var Ce = (function(Be, Te, xe) {
                if (Be.length < Te) throw new Error("Buffer is too short for frame length");
                if (xe < 1) throw new Error("Hop length cannot be less that 1");
                if (Te < 1) throw new Error("Frame length cannot be less that 1");
                var Pe = 1 + Math.floor((Be.length - Te) / xe);
                return new Array(Pe).fill(0).map((function(vt, De) {
                  return Be.slice(De * xe, De * xe + Te);
                }));
              })(pe, C._m.bufferSize, C._m.hopSize);
              Ce.forEach((function(Be) {
                C._m.frame = Be;
                var Te = C._m.extract(C._m._featuresToExtract, C._m.frame, C._m.previousFrame);
                typeof C._m.callback == "function" && C._m.EXTRACTION_STARTED && C._m.callback(Te), C._m.previousFrame = C._m.frame;
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
        })(), Ar = { audioContext: null, spn: null, bufferSize: 512, sampleRate: 44100, melBands: 26, chromaBands: 12, callback: null, windowingFunction: "hanning", featureExtractors: nt, EXTRACTION_STARTED: !1, numberOfMFCCCoefficients: 13, numberOfBarkBands: 24, _featuresToExtract: [], windowing: z, _errors: { notPow2: new Error("Meyda: Buffer size must be a power of 2, e.g. 64 or 512"), featureUndef: new Error("Meyda: No features defined."), invalidFeatureFmt: new Error("Meyda: Invalid feature format"), invalidInput: new Error("Meyda: Invalid input."), noAC: new Error("Meyda: No AudioContext specified."), noSource: new Error("Meyda: No source node specified.") }, createMeydaAnalyzer: function(R) {
          return new Gn(R, Object.assign({}, Ar));
        }, listAvailableFeatureExtractors: function() {
          return Object.keys(this.featureExtractors);
        }, extract: function(R, _, X) {
          var C = this;
          if (!_) throw this._errors.invalidInput;
          if (typeof _ != "object") throw this._errors.invalidInput;
          if (!R) throw this._errors.featureUndef;
          if (!b(_.length)) throw this._errors.notPow2;
          this.barkScale !== void 0 && this.barkScale.length == this.bufferSize || (this.barkScale = N(this.bufferSize, this.sampleRate, this.bufferSize)), this.melFilterBank !== void 0 && this.barkScale.length == this.bufferSize && this.melFilterBank.length == this.melBands || (this.melFilterBank = ke(Math.max(this.melBands, this.numberOfMFCCCoefficients), this.sampleRate, this.bufferSize)), this.chromaFilterBank !== void 0 && this.chromaFilterBank.length == this.chromaBands || (this.chromaFilterBank = Ne(this.chromaBands, this.sampleRate, this.bufferSize)), "buffer" in _ && _.buffer === void 0 ? this.signal = fe(_) : this.signal = _;
          var te = Sr(_, this.windowingFunction, this.bufferSize);
          if (this.signal = te.windowedSignal, this.complexSpectrum = te.complexSpectrum, this.ampSpectrum = te.ampSpectrum, X) {
            var pe = Sr(X, this.windowingFunction, this.bufferSize);
            this.previousSignal = pe.windowedSignal, this.previousComplexSpectrum = pe.complexSpectrum, this.previousAmpSpectrum = pe.ampSpectrum;
          }
          var Ce = function(Be) {
            return C.featureExtractors[Be]({ ampSpectrum: C.ampSpectrum, chromaFilterBank: C.chromaFilterBank, complexSpectrum: C.complexSpectrum, signal: C.signal, bufferSize: C.bufferSize, sampleRate: C.sampleRate, barkScale: C.barkScale, melFilterBank: C.melFilterBank, previousSignal: C.previousSignal, previousAmpSpectrum: C.previousAmpSpectrum, previousComplexSpectrum: C.previousComplexSpectrum, numberOfMFCCCoefficients: C.numberOfMFCCCoefficients, numberOfBarkBands: C.numberOfBarkBands });
          };
          if (typeof R == "object") return R.reduce((function(Be, Te) {
            var xe;
            return Object.assign({}, Be, ((xe = {})[Te] = Ce(Te), xe));
          }), {});
          if (typeof R == "string") return Ce(R);
          throw this._errors.invalidFeatureFmt;
        } }, Sr = function(R, _, X) {
          var C = {};
          R.buffer === void 0 ? C.signal = fe(R) : C.signal = R, C.windowedSignal = z(C.signal, _), C.complexSpectrum = Fn(C.windowedSignal), C.ampSpectrum = new Float32Array(X / 2);
          for (var te = 0; te < X / 2; te++) C.ampSpectrum[te] = Math.sqrt(Math.pow(C.complexSpectrum.real[te], 2) + Math.pow(C.complexSpectrum.imag[te], 2));
          return C;
        };
        return typeof window < "u" && (window.Meyda = Ar), Ar;
      }));
    })(Rn)), Rn.exports;
  }
  var Uc = $c();
  const zc = /* @__PURE__ */ Ia(Uc);
  class jc {
    constructor({
      numBins: n = 4,
      cutoff: v = 2,
      smooth: y = 0.4,
      max: T = 15,
      scale: b = 10,
      isDrawing: z = !1,
      parentEl: N = document.body
    }) {
      this.vol = 0, this.scale = b, this.max = T, this.cutoff = v, this.smooth = y, this.setBins(n), this.beat = {
        holdFrames: 20,
        threshold: 40,
        _cutoff: 0,
        // adaptive based on sound state
        decay: 0.98,
        _framesSinceBeat: 0
        // keeps track of frames
      }, this.onBeat = () => {
      }, this.canvas = document.createElement("canvas"), this.canvas.width = 100, this.canvas.height = 80, this.canvas.style.width = "100px", this.canvas.style.height = "80px", this.canvas.style.position = "absolute", this.canvas.style.right = "0px", this.canvas.style.bottom = "0px", N.appendChild(this.canvas), this.isDrawing = z, this.ctx = this.canvas.getContext("2d"), this.ctx.fillStyle = "#DFFFFF", this.ctx.strokeStyle = "#0ff", this.ctx.lineWidth = 0.5, window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia({ video: !1, audio: !0 }).then((fe) => {
        this.stream = fe, this.context = new AudioContext();
        let ce = this.context.createMediaStreamSource(fe);
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
      }).catch((fe) => console.log("ERROR", fe));
    }
    detectBeat(n) {
      n > this.beat._cutoff && n > this.beat.threshold ? (this.onBeat(), this.beat._cutoff = n * 1.2, this.beat._framesSinceBeat = 0) : this.beat._framesSinceBeat <= this.beat.holdFrames ? this.beat._framesSinceBeat++ : (this.beat._cutoff *= this.beat.decay, this.beat._cutoff = Math.max(this.beat._cutoff, this.beat.threshold));
    }
    tick() {
      if (this.meyda) {
        var n = this.meyda.get();
        if (n && n !== null) {
          this.vol = n.loudness.total, this.detectBeat(this.vol);
          const v = (T, b) => T + b;
          let y = Math.floor(n.loudness.specific.length / this.bins.length);
          this.prevBins = this.bins.slice(0), this.bins = this.bins.map((T, b) => n.loudness.specific.slice(b * y, (b + 1) * y).reduce(v)).map((T, b) => T * (1 - this.settings[b].smooth) + this.prevBins[b] * this.settings[b].smooth), this.fft = this.bins.map((T, b) => (
            // Math.max(0, (bin - this.cutoff) / (this.max - this.cutoff))
            Math.max(0, (T - this.settings[b].cutoff) / this.settings[b].scale)
          )), this.isDrawing && this.draw();
        }
      }
    }
    setCutoff(n) {
      this.cutoff = n, this.settings = this.settings.map((v) => (v.cutoff = n, v));
    }
    setSmooth(n) {
      this.smooth = n, this.settings = this.settings.map((v) => (v.smooth = n, v));
    }
    setBins(n) {
      this.bins = Array(n).fill(0), this.prevBins = Array(n).fill(0), this.fft = Array(n).fill(0), this.settings = Array(n).fill(0).map(() => ({
        cutoff: this.cutoff,
        scale: this.scale,
        smooth: this.smooth
      })), this.bins.forEach((v, y) => {
        window["a" + y] = (T = 1, b = 0) => () => a.fft[y] * T + b;
      });
    }
    setScale(n) {
      this.scale = n, this.settings = this.settings.map((v) => (v.scale = n, v));
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
      var n = this.canvas.width / this.bins.length, v = this.canvas.height / (this.max * 2);
      this.bins.forEach((y, T) => {
        var b = y * v;
        this.ctx.fillRect(T * n, this.canvas.height - b, n, b);
        var z = this.canvas.height - v * this.settings[T].cutoff;
        this.ctx.beginPath(), this.ctx.moveTo(T * n, z), this.ctx.lineTo((T + 1) * n, z), this.ctx.stroke();
        var N = this.canvas.height - v * (this.settings[T].scale + this.settings[T].cutoff);
        this.ctx.beginPath(), this.ctx.moveTo(T * n, N), this.ctx.lineTo((T + 1) * n, N), this.ctx.stroke();
      });
    }
  }
  class Xc {
    constructor(n) {
      this.mediaSource = new MediaSource(), this.stream = n, this.output = document.createElement("video"), this.output.autoplay = !0, this.output.loop = !0;
      let v = this;
      this.mediaSource.addEventListener("sourceopen", () => {
        console.log("MediaSource opened"), v.sourceBuffer = v.mediaSource.addSourceBuffer('video/webm; codecs="vp8"'), console.log("Source buffer: ", sourceBuffer);
      });
    }
    start() {
      let n = { mimeType: "video/webm;codecs=vp9" };
      this.recordedBlobs = [];
      try {
        this.mediaRecorder = new MediaRecorder(this.stream, n);
      } catch (v) {
        console.log("Unable to create MediaRecorder with options Object: ", v);
        try {
          n = { mimeType: "video/webm,codecs=vp9" }, this.mediaRecorder = new MediaRecorder(this.stream, n);
        } catch (y) {
          console.log("Unable to create MediaRecorder with options Object: ", y);
          try {
            n = "video/vp8", this.mediaRecorder = new MediaRecorder(this.stream, n);
          } catch (T) {
            alert(`MediaRecorder is not supported by this browser.

Try Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags.`), console.error("Exception while creating MediaRecorder:", T);
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
      const n = new Blob(this.recordedBlobs, { type: this.mediaRecorder.mimeType }), v = window.URL.createObjectURL(n);
      this.output.src = v;
      const y = document.createElement("a");
      y.style.display = "none", y.href = v;
      let T = /* @__PURE__ */ new Date();
      y.download = `hydra-${T.getFullYear()}-${T.getMonth() + 1}-${T.getDate()}-${T.getHours()}.${T.getMinutes()}.${T.getSeconds()}.webm`, document.body.appendChild(y), y.click(), setTimeout(() => {
        document.body.removeChild(y), window.URL.revokeObjectURL(v);
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
  var Vc = (c, n, v, y, T) => (c - n) * (T - y) / (v - n) + y, Ma = (c, n) => (c % n + n) % n;
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
        let v = Math.min(...this), y = Math.max(...this);
        var T = this.map((b) => Vc(b, v, y, c, n));
        return T._speed = this._speed, T._smooth = this._smooth, T._ease = this._ease, T;
      };
    },
    getValue: (c = []) => ({ time: n, bpm: v }) => {
      let y = c._speed ? c._speed : 1, T = c._smooth ? c._smooth : 0, b = n * y * (v / 60) + (c._offset || 0);
      if (T !== 0) {
        let z = c._ease ? c._ease : Ga.linear, N = b - T / 2, fe = c[Math.floor(Ma(N, c.length))], ce = c[Math.floor(Ma(N + 1, c.length))], ke = Math.min(Ma(N, 1) / T, 1);
        return z(ke) * (ce - fe) + fe;
      } else
        return c[Math.floor(b % c.length)], c[Math.floor(b % c.length)];
    }
  }, Hc = (c) => {
    var n = "", v = T(n), y = (b, z) => {
      n += `
      var ${b} = ${z}
    `, v = T(n);
    };
    return {
      addToContext: y,
      eval: (b) => v.eval(b)
    };
    function T(b) {
      globalThis.eval(b);
      var z = function(N) {
        globalThis.eval(N);
      };
      return {
        eval: z
      };
    }
  };
  class Wc {
    constructor(n, v, y = []) {
      this.makeGlobal = v, this.sandbox = Hc(), this.parent = n;
      var T = Object.keys(n);
      T.forEach((b) => this.add(b)), this.userProps = y;
    }
    add(n) {
      this.makeGlobal && (window[n] = this.parent[n]);
    }
    // sets on window as well as synth object if global (not needed for objects, which can be set directly)
    set(n, v) {
      this.makeGlobal && (window[n] = v), this.parent[n] = v;
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
  function qc(c, n, v) {
    const y = c.transform.inputs, T = c.userArgs, { generators: b } = c.synth, { src: z } = b;
    return y.map((N, fe) => {
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
      if (T.length > fe) {
        if (ce.value = T[fe], ce.type === "vec4" && !(ce.value.type === "GlslSource" || ce.value.getTexture))
          throw new Error("Arguments must be a texture or GlslSource");
        typeof T[fe] == "function" ? (ce.value = (Ue, rt, We) => {
          try {
            const ft = T[fe](rt);
            return typeof ft == "number" ? ft : (console.warn("function does not return a number", T[fe]), N.default);
          } catch (ft) {
            return console.warn("ERROR", ft), N.default;
          }
        }, ce.isUniform = !0) : T[fe].constructor === Array && (ce.value = (Ue, rt, We) => Zo.getValue(T[fe])(rt), ce.isUniform = !0);
      }
      if (!(n < 0)) {
        if (ce.value && ce.value.transforms) {
          const Ue = ce.value.transforms[ce.value.transforms.length - 1];
          if (Ue.transform.glsl_return_type !== N.type) {
            const rt = Yc[N.type];
            if (typeof rt < "u") {
              const We = rt[Ue.transform.glsl_return_type];
              if (typeof We < "u") {
                const { name: ft, args: Pt } = We;
                ce.value = ce.value[ft](...Pt);
              }
            }
          }
          ce.isUniform = !1;
        } else if (ce.type === "float" && typeof ce.value == "number")
          ce.value = ka(ce.value);
        else if (ce.type.startsWith("vec") && typeof ce.value == "object" && Array.isArray(ce.value))
          ce.isUniform = !1, ce.value = `${ce.type}(${ce.value.map(ka).join(", ")})`;
        else if (N.type === "sampler2D") {
          var ke = ce.value;
          ce.value = () => ke.getTexture(), ce.isUniform = !0;
        } else if (ce.value.getTexture && N.type === "vec4") {
          var Ne = ce.value;
          ce.value = z(Ne), ce.isUniform = !1;
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
    }, v = Jo(c, n)("c", "st");
    n.fragColor = v;
    let y = {};
    return n.uniforms.forEach((T) => y[T.name] = T), n.uniforms = Object.values(y), n;
  }
  function Ba(c, n) {
    return `${c}_i${n}`;
  }
  function Jo(c, n) {
    var v = (y, T) => "";
    return c.forEach((y, T) => {
      let b = qc(y, n.uniforms.length);
      b.forEach((N) => {
        N.isUniform && n.uniforms.push(N);
      }), Qc(y, n.glslFunctions) || n.glslFunctions.push(y);
      var z = v;
      y.transform.type === "src" ? v = (N, fe) => `${Wr(b, n)(`${N}${T}`, fe)}
         vec4 ${N} = ${Yr(`${N}${T}`, fe, y.name, b)};` : y.transform.type === "color" ? v = (N, fe) => `${Wr(b, n)(`${N}${T}`, fe)}
         ${z(N, fe)}
         ${N} = ${Yr(`${N}${T}`, `${N}`, y.name, b)};` : y.transform.type === "coord" ? v = (N, fe) => `${Wr(b, n)(`${N}${T}`, fe)}
         ${fe} = ${Yr(`${N}${T}`, `${fe}`, y.name, b)};
         ${z(N, fe)}` : y.transform.type === "combine" ? v = (N, fe) => (
        // combining two generated shader strings (i.e. for blend, mult, add funtions)
        `${Wr(b, n)(`${N}${T}`, fe)}
         ${z(N, fe)}
         ${N} = ${Yr(`${N}${T}`, `${N}`, y.name, b)};`
      ) : y.transform.type === "combineCoord" && (v = (N, fe) => `${Wr(b, n)(`${N}${T}`, fe)}
         ${fe} = ${Yr(`${N}${T}`, `${fe}`, y.name, b)};
         ${z(N, fe)}`);
    }), v;
  }
  function Wr(c, n) {
    let v = (T, b) => "";
    var y = v;
    return c.forEach((T, b) => {
      T.value.transforms && (y = v, v = (z, N) => {
        let fe = Ba(z, b), ce = Ba(`${N}_${z}`, b);
        return `vec2 ${ce} = ${N};${y(z, N)}
         ${Jo(T.value.transforms, n)(fe, ce)}`;
      });
    }), v;
  }
  function Yr(c, n, v, y) {
    const T = y.map((b, z) => b.isUniform ? b.name : b.value && b.value.transforms ? Ba(c, z) : b.value).reduce((b, z) => `${b}, ${z}`, "");
    return `${v}(${n}${T})`;
  }
  function Qc(c, n) {
    for (var v = 0; v < n.length; v++)
      if (c.name == n[v].name) return !0;
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
      var v = this.glsl(n);
      this.synth.currentFunctions = [], n.render(v);
    } catch (y) {
      console.warn("shader could not compile", y);
    }
  };
  qr.prototype.glsl = function() {
    var c = [], n = [];
    return this.transforms.forEach((v) => {
      v.transform.type === "renderpass" ? console.warn("no support for renderpass") : n.push(v);
    }), n.length > 0 && c.push(this.compile(n)), c;
  };
  qr.prototype.compile = function(c) {
    var n = Kc(c, this.synth), v = {};
    n.uniforms.forEach((b) => {
      v[b.name] = b.value;
    });
    const y = el(n.glslFunctions);
    y.renames.forEach(({ shaderName: b, oldName: z, newName: N }) => {
      const fe = n.glslFunctions.find((ce) => ce.name === b);
      if (fe && fe.transform) {
        const ce = new RegExp(`\\b${z}\\b`, "g");
        fe.transform.glsl = fe.transform.glsl.replace(ce, N);
      }
    });
    var T = `#version 300 es
  precision ${this.defaultOutput.precision} float;
  ${Object.values(n.uniforms).map((b) => {
      let z = b.type;
      return b.type === "texture" && (z = "sampler2D"), `
      uniform ${z} ${b.name};`;
    }).join("")}
  uniform float time;
  uniform vec2 resolution;
  in vec2 uv;
  out vec4 fragColor;
  uniform sampler2D prevBuffer;

  ${Object.values(Zc).map((b) => `
            ${b.glsl}
          `).join("")}

  ${y.helpers}

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
      frag: T,
      uniforms: Object.assign({}, this.defaultUniforms, v)
    };
  };
  function Jc(c) {
    const n = [];
    if (!c || typeof c != "string") return n;
    const v = /\b(void|float|int|vec2|vec3|vec4|mat2|mat3|mat4|bool|sampler2D)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*\{/g;
    let y;
    for (; (y = v.exec(c)) !== null; ) {
      const T = y[1], b = y[2], z = y[3], N = y.index, fe = y.index + y[0].length;
      let ce = 1, ke = fe;
      for (; ke < c.length && ce > 0; )
        c[ke] === "{" ? ce++ : c[ke] === "}" && ce--, ke++;
      const Ne = c.substring(fe, ke - 1), Ue = c.substring(N, ke), rt = `${T} ${b}(${z})`;
      n.push({
        name: b,
        returnType: T,
        params: z,
        signature: rt,
        body: Ne.trim(),
        fullCode: Ue
      });
    }
    return n;
  }
  function el(c) {
    const n = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Set(), y = [], T = [];
    return c.forEach((b) => {
      if (!b.transform.helpers) return;
      const z = b.name;
      Jc(b.transform.helpers).forEach((fe) => {
        const ce = n.get(fe.name);
        if (!ce)
          n.set(fe.name, {
            signature: fe.signature,
            body: fe.body,
            fullCode: fe.fullCode
          }), v.add(fe.name), T.push(fe.fullCode);
        else {
          if (ce.signature === fe.signature && ce.body === fe.body)
            return;
          {
            let ke = `${z}_${fe.name}`, Ne = 1;
            for (; v.has(ke); )
              ke = `${z}_${fe.name}_${Ne}`, Ne++;
            const Ue = fe.fullCode.replace(
              new RegExp(`\\b${fe.name}\\b`),
              ke
            );
            n.set(ke, {
              signature: fe.signature.replace(fe.name, ke),
              body: fe.body,
              fullCode: Ue
            }), v.add(ke), T.push(Ue), y.push({
              shaderName: z,
              oldName: fe.name,
              newName: ke
            });
          }
        }
      });
    }), {
      helpers: T.join(`

`),
      renames: y
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
    ].some((v) => v.test(c));
  }
  class rl {
    constructor({
      defaultUniforms: n,
      defaultOutput: v,
      extendTransforms: y = [],
      changeListener: T = (() => {
      })
    } = {}) {
      this.defaultOutput = v, this.defaultUniforms = n, this.changeListener = T, this.extendTransforms = y, this.generators = {}, this.init();
    }
    init() {
      const n = tl();
      return this.glslTransforms = {}, this.generators = Object.entries(this.generators).reduce((v, [y, T]) => (this.changeListener({ type: "remove", synth: this, method: y }), v), {}), this.sourceClass = class extends qr {
      }, Array.isArray(this.extendTransforms) ? n.concat(this.extendTransforms) : typeof this.extendTransforms == "object" && this.extendTransforms.type && n.push(this.extendTransforms), n.map((v) => this.setFunction(v));
    }
    _addMethod(n, v) {
      const y = this;
      if (this.glslTransforms[n] = v, v.type === "src") {
        const T = (...b) => new this.sourceClass({
          name: n,
          transform: v,
          userArgs: b,
          defaultOutput: this.defaultOutput,
          defaultUniforms: this.defaultUniforms,
          synth: y
        });
        return this.generators[n] = T, this.changeListener({ type: "add", synth: this, method: n }), T;
      } else
        this.sourceClass.prototype[n] = function(...T) {
          return this.transforms.push({ name: n, transform: v, userArgs: T, synth: y }), this;
        };
    }
    setFunction(n) {
      var v = nl(n);
      v && this._addMethod(n.name, v);
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
      let v = n.args.concat(c.inputs), y = v.map((N) => `${N.type} ${N.name}`).join(", "), T = c.glsl3 || c.glsl;
      !c.glsl3 && Yo(T) && (T = Wo(T));
      let b = "";
      c.helpers && (b = c.helpers, Yo(b) && (b = Wo(b)));
      let z = `
  ${n.returnType} ${c.name}(${y}) {
      ${T}
  }
`;
      return c.inputs = v.slice(1), Object.assign({}, c, { glsl: z, helpers: b });
    } else
      console.warn(`type ${c.type} not recognized`, c, qo);
  }
  var On = { exports: {} }, al = On.exports, Ko;
  function il() {
    return Ko || (Ko = 1, (function(c, n) {
      (function(v, y) {
        c.exports = y();
      })(al, (function() {
        var v = function(e) {
          return e instanceof Uint8Array || e instanceof Uint16Array || e instanceof Uint32Array || e instanceof Int8Array || e instanceof Int16Array || e instanceof Int32Array || e instanceof Float32Array || e instanceof Float64Array || e instanceof Uint8ClampedArray;
        }, y = function(e, r) {
          for (var l = Object.keys(r), G = 0; G < l.length; ++G)
            e[l[G]] = r[l[G]];
          return e;
        }, T = `
`;
        function b(e) {
          return typeof atob < "u" ? atob(e) : "base64:" + e;
        }
        function z(e) {
          var r = new Error("(regl) " + e);
          throw console.error(r), r;
        }
        function N(e, r) {
          e || z(r);
        }
        function fe(e) {
          return e ? ": " + e : "";
        }
        function ce(e, r, l) {
          e in r || z("unknown parameter (" + e + ")" + fe(l) + ". possible values: " + Object.keys(r).join());
        }
        function ke(e, r) {
          v(e) || z(
            "invalid parameter type" + fe(r) + ". must be a typed array"
          );
        }
        function Ne(e, r) {
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
        function Ue(e, r, l) {
          Ne(e, r) || z(
            "invalid parameter type" + fe(l) + ". expected " + r + ", got " + typeof e
          );
        }
        function rt(e, r) {
          e >= 0 && (e | 0) === e || z("invalid parameter type, (" + e + ")" + fe(r) + ". must be a nonnegative integer");
        }
        function We(e, r, l) {
          r.indexOf(e) < 0 && z("invalid value" + fe(l) + ". must be one of: " + r);
        }
        var ft = [
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
            ft.indexOf(r) < 0 && z('invalid regl constructor argument "' + r + '". must be one of ' + ft);
          });
        }
        function pt(e, r) {
          for (e = e + ""; e.length < r; )
            e = " " + e;
          return e;
        }
        function ze() {
          this.name = "unknown", this.lines = [], this.index = {}, this.hasErrors = !1;
        }
        function nt(e, r) {
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
        function Bt(e, r) {
          var l = e.split(`
`), G = 1, P = 0, F = {
            unknown: new ze(),
            0: new ze()
          };
          F.unknown.name = F[0].name = r || gt(), F.unknown.lines.push(new nt(0, ""));
          for (var k = 0; k < l.length; ++k) {
            var W = l[k], q = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(W);
            if (q)
              switch (q[1]) {
                case "line":
                  var J = /(\d+)(\s+\d+)?/.exec(q[2]);
                  J && (G = J[1] | 0, J[2] && (P = J[2] | 0, P in F || (F[P] = new ze())));
                  break;
                case "define":
                  var K = /SHADER_NAME(_B64)?\s+(.*)$/.exec(q[2]);
                  K && (F[P].name = K[1] ? b(K[2]) : K[2]);
                  break;
              }
            F[P].lines.push(new nt(G++, W));
          }
          return Object.keys(F).forEach(function(re) {
            var oe = F[re];
            oe.lines.forEach(function(Y) {
              oe.index[Y.number] = Y;
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
            te(l, "string", k + " shader source must be a string", P);
            var W = Bt(l, P), q = Cn(F);
            Fn(W, q), Object.keys(W).forEach(function(J) {
              var K = W[J];
              if (!K.hasErrors)
                return;
              var re = [""], oe = [""];
              function Y(ne, A) {
                re.push(ne), oe.push(A || "");
              }
              Y("file number " + J + ": " + K.name + `
`, "color:red;text-decoration:underline;font-weight:bold"), K.lines.forEach(function(ne) {
                if (ne.errors.length > 0) {
                  Y(pt(ne.number, 4) + "|  ", "background-color:yellow; font-weight:bold"), Y(ne.line + T, "color:red; background-color:yellow; font-weight:bold");
                  var A = 0;
                  ne.errors.forEach(function(B) {
                    var Z = B.message, ue = /^\s*'(.*)'\s*:\s*(.*)$/.exec(Z);
                    if (ue) {
                      var j = ue[1];
                      Z = ue[2], j === "assign" && (j = "="), A = Math.max(ne.line.indexOf(j, A), 0);
                    } else
                      A = 0;
                    Y(pt("| ", 6)), Y(pt("^^^", A + 3) + T, "font-weight:bold"), Y(pt("| ", 6)), Y(Z + T, "font-weight:bold");
                  }), Y(pt("| ", 6) + T);
                } else
                  Y(pt(ne.number, 4) + "|  "), Y(ne.line + T, "color:red");
              }), typeof document < "u" && !window.chrome ? (oe[0] = re.join("%c"), console.log.apply(console, oe)) : console.log(re.join(""));
            }), N.raise("Error compiling " + k + " shader, " + W[0].name);
          }
        }
        function Ar(e, r, l, G, P) {
          if (!e.getProgramParameter(r, e.LINK_STATUS)) {
            var F = e.getProgramInfoLog(r), k = Bt(l, P), W = Bt(G, P), q = 'Error linking program with vertex shader, "' + W[0].name + '", and fragment shader "' + k[0].name + '"';
            typeof document < "u" ? console.log(
              "%c" + q + T + "%c" + F,
              "color:red;text-decoration:underline;font-weight:bold",
              "color:red"
            ) : console.log(q + T + F), N.raise(q);
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
          z(e + " in command " + (r || gt()) + (l === "unknown" ? "" : " called from " + l));
        }
        function X(e, r, l) {
          e || _(r, l || gt());
        }
        function C(e, r, l, G) {
          e in r || _(
            "unknown parameter (" + e + ")" + fe(l) + ". possible values: " + Object.keys(r).join(),
            G || gt()
          );
        }
        function te(e, r, l, G) {
          Ne(e, r) || _(
            "invalid parameter type" + fe(l) + ". expected " + r + ", got " + typeof e,
            G || gt()
          );
        }
        function pe(e) {
          e();
        }
        function Ce(e, r, l) {
          e.texture ? We(
            e.texture._texture.internalformat,
            r,
            "unsupported texture format for attachment"
          ) : We(
            e.renderbuffer._renderbuffer.format,
            l,
            "unsupported renderbuffer format for attachment"
          );
        }
        var Be = 33071, Te = 9728, xe = 9984, Pe = 9985, vt = 9986, De = 9987, Rt = 5120, wt = 5121, Tt = 5122, Lr = 5123, at = 5124, mt = 5125, yt = 5126, Ft = 32819, Na = 32820, Da = 33635, Pa = 34042, ts = 36193, At = {};
        At[Rt] = At[wt] = 1, At[Tt] = At[Lr] = At[ts] = At[Da] = At[Ft] = At[Na] = 2, At[at] = At[mt] = At[yt] = At[Pa] = 4;
        function $a(e, r) {
          return e === Na || e === Ft || e === Da ? 2 : e === Pa ? 4 : At[e] * r;
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
            e.minFilter === Te && e.magFilter === Te,
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
                var re = Math.ceil($a(K.type, k) * q / K.unpackAlignment) * K.unpackAlignment;
                N(
                  K.data.byteLength === re * J,
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
              var re = J[K];
              if (re) {
                var oe = P >> K, Y = F >> K;
                N(q.mipmask & 1 << K, "missing mipmap data"), N(
                  re.width === oe && re.height === Y,
                  "invalid shape for mip images"
                ), N(
                  re.format === e.format && re.internalformat === e.internalformat && re.type === e.type,
                  "incompatible type for mip image"
                ), re.compressed || (re.data ? N(
                  re.data.byteLength === oe * Y * Math.max($a(re.type, k), re.unpackAlignment),
                  "invalid data for image, buffer size is inconsistent with image format"
                ) : re.element || re.copy);
              }
            }
          }
        }
        var f = y(N, {
          optional: pe,
          raise: z,
          commandRaise: _,
          command: X,
          parameter: ce,
          commandParameter: C,
          constructor: Pt,
          type: Ue,
          commandType: te,
          isTypedArray: ke,
          nni: rt,
          oneOf: We,
          shaderError: Gn,
          linkError: Ar,
          callSite: fr,
          saveCommandRef: Sr,
          saveDrawInfo: R,
          framebufferFormat: Ce,
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
          y(G.style, {
            border: 0,
            margin: 0,
            padding: 0,
            top: 0,
            left: 0
          }), e.appendChild(G), e === document.body && (G.style.position = "absolute", y(e.style, {
            margin: 0,
            padding: 0
          }));
          function P() {
            var W = window.innerWidth, q = window.innerHeight;
            if (e !== document.body) {
              var J = e.getBoundingClientRect();
              W = J.right - J.left, q = J.bottom - J.top;
            }
            G.width = l * W, G.height = l * q, y(G.style, {
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
          var r = e || {}, l, G, P, F, k = {}, W = [], q = [], J = typeof window > "u" ? 1 : window.devicePixelRatio, K = !1, re = function(ne) {
            ne && f.raise(ne);
          }, oe = function() {
          };
          if (typeof r == "string" ? (f(
            typeof document < "u",
            "selector queries only supported in DOM enviroments"
          ), l = document.querySelector(r), f(l, "invalid query string for element")) : typeof r == "object" ? hs(r) ? l = r : ms(r) ? (F = r, P = F.canvas) : (f.constructor(r), "gl" in r ? F = r.gl : "canvas" in r ? P = Ha(r.canvas) : "container" in r && (G = Ha(r.container)), "attributes" in r && (k = r.attributes, f.type(k, "object", "invalid context attributes")), "extensions" in r && (W = Va(r.extensions)), "optionalExtensions" in r && (q = Va(r.optionalExtensions)), "onDone" in r && (f.type(
            r.onDone,
            "function",
            "invalid or missing onDone callback"
          ), re = r.onDone), "profile" in r && (K = !!r.profile), "pixelRatio" in r && (J = +r.pixelRatio, f(J > 0, "invalid pixel ratio"))) : f.raise("invalid arguments to regl"), l && (l.nodeName.toLowerCase() === "canvas" ? P = l : G = l), !F) {
            if (!P) {
              f(
                typeof document < "u",
                "must manually specify webgl context outside of DOM environments"
              );
              var Y = ls(G || document.body, re, J);
              if (!Y)
                return null;
              P = Y.canvas, oe = Y.onDestroy;
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
            onDone: re,
            onDestroy: oe
          } : (oe(), re("webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org"), null);
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
        function Ts(e) {
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
            var k = Ts(F), W = e[Wa(k) >> 2];
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
        var Ze = Ya();
        Ze.zero = Ya();
        var As = 3408, Ss = 3410, Ls = 3411, Rs = 3412, Os = 3413, Cs = 3414, Fs = 3415, Gs = 33901, Ms = 33902, ks = 3379, Bs = 3386, Is = 34921, Ns = 36347, Ds = 36348, Ps = 35661, $s = 35660, Us = 34930, zs = 36349, js = 34076, Xs = 34024, Vs = 7936, Hs = 7937, Ws = 7938, Ys = 35724, qs = 34047, Ks = 36063, Qs = 34852, Qr = 3553, qa = 34067, Zs = 34069, Js = 33984, Or = 6408, kn = 5126, Ka = 5121, Bn = 36160, ef = 36053, tf = 36064, rf = 16384, nf = function(e, r) {
          var l = 1;
          r.ext_texture_filter_anisotropic && (l = e.getParameter(qs));
          var G = 1, P = 1;
          r.webgl_draw_buffers && (G = e.getParameter(Qs), P = e.getParameter(Ks));
          var F = !!r.oes_texture_float;
          if (F) {
            var k = e.createTexture();
            e.bindTexture(Qr, k), e.texImage2D(Qr, 0, Or, 1, 1, 0, Or, kn, null);
            var W = e.createFramebuffer();
            if (e.bindFramebuffer(Bn, W), e.framebufferTexture2D(Bn, tf, Qr, k, 0), e.bindTexture(Qr, null), e.checkFramebufferStatus(Bn) !== ef) F = !1;
            else {
              e.viewport(0, 0, 1, 1), e.clearColor(1, 0, 0, 1), e.clear(rf);
              var q = Ze.allocType(kn, 4);
              e.readPixels(0, 0, 1, 1, Or, kn, q), e.getError() ? F = !1 : (e.deleteFramebuffer(W), e.deleteTexture(k), F = q[0] === 1), Ze.freeType(q);
            }
          }
          var J = typeof navigator < "u" && (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion) || /Edge/.test(navigator.userAgent)), K = !0;
          if (!J) {
            var re = e.createTexture(), oe = Ze.allocType(Ka, 36);
            e.activeTexture(Js), e.bindTexture(qa, re), e.texImage2D(Zs, 0, Or, 3, 3, 0, Or, Ka, oe), Ze.freeType(oe), e.bindTexture(qa, null), e.deleteTexture(re), K = !e.getError();
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
            subpixelBits: e.getParameter(As),
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
            maxViewportDims: e.getParameter(Bs),
            maxCombinedTextureUnits: e.getParameter(Ps),
            maxCubeMapSize: e.getParameter(js),
            maxRenderbufferSize: e.getParameter(Xs),
            maxTextureUnits: e.getParameter(Us),
            maxTextureSize: e.getParameter(ks),
            maxAttributes: e.getParameter(Is),
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
          return !!e && typeof e == "object" && Array.isArray(e.shape) && Array.isArray(e.stride) && typeof e.offset == "number" && e.shape.length === e.stride.length && (Array.isArray(e.data) || v(e.data));
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
              for (var K = q[J], re = 0; re < G; ++re)
                P[k++] = K[re];
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
          var k = G || Ze.allocType(l, P);
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
        var In = {
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
          return In[Object.prototype.toString.call(e)] | 0;
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
          function k(A) {
            this.id = P++, this.buffer = e.createBuffer(), this.type = A, this.usage = ei, this.byteLength = 0, this.dimension = 1, this.dtype = Dn, this.persistentData = null, l.profile && (this.stats = { size: 0 });
          }
          k.prototype.bind = function() {
            e.bindBuffer(this.type, this.buffer);
          }, k.prototype.destroy = function() {
            oe(this);
          };
          var W = [];
          function q(A, B) {
            var Z = W.pop();
            return Z || (Z = new k(A)), Z.bind(), re(Z, B, bf, 0, 1, !1), Z;
          }
          function J(A) {
            W.push(A);
          }
          function K(A, B, Z) {
            A.byteLength = B.byteLength, e.bufferData(A.type, B, Z);
          }
          function re(A, B, Z, ue, j, le) {
            var H;
            if (A.usage = Z, Array.isArray(B)) {
              if (A.dtype = ue || Pn, B.length > 0) {
                var ae;
                if (Array.isArray(B[0])) {
                  H = Ja(B);
                  for (var V = 1, ie = 1; ie < H.length; ++ie)
                    V *= H[ie];
                  A.dimension = V, ae = Nn(B, H, A.dtype), K(A, ae, Z), le ? A.persistentData = ae : Ze.freeType(ae);
                } else if (typeof B[0] == "number") {
                  A.dimension = j;
                  var ye = Ze.allocType(A.dtype, B.length);
                  ti(ye, B), K(A, ye, Z), le ? A.persistentData = ye : Ze.freeType(ye);
                } else v(B[0]) ? (A.dimension = B[0].length, A.dtype = ue || en(B[0]) || Pn, ae = Nn(
                  B,
                  [B.length, B[0].length],
                  A.dtype
                ), K(A, ae, Z), le ? A.persistentData = ae : Ze.freeType(ae)) : f.raise("invalid buffer data");
              }
            } else if (v(B))
              A.dtype = ue || en(B), A.dimension = j, K(A, B, Z), le && (A.persistentData = new Uint8Array(new Uint8Array(B.buffer)));
            else if (Gt(B)) {
              H = B.shape;
              var Ee = B.stride, se = B.offset, ee = 0, U = 0, ge = 0, Se = 0;
              H.length === 1 ? (ee = H[0], U = 1, ge = Ee[0], Se = 0) : H.length === 2 ? (ee = H[0], U = H[1], ge = Ee[0], Se = Ee[1]) : f.raise("invalid shape"), A.dtype = ue || en(B.data) || Pn, A.dimension = U;
              var he = Ze.allocType(A.dtype, ee * U);
              ri(
                he,
                B.data,
                ee,
                U,
                ge,
                Se,
                se
              ), K(A, he, Z), le ? A.persistentData = he : Ze.freeType(he);
            } else B instanceof ArrayBuffer ? (A.dtype = Dn, A.dimension = j, K(A, B, Z), le && (A.persistentData = new Uint8Array(new Uint8Array(B)))) : f.raise("invalid buffer data");
          }
          function oe(A) {
            r.bufferCount--, G(A);
            var B = A.buffer;
            f(B, "buffer must not be deleted already"), e.deleteBuffer(B), A.buffer = null, delete F[A.id];
          }
          function Y(A, B, Z, ue) {
            r.bufferCount++;
            var j = new k(B);
            F[j.id] = j;
            function le(V) {
              var ie = ei, ye = null, Ee = 0, se = 0, ee = 1;
              return Array.isArray(V) || v(V) || Gt(V) || V instanceof ArrayBuffer ? ye = V : typeof V == "number" ? Ee = V | 0 : V && (f.type(
                V,
                "object",
                "buffer arguments must be an object, a number or an array"
              ), "data" in V && (f(
                ye === null || Array.isArray(ye) || v(ye) || Gt(ye),
                "invalid data for buffer"
              ), ye = V.data), "usage" in V && (f.parameter(V.usage, Jr, "invalid buffer usage"), ie = Jr[V.usage]), "type" in V && (f.parameter(V.type, Kt, "invalid buffer type"), se = Kt[V.type]), "dimension" in V && (f.type(V.dimension, "number", "invalid dimension"), ee = V.dimension | 0), "length" in V && (f.nni(Ee, "buffer length must be a nonnegative integer"), Ee = V.length | 0)), j.bind(), ye ? re(j, ye, ie, se, ee, ue) : (Ee && e.bufferData(j.type, Ee, ie), j.dtype = se || Dn, j.usage = ie, j.dimension = ee, j.byteLength = Ee), l.profile && (j.stats.size = j.byteLength * jt[j.dtype]), le;
            }
            function H(V, ie) {
              f(
                ie + V.byteLength <= j.byteLength,
                "invalid buffer subdata call, buffer is too small.  Can't write data of size " + V.byteLength + " starting from offset " + ie + " to a buffer of size " + j.byteLength
              ), e.bufferSubData(j.type, ie, V);
            }
            function ae(V, ie) {
              var ye = (ie || 0) | 0, Ee;
              if (j.bind(), v(V) || V instanceof ArrayBuffer)
                H(V, ye);
              else if (Array.isArray(V)) {
                if (V.length > 0)
                  if (typeof V[0] == "number") {
                    var se = Ze.allocType(j.dtype, V.length);
                    ti(se, V), H(se, ye), Ze.freeType(se);
                  } else if (Array.isArray(V[0]) || v(V[0])) {
                    Ee = Ja(V);
                    var ee = Nn(V, Ee, j.dtype);
                    H(ee, ye), Ze.freeType(ee);
                  } else
                    f.raise("invalid buffer data");
              } else if (Gt(V)) {
                Ee = V.shape;
                var U = V.stride, ge = 0, Se = 0, he = 0, Fe = 0;
                Ee.length === 1 ? (ge = Ee[0], Se = 1, he = U[0], Fe = 0) : Ee.length === 2 ? (ge = Ee[0], Se = Ee[1], he = U[0], Fe = U[1]) : f.raise("invalid shape");
                var we = Array.isArray(V.data) ? j.dtype : en(V.data), Oe = Ze.allocType(we, ge * Se);
                ri(
                  Oe,
                  V.data,
                  ge,
                  Se,
                  he,
                  Fe,
                  V.offset
                ), H(Oe, ye), Ze.freeType(Oe);
              } else
                f.raise("invalid data for buffer subdata");
              return le;
            }
            return Z || le(A), le._reglType = "buffer", le._buffer = j, le.subdata = ae, l.profile && (le.stats = j.stats), le.destroy = function() {
              oe(j);
            }, le;
          }
          function ne() {
            Lt(F).forEach(function(A) {
              A.buffer = e.createBuffer(), e.bindBuffer(A.type, A.buffer), e.bufferData(
                A.type,
                A.persistentData || A.byteLength,
                A.usage
              );
            });
          }
          return l.profile && (r.getTotalBufferSize = function() {
            var A = 0;
            return Object.keys(F).forEach(function(B) {
              A += F[B].stats.size;
            }), A;
          }), {
            create: Y,
            createStream: q,
            destroyStream: J,
            clear: function() {
              Lt(F).forEach(oe), W.forEach(oe);
            },
            getBuffer: function(A) {
              return A && A._buffer instanceof k ? A._buffer : null;
            },
            restore: ne,
            _initBuffer: re
          };
        }
        var Ef = 0, xf = 0, wf = 1, Tf = 1, Af = 4, Sf = 4, ur = {
          points: Ef,
          point: xf,
          lines: wf,
          line: Tf,
          triangles: Af,
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
          function W(ne) {
            this.id = F++, P[this.id] = this, this.buffer = ne, this.primType = Cr, this.vertCount = 0, this.type = 0;
          }
          W.prototype.bind = function() {
            this.buffer.bind();
          };
          var q = [];
          function J(ne) {
            var A = q.pop();
            return A || (A = new W(l.create(
              null,
              $n,
              !0,
              !1
            )._buffer)), re(A, ne, Cf, -1, -1, 0, 0), A;
          }
          function K(ne) {
            q.push(ne);
          }
          function re(ne, A, B, Z, ue, j, le) {
            ne.buffer.bind();
            var H;
            if (A) {
              var ae = le;
              !le && (!v(A) || Gt(A) && !v(A.data)) && (ae = r.oes_element_index_uint ? Qt : lr), l._initBuffer(
                ne.buffer,
                A,
                B,
                ae,
                3
              );
            } else
              e.bufferData($n, j, B), ne.buffer.dtype = H || cr, ne.buffer.usage = B, ne.buffer.dimension = 3, ne.buffer.byteLength = j;
            if (H = le, !le) {
              switch (ne.buffer.dtype) {
                case cr:
                case Of:
                  H = cr;
                  break;
                case lr:
                case ni:
                  H = lr;
                  break;
                case Qt:
                case ai:
                  H = Qt;
                  break;
                default:
                  f.raise("unsupported type for element array");
              }
              ne.buffer.dtype = H;
            }
            ne.type = H, f(
              H !== Qt || !!r.oes_element_index_uint,
              "32 bit element buffers not supported, enable oes_element_index_uint first"
            );
            var V = ue;
            V < 0 && (V = ne.buffer.byteLength, H === lr ? V >>= 1 : H === Qt && (V >>= 2)), ne.vertCount = V;
            var ie = Z;
            if (Z < 0) {
              ie = Cr;
              var ye = ne.buffer.dimension;
              ye === 1 && (ie = Lf), ye === 2 && (ie = Rf), ye === 3 && (ie = Cr);
            }
            ne.primType = ie;
          }
          function oe(ne) {
            G.elementsCount--, f(ne.buffer !== null, "must not double destroy elements"), delete P[ne.id], ne.buffer.destroy(), ne.buffer = null;
          }
          function Y(ne, A) {
            var B = l.create(null, $n, !0), Z = new W(B._buffer);
            G.elementsCount++;
            function ue(j) {
              if (!j)
                B(), Z.primType = Cr, Z.vertCount = 0, Z.type = cr;
              else if (typeof j == "number")
                B(j), Z.primType = Cr, Z.vertCount = j | 0, Z.type = cr;
              else {
                var le = null, H = Ff, ae = -1, V = -1, ie = 0, ye = 0;
                Array.isArray(j) || v(j) || Gt(j) ? le = j : (f.type(j, "object", "invalid arguments for elements"), "data" in j && (le = j.data, f(
                  Array.isArray(le) || v(le) || Gt(le),
                  "invalid data for element buffer"
                )), "usage" in j && (f.parameter(
                  j.usage,
                  Jr,
                  "invalid element buffer usage"
                ), H = Jr[j.usage]), "primitive" in j && (f.parameter(
                  j.primitive,
                  ur,
                  "invalid element buffer primitive"
                ), ae = ur[j.primitive]), "count" in j && (f(
                  typeof j.count == "number" && j.count >= 0,
                  "invalid vertex count for elements"
                ), V = j.count | 0), "type" in j && (f.parameter(
                  j.type,
                  k,
                  "invalid buffer type"
                ), ye = k[j.type]), "length" in j ? ie = j.length | 0 : (ie = V, ye === lr || ye === ni ? ie *= 2 : (ye === Qt || ye === ai) && (ie *= 4))), re(
                  Z,
                  le,
                  H,
                  ae,
                  V,
                  ie,
                  ye
                );
              }
              return ue;
            }
            return ue(ne), ue._reglType = "elements", ue._elements = Z, ue.subdata = function(j, le) {
              return B.subdata(j, le), ue;
            }, ue.destroy = function() {
              oe(Z);
            }, ue;
          }
          return {
            create: Y,
            createStream: J,
            destroyStream: K,
            getElements: function(ne) {
              return typeof ne == "function" && ne._elements instanceof W ? ne._elements : null;
            },
            clear: function() {
              Lt(P).forEach(oe);
            }
          };
        }
        var ii = new Float32Array(1), Mf = new Uint32Array(ii.buffer), kf = 5123;
        function oi(e) {
          for (var r = Ze.allocType(kf, e.length), l = 0; l < e.length; ++l)
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
        function qe(e) {
          return Array.isArray(e) || v(e);
        }
        var si = function(e) {
          return !(e & e - 1) && !!e;
        }, Bf = 34467, It = 3553, Un = 34067, tn = 34069, Zt = 6408, zn = 6406, rn = 6407, Fr = 6409, nn = 6410, fi = 32854, jn = 32855, ui = 36194, If = 32819, Nf = 32820, Df = 33635, Pf = 34042, Xn = 6402, an = 34041, Vn = 35904, Hn = 35906, dr = 36193, Wn = 33776, Yn = 33777, qn = 33778, Kn = 33779, ci = 35986, li = 35987, di = 34798, hi = 35840, mi = 35841, pi = 35842, vi = 35843, yi = 36196, hr = 5121, Qn = 5123, Zn = 5125, Gr = 5126, $f = 10242, Uf = 10243, zf = 10497, Jn = 33071, jf = 33648, Xf = 10240, Vf = 10241, ea = 9728, Hf = 9729, ta = 9984, _i = 9985, bi = 9986, ra = 9987, Wf = 33170, on = 4352, Yf = 4353, qf = 4354, Kf = 34046, Qf = 3317, Zf = 37440, Jf = 37441, eu = 37443, gi = 37444, Mr = 33984, tu = [
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
        var Ei = mr("HTMLCanvasElement"), xi = mr("OffscreenCanvas"), wi = mr("CanvasRenderingContext2D"), Ti = mr("ImageBitmap"), Ai = mr("HTMLImageElement"), Si = mr("HTMLVideoElement"), ru = Object.keys(In).concat([
          Ei,
          xi,
          wi,
          Ti,
          Ai,
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
          return !(r === 0 || !qe(e[0]));
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
          return Jt(e) === Ti;
        }
        function iu(e) {
          return Jt(e) === Ai;
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
          return In[Object.prototype.toString.call(e)] | 0;
        }
        function su(e, r) {
          var l = r.length;
          switch (e.type) {
            case hr:
            case Qn:
            case Zn:
            case Gr:
              var G = Ze.allocType(e.type, l);
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
          return Ze.allocType(
            e.type === dr ? Gr : e.type,
            r
          );
        }
        function Mi(e, r) {
          e.type === dr ? (e.data = oi(r), Ze.freeType(r)) : e.data = r;
        }
        function fu(e, r, l, G, P, F) {
          for (var k = e.width, W = e.height, q = e.channels, J = k * W * q, K = Gi(e, J), re = 0, oe = 0; oe < W; ++oe)
            for (var Y = 0; Y < k; ++Y)
              for (var ne = 0; ne < q; ++ne)
                K[re++] = r[l * Y + G * oe + P * ne + F];
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
          }, K = y({
            mipmap: ra,
            "nearest mipmap nearest": ta,
            "linear mipmap nearest": _i,
            "nearest mipmap linear": bi,
            "linear mipmap linear": ra
          }, J), re = {
            none: 0,
            browser: gi
          }, oe = {
            uint8: hr,
            rgba4: If,
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
          }, ne = {};
          r.ext_srgb && (Y.srgb = Vn, Y.srgba = Hn), r.oes_texture_float && (oe.float32 = oe.float = Gr), r.oes_texture_half_float && (oe.float16 = oe["half float"] = dr), r.webgl_depth_texture && (y(Y, {
            depth: Xn,
            "depth stencil": an
          }), y(oe, {
            uint16: Qn,
            uint32: Zn,
            "depth stencil": Pf
          })), r.webgl_compressed_texture_s3tc && y(ne, {
            "rgb s3tc dxt1": Wn,
            "rgba s3tc dxt1": Yn,
            "rgba s3tc dxt3": qn,
            "rgba s3tc dxt5": Kn
          }), r.webgl_compressed_texture_atc && y(ne, {
            "rgb atc": ci,
            "rgba atc explicit alpha": li,
            "rgba atc interpolated alpha": di
          }), r.webgl_compressed_texture_pvrtc && y(ne, {
            "rgb pvrtc 4bppv1": hi,
            "rgb pvrtc 2bppv1": mi,
            "rgba pvrtc 4bppv1": pi,
            "rgba pvrtc 2bppv1": vi
          }), r.webgl_compressed_texture_etc1 && (ne["rgb etc1"] = yi);
          var A = Array.prototype.slice.call(
            e.getParameter(Bf)
          );
          Object.keys(ne).forEach(function(u) {
            var M = ne[u];
            A.indexOf(M) >= 0 && (Y[u] = M);
          });
          var B = Object.keys(Y);
          l.textureFormats = B;
          var Z = [];
          Object.keys(Y).forEach(function(u) {
            var M = Y[u];
            Z[M] = u;
          });
          var ue = [];
          Object.keys(oe).forEach(function(u) {
            var M = oe[u];
            ue[M] = u;
          });
          var j = [];
          Object.keys(J).forEach(function(u) {
            var M = J[u];
            j[M] = u;
          });
          var le = [];
          Object.keys(K).forEach(function(u) {
            var M = K[u];
            le[M] = u;
          });
          var H = [];
          Object.keys(q).forEach(function(u) {
            var M = q[u];
            H[M] = u;
          });
          var ae = B.reduce(function(u, M) {
            var O = Y[M];
            return O === Fr || O === zn || O === Fr || O === nn || O === Xn || O === an || r.ext_srgb && (O === Vn || O === Hn) ? u[O] = O : O === jn || M.indexOf("rgba") >= 0 ? u[O] = Zt : u[O] = rn, u;
          }, {});
          function V() {
            this.internalformat = Zt, this.format = Zt, this.type = hr, this.compressed = !1, this.premultiplyAlpha = !1, this.flipY = !1, this.unpackAlignment = 1, this.colorSpace = gi, this.width = 0, this.height = 0, this.channels = 0;
          }
          function ie(u, M) {
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
                re,
                "invalid colorSpace"
              ), u.colorSpace = re[M.colorSpace]), "type" in M) {
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
                  oe,
                  "invalid texture type"
                ), u.type = oe[O];
              }
              var de = u.width, Ge = u.height, o = u.channels, t = !1;
              "shape" in M ? (f(
                Array.isArray(M.shape) && M.shape.length >= 2,
                "shape must be an array"
              ), de = M.shape[0], Ge = M.shape[1], M.shape.length === 3 && (o = M.shape[2], f(o > 0 && o <= 4, "invalid number of channels"), t = !0), f(de >= 0 && de <= l.maxTextureSize, "invalid width"), f(Ge >= 0 && Ge <= l.maxTextureSize, "invalid height")) : ("radius" in M && (de = Ge = M.radius, f(de >= 0 && de <= l.maxTextureSize, "invalid radius")), "width" in M && (de = M.width, f(de >= 0 && de <= l.maxTextureSize, "invalid width")), "height" in M && (Ge = M.height, f(Ge >= 0 && Ge <= l.maxTextureSize, "invalid height")), "channels" in M && (o = M.channels, f(o > 0 && o <= 4, "invalid number of channels"), t = !0)), u.width = de | 0, u.height = Ge | 0, u.channels = o | 0;
              var h = !1;
              if ("format" in M) {
                var w = M.format;
                f(
                  r.webgl_depth_texture || !(w === "depth" || w === "depth stencil"),
                  "you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures."
                ), f.parameter(
                  w,
                  Y,
                  "invalid texture format"
                );
                var S = u.internalformat = Y[w];
                u.format = ae[S], w in oe && ("type" in M || (u.type = oe[w])), w in ne && (u.compressed = !0), h = !0;
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
          function se() {
            V.call(this), this.xOffset = 0, this.yOffset = 0, this.data = null, this.needsFree = !1, this.element = null, this.needsCopy = !1;
          }
          function ee(u, M) {
            var O = null;
            if (na(M) ? O = M : M && (f.type(M, "object", "invalid pixel data type"), ye(u, M), "x" in M && (u.xOffset = M.x | 0), "y" in M && (u.yOffset = M.y | 0), na(M.data) && (O = M.data)), f(
              !u.compressed || O instanceof Uint8Array,
              "compressed texture data must be stored in a uint8array"
            ), M.copy) {
              f(!O, "can not specify copy and data field for the same texture");
              var de = P.viewportWidth, Ge = P.viewportHeight;
              u.width = u.width || de - u.xOffset, u.height = u.height || Ge - u.yOffset, u.needsCopy = !0, f(
                u.xOffset >= 0 && u.xOffset < de && u.yOffset >= 0 && u.yOffset < Ge && u.width > 0 && u.width <= de && u.height > 0 && u.height <= Ge,
                "copy texture read out of bounds"
              );
            } else if (!O)
              u.width = u.width || 1, u.height = u.height || 1, u.channels = u.channels || 4;
            else if (v(O))
              u.channels = u.channels || 4, u.data = O, !("type" in M) && u.type === hr && (u.type = Fi(O));
            else if (Li(O))
              u.channels = u.channels || 4, su(u, O), u.alignment = 1, u.needsFree = !0;
            else if (Gt(O)) {
              var o = O.data;
              !Array.isArray(o) && u.type === hr && (u.type = Fi(o));
              var t = O.shape, h = O.stride, w, S, p, m, g, s;
              t.length === 3 ? (p = t[2], s = h[2]) : (f(t.length === 2, "invalid ndarray pixel data, must be 2 or 3D"), p = 1, s = 1), w = t[0], S = t[1], m = h[0], g = h[1], u.alignment = 1, u.width = w, u.height = S, u.channels = p, u.format = u.internalformat = sn[p], u.needsFree = !0, fu(u, o, m, g, s, O.offset);
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
              qe(O[0][0]) ? E = E || O[0][0].length : E = E || 1;
              for (var L = Zr.shape(O), D = 1, $ = 0; $ < L.length; ++$)
                D *= L[$];
              var I = Gi(u, D);
              Zr.flatten(O, L, "", I), Mi(u, I), u.alignment = 1, u.width = d, u.height = i, u.channels = E, u.format = u.internalformat = sn[E], u.needsFree = !0;
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
            var de = u.element, Ge = u.data, o = u.internalformat, t = u.format, h = u.type, w = u.width, S = u.height;
            Ee(u), de ? e.texImage2D(M, O, t, t, h, de) : u.compressed ? e.compressedTexImage2D(M, O, o, w, S, 0, Ge) : u.needsCopy ? (G(), e.copyTexImage2D(
              M,
              O,
              t,
              u.xOffset,
              u.yOffset,
              w,
              S,
              0
            )) : e.texImage2D(M, O, t, w, S, 0, t, h, Ge || null);
          }
          function ge(u, M, O, de, Ge) {
            var o = u.element, t = u.data, h = u.internalformat, w = u.format, S = u.type, p = u.width, m = u.height;
            Ee(u), o ? e.texSubImage2D(
              M,
              Ge,
              O,
              de,
              w,
              S,
              o
            ) : u.compressed ? e.compressedTexSubImage2D(
              M,
              Ge,
              O,
              de,
              h,
              p,
              m,
              t
            ) : u.needsCopy ? (G(), e.copyTexSubImage2D(
              M,
              Ge,
              O,
              de,
              u.xOffset,
              u.yOffset,
              p,
              m
            )) : e.texSubImage2D(
              M,
              Ge,
              O,
              de,
              p,
              m,
              w,
              S,
              t
            );
          }
          var Se = [];
          function he() {
            return Se.pop() || new se();
          }
          function Fe(u) {
            u.needsFree && Ze.freeType(u.data), se.call(u), Se.push(u);
          }
          function we() {
            V.call(this), this.genMipmaps = !1, this.mipmapHint = on, this.mipmask = 0, this.images = Array(16);
          }
          function Oe(u, M, O) {
            var de = u.images[0] = he();
            u.mipmask = 1, de.width = u.width = M, de.height = u.height = O, de.channels = u.channels = 4;
          }
          function je(u, M) {
            var O = null;
            if (na(M))
              O = u.images[0] = he(), ie(O, u), ee(O, M), u.mipmask = 1;
            else if (ye(u, M), Array.isArray(M.mipmap))
              for (var de = M.mipmap, Ge = 0; Ge < de.length; ++Ge)
                O = u.images[Ge] = he(), ie(O, u), O.width >>= Ge, O.height >>= Ge, ee(O, de[Ge]), u.mipmask |= 1 << Ge;
            else
              O = u.images[0] = he(), ie(O, u), ee(O, M), u.mipmask = 1;
            ie(u, u.images[0]), u.compressed && (u.internalformat === Wn || u.internalformat === Yn || u.internalformat === qn || u.internalformat === Kn) && f(
              u.width % 4 === 0 && u.height % 4 === 0,
              "for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4"
            );
          }
          function et(u, M) {
            for (var O = u.images, de = 0; de < O.length; ++de) {
              if (!O[de])
                return;
              U(O[de], M, de);
            }
          }
          var ut = [];
          function Ie() {
            var u = ut.pop() || new we();
            V.call(u), u.mipmask = 0;
            for (var M = 0; M < 16; ++M)
              u.images[M] = null;
            return u;
          }
          function it(u) {
            for (var M = u.images, O = 0; O < M.length; ++O)
              M[O] && Fe(M[O]), M[O] = null;
            ut.push(u);
          }
          function He() {
            this.minFilter = ea, this.magFilter = ea, this.wrapS = Jn, this.wrapT = Jn, this.anisotropic = 1, this.genMipmaps = !1, this.mipmapHint = on;
          }
          function tt(u, M) {
            if ("min" in M) {
              var O = M.min;
              f.parameter(O, K), u.minFilter = K[O], tu.indexOf(u.minFilter) >= 0 && !("faces" in M) && (u.genMipmaps = !0);
            }
            if ("mag" in M) {
              var de = M.mag;
              f.parameter(de, J), u.magFilter = J[de];
            }
            var Ge = u.wrapS, o = u.wrapT;
            if ("wrap" in M) {
              var t = M.wrap;
              typeof t == "string" ? (f.parameter(t, q), Ge = o = q[t]) : Array.isArray(t) && (f.parameter(t[0], q), f.parameter(t[1], q), Ge = q[t[0]], o = q[t[1]]);
            } else {
              if ("wrapS" in M) {
                var h = M.wrapS;
                f.parameter(h, q), Ge = q[h];
              }
              if ("wrapT" in M) {
                var w = M.wrapT;
                f.parameter(w, q), o = q[w];
              }
            }
            if (u.wrapS = Ge, u.wrapT = o, "anisotropic" in M) {
              var S = M.anisotropic;
              f(
                typeof S == "number" && S >= 1 && S <= l.maxAnisotropic,
                "aniso samples must be between 1 and "
              ), u.anisotropic = M.anisotropic;
            }
            if ("mipmap" in M) {
              var p = !1;
              switch (typeof M.mipmap) {
                case "string":
                  f.parameter(
                    M.mipmap,
                    W,
                    "invalid mipmap hint"
                  ), u.mipmapHint = W[M.mipmap], u.genMipmaps = !0, p = !0;
                  break;
                case "boolean":
                  p = u.genMipmaps = M.mipmap;
                  break;
                case "object":
                  f(Array.isArray(M.mipmap), "invalid mipmap type"), u.genMipmaps = !1, p = !0;
                  break;
                default:
                  f.raise("invalid mipmap type");
              }
              p && !("min" in M) && (u.minFilter = ta);
            }
          }
          function ot(u, M) {
            e.texParameteri(M, Vf, u.minFilter), e.texParameteri(M, Xf, u.magFilter), e.texParameteri(M, $f, u.wrapS), e.texParameteri(M, Uf, u.wrapT), r.ext_texture_filter_anisotropic && e.texParameteri(M, Kf, u.anisotropic), u.genMipmaps && (e.hint(Wf, u.mipmapHint), e.generateMipmap(M));
          }
          var st = 0, ct = {}, dt = l.maxTextureUnits, Ke = Array(dt).map(function() {
            return null;
          });
          function Le(u) {
            V.call(this), this.mipmask = 0, this.internalformat = Zt, this.id = st++, this.refCount = 1, this.target = u, this.texture = e.createTexture(), this.unit = -1, this.bindCount = 0, this.texInfo = new He(), k.profile && (this.stats = { size: 0 });
          }
          function ht(u) {
            e.activeTexture(Mr), e.bindTexture(u.target, u.texture);
          }
          function Ve() {
            var u = Ke[0];
            u ? e.bindTexture(u.target, u.texture) : e.bindTexture(It, null);
          }
          function _e(u) {
            var M = u.texture;
            f(M, "must not double destroy texture");
            var O = u.unit, de = u.target;
            O >= 0 && (e.activeTexture(Mr + O), e.bindTexture(de, null), Ke[O] = null), e.deleteTexture(M), u.texture = null, u.params = null, u.pixels = null, u.refCount = 0, delete ct[u.id], F.textureCount--;
          }
          y(Le.prototype, {
            bind: function() {
              var u = this;
              u.bindCount += 1;
              var M = u.unit;
              if (M < 0) {
                for (var O = 0; O < dt; ++O) {
                  var de = Ke[O];
                  if (de) {
                    if (de.bindCount > 0)
                      continue;
                    de.unit = -1;
                  }
                  Ke[O] = u, M = O;
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
          function Me(u, M) {
            var O = new Le(It);
            ct[O.id] = O, F.textureCount++;
            function de(t, h) {
              var w = O.texInfo;
              He.call(w);
              var S = Ie();
              return typeof t == "number" ? typeof h == "number" ? Oe(S, t | 0, h | 0) : Oe(S, t | 0, t | 0) : t ? (f.type(t, "object", "invalid arguments to regl.texture"), tt(w, t), je(S, t)) : Oe(S, 1, 1), w.genMipmaps && (S.mipmask = (S.width << 1) - 1), O.mipmask = S.mipmask, ie(O, S), f.texture2D(w, S, l), O.internalformat = S.internalformat, de.width = S.width, de.height = S.height, ht(O), et(S, It), ot(w, It), Ve(), it(S), k.profile && (O.stats.size = fn(
                O.internalformat,
                O.type,
                S.width,
                S.height,
                w.genMipmaps,
                !1
              )), de.format = Z[O.internalformat], de.type = ue[O.type], de.mag = j[w.magFilter], de.min = le[w.minFilter], de.wrapS = H[w.wrapS], de.wrapT = H[w.wrapT], de;
            }
            function Ge(t, h, w, S) {
              f(!!t, "must specify image data");
              var p = h | 0, m = w | 0, g = S | 0, s = he();
              return ie(s, O), s.width = 0, s.height = 0, ee(s, t), s.width = s.width || (O.width >> g) - p, s.height = s.height || (O.height >> g) - m, f(
                O.type === s.type && O.format === s.format && O.internalformat === s.internalformat,
                "incompatible format for texture.subimage"
              ), f(
                p >= 0 && m >= 0 && p + s.width <= O.width && m + s.height <= O.height,
                "texture.subimage write out of bounds"
              ), f(
                O.mipmask & 1 << g,
                "missing mipmap data"
              ), f(
                s.data || s.element || s.needsCopy,
                "missing image data"
              ), ht(O), ge(s, It, p, m, g), Ve(), Fe(s), de;
            }
            function o(t, h) {
              var w = t | 0, S = h | 0 || w;
              if (w === O.width && S === O.height)
                return de;
              de.width = O.width = w, de.height = O.height = S, ht(O);
              for (var p = 0; O.mipmask >> p; ++p) {
                var m = w >> p, g = S >> p;
                if (!m || !g) break;
                e.texImage2D(
                  It,
                  p,
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
                w,
                S,
                !1,
                !1
              )), de;
            }
            return de(u, M), de.subimage = Ge, de.resize = o, de._reglType = "texture2d", de._texture = O, k.profile && (de.stats = O.stats), de.destroy = function() {
              O.decRef();
            }, de;
          }
          function $e(u, M, O, de, Ge, o) {
            var t = new Le(Un);
            ct[t.id] = t, F.cubeCount++;
            var h = new Array(6);
            function w(m, g, s, d, i, E) {
              var L, D = t.texInfo;
              for (He.call(D), L = 0; L < 6; ++L)
                h[L] = Ie();
              if (typeof m == "number" || !m) {
                var $ = m | 0 || 1;
                for (L = 0; L < 6; ++L)
                  Oe(h[L], $, $);
              } else if (typeof m == "object")
                if (g)
                  je(h[0], m), je(h[1], g), je(h[2], s), je(h[3], d), je(h[4], i), je(h[5], E);
                else if (tt(D, m), ye(t, m), "faces" in m) {
                  var I = m.faces;
                  for (f(
                    Array.isArray(I) && I.length === 6,
                    "cube faces must be a length 6 array"
                  ), L = 0; L < 6; ++L)
                    f(
                      typeof I[L] == "object" && !!I[L],
                      "invalid input for cube map face"
                    ), ie(h[L], t), je(h[L], I[L]);
                } else
                  for (L = 0; L < 6; ++L)
                    je(h[L], m);
              else
                f.raise("invalid arguments to cube map");
              for (ie(t, h[0]), l.npotTextureCube || f(si(t.width) && si(t.height), "your browser does not support non power or two texture dimensions"), D.genMipmaps ? t.mipmask = (h[0].width << 1) - 1 : t.mipmask = h[0].mipmask, f.textureCube(t, D, h, l), t.internalformat = h[0].internalformat, w.width = h[0].width, w.height = h[0].height, ht(t), L = 0; L < 6; ++L)
                et(h[L], tn + L);
              for (ot(D, Un), Ve(), k.profile && (t.stats.size = fn(
                t.internalformat,
                t.type,
                w.width,
                w.height,
                D.genMipmaps,
                !0
              )), w.format = Z[t.internalformat], w.type = ue[t.type], w.mag = j[D.magFilter], w.min = le[D.minFilter], w.wrapS = H[D.wrapS], w.wrapT = H[D.wrapT], L = 0; L < 6; ++L)
                it(h[L]);
              return w;
            }
            function S(m, g, s, d, i) {
              f(!!g, "must specify image data"), f(typeof m == "number" && m === (m | 0) && m >= 0 && m < 6, "invalid face");
              var E = s | 0, L = d | 0, D = i | 0, $ = he();
              return ie($, t), $.width = 0, $.height = 0, ee($, g), $.width = $.width || (t.width >> D) - E, $.height = $.height || (t.height >> D) - L, f(
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
              ), ht(t), ge($, tn + m, E, L, D), Ve(), Fe($), w;
            }
            function p(m) {
              var g = m | 0;
              if (g !== t.width) {
                w.width = t.width = g, w.height = t.height = g, ht(t);
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
                  w.width,
                  w.height,
                  !1,
                  !0
                )), w;
              }
            }
            return w(u, M, O, de, Ge, o), w.subimage = S, w.resize = p, w._reglType = "textureCube", w._texture = t, k.profile && (w.stats = t.stats), w.destroy = function() {
              t.decRef();
            }, w;
          }
          function Qe() {
            for (var u = 0; u < dt; ++u)
              e.activeTexture(Mr + u), e.bindTexture(It, null), Ke[u] = null;
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
              var M = Ke[u];
              M && (M.bindCount = 0, M.unit = -1, Ke[u] = null);
            }
            Lt(ct).forEach(function(O) {
              O.texture = e.createTexture(), e.bindTexture(O.target, O.texture);
              for (var de = 0; de < 32; ++de)
                if ((O.mipmask & 1 << de) !== 0)
                  if (O.target === It)
                    e.texImage2D(
                      It,
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
                    for (var Ge = 0; Ge < 6; ++Ge)
                      e.texImage2D(
                        tn + Ge,
                        de,
                        O.internalformat,
                        O.width >> de,
                        O.height >> de,
                        0,
                        O.internalformat,
                        O.type,
                        null
                      );
              ot(O.texInfo, O.target);
            });
          }
          function or() {
            for (var u = 0; u < dt; ++u) {
              var M = Ke[u];
              M && (M.bindCount = 0, M.unit = -1, Ke[u] = null), e.activeTexture(Mr + u), e.bindTexture(It, null), e.bindTexture(Un, null);
            }
          }
          return {
            create2D: Me,
            createCube: $e,
            clear: Qe,
            getTexture: function(u) {
              return null;
            },
            restore: Dt,
            refresh: or
          };
        }
        var Xt = 36161, un = 32854, ki = 32855, Bi = 36194, Ii = 33189, Ni = 36168, Di = 34041, Pi = 35907, $i = 34836, Ui = 34842, zi = 34843, Mt = [];
        Mt[un] = 2, Mt[ki] = 2, Mt[Bi] = 2, Mt[Ii] = 2, Mt[Ni] = 1, Mt[Di] = 4, Mt[Pi] = 4, Mt[$i] = 16, Mt[Ui] = 8, Mt[zi] = 6;
        function ji(e, r, l) {
          return Mt[e] * r * l;
        }
        var cu = function(e, r, l, G, P) {
          var F = {
            rgba4: un,
            rgb565: Bi,
            "rgb5 a1": ki,
            depth: Ii,
            stencil: Ni,
            "depth stencil": Di
          };
          r.ext_srgb && (F.srgba = Pi), r.ext_color_buffer_half_float && (F.rgba16f = Ui, F.rgb16f = zi), r.webgl_color_buffer_float && (F.rgba32f = $i);
          var k = [];
          Object.keys(F).forEach(function(Y) {
            var ne = F[Y];
            k[ne] = Y;
          });
          var W = 0, q = {};
          function J(Y) {
            this.id = W++, this.refCount = 1, this.renderbuffer = Y, this.format = un, this.width = 0, this.height = 0, P.profile && (this.stats = { size: 0 });
          }
          J.prototype.decRef = function() {
            --this.refCount <= 0 && K(this);
          };
          function K(Y) {
            var ne = Y.renderbuffer;
            f(ne, "must not double destroy renderbuffer"), e.bindRenderbuffer(Xt, null), e.deleteRenderbuffer(ne), Y.renderbuffer = null, Y.refCount = 0, delete q[Y.id], G.renderbufferCount--;
          }
          function re(Y, ne) {
            var A = new J(e.createRenderbuffer());
            q[A.id] = A, G.renderbufferCount++;
            function B(ue, j) {
              var le = 0, H = 0, ae = un;
              if (typeof ue == "object" && ue) {
                var V = ue;
                if ("shape" in V) {
                  var ie = V.shape;
                  f(
                    Array.isArray(ie) && ie.length >= 2,
                    "invalid renderbuffer shape"
                  ), le = ie[0] | 0, H = ie[1] | 0;
                } else
                  "radius" in V && (le = H = V.radius | 0), "width" in V && (le = V.width | 0), "height" in V && (H = V.height | 0);
                "format" in V && (f.parameter(
                  V.format,
                  F,
                  "invalid renderbuffer format"
                ), ae = F[V.format]);
              } else typeof ue == "number" ? (le = ue | 0, typeof j == "number" ? H = j | 0 : H = le) : ue ? f.raise("invalid arguments to renderbuffer constructor") : le = H = 1;
              if (f(
                le > 0 && H > 0 && le <= l.maxRenderbufferSize && H <= l.maxRenderbufferSize,
                "invalid renderbuffer size"
              ), !(le === A.width && H === A.height && ae === A.format))
                return B.width = A.width = le, B.height = A.height = H, A.format = ae, e.bindRenderbuffer(Xt, A.renderbuffer), e.renderbufferStorage(Xt, ae, le, H), f(
                  e.getError() === 0,
                  "invalid render buffer format"
                ), P.profile && (A.stats.size = ji(A.format, A.width, A.height)), B.format = k[A.format], B;
            }
            function Z(ue, j) {
              var le = ue | 0, H = j | 0 || le;
              return le === A.width && H === A.height || (f(
                le > 0 && H > 0 && le <= l.maxRenderbufferSize && H <= l.maxRenderbufferSize,
                "invalid renderbuffer size"
              ), B.width = A.width = le, B.height = A.height = H, e.bindRenderbuffer(Xt, A.renderbuffer), e.renderbufferStorage(Xt, A.format, le, H), f(
                e.getError() === 0,
                "invalid render buffer format"
              ), P.profile && (A.stats.size = ji(
                A.format,
                A.width,
                A.height
              ))), B;
            }
            return B(Y, ne), B.resize = Z, B._reglType = "renderbuffer", B._renderbuffer = A, P.profile && (B.stats = A.stats), B.destroy = function() {
              A.decRef();
            }, B;
          }
          P.profile && (G.getTotalRenderbufferSize = function() {
            var Y = 0;
            return Object.keys(q).forEach(function(ne) {
              Y += q[ne].stats.size;
            }), Y;
          });
          function oe() {
            Lt(q).forEach(function(Y) {
              Y.renderbuffer = e.createRenderbuffer(), e.bindRenderbuffer(Xt, Y.renderbuffer), e.renderbufferStorage(Xt, Y.format, Y.width, Y.height);
            }), e.bindRenderbuffer(Xt, null);
          }
          return {
            create: re,
            clear: function() {
              Lt(q).forEach(K);
            },
            restore: oe
          };
        }, $t = 36160, aa = 36161, er = 3553, cn = 34069, Xi = 36064, Vi = 36096, Hi = 36128, Wi = 33306, Yi = 36053, lu = 36054, du = 36055, hu = 36057, mu = 36061, pu = 36193, vu = 5121, yu = 5126, qi = 6407, Ki = 6408, _u = 6402, bu = [
          qi,
          Ki
        ], ia = [];
        ia[Ki] = 4, ia[qi] = 3;
        var ln = [];
        ln[vu] = 1, ln[yu] = 4, ln[pu] = 2;
        var gu = 32854, Eu = 32855, xu = 36194, wu = 33189, Tu = 36168, Qi = 34041, Au = 35907, Su = 34836, Lu = 34842, Ru = 34843, Ou = [
          gu,
          Eu,
          xu,
          Au,
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
          function K(se, ee, U) {
            this.target = se, this.texture = ee, this.renderbuffer = U;
            var ge = 0, Se = 0;
            ee ? (ge = ee.width, Se = ee.height) : U && (ge = U.width, Se = U.height), this.width = ge, this.height = Se;
          }
          function re(se) {
            se && (se.texture && se.texture._texture.decRef(), se.renderbuffer && se.renderbuffer._renderbuffer.decRef());
          }
          function oe(se, ee, U) {
            if (se)
              if (se.texture) {
                var ge = se.texture._texture, Se = Math.max(1, ge.width), he = Math.max(1, ge.height);
                f(
                  Se === ee && he === U,
                  "inconsistent width/height for supplied texture"
                ), ge.refCount += 1;
              } else {
                var Fe = se.renderbuffer._renderbuffer;
                f(
                  Fe.width === ee && Fe.height === U,
                  "inconsistent width/height for renderbuffer"
                ), Fe.refCount += 1;
              }
          }
          function Y(se, ee) {
            ee && (ee.texture ? e.framebufferTexture2D(
              $t,
              se,
              ee.target,
              ee.texture._texture.texture,
              0
            ) : e.framebufferRenderbuffer(
              $t,
              se,
              aa,
              ee.renderbuffer._renderbuffer.renderbuffer
            ));
          }
          function ne(se) {
            var ee = er, U = null, ge = null, Se = se;
            typeof se == "object" && (Se = se.data, "target" in se && (ee = se.target | 0)), f.type(Se, "function", "invalid attachment data");
            var he = Se._reglType;
            return he === "texture2d" ? (U = Se, f(ee === er)) : he === "textureCube" ? (U = Se, f(
              ee >= cn && ee < cn + 6,
              "invalid cube map target"
            )) : he === "renderbuffer" ? (ge = Se, ee = aa) : f.raise("invalid regl object for attachment"), new K(ee, U, ge);
          }
          function A(se, ee, U, ge, Se) {
            if (U) {
              var he = G.create2D({
                width: se,
                height: ee,
                format: ge,
                type: Se
              });
              return he._texture.refCount = 0, new K(er, he, null);
            } else {
              var Fe = P.create({
                width: se,
                height: ee,
                format: ge
              });
              return Fe._renderbuffer.refCount = 0, new K(aa, null, Fe);
            }
          }
          function B(se) {
            return se && (se.texture || se.renderbuffer);
          }
          function Z(se, ee, U) {
            se && (se.texture ? se.texture.resize(ee, U) : se.renderbuffer && se.renderbuffer.resize(ee, U), se.width = ee, se.height = U);
          }
          var ue = 0, j = {};
          function le() {
            this.id = ue++, j[this.id] = this, this.framebuffer = e.createFramebuffer(), this.width = 0, this.height = 0, this.colorAttachments = [], this.depthAttachment = null, this.stencilAttachment = null, this.depthStencilAttachment = null;
          }
          function H(se) {
            se.colorAttachments.forEach(re), re(se.depthAttachment), re(se.stencilAttachment), re(se.depthStencilAttachment);
          }
          function ae(se) {
            var ee = se.framebuffer;
            f(ee, "must not double destroy framebuffer"), e.deleteFramebuffer(ee), se.framebuffer = null, F.framebufferCount--, delete j[se.id];
          }
          function V(se) {
            var ee;
            e.bindFramebuffer($t, se.framebuffer);
            var U = se.colorAttachments;
            for (ee = 0; ee < U.length; ++ee)
              Y(Xi + ee, U[ee]);
            for (ee = U.length; ee < l.maxColorAttachments; ++ee)
              e.framebufferTexture2D(
                $t,
                Xi + ee,
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
            ), Y(Vi, se.depthAttachment), Y(Hi, se.stencilAttachment), Y(Wi, se.depthStencilAttachment);
            var ge = e.checkFramebufferStatus($t);
            !e.isContextLost() && ge !== Yi && f.raise("framebuffer configuration not supported, status = " + vr[ge]), e.bindFramebuffer($t, k.next ? k.next.framebuffer : null), k.cur = k.next, e.getError();
          }
          function ie(se, ee) {
            var U = new le();
            F.framebufferCount++;
            function ge(he, Fe) {
              var we;
              f(
                k.next !== U,
                "can not update framebuffer which is currently in use"
              );
              var Oe = 0, je = 0, et = !0, ut = !0, Ie = null, it = !0, He = "rgba", tt = "uint8", ot = 1, st = null, ct = null, dt = null, Ke = !1;
              if (typeof he == "number")
                Oe = he | 0, je = Fe | 0 || Oe;
              else if (!he)
                Oe = je = 1;
              else {
                f.type(he, "object", "invalid arguments for framebuffer");
                var Le = he;
                if ("shape" in Le) {
                  var ht = Le.shape;
                  f(
                    Array.isArray(ht) && ht.length >= 2,
                    "invalid shape for framebuffer"
                  ), Oe = ht[0], je = ht[1];
                } else
                  "radius" in Le && (Oe = je = Le.radius), "width" in Le && (Oe = Le.width), "height" in Le && (je = Le.height);
                ("color" in Le || "colors" in Le) && (Ie = Le.color || Le.colors, Array.isArray(Ie) && f(
                  Ie.length === 1 || r.webgl_draw_buffers,
                  "multiple render targets not supported"
                )), Ie || ("colorCount" in Le && (ot = Le.colorCount | 0, f(ot > 0, "invalid color buffer count")), "colorTexture" in Le && (it = !!Le.colorTexture, He = "rgba4"), "colorType" in Le && (tt = Le.colorType, it ? (f(
                  r.oes_texture_float || !(tt === "float" || tt === "float32"),
                  "you must enable OES_texture_float in order to use floating point framebuffer objects"
                ), f(
                  r.oes_texture_half_float || !(tt === "half float" || tt === "float16"),
                  "you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects"
                )) : tt === "half float" || tt === "float16" ? (f(
                  r.ext_color_buffer_half_float,
                  "you must enable EXT_color_buffer_half_float to use 16-bit render buffers"
                ), He = "rgba16f") : (tt === "float" || tt === "float32") && (f(
                  r.webgl_color_buffer_float,
                  "you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers"
                ), He = "rgba32f"), f.oneOf(tt, J, "invalid color type")), "colorFormat" in Le && (He = Le.colorFormat, W.indexOf(He) >= 0 ? it = !0 : q.indexOf(He) >= 0 ? it = !1 : it ? f.oneOf(
                  Le.colorFormat,
                  W,
                  "invalid color format for texture"
                ) : f.oneOf(
                  Le.colorFormat,
                  q,
                  "invalid color format for renderbuffer"
                ))), ("depthTexture" in Le || "depthStencilTexture" in Le) && (Ke = !!(Le.depthTexture || Le.depthStencilTexture), f(
                  !Ke || r.webgl_depth_texture,
                  "webgl_depth_texture extension not supported"
                )), "depth" in Le && (typeof Le.depth == "boolean" ? et = Le.depth : (st = Le.depth, ut = !1)), "stencil" in Le && (typeof Le.stencil == "boolean" ? ut = Le.stencil : (ct = Le.stencil, et = !1)), "depthStencil" in Le && (typeof Le.depthStencil == "boolean" ? et = ut = Le.depthStencil : (dt = Le.depthStencil, et = !1, ut = !1));
              }
              var Ve = null, _e = null, Me = null, $e = null;
              if (Array.isArray(Ie))
                Ve = Ie.map(ne);
              else if (Ie)
                Ve = [ne(Ie)];
              else
                for (Ve = new Array(ot), we = 0; we < ot; ++we)
                  Ve[we] = A(
                    Oe,
                    je,
                    it,
                    He,
                    tt
                  );
              f(
                r.webgl_draw_buffers || Ve.length <= 1,
                "you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers."
              ), f(
                Ve.length <= l.maxColorAttachments,
                "too many color attachments, not supported"
              ), Oe = Oe || Ve[0].width, je = je || Ve[0].height, st ? _e = ne(st) : et && !ut && (_e = A(
                Oe,
                je,
                Ke,
                "depth",
                "uint32"
              )), ct ? Me = ne(ct) : ut && !et && (Me = A(
                Oe,
                je,
                !1,
                "stencil",
                "uint8"
              )), dt ? $e = ne(dt) : !st && !ct && ut && et && ($e = A(
                Oe,
                je,
                Ke,
                "depth stencil",
                "depth stencil"
              )), f(
                !!st + !!ct + !!dt <= 1,
                "invalid framebuffer configuration, can specify exactly one depth/stencil attachment"
              );
              var Qe = null;
              for (we = 0; we < Ve.length; ++we)
                if (oe(Ve[we], Oe, je), f(
                  !Ve[we] || Ve[we].texture && bu.indexOf(Ve[we].texture._texture.format) >= 0 || Ve[we].renderbuffer && Ou.indexOf(Ve[we].renderbuffer._renderbuffer.format) >= 0,
                  "framebuffer color attachment " + we + " is invalid"
                ), Ve[we] && Ve[we].texture) {
                  var Dt = ia[Ve[we].texture._texture.format] * ln[Ve[we].texture._texture.type];
                  Qe === null ? Qe = Dt : f(
                    Qe === Dt,
                    "all color attachments much have the same number of bits per pixel."
                  );
                }
              return oe(_e, Oe, je), f(
                !_e || _e.texture && _e.texture._texture.format === _u || _e.renderbuffer && _e.renderbuffer._renderbuffer.format === wu,
                "invalid depth attachment for framebuffer object"
              ), oe(Me, Oe, je), f(
                !Me || Me.renderbuffer && Me.renderbuffer._renderbuffer.format === Tu,
                "invalid stencil attachment for framebuffer object"
              ), oe($e, Oe, je), f(
                !$e || $e.texture && $e.texture._texture.format === Qi || $e.renderbuffer && $e.renderbuffer._renderbuffer.format === Qi,
                "invalid depth-stencil attachment for framebuffer object"
              ), H(U), U.width = Oe, U.height = je, U.colorAttachments = Ve, U.depthAttachment = _e, U.stencilAttachment = Me, U.depthStencilAttachment = $e, ge.color = Ve.map(B), ge.depth = B(_e), ge.stencil = B(Me), ge.depthStencil = B($e), ge.width = U.width, ge.height = U.height, V(U), ge;
            }
            function Se(he, Fe) {
              f(
                k.next !== U,
                "can not resize a framebuffer which is currently in use"
              );
              var we = Math.max(he | 0, 1), Oe = Math.max(Fe | 0 || we, 1);
              if (we === U.width && Oe === U.height)
                return ge;
              for (var je = U.colorAttachments, et = 0; et < je.length; ++et)
                Z(je[et], we, Oe);
              return Z(U.depthAttachment, we, Oe), Z(U.stencilAttachment, we, Oe), Z(U.depthStencilAttachment, we, Oe), U.width = ge.width = we, U.height = ge.height = Oe, V(U), ge;
            }
            return ge(se, ee), y(ge, {
              resize: Se,
              _reglType: "framebuffer",
              _framebuffer: U,
              destroy: function() {
                ae(U), H(U);
              },
              use: function(he) {
                k.setFBO({
                  framebuffer: ge
                }, he);
              }
            });
          }
          function ye(se) {
            var ee = Array(6);
            function U(Se) {
              var he;
              f(
                ee.indexOf(k.next) < 0,
                "can not update framebuffer which is currently in use"
              );
              var Fe = {
                color: null
              }, we = 0, Oe = null, je = "rgba", et = "uint8", ut = 1;
              if (typeof Se == "number")
                we = Se | 0;
              else if (!Se)
                we = 1;
              else {
                f.type(Se, "object", "invalid arguments for framebuffer");
                var Ie = Se;
                if ("shape" in Ie) {
                  var it = Ie.shape;
                  f(
                    Array.isArray(it) && it.length >= 2,
                    "invalid shape for framebuffer"
                  ), f(
                    it[0] === it[1],
                    "cube framebuffer must be square"
                  ), we = it[0];
                } else
                  "radius" in Ie && (we = Ie.radius | 0), "width" in Ie ? (we = Ie.width | 0, "height" in Ie && f(Ie.height === we, "must be square")) : "height" in Ie && (we = Ie.height | 0);
                ("color" in Ie || "colors" in Ie) && (Oe = Ie.color || Ie.colors, Array.isArray(Oe) && f(
                  Oe.length === 1 || r.webgl_draw_buffers,
                  "multiple render targets not supported"
                )), Oe || ("colorCount" in Ie && (ut = Ie.colorCount | 0, f(ut > 0, "invalid color buffer count")), "colorType" in Ie && (f.oneOf(
                  Ie.colorType,
                  J,
                  "invalid color type"
                ), et = Ie.colorType), "colorFormat" in Ie && (je = Ie.colorFormat, f.oneOf(
                  Ie.colorFormat,
                  W,
                  "invalid color format for texture"
                ))), "depth" in Ie && (Fe.depth = Ie.depth), "stencil" in Ie && (Fe.stencil = Ie.stencil), "depthStencil" in Ie && (Fe.depthStencil = Ie.depthStencil);
              }
              var He;
              if (Oe)
                if (Array.isArray(Oe))
                  for (He = [], he = 0; he < Oe.length; ++he)
                    He[he] = Oe[he];
                else
                  He = [Oe];
              else {
                He = Array(ut);
                var tt = {
                  radius: we,
                  format: je,
                  type: et
                };
                for (he = 0; he < ut; ++he)
                  He[he] = G.createCube(tt);
              }
              for (Fe.color = Array(He.length), he = 0; he < He.length; ++he) {
                var ot = He[he];
                f(
                  typeof ot == "function" && ot._reglType === "textureCube",
                  "invalid cube map"
                ), we = we || ot.width, f(
                  ot.width === we && ot.height === we,
                  "invalid cube map shape"
                ), Fe.color[he] = {
                  target: cn,
                  data: He[he]
                };
              }
              for (he = 0; he < 6; ++he) {
                for (var st = 0; st < He.length; ++st)
                  Fe.color[st].target = cn + he;
                he > 0 && (Fe.depth = ee[0].depth, Fe.stencil = ee[0].stencil, Fe.depthStencil = ee[0].depthStencil), ee[he] ? ee[he](Fe) : ee[he] = ie(Fe);
              }
              return y(U, {
                width: we,
                height: we,
                color: He
              });
            }
            function ge(Se) {
              var he, Fe = Se | 0;
              if (f(
                Fe > 0 && Fe <= l.maxCubeMapSize,
                "invalid radius for cube fbo"
              ), Fe === U.width)
                return U;
              var we = U.color;
              for (he = 0; he < we.length; ++he)
                we[he].resize(Fe);
              for (he = 0; he < 6; ++he)
                ee[he].resize(Fe);
              return U.width = U.height = Fe, U;
            }
            return U(se), y(U, {
              faces: ee,
              resize: ge,
              _reglType: "framebufferCube",
              destroy: function() {
                ee.forEach(function(Se) {
                  Se.destroy();
                });
              }
            });
          }
          function Ee() {
            k.cur = null, k.next = null, k.dirty = !0, Lt(j).forEach(function(se) {
              se.framebuffer = e.createFramebuffer(), V(se);
            });
          }
          return y(k, {
            getFramebuffer: function(se) {
              if (typeof se == "function" && se._reglType === "framebuffer") {
                var ee = se._framebuffer;
                if (ee instanceof le)
                  return ee;
              }
              return null;
            },
            create: ie,
            createCube: ye,
            clear: function() {
              Lt(j).forEach(ae);
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
            restore: oe() ? j : function() {
            },
            createVAO: le,
            getVAO: ne,
            destroyBuffer: re,
            setVAO: oe() ? A : B,
            clear: oe() ? Z : function() {
            }
          };
          function re(H) {
            for (var ae = 0; ae < k.length; ++ae) {
              var V = k[ae];
              V.buffer === H && (e.disableVertexAttribArray(ae), V.buffer = null);
            }
          }
          function oe() {
            return r.oes_vertex_array_object;
          }
          function Y() {
            return r.angle_instanced_arrays;
          }
          function ne(H) {
            return typeof H == "function" && H._vao ? H._vao : null;
          }
          function A(H) {
            if (H !== K.currentVAO) {
              var ae = oe();
              H ? ae.bindVertexArrayOES(H.vao) : ae.bindVertexArrayOES(null), K.currentVAO = H;
            }
          }
          function B(H) {
            if (H !== K.currentVAO) {
              if (H)
                H.bindAttrs();
              else
                for (var ae = Y(), V = 0; V < k.length; ++V) {
                  var ie = k[V];
                  ie.buffer ? (e.enableVertexAttribArray(V), e.vertexAttribPointer(V, ie.size, ie.type, ie.normalized, ie.stride, ie.offfset), ae && ie.divisor && ae.vertexAttribDivisorANGLE(V, ie.divisor)) : (e.disableVertexAttribArray(V), e.vertexAttrib4f(V, ie.x, ie.y, ie.z, ie.w));
                }
              K.currentVAO = H;
            }
          }
          function Z() {
            Lt(J).forEach(function(H) {
              H.destroy();
            });
          }
          function ue() {
            this.id = ++q, this.attributes = [];
            var H = oe();
            H ? this.vao = H.createVertexArrayOES() : this.vao = null, J[this.id] = this, this.buffers = [];
          }
          ue.prototype.bindAttrs = function() {
            for (var H = Y(), ae = this.attributes, V = 0; V < ae.length; ++V) {
              var ie = ae[V];
              ie.buffer ? (e.enableVertexAttribArray(V), e.bindBuffer(Zi, ie.buffer.buffer), e.vertexAttribPointer(V, ie.size, ie.type, ie.normalized, ie.stride, ie.offset), H && ie.divisor && H.vertexAttribDivisorANGLE(V, ie.divisor)) : (e.disableVertexAttribArray(V), e.vertexAttrib4f(V, ie.x, ie.y, ie.z, ie.w));
            }
            for (var ye = ae.length; ye < F; ++ye)
              e.disableVertexAttribArray(ye);
          }, ue.prototype.refresh = function() {
            var H = oe();
            H && (H.bindVertexArrayOES(this.vao), this.bindAttrs(), K.currentVAO = this);
          }, ue.prototype.destroy = function() {
            if (this.vao) {
              var H = oe();
              this === K.currentVAO && (K.currentVAO = null, H.bindVertexArrayOES(null)), H.deleteVertexArrayOES(this.vao), this.vao = null;
            }
            J[this.id] && (delete J[this.id], G.vaoCount -= 1);
          };
          function j() {
            var H = oe();
            H && Lt(J).forEach(function(ae) {
              ae.refresh();
            });
          }
          function le(H) {
            var ae = new ue();
            G.vaoCount += 1;
            function V(ie) {
              f(Array.isArray(ie), "arguments to vertex array constructor must be an array"), f(ie.length < F, "too many attributes"), f(ie.length > 0, "must specify at least one attribute");
              var ye = {}, Ee = ae.attributes;
              Ee.length = ie.length;
              for (var se = 0; se < ie.length; ++se) {
                var ee = ie[se], U = Ee[se] = new oa(), ge = ee.data || ee;
                if (Array.isArray(ge) || v(ge) || Gt(ge)) {
                  var Se;
                  ae.buffers[se] && (Se = ae.buffers[se], v(ge) && Se._buffer.byteLength >= ge.byteLength ? Se.subdata(ge) : (Se.destroy(), ae.buffers[se] = null)), ae.buffers[se] || (Se = ae.buffers[se] = P.create(ee, Zi, !1, !0)), U.buffer = P.getBuffer(Se), U.size = U.buffer.dimension | 0, U.normalized = !1, U.type = U.buffer.dtype, U.offset = 0, U.stride = 0, U.divisor = 0, U.state = 1, ye[se] = 1;
                } else P.getBuffer(ee) ? (U.buffer = P.getBuffer(ee), U.size = U.buffer.dimension | 0, U.normalized = !1, U.type = U.buffer.dtype, U.offset = 0, U.stride = 0, U.divisor = 0, U.state = 1) : P.getBuffer(ee.buffer) ? (U.buffer = P.getBuffer(ee.buffer), U.size = (+ee.size || U.buffer.dimension) | 0, U.normalized = !!ee.normalized || !1, "type" in ee ? (f.parameter(ee.type, Kt, "invalid buffer type"), U.type = Kt[ee.type]) : U.type = U.buffer.dtype, U.offset = (ee.offset || 0) | 0, U.stride = (ee.stride || 0) | 0, U.divisor = (ee.divisor || 0) | 0, U.state = 1, f(U.size >= 1 && U.size <= 4, "size must be between 1 and 4"), f(U.offset >= 0, "invalid offset"), f(U.stride >= 0 && U.stride <= 255, "stride must be between 0 and 255"), f(U.divisor >= 0, "divisor must be positive"), f(!U.divisor || !!r.angle_instanced_arrays, "ANGLE_instanced_arrays must be enabled to use divisor")) : "x" in ee ? (f(se > 0, "first attribute must not be a constant"), U.x = +ee.x || 0, U.y = +ee.y || 0, U.z = +ee.z || 0, U.w = +ee.w || 0, U.state = 2) : f(!1, "invalid attribute spec for location " + se);
              }
              for (var he = 0; he < ae.buffers.length; ++he)
                !ye[he] && ae.buffers[he] && (ae.buffers[he].destroy(), ae.buffers[he] = null);
              return ae.refresh(), V;
            }
            return V.destroy = function() {
              for (var ie = 0; ie < ae.buffers.length; ++ie)
                ae.buffers[ie] && ae.buffers[ie].destroy();
              ae.buffers.length = 0, ae.destroy();
            }, V._vao = ae, V._reglType = "vao", V(H);
          }
          return K;
        }
        var Ji = 35632, Mu = 35633, ku = 35718, Bu = 35721;
        function Iu(e, r, l, G) {
          var P = {}, F = {};
          function k(A, B, Z, ue) {
            this.name = A, this.id = B, this.location = Z, this.info = ue;
          }
          function W(A, B) {
            for (var Z = 0; Z < A.length; ++Z)
              if (A[Z].id === B.id) {
                A[Z].location = B.location;
                return;
              }
            A.push(B);
          }
          function q(A, B, Z) {
            var ue = A === Ji ? P : F, j = ue[B];
            if (!j) {
              var le = r.str(B);
              j = e.createShader(A), e.shaderSource(j, le), e.compileShader(j), f.shaderError(e, j, le, A, Z), ue[B] = j;
            }
            return j;
          }
          var J = {}, K = [], re = 0;
          function oe(A, B) {
            this.id = re++, this.fragId = A, this.vertId = B, this.program = null, this.uniforms = [], this.attributes = [], this.refCount = 1, G.profile && (this.stats = {
              uniformsCount: 0,
              attributesCount: 0
            });
          }
          function Y(A, B, Z) {
            var ue, j, le = q(Ji, A.fragId), H = q(Mu, A.vertId), ae = A.program = e.createProgram();
            if (e.attachShader(ae, le), e.attachShader(ae, H), Z)
              for (ue = 0; ue < Z.length; ++ue) {
                var V = Z[ue];
                e.bindAttribLocation(ae, V[0], V[1]);
              }
            e.linkProgram(ae), f.linkError(
              e,
              ae,
              r.str(A.fragId),
              r.str(A.vertId),
              B
            );
            var ie = e.getProgramParameter(ae, ku);
            G.profile && (A.stats.uniformsCount = ie);
            var ye = A.uniforms;
            for (ue = 0; ue < ie; ++ue)
              if (j = e.getActiveUniform(ae, ue), j)
                if (j.size > 1)
                  for (var Ee = 0; Ee < j.size; ++Ee) {
                    var se = j.name.replace("[0]", "[" + Ee + "]");
                    W(ye, new k(
                      se,
                      r.id(se),
                      e.getUniformLocation(ae, se),
                      j
                    ));
                  }
                else
                  W(ye, new k(
                    j.name,
                    r.id(j.name),
                    e.getUniformLocation(ae, j.name),
                    j
                  ));
            var ee = e.getProgramParameter(ae, Bu);
            G.profile && (A.stats.attributesCount = ee);
            var U = A.attributes;
            for (ue = 0; ue < ee; ++ue)
              j = e.getActiveAttrib(ae, ue), j && W(U, new k(
                j.name,
                r.id(j.name),
                e.getAttribLocation(ae, j.name),
                j
              ));
          }
          G.profile && (l.getMaxUniformsCount = function() {
            var A = 0;
            return K.forEach(function(B) {
              B.stats.uniformsCount > A && (A = B.stats.uniformsCount);
            }), A;
          }, l.getMaxAttributesCount = function() {
            var A = 0;
            return K.forEach(function(B) {
              B.stats.attributesCount > A && (A = B.stats.attributesCount);
            }), A;
          });
          function ne() {
            P = {}, F = {};
            for (var A = 0; A < K.length; ++A)
              Y(K[A], null, K[A].attributes.map(function(B) {
                return [B.location, B.name];
              }));
          }
          return {
            clear: function() {
              var A = e.deleteShader.bind(e);
              Lt(P).forEach(A), P = {}, Lt(F).forEach(A), F = {}, K.forEach(function(B) {
                e.deleteProgram(B.program);
              }), K.length = 0, J = {}, l.shaderCount = 0;
            },
            program: function(A, B, Z, ue) {
              f.command(A >= 0, "missing vertex shader", Z), f.command(B >= 0, "missing fragment shader", Z);
              var j = J[B];
              j || (j = J[B] = {});
              var le = j[A];
              if (le && (le.refCount++, !ue))
                return le;
              var H = new oe(B, A);
              return l.shaderCount++, Y(H, Z, ue), le || (j[A] = H), K.push(H), y(H, {
                destroy: function() {
                  if (H.refCount--, H.refCount <= 0) {
                    e.deleteProgram(H.program);
                    var ae = K.indexOf(H);
                    K.splice(ae, 1), l.shaderCount--;
                  }
                  j[H.vertId].refCount <= 0 && (e.deleteShader(F[H.vertId]), delete F[H.vertId], delete J[H.fragId][H.vertId]), Object.keys(J[H.fragId]).length || (e.deleteShader(P[H.fragId]), delete P[H.fragId], delete J[H.fragId]);
                }
              });
            },
            restore: ne,
            shader: q,
            frag: -1,
            vert: -1
          };
        }
        var Nu = 6408, kr = 5121, Du = 3333, dn = 5126;
        function Pu(e, r, l, G, P, F, k) {
          function W(K) {
            var re;
            r.next === null ? (f(
              P.preserveDrawingBuffer,
              'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer'
            ), re = kr) : (f(
              r.next.colorAttachments[0].texture !== null,
              "You cannot read from a renderbuffer"
            ), re = r.next.colorAttachments[0].texture._texture.type, F.oes_texture_float ? (f(
              re === kr || re === dn,
              "Reading from a framebuffer is only allowed for the types 'uint8' and 'float'"
            ), re === dn && f(k.readFloat, "Reading 'float' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float")) : f(
              re === kr,
              "Reading from a framebuffer is only allowed for the type 'uint8'"
            ));
            var oe = 0, Y = 0, ne = G.framebufferWidth, A = G.framebufferHeight, B = null;
            v(K) ? B = K : K && (f.type(K, "object", "invalid arguments to regl.read()"), oe = K.x | 0, Y = K.y | 0, f(
              oe >= 0 && oe < G.framebufferWidth,
              "invalid x offset for regl.read"
            ), f(
              Y >= 0 && Y < G.framebufferHeight,
              "invalid y offset for regl.read"
            ), ne = (K.width || G.framebufferWidth - oe) | 0, A = (K.height || G.framebufferHeight - Y) | 0, B = K.data || null), B && (re === kr ? f(
              B instanceof Uint8Array,
              "buffer must be 'Uint8Array' when reading from a framebuffer of type 'uint8'"
            ) : re === dn && f(
              B instanceof Float32Array,
              "buffer must be 'Float32Array' when reading from a framebuffer of type 'float'"
            )), f(
              ne > 0 && ne + oe <= G.framebufferWidth,
              "invalid width for read pixels"
            ), f(
              A > 0 && A + Y <= G.framebufferHeight,
              "invalid height for read pixels"
            ), l();
            var Z = ne * A * 4;
            return B || (re === kr ? B = new Uint8Array(Z) : re === dn && (B = B || new Float32Array(Z))), f.isTypedArray(B, "data buffer for regl.read() must be a typedarray"), f(B.byteLength >= Z, "data buffer for regl.read() too small"), e.pixelStorei(Du, 4), e.readPixels(
              oe,
              Y,
              ne,
              A,
              Nu,
              re,
              B
            ), B;
          }
          function q(K) {
            var re;
            return r.setFBO({
              framebuffer: K.framebuffer
            }, function() {
              re = W(K);
            }), re;
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
          function G(re) {
            for (var oe = 0; oe < l.length; ++oe)
              if (l[oe] === re)
                return r[oe];
            var Y = "g" + e++;
            return r.push(Y), l.push(re), Y;
          }
          function P() {
            var re = [];
            function oe() {
              re.push.apply(re, yr(arguments));
            }
            var Y = [];
            function ne() {
              var A = "v" + e++;
              return Y.push(A), arguments.length > 0 && (re.push(A, "="), re.push.apply(re, yr(arguments)), re.push(";")), A;
            }
            return y(oe, {
              def: ne,
              toString: function() {
                return _r([
                  Y.length > 0 ? "var " + Y.join(",") + ";" : "",
                  _r(re)
                ]);
              }
            });
          }
          function F() {
            var re = P(), oe = P(), Y = re.toString, ne = oe.toString;
            function A(B, Z) {
              oe(B, Z, "=", re.def(B, Z), ";");
            }
            return y(function() {
              re.apply(re, yr(arguments));
            }, {
              def: re.def,
              entry: re,
              exit: oe,
              save: A,
              set: function(B, Z, ue) {
                A(B, Z), re(B, Z, "=", ue, ";");
              },
              toString: function() {
                return Y() + ne();
              }
            });
          }
          function k() {
            var re = _r(arguments), oe = F(), Y = F(), ne = oe.toString, A = Y.toString;
            return y(oe, {
              then: function() {
                return oe.apply(oe, yr(arguments)), this;
              },
              else: function() {
                return Y.apply(Y, yr(arguments)), this;
              },
              toString: function() {
                var B = A();
                return B && (B = "else{" + B + "}"), _r([
                  "if(",
                  re,
                  "){",
                  ne(),
                  "}",
                  B
                ]);
              }
            });
          }
          var W = P(), q = {};
          function J(re, oe) {
            var Y = [];
            function ne() {
              var j = "a" + Y.length;
              return Y.push(j), j;
            }
            oe = oe || 0;
            for (var A = 0; A < oe; ++A)
              ne();
            var B = F(), Z = B.toString, ue = q[re] = y(B, {
              arg: ne,
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
            var re = [
              '"use strict";',
              W,
              "return {"
            ];
            Object.keys(q).forEach(function(ne) {
              re.push('"', ne, '":', q[ne].toString(), ",");
            }), re.push("}");
            var oe = _r(re).replace(/;/g, `;
`).replace(/}/g, `}
`).replace(/{/g, `{
`), Y = Function.apply(null, r.concat(oe));
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
        var br = "xyzw".split(""), eo = 5121, gr = 1, sa = 2, fa = 0, ua = 1, ca = 2, la = 3, hn = 4, to = 5, ro = 6, no = "dither", ao = "blend.enable", io = "blend.color", da = "blend.equation", ha = "blend.func", oo = "depth.enable", so = "depth.func", fo = "depth.range", uo = "depth.mask", ma = "colorMask", co = "cull.enable", lo = "cull.face", pa = "frontFace", va = "lineWidth", ho = "polygonOffset.enable", ya = "polygonOffset.offset", mo = "sample.alpha", po = "sample.enable", _a = "sample.coverage", vo = "stencil.enable", yo = "stencil.mask", ba = "stencil.func", ga = "stencil.opFront", Br = "stencil.opBack", _o = "scissor.enable", mn = "scissor.box", Ut = "viewport", Ir = "profile", tr = "framebuffer", Nr = "vert", Dr = "frag", rr = "elements", nr = "primitive", ar = "count", pn = "offset", vn = "instances", Pr = "vao", Ea = "Width", xa = "Height", Er = tr + Ea, xr = tr + xa, Uu = Ut + Ea, zu = Ut + xa, bo = "drawingBuffer", go = bo + Ea, Eo = bo + xa, ju = [
          ha,
          da,
          ba,
          ga,
          Br,
          _a,
          Ut,
          mn,
          ya
        ], wr = 34962, Xu = 34963, Vu = 35632, Hu = 35633, xo = 3553, Wu = 34067, Yu = 2884, qu = 3042, Ku = 3024, Qu = 2960, Zu = 2929, Ju = 3089, ec = 32823, tc = 32926, rc = 32928, wa = 5126, yn = 35664, _n = 35665, bn = 35666, Ta = 5124, gn = 35667, En = 35668, xn = 35669, Aa = 35670, wn = 35671, Tn = 35672, An = 35673, $r = 35674, Ur = 35675, zr = 35676, jr = 35678, Xr = 35680, wo = 4, Vr = 1028, ir = 1029, To = 2304, Sa = 2305, nc = 32775, ac = 32776, ic = 519, Vt = 7680, Ao = 0, So = 1, Lo = 32774, oc = 513, Ro = 36160, sc = 36064, Nt = {
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
        ], Tr = {
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
          cw: To,
          ccw: Sa
        };
        function Sn(e) {
          return Array.isArray(e) || v(e) || Gt(e);
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
        function Je(e) {
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
        function fc(e, r, l, G, P, F, k, W, q, J, K, re, oe, Y, ne) {
          var A = J.Record, B = {
            add: 32774,
            subtract: 32778,
            "reverse subtract": 32779
          };
          l.ext_blend_minmax && (B.min = nc, B.max = ac);
          var Z = l.angle_instanced_arrays, ue = l.webgl_draw_buffers, j = {
            dirty: !0,
            profile: ne.profile
          }, le = {}, H = [], ae = {}, V = {};
          function ie(o) {
            return o.replace(".", "_");
          }
          function ye(o, t, h) {
            var w = ie(o);
            H.push(o), le[w] = j[w] = !!h, ae[w] = t;
          }
          function Ee(o, t, h) {
            var w = ie(o);
            H.push(o), Array.isArray(h) ? (j[w] = h.slice(), le[w] = h.slice()) : j[w] = le[w] = h, V[w] = t;
          }
          ye(no, Ku), ye(ao, qu), Ee(io, "blendColor", [0, 0, 0, 0]), Ee(
            da,
            "blendEquationSeparate",
            [Lo, Lo]
          ), Ee(
            ha,
            "blendFuncSeparate",
            [So, Ao, So, Ao]
          ), ye(oo, Zu, !0), Ee(so, "depthFunc", oc), Ee(fo, "depthRange", [0, 1]), Ee(uo, "depthMask", !0), Ee(ma, ma, [!0, !0, !0, !0]), ye(co, Yu), Ee(lo, "cullFace", ir), Ee(pa, pa, Sa), Ee(va, va, 1), ye(ho, ec), Ee(ya, "polygonOffset", [0, 0]), ye(mo, tc), ye(po, rc), Ee(_a, "sampleCoverage", [1, !1]), ye(vo, Qu), Ee(yo, "stencilMask", -1), Ee(ba, "stencilFunc", [ic, 0, -1]), Ee(
            ga,
            "stencilOpSeparate",
            [Vr, Vt, Vt, Vt]
          ), Ee(
            Br,
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
          var se = {
            gl: e,
            context: oe,
            strings: r,
            next: le,
            current: j,
            draw: re,
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
          }, ee = {
            primTypes: ur,
            compareFuncs: Tr,
            blendFuncs: Nt,
            blendEquations: B,
            stencilOps: Ht,
            glTypes: Kt,
            orientationType: La
          };
          f.optional(function() {
            se.isArrayLike = qe;
          }), ue && (ee.backBuffer = [ir], ee.drawBuffer = Et(G.maxDrawbuffers, function(o) {
            return o === 0 ? [0] : Et(o, function(t) {
              return sc + t;
            });
          }));
          var U = 0;
          function ge() {
            var o = $u(), t = o.link, h = o.global;
            o.id = U++, o.batchId = "0";
            var w = t(se), S = o.shared = {
              props: "a0"
            };
            Object.keys(se).forEach(function(d) {
              S[d] = h.def(w, ".", d);
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
              }, ee.invalidBlendCombinations = Oo;
            });
            var p = o.next = {}, m = o.current = {};
            Object.keys(V).forEach(function(d) {
              Array.isArray(j[d]) && (p[d] = h.def(S.next, ".", d), m[d] = h.def(S.current, ".", d));
            });
            var g = o.constants = {};
            Object.keys(ee).forEach(function(d) {
              g[d] = h.def(JSON.stringify(ee[d]));
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
              E || (E = J.scope[i] = new A());
              var L = s[i] = t(E);
              return L;
            }, o;
          }
          function Se(o) {
            var t = o.static, h = o.dynamic, w;
            if (Ir in t) {
              var S = !!t[Ir];
              w = Je(function(m, g) {
                return S;
              }), w.enable = S;
            } else if (Ir in h) {
              var p = h[Ir];
              w = xt(p, function(m, g) {
                return m.invoke(g, p);
              });
            }
            return w;
          }
          function he(o, t) {
            var h = o.static, w = o.dynamic;
            if (tr in h) {
              var S = h[tr];
              return S ? (S = W.getFramebuffer(S), f.command(S, "invalid framebuffer object"), Je(function(m, g) {
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
              })) : Je(function(m, g) {
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
            } else if (tr in w) {
              var p = w[tr];
              return xt(p, function(m, g) {
                var s = m.invoke(g, p), d = m.shared, i = d.framebuffer, E = g.def(
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
          function Fe(o, t, h) {
            var w = o.static, S = o.dynamic;
            function p(s) {
              if (s in w) {
                var d = w[s];
                f.commandType(d, "object", "invalid " + s, h.commandStr);
                var i = !0, E = d.x | 0, L = d.y | 0, D, $;
                return "width" in d ? (D = d.width | 0, f.command(D >= 0, "invalid " + s, h.commandStr)) : i = !1, "height" in d ? ($ = d.height | 0, f.command($ >= 0, "invalid " + s, h.commandStr)) : i = !1, new _t(
                  !i && t && t.thisDep,
                  !i && t && t.contextDep,
                  !i && t && t.propDep,
                  function(ve, Re) {
                    var me = ve.shared.context, be = D;
                    "width" in d || (be = Re.def(me, ".", Er, "-", E));
                    var Ae = $;
                    return "height" in d || (Ae = Re.def(me, ".", xr, "-", L)), [E, L, be, Ae];
                  }
                );
              } else if (s in S) {
                var I = S[s], Q = xt(I, function(ve, Re) {
                  var me = ve.invoke(Re, I);
                  f.optional(function() {
                    ve.assert(
                      Re,
                      me + "&&typeof " + me + '==="object"',
                      "invalid " + s
                    );
                  });
                  var be = ve.shared.context, Ae = Re.def(me, ".x|0"), Xe = Re.def(me, ".y|0"), Ye = Re.def(
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
                    Ae,
                    ")"
                  ), bt = Re.def(
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
                    Xe,
                    ")"
                  );
                  return f.optional(function() {
                    ve.assert(
                      Re,
                      Ye + ">=0&&" + bt + ">=0",
                      "invalid " + s
                    );
                  }), [Ae, Xe, Ye, bt];
                });
                return t && (Q.thisDep = Q.thisDep || t.thisDep, Q.contextDep = Q.contextDep || t.contextDep, Q.propDep = Q.propDep || t.propDep), Q;
              } else return t ? new _t(
                t.thisDep,
                t.contextDep,
                t.propDep,
                function(ve, Re) {
                  var me = ve.shared.context;
                  return [
                    0,
                    0,
                    Re.def(me, ".", Er),
                    Re.def(me, ".", xr)
                  ];
                }
              ) : null;
            }
            var m = p(Ut);
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
              scissor_box: p(mn)
            };
          }
          function we(o, t) {
            var h = o.static, w = typeof h[Dr] == "string" && typeof h[Nr] == "string";
            if (w) {
              if (Object.keys(t.dynamic).length > 0)
                return null;
              var S = t.static, p = Object.keys(S);
              if (p.length > 0 && typeof S[p[0]] == "number") {
                for (var m = [], g = 0; g < p.length; ++g)
                  f(typeof S[p[g]] == "number", "must specify all vertex attribute locations when using vaos"), m.push([S[p[g]] | 0, p[g]]);
                return m;
              }
            }
            return null;
          }
          function Oe(o, t, h) {
            var w = o.static, S = o.dynamic;
            function p(i) {
              if (i in w) {
                var E = r.id(w[i]);
                f.optional(function() {
                  K.shader(Co[i], E, f.guessCommand());
                });
                var L = Je(function() {
                  return E;
                });
                return L.id = E, L;
              } else if (i in S) {
                var D = S[i];
                return xt(D, function($, I) {
                  var Q = $.invoke(I, D), ve = I.def($.shared.strings, ".id(", Q, ")");
                  return f.optional(function() {
                    I(
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
            var m = p(Dr), g = p(Nr), s = null, d;
            return Wt(m) && Wt(g) ? (s = K.program(g.id, m.id, null, h), d = Je(function(i, E) {
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
                var I = L + ".program(" + $ + "," + D;
                return f.optional(function() {
                  I += "," + i.command;
                }), E.def(I + ")");
              }
            ), {
              frag: m,
              vert: g,
              progVar: d,
              program: s
            };
          }
          function je(o, t) {
            var h = o.static, w = o.dynamic;
            function S() {
              if (rr in h) {
                var i = h[rr];
                Sn(i) ? i = F.getElements(F.create(i, !0)) : i && (i = F.getElements(i), f.command(i, "invalid elements", t.commandStr));
                var E = Je(function(D, $) {
                  if (i) {
                    var I = D.link(i);
                    return D.ELEMENTS = I, I;
                  }
                  return D.ELEMENTS = null, null;
                });
                return E.value = i, E;
              } else if (rr in w) {
                var L = w[rr];
                return xt(L, function(D, $) {
                  var I = D.shared, Q = I.isBufferArgs, ve = I.elements, Re = D.invoke($, L), me = $.def("null"), be = $.def(Q, "(", Re, ")"), Ae = D.cond(be).then(me, "=", ve, ".createStream(", Re, ");").else(me, "=", ve, ".getElements(", Re, ");");
                  return f.optional(function() {
                    D.assert(
                      Ae.else,
                      "!" + Re + "||" + me,
                      "invalid elements"
                    );
                  }), $.entry(Ae), $.exit(
                    D.cond(be).then(ve, ".destroyStream(", me, ");")
                  ), D.ELEMENTS = me, me;
                });
              }
              return null;
            }
            var p = S();
            function m() {
              if (nr in h) {
                var i = h[nr];
                return f.commandParameter(i, ur, "invalid primitve", t.commandStr), Je(function(L, D) {
                  return ur[i];
                });
              } else if (nr in w) {
                var E = w[nr];
                return xt(E, function(L, D) {
                  var $ = L.constants.primTypes, I = L.invoke(D, E);
                  return f.optional(function() {
                    L.assert(
                      D,
                      I + " in " + $,
                      "invalid primitive, must be one of " + Object.keys(ur)
                    );
                  }), D.def($, "[", I, "]");
                });
              } else if (p)
                return Wt(p) ? p.value ? Je(function(L, D) {
                  return D.def(L.ELEMENTS, ".primType");
                }) : Je(function() {
                  return wo;
                }) : new _t(
                  p.thisDep,
                  p.contextDep,
                  p.propDep,
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
                return f.command(!E || L >= 0, "invalid " + i, t.commandStr), Je(function($, I) {
                  return E && ($.OFFSET = L), L;
                });
              } else if (i in w) {
                var D = w[i];
                return xt(D, function($, I) {
                  var Q = $.invoke(I, D);
                  return E && ($.OFFSET = Q, f.optional(function() {
                    $.assert(
                      I,
                      Q + ">=0",
                      "invalid " + i
                    );
                  })), Q;
                });
              } else if (E && p)
                return Je(function($, I) {
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
                ), Je(function() {
                  return i;
                });
              } else if (ar in w) {
                var E = w[ar];
                return xt(E, function($, I) {
                  var Q = $.invoke(I, E);
                  return f.optional(function() {
                    $.assert(
                      I,
                      "typeof " + Q + '==="number"&&' + Q + ">=0&&" + Q + "===(" + Q + "|0)",
                      "invalid vertex count"
                    );
                  }), Q;
                });
              } else if (p)
                if (Wt(p)) {
                  if (p)
                    return s ? new _t(
                      s.thisDep,
                      s.contextDep,
                      s.propDep,
                      function($, I) {
                        var Q = I.def(
                          $.ELEMENTS,
                          ".vertCount-",
                          $.OFFSET
                        );
                        return f.optional(function() {
                          $.assert(
                            I,
                            Q + ">=0",
                            "invalid vertex offset/element buffer too small"
                          );
                        }), Q;
                      }
                    ) : Je(function($, I) {
                      return I.def($.ELEMENTS, ".vertCount");
                    });
                  var L = Je(function() {
                    return -1;
                  });
                  return f.optional(function() {
                    L.MISSING = !0;
                  }), L;
                } else {
                  var D = new _t(
                    p.thisDep || s.thisDep,
                    p.contextDep || s.contextDep,
                    p.propDep || s.propDep,
                    function($, I) {
                      var Q = $.ELEMENTS;
                      return $.OFFSET ? I.def(
                        Q,
                        "?",
                        Q,
                        ".vertCount-",
                        $.OFFSET,
                        ":-1"
                      ) : I.def(Q, "?", Q, ".vertCount:-1");
                    }
                  );
                  return f.optional(function() {
                    D.DYNAMIC = !0;
                  }), D;
                }
              return null;
            }
            return {
              elements: p,
              primitive: m(),
              count: d(),
              instances: g(vn, !1),
              offset: s
            };
          }
          function et(o, t) {
            var h = o.static, w = o.dynamic, S = {};
            return H.forEach(function(p) {
              var m = ie(p);
              function g(s, d) {
                if (p in h) {
                  var i = s(h[p]);
                  S[m] = Je(function() {
                    return i;
                  });
                } else if (p in w) {
                  var E = w[p];
                  S[m] = xt(E, function(L, D) {
                    return d(L, D, L.invoke(D, E));
                  });
                }
              }
              switch (p) {
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
                      return f.commandType(s, "boolean", p, t.commandStr), s;
                    },
                    function(s, d, i) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          "typeof " + i + '==="boolean"',
                          "invalid flag " + p,
                          s.commandStr
                        );
                      }), i;
                    }
                  );
                case so:
                  return g(
                    function(s) {
                      return f.commandParameter(s, Tr, "invalid " + p, t.commandStr), Tr[s];
                    },
                    function(s, d, i) {
                      var E = s.constants.compareFuncs;
                      return f.optional(function() {
                        s.assert(
                          d,
                          i + " in " + E,
                          "invalid " + p + ", must be one of " + Object.keys(Tr)
                        );
                      }), d.def(E, "[", i, "]");
                    }
                  );
                case fo:
                  return g(
                    function(s) {
                      return f.command(
                        qe(s) && s.length === 2 && typeof s[0] == "number" && typeof s[1] == "number" && s[0] <= s[1],
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
                        var Ae = d.def(
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
                            Ae + " in " + E,
                            "invalid " + p + "." + me + be + ", must be one of " + Object.keys(Nt)
                          );
                        }), Ae;
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
                      var I = d.def(E, "[", D, "]"), Q = d.def(E, "[", L("src", "Alpha"), "]"), ve = d.def(E, "[", $, "]"), Re = d.def(E, "[", L("dst", "Alpha"), "]");
                      return [I, ve, Q, Re];
                    }
                  );
                case da:
                  return g(
                    function(s) {
                      if (typeof s == "string")
                        return f.commandParameter(s, B, "invalid " + p, t.commandStr), [
                          B[s],
                          B[s]
                        ];
                      if (typeof s == "object")
                        return f.commandParameter(
                          s.rgb,
                          B,
                          p + ".rgb",
                          t.commandStr
                        ), f.commandParameter(
                          s.alpha,
                          B,
                          p + ".alpha",
                          t.commandStr
                        ), [
                          B[s.rgb],
                          B[s.alpha]
                        ];
                      f.commandRaise("invalid blend.equation", t.commandStr);
                    },
                    function(s, d, i) {
                      var E = s.constants.blendEquations, L = d.def(), D = d.def(), $ = s.cond("typeof ", i, '==="string"');
                      return f.optional(function() {
                        function I(Q, ve, Re) {
                          s.assert(
                            Q,
                            Re + " in " + E,
                            "invalid " + ve + ", must be one of " + Object.keys(B)
                          );
                        }
                        I($.then, p, i), s.assert(
                          $.else,
                          i + "&&typeof " + i + '==="object"',
                          "invalid " + p
                        ), I($.else, p + ".rgb", i + ".rgb"), I($.else, p + ".alpha", i + ".alpha");
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
                        qe(s) && s.length === 4,
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
                      return f.commandParameter(d, Tr, p + ".cmp", t.commandStr), f.commandType(i, "number", p + ".ref", t.commandStr), f.commandType(E, "number", p + ".mask", t.commandStr), [
                        Tr[d],
                        i,
                        E
                      ];
                    },
                    function(s, d, i) {
                      var E = s.constants.compareFuncs;
                      f.optional(function() {
                        function I() {
                          s.assert(
                            d,
                            Array.prototype.join.call(arguments, ""),
                            "invalid stencil.func"
                          );
                        }
                        I(i + "&&typeof ", i, '==="object"'), I(
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
                case Br:
                  return g(
                    function(s) {
                      f.commandType(s, "object", m, t.commandStr);
                      var d = s.fail || "keep", i = s.zfail || "keep", E = s.zpass || "keep";
                      return f.commandParameter(d, Ht, p + ".fail", t.commandStr), f.commandParameter(i, Ht, p + ".zfail", t.commandStr), f.commandParameter(E, Ht, p + ".zpass", t.commandStr), [
                        p === Br ? ir : Vr,
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
                          "invalid " + p
                        );
                      });
                      function L(D) {
                        return f.optional(function() {
                          s.assert(
                            d,
                            '!("' + D + '" in ' + i + ")||(" + i + "." + D + " in " + E + ")",
                            "invalid " + p + "." + D + ", must be one of " + Object.keys(Ht)
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
                        p === Br ? ir : Vr,
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
                          "invalid " + p
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
                      }), d.def(i + '==="cw"?' + To + ":" + Sa);
                    }
                  );
                case ma:
                  return g(
                    function(s) {
                      return f.command(
                        qe(s) && s.length === 4,
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
            var h = o.static, w = o.dynamic, S = {};
            return Object.keys(h).forEach(function(p) {
              var m = h[p], g;
              if (typeof m == "number" || typeof m == "boolean")
                g = Je(function() {
                  return m;
                });
              else if (typeof m == "function") {
                var s = m._reglType;
                s === "texture2d" || s === "textureCube" ? g = Je(function(d) {
                  return d.link(m);
                }) : s === "framebuffer" || s === "framebufferCube" ? (f.command(
                  m.color.length > 0,
                  'missing color attachment for framebuffer sent to uniform "' + p + '"',
                  t.commandStr
                ), g = Je(function(d) {
                  return d.link(m.color[0]);
                })) : f.commandRaise('invalid data for uniform "' + p + '"', t.commandStr);
              } else qe(m) ? g = Je(function(d) {
                var i = d.global.def(
                  "[",
                  Et(m.length, function(E) {
                    return f.command(
                      typeof m[E] == "number" || typeof m[E] == "boolean",
                      "invalid uniform " + p,
                      d.commandStr
                    ), m[E];
                  }),
                  "]"
                );
                return i;
              }) : f.commandRaise('invalid or missing data for uniform "' + p + '"', t.commandStr);
              g.value = m, S[p] = g;
            }), Object.keys(w).forEach(function(p) {
              var m = w[p];
              S[p] = xt(m, function(g, s) {
                return g.invoke(s, m);
              });
            }), S;
          }
          function Ie(o, t) {
            var h = o.static, w = o.dynamic, S = {};
            return Object.keys(h).forEach(function(p) {
              var m = h[p], g = r.id(p), s = new A();
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
                  "invalid data for attribute " + p,
                  t.commandStr
                ), "constant" in m) {
                  var i = m.constant;
                  s.buffer = "null", s.state = sa, typeof i == "number" ? s.x = i : (f.command(
                    qe(i) && i.length > 0 && i.length <= 4,
                    "invalid constant for attribute " + p,
                    t.commandStr
                  ), br.forEach(function(ve, Re) {
                    Re < i.length && (s[ve] = i[Re]);
                  }));
                } else {
                  Sn(m.buffer) ? d = P.getBuffer(
                    P.create(m.buffer, wr, !1, !0)
                  ) : d = P.getBuffer(m.buffer), f.command(!!d, 'missing buffer for attribute "' + p + '"', t.commandStr);
                  var E = m.offset | 0;
                  f.command(
                    E >= 0,
                    'invalid offset for attribute "' + p + '"',
                    t.commandStr
                  );
                  var L = m.stride | 0;
                  f.command(
                    L >= 0 && L < 256,
                    'invalid stride for attribute "' + p + '", must be integer betweeen [0, 255]',
                    t.commandStr
                  );
                  var D = m.size | 0;
                  f.command(
                    !("size" in m) || D > 0 && D <= 4,
                    'invalid size for attribute "' + p + '", must be 1,2,3,4',
                    t.commandStr
                  );
                  var $ = !!m.normalized, I = 0;
                  "type" in m && (f.commandParameter(
                    m.type,
                    Kt,
                    "invalid type for attribute " + p,
                    t.commandStr
                  ), I = Kt[m.type]);
                  var Q = m.divisor | 0;
                  "divisor" in m && (f.command(
                    Q === 0 || Z,
                    'cannot specify divisor for attribute "' + p + '", instancing not supported',
                    t.commandStr
                  ), f.command(
                    Q >= 0,
                    'invalid divisor for attribute "' + p + '"',
                    t.commandStr
                  )), f.optional(function() {
                    var ve = t.commandStr, Re = [
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
                        Re.indexOf(me) >= 0,
                        'unknown parameter "' + me + '" for attribute pointer "' + p + '" (valid parameters are ' + Re + ")",
                        ve
                      );
                    });
                  }), s.buffer = d, s.state = gr, s.size = D, s.normalized = $, s.type = I || d.dtype, s.offset = E, s.stride = L, s.divisor = Q;
                }
              }
              S[p] = Je(function(ve, Re) {
                var me = ve.attribCache;
                if (g in me)
                  return me[g];
                var be = {
                  isStream: !1
                };
                return Object.keys(s).forEach(function(Ae) {
                  be[Ae] = s[Ae];
                }), s.buffer && (be.buffer = ve.link(s.buffer), be.type = be.type || be.buffer + ".dtype"), me[g] = be, be;
              });
            }), Object.keys(w).forEach(function(p) {
              var m = w[p];
              function g(s, d) {
                var i = s.invoke(d, m), E = s.shared, L = s.constants, D = E.isBufferArgs, $ = E.buffer;
                f.optional(function() {
                  s.assert(
                    d,
                    i + "&&(typeof " + i + '==="object"||typeof ' + i + '==="function")&&(' + D + "(" + i + ")||" + $ + ".getBuffer(" + i + ")||" + $ + ".getBuffer(" + i + ".buffer)||" + D + "(" + i + '.buffer)||("constant" in ' + i + "&&(typeof " + i + '.constant==="number"||' + E.isArrayLike + "(" + i + ".constant))))",
                    'invalid dynamic attribute "' + p + '"'
                  );
                });
                var I = {
                  isStream: d.def(!1)
                }, Q = new A();
                Q.state = gr, Object.keys(Q).forEach(function(be) {
                  I[be] = d.def("" + Q[be]);
                });
                var ve = I.buffer, Re = I.type;
                d(
                  "if(",
                  D,
                  "(",
                  i,
                  ")){",
                  I.isStream,
                  "=true;",
                  ve,
                  "=",
                  $,
                  ".createStream(",
                  wr,
                  ",",
                  i,
                  ");",
                  Re,
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
                  Re,
                  "=",
                  ve,
                  ".dtype;",
                  '}else if("constant" in ',
                  i,
                  "){",
                  I.state,
                  "=",
                  sa,
                  ";",
                  "if(typeof " + i + '.constant === "number"){',
                  I[br[0]],
                  "=",
                  i,
                  ".constant;",
                  br.slice(1).map(function(be) {
                    return I[be];
                  }).join("="),
                  "=0;",
                  "}else{",
                  br.map(function(be, Ae) {
                    return I[be] + "=" + i + ".constant.length>" + Ae + "?" + i + ".constant[" + Ae + "]:0;";
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
                  Re,
                  '="type" in ',
                  i,
                  "?",
                  L.glTypes,
                  "[",
                  i,
                  ".type]:",
                  ve,
                  ".dtype;",
                  I.normalized,
                  "=!!",
                  i,
                  ".normalized;"
                );
                function me(be) {
                  d(I[be], "=", i, ".", be, "|0;");
                }
                return me("size"), me("offset"), me("stride"), me("divisor"), d("}}"), d.exit(
                  "if(",
                  I.isStream,
                  "){",
                  $,
                  ".destroyStream(",
                  ve,
                  ");",
                  "}"
                ), I;
              }
              S[p] = xt(m, g);
            }), S;
          }
          function it(o, t) {
            var h = o.static, w = o.dynamic;
            if (Pr in h) {
              var S = h[Pr];
              return S !== null && J.getVAO(S) === null && (S = J.createVAO(S)), Je(function(m) {
                return m.link(J.getVAO(S));
              });
            } else if (Pr in w) {
              var p = w[Pr];
              return xt(p, function(m, g) {
                var s = m.invoke(g, p);
                return g.def(m.shared.vao + ".getVAO(" + s + ")");
              });
            }
            return null;
          }
          function He(o) {
            var t = o.static, h = o.dynamic, w = {};
            return Object.keys(t).forEach(function(S) {
              var p = t[S];
              w[S] = Je(function(m, g) {
                return typeof p == "number" || typeof p == "boolean" ? "" + p : m.link(p);
              });
            }), Object.keys(h).forEach(function(S) {
              var p = h[S];
              w[S] = xt(p, function(m, g) {
                return m.invoke(g, p);
              });
            }), w;
          }
          function tt(o, t, h, w, S) {
            var p = o.static, m = o.dynamic;
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
                Ir,
                Pr
              ].concat(H);
              function be(Ae) {
                Object.keys(Ae).forEach(function(Xe) {
                  f.command(
                    me.indexOf(Xe) >= 0,
                    'unknown parameter "' + Xe + '"',
                    S.commandStr
                  );
                });
              }
              be(p), be(m);
            });
            var g = we(o, t), s = he(o), d = Fe(o, s, S), i = je(o, S), E = et(o, S), L = Oe(o, S, g);
            function D(me) {
              var be = d[me];
              be && (E[me] = be);
            }
            D(Ut), D(ie(mn));
            var $ = Object.keys(E).length > 0, I = {
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
            if (I.profile = Se(o), I.uniforms = ut(h, S), I.drawVAO = I.scopeVAO = it(o), !I.drawVAO && L.program && !g && l.angle_instanced_arrays) {
              var Q = !0, ve = L.program.attributes.map(function(me) {
                var be = t.static[me];
                return Q = Q && !!be, be;
              });
              if (Q && ve.length > 0) {
                var Re = J.getVAO(J.createVAO(ve));
                I.drawVAO = new _t(null, null, null, function(me, be) {
                  return me.link(Re);
                }), I.useVAO = !0;
              }
            }
            return g ? I.useVAO = !0 : I.attributes = Ie(t, S), I.context = He(w), I;
          }
          function ot(o, t, h) {
            var w = o.shared, S = w.context, p = o.scope();
            Object.keys(h).forEach(function(m) {
              t.save(S, "." + m);
              var g = h[m], s = g.append(o, t);
              Array.isArray(s) ? p(S, ".", m, "=[", s.join(), "];") : p(S, ".", m, "=", s, ";");
            }), t(p);
          }
          function st(o, t, h, w) {
            var S = o.shared, p = S.gl, m = S.framebuffer, g;
            ue && (g = t.def(S.extensions, ".webgl_draw_buffers"));
            var s = o.constants, d = s.drawBuffer, i = s.backBuffer, E;
            h ? E = h.append(o, t) : E = t.def(m, ".next"), w || t("if(", E, "!==", m, ".cur){"), t(
              "if(",
              E,
              "){",
              p,
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
              p,
              ".bindFramebuffer(",
              Ro,
              ",null);"
            ), ue && t(g, ".drawBuffersWEBGL(", i, ");"), t(
              "}",
              m,
              ".cur=",
              E,
              ";"
            ), w || t("}");
          }
          function ct(o, t, h) {
            var w = o.shared, S = w.gl, p = o.current, m = o.next, g = w.current, s = w.next, d = o.cond(g, ".dirty");
            H.forEach(function(i) {
              var E = ie(i);
              if (!(E in h.state)) {
                var L, D;
                if (E in m) {
                  L = m[E], D = p[E];
                  var $ = Et(j[E].length, function(Q) {
                    return d.def(L, "[", Q, "]");
                  });
                  d(o.cond($.map(function(Q, ve) {
                    return Q + "!==" + D + "[" + ve + "]";
                  }).join("||")).then(
                    S,
                    ".",
                    V[E],
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
                  var I = o.cond(L, "!==", g, ".", E);
                  d(I), E in ae ? I(
                    o.cond(L).then(S, ".enable(", ae[E], ");").else(S, ".disable(", ae[E], ");"),
                    g,
                    ".",
                    E,
                    "=",
                    L,
                    ";"
                  ) : I(
                    S,
                    ".",
                    V[E],
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
          function dt(o, t, h, w) {
            var S = o.shared, p = o.current, m = S.current, g = S.gl;
            Fo(Object.keys(h)).forEach(function(s) {
              var d = h[s];
              if (!(w && !w(d))) {
                var i = d.append(o, t);
                if (ae[s]) {
                  var E = ae[s];
                  Wt(d) ? i ? t(g, ".enable(", E, ");") : t(g, ".disable(", E, ");") : t(o.cond(i).then(g, ".enable(", E, ");").else(g, ".disable(", E, ");")), t(m, ".", s, "=", i, ";");
                } else if (qe(i)) {
                  var L = p[s];
                  t(
                    g,
                    ".",
                    V[s],
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
                    V[s],
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
          function Ke(o, t) {
            Z && (o.instancing = t.def(
              o.shared.extensions,
              ".angle_instanced_arrays"
            ));
          }
          function Le(o, t, h, w, S) {
            var p = o.shared, m = o.stats, g = p.current, s = p.timer, d = h.profile;
            function i() {
              return typeof performance > "u" ? "Date.now()" : "performance.now()";
            }
            var E, L;
            function D(me) {
              E = t.def(), me(E, "=", i(), ";"), typeof S == "string" ? me(m, ".count+=", S, ";") : me(m, ".count++;"), Y && (w ? (L = t.def(), me(L, "=", s, ".getNumPendingQueries();")) : me(s, ".beginQuery(", m, ");"));
            }
            function $(me) {
              me(m, ".cpuTime+=", i(), "-", E, ";"), Y && (w ? me(
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
            function I(me) {
              var be = t.def(g, ".profile");
              t(g, ".profile=", me, ";"), t.exit(g, ".profile=", be, ";");
            }
            var Q;
            if (d) {
              if (Wt(d)) {
                d.enable ? (D(t), $(t.exit), I("true")) : I("false");
                return;
              }
              Q = d.append(o, t), I(Q);
            } else
              Q = t.def(g, ".profile");
            var ve = o.block();
            D(ve), t("if(", Q, "){", ve, "}");
            var Re = o.block();
            $(Re), t.exit("if(", Q, "){", Re, "}");
          }
          function ht(o, t, h, w, S) {
            var p = o.shared;
            function m(s) {
              switch (s) {
                case yn:
                case gn:
                case wn:
                  return 2;
                case _n:
                case En:
                case Tn:
                  return 3;
                case bn:
                case xn:
                case An:
                  return 4;
                default:
                  return 1;
              }
            }
            function g(s, d, i) {
              var E = p.gl, L = t.def(s, ".location"), D = t.def(p.attributes, "[", L, "]"), $ = i.state, I = i.buffer, Q = [
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
              function Re() {
                t(
                  "if(!",
                  D,
                  ".buffer){",
                  E,
                  ".enableVertexAttribArray(",
                  L,
                  ");}"
                );
                var be = i.type, Ae;
                if (i.size ? Ae = t.def(i.size, "||", d) : Ae = d, t(
                  "if(",
                  D,
                  ".type!==",
                  be,
                  "||",
                  D,
                  ".size!==",
                  Ae,
                  "||",
                  ve.map(function(Ye) {
                    return D + "." + Ye + "!==" + i[Ye];
                  }).join("||"),
                  "){",
                  E,
                  ".bindBuffer(",
                  wr,
                  ",",
                  I,
                  ".buffer);",
                  E,
                  ".vertexAttribPointer(",
                  [
                    L,
                    Ae,
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
                  Ae,
                  ";",
                  ve.map(function(Ye) {
                    return D + "." + Ye + "=" + i[Ye] + ";";
                  }).join(""),
                  "}"
                ), Z) {
                  var Xe = i.divisor;
                  t(
                    "if(",
                    D,
                    ".divisor!==",
                    Xe,
                    "){",
                    o.instancing,
                    ".vertexAttribDivisorANGLE(",
                    [L, Xe],
                    ");",
                    D,
                    ".divisor=",
                    Xe,
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
                  br.map(function(be, Ae) {
                    return D + "." + be + "!==" + Q[Ae];
                  }).join("||"),
                  "){",
                  E,
                  ".vertexAttrib4f(",
                  L,
                  ",",
                  Q,
                  ");",
                  br.map(function(be, Ae) {
                    return D + "." + be + "=" + Q[Ae] + ";";
                  }).join(""),
                  "}"
                );
              }
              $ === gr ? Re() : $ === sa ? me() : (t("if(", $, "===", gr, "){"), Re(), t("}else{"), me(), t("}"));
            }
            w.forEach(function(s) {
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
                }), E = {}, Object.keys(new A()).forEach(function(D) {
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
          function Ve(o, t, h, w, S) {
            for (var p = o.shared, m = p.gl, g, s = 0; s < w.length; ++s) {
              var d = w[s], i = d.name, E = d.info.type, L = h.uniforms[i], D = o.link(d), $ = D + ".location", I;
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
                        qe(Q),
                        "invalid matrix for uniform " + i,
                        o.commandStr
                      ), f.command(
                        E === $r && Q.length === 4 || E === Ur && Q.length === 9 || E === zr && Q.length === 16,
                        "invalid length for matrix uniform " + i,
                        o.commandStr
                      );
                    });
                    var Re = o.global.def("new Float32Array([" + Array.prototype.slice.call(Q) + "])"), me = 2;
                    E === Ur ? me = 3 : E === zr && (me = 4), t(
                      m,
                      ".uniformMatrix",
                      me,
                      "fv(",
                      $,
                      ",false,",
                      Re,
                      ");"
                    );
                  } else {
                    switch (E) {
                      case wa:
                        f.commandType(Q, "number", "uniform " + i, o.commandStr), g = "1f";
                        break;
                      case yn:
                        f.command(
                          qe(Q) && Q.length === 2,
                          "uniform " + i,
                          o.commandStr
                        ), g = "2f";
                        break;
                      case _n:
                        f.command(
                          qe(Q) && Q.length === 3,
                          "uniform " + i,
                          o.commandStr
                        ), g = "3f";
                        break;
                      case bn:
                        f.command(
                          qe(Q) && Q.length === 4,
                          "uniform " + i,
                          o.commandStr
                        ), g = "4f";
                        break;
                      case Aa:
                        f.commandType(Q, "boolean", "uniform " + i, o.commandStr), g = "1i";
                        break;
                      case Ta:
                        f.commandType(Q, "number", "uniform " + i, o.commandStr), g = "1i";
                        break;
                      case wn:
                        f.command(
                          qe(Q) && Q.length === 2,
                          "uniform " + i,
                          o.commandStr
                        ), g = "2i";
                        break;
                      case gn:
                        f.command(
                          qe(Q) && Q.length === 2,
                          "uniform " + i,
                          o.commandStr
                        ), g = "2i";
                        break;
                      case Tn:
                        f.command(
                          qe(Q) && Q.length === 3,
                          "uniform " + i,
                          o.commandStr
                        ), g = "3i";
                        break;
                      case En:
                        f.command(
                          qe(Q) && Q.length === 3,
                          "uniform " + i,
                          o.commandStr
                        ), g = "3i";
                        break;
                      case An:
                        f.command(
                          qe(Q) && Q.length === 4,
                          "uniform " + i,
                          o.commandStr
                        ), g = "4i";
                        break;
                      case xn:
                        f.command(
                          qe(Q) && Q.length === 4,
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
                      qe(Q) ? Array.prototype.slice.call(Q) : Q,
                      ");"
                    );
                  }
                  continue;
                } else
                  I = L.append(o, t);
              } else {
                if (!S(Go))
                  continue;
                I = t.def(p.uniforms, "[", r.id(i), "]");
              }
              E === jr ? (f(!Array.isArray(I), "must specify a scalar prop for textures"), t(
                "if(",
                I,
                "&&",
                I,
                '._reglType==="framebuffer"){',
                I,
                "=",
                I,
                ".color[0];",
                "}"
              )) : E === Xr && (f(!Array.isArray(I), "must specify a scalar prop for cube maps"), t(
                "if(",
                I,
                "&&",
                I,
                '._reglType==="framebufferCube"){',
                I,
                "=",
                I,
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
                  f(!Array.isArray(I), "must not specify an array type for uniform"), bt(
                    "typeof " + I + '==="' + kt + '"',
                    "invalid type, expected " + kt
                  );
                }
                function Ct(kt, Po) {
                  Array.isArray(I) ? f(I.length === kt, "must have length " + kt) : bt(
                    p.isArrayLike + "(" + I + ")&&" + I + ".length===" + kt,
                    "invalid vector, should have length " + kt,
                    o.commandStr
                  );
                }
                function Do(kt) {
                  f(!Array.isArray(I), "must not specify a value type"), bt(
                    "typeof " + I + '==="function"&&' + I + '._reglType==="texture' + (kt === xo ? "2d" : "Cube") + '"',
                    "invalid texture type",
                    o.commandStr
                  );
                }
                switch (E) {
                  case Ta:
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
                  case Aa:
                    Ra("boolean");
                    break;
                  case wn:
                    Ct(2);
                    break;
                  case Tn:
                    Ct(3);
                    break;
                  case An:
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
                  var Ae = t.def(I, "._texture");
                  t(m, ".uniform1i(", $, ",", Ae, ".bind());"), t.exit(Ae, ".unbind();");
                  continue;
                case Ta:
                case Aa:
                  g = "1i";
                  break;
                case gn:
                case wn:
                  g = "2i", be = 2;
                  break;
                case En:
                case Tn:
                  g = "3i", be = 3;
                  break;
                case xn:
                case An:
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
                var Xe = Math.pow(E - $r + 2, 2), Ye = o.global.def("new Float32Array(", Xe, ")");
                Array.isArray(I) ? t(
                  "false,(",
                  Et(Xe, function(bt) {
                    return Ye + "[" + bt + "]=" + I[bt];
                  }),
                  ",",
                  Ye,
                  ")"
                ) : t(
                  "false,(Array.isArray(",
                  I,
                  ")||",
                  I,
                  " instanceof Float32Array)?",
                  I,
                  ":(",
                  Et(Xe, function(bt) {
                    return Ye + "[" + bt + "]=" + I + "[" + bt + "]";
                  }),
                  ",",
                  Ye,
                  ")"
                );
              } else be > 1 ? t(Et(be, function(bt) {
                return Array.isArray(I) ? I[bt] : I + "[" + bt + "]";
              })) : (f(!Array.isArray(I), "uniform value must not be an array"), t(I));
              t(");");
            }
          }
          function _e(o, t, h, w) {
            var S = o.shared, p = S.gl, m = S.draw, g = w.draw;
            function s() {
              var Ae = g.elements, Xe, Ye = t;
              return Ae ? ((Ae.contextDep && w.contextDynamic || Ae.propDep) && (Ye = h), Xe = Ae.append(o, Ye)) : Xe = Ye.def(m, ".", rr), Xe && Ye(
                "if(" + Xe + ")" + p + ".bindBuffer(" + Xu + "," + Xe + ".buffer.buffer);"
              ), Xe;
            }
            function d() {
              var Ae = g.count, Xe, Ye = t;
              return Ae ? ((Ae.contextDep && w.contextDynamic || Ae.propDep) && (Ye = h), Xe = Ae.append(o, Ye), f.optional(function() {
                Ae.MISSING && o.assert(t, "false", "missing vertex count"), Ae.DYNAMIC && o.assert(Ye, Xe + ">=0", "missing vertex count");
              })) : (Xe = Ye.def(m, ".", ar), f.optional(function() {
                o.assert(Ye, Xe + ">=0", "missing vertex count");
              })), Xe;
            }
            var i = s();
            function E(Ae) {
              var Xe = g[Ae];
              return Xe ? Xe.contextDep && w.contextDynamic || Xe.propDep ? Xe.append(o, h) : Xe.append(o, t) : t.def(m, ".", Ae);
            }
            var L = E(nr), D = E(pn), $ = d();
            if (typeof $ == "number") {
              if ($ === 0)
                return;
            } else
              h("if(", $, "){"), h.exit("}");
            var I, Q;
            Z && (I = E(vn), Q = o.instancing);
            var ve = i + ".type", Re = g.elements && Wt(g.elements);
            function me() {
              function Ae() {
                h(Q, ".drawElementsInstancedANGLE(", [
                  L,
                  $,
                  ve,
                  D + "<<((" + ve + "-" + eo + ")>>1)",
                  I
                ], ");");
              }
              function Xe() {
                h(
                  Q,
                  ".drawArraysInstancedANGLE(",
                  [L, D, $, I],
                  ");"
                );
              }
              i ? Re ? Ae() : (h("if(", i, "){"), Ae(), h("}else{"), Xe(), h("}")) : Xe();
            }
            function be() {
              function Ae() {
                h(p + ".drawElements(" + [
                  L,
                  $,
                  ve,
                  D + "<<((" + ve + "-" + eo + ")>>1)"
                ] + ");");
              }
              function Xe() {
                h(p + ".drawArrays(" + [L, D, $] + ");");
              }
              i ? Re ? Ae() : (h("if(", i, "){"), Ae(), h("}else{"), Xe(), h("}")) : Xe();
            }
            Z && (typeof I != "number" || I >= 0) ? typeof I == "string" ? (h("if(", I, ">0){"), me(), h("}else if(", I, "<0){"), be(), h("}")) : me() : be();
          }
          function Me(o, t, h, w, S) {
            var p = ge(), m = p.proc("body", S);
            return f.optional(function() {
              p.commandStr = t.commandStr, p.command = p.link(t.commandStr);
            }), Z && (p.instancing = m.def(
              p.shared.extensions,
              ".angle_instanced_arrays"
            )), o(p, m, h, w), p.compile().body;
          }
          function $e(o, t, h, w) {
            Ke(o, t), h.useVAO ? h.drawVAO ? t(o.shared.vao, ".setVAO(", h.drawVAO.append(o, t), ");") : t(o.shared.vao, ".setVAO(", o.shared.vao, ".targetVAO);") : (t(o.shared.vao, ".setVAO(null);"), ht(o, t, h, w.attributes, function() {
              return !0;
            })), Ve(o, t, h, w.uniforms, function() {
              return !0;
            }), _e(o, t, t, h);
          }
          function Qe(o, t) {
            var h = o.proc("draw", 1);
            Ke(o, h), ot(o, h, t.context), st(o, h, t.framebuffer), ct(o, h, t), dt(o, h, t.state), Le(o, h, t, !1, !0);
            var w = t.shader.progVar.append(o, h);
            if (h(o.shared.gl, ".useProgram(", w, ".program);"), t.shader.program)
              $e(o, h, t, t.shader.program);
            else {
              h(o.shared.vao, ".setVAO(null);");
              var S = o.global.def("{}"), p = h.def(w, ".id"), m = h.def(S, "[", p, "]");
              h(
                o.cond(m).then(m, ".call(this,a0);").else(
                  m,
                  "=",
                  S,
                  "[",
                  p,
                  "]=",
                  o.link(function(g) {
                    return Me($e, o, t, g, 1);
                  }),
                  "(",
                  w,
                  ");",
                  m,
                  ".call(this,a0);"
                )
              );
            }
            Object.keys(t.state).length > 0 && h(o.shared.current, ".dirty=true;");
          }
          function Dt(o, t, h, w) {
            o.batchId = "a1", Ke(o, t);
            function S() {
              return !0;
            }
            ht(o, t, h, w.attributes, S), Ve(o, t, h, w.uniforms, S), _e(o, t, t, h);
          }
          function or(o, t, h, w) {
            Ke(o, t);
            var S = h.contextDep, p = t.def(), m = "a0", g = "a1", s = t.def();
            o.shared.props = s, o.batchId = p;
            var d = o.scope(), i = o.scope();
            t(
              d.entry,
              "for(",
              p,
              "=0;",
              p,
              "<",
              g,
              ";++",
              p,
              "){",
              s,
              "=",
              m,
              "[",
              p,
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
            if (h.needsContext && ot(o, i, h.context), h.needsFramebuffer && st(o, i, h.framebuffer), dt(o, i, h.state, E), h.profile && E(h.profile) && Le(o, i, h, !1, !0), w)
              h.useVAO ? h.drawVAO ? E(h.drawVAO) ? i(o.shared.vao, ".setVAO(", h.drawVAO.append(o, i), ");") : d(o.shared.vao, ".setVAO(", h.drawVAO.append(o, d), ");") : d(o.shared.vao, ".setVAO(", o.shared.vao, ".targetVAO);") : (d(o.shared.vao, ".setVAO(null);"), ht(o, d, h, w.attributes, L), ht(o, i, h, w.attributes, E)), Ve(o, d, h, w.uniforms, L), Ve(o, i, h, w.uniforms, E), _e(o, d, i, h);
            else {
              var D = o.global.def("{}"), $ = h.shader.progVar.append(o, i), I = i.def($, ".id"), Q = i.def(D, "[", I, "]");
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
                I,
                "]=",
                o.link(function(ve) {
                  return Me(
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
                p,
                "],",
                p,
                ");"
              );
            }
          }
          function u(o, t) {
            var h = o.proc("batch", 2);
            o.batchId = "0", Ke(o, h);
            var w = !1, S = !0;
            Object.keys(t.context).forEach(function(D) {
              w = w || t.context[D].propDep;
            }), w || (ot(o, h, t.context), S = !1);
            var p = t.framebuffer, m = !1;
            p ? (p.propDep ? w = m = !0 : p.contextDep && w && (m = !0), m || st(o, h, p)) : st(o, h, null), t.state.viewport && t.state.viewport.propDep && (w = !0);
            function g(D) {
              return D.contextDep && w || D.propDep;
            }
            ct(o, h, t), dt(o, h, t.state, function(D) {
              return !g(D);
            }), (!t.profile || !g(t.profile)) && Le(o, h, t, !1, "a1"), t.contextDep = w, t.needsContext = S, t.needsFramebuffer = m;
            var s = t.shader.progVar;
            if (s.contextDep && w || s.propDep)
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
                      return Me(or, o, t, D, 2);
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
            var w = o.shared, S = w.current;
            ot(o, h, t.context), t.framebuffer && t.framebuffer.append(o, h), Fo(Object.keys(t.state)).forEach(function(m) {
              var g = t.state[m], s = g.append(o, h);
              qe(s) ? s.forEach(function(d, i) {
                h.set(o.next[m], "[" + i + "]", d);
              }) : h.set(w.next, "." + m, s);
            }), Le(o, h, t, !0, !0), [rr, pn, ar, vn, nr].forEach(
              function(m) {
                var g = t.draw[m];
                g && h.set(w.draw, "." + m, "" + g.append(o, h));
              }
            ), Object.keys(t.uniforms).forEach(function(m) {
              var g = t.uniforms[m].append(o, h);
              Array.isArray(g) && (g = "[" + g.join() + "]"), h.set(
                w.uniforms,
                "[" + r.id(m) + "]",
                g
              );
            }), Object.keys(t.attributes).forEach(function(m) {
              var g = t.attributes[m].append(o, h), s = o.scopeAttrib(m);
              Object.keys(new A()).forEach(function(d) {
                h.set(s, "." + d, g[d]);
              });
            }), t.scopeVAO && h.set(w.vao, ".targetVAO", t.scopeVAO.append(o, h));
            function p(m) {
              var g = t.shader[m];
              g && h.set(w.shader, "." + m, g.append(o, h));
            }
            p(Nr), p(Dr), Object.keys(t.state).length > 0 && (h(S, ".dirty=true;"), h.exit(S, ".dirty=true;")), h("a1(", o.shared.context, ",a0,", o.batchId, ");");
          }
          function O(o) {
            if (!(typeof o != "object" || qe(o))) {
              for (var t = Object.keys(o), h = 0; h < t.length; ++h)
                if (St.isDynamic(o[t[h]]))
                  return !0;
              return !1;
            }
          }
          function de(o, t, h) {
            var w = t.static[h];
            if (!w || !O(w))
              return;
            var S = o.global, p = Object.keys(w), m = !1, g = !1, s = !1, d = o.global.def("{}");
            p.forEach(function(E) {
              var L = w[E];
              if (St.isDynamic(L)) {
                typeof L == "function" && (L = w[E] = St.unbox(L));
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
              p.forEach(function(D) {
                var $ = w[D];
                if (St.isDynamic($)) {
                  var I = E.invoke(L, $);
                  L(d, ".", D, "=", I, ";");
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
          function Ge(o, t, h, w, S) {
            var p = ge();
            p.stats = p.link(S), Object.keys(t.static).forEach(function(g) {
              de(p, t, g);
            }), ju.forEach(function(g) {
              de(p, o, g);
            });
            var m = tt(o, t, h, w, p);
            return Qe(p, m), M(p, m), u(p, m), y(p.compile(), {
              destroy: function() {
                m.shader.program.destroy();
              }
            });
          }
          return {
            next: le,
            current: j,
            procs: (function() {
              var o = ge(), t = o.proc("poll"), h = o.proc("refresh"), w = o.block();
              t(w), h(w);
              var S = o.shared, p = S.gl, m = S.next, g = S.current;
              w(g, ".dirty=false;"), st(o, t), st(o, h, null, !0);
              var s;
              Z && (s = o.link(Z)), l.oes_vertex_array_object && h(o.link(l.oes_vertex_array_object), ".bindVertexArrayOES(null);");
              for (var d = 0; d < G.maxAttributes; ++d) {
                var i = h.def(S.attributes, "[", d, "]"), E = o.cond(i, ".buffer");
                E.then(
                  p,
                  ".enableVertexAttribArray(",
                  d,
                  ");",
                  p,
                  ".bindBuffer(",
                  wr,
                  ",",
                  i,
                  ".buffer.buffer);",
                  p,
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
                  p,
                  ".disableVertexAttribArray(",
                  d,
                  ");",
                  p,
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
              ), Object.keys(ae).forEach(function(L) {
                var D = ae[L], $ = w.def(m, ".", L), I = o.block();
                I(
                  "if(",
                  $,
                  "){",
                  p,
                  ".enable(",
                  D,
                  ")}else{",
                  p,
                  ".disable(",
                  D,
                  ")}",
                  g,
                  ".",
                  L,
                  "=",
                  $,
                  ";"
                ), h(I), t(
                  "if(",
                  $,
                  "!==",
                  g,
                  ".",
                  L,
                  "){",
                  I,
                  "}"
                );
              }), Object.keys(V).forEach(function(L) {
                var D = V[L], $ = j[L], I, Q, ve = o.block();
                if (ve(p, ".", D, "("), qe($)) {
                  var Re = $.length;
                  I = o.global.def(m, ".", L), Q = o.global.def(g, ".", L), ve(
                    Et(Re, function(me) {
                      return I + "[" + me + "]";
                    }),
                    ");",
                    Et(Re, function(me) {
                      return Q + "[" + me + "]=" + I + "[" + me + "];";
                    }).join("")
                  ), t(
                    "if(",
                    Et(Re, function(me) {
                      return I + "[" + me + "]!==" + Q + "[" + me + "]";
                    }).join("||"),
                    "){",
                    ve,
                    "}"
                  );
                } else
                  I = w.def(m, ".", L), Q = w.def(g, ".", L), ve(
                    I,
                    ");",
                    g,
                    ".",
                    L,
                    "=",
                    I,
                    ";"
                  ), t(
                    "if(",
                    I,
                    "!==",
                    Q,
                    "){",
                    ve,
                    "}"
                  );
                h(ve);
              }), o.compile();
            })(),
            compile: Ge
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
          function re(Z) {
            J.push(Z);
          }
          var oe = [];
          function Y(Z, ue, j) {
            var le = K();
            le.startQueryIndex = Z, le.endQueryIndex = ue, le.sum = 0, le.stats = j, oe.push(le);
          }
          var ne = [], A = [];
          function B() {
            var Z, ue, j = F.length;
            if (j !== 0) {
              A.length = Math.max(A.length, j + 1), ne.length = Math.max(ne.length, j + 1), ne[0] = 0, A[0] = 0;
              var le = 0;
              for (Z = 0, ue = 0; ue < F.length; ++ue) {
                var H = F[ue];
                r.ext_disjoint_timer_query.getQueryObjectEXT(H, lc) ? (le += r.ext_disjoint_timer_query.getQueryObjectEXT(H, cc), P(H)) : F[Z++] = H, ne[ue + 1] = le, A[ue + 1] = Z;
              }
              for (F.length = Z, Z = 0, ue = 0; ue < oe.length; ++ue) {
                var ae = oe[ue], V = ae.startQueryIndex, ie = ae.endQueryIndex;
                ae.sum += ne[ie] - ne[V];
                var ye = A[V], Ee = A[ie];
                Ee === ye ? (ae.stats.gpuTime += ae.sum / 1e6, re(ae)) : (ae.startQueryIndex = ye, ae.endQueryIndex = Ee, oe[Z++] = ae);
              }
              oe.length = Z;
            }
          }
          return {
            beginQuery: k,
            endQuery: W,
            pushScopeStats: Y,
            update: B,
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
        }, hc = 16384, mc = 256, pc = 1024, vc = 34962, ko = "webglcontextlost", Bo = "webglcontextrestored", Io = 1, yc = 2, _c = 3;
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
          var k = cs(), W = uc(), q = F.extensions, J = dc(l, q), K = Xa(), re = l.drawingBufferWidth, oe = l.drawingBufferHeight, Y = {
            tick: 0,
            time: 0,
            viewportWidth: re,
            viewportHeight: oe,
            framebufferWidth: re,
            framebufferHeight: oe,
            drawingBufferWidth: re,
            drawingBufferHeight: oe,
            pixelRatio: r.pixelRatio
          }, ne = {}, A = {
            elements: null,
            primitive: 4,
            // GL_TRIANGLES
            count: -1,
            offset: 0,
            instances: -1
          }, B = nf(l, q), Z = gf(
            l,
            W,
            r,
            j
          ), ue = Gu(
            l,
            q,
            B,
            W,
            Z
          );
          function j(_e) {
            return ue.destroyBuffer(_e);
          }
          var le = Gf(l, q, Z, W), H = Iu(l, k, W, r), ae = uu(
            l,
            q,
            B,
            function() {
              ye.procs.poll();
            },
            Y,
            W,
            r
          ), V = cu(l, q, B, W, r), ie = Cu(
            l,
            q,
            B,
            ae,
            V,
            W
          ), ye = fc(
            l,
            k,
            q,
            B,
            Z,
            le,
            ae,
            ie,
            ne,
            ue,
            H,
            A,
            Y,
            J,
            r
          ), Ee = Pu(
            l,
            ie,
            ye.procs.poll,
            Y,
            G,
            q,
            B
          ), se = ye.next, ee = l.canvas, U = [], ge = [], Se = [], he = [r.onDestroy], Fe = null;
          function we() {
            if (U.length === 0) {
              J && J.update(), Fe = null;
              return;
            }
            Fe = Mn.next(we), dt();
            for (var _e = U.length - 1; _e >= 0; --_e) {
              var Me = U[_e];
              Me && Me(Y, null, 0);
            }
            l.flush(), J && J.update();
          }
          function Oe() {
            !Fe && U.length > 0 && (Fe = Mn.next(we));
          }
          function je() {
            Fe && (Mn.cancel(we), Fe = null);
          }
          function et(_e) {
            _e.preventDefault(), P = !0, je(), ge.forEach(function(Me) {
              Me();
            });
          }
          function ut(_e) {
            l.getError(), P = !1, F.restore(), H.restore(), Z.restore(), ae.restore(), V.restore(), ie.restore(), ue.restore(), J && J.restore(), ye.procs.refresh(), Oe(), Se.forEach(function(Me) {
              Me();
            });
          }
          ee && (ee.addEventListener(ko, et, !1), ee.addEventListener(Bo, ut, !1));
          function Ie() {
            U.length = 0, je(), ee && (ee.removeEventListener(ko, et), ee.removeEventListener(Bo, ut)), H.clear(), ie.clear(), V.clear(), ae.clear(), le.clear(), Z.clear(), ue.clear(), J && J.clear(), he.forEach(function(_e) {
              _e();
            });
          }
          function it(_e) {
            f(!!_e, "invalid args to regl({...})"), f.type(_e, "object", "invalid args to regl({...})");
            function Me(S) {
              var p = y({}, S);
              delete p.uniforms, delete p.attributes, delete p.context, delete p.vao, "stencil" in p && p.stencil.op && (p.stencil.opBack = p.stencil.opFront = p.stencil.op, delete p.stencil.op);
              function m(g) {
                if (g in p) {
                  var s = p[g];
                  delete p[g], Object.keys(s).forEach(function(d) {
                    p[g + "." + d] = s[d];
                  });
                }
              }
              return m("blend"), m("depth"), m("cull"), m("stencil"), m("polygonOffset"), m("scissor"), m("sample"), "vao" in S && (p.vao = S.vao), p;
            }
            function $e(S, p) {
              var m = {}, g = {};
              return Object.keys(S).forEach(function(s) {
                var d = S[s];
                if (St.isDynamic(d)) {
                  g[s] = St.unbox(d, s);
                  return;
                } else if (p && Array.isArray(d)) {
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
            var Qe = $e(_e.context || {}, !0), Dt = $e(_e.uniforms || {}, !0), or = $e(_e.attributes || {}, !1), u = $e(Me(_e), !1), M = {
              gpuTime: 0,
              cpuTime: 0,
              count: 0
            }, O = ye.compile(u, or, Dt, Qe, M), de = O.draw, Ge = O.batch, o = O.scope, t = [];
            function h(S) {
              for (; t.length < S; )
                t.push(null);
              return t;
            }
            function w(S, p) {
              var m;
              if (P && f.raise("context lost"), typeof S == "function")
                return o.call(this, null, S, 0);
              if (typeof p == "function")
                if (typeof S == "number")
                  for (m = 0; m < S; ++m)
                    o.call(this, null, p, m);
                else if (Array.isArray(S))
                  for (m = 0; m < S.length; ++m)
                    o.call(this, S[m], p, m);
                else
                  return o.call(this, S, p, 0);
              else if (typeof S == "number") {
                if (S > 0)
                  return Ge.call(this, h(S | 0), S | 0);
              } else if (Array.isArray(S)) {
                if (S.length)
                  return Ge.call(this, S, S.length);
              } else
                return de.call(this, S);
            }
            return y(w, {
              stats: M,
              destroy: function() {
                O.destroy();
              }
            });
          }
          var He = ie.setFBO = it({
            framebuffer: St.define.call(null, Io, "framebuffer")
          });
          function tt(_e, Me) {
            var $e = 0;
            ye.procs.poll();
            var Qe = Me.color;
            Qe && (l.clearColor(+Qe[0] || 0, +Qe[1] || 0, +Qe[2] || 0, +Qe[3] || 0), $e |= hc), "depth" in Me && (l.clearDepth(+Me.depth), $e |= mc), "stencil" in Me && (l.clearStencil(Me.stencil | 0), $e |= pc), f(!!$e, "called regl.clear with no buffer specified"), l.clear($e);
          }
          function ot(_e) {
            if (f(
              typeof _e == "object" && _e,
              "regl.clear() takes an object as input"
            ), "framebuffer" in _e)
              if (_e.framebuffer && _e.framebuffer_reglType === "framebufferCube")
                for (var Me = 0; Me < 6; ++Me)
                  He(y({
                    framebuffer: _e.framebuffer.faces[Me]
                  }, _e), tt);
              else
                He(_e, tt);
            else
              tt(null, _e);
          }
          function st(_e) {
            f.type(_e, "function", "regl.frame() callback must be a function"), U.push(_e);
            function Me() {
              var $e = No(U, _e);
              f($e >= 0, "cannot cancel a frame twice");
              function Qe() {
                var Dt = No(U, Qe);
                U[Dt] = U[U.length - 1], U.length -= 1, U.length <= 0 && je();
              }
              U[$e] = Qe;
            }
            return Oe(), {
              cancel: Me
            };
          }
          function ct() {
            var _e = se.viewport, Me = se.scissor_box;
            _e[0] = _e[1] = Me[0] = Me[1] = 0, Y.viewportWidth = Y.framebufferWidth = Y.drawingBufferWidth = _e[2] = Me[2] = l.drawingBufferWidth, Y.viewportHeight = Y.framebufferHeight = Y.drawingBufferHeight = _e[3] = Me[3] = l.drawingBufferHeight;
          }
          function dt() {
            Y.tick += 1, Y.time = Le(), ct(), ye.procs.poll();
          }
          function Ke() {
            ae.refresh(), ct(), ye.procs.refresh(), J && J.update();
          }
          function Le() {
            return (Xa() - K) / 1e3;
          }
          Ke();
          function ht(_e, Me) {
            f.type(Me, "function", "listener callback must be a function");
            var $e;
            switch (_e) {
              case "frame":
                return st(Me);
              case "lost":
                $e = ge;
                break;
              case "restore":
                $e = Se;
                break;
              case "destroy":
                $e = he;
                break;
              default:
                f.raise("invalid event, must be one of frame,lost,restore,destroy");
            }
            return $e.push(Me), {
              cancel: function() {
                for (var Qe = 0; Qe < $e.length; ++Qe)
                  if ($e[Qe] === Me) {
                    $e[Qe] = $e[$e.length - 1], $e.pop();
                    return;
                  }
              }
            };
          }
          var Ve = y(it, {
            // Clear current FBO
            clear: ot,
            // Short cuts for dynamic variables
            prop: St.define.bind(null, Io),
            context: St.define.bind(null, yc),
            this: St.define.bind(null, _c),
            // executes an empty draw command
            draw: it({}),
            // Resources
            buffer: function(_e) {
              return Z.create(_e, vc, !1, !1);
            },
            elements: function(_e) {
              return le.create(_e, !1);
            },
            texture: ae.create2D,
            cube: ae.createCube,
            renderbuffer: V.create,
            framebuffer: ie.create,
            framebufferCube: ie.createCube,
            vao: ue.createVAO,
            // Expose context attributes
            attributes: G,
            // Frame rendering
            frame: st,
            on: ht,
            // System limits
            limits: B,
            hasExtension: function(_e) {
              return B.extensions.indexOf(_e.toLowerCase()) >= 0;
            },
            // Read pixels
            read: Ee,
            // Destroy regl and all associated resources
            destroy: Ie,
            // Direct GL state manipulation
            _gl: l,
            _refresh: Ke,
            poll: function() {
              dt(), J && J.update();
            },
            // Current time
            now: Le,
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
  const Qo = /* @__PURE__ */ Ia(ol), sl = Dc();
  class fl {
    constructor({
      pb: n = null,
      width: v = 1280,
      height: y = 720,
      numSources: T = 4,
      numOutputs: b = 4,
      makeGlobal: z = !0,
      autoLoop: N = !0,
      detectAudio: fe = !0,
      enableStreamCapture: ce = !0,
      canvas: ke,
      precision: Ne,
      extendTransforms: Ue = {}
      // add your own functions on init
    } = {}) {
      if (Zo.init(), this.pb = n, this.width = v, this.height = y, this.renderAll = !1, this.detectAudio = fe, this._initCanvas(ke), this.synth = {
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
        update: (We) => {
        },
        // user defined update function
        afterUpdate: (We) => {
        },
        // user defined function run after update
        hush: this.hush.bind(this),
        tick: this.tick.bind(this)
      }, z && (window.loadScript = this.loadScript), this.timeSinceLastUpdate = 0, this._time = 0, Ne && ["lowp", "mediump", "highp"].includes(Ne.toLowerCase()))
        this.precision = Ne.toLowerCase();
      else {
        let We = (/iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
        this.precision = We ? "highp" : "mediump";
      }
      if (this.extendTransforms = Ue, this.saveFrame = !1, this.captureStream = null, this.generator = void 0, this.numOutputs = Math.max(1, b), this._initRegl(), this._initOutputs(this.numOutputs), this._initSources(T), this._generateGlslTransforms(), this.synth.screencap = () => {
        this.saveFrame = !0;
      }, ce)
        try {
          this.captureStream = this.canvas.captureStream(25), this.synth.vidRecorder = new Xc(this.captureStream);
        } catch (We) {
          console.warn(`[hydra-synth warning]
new MediaSource() is not currently supported on iOS.`), console.error(We);
        }
      fe && this._initAudio(), N && Cc(this.tick.bind(this)).start(), this.sandbox = new Wc(this.synth, z, ["speed", "update", "afterUpdate", "bpm", "fps"]);
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
      return new Promise((y, T) => {
        var b = document.createElement("script");
        b.onload = function() {
          console.log(`loaded script ${n}`), y();
        }, b.onerror = (z) => {
          console.log(`error loading script ${n}`, "log-error"), y();
        }, b.src = n, document.head.appendChild(b);
      });
    }
    setResolution(n, v) {
      this.canvas.width = n, this.canvas.height = v, this.width = n, this.height = v, this.sandbox.set("width", n), this.sandbox.set("height", v), console.log(this.width), this.o.forEach((y) => {
        y.resize(n, v);
      }), this.s.forEach((y) => {
        y.resize(n, v);
      }), this.regl._refresh(), console.log(this.canvas.width);
    }
    canvasToImage(n) {
      const v = document.createElement("a");
      v.style.display = "none";
      let y = /* @__PURE__ */ new Date();
      v.download = `hydra-${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}-${y.getHours()}.${y.getMinutes()}.${y.getSeconds()}.png`, document.body.appendChild(v);
      var T = this;
      this.canvas.toBlob((b) => {
        T.imageCallback ? (T.imageCallback(b), delete T.imageCallback) : (v.href = URL.createObjectURL(b), console.log(v.href), v.click());
      }, "image/png"), setTimeout(() => {
        document.body.removeChild(v), window.URL.revokeObjectURL(v.href);
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
      const v = Math.ceil(Math.sqrt(this.numOutputs)), y = Math.ceil(this.numOutputs / v), T = {};
      for (let z = 0; z < this.numOutputs; z++)
        T[`tex[${z}]`] = this.regl.prop(`tex${z}`);
      let b = "";
      for (let z = 0; z < this.numOutputs; z++) {
        const N = `if(index==${z}){ fragColor = texture(tex[${z}], st); }`;
        z === 0 ? b += N : b += " else " + N;
      }
      b += " else { fragColor = vec4(0.0); }", this.renderAll = this.regl({
        frag: `#version 300 es
      precision ${this.precision} float;
      in vec2 uv;
      out vec4 fragColor;
      uniform sampler2D tex[${this.numOutputs}];

      void main () {
        vec2 st = vec2(1.0 - uv.x, uv.y);
        st *= vec2(${v}.0, ${y}.0);
        vec2 gridPos = floor(st);
        
        // Column-major indexing (y + x * rows) to preserve visual layout of previous 2x2 grid (0=TL, 1=BL, 2=TR, 3=BR)
        // Note: 'rows' is the height of the column in cells (which is effectively 'rows')
        int index = int(gridPos.y) + int(gridPos.x) * ${y};
        
        st = fract(st);
        
        ${b}
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
        uniforms: T,
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
      const v = this;
      this.o = Array(n).fill().map((y, T) => {
        var b = new Ec({
          regl: this.regl,
          width: this.width,
          height: this.height,
          precision: this.precision,
          label: `o${T}`
        });
        return b.id = T, v.synth["o" + T] = b, b;
      }), this.output = this.o[0];
    }
    _initSources(n) {
      this.s = [];
      for (var v = 0; v < n; v++)
        this.createSource(v);
    }
    createSource(n) {
      let v = new Mc({ regl: this.regl, pb: this.pb, width: this.width, height: this.height, label: `s${n}` });
      return this.synth["s" + this.s.length] = v, this.s.push(v), v;
    }
    _generateGlslTransforms() {
      var n = this;
      this.generator = new rl({
        defaultOutput: this.o[0],
        defaultUniforms: this.o[0].uniforms,
        extendTransforms: this.extendTransforms,
        changeListener: ({ type: v, method: y, synth: T }) => {
          v === "add" && (n.synth[y] = T.generators[y], n.sandbox && n.sandbox.add(y));
        }
      }), this.synth.setFunction = this.generator.setFunction.bind(this.generator);
    }
    _render(n) {
      n ? (this.output = n, this.isRenderingAll = !1) : this.isRenderingAll = !0;
    }
    // dt in ms
    tick(n, v) {
      try {
        if (this.sandbox.tick(), this.detectAudio === !0 && this.synth.a.tick(), this.sandbox.set("time", this.synth.time += n * 1e-3 * this.synth.speed), this.timeSinceLastUpdate += n, !this.synth.fps || this.timeSinceLastUpdate >= 1e3 / this.synth.fps) {
          if (this.synth.stats.fps = Math.ceil(1e3 / this.timeSinceLastUpdate), this.synth.update)
            try {
              this.synth.update(this.timeSinceLastUpdate);
            } catch (T) {
              console.log(T);
            }
          for (let T = 0; T < this.s.length; T++)
            this.s[T].tick(this.synth.time);
          const y = this.synth.time;
          for (let T = 0; T < this.o.length; T++)
            this.o[T].tick({
              time: y,
              mouse: this.synth.mouse,
              bpm: this.synth.bpm,
              resolution: [this.canvas.width, this.canvas.height]
            });
          if (this.isRenderingAll) {
            const T = {
              resolution: [this.canvas.width, this.canvas.height]
            };
            for (let b = 0; b < this.o.length; b++)
              T[`tex${b}`] = this.o[b].getCurrent();
            this.renderAll(T);
          } else
            this.renderFbo({
              tex0: this.output.getCurrent(),
              resolution: [this.canvas.width, this.canvas.height]
            });
          if (this.synth.afterUpdate)
            try {
              this.synth.afterUpdate(this.timeSinceLastUpdate);
            } catch (T) {
              console.log(T);
            }
          this.timeSinceLastUpdate = 0;
        }
        this.saveFrame === !0 && (this.canvasToImage(), this.saveFrame = !1);
      } catch (y) {
        console.warn("Error during tick():", y);
      }
    }
  }
  es.exports = fl;
});
export default ul();
