var gc = (u, n) => () => (n || u((n = { exports: {} }).exports, n), n.exports);
var ul = gc((ll, es) => {
  class Ec {
    constructor({ regl: n, precision: v, label: y = "", width: w, height: _ }) {
      this.regl = n, this.precision = v, this.label = y, this.positionBuffer = this.regl.buffer([
        [-2, 0],
        [0, -2],
        [2, 2]
      ]), this.draw = () => {
      }, this.init(), this.pingPongIndex = 0, this.fbos = Array(2).fill().map(() => this.regl.framebuffer({
        color: this.regl.texture({
          mag: "nearest",
          width: w,
          height: _,
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
      var y = this, w = Object.assign(v.uniforms, {
        prevBuffer: () => y.fbos[y.pingPongIndex]
      });
      y.draw = y.regl({
        frag: v.frag,
        vert: y.vert,
        attributes: y.attributes,
        uniforms: w,
        count: 3,
        framebuffer: () => (y.pingPongIndex = y.pingPongIndex ? 0 : 1, y.fbos[y.pingPongIndex])
      });
    }
    tick(n) {
      this.draw(n);
    }
  }
  function Ba(u) {
    return u && u.__esModule && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u;
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
    function u() {
      this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0;
    }
    Oa = u, u.EventEmitter = u, u.prototype._events = void 0, u.prototype._maxListeners = void 0, u.defaultMaxListeners = 10, u.prototype.setMaxListeners = function(_) {
      if (!v(_) || _ < 0 || isNaN(_))
        throw TypeError("n must be a positive number");
      return this._maxListeners = _, this;
    }, u.prototype.emit = function(_) {
      var D, k, ee, ue, Ve, ve;
      if (this._events || (this._events = {}), _ === "error" && (!this._events.error || y(this._events.error) && !this._events.error.length)) {
        if (D = arguments[1], D instanceof Error)
          throw D;
        var Le = new Error('Uncaught, unspecified "error" event. (' + D + ")");
        throw Le.context = D, Le;
      }
      if (k = this._events[_], w(k))
        return !1;
      if (n(k))
        switch (arguments.length) {
          // fast cases
          case 1:
            k.call(this);
            break;
          case 2:
            k.call(this, arguments[1]);
            break;
          case 3:
            k.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            ue = Array.prototype.slice.call(arguments, 1), k.apply(this, ue);
        }
      else if (y(k))
        for (ue = Array.prototype.slice.call(arguments, 1), ve = k.slice(), ee = ve.length, Ve = 0; Ve < ee; Ve++)
          ve[Ve].apply(this, ue);
      return !0;
    }, u.prototype.addListener = function(_, D) {
      var k;
      if (!n(D))
        throw TypeError("listener must be a function");
      return this._events || (this._events = {}), this._events.newListener && this.emit(
        "newListener",
        _,
        n(D.listener) ? D.listener : D
      ), this._events[_] ? y(this._events[_]) ? this._events[_].push(D) : this._events[_] = [this._events[_], D] : this._events[_] = D, y(this._events[_]) && !this._events[_].warned && (w(this._maxListeners) ? k = u.defaultMaxListeners : k = this._maxListeners, k && k > 0 && this._events[_].length > k && (this._events[_].warned = !0, console.error(
        "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
        this._events[_].length
      ), typeof console.trace == "function" && console.trace())), this;
    }, u.prototype.on = u.prototype.addListener, u.prototype.once = function(_, D) {
      if (!n(D))
        throw TypeError("listener must be a function");
      var k = !1;
      function ee() {
        this.removeListener(_, ee), k || (k = !0, D.apply(this, arguments));
      }
      return ee.listener = D, this.on(_, ee), this;
    }, u.prototype.removeListener = function(_, D) {
      var k, ee, ue, Ve;
      if (!n(D))
        throw TypeError("listener must be a function");
      if (!this._events || !this._events[_])
        return this;
      if (k = this._events[_], ue = k.length, ee = -1, k === D || n(k.listener) && k.listener === D)
        delete this._events[_], this._events.removeListener && this.emit("removeListener", _, D);
      else if (y(k)) {
        for (Ve = ue; Ve-- > 0; )
          if (k[Ve] === D || k[Ve].listener && k[Ve].listener === D) {
            ee = Ve;
            break;
          }
        if (ee < 0)
          return this;
        k.length === 1 ? (k.length = 0, delete this._events[_]) : k.splice(ee, 1), this._events.removeListener && this.emit("removeListener", _, D);
      }
      return this;
    }, u.prototype.removeAllListeners = function(_) {
      var D, k;
      if (!this._events)
        return this;
      if (!this._events.removeListener)
        return arguments.length === 0 ? this._events = {} : this._events[_] && delete this._events[_], this;
      if (arguments.length === 0) {
        for (D in this._events)
          D !== "removeListener" && this.removeAllListeners(D);
        return this.removeAllListeners("removeListener"), this._events = {}, this;
      }
      if (k = this._events[_], n(k))
        this.removeListener(_, k);
      else if (k)
        for (; k.length; )
          this.removeListener(_, k[k.length - 1]);
      return delete this._events[_], this;
    }, u.prototype.listeners = function(_) {
      var D;
      return !this._events || !this._events[_] ? D = [] : n(this._events[_]) ? D = [this._events[_]] : D = this._events[_].slice(), D;
    }, u.prototype.listenerCount = function(_) {
      if (this._events) {
        var D = this._events[_];
        if (n(D))
          return 1;
        if (D)
          return D.length;
      }
      return 0;
    }, u.listenerCount = function(_, D) {
      return _.listenerCount(D);
    };
    function n(_) {
      return typeof _ == "function";
    }
    function v(_) {
      return typeof _ == "number";
    }
    function y(_) {
      return typeof _ == "object" && _ !== null;
    }
    function w(_) {
      return _ === void 0;
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
      var u, n, v, y, w, _;
      typeof performance < "u" && performance !== null && performance.now ? sr.exports = function() {
        return performance.now();
      } : typeof process < "u" && process !== null && process.hrtime ? (sr.exports = function() {
        return (u() - w) / 1e6;
      }, n = process.hrtime, u = function() {
        var D;
        return D = n(), D[0] * 1e9 + D[1];
      }, y = u(), _ = process.uptime() * 1e9, w = y - _) : Date.now ? (sr.exports = function() {
        return Date.now() - v;
      }, v = Date.now()) : (sr.exports = function() {
        return (/* @__PURE__ */ new Date()).getTime() - v;
      }, v = (/* @__PURE__ */ new Date()).getTime());
    }).call(Tc)), sr.exports;
  }
  var Xo;
  function Lc() {
    if (Xo) return Hr.exports;
    Xo = 1;
    for (var u = Sc(), n = window, v = ["moz", "webkit"], y = "AnimationFrame", w = n["request" + y], _ = n["cancel" + y] || n["cancelRequest" + y], D = 0; !w && D < v.length; D++)
      w = n[v[D] + "Request" + y], _ = n[v[D] + "Cancel" + y] || n[v[D] + "CancelRequest" + y];
    if (!w || !_) {
      var k = 0, ee = 0, ue = [], Ve = 1e3 / 60;
      w = function(ve) {
        if (ue.length === 0) {
          var Le = u(), He = Math.max(0, Ve - (Le - k));
          k = He + Le, setTimeout(function() {
            var We = ue.slice(0);
            ue.length = 0;
            for (var Je = 0; Je < We.length; Je++)
              if (!We[Je].cancelled)
                try {
                  We[Je].callback(k);
                } catch (Pt) {
                  setTimeout(function() {
                    throw Pt;
                  }, 0);
                }
          }, Math.round(He));
        }
        return ue.push({
          handle: ++ee,
          callback: ve,
          cancelled: !1
        }), ee;
      }, _ = function(ve) {
        for (var Le = 0; Le < ue.length; Le++)
          ue[Le].handle === ve && (ue[Le].cancelled = !0);
      };
    }
    return Hr.exports = function(ve) {
      return w.call(n, ve);
    }, Hr.exports.cancel = function() {
      _.apply(n, arguments);
    }, Hr.exports.polyfill = function(ve) {
      ve || (ve = n), ve.requestAnimationFrame = w, ve.cancelAnimationFrame = _;
    }, Hr.exports;
  }
  var Fa, Vo;
  function Rc() {
    if (Vo) return Fa;
    Vo = 1;
    var u = xc(), n = wc().EventEmitter, v = Ac(), y = Lc();
    Fa = w;
    function w(_) {
      if (!(this instanceof w))
        return new w(_);
      this.running = !1, this.last = v(), this._frame = 0, this._tick = this.tick.bind(this), _ && this.on("tick", _);
    }
    return u(w, n), w.prototype.start = function() {
      if (!this.running)
        return this.running = !0, this.last = v(), this._frame = y(this._tick), this;
    }, w.prototype.stop = function() {
      return this.running = !1, this._frame !== 0 && y.cancel(this._frame), this._frame = 0, this;
    }, w.prototype.tick = function() {
      this._frame = y(this._tick);
      var _ = v(), D = _ - this.last;
      this.emit("tick", D), this.last = _;
    }, Fa;
  }
  var Oc = Rc();
  const Cc = /* @__PURE__ */ Ba(Oc);
  function Fc(u) {
    return navigator.mediaDevices.enumerateDevices().then((n) => n.filter((v) => v.kind === "videoinput")).then((n) => {
      let v = { audio: !1, video: !0 };
      return n[u] && (v.video = {
        deviceId: { exact: n[u].deviceId }
      }), window.navigator.mediaDevices.getUserMedia(v);
    }).then((n) => {
      const v = document.createElement("video");
      return v.setAttribute("autoplay", ""), v.setAttribute("muted", ""), v.setAttribute("playsinline", ""), v.srcObject = n, new Promise((y, w) => {
        v.addEventListener("loadedmetadata", () => {
          v.play().then(() => y({ video: v }));
        });
      });
    }).catch(console.log.bind(console));
  }
  function Gc(u) {
    return new Promise(function(n, v) {
      navigator.mediaDevices.getDisplayMedia(u).then((y) => {
        const w = document.createElement("video");
        w.srcObject = y, w.addEventListener("loadedmetadata", () => {
          w.play(), n({ video: w });
        });
      }).catch((y) => v(y));
    });
  }
  class Mc {
    constructor({ regl: n, width: v, height: y, pb: w, label: _ = "" }) {
      this.label = _, this.regl = n, this.src = null, this.dynamic = !0, this.width = v, this.height = y, this.tex = this.regl.texture({
        //  shape: [width, height]
        shape: [1, 1]
      }), this.pb = w;
    }
    init(n, v) {
      "src" in n && (this.src = n.src, this.tex = this.regl.texture({ data: this.src, ...v })), "dynamic" in n && (this.dynamic = n.dynamic);
    }
    initCam(n, v) {
      const y = this;
      Fc(n).then((w) => {
        y.src = w.video, y.dynamic = !0, y.tex = y.regl.texture({ data: y.src, ...v });
      }).catch((w) => console.log("could not get camera", w));
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
      n && this.pb && (this.pb.initSource(n), this.pb.on("got video", function(w, _) {
        w === n && (y.src = _, y.dynamic = !0, y.tex = y.regl.texture({ data: y.src, ...v }));
      }));
    }
    // index only relevant in atom-hydra + desktop apps
    initScreen(n = 0, v) {
      const y = this;
      Gc().then(function(w) {
        y.src = w.video, y.tex = y.regl.texture({ data: y.src, ...v }), y.dynamic = !0;
      }).catch((w) => console.log("could not get screen", w));
    }
    // cache for the canvases, so we don't create them every time
    canvases = {};
    // Creates a canvas and returns the 2d context
    initCanvas(n = 1e3, v = 1e3) {
      if (this.canvases[this.label] == null) {
        const D = document.createElement("canvas").getContext("2d");
        D != null && (this.canvases[this.label] = D);
      }
      const y = this.canvases[this.label], w = y.canvas;
      return w.width !== n && w.height !== v ? (w.width = n, w.height = v) : y.clearRect(0, 0, n, v), this.init({ src: w }), this.dynamic = !0, y;
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
    var v = 0, y = 0, w = 0, _ = {
      shift: !1,
      alt: !1,
      control: !1,
      meta: !1
    }, D = !1;
    function k(Ue) {
      var at = !1;
      return "altKey" in Ue && (at = at || Ue.altKey !== _.alt, _.alt = !!Ue.altKey), "shiftKey" in Ue && (at = at || Ue.shiftKey !== _.shift, _.shift = !!Ue.shiftKey), "ctrlKey" in Ue && (at = at || Ue.ctrlKey !== _.control, _.control = !!Ue.ctrlKey), "metaKey" in Ue && (at = at || Ue.metaKey !== _.meta, _.meta = !!Ue.metaKey), at;
    }
    function ee(Ue, at) {
      var Yt = zt.x(at), gt = zt.y(at);
      "buttons" in at && (Ue = at.buttons | 0), (Ue !== v || Yt !== y || gt !== w || k(at)) && (v = Ue | 0, y = Yt || 0, w = gt || 0, n && n(v, y, w, _));
    }
    function ue(Ue) {
      ee(0, Ue);
    }
    function Ve() {
      (v || y || w || _.shift || _.alt || _.meta || _.control) && (y = w = 0, v = 0, _.shift = _.alt = _.control = _.meta = !1, n && n(0, 0, 0, _));
    }
    function ve(Ue) {
      k(Ue) && n && n(v, y, w, _);
    }
    function Le(Ue) {
      zt.buttons(Ue) === 0 ? ee(0, Ue) : ee(v, Ue);
    }
    function He(Ue) {
      ee(v | zt.buttons(Ue), Ue);
    }
    function We(Ue) {
      ee(v & ~zt.buttons(Ue), Ue);
    }
    function Je() {
      D || (D = !0, u.addEventListener("mousemove", Le), u.addEventListener("mousedown", He), u.addEventListener("mouseup", We), u.addEventListener("mouseleave", ue), u.addEventListener("mouseenter", ue), u.addEventListener("mouseout", ue), u.addEventListener("mouseover", ue), u.addEventListener("blur", Ve), u.addEventListener("keyup", ve), u.addEventListener("keydown", ve), u.addEventListener("keypress", ve), u !== window && (window.addEventListener("blur", Ve), window.addEventListener("keyup", ve), window.addEventListener("keydown", ve), window.addEventListener("keypress", ve)));
    }
    function Pt() {
      D && (D = !1, u.removeEventListener("mousemove", Le), u.removeEventListener("mousedown", He), u.removeEventListener("mouseup", We), u.removeEventListener("mouseleave", ue), u.removeEventListener("mouseenter", ue), u.removeEventListener("mouseout", ue), u.removeEventListener("mouseover", ue), u.removeEventListener("blur", Ve), u.removeEventListener("keyup", ve), u.removeEventListener("keydown", ve), u.removeEventListener("keypress", ve), u !== window && (window.removeEventListener("blur", Ve), window.removeEventListener("keyup", ve), window.removeEventListener("keydown", ve), window.removeEventListener("keypress", ve)));
    }
    Je();
    var pt = {
      element: u
    };
    return Object.defineProperties(pt, {
      enabled: {
        get: function() {
          return D;
        },
        set: function(Ue) {
          Ue ? Je() : Pt();
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
          return w;
        },
        enumerable: !0
      },
      mods: {
        get: function() {
          return _;
        },
        enumerable: !0
      }
    }), pt;
  }
  var Rn = { exports: {} }, Pc = Rn.exports, Ho;
  function $c() {
    return Ho || (Ho = 1, (function(u, n) {
      (function(v, y) {
        u.exports = y();
      })(Pc, (function() {
        function v(R, b, X) {
          for (var C, re = 0, pe = b.length; re < pe; re++) !C && re in b || (C || (C = Array.prototype.slice.call(b, 0, re)), C[re] = b[re]);
          return R.concat(C || Array.prototype.slice.call(b));
        }
        var y = Object.freeze({ __proto__: null, blackman: function(R) {
          for (var b = new Float32Array(R), X = 2 * Math.PI / (R - 1), C = 2 * X, re = 0; re < R / 2; re++) b[re] = 0.42 - 0.5 * Math.cos(re * X) + 0.08 * Math.cos(re * C);
          for (re = Math.ceil(R / 2); re > 0; re--) b[R - re] = b[re - 1];
          return b;
        }, hamming: function(R) {
          for (var b = new Float32Array(R), X = 0; X < R; X++) b[X] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (X / R - 1));
          return b;
        }, hanning: function(R) {
          for (var b = new Float32Array(R), X = 0; X < R; X++) b[X] = 0.5 - 0.5 * Math.cos(2 * Math.PI * X / (R - 1));
          return b;
        }, sine: function(R) {
          for (var b = Math.PI / (R - 1), X = new Float32Array(R), C = 0; C < R; C++) X[C] = Math.sin(b * C);
          return X;
        } }), w = {};
        function _(R) {
          for (; R % 2 == 0 && R > 1; ) R /= 2;
          return R === 1;
        }
        function D(R, b) {
          if (b !== "rect") {
            if (b !== "" && b || (b = "hanning"), w[b] || (w[b] = {}), !w[b][R.length]) try {
              w[b][R.length] = y[b](R.length);
            } catch {
              throw new Error("Invalid windowing function");
            }
            R = (function(X, C) {
              for (var re = [], pe = 0; pe < Math.min(X.length, C.length); pe++) re[pe] = X[pe] * C[pe];
              return re;
            })(R, w[b][R.length]);
          }
          return R;
        }
        function k(R, b, X) {
          for (var C = new Float32Array(R), re = 0; re < C.length; re++) C[re] = re * b / X, C[re] = 13 * Math.atan(C[re] / 1315.8) + 3.5 * Math.atan(Math.pow(C[re] / 7518, 2));
          return C;
        }
        function ee(R) {
          return Float32Array.from(R);
        }
        function ue(R) {
          return 1125 * Math.log(1 + R / 700);
        }
        function Ve(R, b, X) {
          for (var C, re = new Float32Array(R + 2), pe = new Float32Array(R + 2), Ge = b / 2, Be = ue(0), Te = (ue(Ge) - Be) / (R + 1), we = new Array(R + 2), Pe = 0; Pe < re.length; Pe++) re[Pe] = Pe * Te, pe[Pe] = (C = re[Pe], 700 * (Math.exp(C / 1125) - 1)), we[Pe] = Math.floor((X + 1) * pe[Pe] / b);
          for (var vt = new Array(R), De = 0; De < vt.length; De++) {
            for (vt[De] = new Array(X / 2 + 1).fill(0), Pe = we[De]; Pe < we[De + 1]; Pe++) vt[De][Pe] = (Pe - we[De]) / (we[De + 1] - we[De]);
            for (Pe = we[De + 1]; Pe < we[De + 2]; Pe++) vt[De][Pe] = (we[De + 2] - Pe) / (we[De + 2] - we[De + 1]);
          }
          return vt;
        }
        function ve(R, b, X, C, re, pe, Ge) {
          C === void 0 && (C = 5), re === void 0 && (re = 2), pe === void 0 && (pe = !0), Ge === void 0 && (Ge = 440);
          var Be = Math.floor(X / 2) + 1, Te = new Array(X).fill(0).map((function(it, mt) {
            return R * (function(yt, Ft) {
              return Math.log2(16 * yt / Ft);
            })(b * mt / X, Ge);
          }));
          Te[0] = Te[1] - 1.5 * R;
          var we, Pe, vt, De = Te.slice(1).map((function(it, mt) {
            return Math.max(it - Te[mt]);
          }), 1).concat([1]), Rt = Math.round(R / 2), wt = new Array(R).fill(0).map((function(it, mt) {
            return Te.map((function(yt) {
              return (10 * R + Rt + yt - mt) % R - Rt;
            }));
          })), At = wt.map((function(it, mt) {
            return it.map((function(yt, Ft) {
              return Math.exp(-0.5 * Math.pow(2 * wt[mt][Ft] / De[Ft], 2));
            }));
          }));
          if (Pe = (we = At)[0].map((function() {
            return 0;
          })), vt = we.reduce((function(it, mt) {
            return mt.forEach((function(yt, Ft) {
              it[Ft] += Math.pow(yt, 2);
            })), it;
          }), Pe).map(Math.sqrt), At = we.map((function(it, mt) {
            return it.map((function(yt, Ft) {
              return yt / (vt[Ft] || 1);
            }));
          })), re) {
            var Lr = Te.map((function(it) {
              return Math.exp(-0.5 * Math.pow((it / R - C) / re, 2));
            }));
            At = At.map((function(it) {
              return it.map((function(mt, yt) {
                return mt * Lr[yt];
              }));
            }));
          }
          return pe && (At = v(v([], At.slice(3), !0), At.slice(0, 3))), At.map((function(it) {
            return it.slice(0, Be);
          }));
        }
        function Le(R, b) {
          for (var X = 0, C = 0, re = 0; re < b.length; re++) X += Math.pow(re, R) * Math.abs(b[re]), C += b[re];
          return X / C;
        }
        function He(R) {
          var b = R.ampSpectrum, X = R.barkScale, C = R.numberOfBarkBands, re = C === void 0 ? 24 : C;
          if (typeof b != "object" || typeof X != "object") throw new TypeError();
          var pe = re, Ge = new Float32Array(pe), Be = 0, Te = b, we = new Int32Array(pe + 1);
          we[0] = 0;
          for (var Pe = X[Te.length - 1] / pe, vt = 1, De = 0; De < Te.length; De++) for (; X[De] > Pe; ) we[vt++] = De, Pe = vt * X[Te.length - 1] / pe;
          for (we[pe] = Te.length - 1, De = 0; De < pe; De++) {
            for (var Rt = 0, wt = we[De]; wt < we[De + 1]; wt++) Rt += Te[wt];
            Ge[De] = Math.pow(Rt, 0.23);
          }
          for (De = 0; De < Ge.length; De++) Be += Ge[De];
          return { specific: Ge, total: Be };
        }
        function We(R) {
          var b = R.ampSpectrum;
          if (typeof b != "object") throw new TypeError();
          for (var X = new Float32Array(b.length), C = 0; C < X.length; C++) X[C] = Math.pow(b[C], 2);
          return X;
        }
        function Je(R) {
          var b = R.ampSpectrum, X = R.melFilterBank, C = R.bufferSize;
          if (typeof b != "object") throw new TypeError("Valid ampSpectrum is required to generate melBands");
          if (typeof X != "object") throw new TypeError("Valid melFilterBank is required to generate melBands");
          for (var re = We({ ampSpectrum: b }), pe = X.length, Ge = Array(pe), Be = new Float32Array(pe), Te = 0; Te < Be.length; Te++) {
            Ge[Te] = new Float32Array(C / 2), Be[Te] = 0;
            for (var we = 0; we < C / 2; we++) Ge[Te][we] = X[Te][we] * re[we], Be[Te] += Ge[Te][we];
            Be[Te] = Math.log(Be[Te] + 1);
          }
          return Array.prototype.slice.call(Be);
        }
        function Pt(R) {
          return R && R.__esModule && Object.prototype.hasOwnProperty.call(R, "default") ? R.default : R;
        }
        var pt = null, Ue = Pt((function(R, b) {
          var X = R.length;
          return b = b || 2, pt && pt[X] || (function(C) {
            (pt = pt || {})[C] = new Array(C * C);
            for (var re = Math.PI / C, pe = 0; pe < C; pe++) for (var Ge = 0; Ge < C; Ge++) pt[C][Ge + pe * C] = Math.cos(re * (Ge + 0.5) * pe);
          })(X), R.map((function() {
            return 0;
          })).map((function(C, re) {
            return b * R.reduce((function(pe, Ge, Be, Te) {
              return pe + Ge * pt[X][Be + re * X];
            }), 0);
          }));
        })), at = Object.freeze({ __proto__: null, amplitudeSpectrum: function(R) {
          return R.ampSpectrum;
        }, buffer: function(R) {
          return R.signal;
        }, chroma: function(R) {
          var b = R.ampSpectrum, X = R.chromaFilterBank;
          if (typeof b != "object") throw new TypeError("Valid ampSpectrum is required to generate chroma");
          if (typeof X != "object") throw new TypeError("Valid chromaFilterBank is required to generate chroma");
          var C = X.map((function(pe, Ge) {
            return b.reduce((function(Be, Te, we) {
              return Be + Te * pe[we];
            }), 0);
          })), re = Math.max.apply(Math, C);
          return re ? C.map((function(pe) {
            return pe / re;
          })) : C;
        }, complexSpectrum: function(R) {
          return R.complexSpectrum;
        }, energy: function(R) {
          var b = R.signal;
          if (typeof b != "object") throw new TypeError();
          for (var X = 0, C = 0; C < b.length; C++) X += Math.pow(Math.abs(b[C]), 2);
          return X;
        }, loudness: He, melBands: Je, mfcc: function(R) {
          var b = R.ampSpectrum, X = R.melFilterBank, C = R.numberOfMFCCCoefficients, re = R.bufferSize, pe = Math.min(40, Math.max(1, C || 13));
          if (X.length < pe) throw new Error("Insufficient filter bank for requested number of coefficients");
          var Ge = Je({ ampSpectrum: b, melFilterBank: X, bufferSize: re });
          return Ue(Ge).slice(0, pe);
        }, perceptualSharpness: function(R) {
          for (var b = He({ ampSpectrum: R.ampSpectrum, barkScale: R.barkScale }), X = b.specific, C = 0, re = 0; re < X.length; re++) C += re < 15 ? (re + 1) * X[re + 1] : 0.066 * Math.exp(0.171 * (re + 1));
          return C *= 0.11 / b.total;
        }, perceptualSpread: function(R) {
          for (var b = He({ ampSpectrum: R.ampSpectrum, barkScale: R.barkScale }), X = 0, C = 0; C < b.specific.length; C++) b.specific[C] > X && (X = b.specific[C]);
          return Math.pow((b.total - X) / b.total, 2);
        }, powerSpectrum: We, rms: function(R) {
          var b = R.signal;
          if (typeof b != "object") throw new TypeError();
          for (var X = 0, C = 0; C < b.length; C++) X += Math.pow(b[C], 2);
          return X /= b.length, X = Math.sqrt(X);
        }, spectralCentroid: function(R) {
          var b = R.ampSpectrum;
          if (typeof b != "object") throw new TypeError();
          return Le(1, b);
        }, spectralCrest: function(R) {
          var b = R.ampSpectrum;
          if (typeof b != "object") throw new TypeError();
          var X = 0, C = -1 / 0;
          return b.forEach((function(re) {
            X += Math.pow(re, 2), C = re > C ? re : C;
          })), X /= b.length, X = Math.sqrt(X), C / X;
        }, spectralFlatness: function(R) {
          var b = R.ampSpectrum;
          if (typeof b != "object") throw new TypeError();
          for (var X = 0, C = 0, re = 0; re < b.length; re++) X += Math.log(b[re]), C += b[re];
          return Math.exp(X / b.length) * b.length / C;
        }, spectralFlux: function(R) {
          var b = R.signal, X = R.previousSignal, C = R.bufferSize;
          if (typeof b != "object" || typeof X != "object") throw new TypeError();
          for (var re = 0, pe = -C / 2; pe < b.length / 2 - 1; pe++) x = Math.abs(b[pe]) - Math.abs(X[pe]), re += (x + Math.abs(x)) / 2;
          return re;
        }, spectralKurtosis: function(R) {
          var b = R.ampSpectrum;
          if (typeof b != "object") throw new TypeError();
          var X = b, C = Le(1, X), re = Le(2, X), pe = Le(3, X), Ge = Le(4, X);
          return (-3 * Math.pow(C, 4) + 6 * C * re - 4 * C * pe + Ge) / Math.pow(Math.sqrt(re - Math.pow(C, 2)), 4);
        }, spectralRolloff: function(R) {
          var b = R.ampSpectrum, X = R.sampleRate;
          if (typeof b != "object") throw new TypeError();
          for (var C = b, re = X / (2 * (C.length - 1)), pe = 0, Ge = 0; Ge < C.length; Ge++) pe += C[Ge];
          for (var Be = 0.99 * pe, Te = C.length - 1; pe > Be && Te >= 0; ) pe -= C[Te], --Te;
          return (Te + 1) * re;
        }, spectralSkewness: function(R) {
          var b = R.ampSpectrum;
          if (typeof b != "object") throw new TypeError();
          var X = Le(1, b), C = Le(2, b), re = Le(3, b);
          return (2 * Math.pow(X, 3) - 3 * X * C + re) / Math.pow(Math.sqrt(C - Math.pow(X, 2)), 3);
        }, spectralSlope: function(R) {
          var b = R.ampSpectrum, X = R.sampleRate, C = R.bufferSize;
          if (typeof b != "object") throw new TypeError();
          for (var re = 0, pe = 0, Ge = new Float32Array(b.length), Be = 0, Te = 0, we = 0; we < b.length; we++) {
            re += b[we];
            var Pe = we * X / C;
            Ge[we] = Pe, Be += Pe * Pe, pe += Pe, Te += Pe * b[we];
          }
          return (b.length * Te - pe * re) / (re * (Be - Math.pow(pe, 2)));
        }, spectralSpread: function(R) {
          var b = R.ampSpectrum;
          if (typeof b != "object") throw new TypeError();
          return Math.sqrt(Le(2, b) - Math.pow(Le(1, b), 2));
        }, zcr: function(R) {
          var b = R.signal;
          if (typeof b != "object") throw new TypeError();
          for (var X = 0, C = 1; C < b.length; C++) (b[C - 1] >= 0 && b[C] < 0 || b[C - 1] < 0 && b[C] >= 0) && X++;
          return X;
        } });
        function Yt(R) {
          if (Array.isArray(R)) {
            for (var b = 0, X = Array(R.length); b < R.length; b++) X[b] = R[b];
            return X;
          }
          return Array.from(R);
        }
        var gt = {}, fr = {}, It = { bitReverseArray: function(R) {
          if (gt[R] === void 0) {
            for (var b = (R - 1).toString(2).length, X = "0".repeat(b), C = {}, re = 0; re < R; re++) {
              var pe = re.toString(2);
              pe = X.substr(pe.length) + pe, pe = [].concat(Yt(pe)).reverse().join(""), C[re] = parseInt(pe, 2);
            }
            gt[R] = C;
          }
          return gt[R];
        }, multiply: function(R, b) {
          return { real: R.real * b.real - R.imag * b.imag, imag: R.real * b.imag + R.imag * b.real };
        }, add: function(R, b) {
          return { real: R.real + b.real, imag: R.imag + b.imag };
        }, subtract: function(R, b) {
          return { real: R.real - b.real, imag: R.imag - b.imag };
        }, euler: function(R, b) {
          var X = -2 * Math.PI * R / b;
          return { real: Math.cos(X), imag: Math.sin(X) };
        }, conj: function(R) {
          return R.imag *= -1, R;
        }, constructComplexArray: function(R) {
          var b = {};
          b.real = R.real === void 0 ? R.slice() : R.real.slice();
          var X = b.real.length;
          return fr[X] === void 0 && (fr[X] = Array.apply(null, Array(X)).map(Number.prototype.valueOf, 0)), b.imag = fr[X].slice(), b;
        } }, Cn = function(R) {
          var b = {};
          R.real === void 0 || R.imag === void 0 ? b = It.constructComplexArray(R) : (b.real = R.real.slice(), b.imag = R.imag.slice());
          var X = b.real.length, C = Math.log2(X);
          if (Math.round(C) != C) throw new Error("Input size must be a power of 2.");
          if (b.real.length != b.imag.length) throw new Error("Real and imaginary components must have the same length.");
          for (var re = It.bitReverseArray(X), pe = { real: [], imag: [] }, Ge = 0; Ge < X; Ge++) pe.real[re[Ge]] = b.real[Ge], pe.imag[re[Ge]] = b.imag[Ge];
          for (var Be = 0; Be < X; Be++) b.real[Be] = pe.real[Be], b.imag[Be] = pe.imag[Be];
          for (var Te = 1; Te <= C; Te++) for (var we = Math.pow(2, Te), Pe = 0; Pe < we / 2; Pe++) for (var vt = It.euler(Pe, we), De = 0; De < X / we; De++) {
            var Rt = we * De + Pe, wt = we * De + Pe + we / 2, At = { real: b.real[Rt], imag: b.imag[Rt] }, Lr = { real: b.real[wt], imag: b.imag[wt] }, it = It.multiply(vt, Lr), mt = It.subtract(At, it);
            b.real[wt] = mt.real, b.imag[wt] = mt.imag;
            var yt = It.add(it, At);
            b.real[Rt] = yt.real, b.imag[Rt] = yt.imag;
          }
          return b;
        }, Fn = Cn, Gn = (function() {
          function R(b, X) {
            var C = this;
            if (this._m = X, !b.audioContext) throw this._m.errors.noAC;
            if (b.bufferSize && !_(b.bufferSize)) throw this._m._errors.notPow2;
            if (!b.source) throw this._m._errors.noSource;
            this._m.audioContext = b.audioContext, this._m.bufferSize = b.bufferSize || this._m.bufferSize || 256, this._m.hopSize = b.hopSize || this._m.hopSize || this._m.bufferSize, this._m.sampleRate = b.sampleRate || this._m.audioContext.sampleRate || 44100, this._m.callback = b.callback, this._m.windowingFunction = b.windowingFunction || "hanning", this._m.featureExtractors = at, this._m.EXTRACTION_STARTED = b.startImmediately || !1, this._m.channel = typeof b.channel == "number" ? b.channel : 0, this._m.inputs = b.inputs || 1, this._m.outputs = b.outputs || 1, this._m.numberOfMFCCCoefficients = b.numberOfMFCCCoefficients || this._m.numberOfMFCCCoefficients || 13, this._m.numberOfBarkBands = b.numberOfBarkBands || this._m.numberOfBarkBands || 24, this._m.spn = this._m.audioContext.createScriptProcessor(this._m.bufferSize, this._m.inputs, this._m.outputs), this._m.spn.connect(this._m.audioContext.destination), this._m._featuresToExtract = b.featureExtractors || [], this._m.barkScale = k(this._m.bufferSize, this._m.sampleRate, this._m.bufferSize), this._m.melFilterBank = Ve(Math.max(this._m.melBands, this._m.numberOfMFCCCoefficients), this._m.sampleRate, this._m.bufferSize), this._m.inputData = null, this._m.previousInputData = null, this._m.frame = null, this._m.previousFrame = null, this.setSource(b.source), this._m.spn.onaudioprocess = function(re) {
              var pe;
              C._m.inputData !== null && (C._m.previousInputData = C._m.inputData), C._m.inputData = re.inputBuffer.getChannelData(C._m.channel), C._m.previousInputData ? ((pe = new Float32Array(C._m.previousInputData.length + C._m.inputData.length - C._m.hopSize)).set(C._m.previousInputData.slice(C._m.hopSize)), pe.set(C._m.inputData, C._m.previousInputData.length - C._m.hopSize)) : pe = C._m.inputData;
              var Ge = (function(Be, Te, we) {
                if (Be.length < Te) throw new Error("Buffer is too short for frame length");
                if (we < 1) throw new Error("Hop length cannot be less that 1");
                if (Te < 1) throw new Error("Frame length cannot be less that 1");
                var Pe = 1 + Math.floor((Be.length - Te) / we);
                return new Array(Pe).fill(0).map((function(vt, De) {
                  return Be.slice(De * we, De * we + Te);
                }));
              })(pe, C._m.bufferSize, C._m.hopSize);
              Ge.forEach((function(Be) {
                C._m.frame = Be;
                var Te = C._m.extract(C._m._featuresToExtract, C._m.frame, C._m.previousFrame);
                typeof C._m.callback == "function" && C._m.EXTRACTION_STARTED && C._m.callback(Te), C._m.previousFrame = C._m.frame;
              }));
            };
          }
          return R.prototype.start = function(b) {
            this._m._featuresToExtract = b || this._m._featuresToExtract, this._m.EXTRACTION_STARTED = !0;
          }, R.prototype.stop = function() {
            this._m.EXTRACTION_STARTED = !1;
          }, R.prototype.setSource = function(b) {
            this._m.source && this._m.source.disconnect(this._m.spn), this._m.source = b, this._m.source.connect(this._m.spn);
          }, R.prototype.setChannel = function(b) {
            b <= this._m.inputs ? this._m.channel = b : console.error("Channel ".concat(b, " does not exist. Make sure you've provided a value for 'inputs' that is greater than ").concat(b, " when instantiating the MeydaAnalyzer"));
          }, R.prototype.get = function(b) {
            return this._m.inputData ? this._m.extract(b || this._m._featuresToExtract, this._m.inputData, this._m.previousInputData) : null;
          }, R;
        })(), Tr = { audioContext: null, spn: null, bufferSize: 512, sampleRate: 44100, melBands: 26, chromaBands: 12, callback: null, windowingFunction: "hanning", featureExtractors: at, EXTRACTION_STARTED: !1, numberOfMFCCCoefficients: 13, numberOfBarkBands: 24, _featuresToExtract: [], windowing: D, _errors: { notPow2: new Error("Meyda: Buffer size must be a power of 2, e.g. 64 or 512"), featureUndef: new Error("Meyda: No features defined."), invalidFeatureFmt: new Error("Meyda: Invalid feature format"), invalidInput: new Error("Meyda: Invalid input."), noAC: new Error("Meyda: No AudioContext specified."), noSource: new Error("Meyda: No source node specified.") }, createMeydaAnalyzer: function(R) {
          return new Gn(R, Object.assign({}, Tr));
        }, listAvailableFeatureExtractors: function() {
          return Object.keys(this.featureExtractors);
        }, extract: function(R, b, X) {
          var C = this;
          if (!b) throw this._errors.invalidInput;
          if (typeof b != "object") throw this._errors.invalidInput;
          if (!R) throw this._errors.featureUndef;
          if (!_(b.length)) throw this._errors.notPow2;
          this.barkScale !== void 0 && this.barkScale.length == this.bufferSize || (this.barkScale = k(this.bufferSize, this.sampleRate, this.bufferSize)), this.melFilterBank !== void 0 && this.barkScale.length == this.bufferSize && this.melFilterBank.length == this.melBands || (this.melFilterBank = Ve(Math.max(this.melBands, this.numberOfMFCCCoefficients), this.sampleRate, this.bufferSize)), this.chromaFilterBank !== void 0 && this.chromaFilterBank.length == this.chromaBands || (this.chromaFilterBank = ve(this.chromaBands, this.sampleRate, this.bufferSize)), "buffer" in b && b.buffer === void 0 ? this.signal = ee(b) : this.signal = b;
          var re = Sr(b, this.windowingFunction, this.bufferSize);
          if (this.signal = re.windowedSignal, this.complexSpectrum = re.complexSpectrum, this.ampSpectrum = re.ampSpectrum, X) {
            var pe = Sr(X, this.windowingFunction, this.bufferSize);
            this.previousSignal = pe.windowedSignal, this.previousComplexSpectrum = pe.complexSpectrum, this.previousAmpSpectrum = pe.ampSpectrum;
          }
          var Ge = function(Be) {
            return C.featureExtractors[Be]({ ampSpectrum: C.ampSpectrum, chromaFilterBank: C.chromaFilterBank, complexSpectrum: C.complexSpectrum, signal: C.signal, bufferSize: C.bufferSize, sampleRate: C.sampleRate, barkScale: C.barkScale, melFilterBank: C.melFilterBank, previousSignal: C.previousSignal, previousAmpSpectrum: C.previousAmpSpectrum, previousComplexSpectrum: C.previousComplexSpectrum, numberOfMFCCCoefficients: C.numberOfMFCCCoefficients, numberOfBarkBands: C.numberOfBarkBands });
          };
          if (typeof R == "object") return R.reduce((function(Be, Te) {
            var we;
            return Object.assign({}, Be, ((we = {})[Te] = Ge(Te), we));
          }), {});
          if (typeof R == "string") return Ge(R);
          throw this._errors.invalidFeatureFmt;
        } }, Sr = function(R, b, X) {
          var C = {};
          R.buffer === void 0 ? C.signal = ee(R) : C.signal = R, C.windowedSignal = D(C.signal, b), C.complexSpectrum = Fn(C.windowedSignal), C.ampSpectrum = new Float32Array(X / 2);
          for (var re = 0; re < X / 2; re++) C.ampSpectrum[re] = Math.sqrt(Math.pow(C.complexSpectrum.real[re], 2) + Math.pow(C.complexSpectrum.imag[re], 2));
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
      cutoff: v = 2,
      smooth: y = 0.4,
      max: w = 15,
      scale: _ = 10,
      isDrawing: D = !1,
      parentEl: k = document.body
    }) {
      this.vol = 0, this.scale = _, this.max = w, this.cutoff = v, this.smooth = y, this.setBins(n), this.beat = {
        holdFrames: 20,
        threshold: 40,
        _cutoff: 0,
        // adaptive based on sound state
        decay: 0.98,
        _framesSinceBeat: 0
        // keeps track of frames
      }, this.onBeat = () => {
      }, this.canvas = document.createElement("canvas"), this.canvas.width = 100, this.canvas.height = 80, this.canvas.style.width = "100px", this.canvas.style.height = "80px", this.canvas.style.position = "absolute", this.canvas.style.right = "0px", this.canvas.style.bottom = "0px", k.appendChild(this.canvas), this.isDrawing = D, this.ctx = this.canvas.getContext("2d"), this.ctx.fillStyle = "#DFFFFF", this.ctx.strokeStyle = "#0ff", this.ctx.lineWidth = 0.5, window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia({ video: !1, audio: !0 }).then((ee) => {
        this.stream = ee, this.context = new AudioContext();
        let ue = this.context.createMediaStreamSource(ee);
        this.meyda = zc.createMeydaAnalyzer({
          audioContext: this.context,
          source: ue,
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
          const v = (w, _) => w + _;
          let y = Math.floor(n.loudness.specific.length / this.bins.length);
          this.prevBins = this.bins.slice(0), this.bins = this.bins.map((w, _) => n.loudness.specific.slice(_ * y, (_ + 1) * y).reduce(v)).map((w, _) => w * (1 - this.settings[_].smooth) + this.prevBins[_] * this.settings[_].smooth), this.fft = this.bins.map((w, _) => (
            // Math.max(0, (bin - this.cutoff) / (this.max - this.cutoff))
            Math.max(0, (w - this.settings[_].cutoff) / this.settings[_].scale)
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
        window["a" + y] = (w = 1, _ = 0) => () => a.fft[y] * w + _;
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
      this.bins.forEach((y, w) => {
        var _ = y * v;
        this.ctx.fillRect(w * n, this.canvas.height - _, n, _);
        var D = this.canvas.height - v * this.settings[w].cutoff;
        this.ctx.beginPath(), this.ctx.moveTo(w * n, D), this.ctx.lineTo((w + 1) * n, D), this.ctx.stroke();
        var k = this.canvas.height - v * (this.settings[w].scale + this.settings[w].cutoff);
        this.ctx.beginPath(), this.ctx.moveTo(w * n, k), this.ctx.lineTo((w + 1) * n, k), this.ctx.stroke();
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
      const n = new Blob(this.recordedBlobs, { type: this.mediaRecorder.mimeType }), v = window.URL.createObjectURL(n);
      this.output.src = v;
      const y = document.createElement("a");
      y.style.display = "none", y.href = v;
      let w = /* @__PURE__ */ new Date();
      y.download = `hydra-${w.getFullYear()}-${w.getMonth() + 1}-${w.getDate()}-${w.getHours()}.${w.getMinutes()}.${w.getSeconds()}.webm`, document.body.appendChild(y), y.click(), setTimeout(() => {
        document.body.removeChild(y), window.URL.revokeObjectURL(v);
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
  var Vc = (u, n, v, y, w) => (u - n) * (w - y) / (v - n) + y, Ma = (u, n) => (u % n + n) % n;
  const Zo = {
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
        let v = Math.min(...this), y = Math.max(...this);
        var w = this.map((_) => Vc(_, v, y, u, n));
        return w._speed = this._speed, w._smooth = this._smooth, w._ease = this._ease, w;
      };
    },
    getValue: (u = []) => ({ time: n, bpm: v }) => {
      let y = u._speed ? u._speed : 1, w = u._smooth ? u._smooth : 0, _ = n * y * (v / 60) + (u._offset || 0);
      if (w !== 0) {
        let D = u._ease ? u._ease : Ga.linear, k = _ - w / 2, ee = u[Math.floor(Ma(k, u.length))], ue = u[Math.floor(Ma(k + 1, u.length))], Ve = Math.min(Ma(k, 1) / w, 1);
        return D(Ve) * (ue - ee) + ee;
      } else
        return u[Math.floor(_ % u.length)], u[Math.floor(_ % u.length)];
    }
  }, Hc = (u) => {
    var n = "", v = w(n), y = (_, D) => {
      n += `
      var ${_} = ${D}
    `, v = w(n);
    };
    return {
      addToContext: y,
      eval: (_) => v.eval(_)
    };
    function w(_) {
      globalThis.eval(_);
      var D = function(k) {
        globalThis.eval(k);
      };
      return {
        eval: D
      };
    }
  };
  class Wc {
    constructor(n, v, y = []) {
      this.makeGlobal = v, this.sandbox = Hc(), this.parent = n;
      var w = Object.keys(n);
      w.forEach((_) => this.add(_)), this.userProps = y;
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
  }, ka = (u) => (u = u.toString(), u.indexOf(".") < 0 && (u += "."), u);
  function qc(u, n, v) {
    const y = u.transform.inputs, w = u.userArgs, { generators: _ } = u.synth, { src: D } = _;
    return y.map((k, ee) => {
      const ue = {
        value: k.default,
        type: k.type,
        //
        isUniform: !1,
        name: k.name,
        vecLen: 0
        //  generateGlsl: null // function for creating glsl
      };
      if (ue.type === "float" && (ue.value = ka(k.default)), k.type.startsWith("vec"))
        try {
          ue.vecLen = Number.parseInt(k.type.substr(3));
        } catch {
          console.log(`Error determining length of vector input type ${k.type} (${k.name})`);
        }
      if (w.length > ee) {
        if (ue.value = w[ee], ue.type === "vec4" && !(ue.value.type === "GlslSource" || ue.value.getTexture))
          throw new Error("Arguments must be a texture or GlslSource");
        typeof w[ee] == "function" ? (ue.value = (Le, He, We) => {
          try {
            const Je = w[ee](He);
            return typeof Je == "number" ? Je : (console.warn("function does not return a number", w[ee]), k.default);
          } catch (Je) {
            return console.warn("ERROR", Je), k.default;
          }
        }, ue.isUniform = !0) : w[ee].constructor === Array && (ue.value = (Le, He, We) => Zo.getValue(w[ee])(He), ue.isUniform = !0);
      }
      if (!(n < 0)) {
        if (ue.value && ue.value.transforms) {
          const Le = ue.value.transforms[ue.value.transforms.length - 1];
          if (Le.transform.glsl_return_type !== k.type) {
            const He = Yc[k.type];
            if (typeof He < "u") {
              const We = He[Le.transform.glsl_return_type];
              if (typeof We < "u") {
                const { name: Je, args: Pt } = We;
                ue.value = ue.value[Je](...Pt);
              }
            }
          }
          ue.isUniform = !1;
        } else if (ue.type === "float" && typeof ue.value == "number")
          ue.value = ka(ue.value);
        else if (ue.type.startsWith("vec") && typeof ue.value == "object" && Array.isArray(ue.value))
          ue.isUniform = !1, ue.value = `${ue.type}(${ue.value.map(ka).join(", ")})`;
        else if (k.type === "sampler2D") {
          var Ve = ue.value;
          ue.value = () => Ve.getTexture(), ue.isUniform = !0;
        } else if (ue.value.getTexture && k.type === "vec4") {
          var ve = ue.value;
          ue.value = D(ve), ue.isUniform = !1;
        }
        ue.isUniform && (ue.name += n);
      }
      return ue;
    });
  }
  function Kc(u) {
    var n = {
      uniforms: [],
      // list of uniforms used in shader
      glslFunctions: [],
      // list of functions used in shader
      fragColor: ""
    }, v = Jo(u, n)("c", "st");
    n.fragColor = v;
    let y = {};
    return n.uniforms.forEach((w) => y[w.name] = w), n.uniforms = Object.values(y), n;
  }
  function Ia(u, n) {
    return `${u}_i${n}`;
  }
  function Jo(u, n) {
    var v = (y, w) => "";
    return u.forEach((y, w) => {
      let _ = qc(y, n.uniforms.length);
      _.forEach((k) => {
        k.isUniform && n.uniforms.push(k);
      }), Qc(y, n.glslFunctions) || n.glslFunctions.push(y);
      var D = v;
      y.transform.type === "src" ? v = (k, ee) => `${Wr(_, n)(`${k}${w}`, ee)}
         vec4 ${k} = ${Yr(`${k}${w}`, ee, y.name, _)};` : y.transform.type === "color" ? v = (k, ee) => `${Wr(_, n)(`${k}${w}`, ee)}
         ${D(k, ee)}
         ${k} = ${Yr(`${k}${w}`, `${k}`, y.name, _)};` : y.transform.type === "coord" ? v = (k, ee) => `${Wr(_, n)(`${k}${w}`, ee)}
         ${ee} = ${Yr(`${k}${w}`, `${ee}`, y.name, _)};
         ${D(k, ee)}` : y.transform.type === "combine" ? v = (k, ee) => (
        // combining two generated shader strings (i.e. for blend, mult, add funtions)
        `${Wr(_, n)(`${k}${w}`, ee)}
         ${D(k, ee)}
         ${k} = ${Yr(`${k}${w}`, `${k}`, y.name, _)};`
      ) : y.transform.type === "combineCoord" && (v = (k, ee) => `${Wr(_, n)(`${k}${w}`, ee)}
         ${ee} = ${Yr(`${k}${w}`, `${ee}`, y.name, _)};
         ${D(k, ee)}`);
    }), v;
  }
  function Wr(u, n) {
    let v = (w, _) => "";
    var y = v;
    return u.forEach((w, _) => {
      w.value.transforms && (y = v, v = (D, k) => {
        let ee = Ia(D, _), ue = Ia(`${k}_${D}`, _);
        return `vec2 ${ue} = ${k};${y(D, k)}
         ${Jo(w.value.transforms, n)(ee, ue)}`;
      });
    }), v;
  }
  function Yr(u, n, v, y) {
    const w = y.map((_, D) => _.isUniform ? _.name : _.value && _.value.transforms ? Ia(u, D) : _.value).reduce((_, D) => `${_}, ${D}`, "");
    return `${v}(${n}${w})`;
  }
  function Qc(u, n) {
    for (var v = 0; v < n.length; v++)
      if (u.name == n[v].name) return !0;
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
      var v = this.glsl(n);
      this.synth.currentFunctions = [], n.render(v);
    } catch (y) {
      console.warn("shader could not compile", y);
    }
  };
  qr.prototype.glsl = function() {
    var u = [], n = [];
    return this.transforms.forEach((v) => {
      v.transform.type === "renderpass" ? console.warn("no support for renderpass") : n.push(v);
    }), n.length > 0 && u.push(this.compile(n)), u;
  };
  qr.prototype.compile = function(u) {
    var n = Kc(u, this.synth), v = {};
    n.uniforms.forEach((_) => {
      v[_.name] = _.value;
    });
    const y = el(n.glslFunctions);
    y.renames.forEach(({ shaderName: _, oldName: D, newName: k }) => {
      const ee = n.glslFunctions.find((ue) => ue.name === _);
      if (ee && ee.transform) {
        const ue = new RegExp(`\\b${D}\\b`, "g");
        ee.transform.glsl = ee.transform.glsl.replace(ue, k);
      }
    });
    var w = `#version 300 es
  precision ${this.defaultOutput.precision} float;
  ${Object.values(n.uniforms).map((_) => {
      let D = _.type;
      return _.type === "texture" && (D = "sampler2D"), `
      uniform ${D} ${_.name};`;
    }).join("")}
  uniform float time;
  uniform vec2 resolution;
  in vec2 uv;
  out vec4 fragColor;
  uniform sampler2D prevBuffer;

  ${Object.values(Zc).map((_) => `
            ${_.glsl}
          `).join("")}

  ${y.helpers}

  ${n.glslFunctions.map((_) => `
            ${_.transform.glsl}
          `).join("")}

  void main () {
    vec2 st = gl_FragCoord.xy/resolution.xy;

    ${n.fragColor}
    fragColor = c;
  }
  `;
    return {
      frag: w,
      uniforms: Object.assign({}, this.defaultUniforms, v)
    };
  };
  function Jc(u) {
    const n = [];
    if (!u || typeof u != "string") return n;
    const v = /^\s*(void|float|int|vec2|vec3|vec4|mat2|mat3|mat4|bool|sampler2D)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*\{/, y = /^\s*(const\s+)?(float|int|vec2|vec3|vec4|mat2|mat3|mat4|bool)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/, w = /^\s*#define\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+(.*)$/, _ = u.length;
    let D = 0;
    for (; D < _; ) {
      for (; D < _ && /\s/.test(u[D]); ) D++;
      if (D >= _) break;
      if (u.startsWith("//", D)) {
        let ve = u.indexOf(`
`, D);
        if (ve === -1) break;
        D = ve + 1;
        continue;
      }
      if (u.startsWith("/*", D)) {
        let ve = u.indexOf("*/", D);
        if (ve === -1) break;
        D = ve + 2;
        continue;
      }
      let k = D, ee = !1, ue = !1;
      for (; k < _; ) {
        const ve = u[k];
        if (ve === "{") {
          ee = !0;
          break;
        }
        if (ve === ";") {
          ue = !0;
          break;
        }
        if (ve === `
` && u[D] === "#")
          break;
        k++;
      }
      if (u.substring(D, k + 1).trim().startsWith("#define")) {
        let ve = u.indexOf(`
`, D);
        ve === -1 && (ve = _);
        const Le = u.substring(D, ve).trim(), He = w.exec(Le);
        He && n.push({
          type: "define",
          name: He[1],
          value: He[2].trim(),
          fullCode: Le
        }), D = ve + 1;
        continue;
      }
      if (ee) {
        const ve = u.substring(D, k + 1).trim(), Le = v.exec(ve);
        if (Le) {
          let He = 1, We = k + 1;
          for (; We < _ && He > 0; )
            u[We] === "{" ? He++ : u[We] === "}" && He--, We++;
          const Je = u.substring(D, We);
          n.push({
            type: "function",
            name: Le[2],
            signature: `${Le[1]} ${Le[2]}(${Le[3]})`,
            body: u.substring(k + 1, We - 1).trim(),
            fullCode: Je
          }), D = We;
          continue;
        }
      }
      if (ue) {
        const ve = u.substring(D, k + 1).trim(), Le = y.exec(ve);
        if (Le) {
          const He = ve.substring(ve.indexOf("=") + 1, ve.length - 1).trim();
          n.push({
            type: "var",
            isConst: !!Le[1],
            dataType: Le[2],
            name: Le[3],
            value: He,
            fullCode: ve
          }), D = k + 1;
          continue;
        }
      }
      D = k + 1;
    }
    return n;
  }
  function el(u) {
    const n = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Set(), y = [], w = [];
    return u.forEach((_) => {
      if (!_.transform.helpers) return;
      const D = _.name;
      Jc(_.transform.helpers).forEach((ee) => {
        const ue = n.get(ee.name);
        if (!ue)
          n.set(ee.name, ee), v.add(ee.name), w.push(ee.fullCode);
        else {
          let Ve = !1;
          if (ue.type === ee.type && (ee.type === "define" ? Ve = ue.value === ee.value : ee.type === "var" ? Ve = ue.value === ee.value && ue.dataType === ee.dataType : ee.type === "function" && (Ve = ue.signature === ee.signature && ue.body === ee.body)), Ve)
            return;
          {
            let ve = `${D}_${ee.name}`, Le = 1;
            for (; v.has(ve); )
              ve = `${D}_${ee.name}_${Le}`, Le++;
            let He = ee.fullCode;
            ee.type === "define" ? He = ee.fullCode.replace(
              new RegExp(`(#define\\s+)${ee.name}(\\s+)`),
              `$1${ve}$2`
            ) : ee.type === "var" ? He = ee.fullCode.replace(
              new RegExp(`\\b${ee.name}\\b(\\s*=)`),
              `${ve}$1`
            ) : ee.type === "function" && (He = ee.fullCode.replace(
              new RegExp(`\\b${ee.name}\\b`),
              ve
            )), n.set(ve, Object.assign({}, ee, { name: ve, fullCode: He })), v.add(ve), w.push(He), y.push({
              shaderName: D,
              oldName: ee.name,
              newName: ve
            });
          }
        }
      });
    }), {
      helpers: w.join(`

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
  function Wo(u) {
    if (!u || typeof u != "string")
      return u;
    let n = u;
    return n = n.replace(/\btexture2D\s*\(/g, "texture("), n = n.replace(/\btexture2DLod\s*\(/g, "textureLod("), n = n.replace(/\btexture2DProj\s*\(/g, "textureProj("), n = n.replace(/\btextureCube\s*\(/g, "texture("), n = n.replace(/\btextureCubeLod\s*\(/g, "textureLod("), n = n.replace(/\bshadow2D\s*\(/g, "texture("), n = n.replace(/\bshadow2DProj\s*\(/g, "textureProj("), n;
  }
  function Yo(u) {
    return !u || typeof u != "string" ? !1 : [
      /\btexture2D\s*\(/,
      /\btexture2DLod\s*\(/,
      /\btexture2DProj\s*\(/,
      /\btextureCube\s*\(/,
      /\btextureCubeLod\s*\(/,
      /\bshadow2D\s*\(/,
      /\bshadow2DProj\s*\(/
    ].some((v) => v.test(u));
  }
  class rl {
    constructor({
      defaultUniforms: n,
      defaultOutput: v,
      extendTransforms: y = [],
      changeListener: w = (() => {
      })
    } = {}) {
      this.defaultOutput = v, this.defaultUniforms = n, this.changeListener = w, this.extendTransforms = y, this.generators = {}, this.init();
    }
    init() {
      const n = tl();
      return this.glslTransforms = {}, this.generators = Object.entries(this.generators).reduce((v, [y, w]) => (this.changeListener({ type: "remove", synth: this, method: y }), v), {}), this.sourceClass = class extends qr {
      }, Array.isArray(this.extendTransforms) ? n.concat(this.extendTransforms) : typeof this.extendTransforms == "object" && this.extendTransforms.type && n.push(this.extendTransforms), n.map((v) => this.setFunction(v));
    }
    _addMethod(n, v) {
      const y = this;
      if (this.glslTransforms[n] = v, v.type === "src") {
        const w = (..._) => new this.sourceClass({
          name: n,
          transform: v,
          userArgs: _,
          defaultOutput: this.defaultOutput,
          defaultUniforms: this.defaultUniforms,
          synth: y
        });
        return this.generators[n] = w, this.changeListener({ type: "add", synth: this, method: n }), w;
      } else
        this.sourceClass.prototype[n] = function(...w) {
          return this.transforms.push({ name: n, transform: v, userArgs: w, synth: y }), this;
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
  function nl(u) {
    let n = qo[u.type];
    if (n) {
      let v = n.args.concat(u.inputs), y = v.map((k) => `${k.type} ${k.name}`).join(", "), w = u.glsl3 || u.glsl;
      !u.glsl3 && Yo(w) && (w = Wo(w));
      let _ = "";
      u.helpers && (_ = u.helpers, Yo(_) && (_ = Wo(_)));
      let D = `
  ${n.returnType} ${u.name}(${y}) {
      ${w}
  }
`;
      return u.inputs = v.slice(1), Object.assign({}, u, { glsl: D, helpers: _ });
    } else
      console.warn(`type ${u.type} not recognized`, u, qo);
  }
  var On = { exports: {} }, al = On.exports, Ko;
  function il() {
    return Ko || (Ko = 1, (function(u, n) {
      (function(v, y) {
        u.exports = y();
      })(al, (function() {
        var v = function(e) {
          return e instanceof Uint8Array || e instanceof Uint16Array || e instanceof Uint32Array || e instanceof Int8Array || e instanceof Int16Array || e instanceof Int32Array || e instanceof Float32Array || e instanceof Float64Array || e instanceof Uint8ClampedArray;
        }, y = function(e, r) {
          for (var l = Object.keys(r), G = 0; G < l.length; ++G)
            e[l[G]] = r[l[G]];
          return e;
        }, w = `
`;
        function _(e) {
          return typeof atob < "u" ? atob(e) : "base64:" + e;
        }
        function D(e) {
          var r = new Error("(regl) " + e);
          throw console.error(r), r;
        }
        function k(e, r) {
          e || D(r);
        }
        function ee(e) {
          return e ? ": " + e : "";
        }
        function ue(e, r, l) {
          e in r || D("unknown parameter (" + e + ")" + ee(l) + ". possible values: " + Object.keys(r).join());
        }
        function Ve(e, r) {
          v(e) || D(
            "invalid parameter type" + ee(r) + ". must be a typed array"
          );
        }
        function ve(e, r) {
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
        function Le(e, r, l) {
          ve(e, r) || D(
            "invalid parameter type" + ee(l) + ". expected " + r + ", got " + typeof e
          );
        }
        function He(e, r) {
          e >= 0 && (e | 0) === e || D("invalid parameter type, (" + e + ")" + ee(r) + ". must be a nonnegative integer");
        }
        function We(e, r, l) {
          r.indexOf(e) < 0 && D("invalid value" + ee(l) + ". must be one of: " + r);
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
            Je.indexOf(r) < 0 && D('invalid regl constructor argument "' + r + '". must be one of ' + Je);
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
`), G = 1, $ = 0, F = {
            unknown: new Ue(),
            0: new Ue()
          };
          F.unknown.name = F[0].name = r || gt(), F.unknown.lines.push(new at(0, ""));
          for (var I = 0; I < l.length; ++I) {
            var W = l[I], q = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(W);
            if (q)
              switch (q[1]) {
                case "line":
                  var J = /(\d+)(\s+\d+)?/.exec(q[2]);
                  J && (G = J[1] | 0, J[2] && ($ = J[2] | 0, $ in F || (F[$] = new Ue())));
                  break;
                case "define":
                  var K = /SHADER_NAME(_B64)?\s+(.*)$/.exec(q[2]);
                  K && (F[$].name = K[1] ? _(K[2]) : K[2]);
                  break;
              }
            F[$].lines.push(new at(G++, W));
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
              var $ = G.index[l.line];
              if ($) {
                $.errors.push(l), G.hasErrors = !0;
                return;
              }
            }
            e.unknown.hasErrors = !0, e.unknown.lines[0].errors.push(l);
          });
        }
        function Gn(e, r, l, G, $) {
          if (!e.getShaderParameter(r, e.COMPILE_STATUS)) {
            var F = e.getShaderInfoLog(r), I = G === e.FRAGMENT_SHADER ? "fragment" : "vertex";
            re(l, "string", I + " shader source must be a string", $);
            var W = It(l, $), q = Cn(F);
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
                  ae.errors.forEach(function(B) {
                    var Z = B.message, ce = /^\s*'(.*)'\s*:\s*(.*)$/.exec(Z);
                    if (ce) {
                      var j = ce[1];
                      Z = ce[2], j === "assign" && (j = "="), T = Math.max(ae.line.indexOf(j, T), 0);
                    } else
                      T = 0;
                    Y(pt("| ", 6)), Y(pt("^^^", T + 3) + w, "font-weight:bold"), Y(pt("| ", 6)), Y(Z + w, "font-weight:bold");
                  }), Y(pt("| ", 6) + w);
                } else
                  Y(pt(ae.number, 4) + "|  "), Y(ae.line + w, "color:red");
              }), typeof document < "u" && !window.chrome ? (se[0] = ne.join("%c"), console.log.apply(console, se)) : console.log(ne.join(""));
            }), k.raise("Error compiling " + I + " shader, " + W[0].name);
          }
        }
        function Tr(e, r, l, G, $) {
          if (!e.getProgramParameter(r, e.LINK_STATUS)) {
            var F = e.getProgramInfoLog(r), I = It(l, $), W = It(G, $), q = 'Error linking program with vertex shader, "' + W[0].name + '", and fragment shader "' + I[0].name + '"';
            typeof document < "u" ? console.log(
              "%c" + q + w + "%c" + F,
              "color:red;text-decoration:underline;font-weight:bold",
              "color:red"
            ) : console.log(q + w + F), k.raise(q);
          }
        }
        function Sr(e) {
          e._commandRef = gt();
        }
        function R(e, r, l, G) {
          Sr(e);
          function $(q) {
            return q ? G.id(q) : 0;
          }
          e._fragId = $(e.static.frag), e._vertId = $(e.static.vert);
          function F(q, J) {
            Object.keys(J).forEach(function(K) {
              q[G.id(K)] = !0;
            });
          }
          var I = e._uniformSet = {};
          F(I, r.static), F(I, r.dynamic);
          var W = e._attributeSet = {};
          F(W, l.static), F(W, l.dynamic), e._hasCount = "count" in e.static || "count" in e.dynamic || "elements" in e.static || "elements" in e.dynamic;
        }
        function b(e, r) {
          var l = fr();
          D(e + " in command " + (r || gt()) + (l === "unknown" ? "" : " called from " + l));
        }
        function X(e, r, l) {
          e || b(r, l || gt());
        }
        function C(e, r, l, G) {
          e in r || b(
            "unknown parameter (" + e + ")" + ee(l) + ". possible values: " + Object.keys(r).join(),
            G || gt()
          );
        }
        function re(e, r, l, G) {
          ve(e, r) || b(
            "invalid parameter type" + ee(l) + ". expected " + r + ", got " + typeof e,
            G || gt()
          );
        }
        function pe(e) {
          e();
        }
        function Ge(e, r, l) {
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
        var Be = 33071, Te = 9728, we = 9984, Pe = 9985, vt = 9986, De = 9987, Rt = 5120, wt = 5121, At = 5122, Lr = 5123, it = 5124, mt = 5125, yt = 5126, Ft = 32819, Na = 32820, Da = 33635, Pa = 34042, ts = 36193, Tt = {};
        Tt[Rt] = Tt[wt] = 1, Tt[At] = Tt[Lr] = Tt[ts] = Tt[Da] = Tt[Ft] = Tt[Na] = 2, Tt[it] = Tt[mt] = Tt[yt] = Tt[Pa] = 4;
        function $a(e, r) {
          return e === Na || e === Ft || e === Da ? 2 : e === Pa ? 4 : Tt[e] * r;
        }
        function Kr(e) {
          return !(e & e - 1) && !!e;
        }
        function rs(e, r, l) {
          var G, $ = r.width, F = r.height, I = r.channels;
          k(
            $ > 0 && $ <= l.maxTextureSize && F > 0 && F <= l.maxTextureSize,
            "invalid texture shape"
          ), (e.wrapS !== Be || e.wrapT !== Be) && k(
            Kr($) && Kr(F),
            "incompatible wrap mode for texture, both width and height must be power of 2"
          ), r.mipmask === 1 ? $ !== 1 && F !== 1 && k(
            e.minFilter !== we && e.minFilter !== vt && e.minFilter !== Pe && e.minFilter !== De,
            "min filter requires mipmap"
          ) : (k(
            Kr($) && Kr(F),
            "texture must be a square power of 2 to support mipmapping"
          ), k(
            r.mipmask === ($ << 1) - 1,
            "missing or incomplete mipmap data"
          )), r.type === yt && (l.extensions.indexOf("oes_texture_float_linear") < 0 && k(
            e.minFilter === Te && e.magFilter === Te,
            "filter not supported, must enable oes_texture_float_linear"
          ), k(
            !e.genMipmaps,
            "mipmap generation not supported with float textures"
          ));
          var W = r.images;
          for (G = 0; G < 16; ++G)
            if (W[G]) {
              var q = $ >> G, J = F >> G;
              k(r.mipmask & 1 << G, "missing mipmap data");
              var K = W[G];
              if (k(
                K.width === q && K.height === J,
                "invalid shape for mip images"
              ), k(
                K.format === r.format && K.internalformat === r.internalformat && K.type === r.type,
                "incompatible type for mip image"
              ), !K.compressed) if (K.data) {
                var ne = Math.ceil($a(K.type, I) * q / K.unpackAlignment) * K.unpackAlignment;
                k(
                  K.data.byteLength === ne * J,
                  "invalid data for image, buffer size is inconsistent with image format"
                );
              } else K.element || K.copy;
            } else e.genMipmaps || k((r.mipmask & 1 << G) === 0, "extra mipmap data");
          r.compressed && k(
            !e.genMipmaps,
            "mipmap generation for compressed images not supported"
          );
        }
        function ns(e, r, l, G) {
          var $ = e.width, F = e.height, I = e.channels;
          k(
            $ > 0 && $ <= G.maxTextureSize && F > 0 && F <= G.maxTextureSize,
            "invalid texture shape"
          ), k(
            $ === F,
            "cube map must be square"
          ), k(
            r.wrapS === Be && r.wrapT === Be,
            "wrap mode not supported by cube map"
          );
          for (var W = 0; W < l.length; ++W) {
            var q = l[W];
            k(
              q.width === $ && q.height === F,
              "inconsistent cube map face shape"
            ), r.genMipmaps && (k(
              !q.compressed,
              "can not generate mipmap for compressed textures"
            ), k(
              q.mipmask === 1,
              "can not specify mipmaps and generate mipmaps"
            ));
            for (var J = q.images, K = 0; K < 16; ++K) {
              var ne = J[K];
              if (ne) {
                var se = $ >> K, Y = F >> K;
                k(q.mipmask & 1 << K, "missing mipmap data"), k(
                  ne.width === se && ne.height === Y,
                  "invalid shape for mip images"
                ), k(
                  ne.format === e.format && ne.internalformat === e.internalformat && ne.type === e.type,
                  "incompatible type for mip image"
                ), ne.compressed || (ne.data ? k(
                  ne.data.byteLength === se * Y * Math.max($a(ne.type, I), ne.unpackAlignment),
                  "invalid data for image, buffer size is inconsistent with image format"
                ) : ne.element || ne.copy);
              }
            }
          }
        }
        var f = y(k, {
          optional: pe,
          raise: D,
          commandRaise: b,
          command: X,
          parameter: ue,
          commandParameter: C,
          constructor: Pt,
          type: Le,
          commandType: re,
          isTypedArray: Ve,
          nni: He,
          oneOf: We,
          shaderError: Gn,
          linkError: Tr,
          callSite: fr,
          saveCommandRef: Sr,
          saveDrawInfo: R,
          framebufferFormat: Ge,
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
          var $ = e.split(".");
          if ($.length === 1)
            return ['"' + Ua(e) + '"'];
          for (var F = [], I = 0; I < $.length; ++I)
            F = F.concat(Rr($[I]));
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
          function $() {
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
            setTimeout($);
          }), F.observe(e)) : window.addEventListener("resize", $, !1);
          function I() {
            F ? F.disconnect() : window.removeEventListener("resize", $), e.removeChild(G);
          }
          return $(), {
            canvas: G,
            onDestroy: I
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
          var r = e || {}, l, G, $, F, I = {}, W = [], q = [], J = typeof window > "u" ? 1 : window.devicePixelRatio, K = !1, ne = function(ae) {
            ae && f.raise(ae);
          }, se = function() {
          };
          if (typeof r == "string" ? (f(
            typeof document < "u",
            "selector queries only supported in DOM enviroments"
          ), l = document.querySelector(r), f(l, "invalid query string for element")) : typeof r == "object" ? hs(r) ? l = r : ms(r) ? (F = r, $ = F.canvas) : (f.constructor(r), "gl" in r ? F = r.gl : "canvas" in r ? $ = Ha(r.canvas) : "container" in r && (G = Ha(r.container)), "attributes" in r && (I = r.attributes, f.type(I, "object", "invalid context attributes")), "extensions" in r && (W = Va(r.extensions)), "optionalExtensions" in r && (q = Va(r.optionalExtensions)), "onDone" in r && (f.type(
            r.onDone,
            "function",
            "invalid or missing onDone callback"
          ), ne = r.onDone), "profile" in r && (K = !!r.profile), "pixelRatio" in r && (J = +r.pixelRatio, f(J > 0, "invalid pixel ratio"))) : f.raise("invalid arguments to regl"), l && (l.nodeName.toLowerCase() === "canvas" ? $ = l : G = l), !F) {
            if (!$) {
              f(
                typeof document < "u",
                "must manually specify webgl context outside of DOM environments"
              );
              var Y = ls(G || document.body, ne, J);
              if (!Y)
                return null;
              $ = Y.canvas, se = Y.onDestroy;
            }
            I.premultipliedAlpha === void 0 && (I.premultipliedAlpha = !0), F = ds($, I);
          }
          return F ? {
            gl: F,
            canvas: $,
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
          function G(I) {
            f.type(I, "string", "extension name must be string");
            var W = I.toLowerCase(), q;
            try {
              q = l[W] = e.getExtension(W);
            } catch {
            }
            return !!q;
          }
          for (var $ = 0; $ < r.extensions.length; ++$) {
            var F = r.extensions[$];
            if (!G(F))
              return r.onDestroy(), r.onDone('"' + F + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser'), null;
          }
          return r.optionalExtensions.forEach(G), {
            extensions: l,
            restore: function() {
              Object.keys(l).forEach(function(I) {
                if (l[I] && !G(I))
                  throw new Error("(regl): error restoring extension " + I);
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
            var I = As(F), W = e[Wa(I) >> 2];
            return W.length > 0 ? W.pop() : new ArrayBuffer(I);
          }
          function l(F) {
            e[Wa(F.byteLength) >> 2].push(F);
          }
          function G(F, I) {
            var W = null;
            switch (F) {
              case ys:
                W = new Int8Array(r(I), 0, I);
                break;
              case _s:
                W = new Uint8Array(r(I), 0, I);
                break;
              case bs:
                W = new Int16Array(r(2 * I), 0, I);
                break;
              case gs:
                W = new Uint16Array(r(2 * I), 0, I);
                break;
              case Es:
                W = new Int32Array(r(4 * I), 0, I);
                break;
              case xs:
                W = new Uint32Array(r(4 * I), 0, I);
                break;
              case ws:
                W = new Float32Array(r(4 * I), 0, I);
                break;
              default:
                return null;
            }
            return W.length !== I ? W.subarray(0, I) : W;
          }
          function $(F) {
            l(F.buffer);
          }
          return {
            alloc: r,
            free: l,
            allocType: G,
            freeType: $
          };
        }
        var et = Ya();
        et.zero = Ya();
        var Ts = 3408, Ss = 3410, Ls = 3411, Rs = 3412, Os = 3413, Cs = 3414, Fs = 3415, Gs = 33901, Ms = 33902, ks = 3379, Is = 3386, Bs = 34921, Ns = 36347, Ds = 36348, Ps = 35661, $s = 35660, Us = 34930, zs = 36349, js = 34076, Xs = 34024, Vs = 7936, Hs = 7937, Ws = 7938, Ys = 35724, qs = 34047, Ks = 36063, Qs = 34852, Qr = 3553, qa = 34067, Zs = 34069, Js = 33984, Or = 6408, kn = 5126, Ka = 5121, In = 36160, ef = 36053, tf = 36064, rf = 16384, nf = function(e, r) {
          var l = 1;
          r.ext_texture_filter_anisotropic && (l = e.getParameter(qs));
          var G = 1, $ = 1;
          r.webgl_draw_buffers && (G = e.getParameter(Qs), $ = e.getParameter(Ks));
          var F = !!r.oes_texture_float;
          if (F) {
            var I = e.createTexture();
            e.bindTexture(Qr, I), e.texImage2D(Qr, 0, Or, 1, 1, 0, Or, kn, null);
            var W = e.createFramebuffer();
            if (e.bindFramebuffer(In, W), e.framebufferTexture2D(In, tf, Qr, I, 0), e.bindTexture(Qr, null), e.checkFramebufferStatus(In) !== ef) F = !1;
            else {
              e.viewport(0, 0, 1, 1), e.clearColor(1, 0, 0, 1), e.clear(rf);
              var q = et.allocType(kn, 4);
              e.readPixels(0, 0, 1, 1, Or, kn, q), e.getError() ? F = !1 : (e.deleteFramebuffer(W), e.deleteTexture(I), F = q[0] === 1), et.freeType(q);
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
            maxColorAttachments: $,
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
          for (var $ = 0, F = 0; F < r; ++F)
            for (var I = e[F], W = 0; W < l; ++W)
              G[$++] = I[W];
        }
        function Qa(e, r, l, G, $, F) {
          for (var I = F, W = 0; W < r; ++W)
            for (var q = e[W], J = 0; J < l; ++J)
              for (var K = q[J], ne = 0; ne < G; ++ne)
                $[I++] = K[ne];
        }
        function Za(e, r, l, G, $) {
          for (var F = 1, I = l + 1; I < r.length; ++I)
            F *= r[I];
          var W = r[l];
          if (r.length - l === 4) {
            var q = r[l + 1], J = r[l + 2], K = r[l + 3];
            for (I = 0; I < W; ++I)
              Qa(e[I], q, J, K, G, $), $ += F;
          } else
            for (I = 0; I < W; ++I)
              Za(e[I], r, l + 1, G, $), $ += F;
        }
        function sf(e, r, l, G) {
          var $ = 1;
          if (r.length)
            for (var F = 0; F < r.length; ++F)
              $ *= r[F];
          else
            $ = 0;
          var I = G || et.allocType(l, $);
          switch (r.length) {
            case 0:
              break;
            case 1:
              af(e, r[0], I);
              break;
            case 2:
              of(e, r[0], r[1], I);
              break;
            case 3:
              Qa(e, r[0], r[1], r[2], I, 0);
              break;
            default:
              Za(e, r, 0, I, 0);
          }
          return I;
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
        function ri(e, r, l, G, $, F, I) {
          for (var W = 0, q = 0; q < l; ++q)
            for (var J = 0; J < G; ++J)
              e[W++] = r[$ * q + F * J + I];
        }
        function gf(e, r, l, G) {
          var $ = 0, F = {};
          function I(T) {
            this.id = $++, this.buffer = e.createBuffer(), this.type = T, this.usage = ei, this.byteLength = 0, this.dimension = 1, this.dtype = Dn, this.persistentData = null, l.profile && (this.stats = { size: 0 });
          }
          I.prototype.bind = function() {
            e.bindBuffer(this.type, this.buffer);
          }, I.prototype.destroy = function() {
            se(this);
          };
          var W = [];
          function q(T, B) {
            var Z = W.pop();
            return Z || (Z = new I(T)), Z.bind(), ne(Z, B, bf, 0, 1, !1), Z;
          }
          function J(T) {
            W.push(T);
          }
          function K(T, B, Z) {
            T.byteLength = B.byteLength, e.bufferData(T.type, B, Z);
          }
          function ne(T, B, Z, ce, j, le) {
            var H;
            if (T.usage = Z, Array.isArray(B)) {
              if (T.dtype = ce || Pn, B.length > 0) {
                var ie;
                if (Array.isArray(B[0])) {
                  H = Ja(B);
                  for (var V = 1, oe = 1; oe < H.length; ++oe)
                    V *= H[oe];
                  T.dimension = V, ie = Nn(B, H, T.dtype), K(T, ie, Z), le ? T.persistentData = ie : et.freeType(ie);
                } else if (typeof B[0] == "number") {
                  T.dimension = j;
                  var _e = et.allocType(T.dtype, B.length);
                  ti(_e, B), K(T, _e, Z), le ? T.persistentData = _e : et.freeType(_e);
                } else v(B[0]) ? (T.dimension = B[0].length, T.dtype = ce || en(B[0]) || Pn, ie = Nn(
                  B,
                  [B.length, B[0].length],
                  T.dtype
                ), K(T, ie, Z), le ? T.persistentData = ie : et.freeType(ie)) : f.raise("invalid buffer data");
              }
            } else if (v(B))
              T.dtype = ce || en(B), T.dimension = j, K(T, B, Z), le && (T.persistentData = new Uint8Array(new Uint8Array(B.buffer)));
            else if (Gt(B)) {
              H = B.shape;
              var xe = B.stride, fe = B.offset, te = 0, z = 0, Ee = 0, Re = 0;
              H.length === 1 ? (te = H[0], z = 1, Ee = xe[0], Re = 0) : H.length === 2 ? (te = H[0], z = H[1], Ee = xe[0], Re = xe[1]) : f.raise("invalid shape"), T.dtype = ce || en(B.data) || Pn, T.dimension = z;
              var he = et.allocType(T.dtype, te * z);
              ri(
                he,
                B.data,
                te,
                z,
                Ee,
                Re,
                fe
              ), K(T, he, Z), le ? T.persistentData = he : et.freeType(he);
            } else B instanceof ArrayBuffer ? (T.dtype = Dn, T.dimension = j, K(T, B, Z), le && (T.persistentData = new Uint8Array(new Uint8Array(B)))) : f.raise("invalid buffer data");
          }
          function se(T) {
            r.bufferCount--, G(T);
            var B = T.buffer;
            f(B, "buffer must not be deleted already"), e.deleteBuffer(B), T.buffer = null, delete F[T.id];
          }
          function Y(T, B, Z, ce) {
            r.bufferCount++;
            var j = new I(B);
            F[j.id] = j;
            function le(V) {
              var oe = ei, _e = null, xe = 0, fe = 0, te = 1;
              return Array.isArray(V) || v(V) || Gt(V) || V instanceof ArrayBuffer ? _e = V : typeof V == "number" ? xe = V | 0 : V && (f.type(
                V,
                "object",
                "buffer arguments must be an object, a number or an array"
              ), "data" in V && (f(
                _e === null || Array.isArray(_e) || v(_e) || Gt(_e),
                "invalid data for buffer"
              ), _e = V.data), "usage" in V && (f.parameter(V.usage, Jr, "invalid buffer usage"), oe = Jr[V.usage]), "type" in V && (f.parameter(V.type, Kt, "invalid buffer type"), fe = Kt[V.type]), "dimension" in V && (f.type(V.dimension, "number", "invalid dimension"), te = V.dimension | 0), "length" in V && (f.nni(xe, "buffer length must be a nonnegative integer"), xe = V.length | 0)), j.bind(), _e ? ne(j, _e, oe, fe, te, ce) : (xe && e.bufferData(j.type, xe, oe), j.dtype = fe || Dn, j.usage = oe, j.dimension = te, j.byteLength = xe), l.profile && (j.stats.size = j.byteLength * jt[j.dtype]), le;
            }
            function H(V, oe) {
              f(
                oe + V.byteLength <= j.byteLength,
                "invalid buffer subdata call, buffer is too small.  Can't write data of size " + V.byteLength + " starting from offset " + oe + " to a buffer of size " + j.byteLength
              ), e.bufferSubData(j.type, oe, V);
            }
            function ie(V, oe) {
              var _e = (oe || 0) | 0, xe;
              if (j.bind(), v(V) || V instanceof ArrayBuffer)
                H(V, _e);
              else if (Array.isArray(V)) {
                if (V.length > 0)
                  if (typeof V[0] == "number") {
                    var fe = et.allocType(j.dtype, V.length);
                    ti(fe, V), H(fe, _e), et.freeType(fe);
                  } else if (Array.isArray(V[0]) || v(V[0])) {
                    xe = Ja(V);
                    var te = Nn(V, xe, j.dtype);
                    H(te, _e), et.freeType(te);
                  } else
                    f.raise("invalid buffer data");
              } else if (Gt(V)) {
                xe = V.shape;
                var z = V.stride, Ee = 0, Re = 0, he = 0, Me = 0;
                xe.length === 1 ? (Ee = xe[0], Re = 1, he = z[0], Me = 0) : xe.length === 2 ? (Ee = xe[0], Re = xe[1], he = z[0], Me = z[1]) : f.raise("invalid shape");
                var Ae = Array.isArray(V.data) ? j.dtype : en(V.data), Fe = et.allocType(Ae, Ee * Re);
                ri(
                  Fe,
                  V.data,
                  Ee,
                  Re,
                  he,
                  Me,
                  V.offset
                ), H(Fe, _e), et.freeType(Fe);
              } else
                f.raise("invalid data for buffer subdata");
              return le;
            }
            return Z || le(T), le._reglType = "buffer", le._buffer = j, le.subdata = ie, l.profile && (le.stats = j.stats), le.destroy = function() {
              se(j);
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
            return Object.keys(F).forEach(function(B) {
              T += F[B].stats.size;
            }), T;
          }), {
            create: Y,
            createStream: q,
            destroyStream: J,
            clear: function() {
              Lt(F).forEach(se), W.forEach(se);
            },
            getBuffer: function(T) {
              return T && T._buffer instanceof I ? T._buffer : null;
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
          var $ = {}, F = 0, I = {
            uint8: cr,
            uint16: lr
          };
          r.oes_element_index_uint && (I.uint32 = Qt);
          function W(ae) {
            this.id = F++, $[this.id] = this, this.buffer = ae, this.primType = Cr, this.vertCount = 0, this.type = 0;
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
          function ne(ae, T, B, Z, ce, j, le) {
            ae.buffer.bind();
            var H;
            if (T) {
              var ie = le;
              !le && (!v(T) || Gt(T) && !v(T.data)) && (ie = r.oes_element_index_uint ? Qt : lr), l._initBuffer(
                ae.buffer,
                T,
                B,
                ie,
                3
              );
            } else
              e.bufferData($n, j, B), ae.buffer.dtype = H || cr, ae.buffer.usage = B, ae.buffer.dimension = 3, ae.buffer.byteLength = j;
            if (H = le, !le) {
              switch (ae.buffer.dtype) {
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
              ae.buffer.dtype = H;
            }
            ae.type = H, f(
              H !== Qt || !!r.oes_element_index_uint,
              "32 bit element buffers not supported, enable oes_element_index_uint first"
            );
            var V = ce;
            V < 0 && (V = ae.buffer.byteLength, H === lr ? V >>= 1 : H === Qt && (V >>= 2)), ae.vertCount = V;
            var oe = Z;
            if (Z < 0) {
              oe = Cr;
              var _e = ae.buffer.dimension;
              _e === 1 && (oe = Lf), _e === 2 && (oe = Rf), _e === 3 && (oe = Cr);
            }
            ae.primType = oe;
          }
          function se(ae) {
            G.elementsCount--, f(ae.buffer !== null, "must not double destroy elements"), delete $[ae.id], ae.buffer.destroy(), ae.buffer = null;
          }
          function Y(ae, T) {
            var B = l.create(null, $n, !0), Z = new W(B._buffer);
            G.elementsCount++;
            function ce(j) {
              if (!j)
                B(), Z.primType = Cr, Z.vertCount = 0, Z.type = cr;
              else if (typeof j == "number")
                B(j), Z.primType = Cr, Z.vertCount = j | 0, Z.type = cr;
              else {
                var le = null, H = Ff, ie = -1, V = -1, oe = 0, _e = 0;
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
                ), ie = ur[j.primitive]), "count" in j && (f(
                  typeof j.count == "number" && j.count >= 0,
                  "invalid vertex count for elements"
                ), V = j.count | 0), "type" in j && (f.parameter(
                  j.type,
                  I,
                  "invalid buffer type"
                ), _e = I[j.type]), "length" in j ? oe = j.length | 0 : (oe = V, _e === lr || _e === ni ? oe *= 2 : (_e === Qt || _e === ai) && (oe *= 4))), ne(
                  Z,
                  le,
                  H,
                  ie,
                  V,
                  oe,
                  _e
                );
              }
              return ce;
            }
            return ce(ae), ce._reglType = "elements", ce._elements = Z, ce.subdata = function(j, le) {
              return B.subdata(j, le), ce;
            }, ce.destroy = function() {
              se(Z);
            }, ce;
          }
          return {
            create: Y,
            createStream: J,
            destroyStream: K,
            getElements: function(ae) {
              return typeof ae == "function" && ae._elements instanceof W ? ae._elements : null;
            },
            clear: function() {
              Lt($).forEach(se);
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
              var G = Mf[0], $ = G >>> 31 << 15, F = (G << 1 >>> 24) - 127, I = G >> 13 & 1023;
              if (F < -24)
                r[l] = $;
              else if (F < -14) {
                var W = -14 - F;
                r[l] = $ + (I + 1024 >> W);
              } else F > 15 ? r[l] = $ + 31744 : r[l] = $ + (F + 15 << 10) + I;
            }
          return r;
        }
        function Ke(e) {
          return Array.isArray(e) || v(e);
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
        function fu(e, r, l, G, $, F) {
          for (var I = e.width, W = e.height, q = e.channels, J = I * W * q, K = Gi(e, J), ne = 0, se = 0; se < W; ++se)
            for (var Y = 0; Y < I; ++Y)
              for (var ae = 0; ae < q; ++ae)
                K[ne++] = r[l * Y + G * se + $ * ae + F];
          Mi(e, K);
        }
        function fn(e, r, l, G, $, F) {
          var I;
          if (typeof lt[e] < "u" ? I = lt[e] : I = Ot[e] * pr[r], F && (I *= 6), $) {
            for (var W = 0, q = l; q >= 1; )
              W += I * q * q, q /= 2;
            return W;
          } else
            return I * l * G;
        }
        function uu(e, r, l, G, $, F, I) {
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
          r.ext_srgb && (Y.srgb = Vn, Y.srgba = Hn), r.oes_texture_float && (se.float32 = se.float = Gr), r.oes_texture_half_float && (se.float16 = se["half float"] = dr), r.webgl_depth_texture && (y(Y, {
            depth: Xn,
            "depth stencil": an
          }), y(se, {
            uint16: Qn,
            uint32: Zn,
            "depth stencil": Pf
          })), r.webgl_compressed_texture_s3tc && y(ae, {
            "rgb s3tc dxt1": Wn,
            "rgba s3tc dxt1": Yn,
            "rgba s3tc dxt3": qn,
            "rgba s3tc dxt5": Kn
          }), r.webgl_compressed_texture_atc && y(ae, {
            "rgb atc": ci,
            "rgba atc explicit alpha": li,
            "rgba atc interpolated alpha": di
          }), r.webgl_compressed_texture_pvrtc && y(ae, {
            "rgb pvrtc 4bppv1": hi,
            "rgb pvrtc 2bppv1": mi,
            "rgba pvrtc 4bppv1": pi,
            "rgba pvrtc 2bppv1": vi
          }), r.webgl_compressed_texture_etc1 && (ae["rgb etc1"] = yi);
          var T = Array.prototype.slice.call(
            e.getParameter(If)
          );
          Object.keys(ae).forEach(function(c) {
            var M = ae[c];
            T.indexOf(M) >= 0 && (Y[c] = M);
          });
          var B = Object.keys(Y);
          l.textureFormats = B;
          var Z = [];
          Object.keys(Y).forEach(function(c) {
            var M = Y[c];
            Z[M] = c;
          });
          var ce = [];
          Object.keys(se).forEach(function(c) {
            var M = se[c];
            ce[M] = c;
          });
          var j = [];
          Object.keys(J).forEach(function(c) {
            var M = J[c];
            j[M] = c;
          });
          var le = [];
          Object.keys(K).forEach(function(c) {
            var M = K[c];
            le[M] = c;
          });
          var H = [];
          Object.keys(q).forEach(function(c) {
            var M = q[c];
            H[M] = c;
          });
          var ie = B.reduce(function(c, M) {
            var O = Y[M];
            return O === Fr || O === zn || O === Fr || O === nn || O === Xn || O === an || r.ext_srgb && (O === Vn || O === Hn) ? c[O] = O : O === jn || M.indexOf("rgba") >= 0 ? c[O] = Zt : c[O] = rn, c;
          }, {});
          function V() {
            this.internalformat = Zt, this.format = Zt, this.type = hr, this.compressed = !1, this.premultiplyAlpha = !1, this.flipY = !1, this.unpackAlignment = 1, this.colorSpace = gi, this.width = 0, this.height = 0, this.channels = 0;
          }
          function oe(c, M) {
            c.internalformat = M.internalformat, c.format = M.format, c.type = M.type, c.compressed = M.compressed, c.premultiplyAlpha = M.premultiplyAlpha, c.flipY = M.flipY, c.unpackAlignment = M.unpackAlignment, c.colorSpace = M.colorSpace, c.width = M.width, c.height = M.height, c.channels = M.channels;
          }
          function _e(c, M) {
            if (!(typeof M != "object" || !M)) {
              if ("premultiplyAlpha" in M && (f.type(
                M.premultiplyAlpha,
                "boolean",
                "invalid premultiplyAlpha"
              ), c.premultiplyAlpha = M.premultiplyAlpha), "flipY" in M && (f.type(
                M.flipY,
                "boolean",
                "invalid texture flip"
              ), c.flipY = M.flipY), "alignment" in M && (f.oneOf(
                M.alignment,
                [1, 2, 4, 8],
                "invalid texture unpack alignment"
              ), c.unpackAlignment = M.alignment), "colorSpace" in M && (f.parameter(
                M.colorSpace,
                ne,
                "invalid colorSpace"
              ), c.colorSpace = ne[M.colorSpace]), "type" in M) {
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
                ), c.type = se[O];
              }
              var de = c.width, ke = c.height, o = c.channels, t = !1;
              "shape" in M ? (f(
                Array.isArray(M.shape) && M.shape.length >= 2,
                "shape must be an array"
              ), de = M.shape[0], ke = M.shape[1], M.shape.length === 3 && (o = M.shape[2], f(o > 0 && o <= 4, "invalid number of channels"), t = !0), f(de >= 0 && de <= l.maxTextureSize, "invalid width"), f(ke >= 0 && ke <= l.maxTextureSize, "invalid height")) : ("radius" in M && (de = ke = M.radius, f(de >= 0 && de <= l.maxTextureSize, "invalid radius")), "width" in M && (de = M.width, f(de >= 0 && de <= l.maxTextureSize, "invalid width")), "height" in M && (ke = M.height, f(ke >= 0 && ke <= l.maxTextureSize, "invalid height")), "channels" in M && (o = M.channels, f(o > 0 && o <= 4, "invalid number of channels"), t = !0)), c.width = de | 0, c.height = ke | 0, c.channels = o | 0;
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
                var S = c.internalformat = Y[A];
                c.format = ie[S], A in se && ("type" in M || (c.type = se[A])), A in ae && (c.compressed = !0), h = !0;
              }
              !t && h ? c.channels = Ot[c.format] : t && !h ? c.channels !== sn[c.format] && (c.format = c.internalformat = sn[c.channels]) : h && t && f(
                c.channels === Ot[c.format],
                "number of channels inconsistent with specified format"
              );
            }
          }
          function xe(c) {
            e.pixelStorei(Zf, c.flipY), e.pixelStorei(Jf, c.premultiplyAlpha), e.pixelStorei(eu, c.colorSpace), e.pixelStorei(Qf, c.unpackAlignment);
          }
          function fe() {
            V.call(this), this.xOffset = 0, this.yOffset = 0, this.data = null, this.needsFree = !1, this.element = null, this.needsCopy = !1;
          }
          function te(c, M) {
            var O = null;
            if (na(M) ? O = M : M && (f.type(M, "object", "invalid pixel data type"), _e(c, M), "x" in M && (c.xOffset = M.x | 0), "y" in M && (c.yOffset = M.y | 0), na(M.data) && (O = M.data)), f(
              !c.compressed || O instanceof Uint8Array,
              "compressed texture data must be stored in a uint8array"
            ), M.copy) {
              f(!O, "can not specify copy and data field for the same texture");
              var de = $.viewportWidth, ke = $.viewportHeight;
              c.width = c.width || de - c.xOffset, c.height = c.height || ke - c.yOffset, c.needsCopy = !0, f(
                c.xOffset >= 0 && c.xOffset < de && c.yOffset >= 0 && c.yOffset < ke && c.width > 0 && c.width <= de && c.height > 0 && c.height <= ke,
                "copy texture read out of bounds"
              );
            } else if (!O)
              c.width = c.width || 1, c.height = c.height || 1, c.channels = c.channels || 4;
            else if (v(O))
              c.channels = c.channels || 4, c.data = O, !("type" in M) && c.type === hr && (c.type = Fi(O));
            else if (Li(O))
              c.channels = c.channels || 4, su(c, O), c.alignment = 1, c.needsFree = !0;
            else if (Gt(O)) {
              var o = O.data;
              !Array.isArray(o) && c.type === hr && (c.type = Fi(o));
              var t = O.shape, h = O.stride, A, S, p, m, g, s;
              t.length === 3 ? (p = t[2], s = h[2]) : (f(t.length === 2, "invalid ndarray pixel data, must be 2 or 3D"), p = 1, s = 1), A = t[0], S = t[1], m = h[0], g = h[1], c.alignment = 1, c.width = A, c.height = S, c.channels = p, c.format = c.internalformat = sn[p], c.needsFree = !0, fu(c, o, m, g, s, O.offset);
            } else if (Oi(O) || Ci(O) || nu(O))
              Oi(O) || Ci(O) ? c.element = O : c.element = O.canvas, c.width = c.element.width, c.height = c.element.height, c.channels = 4;
            else if (au(O))
              c.element = O, c.width = O.width, c.height = O.height, c.channels = 4;
            else if (iu(O))
              c.element = O, c.width = O.naturalWidth, c.height = O.naturalHeight, c.channels = 4;
            else if (ou(O))
              c.element = O, c.width = O.videoWidth, c.height = O.videoHeight, c.channels = 4;
            else if (Ri(O)) {
              var d = c.width || O[0].length, i = c.height || O.length, E = c.channels;
              Ke(O[0][0]) ? E = E || O[0][0].length : E = E || 1;
              for (var L = Zr.shape(O), P = 1, U = 0; U < L.length; ++U)
                P *= L[U];
              var N = Gi(c, P);
              Zr.flatten(O, L, "", N), Mi(c, N), c.alignment = 1, c.width = d, c.height = i, c.channels = E, c.format = c.internalformat = sn[E], c.needsFree = !0;
            }
            c.type === Gr ? f(
              l.extensions.indexOf("oes_texture_float") >= 0,
              "oes_texture_float extension not enabled"
            ) : c.type === dr && f(
              l.extensions.indexOf("oes_texture_half_float") >= 0,
              "oes_texture_half_float extension not enabled"
            );
          }
          function z(c, M, O) {
            var de = c.element, ke = c.data, o = c.internalformat, t = c.format, h = c.type, A = c.width, S = c.height;
            xe(c), de ? e.texImage2D(M, O, t, t, h, de) : c.compressed ? e.compressedTexImage2D(M, O, o, A, S, 0, ke) : c.needsCopy ? (G(), e.copyTexImage2D(
              M,
              O,
              t,
              c.xOffset,
              c.yOffset,
              A,
              S,
              0
            )) : e.texImage2D(M, O, t, A, S, 0, t, h, ke || null);
          }
          function Ee(c, M, O, de, ke) {
            var o = c.element, t = c.data, h = c.internalformat, A = c.format, S = c.type, p = c.width, m = c.height;
            xe(c), o ? e.texSubImage2D(
              M,
              ke,
              O,
              de,
              A,
              S,
              o
            ) : c.compressed ? e.compressedTexSubImage2D(
              M,
              ke,
              O,
              de,
              h,
              p,
              m,
              t
            ) : c.needsCopy ? (G(), e.copyTexSubImage2D(
              M,
              ke,
              O,
              de,
              c.xOffset,
              c.yOffset,
              p,
              m
            )) : e.texSubImage2D(
              M,
              ke,
              O,
              de,
              p,
              m,
              A,
              S,
              t
            );
          }
          var Re = [];
          function he() {
            return Re.pop() || new fe();
          }
          function Me(c) {
            c.needsFree && et.freeType(c.data), fe.call(c), Re.push(c);
          }
          function Ae() {
            V.call(this), this.genMipmaps = !1, this.mipmapHint = on, this.mipmask = 0, this.images = Array(16);
          }
          function Fe(c, M, O) {
            var de = c.images[0] = he();
            c.mipmask = 1, de.width = c.width = M, de.height = c.height = O, de.channels = c.channels = 4;
          }
          function ze(c, M) {
            var O = null;
            if (na(M))
              O = c.images[0] = he(), oe(O, c), te(O, M), c.mipmask = 1;
            else if (_e(c, M), Array.isArray(M.mipmap))
              for (var de = M.mipmap, ke = 0; ke < de.length; ++ke)
                O = c.images[ke] = he(), oe(O, c), O.width >>= ke, O.height >>= ke, te(O, de[ke]), c.mipmask |= 1 << ke;
            else
              O = c.images[0] = he(), oe(O, c), te(O, M), c.mipmask = 1;
            oe(c, c.images[0]), c.compressed && (c.internalformat === Wn || c.internalformat === Yn || c.internalformat === qn || c.internalformat === Kn) && f(
              c.width % 4 === 0 && c.height % 4 === 0,
              "for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4"
            );
          }
          function rt(c, M) {
            for (var O = c.images, de = 0; de < O.length; ++de) {
              if (!O[de])
                return;
              z(O[de], M, de);
            }
          }
          var ut = [];
          function Ne() {
            var c = ut.pop() || new Ae();
            V.call(c), c.mipmask = 0;
            for (var M = 0; M < 16; ++M)
              c.images[M] = null;
            return c;
          }
          function ot(c) {
            for (var M = c.images, O = 0; O < M.length; ++O)
              M[O] && Me(M[O]), M[O] = null;
            ut.push(c);
          }
          function Ye() {
            this.minFilter = ea, this.magFilter = ea, this.wrapS = Jn, this.wrapT = Jn, this.anisotropic = 1, this.genMipmaps = !1, this.mipmapHint = on;
          }
          function nt(c, M) {
            if ("min" in M) {
              var O = M.min;
              f.parameter(O, K), c.minFilter = K[O], tu.indexOf(c.minFilter) >= 0 && !("faces" in M) && (c.genMipmaps = !0);
            }
            if ("mag" in M) {
              var de = M.mag;
              f.parameter(de, J), c.magFilter = J[de];
            }
            var ke = c.wrapS, o = c.wrapT;
            if ("wrap" in M) {
              var t = M.wrap;
              typeof t == "string" ? (f.parameter(t, q), ke = o = q[t]) : Array.isArray(t) && (f.parameter(t[0], q), f.parameter(t[1], q), ke = q[t[0]], o = q[t[1]]);
            } else {
              if ("wrapS" in M) {
                var h = M.wrapS;
                f.parameter(h, q), ke = q[h];
              }
              if ("wrapT" in M) {
                var A = M.wrapT;
                f.parameter(A, q), o = q[A];
              }
            }
            if (c.wrapS = ke, c.wrapT = o, "anisotropic" in M) {
              var S = M.anisotropic;
              f(
                typeof S == "number" && S >= 1 && S <= l.maxAnisotropic,
                "aniso samples must be between 1 and "
              ), c.anisotropic = M.anisotropic;
            }
            if ("mipmap" in M) {
              var p = !1;
              switch (typeof M.mipmap) {
                case "string":
                  f.parameter(
                    M.mipmap,
                    W,
                    "invalid mipmap hint"
                  ), c.mipmapHint = W[M.mipmap], c.genMipmaps = !0, p = !0;
                  break;
                case "boolean":
                  p = c.genMipmaps = M.mipmap;
                  break;
                case "object":
                  f(Array.isArray(M.mipmap), "invalid mipmap type"), c.genMipmaps = !1, p = !0;
                  break;
                default:
                  f.raise("invalid mipmap type");
              }
              p && !("min" in M) && (c.minFilter = ta);
            }
          }
          function st(c, M) {
            e.texParameteri(M, Vf, c.minFilter), e.texParameteri(M, Xf, c.magFilter), e.texParameteri(M, $f, c.wrapS), e.texParameteri(M, Uf, c.wrapT), r.ext_texture_filter_anisotropic && e.texParameteri(M, Kf, c.anisotropic), c.genMipmaps && (e.hint(Wf, c.mipmapHint), e.generateMipmap(M));
          }
          var ft = 0, ct = {}, dt = l.maxTextureUnits, Qe = Array(dt).map(function() {
            return null;
          });
          function Oe(c) {
            V.call(this), this.mipmask = 0, this.internalformat = Zt, this.id = ft++, this.refCount = 1, this.target = c, this.texture = e.createTexture(), this.unit = -1, this.bindCount = 0, this.texInfo = new Ye(), I.profile && (this.stats = { size: 0 });
          }
          function ht(c) {
            e.activeTexture(Mr), e.bindTexture(c.target, c.texture);
          }
          function Xe() {
            var c = Qe[0];
            c ? e.bindTexture(c.target, c.texture) : e.bindTexture(Bt, null);
          }
          function be(c) {
            var M = c.texture;
            f(M, "must not double destroy texture");
            var O = c.unit, de = c.target;
            O >= 0 && (e.activeTexture(Mr + O), e.bindTexture(de, null), Qe[O] = null), e.deleteTexture(M), c.texture = null, c.params = null, c.pixels = null, c.refCount = 0, delete ct[c.id], F.textureCount--;
          }
          y(Oe.prototype, {
            bind: function() {
              var c = this;
              c.bindCount += 1;
              var M = c.unit;
              if (M < 0) {
                for (var O = 0; O < dt; ++O) {
                  var de = Qe[O];
                  if (de) {
                    if (de.bindCount > 0)
                      continue;
                    de.unit = -1;
                  }
                  Qe[O] = c, M = O;
                  break;
                }
                M >= dt && f.raise("insufficient number of texture units"), I.profile && F.maxTextureUnits < M + 1 && (F.maxTextureUnits = M + 1), c.unit = M, e.activeTexture(Mr + M), e.bindTexture(c.target, c.texture);
              }
              return M;
            },
            unbind: function() {
              this.bindCount -= 1;
            },
            decRef: function() {
              --this.refCount <= 0 && be(this);
            }
          });
          function Ie(c, M) {
            var O = new Oe(Bt);
            ct[O.id] = O, F.textureCount++;
            function de(t, h) {
              var A = O.texInfo;
              Ye.call(A);
              var S = Ne();
              return typeof t == "number" ? typeof h == "number" ? Fe(S, t | 0, h | 0) : Fe(S, t | 0, t | 0) : t ? (f.type(t, "object", "invalid arguments to regl.texture"), nt(A, t), ze(S, t)) : Fe(S, 1, 1), A.genMipmaps && (S.mipmask = (S.width << 1) - 1), O.mipmask = S.mipmask, oe(O, S), f.texture2D(A, S, l), O.internalformat = S.internalformat, de.width = S.width, de.height = S.height, ht(O), rt(S, Bt), st(A, Bt), Xe(), ot(S), I.profile && (O.stats.size = fn(
                O.internalformat,
                O.type,
                S.width,
                S.height,
                A.genMipmaps,
                !1
              )), de.format = Z[O.internalformat], de.type = ce[O.type], de.mag = j[A.magFilter], de.min = le[A.minFilter], de.wrapS = H[A.wrapS], de.wrapT = H[A.wrapT], de;
            }
            function ke(t, h, A, S) {
              f(!!t, "must specify image data");
              var p = h | 0, m = A | 0, g = S | 0, s = he();
              return oe(s, O), s.width = 0, s.height = 0, te(s, t), s.width = s.width || (O.width >> g) - p, s.height = s.height || (O.height >> g) - m, f(
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
              ), ht(O), Ee(s, Bt, p, m, g), Xe(), Me(s), de;
            }
            function o(t, h) {
              var A = t | 0, S = h | 0 || A;
              if (A === O.width && S === O.height)
                return de;
              de.width = O.width = A, de.height = O.height = S, ht(O);
              for (var p = 0; O.mipmask >> p; ++p) {
                var m = A >> p, g = S >> p;
                if (!m || !g) break;
                e.texImage2D(
                  Bt,
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
              return Xe(), I.profile && (O.stats.size = fn(
                O.internalformat,
                O.type,
                A,
                S,
                !1,
                !1
              )), de;
            }
            return de(c, M), de.subimage = ke, de.resize = o, de._reglType = "texture2d", de._texture = O, I.profile && (de.stats = O.stats), de.destroy = function() {
              O.decRef();
            }, de;
          }
          function $e(c, M, O, de, ke, o) {
            var t = new Oe(Un);
            ct[t.id] = t, F.cubeCount++;
            var h = new Array(6);
            function A(m, g, s, d, i, E) {
              var L, P = t.texInfo;
              for (Ye.call(P), L = 0; L < 6; ++L)
                h[L] = Ne();
              if (typeof m == "number" || !m) {
                var U = m | 0 || 1;
                for (L = 0; L < 6; ++L)
                  Fe(h[L], U, U);
              } else if (typeof m == "object")
                if (g)
                  ze(h[0], m), ze(h[1], g), ze(h[2], s), ze(h[3], d), ze(h[4], i), ze(h[5], E);
                else if (nt(P, m), _e(t, m), "faces" in m) {
                  var N = m.faces;
                  for (f(
                    Array.isArray(N) && N.length === 6,
                    "cube faces must be a length 6 array"
                  ), L = 0; L < 6; ++L)
                    f(
                      typeof N[L] == "object" && !!N[L],
                      "invalid input for cube map face"
                    ), oe(h[L], t), ze(h[L], N[L]);
                } else
                  for (L = 0; L < 6; ++L)
                    ze(h[L], m);
              else
                f.raise("invalid arguments to cube map");
              for (oe(t, h[0]), l.npotTextureCube || f(si(t.width) && si(t.height), "your browser does not support non power or two texture dimensions"), P.genMipmaps ? t.mipmask = (h[0].width << 1) - 1 : t.mipmask = h[0].mipmask, f.textureCube(t, P, h, l), t.internalformat = h[0].internalformat, A.width = h[0].width, A.height = h[0].height, ht(t), L = 0; L < 6; ++L)
                rt(h[L], tn + L);
              for (st(P, Un), Xe(), I.profile && (t.stats.size = fn(
                t.internalformat,
                t.type,
                A.width,
                A.height,
                P.genMipmaps,
                !0
              )), A.format = Z[t.internalformat], A.type = ce[t.type], A.mag = j[P.magFilter], A.min = le[P.minFilter], A.wrapS = H[P.wrapS], A.wrapT = H[P.wrapT], L = 0; L < 6; ++L)
                ot(h[L]);
              return A;
            }
            function S(m, g, s, d, i) {
              f(!!g, "must specify image data"), f(typeof m == "number" && m === (m | 0) && m >= 0 && m < 6, "invalid face");
              var E = s | 0, L = d | 0, P = i | 0, U = he();
              return oe(U, t), U.width = 0, U.height = 0, te(U, g), U.width = U.width || (t.width >> P) - E, U.height = U.height || (t.height >> P) - L, f(
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
              ), ht(t), Ee(U, tn + m, E, L, P), Xe(), Me(U), A;
            }
            function p(m) {
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
                return Xe(), I.profile && (t.stats.size = fn(
                  t.internalformat,
                  t.type,
                  A.width,
                  A.height,
                  !1,
                  !0
                )), A;
              }
            }
            return A(c, M, O, de, ke, o), A.subimage = S, A.resize = p, A._reglType = "textureCube", A._texture = t, I.profile && (A.stats = t.stats), A.destroy = function() {
              t.decRef();
            }, A;
          }
          function Ze() {
            for (var c = 0; c < dt; ++c)
              e.activeTexture(Mr + c), e.bindTexture(Bt, null), Qe[c] = null;
            Lt(ct).forEach(be), F.cubeCount = 0, F.textureCount = 0;
          }
          I.profile && (F.getTotalTextureSize = function() {
            var c = 0;
            return Object.keys(ct).forEach(function(M) {
              c += ct[M].stats.size;
            }), c;
          });
          function Dt() {
            for (var c = 0; c < dt; ++c) {
              var M = Qe[c];
              M && (M.bindCount = 0, M.unit = -1, Qe[c] = null);
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
                    for (var ke = 0; ke < 6; ++ke)
                      e.texImage2D(
                        tn + ke,
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
            for (var c = 0; c < dt; ++c) {
              var M = Qe[c];
              M && (M.bindCount = 0, M.unit = -1, Qe[c] = null), e.activeTexture(Mr + c), e.bindTexture(Bt, null), e.bindTexture(Un, null);
            }
          }
          return {
            create2D: Ie,
            createCube: $e,
            clear: Ze,
            getTexture: function(c) {
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
        var cu = function(e, r, l, G, $) {
          var F = {
            rgba4: un,
            rgb565: Ii,
            "rgb5 a1": ki,
            depth: Bi,
            stencil: Ni,
            "depth stencil": Di
          };
          r.ext_srgb && (F.srgba = Pi), r.ext_color_buffer_half_float && (F.rgba16f = Ui, F.rgb16f = zi), r.webgl_color_buffer_float && (F.rgba32f = $i);
          var I = [];
          Object.keys(F).forEach(function(Y) {
            var ae = F[Y];
            I[ae] = Y;
          });
          var W = 0, q = {};
          function J(Y) {
            this.id = W++, this.refCount = 1, this.renderbuffer = Y, this.format = un, this.width = 0, this.height = 0, $.profile && (this.stats = { size: 0 });
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
            function B(ce, j) {
              var le = 0, H = 0, ie = un;
              if (typeof ce == "object" && ce) {
                var V = ce;
                if ("shape" in V) {
                  var oe = V.shape;
                  f(
                    Array.isArray(oe) && oe.length >= 2,
                    "invalid renderbuffer shape"
                  ), le = oe[0] | 0, H = oe[1] | 0;
                } else
                  "radius" in V && (le = H = V.radius | 0), "width" in V && (le = V.width | 0), "height" in V && (H = V.height | 0);
                "format" in V && (f.parameter(
                  V.format,
                  F,
                  "invalid renderbuffer format"
                ), ie = F[V.format]);
              } else typeof ce == "number" ? (le = ce | 0, typeof j == "number" ? H = j | 0 : H = le) : ce ? f.raise("invalid arguments to renderbuffer constructor") : le = H = 1;
              if (f(
                le > 0 && H > 0 && le <= l.maxRenderbufferSize && H <= l.maxRenderbufferSize,
                "invalid renderbuffer size"
              ), !(le === T.width && H === T.height && ie === T.format))
                return B.width = T.width = le, B.height = T.height = H, T.format = ie, e.bindRenderbuffer(Xt, T.renderbuffer), e.renderbufferStorage(Xt, ie, le, H), f(
                  e.getError() === 0,
                  "invalid render buffer format"
                ), $.profile && (T.stats.size = ji(T.format, T.width, T.height)), B.format = I[T.format], B;
            }
            function Z(ce, j) {
              var le = ce | 0, H = j | 0 || le;
              return le === T.width && H === T.height || (f(
                le > 0 && H > 0 && le <= l.maxRenderbufferSize && H <= l.maxRenderbufferSize,
                "invalid renderbuffer size"
              ), B.width = T.width = le, B.height = T.height = H, e.bindRenderbuffer(Xt, T.renderbuffer), e.renderbufferStorage(Xt, T.format, le, H), f(
                e.getError() === 0,
                "invalid render buffer format"
              ), $.profile && (T.stats.size = ji(
                T.format,
                T.width,
                T.height
              ))), B;
            }
            return B(Y, ae), B.resize = Z, B._reglType = "renderbuffer", B._renderbuffer = T, $.profile && (B.stats = T.stats), B.destroy = function() {
              T.decRef();
            }, B;
          }
          $.profile && (G.getTotalRenderbufferSize = function() {
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
        function Cu(e, r, l, G, $, F) {
          var I = {
            cur: null,
            next: null,
            dirty: !1,
            setFBO: null
          }, W = ["rgba"], q = ["rgba4", "rgb565", "rgb5 a1"];
          r.ext_srgb && q.push("srgba"), r.ext_color_buffer_half_float && q.push("rgba16f", "rgb16f"), r.webgl_color_buffer_float && q.push("rgba32f");
          var J = ["uint8"];
          r.oes_texture_half_float && J.push("half float", "float16"), r.oes_texture_float && J.push("float", "float32");
          function K(fe, te, z) {
            this.target = fe, this.texture = te, this.renderbuffer = z;
            var Ee = 0, Re = 0;
            te ? (Ee = te.width, Re = te.height) : z && (Ee = z.width, Re = z.height), this.width = Ee, this.height = Re;
          }
          function ne(fe) {
            fe && (fe.texture && fe.texture._texture.decRef(), fe.renderbuffer && fe.renderbuffer._renderbuffer.decRef());
          }
          function se(fe, te, z) {
            if (fe)
              if (fe.texture) {
                var Ee = fe.texture._texture, Re = Math.max(1, Ee.width), he = Math.max(1, Ee.height);
                f(
                  Re === te && he === z,
                  "inconsistent width/height for supplied texture"
                ), Ee.refCount += 1;
              } else {
                var Me = fe.renderbuffer._renderbuffer;
                f(
                  Me.width === te && Me.height === z,
                  "inconsistent width/height for renderbuffer"
                ), Me.refCount += 1;
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
            var te = er, z = null, Ee = null, Re = fe;
            typeof fe == "object" && (Re = fe.data, "target" in fe && (te = fe.target | 0)), f.type(Re, "function", "invalid attachment data");
            var he = Re._reglType;
            return he === "texture2d" ? (z = Re, f(te === er)) : he === "textureCube" ? (z = Re, f(
              te >= cn && te < cn + 6,
              "invalid cube map target"
            )) : he === "renderbuffer" ? (Ee = Re, te = aa) : f.raise("invalid regl object for attachment"), new K(te, z, Ee);
          }
          function T(fe, te, z, Ee, Re) {
            if (z) {
              var he = G.create2D({
                width: fe,
                height: te,
                format: Ee,
                type: Re
              });
              return he._texture.refCount = 0, new K(er, he, null);
            } else {
              var Me = $.create({
                width: fe,
                height: te,
                format: Ee
              });
              return Me._renderbuffer.refCount = 0, new K(aa, null, Me);
            }
          }
          function B(fe) {
            return fe && (fe.texture || fe.renderbuffer);
          }
          function Z(fe, te, z) {
            fe && (fe.texture ? fe.texture.resize(te, z) : fe.renderbuffer && fe.renderbuffer.resize(te, z), fe.width = te, fe.height = z);
          }
          var ce = 0, j = {};
          function le() {
            this.id = ce++, j[this.id] = this, this.framebuffer = e.createFramebuffer(), this.width = 0, this.height = 0, this.colorAttachments = [], this.depthAttachment = null, this.stencilAttachment = null, this.depthStencilAttachment = null;
          }
          function H(fe) {
            fe.colorAttachments.forEach(ne), ne(fe.depthAttachment), ne(fe.stencilAttachment), ne(fe.depthStencilAttachment);
          }
          function ie(fe) {
            var te = fe.framebuffer;
            f(te, "must not double destroy framebuffer"), e.deleteFramebuffer(te), fe.framebuffer = null, F.framebufferCount--, delete j[fe.id];
          }
          function V(fe) {
            var te;
            e.bindFramebuffer($t, fe.framebuffer);
            var z = fe.colorAttachments;
            for (te = 0; te < z.length; ++te)
              Y(Xi + te, z[te]);
            for (te = z.length; te < l.maxColorAttachments; ++te)
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
            var Ee = e.checkFramebufferStatus($t);
            !e.isContextLost() && Ee !== Yi && f.raise("framebuffer configuration not supported, status = " + vr[Ee]), e.bindFramebuffer($t, I.next ? I.next.framebuffer : null), I.cur = I.next, e.getError();
          }
          function oe(fe, te) {
            var z = new le();
            F.framebufferCount++;
            function Ee(he, Me) {
              var Ae;
              f(
                I.next !== z,
                "can not update framebuffer which is currently in use"
              );
              var Fe = 0, ze = 0, rt = !0, ut = !0, Ne = null, ot = !0, Ye = "rgba", nt = "uint8", st = 1, ft = null, ct = null, dt = null, Qe = !1;
              if (typeof he == "number")
                Fe = he | 0, ze = Me | 0 || Fe;
              else if (!he)
                Fe = ze = 1;
              else {
                f.type(he, "object", "invalid arguments for framebuffer");
                var Oe = he;
                if ("shape" in Oe) {
                  var ht = Oe.shape;
                  f(
                    Array.isArray(ht) && ht.length >= 2,
                    "invalid shape for framebuffer"
                  ), Fe = ht[0], ze = ht[1];
                } else
                  "radius" in Oe && (Fe = ze = Oe.radius), "width" in Oe && (Fe = Oe.width), "height" in Oe && (ze = Oe.height);
                ("color" in Oe || "colors" in Oe) && (Ne = Oe.color || Oe.colors, Array.isArray(Ne) && f(
                  Ne.length === 1 || r.webgl_draw_buffers,
                  "multiple render targets not supported"
                )), Ne || ("colorCount" in Oe && (st = Oe.colorCount | 0, f(st > 0, "invalid color buffer count")), "colorTexture" in Oe && (ot = !!Oe.colorTexture, Ye = "rgba4"), "colorType" in Oe && (nt = Oe.colorType, ot ? (f(
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
                ), Ye = "rgba32f"), f.oneOf(nt, J, "invalid color type")), "colorFormat" in Oe && (Ye = Oe.colorFormat, W.indexOf(Ye) >= 0 ? ot = !0 : q.indexOf(Ye) >= 0 ? ot = !1 : ot ? f.oneOf(
                  Oe.colorFormat,
                  W,
                  "invalid color format for texture"
                ) : f.oneOf(
                  Oe.colorFormat,
                  q,
                  "invalid color format for renderbuffer"
                ))), ("depthTexture" in Oe || "depthStencilTexture" in Oe) && (Qe = !!(Oe.depthTexture || Oe.depthStencilTexture), f(
                  !Qe || r.webgl_depth_texture,
                  "webgl_depth_texture extension not supported"
                )), "depth" in Oe && (typeof Oe.depth == "boolean" ? rt = Oe.depth : (ft = Oe.depth, ut = !1)), "stencil" in Oe && (typeof Oe.stencil == "boolean" ? ut = Oe.stencil : (ct = Oe.stencil, rt = !1)), "depthStencil" in Oe && (typeof Oe.depthStencil == "boolean" ? rt = ut = Oe.depthStencil : (dt = Oe.depthStencil, rt = !1, ut = !1));
              }
              var Xe = null, be = null, Ie = null, $e = null;
              if (Array.isArray(Ne))
                Xe = Ne.map(ae);
              else if (Ne)
                Xe = [ae(Ne)];
              else
                for (Xe = new Array(st), Ae = 0; Ae < st; ++Ae)
                  Xe[Ae] = T(
                    Fe,
                    ze,
                    ot,
                    Ye,
                    nt
                  );
              f(
                r.webgl_draw_buffers || Xe.length <= 1,
                "you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers."
              ), f(
                Xe.length <= l.maxColorAttachments,
                "too many color attachments, not supported"
              ), Fe = Fe || Xe[0].width, ze = ze || Xe[0].height, ft ? be = ae(ft) : rt && !ut && (be = T(
                Fe,
                ze,
                Qe,
                "depth",
                "uint32"
              )), ct ? Ie = ae(ct) : ut && !rt && (Ie = T(
                Fe,
                ze,
                !1,
                "stencil",
                "uint8"
              )), dt ? $e = ae(dt) : !ft && !ct && ut && rt && ($e = T(
                Fe,
                ze,
                Qe,
                "depth stencil",
                "depth stencil"
              )), f(
                !!ft + !!ct + !!dt <= 1,
                "invalid framebuffer configuration, can specify exactly one depth/stencil attachment"
              );
              var Ze = null;
              for (Ae = 0; Ae < Xe.length; ++Ae)
                if (se(Xe[Ae], Fe, ze), f(
                  !Xe[Ae] || Xe[Ae].texture && bu.indexOf(Xe[Ae].texture._texture.format) >= 0 || Xe[Ae].renderbuffer && Ou.indexOf(Xe[Ae].renderbuffer._renderbuffer.format) >= 0,
                  "framebuffer color attachment " + Ae + " is invalid"
                ), Xe[Ae] && Xe[Ae].texture) {
                  var Dt = ia[Xe[Ae].texture._texture.format] * ln[Xe[Ae].texture._texture.type];
                  Ze === null ? Ze = Dt : f(
                    Ze === Dt,
                    "all color attachments much have the same number of bits per pixel."
                  );
                }
              return se(be, Fe, ze), f(
                !be || be.texture && be.texture._texture.format === _u || be.renderbuffer && be.renderbuffer._renderbuffer.format === wu,
                "invalid depth attachment for framebuffer object"
              ), se(Ie, Fe, ze), f(
                !Ie || Ie.renderbuffer && Ie.renderbuffer._renderbuffer.format === Au,
                "invalid stencil attachment for framebuffer object"
              ), se($e, Fe, ze), f(
                !$e || $e.texture && $e.texture._texture.format === Qi || $e.renderbuffer && $e.renderbuffer._renderbuffer.format === Qi,
                "invalid depth-stencil attachment for framebuffer object"
              ), H(z), z.width = Fe, z.height = ze, z.colorAttachments = Xe, z.depthAttachment = be, z.stencilAttachment = Ie, z.depthStencilAttachment = $e, Ee.color = Xe.map(B), Ee.depth = B(be), Ee.stencil = B(Ie), Ee.depthStencil = B($e), Ee.width = z.width, Ee.height = z.height, V(z), Ee;
            }
            function Re(he, Me) {
              f(
                I.next !== z,
                "can not resize a framebuffer which is currently in use"
              );
              var Ae = Math.max(he | 0, 1), Fe = Math.max(Me | 0 || Ae, 1);
              if (Ae === z.width && Fe === z.height)
                return Ee;
              for (var ze = z.colorAttachments, rt = 0; rt < ze.length; ++rt)
                Z(ze[rt], Ae, Fe);
              return Z(z.depthAttachment, Ae, Fe), Z(z.stencilAttachment, Ae, Fe), Z(z.depthStencilAttachment, Ae, Fe), z.width = Ee.width = Ae, z.height = Ee.height = Fe, V(z), Ee;
            }
            return Ee(fe, te), y(Ee, {
              resize: Re,
              _reglType: "framebuffer",
              _framebuffer: z,
              destroy: function() {
                ie(z), H(z);
              },
              use: function(he) {
                I.setFBO({
                  framebuffer: Ee
                }, he);
              }
            });
          }
          function _e(fe) {
            var te = Array(6);
            function z(Re) {
              var he;
              f(
                te.indexOf(I.next) < 0,
                "can not update framebuffer which is currently in use"
              );
              var Me = {
                color: null
              }, Ae = 0, Fe = null, ze = "rgba", rt = "uint8", ut = 1;
              if (typeof Re == "number")
                Ae = Re | 0;
              else if (!Re)
                Ae = 1;
              else {
                f.type(Re, "object", "invalid arguments for framebuffer");
                var Ne = Re;
                if ("shape" in Ne) {
                  var ot = Ne.shape;
                  f(
                    Array.isArray(ot) && ot.length >= 2,
                    "invalid shape for framebuffer"
                  ), f(
                    ot[0] === ot[1],
                    "cube framebuffer must be square"
                  ), Ae = ot[0];
                } else
                  "radius" in Ne && (Ae = Ne.radius | 0), "width" in Ne ? (Ae = Ne.width | 0, "height" in Ne && f(Ne.height === Ae, "must be square")) : "height" in Ne && (Ae = Ne.height | 0);
                ("color" in Ne || "colors" in Ne) && (Fe = Ne.color || Ne.colors, Array.isArray(Fe) && f(
                  Fe.length === 1 || r.webgl_draw_buffers,
                  "multiple render targets not supported"
                )), Fe || ("colorCount" in Ne && (ut = Ne.colorCount | 0, f(ut > 0, "invalid color buffer count")), "colorType" in Ne && (f.oneOf(
                  Ne.colorType,
                  J,
                  "invalid color type"
                ), rt = Ne.colorType), "colorFormat" in Ne && (ze = Ne.colorFormat, f.oneOf(
                  Ne.colorFormat,
                  W,
                  "invalid color format for texture"
                ))), "depth" in Ne && (Me.depth = Ne.depth), "stencil" in Ne && (Me.stencil = Ne.stencil), "depthStencil" in Ne && (Me.depthStencil = Ne.depthStencil);
              }
              var Ye;
              if (Fe)
                if (Array.isArray(Fe))
                  for (Ye = [], he = 0; he < Fe.length; ++he)
                    Ye[he] = Fe[he];
                else
                  Ye = [Fe];
              else {
                Ye = Array(ut);
                var nt = {
                  radius: Ae,
                  format: ze,
                  type: rt
                };
                for (he = 0; he < ut; ++he)
                  Ye[he] = G.createCube(nt);
              }
              for (Me.color = Array(Ye.length), he = 0; he < Ye.length; ++he) {
                var st = Ye[he];
                f(
                  typeof st == "function" && st._reglType === "textureCube",
                  "invalid cube map"
                ), Ae = Ae || st.width, f(
                  st.width === Ae && st.height === Ae,
                  "invalid cube map shape"
                ), Me.color[he] = {
                  target: cn,
                  data: Ye[he]
                };
              }
              for (he = 0; he < 6; ++he) {
                for (var ft = 0; ft < Ye.length; ++ft)
                  Me.color[ft].target = cn + he;
                he > 0 && (Me.depth = te[0].depth, Me.stencil = te[0].stencil, Me.depthStencil = te[0].depthStencil), te[he] ? te[he](Me) : te[he] = oe(Me);
              }
              return y(z, {
                width: Ae,
                height: Ae,
                color: Ye
              });
            }
            function Ee(Re) {
              var he, Me = Re | 0;
              if (f(
                Me > 0 && Me <= l.maxCubeMapSize,
                "invalid radius for cube fbo"
              ), Me === z.width)
                return z;
              var Ae = z.color;
              for (he = 0; he < Ae.length; ++he)
                Ae[he].resize(Me);
              for (he = 0; he < 6; ++he)
                te[he].resize(Me);
              return z.width = z.height = Me, z;
            }
            return z(fe), y(z, {
              faces: te,
              resize: Ee,
              _reglType: "framebufferCube",
              destroy: function() {
                te.forEach(function(Re) {
                  Re.destroy();
                });
              }
            });
          }
          function xe() {
            I.cur = null, I.next = null, I.dirty = !0, Lt(j).forEach(function(fe) {
              fe.framebuffer = e.createFramebuffer(), V(fe);
            });
          }
          return y(I, {
            getFramebuffer: function(fe) {
              if (typeof fe == "function" && fe._reglType === "framebuffer") {
                var te = fe._framebuffer;
                if (te instanceof le)
                  return te;
              }
              return null;
            },
            create: oe,
            createCube: _e,
            clear: function() {
              Lt(j).forEach(ie);
            },
            restore: xe
          });
        }
        var Fu = 5126, Zi = 34962;
        function oa() {
          this.state = 0, this.x = 0, this.y = 0, this.z = 0, this.w = 0, this.buffer = null, this.size = 0, this.normalized = !1, this.type = Fu, this.offset = 0, this.stride = 0, this.divisor = 0;
        }
        function Gu(e, r, l, G, $) {
          for (var F = l.maxAttributes, I = new Array(F), W = 0; W < F; ++W)
            I[W] = new oa();
          var q = 0, J = {}, K = {
            Record: oa,
            scope: {},
            state: I,
            currentVAO: null,
            targetVAO: null,
            restore: se() ? j : function() {
            },
            createVAO: le,
            getVAO: ae,
            destroyBuffer: ne,
            setVAO: se() ? T : B,
            clear: se() ? Z : function() {
            }
          };
          function ne(H) {
            for (var ie = 0; ie < I.length; ++ie) {
              var V = I[ie];
              V.buffer === H && (e.disableVertexAttribArray(ie), V.buffer = null);
            }
          }
          function se() {
            return r.oes_vertex_array_object;
          }
          function Y() {
            return r.angle_instanced_arrays;
          }
          function ae(H) {
            return typeof H == "function" && H._vao ? H._vao : null;
          }
          function T(H) {
            if (H !== K.currentVAO) {
              var ie = se();
              H ? ie.bindVertexArrayOES(H.vao) : ie.bindVertexArrayOES(null), K.currentVAO = H;
            }
          }
          function B(H) {
            if (H !== K.currentVAO) {
              if (H)
                H.bindAttrs();
              else
                for (var ie = Y(), V = 0; V < I.length; ++V) {
                  var oe = I[V];
                  oe.buffer ? (e.enableVertexAttribArray(V), e.vertexAttribPointer(V, oe.size, oe.type, oe.normalized, oe.stride, oe.offfset), ie && oe.divisor && ie.vertexAttribDivisorANGLE(V, oe.divisor)) : (e.disableVertexAttribArray(V), e.vertexAttrib4f(V, oe.x, oe.y, oe.z, oe.w));
                }
              K.currentVAO = H;
            }
          }
          function Z() {
            Lt(J).forEach(function(H) {
              H.destroy();
            });
          }
          function ce() {
            this.id = ++q, this.attributes = [];
            var H = se();
            H ? this.vao = H.createVertexArrayOES() : this.vao = null, J[this.id] = this, this.buffers = [];
          }
          ce.prototype.bindAttrs = function() {
            for (var H = Y(), ie = this.attributes, V = 0; V < ie.length; ++V) {
              var oe = ie[V];
              oe.buffer ? (e.enableVertexAttribArray(V), e.bindBuffer(Zi, oe.buffer.buffer), e.vertexAttribPointer(V, oe.size, oe.type, oe.normalized, oe.stride, oe.offset), H && oe.divisor && H.vertexAttribDivisorANGLE(V, oe.divisor)) : (e.disableVertexAttribArray(V), e.vertexAttrib4f(V, oe.x, oe.y, oe.z, oe.w));
            }
            for (var _e = ie.length; _e < F; ++_e)
              e.disableVertexAttribArray(_e);
          }, ce.prototype.refresh = function() {
            var H = se();
            H && (H.bindVertexArrayOES(this.vao), this.bindAttrs(), K.currentVAO = this);
          }, ce.prototype.destroy = function() {
            if (this.vao) {
              var H = se();
              this === K.currentVAO && (K.currentVAO = null, H.bindVertexArrayOES(null)), H.deleteVertexArrayOES(this.vao), this.vao = null;
            }
            J[this.id] && (delete J[this.id], G.vaoCount -= 1);
          };
          function j() {
            var H = se();
            H && Lt(J).forEach(function(ie) {
              ie.refresh();
            });
          }
          function le(H) {
            var ie = new ce();
            G.vaoCount += 1;
            function V(oe) {
              f(Array.isArray(oe), "arguments to vertex array constructor must be an array"), f(oe.length < F, "too many attributes"), f(oe.length > 0, "must specify at least one attribute");
              var _e = {}, xe = ie.attributes;
              xe.length = oe.length;
              for (var fe = 0; fe < oe.length; ++fe) {
                var te = oe[fe], z = xe[fe] = new oa(), Ee = te.data || te;
                if (Array.isArray(Ee) || v(Ee) || Gt(Ee)) {
                  var Re;
                  ie.buffers[fe] && (Re = ie.buffers[fe], v(Ee) && Re._buffer.byteLength >= Ee.byteLength ? Re.subdata(Ee) : (Re.destroy(), ie.buffers[fe] = null)), ie.buffers[fe] || (Re = ie.buffers[fe] = $.create(te, Zi, !1, !0)), z.buffer = $.getBuffer(Re), z.size = z.buffer.dimension | 0, z.normalized = !1, z.type = z.buffer.dtype, z.offset = 0, z.stride = 0, z.divisor = 0, z.state = 1, _e[fe] = 1;
                } else $.getBuffer(te) ? (z.buffer = $.getBuffer(te), z.size = z.buffer.dimension | 0, z.normalized = !1, z.type = z.buffer.dtype, z.offset = 0, z.stride = 0, z.divisor = 0, z.state = 1) : $.getBuffer(te.buffer) ? (z.buffer = $.getBuffer(te.buffer), z.size = (+te.size || z.buffer.dimension) | 0, z.normalized = !!te.normalized || !1, "type" in te ? (f.parameter(te.type, Kt, "invalid buffer type"), z.type = Kt[te.type]) : z.type = z.buffer.dtype, z.offset = (te.offset || 0) | 0, z.stride = (te.stride || 0) | 0, z.divisor = (te.divisor || 0) | 0, z.state = 1, f(z.size >= 1 && z.size <= 4, "size must be between 1 and 4"), f(z.offset >= 0, "invalid offset"), f(z.stride >= 0 && z.stride <= 255, "stride must be between 0 and 255"), f(z.divisor >= 0, "divisor must be positive"), f(!z.divisor || !!r.angle_instanced_arrays, "ANGLE_instanced_arrays must be enabled to use divisor")) : "x" in te ? (f(fe > 0, "first attribute must not be a constant"), z.x = +te.x || 0, z.y = +te.y || 0, z.z = +te.z || 0, z.w = +te.w || 0, z.state = 2) : f(!1, "invalid attribute spec for location " + fe);
              }
              for (var he = 0; he < ie.buffers.length; ++he)
                !_e[he] && ie.buffers[he] && (ie.buffers[he].destroy(), ie.buffers[he] = null);
              return ie.refresh(), V;
            }
            return V.destroy = function() {
              for (var oe = 0; oe < ie.buffers.length; ++oe)
                ie.buffers[oe] && ie.buffers[oe].destroy();
              ie.buffers.length = 0, ie.destroy();
            }, V._vao = ie, V._reglType = "vao", V(H);
          }
          return K;
        }
        var Ji = 35632, Mu = 35633, ku = 35718, Iu = 35721;
        function Bu(e, r, l, G) {
          var $ = {}, F = {};
          function I(T, B, Z, ce) {
            this.name = T, this.id = B, this.location = Z, this.info = ce;
          }
          function W(T, B) {
            for (var Z = 0; Z < T.length; ++Z)
              if (T[Z].id === B.id) {
                T[Z].location = B.location;
                return;
              }
            T.push(B);
          }
          function q(T, B, Z) {
            var ce = T === Ji ? $ : F, j = ce[B];
            if (!j) {
              var le = r.str(B);
              j = e.createShader(T), e.shaderSource(j, le), e.compileShader(j), f.shaderError(e, j, le, T, Z), ce[B] = j;
            }
            return j;
          }
          var J = {}, K = [], ne = 0;
          function se(T, B) {
            this.id = ne++, this.fragId = T, this.vertId = B, this.program = null, this.uniforms = [], this.attributes = [], this.refCount = 1, G.profile && (this.stats = {
              uniformsCount: 0,
              attributesCount: 0
            });
          }
          function Y(T, B, Z) {
            var ce, j, le = q(Ji, T.fragId), H = q(Mu, T.vertId), ie = T.program = e.createProgram();
            if (e.attachShader(ie, le), e.attachShader(ie, H), Z)
              for (ce = 0; ce < Z.length; ++ce) {
                var V = Z[ce];
                e.bindAttribLocation(ie, V[0], V[1]);
              }
            e.linkProgram(ie), f.linkError(
              e,
              ie,
              r.str(T.fragId),
              r.str(T.vertId),
              B
            );
            var oe = e.getProgramParameter(ie, ku);
            G.profile && (T.stats.uniformsCount = oe);
            var _e = T.uniforms;
            for (ce = 0; ce < oe; ++ce)
              if (j = e.getActiveUniform(ie, ce), j)
                if (j.size > 1)
                  for (var xe = 0; xe < j.size; ++xe) {
                    var fe = j.name.replace("[0]", "[" + xe + "]");
                    W(_e, new I(
                      fe,
                      r.id(fe),
                      e.getUniformLocation(ie, fe),
                      j
                    ));
                  }
                else
                  W(_e, new I(
                    j.name,
                    r.id(j.name),
                    e.getUniformLocation(ie, j.name),
                    j
                  ));
            var te = e.getProgramParameter(ie, Iu);
            G.profile && (T.stats.attributesCount = te);
            var z = T.attributes;
            for (ce = 0; ce < te; ++ce)
              j = e.getActiveAttrib(ie, ce), j && W(z, new I(
                j.name,
                r.id(j.name),
                e.getAttribLocation(ie, j.name),
                j
              ));
          }
          G.profile && (l.getMaxUniformsCount = function() {
            var T = 0;
            return K.forEach(function(B) {
              B.stats.uniformsCount > T && (T = B.stats.uniformsCount);
            }), T;
          }, l.getMaxAttributesCount = function() {
            var T = 0;
            return K.forEach(function(B) {
              B.stats.attributesCount > T && (T = B.stats.attributesCount);
            }), T;
          });
          function ae() {
            $ = {}, F = {};
            for (var T = 0; T < K.length; ++T)
              Y(K[T], null, K[T].attributes.map(function(B) {
                return [B.location, B.name];
              }));
          }
          return {
            clear: function() {
              var T = e.deleteShader.bind(e);
              Lt($).forEach(T), $ = {}, Lt(F).forEach(T), F = {}, K.forEach(function(B) {
                e.deleteProgram(B.program);
              }), K.length = 0, J = {}, l.shaderCount = 0;
            },
            program: function(T, B, Z, ce) {
              f.command(T >= 0, "missing vertex shader", Z), f.command(B >= 0, "missing fragment shader", Z);
              var j = J[B];
              j || (j = J[B] = {});
              var le = j[T];
              if (le && (le.refCount++, !ce))
                return le;
              var H = new se(B, T);
              return l.shaderCount++, Y(H, Z, ce), le || (j[T] = H), K.push(H), y(H, {
                destroy: function() {
                  if (H.refCount--, H.refCount <= 0) {
                    e.deleteProgram(H.program);
                    var ie = K.indexOf(H);
                    K.splice(ie, 1), l.shaderCount--;
                  }
                  j[H.vertId].refCount <= 0 && (e.deleteShader(F[H.vertId]), delete F[H.vertId], delete J[H.fragId][H.vertId]), Object.keys(J[H.fragId]).length || (e.deleteShader($[H.fragId]), delete $[H.fragId], delete J[H.fragId]);
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
        function Pu(e, r, l, G, $, F, I) {
          function W(K) {
            var ne;
            r.next === null ? (f(
              $.preserveDrawingBuffer,
              'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer'
            ), ne = kr) : (f(
              r.next.colorAttachments[0].texture !== null,
              "You cannot read from a renderbuffer"
            ), ne = r.next.colorAttachments[0].texture._texture.type, F.oes_texture_float ? (f(
              ne === kr || ne === dn,
              "Reading from a framebuffer is only allowed for the types 'uint8' and 'float'"
            ), ne === dn && f(I.readFloat, "Reading 'float' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float")) : f(
              ne === kr,
              "Reading from a framebuffer is only allowed for the type 'uint8'"
            ));
            var se = 0, Y = 0, ae = G.framebufferWidth, T = G.framebufferHeight, B = null;
            v(K) ? B = K : K && (f.type(K, "object", "invalid arguments to regl.read()"), se = K.x | 0, Y = K.y | 0, f(
              se >= 0 && se < G.framebufferWidth,
              "invalid x offset for regl.read"
            ), f(
              Y >= 0 && Y < G.framebufferHeight,
              "invalid y offset for regl.read"
            ), ae = (K.width || G.framebufferWidth - se) | 0, T = (K.height || G.framebufferHeight - Y) | 0, B = K.data || null), B && (ne === kr ? f(
              B instanceof Uint8Array,
              "buffer must be 'Uint8Array' when reading from a framebuffer of type 'uint8'"
            ) : ne === dn && f(
              B instanceof Float32Array,
              "buffer must be 'Float32Array' when reading from a framebuffer of type 'float'"
            )), f(
              ae > 0 && ae + se <= G.framebufferWidth,
              "invalid width for read pixels"
            ), f(
              T > 0 && T + Y <= G.framebufferHeight,
              "invalid height for read pixels"
            ), l();
            var Z = ae * T * 4;
            return B || (ne === kr ? B = new Uint8Array(Z) : ne === dn && (B = B || new Float32Array(Z))), f.isTypedArray(B, "data buffer for regl.read() must be a typedarray"), f(B.byteLength >= Z, "data buffer for regl.read() too small"), e.pixelStorei(Du, 4), e.readPixels(
              se,
              Y,
              ae,
              T,
              Nu,
              ne,
              B
            ), B;
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
          function $() {
            var ne = [];
            function se() {
              ne.push.apply(ne, yr(arguments));
            }
            var Y = [];
            function ae() {
              var T = "v" + e++;
              return Y.push(T), arguments.length > 0 && (ne.push(T, "="), ne.push.apply(ne, yr(arguments)), ne.push(";")), T;
            }
            return y(se, {
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
            var ne = $(), se = $(), Y = ne.toString, ae = se.toString;
            function T(B, Z) {
              se(B, Z, "=", ne.def(B, Z), ";");
            }
            return y(function() {
              ne.apply(ne, yr(arguments));
            }, {
              def: ne.def,
              entry: ne,
              exit: se,
              save: T,
              set: function(B, Z, ce) {
                T(B, Z), ne(B, Z, "=", ce, ";");
              },
              toString: function() {
                return Y() + ae();
              }
            });
          }
          function I() {
            var ne = _r(arguments), se = F(), Y = F(), ae = se.toString, T = Y.toString;
            return y(se, {
              then: function() {
                return se.apply(se, yr(arguments)), this;
              },
              else: function() {
                return Y.apply(Y, yr(arguments)), this;
              },
              toString: function() {
                var B = T();
                return B && (B = "else{" + B + "}"), _r([
                  "if(",
                  ne,
                  "){",
                  ae(),
                  "}",
                  B
                ]);
              }
            });
          }
          var W = $(), q = {};
          function J(ne, se) {
            var Y = [];
            function ae() {
              var j = "a" + Y.length;
              return Y.push(j), j;
            }
            se = se || 0;
            for (var T = 0; T < se; ++T)
              ae();
            var B = F(), Z = B.toString, ce = q[ne] = y(B, {
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
            return ce;
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
            block: $,
            proc: J,
            scope: F,
            cond: I,
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
            var $ = e.data;
            return new _t(
              $.thisDep,
              $.contextDep,
              $.propDep,
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
              for (var F = !1, I = !1, W = !1, q = 0; q < e.data.length; ++q) {
                var J = e.data[q];
                if (J.type === ua)
                  W = !0;
                else if (J.type === ca)
                  I = !0;
                else if (J.type === la)
                  F = !0;
                else if (J.type === fa) {
                  F = !0;
                  var K = J.data;
                  K >= 1 && (I = !0), K >= 2 && (W = !0);
                } else J.type === hn && (F = F || J.data.thisDep, I = I || J.data.contextDep, W = W || J.data.propDep);
              }
              return new _t(
                F,
                I,
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
        function fc(e, r, l, G, $, F, I, W, q, J, K, ne, se, Y, ae) {
          var T = J.Record, B = {
            add: 32774,
            subtract: 32778,
            "reverse subtract": 32779
          };
          l.ext_blend_minmax && (B.min = nc, B.max = ac);
          var Z = l.angle_instanced_arrays, ce = l.webgl_draw_buffers, j = {
            dirty: !0,
            profile: ae.profile
          }, le = {}, H = [], ie = {}, V = {};
          function oe(o) {
            return o.replace(".", "_");
          }
          function _e(o, t, h) {
            var A = oe(o);
            H.push(o), le[A] = j[A] = !!h, ie[A] = t;
          }
          function xe(o, t, h) {
            var A = oe(o);
            H.push(o), Array.isArray(h) ? (j[A] = h.slice(), le[A] = h.slice()) : j[A] = le[A] = h, V[A] = t;
          }
          _e(no, Ku), _e(ao, qu), xe(io, "blendColor", [0, 0, 0, 0]), xe(
            da,
            "blendEquationSeparate",
            [Lo, Lo]
          ), xe(
            ha,
            "blendFuncSeparate",
            [So, To, So, To]
          ), _e(oo, Zu, !0), xe(so, "depthFunc", oc), xe(fo, "depthRange", [0, 1]), xe(uo, "depthMask", !0), xe(ma, ma, [!0, !0, !0, !0]), _e(co, Yu), xe(lo, "cullFace", ir), xe(pa, pa, Sa), xe(va, va, 1), _e(ho, ec), xe(ya, "polygonOffset", [0, 0]), _e(mo, tc), _e(po, rc), xe(_a, "sampleCoverage", [1, !1]), _e(vo, Qu), xe(yo, "stencilMask", -1), xe(ba, "stencilFunc", [ic, 0, -1]), xe(
            ga,
            "stencilOpSeparate",
            [Vr, Vt, Vt, Vt]
          ), xe(
            Ir,
            "stencilOpSeparate",
            [ir, Vt, Vt, Vt]
          ), _e(_o, Ju), xe(
            mn,
            "scissor",
            [0, 0, e.drawingBufferWidth, e.drawingBufferHeight]
          ), xe(
            Ut,
            Ut,
            [0, 0, e.drawingBufferWidth, e.drawingBufferHeight]
          );
          var fe = {
            gl: e,
            context: se,
            strings: r,
            next: le,
            current: j,
            draw: ne,
            elements: F,
            buffer: $,
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
            blendEquations: B,
            stencilOps: Ht,
            glTypes: Kt,
            orientationType: La
          };
          f.optional(function() {
            fe.isArrayLike = Ke;
          }), ce && (te.backBuffer = [ir], te.drawBuffer = Et(G.maxDrawbuffers, function(o) {
            return o === 0 ? [0] : Et(o, function(t) {
              return sc + t;
            });
          }));
          var z = 0;
          function Ee() {
            var o = $u(), t = o.link, h = o.global;
            o.id = z++, o.batchId = "0";
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
            var p = o.next = {}, m = o.current = {};
            Object.keys(V).forEach(function(d) {
              Array.isArray(j[d]) && (p[d] = h.def(S.next, ".", d), m[d] = h.def(S.current, ".", d));
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
          function Re(o) {
            var t = o.static, h = o.dynamic, A;
            if (Br in t) {
              var S = !!t[Br];
              A = tt(function(m, g) {
                return S;
              }), A.enable = S;
            } else if (Br in h) {
              var p = h[Br];
              A = xt(p, function(m, g) {
                return m.invoke(g, p);
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
              var p = A[tr];
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
          function Me(o, t, h) {
            var A = o.static, S = o.dynamic;
            function p(s) {
              if (s in A) {
                var d = A[s];
                f.commandType(d, "object", "invalid " + s, h.commandStr);
                var i = !0, E = d.x | 0, L = d.y | 0, P, U;
                return "width" in d ? (P = d.width | 0, f.command(P >= 0, "invalid " + s, h.commandStr)) : i = !1, "height" in d ? (U = d.height | 0, f.command(U >= 0, "invalid " + s, h.commandStr)) : i = !1, new _t(
                  !i && t && t.thisDep,
                  !i && t && t.contextDep,
                  !i && t && t.propDep,
                  function(ye, Ce) {
                    var me = ye.shared.context, ge = P;
                    "width" in d || (ge = Ce.def(me, ".", Er, "-", E));
                    var Se = U;
                    return "height" in d || (Se = Ce.def(me, ".", xr, "-", L)), [E, L, ge, Se];
                  }
                );
              } else if (s in S) {
                var N = S[s], Q = xt(N, function(ye, Ce) {
                  var me = ye.invoke(Ce, N);
                  f.optional(function() {
                    ye.assert(
                      Ce,
                      me + "&&typeof " + me + '==="object"',
                      "invalid " + s
                    );
                  });
                  var ge = ye.shared.context, Se = Ce.def(me, ".x|0"), je = Ce.def(me, ".y|0"), qe = Ce.def(
                    '"width" in ',
                    me,
                    "?",
                    me,
                    ".width|0:",
                    "(",
                    ge,
                    ".",
                    Er,
                    "-",
                    Se,
                    ")"
                  ), bt = Ce.def(
                    '"height" in ',
                    me,
                    "?",
                    me,
                    ".height|0:",
                    "(",
                    ge,
                    ".",
                    xr,
                    "-",
                    je,
                    ")"
                  );
                  return f.optional(function() {
                    ye.assert(
                      Ce,
                      qe + ">=0&&" + bt + ">=0",
                      "invalid " + s
                    );
                  }), [Se, je, qe, bt];
                });
                return t && (Q.thisDep = Q.thisDep || t.thisDep, Q.contextDep = Q.contextDep || t.contextDep, Q.propDep = Q.propDep || t.propDep), Q;
              } else return t ? new _t(
                t.thisDep,
                t.contextDep,
                t.propDep,
                function(ye, Ce) {
                  var me = ye.shared.context;
                  return [
                    0,
                    0,
                    Ce.def(me, ".", Er),
                    Ce.def(me, ".", xr)
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
          function Ae(o, t) {
            var h = o.static, A = typeof h[Dr] == "string" && typeof h[Nr] == "string";
            if (A) {
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
          function Fe(o, t, h) {
            var A = o.static, S = o.dynamic;
            function p(i) {
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
                var P = S[i];
                return xt(P, function(U, N) {
                  var Q = U.invoke(N, P), ye = N.def(U.shared.strings, ".id(", Q, ")");
                  return f.optional(function() {
                    N(
                      U.shared.shader,
                      ".shader(",
                      Co[i],
                      ",",
                      ye,
                      ",",
                      U.command,
                      ");"
                    );
                  }), ye;
                });
              }
              return null;
            }
            var m = p(Dr), g = p(Nr), s = null, d;
            return Wt(m) && Wt(g) ? (s = K.program(g.id, m.id, null, h), d = tt(function(i, E) {
              return i.link(s);
            })) : d = new _t(
              m && m.thisDep || g && g.thisDep,
              m && m.contextDep || g && g.contextDep,
              m && m.propDep || g && g.propDep,
              function(i, E) {
                var L = i.shared.shader, P;
                m ? P = m.append(i, E) : P = E.def(L, ".", Dr);
                var U;
                g ? U = g.append(i, E) : U = E.def(L, ".", Nr);
                var N = L + ".program(" + U + "," + P;
                return f.optional(function() {
                  N += "," + i.command;
                }), E.def(N + ")");
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
                var E = tt(function(P, U) {
                  if (i) {
                    var N = P.link(i);
                    return P.ELEMENTS = N, N;
                  }
                  return P.ELEMENTS = null, null;
                });
                return E.value = i, E;
              } else if (rr in A) {
                var L = A[rr];
                return xt(L, function(P, U) {
                  var N = P.shared, Q = N.isBufferArgs, ye = N.elements, Ce = P.invoke(U, L), me = U.def("null"), ge = U.def(Q, "(", Ce, ")"), Se = P.cond(ge).then(me, "=", ye, ".createStream(", Ce, ");").else(me, "=", ye, ".getElements(", Ce, ");");
                  return f.optional(function() {
                    P.assert(
                      Se.else,
                      "!" + Ce + "||" + me,
                      "invalid elements"
                    );
                  }), U.entry(Se), U.exit(
                    P.cond(ge).then(ye, ".destroyStream(", me, ");")
                  ), P.ELEMENTS = me, me;
                });
              }
              return null;
            }
            var p = S();
            function m() {
              if (nr in h) {
                var i = h[nr];
                return f.commandParameter(i, ur, "invalid primitve", t.commandStr), tt(function(L, P) {
                  return ur[i];
                });
              } else if (nr in A) {
                var E = A[nr];
                return xt(E, function(L, P) {
                  var U = L.constants.primTypes, N = L.invoke(P, E);
                  return f.optional(function() {
                    L.assert(
                      P,
                      N + " in " + U,
                      "invalid primitive, must be one of " + Object.keys(ur)
                    );
                  }), P.def(U, "[", N, "]");
                });
              } else if (p)
                return Wt(p) ? p.value ? tt(function(L, P) {
                  return P.def(L.ELEMENTS, ".primType");
                }) : tt(function() {
                  return wo;
                }) : new _t(
                  p.thisDep,
                  p.contextDep,
                  p.propDep,
                  function(L, P) {
                    var U = L.ELEMENTS;
                    return P.def(U, "?", U, ".primType:", wo);
                  }
                );
              return null;
            }
            function g(i, E) {
              if (i in h) {
                var L = h[i] | 0;
                return f.command(!E || L >= 0, "invalid " + i, t.commandStr), tt(function(U, N) {
                  return E && (U.OFFSET = L), L;
                });
              } else if (i in A) {
                var P = A[i];
                return xt(P, function(U, N) {
                  var Q = U.invoke(N, P);
                  return E && (U.OFFSET = Q, f.optional(function() {
                    U.assert(
                      N,
                      Q + ">=0",
                      "invalid " + i
                    );
                  })), Q;
                });
              } else if (E && p)
                return tt(function(U, N) {
                  return U.OFFSET = "0", 0;
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
                return xt(E, function(U, N) {
                  var Q = U.invoke(N, E);
                  return f.optional(function() {
                    U.assert(
                      N,
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
                      function(U, N) {
                        var Q = N.def(
                          U.ELEMENTS,
                          ".vertCount-",
                          U.OFFSET
                        );
                        return f.optional(function() {
                          U.assert(
                            N,
                            Q + ">=0",
                            "invalid vertex offset/element buffer too small"
                          );
                        }), Q;
                      }
                    ) : tt(function(U, N) {
                      return N.def(U.ELEMENTS, ".vertCount");
                    });
                  var L = tt(function() {
                    return -1;
                  });
                  return f.optional(function() {
                    L.MISSING = !0;
                  }), L;
                } else {
                  var P = new _t(
                    p.thisDep || s.thisDep,
                    p.contextDep || s.contextDep,
                    p.propDep || s.propDep,
                    function(U, N) {
                      var Q = U.ELEMENTS;
                      return U.OFFSET ? N.def(
                        Q,
                        "?",
                        Q,
                        ".vertCount-",
                        U.OFFSET,
                        ":-1"
                      ) : N.def(Q, "?", Q, ".vertCount:-1");
                    }
                  );
                  return f.optional(function() {
                    P.DYNAMIC = !0;
                  }), P;
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
          function rt(o, t) {
            var h = o.static, A = o.dynamic, S = {};
            return H.forEach(function(p) {
              var m = oe(p);
              function g(s, d) {
                if (p in h) {
                  var i = s(h[p]);
                  S[m] = tt(function() {
                    return i;
                  });
                } else if (p in A) {
                  var E = A[p];
                  S[m] = xt(E, function(L, P) {
                    return d(L, P, L.invoke(P, E));
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
                      return f.commandParameter(s, Ar, "invalid " + p, t.commandStr), Ar[s];
                    },
                    function(s, d, i) {
                      var E = s.constants.compareFuncs;
                      return f.optional(function() {
                        s.assert(
                          d,
                          i + " in " + E,
                          "invalid " + p + ", must be one of " + Object.keys(Ar)
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
                      function L(me, ge) {
                        var Se = d.def(
                          '"',
                          me,
                          ge,
                          '" in ',
                          i,
                          "?",
                          i,
                          ".",
                          me,
                          ge,
                          ":",
                          i,
                          ".",
                          me
                        );
                        return f.optional(function() {
                          s.assert(
                            d,
                            Se + " in " + E,
                            "invalid " + p + "." + me + ge + ", must be one of " + Object.keys(Nt)
                          );
                        }), Se;
                      }
                      var P = L("src", "RGB"), U = L("dst", "RGB");
                      f.optional(function() {
                        var me = s.constants.invalidBlendCombinations;
                        s.assert(
                          d,
                          me + ".indexOf(" + P + '+", "+' + U + ") === -1 ",
                          "unallowed blending combination for (srcRGB, dstRGB)"
                        );
                      });
                      var N = d.def(E, "[", P, "]"), Q = d.def(E, "[", L("src", "Alpha"), "]"), ye = d.def(E, "[", U, "]"), Ce = d.def(E, "[", L("dst", "Alpha"), "]");
                      return [N, ye, Q, Ce];
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
                      var E = s.constants.blendEquations, L = d.def(), P = d.def(), U = s.cond("typeof ", i, '==="string"');
                      return f.optional(function() {
                        function N(Q, ye, Ce) {
                          s.assert(
                            Q,
                            Ce + " in " + E,
                            "invalid " + ye + ", must be one of " + Object.keys(B)
                          );
                        }
                        N(U.then, p, i), s.assert(
                          U.else,
                          i + "&&typeof " + i + '==="object"',
                          "invalid " + p
                        ), N(U.else, p + ".rgb", i + ".rgb"), N(U.else, p + ".alpha", i + ".alpha");
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
                      ), d(U), [L, P];
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
                      return f.commandParameter(d, Ar, p + ".cmp", t.commandStr), f.commandType(i, "number", p + ".ref", t.commandStr), f.commandType(E, "number", p + ".mask", t.commandStr), [
                        Ar[d],
                        i,
                        E
                      ];
                    },
                    function(s, d, i) {
                      var E = s.constants.compareFuncs;
                      f.optional(function() {
                        function N() {
                          s.assert(
                            d,
                            Array.prototype.join.call(arguments, ""),
                            "invalid stencil.func"
                          );
                        }
                        N(i + "&&typeof ", i, '==="object"'), N(
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
                      ), P = d.def(i, ".ref|0"), U = d.def(
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
                    function(s) {
                      f.commandType(s, "object", m, t.commandStr);
                      var d = s.fail || "keep", i = s.zfail || "keep", E = s.zpass || "keep";
                      return f.commandParameter(d, Ht, p + ".fail", t.commandStr), f.commandParameter(i, Ht, p + ".zfail", t.commandStr), f.commandParameter(E, Ht, p + ".zpass", t.commandStr), [
                        p === Ir ? ir : Vr,
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
                      function L(P) {
                        return f.optional(function() {
                          s.assert(
                            d,
                            '!("' + P + '" in ' + i + ")||(" + i + "." + P + " in " + E + ")",
                            "invalid " + p + "." + P + ", must be one of " + Object.keys(Ht)
                          );
                        }), d.def(
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
                        p === Ir ? ir : Vr,
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
            return Object.keys(h).forEach(function(p) {
              var m = h[p], g;
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
                  'missing color attachment for framebuffer sent to uniform "' + p + '"',
                  t.commandStr
                ), g = tt(function(d) {
                  return d.link(m.color[0]);
                })) : f.commandRaise('invalid data for uniform "' + p + '"', t.commandStr);
              } else Ke(m) ? g = tt(function(d) {
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
            }), Object.keys(A).forEach(function(p) {
              var m = A[p];
              S[p] = xt(m, function(g, s) {
                return g.invoke(s, m);
              });
            }), S;
          }
          function Ne(o, t) {
            var h = o.static, A = o.dynamic, S = {};
            return Object.keys(h).forEach(function(p) {
              var m = h[p], g = r.id(p), s = new T();
              if (Sn(m))
                s.state = gr, s.buffer = $.getBuffer(
                  $.create(m, wr, !1, !0)
                ), s.type = 0;
              else {
                var d = $.getBuffer(m);
                if (d)
                  s.state = gr, s.buffer = d, s.type = 0;
                else if (f.command(
                  typeof m == "object" && m,
                  "invalid data for attribute " + p,
                  t.commandStr
                ), "constant" in m) {
                  var i = m.constant;
                  s.buffer = "null", s.state = sa, typeof i == "number" ? s.x = i : (f.command(
                    Ke(i) && i.length > 0 && i.length <= 4,
                    "invalid constant for attribute " + p,
                    t.commandStr
                  ), br.forEach(function(ye, Ce) {
                    Ce < i.length && (s[ye] = i[Ce]);
                  }));
                } else {
                  Sn(m.buffer) ? d = $.getBuffer(
                    $.create(m.buffer, wr, !1, !0)
                  ) : d = $.getBuffer(m.buffer), f.command(!!d, 'missing buffer for attribute "' + p + '"', t.commandStr);
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
                  var P = m.size | 0;
                  f.command(
                    !("size" in m) || P > 0 && P <= 4,
                    'invalid size for attribute "' + p + '", must be 1,2,3,4',
                    t.commandStr
                  );
                  var U = !!m.normalized, N = 0;
                  "type" in m && (f.commandParameter(
                    m.type,
                    Kt,
                    "invalid type for attribute " + p,
                    t.commandStr
                  ), N = Kt[m.type]);
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
                    var ye = t.commandStr, Ce = [
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
                        'unknown parameter "' + me + '" for attribute pointer "' + p + '" (valid parameters are ' + Ce + ")",
                        ye
                      );
                    });
                  }), s.buffer = d, s.state = gr, s.size = P, s.normalized = U, s.type = N || d.dtype, s.offset = E, s.stride = L, s.divisor = Q;
                }
              }
              S[p] = tt(function(ye, Ce) {
                var me = ye.attribCache;
                if (g in me)
                  return me[g];
                var ge = {
                  isStream: !1
                };
                return Object.keys(s).forEach(function(Se) {
                  ge[Se] = s[Se];
                }), s.buffer && (ge.buffer = ye.link(s.buffer), ge.type = ge.type || ge.buffer + ".dtype"), me[g] = ge, ge;
              });
            }), Object.keys(A).forEach(function(p) {
              var m = A[p];
              function g(s, d) {
                var i = s.invoke(d, m), E = s.shared, L = s.constants, P = E.isBufferArgs, U = E.buffer;
                f.optional(function() {
                  s.assert(
                    d,
                    i + "&&(typeof " + i + '==="object"||typeof ' + i + '==="function")&&(' + P + "(" + i + ")||" + U + ".getBuffer(" + i + ")||" + U + ".getBuffer(" + i + ".buffer)||" + P + "(" + i + '.buffer)||("constant" in ' + i + "&&(typeof " + i + '.constant==="number"||' + E.isArrayLike + "(" + i + ".constant))))",
                    'invalid dynamic attribute "' + p + '"'
                  );
                });
                var N = {
                  isStream: d.def(!1)
                }, Q = new T();
                Q.state = gr, Object.keys(Q).forEach(function(ge) {
                  N[ge] = d.def("" + Q[ge]);
                });
                var ye = N.buffer, Ce = N.type;
                d(
                  "if(",
                  P,
                  "(",
                  i,
                  ")){",
                  N.isStream,
                  "=true;",
                  ye,
                  "=",
                  U,
                  ".createStream(",
                  wr,
                  ",",
                  i,
                  ");",
                  Ce,
                  "=",
                  ye,
                  ".dtype;",
                  "}else{",
                  ye,
                  "=",
                  U,
                  ".getBuffer(",
                  i,
                  ");",
                  "if(",
                  ye,
                  "){",
                  Ce,
                  "=",
                  ye,
                  ".dtype;",
                  '}else if("constant" in ',
                  i,
                  "){",
                  N.state,
                  "=",
                  sa,
                  ";",
                  "if(typeof " + i + '.constant === "number"){',
                  N[br[0]],
                  "=",
                  i,
                  ".constant;",
                  br.slice(1).map(function(ge) {
                    return N[ge];
                  }).join("="),
                  "=0;",
                  "}else{",
                  br.map(function(ge, Se) {
                    return N[ge] + "=" + i + ".constant.length>" + Se + "?" + i + ".constant[" + Se + "]:0;";
                  }).join(""),
                  "}}else{",
                  "if(",
                  P,
                  "(",
                  i,
                  ".buffer)){",
                  ye,
                  "=",
                  U,
                  ".createStream(",
                  wr,
                  ",",
                  i,
                  ".buffer);",
                  "}else{",
                  ye,
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
                  ye,
                  ".dtype;",
                  N.normalized,
                  "=!!",
                  i,
                  ".normalized;"
                );
                function me(ge) {
                  d(N[ge], "=", i, ".", ge, "|0;");
                }
                return me("size"), me("offset"), me("stride"), me("divisor"), d("}}"), d.exit(
                  "if(",
                  N.isStream,
                  "){",
                  U,
                  ".destroyStream(",
                  ye,
                  ");",
                  "}"
                ), N;
              }
              S[p] = xt(m, g);
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
              var p = A[Pr];
              return xt(p, function(m, g) {
                var s = m.invoke(g, p);
                return g.def(m.shared.vao + ".getVAO(" + s + ")");
              });
            }
            return null;
          }
          function Ye(o) {
            var t = o.static, h = o.dynamic, A = {};
            return Object.keys(t).forEach(function(S) {
              var p = t[S];
              A[S] = tt(function(m, g) {
                return typeof p == "number" || typeof p == "boolean" ? "" + p : m.link(p);
              });
            }), Object.keys(h).forEach(function(S) {
              var p = h[S];
              A[S] = xt(p, function(m, g) {
                return m.invoke(g, p);
              });
            }), A;
          }
          function nt(o, t, h, A, S) {
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
                Br,
                Pr
              ].concat(H);
              function ge(Se) {
                Object.keys(Se).forEach(function(je) {
                  f.command(
                    me.indexOf(je) >= 0,
                    'unknown parameter "' + je + '"',
                    S.commandStr
                  );
                });
              }
              ge(p), ge(m);
            });
            var g = Ae(o, t), s = he(o), d = Me(o, s, S), i = ze(o, S), E = rt(o, S), L = Fe(o, S, g);
            function P(me) {
              var ge = d[me];
              ge && (E[me] = ge);
            }
            P(Ut), P(oe(mn));
            var U = Object.keys(E).length > 0, N = {
              framebuffer: s,
              draw: i,
              shader: L,
              state: E,
              dirty: U,
              scopeVAO: null,
              drawVAO: null,
              useVAO: !1,
              attributes: {}
            };
            if (N.profile = Re(o), N.uniforms = ut(h, S), N.drawVAO = N.scopeVAO = ot(o), !N.drawVAO && L.program && !g && l.angle_instanced_arrays) {
              var Q = !0, ye = L.program.attributes.map(function(me) {
                var ge = t.static[me];
                return Q = Q && !!ge, ge;
              });
              if (Q && ye.length > 0) {
                var Ce = J.getVAO(J.createVAO(ye));
                N.drawVAO = new _t(null, null, null, function(me, ge) {
                  return me.link(Ce);
                }), N.useVAO = !0;
              }
            }
            return g ? N.useVAO = !0 : N.attributes = Ne(t, S), N.context = Ye(A), N;
          }
          function st(o, t, h) {
            var A = o.shared, S = A.context, p = o.scope();
            Object.keys(h).forEach(function(m) {
              t.save(S, "." + m);
              var g = h[m], s = g.append(o, t);
              Array.isArray(s) ? p(S, ".", m, "=[", s.join(), "];") : p(S, ".", m, "=", s, ";");
            }), t(p);
          }
          function ft(o, t, h, A) {
            var S = o.shared, p = S.gl, m = S.framebuffer, g;
            ce && (g = t.def(S.extensions, ".webgl_draw_buffers"));
            var s = o.constants, d = s.drawBuffer, i = s.backBuffer, E;
            h ? E = h.append(o, t) : E = t.def(m, ".next"), A || t("if(", E, "!==", m, ".cur){"), t(
              "if(",
              E,
              "){",
              p,
              ".bindFramebuffer(",
              Ro,
              ",",
              E,
              ".framebuffer);"
            ), ce && t(
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
            ), ce && t(g, ".drawBuffersWEBGL(", i, ");"), t(
              "}",
              m,
              ".cur=",
              E,
              ";"
            ), A || t("}");
          }
          function ct(o, t, h) {
            var A = o.shared, S = A.gl, p = o.current, m = o.next, g = A.current, s = A.next, d = o.cond(g, ".dirty");
            H.forEach(function(i) {
              var E = oe(i);
              if (!(E in h.state)) {
                var L, P;
                if (E in m) {
                  L = m[E], P = p[E];
                  var U = Et(j[E].length, function(Q) {
                    return d.def(L, "[", Q, "]");
                  });
                  d(o.cond(U.map(function(Q, ye) {
                    return Q + "!==" + P + "[" + ye + "]";
                  }).join("||")).then(
                    S,
                    ".",
                    V[E],
                    "(",
                    U,
                    ");",
                    U.map(function(Q, ye) {
                      return P + "[" + ye + "]=" + Q;
                    }).join(";"),
                    ";"
                  ));
                } else {
                  L = d.def(s, ".", E);
                  var N = o.cond(L, "!==", g, ".", E);
                  d(N), E in ie ? N(
                    o.cond(L).then(S, ".enable(", ie[E], ");").else(S, ".disable(", ie[E], ");"),
                    g,
                    ".",
                    E,
                    "=",
                    L,
                    ";"
                  ) : N(
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
          function dt(o, t, h, A) {
            var S = o.shared, p = o.current, m = S.current, g = S.gl;
            Fo(Object.keys(h)).forEach(function(s) {
              var d = h[s];
              if (!(A && !A(d))) {
                var i = d.append(o, t);
                if (ie[s]) {
                  var E = ie[s];
                  Wt(d) ? i ? t(g, ".enable(", E, ");") : t(g, ".disable(", E, ");") : t(o.cond(i).then(g, ".enable(", E, ");").else(g, ".disable(", E, ");")), t(m, ".", s, "=", i, ";");
                } else if (Ke(i)) {
                  var L = p[s];
                  t(
                    g,
                    ".",
                    V[s],
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
          function Qe(o, t) {
            Z && (o.instancing = t.def(
              o.shared.extensions,
              ".angle_instanced_arrays"
            ));
          }
          function Oe(o, t, h, A, S) {
            var p = o.shared, m = o.stats, g = p.current, s = p.timer, d = h.profile;
            function i() {
              return typeof performance > "u" ? "Date.now()" : "performance.now()";
            }
            var E, L;
            function P(me) {
              E = t.def(), me(E, "=", i(), ";"), typeof S == "string" ? me(m, ".count+=", S, ";") : me(m, ".count++;"), Y && (A ? (L = t.def(), me(L, "=", s, ".getNumPendingQueries();")) : me(s, ".beginQuery(", m, ");"));
            }
            function U(me) {
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
            function N(me) {
              var ge = t.def(g, ".profile");
              t(g, ".profile=", me, ";"), t.exit(g, ".profile=", ge, ";");
            }
            var Q;
            if (d) {
              if (Wt(d)) {
                d.enable ? (P(t), U(t.exit), N("true")) : N("false");
                return;
              }
              Q = d.append(o, t), N(Q);
            } else
              Q = t.def(g, ".profile");
            var ye = o.block();
            P(ye), t("if(", Q, "){", ye, "}");
            var Ce = o.block();
            U(Ce), t.exit("if(", Q, "){", Ce, "}");
          }
          function ht(o, t, h, A, S) {
            var p = o.shared;
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
              var E = p.gl, L = t.def(s, ".location"), P = t.def(p.attributes, "[", L, "]"), U = i.state, N = i.buffer, Q = [
                i.x,
                i.y,
                i.z,
                i.w
              ], ye = [
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
                var ge = i.type, Se;
                if (i.size ? Se = t.def(i.size, "||", d) : Se = d, t(
                  "if(",
                  P,
                  ".type!==",
                  ge,
                  "||",
                  P,
                  ".size!==",
                  Se,
                  "||",
                  ye.map(function(qe) {
                    return P + "." + qe + "!==" + i[qe];
                  }).join("||"),
                  "){",
                  E,
                  ".bindBuffer(",
                  wr,
                  ",",
                  N,
                  ".buffer);",
                  E,
                  ".vertexAttribPointer(",
                  [
                    L,
                    Se,
                    ge,
                    i.normalized,
                    i.stride,
                    i.offset
                  ],
                  ");",
                  P,
                  ".type=",
                  ge,
                  ";",
                  P,
                  ".size=",
                  Se,
                  ";",
                  ye.map(function(qe) {
                    return P + "." + qe + "=" + i[qe] + ";";
                  }).join(""),
                  "}"
                ), Z) {
                  var je = i.divisor;
                  t(
                    "if(",
                    P,
                    ".divisor!==",
                    je,
                    "){",
                    o.instancing,
                    ".vertexAttribDivisorANGLE(",
                    [L, je],
                    ");",
                    P,
                    ".divisor=",
                    je,
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
                  br.map(function(ge, Se) {
                    return P + "." + ge + "!==" + Q[Se];
                  }).join("||"),
                  "){",
                  E,
                  ".vertexAttrib4f(",
                  L,
                  ",",
                  Q,
                  ");",
                  br.map(function(ge, Se) {
                    return P + "." + ge + "=" + Q[Se] + ";";
                  }).join(""),
                  "}"
                );
              }
              U === gr ? Ce() : U === sa ? me() : (t("if(", U, "===", gr, "){"), Ce(), t("}else{"), me(), t("}"));
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
                }), E = {}, Object.keys(new T()).forEach(function(P) {
                  E[P] = t.def(L, ".", P);
                });
              }
              g(
                o.link(s),
                m(s.info.type),
                E
              );
            });
          }
          function Xe(o, t, h, A, S) {
            for (var p = o.shared, m = p.gl, g, s = 0; s < A.length; ++s) {
              var d = A[s], i = d.name, E = d.info.type, L = h.uniforms[i], P = o.link(d), U = P + ".location", N;
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
                    var ye = o.link(Q._texture || Q.color[0]._texture);
                    t(m, ".uniform1i(", U, ",", ye + ".bind());"), t.exit(ye, ".unbind();");
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
                    var Ce = o.global.def("new Float32Array([" + Array.prototype.slice.call(Q) + "])"), me = 2;
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
                      U,
                      ",",
                      Ke(Q) ? Array.prototype.slice.call(Q) : Q,
                      ");"
                    );
                  }
                  continue;
                } else
                  N = L.append(o, t);
              } else {
                if (!S(Go))
                  continue;
                N = t.def(p.uniforms, "[", r.id(i), "]");
              }
              E === jr ? (f(!Array.isArray(N), "must specify a scalar prop for textures"), t(
                "if(",
                N,
                "&&",
                N,
                '._reglType==="framebuffer"){',
                N,
                "=",
                N,
                ".color[0];",
                "}"
              )) : E === Xr && (f(!Array.isArray(N), "must specify a scalar prop for cube maps"), t(
                "if(",
                N,
                "&&",
                N,
                '._reglType==="framebufferCube"){',
                N,
                "=",
                N,
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
                  f(!Array.isArray(N), "must not specify an array type for uniform"), bt(
                    "typeof " + N + '==="' + kt + '"',
                    "invalid type, expected " + kt
                  );
                }
                function Ct(kt, Po) {
                  Array.isArray(N) ? f(N.length === kt, "must have length " + kt) : bt(
                    p.isArrayLike + "(" + N + ")&&" + N + ".length===" + kt,
                    "invalid vector, should have length " + kt,
                    o.commandStr
                  );
                }
                function Do(kt) {
                  f(!Array.isArray(N), "must not specify a value type"), bt(
                    "typeof " + N + '==="function"&&' + N + '._reglType==="texture' + (kt === xo ? "2d" : "Cube") + '"',
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
              var ge = 1;
              switch (E) {
                case jr:
                case Xr:
                  var Se = t.def(N, "._texture");
                  t(m, ".uniform1i(", U, ",", Se, ".bind());"), t.exit(Se, ".unbind();");
                  continue;
                case Aa:
                case Ta:
                  g = "1i";
                  break;
                case gn:
                case wn:
                  g = "2i", ge = 2;
                  break;
                case En:
                case An:
                  g = "3i", ge = 3;
                  break;
                case xn:
                case Tn:
                  g = "4i", ge = 4;
                  break;
                case wa:
                  g = "1f";
                  break;
                case yn:
                  g = "2f", ge = 2;
                  break;
                case _n:
                  g = "3f", ge = 3;
                  break;
                case bn:
                  g = "4f", ge = 4;
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
                var je = Math.pow(E - $r + 2, 2), qe = o.global.def("new Float32Array(", je, ")");
                Array.isArray(N) ? t(
                  "false,(",
                  Et(je, function(bt) {
                    return qe + "[" + bt + "]=" + N[bt];
                  }),
                  ",",
                  qe,
                  ")"
                ) : t(
                  "false,(Array.isArray(",
                  N,
                  ")||",
                  N,
                  " instanceof Float32Array)?",
                  N,
                  ":(",
                  Et(je, function(bt) {
                    return qe + "[" + bt + "]=" + N + "[" + bt + "]";
                  }),
                  ",",
                  qe,
                  ")"
                );
              } else ge > 1 ? t(Et(ge, function(bt) {
                return Array.isArray(N) ? N[bt] : N + "[" + bt + "]";
              })) : (f(!Array.isArray(N), "uniform value must not be an array"), t(N));
              t(");");
            }
          }
          function be(o, t, h, A) {
            var S = o.shared, p = S.gl, m = S.draw, g = A.draw;
            function s() {
              var Se = g.elements, je, qe = t;
              return Se ? ((Se.contextDep && A.contextDynamic || Se.propDep) && (qe = h), je = Se.append(o, qe)) : je = qe.def(m, ".", rr), je && qe(
                "if(" + je + ")" + p + ".bindBuffer(" + Xu + "," + je + ".buffer.buffer);"
              ), je;
            }
            function d() {
              var Se = g.count, je, qe = t;
              return Se ? ((Se.contextDep && A.contextDynamic || Se.propDep) && (qe = h), je = Se.append(o, qe), f.optional(function() {
                Se.MISSING && o.assert(t, "false", "missing vertex count"), Se.DYNAMIC && o.assert(qe, je + ">=0", "missing vertex count");
              })) : (je = qe.def(m, ".", ar), f.optional(function() {
                o.assert(qe, je + ">=0", "missing vertex count");
              })), je;
            }
            var i = s();
            function E(Se) {
              var je = g[Se];
              return je ? je.contextDep && A.contextDynamic || je.propDep ? je.append(o, h) : je.append(o, t) : t.def(m, ".", Se);
            }
            var L = E(nr), P = E(pn), U = d();
            if (typeof U == "number") {
              if (U === 0)
                return;
            } else
              h("if(", U, "){"), h.exit("}");
            var N, Q;
            Z && (N = E(vn), Q = o.instancing);
            var ye = i + ".type", Ce = g.elements && Wt(g.elements);
            function me() {
              function Se() {
                h(Q, ".drawElementsInstancedANGLE(", [
                  L,
                  U,
                  ye,
                  P + "<<((" + ye + "-" + eo + ")>>1)",
                  N
                ], ");");
              }
              function je() {
                h(
                  Q,
                  ".drawArraysInstancedANGLE(",
                  [L, P, U, N],
                  ");"
                );
              }
              i ? Ce ? Se() : (h("if(", i, "){"), Se(), h("}else{"), je(), h("}")) : je();
            }
            function ge() {
              function Se() {
                h(p + ".drawElements(" + [
                  L,
                  U,
                  ye,
                  P + "<<((" + ye + "-" + eo + ")>>1)"
                ] + ");");
              }
              function je() {
                h(p + ".drawArrays(" + [L, P, U] + ");");
              }
              i ? Ce ? Se() : (h("if(", i, "){"), Se(), h("}else{"), je(), h("}")) : je();
            }
            Z && (typeof N != "number" || N >= 0) ? typeof N == "string" ? (h("if(", N, ">0){"), me(), h("}else if(", N, "<0){"), ge(), h("}")) : me() : ge();
          }
          function Ie(o, t, h, A, S) {
            var p = Ee(), m = p.proc("body", S);
            return f.optional(function() {
              p.commandStr = t.commandStr, p.command = p.link(t.commandStr);
            }), Z && (p.instancing = m.def(
              p.shared.extensions,
              ".angle_instanced_arrays"
            )), o(p, m, h, A), p.compile().body;
          }
          function $e(o, t, h, A) {
            Qe(o, t), h.useVAO ? h.drawVAO ? t(o.shared.vao, ".setVAO(", h.drawVAO.append(o, t), ");") : t(o.shared.vao, ".setVAO(", o.shared.vao, ".targetVAO);") : (t(o.shared.vao, ".setVAO(null);"), ht(o, t, h, A.attributes, function() {
              return !0;
            })), Xe(o, t, h, A.uniforms, function() {
              return !0;
            }), be(o, t, t, h);
          }
          function Ze(o, t) {
            var h = o.proc("draw", 1);
            Qe(o, h), st(o, h, t.context), ft(o, h, t.framebuffer), ct(o, h, t), dt(o, h, t.state), Oe(o, h, t, !1, !0);
            var A = t.shader.progVar.append(o, h);
            if (h(o.shared.gl, ".useProgram(", A, ".program);"), t.shader.program)
              $e(o, h, t, t.shader.program);
            else {
              h(o.shared.vao, ".setVAO(null);");
              var S = o.global.def("{}"), p = h.def(A, ".id"), m = h.def(S, "[", p, "]");
              h(
                o.cond(m).then(m, ".call(this,a0);").else(
                  m,
                  "=",
                  S,
                  "[",
                  p,
                  "]=",
                  o.link(function(g) {
                    return Ie($e, o, t, g, 1);
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
            ht(o, t, h, A.attributes, S), Xe(o, t, h, A.uniforms, S), be(o, t, t, h);
          }
          function or(o, t, h, A) {
            Qe(o, t);
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
            function E(ye) {
              return ye.contextDep && S || ye.propDep;
            }
            function L(ye) {
              return !E(ye);
            }
            if (h.needsContext && st(o, i, h.context), h.needsFramebuffer && ft(o, i, h.framebuffer), dt(o, i, h.state, E), h.profile && E(h.profile) && Oe(o, i, h, !1, !0), A)
              h.useVAO ? h.drawVAO ? E(h.drawVAO) ? i(o.shared.vao, ".setVAO(", h.drawVAO.append(o, i), ");") : d(o.shared.vao, ".setVAO(", h.drawVAO.append(o, d), ");") : d(o.shared.vao, ".setVAO(", o.shared.vao, ".targetVAO);") : (d(o.shared.vao, ".setVAO(null);"), ht(o, d, h, A.attributes, L), ht(o, i, h, A.attributes, E)), Xe(o, d, h, A.uniforms, L), Xe(o, i, h, A.uniforms, E), be(o, d, i, h);
            else {
              var P = o.global.def("{}"), U = h.shader.progVar.append(o, i), N = i.def(U, ".id"), Q = i.def(P, "[", N, "]");
              i(
                o.shared.gl,
                ".useProgram(",
                U,
                ".program);",
                "if(!",
                Q,
                "){",
                Q,
                "=",
                P,
                "[",
                N,
                "]=",
                o.link(function(ye) {
                  return Ie(
                    Dt,
                    o,
                    h,
                    ye,
                    2
                  );
                }),
                "(",
                U,
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
          function c(o, t) {
            var h = o.proc("batch", 2);
            o.batchId = "0", Qe(o, h);
            var A = !1, S = !0;
            Object.keys(t.context).forEach(function(P) {
              A = A || t.context[P].propDep;
            }), A || (st(o, h, t.context), S = !1);
            var p = t.framebuffer, m = !1;
            p ? (p.propDep ? A = m = !0 : p.contextDep && A && (m = !0), m || ft(o, h, p)) : ft(o, h, null), t.state.viewport && t.state.viewport.propDep && (A = !0);
            function g(P) {
              return P.contextDep && A || P.propDep;
            }
            ct(o, h, t), dt(o, h, t.state, function(P) {
              return !g(P);
            }), (!t.profile || !g(t.profile)) && Oe(o, h, t, !1, "a1"), t.contextDep = A, t.needsContext = S, t.needsFramebuffer = m;
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
                    o.link(function(P) {
                      return Ie(or, o, t, P, 2);
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
            }), Oe(o, h, t, !0, !0), [rr, pn, ar, vn, nr].forEach(
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
            function p(m) {
              var g = t.shader[m];
              g && h.set(A.shader, "." + m, g.append(o, h));
            }
            p(Nr), p(Dr), Object.keys(t.state).length > 0 && (h(S, ".dirty=true;"), h.exit(S, ".dirty=true;")), h("a1(", o.shared.context, ",a0,", o.batchId, ");");
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
            var S = o.global, p = Object.keys(A), m = !1, g = !1, s = !1, d = o.global.def("{}");
            p.forEach(function(E) {
              var L = A[E];
              if (St.isDynamic(L)) {
                typeof L == "function" && (L = A[E] = St.unbox(L));
                var P = xt(L, null);
                m = m || P.thisDep, s = s || P.propDep, g = g || P.contextDep;
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
              p.forEach(function(P) {
                var U = A[P];
                if (St.isDynamic(U)) {
                  var N = E.invoke(L, U);
                  L(d, ".", P, "=", N, ";");
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
          function ke(o, t, h, A, S) {
            var p = Ee();
            p.stats = p.link(S), Object.keys(t.static).forEach(function(g) {
              de(p, t, g);
            }), ju.forEach(function(g) {
              de(p, o, g);
            });
            var m = nt(o, t, h, A, p);
            return Ze(p, m), M(p, m), c(p, m), y(p.compile(), {
              destroy: function() {
                m.shader.program.destroy();
              }
            });
          }
          return {
            next: le,
            current: j,
            procs: (function() {
              var o = Ee(), t = o.proc("poll"), h = o.proc("refresh"), A = o.block();
              t(A), h(A);
              var S = o.shared, p = S.gl, m = S.next, g = S.current;
              A(g, ".dirty=false;"), ft(o, t), ft(o, h, null, !0);
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
              ), Object.keys(ie).forEach(function(L) {
                var P = ie[L], U = A.def(m, ".", L), N = o.block();
                N(
                  "if(",
                  U,
                  "){",
                  p,
                  ".enable(",
                  P,
                  ")}else{",
                  p,
                  ".disable(",
                  P,
                  ")}",
                  g,
                  ".",
                  L,
                  "=",
                  U,
                  ";"
                ), h(N), t(
                  "if(",
                  U,
                  "!==",
                  g,
                  ".",
                  L,
                  "){",
                  N,
                  "}"
                );
              }), Object.keys(V).forEach(function(L) {
                var P = V[L], U = j[L], N, Q, ye = o.block();
                if (ye(p, ".", P, "("), Ke(U)) {
                  var Ce = U.length;
                  N = o.global.def(m, ".", L), Q = o.global.def(g, ".", L), ye(
                    Et(Ce, function(me) {
                      return N + "[" + me + "]";
                    }),
                    ");",
                    Et(Ce, function(me) {
                      return Q + "[" + me + "]=" + N + "[" + me + "];";
                    }).join("")
                  ), t(
                    "if(",
                    Et(Ce, function(me) {
                      return N + "[" + me + "]!==" + Q + "[" + me + "]";
                    }).join("||"),
                    "){",
                    ye,
                    "}"
                  );
                } else
                  N = A.def(m, ".", L), Q = A.def(g, ".", L), ye(
                    N,
                    ");",
                    g,
                    ".",
                    L,
                    "=",
                    N,
                    ";"
                  ), t(
                    "if(",
                    N,
                    "!==",
                    Q,
                    "){",
                    ye,
                    "}"
                  );
                h(ye);
              }), o.compile();
            })(),
            compile: ke
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
          function $(Z) {
            l.push(Z);
          }
          var F = [];
          function I(Z) {
            var ce = G();
            r.ext_disjoint_timer_query.beginQueryEXT(Mo, ce), F.push(ce), Y(F.length - 1, F.length, Z);
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
          function Y(Z, ce, j) {
            var le = K();
            le.startQueryIndex = Z, le.endQueryIndex = ce, le.sum = 0, le.stats = j, se.push(le);
          }
          var ae = [], T = [];
          function B() {
            var Z, ce, j = F.length;
            if (j !== 0) {
              T.length = Math.max(T.length, j + 1), ae.length = Math.max(ae.length, j + 1), ae[0] = 0, T[0] = 0;
              var le = 0;
              for (Z = 0, ce = 0; ce < F.length; ++ce) {
                var H = F[ce];
                r.ext_disjoint_timer_query.getQueryObjectEXT(H, lc) ? (le += r.ext_disjoint_timer_query.getQueryObjectEXT(H, cc), $(H)) : F[Z++] = H, ae[ce + 1] = le, T[ce + 1] = Z;
              }
              for (F.length = Z, Z = 0, ce = 0; ce < se.length; ++ce) {
                var ie = se[ce], V = ie.startQueryIndex, oe = ie.endQueryIndex;
                ie.sum += ae[oe] - ae[V];
                var _e = T[V], xe = T[oe];
                xe === _e ? (ie.stats.gpuTime += ie.sum / 1e6, ne(ie)) : (ie.startQueryIndex = _e, ie.endQueryIndex = xe, se[Z++] = ie);
              }
              se.length = Z;
            }
          }
          return {
            beginQuery: I,
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
          var l = r.gl, G = l.getContextAttributes(), $ = l.isContextLost(), F = vs(l, r);
          if (!F)
            return null;
          var I = cs(), W = uc(), q = F.extensions, J = dc(l, q), K = Xa(), ne = l.drawingBufferWidth, se = l.drawingBufferHeight, Y = {
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
          }, B = nf(l, q), Z = gf(
            l,
            W,
            r,
            j
          ), ce = Gu(
            l,
            q,
            B,
            W,
            Z
          );
          function j(be) {
            return ce.destroyBuffer(be);
          }
          var le = Gf(l, q, Z, W), H = Bu(l, I, W, r), ie = uu(
            l,
            q,
            B,
            function() {
              _e.procs.poll();
            },
            Y,
            W,
            r
          ), V = cu(l, q, B, W, r), oe = Cu(
            l,
            q,
            B,
            ie,
            V,
            W
          ), _e = fc(
            l,
            I,
            q,
            B,
            Z,
            le,
            ie,
            oe,
            ae,
            ce,
            H,
            T,
            Y,
            J,
            r
          ), xe = Pu(
            l,
            oe,
            _e.procs.poll,
            Y,
            G,
            q,
            B
          ), fe = _e.next, te = l.canvas, z = [], Ee = [], Re = [], he = [r.onDestroy], Me = null;
          function Ae() {
            if (z.length === 0) {
              J && J.update(), Me = null;
              return;
            }
            Me = Mn.next(Ae), dt();
            for (var be = z.length - 1; be >= 0; --be) {
              var Ie = z[be];
              Ie && Ie(Y, null, 0);
            }
            l.flush(), J && J.update();
          }
          function Fe() {
            !Me && z.length > 0 && (Me = Mn.next(Ae));
          }
          function ze() {
            Me && (Mn.cancel(Ae), Me = null);
          }
          function rt(be) {
            be.preventDefault(), $ = !0, ze(), Ee.forEach(function(Ie) {
              Ie();
            });
          }
          function ut(be) {
            l.getError(), $ = !1, F.restore(), H.restore(), Z.restore(), ie.restore(), V.restore(), oe.restore(), ce.restore(), J && J.restore(), _e.procs.refresh(), Fe(), Re.forEach(function(Ie) {
              Ie();
            });
          }
          te && (te.addEventListener(ko, rt, !1), te.addEventListener(Io, ut, !1));
          function Ne() {
            z.length = 0, ze(), te && (te.removeEventListener(ko, rt), te.removeEventListener(Io, ut)), H.clear(), oe.clear(), V.clear(), ie.clear(), le.clear(), Z.clear(), ce.clear(), J && J.clear(), he.forEach(function(be) {
              be();
            });
          }
          function ot(be) {
            f(!!be, "invalid args to regl({...})"), f.type(be, "object", "invalid args to regl({...})");
            function Ie(S) {
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
            var Ze = $e(be.context || {}, !0), Dt = $e(be.uniforms || {}, !0), or = $e(be.attributes || {}, !1), c = $e(Ie(be), !1), M = {
              gpuTime: 0,
              cpuTime: 0,
              count: 0
            }, O = _e.compile(c, or, Dt, Ze, M), de = O.draw, ke = O.batch, o = O.scope, t = [];
            function h(S) {
              for (; t.length < S; )
                t.push(null);
              return t;
            }
            function A(S, p) {
              var m;
              if ($ && f.raise("context lost"), typeof S == "function")
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
                  return ke.call(this, h(S | 0), S | 0);
              } else if (Array.isArray(S)) {
                if (S.length)
                  return ke.call(this, S, S.length);
              } else
                return de.call(this, S);
            }
            return y(A, {
              stats: M,
              destroy: function() {
                O.destroy();
              }
            });
          }
          var Ye = oe.setFBO = ot({
            framebuffer: St.define.call(null, Bo, "framebuffer")
          });
          function nt(be, Ie) {
            var $e = 0;
            _e.procs.poll();
            var Ze = Ie.color;
            Ze && (l.clearColor(+Ze[0] || 0, +Ze[1] || 0, +Ze[2] || 0, +Ze[3] || 0), $e |= hc), "depth" in Ie && (l.clearDepth(+Ie.depth), $e |= mc), "stencil" in Ie && (l.clearStencil(Ie.stencil | 0), $e |= pc), f(!!$e, "called regl.clear with no buffer specified"), l.clear($e);
          }
          function st(be) {
            if (f(
              typeof be == "object" && be,
              "regl.clear() takes an object as input"
            ), "framebuffer" in be)
              if (be.framebuffer && be.framebuffer_reglType === "framebufferCube")
                for (var Ie = 0; Ie < 6; ++Ie)
                  Ye(y({
                    framebuffer: be.framebuffer.faces[Ie]
                  }, be), nt);
              else
                Ye(be, nt);
            else
              nt(null, be);
          }
          function ft(be) {
            f.type(be, "function", "regl.frame() callback must be a function"), z.push(be);
            function Ie() {
              var $e = No(z, be);
              f($e >= 0, "cannot cancel a frame twice");
              function Ze() {
                var Dt = No(z, Ze);
                z[Dt] = z[z.length - 1], z.length -= 1, z.length <= 0 && ze();
              }
              z[$e] = Ze;
            }
            return Fe(), {
              cancel: Ie
            };
          }
          function ct() {
            var be = fe.viewport, Ie = fe.scissor_box;
            be[0] = be[1] = Ie[0] = Ie[1] = 0, Y.viewportWidth = Y.framebufferWidth = Y.drawingBufferWidth = be[2] = Ie[2] = l.drawingBufferWidth, Y.viewportHeight = Y.framebufferHeight = Y.drawingBufferHeight = be[3] = Ie[3] = l.drawingBufferHeight;
          }
          function dt() {
            Y.tick += 1, Y.time = Oe(), ct(), _e.procs.poll();
          }
          function Qe() {
            ie.refresh(), ct(), _e.procs.refresh(), J && J.update();
          }
          function Oe() {
            return (Xa() - K) / 1e3;
          }
          Qe();
          function ht(be, Ie) {
            f.type(Ie, "function", "listener callback must be a function");
            var $e;
            switch (be) {
              case "frame":
                return ft(Ie);
              case "lost":
                $e = Ee;
                break;
              case "restore":
                $e = Re;
                break;
              case "destroy":
                $e = he;
                break;
              default:
                f.raise("invalid event, must be one of frame,lost,restore,destroy");
            }
            return $e.push(Ie), {
              cancel: function() {
                for (var Ze = 0; Ze < $e.length; ++Ze)
                  if ($e[Ze] === Ie) {
                    $e[Ze] = $e[$e.length - 1], $e.pop();
                    return;
                  }
              }
            };
          }
          var Xe = y(ot, {
            // Clear current FBO
            clear: st,
            // Short cuts for dynamic variables
            prop: St.define.bind(null, Bo),
            context: St.define.bind(null, yc),
            this: St.define.bind(null, _c),
            // executes an empty draw command
            draw: ot({}),
            // Resources
            buffer: function(be) {
              return Z.create(be, vc, !1, !1);
            },
            elements: function(be) {
              return le.create(be, !1);
            },
            texture: ie.create2D,
            cube: ie.createCube,
            renderbuffer: V.create,
            framebuffer: oe.create,
            framebufferCube: oe.createCube,
            vao: ce.createVAO,
            // Expose context attributes
            attributes: G,
            // Frame rendering
            frame: ft,
            on: ht,
            // System limits
            limits: B,
            hasExtension: function(be) {
              return B.extensions.indexOf(be.toLowerCase()) >= 0;
            },
            // Read pixels
            read: xe,
            // Destroy regl and all associated resources
            destroy: Ne,
            // Direct GL state manipulation
            _gl: l,
            _refresh: Qe,
            poll: function() {
              dt(), J && J.update();
            },
            // Current time
            now: Oe,
            // regl Statistics Information
            stats: W
          });
          return r.onDone(null, Xe), Xe;
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
      width: v = 1280,
      height: y = 720,
      numSources: w = 4,
      numOutputs: _ = 4,
      makeGlobal: D = !0,
      autoLoop: k = !0,
      detectAudio: ee = !0,
      enableStreamCapture: ue = !0,
      canvas: Ve,
      precision: ve,
      extendTransforms: Le = {}
      // add your own functions on init
    } = {}) {
      if (Zo.init(), this.pb = n, this.width = v, this.height = y, this.renderAll = !1, this.detectAudio = ee, this._initCanvas(Ve), this.synth = {
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
      }, D && (window.loadScript = this.loadScript), this.timeSinceLastUpdate = 0, this._time = 0, ve && ["lowp", "mediump", "highp"].includes(ve.toLowerCase()))
        this.precision = ve.toLowerCase();
      else {
        let We = (/iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
        this.precision = We ? "highp" : "mediump";
      }
      if (this.extendTransforms = Le, this.saveFrame = !1, this.captureStream = null, this.generator = void 0, this.numOutputs = Math.max(1, _), this._initRegl(), this._initOutputs(this.numOutputs), this._initSources(w), this._generateGlslTransforms(), this.synth.screencap = () => {
        this.saveFrame = !0;
      }, ue)
        try {
          this.captureStream = this.canvas.captureStream(25), this.synth.vidRecorder = new Xc(this.captureStream);
        } catch (We) {
          console.warn(`[hydra-synth warning]
new MediaSource() is not currently supported on iOS.`), console.error(We);
        }
      ee && this._initAudio(), k && Cc(this.tick.bind(this)).start(), this.sandbox = new Wc(this.synth, D, ["speed", "update", "afterUpdate", "bpm", "fps"]);
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
      return new Promise((y, w) => {
        var _ = document.createElement("script");
        _.onload = function() {
          console.log(`loaded script ${n}`), y();
        }, _.onerror = (D) => {
          console.log(`error loading script ${n}`, "log-error"), y();
        }, _.src = n, document.head.appendChild(_);
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
      var w = this;
      this.canvas.toBlob((_) => {
        w.imageCallback ? (w.imageCallback(_), delete w.imageCallback) : (v.href = URL.createObjectURL(_), console.log(v.href), v.click());
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
      const v = {};
      for (let w = 0; w < this.numOutputs; w++)
        v[`tex[${w}]`] = this.regl.prop(`tex${w}`);
      let y;
      if (this.numOutputs === 1)
        y = `#version 300 es
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
        const w = Math.ceil(Math.sqrt(this.numOutputs)), _ = Math.ceil(this.numOutputs / w);
        let D = "";
        for (let k = 0; k < this.numOutputs; k++) {
          const ee = `if(index==${k}){ fragColor = texture(tex[${k}], st); }`;
          k === 0 ? D += ee : D += " else " + ee;
        }
        D += " else { fragColor = vec4(0.0); }", y = `#version 300 es
        precision ${this.precision} float;
        in vec2 uv;
        out vec4 fragColor;
        uniform sampler2D tex[${this.numOutputs}];

        void main () {
          vec2 st = vec2(1.0 - uv.x, uv.y);
          st *= vec2(${w}.0, ${_}.0);
          vec2 gridPos = floor(st);
          
          // Column-major indexing (y + x * rows) to preserve visual layout of previous 2x2 grid (0=TL, 1=BL, 2=TR, 3=BR)
          int index = int(gridPos.y) + int(gridPos.x) * ${_};
          
          st = fract(st);
          
          ${D}
        }
        `;
      }
      this.renderAll = this.regl({
        frag: y,
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
        uniforms: v,
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
      this.o = Array(n).fill().map((y, w) => {
        var _ = new Ec({
          regl: this.regl,
          width: this.width,
          height: this.height,
          precision: this.precision,
          label: `o${w}`
        });
        return _.id = w, v.synth["o" + w] = _, _;
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
        changeListener: ({ type: v, method: y, synth: w }) => {
          v === "add" && (n.synth[y] = w.generators[y], n.sandbox && n.sandbox.add(y));
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
            } catch (w) {
              console.log(w);
            }
          for (let w = 0; w < this.s.length; w++)
            this.s[w].tick(this.synth.time);
          const y = this.synth.time;
          for (let w = 0; w < this.o.length; w++)
            this.o[w].tick({
              time: y,
              mouse: this.synth.mouse,
              bpm: this.synth.bpm,
              resolution: [this.canvas.width, this.canvas.height]
            });
          if (this.isRenderingAll) {
            const w = {
              resolution: [this.canvas.width, this.canvas.height]
            };
            for (let _ = 0; _ < this.o.length; _++)
              w[`tex${_}`] = this.o[_].getCurrent();
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
      } catch (y) {
        console.warn("Error during tick():", y);
      }
    }
  }
  es.exports = fl;
});
export default ul();
