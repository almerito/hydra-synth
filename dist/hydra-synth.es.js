var gc = (u, n) => () => (n || u((n = { exports: {} }).exports, n), n.exports);
var cl = gc((hl, Js) => {
  class Ec {
    constructor({ regl: n, precision: p, label: b = "", width: T, height: v }) {
      this.regl = n, this.precision = p, this.label = b, this.positionBuffer = this.regl.buffer([
        [-2, 0],
        [0, -2],
        [2, 2]
      ]), this.draw = () => {
      }, this.init(), this.pingPongIndex = 0, this.fbos = Array(2).fill().map(() => this.regl.framebuffer({
        color: this.regl.texture({
          mag: "nearest",
          width: T,
          height: v,
          format: "rgba"
        }),
        depthStencil: !1
      }));
    }
    resize(n, p) {
      this.fbos.forEach((b) => {
        b.resize(n, p);
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
      let p = n[0];
      var b = this, T = Object.assign(p.uniforms, {
        prevBuffer: () => b.fbos[b.pingPongIndex]
      });
      b.draw = b.regl({
        frag: p.frag,
        vert: b.vert,
        attributes: b.attributes,
        uniforms: T,
        count: 3,
        framebuffer: () => (b.pingPongIndex = b.pingPongIndex ? 0 : 1, b.fbos[b.pingPongIndex])
      });
    }
    tick(n) {
      this.draw(n);
    }
  }
  function Ba(u) {
    return u && u.__esModule && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u;
  }
  var Ln = { exports: {} }, Ps;
  function xc() {
    return Ps || (Ps = 1, typeof Object.create == "function" ? Ln.exports = function(n, p) {
      p && (n.super_ = p, n.prototype = Object.create(p.prototype, {
        constructor: {
          value: n,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }));
    } : Ln.exports = function(n, p) {
      if (p) {
        n.super_ = p;
        var b = function() {
        };
        b.prototype = p.prototype, n.prototype = new b(), n.prototype.constructor = n;
      }
    }), Ln.exports;
  }
  var Oa, $s;
  function Tc() {
    if ($s) return Oa;
    $s = 1;
    function u() {
      this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0;
    }
    Oa = u, u.EventEmitter = u, u.prototype._events = void 0, u.prototype._maxListeners = void 0, u.defaultMaxListeners = 10, u.prototype.setMaxListeners = function(v) {
      if (!p(v) || v < 0 || isNaN(v))
        throw TypeError("n must be a positive number");
      return this._maxListeners = v, this;
    }, u.prototype.emit = function(v) {
      var I, R, X, ee, He, ye;
      if (this._events || (this._events = {}), v === "error" && (!this._events.error || b(this._events.error) && !this._events.error.length)) {
        if (I = arguments[1], I instanceof Error)
          throw I;
        var ve = new Error('Uncaught, unspecified "error" event. (' + I + ")");
        throw ve.context = I, ve;
      }
      if (R = this._events[v], T(R))
        return !1;
      if (n(R))
        switch (arguments.length) {
          // fast cases
          case 1:
            R.call(this);
            break;
          case 2:
            R.call(this, arguments[1]);
            break;
          case 3:
            R.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            ee = Array.prototype.slice.call(arguments, 1), R.apply(this, ee);
        }
      else if (b(R))
        for (ee = Array.prototype.slice.call(arguments, 1), ye = R.slice(), X = ye.length, He = 0; He < X; He++)
          ye[He].apply(this, ee);
      return !0;
    }, u.prototype.addListener = function(v, I) {
      var R;
      if (!n(I))
        throw TypeError("listener must be a function");
      return this._events || (this._events = {}), this._events.newListener && this.emit(
        "newListener",
        v,
        n(I.listener) ? I.listener : I
      ), this._events[v] ? b(this._events[v]) ? this._events[v].push(I) : this._events[v] = [this._events[v], I] : this._events[v] = I, b(this._events[v]) && !this._events[v].warned && (T(this._maxListeners) ? R = u.defaultMaxListeners : R = this._maxListeners, R && R > 0 && this._events[v].length > R && (this._events[v].warned = !0, console.error(
        "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
        this._events[v].length
      ), typeof console.trace == "function" && console.trace())), this;
    }, u.prototype.on = u.prototype.addListener, u.prototype.once = function(v, I) {
      if (!n(I))
        throw TypeError("listener must be a function");
      var R = !1;
      function X() {
        this.removeListener(v, X), R || (R = !0, I.apply(this, arguments));
      }
      return X.listener = I, this.on(v, X), this;
    }, u.prototype.removeListener = function(v, I) {
      var R, X, ee, He;
      if (!n(I))
        throw TypeError("listener must be a function");
      if (!this._events || !this._events[v])
        return this;
      if (R = this._events[v], ee = R.length, X = -1, R === I || n(R.listener) && R.listener === I)
        delete this._events[v], this._events.removeListener && this.emit("removeListener", v, I);
      else if (b(R)) {
        for (He = ee; He-- > 0; )
          if (R[He] === I || R[He].listener && R[He].listener === I) {
            X = He;
            break;
          }
        if (X < 0)
          return this;
        R.length === 1 ? (R.length = 0, delete this._events[v]) : R.splice(X, 1), this._events.removeListener && this.emit("removeListener", v, I);
      }
      return this;
    }, u.prototype.removeAllListeners = function(v) {
      var I, R;
      if (!this._events)
        return this;
      if (!this._events.removeListener)
        return arguments.length === 0 ? this._events = {} : this._events[v] && delete this._events[v], this;
      if (arguments.length === 0) {
        for (I in this._events)
          I !== "removeListener" && this.removeAllListeners(I);
        return this.removeAllListeners("removeListener"), this._events = {}, this;
      }
      if (R = this._events[v], n(R))
        this.removeListener(v, R);
      else if (R)
        for (; R.length; )
          this.removeListener(v, R[R.length - 1]);
      return delete this._events[v], this;
    }, u.prototype.listeners = function(v) {
      var I;
      return !this._events || !this._events[v] ? I = [] : n(this._events[v]) ? I = [this._events[v]] : I = this._events[v].slice(), I;
    }, u.prototype.listenerCount = function(v) {
      if (this._events) {
        var I = this._events[v];
        if (n(I))
          return 1;
        if (I)
          return I.length;
      }
      return 0;
    }, u.listenerCount = function(v, I) {
      return v.listenerCount(I);
    };
    function n(v) {
      return typeof v == "function";
    }
    function p(v) {
      return typeof v == "number";
    }
    function b(v) {
      return typeof v == "object" && v !== null;
    }
    function T(v) {
      return v === void 0;
    }
    return Oa;
  }
  var Ca, Us;
  function Ac() {
    return Us || (Us = 1, Ca = window.performance && window.performance.now ? function() {
      return performance.now();
    } : Date.now || function() {
      return +/* @__PURE__ */ new Date();
    }), Ca;
  }
  var Hr = { exports: {} }, or = { exports: {} }, wc = or.exports, zs;
  function Sc() {
    return zs || (zs = 1, (function() {
      var u, n, p, b, T, v;
      typeof performance < "u" && performance !== null && performance.now ? or.exports = function() {
        return performance.now();
      } : typeof process < "u" && process !== null && process.hrtime ? (or.exports = function() {
        return (u() - T) / 1e6;
      }, n = process.hrtime, u = function() {
        var I;
        return I = n(), I[0] * 1e9 + I[1];
      }, b = u(), v = process.uptime() * 1e9, T = b - v) : Date.now ? (or.exports = function() {
        return Date.now() - p;
      }, p = Date.now()) : (or.exports = function() {
        return (/* @__PURE__ */ new Date()).getTime() - p;
      }, p = (/* @__PURE__ */ new Date()).getTime());
    }).call(wc)), or.exports;
  }
  var js;
  function Lc() {
    if (js) return Hr.exports;
    js = 1;
    for (var u = Sc(), n = window, p = ["moz", "webkit"], b = "AnimationFrame", T = n["request" + b], v = n["cancel" + b] || n["cancelRequest" + b], I = 0; !T && I < p.length; I++)
      T = n[p[I] + "Request" + b], v = n[p[I] + "Cancel" + b] || n[p[I] + "CancelRequest" + b];
    if (!T || !v) {
      var R = 0, X = 0, ee = [], He = 1e3 / 60;
      T = function(ye) {
        if (ee.length === 0) {
          var ve = u(), Pe = Math.max(0, He - (ve - R));
          R = Pe + ve, setTimeout(function() {
            var Ue = ee.slice(0);
            ee.length = 0;
            for (var Ke = 0; Ke < Ue.length; Ke++)
              if (!Ue[Ke].cancelled)
                try {
                  Ue[Ke].callback(R);
                } catch (Ft) {
                  setTimeout(function() {
                    throw Ft;
                  }, 0);
                }
          }, Math.round(Pe));
        }
        return ee.push({
          handle: ++X,
          callback: ye,
          cancelled: !1
        }), X;
      }, v = function(ye) {
        for (var ve = 0; ve < ee.length; ve++)
          ee[ve].handle === ye && (ee[ve].cancelled = !0);
      };
    }
    return Hr.exports = function(ye) {
      return T.call(n, ye);
    }, Hr.exports.cancel = function() {
      v.apply(n, arguments);
    }, Hr.exports.polyfill = function(ye) {
      ye || (ye = n), ye.requestAnimationFrame = T, ye.cancelAnimationFrame = v;
    }, Hr.exports;
  }
  var Fa, Xs;
  function Rc() {
    if (Xs) return Fa;
    Xs = 1;
    var u = xc(), n = Tc().EventEmitter, p = Ac(), b = Lc();
    Fa = T;
    function T(v) {
      if (!(this instanceof T))
        return new T(v);
      this.running = !1, this.last = p(), this._frame = 0, this._tick = this.tick.bind(this), v && this.on("tick", v);
    }
    return u(T, n), T.prototype.start = function() {
      if (!this.running)
        return this.running = !0, this.last = p(), this._frame = b(this._tick), this;
    }, T.prototype.stop = function() {
      return this.running = !1, this._frame !== 0 && b.cancel(this._frame), this._frame = 0, this;
    }, T.prototype.tick = function() {
      this._frame = b(this._tick);
      var v = p(), I = v - this.last;
      this.emit("tick", I), this.last = v;
    }, Fa;
  }
  var Oc = Rc();
  const Cc = /* @__PURE__ */ Ba(Oc);
  function Fc(u) {
    return navigator.mediaDevices.enumerateDevices().then((n) => n.filter((p) => p.kind === "videoinput")).then((n) => {
      let p = { audio: !1, video: !0 };
      return n[u] && (p.video = {
        deviceId: { exact: n[u].deviceId }
      }), window.navigator.mediaDevices.getUserMedia(p);
    }).then((n) => {
      const p = document.createElement("video");
      return p.setAttribute("autoplay", ""), p.setAttribute("muted", ""), p.setAttribute("playsinline", ""), p.srcObject = n, new Promise((b, T) => {
        p.addEventListener("loadedmetadata", () => {
          p.play().then(() => b({ video: p }));
        });
      });
    }).catch(console.log.bind(console));
  }
  function Gc(u) {
    return new Promise(function(n, p) {
      navigator.mediaDevices.getDisplayMedia(u).then((b) => {
        const T = document.createElement("video");
        T.srcObject = b, T.addEventListener("loadedmetadata", () => {
          T.play(), n({ video: T });
        });
      }).catch((b) => p(b));
    });
  }
  class Mc {
    constructor({ regl: n, width: p, height: b, pb: T, label: v = "" }) {
      this.label = v, this.regl = n, this.src = null, this.dynamic = !0, this.width = p, this.height = b, this.tex = this.regl.texture({
        //  shape: [width, height]
        shape: [1, 1]
      }), this.pb = T;
    }
    init(n, p) {
      "src" in n && (this.src = n.src, this.tex = this.regl.texture({ data: this.src, ...p })), "dynamic" in n && (this.dynamic = n.dynamic);
    }
    initCam(n, p) {
      const b = this;
      Fc(n).then((T) => {
        b.src = T.video, b.dynamic = !0, b.tex = b.regl.texture({ data: b.src, ...p });
      }).catch((T) => console.log("could not get camera", T));
    }
    initVideo(n = "", p) {
      const b = document.createElement("video");
      b.crossOrigin = "anonymous", b.autoplay = !0, b.loop = !0, b.muted = !0, b.addEventListener("loadeddata", () => {
        this.src = b, b.play(), this.tex = this.regl.texture({ data: this.src, ...p }), this.dynamic = !0;
      }), b.src = n;
    }
    initImage(n = "", p) {
      const b = document.createElement("img");
      b.crossOrigin = "anonymous", b.src = n, b.onload = () => {
        this.src = b, this.dynamic = !1, this.tex = this.regl.texture({ data: this.src, ...p });
      };
    }
    initStream(n, p) {
      let b = this;
      n && this.pb && (this.pb.initSource(n), this.pb.on("got video", function(T, v) {
        T === n && (b.src = v, b.dynamic = !0, b.tex = b.regl.texture({ data: b.src, ...p }));
      }));
    }
    // index only relevant in atom-hydra + desktop apps
    initScreen(n = 0, p) {
      const b = this;
      Gc().then(function(T) {
        b.src = T.video, b.tex = b.regl.texture({ data: b.src, ...p }), b.dynamic = !0;
      }).catch((T) => console.log("could not get screen", T));
    }
    // cache for the canvases, so we don't create them every time
    canvases = {};
    // Creates a canvas and returns the 2d context
    initCanvas(n = 1e3, p = 1e3) {
      if (this.canvases[this.label] == null) {
        const I = document.createElement("canvas").getContext("2d");
        I != null && (this.canvases[this.label] = I);
      }
      const b = this.canvases[this.label], T = b.canvas;
      return T.width !== n && T.height !== p ? (T.width = n, T.height = p) : b.clearRect(0, 0, n, p), this.init({ src: T }), this.dynamic = !0, b;
    }
    resize(n, p) {
      this.width = n, this.height = p;
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
  function kc(u) {
    if (typeof u == "object") {
      if ("buttons" in u)
        return u.buttons;
      if ("which" in u) {
        var n = u.which;
        if (n === 2)
          return 4;
        if (n === 3)
          return 2;
        if (n > 0)
          return 1 << n - 1;
      } else if ("button" in u) {
        var n = u.button;
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
  function Ic(u) {
    return u.target || u.srcElement || window;
  }
  zt.element = Ic;
  function Bc(u) {
    return typeof u == "object" && "pageX" in u ? u.pageX : 0;
  }
  zt.x = Bc;
  function Nc(u) {
    return typeof u == "object" && "pageY" in u ? u.pageY : 0;
  }
  zt.y = Nc;
  function Dc(u, n) {
    n || (n = u, u = window);
    var p = 0, b = 0, T = 0, v = {
      shift: !1,
      alt: !1,
      control: !1,
      meta: !1
    }, I = !1;
    function R(Fe) {
      var at = !1;
      return "altKey" in Fe && (at = at || Fe.altKey !== v.alt, v.alt = !!Fe.altKey), "shiftKey" in Fe && (at = at || Fe.shiftKey !== v.shift, v.shift = !!Fe.shiftKey), "ctrlKey" in Fe && (at = at || Fe.ctrlKey !== v.control, v.control = !!Fe.ctrlKey), "metaKey" in Fe && (at = at || Fe.metaKey !== v.meta, v.meta = !!Fe.metaKey), at;
    }
    function X(Fe, at) {
      var Yt = zt.x(at), gt = zt.y(at);
      "buttons" in at && (Fe = at.buttons | 0), (Fe !== p || Yt !== b || gt !== T || R(at)) && (p = Fe | 0, b = Yt || 0, T = gt || 0, n && n(p, b, T, v));
    }
    function ee(Fe) {
      X(0, Fe);
    }
    function He() {
      (p || b || T || v.shift || v.alt || v.meta || v.control) && (b = T = 0, p = 0, v.shift = v.alt = v.control = v.meta = !1, n && n(0, 0, 0, v));
    }
    function ye(Fe) {
      R(Fe) && n && n(p, b, T, v);
    }
    function ve(Fe) {
      zt.buttons(Fe) === 0 ? X(0, Fe) : X(p, Fe);
    }
    function Pe(Fe) {
      X(p | zt.buttons(Fe), Fe);
    }
    function Ue(Fe) {
      X(p & ~zt.buttons(Fe), Fe);
    }
    function Ke() {
      I || (I = !0, u.addEventListener("mousemove", ve), u.addEventListener("mousedown", Pe), u.addEventListener("mouseup", Ue), u.addEventListener("mouseleave", ee), u.addEventListener("mouseenter", ee), u.addEventListener("mouseout", ee), u.addEventListener("mouseover", ee), u.addEventListener("blur", He), u.addEventListener("keyup", ye), u.addEventListener("keydown", ye), u.addEventListener("keypress", ye), u !== window && (window.addEventListener("blur", He), window.addEventListener("keyup", ye), window.addEventListener("keydown", ye), window.addEventListener("keypress", ye)));
    }
    function Ft() {
      I && (I = !1, u.removeEventListener("mousemove", ve), u.removeEventListener("mousedown", Pe), u.removeEventListener("mouseup", Ue), u.removeEventListener("mouseleave", ee), u.removeEventListener("mouseenter", ee), u.removeEventListener("mouseout", ee), u.removeEventListener("mouseover", ee), u.removeEventListener("blur", He), u.removeEventListener("keyup", ye), u.removeEventListener("keydown", ye), u.removeEventListener("keypress", ye), u !== window && (window.removeEventListener("blur", He), window.removeEventListener("keyup", ye), window.removeEventListener("keydown", ye), window.removeEventListener("keypress", ye)));
    }
    Ke();
    var mt = {
      element: u
    };
    return Object.defineProperties(mt, {
      enabled: {
        get: function() {
          return I;
        },
        set: function(Fe) {
          Fe ? Ke() : Ft();
        },
        enumerable: !0
      },
      buttons: {
        get: function() {
          return p;
        },
        enumerable: !0
      },
      x: {
        get: function() {
          return b;
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
          return v;
        },
        enumerable: !0
      }
    }), mt;
  }
  var Rn = { exports: {} }, Pc = Rn.exports, Vs;
  function $c() {
    return Vs || (Vs = 1, (function(u, n) {
      (function(p, b) {
        u.exports = b();
      })(Pc, (function() {
        function p(O, _, V) {
          for (var F, ne = 0, pe = _.length; ne < pe; ne++) !F && ne in _ || (F || (F = Array.prototype.slice.call(_, 0, ne)), F[ne] = _[ne]);
          return O.concat(F || Array.prototype.slice.call(_));
        }
        var b = Object.freeze({ __proto__: null, blackman: function(O) {
          for (var _ = new Float32Array(O), V = 2 * Math.PI / (O - 1), F = 2 * V, ne = 0; ne < O / 2; ne++) _[ne] = 0.42 - 0.5 * Math.cos(ne * V) + 0.08 * Math.cos(ne * F);
          for (ne = Math.ceil(O / 2); ne > 0; ne--) _[O - ne] = _[ne - 1];
          return _;
        }, hamming: function(O) {
          for (var _ = new Float32Array(O), V = 0; V < O; V++) _[V] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (V / O - 1));
          return _;
        }, hanning: function(O) {
          for (var _ = new Float32Array(O), V = 0; V < O; V++) _[V] = 0.5 - 0.5 * Math.cos(2 * Math.PI * V / (O - 1));
          return _;
        }, sine: function(O) {
          for (var _ = Math.PI / (O - 1), V = new Float32Array(O), F = 0; F < O; F++) V[F] = Math.sin(_ * F);
          return V;
        } }), T = {};
        function v(O) {
          for (; O % 2 == 0 && O > 1; ) O /= 2;
          return O === 1;
        }
        function I(O, _) {
          if (_ !== "rect") {
            if (_ !== "" && _ || (_ = "hanning"), T[_] || (T[_] = {}), !T[_][O.length]) try {
              T[_][O.length] = b[_](O.length);
            } catch {
              throw new Error("Invalid windowing function");
            }
            O = (function(V, F) {
              for (var ne = [], pe = 0; pe < Math.min(V.length, F.length); pe++) ne[pe] = V[pe] * F[pe];
              return ne;
            })(O, T[_][O.length]);
          }
          return O;
        }
        function R(O, _, V) {
          for (var F = new Float32Array(O), ne = 0; ne < F.length; ne++) F[ne] = ne * _ / V, F[ne] = 13 * Math.atan(F[ne] / 1315.8) + 3.5 * Math.atan(Math.pow(F[ne] / 7518, 2));
          return F;
        }
        function X(O) {
          return Float32Array.from(O);
        }
        function ee(O) {
          return 1125 * Math.log(1 + O / 700);
        }
        function He(O, _, V) {
          for (var F, ne = new Float32Array(O + 2), pe = new Float32Array(O + 2), Me = _ / 2, Ne = ee(0), Se = (ee(Me) - Ne) / (O + 1), Ae = new Array(O + 2), ze = 0; ze < ne.length; ze++) ne[ze] = ze * Se, pe[ze] = (F = ne[ze], 700 * (Math.exp(F / 1125) - 1)), Ae[ze] = Math.floor((V + 1) * pe[ze] / _);
          for (var vt = new Array(O), $e = 0; $e < vt.length; $e++) {
            for (vt[$e] = new Array(V / 2 + 1).fill(0), ze = Ae[$e]; ze < Ae[$e + 1]; ze++) vt[$e][ze] = (ze - Ae[$e]) / (Ae[$e + 1] - Ae[$e]);
            for (ze = Ae[$e + 1]; ze < Ae[$e + 2]; ze++) vt[$e][ze] = (Ae[$e + 2] - ze) / (Ae[$e + 2] - Ae[$e + 1]);
          }
          return vt;
        }
        function ye(O, _, V, F, ne, pe, Me) {
          F === void 0 && (F = 5), ne === void 0 && (ne = 2), pe === void 0 && (pe = !0), Me === void 0 && (Me = 440);
          var Ne = Math.floor(V / 2) + 1, Se = new Array(V).fill(0).map((function(it, pt) {
            return O * (function(yt, Gt) {
              return Math.log2(16 * yt / Gt);
            })(_ * pt / V, Me);
          }));
          Se[0] = Se[1] - 1.5 * O;
          var Ae, ze, vt, $e = Se.slice(1).map((function(it, pt) {
            return Math.max(it - Se[pt]);
          }), 1).concat([1]), Rt = Math.round(O / 2), Tt = new Array(O).fill(0).map((function(it, pt) {
            return Se.map((function(yt) {
              return (10 * O + Rt + yt - pt) % O - Rt;
            }));
          })), At = Tt.map((function(it, pt) {
            return it.map((function(yt, Gt) {
              return Math.exp(-0.5 * Math.pow(2 * Tt[pt][Gt] / $e[Gt], 2));
            }));
          }));
          if (ze = (Ae = At)[0].map((function() {
            return 0;
          })), vt = Ae.reduce((function(it, pt) {
            return pt.forEach((function(yt, Gt) {
              it[Gt] += Math.pow(yt, 2);
            })), it;
          }), ze).map(Math.sqrt), At = Ae.map((function(it, pt) {
            return it.map((function(yt, Gt) {
              return yt / (vt[Gt] || 1);
            }));
          })), ne) {
            var Lr = Se.map((function(it) {
              return Math.exp(-0.5 * Math.pow((it / O - F) / ne, 2));
            }));
            At = At.map((function(it) {
              return it.map((function(pt, yt) {
                return pt * Lr[yt];
              }));
            }));
          }
          return pe && (At = p(p([], At.slice(3), !0), At.slice(0, 3))), At.map((function(it) {
            return it.slice(0, Ne);
          }));
        }
        function ve(O, _) {
          for (var V = 0, F = 0, ne = 0; ne < _.length; ne++) V += Math.pow(ne, O) * Math.abs(_[ne]), F += _[ne];
          return V / F;
        }
        function Pe(O) {
          var _ = O.ampSpectrum, V = O.barkScale, F = O.numberOfBarkBands, ne = F === void 0 ? 24 : F;
          if (typeof _ != "object" || typeof V != "object") throw new TypeError();
          var pe = ne, Me = new Float32Array(pe), Ne = 0, Se = _, Ae = new Int32Array(pe + 1);
          Ae[0] = 0;
          for (var ze = V[Se.length - 1] / pe, vt = 1, $e = 0; $e < Se.length; $e++) for (; V[$e] > ze; ) Ae[vt++] = $e, ze = vt * V[Se.length - 1] / pe;
          for (Ae[pe] = Se.length - 1, $e = 0; $e < pe; $e++) {
            for (var Rt = 0, Tt = Ae[$e]; Tt < Ae[$e + 1]; Tt++) Rt += Se[Tt];
            Me[$e] = Math.pow(Rt, 0.23);
          }
          for ($e = 0; $e < Me.length; $e++) Ne += Me[$e];
          return { specific: Me, total: Ne };
        }
        function Ue(O) {
          var _ = O.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          for (var V = new Float32Array(_.length), F = 0; F < V.length; F++) V[F] = Math.pow(_[F], 2);
          return V;
        }
        function Ke(O) {
          var _ = O.ampSpectrum, V = O.melFilterBank, F = O.bufferSize;
          if (typeof _ != "object") throw new TypeError("Valid ampSpectrum is required to generate melBands");
          if (typeof V != "object") throw new TypeError("Valid melFilterBank is required to generate melBands");
          for (var ne = Ue({ ampSpectrum: _ }), pe = V.length, Me = Array(pe), Ne = new Float32Array(pe), Se = 0; Se < Ne.length; Se++) {
            Me[Se] = new Float32Array(F / 2), Ne[Se] = 0;
            for (var Ae = 0; Ae < F / 2; Ae++) Me[Se][Ae] = V[Se][Ae] * ne[Ae], Ne[Se] += Me[Se][Ae];
            Ne[Se] = Math.log(Ne[Se] + 1);
          }
          return Array.prototype.slice.call(Ne);
        }
        function Ft(O) {
          return O && O.__esModule && Object.prototype.hasOwnProperty.call(O, "default") ? O.default : O;
        }
        var mt = null, Fe = Ft((function(O, _) {
          var V = O.length;
          return _ = _ || 2, mt && mt[V] || (function(F) {
            (mt = mt || {})[F] = new Array(F * F);
            for (var ne = Math.PI / F, pe = 0; pe < F; pe++) for (var Me = 0; Me < F; Me++) mt[F][Me + pe * F] = Math.cos(ne * (Me + 0.5) * pe);
          })(V), O.map((function() {
            return 0;
          })).map((function(F, ne) {
            return _ * O.reduce((function(pe, Me, Ne, Se) {
              return pe + Me * mt[V][Ne + ne * V];
            }), 0);
          }));
        })), at = Object.freeze({ __proto__: null, amplitudeSpectrum: function(O) {
          return O.ampSpectrum;
        }, buffer: function(O) {
          return O.signal;
        }, chroma: function(O) {
          var _ = O.ampSpectrum, V = O.chromaFilterBank;
          if (typeof _ != "object") throw new TypeError("Valid ampSpectrum is required to generate chroma");
          if (typeof V != "object") throw new TypeError("Valid chromaFilterBank is required to generate chroma");
          var F = V.map((function(pe, Me) {
            return _.reduce((function(Ne, Se, Ae) {
              return Ne + Se * pe[Ae];
            }), 0);
          })), ne = Math.max.apply(Math, F);
          return ne ? F.map((function(pe) {
            return pe / ne;
          })) : F;
        }, complexSpectrum: function(O) {
          return O.complexSpectrum;
        }, energy: function(O) {
          var _ = O.signal;
          if (typeof _ != "object") throw new TypeError();
          for (var V = 0, F = 0; F < _.length; F++) V += Math.pow(Math.abs(_[F]), 2);
          return V;
        }, loudness: Pe, melBands: Ke, mfcc: function(O) {
          var _ = O.ampSpectrum, V = O.melFilterBank, F = O.numberOfMFCCCoefficients, ne = O.bufferSize, pe = Math.min(40, Math.max(1, F || 13));
          if (V.length < pe) throw new Error("Insufficient filter bank for requested number of coefficients");
          var Me = Ke({ ampSpectrum: _, melFilterBank: V, bufferSize: ne });
          return Fe(Me).slice(0, pe);
        }, perceptualSharpness: function(O) {
          for (var _ = Pe({ ampSpectrum: O.ampSpectrum, barkScale: O.barkScale }), V = _.specific, F = 0, ne = 0; ne < V.length; ne++) F += ne < 15 ? (ne + 1) * V[ne + 1] : 0.066 * Math.exp(0.171 * (ne + 1));
          return F *= 0.11 / _.total;
        }, perceptualSpread: function(O) {
          for (var _ = Pe({ ampSpectrum: O.ampSpectrum, barkScale: O.barkScale }), V = 0, F = 0; F < _.specific.length; F++) _.specific[F] > V && (V = _.specific[F]);
          return Math.pow((_.total - V) / _.total, 2);
        }, powerSpectrum: Ue, rms: function(O) {
          var _ = O.signal;
          if (typeof _ != "object") throw new TypeError();
          for (var V = 0, F = 0; F < _.length; F++) V += Math.pow(_[F], 2);
          return V /= _.length, V = Math.sqrt(V);
        }, spectralCentroid: function(O) {
          var _ = O.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          return ve(1, _);
        }, spectralCrest: function(O) {
          var _ = O.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          var V = 0, F = -1 / 0;
          return _.forEach((function(ne) {
            V += Math.pow(ne, 2), F = ne > F ? ne : F;
          })), V /= _.length, V = Math.sqrt(V), F / V;
        }, spectralFlatness: function(O) {
          var _ = O.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          for (var V = 0, F = 0, ne = 0; ne < _.length; ne++) V += Math.log(_[ne]), F += _[ne];
          return Math.exp(V / _.length) * _.length / F;
        }, spectralFlux: function(O) {
          var _ = O.signal, V = O.previousSignal, F = O.bufferSize;
          if (typeof _ != "object" || typeof V != "object") throw new TypeError();
          for (var ne = 0, pe = -F / 2; pe < _.length / 2 - 1; pe++) x = Math.abs(_[pe]) - Math.abs(V[pe]), ne += (x + Math.abs(x)) / 2;
          return ne;
        }, spectralKurtosis: function(O) {
          var _ = O.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          var V = _, F = ve(1, V), ne = ve(2, V), pe = ve(3, V), Me = ve(4, V);
          return (-3 * Math.pow(F, 4) + 6 * F * ne - 4 * F * pe + Me) / Math.pow(Math.sqrt(ne - Math.pow(F, 2)), 4);
        }, spectralRolloff: function(O) {
          var _ = O.ampSpectrum, V = O.sampleRate;
          if (typeof _ != "object") throw new TypeError();
          for (var F = _, ne = V / (2 * (F.length - 1)), pe = 0, Me = 0; Me < F.length; Me++) pe += F[Me];
          for (var Ne = 0.99 * pe, Se = F.length - 1; pe > Ne && Se >= 0; ) pe -= F[Se], --Se;
          return (Se + 1) * ne;
        }, spectralSkewness: function(O) {
          var _ = O.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          var V = ve(1, _), F = ve(2, _), ne = ve(3, _);
          return (2 * Math.pow(V, 3) - 3 * V * F + ne) / Math.pow(Math.sqrt(F - Math.pow(V, 2)), 3);
        }, spectralSlope: function(O) {
          var _ = O.ampSpectrum, V = O.sampleRate, F = O.bufferSize;
          if (typeof _ != "object") throw new TypeError();
          for (var ne = 0, pe = 0, Me = new Float32Array(_.length), Ne = 0, Se = 0, Ae = 0; Ae < _.length; Ae++) {
            ne += _[Ae];
            var ze = Ae * V / F;
            Me[Ae] = ze, Ne += ze * ze, pe += ze, Se += ze * _[Ae];
          }
          return (_.length * Se - pe * ne) / (ne * (Ne - Math.pow(pe, 2)));
        }, spectralSpread: function(O) {
          var _ = O.ampSpectrum;
          if (typeof _ != "object") throw new TypeError();
          return Math.sqrt(ve(2, _) - Math.pow(ve(1, _), 2));
        }, zcr: function(O) {
          var _ = O.signal;
          if (typeof _ != "object") throw new TypeError();
          for (var V = 0, F = 1; F < _.length; F++) (_[F - 1] >= 0 && _[F] < 0 || _[F - 1] < 0 && _[F] >= 0) && V++;
          return V;
        } });
        function Yt(O) {
          if (Array.isArray(O)) {
            for (var _ = 0, V = Array(O.length); _ < O.length; _++) V[_] = O[_];
            return V;
          }
          return Array.from(O);
        }
        var gt = {}, fr = {}, Bt = { bitReverseArray: function(O) {
          if (gt[O] === void 0) {
            for (var _ = (O - 1).toString(2).length, V = "0".repeat(_), F = {}, ne = 0; ne < O; ne++) {
              var pe = ne.toString(2);
              pe = V.substr(pe.length) + pe, pe = [].concat(Yt(pe)).reverse().join(""), F[ne] = parseInt(pe, 2);
            }
            gt[O] = F;
          }
          return gt[O];
        }, multiply: function(O, _) {
          return { real: O.real * _.real - O.imag * _.imag, imag: O.real * _.imag + O.imag * _.real };
        }, add: function(O, _) {
          return { real: O.real + _.real, imag: O.imag + _.imag };
        }, subtract: function(O, _) {
          return { real: O.real - _.real, imag: O.imag - _.imag };
        }, euler: function(O, _) {
          var V = -2 * Math.PI * O / _;
          return { real: Math.cos(V), imag: Math.sin(V) };
        }, conj: function(O) {
          return O.imag *= -1, O;
        }, constructComplexArray: function(O) {
          var _ = {};
          _.real = O.real === void 0 ? O.slice() : O.real.slice();
          var V = _.real.length;
          return fr[V] === void 0 && (fr[V] = Array.apply(null, Array(V)).map(Number.prototype.valueOf, 0)), _.imag = fr[V].slice(), _;
        } }, Cn = function(O) {
          var _ = {};
          O.real === void 0 || O.imag === void 0 ? _ = Bt.constructComplexArray(O) : (_.real = O.real.slice(), _.imag = O.imag.slice());
          var V = _.real.length, F = Math.log2(V);
          if (Math.round(F) != F) throw new Error("Input size must be a power of 2.");
          if (_.real.length != _.imag.length) throw new Error("Real and imaginary components must have the same length.");
          for (var ne = Bt.bitReverseArray(V), pe = { real: [], imag: [] }, Me = 0; Me < V; Me++) pe.real[ne[Me]] = _.real[Me], pe.imag[ne[Me]] = _.imag[Me];
          for (var Ne = 0; Ne < V; Ne++) _.real[Ne] = pe.real[Ne], _.imag[Ne] = pe.imag[Ne];
          for (var Se = 1; Se <= F; Se++) for (var Ae = Math.pow(2, Se), ze = 0; ze < Ae / 2; ze++) for (var vt = Bt.euler(ze, Ae), $e = 0; $e < V / Ae; $e++) {
            var Rt = Ae * $e + ze, Tt = Ae * $e + ze + Ae / 2, At = { real: _.real[Rt], imag: _.imag[Rt] }, Lr = { real: _.real[Tt], imag: _.imag[Tt] }, it = Bt.multiply(vt, Lr), pt = Bt.subtract(At, it);
            _.real[Tt] = pt.real, _.imag[Tt] = pt.imag;
            var yt = Bt.add(it, At);
            _.real[Rt] = yt.real, _.imag[Rt] = yt.imag;
          }
          return _;
        }, Fn = Cn, Gn = (function() {
          function O(_, V) {
            var F = this;
            if (this._m = V, !_.audioContext) throw this._m.errors.noAC;
            if (_.bufferSize && !v(_.bufferSize)) throw this._m._errors.notPow2;
            if (!_.source) throw this._m._errors.noSource;
            this._m.audioContext = _.audioContext, this._m.bufferSize = _.bufferSize || this._m.bufferSize || 256, this._m.hopSize = _.hopSize || this._m.hopSize || this._m.bufferSize, this._m.sampleRate = _.sampleRate || this._m.audioContext.sampleRate || 44100, this._m.callback = _.callback, this._m.windowingFunction = _.windowingFunction || "hanning", this._m.featureExtractors = at, this._m.EXTRACTION_STARTED = _.startImmediately || !1, this._m.channel = typeof _.channel == "number" ? _.channel : 0, this._m.inputs = _.inputs || 1, this._m.outputs = _.outputs || 1, this._m.numberOfMFCCCoefficients = _.numberOfMFCCCoefficients || this._m.numberOfMFCCCoefficients || 13, this._m.numberOfBarkBands = _.numberOfBarkBands || this._m.numberOfBarkBands || 24, this._m.spn = this._m.audioContext.createScriptProcessor(this._m.bufferSize, this._m.inputs, this._m.outputs), this._m.spn.connect(this._m.audioContext.destination), this._m._featuresToExtract = _.featureExtractors || [], this._m.barkScale = R(this._m.bufferSize, this._m.sampleRate, this._m.bufferSize), this._m.melFilterBank = He(Math.max(this._m.melBands, this._m.numberOfMFCCCoefficients), this._m.sampleRate, this._m.bufferSize), this._m.inputData = null, this._m.previousInputData = null, this._m.frame = null, this._m.previousFrame = null, this.setSource(_.source), this._m.spn.onaudioprocess = function(ne) {
              var pe;
              F._m.inputData !== null && (F._m.previousInputData = F._m.inputData), F._m.inputData = ne.inputBuffer.getChannelData(F._m.channel), F._m.previousInputData ? ((pe = new Float32Array(F._m.previousInputData.length + F._m.inputData.length - F._m.hopSize)).set(F._m.previousInputData.slice(F._m.hopSize)), pe.set(F._m.inputData, F._m.previousInputData.length - F._m.hopSize)) : pe = F._m.inputData;
              var Me = (function(Ne, Se, Ae) {
                if (Ne.length < Se) throw new Error("Buffer is too short for frame length");
                if (Ae < 1) throw new Error("Hop length cannot be less that 1");
                if (Se < 1) throw new Error("Frame length cannot be less that 1");
                var ze = 1 + Math.floor((Ne.length - Se) / Ae);
                return new Array(ze).fill(0).map((function(vt, $e) {
                  return Ne.slice($e * Ae, $e * Ae + Se);
                }));
              })(pe, F._m.bufferSize, F._m.hopSize);
              Me.forEach((function(Ne) {
                F._m.frame = Ne;
                var Se = F._m.extract(F._m._featuresToExtract, F._m.frame, F._m.previousFrame);
                typeof F._m.callback == "function" && F._m.EXTRACTION_STARTED && F._m.callback(Se), F._m.previousFrame = F._m.frame;
              }));
            };
          }
          return O.prototype.start = function(_) {
            this._m._featuresToExtract = _ || this._m._featuresToExtract, this._m.EXTRACTION_STARTED = !0;
          }, O.prototype.stop = function() {
            this._m.EXTRACTION_STARTED = !1;
          }, O.prototype.setSource = function(_) {
            this._m.source && this._m.source.disconnect(this._m.spn), this._m.source = _, this._m.source.connect(this._m.spn);
          }, O.prototype.setChannel = function(_) {
            _ <= this._m.inputs ? this._m.channel = _ : console.error("Channel ".concat(_, " does not exist. Make sure you've provided a value for 'inputs' that is greater than ").concat(_, " when instantiating the MeydaAnalyzer"));
          }, O.prototype.get = function(_) {
            return this._m.inputData ? this._m.extract(_ || this._m._featuresToExtract, this._m.inputData, this._m.previousInputData) : null;
          }, O;
        })(), wr = { audioContext: null, spn: null, bufferSize: 512, sampleRate: 44100, melBands: 26, chromaBands: 12, callback: null, windowingFunction: "hanning", featureExtractors: at, EXTRACTION_STARTED: !1, numberOfMFCCCoefficients: 13, numberOfBarkBands: 24, _featuresToExtract: [], windowing: I, _errors: { notPow2: new Error("Meyda: Buffer size must be a power of 2, e.g. 64 or 512"), featureUndef: new Error("Meyda: No features defined."), invalidFeatureFmt: new Error("Meyda: Invalid feature format"), invalidInput: new Error("Meyda: Invalid input."), noAC: new Error("Meyda: No AudioContext specified."), noSource: new Error("Meyda: No source node specified.") }, createMeydaAnalyzer: function(O) {
          return new Gn(O, Object.assign({}, wr));
        }, listAvailableFeatureExtractors: function() {
          return Object.keys(this.featureExtractors);
        }, extract: function(O, _, V) {
          var F = this;
          if (!_) throw this._errors.invalidInput;
          if (typeof _ != "object") throw this._errors.invalidInput;
          if (!O) throw this._errors.featureUndef;
          if (!v(_.length)) throw this._errors.notPow2;
          this.barkScale !== void 0 && this.barkScale.length == this.bufferSize || (this.barkScale = R(this.bufferSize, this.sampleRate, this.bufferSize)), this.melFilterBank !== void 0 && this.barkScale.length == this.bufferSize && this.melFilterBank.length == this.melBands || (this.melFilterBank = He(Math.max(this.melBands, this.numberOfMFCCCoefficients), this.sampleRate, this.bufferSize)), this.chromaFilterBank !== void 0 && this.chromaFilterBank.length == this.chromaBands || (this.chromaFilterBank = ye(this.chromaBands, this.sampleRate, this.bufferSize)), "buffer" in _ && _.buffer === void 0 ? this.signal = X(_) : this.signal = _;
          var ne = Sr(_, this.windowingFunction, this.bufferSize);
          if (this.signal = ne.windowedSignal, this.complexSpectrum = ne.complexSpectrum, this.ampSpectrum = ne.ampSpectrum, V) {
            var pe = Sr(V, this.windowingFunction, this.bufferSize);
            this.previousSignal = pe.windowedSignal, this.previousComplexSpectrum = pe.complexSpectrum, this.previousAmpSpectrum = pe.ampSpectrum;
          }
          var Me = function(Ne) {
            return F.featureExtractors[Ne]({ ampSpectrum: F.ampSpectrum, chromaFilterBank: F.chromaFilterBank, complexSpectrum: F.complexSpectrum, signal: F.signal, bufferSize: F.bufferSize, sampleRate: F.sampleRate, barkScale: F.barkScale, melFilterBank: F.melFilterBank, previousSignal: F.previousSignal, previousAmpSpectrum: F.previousAmpSpectrum, previousComplexSpectrum: F.previousComplexSpectrum, numberOfMFCCCoefficients: F.numberOfMFCCCoefficients, numberOfBarkBands: F.numberOfBarkBands });
          };
          if (typeof O == "object") return O.reduce((function(Ne, Se) {
            var Ae;
            return Object.assign({}, Ne, ((Ae = {})[Se] = Me(Se), Ae));
          }), {});
          if (typeof O == "string") return Me(O);
          throw this._errors.invalidFeatureFmt;
        } }, Sr = function(O, _, V) {
          var F = {};
          O.buffer === void 0 ? F.signal = X(O) : F.signal = O, F.windowedSignal = I(F.signal, _), F.complexSpectrum = Fn(F.windowedSignal), F.ampSpectrum = new Float32Array(V / 2);
          for (var ne = 0; ne < V / 2; ne++) F.ampSpectrum[ne] = Math.sqrt(Math.pow(F.complexSpectrum.real[ne], 2) + Math.pow(F.complexSpectrum.imag[ne], 2));
          return F;
        };
        return typeof window < "u" && (window.Meyda = wr), wr;
      }));
    })(Rn)), Rn.exports;
  }
  var Uc = $c();
  const zc = /* @__PURE__ */ Ba(Uc);
  class jc {
    constructor({
      numBins: n = 4,
      cutoff: p = 2,
      smooth: b = 0.4,
      max: T = 15,
      scale: v = 10,
      isDrawing: I = !1,
      parentEl: R = document.body
    }) {
      this.vol = 0, this.scale = v, this.max = T, this.cutoff = p, this.smooth = b, this.setBins(n), this.beat = {
        holdFrames: 20,
        threshold: 40,
        _cutoff: 0,
        // adaptive based on sound state
        decay: 0.98,
        _framesSinceBeat: 0
        // keeps track of frames
      }, this.onBeat = () => {
      }, this.canvas = document.createElement("canvas"), this.canvas.width = 100, this.canvas.height = 80, this.canvas.style.width = "100px", this.canvas.style.height = "80px", this.canvas.style.position = "absolute", this.canvas.style.right = "0px", this.canvas.style.bottom = "0px", R.appendChild(this.canvas), this.isDrawing = I, this.ctx = this.canvas.getContext("2d"), this.ctx.fillStyle = "#DFFFFF", this.ctx.strokeStyle = "#0ff", this.ctx.lineWidth = 0.5, window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia({ video: !1, audio: !0 }).then((X) => {
        this.stream = X, this.context = new AudioContext();
        let ee = this.context.createMediaStreamSource(X);
        this.meyda = zc.createMeydaAnalyzer({
          audioContext: this.context,
          source: ee,
          featureExtractors: [
            "loudness"
            //  'perceptualSpread',
            //  'perceptualSharpness',
            //  'spectralCentroid'
          ]
        });
      }).catch((X) => console.log("ERROR", X));
    }
    detectBeat(n) {
      n > this.beat._cutoff && n > this.beat.threshold ? (this.onBeat(), this.beat._cutoff = n * 1.2, this.beat._framesSinceBeat = 0) : this.beat._framesSinceBeat <= this.beat.holdFrames ? this.beat._framesSinceBeat++ : (this.beat._cutoff *= this.beat.decay, this.beat._cutoff = Math.max(this.beat._cutoff, this.beat.threshold));
    }
    tick() {
      if (this.meyda) {
        var n = this.meyda.get();
        if (n && n !== null) {
          this.vol = n.loudness.total, this.detectBeat(this.vol);
          const p = (T, v) => T + v;
          let b = Math.floor(n.loudness.specific.length / this.bins.length);
          this.prevBins = this.bins.slice(0), this.bins = this.bins.map((T, v) => n.loudness.specific.slice(v * b, (v + 1) * b).reduce(p)).map((T, v) => T * (1 - this.settings[v].smooth) + this.prevBins[v] * this.settings[v].smooth), this.fft = this.bins.map((T, v) => (
            // Math.max(0, (bin - this.cutoff) / (this.max - this.cutoff))
            Math.max(0, (T - this.settings[v].cutoff) / this.settings[v].scale)
          )), this.isDrawing && this.draw();
        }
      }
    }
    setCutoff(n) {
      this.cutoff = n, this.settings = this.settings.map((p) => (p.cutoff = n, p));
    }
    setSmooth(n) {
      this.smooth = n, this.settings = this.settings.map((p) => (p.smooth = n, p));
    }
    setBins(n) {
      this.bins = Array(n).fill(0), this.prevBins = Array(n).fill(0), this.fft = Array(n).fill(0), this.settings = Array(n).fill(0).map(() => ({
        cutoff: this.cutoff,
        scale: this.scale,
        smooth: this.smooth
      })), this.bins.forEach((p, b) => {
        window["a" + b] = (T = 1, v = 0) => () => a.fft[b] * T + v;
      });
    }
    setScale(n) {
      this.scale = n, this.settings = this.settings.map((p) => (p.scale = n, p));
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
      var n = this.canvas.width / this.bins.length, p = this.canvas.height / (this.max * 2);
      this.bins.forEach((b, T) => {
        var v = b * p;
        this.ctx.fillRect(T * n, this.canvas.height - v, n, v);
        var I = this.canvas.height - p * this.settings[T].cutoff;
        this.ctx.beginPath(), this.ctx.moveTo(T * n, I), this.ctx.lineTo((T + 1) * n, I), this.ctx.stroke();
        var R = this.canvas.height - p * (this.settings[T].scale + this.settings[T].cutoff);
        this.ctx.beginPath(), this.ctx.moveTo(T * n, R), this.ctx.lineTo((T + 1) * n, R), this.ctx.stroke();
      });
    }
  }
  class Xc {
    constructor(n) {
      this.mediaSource = new MediaSource(), this.stream = n, this.output = document.createElement("video"), this.output.autoplay = !0, this.output.loop = !0;
      let p = this;
      this.mediaSource.addEventListener("sourceopen", () => {
        console.log("MediaSource opened"), p.sourceBuffer = p.mediaSource.addSourceBuffer('video/webm; codecs="vp8"'), console.log("Source buffer: ", sourceBuffer);
      });
    }
    start() {
      let n = { mimeType: "video/webm;codecs=vp9" };
      this.recordedBlobs = [];
      try {
        this.mediaRecorder = new MediaRecorder(this.stream, n);
      } catch (p) {
        console.log("Unable to create MediaRecorder with options Object: ", p);
        try {
          n = { mimeType: "video/webm,codecs=vp9" }, this.mediaRecorder = new MediaRecorder(this.stream, n);
        } catch (b) {
          console.log("Unable to create MediaRecorder with options Object: ", b);
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
      const n = new Blob(this.recordedBlobs, { type: this.mediaRecorder.mimeType }), p = window.URL.createObjectURL(n);
      this.output.src = p;
      const b = document.createElement("a");
      b.style.display = "none", b.href = p;
      let T = /* @__PURE__ */ new Date();
      b.download = `hydra-${T.getFullYear()}-${T.getMonth() + 1}-${T.getDate()}-${T.getHours()}.${T.getMinutes()}.${T.getSeconds()}.webm`, document.body.appendChild(b), b.click(), setTimeout(() => {
        document.body.removeChild(b), window.URL.revokeObjectURL(p);
      }, 300);
    }
    _handleDataAvailable(n) {
      n.data && n.data.size > 0 && this.recordedBlobs.push(n.data);
    }
  }
  const Ga = {
    // no easing, no acceleration
    linear: function(u) {
      return u;
    },
    // accelerating from zero velocity
    easeInQuad: function(u) {
      return u * u;
    },
    // decelerating to zero velocity
    easeOutQuad: function(u) {
      return u * (2 - u);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function(u) {
      return u < 0.5 ? 2 * u * u : -1 + (4 - 2 * u) * u;
    },
    // accelerating from zero velocity
    easeInCubic: function(u) {
      return u * u * u;
    },
    // decelerating to zero velocity
    easeOutCubic: function(u) {
      return --u * u * u + 1;
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function(u) {
      return u < 0.5 ? 4 * u * u * u : (u - 1) * (2 * u - 2) * (2 * u - 2) + 1;
    },
    // accelerating from zero velocity
    easeInQuart: function(u) {
      return u * u * u * u;
    },
    // decelerating to zero velocity
    easeOutQuart: function(u) {
      return 1 - --u * u * u * u;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function(u) {
      return u < 0.5 ? 8 * u * u * u * u : 1 - 8 * --u * u * u * u;
    },
    // accelerating from zero velocity
    easeInQuint: function(u) {
      return u * u * u * u * u;
    },
    // decelerating to zero velocity
    easeOutQuint: function(u) {
      return 1 + --u * u * u * u * u;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function(u) {
      return u < 0.5 ? 16 * u * u * u * u * u : 1 + 16 * --u * u * u * u * u;
    },
    // sin shape
    sin: function(u) {
      return (1 + Math.sin(Math.PI * u - Math.PI / 2)) / 2;
    }
  };
  var Vc = (u, n, p, b, T) => (u - n) * (T - b) / (p - n) + b, Ma = (u, n) => (u % n + n) % n;
  const Qs = {
    init: () => {
      Array.prototype.fast = function(u = 1) {
        return this._speed = u, this;
      }, Array.prototype.smooth = function(u = 1) {
        return this._smooth = u, this;
      }, Array.prototype.ease = function(u = "linear") {
        return typeof u == "function" ? (this._smooth = 1, this._ease = u) : Ga[u] && (this._smooth = 1, this._ease = Ga[u]), this;
      }, Array.prototype.offset = function(u = 0.5) {
        return this._offset = u % 1, this;
      }, Array.prototype.fit = function(u = 0, n = 1) {
        let p = Math.min(...this), b = Math.max(...this);
        var T = this.map((v) => Vc(v, p, b, u, n));
        return T._speed = this._speed, T._smooth = this._smooth, T._ease = this._ease, T;
      };
    },
    getValue: (u = []) => ({ time: n, bpm: p }) => {
      let b = u._speed ? u._speed : 1, T = u._smooth ? u._smooth : 0, v = n * b * (p / 60) + (u._offset || 0);
      if (T !== 0) {
        let I = u._ease ? u._ease : Ga.linear, R = v - T / 2, X = u[Math.floor(Ma(R, u.length))], ee = u[Math.floor(Ma(R + 1, u.length))], He = Math.min(Ma(R, 1) / T, 1);
        return I(He) * (ee - X) + X;
      } else
        return u[Math.floor(v % u.length)], u[Math.floor(v % u.length)];
    }
  }, Hc = (u) => {
    var n = "", p = T(n), b = (v, I) => {
      n += `
      var ${v} = ${I}
    `, p = T(n);
    };
    return {
      addToContext: b,
      eval: (v) => p.eval(v)
    };
    function T(v) {
      globalThis.eval(v);
      var I = function(R) {
        globalThis.eval(R);
      };
      return {
        eval: I
      };
    }
  };
  class Wc {
    constructor(n, p, b = []) {
      this.makeGlobal = p, this.sandbox = Hc(), this.parent = n;
      var T = Object.keys(n);
      T.forEach((v) => this.add(v)), this.userProps = b;
    }
    add(n) {
      this.makeGlobal && (window[n] = this.parent[n]);
    }
    // sets on window as well as synth object if global (not needed for objects, which can be set directly)
    set(n, p) {
      this.makeGlobal && (window[n] = p), this.parent[n] = p;
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
  }, ka = (u) => (u = u.toString(), u.indexOf(".") < 0 && (u += "."), u);
  function qc(u, n, p) {
    const b = u.transform.inputs, T = u.userArgs, { generators: v } = u.synth, { src: I } = v;
    return b.map((R, X) => {
      const ee = {
        value: R.default,
        type: R.type,
        //
        isUniform: !1,
        name: R.name,
        vecLen: 0
        //  generateGlsl: null // function for creating glsl
      };
      if (R.isArrayType) {
        ee.isArrayType = !0, ee.isArrayUniform = !0, ee.arrayLength = R.arrayLength, ee.baseType = R.baseType, ee.isUniform = !0;
        let ve = Array.isArray(R.default) ? [...R.default] : [];
        for (; ve.length < R.arrayLength; )
          R.baseType === "vec2" ? ve.push([0, 0]) : R.baseType === "vec3" ? ve.push([0, 0, 0]) : R.baseType === "vec4" ? ve.push([0, 0, 0, 1]) : ve.push(0);
        ve = ve.slice(0, R.arrayLength), ee.value = ve;
      }
      if (ee.type === "float" && (ee.value = ka(R.default)), R.type.startsWith("vec") && !R.isArrayType)
        try {
          ee.vecLen = Number.parseInt(R.type.substr(3));
        } catch {
          console.log(`Error determining length of vector input type ${R.type} (${R.name})`);
        }
      if (T.length > X) {
        if (ee.value = T[X], ee.type === "vec4" && !(ee.value.type === "GlslSource" || ee.value.getTexture))
          throw new Error("Arguments must be a texture or GlslSource");
        if (typeof T[X] == "function") {
          if (R.isArrayType) {
            const ve = T[X], Pe = R.arrayLength, Ue = R.baseType;
            ee.value = (Ke, Ft, mt) => {
              try {
                let Fe = ve(Ft);
                for (Array.isArray(Fe) || (Fe = []); Fe.length < Pe; )
                  Ue === "vec2" ? Fe.push([0, 0]) : Ue === "vec3" ? Fe.push([0, 0, 0]) : Ue === "vec4" ? Fe.push([0, 0, 0, 1]) : Fe.push(0);
                return Fe.slice(0, Pe);
              } catch (Fe) {
                return console.warn("Error in array function:", Fe), ee.value;
              }
            };
          } else
            ee.value = (ve, Pe, Ue) => {
              try {
                const Ke = T[X](Pe);
                return typeof Ke == "number" ? Ke : (console.warn("function does not return a number", T[X]), R.default);
              } catch (Ke) {
                return console.warn("ERROR", Ke), R.default;
              }
            };
          ee.isUniform = !0;
        } else if (T[X].constructor === Array)
          if (R.isArrayType) {
            let ve = [...T[X]];
            const Pe = R.arrayLength, Ue = R.baseType;
            for (; ve.length < Pe; )
              Ue === "vec2" ? ve.push([0, 0]) : Ue === "vec3" ? ve.push([0, 0, 0]) : Ue === "vec4" ? ve.push([0, 0, 0, 1]) : ve.push(0);
            ve = ve.slice(0, Pe), ee.value = ve, ee.isUniform = !0, ee.isArrayUniform = !0, ee.arrayLength = Pe, ee.baseType = Ue;
          } else
            ee.value = (ve, Pe, Ue) => Qs.getValue(T[X])(Pe), ee.isUniform = !0;
      }
      if (!(n < 0)) {
        if (ee.value && ee.value.transforms) {
          const ve = ee.value.transforms[ee.value.transforms.length - 1];
          if (ve.transform.glsl_return_type !== R.type) {
            const Pe = Yc[R.type];
            if (typeof Pe < "u") {
              const Ue = Pe[ve.transform.glsl_return_type];
              if (typeof Ue < "u") {
                const { name: Ke, args: Ft } = Ue;
                ee.value = ee.value[Ke](...Ft);
              }
            }
          }
          ee.isUniform = !1;
        } else if (ee.type === "float" && typeof ee.value == "number")
          ee.value = ka(ee.value);
        else if (ee.type.startsWith("vec") && typeof ee.value == "object" && Array.isArray(ee.value))
          ee.isUniform = !1, ee.value = `${ee.type}(${ee.value.map(ka).join(", ")})`;
        else if (R.type === "sampler2D") {
          var He = ee.value;
          ee.value = () => He.getTexture(), ee.isUniform = !0;
        } else if (ee.value.getTexture && R.type === "vec4") {
          var ye = ee.value;
          ee.value = I(ye), ee.isUniform = !1;
        }
        ee.isUniform && (ee.name += n);
      }
      return ee;
    });
  }
  function Kc(u) {
    var n = {
      uniforms: [],
      // list of uniforms used in shader
      glslFunctions: [],
      // list of functions used in shader
      fragColor: ""
    }, p = Zs(u, n)("c", "st");
    n.fragColor = p;
    let b = {};
    return n.uniforms.forEach((T) => b[T.name] = T), n.uniforms = Object.values(b), n;
  }
  function Ia(u, n) {
    return `${u}_i${n}`;
  }
  function Zs(u, n) {
    var p = (b, T) => "";
    return u.forEach((b, T) => {
      let v = qc(b, n.uniforms.length);
      v.forEach((R) => {
        R.isUniform && n.uniforms.push(R);
      }), Qc(b, n.glslFunctions) || n.glslFunctions.push(b);
      var I = p;
      b.transform.type === "src" ? p = (R, X) => `${Wr(v, n)(`${R}${T}`, X)}
         vec4 ${R} = ${Yr(`${R}${T}`, X, b.name, v)};` : b.transform.type === "color" ? p = (R, X) => `${Wr(v, n)(`${R}${T}`, X)}
         ${I(R, X)}
         ${R} = ${Yr(`${R}${T}`, `${R}`, b.name, v)};` : b.transform.type === "coord" ? p = (R, X) => `${Wr(v, n)(`${R}${T}`, X)}
         ${X} = ${Yr(`${R}${T}`, `${X}`, b.name, v)};
         ${I(R, X)}` : b.transform.type === "combine" ? p = (R, X) => (
        // combining two generated shader strings (i.e. for blend, mult, add funtions)
        `${Wr(v, n)(`${R}${T}`, X)}
         ${I(R, X)}
         ${R} = ${Yr(`${R}${T}`, `${R}`, b.name, v)};`
      ) : b.transform.type === "combineCoord" && (p = (R, X) => `${Wr(v, n)(`${R}${T}`, X)}
         ${X} = ${Yr(`${R}${T}`, `${X}`, b.name, v)};
         ${I(R, X)}`);
    }), p;
  }
  function Wr(u, n) {
    let p = (T, v) => "";
    var b = p;
    return u.forEach((T, v) => {
      T.value.transforms && (b = p, p = (I, R) => {
        let X = Ia(I, v), ee = Ia(`${R}_${I}`, v);
        return `vec2 ${ee} = ${R};${b(I, R)}
         ${Zs(T.value.transforms, n)(X, ee)}`;
      });
    }), p;
  }
  function Yr(u, n, p, b) {
    const T = b.map((v, I) => v.isUniform ? v.name : v.value && v.value.transforms ? Ia(u, I) : v.value).reduce((v, I) => `${v}, ${I}`, "");
    return `${p}(${n}${T})`;
  }
  function Qc(u, n) {
    for (var p = 0; p < n.length; p++)
      if (u.name == n[p].name) return !0;
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
  var qr = function(u) {
    return this.transforms = [], this.transforms.push(u), this.defaultOutput = u.defaultOutput, this.synth = u.synth, this.type = "GlslSource", this.defaultUniforms = u.defaultUniforms, this;
  };
  qr.prototype.addTransform = function(u) {
    this.transforms.push(u);
  };
  qr.prototype.out = function(u) {
    var n = u || this.defaultOutput;
    if (n) try {
      var p = this.glsl(n);
      this.synth.currentFunctions = [], n.render(p);
    } catch (b) {
      console.warn("shader could not compile", b);
    }
  };
  qr.prototype.glsl = function() {
    var u = [], n = [];
    return this.transforms.forEach((p) => {
      p.transform.type === "renderpass" ? console.warn("no support for renderpass") : n.push(p);
    }), n.length > 0 && u.push(this.compile(n)), u;
  };
  qr.prototype.compile = function(u) {
    var n = Kc(u, this.synth), p = {};
    n.uniforms.forEach((v) => {
      if (v.isArrayUniform && v.arrayLength)
        if (typeof v.value == "function") {
          const I = v.value;
          for (let R = 0; R < v.arrayLength; R++) {
            const X = R;
            p[`${v.name}[${X}]`] = (ee, He, ye) => {
              const ve = I(ee, He, ye);
              return Array.isArray(ve) && ve[X] !== void 0 ? ve[X] : 0;
            };
          }
        } else if (Array.isArray(v.value)) {
          const I = v.value;
          for (let R = 0; R < v.arrayLength; R++)
            p[`${v.name}[${R}]`] = I[R] !== void 0 ? I[R] : 0;
        } else
          for (let I = 0; I < v.arrayLength; I++)
            p[`${v.name}[${I}]`] = v.value || 0;
      else
        p[v.name] = v.value;
    });
    const b = el(n.glslFunctions);
    b.renames.forEach(({ shaderName: v, oldName: I, newName: R }) => {
      const X = n.glslFunctions.find((ee) => ee.name === v);
      if (X && X.transform) {
        const ee = new RegExp(`\\b${I}\\b`, "g");
        X.transform.glsl = X.transform.glsl.replace(ee, R);
      }
    });
    var T = `#version 300 es
  precision ${this.defaultOutput.precision} float;
  ${Object.values(n.uniforms).map((v) => {
      let I = v.type;
      return v.type === "texture" && (I = "sampler2D"), v.isArrayUniform && v.arrayLength ? `
      uniform ${v.baseType} ${v.name}[${v.arrayLength}];` : `
      uniform ${I} ${v.name};`;
    }).join("")}
  uniform float time;
  uniform vec2 resolution;
  in vec2 uv;
  out vec4 fragColor;
  uniform sampler2D prevBuffer;

  ${Object.values(Zc).map((v) => `
            ${v.glsl}
          `).join("")}

  ${b.helpers}

  ${n.glslFunctions.map((v) => `
            ${v.transform.glsl}
          `).join("")}

  void main () {
    vec2 st = gl_FragCoord.xy/resolution.xy;

    ${n.fragColor}
    fragColor = c;
  }
  `;
    return {
      frag: T,
      uniforms: Object.assign({}, this.defaultUniforms, p)
    };
  };
  function Jc(u) {
    const n = [];
    if (!u || typeof u != "string") return n;
    const p = /^\s*(void|float|int|vec2|vec3|vec4|mat2|mat3|mat4|bool|sampler2D)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*\{/, b = /^\s*(const\s+)?(float|int|vec2|vec3|vec4|mat2|mat3|mat4|bool)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/, T = /^\s*#define\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+(.*)$/, v = u.length;
    let I = 0;
    for (; I < v; ) {
      for (; I < v && /\s/.test(u[I]); ) I++;
      if (I >= v) break;
      if (u.startsWith("//", I)) {
        let ye = u.indexOf(`
`, I);
        if (ye === -1) break;
        I = ye + 1;
        continue;
      }
      if (u.startsWith("/*", I)) {
        let ye = u.indexOf("*/", I);
        if (ye === -1) break;
        I = ye + 2;
        continue;
      }
      let R = I, X = !1, ee = !1;
      for (; R < v; ) {
        const ye = u[R];
        if (ye === "{") {
          X = !0;
          break;
        }
        if (ye === ";") {
          ee = !0;
          break;
        }
        if (ye === `
` && u[I] === "#")
          break;
        R++;
      }
      if (u.substring(I, R + 1).trim().startsWith("#define")) {
        let ye = u.indexOf(`
`, I);
        ye === -1 && (ye = v);
        const ve = u.substring(I, ye).trim(), Pe = T.exec(ve);
        Pe && n.push({
          type: "define",
          name: Pe[1],
          value: Pe[2].trim(),
          fullCode: ve
        }), I = ye + 1;
        continue;
      }
      if (X) {
        const ye = u.substring(I, R + 1).trim(), ve = p.exec(ye);
        if (ve) {
          let Pe = 1, Ue = R + 1;
          for (; Ue < v && Pe > 0; )
            u[Ue] === "{" ? Pe++ : u[Ue] === "}" && Pe--, Ue++;
          const Ke = u.substring(I, Ue);
          n.push({
            type: "function",
            name: ve[2],
            signature: `${ve[1]} ${ve[2]}(${ve[3]})`,
            body: u.substring(R + 1, Ue - 1).trim(),
            fullCode: Ke
          }), I = Ue;
          continue;
        }
      }
      if (ee) {
        const ye = u.substring(I, R + 1).trim(), ve = b.exec(ye);
        if (ve) {
          const Pe = ye.substring(ye.indexOf("=") + 1, ye.length - 1).trim();
          n.push({
            type: "var",
            isConst: !!ve[1],
            dataType: ve[2],
            name: ve[3],
            value: Pe,
            fullCode: ye
          }), I = R + 1;
          continue;
        }
      }
      I = R + 1;
    }
    return n;
  }
  function el(u) {
    const n = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Set(), b = [], T = [];
    return u.forEach((v) => {
      if (!v.transform.helpers) return;
      const I = v.name;
      Jc(v.transform.helpers).forEach((X) => {
        const ee = n.get(X.name);
        if (!ee)
          n.set(X.name, X), p.add(X.name), T.push(X.fullCode);
        else {
          let He = !1;
          if (ee.type === X.type && (X.type === "define" ? He = ee.value === X.value : X.type === "var" ? He = ee.value === X.value && ee.dataType === X.dataType : X.type === "function" && (He = ee.signature === X.signature && ee.body === X.body)), He)
            return;
          {
            let ye = `${I}_${X.name}`, ve = 1;
            for (; p.has(ye); )
              ye = `${I}_${X.name}_${ve}`, ve++;
            let Pe = X.fullCode;
            X.type === "define" ? Pe = X.fullCode.replace(
              new RegExp(`(#define\\s+)${X.name}(\\s+)`),
              `$1${ye}$2`
            ) : X.type === "var" ? Pe = X.fullCode.replace(
              new RegExp(`\\b${X.name}\\b(\\s*=)`),
              `${ye}$1`
            ) : X.type === "function" && (Pe = X.fullCode.replace(
              new RegExp(`\\b${X.name}\\b`),
              ye
            )), n.set(ye, Object.assign({}, X, { name: ye, fullCode: Pe })), p.add(ye), T.push(Pe), b.push({
              shaderName: I,
              oldName: X.name,
              newName: ye
            });
          }
        }
      });
    }), {
      helpers: T.join(`

`),
      renames: b
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
  function Hs(u) {
    if (!u || typeof u != "string")
      return u;
    let n = u;
    return n = n.replace(/\btexture2D\s*\(/g, "texture("), n = n.replace(/\btexture2DLod\s*\(/g, "textureLod("), n = n.replace(/\btexture2DProj\s*\(/g, "textureProj("), n = n.replace(/\btextureCube\s*\(/g, "texture("), n = n.replace(/\btextureCubeLod\s*\(/g, "textureLod("), n = n.replace(/\bshadow2D\s*\(/g, "texture("), n = n.replace(/\bshadow2DProj\s*\(/g, "textureProj("), n;
  }
  function Ws(u) {
    return !u || typeof u != "string" ? !1 : [
      /\btexture2D\s*\(/,
      /\btexture2DLod\s*\(/,
      /\btexture2DProj\s*\(/,
      /\btextureCube\s*\(/,
      /\btextureCubeLod\s*\(/,
      /\bshadow2D\s*\(/,
      /\bshadow2DProj\s*\(/
    ].some((p) => p.test(u));
  }
  class rl {
    constructor({
      defaultUniforms: n,
      defaultOutput: p,
      extendTransforms: b = [],
      changeListener: T = (() => {
      })
    } = {}) {
      this.defaultOutput = p, this.defaultUniforms = n, this.changeListener = T, this.extendTransforms = b, this.generators = {}, this.init();
    }
    init() {
      const n = tl();
      return this.glslTransforms = {}, this.generators = Object.entries(this.generators).reduce((p, [b, T]) => (this.changeListener({ type: "remove", synth: this, method: b }), p), {}), this.sourceClass = class extends qr {
      }, Array.isArray(this.extendTransforms) ? n.concat(this.extendTransforms) : typeof this.extendTransforms == "object" && this.extendTransforms.type && n.push(this.extendTransforms), n.map((p) => this.setFunction(p));
    }
    _addMethod(n, p) {
      const b = this;
      if (this.glslTransforms[n] = p, p.type === "src") {
        const T = (...v) => new this.sourceClass({
          name: n,
          transform: p,
          userArgs: v,
          defaultOutput: this.defaultOutput,
          defaultUniforms: this.defaultUniforms,
          synth: b
        });
        return this.generators[n] = T, this.changeListener({ type: "add", synth: this, method: n }), T;
      } else
        this.sourceClass.prototype[n] = function(...T) {
          return this.transforms.push({ name: n, transform: p, userArgs: T, synth: b }), this;
        };
    }
    setFunction(n) {
      var p = al(n);
      p && this._addMethod(n.name, p);
    }
  }
  const Ys = {
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
  function nl(u) {
    const n = u.type.match(/^(\w+)\[(\d*)\]$/);
    if (!n) return null;
    const p = n[1], b = n[2] ? parseInt(n[2]) : u.length;
    return b ? { baseType: p, length: b, isArray: !0 } : (console.warn(`[hydra] Array input '${u.name}' has no length specified. Use 'float[N]' or add 'length: N' property.`), null);
  }
  function al(u) {
    let n = Ys[u.type];
    if (n) {
      const p = u.inputs.map((X) => {
        const ee = nl(X);
        return ee ? {
          ...X,
          isArrayType: !0,
          baseType: ee.baseType,
          arrayLength: ee.length
        } : X;
      });
      let b = n.args.concat(p), T = b.map((X) => X.isArrayType ? `${X.baseType} ${X.name}[${X.arrayLength}]` : `${X.type} ${X.name}`).join(", "), v = u.glsl3 || u.glsl;
      !u.glsl3 && Ws(v) && (v = Hs(v));
      let I = "";
      u.helpers && (I = u.helpers, Ws(I) && (I = Hs(I)));
      let R = `
  ${n.returnType} ${u.name}(${T}) {
      ${v}
  }
`;
      return u.inputs = b.slice(1), Object.assign({}, u, { glsl: R, helpers: I });
    } else
      console.warn(`type ${u.type} not recognized`, u, Ys);
  }
  var On = { exports: {} }, il = On.exports, qs;
  function sl() {
    return qs || (qs = 1, (function(u, n) {
      (function(p, b) {
        u.exports = b();
      })(il, (function() {
        var p = function(e) {
          return e instanceof Uint8Array || e instanceof Uint16Array || e instanceof Uint32Array || e instanceof Int8Array || e instanceof Int16Array || e instanceof Int32Array || e instanceof Float32Array || e instanceof Float64Array || e instanceof Uint8ClampedArray;
        }, b = function(e, r) {
          for (var l = Object.keys(r), M = 0; M < l.length; ++M)
            e[l[M]] = r[l[M]];
          return e;
        }, T = `
`;
        function v(e) {
          return typeof atob < "u" ? atob(e) : "base64:" + e;
        }
        function I(e) {
          var r = new Error("(regl) " + e);
          throw console.error(r), r;
        }
        function R(e, r) {
          e || I(r);
        }
        function X(e) {
          return e ? ": " + e : "";
        }
        function ee(e, r, l) {
          e in r || I("unknown parameter (" + e + ")" + X(l) + ". possible values: " + Object.keys(r).join());
        }
        function He(e, r) {
          p(e) || I(
            "invalid parameter type" + X(r) + ". must be a typed array"
          );
        }
        function ye(e, r) {
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
        function ve(e, r, l) {
          ye(e, r) || I(
            "invalid parameter type" + X(l) + ". expected " + r + ", got " + typeof e
          );
        }
        function Pe(e, r) {
          e >= 0 && (e | 0) === e || I("invalid parameter type, (" + e + ")" + X(r) + ". must be a nonnegative integer");
        }
        function Ue(e, r, l) {
          r.indexOf(e) < 0 && I("invalid value" + X(l) + ". must be one of: " + r);
        }
        var Ke = [
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
        function Ft(e) {
          Object.keys(e).forEach(function(r) {
            Ke.indexOf(r) < 0 && I('invalid regl constructor argument "' + r + '". must be one of ' + Ke);
          });
        }
        function mt(e, r) {
          for (e = e + ""; e.length < r; )
            e = " " + e;
          return e;
        }
        function Fe() {
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
          var M = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(r);
          return M ? M[1] : "unknown";
        }
        function fr() {
          var e = new Error(), r = (e.stack || e).toString(), l = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(r);
          if (l)
            return l[1];
          var M = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(r);
          return M ? M[1] : "unknown";
        }
        function Bt(e, r) {
          var l = e.split(`
`), M = 1, $ = 0, G = {
            unknown: new Fe(),
            0: new Fe()
          };
          G.unknown.name = G[0].name = r || gt(), G.unknown.lines.push(new at(0, ""));
          for (var B = 0; B < l.length; ++B) {
            var Y = l[B], K = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(Y);
            if (K)
              switch (K[1]) {
                case "line":
                  var te = /(\d+)(\s+\d+)?/.exec(K[2]);
                  te && (M = te[1] | 0, te[2] && ($ = te[2] | 0, $ in G || (G[$] = new Fe())));
                  break;
                case "define":
                  var Q = /SHADER_NAME(_B64)?\s+(.*)$/.exec(K[2]);
                  Q && (G[$].name = Q[1] ? v(Q[2]) : Q[2]);
                  break;
              }
            G[$].lines.push(new at(M++, Y));
          }
          return Object.keys(G).forEach(function(ae) {
            var fe = G[ae];
            fe.lines.forEach(function(q) {
              fe.index[q.number] = q;
            });
          }), G;
        }
        function Cn(e) {
          var r = [];
          return e.split(`
`).forEach(function(l) {
            if (!(l.length < 5)) {
              var M = /^ERROR:\s+(\d+):(\d+):\s*(.*)$/.exec(l);
              M ? r.push(new Yt(
                M[1] | 0,
                M[2] | 0,
                M[3].trim()
              )) : l.length > 0 && r.push(new Yt("unknown", 0, l));
            }
          }), r;
        }
        function Fn(e, r) {
          r.forEach(function(l) {
            var M = e[l.file];
            if (M) {
              var $ = M.index[l.line];
              if ($) {
                $.errors.push(l), M.hasErrors = !0;
                return;
              }
            }
            e.unknown.hasErrors = !0, e.unknown.lines[0].errors.push(l);
          });
        }
        function Gn(e, r, l, M, $) {
          if (!e.getShaderParameter(r, e.COMPILE_STATUS)) {
            var G = e.getShaderInfoLog(r), B = M === e.FRAGMENT_SHADER ? "fragment" : "vertex";
            ne(l, "string", B + " shader source must be a string", $);
            var Y = Bt(l, $), K = Cn(G);
            Fn(Y, K), Object.keys(Y).forEach(function(te) {
              var Q = Y[te];
              if (!Q.hasErrors)
                return;
              var ae = [""], fe = [""];
              function q(ie, w) {
                ae.push(ie), fe.push(w || "");
              }
              q("file number " + te + ": " + Q.name + `
`, "color:red;text-decoration:underline;font-weight:bold"), Q.lines.forEach(function(ie) {
                if (ie.errors.length > 0) {
                  q(mt(ie.number, 4) + "|  ", "background-color:yellow; font-weight:bold"), q(ie.line + T, "color:red; background-color:yellow; font-weight:bold");
                  var w = 0;
                  ie.errors.forEach(function(N) {
                    var J = N.message, ce = /^\s*'(.*)'\s*:\s*(.*)$/.exec(J);
                    if (ce) {
                      var j = ce[1];
                      J = ce[2], j === "assign" && (j = "="), w = Math.max(ie.line.indexOf(j, w), 0);
                    } else
                      w = 0;
                    q(mt("| ", 6)), q(mt("^^^", w + 3) + T, "font-weight:bold"), q(mt("| ", 6)), q(J + T, "font-weight:bold");
                  }), q(mt("| ", 6) + T);
                } else
                  q(mt(ie.number, 4) + "|  "), q(ie.line + T, "color:red");
              }), typeof document < "u" && !window.chrome ? (fe[0] = ae.join("%c"), console.log.apply(console, fe)) : console.log(ae.join(""));
            }), R.raise("Error compiling " + B + " shader, " + Y[0].name);
          }
        }
        function wr(e, r, l, M, $) {
          if (!e.getProgramParameter(r, e.LINK_STATUS)) {
            var G = e.getProgramInfoLog(r), B = Bt(l, $), Y = Bt(M, $), K = 'Error linking program with vertex shader, "' + Y[0].name + '", and fragment shader "' + B[0].name + '"';
            typeof document < "u" ? console.log(
              "%c" + K + T + "%c" + G,
              "color:red;text-decoration:underline;font-weight:bold",
              "color:red"
            ) : console.log(K + T + G), R.raise(K);
          }
        }
        function Sr(e) {
          e._commandRef = gt();
        }
        function O(e, r, l, M) {
          Sr(e);
          function $(K) {
            return K ? M.id(K) : 0;
          }
          e._fragId = $(e.static.frag), e._vertId = $(e.static.vert);
          function G(K, te) {
            Object.keys(te).forEach(function(Q) {
              K[M.id(Q)] = !0;
            });
          }
          var B = e._uniformSet = {};
          G(B, r.static), G(B, r.dynamic);
          var Y = e._attributeSet = {};
          G(Y, l.static), G(Y, l.dynamic), e._hasCount = "count" in e.static || "count" in e.dynamic || "elements" in e.static || "elements" in e.dynamic;
        }
        function _(e, r) {
          var l = fr();
          I(e + " in command " + (r || gt()) + (l === "unknown" ? "" : " called from " + l));
        }
        function V(e, r, l) {
          e || _(r, l || gt());
        }
        function F(e, r, l, M) {
          e in r || _(
            "unknown parameter (" + e + ")" + X(l) + ". possible values: " + Object.keys(r).join(),
            M || gt()
          );
        }
        function ne(e, r, l, M) {
          ye(e, r) || _(
            "invalid parameter type" + X(l) + ". expected " + r + ", got " + typeof e,
            M || gt()
          );
        }
        function pe(e) {
          e();
        }
        function Me(e, r, l) {
          e.texture ? Ue(
            e.texture._texture.internalformat,
            r,
            "unsupported texture format for attachment"
          ) : Ue(
            e.renderbuffer._renderbuffer.format,
            l,
            "unsupported renderbuffer format for attachment"
          );
        }
        var Ne = 33071, Se = 9728, Ae = 9984, ze = 9985, vt = 9986, $e = 9987, Rt = 5120, Tt = 5121, At = 5122, Lr = 5123, it = 5124, pt = 5125, yt = 5126, Gt = 32819, Na = 32820, Da = 33635, Pa = 34042, eo = 36193, wt = {};
        wt[Rt] = wt[Tt] = 1, wt[At] = wt[Lr] = wt[eo] = wt[Da] = wt[Gt] = wt[Na] = 2, wt[it] = wt[pt] = wt[yt] = wt[Pa] = 4;
        function $a(e, r) {
          return e === Na || e === Gt || e === Da ? 2 : e === Pa ? 4 : wt[e] * r;
        }
        function Kr(e) {
          return !(e & e - 1) && !!e;
        }
        function to(e, r, l) {
          var M, $ = r.width, G = r.height, B = r.channels;
          R(
            $ > 0 && $ <= l.maxTextureSize && G > 0 && G <= l.maxTextureSize,
            "invalid texture shape"
          ), (e.wrapS !== Ne || e.wrapT !== Ne) && R(
            Kr($) && Kr(G),
            "incompatible wrap mode for texture, both width and height must be power of 2"
          ), r.mipmask === 1 ? $ !== 1 && G !== 1 && R(
            e.minFilter !== Ae && e.minFilter !== vt && e.minFilter !== ze && e.minFilter !== $e,
            "min filter requires mipmap"
          ) : (R(
            Kr($) && Kr(G),
            "texture must be a square power of 2 to support mipmapping"
          ), R(
            r.mipmask === ($ << 1) - 1,
            "missing or incomplete mipmap data"
          )), r.type === yt && (l.extensions.indexOf("oes_texture_float_linear") < 0 && R(
            e.minFilter === Se && e.magFilter === Se,
            "filter not supported, must enable oes_texture_float_linear"
          ), R(
            !e.genMipmaps,
            "mipmap generation not supported with float textures"
          ));
          var Y = r.images;
          for (M = 0; M < 16; ++M)
            if (Y[M]) {
              var K = $ >> M, te = G >> M;
              R(r.mipmask & 1 << M, "missing mipmap data");
              var Q = Y[M];
              if (R(
                Q.width === K && Q.height === te,
                "invalid shape for mip images"
              ), R(
                Q.format === r.format && Q.internalformat === r.internalformat && Q.type === r.type,
                "incompatible type for mip image"
              ), !Q.compressed) if (Q.data) {
                var ae = Math.ceil($a(Q.type, B) * K / Q.unpackAlignment) * Q.unpackAlignment;
                R(
                  Q.data.byteLength === ae * te,
                  "invalid data for image, buffer size is inconsistent with image format"
                );
              } else Q.element || Q.copy;
            } else e.genMipmaps || R((r.mipmask & 1 << M) === 0, "extra mipmap data");
          r.compressed && R(
            !e.genMipmaps,
            "mipmap generation for compressed images not supported"
          );
        }
        function ro(e, r, l, M) {
          var $ = e.width, G = e.height, B = e.channels;
          R(
            $ > 0 && $ <= M.maxTextureSize && G > 0 && G <= M.maxTextureSize,
            "invalid texture shape"
          ), R(
            $ === G,
            "cube map must be square"
          ), R(
            r.wrapS === Ne && r.wrapT === Ne,
            "wrap mode not supported by cube map"
          );
          for (var Y = 0; Y < l.length; ++Y) {
            var K = l[Y];
            R(
              K.width === $ && K.height === G,
              "inconsistent cube map face shape"
            ), r.genMipmaps && (R(
              !K.compressed,
              "can not generate mipmap for compressed textures"
            ), R(
              K.mipmask === 1,
              "can not specify mipmaps and generate mipmaps"
            ));
            for (var te = K.images, Q = 0; Q < 16; ++Q) {
              var ae = te[Q];
              if (ae) {
                var fe = $ >> Q, q = G >> Q;
                R(K.mipmask & 1 << Q, "missing mipmap data"), R(
                  ae.width === fe && ae.height === q,
                  "invalid shape for mip images"
                ), R(
                  ae.format === e.format && ae.internalformat === e.internalformat && ae.type === e.type,
                  "incompatible type for mip image"
                ), ae.compressed || (ae.data ? R(
                  ae.data.byteLength === fe * q * Math.max($a(ae.type, B), ae.unpackAlignment),
                  "invalid data for image, buffer size is inconsistent with image format"
                ) : ae.element || ae.copy);
              }
            }
          }
        }
        var f = b(R, {
          optional: pe,
          raise: I,
          commandRaise: _,
          command: V,
          parameter: ee,
          commandParameter: F,
          constructor: Ft,
          type: ve,
          commandType: ne,
          isTypedArray: He,
          nni: Pe,
          oneOf: Ue,
          shaderError: Gn,
          linkError: wr,
          callSite: fr,
          saveCommandRef: Sr,
          saveDrawInfo: O,
          framebufferFormat: Me,
          guessCommand: gt,
          texture2D: to,
          textureCube: ro
        }), no = 0, ao = 0, io = 5, so = 6;
        function qt(e, r) {
          this.id = no++, this.type = e, this.data = r;
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
          var M = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(e);
          if (M)
            return Rr(e.substr(0, M.index)).concat(Rr(M[1])).concat(Rr(e.substr(M.index + M[0].length)));
          var $ = e.split(".");
          if ($.length === 1)
            return ['"' + Ua(e) + '"'];
          for (var G = [], B = 0; B < $.length; ++B)
            G = G.concat(Rr($[B]));
          return G;
        }
        function za(e) {
          return "[" + Rr(e).join("][") + "]";
        }
        function oo(e, r) {
          return new qt(e, za(r + ""));
        }
        function fo(e) {
          return typeof e == "function" && !e._reglType || e instanceof qt;
        }
        function ja(e, r) {
          if (typeof e == "function")
            return new qt(ao, e);
          if (typeof e == "number" || typeof e == "boolean")
            return new qt(io, e);
          if (Array.isArray(e))
            return new qt(so, e.map((l, M) => ja(l, r + "[" + M + "]")));
          if (e instanceof qt)
            return e;
          f(!1, "invalid option type in uniform " + r);
        }
        var St = {
          DynamicVariable: qt,
          define: oo,
          isDynamic: fo,
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
        function uo() {
          var e = { "": 0 }, r = [""];
          return {
            id: function(l) {
              var M = e[l];
              return M || (M = e[l] = r.length, r.push(l), M);
            },
            str: function(l) {
              return r[l];
            }
          };
        }
        function co(e, r, l) {
          var M = document.createElement("canvas");
          b(M.style, {
            border: 0,
            margin: 0,
            padding: 0,
            top: 0,
            left: 0
          }), e.appendChild(M), e === document.body && (M.style.position = "absolute", b(e.style, {
            margin: 0,
            padding: 0
          }));
          function $() {
            var Y = window.innerWidth, K = window.innerHeight;
            if (e !== document.body) {
              var te = e.getBoundingClientRect();
              Y = te.right - te.left, K = te.bottom - te.top;
            }
            M.width = l * Y, M.height = l * K, b(M.style, {
              width: Y + "px",
              height: K + "px"
            });
          }
          var G;
          e !== document.body && typeof ResizeObserver == "function" ? (G = new ResizeObserver(function() {
            setTimeout($);
          }), G.observe(e)) : window.addEventListener("resize", $, !1);
          function B() {
            G ? G.disconnect() : window.removeEventListener("resize", $), e.removeChild(M);
          }
          return $(), {
            canvas: M,
            onDestroy: B
          };
        }
        function lo(e, r) {
          function l(M) {
            try {
              return e.getContext(M, r);
            } catch {
              return null;
            }
          }
          return l("webgl") || l("experimental-webgl") || l("webgl-experimental");
        }
        function ho(e) {
          return typeof e.nodeName == "string" && typeof e.appendChild == "function" && typeof e.getBoundingClientRect == "function";
        }
        function mo(e) {
          return typeof e.drawArrays == "function" || typeof e.drawElements == "function";
        }
        function Va(e) {
          return typeof e == "string" ? e.split() : (f(Array.isArray(e), "invalid extension array"), e);
        }
        function Ha(e) {
          return typeof e == "string" ? (f(typeof document < "u", "not supported outside of DOM"), document.querySelector(e)) : e;
        }
        function po(e) {
          var r = e || {}, l, M, $, G, B = {}, Y = [], K = [], te = typeof window > "u" ? 1 : window.devicePixelRatio, Q = !1, ae = function(ie) {
            ie && f.raise(ie);
          }, fe = function() {
          };
          if (typeof r == "string" ? (f(
            typeof document < "u",
            "selector queries only supported in DOM enviroments"
          ), l = document.querySelector(r), f(l, "invalid query string for element")) : typeof r == "object" ? ho(r) ? l = r : mo(r) ? (G = r, $ = G.canvas) : (f.constructor(r), "gl" in r ? G = r.gl : "canvas" in r ? $ = Ha(r.canvas) : "container" in r && (M = Ha(r.container)), "attributes" in r && (B = r.attributes, f.type(B, "object", "invalid context attributes")), "extensions" in r && (Y = Va(r.extensions)), "optionalExtensions" in r && (K = Va(r.optionalExtensions)), "onDone" in r && (f.type(
            r.onDone,
            "function",
            "invalid or missing onDone callback"
          ), ae = r.onDone), "profile" in r && (Q = !!r.profile), "pixelRatio" in r && (te = +r.pixelRatio, f(te > 0, "invalid pixel ratio"))) : f.raise("invalid arguments to regl"), l && (l.nodeName.toLowerCase() === "canvas" ? $ = l : M = l), !G) {
            if (!$) {
              f(
                typeof document < "u",
                "must manually specify webgl context outside of DOM environments"
              );
              var q = co(M || document.body, ae, te);
              if (!q)
                return null;
              $ = q.canvas, fe = q.onDestroy;
            }
            B.premultipliedAlpha === void 0 && (B.premultipliedAlpha = !0), G = lo($, B);
          }
          return G ? {
            gl: G,
            canvas: $,
            container: M,
            extensions: Y,
            optionalExtensions: K,
            pixelRatio: te,
            profile: Q,
            onDone: ae,
            onDestroy: fe
          } : (fe(), ae("webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org"), null);
        }
        function vo(e, r) {
          var l = {};
          function M(B) {
            f.type(B, "string", "extension name must be string");
            var Y = B.toLowerCase(), K;
            try {
              K = l[Y] = e.getExtension(Y);
            } catch {
            }
            return !!K;
          }
          for (var $ = 0; $ < r.extensions.length; ++$) {
            var G = r.extensions[$];
            if (!M(G))
              return r.onDestroy(), r.onDone('"' + G + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser'), null;
          }
          return r.optionalExtensions.forEach(M), {
            extensions: l,
            restore: function() {
              Object.keys(l).forEach(function(B) {
                if (l[B] && !M(B))
                  throw new Error("(regl): error restoring extension " + B);
              });
            }
          };
        }
        function Et(e, r) {
          for (var l = Array(e), M = 0; M < e; ++M)
            l[M] = r(M);
          return l;
        }
        var yo = 5120, bo = 5121, _o = 5122, go = 5123, Eo = 5124, xo = 5125, To = 5126;
        function Ao(e) {
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
          function r(G) {
            var B = Ao(G), Y = e[Wa(B) >> 2];
            return Y.length > 0 ? Y.pop() : new ArrayBuffer(B);
          }
          function l(G) {
            e[Wa(G.byteLength) >> 2].push(G);
          }
          function M(G, B) {
            var Y = null;
            switch (G) {
              case yo:
                Y = new Int8Array(r(B), 0, B);
                break;
              case bo:
                Y = new Uint8Array(r(B), 0, B);
                break;
              case _o:
                Y = new Int16Array(r(2 * B), 0, B);
                break;
              case go:
                Y = new Uint16Array(r(2 * B), 0, B);
                break;
              case Eo:
                Y = new Int32Array(r(4 * B), 0, B);
                break;
              case xo:
                Y = new Uint32Array(r(4 * B), 0, B);
                break;
              case To:
                Y = new Float32Array(r(4 * B), 0, B);
                break;
              default:
                return null;
            }
            return Y.length !== B ? Y.subarray(0, B) : Y;
          }
          function $(G) {
            l(G.buffer);
          }
          return {
            alloc: r,
            free: l,
            allocType: M,
            freeType: $
          };
        }
        var et = Ya();
        et.zero = Ya();
        var wo = 3408, So = 3410, Lo = 3411, Ro = 3412, Oo = 3413, Co = 3414, Fo = 3415, Go = 33901, Mo = 33902, ko = 3379, Io = 3386, Bo = 34921, No = 36347, Do = 36348, Po = 35661, $o = 35660, Uo = 34930, zo = 36349, jo = 34076, Xo = 34024, Vo = 7936, Ho = 7937, Wo = 7938, Yo = 35724, qo = 34047, Ko = 36063, Qo = 34852, Qr = 3553, qa = 34067, Zo = 34069, Jo = 33984, Or = 6408, kn = 5126, Ka = 5121, In = 36160, ef = 36053, tf = 36064, rf = 16384, nf = function(e, r) {
          var l = 1;
          r.ext_texture_filter_anisotropic && (l = e.getParameter(qo));
          var M = 1, $ = 1;
          r.webgl_draw_buffers && (M = e.getParameter(Qo), $ = e.getParameter(Ko));
          var G = !!r.oes_texture_float;
          if (G) {
            var B = e.createTexture();
            e.bindTexture(Qr, B), e.texImage2D(Qr, 0, Or, 1, 1, 0, Or, kn, null);
            var Y = e.createFramebuffer();
            if (e.bindFramebuffer(In, Y), e.framebufferTexture2D(In, tf, Qr, B, 0), e.bindTexture(Qr, null), e.checkFramebufferStatus(In) !== ef) G = !1;
            else {
              e.viewport(0, 0, 1, 1), e.clearColor(1, 0, 0, 1), e.clear(rf);
              var K = et.allocType(kn, 4);
              e.readPixels(0, 0, 1, 1, Or, kn, K), e.getError() ? G = !1 : (e.deleteFramebuffer(Y), e.deleteTexture(B), G = K[0] === 1), et.freeType(K);
            }
          }
          var te = typeof navigator < "u" && (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion) || /Edge/.test(navigator.userAgent)), Q = !0;
          if (!te) {
            var ae = e.createTexture(), fe = et.allocType(Ka, 36);
            e.activeTexture(Jo), e.bindTexture(qa, ae), e.texImage2D(Zo, 0, Or, 3, 3, 0, Or, Ka, fe), et.freeType(fe), e.bindTexture(qa, null), e.deleteTexture(ae), Q = !e.getError();
          }
          return {
            // drawing buffer bit depth
            colorBits: [
              e.getParameter(So),
              e.getParameter(Lo),
              e.getParameter(Ro),
              e.getParameter(Oo)
            ],
            depthBits: e.getParameter(Co),
            stencilBits: e.getParameter(Fo),
            subpixelBits: e.getParameter(wo),
            // supported extensions
            extensions: Object.keys(r).filter(function(q) {
              return !!r[q];
            }),
            // max aniso samples
            maxAnisotropic: l,
            // max draw buffers
            maxDrawbuffers: M,
            maxColorAttachments: $,
            // point and line size ranges
            pointSizeDims: e.getParameter(Go),
            lineWidthDims: e.getParameter(Mo),
            maxViewportDims: e.getParameter(Io),
            maxCombinedTextureUnits: e.getParameter(Po),
            maxCubeMapSize: e.getParameter(jo),
            maxRenderbufferSize: e.getParameter(Xo),
            maxTextureUnits: e.getParameter(Uo),
            maxTextureSize: e.getParameter(ko),
            maxAttributes: e.getParameter(Bo),
            maxVertexUniforms: e.getParameter(No),
            maxVertexTextureUnits: e.getParameter($o),
            maxVaryingVectors: e.getParameter(Do),
            maxFragmentUniforms: e.getParameter(zo),
            // vendor info
            glsl: e.getParameter(Yo),
            renderer: e.getParameter(Ho),
            vendor: e.getParameter(Vo),
            version: e.getParameter(Wo),
            // quirks
            readFloat: G,
            npotTextureCube: Q
          };
        };
        function Mt(e) {
          return !!e && typeof e == "object" && Array.isArray(e.shape) && Array.isArray(e.stride) && typeof e.offset == "number" && e.shape.length === e.stride.length && (Array.isArray(e.data) || p(e.data));
        }
        var Lt = function(e) {
          return Object.keys(e).map(function(r) {
            return e[r];
          });
        }, Zr = {
          shape: ff,
          flatten: of
        };
        function af(e, r, l) {
          for (var M = 0; M < r; ++M)
            l[M] = e[M];
        }
        function sf(e, r, l, M) {
          for (var $ = 0, G = 0; G < r; ++G)
            for (var B = e[G], Y = 0; Y < l; ++Y)
              M[$++] = B[Y];
        }
        function Qa(e, r, l, M, $, G) {
          for (var B = G, Y = 0; Y < r; ++Y)
            for (var K = e[Y], te = 0; te < l; ++te)
              for (var Q = K[te], ae = 0; ae < M; ++ae)
                $[B++] = Q[ae];
        }
        function Za(e, r, l, M, $) {
          for (var G = 1, B = l + 1; B < r.length; ++B)
            G *= r[B];
          var Y = r[l];
          if (r.length - l === 4) {
            var K = r[l + 1], te = r[l + 2], Q = r[l + 3];
            for (B = 0; B < Y; ++B)
              Qa(e[B], K, te, Q, M, $), $ += G;
          } else
            for (B = 0; B < Y; ++B)
              Za(e[B], r, l + 1, M, $), $ += G;
        }
        function of(e, r, l, M) {
          var $ = 1;
          if (r.length)
            for (var G = 0; G < r.length; ++G)
              $ *= r[G];
          else
            $ = 0;
          var B = M || et.allocType(l, $);
          switch (r.length) {
            case 0:
              break;
            case 1:
              af(e, r[0], B);
              break;
            case 2:
              sf(e, r[0], r[1], B);
              break;
            case 3:
              Qa(e, r[0], r[1], r[2], B, 0);
              break;
            default:
              Za(e, r, 0, B, 0);
          }
          return B;
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
        }, uf = 5120, cf = 5122, lf = 5124, hf = 5121, df = 5123, mf = 5125, pf = 5126, vf = 5126, Kt = {
          int8: uf,
          int16: cf,
          int32: lf,
          uint8: hf,
          uint16: df,
          uint32: mf,
          float: pf,
          float32: vf
        }, yf = 35048, bf = 35040, Jr = {
          dynamic: yf,
          stream: bf,
          static: 35044
        }, Nn = Zr.flatten, Ja = Zr.shape, ei = 35044, _f = 35040, Dn = 5121, Pn = 5126, jt = [];
        jt[5120] = 1, jt[5122] = 2, jt[5124] = 4, jt[5121] = 1, jt[5123] = 2, jt[5125] = 4, jt[5126] = 4;
        function en(e) {
          return Bn[Object.prototype.toString.call(e)] | 0;
        }
        function ti(e, r) {
          for (var l = 0; l < r.length; ++l)
            e[l] = r[l];
        }
        function ri(e, r, l, M, $, G, B) {
          for (var Y = 0, K = 0; K < l; ++K)
            for (var te = 0; te < M; ++te)
              e[Y++] = r[$ * K + G * te + B];
        }
        function gf(e, r, l, M) {
          var $ = 0, G = {};
          function B(w) {
            this.id = $++, this.buffer = e.createBuffer(), this.type = w, this.usage = ei, this.byteLength = 0, this.dimension = 1, this.dtype = Dn, this.persistentData = null, l.profile && (this.stats = { size: 0 });
          }
          B.prototype.bind = function() {
            e.bindBuffer(this.type, this.buffer);
          }, B.prototype.destroy = function() {
            fe(this);
          };
          var Y = [];
          function K(w, N) {
            var J = Y.pop();
            return J || (J = new B(w)), J.bind(), ae(J, N, _f, 0, 1, !1), J;
          }
          function te(w) {
            Y.push(w);
          }
          function Q(w, N, J) {
            w.byteLength = N.byteLength, e.bufferData(w.type, N, J);
          }
          function ae(w, N, J, ce, j, le) {
            var W;
            if (w.usage = J, Array.isArray(N)) {
              if (w.dtype = ce || Pn, N.length > 0) {
                var se;
                if (Array.isArray(N[0])) {
                  W = Ja(N);
                  for (var H = 1, oe = 1; oe < W.length; ++oe)
                    H *= W[oe];
                  w.dimension = H, se = Nn(N, W, w.dtype), Q(w, se, J), le ? w.persistentData = se : et.freeType(se);
                } else if (typeof N[0] == "number") {
                  w.dimension = j;
                  var _e = et.allocType(w.dtype, N.length);
                  ti(_e, N), Q(w, _e, J), le ? w.persistentData = _e : et.freeType(_e);
                } else p(N[0]) ? (w.dimension = N[0].length, w.dtype = ce || en(N[0]) || Pn, se = Nn(
                  N,
                  [N.length, N[0].length],
                  w.dtype
                ), Q(w, se, J), le ? w.persistentData = se : et.freeType(se)) : f.raise("invalid buffer data");
              }
            } else if (p(N))
              w.dtype = ce || en(N), w.dimension = j, Q(w, N, J), le && (w.persistentData = new Uint8Array(new Uint8Array(N.buffer)));
            else if (Mt(N)) {
              W = N.shape;
              var Te = N.stride, ue = N.offset, re = 0, z = 0, xe = 0, Re = 0;
              W.length === 1 ? (re = W[0], z = 1, xe = Te[0], Re = 0) : W.length === 2 ? (re = W[0], z = W[1], xe = Te[0], Re = Te[1]) : f.raise("invalid shape"), w.dtype = ce || en(N.data) || Pn, w.dimension = z;
              var de = et.allocType(w.dtype, re * z);
              ri(
                de,
                N.data,
                re,
                z,
                xe,
                Re,
                ue
              ), Q(w, de, J), le ? w.persistentData = de : et.freeType(de);
            } else N instanceof ArrayBuffer ? (w.dtype = Dn, w.dimension = j, Q(w, N, J), le && (w.persistentData = new Uint8Array(new Uint8Array(N)))) : f.raise("invalid buffer data");
          }
          function fe(w) {
            r.bufferCount--, M(w);
            var N = w.buffer;
            f(N, "buffer must not be deleted already"), e.deleteBuffer(N), w.buffer = null, delete G[w.id];
          }
          function q(w, N, J, ce) {
            r.bufferCount++;
            var j = new B(N);
            G[j.id] = j;
            function le(H) {
              var oe = ei, _e = null, Te = 0, ue = 0, re = 1;
              return Array.isArray(H) || p(H) || Mt(H) || H instanceof ArrayBuffer ? _e = H : typeof H == "number" ? Te = H | 0 : H && (f.type(
                H,
                "object",
                "buffer arguments must be an object, a number or an array"
              ), "data" in H && (f(
                _e === null || Array.isArray(_e) || p(_e) || Mt(_e),
                "invalid data for buffer"
              ), _e = H.data), "usage" in H && (f.parameter(H.usage, Jr, "invalid buffer usage"), oe = Jr[H.usage]), "type" in H && (f.parameter(H.type, Kt, "invalid buffer type"), ue = Kt[H.type]), "dimension" in H && (f.type(H.dimension, "number", "invalid dimension"), re = H.dimension | 0), "length" in H && (f.nni(Te, "buffer length must be a nonnegative integer"), Te = H.length | 0)), j.bind(), _e ? ae(j, _e, oe, ue, re, ce) : (Te && e.bufferData(j.type, Te, oe), j.dtype = ue || Dn, j.usage = oe, j.dimension = re, j.byteLength = Te), l.profile && (j.stats.size = j.byteLength * jt[j.dtype]), le;
            }
            function W(H, oe) {
              f(
                oe + H.byteLength <= j.byteLength,
                "invalid buffer subdata call, buffer is too small.  Can't write data of size " + H.byteLength + " starting from offset " + oe + " to a buffer of size " + j.byteLength
              ), e.bufferSubData(j.type, oe, H);
            }
            function se(H, oe) {
              var _e = (oe || 0) | 0, Te;
              if (j.bind(), p(H) || H instanceof ArrayBuffer)
                W(H, _e);
              else if (Array.isArray(H)) {
                if (H.length > 0)
                  if (typeof H[0] == "number") {
                    var ue = et.allocType(j.dtype, H.length);
                    ti(ue, H), W(ue, _e), et.freeType(ue);
                  } else if (Array.isArray(H[0]) || p(H[0])) {
                    Te = Ja(H);
                    var re = Nn(H, Te, j.dtype);
                    W(re, _e), et.freeType(re);
                  } else
                    f.raise("invalid buffer data");
              } else if (Mt(H)) {
                Te = H.shape;
                var z = H.stride, xe = 0, Re = 0, de = 0, ke = 0;
                Te.length === 1 ? (xe = Te[0], Re = 1, de = z[0], ke = 0) : Te.length === 2 ? (xe = Te[0], Re = Te[1], de = z[0], ke = z[1]) : f.raise("invalid shape");
                var we = Array.isArray(H.data) ? j.dtype : en(H.data), Ge = et.allocType(we, xe * Re);
                ri(
                  Ge,
                  H.data,
                  xe,
                  Re,
                  de,
                  ke,
                  H.offset
                ), W(Ge, _e), et.freeType(Ge);
              } else
                f.raise("invalid data for buffer subdata");
              return le;
            }
            return J || le(w), le._reglType = "buffer", le._buffer = j, le.subdata = se, l.profile && (le.stats = j.stats), le.destroy = function() {
              fe(j);
            }, le;
          }
          function ie() {
            Lt(G).forEach(function(w) {
              w.buffer = e.createBuffer(), e.bindBuffer(w.type, w.buffer), e.bufferData(
                w.type,
                w.persistentData || w.byteLength,
                w.usage
              );
            });
          }
          return l.profile && (r.getTotalBufferSize = function() {
            var w = 0;
            return Object.keys(G).forEach(function(N) {
              w += G[N].stats.size;
            }), w;
          }), {
            create: q,
            createStream: K,
            destroyStream: te,
            clear: function() {
              Lt(G).forEach(fe), Y.forEach(fe);
            },
            getBuffer: function(w) {
              return w && w._buffer instanceof B ? w._buffer : null;
            },
            restore: ie,
            _initBuffer: ae
          };
        }
        var Ef = 0, xf = 0, Tf = 1, Af = 1, wf = 4, Sf = 4, ur = {
          points: Ef,
          point: xf,
          lines: Tf,
          line: Af,
          triangles: wf,
          triangle: Sf,
          "line loop": 2,
          "line strip": 3,
          "triangle strip": 5,
          "triangle fan": 6
        }, Lf = 0, Rf = 1, Cr = 4, Of = 5120, cr = 5121, ni = 5122, lr = 5123, ai = 5124, Qt = 5125, $n = 34963, Cf = 35040, Ff = 35044;
        function Gf(e, r, l, M) {
          var $ = {}, G = 0, B = {
            uint8: cr,
            uint16: lr
          };
          r.oes_element_index_uint && (B.uint32 = Qt);
          function Y(ie) {
            this.id = G++, $[this.id] = this, this.buffer = ie, this.primType = Cr, this.vertCount = 0, this.type = 0;
          }
          Y.prototype.bind = function() {
            this.buffer.bind();
          };
          var K = [];
          function te(ie) {
            var w = K.pop();
            return w || (w = new Y(l.create(
              null,
              $n,
              !0,
              !1
            )._buffer)), ae(w, ie, Cf, -1, -1, 0, 0), w;
          }
          function Q(ie) {
            K.push(ie);
          }
          function ae(ie, w, N, J, ce, j, le) {
            ie.buffer.bind();
            var W;
            if (w) {
              var se = le;
              !le && (!p(w) || Mt(w) && !p(w.data)) && (se = r.oes_element_index_uint ? Qt : lr), l._initBuffer(
                ie.buffer,
                w,
                N,
                se,
                3
              );
            } else
              e.bufferData($n, j, N), ie.buffer.dtype = W || cr, ie.buffer.usage = N, ie.buffer.dimension = 3, ie.buffer.byteLength = j;
            if (W = le, !le) {
              switch (ie.buffer.dtype) {
                case cr:
                case Of:
                  W = cr;
                  break;
                case lr:
                case ni:
                  W = lr;
                  break;
                case Qt:
                case ai:
                  W = Qt;
                  break;
                default:
                  f.raise("unsupported type for element array");
              }
              ie.buffer.dtype = W;
            }
            ie.type = W, f(
              W !== Qt || !!r.oes_element_index_uint,
              "32 bit element buffers not supported, enable oes_element_index_uint first"
            );
            var H = ce;
            H < 0 && (H = ie.buffer.byteLength, W === lr ? H >>= 1 : W === Qt && (H >>= 2)), ie.vertCount = H;
            var oe = J;
            if (J < 0) {
              oe = Cr;
              var _e = ie.buffer.dimension;
              _e === 1 && (oe = Lf), _e === 2 && (oe = Rf), _e === 3 && (oe = Cr);
            }
            ie.primType = oe;
          }
          function fe(ie) {
            M.elementsCount--, f(ie.buffer !== null, "must not double destroy elements"), delete $[ie.id], ie.buffer.destroy(), ie.buffer = null;
          }
          function q(ie, w) {
            var N = l.create(null, $n, !0), J = new Y(N._buffer);
            M.elementsCount++;
            function ce(j) {
              if (!j)
                N(), J.primType = Cr, J.vertCount = 0, J.type = cr;
              else if (typeof j == "number")
                N(j), J.primType = Cr, J.vertCount = j | 0, J.type = cr;
              else {
                var le = null, W = Ff, se = -1, H = -1, oe = 0, _e = 0;
                Array.isArray(j) || p(j) || Mt(j) ? le = j : (f.type(j, "object", "invalid arguments for elements"), "data" in j && (le = j.data, f(
                  Array.isArray(le) || p(le) || Mt(le),
                  "invalid data for element buffer"
                )), "usage" in j && (f.parameter(
                  j.usage,
                  Jr,
                  "invalid element buffer usage"
                ), W = Jr[j.usage]), "primitive" in j && (f.parameter(
                  j.primitive,
                  ur,
                  "invalid element buffer primitive"
                ), se = ur[j.primitive]), "count" in j && (f(
                  typeof j.count == "number" && j.count >= 0,
                  "invalid vertex count for elements"
                ), H = j.count | 0), "type" in j && (f.parameter(
                  j.type,
                  B,
                  "invalid buffer type"
                ), _e = B[j.type]), "length" in j ? oe = j.length | 0 : (oe = H, _e === lr || _e === ni ? oe *= 2 : (_e === Qt || _e === ai) && (oe *= 4))), ae(
                  J,
                  le,
                  W,
                  se,
                  H,
                  oe,
                  _e
                );
              }
              return ce;
            }
            return ce(ie), ce._reglType = "elements", ce._elements = J, ce.subdata = function(j, le) {
              return N.subdata(j, le), ce;
            }, ce.destroy = function() {
              fe(J);
            }, ce;
          }
          return {
            create: q,
            createStream: te,
            destroyStream: Q,
            getElements: function(ie) {
              return typeof ie == "function" && ie._elements instanceof Y ? ie._elements : null;
            },
            clear: function() {
              Lt($).forEach(fe);
            }
          };
        }
        var ii = new Float32Array(1), Mf = new Uint32Array(ii.buffer), kf = 5123;
        function si(e) {
          for (var r = et.allocType(kf, e.length), l = 0; l < e.length; ++l)
            if (isNaN(e[l]))
              r[l] = 65535;
            else if (e[l] === 1 / 0)
              r[l] = 31744;
            else if (e[l] === -1 / 0)
              r[l] = 64512;
            else {
              ii[0] = e[l];
              var M = Mf[0], $ = M >>> 31 << 15, G = (M << 1 >>> 24) - 127, B = M >> 13 & 1023;
              if (G < -24)
                r[l] = $;
              else if (G < -14) {
                var Y = -14 - G;
                r[l] = $ + (B + 1024 >> Y);
              } else G > 15 ? r[l] = $ + 31744 : r[l] = $ + (G + 15 << 10) + B;
            }
          return r;
        }
        function Qe(e) {
          return Array.isArray(e) || p(e);
        }
        var oi = function(e) {
          return !(e & e - 1) && !!e;
        }, If = 34467, Nt = 3553, Un = 34067, tn = 34069, Zt = 6408, zn = 6406, rn = 6407, Fr = 6409, nn = 6410, fi = 32854, jn = 32855, ui = 36194, Bf = 32819, Nf = 32820, Df = 33635, Pf = 34042, Xn = 6402, an = 34041, Vn = 35904, Hn = 35906, hr = 36193, Wn = 33776, Yn = 33777, qn = 33778, Kn = 33779, ci = 35986, li = 35987, hi = 34798, di = 35840, mi = 35841, pi = 35842, vi = 35843, yi = 36196, dr = 5121, Qn = 5123, Zn = 5125, Gr = 5126, $f = 10242, Uf = 10243, zf = 10497, Jn = 33071, jf = 33648, Xf = 10240, Vf = 10241, ea = 9728, Hf = 9729, ta = 9984, bi = 9985, _i = 9986, ra = 9987, Wf = 33170, sn = 4352, Yf = 4353, qf = 4354, Kf = 34046, Qf = 3317, Zf = 37440, Jf = 37441, eu = 37443, gi = 37444, Mr = 33984, tu = [
          ta,
          _i,
          bi,
          ra
        ], on = [
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
        var Ei = mr("HTMLCanvasElement"), xi = mr("OffscreenCanvas"), Ti = mr("CanvasRenderingContext2D"), Ai = mr("ImageBitmap"), wi = mr("HTMLImageElement"), Si = mr("HTMLVideoElement"), ru = Object.keys(Bn).concat([
          Ei,
          xi,
          Ti,
          Ai,
          wi,
          Si
        ]), pr = [];
        pr[dr] = 1, pr[Gr] = 4, pr[hr] = 2, pr[Qn] = 2, pr[Zn] = 4;
        var lt = [];
        lt[fi] = 2, lt[jn] = 2, lt[ui] = 2, lt[an] = 4, lt[Wn] = 0.5, lt[Yn] = 0.5, lt[qn] = 1, lt[Kn] = 1, lt[ci] = 0.5, lt[li] = 1, lt[hi] = 1, lt[di] = 0.5, lt[mi] = 0.25, lt[pi] = 0.5, lt[vi] = 0.25, lt[yi] = 0.5;
        function Li(e) {
          return Array.isArray(e) && (e.length === 0 || typeof e[0] == "number");
        }
        function Ri(e) {
          if (!Array.isArray(e))
            return !1;
          var r = e.length;
          return !(r === 0 || !Qe(e[0]));
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
          return Jt(e) === Ti;
        }
        function au(e) {
          return Jt(e) === Ai;
        }
        function iu(e) {
          return Jt(e) === wi;
        }
        function su(e) {
          return Jt(e) === Si;
        }
        function na(e) {
          if (!e)
            return !1;
          var r = Jt(e);
          return ru.indexOf(r) >= 0 ? !0 : Li(e) || Ri(e) || Mt(e);
        }
        function Fi(e) {
          return Bn[Object.prototype.toString.call(e)] | 0;
        }
        function ou(e, r) {
          var l = r.length;
          switch (e.type) {
            case dr:
            case Qn:
            case Zn:
            case Gr:
              var M = et.allocType(e.type, l);
              M.set(r), e.data = M;
              break;
            case hr:
              e.data = si(r);
              break;
            default:
              f.raise("unsupported texture type, must specify a typed array");
          }
        }
        function Gi(e, r) {
          return et.allocType(
            e.type === hr ? Gr : e.type,
            r
          );
        }
        function Mi(e, r) {
          e.type === hr ? (e.data = si(r), et.freeType(r)) : e.data = r;
        }
        function fu(e, r, l, M, $, G) {
          for (var B = e.width, Y = e.height, K = e.channels, te = B * Y * K, Q = Gi(e, te), ae = 0, fe = 0; fe < Y; ++fe)
            for (var q = 0; q < B; ++q)
              for (var ie = 0; ie < K; ++ie)
                Q[ae++] = r[l * q + M * fe + $ * ie + G];
          Mi(e, Q);
        }
        function fn(e, r, l, M, $, G) {
          var B;
          if (typeof lt[e] < "u" ? B = lt[e] : B = Ot[e] * pr[r], G && (B *= 6), $) {
            for (var Y = 0, K = l; K >= 1; )
              Y += B * K * K, K /= 2;
            return Y;
          } else
            return B * l * M;
        }
        function uu(e, r, l, M, $, G, B) {
          var Y = {
            "don't care": sn,
            "dont care": sn,
            nice: qf,
            fast: Yf
          }, K = {
            repeat: zf,
            clamp: Jn,
            mirror: jf
          }, te = {
            nearest: ea,
            linear: Hf
          }, Q = b({
            mipmap: ra,
            "nearest mipmap nearest": ta,
            "linear mipmap nearest": bi,
            "nearest mipmap linear": _i,
            "linear mipmap linear": ra
          }, te), ae = {
            none: 0,
            browser: gi
          }, fe = {
            uint8: dr,
            rgba4: Bf,
            rgb565: Df,
            "rgb5 a1": Nf
          }, q = {
            alpha: zn,
            luminance: Fr,
            "luminance alpha": nn,
            rgb: rn,
            rgba: Zt,
            rgba4: fi,
            "rgb5 a1": jn,
            rgb565: ui
          }, ie = {};
          r.ext_srgb && (q.srgb = Vn, q.srgba = Hn), r.oes_texture_float && (fe.float32 = fe.float = Gr), r.oes_texture_half_float && (fe.float16 = fe["half float"] = hr), r.webgl_depth_texture && (b(q, {
            depth: Xn,
            "depth stencil": an
          }), b(fe, {
            uint16: Qn,
            uint32: Zn,
            "depth stencil": Pf
          })), r.webgl_compressed_texture_s3tc && b(ie, {
            "rgb s3tc dxt1": Wn,
            "rgba s3tc dxt1": Yn,
            "rgba s3tc dxt3": qn,
            "rgba s3tc dxt5": Kn
          }), r.webgl_compressed_texture_atc && b(ie, {
            "rgb atc": ci,
            "rgba atc explicit alpha": li,
            "rgba atc interpolated alpha": hi
          }), r.webgl_compressed_texture_pvrtc && b(ie, {
            "rgb pvrtc 4bppv1": di,
            "rgb pvrtc 2bppv1": mi,
            "rgba pvrtc 4bppv1": pi,
            "rgba pvrtc 2bppv1": vi
          }), r.webgl_compressed_texture_etc1 && (ie["rgb etc1"] = yi);
          var w = Array.prototype.slice.call(
            e.getParameter(If)
          );
          Object.keys(ie).forEach(function(c) {
            var k = ie[c];
            w.indexOf(k) >= 0 && (q[c] = k);
          });
          var N = Object.keys(q);
          l.textureFormats = N;
          var J = [];
          Object.keys(q).forEach(function(c) {
            var k = q[c];
            J[k] = c;
          });
          var ce = [];
          Object.keys(fe).forEach(function(c) {
            var k = fe[c];
            ce[k] = c;
          });
          var j = [];
          Object.keys(te).forEach(function(c) {
            var k = te[c];
            j[k] = c;
          });
          var le = [];
          Object.keys(Q).forEach(function(c) {
            var k = Q[c];
            le[k] = c;
          });
          var W = [];
          Object.keys(K).forEach(function(c) {
            var k = K[c];
            W[k] = c;
          });
          var se = N.reduce(function(c, k) {
            var C = q[k];
            return C === Fr || C === zn || C === Fr || C === nn || C === Xn || C === an || r.ext_srgb && (C === Vn || C === Hn) ? c[C] = C : C === jn || k.indexOf("rgba") >= 0 ? c[C] = Zt : c[C] = rn, c;
          }, {});
          function H() {
            this.internalformat = Zt, this.format = Zt, this.type = dr, this.compressed = !1, this.premultiplyAlpha = !1, this.flipY = !1, this.unpackAlignment = 1, this.colorSpace = gi, this.width = 0, this.height = 0, this.channels = 0;
          }
          function oe(c, k) {
            c.internalformat = k.internalformat, c.format = k.format, c.type = k.type, c.compressed = k.compressed, c.premultiplyAlpha = k.premultiplyAlpha, c.flipY = k.flipY, c.unpackAlignment = k.unpackAlignment, c.colorSpace = k.colorSpace, c.width = k.width, c.height = k.height, c.channels = k.channels;
          }
          function _e(c, k) {
            if (!(typeof k != "object" || !k)) {
              if ("premultiplyAlpha" in k && (f.type(
                k.premultiplyAlpha,
                "boolean",
                "invalid premultiplyAlpha"
              ), c.premultiplyAlpha = k.premultiplyAlpha), "flipY" in k && (f.type(
                k.flipY,
                "boolean",
                "invalid texture flip"
              ), c.flipY = k.flipY), "alignment" in k && (f.oneOf(
                k.alignment,
                [1, 2, 4, 8],
                "invalid texture unpack alignment"
              ), c.unpackAlignment = k.alignment), "colorSpace" in k && (f.parameter(
                k.colorSpace,
                ae,
                "invalid colorSpace"
              ), c.colorSpace = ae[k.colorSpace]), "type" in k) {
                var C = k.type;
                f(
                  r.oes_texture_float || !(C === "float" || C === "float32"),
                  "you must enable the OES_texture_float extension in order to use floating point textures."
                ), f(
                  r.oes_texture_half_float || !(C === "half float" || C === "float16"),
                  "you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures."
                ), f(
                  r.webgl_depth_texture || !(C === "uint16" || C === "uint32" || C === "depth stencil"),
                  "you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures."
                ), f.parameter(
                  C,
                  fe,
                  "invalid texture type"
                ), c.type = fe[C];
              }
              var he = c.width, Ie = c.height, s = c.channels, t = !1;
              "shape" in k ? (f(
                Array.isArray(k.shape) && k.shape.length >= 2,
                "shape must be an array"
              ), he = k.shape[0], Ie = k.shape[1], k.shape.length === 3 && (s = k.shape[2], f(s > 0 && s <= 4, "invalid number of channels"), t = !0), f(he >= 0 && he <= l.maxTextureSize, "invalid width"), f(Ie >= 0 && Ie <= l.maxTextureSize, "invalid height")) : ("radius" in k && (he = Ie = k.radius, f(he >= 0 && he <= l.maxTextureSize, "invalid radius")), "width" in k && (he = k.width, f(he >= 0 && he <= l.maxTextureSize, "invalid width")), "height" in k && (Ie = k.height, f(Ie >= 0 && Ie <= l.maxTextureSize, "invalid height")), "channels" in k && (s = k.channels, f(s > 0 && s <= 4, "invalid number of channels"), t = !0)), c.width = he | 0, c.height = Ie | 0, c.channels = s | 0;
              var d = !1;
              if ("format" in k) {
                var A = k.format;
                f(
                  r.webgl_depth_texture || !(A === "depth" || A === "depth stencil"),
                  "you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures."
                ), f.parameter(
                  A,
                  q,
                  "invalid texture format"
                );
                var S = c.internalformat = q[A];
                c.format = se[S], A in fe && ("type" in k || (c.type = fe[A])), A in ie && (c.compressed = !0), d = !0;
              }
              !t && d ? c.channels = Ot[c.format] : t && !d ? c.channels !== on[c.format] && (c.format = c.internalformat = on[c.channels]) : d && t && f(
                c.channels === Ot[c.format],
                "number of channels inconsistent with specified format"
              );
            }
          }
          function Te(c) {
            e.pixelStorei(Zf, c.flipY), e.pixelStorei(Jf, c.premultiplyAlpha), e.pixelStorei(eu, c.colorSpace), e.pixelStorei(Qf, c.unpackAlignment);
          }
          function ue() {
            H.call(this), this.xOffset = 0, this.yOffset = 0, this.data = null, this.needsFree = !1, this.element = null, this.needsCopy = !1;
          }
          function re(c, k) {
            var C = null;
            if (na(k) ? C = k : k && (f.type(k, "object", "invalid pixel data type"), _e(c, k), "x" in k && (c.xOffset = k.x | 0), "y" in k && (c.yOffset = k.y | 0), na(k.data) && (C = k.data)), f(
              !c.compressed || C instanceof Uint8Array,
              "compressed texture data must be stored in a uint8array"
            ), k.copy) {
              f(!C, "can not specify copy and data field for the same texture");
              var he = $.viewportWidth, Ie = $.viewportHeight;
              c.width = c.width || he - c.xOffset, c.height = c.height || Ie - c.yOffset, c.needsCopy = !0, f(
                c.xOffset >= 0 && c.xOffset < he && c.yOffset >= 0 && c.yOffset < Ie && c.width > 0 && c.width <= he && c.height > 0 && c.height <= Ie,
                "copy texture read out of bounds"
              );
            } else if (!C)
              c.width = c.width || 1, c.height = c.height || 1, c.channels = c.channels || 4;
            else if (p(C))
              c.channels = c.channels || 4, c.data = C, !("type" in k) && c.type === dr && (c.type = Fi(C));
            else if (Li(C))
              c.channels = c.channels || 4, ou(c, C), c.alignment = 1, c.needsFree = !0;
            else if (Mt(C)) {
              var s = C.data;
              !Array.isArray(s) && c.type === dr && (c.type = Fi(s));
              var t = C.shape, d = C.stride, A, S, y, m, g, o;
              t.length === 3 ? (y = t[2], o = d[2]) : (f(t.length === 2, "invalid ndarray pixel data, must be 2 or 3D"), y = 1, o = 1), A = t[0], S = t[1], m = d[0], g = d[1], c.alignment = 1, c.width = A, c.height = S, c.channels = y, c.format = c.internalformat = on[y], c.needsFree = !0, fu(c, s, m, g, o, C.offset);
            } else if (Oi(C) || Ci(C) || nu(C))
              Oi(C) || Ci(C) ? c.element = C : c.element = C.canvas, c.width = c.element.width, c.height = c.element.height, c.channels = 4;
            else if (au(C))
              c.element = C, c.width = C.width, c.height = C.height, c.channels = 4;
            else if (iu(C))
              c.element = C, c.width = C.naturalWidth, c.height = C.naturalHeight, c.channels = 4;
            else if (su(C))
              c.element = C, c.width = C.videoWidth, c.height = C.videoHeight, c.channels = 4;
            else if (Ri(C)) {
              var h = c.width || C[0].length, i = c.height || C.length, E = c.channels;
              Qe(C[0][0]) ? E = E || C[0][0].length : E = E || 1;
              for (var L = Zr.shape(C), P = 1, U = 0; U < L.length; ++U)
                P *= L[U];
              var D = Gi(c, P);
              Zr.flatten(C, L, "", D), Mi(c, D), c.alignment = 1, c.width = h, c.height = i, c.channels = E, c.format = c.internalformat = on[E], c.needsFree = !0;
            }
            c.type === Gr ? f(
              l.extensions.indexOf("oes_texture_float") >= 0,
              "oes_texture_float extension not enabled"
            ) : c.type === hr && f(
              l.extensions.indexOf("oes_texture_half_float") >= 0,
              "oes_texture_half_float extension not enabled"
            );
          }
          function z(c, k, C) {
            var he = c.element, Ie = c.data, s = c.internalformat, t = c.format, d = c.type, A = c.width, S = c.height;
            Te(c), he ? e.texImage2D(k, C, t, t, d, he) : c.compressed ? e.compressedTexImage2D(k, C, s, A, S, 0, Ie) : c.needsCopy ? (M(), e.copyTexImage2D(
              k,
              C,
              t,
              c.xOffset,
              c.yOffset,
              A,
              S,
              0
            )) : e.texImage2D(k, C, t, A, S, 0, t, d, Ie || null);
          }
          function xe(c, k, C, he, Ie) {
            var s = c.element, t = c.data, d = c.internalformat, A = c.format, S = c.type, y = c.width, m = c.height;
            Te(c), s ? e.texSubImage2D(
              k,
              Ie,
              C,
              he,
              A,
              S,
              s
            ) : c.compressed ? e.compressedTexSubImage2D(
              k,
              Ie,
              C,
              he,
              d,
              y,
              m,
              t
            ) : c.needsCopy ? (M(), e.copyTexSubImage2D(
              k,
              Ie,
              C,
              he,
              c.xOffset,
              c.yOffset,
              y,
              m
            )) : e.texSubImage2D(
              k,
              Ie,
              C,
              he,
              y,
              m,
              A,
              S,
              t
            );
          }
          var Re = [];
          function de() {
            return Re.pop() || new ue();
          }
          function ke(c) {
            c.needsFree && et.freeType(c.data), ue.call(c), Re.push(c);
          }
          function we() {
            H.call(this), this.genMipmaps = !1, this.mipmapHint = sn, this.mipmask = 0, this.images = Array(16);
          }
          function Ge(c, k, C) {
            var he = c.images[0] = de();
            c.mipmask = 1, he.width = c.width = k, he.height = c.height = C, he.channels = c.channels = 4;
          }
          function Xe(c, k) {
            var C = null;
            if (na(k))
              C = c.images[0] = de(), oe(C, c), re(C, k), c.mipmask = 1;
            else if (_e(c, k), Array.isArray(k.mipmap))
              for (var he = k.mipmap, Ie = 0; Ie < he.length; ++Ie)
                C = c.images[Ie] = de(), oe(C, c), C.width >>= Ie, C.height >>= Ie, re(C, he[Ie]), c.mipmask |= 1 << Ie;
            else
              C = c.images[0] = de(), oe(C, c), re(C, k), c.mipmask = 1;
            oe(c, c.images[0]), c.compressed && (c.internalformat === Wn || c.internalformat === Yn || c.internalformat === qn || c.internalformat === Kn) && f(
              c.width % 4 === 0 && c.height % 4 === 0,
              "for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4"
            );
          }
          function rt(c, k) {
            for (var C = c.images, he = 0; he < C.length; ++he) {
              if (!C[he])
                return;
              z(C[he], k, he);
            }
          }
          var ut = [];
          function De() {
            var c = ut.pop() || new we();
            H.call(c), c.mipmask = 0;
            for (var k = 0; k < 16; ++k)
              c.images[k] = null;
            return c;
          }
          function st(c) {
            for (var k = c.images, C = 0; C < k.length; ++C)
              k[C] && ke(k[C]), k[C] = null;
            ut.push(c);
          }
          function Ye() {
            this.minFilter = ea, this.magFilter = ea, this.wrapS = Jn, this.wrapT = Jn, this.anisotropic = 1, this.genMipmaps = !1, this.mipmapHint = sn;
          }
          function nt(c, k) {
            if ("min" in k) {
              var C = k.min;
              f.parameter(C, Q), c.minFilter = Q[C], tu.indexOf(c.minFilter) >= 0 && !("faces" in k) && (c.genMipmaps = !0);
            }
            if ("mag" in k) {
              var he = k.mag;
              f.parameter(he, te), c.magFilter = te[he];
            }
            var Ie = c.wrapS, s = c.wrapT;
            if ("wrap" in k) {
              var t = k.wrap;
              typeof t == "string" ? (f.parameter(t, K), Ie = s = K[t]) : Array.isArray(t) && (f.parameter(t[0], K), f.parameter(t[1], K), Ie = K[t[0]], s = K[t[1]]);
            } else {
              if ("wrapS" in k) {
                var d = k.wrapS;
                f.parameter(d, K), Ie = K[d];
              }
              if ("wrapT" in k) {
                var A = k.wrapT;
                f.parameter(A, K), s = K[A];
              }
            }
            if (c.wrapS = Ie, c.wrapT = s, "anisotropic" in k) {
              var S = k.anisotropic;
              f(
                typeof S == "number" && S >= 1 && S <= l.maxAnisotropic,
                "aniso samples must be between 1 and "
              ), c.anisotropic = k.anisotropic;
            }
            if ("mipmap" in k) {
              var y = !1;
              switch (typeof k.mipmap) {
                case "string":
                  f.parameter(
                    k.mipmap,
                    Y,
                    "invalid mipmap hint"
                  ), c.mipmapHint = Y[k.mipmap], c.genMipmaps = !0, y = !0;
                  break;
                case "boolean":
                  y = c.genMipmaps = k.mipmap;
                  break;
                case "object":
                  f(Array.isArray(k.mipmap), "invalid mipmap type"), c.genMipmaps = !1, y = !0;
                  break;
                default:
                  f.raise("invalid mipmap type");
              }
              y && !("min" in k) && (c.minFilter = ta);
            }
          }
          function ot(c, k) {
            e.texParameteri(k, Vf, c.minFilter), e.texParameteri(k, Xf, c.magFilter), e.texParameteri(k, $f, c.wrapS), e.texParameteri(k, Uf, c.wrapT), r.ext_texture_filter_anisotropic && e.texParameteri(k, Kf, c.anisotropic), c.genMipmaps && (e.hint(Wf, c.mipmapHint), e.generateMipmap(k));
          }
          var ft = 0, ct = {}, ht = l.maxTextureUnits, Ze = Array(ht).map(function() {
            return null;
          });
          function Oe(c) {
            H.call(this), this.mipmask = 0, this.internalformat = Zt, this.id = ft++, this.refCount = 1, this.target = c, this.texture = e.createTexture(), this.unit = -1, this.bindCount = 0, this.texInfo = new Ye(), B.profile && (this.stats = { size: 0 });
          }
          function dt(c) {
            e.activeTexture(Mr), e.bindTexture(c.target, c.texture);
          }
          function We() {
            var c = Ze[0];
            c ? e.bindTexture(c.target, c.texture) : e.bindTexture(Nt, null);
          }
          function ge(c) {
            var k = c.texture;
            f(k, "must not double destroy texture");
            var C = c.unit, he = c.target;
            C >= 0 && (e.activeTexture(Mr + C), e.bindTexture(he, null), Ze[C] = null), e.deleteTexture(k), c.texture = null, c.params = null, c.pixels = null, c.refCount = 0, delete ct[c.id], G.textureCount--;
          }
          b(Oe.prototype, {
            bind: function() {
              var c = this;
              c.bindCount += 1;
              var k = c.unit;
              if (k < 0) {
                for (var C = 0; C < ht; ++C) {
                  var he = Ze[C];
                  if (he) {
                    if (he.bindCount > 0)
                      continue;
                    he.unit = -1;
                  }
                  Ze[C] = c, k = C;
                  break;
                }
                k >= ht && f.raise("insufficient number of texture units"), B.profile && G.maxTextureUnits < k + 1 && (G.maxTextureUnits = k + 1), c.unit = k, e.activeTexture(Mr + k), e.bindTexture(c.target, c.texture);
              }
              return k;
            },
            unbind: function() {
              this.bindCount -= 1;
            },
            decRef: function() {
              --this.refCount <= 0 && ge(this);
            }
          });
          function Be(c, k) {
            var C = new Oe(Nt);
            ct[C.id] = C, G.textureCount++;
            function he(t, d) {
              var A = C.texInfo;
              Ye.call(A);
              var S = De();
              return typeof t == "number" ? typeof d == "number" ? Ge(S, t | 0, d | 0) : Ge(S, t | 0, t | 0) : t ? (f.type(t, "object", "invalid arguments to regl.texture"), nt(A, t), Xe(S, t)) : Ge(S, 1, 1), A.genMipmaps && (S.mipmask = (S.width << 1) - 1), C.mipmask = S.mipmask, oe(C, S), f.texture2D(A, S, l), C.internalformat = S.internalformat, he.width = S.width, he.height = S.height, dt(C), rt(S, Nt), ot(A, Nt), We(), st(S), B.profile && (C.stats.size = fn(
                C.internalformat,
                C.type,
                S.width,
                S.height,
                A.genMipmaps,
                !1
              )), he.format = J[C.internalformat], he.type = ce[C.type], he.mag = j[A.magFilter], he.min = le[A.minFilter], he.wrapS = W[A.wrapS], he.wrapT = W[A.wrapT], he;
            }
            function Ie(t, d, A, S) {
              f(!!t, "must specify image data");
              var y = d | 0, m = A | 0, g = S | 0, o = de();
              return oe(o, C), o.width = 0, o.height = 0, re(o, t), o.width = o.width || (C.width >> g) - y, o.height = o.height || (C.height >> g) - m, f(
                C.type === o.type && C.format === o.format && C.internalformat === o.internalformat,
                "incompatible format for texture.subimage"
              ), f(
                y >= 0 && m >= 0 && y + o.width <= C.width && m + o.height <= C.height,
                "texture.subimage write out of bounds"
              ), f(
                C.mipmask & 1 << g,
                "missing mipmap data"
              ), f(
                o.data || o.element || o.needsCopy,
                "missing image data"
              ), dt(C), xe(o, Nt, y, m, g), We(), ke(o), he;
            }
            function s(t, d) {
              var A = t | 0, S = d | 0 || A;
              if (A === C.width && S === C.height)
                return he;
              he.width = C.width = A, he.height = C.height = S, dt(C);
              for (var y = 0; C.mipmask >> y; ++y) {
                var m = A >> y, g = S >> y;
                if (!m || !g) break;
                e.texImage2D(
                  Nt,
                  y,
                  C.format,
                  m,
                  g,
                  0,
                  C.format,
                  C.type,
                  null
                );
              }
              return We(), B.profile && (C.stats.size = fn(
                C.internalformat,
                C.type,
                A,
                S,
                !1,
                !1
              )), he;
            }
            return he(c, k), he.subimage = Ie, he.resize = s, he._reglType = "texture2d", he._texture = C, B.profile && (he.stats = C.stats), he.destroy = function() {
              C.decRef();
            }, he;
          }
          function je(c, k, C, he, Ie, s) {
            var t = new Oe(Un);
            ct[t.id] = t, G.cubeCount++;
            var d = new Array(6);
            function A(m, g, o, h, i, E) {
              var L, P = t.texInfo;
              for (Ye.call(P), L = 0; L < 6; ++L)
                d[L] = De();
              if (typeof m == "number" || !m) {
                var U = m | 0 || 1;
                for (L = 0; L < 6; ++L)
                  Ge(d[L], U, U);
              } else if (typeof m == "object")
                if (g)
                  Xe(d[0], m), Xe(d[1], g), Xe(d[2], o), Xe(d[3], h), Xe(d[4], i), Xe(d[5], E);
                else if (nt(P, m), _e(t, m), "faces" in m) {
                  var D = m.faces;
                  for (f(
                    Array.isArray(D) && D.length === 6,
                    "cube faces must be a length 6 array"
                  ), L = 0; L < 6; ++L)
                    f(
                      typeof D[L] == "object" && !!D[L],
                      "invalid input for cube map face"
                    ), oe(d[L], t), Xe(d[L], D[L]);
                } else
                  for (L = 0; L < 6; ++L)
                    Xe(d[L], m);
              else
                f.raise("invalid arguments to cube map");
              for (oe(t, d[0]), l.npotTextureCube || f(oi(t.width) && oi(t.height), "your browser does not support non power or two texture dimensions"), P.genMipmaps ? t.mipmask = (d[0].width << 1) - 1 : t.mipmask = d[0].mipmask, f.textureCube(t, P, d, l), t.internalformat = d[0].internalformat, A.width = d[0].width, A.height = d[0].height, dt(t), L = 0; L < 6; ++L)
                rt(d[L], tn + L);
              for (ot(P, Un), We(), B.profile && (t.stats.size = fn(
                t.internalformat,
                t.type,
                A.width,
                A.height,
                P.genMipmaps,
                !0
              )), A.format = J[t.internalformat], A.type = ce[t.type], A.mag = j[P.magFilter], A.min = le[P.minFilter], A.wrapS = W[P.wrapS], A.wrapT = W[P.wrapT], L = 0; L < 6; ++L)
                st(d[L]);
              return A;
            }
            function S(m, g, o, h, i) {
              f(!!g, "must specify image data"), f(typeof m == "number" && m === (m | 0) && m >= 0 && m < 6, "invalid face");
              var E = o | 0, L = h | 0, P = i | 0, U = de();
              return oe(U, t), U.width = 0, U.height = 0, re(U, g), U.width = U.width || (t.width >> P) - E, U.height = U.height || (t.height >> P) - L, f(
                t.type === U.type && t.format === U.format && t.internalformat === U.internalformat,
                "incompatible format for texture.subimage"
              ), f(
                E >= 0 && L >= 0 && E + U.width <= t.width && L + U.height <= t.height,
                "texture.subimage write out of bounds"
              ), f(
                t.mipmask & 1 << P,
                "missing mipmap data"
              ), f(
                U.data || U.element || U.needsCopy,
                "missing image data"
              ), dt(t), xe(U, tn + m, E, L, P), We(), ke(U), A;
            }
            function y(m) {
              var g = m | 0;
              if (g !== t.width) {
                A.width = t.width = g, A.height = t.height = g, dt(t);
                for (var o = 0; o < 6; ++o)
                  for (var h = 0; t.mipmask >> h; ++h)
                    e.texImage2D(
                      tn + o,
                      h,
                      t.format,
                      g >> h,
                      g >> h,
                      0,
                      t.format,
                      t.type,
                      null
                    );
                return We(), B.profile && (t.stats.size = fn(
                  t.internalformat,
                  t.type,
                  A.width,
                  A.height,
                  !1,
                  !0
                )), A;
              }
            }
            return A(c, k, C, he, Ie, s), A.subimage = S, A.resize = y, A._reglType = "textureCube", A._texture = t, B.profile && (A.stats = t.stats), A.destroy = function() {
              t.decRef();
            }, A;
          }
          function Je() {
            for (var c = 0; c < ht; ++c)
              e.activeTexture(Mr + c), e.bindTexture(Nt, null), Ze[c] = null;
            Lt(ct).forEach(ge), G.cubeCount = 0, G.textureCount = 0;
          }
          B.profile && (G.getTotalTextureSize = function() {
            var c = 0;
            return Object.keys(ct).forEach(function(k) {
              c += ct[k].stats.size;
            }), c;
          });
          function Pt() {
            for (var c = 0; c < ht; ++c) {
              var k = Ze[c];
              k && (k.bindCount = 0, k.unit = -1, Ze[c] = null);
            }
            Lt(ct).forEach(function(C) {
              C.texture = e.createTexture(), e.bindTexture(C.target, C.texture);
              for (var he = 0; he < 32; ++he)
                if ((C.mipmask & 1 << he) !== 0)
                  if (C.target === Nt)
                    e.texImage2D(
                      Nt,
                      he,
                      C.internalformat,
                      C.width >> he,
                      C.height >> he,
                      0,
                      C.internalformat,
                      C.type,
                      null
                    );
                  else
                    for (var Ie = 0; Ie < 6; ++Ie)
                      e.texImage2D(
                        tn + Ie,
                        he,
                        C.internalformat,
                        C.width >> he,
                        C.height >> he,
                        0,
                        C.internalformat,
                        C.type,
                        null
                      );
              ot(C.texInfo, C.target);
            });
          }
          function sr() {
            for (var c = 0; c < ht; ++c) {
              var k = Ze[c];
              k && (k.bindCount = 0, k.unit = -1, Ze[c] = null), e.activeTexture(Mr + c), e.bindTexture(Nt, null), e.bindTexture(Un, null);
            }
          }
          return {
            create2D: Be,
            createCube: je,
            clear: Je,
            getTexture: function(c) {
              return null;
            },
            restore: Pt,
            refresh: sr
          };
        }
        var Xt = 36161, un = 32854, ki = 32855, Ii = 36194, Bi = 33189, Ni = 36168, Di = 34041, Pi = 35907, $i = 34836, Ui = 34842, zi = 34843, kt = [];
        kt[un] = 2, kt[ki] = 2, kt[Ii] = 2, kt[Bi] = 2, kt[Ni] = 1, kt[Di] = 4, kt[Pi] = 4, kt[$i] = 16, kt[Ui] = 8, kt[zi] = 6;
        function ji(e, r, l) {
          return kt[e] * r * l;
        }
        var cu = function(e, r, l, M, $) {
          var G = {
            rgba4: un,
            rgb565: Ii,
            "rgb5 a1": ki,
            depth: Bi,
            stencil: Ni,
            "depth stencil": Di
          };
          r.ext_srgb && (G.srgba = Pi), r.ext_color_buffer_half_float && (G.rgba16f = Ui, G.rgb16f = zi), r.webgl_color_buffer_float && (G.rgba32f = $i);
          var B = [];
          Object.keys(G).forEach(function(q) {
            var ie = G[q];
            B[ie] = q;
          });
          var Y = 0, K = {};
          function te(q) {
            this.id = Y++, this.refCount = 1, this.renderbuffer = q, this.format = un, this.width = 0, this.height = 0, $.profile && (this.stats = { size: 0 });
          }
          te.prototype.decRef = function() {
            --this.refCount <= 0 && Q(this);
          };
          function Q(q) {
            var ie = q.renderbuffer;
            f(ie, "must not double destroy renderbuffer"), e.bindRenderbuffer(Xt, null), e.deleteRenderbuffer(ie), q.renderbuffer = null, q.refCount = 0, delete K[q.id], M.renderbufferCount--;
          }
          function ae(q, ie) {
            var w = new te(e.createRenderbuffer());
            K[w.id] = w, M.renderbufferCount++;
            function N(ce, j) {
              var le = 0, W = 0, se = un;
              if (typeof ce == "object" && ce) {
                var H = ce;
                if ("shape" in H) {
                  var oe = H.shape;
                  f(
                    Array.isArray(oe) && oe.length >= 2,
                    "invalid renderbuffer shape"
                  ), le = oe[0] | 0, W = oe[1] | 0;
                } else
                  "radius" in H && (le = W = H.radius | 0), "width" in H && (le = H.width | 0), "height" in H && (W = H.height | 0);
                "format" in H && (f.parameter(
                  H.format,
                  G,
                  "invalid renderbuffer format"
                ), se = G[H.format]);
              } else typeof ce == "number" ? (le = ce | 0, typeof j == "number" ? W = j | 0 : W = le) : ce ? f.raise("invalid arguments to renderbuffer constructor") : le = W = 1;
              if (f(
                le > 0 && W > 0 && le <= l.maxRenderbufferSize && W <= l.maxRenderbufferSize,
                "invalid renderbuffer size"
              ), !(le === w.width && W === w.height && se === w.format))
                return N.width = w.width = le, N.height = w.height = W, w.format = se, e.bindRenderbuffer(Xt, w.renderbuffer), e.renderbufferStorage(Xt, se, le, W), f(
                  e.getError() === 0,
                  "invalid render buffer format"
                ), $.profile && (w.stats.size = ji(w.format, w.width, w.height)), N.format = B[w.format], N;
            }
            function J(ce, j) {
              var le = ce | 0, W = j | 0 || le;
              return le === w.width && W === w.height || (f(
                le > 0 && W > 0 && le <= l.maxRenderbufferSize && W <= l.maxRenderbufferSize,
                "invalid renderbuffer size"
              ), N.width = w.width = le, N.height = w.height = W, e.bindRenderbuffer(Xt, w.renderbuffer), e.renderbufferStorage(Xt, w.format, le, W), f(
                e.getError() === 0,
                "invalid render buffer format"
              ), $.profile && (w.stats.size = ji(
                w.format,
                w.width,
                w.height
              ))), N;
            }
            return N(q, ie), N.resize = J, N._reglType = "renderbuffer", N._renderbuffer = w, $.profile && (N.stats = w.stats), N.destroy = function() {
              w.decRef();
            }, N;
          }
          $.profile && (M.getTotalRenderbufferSize = function() {
            var q = 0;
            return Object.keys(K).forEach(function(ie) {
              q += K[ie].stats.size;
            }), q;
          });
          function fe() {
            Lt(K).forEach(function(q) {
              q.renderbuffer = e.createRenderbuffer(), e.bindRenderbuffer(Xt, q.renderbuffer), e.renderbufferStorage(Xt, q.format, q.width, q.height);
            }), e.bindRenderbuffer(Xt, null);
          }
          return {
            create: ae,
            clear: function() {
              Lt(K).forEach(Q);
            },
            restore: fe
          };
        }, $t = 36160, aa = 36161, er = 3553, cn = 34069, Xi = 36064, Vi = 36096, Hi = 36128, Wi = 33306, Yi = 36053, lu = 36054, hu = 36055, du = 36057, mu = 36061, pu = 36193, vu = 5121, yu = 5126, qi = 6407, Ki = 6408, bu = 6402, _u = [
          qi,
          Ki
        ], ia = [];
        ia[Ki] = 4, ia[qi] = 3;
        var ln = [];
        ln[vu] = 1, ln[yu] = 4, ln[pu] = 2;
        var gu = 32854, Eu = 32855, xu = 36194, Tu = 33189, Au = 36168, Qi = 34041, wu = 35907, Su = 34836, Lu = 34842, Ru = 34843, Ou = [
          gu,
          Eu,
          xu,
          wu,
          Lu,
          Ru,
          Su
        ], vr = {};
        vr[Yi] = "complete", vr[lu] = "incomplete attachment", vr[du] = "incomplete dimensions", vr[hu] = "incomplete, missing attachment", vr[mu] = "unsupported";
        function Cu(e, r, l, M, $, G) {
          var B = {
            cur: null,
            next: null,
            dirty: !1,
            setFBO: null
          }, Y = ["rgba"], K = ["rgba4", "rgb565", "rgb5 a1"];
          r.ext_srgb && K.push("srgba"), r.ext_color_buffer_half_float && K.push("rgba16f", "rgb16f"), r.webgl_color_buffer_float && K.push("rgba32f");
          var te = ["uint8"];
          r.oes_texture_half_float && te.push("half float", "float16"), r.oes_texture_float && te.push("float", "float32");
          function Q(ue, re, z) {
            this.target = ue, this.texture = re, this.renderbuffer = z;
            var xe = 0, Re = 0;
            re ? (xe = re.width, Re = re.height) : z && (xe = z.width, Re = z.height), this.width = xe, this.height = Re;
          }
          function ae(ue) {
            ue && (ue.texture && ue.texture._texture.decRef(), ue.renderbuffer && ue.renderbuffer._renderbuffer.decRef());
          }
          function fe(ue, re, z) {
            if (ue)
              if (ue.texture) {
                var xe = ue.texture._texture, Re = Math.max(1, xe.width), de = Math.max(1, xe.height);
                f(
                  Re === re && de === z,
                  "inconsistent width/height for supplied texture"
                ), xe.refCount += 1;
              } else {
                var ke = ue.renderbuffer._renderbuffer;
                f(
                  ke.width === re && ke.height === z,
                  "inconsistent width/height for renderbuffer"
                ), ke.refCount += 1;
              }
          }
          function q(ue, re) {
            re && (re.texture ? e.framebufferTexture2D(
              $t,
              ue,
              re.target,
              re.texture._texture.texture,
              0
            ) : e.framebufferRenderbuffer(
              $t,
              ue,
              aa,
              re.renderbuffer._renderbuffer.renderbuffer
            ));
          }
          function ie(ue) {
            var re = er, z = null, xe = null, Re = ue;
            typeof ue == "object" && (Re = ue.data, "target" in ue && (re = ue.target | 0)), f.type(Re, "function", "invalid attachment data");
            var de = Re._reglType;
            return de === "texture2d" ? (z = Re, f(re === er)) : de === "textureCube" ? (z = Re, f(
              re >= cn && re < cn + 6,
              "invalid cube map target"
            )) : de === "renderbuffer" ? (xe = Re, re = aa) : f.raise("invalid regl object for attachment"), new Q(re, z, xe);
          }
          function w(ue, re, z, xe, Re) {
            if (z) {
              var de = M.create2D({
                width: ue,
                height: re,
                format: xe,
                type: Re
              });
              return de._texture.refCount = 0, new Q(er, de, null);
            } else {
              var ke = $.create({
                width: ue,
                height: re,
                format: xe
              });
              return ke._renderbuffer.refCount = 0, new Q(aa, null, ke);
            }
          }
          function N(ue) {
            return ue && (ue.texture || ue.renderbuffer);
          }
          function J(ue, re, z) {
            ue && (ue.texture ? ue.texture.resize(re, z) : ue.renderbuffer && ue.renderbuffer.resize(re, z), ue.width = re, ue.height = z);
          }
          var ce = 0, j = {};
          function le() {
            this.id = ce++, j[this.id] = this, this.framebuffer = e.createFramebuffer(), this.width = 0, this.height = 0, this.colorAttachments = [], this.depthAttachment = null, this.stencilAttachment = null, this.depthStencilAttachment = null;
          }
          function W(ue) {
            ue.colorAttachments.forEach(ae), ae(ue.depthAttachment), ae(ue.stencilAttachment), ae(ue.depthStencilAttachment);
          }
          function se(ue) {
            var re = ue.framebuffer;
            f(re, "must not double destroy framebuffer"), e.deleteFramebuffer(re), ue.framebuffer = null, G.framebufferCount--, delete j[ue.id];
          }
          function H(ue) {
            var re;
            e.bindFramebuffer($t, ue.framebuffer);
            var z = ue.colorAttachments;
            for (re = 0; re < z.length; ++re)
              q(Xi + re, z[re]);
            for (re = z.length; re < l.maxColorAttachments; ++re)
              e.framebufferTexture2D(
                $t,
                Xi + re,
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
            ), q(Vi, ue.depthAttachment), q(Hi, ue.stencilAttachment), q(Wi, ue.depthStencilAttachment);
            var xe = e.checkFramebufferStatus($t);
            !e.isContextLost() && xe !== Yi && f.raise("framebuffer configuration not supported, status = " + vr[xe]), e.bindFramebuffer($t, B.next ? B.next.framebuffer : null), B.cur = B.next, e.getError();
          }
          function oe(ue, re) {
            var z = new le();
            G.framebufferCount++;
            function xe(de, ke) {
              var we;
              f(
                B.next !== z,
                "can not update framebuffer which is currently in use"
              );
              var Ge = 0, Xe = 0, rt = !0, ut = !0, De = null, st = !0, Ye = "rgba", nt = "uint8", ot = 1, ft = null, ct = null, ht = null, Ze = !1;
              if (typeof de == "number")
                Ge = de | 0, Xe = ke | 0 || Ge;
              else if (!de)
                Ge = Xe = 1;
              else {
                f.type(de, "object", "invalid arguments for framebuffer");
                var Oe = de;
                if ("shape" in Oe) {
                  var dt = Oe.shape;
                  f(
                    Array.isArray(dt) && dt.length >= 2,
                    "invalid shape for framebuffer"
                  ), Ge = dt[0], Xe = dt[1];
                } else
                  "radius" in Oe && (Ge = Xe = Oe.radius), "width" in Oe && (Ge = Oe.width), "height" in Oe && (Xe = Oe.height);
                ("color" in Oe || "colors" in Oe) && (De = Oe.color || Oe.colors, Array.isArray(De) && f(
                  De.length === 1 || r.webgl_draw_buffers,
                  "multiple render targets not supported"
                )), De || ("colorCount" in Oe && (ot = Oe.colorCount | 0, f(ot > 0, "invalid color buffer count")), "colorTexture" in Oe && (st = !!Oe.colorTexture, Ye = "rgba4"), "colorType" in Oe && (nt = Oe.colorType, st ? (f(
                  r.oes_texture_float || !(nt === "float" || nt === "float32"),
                  "you must enable OES_texture_float in order to use floating point framebuffer objects"
                ), f(
                  r.oes_texture_half_float || !(nt === "half float" || nt === "float16"),
                  "you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects"
                )) : nt === "half float" || nt === "float16" ? (f(
                  r.ext_color_buffer_half_float,
                  "you must enable EXT_color_buffer_half_float to use 16-bit render buffers"
                ), Ye = "rgba16f") : (nt === "float" || nt === "float32") && (f(
                  r.webgl_color_buffer_float,
                  "you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers"
                ), Ye = "rgba32f"), f.oneOf(nt, te, "invalid color type")), "colorFormat" in Oe && (Ye = Oe.colorFormat, Y.indexOf(Ye) >= 0 ? st = !0 : K.indexOf(Ye) >= 0 ? st = !1 : st ? f.oneOf(
                  Oe.colorFormat,
                  Y,
                  "invalid color format for texture"
                ) : f.oneOf(
                  Oe.colorFormat,
                  K,
                  "invalid color format for renderbuffer"
                ))), ("depthTexture" in Oe || "depthStencilTexture" in Oe) && (Ze = !!(Oe.depthTexture || Oe.depthStencilTexture), f(
                  !Ze || r.webgl_depth_texture,
                  "webgl_depth_texture extension not supported"
                )), "depth" in Oe && (typeof Oe.depth == "boolean" ? rt = Oe.depth : (ft = Oe.depth, ut = !1)), "stencil" in Oe && (typeof Oe.stencil == "boolean" ? ut = Oe.stencil : (ct = Oe.stencil, rt = !1)), "depthStencil" in Oe && (typeof Oe.depthStencil == "boolean" ? rt = ut = Oe.depthStencil : (ht = Oe.depthStencil, rt = !1, ut = !1));
              }
              var We = null, ge = null, Be = null, je = null;
              if (Array.isArray(De))
                We = De.map(ie);
              else if (De)
                We = [ie(De)];
              else
                for (We = new Array(ot), we = 0; we < ot; ++we)
                  We[we] = w(
                    Ge,
                    Xe,
                    st,
                    Ye,
                    nt
                  );
              f(
                r.webgl_draw_buffers || We.length <= 1,
                "you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers."
              ), f(
                We.length <= l.maxColorAttachments,
                "too many color attachments, not supported"
              ), Ge = Ge || We[0].width, Xe = Xe || We[0].height, ft ? ge = ie(ft) : rt && !ut && (ge = w(
                Ge,
                Xe,
                Ze,
                "depth",
                "uint32"
              )), ct ? Be = ie(ct) : ut && !rt && (Be = w(
                Ge,
                Xe,
                !1,
                "stencil",
                "uint8"
              )), ht ? je = ie(ht) : !ft && !ct && ut && rt && (je = w(
                Ge,
                Xe,
                Ze,
                "depth stencil",
                "depth stencil"
              )), f(
                !!ft + !!ct + !!ht <= 1,
                "invalid framebuffer configuration, can specify exactly one depth/stencil attachment"
              );
              var Je = null;
              for (we = 0; we < We.length; ++we)
                if (fe(We[we], Ge, Xe), f(
                  !We[we] || We[we].texture && _u.indexOf(We[we].texture._texture.format) >= 0 || We[we].renderbuffer && Ou.indexOf(We[we].renderbuffer._renderbuffer.format) >= 0,
                  "framebuffer color attachment " + we + " is invalid"
                ), We[we] && We[we].texture) {
                  var Pt = ia[We[we].texture._texture.format] * ln[We[we].texture._texture.type];
                  Je === null ? Je = Pt : f(
                    Je === Pt,
                    "all color attachments much have the same number of bits per pixel."
                  );
                }
              return fe(ge, Ge, Xe), f(
                !ge || ge.texture && ge.texture._texture.format === bu || ge.renderbuffer && ge.renderbuffer._renderbuffer.format === Tu,
                "invalid depth attachment for framebuffer object"
              ), fe(Be, Ge, Xe), f(
                !Be || Be.renderbuffer && Be.renderbuffer._renderbuffer.format === Au,
                "invalid stencil attachment for framebuffer object"
              ), fe(je, Ge, Xe), f(
                !je || je.texture && je.texture._texture.format === Qi || je.renderbuffer && je.renderbuffer._renderbuffer.format === Qi,
                "invalid depth-stencil attachment for framebuffer object"
              ), W(z), z.width = Ge, z.height = Xe, z.colorAttachments = We, z.depthAttachment = ge, z.stencilAttachment = Be, z.depthStencilAttachment = je, xe.color = We.map(N), xe.depth = N(ge), xe.stencil = N(Be), xe.depthStencil = N(je), xe.width = z.width, xe.height = z.height, H(z), xe;
            }
            function Re(de, ke) {
              f(
                B.next !== z,
                "can not resize a framebuffer which is currently in use"
              );
              var we = Math.max(de | 0, 1), Ge = Math.max(ke | 0 || we, 1);
              if (we === z.width && Ge === z.height)
                return xe;
              for (var Xe = z.colorAttachments, rt = 0; rt < Xe.length; ++rt)
                J(Xe[rt], we, Ge);
              return J(z.depthAttachment, we, Ge), J(z.stencilAttachment, we, Ge), J(z.depthStencilAttachment, we, Ge), z.width = xe.width = we, z.height = xe.height = Ge, H(z), xe;
            }
            return xe(ue, re), b(xe, {
              resize: Re,
              _reglType: "framebuffer",
              _framebuffer: z,
              destroy: function() {
                se(z), W(z);
              },
              use: function(de) {
                B.setFBO({
                  framebuffer: xe
                }, de);
              }
            });
          }
          function _e(ue) {
            var re = Array(6);
            function z(Re) {
              var de;
              f(
                re.indexOf(B.next) < 0,
                "can not update framebuffer which is currently in use"
              );
              var ke = {
                color: null
              }, we = 0, Ge = null, Xe = "rgba", rt = "uint8", ut = 1;
              if (typeof Re == "number")
                we = Re | 0;
              else if (!Re)
                we = 1;
              else {
                f.type(Re, "object", "invalid arguments for framebuffer");
                var De = Re;
                if ("shape" in De) {
                  var st = De.shape;
                  f(
                    Array.isArray(st) && st.length >= 2,
                    "invalid shape for framebuffer"
                  ), f(
                    st[0] === st[1],
                    "cube framebuffer must be square"
                  ), we = st[0];
                } else
                  "radius" in De && (we = De.radius | 0), "width" in De ? (we = De.width | 0, "height" in De && f(De.height === we, "must be square")) : "height" in De && (we = De.height | 0);
                ("color" in De || "colors" in De) && (Ge = De.color || De.colors, Array.isArray(Ge) && f(
                  Ge.length === 1 || r.webgl_draw_buffers,
                  "multiple render targets not supported"
                )), Ge || ("colorCount" in De && (ut = De.colorCount | 0, f(ut > 0, "invalid color buffer count")), "colorType" in De && (f.oneOf(
                  De.colorType,
                  te,
                  "invalid color type"
                ), rt = De.colorType), "colorFormat" in De && (Xe = De.colorFormat, f.oneOf(
                  De.colorFormat,
                  Y,
                  "invalid color format for texture"
                ))), "depth" in De && (ke.depth = De.depth), "stencil" in De && (ke.stencil = De.stencil), "depthStencil" in De && (ke.depthStencil = De.depthStencil);
              }
              var Ye;
              if (Ge)
                if (Array.isArray(Ge))
                  for (Ye = [], de = 0; de < Ge.length; ++de)
                    Ye[de] = Ge[de];
                else
                  Ye = [Ge];
              else {
                Ye = Array(ut);
                var nt = {
                  radius: we,
                  format: Xe,
                  type: rt
                };
                for (de = 0; de < ut; ++de)
                  Ye[de] = M.createCube(nt);
              }
              for (ke.color = Array(Ye.length), de = 0; de < Ye.length; ++de) {
                var ot = Ye[de];
                f(
                  typeof ot == "function" && ot._reglType === "textureCube",
                  "invalid cube map"
                ), we = we || ot.width, f(
                  ot.width === we && ot.height === we,
                  "invalid cube map shape"
                ), ke.color[de] = {
                  target: cn,
                  data: Ye[de]
                };
              }
              for (de = 0; de < 6; ++de) {
                for (var ft = 0; ft < Ye.length; ++ft)
                  ke.color[ft].target = cn + de;
                de > 0 && (ke.depth = re[0].depth, ke.stencil = re[0].stencil, ke.depthStencil = re[0].depthStencil), re[de] ? re[de](ke) : re[de] = oe(ke);
              }
              return b(z, {
                width: we,
                height: we,
                color: Ye
              });
            }
            function xe(Re) {
              var de, ke = Re | 0;
              if (f(
                ke > 0 && ke <= l.maxCubeMapSize,
                "invalid radius for cube fbo"
              ), ke === z.width)
                return z;
              var we = z.color;
              for (de = 0; de < we.length; ++de)
                we[de].resize(ke);
              for (de = 0; de < 6; ++de)
                re[de].resize(ke);
              return z.width = z.height = ke, z;
            }
            return z(ue), b(z, {
              faces: re,
              resize: xe,
              _reglType: "framebufferCube",
              destroy: function() {
                re.forEach(function(Re) {
                  Re.destroy();
                });
              }
            });
          }
          function Te() {
            B.cur = null, B.next = null, B.dirty = !0, Lt(j).forEach(function(ue) {
              ue.framebuffer = e.createFramebuffer(), H(ue);
            });
          }
          return b(B, {
            getFramebuffer: function(ue) {
              if (typeof ue == "function" && ue._reglType === "framebuffer") {
                var re = ue._framebuffer;
                if (re instanceof le)
                  return re;
              }
              return null;
            },
            create: oe,
            createCube: _e,
            clear: function() {
              Lt(j).forEach(se);
            },
            restore: Te
          });
        }
        var Fu = 5126, Zi = 34962;
        function sa() {
          this.state = 0, this.x = 0, this.y = 0, this.z = 0, this.w = 0, this.buffer = null, this.size = 0, this.normalized = !1, this.type = Fu, this.offset = 0, this.stride = 0, this.divisor = 0;
        }
        function Gu(e, r, l, M, $) {
          for (var G = l.maxAttributes, B = new Array(G), Y = 0; Y < G; ++Y)
            B[Y] = new sa();
          var K = 0, te = {}, Q = {
            Record: sa,
            scope: {},
            state: B,
            currentVAO: null,
            targetVAO: null,
            restore: fe() ? j : function() {
            },
            createVAO: le,
            getVAO: ie,
            destroyBuffer: ae,
            setVAO: fe() ? w : N,
            clear: fe() ? J : function() {
            }
          };
          function ae(W) {
            for (var se = 0; se < B.length; ++se) {
              var H = B[se];
              H.buffer === W && (e.disableVertexAttribArray(se), H.buffer = null);
            }
          }
          function fe() {
            return r.oes_vertex_array_object;
          }
          function q() {
            return r.angle_instanced_arrays;
          }
          function ie(W) {
            return typeof W == "function" && W._vao ? W._vao : null;
          }
          function w(W) {
            if (W !== Q.currentVAO) {
              var se = fe();
              W ? se.bindVertexArrayOES(W.vao) : se.bindVertexArrayOES(null), Q.currentVAO = W;
            }
          }
          function N(W) {
            if (W !== Q.currentVAO) {
              if (W)
                W.bindAttrs();
              else
                for (var se = q(), H = 0; H < B.length; ++H) {
                  var oe = B[H];
                  oe.buffer ? (e.enableVertexAttribArray(H), e.vertexAttribPointer(H, oe.size, oe.type, oe.normalized, oe.stride, oe.offfset), se && oe.divisor && se.vertexAttribDivisorANGLE(H, oe.divisor)) : (e.disableVertexAttribArray(H), e.vertexAttrib4f(H, oe.x, oe.y, oe.z, oe.w));
                }
              Q.currentVAO = W;
            }
          }
          function J() {
            Lt(te).forEach(function(W) {
              W.destroy();
            });
          }
          function ce() {
            this.id = ++K, this.attributes = [];
            var W = fe();
            W ? this.vao = W.createVertexArrayOES() : this.vao = null, te[this.id] = this, this.buffers = [];
          }
          ce.prototype.bindAttrs = function() {
            for (var W = q(), se = this.attributes, H = 0; H < se.length; ++H) {
              var oe = se[H];
              oe.buffer ? (e.enableVertexAttribArray(H), e.bindBuffer(Zi, oe.buffer.buffer), e.vertexAttribPointer(H, oe.size, oe.type, oe.normalized, oe.stride, oe.offset), W && oe.divisor && W.vertexAttribDivisorANGLE(H, oe.divisor)) : (e.disableVertexAttribArray(H), e.vertexAttrib4f(H, oe.x, oe.y, oe.z, oe.w));
            }
            for (var _e = se.length; _e < G; ++_e)
              e.disableVertexAttribArray(_e);
          }, ce.prototype.refresh = function() {
            var W = fe();
            W && (W.bindVertexArrayOES(this.vao), this.bindAttrs(), Q.currentVAO = this);
          }, ce.prototype.destroy = function() {
            if (this.vao) {
              var W = fe();
              this === Q.currentVAO && (Q.currentVAO = null, W.bindVertexArrayOES(null)), W.deleteVertexArrayOES(this.vao), this.vao = null;
            }
            te[this.id] && (delete te[this.id], M.vaoCount -= 1);
          };
          function j() {
            var W = fe();
            W && Lt(te).forEach(function(se) {
              se.refresh();
            });
          }
          function le(W) {
            var se = new ce();
            M.vaoCount += 1;
            function H(oe) {
              f(Array.isArray(oe), "arguments to vertex array constructor must be an array"), f(oe.length < G, "too many attributes"), f(oe.length > 0, "must specify at least one attribute");
              var _e = {}, Te = se.attributes;
              Te.length = oe.length;
              for (var ue = 0; ue < oe.length; ++ue) {
                var re = oe[ue], z = Te[ue] = new sa(), xe = re.data || re;
                if (Array.isArray(xe) || p(xe) || Mt(xe)) {
                  var Re;
                  se.buffers[ue] && (Re = se.buffers[ue], p(xe) && Re._buffer.byteLength >= xe.byteLength ? Re.subdata(xe) : (Re.destroy(), se.buffers[ue] = null)), se.buffers[ue] || (Re = se.buffers[ue] = $.create(re, Zi, !1, !0)), z.buffer = $.getBuffer(Re), z.size = z.buffer.dimension | 0, z.normalized = !1, z.type = z.buffer.dtype, z.offset = 0, z.stride = 0, z.divisor = 0, z.state = 1, _e[ue] = 1;
                } else $.getBuffer(re) ? (z.buffer = $.getBuffer(re), z.size = z.buffer.dimension | 0, z.normalized = !1, z.type = z.buffer.dtype, z.offset = 0, z.stride = 0, z.divisor = 0, z.state = 1) : $.getBuffer(re.buffer) ? (z.buffer = $.getBuffer(re.buffer), z.size = (+re.size || z.buffer.dimension) | 0, z.normalized = !!re.normalized || !1, "type" in re ? (f.parameter(re.type, Kt, "invalid buffer type"), z.type = Kt[re.type]) : z.type = z.buffer.dtype, z.offset = (re.offset || 0) | 0, z.stride = (re.stride || 0) | 0, z.divisor = (re.divisor || 0) | 0, z.state = 1, f(z.size >= 1 && z.size <= 4, "size must be between 1 and 4"), f(z.offset >= 0, "invalid offset"), f(z.stride >= 0 && z.stride <= 255, "stride must be between 0 and 255"), f(z.divisor >= 0, "divisor must be positive"), f(!z.divisor || !!r.angle_instanced_arrays, "ANGLE_instanced_arrays must be enabled to use divisor")) : "x" in re ? (f(ue > 0, "first attribute must not be a constant"), z.x = +re.x || 0, z.y = +re.y || 0, z.z = +re.z || 0, z.w = +re.w || 0, z.state = 2) : f(!1, "invalid attribute spec for location " + ue);
              }
              for (var de = 0; de < se.buffers.length; ++de)
                !_e[de] && se.buffers[de] && (se.buffers[de].destroy(), se.buffers[de] = null);
              return se.refresh(), H;
            }
            return H.destroy = function() {
              for (var oe = 0; oe < se.buffers.length; ++oe)
                se.buffers[oe] && se.buffers[oe].destroy();
              se.buffers.length = 0, se.destroy();
            }, H._vao = se, H._reglType = "vao", H(W);
          }
          return Q;
        }
        var Ji = 35632, Mu = 35633, ku = 35718, Iu = 35721;
        function Bu(e, r, l, M) {
          var $ = {}, G = {};
          function B(w, N, J, ce) {
            this.name = w, this.id = N, this.location = J, this.info = ce;
          }
          function Y(w, N) {
            for (var J = 0; J < w.length; ++J)
              if (w[J].id === N.id) {
                w[J].location = N.location;
                return;
              }
            w.push(N);
          }
          function K(w, N, J) {
            var ce = w === Ji ? $ : G, j = ce[N];
            if (!j) {
              var le = r.str(N);
              j = e.createShader(w), e.shaderSource(j, le), e.compileShader(j), f.shaderError(e, j, le, w, J), ce[N] = j;
            }
            return j;
          }
          var te = {}, Q = [], ae = 0;
          function fe(w, N) {
            this.id = ae++, this.fragId = w, this.vertId = N, this.program = null, this.uniforms = [], this.attributes = [], this.refCount = 1, M.profile && (this.stats = {
              uniformsCount: 0,
              attributesCount: 0
            });
          }
          function q(w, N, J) {
            var ce, j, le = K(Ji, w.fragId), W = K(Mu, w.vertId), se = w.program = e.createProgram();
            if (e.attachShader(se, le), e.attachShader(se, W), J)
              for (ce = 0; ce < J.length; ++ce) {
                var H = J[ce];
                e.bindAttribLocation(se, H[0], H[1]);
              }
            e.linkProgram(se), f.linkError(
              e,
              se,
              r.str(w.fragId),
              r.str(w.vertId),
              N
            );
            var oe = e.getProgramParameter(se, ku);
            M.profile && (w.stats.uniformsCount = oe);
            var _e = w.uniforms;
            for (ce = 0; ce < oe; ++ce)
              if (j = e.getActiveUniform(se, ce), j)
                if (j.size > 1)
                  for (var Te = 0; Te < j.size; ++Te) {
                    var ue = j.name.replace("[0]", "[" + Te + "]");
                    Y(_e, new B(
                      ue,
                      r.id(ue),
                      e.getUniformLocation(se, ue),
                      j
                    ));
                  }
                else
                  Y(_e, new B(
                    j.name,
                    r.id(j.name),
                    e.getUniformLocation(se, j.name),
                    j
                  ));
            var re = e.getProgramParameter(se, Iu);
            M.profile && (w.stats.attributesCount = re);
            var z = w.attributes;
            for (ce = 0; ce < re; ++ce)
              j = e.getActiveAttrib(se, ce), j && Y(z, new B(
                j.name,
                r.id(j.name),
                e.getAttribLocation(se, j.name),
                j
              ));
          }
          M.profile && (l.getMaxUniformsCount = function() {
            var w = 0;
            return Q.forEach(function(N) {
              N.stats.uniformsCount > w && (w = N.stats.uniformsCount);
            }), w;
          }, l.getMaxAttributesCount = function() {
            var w = 0;
            return Q.forEach(function(N) {
              N.stats.attributesCount > w && (w = N.stats.attributesCount);
            }), w;
          });
          function ie() {
            $ = {}, G = {};
            for (var w = 0; w < Q.length; ++w)
              q(Q[w], null, Q[w].attributes.map(function(N) {
                return [N.location, N.name];
              }));
          }
          return {
            clear: function() {
              var w = e.deleteShader.bind(e);
              Lt($).forEach(w), $ = {}, Lt(G).forEach(w), G = {}, Q.forEach(function(N) {
                e.deleteProgram(N.program);
              }), Q.length = 0, te = {}, l.shaderCount = 0;
            },
            program: function(w, N, J, ce) {
              f.command(w >= 0, "missing vertex shader", J), f.command(N >= 0, "missing fragment shader", J);
              var j = te[N];
              j || (j = te[N] = {});
              var le = j[w];
              if (le && (le.refCount++, !ce))
                return le;
              var W = new fe(N, w);
              return l.shaderCount++, q(W, J, ce), le || (j[w] = W), Q.push(W), b(W, {
                destroy: function() {
                  if (W.refCount--, W.refCount <= 0) {
                    e.deleteProgram(W.program);
                    var se = Q.indexOf(W);
                    Q.splice(se, 1), l.shaderCount--;
                  }
                  j[W.vertId].refCount <= 0 && (e.deleteShader(G[W.vertId]), delete G[W.vertId], delete te[W.fragId][W.vertId]), Object.keys(te[W.fragId]).length || (e.deleteShader($[W.fragId]), delete $[W.fragId], delete te[W.fragId]);
                }
              });
            },
            restore: ie,
            shader: K,
            frag: -1,
            vert: -1
          };
        }
        var Nu = 6408, kr = 5121, Du = 3333, hn = 5126;
        function Pu(e, r, l, M, $, G, B) {
          function Y(Q) {
            var ae;
            r.next === null ? (f(
              $.preserveDrawingBuffer,
              'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer'
            ), ae = kr) : (f(
              r.next.colorAttachments[0].texture !== null,
              "You cannot read from a renderbuffer"
            ), ae = r.next.colorAttachments[0].texture._texture.type, G.oes_texture_float ? (f(
              ae === kr || ae === hn,
              "Reading from a framebuffer is only allowed for the types 'uint8' and 'float'"
            ), ae === hn && f(B.readFloat, "Reading 'float' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float")) : f(
              ae === kr,
              "Reading from a framebuffer is only allowed for the type 'uint8'"
            ));
            var fe = 0, q = 0, ie = M.framebufferWidth, w = M.framebufferHeight, N = null;
            p(Q) ? N = Q : Q && (f.type(Q, "object", "invalid arguments to regl.read()"), fe = Q.x | 0, q = Q.y | 0, f(
              fe >= 0 && fe < M.framebufferWidth,
              "invalid x offset for regl.read"
            ), f(
              q >= 0 && q < M.framebufferHeight,
              "invalid y offset for regl.read"
            ), ie = (Q.width || M.framebufferWidth - fe) | 0, w = (Q.height || M.framebufferHeight - q) | 0, N = Q.data || null), N && (ae === kr ? f(
              N instanceof Uint8Array,
              "buffer must be 'Uint8Array' when reading from a framebuffer of type 'uint8'"
            ) : ae === hn && f(
              N instanceof Float32Array,
              "buffer must be 'Float32Array' when reading from a framebuffer of type 'float'"
            )), f(
              ie > 0 && ie + fe <= M.framebufferWidth,
              "invalid width for read pixels"
            ), f(
              w > 0 && w + q <= M.framebufferHeight,
              "invalid height for read pixels"
            ), l();
            var J = ie * w * 4;
            return N || (ae === kr ? N = new Uint8Array(J) : ae === hn && (N = N || new Float32Array(J))), f.isTypedArray(N, "data buffer for regl.read() must be a typedarray"), f(N.byteLength >= J, "data buffer for regl.read() too small"), e.pixelStorei(Du, 4), e.readPixels(
              fe,
              q,
              ie,
              w,
              Nu,
              ae,
              N
            ), N;
          }
          function K(Q) {
            var ae;
            return r.setFBO({
              framebuffer: Q.framebuffer
            }, function() {
              ae = Y(Q);
            }), ae;
          }
          function te(Q) {
            return !Q || !("framebuffer" in Q) ? Y(Q) : K(Q);
          }
          return te;
        }
        function yr(e) {
          return Array.prototype.slice.call(e);
        }
        function br(e) {
          return yr(e).join("");
        }
        function $u() {
          var e = 0, r = [], l = [];
          function M(ae) {
            for (var fe = 0; fe < l.length; ++fe)
              if (l[fe] === ae)
                return r[fe];
            var q = "g" + e++;
            return r.push(q), l.push(ae), q;
          }
          function $() {
            var ae = [];
            function fe() {
              ae.push.apply(ae, yr(arguments));
            }
            var q = [];
            function ie() {
              var w = "v" + e++;
              return q.push(w), arguments.length > 0 && (ae.push(w, "="), ae.push.apply(ae, yr(arguments)), ae.push(";")), w;
            }
            return b(fe, {
              def: ie,
              toString: function() {
                return br([
                  q.length > 0 ? "var " + q.join(",") + ";" : "",
                  br(ae)
                ]);
              }
            });
          }
          function G() {
            var ae = $(), fe = $(), q = ae.toString, ie = fe.toString;
            function w(N, J) {
              fe(N, J, "=", ae.def(N, J), ";");
            }
            return b(function() {
              ae.apply(ae, yr(arguments));
            }, {
              def: ae.def,
              entry: ae,
              exit: fe,
              save: w,
              set: function(N, J, ce) {
                w(N, J), ae(N, J, "=", ce, ";");
              },
              toString: function() {
                return q() + ie();
              }
            });
          }
          function B() {
            var ae = br(arguments), fe = G(), q = G(), ie = fe.toString, w = q.toString;
            return b(fe, {
              then: function() {
                return fe.apply(fe, yr(arguments)), this;
              },
              else: function() {
                return q.apply(q, yr(arguments)), this;
              },
              toString: function() {
                var N = w();
                return N && (N = "else{" + N + "}"), br([
                  "if(",
                  ae,
                  "){",
                  ie(),
                  "}",
                  N
                ]);
              }
            });
          }
          var Y = $(), K = {};
          function te(ae, fe) {
            var q = [];
            function ie() {
              var j = "a" + q.length;
              return q.push(j), j;
            }
            fe = fe || 0;
            for (var w = 0; w < fe; ++w)
              ie();
            var N = G(), J = N.toString, ce = K[ae] = b(N, {
              arg: ie,
              toString: function() {
                return br([
                  "function(",
                  q.join(),
                  "){",
                  J(),
                  "}"
                ]);
              }
            });
            return ce;
          }
          function Q() {
            var ae = [
              '"use strict";',
              Y,
              "return {"
            ];
            Object.keys(K).forEach(function(ie) {
              ae.push('"', ie, '":', K[ie].toString(), ",");
            }), ae.push("}");
            var fe = br(ae).replace(/;/g, `;
`).replace(/}/g, `}
`).replace(/{/g, `{
`), q = Function.apply(null, r.concat(fe));
            return q.apply(null, l);
          }
          return {
            global: Y,
            link: M,
            block: $,
            proc: te,
            scope: G,
            cond: B,
            compile: Q
          };
        }
        var _r = "xyzw".split(""), es = 5121, gr = 1, oa = 2, fa = 0, ua = 1, ca = 2, la = 3, dn = 4, ts = 5, rs = 6, ns = "dither", as = "blend.enable", is = "blend.color", ha = "blend.equation", da = "blend.func", ss = "depth.enable", os = "depth.func", fs = "depth.range", us = "depth.mask", ma = "colorMask", cs = "cull.enable", ls = "cull.face", pa = "frontFace", va = "lineWidth", hs = "polygonOffset.enable", ya = "polygonOffset.offset", ds = "sample.alpha", ms = "sample.enable", ba = "sample.coverage", ps = "stencil.enable", vs = "stencil.mask", _a = "stencil.func", ga = "stencil.opFront", Ir = "stencil.opBack", ys = "scissor.enable", mn = "scissor.box", Ut = "viewport", Br = "profile", tr = "framebuffer", Nr = "vert", Dr = "frag", rr = "elements", nr = "primitive", ar = "count", pn = "offset", vn = "instances", Pr = "vao", Ea = "Width", xa = "Height", Er = tr + Ea, xr = tr + xa, Uu = Ut + Ea, zu = Ut + xa, bs = "drawingBuffer", _s = bs + Ea, gs = bs + xa, ju = [
          da,
          ha,
          _a,
          ga,
          Ir,
          ba,
          Ut,
          mn,
          ya
        ], Tr = 34962, Xu = 34963, Vu = 35632, Hu = 35633, Es = 3553, Wu = 34067, Yu = 2884, qu = 3042, Ku = 3024, Qu = 2960, Zu = 2929, Ju = 3089, ec = 32823, tc = 32926, rc = 32928, Ta = 5126, yn = 35664, bn = 35665, _n = 35666, Aa = 5124, gn = 35667, En = 35668, xn = 35669, wa = 35670, Tn = 35671, An = 35672, wn = 35673, $r = 35674, Ur = 35675, zr = 35676, jr = 35678, Xr = 35680, xs = 4, Vr = 1028, ir = 1029, Ts = 2304, Sa = 2305, nc = 32775, ac = 32776, ic = 519, Vt = 7680, As = 0, ws = 1, Ss = 32774, sc = 513, Ls = 36160, oc = 36064, Dt = {
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
        }, Rs = [
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
        }, Os = {
          frag: Vu,
          vert: Hu
        }, La = {
          cw: Ts,
          ccw: Sa
        };
        function Sn(e) {
          return Array.isArray(e) || p(e) || Mt(e);
        }
        function Cs(e) {
          return e.sort(function(r, l) {
            return r === Ut ? -1 : l === Ut ? 1 : r < l ? -1 : 1;
          });
        }
        function bt(e, r, l, M) {
          this.thisDep = e, this.contextDep = r, this.propDep = l, this.append = M;
        }
        function Wt(e) {
          return e && !(e.thisDep || e.contextDep || e.propDep);
        }
        function tt(e) {
          return new bt(!1, !1, !1, e);
        }
        function xt(e, r) {
          var l = e.type;
          if (l === fa) {
            var M = e.data.length;
            return new bt(
              !0,
              M >= 1,
              M >= 2,
              r
            );
          } else if (l === dn) {
            var $ = e.data;
            return new bt(
              $.thisDep,
              $.contextDep,
              $.propDep,
              r
            );
          } else {
            if (l === ts)
              return new bt(
                !1,
                !1,
                !1,
                r
              );
            if (l === rs) {
              for (var G = !1, B = !1, Y = !1, K = 0; K < e.data.length; ++K) {
                var te = e.data[K];
                if (te.type === ua)
                  Y = !0;
                else if (te.type === ca)
                  B = !0;
                else if (te.type === la)
                  G = !0;
                else if (te.type === fa) {
                  G = !0;
                  var Q = te.data;
                  Q >= 1 && (B = !0), Q >= 2 && (Y = !0);
                } else te.type === dn && (G = G || te.data.thisDep, B = B || te.data.contextDep, Y = Y || te.data.propDep);
              }
              return new bt(
                G,
                B,
                Y,
                r
              );
            } else
              return new bt(
                l === la,
                l === ca,
                l === ua,
                r
              );
          }
        }
        var Fs = new bt(!1, !1, !1, function() {
        });
        function fc(e, r, l, M, $, G, B, Y, K, te, Q, ae, fe, q, ie) {
          var w = te.Record, N = {
            add: 32774,
            subtract: 32778,
            "reverse subtract": 32779
          };
          l.ext_blend_minmax && (N.min = nc, N.max = ac);
          var J = l.angle_instanced_arrays, ce = l.webgl_draw_buffers, j = {
            dirty: !0,
            profile: ie.profile
          }, le = {}, W = [], se = {}, H = {};
          function oe(s) {
            return s.replace(".", "_");
          }
          function _e(s, t, d) {
            var A = oe(s);
            W.push(s), le[A] = j[A] = !!d, se[A] = t;
          }
          function Te(s, t, d) {
            var A = oe(s);
            W.push(s), Array.isArray(d) ? (j[A] = d.slice(), le[A] = d.slice()) : j[A] = le[A] = d, H[A] = t;
          }
          _e(ns, Ku), _e(as, qu), Te(is, "blendColor", [0, 0, 0, 0]), Te(
            ha,
            "blendEquationSeparate",
            [Ss, Ss]
          ), Te(
            da,
            "blendFuncSeparate",
            [ws, As, ws, As]
          ), _e(ss, Zu, !0), Te(os, "depthFunc", sc), Te(fs, "depthRange", [0, 1]), Te(us, "depthMask", !0), Te(ma, ma, [!0, !0, !0, !0]), _e(cs, Yu), Te(ls, "cullFace", ir), Te(pa, pa, Sa), Te(va, va, 1), _e(hs, ec), Te(ya, "polygonOffset", [0, 0]), _e(ds, tc), _e(ms, rc), Te(ba, "sampleCoverage", [1, !1]), _e(ps, Qu), Te(vs, "stencilMask", -1), Te(_a, "stencilFunc", [ic, 0, -1]), Te(
            ga,
            "stencilOpSeparate",
            [Vr, Vt, Vt, Vt]
          ), Te(
            Ir,
            "stencilOpSeparate",
            [ir, Vt, Vt, Vt]
          ), _e(ys, Ju), Te(
            mn,
            "scissor",
            [0, 0, e.drawingBufferWidth, e.drawingBufferHeight]
          ), Te(
            Ut,
            Ut,
            [0, 0, e.drawingBufferWidth, e.drawingBufferHeight]
          );
          var ue = {
            gl: e,
            context: fe,
            strings: r,
            next: le,
            current: j,
            draw: ae,
            elements: G,
            buffer: $,
            shader: Q,
            attributes: te.state,
            vao: te,
            uniforms: K,
            framebuffer: Y,
            extensions: l,
            timer: q,
            isBufferArgs: Sn
          }, re = {
            primTypes: ur,
            compareFuncs: Ar,
            blendFuncs: Dt,
            blendEquations: N,
            stencilOps: Ht,
            glTypes: Kt,
            orientationType: La
          };
          f.optional(function() {
            ue.isArrayLike = Qe;
          }), ce && (re.backBuffer = [ir], re.drawBuffer = Et(M.maxDrawbuffers, function(s) {
            return s === 0 ? [0] : Et(s, function(t) {
              return oc + t;
            });
          }));
          var z = 0;
          function xe() {
            var s = $u(), t = s.link, d = s.global;
            s.id = z++, s.batchId = "0";
            var A = t(ue), S = s.shared = {
              props: "a0"
            };
            Object.keys(ue).forEach(function(h) {
              S[h] = d.def(A, ".", h);
            }), f.optional(function() {
              s.CHECK = t(f), s.commandStr = f.guessCommand(), s.command = t(s.commandStr), s.assert = function(h, i, E) {
                h(
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
              }, re.invalidBlendCombinations = Rs;
            });
            var y = s.next = {}, m = s.current = {};
            Object.keys(H).forEach(function(h) {
              Array.isArray(j[h]) && (y[h] = d.def(S.next, ".", h), m[h] = d.def(S.current, ".", h));
            });
            var g = s.constants = {};
            Object.keys(re).forEach(function(h) {
              g[h] = d.def(JSON.stringify(re[h]));
            }), s.invoke = function(h, i) {
              switch (i.type) {
                case fa:
                  var E = [
                    "this",
                    S.context,
                    S.props,
                    s.batchId
                  ];
                  return h.def(
                    t(i.data),
                    ".call(",
                    E.slice(0, Math.max(i.data.length + 1, 4)),
                    ")"
                  );
                case ua:
                  return h.def(S.props, i.data);
                case ca:
                  return h.def(S.context, i.data);
                case la:
                  return h.def("this", i.data);
                case dn:
                  return i.data.append(s, h), i.data.ref;
                case ts:
                  return i.data.toString();
                case rs:
                  return i.data.map(function(L) {
                    return s.invoke(h, L);
                  });
              }
            }, s.attribCache = {};
            var o = {};
            return s.scopeAttrib = function(h) {
              var i = r.id(h);
              if (i in o)
                return o[i];
              var E = te.scope[i];
              E || (E = te.scope[i] = new w());
              var L = o[i] = t(E);
              return L;
            }, s;
          }
          function Re(s) {
            var t = s.static, d = s.dynamic, A;
            if (Br in t) {
              var S = !!t[Br];
              A = tt(function(m, g) {
                return S;
              }), A.enable = S;
            } else if (Br in d) {
              var y = d[Br];
              A = xt(y, function(m, g) {
                return m.invoke(g, y);
              });
            }
            return A;
          }
          function de(s, t) {
            var d = s.static, A = s.dynamic;
            if (tr in d) {
              var S = d[tr];
              return S ? (S = Y.getFramebuffer(S), f.command(S, "invalid framebuffer object"), tt(function(m, g) {
                var o = m.link(S), h = m.shared;
                g.set(
                  h.framebuffer,
                  ".next",
                  o
                );
                var i = h.context;
                return g.set(
                  i,
                  "." + Er,
                  o + ".width"
                ), g.set(
                  i,
                  "." + xr,
                  o + ".height"
                ), o;
              })) : tt(function(m, g) {
                var o = m.shared;
                g.set(
                  o.framebuffer,
                  ".next",
                  "null"
                );
                var h = o.context;
                return g.set(
                  h,
                  "." + Er,
                  h + "." + _s
                ), g.set(
                  h,
                  "." + xr,
                  h + "." + gs
                ), "null";
              });
            } else if (tr in A) {
              var y = A[tr];
              return xt(y, function(m, g) {
                var o = m.invoke(g, y), h = m.shared, i = h.framebuffer, E = g.def(
                  i,
                  ".getFramebuffer(",
                  o,
                  ")"
                );
                f.optional(function() {
                  m.assert(
                    g,
                    "!" + o + "||" + E,
                    "invalid framebuffer object"
                  );
                }), g.set(
                  i,
                  ".next",
                  E
                );
                var L = h.context;
                return g.set(
                  L,
                  "." + Er,
                  E + "?" + E + ".width:" + L + "." + _s
                ), g.set(
                  L,
                  "." + xr,
                  E + "?" + E + ".height:" + L + "." + gs
                ), E;
              });
            } else
              return null;
          }
          function ke(s, t, d) {
            var A = s.static, S = s.dynamic;
            function y(o) {
              if (o in A) {
                var h = A[o];
                f.commandType(h, "object", "invalid " + o, d.commandStr);
                var i = !0, E = h.x | 0, L = h.y | 0, P, U;
                return "width" in h ? (P = h.width | 0, f.command(P >= 0, "invalid " + o, d.commandStr)) : i = !1, "height" in h ? (U = h.height | 0, f.command(U >= 0, "invalid " + o, d.commandStr)) : i = !1, new bt(
                  !i && t && t.thisDep,
                  !i && t && t.contextDep,
                  !i && t && t.propDep,
                  function(be, Ce) {
                    var me = be.shared.context, Ee = P;
                    "width" in h || (Ee = Ce.def(me, ".", Er, "-", E));
                    var Le = U;
                    return "height" in h || (Le = Ce.def(me, ".", xr, "-", L)), [E, L, Ee, Le];
                  }
                );
              } else if (o in S) {
                var D = S[o], Z = xt(D, function(be, Ce) {
                  var me = be.invoke(Ce, D);
                  f.optional(function() {
                    be.assert(
                      Ce,
                      me + "&&typeof " + me + '==="object"',
                      "invalid " + o
                    );
                  });
                  var Ee = be.shared.context, Le = Ce.def(me, ".x|0"), Ve = Ce.def(me, ".y|0"), qe = Ce.def(
                    '"width" in ',
                    me,
                    "?",
                    me,
                    ".width|0:",
                    "(",
                    Ee,
                    ".",
                    Er,
                    "-",
                    Le,
                    ")"
                  ), _t = Ce.def(
                    '"height" in ',
                    me,
                    "?",
                    me,
                    ".height|0:",
                    "(",
                    Ee,
                    ".",
                    xr,
                    "-",
                    Ve,
                    ")"
                  );
                  return f.optional(function() {
                    be.assert(
                      Ce,
                      qe + ">=0&&" + _t + ">=0",
                      "invalid " + o
                    );
                  }), [Le, Ve, qe, _t];
                });
                return t && (Z.thisDep = Z.thisDep || t.thisDep, Z.contextDep = Z.contextDep || t.contextDep, Z.propDep = Z.propDep || t.propDep), Z;
              } else return t ? new bt(
                t.thisDep,
                t.contextDep,
                t.propDep,
                function(be, Ce) {
                  var me = be.shared.context;
                  return [
                    0,
                    0,
                    Ce.def(me, ".", Er),
                    Ce.def(me, ".", xr)
                  ];
                }
              ) : null;
            }
            var m = y(Ut);
            if (m) {
              var g = m;
              m = new bt(
                m.thisDep,
                m.contextDep,
                m.propDep,
                function(o, h) {
                  var i = g.append(o, h), E = o.shared.context;
                  return h.set(
                    E,
                    "." + Uu,
                    i[2]
                  ), h.set(
                    E,
                    "." + zu,
                    i[3]
                  ), i;
                }
              );
            }
            return {
              viewport: m,
              scissor_box: y(mn)
            };
          }
          function we(s, t) {
            var d = s.static, A = typeof d[Dr] == "string" && typeof d[Nr] == "string";
            if (A) {
              if (Object.keys(t.dynamic).length > 0)
                return null;
              var S = t.static, y = Object.keys(S);
              if (y.length > 0 && typeof S[y[0]] == "number") {
                for (var m = [], g = 0; g < y.length; ++g)
                  f(typeof S[y[g]] == "number", "must specify all vertex attribute locations when using vaos"), m.push([S[y[g]] | 0, y[g]]);
                return m;
              }
            }
            return null;
          }
          function Ge(s, t, d) {
            var A = s.static, S = s.dynamic;
            function y(i) {
              if (i in A) {
                var E = r.id(A[i]);
                f.optional(function() {
                  Q.shader(Os[i], E, f.guessCommand());
                });
                var L = tt(function() {
                  return E;
                });
                return L.id = E, L;
              } else if (i in S) {
                var P = S[i];
                return xt(P, function(U, D) {
                  var Z = U.invoke(D, P), be = D.def(U.shared.strings, ".id(", Z, ")");
                  return f.optional(function() {
                    D(
                      U.shared.shader,
                      ".shader(",
                      Os[i],
                      ",",
                      be,
                      ",",
                      U.command,
                      ");"
                    );
                  }), be;
                });
              }
              return null;
            }
            var m = y(Dr), g = y(Nr), o = null, h;
            return Wt(m) && Wt(g) ? (o = Q.program(g.id, m.id, null, d), h = tt(function(i, E) {
              return i.link(o);
            })) : h = new bt(
              m && m.thisDep || g && g.thisDep,
              m && m.contextDep || g && g.contextDep,
              m && m.propDep || g && g.propDep,
              function(i, E) {
                var L = i.shared.shader, P;
                m ? P = m.append(i, E) : P = E.def(L, ".", Dr);
                var U;
                g ? U = g.append(i, E) : U = E.def(L, ".", Nr);
                var D = L + ".program(" + U + "," + P;
                return f.optional(function() {
                  D += "," + i.command;
                }), E.def(D + ")");
              }
            ), {
              frag: m,
              vert: g,
              progVar: h,
              program: o
            };
          }
          function Xe(s, t) {
            var d = s.static, A = s.dynamic;
            function S() {
              if (rr in d) {
                var i = d[rr];
                Sn(i) ? i = G.getElements(G.create(i, !0)) : i && (i = G.getElements(i), f.command(i, "invalid elements", t.commandStr));
                var E = tt(function(P, U) {
                  if (i) {
                    var D = P.link(i);
                    return P.ELEMENTS = D, D;
                  }
                  return P.ELEMENTS = null, null;
                });
                return E.value = i, E;
              } else if (rr in A) {
                var L = A[rr];
                return xt(L, function(P, U) {
                  var D = P.shared, Z = D.isBufferArgs, be = D.elements, Ce = P.invoke(U, L), me = U.def("null"), Ee = U.def(Z, "(", Ce, ")"), Le = P.cond(Ee).then(me, "=", be, ".createStream(", Ce, ");").else(me, "=", be, ".getElements(", Ce, ");");
                  return f.optional(function() {
                    P.assert(
                      Le.else,
                      "!" + Ce + "||" + me,
                      "invalid elements"
                    );
                  }), U.entry(Le), U.exit(
                    P.cond(Ee).then(be, ".destroyStream(", me, ");")
                  ), P.ELEMENTS = me, me;
                });
              }
              return null;
            }
            var y = S();
            function m() {
              if (nr in d) {
                var i = d[nr];
                return f.commandParameter(i, ur, "invalid primitve", t.commandStr), tt(function(L, P) {
                  return ur[i];
                });
              } else if (nr in A) {
                var E = A[nr];
                return xt(E, function(L, P) {
                  var U = L.constants.primTypes, D = L.invoke(P, E);
                  return f.optional(function() {
                    L.assert(
                      P,
                      D + " in " + U,
                      "invalid primitive, must be one of " + Object.keys(ur)
                    );
                  }), P.def(U, "[", D, "]");
                });
              } else if (y)
                return Wt(y) ? y.value ? tt(function(L, P) {
                  return P.def(L.ELEMENTS, ".primType");
                }) : tt(function() {
                  return xs;
                }) : new bt(
                  y.thisDep,
                  y.contextDep,
                  y.propDep,
                  function(L, P) {
                    var U = L.ELEMENTS;
                    return P.def(U, "?", U, ".primType:", xs);
                  }
                );
              return null;
            }
            function g(i, E) {
              if (i in d) {
                var L = d[i] | 0;
                return f.command(!E || L >= 0, "invalid " + i, t.commandStr), tt(function(U, D) {
                  return E && (U.OFFSET = L), L;
                });
              } else if (i in A) {
                var P = A[i];
                return xt(P, function(U, D) {
                  var Z = U.invoke(D, P);
                  return E && (U.OFFSET = Z, f.optional(function() {
                    U.assert(
                      D,
                      Z + ">=0",
                      "invalid " + i
                    );
                  })), Z;
                });
              } else if (E && y)
                return tt(function(U, D) {
                  return U.OFFSET = "0", 0;
                });
              return null;
            }
            var o = g(pn, !0);
            function h() {
              if (ar in d) {
                var i = d[ar] | 0;
                return f.command(
                  typeof i == "number" && i >= 0,
                  "invalid vertex count",
                  t.commandStr
                ), tt(function() {
                  return i;
                });
              } else if (ar in A) {
                var E = A[ar];
                return xt(E, function(U, D) {
                  var Z = U.invoke(D, E);
                  return f.optional(function() {
                    U.assert(
                      D,
                      "typeof " + Z + '==="number"&&' + Z + ">=0&&" + Z + "===(" + Z + "|0)",
                      "invalid vertex count"
                    );
                  }), Z;
                });
              } else if (y)
                if (Wt(y)) {
                  if (y)
                    return o ? new bt(
                      o.thisDep,
                      o.contextDep,
                      o.propDep,
                      function(U, D) {
                        var Z = D.def(
                          U.ELEMENTS,
                          ".vertCount-",
                          U.OFFSET
                        );
                        return f.optional(function() {
                          U.assert(
                            D,
                            Z + ">=0",
                            "invalid vertex offset/element buffer too small"
                          );
                        }), Z;
                      }
                    ) : tt(function(U, D) {
                      return D.def(U.ELEMENTS, ".vertCount");
                    });
                  var L = tt(function() {
                    return -1;
                  });
                  return f.optional(function() {
                    L.MISSING = !0;
                  }), L;
                } else {
                  var P = new bt(
                    y.thisDep || o.thisDep,
                    y.contextDep || o.contextDep,
                    y.propDep || o.propDep,
                    function(U, D) {
                      var Z = U.ELEMENTS;
                      return U.OFFSET ? D.def(
                        Z,
                        "?",
                        Z,
                        ".vertCount-",
                        U.OFFSET,
                        ":-1"
                      ) : D.def(Z, "?", Z, ".vertCount:-1");
                    }
                  );
                  return f.optional(function() {
                    P.DYNAMIC = !0;
                  }), P;
                }
              return null;
            }
            return {
              elements: y,
              primitive: m(),
              count: h(),
              instances: g(vn, !1),
              offset: o
            };
          }
          function rt(s, t) {
            var d = s.static, A = s.dynamic, S = {};
            return W.forEach(function(y) {
              var m = oe(y);
              function g(o, h) {
                if (y in d) {
                  var i = o(d[y]);
                  S[m] = tt(function() {
                    return i;
                  });
                } else if (y in A) {
                  var E = A[y];
                  S[m] = xt(E, function(L, P) {
                    return h(L, P, L.invoke(P, E));
                  });
                }
              }
              switch (y) {
                case cs:
                case as:
                case ns:
                case ps:
                case ss:
                case ys:
                case hs:
                case ds:
                case ms:
                case us:
                  return g(
                    function(o) {
                      return f.commandType(o, "boolean", y, t.commandStr), o;
                    },
                    function(o, h, i) {
                      return f.optional(function() {
                        o.assert(
                          h,
                          "typeof " + i + '==="boolean"',
                          "invalid flag " + y,
                          o.commandStr
                        );
                      }), i;
                    }
                  );
                case os:
                  return g(
                    function(o) {
                      return f.commandParameter(o, Ar, "invalid " + y, t.commandStr), Ar[o];
                    },
                    function(o, h, i) {
                      var E = o.constants.compareFuncs;
                      return f.optional(function() {
                        o.assert(
                          h,
                          i + " in " + E,
                          "invalid " + y + ", must be one of " + Object.keys(Ar)
                        );
                      }), h.def(E, "[", i, "]");
                    }
                  );
                case fs:
                  return g(
                    function(o) {
                      return f.command(
                        Qe(o) && o.length === 2 && typeof o[0] == "number" && typeof o[1] == "number" && o[0] <= o[1],
                        "depth range is 2d array",
                        t.commandStr
                      ), o;
                    },
                    function(o, h, i) {
                      f.optional(function() {
                        o.assert(
                          h,
                          o.shared.isArrayLike + "(" + i + ")&&" + i + ".length===2&&typeof " + i + '[0]==="number"&&typeof ' + i + '[1]==="number"&&' + i + "[0]<=" + i + "[1]",
                          "depth range must be a 2d array"
                        );
                      });
                      var E = h.def("+", i, "[0]"), L = h.def("+", i, "[1]");
                      return [E, L];
                    }
                  );
                case da:
                  return g(
                    function(o) {
                      f.commandType(o, "object", "blend.func", t.commandStr);
                      var h = "srcRGB" in o ? o.srcRGB : o.src, i = "srcAlpha" in o ? o.srcAlpha : o.src, E = "dstRGB" in o ? o.dstRGB : o.dst, L = "dstAlpha" in o ? o.dstAlpha : o.dst;
                      return f.commandParameter(h, Dt, m + ".srcRGB", t.commandStr), f.commandParameter(i, Dt, m + ".srcAlpha", t.commandStr), f.commandParameter(E, Dt, m + ".dstRGB", t.commandStr), f.commandParameter(L, Dt, m + ".dstAlpha", t.commandStr), f.command(
                        Rs.indexOf(h + ", " + E) === -1,
                        "unallowed blending combination (srcRGB, dstRGB) = (" + h + ", " + E + ")",
                        t.commandStr
                      ), [
                        Dt[h],
                        Dt[E],
                        Dt[i],
                        Dt[L]
                      ];
                    },
                    function(o, h, i) {
                      var E = o.constants.blendFuncs;
                      f.optional(function() {
                        o.assert(
                          h,
                          i + "&&typeof " + i + '==="object"',
                          "invalid blend func, must be an object"
                        );
                      });
                      function L(me, Ee) {
                        var Le = h.def(
                          '"',
                          me,
                          Ee,
                          '" in ',
                          i,
                          "?",
                          i,
                          ".",
                          me,
                          Ee,
                          ":",
                          i,
                          ".",
                          me
                        );
                        return f.optional(function() {
                          o.assert(
                            h,
                            Le + " in " + E,
                            "invalid " + y + "." + me + Ee + ", must be one of " + Object.keys(Dt)
                          );
                        }), Le;
                      }
                      var P = L("src", "RGB"), U = L("dst", "RGB");
                      f.optional(function() {
                        var me = o.constants.invalidBlendCombinations;
                        o.assert(
                          h,
                          me + ".indexOf(" + P + '+", "+' + U + ") === -1 ",
                          "unallowed blending combination for (srcRGB, dstRGB)"
                        );
                      });
                      var D = h.def(E, "[", P, "]"), Z = h.def(E, "[", L("src", "Alpha"), "]"), be = h.def(E, "[", U, "]"), Ce = h.def(E, "[", L("dst", "Alpha"), "]");
                      return [D, be, Z, Ce];
                    }
                  );
                case ha:
                  return g(
                    function(o) {
                      if (typeof o == "string")
                        return f.commandParameter(o, N, "invalid " + y, t.commandStr), [
                          N[o],
                          N[o]
                        ];
                      if (typeof o == "object")
                        return f.commandParameter(
                          o.rgb,
                          N,
                          y + ".rgb",
                          t.commandStr
                        ), f.commandParameter(
                          o.alpha,
                          N,
                          y + ".alpha",
                          t.commandStr
                        ), [
                          N[o.rgb],
                          N[o.alpha]
                        ];
                      f.commandRaise("invalid blend.equation", t.commandStr);
                    },
                    function(o, h, i) {
                      var E = o.constants.blendEquations, L = h.def(), P = h.def(), U = o.cond("typeof ", i, '==="string"');
                      return f.optional(function() {
                        function D(Z, be, Ce) {
                          o.assert(
                            Z,
                            Ce + " in " + E,
                            "invalid " + be + ", must be one of " + Object.keys(N)
                          );
                        }
                        D(U.then, y, i), o.assert(
                          U.else,
                          i + "&&typeof " + i + '==="object"',
                          "invalid " + y
                        ), D(U.else, y + ".rgb", i + ".rgb"), D(U.else, y + ".alpha", i + ".alpha");
                      }), U.then(
                        L,
                        "=",
                        P,
                        "=",
                        E,
                        "[",
                        i,
                        "];"
                      ), U.else(
                        L,
                        "=",
                        E,
                        "[",
                        i,
                        ".rgb];",
                        P,
                        "=",
                        E,
                        "[",
                        i,
                        ".alpha];"
                      ), h(U), [L, P];
                    }
                  );
                case is:
                  return g(
                    function(o) {
                      return f.command(
                        Qe(o) && o.length === 4,
                        "blend.color must be a 4d array",
                        t.commandStr
                      ), Et(4, function(h) {
                        return +o[h];
                      });
                    },
                    function(o, h, i) {
                      return f.optional(function() {
                        o.assert(
                          h,
                          o.shared.isArrayLike + "(" + i + ")&&" + i + ".length===4",
                          "blend.color must be a 4d array"
                        );
                      }), Et(4, function(E) {
                        return h.def("+", i, "[", E, "]");
                      });
                    }
                  );
                case vs:
                  return g(
                    function(o) {
                      return f.commandType(o, "number", m, t.commandStr), o | 0;
                    },
                    function(o, h, i) {
                      return f.optional(function() {
                        o.assert(
                          h,
                          "typeof " + i + '==="number"',
                          "invalid stencil.mask"
                        );
                      }), h.def(i, "|0");
                    }
                  );
                case _a:
                  return g(
                    function(o) {
                      f.commandType(o, "object", m, t.commandStr);
                      var h = o.cmp || "keep", i = o.ref || 0, E = "mask" in o ? o.mask : -1;
                      return f.commandParameter(h, Ar, y + ".cmp", t.commandStr), f.commandType(i, "number", y + ".ref", t.commandStr), f.commandType(E, "number", y + ".mask", t.commandStr), [
                        Ar[h],
                        i,
                        E
                      ];
                    },
                    function(o, h, i) {
                      var E = o.constants.compareFuncs;
                      f.optional(function() {
                        function D() {
                          o.assert(
                            h,
                            Array.prototype.join.call(arguments, ""),
                            "invalid stencil.func"
                          );
                        }
                        D(i + "&&typeof ", i, '==="object"'), D(
                          '!("cmp" in ',
                          i,
                          ")||(",
                          i,
                          ".cmp in ",
                          E,
                          ")"
                        );
                      });
                      var L = h.def(
                        '"cmp" in ',
                        i,
                        "?",
                        E,
                        "[",
                        i,
                        ".cmp]",
                        ":",
                        Vt
                      ), P = h.def(i, ".ref|0"), U = h.def(
                        '"mask" in ',
                        i,
                        "?",
                        i,
                        ".mask|0:-1"
                      );
                      return [L, P, U];
                    }
                  );
                case ga:
                case Ir:
                  return g(
                    function(o) {
                      f.commandType(o, "object", m, t.commandStr);
                      var h = o.fail || "keep", i = o.zfail || "keep", E = o.zpass || "keep";
                      return f.commandParameter(h, Ht, y + ".fail", t.commandStr), f.commandParameter(i, Ht, y + ".zfail", t.commandStr), f.commandParameter(E, Ht, y + ".zpass", t.commandStr), [
                        y === Ir ? ir : Vr,
                        Ht[h],
                        Ht[i],
                        Ht[E]
                      ];
                    },
                    function(o, h, i) {
                      var E = o.constants.stencilOps;
                      f.optional(function() {
                        o.assert(
                          h,
                          i + "&&typeof " + i + '==="object"',
                          "invalid " + y
                        );
                      });
                      function L(P) {
                        return f.optional(function() {
                          o.assert(
                            h,
                            '!("' + P + '" in ' + i + ")||(" + i + "." + P + " in " + E + ")",
                            "invalid " + y + "." + P + ", must be one of " + Object.keys(Ht)
                          );
                        }), h.def(
                          '"',
                          P,
                          '" in ',
                          i,
                          "?",
                          E,
                          "[",
                          i,
                          ".",
                          P,
                          "]:",
                          Vt
                        );
                      }
                      return [
                        y === Ir ? ir : Vr,
                        L("fail"),
                        L("zfail"),
                        L("zpass")
                      ];
                    }
                  );
                case ya:
                  return g(
                    function(o) {
                      f.commandType(o, "object", m, t.commandStr);
                      var h = o.factor | 0, i = o.units | 0;
                      return f.commandType(h, "number", m + ".factor", t.commandStr), f.commandType(i, "number", m + ".units", t.commandStr), [h, i];
                    },
                    function(o, h, i) {
                      f.optional(function() {
                        o.assert(
                          h,
                          i + "&&typeof " + i + '==="object"',
                          "invalid " + y
                        );
                      });
                      var E = h.def(i, ".factor|0"), L = h.def(i, ".units|0");
                      return [E, L];
                    }
                  );
                case ls:
                  return g(
                    function(o) {
                      var h = 0;
                      return o === "front" ? h = Vr : o === "back" && (h = ir), f.command(!!h, m, t.commandStr), h;
                    },
                    function(o, h, i) {
                      return f.optional(function() {
                        o.assert(
                          h,
                          i + '==="front"||' + i + '==="back"',
                          "invalid cull.face"
                        );
                      }), h.def(i, '==="front"?', Vr, ":", ir);
                    }
                  );
                case va:
                  return g(
                    function(o) {
                      return f.command(
                        typeof o == "number" && o >= M.lineWidthDims[0] && o <= M.lineWidthDims[1],
                        "invalid line width, must be a positive number between " + M.lineWidthDims[0] + " and " + M.lineWidthDims[1],
                        t.commandStr
                      ), o;
                    },
                    function(o, h, i) {
                      return f.optional(function() {
                        o.assert(
                          h,
                          "typeof " + i + '==="number"&&' + i + ">=" + M.lineWidthDims[0] + "&&" + i + "<=" + M.lineWidthDims[1],
                          "invalid line width"
                        );
                      }), i;
                    }
                  );
                case pa:
                  return g(
                    function(o) {
                      return f.commandParameter(o, La, m, t.commandStr), La[o];
                    },
                    function(o, h, i) {
                      return f.optional(function() {
                        o.assert(
                          h,
                          i + '==="cw"||' + i + '==="ccw"',
                          "invalid frontFace, must be one of cw,ccw"
                        );
                      }), h.def(i + '==="cw"?' + Ts + ":" + Sa);
                    }
                  );
                case ma:
                  return g(
                    function(o) {
                      return f.command(
                        Qe(o) && o.length === 4,
                        "color.mask must be length 4 array",
                        t.commandStr
                      ), o.map(function(h) {
                        return !!h;
                      });
                    },
                    function(o, h, i) {
                      return f.optional(function() {
                        o.assert(
                          h,
                          o.shared.isArrayLike + "(" + i + ")&&" + i + ".length===4",
                          "invalid color.mask"
                        );
                      }), Et(4, function(E) {
                        return "!!" + i + "[" + E + "]";
                      });
                    }
                  );
                case ba:
                  return g(
                    function(o) {
                      f.command(typeof o == "object" && o, m, t.commandStr);
                      var h = "value" in o ? o.value : 1, i = !!o.invert;
                      return f.command(
                        typeof h == "number" && h >= 0 && h <= 1,
                        "sample.coverage.value must be a number between 0 and 1",
                        t.commandStr
                      ), [h, i];
                    },
                    function(o, h, i) {
                      f.optional(function() {
                        o.assert(
                          h,
                          i + "&&typeof " + i + '==="object"',
                          "invalid sample.coverage"
                        );
                      });
                      var E = h.def(
                        '"value" in ',
                        i,
                        "?+",
                        i,
                        ".value:1"
                      ), L = h.def("!!", i, ".invert");
                      return [E, L];
                    }
                  );
              }
            }), S;
          }
          function ut(s, t) {
            var d = s.static, A = s.dynamic, S = {};
            return Object.keys(d).forEach(function(y) {
              var m = d[y], g;
              if (typeof m == "number" || typeof m == "boolean")
                g = tt(function() {
                  return m;
                });
              else if (typeof m == "function") {
                var o = m._reglType;
                o === "texture2d" || o === "textureCube" ? g = tt(function(h) {
                  return h.link(m);
                }) : o === "framebuffer" || o === "framebufferCube" ? (f.command(
                  m.color.length > 0,
                  'missing color attachment for framebuffer sent to uniform "' + y + '"',
                  t.commandStr
                ), g = tt(function(h) {
                  return h.link(m.color[0]);
                })) : f.commandRaise('invalid data for uniform "' + y + '"', t.commandStr);
              } else Qe(m) ? g = tt(function(h) {
                var i = h.global.def(
                  "[",
                  Et(m.length, function(E) {
                    return f.command(
                      typeof m[E] == "number" || typeof m[E] == "boolean",
                      "invalid uniform " + y,
                      h.commandStr
                    ), m[E];
                  }),
                  "]"
                );
                return i;
              }) : f.commandRaise('invalid or missing data for uniform "' + y + '"', t.commandStr);
              g.value = m, S[y] = g;
            }), Object.keys(A).forEach(function(y) {
              var m = A[y];
              S[y] = xt(m, function(g, o) {
                return g.invoke(o, m);
              });
            }), S;
          }
          function De(s, t) {
            var d = s.static, A = s.dynamic, S = {};
            return Object.keys(d).forEach(function(y) {
              var m = d[y], g = r.id(y), o = new w();
              if (Sn(m))
                o.state = gr, o.buffer = $.getBuffer(
                  $.create(m, Tr, !1, !0)
                ), o.type = 0;
              else {
                var h = $.getBuffer(m);
                if (h)
                  o.state = gr, o.buffer = h, o.type = 0;
                else if (f.command(
                  typeof m == "object" && m,
                  "invalid data for attribute " + y,
                  t.commandStr
                ), "constant" in m) {
                  var i = m.constant;
                  o.buffer = "null", o.state = oa, typeof i == "number" ? o.x = i : (f.command(
                    Qe(i) && i.length > 0 && i.length <= 4,
                    "invalid constant for attribute " + y,
                    t.commandStr
                  ), _r.forEach(function(be, Ce) {
                    Ce < i.length && (o[be] = i[Ce]);
                  }));
                } else {
                  Sn(m.buffer) ? h = $.getBuffer(
                    $.create(m.buffer, Tr, !1, !0)
                  ) : h = $.getBuffer(m.buffer), f.command(!!h, 'missing buffer for attribute "' + y + '"', t.commandStr);
                  var E = m.offset | 0;
                  f.command(
                    E >= 0,
                    'invalid offset for attribute "' + y + '"',
                    t.commandStr
                  );
                  var L = m.stride | 0;
                  f.command(
                    L >= 0 && L < 256,
                    'invalid stride for attribute "' + y + '", must be integer betweeen [0, 255]',
                    t.commandStr
                  );
                  var P = m.size | 0;
                  f.command(
                    !("size" in m) || P > 0 && P <= 4,
                    'invalid size for attribute "' + y + '", must be 1,2,3,4',
                    t.commandStr
                  );
                  var U = !!m.normalized, D = 0;
                  "type" in m && (f.commandParameter(
                    m.type,
                    Kt,
                    "invalid type for attribute " + y,
                    t.commandStr
                  ), D = Kt[m.type]);
                  var Z = m.divisor | 0;
                  "divisor" in m && (f.command(
                    Z === 0 || J,
                    'cannot specify divisor for attribute "' + y + '", instancing not supported',
                    t.commandStr
                  ), f.command(
                    Z >= 0,
                    'invalid divisor for attribute "' + y + '"',
                    t.commandStr
                  )), f.optional(function() {
                    var be = t.commandStr, Ce = [
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
                        Ce.indexOf(me) >= 0,
                        'unknown parameter "' + me + '" for attribute pointer "' + y + '" (valid parameters are ' + Ce + ")",
                        be
                      );
                    });
                  }), o.buffer = h, o.state = gr, o.size = P, o.normalized = U, o.type = D || h.dtype, o.offset = E, o.stride = L, o.divisor = Z;
                }
              }
              S[y] = tt(function(be, Ce) {
                var me = be.attribCache;
                if (g in me)
                  return me[g];
                var Ee = {
                  isStream: !1
                };
                return Object.keys(o).forEach(function(Le) {
                  Ee[Le] = o[Le];
                }), o.buffer && (Ee.buffer = be.link(o.buffer), Ee.type = Ee.type || Ee.buffer + ".dtype"), me[g] = Ee, Ee;
              });
            }), Object.keys(A).forEach(function(y) {
              var m = A[y];
              function g(o, h) {
                var i = o.invoke(h, m), E = o.shared, L = o.constants, P = E.isBufferArgs, U = E.buffer;
                f.optional(function() {
                  o.assert(
                    h,
                    i + "&&(typeof " + i + '==="object"||typeof ' + i + '==="function")&&(' + P + "(" + i + ")||" + U + ".getBuffer(" + i + ")||" + U + ".getBuffer(" + i + ".buffer)||" + P + "(" + i + '.buffer)||("constant" in ' + i + "&&(typeof " + i + '.constant==="number"||' + E.isArrayLike + "(" + i + ".constant))))",
                    'invalid dynamic attribute "' + y + '"'
                  );
                });
                var D = {
                  isStream: h.def(!1)
                }, Z = new w();
                Z.state = gr, Object.keys(Z).forEach(function(Ee) {
                  D[Ee] = h.def("" + Z[Ee]);
                });
                var be = D.buffer, Ce = D.type;
                h(
                  "if(",
                  P,
                  "(",
                  i,
                  ")){",
                  D.isStream,
                  "=true;",
                  be,
                  "=",
                  U,
                  ".createStream(",
                  Tr,
                  ",",
                  i,
                  ");",
                  Ce,
                  "=",
                  be,
                  ".dtype;",
                  "}else{",
                  be,
                  "=",
                  U,
                  ".getBuffer(",
                  i,
                  ");",
                  "if(",
                  be,
                  "){",
                  Ce,
                  "=",
                  be,
                  ".dtype;",
                  '}else if("constant" in ',
                  i,
                  "){",
                  D.state,
                  "=",
                  oa,
                  ";",
                  "if(typeof " + i + '.constant === "number"){',
                  D[_r[0]],
                  "=",
                  i,
                  ".constant;",
                  _r.slice(1).map(function(Ee) {
                    return D[Ee];
                  }).join("="),
                  "=0;",
                  "}else{",
                  _r.map(function(Ee, Le) {
                    return D[Ee] + "=" + i + ".constant.length>" + Le + "?" + i + ".constant[" + Le + "]:0;";
                  }).join(""),
                  "}}else{",
                  "if(",
                  P,
                  "(",
                  i,
                  ".buffer)){",
                  be,
                  "=",
                  U,
                  ".createStream(",
                  Tr,
                  ",",
                  i,
                  ".buffer);",
                  "}else{",
                  be,
                  "=",
                  U,
                  ".getBuffer(",
                  i,
                  ".buffer);",
                  "}",
                  Ce,
                  '="type" in ',
                  i,
                  "?",
                  L.glTypes,
                  "[",
                  i,
                  ".type]:",
                  be,
                  ".dtype;",
                  D.normalized,
                  "=!!",
                  i,
                  ".normalized;"
                );
                function me(Ee) {
                  h(D[Ee], "=", i, ".", Ee, "|0;");
                }
                return me("size"), me("offset"), me("stride"), me("divisor"), h("}}"), h.exit(
                  "if(",
                  D.isStream,
                  "){",
                  U,
                  ".destroyStream(",
                  be,
                  ");",
                  "}"
                ), D;
              }
              S[y] = xt(m, g);
            }), S;
          }
          function st(s, t) {
            var d = s.static, A = s.dynamic;
            if (Pr in d) {
              var S = d[Pr];
              return S !== null && te.getVAO(S) === null && (S = te.createVAO(S)), tt(function(m) {
                return m.link(te.getVAO(S));
              });
            } else if (Pr in A) {
              var y = A[Pr];
              return xt(y, function(m, g) {
                var o = m.invoke(g, y);
                return g.def(m.shared.vao + ".getVAO(" + o + ")");
              });
            }
            return null;
          }
          function Ye(s) {
            var t = s.static, d = s.dynamic, A = {};
            return Object.keys(t).forEach(function(S) {
              var y = t[S];
              A[S] = tt(function(m, g) {
                return typeof y == "number" || typeof y == "boolean" ? "" + y : m.link(y);
              });
            }), Object.keys(d).forEach(function(S) {
              var y = d[S];
              A[S] = xt(y, function(m, g) {
                return m.invoke(g, y);
              });
            }), A;
          }
          function nt(s, t, d, A, S) {
            var y = s.static, m = s.dynamic;
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
              ].concat(W);
              function Ee(Le) {
                Object.keys(Le).forEach(function(Ve) {
                  f.command(
                    me.indexOf(Ve) >= 0,
                    'unknown parameter "' + Ve + '"',
                    S.commandStr
                  );
                });
              }
              Ee(y), Ee(m);
            });
            var g = we(s, t), o = de(s), h = ke(s, o, S), i = Xe(s, S), E = rt(s, S), L = Ge(s, S, g);
            function P(me) {
              var Ee = h[me];
              Ee && (E[me] = Ee);
            }
            P(Ut), P(oe(mn));
            var U = Object.keys(E).length > 0, D = {
              framebuffer: o,
              draw: i,
              shader: L,
              state: E,
              dirty: U,
              scopeVAO: null,
              drawVAO: null,
              useVAO: !1,
              attributes: {}
            };
            if (D.profile = Re(s), D.uniforms = ut(d, S), D.drawVAO = D.scopeVAO = st(s), !D.drawVAO && L.program && !g && l.angle_instanced_arrays) {
              var Z = !0, be = L.program.attributes.map(function(me) {
                var Ee = t.static[me];
                return Z = Z && !!Ee, Ee;
              });
              if (Z && be.length > 0) {
                var Ce = te.getVAO(te.createVAO(be));
                D.drawVAO = new bt(null, null, null, function(me, Ee) {
                  return me.link(Ce);
                }), D.useVAO = !0;
              }
            }
            return g ? D.useVAO = !0 : D.attributes = De(t, S), D.context = Ye(A), D;
          }
          function ot(s, t, d) {
            var A = s.shared, S = A.context, y = s.scope();
            Object.keys(d).forEach(function(m) {
              t.save(S, "." + m);
              var g = d[m], o = g.append(s, t);
              Array.isArray(o) ? y(S, ".", m, "=[", o.join(), "];") : y(S, ".", m, "=", o, ";");
            }), t(y);
          }
          function ft(s, t, d, A) {
            var S = s.shared, y = S.gl, m = S.framebuffer, g;
            ce && (g = t.def(S.extensions, ".webgl_draw_buffers"));
            var o = s.constants, h = o.drawBuffer, i = o.backBuffer, E;
            d ? E = d.append(s, t) : E = t.def(m, ".next"), A || t("if(", E, "!==", m, ".cur){"), t(
              "if(",
              E,
              "){",
              y,
              ".bindFramebuffer(",
              Ls,
              ",",
              E,
              ".framebuffer);"
            ), ce && t(
              g,
              ".drawBuffersWEBGL(",
              h,
              "[",
              E,
              ".colorAttachments.length]);"
            ), t(
              "}else{",
              y,
              ".bindFramebuffer(",
              Ls,
              ",null);"
            ), ce && t(g, ".drawBuffersWEBGL(", i, ");"), t(
              "}",
              m,
              ".cur=",
              E,
              ";"
            ), A || t("}");
          }
          function ct(s, t, d) {
            var A = s.shared, S = A.gl, y = s.current, m = s.next, g = A.current, o = A.next, h = s.cond(g, ".dirty");
            W.forEach(function(i) {
              var E = oe(i);
              if (!(E in d.state)) {
                var L, P;
                if (E in m) {
                  L = m[E], P = y[E];
                  var U = Et(j[E].length, function(Z) {
                    return h.def(L, "[", Z, "]");
                  });
                  h(s.cond(U.map(function(Z, be) {
                    return Z + "!==" + P + "[" + be + "]";
                  }).join("||")).then(
                    S,
                    ".",
                    H[E],
                    "(",
                    U,
                    ");",
                    U.map(function(Z, be) {
                      return P + "[" + be + "]=" + Z;
                    }).join(";"),
                    ";"
                  ));
                } else {
                  L = h.def(o, ".", E);
                  var D = s.cond(L, "!==", g, ".", E);
                  h(D), E in se ? D(
                    s.cond(L).then(S, ".enable(", se[E], ");").else(S, ".disable(", se[E], ");"),
                    g,
                    ".",
                    E,
                    "=",
                    L,
                    ";"
                  ) : D(
                    S,
                    ".",
                    H[E],
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
            }), Object.keys(d.state).length === 0 && h(g, ".dirty=false;"), t(h);
          }
          function ht(s, t, d, A) {
            var S = s.shared, y = s.current, m = S.current, g = S.gl;
            Cs(Object.keys(d)).forEach(function(o) {
              var h = d[o];
              if (!(A && !A(h))) {
                var i = h.append(s, t);
                if (se[o]) {
                  var E = se[o];
                  Wt(h) ? i ? t(g, ".enable(", E, ");") : t(g, ".disable(", E, ");") : t(s.cond(i).then(g, ".enable(", E, ");").else(g, ".disable(", E, ");")), t(m, ".", o, "=", i, ";");
                } else if (Qe(i)) {
                  var L = y[o];
                  t(
                    g,
                    ".",
                    H[o],
                    "(",
                    i,
                    ");",
                    i.map(function(P, U) {
                      return L + "[" + U + "]=" + P;
                    }).join(";"),
                    ";"
                  );
                } else
                  t(
                    g,
                    ".",
                    H[o],
                    "(",
                    i,
                    ");",
                    m,
                    ".",
                    o,
                    "=",
                    i,
                    ";"
                  );
              }
            });
          }
          function Ze(s, t) {
            J && (s.instancing = t.def(
              s.shared.extensions,
              ".angle_instanced_arrays"
            ));
          }
          function Oe(s, t, d, A, S) {
            var y = s.shared, m = s.stats, g = y.current, o = y.timer, h = d.profile;
            function i() {
              return typeof performance > "u" ? "Date.now()" : "performance.now()";
            }
            var E, L;
            function P(me) {
              E = t.def(), me(E, "=", i(), ";"), typeof S == "string" ? me(m, ".count+=", S, ";") : me(m, ".count++;"), q && (A ? (L = t.def(), me(L, "=", o, ".getNumPendingQueries();")) : me(o, ".beginQuery(", m, ");"));
            }
            function U(me) {
              me(m, ".cpuTime+=", i(), "-", E, ";"), q && (A ? me(
                o,
                ".pushScopeStats(",
                L,
                ",",
                o,
                ".getNumPendingQueries(),",
                m,
                ");"
              ) : me(o, ".endQuery();"));
            }
            function D(me) {
              var Ee = t.def(g, ".profile");
              t(g, ".profile=", me, ";"), t.exit(g, ".profile=", Ee, ";");
            }
            var Z;
            if (h) {
              if (Wt(h)) {
                h.enable ? (P(t), U(t.exit), D("true")) : D("false");
                return;
              }
              Z = h.append(s, t), D(Z);
            } else
              Z = t.def(g, ".profile");
            var be = s.block();
            P(be), t("if(", Z, "){", be, "}");
            var Ce = s.block();
            U(Ce), t.exit("if(", Z, "){", Ce, "}");
          }
          function dt(s, t, d, A, S) {
            var y = s.shared;
            function m(o) {
              switch (o) {
                case yn:
                case gn:
                case Tn:
                  return 2;
                case bn:
                case En:
                case An:
                  return 3;
                case _n:
                case xn:
                case wn:
                  return 4;
                default:
                  return 1;
              }
            }
            function g(o, h, i) {
              var E = y.gl, L = t.def(o, ".location"), P = t.def(y.attributes, "[", L, "]"), U = i.state, D = i.buffer, Z = [
                i.x,
                i.y,
                i.z,
                i.w
              ], be = [
                "buffer",
                "normalized",
                "offset",
                "stride"
              ];
              function Ce() {
                t(
                  "if(!",
                  P,
                  ".buffer){",
                  E,
                  ".enableVertexAttribArray(",
                  L,
                  ");}"
                );
                var Ee = i.type, Le;
                if (i.size ? Le = t.def(i.size, "||", h) : Le = h, t(
                  "if(",
                  P,
                  ".type!==",
                  Ee,
                  "||",
                  P,
                  ".size!==",
                  Le,
                  "||",
                  be.map(function(qe) {
                    return P + "." + qe + "!==" + i[qe];
                  }).join("||"),
                  "){",
                  E,
                  ".bindBuffer(",
                  Tr,
                  ",",
                  D,
                  ".buffer);",
                  E,
                  ".vertexAttribPointer(",
                  [
                    L,
                    Le,
                    Ee,
                    i.normalized,
                    i.stride,
                    i.offset
                  ],
                  ");",
                  P,
                  ".type=",
                  Ee,
                  ";",
                  P,
                  ".size=",
                  Le,
                  ";",
                  be.map(function(qe) {
                    return P + "." + qe + "=" + i[qe] + ";";
                  }).join(""),
                  "}"
                ), J) {
                  var Ve = i.divisor;
                  t(
                    "if(",
                    P,
                    ".divisor!==",
                    Ve,
                    "){",
                    s.instancing,
                    ".vertexAttribDivisorANGLE(",
                    [L, Ve],
                    ");",
                    P,
                    ".divisor=",
                    Ve,
                    ";}"
                  );
                }
              }
              function me() {
                t(
                  "if(",
                  P,
                  ".buffer){",
                  E,
                  ".disableVertexAttribArray(",
                  L,
                  ");",
                  P,
                  ".buffer=null;",
                  "}if(",
                  _r.map(function(Ee, Le) {
                    return P + "." + Ee + "!==" + Z[Le];
                  }).join("||"),
                  "){",
                  E,
                  ".vertexAttrib4f(",
                  L,
                  ",",
                  Z,
                  ");",
                  _r.map(function(Ee, Le) {
                    return P + "." + Ee + "=" + Z[Le] + ";";
                  }).join(""),
                  "}"
                );
              }
              U === gr ? Ce() : U === oa ? me() : (t("if(", U, "===", gr, "){"), Ce(), t("}else{"), me(), t("}"));
            }
            A.forEach(function(o) {
              var h = o.name, i = d.attributes[h], E;
              if (i) {
                if (!S(i))
                  return;
                E = i.append(s, t);
              } else {
                if (!S(Fs))
                  return;
                var L = s.scopeAttrib(h);
                f.optional(function() {
                  s.assert(
                    t,
                    L + ".state",
                    "missing attribute " + h
                  );
                }), E = {}, Object.keys(new w()).forEach(function(P) {
                  E[P] = t.def(L, ".", P);
                });
              }
              g(
                s.link(o),
                m(o.info.type),
                E
              );
            });
          }
          function We(s, t, d, A, S) {
            for (var y = s.shared, m = y.gl, g, o = 0; o < A.length; ++o) {
              var h = A[o], i = h.name, E = h.info.type, L = d.uniforms[i], P = s.link(h), U = P + ".location", D;
              if (L) {
                if (!S(L))
                  continue;
                if (Wt(L)) {
                  var Z = L.value;
                  if (f.command(
                    Z !== null && typeof Z < "u",
                    'missing uniform "' + i + '"',
                    s.commandStr
                  ), E === jr || E === Xr) {
                    f.command(
                      typeof Z == "function" && (E === jr && (Z._reglType === "texture2d" || Z._reglType === "framebuffer") || E === Xr && (Z._reglType === "textureCube" || Z._reglType === "framebufferCube")),
                      "invalid texture for uniform " + i,
                      s.commandStr
                    );
                    var be = s.link(Z._texture || Z.color[0]._texture);
                    t(m, ".uniform1i(", U, ",", be + ".bind());"), t.exit(be, ".unbind();");
                  } else if (E === $r || E === Ur || E === zr) {
                    f.optional(function() {
                      f.command(
                        Qe(Z),
                        "invalid matrix for uniform " + i,
                        s.commandStr
                      ), f.command(
                        E === $r && Z.length === 4 || E === Ur && Z.length === 9 || E === zr && Z.length === 16,
                        "invalid length for matrix uniform " + i,
                        s.commandStr
                      );
                    });
                    var Ce = s.global.def("new Float32Array([" + Array.prototype.slice.call(Z) + "])"), me = 2;
                    E === Ur ? me = 3 : E === zr && (me = 4), t(
                      m,
                      ".uniformMatrix",
                      me,
                      "fv(",
                      U,
                      ",false,",
                      Ce,
                      ");"
                    );
                  } else {
                    switch (E) {
                      case Ta:
                        f.commandType(Z, "number", "uniform " + i, s.commandStr), g = "1f";
                        break;
                      case yn:
                        f.command(
                          Qe(Z) && Z.length === 2,
                          "uniform " + i,
                          s.commandStr
                        ), g = "2f";
                        break;
                      case bn:
                        f.command(
                          Qe(Z) && Z.length === 3,
                          "uniform " + i,
                          s.commandStr
                        ), g = "3f";
                        break;
                      case _n:
                        f.command(
                          Qe(Z) && Z.length === 4,
                          "uniform " + i,
                          s.commandStr
                        ), g = "4f";
                        break;
                      case wa:
                        f.commandType(Z, "boolean", "uniform " + i, s.commandStr), g = "1i";
                        break;
                      case Aa:
                        f.commandType(Z, "number", "uniform " + i, s.commandStr), g = "1i";
                        break;
                      case Tn:
                        f.command(
                          Qe(Z) && Z.length === 2,
                          "uniform " + i,
                          s.commandStr
                        ), g = "2i";
                        break;
                      case gn:
                        f.command(
                          Qe(Z) && Z.length === 2,
                          "uniform " + i,
                          s.commandStr
                        ), g = "2i";
                        break;
                      case An:
                        f.command(
                          Qe(Z) && Z.length === 3,
                          "uniform " + i,
                          s.commandStr
                        ), g = "3i";
                        break;
                      case En:
                        f.command(
                          Qe(Z) && Z.length === 3,
                          "uniform " + i,
                          s.commandStr
                        ), g = "3i";
                        break;
                      case wn:
                        f.command(
                          Qe(Z) && Z.length === 4,
                          "uniform " + i,
                          s.commandStr
                        ), g = "4i";
                        break;
                      case xn:
                        f.command(
                          Qe(Z) && Z.length === 4,
                          "uniform " + i,
                          s.commandStr
                        ), g = "4i";
                        break;
                    }
                    t(
                      m,
                      ".uniform",
                      g,
                      "(",
                      U,
                      ",",
                      Qe(Z) ? Array.prototype.slice.call(Z) : Z,
                      ");"
                    );
                  }
                  continue;
                } else
                  D = L.append(s, t);
              } else {
                if (!S(Fs))
                  continue;
                D = t.def(y.uniforms, "[", r.id(i), "]");
              }
              E === jr ? (f(!Array.isArray(D), "must specify a scalar prop for textures"), t(
                "if(",
                D,
                "&&",
                D,
                '._reglType==="framebuffer"){',
                D,
                "=",
                D,
                ".color[0];",
                "}"
              )) : E === Xr && (f(!Array.isArray(D), "must specify a scalar prop for cube maps"), t(
                "if(",
                D,
                "&&",
                D,
                '._reglType==="framebufferCube"){',
                D,
                "=",
                D,
                ".color[0];",
                "}"
              )), f.optional(function() {
                function _t(It, Ds) {
                  s.assert(
                    t,
                    It,
                    'bad data or missing for uniform "' + i + '".  ' + Ds
                  );
                }
                function Ra(It) {
                  f(!Array.isArray(D), "must not specify an array type for uniform"), _t(
                    "typeof " + D + '==="' + It + '"',
                    "invalid type, expected " + It
                  );
                }
                function Ct(It, Ds) {
                  Array.isArray(D) ? f(D.length === It, "must have length " + It) : _t(
                    y.isArrayLike + "(" + D + ")&&" + D + ".length===" + It,
                    "invalid vector, should have length " + It,
                    s.commandStr
                  );
                }
                function Ns(It) {
                  f(!Array.isArray(D), "must not specify a value type"), _t(
                    "typeof " + D + '==="function"&&' + D + '._reglType==="texture' + (It === Es ? "2d" : "Cube") + '"',
                    "invalid texture type",
                    s.commandStr
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
                  case Ta:
                    Ra("number");
                    break;
                  case yn:
                    Ct(2);
                    break;
                  case bn:
                    Ct(3);
                    break;
                  case _n:
                    Ct(4);
                    break;
                  case wa:
                    Ra("boolean");
                    break;
                  case Tn:
                    Ct(2);
                    break;
                  case An:
                    Ct(3);
                    break;
                  case wn:
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
                    Ns(Es);
                    break;
                  case Xr:
                    Ns(Wu);
                    break;
                }
              });
              var Ee = 1;
              switch (E) {
                case jr:
                case Xr:
                  var Le = t.def(D, "._texture");
                  t(m, ".uniform1i(", U, ",", Le, ".bind());"), t.exit(Le, ".unbind();");
                  continue;
                case Aa:
                case wa:
                  g = "1i";
                  break;
                case gn:
                case Tn:
                  g = "2i", Ee = 2;
                  break;
                case En:
                case An:
                  g = "3i", Ee = 3;
                  break;
                case xn:
                case wn:
                  g = "4i", Ee = 4;
                  break;
                case Ta:
                  g = "1f";
                  break;
                case yn:
                  g = "2f", Ee = 2;
                  break;
                case bn:
                  g = "3f", Ee = 3;
                  break;
                case _n:
                  g = "4f", Ee = 4;
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
              if (t(m, ".uniform", g, "(", U, ","), g.charAt(0) === "M") {
                var Ve = Math.pow(E - $r + 2, 2), qe = s.global.def("new Float32Array(", Ve, ")");
                Array.isArray(D) ? t(
                  "false,(",
                  Et(Ve, function(_t) {
                    return qe + "[" + _t + "]=" + D[_t];
                  }),
                  ",",
                  qe,
                  ")"
                ) : t(
                  "false,(Array.isArray(",
                  D,
                  ")||",
                  D,
                  " instanceof Float32Array)?",
                  D,
                  ":(",
                  Et(Ve, function(_t) {
                    return qe + "[" + _t + "]=" + D + "[" + _t + "]";
                  }),
                  ",",
                  qe,
                  ")"
                );
              } else Ee > 1 ? t(Et(Ee, function(_t) {
                return Array.isArray(D) ? D[_t] : D + "[" + _t + "]";
              })) : (f(!Array.isArray(D), "uniform value must not be an array"), t(D));
              t(");");
            }
          }
          function ge(s, t, d, A) {
            var S = s.shared, y = S.gl, m = S.draw, g = A.draw;
            function o() {
              var Le = g.elements, Ve, qe = t;
              return Le ? ((Le.contextDep && A.contextDynamic || Le.propDep) && (qe = d), Ve = Le.append(s, qe)) : Ve = qe.def(m, ".", rr), Ve && qe(
                "if(" + Ve + ")" + y + ".bindBuffer(" + Xu + "," + Ve + ".buffer.buffer);"
              ), Ve;
            }
            function h() {
              var Le = g.count, Ve, qe = t;
              return Le ? ((Le.contextDep && A.contextDynamic || Le.propDep) && (qe = d), Ve = Le.append(s, qe), f.optional(function() {
                Le.MISSING && s.assert(t, "false", "missing vertex count"), Le.DYNAMIC && s.assert(qe, Ve + ">=0", "missing vertex count");
              })) : (Ve = qe.def(m, ".", ar), f.optional(function() {
                s.assert(qe, Ve + ">=0", "missing vertex count");
              })), Ve;
            }
            var i = o();
            function E(Le) {
              var Ve = g[Le];
              return Ve ? Ve.contextDep && A.contextDynamic || Ve.propDep ? Ve.append(s, d) : Ve.append(s, t) : t.def(m, ".", Le);
            }
            var L = E(nr), P = E(pn), U = h();
            if (typeof U == "number") {
              if (U === 0)
                return;
            } else
              d("if(", U, "){"), d.exit("}");
            var D, Z;
            J && (D = E(vn), Z = s.instancing);
            var be = i + ".type", Ce = g.elements && Wt(g.elements);
            function me() {
              function Le() {
                d(Z, ".drawElementsInstancedANGLE(", [
                  L,
                  U,
                  be,
                  P + "<<((" + be + "-" + es + ")>>1)",
                  D
                ], ");");
              }
              function Ve() {
                d(
                  Z,
                  ".drawArraysInstancedANGLE(",
                  [L, P, U, D],
                  ");"
                );
              }
              i ? Ce ? Le() : (d("if(", i, "){"), Le(), d("}else{"), Ve(), d("}")) : Ve();
            }
            function Ee() {
              function Le() {
                d(y + ".drawElements(" + [
                  L,
                  U,
                  be,
                  P + "<<((" + be + "-" + es + ")>>1)"
                ] + ");");
              }
              function Ve() {
                d(y + ".drawArrays(" + [L, P, U] + ");");
              }
              i ? Ce ? Le() : (d("if(", i, "){"), Le(), d("}else{"), Ve(), d("}")) : Ve();
            }
            J && (typeof D != "number" || D >= 0) ? typeof D == "string" ? (d("if(", D, ">0){"), me(), d("}else if(", D, "<0){"), Ee(), d("}")) : me() : Ee();
          }
          function Be(s, t, d, A, S) {
            var y = xe(), m = y.proc("body", S);
            return f.optional(function() {
              y.commandStr = t.commandStr, y.command = y.link(t.commandStr);
            }), J && (y.instancing = m.def(
              y.shared.extensions,
              ".angle_instanced_arrays"
            )), s(y, m, d, A), y.compile().body;
          }
          function je(s, t, d, A) {
            Ze(s, t), d.useVAO ? d.drawVAO ? t(s.shared.vao, ".setVAO(", d.drawVAO.append(s, t), ");") : t(s.shared.vao, ".setVAO(", s.shared.vao, ".targetVAO);") : (t(s.shared.vao, ".setVAO(null);"), dt(s, t, d, A.attributes, function() {
              return !0;
            })), We(s, t, d, A.uniforms, function() {
              return !0;
            }), ge(s, t, t, d);
          }
          function Je(s, t) {
            var d = s.proc("draw", 1);
            Ze(s, d), ot(s, d, t.context), ft(s, d, t.framebuffer), ct(s, d, t), ht(s, d, t.state), Oe(s, d, t, !1, !0);
            var A = t.shader.progVar.append(s, d);
            if (d(s.shared.gl, ".useProgram(", A, ".program);"), t.shader.program)
              je(s, d, t, t.shader.program);
            else {
              d(s.shared.vao, ".setVAO(null);");
              var S = s.global.def("{}"), y = d.def(A, ".id"), m = d.def(S, "[", y, "]");
              d(
                s.cond(m).then(m, ".call(this,a0);").else(
                  m,
                  "=",
                  S,
                  "[",
                  y,
                  "]=",
                  s.link(function(g) {
                    return Be(je, s, t, g, 1);
                  }),
                  "(",
                  A,
                  ");",
                  m,
                  ".call(this,a0);"
                )
              );
            }
            Object.keys(t.state).length > 0 && d(s.shared.current, ".dirty=true;");
          }
          function Pt(s, t, d, A) {
            s.batchId = "a1", Ze(s, t);
            function S() {
              return !0;
            }
            dt(s, t, d, A.attributes, S), We(s, t, d, A.uniforms, S), ge(s, t, t, d);
          }
          function sr(s, t, d, A) {
            Ze(s, t);
            var S = d.contextDep, y = t.def(), m = "a0", g = "a1", o = t.def();
            s.shared.props = o, s.batchId = y;
            var h = s.scope(), i = s.scope();
            t(
              h.entry,
              "for(",
              y,
              "=0;",
              y,
              "<",
              g,
              ";++",
              y,
              "){",
              o,
              "=",
              m,
              "[",
              y,
              "];",
              i,
              "}",
              h.exit
            );
            function E(be) {
              return be.contextDep && S || be.propDep;
            }
            function L(be) {
              return !E(be);
            }
            if (d.needsContext && ot(s, i, d.context), d.needsFramebuffer && ft(s, i, d.framebuffer), ht(s, i, d.state, E), d.profile && E(d.profile) && Oe(s, i, d, !1, !0), A)
              d.useVAO ? d.drawVAO ? E(d.drawVAO) ? i(s.shared.vao, ".setVAO(", d.drawVAO.append(s, i), ");") : h(s.shared.vao, ".setVAO(", d.drawVAO.append(s, h), ");") : h(s.shared.vao, ".setVAO(", s.shared.vao, ".targetVAO);") : (h(s.shared.vao, ".setVAO(null);"), dt(s, h, d, A.attributes, L), dt(s, i, d, A.attributes, E)), We(s, h, d, A.uniforms, L), We(s, i, d, A.uniforms, E), ge(s, h, i, d);
            else {
              var P = s.global.def("{}"), U = d.shader.progVar.append(s, i), D = i.def(U, ".id"), Z = i.def(P, "[", D, "]");
              i(
                s.shared.gl,
                ".useProgram(",
                U,
                ".program);",
                "if(!",
                Z,
                "){",
                Z,
                "=",
                P,
                "[",
                D,
                "]=",
                s.link(function(be) {
                  return Be(
                    Pt,
                    s,
                    d,
                    be,
                    2
                  );
                }),
                "(",
                U,
                ");}",
                Z,
                ".call(this,a0[",
                y,
                "],",
                y,
                ");"
              );
            }
          }
          function c(s, t) {
            var d = s.proc("batch", 2);
            s.batchId = "0", Ze(s, d);
            var A = !1, S = !0;
            Object.keys(t.context).forEach(function(P) {
              A = A || t.context[P].propDep;
            }), A || (ot(s, d, t.context), S = !1);
            var y = t.framebuffer, m = !1;
            y ? (y.propDep ? A = m = !0 : y.contextDep && A && (m = !0), m || ft(s, d, y)) : ft(s, d, null), t.state.viewport && t.state.viewport.propDep && (A = !0);
            function g(P) {
              return P.contextDep && A || P.propDep;
            }
            ct(s, d, t), ht(s, d, t.state, function(P) {
              return !g(P);
            }), (!t.profile || !g(t.profile)) && Oe(s, d, t, !1, "a1"), t.contextDep = A, t.needsContext = S, t.needsFramebuffer = m;
            var o = t.shader.progVar;
            if (o.contextDep && A || o.propDep)
              sr(
                s,
                d,
                t,
                null
              );
            else {
              var h = o.append(s, d);
              if (d(s.shared.gl, ".useProgram(", h, ".program);"), t.shader.program)
                sr(
                  s,
                  d,
                  t,
                  t.shader.program
                );
              else {
                d(s.shared.vao, ".setVAO(null);");
                var i = s.global.def("{}"), E = d.def(h, ".id"), L = d.def(i, "[", E, "]");
                d(
                  s.cond(L).then(L, ".call(this,a0,a1);").else(
                    L,
                    "=",
                    i,
                    "[",
                    E,
                    "]=",
                    s.link(function(P) {
                      return Be(sr, s, t, P, 2);
                    }),
                    "(",
                    h,
                    ");",
                    L,
                    ".call(this,a0,a1);"
                  )
                );
              }
            }
            Object.keys(t.state).length > 0 && d(s.shared.current, ".dirty=true;");
          }
          function k(s, t) {
            var d = s.proc("scope", 3);
            s.batchId = "a2";
            var A = s.shared, S = A.current;
            ot(s, d, t.context), t.framebuffer && t.framebuffer.append(s, d), Cs(Object.keys(t.state)).forEach(function(m) {
              var g = t.state[m], o = g.append(s, d);
              Qe(o) ? o.forEach(function(h, i) {
                d.set(s.next[m], "[" + i + "]", h);
              }) : d.set(A.next, "." + m, o);
            }), Oe(s, d, t, !0, !0), [rr, pn, ar, vn, nr].forEach(
              function(m) {
                var g = t.draw[m];
                g && d.set(A.draw, "." + m, "" + g.append(s, d));
              }
            ), Object.keys(t.uniforms).forEach(function(m) {
              var g = t.uniforms[m].append(s, d);
              Array.isArray(g) && (g = "[" + g.join() + "]"), d.set(
                A.uniforms,
                "[" + r.id(m) + "]",
                g
              );
            }), Object.keys(t.attributes).forEach(function(m) {
              var g = t.attributes[m].append(s, d), o = s.scopeAttrib(m);
              Object.keys(new w()).forEach(function(h) {
                d.set(o, "." + h, g[h]);
              });
            }), t.scopeVAO && d.set(A.vao, ".targetVAO", t.scopeVAO.append(s, d));
            function y(m) {
              var g = t.shader[m];
              g && d.set(A.shader, "." + m, g.append(s, d));
            }
            y(Nr), y(Dr), Object.keys(t.state).length > 0 && (d(S, ".dirty=true;"), d.exit(S, ".dirty=true;")), d("a1(", s.shared.context, ",a0,", s.batchId, ");");
          }
          function C(s) {
            if (!(typeof s != "object" || Qe(s))) {
              for (var t = Object.keys(s), d = 0; d < t.length; ++d)
                if (St.isDynamic(s[t[d]]))
                  return !0;
              return !1;
            }
          }
          function he(s, t, d) {
            var A = t.static[d];
            if (!A || !C(A))
              return;
            var S = s.global, y = Object.keys(A), m = !1, g = !1, o = !1, h = s.global.def("{}");
            y.forEach(function(E) {
              var L = A[E];
              if (St.isDynamic(L)) {
                typeof L == "function" && (L = A[E] = St.unbox(L));
                var P = xt(L, null);
                m = m || P.thisDep, o = o || P.propDep, g = g || P.contextDep;
              } else {
                switch (S(h, ".", E, "="), typeof L) {
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
                    S(s.link(L));
                    break;
                }
                S(";");
              }
            });
            function i(E, L) {
              y.forEach(function(P) {
                var U = A[P];
                if (St.isDynamic(U)) {
                  var D = E.invoke(L, U);
                  L(h, ".", P, "=", D, ";");
                }
              });
            }
            t.dynamic[d] = new St.DynamicVariable(dn, {
              thisDep: m,
              contextDep: g,
              propDep: o,
              ref: h,
              append: i
            }), delete t.static[d];
          }
          function Ie(s, t, d, A, S) {
            var y = xe();
            y.stats = y.link(S), Object.keys(t.static).forEach(function(g) {
              he(y, t, g);
            }), ju.forEach(function(g) {
              he(y, s, g);
            });
            var m = nt(s, t, d, A, y);
            return Je(y, m), k(y, m), c(y, m), b(y.compile(), {
              destroy: function() {
                m.shader.program.destroy();
              }
            });
          }
          return {
            next: le,
            current: j,
            procs: (function() {
              var s = xe(), t = s.proc("poll"), d = s.proc("refresh"), A = s.block();
              t(A), d(A);
              var S = s.shared, y = S.gl, m = S.next, g = S.current;
              A(g, ".dirty=false;"), ft(s, t), ft(s, d, null, !0);
              var o;
              J && (o = s.link(J)), l.oes_vertex_array_object && d(s.link(l.oes_vertex_array_object), ".bindVertexArrayOES(null);");
              for (var h = 0; h < M.maxAttributes; ++h) {
                var i = d.def(S.attributes, "[", h, "]"), E = s.cond(i, ".buffer");
                E.then(
                  y,
                  ".enableVertexAttribArray(",
                  h,
                  ");",
                  y,
                  ".bindBuffer(",
                  Tr,
                  ",",
                  i,
                  ".buffer.buffer);",
                  y,
                  ".vertexAttribPointer(",
                  h,
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
                  y,
                  ".disableVertexAttribArray(",
                  h,
                  ");",
                  y,
                  ".vertexAttrib4f(",
                  h,
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
                ), d(E), J && d(
                  o,
                  ".vertexAttribDivisorANGLE(",
                  h,
                  ",",
                  i,
                  ".divisor);"
                );
              }
              return d(
                s.shared.vao,
                ".currentVAO=null;",
                s.shared.vao,
                ".setVAO(",
                s.shared.vao,
                ".targetVAO);"
              ), Object.keys(se).forEach(function(L) {
                var P = se[L], U = A.def(m, ".", L), D = s.block();
                D(
                  "if(",
                  U,
                  "){",
                  y,
                  ".enable(",
                  P,
                  ")}else{",
                  y,
                  ".disable(",
                  P,
                  ")}",
                  g,
                  ".",
                  L,
                  "=",
                  U,
                  ";"
                ), d(D), t(
                  "if(",
                  U,
                  "!==",
                  g,
                  ".",
                  L,
                  "){",
                  D,
                  "}"
                );
              }), Object.keys(H).forEach(function(L) {
                var P = H[L], U = j[L], D, Z, be = s.block();
                if (be(y, ".", P, "("), Qe(U)) {
                  var Ce = U.length;
                  D = s.global.def(m, ".", L), Z = s.global.def(g, ".", L), be(
                    Et(Ce, function(me) {
                      return D + "[" + me + "]";
                    }),
                    ");",
                    Et(Ce, function(me) {
                      return Z + "[" + me + "]=" + D + "[" + me + "];";
                    }).join("")
                  ), t(
                    "if(",
                    Et(Ce, function(me) {
                      return D + "[" + me + "]!==" + Z + "[" + me + "]";
                    }).join("||"),
                    "){",
                    be,
                    "}"
                  );
                } else
                  D = A.def(m, ".", L), Z = A.def(g, ".", L), be(
                    D,
                    ");",
                    g,
                    ".",
                    L,
                    "=",
                    D,
                    ";"
                  ), t(
                    "if(",
                    D,
                    "!==",
                    Z,
                    "){",
                    be,
                    "}"
                  );
                d(be);
              }), s.compile();
            })(),
            compile: Ie
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
        var cc = 34918, lc = 34919, Gs = 35007, hc = function(e, r) {
          if (!r.ext_disjoint_timer_query)
            return null;
          var l = [];
          function M() {
            return l.pop() || r.ext_disjoint_timer_query.createQueryEXT();
          }
          function $(J) {
            l.push(J);
          }
          var G = [];
          function B(J) {
            var ce = M();
            r.ext_disjoint_timer_query.beginQueryEXT(Gs, ce), G.push(ce), q(G.length - 1, G.length, J);
          }
          function Y() {
            r.ext_disjoint_timer_query.endQueryEXT(Gs);
          }
          function K() {
            this.startQueryIndex = -1, this.endQueryIndex = -1, this.sum = 0, this.stats = null;
          }
          var te = [];
          function Q() {
            return te.pop() || new K();
          }
          function ae(J) {
            te.push(J);
          }
          var fe = [];
          function q(J, ce, j) {
            var le = Q();
            le.startQueryIndex = J, le.endQueryIndex = ce, le.sum = 0, le.stats = j, fe.push(le);
          }
          var ie = [], w = [];
          function N() {
            var J, ce, j = G.length;
            if (j !== 0) {
              w.length = Math.max(w.length, j + 1), ie.length = Math.max(ie.length, j + 1), ie[0] = 0, w[0] = 0;
              var le = 0;
              for (J = 0, ce = 0; ce < G.length; ++ce) {
                var W = G[ce];
                r.ext_disjoint_timer_query.getQueryObjectEXT(W, lc) ? (le += r.ext_disjoint_timer_query.getQueryObjectEXT(W, cc), $(W)) : G[J++] = W, ie[ce + 1] = le, w[ce + 1] = J;
              }
              for (G.length = J, J = 0, ce = 0; ce < fe.length; ++ce) {
                var se = fe[ce], H = se.startQueryIndex, oe = se.endQueryIndex;
                se.sum += ie[oe] - ie[H];
                var _e = w[H], Te = w[oe];
                Te === _e ? (se.stats.gpuTime += se.sum / 1e6, ae(se)) : (se.startQueryIndex = _e, se.endQueryIndex = Te, fe[J++] = se);
              }
              fe.length = J;
            }
          }
          return {
            beginQuery: B,
            endQuery: Y,
            pushScopeStats: q,
            update: N,
            getNumPendingQueries: function() {
              return G.length;
            },
            clear: function() {
              l.push.apply(l, G);
              for (var J = 0; J < l.length; J++)
                r.ext_disjoint_timer_query.deleteQueryEXT(l[J]);
              G.length = 0, l.length = 0;
            },
            restore: function() {
              G.length = 0, l.length = 0;
            }
          };
        }, dc = 16384, mc = 256, pc = 1024, vc = 34962, Ms = "webglcontextlost", ks = "webglcontextrestored", Is = 1, yc = 2, bc = 3;
        function Bs(e, r) {
          for (var l = 0; l < e.length; ++l)
            if (e[l] === r)
              return l;
          return -1;
        }
        function _c(e) {
          var r = po(e);
          if (!r)
            return null;
          var l = r.gl, M = l.getContextAttributes(), $ = l.isContextLost(), G = vo(l, r);
          if (!G)
            return null;
          var B = uo(), Y = uc(), K = G.extensions, te = hc(l, K), Q = Xa(), ae = l.drawingBufferWidth, fe = l.drawingBufferHeight, q = {
            tick: 0,
            time: 0,
            viewportWidth: ae,
            viewportHeight: fe,
            framebufferWidth: ae,
            framebufferHeight: fe,
            drawingBufferWidth: ae,
            drawingBufferHeight: fe,
            pixelRatio: r.pixelRatio
          }, ie = {}, w = {
            elements: null,
            primitive: 4,
            // GL_TRIANGLES
            count: -1,
            offset: 0,
            instances: -1
          }, N = nf(l, K), J = gf(
            l,
            Y,
            r,
            j
          ), ce = Gu(
            l,
            K,
            N,
            Y,
            J
          );
          function j(ge) {
            return ce.destroyBuffer(ge);
          }
          var le = Gf(l, K, J, Y), W = Bu(l, B, Y, r), se = uu(
            l,
            K,
            N,
            function() {
              _e.procs.poll();
            },
            q,
            Y,
            r
          ), H = cu(l, K, N, Y, r), oe = Cu(
            l,
            K,
            N,
            se,
            H,
            Y
          ), _e = fc(
            l,
            B,
            K,
            N,
            J,
            le,
            se,
            oe,
            ie,
            ce,
            W,
            w,
            q,
            te,
            r
          ), Te = Pu(
            l,
            oe,
            _e.procs.poll,
            q,
            M,
            K,
            N
          ), ue = _e.next, re = l.canvas, z = [], xe = [], Re = [], de = [r.onDestroy], ke = null;
          function we() {
            if (z.length === 0) {
              te && te.update(), ke = null;
              return;
            }
            ke = Mn.next(we), ht();
            for (var ge = z.length - 1; ge >= 0; --ge) {
              var Be = z[ge];
              Be && Be(q, null, 0);
            }
            l.flush(), te && te.update();
          }
          function Ge() {
            !ke && z.length > 0 && (ke = Mn.next(we));
          }
          function Xe() {
            ke && (Mn.cancel(we), ke = null);
          }
          function rt(ge) {
            ge.preventDefault(), $ = !0, Xe(), xe.forEach(function(Be) {
              Be();
            });
          }
          function ut(ge) {
            l.getError(), $ = !1, G.restore(), W.restore(), J.restore(), se.restore(), H.restore(), oe.restore(), ce.restore(), te && te.restore(), _e.procs.refresh(), Ge(), Re.forEach(function(Be) {
              Be();
            });
          }
          re && (re.addEventListener(Ms, rt, !1), re.addEventListener(ks, ut, !1));
          function De() {
            z.length = 0, Xe(), re && (re.removeEventListener(Ms, rt), re.removeEventListener(ks, ut)), W.clear(), oe.clear(), H.clear(), se.clear(), le.clear(), J.clear(), ce.clear(), te && te.clear(), de.forEach(function(ge) {
              ge();
            });
          }
          function st(ge) {
            f(!!ge, "invalid args to regl({...})"), f.type(ge, "object", "invalid args to regl({...})");
            function Be(S) {
              var y = b({}, S);
              delete y.uniforms, delete y.attributes, delete y.context, delete y.vao, "stencil" in y && y.stencil.op && (y.stencil.opBack = y.stencil.opFront = y.stencil.op, delete y.stencil.op);
              function m(g) {
                if (g in y) {
                  var o = y[g];
                  delete y[g], Object.keys(o).forEach(function(h) {
                    y[g + "." + h] = o[h];
                  });
                }
              }
              return m("blend"), m("depth"), m("cull"), m("stencil"), m("polygonOffset"), m("scissor"), m("sample"), "vao" in S && (y.vao = S.vao), y;
            }
            function je(S, y) {
              var m = {}, g = {};
              return Object.keys(S).forEach(function(o) {
                var h = S[o];
                if (St.isDynamic(h)) {
                  g[o] = St.unbox(h, o);
                  return;
                } else if (y && Array.isArray(h)) {
                  for (var i = 0; i < h.length; ++i)
                    if (St.isDynamic(h[i])) {
                      g[o] = St.unbox(h, o);
                      return;
                    }
                }
                m[o] = h;
              }), {
                dynamic: g,
                static: m
              };
            }
            var Je = je(ge.context || {}, !0), Pt = je(ge.uniforms || {}, !0), sr = je(ge.attributes || {}, !1), c = je(Be(ge), !1), k = {
              gpuTime: 0,
              cpuTime: 0,
              count: 0
            }, C = _e.compile(c, sr, Pt, Je, k), he = C.draw, Ie = C.batch, s = C.scope, t = [];
            function d(S) {
              for (; t.length < S; )
                t.push(null);
              return t;
            }
            function A(S, y) {
              var m;
              if ($ && f.raise("context lost"), typeof S == "function")
                return s.call(this, null, S, 0);
              if (typeof y == "function")
                if (typeof S == "number")
                  for (m = 0; m < S; ++m)
                    s.call(this, null, y, m);
                else if (Array.isArray(S))
                  for (m = 0; m < S.length; ++m)
                    s.call(this, S[m], y, m);
                else
                  return s.call(this, S, y, 0);
              else if (typeof S == "number") {
                if (S > 0)
                  return Ie.call(this, d(S | 0), S | 0);
              } else if (Array.isArray(S)) {
                if (S.length)
                  return Ie.call(this, S, S.length);
              } else
                return he.call(this, S);
            }
            return b(A, {
              stats: k,
              destroy: function() {
                C.destroy();
              }
            });
          }
          var Ye = oe.setFBO = st({
            framebuffer: St.define.call(null, Is, "framebuffer")
          });
          function nt(ge, Be) {
            var je = 0;
            _e.procs.poll();
            var Je = Be.color;
            Je && (l.clearColor(+Je[0] || 0, +Je[1] || 0, +Je[2] || 0, +Je[3] || 0), je |= dc), "depth" in Be && (l.clearDepth(+Be.depth), je |= mc), "stencil" in Be && (l.clearStencil(Be.stencil | 0), je |= pc), f(!!je, "called regl.clear with no buffer specified"), l.clear(je);
          }
          function ot(ge) {
            if (f(
              typeof ge == "object" && ge,
              "regl.clear() takes an object as input"
            ), "framebuffer" in ge)
              if (ge.framebuffer && ge.framebuffer_reglType === "framebufferCube")
                for (var Be = 0; Be < 6; ++Be)
                  Ye(b({
                    framebuffer: ge.framebuffer.faces[Be]
                  }, ge), nt);
              else
                Ye(ge, nt);
            else
              nt(null, ge);
          }
          function ft(ge) {
            f.type(ge, "function", "regl.frame() callback must be a function"), z.push(ge);
            function Be() {
              var je = Bs(z, ge);
              f(je >= 0, "cannot cancel a frame twice");
              function Je() {
                var Pt = Bs(z, Je);
                z[Pt] = z[z.length - 1], z.length -= 1, z.length <= 0 && Xe();
              }
              z[je] = Je;
            }
            return Ge(), {
              cancel: Be
            };
          }
          function ct() {
            var ge = ue.viewport, Be = ue.scissor_box;
            ge[0] = ge[1] = Be[0] = Be[1] = 0, q.viewportWidth = q.framebufferWidth = q.drawingBufferWidth = ge[2] = Be[2] = l.drawingBufferWidth, q.viewportHeight = q.framebufferHeight = q.drawingBufferHeight = ge[3] = Be[3] = l.drawingBufferHeight;
          }
          function ht() {
            q.tick += 1, q.time = Oe(), ct(), _e.procs.poll();
          }
          function Ze() {
            se.refresh(), ct(), _e.procs.refresh(), te && te.update();
          }
          function Oe() {
            return (Xa() - Q) / 1e3;
          }
          Ze();
          function dt(ge, Be) {
            f.type(Be, "function", "listener callback must be a function");
            var je;
            switch (ge) {
              case "frame":
                return ft(Be);
              case "lost":
                je = xe;
                break;
              case "restore":
                je = Re;
                break;
              case "destroy":
                je = de;
                break;
              default:
                f.raise("invalid event, must be one of frame,lost,restore,destroy");
            }
            return je.push(Be), {
              cancel: function() {
                for (var Je = 0; Je < je.length; ++Je)
                  if (je[Je] === Be) {
                    je[Je] = je[je.length - 1], je.pop();
                    return;
                  }
              }
            };
          }
          var We = b(st, {
            // Clear current FBO
            clear: ot,
            // Short cuts for dynamic variables
            prop: St.define.bind(null, Is),
            context: St.define.bind(null, yc),
            this: St.define.bind(null, bc),
            // executes an empty draw command
            draw: st({}),
            // Resources
            buffer: function(ge) {
              return J.create(ge, vc, !1, !1);
            },
            elements: function(ge) {
              return le.create(ge, !1);
            },
            texture: se.create2D,
            cube: se.createCube,
            renderbuffer: H.create,
            framebuffer: oe.create,
            framebufferCube: oe.createCube,
            vao: ce.createVAO,
            // Expose context attributes
            attributes: M,
            // Frame rendering
            frame: ft,
            on: dt,
            // System limits
            limits: N,
            hasExtension: function(ge) {
              return N.extensions.indexOf(ge.toLowerCase()) >= 0;
            },
            // Read pixels
            read: Te,
            // Destroy regl and all associated resources
            destroy: De,
            // Direct GL state manipulation
            _gl: l,
            _refresh: Ze,
            poll: function() {
              ht(), te && te.update();
            },
            // Current time
            now: Oe,
            // regl Statistics Information
            stats: Y
          });
          return r.onDone(null, We), We;
        }
        return _c;
      }));
    })(On)), On.exports;
  }
  var ol = sl();
  const Ks = /* @__PURE__ */ Ba(ol), fl = Dc();
  class ul {
    constructor({
      pb: n = null,
      width: p = 1280,
      height: b = 720,
      numSources: T = 4,
      numOutputs: v = 4,
      makeGlobal: I = !0,
      autoLoop: R = !0,
      detectAudio: X = !0,
      enableStreamCapture: ee = !0,
      canvas: He,
      precision: ye,
      extendTransforms: ve = {}
      // add your own functions on init
    } = {}) {
      if (Qs.init(), this.pb = n, this.width = p, this.height = b, this.renderAll = !1, this.detectAudio = X, this._initCanvas(He), this.synth = {
        time: 0,
        bpm: 30,
        width: this.width,
        height: this.height,
        fps: void 0,
        stats: {
          fps: 0
        },
        speed: 1,
        mouse: fl,
        render: this._render.bind(this),
        setResolution: this.setResolution.bind(this),
        update: (Ue) => {
        },
        // user defined update function
        afterUpdate: (Ue) => {
        },
        // user defined function run after update
        hush: this.hush.bind(this),
        tick: this.tick.bind(this)
      }, I && (window.loadScript = this.loadScript), this.timeSinceLastUpdate = 0, this._time = 0, ye && ["lowp", "mediump", "highp"].includes(ye.toLowerCase()))
        this.precision = ye.toLowerCase();
      else {
        let Ue = (/iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
        this.precision = Ue ? "highp" : "mediump";
      }
      if (this.extendTransforms = ve, this.saveFrame = !1, this.captureStream = null, this.generator = void 0, this.numOutputs = Math.max(1, v), this._initRegl(), this._initOutputs(this.numOutputs), this._initSources(T), this._generateGlslTransforms(), this.synth.screencap = () => {
        this.saveFrame = !0;
      }, ee)
        try {
          this.captureStream = this.canvas.captureStream(25), this.synth.vidRecorder = new Xc(this.captureStream);
        } catch (Ue) {
          console.warn(`[hydra-synth warning]
new MediaSource() is not currently supported on iOS.`), console.error(Ue);
        }
      X && this._initAudio(), R && Cc(this.tick.bind(this)).start(), this.sandbox = new Wc(this.synth, I, ["speed", "update", "afterUpdate", "bpm", "fps"]);
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
      return new Promise((b, T) => {
        var v = document.createElement("script");
        v.onload = function() {
          console.log(`loaded script ${n}`), b();
        }, v.onerror = (I) => {
          console.log(`error loading script ${n}`, "log-error"), b();
        }, v.src = n, document.head.appendChild(v);
      });
    }
    setResolution(n, p) {
      this.canvas.width = n, this.canvas.height = p, this.width = n, this.height = p, this.sandbox.set("width", n), this.sandbox.set("height", p), console.log(this.width), this.o.forEach((b) => {
        b.resize(n, p);
      }), this.s.forEach((b) => {
        b.resize(n, p);
      }), this.regl._refresh(), console.log(this.canvas.width);
    }
    canvasToImage(n) {
      const p = document.createElement("a");
      p.style.display = "none";
      let b = /* @__PURE__ */ new Date();
      p.download = `hydra-${b.getFullYear()}-${b.getMonth() + 1}-${b.getDate()}-${b.getHours()}.${b.getMinutes()}.${b.getSeconds()}.png`, document.body.appendChild(p);
      var T = this;
      this.canvas.toBlob((v) => {
        T.imageCallback ? (T.imageCallback(v), delete T.imageCallback) : (p.href = URL.createObjectURL(v), console.log(p.href), p.click());
      }, "image/png"), setTimeout(() => {
        document.body.removeChild(p), window.URL.revokeObjectURL(p.href);
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
      n ? this.regl = Ks({
        gl: n,
        pixelRatio: 1
      }) : (console.warn("[hydra-synth] WebGL2 not available, falling back to WebGL1"), this.regl = Ks({
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
      const p = {};
      for (let T = 0; T < this.numOutputs; T++)
        p[`tex[${T}]`] = this.regl.prop(`tex${T}`);
      let b;
      if (this.numOutputs === 1)
        b = `#version 300 es
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
        const T = Math.ceil(Math.sqrt(this.numOutputs)), v = Math.ceil(this.numOutputs / T);
        let I = "";
        for (let R = 0; R < this.numOutputs; R++) {
          const X = `if(index==${R}){ fragColor = texture(tex[${R}], st); }`;
          R === 0 ? I += X : I += " else " + X;
        }
        I += " else { fragColor = vec4(0.0); }", b = `#version 300 es
        precision ${this.precision} float;
        in vec2 uv;
        out vec4 fragColor;
        uniform sampler2D tex[${this.numOutputs}];

        void main () {
          vec2 st = vec2(1.0 - uv.x, uv.y);
          st *= vec2(${T}.0, ${v}.0);
          vec2 gridPos = floor(st);
          
          // Column-major indexing (y + x * rows) to preserve visual layout of previous 2x2 grid (0=TL, 1=BL, 2=TR, 3=BR)
          int index = int(gridPos.y) + int(gridPos.x) * ${v};
          
          st = fract(st);
          
          ${I}
        }
        `;
      }
      this.renderAll = this.regl({
        frag: b,
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
        uniforms: p,
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
      const p = this;
      this.o = Array(n).fill().map((b, T) => {
        var v = new Ec({
          regl: this.regl,
          width: this.width,
          height: this.height,
          precision: this.precision,
          label: `o${T}`
        });
        return v.id = T, p.synth["o" + T] = v, v;
      }), this.output = this.o[0];
    }
    _initSources(n) {
      this.s = [];
      for (var p = 0; p < n; p++)
        this.createSource(p);
    }
    createSource(n) {
      let p = new Mc({ regl: this.regl, pb: this.pb, width: this.width, height: this.height, label: `s${n}` });
      return this.synth["s" + this.s.length] = p, this.s.push(p), p;
    }
    _generateGlslTransforms() {
      var n = this;
      this.generator = new rl({
        defaultOutput: this.o[0],
        defaultUniforms: this.o[0].uniforms,
        extendTransforms: this.extendTransforms,
        changeListener: ({ type: p, method: b, synth: T }) => {
          p === "add" && (n.synth[b] = T.generators[b], n.sandbox && n.sandbox.add(b));
        }
      }), this.synth.setFunction = this.generator.setFunction.bind(this.generator);
    }
    _render(n) {
      n ? (this.output = n, this.isRenderingAll = !1) : this.isRenderingAll = !0;
    }
    // dt in ms
    tick(n, p) {
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
          const b = this.synth.time;
          for (let T = 0; T < this.o.length; T++)
            this.o[T].tick({
              time: b,
              mouse: this.synth.mouse,
              bpm: this.synth.bpm,
              resolution: [this.canvas.width, this.canvas.height]
            });
          if (this.isRenderingAll) {
            const T = {
              resolution: [this.canvas.width, this.canvas.height]
            };
            for (let v = 0; v < this.o.length; v++)
              T[`tex${v}`] = this.o[v].getCurrent();
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
      } catch (b) {
        console.warn("Error during tick():", b);
      }
    }
  }
  Js.exports = ul;
});
export default cl();
