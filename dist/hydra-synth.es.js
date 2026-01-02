var _c = (c, i) => () => (i || c((i = { exports: {} }).exports, i), i.exports);
var sl = _c((ul, Zo) => {
  class bc {
    constructor({ regl: i, precision: v, label: _ = "", width: w, height: L }) {
      this.regl = i, this.precision = v, this.label = _, this.positionBuffer = this.regl.buffer([
        [-2, 0],
        [0, -2],
        [2, 2]
      ]), this.draw = () => {
      }, this.init(), this.pingPongIndex = 0, this.fbos = Array(2).fill().map(() => this.regl.framebuffer({
        color: this.regl.texture({
          mag: "nearest",
          width: w,
          height: L,
          format: "rgba"
        }),
        depthStencil: !1
      }));
    }
    resize(i, v) {
      this.fbos.forEach((_) => {
        _.resize(i, v);
      });
    }
    getCurrent() {
      return this.fbos[this.pingPongIndex];
    }
    getTexture() {
      var i = this.pingPongIndex ? 0 : 1;
      return this.fbos[i];
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
    render(i) {
      let v = i[0];
      var _ = this, w = Object.assign(v.uniforms, {
        prevBuffer: () => _.fbos[_.pingPongIndex]
      });
      _.draw = _.regl({
        frag: v.frag,
        vert: _.vert,
        attributes: _.attributes,
        uniforms: w,
        count: 3,
        framebuffer: () => (_.pingPongIndex = _.pingPongIndex ? 0 : 1, _.fbos[_.pingPongIndex])
      });
    }
    tick(i) {
      this.draw(i);
    }
  }
  function Ia(c) {
    return c && c.__esModule && Object.prototype.hasOwnProperty.call(c, "default") ? c.default : c;
  }
  var Ln = { exports: {} }, Uo;
  function gc() {
    return Uo || (Uo = 1, typeof Object.create == "function" ? Ln.exports = function(i, v) {
      v && (i.super_ = v, i.prototype = Object.create(v.prototype, {
        constructor: {
          value: i,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }));
    } : Ln.exports = function(i, v) {
      if (v) {
        i.super_ = v;
        var _ = function() {
        };
        _.prototype = v.prototype, i.prototype = new _(), i.prototype.constructor = i;
      }
    }), Ln.exports;
  }
  var Oa, $o;
  function Ec() {
    if ($o) return Oa;
    $o = 1;
    function c() {
      this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0;
    }
    Oa = c, c.EventEmitter = c, c.prototype._events = void 0, c.prototype._maxListeners = void 0, c.defaultMaxListeners = 10, c.prototype.setMaxListeners = function(L) {
      if (!v(L) || L < 0 || isNaN(L))
        throw TypeError("n must be a positive number");
      return this._maxListeners = L, this;
    }, c.prototype.emit = function(L) {
      var te, U, pe, he, Ve, Pe;
      if (this._events || (this._events = {}), L === "error" && (!this._events.error || _(this._events.error) && !this._events.error.length)) {
        if (te = arguments[1], te instanceof Error)
          throw te;
        var Xe = new Error('Uncaught, unspecified "error" event. (' + te + ")");
        throw Xe.context = te, Xe;
      }
      if (U = this._events[L], w(U))
        return !1;
      if (i(U))
        switch (arguments.length) {
          // fast cases
          case 1:
            U.call(this);
            break;
          case 2:
            U.call(this, arguments[1]);
            break;
          case 3:
            U.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            he = Array.prototype.slice.call(arguments, 1), U.apply(this, he);
        }
      else if (_(U))
        for (he = Array.prototype.slice.call(arguments, 1), Pe = U.slice(), pe = Pe.length, Ve = 0; Ve < pe; Ve++)
          Pe[Ve].apply(this, he);
      return !0;
    }, c.prototype.addListener = function(L, te) {
      var U;
      if (!i(te))
        throw TypeError("listener must be a function");
      return this._events || (this._events = {}), this._events.newListener && this.emit(
        "newListener",
        L,
        i(te.listener) ? te.listener : te
      ), this._events[L] ? _(this._events[L]) ? this._events[L].push(te) : this._events[L] = [this._events[L], te] : this._events[L] = te, _(this._events[L]) && !this._events[L].warned && (w(this._maxListeners) ? U = c.defaultMaxListeners : U = this._maxListeners, U && U > 0 && this._events[L].length > U && (this._events[L].warned = !0, console.error(
        "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
        this._events[L].length
      ), typeof console.trace == "function" && console.trace())), this;
    }, c.prototype.on = c.prototype.addListener, c.prototype.once = function(L, te) {
      if (!i(te))
        throw TypeError("listener must be a function");
      var U = !1;
      function pe() {
        this.removeListener(L, pe), U || (U = !0, te.apply(this, arguments));
      }
      return pe.listener = te, this.on(L, pe), this;
    }, c.prototype.removeListener = function(L, te) {
      var U, pe, he, Ve;
      if (!i(te))
        throw TypeError("listener must be a function");
      if (!this._events || !this._events[L])
        return this;
      if (U = this._events[L], he = U.length, pe = -1, U === te || i(U.listener) && U.listener === te)
        delete this._events[L], this._events.removeListener && this.emit("removeListener", L, te);
      else if (_(U)) {
        for (Ve = he; Ve-- > 0; )
          if (U[Ve] === te || U[Ve].listener && U[Ve].listener === te) {
            pe = Ve;
            break;
          }
        if (pe < 0)
          return this;
        U.length === 1 ? (U.length = 0, delete this._events[L]) : U.splice(pe, 1), this._events.removeListener && this.emit("removeListener", L, te);
      }
      return this;
    }, c.prototype.removeAllListeners = function(L) {
      var te, U;
      if (!this._events)
        return this;
      if (!this._events.removeListener)
        return arguments.length === 0 ? this._events = {} : this._events[L] && delete this._events[L], this;
      if (arguments.length === 0) {
        for (te in this._events)
          te !== "removeListener" && this.removeAllListeners(te);
        return this.removeAllListeners("removeListener"), this._events = {}, this;
      }
      if (U = this._events[L], i(U))
        this.removeListener(L, U);
      else if (U)
        for (; U.length; )
          this.removeListener(L, U[U.length - 1]);
      return delete this._events[L], this;
    }, c.prototype.listeners = function(L) {
      var te;
      return !this._events || !this._events[L] ? te = [] : i(this._events[L]) ? te = [this._events[L]] : te = this._events[L].slice(), te;
    }, c.prototype.listenerCount = function(L) {
      if (this._events) {
        var te = this._events[L];
        if (i(te))
          return 1;
        if (te)
          return te.length;
      }
      return 0;
    }, c.listenerCount = function(L, te) {
      return L.listenerCount(te);
    };
    function i(L) {
      return typeof L == "function";
    }
    function v(L) {
      return typeof L == "number";
    }
    function _(L) {
      return typeof L == "object" && L !== null;
    }
    function w(L) {
      return L === void 0;
    }
    return Oa;
  }
  var Ca, zo;
  function xc() {
    return zo || (zo = 1, Ca = window.performance && window.performance.now ? function() {
      return performance.now();
    } : Date.now || function() {
      return +/* @__PURE__ */ new Date();
    }), Ca;
  }
  var Hr = { exports: {} }, sr = { exports: {} }, wc = sr.exports, jo;
  function Ac() {
    return jo || (jo = 1, (function() {
      var c, i, v, _, w, L;
      typeof performance < "u" && performance !== null && performance.now ? sr.exports = function() {
        return performance.now();
      } : typeof process < "u" && process !== null && process.hrtime ? (sr.exports = function() {
        return (c() - w) / 1e6;
      }, i = process.hrtime, c = function() {
        var te;
        return te = i(), te[0] * 1e9 + te[1];
      }, _ = c(), L = process.uptime() * 1e9, w = _ - L) : Date.now ? (sr.exports = function() {
        return Date.now() - v;
      }, v = Date.now()) : (sr.exports = function() {
        return (/* @__PURE__ */ new Date()).getTime() - v;
      }, v = (/* @__PURE__ */ new Date()).getTime());
    }).call(wc)), sr.exports;
  }
  var Xo;
  function Tc() {
    if (Xo) return Hr.exports;
    Xo = 1;
    for (var c = Ac(), i = window, v = ["moz", "webkit"], _ = "AnimationFrame", w = i["request" + _], L = i["cancel" + _] || i["cancelRequest" + _], te = 0; !w && te < v.length; te++)
      w = i[v[te] + "Request" + _], L = i[v[te] + "Cancel" + _] || i[v[te] + "CancelRequest" + _];
    if (!w || !L) {
      var U = 0, pe = 0, he = [], Ve = 1e3 / 60;
      w = function(Pe) {
        if (he.length === 0) {
          var Xe = c(), ut = Math.max(0, Ve - (Xe - U));
          U = ut + Xe, setTimeout(function() {
            var We = he.slice(0);
            he.length = 0;
            for (var st = 0; st < We.length; st++)
              if (!We[st].cancelled)
                try {
                  We[st].callback(U);
                } catch (Pt) {
                  setTimeout(function() {
                    throw Pt;
                  }, 0);
                }
          }, Math.round(ut));
        }
        return he.push({
          handle: ++pe,
          callback: Pe,
          cancelled: !1
        }), pe;
      }, L = function(Pe) {
        for (var Xe = 0; Xe < he.length; Xe++)
          he[Xe].handle === Pe && (he[Xe].cancelled = !0);
      };
    }
    return Hr.exports = function(Pe) {
      return w.call(i, Pe);
    }, Hr.exports.cancel = function() {
      L.apply(i, arguments);
    }, Hr.exports.polyfill = function(Pe) {
      Pe || (Pe = i), Pe.requestAnimationFrame = w, Pe.cancelAnimationFrame = L;
    }, Hr.exports;
  }
  var Fa, Vo;
  function Sc() {
    if (Vo) return Fa;
    Vo = 1;
    var c = gc(), i = Ec().EventEmitter, v = xc(), _ = Tc();
    Fa = w;
    function w(L) {
      if (!(this instanceof w))
        return new w(L);
      this.running = !1, this.last = v(), this._frame = 0, this._tick = this.tick.bind(this), L && this.on("tick", L);
    }
    return c(w, i), w.prototype.start = function() {
      if (!this.running)
        return this.running = !0, this.last = v(), this._frame = _(this._tick), this;
    }, w.prototype.stop = function() {
      return this.running = !1, this._frame !== 0 && _.cancel(this._frame), this._frame = 0, this;
    }, w.prototype.tick = function() {
      this._frame = _(this._tick);
      var L = v(), te = L - this.last;
      this.emit("tick", te), this.last = L;
    }, Fa;
  }
  var Lc = Sc();
  const Rc = /* @__PURE__ */ Ia(Lc);
  function Oc(c) {
    return navigator.mediaDevices.enumerateDevices().then((i) => i.filter((v) => v.kind === "videoinput")).then((i) => {
      let v = { audio: !1, video: !0 };
      return i[c] && (v.video = {
        deviceId: { exact: i[c].deviceId }
      }), window.navigator.mediaDevices.getUserMedia(v);
    }).then((i) => {
      const v = document.createElement("video");
      return v.setAttribute("autoplay", ""), v.setAttribute("muted", ""), v.setAttribute("playsinline", ""), v.srcObject = i, new Promise((_, w) => {
        v.addEventListener("loadedmetadata", () => {
          v.play().then(() => _({ video: v }));
        });
      });
    }).catch(console.log.bind(console));
  }
  function Cc(c) {
    return new Promise(function(i, v) {
      navigator.mediaDevices.getDisplayMedia(c).then((_) => {
        const w = document.createElement("video");
        w.srcObject = _, w.addEventListener("loadedmetadata", () => {
          w.play(), i({ video: w });
        });
      }).catch((_) => v(_));
    });
  }
  class Fc {
    constructor({ regl: i, width: v, height: _, pb: w, label: L = "" }) {
      this.label = L, this.regl = i, this.src = null, this.dynamic = !0, this.width = v, this.height = _, this.tex = this.regl.texture({
        //  shape: [width, height]
        shape: [1, 1]
      }), this.pb = w;
    }
    init(i, v) {
      "src" in i && (this.src = i.src, this.tex = this.regl.texture({ data: this.src, ...v })), "dynamic" in i && (this.dynamic = i.dynamic);
    }
    initCam(i, v) {
      const _ = this;
      Oc(i).then((w) => {
        _.src = w.video, _.dynamic = !0, _.tex = _.regl.texture({ data: _.src, ...v });
      }).catch((w) => console.log("could not get camera", w));
    }
    initVideo(i = "", v) {
      const _ = document.createElement("video");
      _.crossOrigin = "anonymous", _.autoplay = !0, _.loop = !0, _.muted = !0, _.addEventListener("loadeddata", () => {
        this.src = _, _.play(), this.tex = this.regl.texture({ data: this.src, ...v }), this.dynamic = !0;
      }), _.src = i;
    }
    initImage(i = "", v) {
      const _ = document.createElement("img");
      _.crossOrigin = "anonymous", _.src = i, _.onload = () => {
        this.src = _, this.dynamic = !1, this.tex = this.regl.texture({ data: this.src, ...v });
      };
    }
    initStream(i, v) {
      let _ = this;
      i && this.pb && (this.pb.initSource(i), this.pb.on("got video", function(w, L) {
        w === i && (_.src = L, _.dynamic = !0, _.tex = _.regl.texture({ data: _.src, ...v }));
      }));
    }
    // index only relevant in atom-hydra + desktop apps
    initScreen(i = 0, v) {
      const _ = this;
      Cc().then(function(w) {
        _.src = w.video, _.tex = _.regl.texture({ data: _.src, ...v }), _.dynamic = !0;
      }).catch((w) => console.log("could not get screen", w));
    }
    // cache for the canvases, so we don't create them every time
    canvases = {};
    // Creates a canvas and returns the 2d context
    initCanvas(i = 1e3, v = 1e3) {
      if (this.canvases[this.label] == null) {
        const te = document.createElement("canvas").getContext("2d");
        te != null && (this.canvases[this.label] = te);
      }
      const _ = this.canvases[this.label], w = _.canvas;
      return w.width !== i && w.height !== v ? (w.width = i, w.height = v) : _.clearRect(0, 0, i, v), this.init({ src: w }), this.dynamic = !0, _;
    }
    resize(i, v) {
      this.width = i, this.height = v;
    }
    clear() {
      this.src && this.src.srcObject && this.src.srcObject.getTracks && this.src.srcObject.getTracks().forEach((i) => i.stop()), this.src = null, this.tex = this.regl.texture({ shape: [1, 1] });
    }
    tick(i) {
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
  function Gc(c) {
    if (typeof c == "object") {
      if ("buttons" in c)
        return c.buttons;
      if ("which" in c) {
        var i = c.which;
        if (i === 2)
          return 4;
        if (i === 3)
          return 2;
        if (i > 0)
          return 1 << i - 1;
      } else if ("button" in c) {
        var i = c.button;
        if (i === 1)
          return 4;
        if (i === 2)
          return 2;
        if (i >= 0)
          return 1 << i;
      }
    }
    return 0;
  }
  zt.buttons = Gc;
  function Mc(c) {
    return c.target || c.srcElement || window;
  }
  zt.element = Mc;
  function kc(c) {
    return typeof c == "object" && "pageX" in c ? c.pageX : 0;
  }
  zt.x = kc;
  function Bc(c) {
    return typeof c == "object" && "pageY" in c ? c.pageY : 0;
  }
  zt.y = Bc;
  function Ic(c, i) {
    i || (i = c, c = window);
    var v = 0, _ = 0, w = 0, L = {
      shift: !1,
      alt: !1,
      control: !1,
      meta: !1
    }, te = !1;
    function U(Ue) {
      var rt = !1;
      return "altKey" in Ue && (rt = rt || Ue.altKey !== L.alt, L.alt = !!Ue.altKey), "shiftKey" in Ue && (rt = rt || Ue.shiftKey !== L.shift, L.shift = !!Ue.shiftKey), "ctrlKey" in Ue && (rt = rt || Ue.ctrlKey !== L.control, L.control = !!Ue.ctrlKey), "metaKey" in Ue && (rt = rt || Ue.metaKey !== L.meta, L.meta = !!Ue.metaKey), rt;
    }
    function pe(Ue, rt) {
      var Yt = zt.x(rt), gt = zt.y(rt);
      "buttons" in rt && (Ue = rt.buttons | 0), (Ue !== v || Yt !== _ || gt !== w || U(rt)) && (v = Ue | 0, _ = Yt || 0, w = gt || 0, i && i(v, _, w, L));
    }
    function he(Ue) {
      pe(0, Ue);
    }
    function Ve() {
      (v || _ || w || L.shift || L.alt || L.meta || L.control) && (_ = w = 0, v = 0, L.shift = L.alt = L.control = L.meta = !1, i && i(0, 0, 0, L));
    }
    function Pe(Ue) {
      U(Ue) && i && i(v, _, w, L);
    }
    function Xe(Ue) {
      zt.buttons(Ue) === 0 ? pe(0, Ue) : pe(v, Ue);
    }
    function ut(Ue) {
      pe(v | zt.buttons(Ue), Ue);
    }
    function We(Ue) {
      pe(v & ~zt.buttons(Ue), Ue);
    }
    function st() {
      te || (te = !0, c.addEventListener("mousemove", Xe), c.addEventListener("mousedown", ut), c.addEventListener("mouseup", We), c.addEventListener("mouseleave", he), c.addEventListener("mouseenter", he), c.addEventListener("mouseout", he), c.addEventListener("mouseover", he), c.addEventListener("blur", Ve), c.addEventListener("keyup", Pe), c.addEventListener("keydown", Pe), c.addEventListener("keypress", Pe), c !== window && (window.addEventListener("blur", Ve), window.addEventListener("keyup", Pe), window.addEventListener("keydown", Pe), window.addEventListener("keypress", Pe)));
    }
    function Pt() {
      te && (te = !1, c.removeEventListener("mousemove", Xe), c.removeEventListener("mousedown", ut), c.removeEventListener("mouseup", We), c.removeEventListener("mouseleave", he), c.removeEventListener("mouseenter", he), c.removeEventListener("mouseout", he), c.removeEventListener("mouseover", he), c.removeEventListener("blur", Ve), c.removeEventListener("keyup", Pe), c.removeEventListener("keydown", Pe), c.removeEventListener("keypress", Pe), c !== window && (window.removeEventListener("blur", Ve), window.removeEventListener("keyup", Pe), window.removeEventListener("keydown", Pe), window.removeEventListener("keypress", Pe)));
    }
    st();
    var pt = {
      element: c
    };
    return Object.defineProperties(pt, {
      enabled: {
        get: function() {
          return te;
        },
        set: function(Ue) {
          Ue ? st() : Pt();
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
          return _;
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
          return L;
        },
        enumerable: !0
      }
    }), pt;
  }
  var Rn = { exports: {} }, Nc = Rn.exports, Ho;
  function Dc() {
    return Ho || (Ho = 1, (function(c, i) {
      (function(v, _) {
        c.exports = _();
      })(Nc, (function() {
        function v(R, y, j) {
          for (var C, ee = 0, me = y.length; ee < me; ee++) !C && ee in y || (C || (C = Array.prototype.slice.call(y, 0, ee)), C[ee] = y[ee]);
          return R.concat(C || Array.prototype.slice.call(y));
        }
        var _ = Object.freeze({ __proto__: null, blackman: function(R) {
          for (var y = new Float32Array(R), j = 2 * Math.PI / (R - 1), C = 2 * j, ee = 0; ee < R / 2; ee++) y[ee] = 0.42 - 0.5 * Math.cos(ee * j) + 0.08 * Math.cos(ee * C);
          for (ee = Math.ceil(R / 2); ee > 0; ee--) y[R - ee] = y[ee - 1];
          return y;
        }, hamming: function(R) {
          for (var y = new Float32Array(R), j = 0; j < R; j++) y[j] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (j / R - 1));
          return y;
        }, hanning: function(R) {
          for (var y = new Float32Array(R), j = 0; j < R; j++) y[j] = 0.5 - 0.5 * Math.cos(2 * Math.PI * j / (R - 1));
          return y;
        }, sine: function(R) {
          for (var y = Math.PI / (R - 1), j = new Float32Array(R), C = 0; C < R; C++) j[C] = Math.sin(y * C);
          return j;
        } }), w = {};
        function L(R) {
          for (; R % 2 == 0 && R > 1; ) R /= 2;
          return R === 1;
        }
        function te(R, y) {
          if (y !== "rect") {
            if (y !== "" && y || (y = "hanning"), w[y] || (w[y] = {}), !w[y][R.length]) try {
              w[y][R.length] = _[y](R.length);
            } catch {
              throw new Error("Invalid windowing function");
            }
            R = (function(j, C) {
              for (var ee = [], me = 0; me < Math.min(j.length, C.length); me++) ee[me] = j[me] * C[me];
              return ee;
            })(R, w[y][R.length]);
          }
          return R;
        }
        function U(R, y, j) {
          for (var C = new Float32Array(R), ee = 0; ee < C.length; ee++) C[ee] = ee * y / j, C[ee] = 13 * Math.atan(C[ee] / 1315.8) + 3.5 * Math.atan(Math.pow(C[ee] / 7518, 2));
          return C;
        }
        function pe(R) {
          return Float32Array.from(R);
        }
        function he(R) {
          return 1125 * Math.log(1 + R / 700);
        }
        function Ve(R, y, j) {
          for (var C, ee = new Float32Array(R + 2), me = new Float32Array(R + 2), Ce = y / 2, ke = he(0), Ae = (he(Ce) - ke) / (R + 1), xe = new Array(R + 2), Ne = 0; Ne < ee.length; Ne++) ee[Ne] = Ne * Ae, me[Ne] = (C = ee[Ne], 700 * (Math.exp(C / 1125) - 1)), xe[Ne] = Math.floor((j + 1) * me[Ne] / y);
          for (var vt = new Array(R), Ie = 0; Ie < vt.length; Ie++) {
            for (vt[Ie] = new Array(j / 2 + 1).fill(0), Ne = xe[Ie]; Ne < xe[Ie + 1]; Ne++) vt[Ie][Ne] = (Ne - xe[Ie]) / (xe[Ie + 1] - xe[Ie]);
            for (Ne = xe[Ie + 1]; Ne < xe[Ie + 2]; Ne++) vt[Ie][Ne] = (xe[Ie + 2] - Ne) / (xe[Ie + 2] - xe[Ie + 1]);
          }
          return vt;
        }
        function Pe(R, y, j, C, ee, me, Ce) {
          C === void 0 && (C = 5), ee === void 0 && (ee = 2), me === void 0 && (me = !0), Ce === void 0 && (Ce = 440);
          var ke = Math.floor(j / 2) + 1, Ae = new Array(j).fill(0).map((function(nt, mt) {
            return R * (function(yt, Ft) {
              return Math.log2(16 * yt / Ft);
            })(y * mt / j, Ce);
          }));
          Ae[0] = Ae[1] - 1.5 * R;
          var xe, Ne, vt, Ie = Ae.slice(1).map((function(nt, mt) {
            return Math.max(nt - Ae[mt]);
          }), 1).concat([1]), Rt = Math.round(R / 2), wt = new Array(R).fill(0).map((function(nt, mt) {
            return Ae.map((function(yt) {
              return (10 * R + Rt + yt - mt) % R - Rt;
            }));
          })), At = wt.map((function(nt, mt) {
            return nt.map((function(yt, Ft) {
              return Math.exp(-0.5 * Math.pow(2 * wt[mt][Ft] / Ie[Ft], 2));
            }));
          }));
          if (Ne = (xe = At)[0].map((function() {
            return 0;
          })), vt = xe.reduce((function(nt, mt) {
            return mt.forEach((function(yt, Ft) {
              nt[Ft] += Math.pow(yt, 2);
            })), nt;
          }), Ne).map(Math.sqrt), At = xe.map((function(nt, mt) {
            return nt.map((function(yt, Ft) {
              return yt / (vt[Ft] || 1);
            }));
          })), ee) {
            var Lr = Ae.map((function(nt) {
              return Math.exp(-0.5 * Math.pow((nt / R - C) / ee, 2));
            }));
            At = At.map((function(nt) {
              return nt.map((function(mt, yt) {
                return mt * Lr[yt];
              }));
            }));
          }
          return me && (At = v(v([], At.slice(3), !0), At.slice(0, 3))), At.map((function(nt) {
            return nt.slice(0, ke);
          }));
        }
        function Xe(R, y) {
          for (var j = 0, C = 0, ee = 0; ee < y.length; ee++) j += Math.pow(ee, R) * Math.abs(y[ee]), C += y[ee];
          return j / C;
        }
        function ut(R) {
          var y = R.ampSpectrum, j = R.barkScale, C = R.numberOfBarkBands, ee = C === void 0 ? 24 : C;
          if (typeof y != "object" || typeof j != "object") throw new TypeError();
          var me = ee, Ce = new Float32Array(me), ke = 0, Ae = y, xe = new Int32Array(me + 1);
          xe[0] = 0;
          for (var Ne = j[Ae.length - 1] / me, vt = 1, Ie = 0; Ie < Ae.length; Ie++) for (; j[Ie] > Ne; ) xe[vt++] = Ie, Ne = vt * j[Ae.length - 1] / me;
          for (xe[me] = Ae.length - 1, Ie = 0; Ie < me; Ie++) {
            for (var Rt = 0, wt = xe[Ie]; wt < xe[Ie + 1]; wt++) Rt += Ae[wt];
            Ce[Ie] = Math.pow(Rt, 0.23);
          }
          for (Ie = 0; Ie < Ce.length; Ie++) ke += Ce[Ie];
          return { specific: Ce, total: ke };
        }
        function We(R) {
          var y = R.ampSpectrum;
          if (typeof y != "object") throw new TypeError();
          for (var j = new Float32Array(y.length), C = 0; C < j.length; C++) j[C] = Math.pow(y[C], 2);
          return j;
        }
        function st(R) {
          var y = R.ampSpectrum, j = R.melFilterBank, C = R.bufferSize;
          if (typeof y != "object") throw new TypeError("Valid ampSpectrum is required to generate melBands");
          if (typeof j != "object") throw new TypeError("Valid melFilterBank is required to generate melBands");
          for (var ee = We({ ampSpectrum: y }), me = j.length, Ce = Array(me), ke = new Float32Array(me), Ae = 0; Ae < ke.length; Ae++) {
            Ce[Ae] = new Float32Array(C / 2), ke[Ae] = 0;
            for (var xe = 0; xe < C / 2; xe++) Ce[Ae][xe] = j[Ae][xe] * ee[xe], ke[Ae] += Ce[Ae][xe];
            ke[Ae] = Math.log(ke[Ae] + 1);
          }
          return Array.prototype.slice.call(ke);
        }
        function Pt(R) {
          return R && R.__esModule && Object.prototype.hasOwnProperty.call(R, "default") ? R.default : R;
        }
        var pt = null, Ue = Pt((function(R, y) {
          var j = R.length;
          return y = y || 2, pt && pt[j] || (function(C) {
            (pt = pt || {})[C] = new Array(C * C);
            for (var ee = Math.PI / C, me = 0; me < C; me++) for (var Ce = 0; Ce < C; Ce++) pt[C][Ce + me * C] = Math.cos(ee * (Ce + 0.5) * me);
          })(j), R.map((function() {
            return 0;
          })).map((function(C, ee) {
            return y * R.reduce((function(me, Ce, ke, Ae) {
              return me + Ce * pt[j][ke + ee * j];
            }), 0);
          }));
        })), rt = Object.freeze({ __proto__: null, amplitudeSpectrum: function(R) {
          return R.ampSpectrum;
        }, buffer: function(R) {
          return R.signal;
        }, chroma: function(R) {
          var y = R.ampSpectrum, j = R.chromaFilterBank;
          if (typeof y != "object") throw new TypeError("Valid ampSpectrum is required to generate chroma");
          if (typeof j != "object") throw new TypeError("Valid chromaFilterBank is required to generate chroma");
          var C = j.map((function(me, Ce) {
            return y.reduce((function(ke, Ae, xe) {
              return ke + Ae * me[xe];
            }), 0);
          })), ee = Math.max.apply(Math, C);
          return ee ? C.map((function(me) {
            return me / ee;
          })) : C;
        }, complexSpectrum: function(R) {
          return R.complexSpectrum;
        }, energy: function(R) {
          var y = R.signal;
          if (typeof y != "object") throw new TypeError();
          for (var j = 0, C = 0; C < y.length; C++) j += Math.pow(Math.abs(y[C]), 2);
          return j;
        }, loudness: ut, melBands: st, mfcc: function(R) {
          var y = R.ampSpectrum, j = R.melFilterBank, C = R.numberOfMFCCCoefficients, ee = R.bufferSize, me = Math.min(40, Math.max(1, C || 13));
          if (j.length < me) throw new Error("Insufficient filter bank for requested number of coefficients");
          var Ce = st({ ampSpectrum: y, melFilterBank: j, bufferSize: ee });
          return Ue(Ce).slice(0, me);
        }, perceptualSharpness: function(R) {
          for (var y = ut({ ampSpectrum: R.ampSpectrum, barkScale: R.barkScale }), j = y.specific, C = 0, ee = 0; ee < j.length; ee++) C += ee < 15 ? (ee + 1) * j[ee + 1] : 0.066 * Math.exp(0.171 * (ee + 1));
          return C *= 0.11 / y.total;
        }, perceptualSpread: function(R) {
          for (var y = ut({ ampSpectrum: R.ampSpectrum, barkScale: R.barkScale }), j = 0, C = 0; C < y.specific.length; C++) y.specific[C] > j && (j = y.specific[C]);
          return Math.pow((y.total - j) / y.total, 2);
        }, powerSpectrum: We, rms: function(R) {
          var y = R.signal;
          if (typeof y != "object") throw new TypeError();
          for (var j = 0, C = 0; C < y.length; C++) j += Math.pow(y[C], 2);
          return j /= y.length, j = Math.sqrt(j);
        }, spectralCentroid: function(R) {
          var y = R.ampSpectrum;
          if (typeof y != "object") throw new TypeError();
          return Xe(1, y);
        }, spectralCrest: function(R) {
          var y = R.ampSpectrum;
          if (typeof y != "object") throw new TypeError();
          var j = 0, C = -1 / 0;
          return y.forEach((function(ee) {
            j += Math.pow(ee, 2), C = ee > C ? ee : C;
          })), j /= y.length, j = Math.sqrt(j), C / j;
        }, spectralFlatness: function(R) {
          var y = R.ampSpectrum;
          if (typeof y != "object") throw new TypeError();
          for (var j = 0, C = 0, ee = 0; ee < y.length; ee++) j += Math.log(y[ee]), C += y[ee];
          return Math.exp(j / y.length) * y.length / C;
        }, spectralFlux: function(R) {
          var y = R.signal, j = R.previousSignal, C = R.bufferSize;
          if (typeof y != "object" || typeof j != "object") throw new TypeError();
          for (var ee = 0, me = -C / 2; me < y.length / 2 - 1; me++) x = Math.abs(y[me]) - Math.abs(j[me]), ee += (x + Math.abs(x)) / 2;
          return ee;
        }, spectralKurtosis: function(R) {
          var y = R.ampSpectrum;
          if (typeof y != "object") throw new TypeError();
          var j = y, C = Xe(1, j), ee = Xe(2, j), me = Xe(3, j), Ce = Xe(4, j);
          return (-3 * Math.pow(C, 4) + 6 * C * ee - 4 * C * me + Ce) / Math.pow(Math.sqrt(ee - Math.pow(C, 2)), 4);
        }, spectralRolloff: function(R) {
          var y = R.ampSpectrum, j = R.sampleRate;
          if (typeof y != "object") throw new TypeError();
          for (var C = y, ee = j / (2 * (C.length - 1)), me = 0, Ce = 0; Ce < C.length; Ce++) me += C[Ce];
          for (var ke = 0.99 * me, Ae = C.length - 1; me > ke && Ae >= 0; ) me -= C[Ae], --Ae;
          return (Ae + 1) * ee;
        }, spectralSkewness: function(R) {
          var y = R.ampSpectrum;
          if (typeof y != "object") throw new TypeError();
          var j = Xe(1, y), C = Xe(2, y), ee = Xe(3, y);
          return (2 * Math.pow(j, 3) - 3 * j * C + ee) / Math.pow(Math.sqrt(C - Math.pow(j, 2)), 3);
        }, spectralSlope: function(R) {
          var y = R.ampSpectrum, j = R.sampleRate, C = R.bufferSize;
          if (typeof y != "object") throw new TypeError();
          for (var ee = 0, me = 0, Ce = new Float32Array(y.length), ke = 0, Ae = 0, xe = 0; xe < y.length; xe++) {
            ee += y[xe];
            var Ne = xe * j / C;
            Ce[xe] = Ne, ke += Ne * Ne, me += Ne, Ae += Ne * y[xe];
          }
          return (y.length * Ae - me * ee) / (ee * (ke - Math.pow(me, 2)));
        }, spectralSpread: function(R) {
          var y = R.ampSpectrum;
          if (typeof y != "object") throw new TypeError();
          return Math.sqrt(Xe(2, y) - Math.pow(Xe(1, y), 2));
        }, zcr: function(R) {
          var y = R.signal;
          if (typeof y != "object") throw new TypeError();
          for (var j = 0, C = 1; C < y.length; C++) (y[C - 1] >= 0 && y[C] < 0 || y[C - 1] < 0 && y[C] >= 0) && j++;
          return j;
        } });
        function Yt(R) {
          if (Array.isArray(R)) {
            for (var y = 0, j = Array(R.length); y < R.length; y++) j[y] = R[y];
            return j;
          }
          return Array.from(R);
        }
        var gt = {}, fr = {}, Bt = { bitReverseArray: function(R) {
          if (gt[R] === void 0) {
            for (var y = (R - 1).toString(2).length, j = "0".repeat(y), C = {}, ee = 0; ee < R; ee++) {
              var me = ee.toString(2);
              me = j.substr(me.length) + me, me = [].concat(Yt(me)).reverse().join(""), C[ee] = parseInt(me, 2);
            }
            gt[R] = C;
          }
          return gt[R];
        }, multiply: function(R, y) {
          return { real: R.real * y.real - R.imag * y.imag, imag: R.real * y.imag + R.imag * y.real };
        }, add: function(R, y) {
          return { real: R.real + y.real, imag: R.imag + y.imag };
        }, subtract: function(R, y) {
          return { real: R.real - y.real, imag: R.imag - y.imag };
        }, euler: function(R, y) {
          var j = -2 * Math.PI * R / y;
          return { real: Math.cos(j), imag: Math.sin(j) };
        }, conj: function(R) {
          return R.imag *= -1, R;
        }, constructComplexArray: function(R) {
          var y = {};
          y.real = R.real === void 0 ? R.slice() : R.real.slice();
          var j = y.real.length;
          return fr[j] === void 0 && (fr[j] = Array.apply(null, Array(j)).map(Number.prototype.valueOf, 0)), y.imag = fr[j].slice(), y;
        } }, Cn = function(R) {
          var y = {};
          R.real === void 0 || R.imag === void 0 ? y = Bt.constructComplexArray(R) : (y.real = R.real.slice(), y.imag = R.imag.slice());
          var j = y.real.length, C = Math.log2(j);
          if (Math.round(C) != C) throw new Error("Input size must be a power of 2.");
          if (y.real.length != y.imag.length) throw new Error("Real and imaginary components must have the same length.");
          for (var ee = Bt.bitReverseArray(j), me = { real: [], imag: [] }, Ce = 0; Ce < j; Ce++) me.real[ee[Ce]] = y.real[Ce], me.imag[ee[Ce]] = y.imag[Ce];
          for (var ke = 0; ke < j; ke++) y.real[ke] = me.real[ke], y.imag[ke] = me.imag[ke];
          for (var Ae = 1; Ae <= C; Ae++) for (var xe = Math.pow(2, Ae), Ne = 0; Ne < xe / 2; Ne++) for (var vt = Bt.euler(Ne, xe), Ie = 0; Ie < j / xe; Ie++) {
            var Rt = xe * Ie + Ne, wt = xe * Ie + Ne + xe / 2, At = { real: y.real[Rt], imag: y.imag[Rt] }, Lr = { real: y.real[wt], imag: y.imag[wt] }, nt = Bt.multiply(vt, Lr), mt = Bt.subtract(At, nt);
            y.real[wt] = mt.real, y.imag[wt] = mt.imag;
            var yt = Bt.add(nt, At);
            y.real[Rt] = yt.real, y.imag[Rt] = yt.imag;
          }
          return y;
        }, Fn = Cn, Gn = (function() {
          function R(y, j) {
            var C = this;
            if (this._m = j, !y.audioContext) throw this._m.errors.noAC;
            if (y.bufferSize && !L(y.bufferSize)) throw this._m._errors.notPow2;
            if (!y.source) throw this._m._errors.noSource;
            this._m.audioContext = y.audioContext, this._m.bufferSize = y.bufferSize || this._m.bufferSize || 256, this._m.hopSize = y.hopSize || this._m.hopSize || this._m.bufferSize, this._m.sampleRate = y.sampleRate || this._m.audioContext.sampleRate || 44100, this._m.callback = y.callback, this._m.windowingFunction = y.windowingFunction || "hanning", this._m.featureExtractors = rt, this._m.EXTRACTION_STARTED = y.startImmediately || !1, this._m.channel = typeof y.channel == "number" ? y.channel : 0, this._m.inputs = y.inputs || 1, this._m.outputs = y.outputs || 1, this._m.numberOfMFCCCoefficients = y.numberOfMFCCCoefficients || this._m.numberOfMFCCCoefficients || 13, this._m.numberOfBarkBands = y.numberOfBarkBands || this._m.numberOfBarkBands || 24, this._m.spn = this._m.audioContext.createScriptProcessor(this._m.bufferSize, this._m.inputs, this._m.outputs), this._m.spn.connect(this._m.audioContext.destination), this._m._featuresToExtract = y.featureExtractors || [], this._m.barkScale = U(this._m.bufferSize, this._m.sampleRate, this._m.bufferSize), this._m.melFilterBank = Ve(Math.max(this._m.melBands, this._m.numberOfMFCCCoefficients), this._m.sampleRate, this._m.bufferSize), this._m.inputData = null, this._m.previousInputData = null, this._m.frame = null, this._m.previousFrame = null, this.setSource(y.source), this._m.spn.onaudioprocess = function(ee) {
              var me;
              C._m.inputData !== null && (C._m.previousInputData = C._m.inputData), C._m.inputData = ee.inputBuffer.getChannelData(C._m.channel), C._m.previousInputData ? ((me = new Float32Array(C._m.previousInputData.length + C._m.inputData.length - C._m.hopSize)).set(C._m.previousInputData.slice(C._m.hopSize)), me.set(C._m.inputData, C._m.previousInputData.length - C._m.hopSize)) : me = C._m.inputData;
              var Ce = (function(ke, Ae, xe) {
                if (ke.length < Ae) throw new Error("Buffer is too short for frame length");
                if (xe < 1) throw new Error("Hop length cannot be less that 1");
                if (Ae < 1) throw new Error("Frame length cannot be less that 1");
                var Ne = 1 + Math.floor((ke.length - Ae) / xe);
                return new Array(Ne).fill(0).map((function(vt, Ie) {
                  return ke.slice(Ie * xe, Ie * xe + Ae);
                }));
              })(me, C._m.bufferSize, C._m.hopSize);
              Ce.forEach((function(ke) {
                C._m.frame = ke;
                var Ae = C._m.extract(C._m._featuresToExtract, C._m.frame, C._m.previousFrame);
                typeof C._m.callback == "function" && C._m.EXTRACTION_STARTED && C._m.callback(Ae), C._m.previousFrame = C._m.frame;
              }));
            };
          }
          return R.prototype.start = function(y) {
            this._m._featuresToExtract = y || this._m._featuresToExtract, this._m.EXTRACTION_STARTED = !0;
          }, R.prototype.stop = function() {
            this._m.EXTRACTION_STARTED = !1;
          }, R.prototype.setSource = function(y) {
            this._m.source && this._m.source.disconnect(this._m.spn), this._m.source = y, this._m.source.connect(this._m.spn);
          }, R.prototype.setChannel = function(y) {
            y <= this._m.inputs ? this._m.channel = y : console.error("Channel ".concat(y, " does not exist. Make sure you've provided a value for 'inputs' that is greater than ").concat(y, " when instantiating the MeydaAnalyzer"));
          }, R.prototype.get = function(y) {
            return this._m.inputData ? this._m.extract(y || this._m._featuresToExtract, this._m.inputData, this._m.previousInputData) : null;
          }, R;
        })(), Tr = { audioContext: null, spn: null, bufferSize: 512, sampleRate: 44100, melBands: 26, chromaBands: 12, callback: null, windowingFunction: "hanning", featureExtractors: rt, EXTRACTION_STARTED: !1, numberOfMFCCCoefficients: 13, numberOfBarkBands: 24, _featuresToExtract: [], windowing: te, _errors: { notPow2: new Error("Meyda: Buffer size must be a power of 2, e.g. 64 or 512"), featureUndef: new Error("Meyda: No features defined."), invalidFeatureFmt: new Error("Meyda: Invalid feature format"), invalidInput: new Error("Meyda: Invalid input."), noAC: new Error("Meyda: No AudioContext specified."), noSource: new Error("Meyda: No source node specified.") }, createMeydaAnalyzer: function(R) {
          return new Gn(R, Object.assign({}, Tr));
        }, listAvailableFeatureExtractors: function() {
          return Object.keys(this.featureExtractors);
        }, extract: function(R, y, j) {
          var C = this;
          if (!y) throw this._errors.invalidInput;
          if (typeof y != "object") throw this._errors.invalidInput;
          if (!R) throw this._errors.featureUndef;
          if (!L(y.length)) throw this._errors.notPow2;
          this.barkScale !== void 0 && this.barkScale.length == this.bufferSize || (this.barkScale = U(this.bufferSize, this.sampleRate, this.bufferSize)), this.melFilterBank !== void 0 && this.barkScale.length == this.bufferSize && this.melFilterBank.length == this.melBands || (this.melFilterBank = Ve(Math.max(this.melBands, this.numberOfMFCCCoefficients), this.sampleRate, this.bufferSize)), this.chromaFilterBank !== void 0 && this.chromaFilterBank.length == this.chromaBands || (this.chromaFilterBank = Pe(this.chromaBands, this.sampleRate, this.bufferSize)), "buffer" in y && y.buffer === void 0 ? this.signal = pe(y) : this.signal = y;
          var ee = Sr(y, this.windowingFunction, this.bufferSize);
          if (this.signal = ee.windowedSignal, this.complexSpectrum = ee.complexSpectrum, this.ampSpectrum = ee.ampSpectrum, j) {
            var me = Sr(j, this.windowingFunction, this.bufferSize);
            this.previousSignal = me.windowedSignal, this.previousComplexSpectrum = me.complexSpectrum, this.previousAmpSpectrum = me.ampSpectrum;
          }
          var Ce = function(ke) {
            return C.featureExtractors[ke]({ ampSpectrum: C.ampSpectrum, chromaFilterBank: C.chromaFilterBank, complexSpectrum: C.complexSpectrum, signal: C.signal, bufferSize: C.bufferSize, sampleRate: C.sampleRate, barkScale: C.barkScale, melFilterBank: C.melFilterBank, previousSignal: C.previousSignal, previousAmpSpectrum: C.previousAmpSpectrum, previousComplexSpectrum: C.previousComplexSpectrum, numberOfMFCCCoefficients: C.numberOfMFCCCoefficients, numberOfBarkBands: C.numberOfBarkBands });
          };
          if (typeof R == "object") return R.reduce((function(ke, Ae) {
            var xe;
            return Object.assign({}, ke, ((xe = {})[Ae] = Ce(Ae), xe));
          }), {});
          if (typeof R == "string") return Ce(R);
          throw this._errors.invalidFeatureFmt;
        } }, Sr = function(R, y, j) {
          var C = {};
          R.buffer === void 0 ? C.signal = pe(R) : C.signal = R, C.windowedSignal = te(C.signal, y), C.complexSpectrum = Fn(C.windowedSignal), C.ampSpectrum = new Float32Array(j / 2);
          for (var ee = 0; ee < j / 2; ee++) C.ampSpectrum[ee] = Math.sqrt(Math.pow(C.complexSpectrum.real[ee], 2) + Math.pow(C.complexSpectrum.imag[ee], 2));
          return C;
        };
        return typeof window < "u" && (window.Meyda = Tr), Tr;
      }));
    })(Rn)), Rn.exports;
  }
  var Pc = Dc();
  const Uc = /* @__PURE__ */ Ia(Pc);
  class $c {
    constructor({
      numBins: i = 4,
      cutoff: v = 2,
      smooth: _ = 0.4,
      max: w = 15,
      scale: L = 10,
      isDrawing: te = !1,
      parentEl: U = document.body
    }) {
      this.vol = 0, this.scale = L, this.max = w, this.cutoff = v, this.smooth = _, this.setBins(i), this.beat = {
        holdFrames: 20,
        threshold: 40,
        _cutoff: 0,
        // adaptive based on sound state
        decay: 0.98,
        _framesSinceBeat: 0
        // keeps track of frames
      }, this.onBeat = () => {
      }, this.canvas = document.createElement("canvas"), this.canvas.width = 100, this.canvas.height = 80, this.canvas.style.width = "100px", this.canvas.style.height = "80px", this.canvas.style.position = "absolute", this.canvas.style.right = "0px", this.canvas.style.bottom = "0px", U.appendChild(this.canvas), this.isDrawing = te, this.ctx = this.canvas.getContext("2d"), this.ctx.fillStyle = "#DFFFFF", this.ctx.strokeStyle = "#0ff", this.ctx.lineWidth = 0.5, window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia({ video: !1, audio: !0 }).then((pe) => {
        this.stream = pe, this.context = new AudioContext();
        let he = this.context.createMediaStreamSource(pe);
        this.meyda = Uc.createMeydaAnalyzer({
          audioContext: this.context,
          source: he,
          featureExtractors: [
            "loudness"
            //  'perceptualSpread',
            //  'perceptualSharpness',
            //  'spectralCentroid'
          ]
        });
      }).catch((pe) => console.log("ERROR", pe));
    }
    detectBeat(i) {
      i > this.beat._cutoff && i > this.beat.threshold ? (this.onBeat(), this.beat._cutoff = i * 1.2, this.beat._framesSinceBeat = 0) : this.beat._framesSinceBeat <= this.beat.holdFrames ? this.beat._framesSinceBeat++ : (this.beat._cutoff *= this.beat.decay, this.beat._cutoff = Math.max(this.beat._cutoff, this.beat.threshold));
    }
    tick() {
      if (this.meyda) {
        var i = this.meyda.get();
        if (i && i !== null) {
          this.vol = i.loudness.total, this.detectBeat(this.vol);
          const v = (w, L) => w + L;
          let _ = Math.floor(i.loudness.specific.length / this.bins.length);
          this.prevBins = this.bins.slice(0), this.bins = this.bins.map((w, L) => i.loudness.specific.slice(L * _, (L + 1) * _).reduce(v)).map((w, L) => w * (1 - this.settings[L].smooth) + this.prevBins[L] * this.settings[L].smooth), this.fft = this.bins.map((w, L) => (
            // Math.max(0, (bin - this.cutoff) / (this.max - this.cutoff))
            Math.max(0, (w - this.settings[L].cutoff) / this.settings[L].scale)
          )), this.isDrawing && this.draw();
        }
      }
    }
    setCutoff(i) {
      this.cutoff = i, this.settings = this.settings.map((v) => (v.cutoff = i, v));
    }
    setSmooth(i) {
      this.smooth = i, this.settings = this.settings.map((v) => (v.smooth = i, v));
    }
    setBins(i) {
      this.bins = Array(i).fill(0), this.prevBins = Array(i).fill(0), this.fft = Array(i).fill(0), this.settings = Array(i).fill(0).map(() => ({
        cutoff: this.cutoff,
        scale: this.scale,
        smooth: this.smooth
      })), this.bins.forEach((v, _) => {
        window["a" + _] = (w = 1, L = 0) => () => a.fft[_] * w + L;
      });
    }
    setScale(i) {
      this.scale = i, this.settings = this.settings.map((v) => (v.scale = i, v));
    }
    setMax(i) {
      this.max = i, console.log("set max is deprecated");
    }
    hide() {
      this.isDrawing = !1, this.canvas.style.display = "none";
    }
    show() {
      this.isDrawing = !0, this.canvas.style.display = "block";
    }
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var i = this.canvas.width / this.bins.length, v = this.canvas.height / (this.max * 2);
      this.bins.forEach((_, w) => {
        var L = _ * v;
        this.ctx.fillRect(w * i, this.canvas.height - L, i, L);
        var te = this.canvas.height - v * this.settings[w].cutoff;
        this.ctx.beginPath(), this.ctx.moveTo(w * i, te), this.ctx.lineTo((w + 1) * i, te), this.ctx.stroke();
        var U = this.canvas.height - v * (this.settings[w].scale + this.settings[w].cutoff);
        this.ctx.beginPath(), this.ctx.moveTo(w * i, U), this.ctx.lineTo((w + 1) * i, U), this.ctx.stroke();
      });
    }
  }
  class zc {
    constructor(i) {
      this.mediaSource = new MediaSource(), this.stream = i, this.output = document.createElement("video"), this.output.autoplay = !0, this.output.loop = !0;
      let v = this;
      this.mediaSource.addEventListener("sourceopen", () => {
        console.log("MediaSource opened"), v.sourceBuffer = v.mediaSource.addSourceBuffer('video/webm; codecs="vp8"'), console.log("Source buffer: ", sourceBuffer);
      });
    }
    start() {
      let i = { mimeType: "video/webm;codecs=vp9" };
      this.recordedBlobs = [];
      try {
        this.mediaRecorder = new MediaRecorder(this.stream, i);
      } catch (v) {
        console.log("Unable to create MediaRecorder with options Object: ", v);
        try {
          i = { mimeType: "video/webm,codecs=vp9" }, this.mediaRecorder = new MediaRecorder(this.stream, i);
        } catch (_) {
          console.log("Unable to create MediaRecorder with options Object: ", _);
          try {
            i = "video/vp8", this.mediaRecorder = new MediaRecorder(this.stream, i);
          } catch (w) {
            alert(`MediaRecorder is not supported by this browser.

Try Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags.`), console.error("Exception while creating MediaRecorder:", w);
            return;
          }
        }
      }
      console.log("Created MediaRecorder", this.mediaRecorder, "with options", i), this.mediaRecorder.onstop = this._handleStop.bind(this), this.mediaRecorder.ondataavailable = this._handleDataAvailable.bind(this), this.mediaRecorder.start(100), console.log("MediaRecorder started", this.mediaRecorder);
    }
    stop() {
      this.mediaRecorder.stop();
    }
    _handleStop() {
      const i = new Blob(this.recordedBlobs, { type: this.mediaRecorder.mimeType }), v = window.URL.createObjectURL(i);
      this.output.src = v;
      const _ = document.createElement("a");
      _.style.display = "none", _.href = v;
      let w = /* @__PURE__ */ new Date();
      _.download = `hydra-${w.getFullYear()}-${w.getMonth() + 1}-${w.getDate()}-${w.getHours()}.${w.getMinutes()}.${w.getSeconds()}.webm`, document.body.appendChild(_), _.click(), setTimeout(() => {
        document.body.removeChild(_), window.URL.revokeObjectURL(v);
      }, 300);
    }
    _handleDataAvailable(i) {
      i.data && i.data.size > 0 && this.recordedBlobs.push(i.data);
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
  var jc = (c, i, v, _, w) => (c - i) * (w - _) / (v - i) + _, Ma = (c, i) => (c % i + i) % i;
  const Ko = {
    init: () => {
      Array.prototype.fast = function(c = 1) {
        return this._speed = c, this;
      }, Array.prototype.smooth = function(c = 1) {
        return this._smooth = c, this;
      }, Array.prototype.ease = function(c = "linear") {
        return typeof c == "function" ? (this._smooth = 1, this._ease = c) : Ga[c] && (this._smooth = 1, this._ease = Ga[c]), this;
      }, Array.prototype.offset = function(c = 0.5) {
        return this._offset = c % 1, this;
      }, Array.prototype.fit = function(c = 0, i = 1) {
        let v = Math.min(...this), _ = Math.max(...this);
        var w = this.map((L) => jc(L, v, _, c, i));
        return w._speed = this._speed, w._smooth = this._smooth, w._ease = this._ease, w;
      };
    },
    getValue: (c = []) => ({ time: i, bpm: v }) => {
      let _ = c._speed ? c._speed : 1, w = c._smooth ? c._smooth : 0, L = i * _ * (v / 60) + (c._offset || 0);
      if (w !== 0) {
        let te = c._ease ? c._ease : Ga.linear, U = L - w / 2, pe = c[Math.floor(Ma(U, c.length))], he = c[Math.floor(Ma(U + 1, c.length))], Ve = Math.min(Ma(U, 1) / w, 1);
        return te(Ve) * (he - pe) + pe;
      } else
        return c[Math.floor(L % c.length)], c[Math.floor(L % c.length)];
    }
  }, Xc = (c) => {
    var i = "", v = w(i), _ = (L, te) => {
      i += `
      var ${L} = ${te}
    `, v = w(i);
    };
    return {
      addToContext: _,
      eval: (L) => v.eval(L)
    };
    function w(L) {
      globalThis.eval(L);
      var te = function(U) {
        globalThis.eval(U);
      };
      return {
        eval: te
      };
    }
  };
  class Vc {
    constructor(i, v, _ = []) {
      this.makeGlobal = v, this.sandbox = Xc(), this.parent = i;
      var w = Object.keys(i);
      w.forEach((L) => this.add(L)), this.userProps = _;
    }
    add(i) {
      this.makeGlobal && (window[i] = this.parent[i]);
    }
    // sets on window as well as synth object if global (not needed for objects, which can be set directly)
    set(i, v) {
      this.makeGlobal && (window[i] = v), this.parent[i] = v;
    }
    tick() {
      this.makeGlobal && this.userProps.forEach((i) => {
        this.parent[i] = window[i];
      });
    }
    eval(i) {
      this.sandbox.eval(i);
    }
  }
  const Hc = {
    float: {
      vec4: { name: "sum", args: [[1, 1, 1, 1]] },
      vec2: { name: "sum", args: [[1, 1]] }
    }
  }, ka = (c) => (c = c.toString(), c.indexOf(".") < 0 && (c += "."), c);
  function Wc(c, i, v) {
    const _ = c.transform.inputs, w = c.userArgs, { generators: L } = c.synth, { src: te } = L;
    return _.map((U, pe) => {
      const he = {
        value: U.default,
        type: U.type,
        //
        isUniform: !1,
        name: U.name,
        vecLen: 0
        //  generateGlsl: null // function for creating glsl
      };
      if (he.type === "float" && (he.value = ka(U.default)), U.type.startsWith("vec"))
        try {
          he.vecLen = Number.parseInt(U.type.substr(3));
        } catch {
          console.log(`Error determining length of vector input type ${U.type} (${U.name})`);
        }
      if (w.length > pe) {
        if (he.value = w[pe], he.type === "vec4" && !(he.value.type === "GlslSource" || he.value.getTexture))
          throw new Error("Arguments must be a texture or GlslSource");
        typeof w[pe] == "function" ? (he.value = (Xe, ut, We) => {
          try {
            const st = w[pe](ut);
            return typeof st == "number" ? st : (console.warn("function does not return a number", w[pe]), U.default);
          } catch (st) {
            return console.warn("ERROR", st), U.default;
          }
        }, he.isUniform = !0) : w[pe].constructor === Array && (he.value = (Xe, ut, We) => Ko.getValue(w[pe])(ut), he.isUniform = !0);
      }
      if (!(i < 0)) {
        if (he.value && he.value.transforms) {
          const Xe = he.value.transforms[he.value.transforms.length - 1];
          if (Xe.transform.glsl_return_type !== U.type) {
            const ut = Hc[U.type];
            if (typeof ut < "u") {
              const We = ut[Xe.transform.glsl_return_type];
              if (typeof We < "u") {
                const { name: st, args: Pt } = We;
                he.value = he.value[st](...Pt);
              }
            }
          }
          he.isUniform = !1;
        } else if (he.type === "float" && typeof he.value == "number")
          he.value = ka(he.value);
        else if (he.type.startsWith("vec") && typeof he.value == "object" && Array.isArray(he.value))
          he.isUniform = !1, he.value = `${he.type}(${he.value.map(ka).join(", ")})`;
        else if (U.type === "sampler2D") {
          var Ve = he.value;
          he.value = () => Ve.getTexture(), he.isUniform = !0;
        } else if (he.value.getTexture && U.type === "vec4") {
          var Pe = he.value;
          he.value = te(Pe), he.isUniform = !1;
        }
        he.isUniform && (he.name += i);
      }
      return he;
    });
  }
  function Yc(c) {
    var i = {
      uniforms: [],
      // list of uniforms used in shader
      glslFunctions: [],
      // list of functions used in shader
      fragColor: ""
    }, v = Qo(c, i)("c", "st");
    i.fragColor = v;
    let _ = {};
    return i.uniforms.forEach((w) => _[w.name] = w), i.uniforms = Object.values(_), i;
  }
  function Ba(c, i) {
    return `${c}_i${i}`;
  }
  function Qo(c, i) {
    var v = (_, w) => "";
    return c.forEach((_, w) => {
      let L = Wc(_, i.uniforms.length);
      L.forEach((U) => {
        U.isUniform && i.uniforms.push(U);
      }), qc(_, i.glslFunctions) || i.glslFunctions.push(_);
      var te = v;
      _.transform.type === "src" ? v = (U, pe) => `${Wr(L, i)(`${U}${w}`, pe)}
         vec4 ${U} = ${Yr(`${U}${w}`, pe, _.name, L)};` : _.transform.type === "color" ? v = (U, pe) => `${Wr(L, i)(`${U}${w}`, pe)}
         ${te(U, pe)}
         ${U} = ${Yr(`${U}${w}`, `${U}`, _.name, L)};` : _.transform.type === "coord" ? v = (U, pe) => `${Wr(L, i)(`${U}${w}`, pe)}
         ${pe} = ${Yr(`${U}${w}`, `${pe}`, _.name, L)};
         ${te(U, pe)}` : _.transform.type === "combine" ? v = (U, pe) => (
        // combining two generated shader strings (i.e. for blend, mult, add funtions)
        `${Wr(L, i)(`${U}${w}`, pe)}
         ${te(U, pe)}
         ${U} = ${Yr(`${U}${w}`, `${U}`, _.name, L)};`
      ) : _.transform.type === "combineCoord" && (v = (U, pe) => `${Wr(L, i)(`${U}${w}`, pe)}
         ${pe} = ${Yr(`${U}${w}`, `${pe}`, _.name, L)};
         ${te(U, pe)}`);
    }), v;
  }
  function Wr(c, i) {
    let v = (w, L) => "";
    var _ = v;
    return c.forEach((w, L) => {
      w.value.transforms && (_ = v, v = (te, U) => {
        let pe = Ba(te, L), he = Ba(`${U}_${te}`, L);
        return `vec2 ${he} = ${U};${_(te, U)}
         ${Qo(w.value.transforms, i)(pe, he)}`;
      });
    }), v;
  }
  function Yr(c, i, v, _) {
    const w = _.map((L, te) => L.isUniform ? L.name : L.value && L.value.transforms ? Ba(c, te) : L.value).reduce((L, te) => `${L}, ${te}`, "");
    return `${v}(${i}${w})`;
  }
  function qc(c, i) {
    for (var v = 0; v < i.length; v++)
      if (c.name == i[v].name) return !0;
    return !1;
  }
  const Kc = {
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
    var i = c || this.defaultOutput;
    if (i) try {
      var v = this.glsl(i);
      this.synth.currentFunctions = [], i.render(v);
    } catch (_) {
      console.warn("shader could not compile", _);
    }
  };
  qr.prototype.glsl = function() {
    var c = [], i = [];
    return this.transforms.forEach((v) => {
      v.transform.type === "renderpass" ? console.warn("no support for renderpass") : i.push(v);
    }), i.length > 0 && c.push(this.compile(i)), c;
  };
  qr.prototype.compile = function(c) {
    var i = Yc(c, this.synth), v = {};
    i.uniforms.forEach((w) => {
      v[w.name] = w.value;
    });
    var _ = `#version 300 es
  precision ${this.defaultOutput.precision} float;
  ${Object.values(i.uniforms).map((w) => {
      let L = w.type;
      return w.type === "texture" && (L = "sampler2D"), `
      uniform ${L} ${w.name};`;
    }).join("")}
  uniform float time;
  uniform vec2 resolution;
  in vec2 uv;
  out vec4 fragColor;
  uniform sampler2D prevBuffer;

  ${Object.values(Kc).map((w) => `
            ${w.glsl}
          `).join("")}

  ${i.glslFunctions.map((w) => `
            ${w.transform.glsl}
          `).join("")}

  void main () {
    vec2 st = gl_FragCoord.xy/resolution.xy;

    ${i.fragColor}
    fragColor = c;
  }
  `;
    return {
      frag: _,
      uniforms: Object.assign({}, this.defaultUniforms, v)
    };
  };
  const Qc = () => [
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
  function Zc(c) {
    if (!c || typeof c != "string")
      return c;
    let i = c;
    return i = i.replace(/\btexture2D\s*\(/g, "texture("), i = i.replace(/\btexture2DLod\s*\(/g, "textureLod("), i = i.replace(/\btexture2DProj\s*\(/g, "textureProj("), i = i.replace(/\btextureCube\s*\(/g, "texture("), i = i.replace(/\btextureCubeLod\s*\(/g, "textureLod("), i = i.replace(/\bshadow2D\s*\(/g, "texture("), i = i.replace(/\bshadow2DProj\s*\(/g, "textureProj("), i;
  }
  function Jc(c) {
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
  class el {
    constructor({
      defaultUniforms: i,
      defaultOutput: v,
      extendTransforms: _ = [],
      changeListener: w = (() => {
      })
    } = {}) {
      this.defaultOutput = v, this.defaultUniforms = i, this.changeListener = w, this.extendTransforms = _, this.generators = {}, this.init();
    }
    init() {
      const i = Qc();
      return this.glslTransforms = {}, this.generators = Object.entries(this.generators).reduce((v, [_, w]) => (this.changeListener({ type: "remove", synth: this, method: _ }), v), {}), this.sourceClass = class extends qr {
      }, Array.isArray(this.extendTransforms) ? i.concat(this.extendTransforms) : typeof this.extendTransforms == "object" && this.extendTransforms.type && i.push(this.extendTransforms), i.map((v) => this.setFunction(v));
    }
    _addMethod(i, v) {
      const _ = this;
      if (this.glslTransforms[i] = v, v.type === "src") {
        const w = (...L) => new this.sourceClass({
          name: i,
          transform: v,
          userArgs: L,
          defaultOutput: this.defaultOutput,
          defaultUniforms: this.defaultUniforms,
          synth: _
        });
        return this.generators[i] = w, this.changeListener({ type: "add", synth: this, method: i }), w;
      } else
        this.sourceClass.prototype[i] = function(...w) {
          return this.transforms.push({ name: i, transform: v, userArgs: w, synth: _ }), this;
        };
    }
    setFunction(i) {
      var v = tl(i);
      v && this._addMethod(i.name, v);
    }
  }
  const Wo = {
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
  function tl(c) {
    let i = Wo[c.type];
    if (i) {
      let v = i.args.concat(c.inputs), _ = v.map((te) => `${te.type} ${te.name}`).join(", "), w = c.glsl3 || c.glsl;
      !c.glsl3 && Jc(w) && (w = Zc(w));
      let L = `
  ${i.returnType} ${c.name}(${_}) {
      ${w}
  }
`;
      return c.inputs = v.slice(1), Object.assign({}, c, { glsl: L });
    } else
      console.warn(`type ${c.type} not recognized`, c, Wo);
  }
  var On = { exports: {} }, rl = On.exports, Yo;
  function nl() {
    return Yo || (Yo = 1, (function(c, i) {
      (function(v, _) {
        c.exports = _();
      })(rl, (function() {
        var v = function(e) {
          return e instanceof Uint8Array || e instanceof Uint16Array || e instanceof Uint32Array || e instanceof Int8Array || e instanceof Int16Array || e instanceof Int32Array || e instanceof Float32Array || e instanceof Float64Array || e instanceof Uint8ClampedArray;
        }, _ = function(e, r) {
          for (var l = Object.keys(r), G = 0; G < l.length; ++G)
            e[l[G]] = r[l[G]];
          return e;
        }, w = `
`;
        function L(e) {
          return typeof atob < "u" ? atob(e) : "base64:" + e;
        }
        function te(e) {
          var r = new Error("(regl) " + e);
          throw console.error(r), r;
        }
        function U(e, r) {
          e || te(r);
        }
        function pe(e) {
          return e ? ": " + e : "";
        }
        function he(e, r, l) {
          e in r || te("unknown parameter (" + e + ")" + pe(l) + ". possible values: " + Object.keys(r).join());
        }
        function Ve(e, r) {
          v(e) || te(
            "invalid parameter type" + pe(r) + ". must be a typed array"
          );
        }
        function Pe(e, r) {
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
        function Xe(e, r, l) {
          Pe(e, r) || te(
            "invalid parameter type" + pe(l) + ". expected " + r + ", got " + typeof e
          );
        }
        function ut(e, r) {
          e >= 0 && (e | 0) === e || te("invalid parameter type, (" + e + ")" + pe(r) + ". must be a nonnegative integer");
        }
        function We(e, r, l) {
          r.indexOf(e) < 0 && te("invalid value" + pe(l) + ". must be one of: " + r);
        }
        var st = [
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
            st.indexOf(r) < 0 && te('invalid regl constructor argument "' + r + '". must be one of ' + st);
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
        function rt(e, r) {
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
`), G = 1, D = 0, F = {
            unknown: new Ue(),
            0: new Ue()
          };
          F.unknown.name = F[0].name = r || gt(), F.unknown.lines.push(new rt(0, ""));
          for (var k = 0; k < l.length; ++k) {
            var H = l[k], Y = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(H);
            if (Y)
              switch (Y[1]) {
                case "line":
                  var Z = /(\d+)(\s+\d+)?/.exec(Y[2]);
                  Z && (G = Z[1] | 0, Z[2] && (D = Z[2] | 0, D in F || (F[D] = new Ue())));
                  break;
                case "define":
                  var q = /SHADER_NAME(_B64)?\s+(.*)$/.exec(Y[2]);
                  q && (F[D].name = q[1] ? L(q[2]) : q[2]);
                  break;
              }
            F[D].lines.push(new rt(G++, H));
          }
          return Object.keys(F).forEach(function(re) {
            var oe = F[re];
            oe.lines.forEach(function(W) {
              oe.index[W.number] = W;
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
              var D = G.index[l.line];
              if (D) {
                D.errors.push(l), G.hasErrors = !0;
                return;
              }
            }
            e.unknown.hasErrors = !0, e.unknown.lines[0].errors.push(l);
          });
        }
        function Gn(e, r, l, G, D) {
          if (!e.getShaderParameter(r, e.COMPILE_STATUS)) {
            var F = e.getShaderInfoLog(r), k = G === e.FRAGMENT_SHADER ? "fragment" : "vertex";
            ee(l, "string", k + " shader source must be a string", D);
            var H = Bt(l, D), Y = Cn(F);
            Fn(H, Y), Object.keys(H).forEach(function(Z) {
              var q = H[Z];
              if (!q.hasErrors)
                return;
              var re = [""], oe = [""];
              function W(ne, A) {
                re.push(ne), oe.push(A || "");
              }
              W("file number " + Z + ": " + q.name + `
`, "color:red;text-decoration:underline;font-weight:bold"), q.lines.forEach(function(ne) {
                if (ne.errors.length > 0) {
                  W(pt(ne.number, 4) + "|  ", "background-color:yellow; font-weight:bold"), W(ne.line + w, "color:red; background-color:yellow; font-weight:bold");
                  var A = 0;
                  ne.errors.forEach(function(B) {
                    var Q = B.message, fe = /^\s*'(.*)'\s*:\s*(.*)$/.exec(Q);
                    if (fe) {
                      var z = fe[1];
                      Q = fe[2], z === "assign" && (z = "="), A = Math.max(ne.line.indexOf(z, A), 0);
                    } else
                      A = 0;
                    W(pt("| ", 6)), W(pt("^^^", A + 3) + w, "font-weight:bold"), W(pt("| ", 6)), W(Q + w, "font-weight:bold");
                  }), W(pt("| ", 6) + w);
                } else
                  W(pt(ne.number, 4) + "|  "), W(ne.line + w, "color:red");
              }), typeof document < "u" && !window.chrome ? (oe[0] = re.join("%c"), console.log.apply(console, oe)) : console.log(re.join(""));
            }), U.raise("Error compiling " + k + " shader, " + H[0].name);
          }
        }
        function Tr(e, r, l, G, D) {
          if (!e.getProgramParameter(r, e.LINK_STATUS)) {
            var F = e.getProgramInfoLog(r), k = Bt(l, D), H = Bt(G, D), Y = 'Error linking program with vertex shader, "' + H[0].name + '", and fragment shader "' + k[0].name + '"';
            typeof document < "u" ? console.log(
              "%c" + Y + w + "%c" + F,
              "color:red;text-decoration:underline;font-weight:bold",
              "color:red"
            ) : console.log(Y + w + F), U.raise(Y);
          }
        }
        function Sr(e) {
          e._commandRef = gt();
        }
        function R(e, r, l, G) {
          Sr(e);
          function D(Y) {
            return Y ? G.id(Y) : 0;
          }
          e._fragId = D(e.static.frag), e._vertId = D(e.static.vert);
          function F(Y, Z) {
            Object.keys(Z).forEach(function(q) {
              Y[G.id(q)] = !0;
            });
          }
          var k = e._uniformSet = {};
          F(k, r.static), F(k, r.dynamic);
          var H = e._attributeSet = {};
          F(H, l.static), F(H, l.dynamic), e._hasCount = "count" in e.static || "count" in e.dynamic || "elements" in e.static || "elements" in e.dynamic;
        }
        function y(e, r) {
          var l = fr();
          te(e + " in command " + (r || gt()) + (l === "unknown" ? "" : " called from " + l));
        }
        function j(e, r, l) {
          e || y(r, l || gt());
        }
        function C(e, r, l, G) {
          e in r || y(
            "unknown parameter (" + e + ")" + pe(l) + ". possible values: " + Object.keys(r).join(),
            G || gt()
          );
        }
        function ee(e, r, l, G) {
          Pe(e, r) || y(
            "invalid parameter type" + pe(l) + ". expected " + r + ", got " + typeof e,
            G || gt()
          );
        }
        function me(e) {
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
        var ke = 33071, Ae = 9728, xe = 9984, Ne = 9985, vt = 9986, Ie = 9987, Rt = 5120, wt = 5121, At = 5122, Lr = 5123, nt = 5124, mt = 5125, yt = 5126, Ft = 32819, Na = 32820, Da = 33635, Pa = 34042, Jo = 36193, Tt = {};
        Tt[Rt] = Tt[wt] = 1, Tt[At] = Tt[Lr] = Tt[Jo] = Tt[Da] = Tt[Ft] = Tt[Na] = 2, Tt[nt] = Tt[mt] = Tt[yt] = Tt[Pa] = 4;
        function Ua(e, r) {
          return e === Na || e === Ft || e === Da ? 2 : e === Pa ? 4 : Tt[e] * r;
        }
        function Kr(e) {
          return !(e & e - 1) && !!e;
        }
        function es(e, r, l) {
          var G, D = r.width, F = r.height, k = r.channels;
          U(
            D > 0 && D <= l.maxTextureSize && F > 0 && F <= l.maxTextureSize,
            "invalid texture shape"
          ), (e.wrapS !== ke || e.wrapT !== ke) && U(
            Kr(D) && Kr(F),
            "incompatible wrap mode for texture, both width and height must be power of 2"
          ), r.mipmask === 1 ? D !== 1 && F !== 1 && U(
            e.minFilter !== xe && e.minFilter !== vt && e.minFilter !== Ne && e.minFilter !== Ie,
            "min filter requires mipmap"
          ) : (U(
            Kr(D) && Kr(F),
            "texture must be a square power of 2 to support mipmapping"
          ), U(
            r.mipmask === (D << 1) - 1,
            "missing or incomplete mipmap data"
          )), r.type === yt && (l.extensions.indexOf("oes_texture_float_linear") < 0 && U(
            e.minFilter === Ae && e.magFilter === Ae,
            "filter not supported, must enable oes_texture_float_linear"
          ), U(
            !e.genMipmaps,
            "mipmap generation not supported with float textures"
          ));
          var H = r.images;
          for (G = 0; G < 16; ++G)
            if (H[G]) {
              var Y = D >> G, Z = F >> G;
              U(r.mipmask & 1 << G, "missing mipmap data");
              var q = H[G];
              if (U(
                q.width === Y && q.height === Z,
                "invalid shape for mip images"
              ), U(
                q.format === r.format && q.internalformat === r.internalformat && q.type === r.type,
                "incompatible type for mip image"
              ), !q.compressed) if (q.data) {
                var re = Math.ceil(Ua(q.type, k) * Y / q.unpackAlignment) * q.unpackAlignment;
                U(
                  q.data.byteLength === re * Z,
                  "invalid data for image, buffer size is inconsistent with image format"
                );
              } else q.element || q.copy;
            } else e.genMipmaps || U((r.mipmask & 1 << G) === 0, "extra mipmap data");
          r.compressed && U(
            !e.genMipmaps,
            "mipmap generation for compressed images not supported"
          );
        }
        function ts(e, r, l, G) {
          var D = e.width, F = e.height, k = e.channels;
          U(
            D > 0 && D <= G.maxTextureSize && F > 0 && F <= G.maxTextureSize,
            "invalid texture shape"
          ), U(
            D === F,
            "cube map must be square"
          ), U(
            r.wrapS === ke && r.wrapT === ke,
            "wrap mode not supported by cube map"
          );
          for (var H = 0; H < l.length; ++H) {
            var Y = l[H];
            U(
              Y.width === D && Y.height === F,
              "inconsistent cube map face shape"
            ), r.genMipmaps && (U(
              !Y.compressed,
              "can not generate mipmap for compressed textures"
            ), U(
              Y.mipmask === 1,
              "can not specify mipmaps and generate mipmaps"
            ));
            for (var Z = Y.images, q = 0; q < 16; ++q) {
              var re = Z[q];
              if (re) {
                var oe = D >> q, W = F >> q;
                U(Y.mipmask & 1 << q, "missing mipmap data"), U(
                  re.width === oe && re.height === W,
                  "invalid shape for mip images"
                ), U(
                  re.format === e.format && re.internalformat === e.internalformat && re.type === e.type,
                  "incompatible type for mip image"
                ), re.compressed || (re.data ? U(
                  re.data.byteLength === oe * W * Math.max(Ua(re.type, k), re.unpackAlignment),
                  "invalid data for image, buffer size is inconsistent with image format"
                ) : re.element || re.copy);
              }
            }
          }
        }
        var f = _(U, {
          optional: me,
          raise: te,
          commandRaise: y,
          command: j,
          parameter: he,
          commandParameter: C,
          constructor: Pt,
          type: Xe,
          commandType: ee,
          isTypedArray: Ve,
          nni: ut,
          oneOf: We,
          shaderError: Gn,
          linkError: Tr,
          callSite: fr,
          saveCommandRef: Sr,
          saveDrawInfo: R,
          framebufferFormat: Ce,
          guessCommand: gt,
          texture2D: es,
          textureCube: ts
        }), rs = 0, ns = 0, as = 5, is = 6;
        function qt(e, r) {
          this.id = rs++, this.type = e, this.data = r;
        }
        function $a(e) {
          return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        }
        function Rr(e) {
          if (e.length === 0)
            return [];
          var r = e.charAt(0), l = e.charAt(e.length - 1);
          if (e.length > 1 && r === l && (r === '"' || r === "'"))
            return ['"' + $a(e.substr(1, e.length - 2)) + '"'];
          var G = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(e);
          if (G)
            return Rr(e.substr(0, G.index)).concat(Rr(G[1])).concat(Rr(e.substr(G.index + G[0].length)));
          var D = e.split(".");
          if (D.length === 1)
            return ['"' + $a(e) + '"'];
          for (var F = [], k = 0; k < D.length; ++k)
            F = F.concat(Rr(D[k]));
          return F;
        }
        function za(e) {
          return "[" + Rr(e).join("][") + "]";
        }
        function os(e, r) {
          return new qt(e, za(r + ""));
        }
        function ss(e) {
          return typeof e == "function" && !e._reglType || e instanceof qt;
        }
        function ja(e, r) {
          if (typeof e == "function")
            return new qt(ns, e);
          if (typeof e == "number" || typeof e == "boolean")
            return new qt(as, e);
          if (Array.isArray(e))
            return new qt(is, e.map((l, G) => ja(l, r + "[" + G + "]")));
          if (e instanceof qt)
            return e;
          f(!1, "invalid option type in uniform " + r);
        }
        var St = {
          DynamicVariable: qt,
          define: os,
          isDynamic: ss,
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
        function fs() {
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
        function us(e, r, l) {
          var G = document.createElement("canvas");
          _(G.style, {
            border: 0,
            margin: 0,
            padding: 0,
            top: 0,
            left: 0
          }), e.appendChild(G), e === document.body && (G.style.position = "absolute", _(e.style, {
            margin: 0,
            padding: 0
          }));
          function D() {
            var H = window.innerWidth, Y = window.innerHeight;
            if (e !== document.body) {
              var Z = e.getBoundingClientRect();
              H = Z.right - Z.left, Y = Z.bottom - Z.top;
            }
            G.width = l * H, G.height = l * Y, _(G.style, {
              width: H + "px",
              height: Y + "px"
            });
          }
          var F;
          e !== document.body && typeof ResizeObserver == "function" ? (F = new ResizeObserver(function() {
            setTimeout(D);
          }), F.observe(e)) : window.addEventListener("resize", D, !1);
          function k() {
            F ? F.disconnect() : window.removeEventListener("resize", D), e.removeChild(G);
          }
          return D(), {
            canvas: G,
            onDestroy: k
          };
        }
        function cs(e, r) {
          function l(G) {
            try {
              return e.getContext(G, r);
            } catch {
              return null;
            }
          }
          return l("webgl") || l("experimental-webgl") || l("webgl-experimental");
        }
        function ls(e) {
          return typeof e.nodeName == "string" && typeof e.appendChild == "function" && typeof e.getBoundingClientRect == "function";
        }
        function ds(e) {
          return typeof e.drawArrays == "function" || typeof e.drawElements == "function";
        }
        function Va(e) {
          return typeof e == "string" ? e.split() : (f(Array.isArray(e), "invalid extension array"), e);
        }
        function Ha(e) {
          return typeof e == "string" ? (f(typeof document < "u", "not supported outside of DOM"), document.querySelector(e)) : e;
        }
        function hs(e) {
          var r = e || {}, l, G, D, F, k = {}, H = [], Y = [], Z = typeof window > "u" ? 1 : window.devicePixelRatio, q = !1, re = function(ne) {
            ne && f.raise(ne);
          }, oe = function() {
          };
          if (typeof r == "string" ? (f(
            typeof document < "u",
            "selector queries only supported in DOM enviroments"
          ), l = document.querySelector(r), f(l, "invalid query string for element")) : typeof r == "object" ? ls(r) ? l = r : ds(r) ? (F = r, D = F.canvas) : (f.constructor(r), "gl" in r ? F = r.gl : "canvas" in r ? D = Ha(r.canvas) : "container" in r && (G = Ha(r.container)), "attributes" in r && (k = r.attributes, f.type(k, "object", "invalid context attributes")), "extensions" in r && (H = Va(r.extensions)), "optionalExtensions" in r && (Y = Va(r.optionalExtensions)), "onDone" in r && (f.type(
            r.onDone,
            "function",
            "invalid or missing onDone callback"
          ), re = r.onDone), "profile" in r && (q = !!r.profile), "pixelRatio" in r && (Z = +r.pixelRatio, f(Z > 0, "invalid pixel ratio"))) : f.raise("invalid arguments to regl"), l && (l.nodeName.toLowerCase() === "canvas" ? D = l : G = l), !F) {
            if (!D) {
              f(
                typeof document < "u",
                "must manually specify webgl context outside of DOM environments"
              );
              var W = us(G || document.body, re, Z);
              if (!W)
                return null;
              D = W.canvas, oe = W.onDestroy;
            }
            k.premultipliedAlpha === void 0 && (k.premultipliedAlpha = !0), F = cs(D, k);
          }
          return F ? {
            gl: F,
            canvas: D,
            container: G,
            extensions: H,
            optionalExtensions: Y,
            pixelRatio: Z,
            profile: q,
            onDone: re,
            onDestroy: oe
          } : (oe(), re("webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org"), null);
        }
        function ms(e, r) {
          var l = {};
          function G(k) {
            f.type(k, "string", "extension name must be string");
            var H = k.toLowerCase(), Y;
            try {
              Y = l[H] = e.getExtension(H);
            } catch {
            }
            return !!Y;
          }
          for (var D = 0; D < r.extensions.length; ++D) {
            var F = r.extensions[D];
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
        var ps = 5120, vs = 5121, ys = 5122, _s = 5123, bs = 5124, gs = 5125, Es = 5126;
        function xs(e) {
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
            var k = xs(F), H = e[Wa(k) >> 2];
            return H.length > 0 ? H.pop() : new ArrayBuffer(k);
          }
          function l(F) {
            e[Wa(F.byteLength) >> 2].push(F);
          }
          function G(F, k) {
            var H = null;
            switch (F) {
              case ps:
                H = new Int8Array(r(k), 0, k);
                break;
              case vs:
                H = new Uint8Array(r(k), 0, k);
                break;
              case ys:
                H = new Int16Array(r(2 * k), 0, k);
                break;
              case _s:
                H = new Uint16Array(r(2 * k), 0, k);
                break;
              case bs:
                H = new Int32Array(r(4 * k), 0, k);
                break;
              case gs:
                H = new Uint32Array(r(4 * k), 0, k);
                break;
              case Es:
                H = new Float32Array(r(4 * k), 0, k);
                break;
              default:
                return null;
            }
            return H.length !== k ? H.subarray(0, k) : H;
          }
          function D(F) {
            l(F.buffer);
          }
          return {
            alloc: r,
            free: l,
            allocType: G,
            freeType: D
          };
        }
        var Ze = Ya();
        Ze.zero = Ya();
        var ws = 3408, As = 3410, Ts = 3411, Ss = 3412, Ls = 3413, Rs = 3414, Os = 3415, Cs = 33901, Fs = 33902, Gs = 3379, Ms = 3386, ks = 34921, Bs = 36347, Is = 36348, Ns = 35661, Ds = 35660, Ps = 34930, Us = 36349, $s = 34076, zs = 34024, js = 7936, Xs = 7937, Vs = 7938, Hs = 35724, Ws = 34047, Ys = 36063, qs = 34852, Qr = 3553, qa = 34067, Ks = 34069, Qs = 33984, Or = 6408, kn = 5126, Ka = 5121, Bn = 36160, Zs = 36053, Js = 36064, ef = 16384, tf = function(e, r) {
          var l = 1;
          r.ext_texture_filter_anisotropic && (l = e.getParameter(Ws));
          var G = 1, D = 1;
          r.webgl_draw_buffers && (G = e.getParameter(qs), D = e.getParameter(Ys));
          var F = !!r.oes_texture_float;
          if (F) {
            var k = e.createTexture();
            e.bindTexture(Qr, k), e.texImage2D(Qr, 0, Or, 1, 1, 0, Or, kn, null);
            var H = e.createFramebuffer();
            if (e.bindFramebuffer(Bn, H), e.framebufferTexture2D(Bn, Js, Qr, k, 0), e.bindTexture(Qr, null), e.checkFramebufferStatus(Bn) !== Zs) F = !1;
            else {
              e.viewport(0, 0, 1, 1), e.clearColor(1, 0, 0, 1), e.clear(ef);
              var Y = Ze.allocType(kn, 4);
              e.readPixels(0, 0, 1, 1, Or, kn, Y), e.getError() ? F = !1 : (e.deleteFramebuffer(H), e.deleteTexture(k), F = Y[0] === 1), Ze.freeType(Y);
            }
          }
          var Z = typeof navigator < "u" && (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion) || /Edge/.test(navigator.userAgent)), q = !0;
          if (!Z) {
            var re = e.createTexture(), oe = Ze.allocType(Ka, 36);
            e.activeTexture(Qs), e.bindTexture(qa, re), e.texImage2D(Ks, 0, Or, 3, 3, 0, Or, Ka, oe), Ze.freeType(oe), e.bindTexture(qa, null), e.deleteTexture(re), q = !e.getError();
          }
          return {
            // drawing buffer bit depth
            colorBits: [
              e.getParameter(As),
              e.getParameter(Ts),
              e.getParameter(Ss),
              e.getParameter(Ls)
            ],
            depthBits: e.getParameter(Rs),
            stencilBits: e.getParameter(Os),
            subpixelBits: e.getParameter(ws),
            // supported extensions
            extensions: Object.keys(r).filter(function(W) {
              return !!r[W];
            }),
            // max aniso samples
            maxAnisotropic: l,
            // max draw buffers
            maxDrawbuffers: G,
            maxColorAttachments: D,
            // point and line size ranges
            pointSizeDims: e.getParameter(Cs),
            lineWidthDims: e.getParameter(Fs),
            maxViewportDims: e.getParameter(Ms),
            maxCombinedTextureUnits: e.getParameter(Ns),
            maxCubeMapSize: e.getParameter($s),
            maxRenderbufferSize: e.getParameter(zs),
            maxTextureUnits: e.getParameter(Ps),
            maxTextureSize: e.getParameter(Gs),
            maxAttributes: e.getParameter(ks),
            maxVertexUniforms: e.getParameter(Bs),
            maxVertexTextureUnits: e.getParameter(Ds),
            maxVaryingVectors: e.getParameter(Is),
            maxFragmentUniforms: e.getParameter(Us),
            // vendor info
            glsl: e.getParameter(Hs),
            renderer: e.getParameter(Xs),
            vendor: e.getParameter(js),
            version: e.getParameter(Vs),
            // quirks
            readFloat: F,
            npotTextureCube: q
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
          shape: of,
          flatten: af
        };
        function rf(e, r, l) {
          for (var G = 0; G < r; ++G)
            l[G] = e[G];
        }
        function nf(e, r, l, G) {
          for (var D = 0, F = 0; F < r; ++F)
            for (var k = e[F], H = 0; H < l; ++H)
              G[D++] = k[H];
        }
        function Qa(e, r, l, G, D, F) {
          for (var k = F, H = 0; H < r; ++H)
            for (var Y = e[H], Z = 0; Z < l; ++Z)
              for (var q = Y[Z], re = 0; re < G; ++re)
                D[k++] = q[re];
        }
        function Za(e, r, l, G, D) {
          for (var F = 1, k = l + 1; k < r.length; ++k)
            F *= r[k];
          var H = r[l];
          if (r.length - l === 4) {
            var Y = r[l + 1], Z = r[l + 2], q = r[l + 3];
            for (k = 0; k < H; ++k)
              Qa(e[k], Y, Z, q, G, D), D += F;
          } else
            for (k = 0; k < H; ++k)
              Za(e[k], r, l + 1, G, D), D += F;
        }
        function af(e, r, l, G) {
          var D = 1;
          if (r.length)
            for (var F = 0; F < r.length; ++F)
              D *= r[F];
          else
            D = 0;
          var k = G || Ze.allocType(l, D);
          switch (r.length) {
            case 0:
              break;
            case 1:
              rf(e, r[0], k);
              break;
            case 2:
              nf(e, r[0], r[1], k);
              break;
            case 3:
              Qa(e, r[0], r[1], r[2], k, 0);
              break;
            default:
              Za(e, r, 0, k, 0);
          }
          return k;
        }
        function of(e) {
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
        }, sf = 5120, ff = 5122, uf = 5124, cf = 5121, lf = 5123, df = 5125, hf = 5126, mf = 5126, Kt = {
          int8: sf,
          int16: ff,
          int32: uf,
          uint8: cf,
          uint16: lf,
          uint32: df,
          float: hf,
          float32: mf
        }, pf = 35048, vf = 35040, Jr = {
          dynamic: pf,
          stream: vf,
          static: 35044
        }, Nn = Zr.flatten, Ja = Zr.shape, ei = 35044, yf = 35040, Dn = 5121, Pn = 5126, jt = [];
        jt[5120] = 1, jt[5122] = 2, jt[5124] = 4, jt[5121] = 1, jt[5123] = 2, jt[5125] = 4, jt[5126] = 4;
        function en(e) {
          return In[Object.prototype.toString.call(e)] | 0;
        }
        function ti(e, r) {
          for (var l = 0; l < r.length; ++l)
            e[l] = r[l];
        }
        function ri(e, r, l, G, D, F, k) {
          for (var H = 0, Y = 0; Y < l; ++Y)
            for (var Z = 0; Z < G; ++Z)
              e[H++] = r[D * Y + F * Z + k];
        }
        function _f(e, r, l, G) {
          var D = 0, F = {};
          function k(A) {
            this.id = D++, this.buffer = e.createBuffer(), this.type = A, this.usage = ei, this.byteLength = 0, this.dimension = 1, this.dtype = Dn, this.persistentData = null, l.profile && (this.stats = { size: 0 });
          }
          k.prototype.bind = function() {
            e.bindBuffer(this.type, this.buffer);
          }, k.prototype.destroy = function() {
            oe(this);
          };
          var H = [];
          function Y(A, B) {
            var Q = H.pop();
            return Q || (Q = new k(A)), Q.bind(), re(Q, B, yf, 0, 1, !1), Q;
          }
          function Z(A) {
            H.push(A);
          }
          function q(A, B, Q) {
            A.byteLength = B.byteLength, e.bufferData(A.type, B, Q);
          }
          function re(A, B, Q, fe, z, ue) {
            var V;
            if (A.usage = Q, Array.isArray(B)) {
              if (A.dtype = fe || Pn, B.length > 0) {
                var ae;
                if (Array.isArray(B[0])) {
                  V = Ja(B);
                  for (var X = 1, ie = 1; ie < V.length; ++ie)
                    X *= V[ie];
                  A.dimension = X, ae = Nn(B, V, A.dtype), q(A, ae, Q), ue ? A.persistentData = ae : Ze.freeType(ae);
                } else if (typeof B[0] == "number") {
                  A.dimension = z;
                  var ye = Ze.allocType(A.dtype, B.length);
                  ti(ye, B), q(A, ye, Q), ue ? A.persistentData = ye : Ze.freeType(ye);
                } else v(B[0]) ? (A.dimension = B[0].length, A.dtype = fe || en(B[0]) || Pn, ae = Nn(
                  B,
                  [B.length, B[0].length],
                  A.dtype
                ), q(A, ae, Q), ue ? A.persistentData = ae : Ze.freeType(ae)) : f.raise("invalid buffer data");
              }
            } else if (v(B))
              A.dtype = fe || en(B), A.dimension = z, q(A, B, Q), ue && (A.persistentData = new Uint8Array(new Uint8Array(B.buffer)));
            else if (Gt(B)) {
              V = B.shape;
              var Ee = B.stride, se = B.offset, J = 0, $ = 0, ge = 0, Se = 0;
              V.length === 1 ? (J = V[0], $ = 1, ge = Ee[0], Se = 0) : V.length === 2 ? (J = V[0], $ = V[1], ge = Ee[0], Se = Ee[1]) : f.raise("invalid shape"), A.dtype = fe || en(B.data) || Pn, A.dimension = $;
              var le = Ze.allocType(A.dtype, J * $);
              ri(
                le,
                B.data,
                J,
                $,
                ge,
                Se,
                se
              ), q(A, le, Q), ue ? A.persistentData = le : Ze.freeType(le);
            } else B instanceof ArrayBuffer ? (A.dtype = Dn, A.dimension = z, q(A, B, Q), ue && (A.persistentData = new Uint8Array(new Uint8Array(B)))) : f.raise("invalid buffer data");
          }
          function oe(A) {
            r.bufferCount--, G(A);
            var B = A.buffer;
            f(B, "buffer must not be deleted already"), e.deleteBuffer(B), A.buffer = null, delete F[A.id];
          }
          function W(A, B, Q, fe) {
            r.bufferCount++;
            var z = new k(B);
            F[z.id] = z;
            function ue(X) {
              var ie = ei, ye = null, Ee = 0, se = 0, J = 1;
              return Array.isArray(X) || v(X) || Gt(X) || X instanceof ArrayBuffer ? ye = X : typeof X == "number" ? Ee = X | 0 : X && (f.type(
                X,
                "object",
                "buffer arguments must be an object, a number or an array"
              ), "data" in X && (f(
                ye === null || Array.isArray(ye) || v(ye) || Gt(ye),
                "invalid data for buffer"
              ), ye = X.data), "usage" in X && (f.parameter(X.usage, Jr, "invalid buffer usage"), ie = Jr[X.usage]), "type" in X && (f.parameter(X.type, Kt, "invalid buffer type"), se = Kt[X.type]), "dimension" in X && (f.type(X.dimension, "number", "invalid dimension"), J = X.dimension | 0), "length" in X && (f.nni(Ee, "buffer length must be a nonnegative integer"), Ee = X.length | 0)), z.bind(), ye ? re(z, ye, ie, se, J, fe) : (Ee && e.bufferData(z.type, Ee, ie), z.dtype = se || Dn, z.usage = ie, z.dimension = J, z.byteLength = Ee), l.profile && (z.stats.size = z.byteLength * jt[z.dtype]), ue;
            }
            function V(X, ie) {
              f(
                ie + X.byteLength <= z.byteLength,
                "invalid buffer subdata call, buffer is too small.  Can't write data of size " + X.byteLength + " starting from offset " + ie + " to a buffer of size " + z.byteLength
              ), e.bufferSubData(z.type, ie, X);
            }
            function ae(X, ie) {
              var ye = (ie || 0) | 0, Ee;
              if (z.bind(), v(X) || X instanceof ArrayBuffer)
                V(X, ye);
              else if (Array.isArray(X)) {
                if (X.length > 0)
                  if (typeof X[0] == "number") {
                    var se = Ze.allocType(z.dtype, X.length);
                    ti(se, X), V(se, ye), Ze.freeType(se);
                  } else if (Array.isArray(X[0]) || v(X[0])) {
                    Ee = Ja(X);
                    var J = Nn(X, Ee, z.dtype);
                    V(J, ye), Ze.freeType(J);
                  } else
                    f.raise("invalid buffer data");
              } else if (Gt(X)) {
                Ee = X.shape;
                var $ = X.stride, ge = 0, Se = 0, le = 0, Fe = 0;
                Ee.length === 1 ? (ge = Ee[0], Se = 1, le = $[0], Fe = 0) : Ee.length === 2 ? (ge = Ee[0], Se = Ee[1], le = $[0], Fe = $[1]) : f.raise("invalid shape");
                var we = Array.isArray(X.data) ? z.dtype : en(X.data), Oe = Ze.allocType(we, ge * Se);
                ri(
                  Oe,
                  X.data,
                  ge,
                  Se,
                  le,
                  Fe,
                  X.offset
                ), V(Oe, ye), Ze.freeType(Oe);
              } else
                f.raise("invalid data for buffer subdata");
              return ue;
            }
            return Q || ue(A), ue._reglType = "buffer", ue._buffer = z, ue.subdata = ae, l.profile && (ue.stats = z.stats), ue.destroy = function() {
              oe(z);
            }, ue;
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
            create: W,
            createStream: Y,
            destroyStream: Z,
            clear: function() {
              Lt(F).forEach(oe), H.forEach(oe);
            },
            getBuffer: function(A) {
              return A && A._buffer instanceof k ? A._buffer : null;
            },
            restore: ne,
            _initBuffer: re
          };
        }
        var bf = 0, gf = 0, Ef = 1, xf = 1, wf = 4, Af = 4, ur = {
          points: bf,
          point: gf,
          lines: Ef,
          line: xf,
          triangles: wf,
          triangle: Af,
          "line loop": 2,
          "line strip": 3,
          "triangle strip": 5,
          "triangle fan": 6
        }, Tf = 0, Sf = 1, Cr = 4, Lf = 5120, cr = 5121, ni = 5122, lr = 5123, ai = 5124, Qt = 5125, Un = 34963, Rf = 35040, Of = 35044;
        function Cf(e, r, l, G) {
          var D = {}, F = 0, k = {
            uint8: cr,
            uint16: lr
          };
          r.oes_element_index_uint && (k.uint32 = Qt);
          function H(ne) {
            this.id = F++, D[this.id] = this, this.buffer = ne, this.primType = Cr, this.vertCount = 0, this.type = 0;
          }
          H.prototype.bind = function() {
            this.buffer.bind();
          };
          var Y = [];
          function Z(ne) {
            var A = Y.pop();
            return A || (A = new H(l.create(
              null,
              Un,
              !0,
              !1
            )._buffer)), re(A, ne, Rf, -1, -1, 0, 0), A;
          }
          function q(ne) {
            Y.push(ne);
          }
          function re(ne, A, B, Q, fe, z, ue) {
            ne.buffer.bind();
            var V;
            if (A) {
              var ae = ue;
              !ue && (!v(A) || Gt(A) && !v(A.data)) && (ae = r.oes_element_index_uint ? Qt : lr), l._initBuffer(
                ne.buffer,
                A,
                B,
                ae,
                3
              );
            } else
              e.bufferData(Un, z, B), ne.buffer.dtype = V || cr, ne.buffer.usage = B, ne.buffer.dimension = 3, ne.buffer.byteLength = z;
            if (V = ue, !ue) {
              switch (ne.buffer.dtype) {
                case cr:
                case Lf:
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
              ne.buffer.dtype = V;
            }
            ne.type = V, f(
              V !== Qt || !!r.oes_element_index_uint,
              "32 bit element buffers not supported, enable oes_element_index_uint first"
            );
            var X = fe;
            X < 0 && (X = ne.buffer.byteLength, V === lr ? X >>= 1 : V === Qt && (X >>= 2)), ne.vertCount = X;
            var ie = Q;
            if (Q < 0) {
              ie = Cr;
              var ye = ne.buffer.dimension;
              ye === 1 && (ie = Tf), ye === 2 && (ie = Sf), ye === 3 && (ie = Cr);
            }
            ne.primType = ie;
          }
          function oe(ne) {
            G.elementsCount--, f(ne.buffer !== null, "must not double destroy elements"), delete D[ne.id], ne.buffer.destroy(), ne.buffer = null;
          }
          function W(ne, A) {
            var B = l.create(null, Un, !0), Q = new H(B._buffer);
            G.elementsCount++;
            function fe(z) {
              if (!z)
                B(), Q.primType = Cr, Q.vertCount = 0, Q.type = cr;
              else if (typeof z == "number")
                B(z), Q.primType = Cr, Q.vertCount = z | 0, Q.type = cr;
              else {
                var ue = null, V = Of, ae = -1, X = -1, ie = 0, ye = 0;
                Array.isArray(z) || v(z) || Gt(z) ? ue = z : (f.type(z, "object", "invalid arguments for elements"), "data" in z && (ue = z.data, f(
                  Array.isArray(ue) || v(ue) || Gt(ue),
                  "invalid data for element buffer"
                )), "usage" in z && (f.parameter(
                  z.usage,
                  Jr,
                  "invalid element buffer usage"
                ), V = Jr[z.usage]), "primitive" in z && (f.parameter(
                  z.primitive,
                  ur,
                  "invalid element buffer primitive"
                ), ae = ur[z.primitive]), "count" in z && (f(
                  typeof z.count == "number" && z.count >= 0,
                  "invalid vertex count for elements"
                ), X = z.count | 0), "type" in z && (f.parameter(
                  z.type,
                  k,
                  "invalid buffer type"
                ), ye = k[z.type]), "length" in z ? ie = z.length | 0 : (ie = X, ye === lr || ye === ni ? ie *= 2 : (ye === Qt || ye === ai) && (ie *= 4))), re(
                  Q,
                  ue,
                  V,
                  ae,
                  X,
                  ie,
                  ye
                );
              }
              return fe;
            }
            return fe(ne), fe._reglType = "elements", fe._elements = Q, fe.subdata = function(z, ue) {
              return B.subdata(z, ue), fe;
            }, fe.destroy = function() {
              oe(Q);
            }, fe;
          }
          return {
            create: W,
            createStream: Z,
            destroyStream: q,
            getElements: function(ne) {
              return typeof ne == "function" && ne._elements instanceof H ? ne._elements : null;
            },
            clear: function() {
              Lt(D).forEach(oe);
            }
          };
        }
        var ii = new Float32Array(1), Ff = new Uint32Array(ii.buffer), Gf = 5123;
        function oi(e) {
          for (var r = Ze.allocType(Gf, e.length), l = 0; l < e.length; ++l)
            if (isNaN(e[l]))
              r[l] = 65535;
            else if (e[l] === 1 / 0)
              r[l] = 31744;
            else if (e[l] === -1 / 0)
              r[l] = 64512;
            else {
              ii[0] = e[l];
              var G = Ff[0], D = G >>> 31 << 15, F = (G << 1 >>> 24) - 127, k = G >> 13 & 1023;
              if (F < -24)
                r[l] = D;
              else if (F < -14) {
                var H = -14 - F;
                r[l] = D + (k + 1024 >> H);
              } else F > 15 ? r[l] = D + 31744 : r[l] = D + (F + 15 << 10) + k;
            }
          return r;
        }
        function qe(e) {
          return Array.isArray(e) || v(e);
        }
        var si = function(e) {
          return !(e & e - 1) && !!e;
        }, Mf = 34467, It = 3553, $n = 34067, tn = 34069, Zt = 6408, zn = 6406, rn = 6407, Fr = 6409, nn = 6410, fi = 32854, jn = 32855, ui = 36194, kf = 32819, Bf = 32820, If = 33635, Nf = 34042, Xn = 6402, an = 34041, Vn = 35904, Hn = 35906, dr = 36193, Wn = 33776, Yn = 33777, qn = 33778, Kn = 33779, ci = 35986, li = 35987, di = 34798, hi = 35840, mi = 35841, pi = 35842, vi = 35843, yi = 36196, hr = 5121, Qn = 5123, Zn = 5125, Gr = 5126, Df = 10242, Pf = 10243, Uf = 10497, Jn = 33071, $f = 33648, zf = 10240, jf = 10241, ea = 9728, Xf = 9729, ta = 9984, _i = 9985, bi = 9986, ra = 9987, Vf = 33170, on = 4352, Hf = 4353, Wf = 4354, Yf = 34046, qf = 3317, Kf = 37440, Qf = 37441, Zf = 37443, gi = 37444, Mr = 33984, Jf = [
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
        var Ei = mr("HTMLCanvasElement"), xi = mr("OffscreenCanvas"), wi = mr("CanvasRenderingContext2D"), Ai = mr("ImageBitmap"), Ti = mr("HTMLImageElement"), Si = mr("HTMLVideoElement"), eu = Object.keys(In).concat([
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
        function tu(e) {
          return Jt(e) === wi;
        }
        function ru(e) {
          return Jt(e) === Ai;
        }
        function nu(e) {
          return Jt(e) === Ti;
        }
        function au(e) {
          return Jt(e) === Si;
        }
        function na(e) {
          if (!e)
            return !1;
          var r = Jt(e);
          return eu.indexOf(r) >= 0 ? !0 : Li(e) || Ri(e) || Gt(e);
        }
        function Fi(e) {
          return In[Object.prototype.toString.call(e)] | 0;
        }
        function iu(e, r) {
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
        function ou(e, r, l, G, D, F) {
          for (var k = e.width, H = e.height, Y = e.channels, Z = k * H * Y, q = Gi(e, Z), re = 0, oe = 0; oe < H; ++oe)
            for (var W = 0; W < k; ++W)
              for (var ne = 0; ne < Y; ++ne)
                q[re++] = r[l * W + G * oe + D * ne + F];
          Mi(e, q);
        }
        function fn(e, r, l, G, D, F) {
          var k;
          if (typeof lt[e] < "u" ? k = lt[e] : k = Ot[e] * pr[r], F && (k *= 6), D) {
            for (var H = 0, Y = l; Y >= 1; )
              H += k * Y * Y, Y /= 2;
            return H;
          } else
            return k * l * G;
        }
        function su(e, r, l, G, D, F, k) {
          var H = {
            "don't care": on,
            "dont care": on,
            nice: Wf,
            fast: Hf
          }, Y = {
            repeat: Uf,
            clamp: Jn,
            mirror: $f
          }, Z = {
            nearest: ea,
            linear: Xf
          }, q = _({
            mipmap: ra,
            "nearest mipmap nearest": ta,
            "linear mipmap nearest": _i,
            "nearest mipmap linear": bi,
            "linear mipmap linear": ra
          }, Z), re = {
            none: 0,
            browser: gi
          }, oe = {
            uint8: hr,
            rgba4: kf,
            rgb565: If,
            "rgb5 a1": Bf
          }, W = {
            alpha: zn,
            luminance: Fr,
            "luminance alpha": nn,
            rgb: rn,
            rgba: Zt,
            rgba4: fi,
            "rgb5 a1": jn,
            rgb565: ui
          }, ne = {};
          r.ext_srgb && (W.srgb = Vn, W.srgba = Hn), r.oes_texture_float && (oe.float32 = oe.float = Gr), r.oes_texture_half_float && (oe.float16 = oe["half float"] = dr), r.webgl_depth_texture && (_(W, {
            depth: Xn,
            "depth stencil": an
          }), _(oe, {
            uint16: Qn,
            uint32: Zn,
            "depth stencil": Nf
          })), r.webgl_compressed_texture_s3tc && _(ne, {
            "rgb s3tc dxt1": Wn,
            "rgba s3tc dxt1": Yn,
            "rgba s3tc dxt3": qn,
            "rgba s3tc dxt5": Kn
          }), r.webgl_compressed_texture_atc && _(ne, {
            "rgb atc": ci,
            "rgba atc explicit alpha": li,
            "rgba atc interpolated alpha": di
          }), r.webgl_compressed_texture_pvrtc && _(ne, {
            "rgb pvrtc 4bppv1": hi,
            "rgb pvrtc 2bppv1": mi,
            "rgba pvrtc 4bppv1": pi,
            "rgba pvrtc 2bppv1": vi
          }), r.webgl_compressed_texture_etc1 && (ne["rgb etc1"] = yi);
          var A = Array.prototype.slice.call(
            e.getParameter(Mf)
          );
          Object.keys(ne).forEach(function(u) {
            var M = ne[u];
            A.indexOf(M) >= 0 && (W[u] = M);
          });
          var B = Object.keys(W);
          l.textureFormats = B;
          var Q = [];
          Object.keys(W).forEach(function(u) {
            var M = W[u];
            Q[M] = u;
          });
          var fe = [];
          Object.keys(oe).forEach(function(u) {
            var M = oe[u];
            fe[M] = u;
          });
          var z = [];
          Object.keys(Z).forEach(function(u) {
            var M = Z[u];
            z[M] = u;
          });
          var ue = [];
          Object.keys(q).forEach(function(u) {
            var M = q[u];
            ue[M] = u;
          });
          var V = [];
          Object.keys(Y).forEach(function(u) {
            var M = Y[u];
            V[M] = u;
          });
          var ae = B.reduce(function(u, M) {
            var O = W[M];
            return O === Fr || O === zn || O === Fr || O === nn || O === Xn || O === an || r.ext_srgb && (O === Vn || O === Hn) ? u[O] = O : O === jn || M.indexOf("rgba") >= 0 ? u[O] = Zt : u[O] = rn, u;
          }, {});
          function X() {
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
              var ce = u.width, Ge = u.height, o = u.channels, t = !1;
              "shape" in M ? (f(
                Array.isArray(M.shape) && M.shape.length >= 2,
                "shape must be an array"
              ), ce = M.shape[0], Ge = M.shape[1], M.shape.length === 3 && (o = M.shape[2], f(o > 0 && o <= 4, "invalid number of channels"), t = !0), f(ce >= 0 && ce <= l.maxTextureSize, "invalid width"), f(Ge >= 0 && Ge <= l.maxTextureSize, "invalid height")) : ("radius" in M && (ce = Ge = M.radius, f(ce >= 0 && ce <= l.maxTextureSize, "invalid radius")), "width" in M && (ce = M.width, f(ce >= 0 && ce <= l.maxTextureSize, "invalid width")), "height" in M && (Ge = M.height, f(Ge >= 0 && Ge <= l.maxTextureSize, "invalid height")), "channels" in M && (o = M.channels, f(o > 0 && o <= 4, "invalid number of channels"), t = !0)), u.width = ce | 0, u.height = Ge | 0, u.channels = o | 0;
              var h = !1;
              if ("format" in M) {
                var E = M.format;
                f(
                  r.webgl_depth_texture || !(E === "depth" || E === "depth stencil"),
                  "you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures."
                ), f.parameter(
                  E,
                  W,
                  "invalid texture format"
                );
                var T = u.internalformat = W[E];
                u.format = ae[T], E in oe && ("type" in M || (u.type = oe[E])), E in ne && (u.compressed = !0), h = !0;
              }
              !t && h ? u.channels = Ot[u.format] : t && !h ? u.channels !== sn[u.format] && (u.format = u.internalformat = sn[u.channels]) : h && t && f(
                u.channels === Ot[u.format],
                "number of channels inconsistent with specified format"
              );
            }
          }
          function Ee(u) {
            e.pixelStorei(Kf, u.flipY), e.pixelStorei(Qf, u.premultiplyAlpha), e.pixelStorei(Zf, u.colorSpace), e.pixelStorei(qf, u.unpackAlignment);
          }
          function se() {
            X.call(this), this.xOffset = 0, this.yOffset = 0, this.data = null, this.needsFree = !1, this.element = null, this.needsCopy = !1;
          }
          function J(u, M) {
            var O = null;
            if (na(M) ? O = M : M && (f.type(M, "object", "invalid pixel data type"), ye(u, M), "x" in M && (u.xOffset = M.x | 0), "y" in M && (u.yOffset = M.y | 0), na(M.data) && (O = M.data)), f(
              !u.compressed || O instanceof Uint8Array,
              "compressed texture data must be stored in a uint8array"
            ), M.copy) {
              f(!O, "can not specify copy and data field for the same texture");
              var ce = D.viewportWidth, Ge = D.viewportHeight;
              u.width = u.width || ce - u.xOffset, u.height = u.height || Ge - u.yOffset, u.needsCopy = !0, f(
                u.xOffset >= 0 && u.xOffset < ce && u.yOffset >= 0 && u.yOffset < Ge && u.width > 0 && u.width <= ce && u.height > 0 && u.height <= Ge,
                "copy texture read out of bounds"
              );
            } else if (!O)
              u.width = u.width || 1, u.height = u.height || 1, u.channels = u.channels || 4;
            else if (v(O))
              u.channels = u.channels || 4, u.data = O, !("type" in M) && u.type === hr && (u.type = Fi(O));
            else if (Li(O))
              u.channels = u.channels || 4, iu(u, O), u.alignment = 1, u.needsFree = !0;
            else if (Gt(O)) {
              var o = O.data;
              !Array.isArray(o) && u.type === hr && (u.type = Fi(o));
              var t = O.shape, h = O.stride, E, T, p, m, b, s;
              t.length === 3 ? (p = t[2], s = h[2]) : (f(t.length === 2, "invalid ndarray pixel data, must be 2 or 3D"), p = 1, s = 1), E = t[0], T = t[1], m = h[0], b = h[1], u.alignment = 1, u.width = E, u.height = T, u.channels = p, u.format = u.internalformat = sn[p], u.needsFree = !0, ou(u, o, m, b, s, O.offset);
            } else if (Oi(O) || Ci(O) || tu(O))
              Oi(O) || Ci(O) ? u.element = O : u.element = O.canvas, u.width = u.element.width, u.height = u.element.height, u.channels = 4;
            else if (ru(O))
              u.element = O, u.width = O.width, u.height = O.height, u.channels = 4;
            else if (nu(O))
              u.element = O, u.width = O.naturalWidth, u.height = O.naturalHeight, u.channels = 4;
            else if (au(O))
              u.element = O, u.width = O.videoWidth, u.height = O.videoHeight, u.channels = 4;
            else if (Ri(O)) {
              var d = u.width || O[0].length, n = u.height || O.length, g = u.channels;
              qe(O[0][0]) ? g = g || O[0][0].length : g = g || 1;
              for (var S = Zr.shape(O), N = 1, P = 0; P < S.length; ++P)
                N *= S[P];
              var I = Gi(u, N);
              Zr.flatten(O, S, "", I), Mi(u, I), u.alignment = 1, u.width = d, u.height = n, u.channels = g, u.format = u.internalformat = sn[g], u.needsFree = !0;
            }
            u.type === Gr ? f(
              l.extensions.indexOf("oes_texture_float") >= 0,
              "oes_texture_float extension not enabled"
            ) : u.type === dr && f(
              l.extensions.indexOf("oes_texture_half_float") >= 0,
              "oes_texture_half_float extension not enabled"
            );
          }
          function $(u, M, O) {
            var ce = u.element, Ge = u.data, o = u.internalformat, t = u.format, h = u.type, E = u.width, T = u.height;
            Ee(u), ce ? e.texImage2D(M, O, t, t, h, ce) : u.compressed ? e.compressedTexImage2D(M, O, o, E, T, 0, Ge) : u.needsCopy ? (G(), e.copyTexImage2D(
              M,
              O,
              t,
              u.xOffset,
              u.yOffset,
              E,
              T,
              0
            )) : e.texImage2D(M, O, t, E, T, 0, t, h, Ge || null);
          }
          function ge(u, M, O, ce, Ge) {
            var o = u.element, t = u.data, h = u.internalformat, E = u.format, T = u.type, p = u.width, m = u.height;
            Ee(u), o ? e.texSubImage2D(
              M,
              Ge,
              O,
              ce,
              E,
              T,
              o
            ) : u.compressed ? e.compressedTexSubImage2D(
              M,
              Ge,
              O,
              ce,
              h,
              p,
              m,
              t
            ) : u.needsCopy ? (G(), e.copyTexSubImage2D(
              M,
              Ge,
              O,
              ce,
              u.xOffset,
              u.yOffset,
              p,
              m
            )) : e.texSubImage2D(
              M,
              Ge,
              O,
              ce,
              p,
              m,
              E,
              T,
              t
            );
          }
          var Se = [];
          function le() {
            return Se.pop() || new se();
          }
          function Fe(u) {
            u.needsFree && Ze.freeType(u.data), se.call(u), Se.push(u);
          }
          function we() {
            X.call(this), this.genMipmaps = !1, this.mipmapHint = on, this.mipmask = 0, this.images = Array(16);
          }
          function Oe(u, M, O) {
            var ce = u.images[0] = le();
            u.mipmask = 1, ce.width = u.width = M, ce.height = u.height = O, ce.channels = u.channels = 4;
          }
          function $e(u, M) {
            var O = null;
            if (na(M))
              O = u.images[0] = le(), ie(O, u), J(O, M), u.mipmask = 1;
            else if (ye(u, M), Array.isArray(M.mipmap))
              for (var ce = M.mipmap, Ge = 0; Ge < ce.length; ++Ge)
                O = u.images[Ge] = le(), ie(O, u), O.width >>= Ge, O.height >>= Ge, J(O, ce[Ge]), u.mipmask |= 1 << Ge;
            else
              O = u.images[0] = le(), ie(O, u), J(O, M), u.mipmask = 1;
            ie(u, u.images[0]), u.compressed && (u.internalformat === Wn || u.internalformat === Yn || u.internalformat === qn || u.internalformat === Kn) && f(
              u.width % 4 === 0 && u.height % 4 === 0,
              "for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4"
            );
          }
          function et(u, M) {
            for (var O = u.images, ce = 0; ce < O.length; ++ce) {
              if (!O[ce])
                return;
              $(O[ce], M, ce);
            }
          }
          var ft = [];
          function Be() {
            var u = ft.pop() || new we();
            X.call(u), u.mipmask = 0;
            for (var M = 0; M < 16; ++M)
              u.images[M] = null;
            return u;
          }
          function at(u) {
            for (var M = u.images, O = 0; O < M.length; ++O)
              M[O] && Fe(M[O]), M[O] = null;
            ft.push(u);
          }
          function He() {
            this.minFilter = ea, this.magFilter = ea, this.wrapS = Jn, this.wrapT = Jn, this.anisotropic = 1, this.genMipmaps = !1, this.mipmapHint = on;
          }
          function tt(u, M) {
            if ("min" in M) {
              var O = M.min;
              f.parameter(O, q), u.minFilter = q[O], Jf.indexOf(u.minFilter) >= 0 && !("faces" in M) && (u.genMipmaps = !0);
            }
            if ("mag" in M) {
              var ce = M.mag;
              f.parameter(ce, Z), u.magFilter = Z[ce];
            }
            var Ge = u.wrapS, o = u.wrapT;
            if ("wrap" in M) {
              var t = M.wrap;
              typeof t == "string" ? (f.parameter(t, Y), Ge = o = Y[t]) : Array.isArray(t) && (f.parameter(t[0], Y), f.parameter(t[1], Y), Ge = Y[t[0]], o = Y[t[1]]);
            } else {
              if ("wrapS" in M) {
                var h = M.wrapS;
                f.parameter(h, Y), Ge = Y[h];
              }
              if ("wrapT" in M) {
                var E = M.wrapT;
                f.parameter(E, Y), o = Y[E];
              }
            }
            if (u.wrapS = Ge, u.wrapT = o, "anisotropic" in M) {
              var T = M.anisotropic;
              f(
                typeof T == "number" && T >= 1 && T <= l.maxAnisotropic,
                "aniso samples must be between 1 and "
              ), u.anisotropic = M.anisotropic;
            }
            if ("mipmap" in M) {
              var p = !1;
              switch (typeof M.mipmap) {
                case "string":
                  f.parameter(
                    M.mipmap,
                    H,
                    "invalid mipmap hint"
                  ), u.mipmapHint = H[M.mipmap], u.genMipmaps = !0, p = !0;
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
          function it(u, M) {
            e.texParameteri(M, jf, u.minFilter), e.texParameteri(M, zf, u.magFilter), e.texParameteri(M, Df, u.wrapS), e.texParameteri(M, Pf, u.wrapT), r.ext_texture_filter_anisotropic && e.texParameteri(M, Yf, u.anisotropic), u.genMipmaps && (e.hint(Vf, u.mipmapHint), e.generateMipmap(M));
          }
          var ot = 0, ct = {}, dt = l.maxTextureUnits, Ke = Array(dt).map(function() {
            return null;
          });
          function Le(u) {
            X.call(this), this.mipmask = 0, this.internalformat = Zt, this.id = ot++, this.refCount = 1, this.target = u, this.texture = e.createTexture(), this.unit = -1, this.bindCount = 0, this.texInfo = new He(), k.profile && (this.stats = { size: 0 });
          }
          function ht(u) {
            e.activeTexture(Mr), e.bindTexture(u.target, u.texture);
          }
          function je() {
            var u = Ke[0];
            u ? e.bindTexture(u.target, u.texture) : e.bindTexture(It, null);
          }
          function _e(u) {
            var M = u.texture;
            f(M, "must not double destroy texture");
            var O = u.unit, ce = u.target;
            O >= 0 && (e.activeTexture(Mr + O), e.bindTexture(ce, null), Ke[O] = null), e.deleteTexture(M), u.texture = null, u.params = null, u.pixels = null, u.refCount = 0, delete ct[u.id], F.textureCount--;
          }
          _(Le.prototype, {
            bind: function() {
              var u = this;
              u.bindCount += 1;
              var M = u.unit;
              if (M < 0) {
                for (var O = 0; O < dt; ++O) {
                  var ce = Ke[O];
                  if (ce) {
                    if (ce.bindCount > 0)
                      continue;
                    ce.unit = -1;
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
            function ce(t, h) {
              var E = O.texInfo;
              He.call(E);
              var T = Be();
              return typeof t == "number" ? typeof h == "number" ? Oe(T, t | 0, h | 0) : Oe(T, t | 0, t | 0) : t ? (f.type(t, "object", "invalid arguments to regl.texture"), tt(E, t), $e(T, t)) : Oe(T, 1, 1), E.genMipmaps && (T.mipmask = (T.width << 1) - 1), O.mipmask = T.mipmask, ie(O, T), f.texture2D(E, T, l), O.internalformat = T.internalformat, ce.width = T.width, ce.height = T.height, ht(O), et(T, It), it(E, It), je(), at(T), k.profile && (O.stats.size = fn(
                O.internalformat,
                O.type,
                T.width,
                T.height,
                E.genMipmaps,
                !1
              )), ce.format = Q[O.internalformat], ce.type = fe[O.type], ce.mag = z[E.magFilter], ce.min = ue[E.minFilter], ce.wrapS = V[E.wrapS], ce.wrapT = V[E.wrapT], ce;
            }
            function Ge(t, h, E, T) {
              f(!!t, "must specify image data");
              var p = h | 0, m = E | 0, b = T | 0, s = le();
              return ie(s, O), s.width = 0, s.height = 0, J(s, t), s.width = s.width || (O.width >> b) - p, s.height = s.height || (O.height >> b) - m, f(
                O.type === s.type && O.format === s.format && O.internalformat === s.internalformat,
                "incompatible format for texture.subimage"
              ), f(
                p >= 0 && m >= 0 && p + s.width <= O.width && m + s.height <= O.height,
                "texture.subimage write out of bounds"
              ), f(
                O.mipmask & 1 << b,
                "missing mipmap data"
              ), f(
                s.data || s.element || s.needsCopy,
                "missing image data"
              ), ht(O), ge(s, It, p, m, b), je(), Fe(s), ce;
            }
            function o(t, h) {
              var E = t | 0, T = h | 0 || E;
              if (E === O.width && T === O.height)
                return ce;
              ce.width = O.width = E, ce.height = O.height = T, ht(O);
              for (var p = 0; O.mipmask >> p; ++p) {
                var m = E >> p, b = T >> p;
                if (!m || !b) break;
                e.texImage2D(
                  It,
                  p,
                  O.format,
                  m,
                  b,
                  0,
                  O.format,
                  O.type,
                  null
                );
              }
              return je(), k.profile && (O.stats.size = fn(
                O.internalformat,
                O.type,
                E,
                T,
                !1,
                !1
              )), ce;
            }
            return ce(u, M), ce.subimage = Ge, ce.resize = o, ce._reglType = "texture2d", ce._texture = O, k.profile && (ce.stats = O.stats), ce.destroy = function() {
              O.decRef();
            }, ce;
          }
          function De(u, M, O, ce, Ge, o) {
            var t = new Le($n);
            ct[t.id] = t, F.cubeCount++;
            var h = new Array(6);
            function E(m, b, s, d, n, g) {
              var S, N = t.texInfo;
              for (He.call(N), S = 0; S < 6; ++S)
                h[S] = Be();
              if (typeof m == "number" || !m) {
                var P = m | 0 || 1;
                for (S = 0; S < 6; ++S)
                  Oe(h[S], P, P);
              } else if (typeof m == "object")
                if (b)
                  $e(h[0], m), $e(h[1], b), $e(h[2], s), $e(h[3], d), $e(h[4], n), $e(h[5], g);
                else if (tt(N, m), ye(t, m), "faces" in m) {
                  var I = m.faces;
                  for (f(
                    Array.isArray(I) && I.length === 6,
                    "cube faces must be a length 6 array"
                  ), S = 0; S < 6; ++S)
                    f(
                      typeof I[S] == "object" && !!I[S],
                      "invalid input for cube map face"
                    ), ie(h[S], t), $e(h[S], I[S]);
                } else
                  for (S = 0; S < 6; ++S)
                    $e(h[S], m);
              else
                f.raise("invalid arguments to cube map");
              for (ie(t, h[0]), l.npotTextureCube || f(si(t.width) && si(t.height), "your browser does not support non power or two texture dimensions"), N.genMipmaps ? t.mipmask = (h[0].width << 1) - 1 : t.mipmask = h[0].mipmask, f.textureCube(t, N, h, l), t.internalformat = h[0].internalformat, E.width = h[0].width, E.height = h[0].height, ht(t), S = 0; S < 6; ++S)
                et(h[S], tn + S);
              for (it(N, $n), je(), k.profile && (t.stats.size = fn(
                t.internalformat,
                t.type,
                E.width,
                E.height,
                N.genMipmaps,
                !0
              )), E.format = Q[t.internalformat], E.type = fe[t.type], E.mag = z[N.magFilter], E.min = ue[N.minFilter], E.wrapS = V[N.wrapS], E.wrapT = V[N.wrapT], S = 0; S < 6; ++S)
                at(h[S]);
              return E;
            }
            function T(m, b, s, d, n) {
              f(!!b, "must specify image data"), f(typeof m == "number" && m === (m | 0) && m >= 0 && m < 6, "invalid face");
              var g = s | 0, S = d | 0, N = n | 0, P = le();
              return ie(P, t), P.width = 0, P.height = 0, J(P, b), P.width = P.width || (t.width >> N) - g, P.height = P.height || (t.height >> N) - S, f(
                t.type === P.type && t.format === P.format && t.internalformat === P.internalformat,
                "incompatible format for texture.subimage"
              ), f(
                g >= 0 && S >= 0 && g + P.width <= t.width && S + P.height <= t.height,
                "texture.subimage write out of bounds"
              ), f(
                t.mipmask & 1 << N,
                "missing mipmap data"
              ), f(
                P.data || P.element || P.needsCopy,
                "missing image data"
              ), ht(t), ge(P, tn + m, g, S, N), je(), Fe(P), E;
            }
            function p(m) {
              var b = m | 0;
              if (b !== t.width) {
                E.width = t.width = b, E.height = t.height = b, ht(t);
                for (var s = 0; s < 6; ++s)
                  for (var d = 0; t.mipmask >> d; ++d)
                    e.texImage2D(
                      tn + s,
                      d,
                      t.format,
                      b >> d,
                      b >> d,
                      0,
                      t.format,
                      t.type,
                      null
                    );
                return je(), k.profile && (t.stats.size = fn(
                  t.internalformat,
                  t.type,
                  E.width,
                  E.height,
                  !1,
                  !0
                )), E;
              }
            }
            return E(u, M, O, ce, Ge, o), E.subimage = T, E.resize = p, E._reglType = "textureCube", E._texture = t, k.profile && (E.stats = t.stats), E.destroy = function() {
              t.decRef();
            }, E;
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
              for (var ce = 0; ce < 32; ++ce)
                if ((O.mipmask & 1 << ce) !== 0)
                  if (O.target === It)
                    e.texImage2D(
                      It,
                      ce,
                      O.internalformat,
                      O.width >> ce,
                      O.height >> ce,
                      0,
                      O.internalformat,
                      O.type,
                      null
                    );
                  else
                    for (var Ge = 0; Ge < 6; ++Ge)
                      e.texImage2D(
                        tn + Ge,
                        ce,
                        O.internalformat,
                        O.width >> ce,
                        O.height >> ce,
                        0,
                        O.internalformat,
                        O.type,
                        null
                      );
              it(O.texInfo, O.target);
            });
          }
          function or() {
            for (var u = 0; u < dt; ++u) {
              var M = Ke[u];
              M && (M.bindCount = 0, M.unit = -1, Ke[u] = null), e.activeTexture(Mr + u), e.bindTexture(It, null), e.bindTexture($n, null);
            }
          }
          return {
            create2D: Me,
            createCube: De,
            clear: Qe,
            getTexture: function(u) {
              return null;
            },
            restore: Dt,
            refresh: or
          };
        }
        var Xt = 36161, un = 32854, ki = 32855, Bi = 36194, Ii = 33189, Ni = 36168, Di = 34041, Pi = 35907, Ui = 34836, $i = 34842, zi = 34843, Mt = [];
        Mt[un] = 2, Mt[ki] = 2, Mt[Bi] = 2, Mt[Ii] = 2, Mt[Ni] = 1, Mt[Di] = 4, Mt[Pi] = 4, Mt[Ui] = 16, Mt[$i] = 8, Mt[zi] = 6;
        function ji(e, r, l) {
          return Mt[e] * r * l;
        }
        var fu = function(e, r, l, G, D) {
          var F = {
            rgba4: un,
            rgb565: Bi,
            "rgb5 a1": ki,
            depth: Ii,
            stencil: Ni,
            "depth stencil": Di
          };
          r.ext_srgb && (F.srgba = Pi), r.ext_color_buffer_half_float && (F.rgba16f = $i, F.rgb16f = zi), r.webgl_color_buffer_float && (F.rgba32f = Ui);
          var k = [];
          Object.keys(F).forEach(function(W) {
            var ne = F[W];
            k[ne] = W;
          });
          var H = 0, Y = {};
          function Z(W) {
            this.id = H++, this.refCount = 1, this.renderbuffer = W, this.format = un, this.width = 0, this.height = 0, D.profile && (this.stats = { size: 0 });
          }
          Z.prototype.decRef = function() {
            --this.refCount <= 0 && q(this);
          };
          function q(W) {
            var ne = W.renderbuffer;
            f(ne, "must not double destroy renderbuffer"), e.bindRenderbuffer(Xt, null), e.deleteRenderbuffer(ne), W.renderbuffer = null, W.refCount = 0, delete Y[W.id], G.renderbufferCount--;
          }
          function re(W, ne) {
            var A = new Z(e.createRenderbuffer());
            Y[A.id] = A, G.renderbufferCount++;
            function B(fe, z) {
              var ue = 0, V = 0, ae = un;
              if (typeof fe == "object" && fe) {
                var X = fe;
                if ("shape" in X) {
                  var ie = X.shape;
                  f(
                    Array.isArray(ie) && ie.length >= 2,
                    "invalid renderbuffer shape"
                  ), ue = ie[0] | 0, V = ie[1] | 0;
                } else
                  "radius" in X && (ue = V = X.radius | 0), "width" in X && (ue = X.width | 0), "height" in X && (V = X.height | 0);
                "format" in X && (f.parameter(
                  X.format,
                  F,
                  "invalid renderbuffer format"
                ), ae = F[X.format]);
              } else typeof fe == "number" ? (ue = fe | 0, typeof z == "number" ? V = z | 0 : V = ue) : fe ? f.raise("invalid arguments to renderbuffer constructor") : ue = V = 1;
              if (f(
                ue > 0 && V > 0 && ue <= l.maxRenderbufferSize && V <= l.maxRenderbufferSize,
                "invalid renderbuffer size"
              ), !(ue === A.width && V === A.height && ae === A.format))
                return B.width = A.width = ue, B.height = A.height = V, A.format = ae, e.bindRenderbuffer(Xt, A.renderbuffer), e.renderbufferStorage(Xt, ae, ue, V), f(
                  e.getError() === 0,
                  "invalid render buffer format"
                ), D.profile && (A.stats.size = ji(A.format, A.width, A.height)), B.format = k[A.format], B;
            }
            function Q(fe, z) {
              var ue = fe | 0, V = z | 0 || ue;
              return ue === A.width && V === A.height || (f(
                ue > 0 && V > 0 && ue <= l.maxRenderbufferSize && V <= l.maxRenderbufferSize,
                "invalid renderbuffer size"
              ), B.width = A.width = ue, B.height = A.height = V, e.bindRenderbuffer(Xt, A.renderbuffer), e.renderbufferStorage(Xt, A.format, ue, V), f(
                e.getError() === 0,
                "invalid render buffer format"
              ), D.profile && (A.stats.size = ji(
                A.format,
                A.width,
                A.height
              ))), B;
            }
            return B(W, ne), B.resize = Q, B._reglType = "renderbuffer", B._renderbuffer = A, D.profile && (B.stats = A.stats), B.destroy = function() {
              A.decRef();
            }, B;
          }
          D.profile && (G.getTotalRenderbufferSize = function() {
            var W = 0;
            return Object.keys(Y).forEach(function(ne) {
              W += Y[ne].stats.size;
            }), W;
          });
          function oe() {
            Lt(Y).forEach(function(W) {
              W.renderbuffer = e.createRenderbuffer(), e.bindRenderbuffer(Xt, W.renderbuffer), e.renderbufferStorage(Xt, W.format, W.width, W.height);
            }), e.bindRenderbuffer(Xt, null);
          }
          return {
            create: re,
            clear: function() {
              Lt(Y).forEach(q);
            },
            restore: oe
          };
        }, Ut = 36160, aa = 36161, er = 3553, cn = 34069, Xi = 36064, Vi = 36096, Hi = 36128, Wi = 33306, Yi = 36053, uu = 36054, cu = 36055, lu = 36057, du = 36061, hu = 36193, mu = 5121, pu = 5126, qi = 6407, Ki = 6408, vu = 6402, yu = [
          qi,
          Ki
        ], ia = [];
        ia[Ki] = 4, ia[qi] = 3;
        var ln = [];
        ln[mu] = 1, ln[pu] = 4, ln[hu] = 2;
        var _u = 32854, bu = 32855, gu = 36194, Eu = 33189, xu = 36168, Qi = 34041, wu = 35907, Au = 34836, Tu = 34842, Su = 34843, Lu = [
          _u,
          bu,
          gu,
          wu,
          Tu,
          Su,
          Au
        ], vr = {};
        vr[Yi] = "complete", vr[uu] = "incomplete attachment", vr[lu] = "incomplete dimensions", vr[cu] = "incomplete, missing attachment", vr[du] = "unsupported";
        function Ru(e, r, l, G, D, F) {
          var k = {
            cur: null,
            next: null,
            dirty: !1,
            setFBO: null
          }, H = ["rgba"], Y = ["rgba4", "rgb565", "rgb5 a1"];
          r.ext_srgb && Y.push("srgba"), r.ext_color_buffer_half_float && Y.push("rgba16f", "rgb16f"), r.webgl_color_buffer_float && Y.push("rgba32f");
          var Z = ["uint8"];
          r.oes_texture_half_float && Z.push("half float", "float16"), r.oes_texture_float && Z.push("float", "float32");
          function q(se, J, $) {
            this.target = se, this.texture = J, this.renderbuffer = $;
            var ge = 0, Se = 0;
            J ? (ge = J.width, Se = J.height) : $ && (ge = $.width, Se = $.height), this.width = ge, this.height = Se;
          }
          function re(se) {
            se && (se.texture && se.texture._texture.decRef(), se.renderbuffer && se.renderbuffer._renderbuffer.decRef());
          }
          function oe(se, J, $) {
            if (se)
              if (se.texture) {
                var ge = se.texture._texture, Se = Math.max(1, ge.width), le = Math.max(1, ge.height);
                f(
                  Se === J && le === $,
                  "inconsistent width/height for supplied texture"
                ), ge.refCount += 1;
              } else {
                var Fe = se.renderbuffer._renderbuffer;
                f(
                  Fe.width === J && Fe.height === $,
                  "inconsistent width/height for renderbuffer"
                ), Fe.refCount += 1;
              }
          }
          function W(se, J) {
            J && (J.texture ? e.framebufferTexture2D(
              Ut,
              se,
              J.target,
              J.texture._texture.texture,
              0
            ) : e.framebufferRenderbuffer(
              Ut,
              se,
              aa,
              J.renderbuffer._renderbuffer.renderbuffer
            ));
          }
          function ne(se) {
            var J = er, $ = null, ge = null, Se = se;
            typeof se == "object" && (Se = se.data, "target" in se && (J = se.target | 0)), f.type(Se, "function", "invalid attachment data");
            var le = Se._reglType;
            return le === "texture2d" ? ($ = Se, f(J === er)) : le === "textureCube" ? ($ = Se, f(
              J >= cn && J < cn + 6,
              "invalid cube map target"
            )) : le === "renderbuffer" ? (ge = Se, J = aa) : f.raise("invalid regl object for attachment"), new q(J, $, ge);
          }
          function A(se, J, $, ge, Se) {
            if ($) {
              var le = G.create2D({
                width: se,
                height: J,
                format: ge,
                type: Se
              });
              return le._texture.refCount = 0, new q(er, le, null);
            } else {
              var Fe = D.create({
                width: se,
                height: J,
                format: ge
              });
              return Fe._renderbuffer.refCount = 0, new q(aa, null, Fe);
            }
          }
          function B(se) {
            return se && (se.texture || se.renderbuffer);
          }
          function Q(se, J, $) {
            se && (se.texture ? se.texture.resize(J, $) : se.renderbuffer && se.renderbuffer.resize(J, $), se.width = J, se.height = $);
          }
          var fe = 0, z = {};
          function ue() {
            this.id = fe++, z[this.id] = this, this.framebuffer = e.createFramebuffer(), this.width = 0, this.height = 0, this.colorAttachments = [], this.depthAttachment = null, this.stencilAttachment = null, this.depthStencilAttachment = null;
          }
          function V(se) {
            se.colorAttachments.forEach(re), re(se.depthAttachment), re(se.stencilAttachment), re(se.depthStencilAttachment);
          }
          function ae(se) {
            var J = se.framebuffer;
            f(J, "must not double destroy framebuffer"), e.deleteFramebuffer(J), se.framebuffer = null, F.framebufferCount--, delete z[se.id];
          }
          function X(se) {
            var J;
            e.bindFramebuffer(Ut, se.framebuffer);
            var $ = se.colorAttachments;
            for (J = 0; J < $.length; ++J)
              W(Xi + J, $[J]);
            for (J = $.length; J < l.maxColorAttachments; ++J)
              e.framebufferTexture2D(
                Ut,
                Xi + J,
                er,
                null,
                0
              );
            e.framebufferTexture2D(
              Ut,
              Wi,
              er,
              null,
              0
            ), e.framebufferTexture2D(
              Ut,
              Vi,
              er,
              null,
              0
            ), e.framebufferTexture2D(
              Ut,
              Hi,
              er,
              null,
              0
            ), W(Vi, se.depthAttachment), W(Hi, se.stencilAttachment), W(Wi, se.depthStencilAttachment);
            var ge = e.checkFramebufferStatus(Ut);
            !e.isContextLost() && ge !== Yi && f.raise("framebuffer configuration not supported, status = " + vr[ge]), e.bindFramebuffer(Ut, k.next ? k.next.framebuffer : null), k.cur = k.next, e.getError();
          }
          function ie(se, J) {
            var $ = new ue();
            F.framebufferCount++;
            function ge(le, Fe) {
              var we;
              f(
                k.next !== $,
                "can not update framebuffer which is currently in use"
              );
              var Oe = 0, $e = 0, et = !0, ft = !0, Be = null, at = !0, He = "rgba", tt = "uint8", it = 1, ot = null, ct = null, dt = null, Ke = !1;
              if (typeof le == "number")
                Oe = le | 0, $e = Fe | 0 || Oe;
              else if (!le)
                Oe = $e = 1;
              else {
                f.type(le, "object", "invalid arguments for framebuffer");
                var Le = le;
                if ("shape" in Le) {
                  var ht = Le.shape;
                  f(
                    Array.isArray(ht) && ht.length >= 2,
                    "invalid shape for framebuffer"
                  ), Oe = ht[0], $e = ht[1];
                } else
                  "radius" in Le && (Oe = $e = Le.radius), "width" in Le && (Oe = Le.width), "height" in Le && ($e = Le.height);
                ("color" in Le || "colors" in Le) && (Be = Le.color || Le.colors, Array.isArray(Be) && f(
                  Be.length === 1 || r.webgl_draw_buffers,
                  "multiple render targets not supported"
                )), Be || ("colorCount" in Le && (it = Le.colorCount | 0, f(it > 0, "invalid color buffer count")), "colorTexture" in Le && (at = !!Le.colorTexture, He = "rgba4"), "colorType" in Le && (tt = Le.colorType, at ? (f(
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
                ), He = "rgba32f"), f.oneOf(tt, Z, "invalid color type")), "colorFormat" in Le && (He = Le.colorFormat, H.indexOf(He) >= 0 ? at = !0 : Y.indexOf(He) >= 0 ? at = !1 : at ? f.oneOf(
                  Le.colorFormat,
                  H,
                  "invalid color format for texture"
                ) : f.oneOf(
                  Le.colorFormat,
                  Y,
                  "invalid color format for renderbuffer"
                ))), ("depthTexture" in Le || "depthStencilTexture" in Le) && (Ke = !!(Le.depthTexture || Le.depthStencilTexture), f(
                  !Ke || r.webgl_depth_texture,
                  "webgl_depth_texture extension not supported"
                )), "depth" in Le && (typeof Le.depth == "boolean" ? et = Le.depth : (ot = Le.depth, ft = !1)), "stencil" in Le && (typeof Le.stencil == "boolean" ? ft = Le.stencil : (ct = Le.stencil, et = !1)), "depthStencil" in Le && (typeof Le.depthStencil == "boolean" ? et = ft = Le.depthStencil : (dt = Le.depthStencil, et = !1, ft = !1));
              }
              var je = null, _e = null, Me = null, De = null;
              if (Array.isArray(Be))
                je = Be.map(ne);
              else if (Be)
                je = [ne(Be)];
              else
                for (je = new Array(it), we = 0; we < it; ++we)
                  je[we] = A(
                    Oe,
                    $e,
                    at,
                    He,
                    tt
                  );
              f(
                r.webgl_draw_buffers || je.length <= 1,
                "you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers."
              ), f(
                je.length <= l.maxColorAttachments,
                "too many color attachments, not supported"
              ), Oe = Oe || je[0].width, $e = $e || je[0].height, ot ? _e = ne(ot) : et && !ft && (_e = A(
                Oe,
                $e,
                Ke,
                "depth",
                "uint32"
              )), ct ? Me = ne(ct) : ft && !et && (Me = A(
                Oe,
                $e,
                !1,
                "stencil",
                "uint8"
              )), dt ? De = ne(dt) : !ot && !ct && ft && et && (De = A(
                Oe,
                $e,
                Ke,
                "depth stencil",
                "depth stencil"
              )), f(
                !!ot + !!ct + !!dt <= 1,
                "invalid framebuffer configuration, can specify exactly one depth/stencil attachment"
              );
              var Qe = null;
              for (we = 0; we < je.length; ++we)
                if (oe(je[we], Oe, $e), f(
                  !je[we] || je[we].texture && yu.indexOf(je[we].texture._texture.format) >= 0 || je[we].renderbuffer && Lu.indexOf(je[we].renderbuffer._renderbuffer.format) >= 0,
                  "framebuffer color attachment " + we + " is invalid"
                ), je[we] && je[we].texture) {
                  var Dt = ia[je[we].texture._texture.format] * ln[je[we].texture._texture.type];
                  Qe === null ? Qe = Dt : f(
                    Qe === Dt,
                    "all color attachments much have the same number of bits per pixel."
                  );
                }
              return oe(_e, Oe, $e), f(
                !_e || _e.texture && _e.texture._texture.format === vu || _e.renderbuffer && _e.renderbuffer._renderbuffer.format === Eu,
                "invalid depth attachment for framebuffer object"
              ), oe(Me, Oe, $e), f(
                !Me || Me.renderbuffer && Me.renderbuffer._renderbuffer.format === xu,
                "invalid stencil attachment for framebuffer object"
              ), oe(De, Oe, $e), f(
                !De || De.texture && De.texture._texture.format === Qi || De.renderbuffer && De.renderbuffer._renderbuffer.format === Qi,
                "invalid depth-stencil attachment for framebuffer object"
              ), V($), $.width = Oe, $.height = $e, $.colorAttachments = je, $.depthAttachment = _e, $.stencilAttachment = Me, $.depthStencilAttachment = De, ge.color = je.map(B), ge.depth = B(_e), ge.stencil = B(Me), ge.depthStencil = B(De), ge.width = $.width, ge.height = $.height, X($), ge;
            }
            function Se(le, Fe) {
              f(
                k.next !== $,
                "can not resize a framebuffer which is currently in use"
              );
              var we = Math.max(le | 0, 1), Oe = Math.max(Fe | 0 || we, 1);
              if (we === $.width && Oe === $.height)
                return ge;
              for (var $e = $.colorAttachments, et = 0; et < $e.length; ++et)
                Q($e[et], we, Oe);
              return Q($.depthAttachment, we, Oe), Q($.stencilAttachment, we, Oe), Q($.depthStencilAttachment, we, Oe), $.width = ge.width = we, $.height = ge.height = Oe, X($), ge;
            }
            return ge(se, J), _(ge, {
              resize: Se,
              _reglType: "framebuffer",
              _framebuffer: $,
              destroy: function() {
                ae($), V($);
              },
              use: function(le) {
                k.setFBO({
                  framebuffer: ge
                }, le);
              }
            });
          }
          function ye(se) {
            var J = Array(6);
            function $(Se) {
              var le;
              f(
                J.indexOf(k.next) < 0,
                "can not update framebuffer which is currently in use"
              );
              var Fe = {
                color: null
              }, we = 0, Oe = null, $e = "rgba", et = "uint8", ft = 1;
              if (typeof Se == "number")
                we = Se | 0;
              else if (!Se)
                we = 1;
              else {
                f.type(Se, "object", "invalid arguments for framebuffer");
                var Be = Se;
                if ("shape" in Be) {
                  var at = Be.shape;
                  f(
                    Array.isArray(at) && at.length >= 2,
                    "invalid shape for framebuffer"
                  ), f(
                    at[0] === at[1],
                    "cube framebuffer must be square"
                  ), we = at[0];
                } else
                  "radius" in Be && (we = Be.radius | 0), "width" in Be ? (we = Be.width | 0, "height" in Be && f(Be.height === we, "must be square")) : "height" in Be && (we = Be.height | 0);
                ("color" in Be || "colors" in Be) && (Oe = Be.color || Be.colors, Array.isArray(Oe) && f(
                  Oe.length === 1 || r.webgl_draw_buffers,
                  "multiple render targets not supported"
                )), Oe || ("colorCount" in Be && (ft = Be.colorCount | 0, f(ft > 0, "invalid color buffer count")), "colorType" in Be && (f.oneOf(
                  Be.colorType,
                  Z,
                  "invalid color type"
                ), et = Be.colorType), "colorFormat" in Be && ($e = Be.colorFormat, f.oneOf(
                  Be.colorFormat,
                  H,
                  "invalid color format for texture"
                ))), "depth" in Be && (Fe.depth = Be.depth), "stencil" in Be && (Fe.stencil = Be.stencil), "depthStencil" in Be && (Fe.depthStencil = Be.depthStencil);
              }
              var He;
              if (Oe)
                if (Array.isArray(Oe))
                  for (He = [], le = 0; le < Oe.length; ++le)
                    He[le] = Oe[le];
                else
                  He = [Oe];
              else {
                He = Array(ft);
                var tt = {
                  radius: we,
                  format: $e,
                  type: et
                };
                for (le = 0; le < ft; ++le)
                  He[le] = G.createCube(tt);
              }
              for (Fe.color = Array(He.length), le = 0; le < He.length; ++le) {
                var it = He[le];
                f(
                  typeof it == "function" && it._reglType === "textureCube",
                  "invalid cube map"
                ), we = we || it.width, f(
                  it.width === we && it.height === we,
                  "invalid cube map shape"
                ), Fe.color[le] = {
                  target: cn,
                  data: He[le]
                };
              }
              for (le = 0; le < 6; ++le) {
                for (var ot = 0; ot < He.length; ++ot)
                  Fe.color[ot].target = cn + le;
                le > 0 && (Fe.depth = J[0].depth, Fe.stencil = J[0].stencil, Fe.depthStencil = J[0].depthStencil), J[le] ? J[le](Fe) : J[le] = ie(Fe);
              }
              return _($, {
                width: we,
                height: we,
                color: He
              });
            }
            function ge(Se) {
              var le, Fe = Se | 0;
              if (f(
                Fe > 0 && Fe <= l.maxCubeMapSize,
                "invalid radius for cube fbo"
              ), Fe === $.width)
                return $;
              var we = $.color;
              for (le = 0; le < we.length; ++le)
                we[le].resize(Fe);
              for (le = 0; le < 6; ++le)
                J[le].resize(Fe);
              return $.width = $.height = Fe, $;
            }
            return $(se), _($, {
              faces: J,
              resize: ge,
              _reglType: "framebufferCube",
              destroy: function() {
                J.forEach(function(Se) {
                  Se.destroy();
                });
              }
            });
          }
          function Ee() {
            k.cur = null, k.next = null, k.dirty = !0, Lt(z).forEach(function(se) {
              se.framebuffer = e.createFramebuffer(), X(se);
            });
          }
          return _(k, {
            getFramebuffer: function(se) {
              if (typeof se == "function" && se._reglType === "framebuffer") {
                var J = se._framebuffer;
                if (J instanceof ue)
                  return J;
              }
              return null;
            },
            create: ie,
            createCube: ye,
            clear: function() {
              Lt(z).forEach(ae);
            },
            restore: Ee
          });
        }
        var Ou = 5126, Zi = 34962;
        function oa() {
          this.state = 0, this.x = 0, this.y = 0, this.z = 0, this.w = 0, this.buffer = null, this.size = 0, this.normalized = !1, this.type = Ou, this.offset = 0, this.stride = 0, this.divisor = 0;
        }
        function Cu(e, r, l, G, D) {
          for (var F = l.maxAttributes, k = new Array(F), H = 0; H < F; ++H)
            k[H] = new oa();
          var Y = 0, Z = {}, q = {
            Record: oa,
            scope: {},
            state: k,
            currentVAO: null,
            targetVAO: null,
            restore: oe() ? z : function() {
            },
            createVAO: ue,
            getVAO: ne,
            destroyBuffer: re,
            setVAO: oe() ? A : B,
            clear: oe() ? Q : function() {
            }
          };
          function re(V) {
            for (var ae = 0; ae < k.length; ++ae) {
              var X = k[ae];
              X.buffer === V && (e.disableVertexAttribArray(ae), X.buffer = null);
            }
          }
          function oe() {
            return r.oes_vertex_array_object;
          }
          function W() {
            return r.angle_instanced_arrays;
          }
          function ne(V) {
            return typeof V == "function" && V._vao ? V._vao : null;
          }
          function A(V) {
            if (V !== q.currentVAO) {
              var ae = oe();
              V ? ae.bindVertexArrayOES(V.vao) : ae.bindVertexArrayOES(null), q.currentVAO = V;
            }
          }
          function B(V) {
            if (V !== q.currentVAO) {
              if (V)
                V.bindAttrs();
              else
                for (var ae = W(), X = 0; X < k.length; ++X) {
                  var ie = k[X];
                  ie.buffer ? (e.enableVertexAttribArray(X), e.vertexAttribPointer(X, ie.size, ie.type, ie.normalized, ie.stride, ie.offfset), ae && ie.divisor && ae.vertexAttribDivisorANGLE(X, ie.divisor)) : (e.disableVertexAttribArray(X), e.vertexAttrib4f(X, ie.x, ie.y, ie.z, ie.w));
                }
              q.currentVAO = V;
            }
          }
          function Q() {
            Lt(Z).forEach(function(V) {
              V.destroy();
            });
          }
          function fe() {
            this.id = ++Y, this.attributes = [];
            var V = oe();
            V ? this.vao = V.createVertexArrayOES() : this.vao = null, Z[this.id] = this, this.buffers = [];
          }
          fe.prototype.bindAttrs = function() {
            for (var V = W(), ae = this.attributes, X = 0; X < ae.length; ++X) {
              var ie = ae[X];
              ie.buffer ? (e.enableVertexAttribArray(X), e.bindBuffer(Zi, ie.buffer.buffer), e.vertexAttribPointer(X, ie.size, ie.type, ie.normalized, ie.stride, ie.offset), V && ie.divisor && V.vertexAttribDivisorANGLE(X, ie.divisor)) : (e.disableVertexAttribArray(X), e.vertexAttrib4f(X, ie.x, ie.y, ie.z, ie.w));
            }
            for (var ye = ae.length; ye < F; ++ye)
              e.disableVertexAttribArray(ye);
          }, fe.prototype.refresh = function() {
            var V = oe();
            V && (V.bindVertexArrayOES(this.vao), this.bindAttrs(), q.currentVAO = this);
          }, fe.prototype.destroy = function() {
            if (this.vao) {
              var V = oe();
              this === q.currentVAO && (q.currentVAO = null, V.bindVertexArrayOES(null)), V.deleteVertexArrayOES(this.vao), this.vao = null;
            }
            Z[this.id] && (delete Z[this.id], G.vaoCount -= 1);
          };
          function z() {
            var V = oe();
            V && Lt(Z).forEach(function(ae) {
              ae.refresh();
            });
          }
          function ue(V) {
            var ae = new fe();
            G.vaoCount += 1;
            function X(ie) {
              f(Array.isArray(ie), "arguments to vertex array constructor must be an array"), f(ie.length < F, "too many attributes"), f(ie.length > 0, "must specify at least one attribute");
              var ye = {}, Ee = ae.attributes;
              Ee.length = ie.length;
              for (var se = 0; se < ie.length; ++se) {
                var J = ie[se], $ = Ee[se] = new oa(), ge = J.data || J;
                if (Array.isArray(ge) || v(ge) || Gt(ge)) {
                  var Se;
                  ae.buffers[se] && (Se = ae.buffers[se], v(ge) && Se._buffer.byteLength >= ge.byteLength ? Se.subdata(ge) : (Se.destroy(), ae.buffers[se] = null)), ae.buffers[se] || (Se = ae.buffers[se] = D.create(J, Zi, !1, !0)), $.buffer = D.getBuffer(Se), $.size = $.buffer.dimension | 0, $.normalized = !1, $.type = $.buffer.dtype, $.offset = 0, $.stride = 0, $.divisor = 0, $.state = 1, ye[se] = 1;
                } else D.getBuffer(J) ? ($.buffer = D.getBuffer(J), $.size = $.buffer.dimension | 0, $.normalized = !1, $.type = $.buffer.dtype, $.offset = 0, $.stride = 0, $.divisor = 0, $.state = 1) : D.getBuffer(J.buffer) ? ($.buffer = D.getBuffer(J.buffer), $.size = (+J.size || $.buffer.dimension) | 0, $.normalized = !!J.normalized || !1, "type" in J ? (f.parameter(J.type, Kt, "invalid buffer type"), $.type = Kt[J.type]) : $.type = $.buffer.dtype, $.offset = (J.offset || 0) | 0, $.stride = (J.stride || 0) | 0, $.divisor = (J.divisor || 0) | 0, $.state = 1, f($.size >= 1 && $.size <= 4, "size must be between 1 and 4"), f($.offset >= 0, "invalid offset"), f($.stride >= 0 && $.stride <= 255, "stride must be between 0 and 255"), f($.divisor >= 0, "divisor must be positive"), f(!$.divisor || !!r.angle_instanced_arrays, "ANGLE_instanced_arrays must be enabled to use divisor")) : "x" in J ? (f(se > 0, "first attribute must not be a constant"), $.x = +J.x || 0, $.y = +J.y || 0, $.z = +J.z || 0, $.w = +J.w || 0, $.state = 2) : f(!1, "invalid attribute spec for location " + se);
              }
              for (var le = 0; le < ae.buffers.length; ++le)
                !ye[le] && ae.buffers[le] && (ae.buffers[le].destroy(), ae.buffers[le] = null);
              return ae.refresh(), X;
            }
            return X.destroy = function() {
              for (var ie = 0; ie < ae.buffers.length; ++ie)
                ae.buffers[ie] && ae.buffers[ie].destroy();
              ae.buffers.length = 0, ae.destroy();
            }, X._vao = ae, X._reglType = "vao", X(V);
          }
          return q;
        }
        var Ji = 35632, Fu = 35633, Gu = 35718, Mu = 35721;
        function ku(e, r, l, G) {
          var D = {}, F = {};
          function k(A, B, Q, fe) {
            this.name = A, this.id = B, this.location = Q, this.info = fe;
          }
          function H(A, B) {
            for (var Q = 0; Q < A.length; ++Q)
              if (A[Q].id === B.id) {
                A[Q].location = B.location;
                return;
              }
            A.push(B);
          }
          function Y(A, B, Q) {
            var fe = A === Ji ? D : F, z = fe[B];
            if (!z) {
              var ue = r.str(B);
              z = e.createShader(A), e.shaderSource(z, ue), e.compileShader(z), f.shaderError(e, z, ue, A, Q), fe[B] = z;
            }
            return z;
          }
          var Z = {}, q = [], re = 0;
          function oe(A, B) {
            this.id = re++, this.fragId = A, this.vertId = B, this.program = null, this.uniforms = [], this.attributes = [], this.refCount = 1, G.profile && (this.stats = {
              uniformsCount: 0,
              attributesCount: 0
            });
          }
          function W(A, B, Q) {
            var fe, z, ue = Y(Ji, A.fragId), V = Y(Fu, A.vertId), ae = A.program = e.createProgram();
            if (e.attachShader(ae, ue), e.attachShader(ae, V), Q)
              for (fe = 0; fe < Q.length; ++fe) {
                var X = Q[fe];
                e.bindAttribLocation(ae, X[0], X[1]);
              }
            e.linkProgram(ae), f.linkError(
              e,
              ae,
              r.str(A.fragId),
              r.str(A.vertId),
              B
            );
            var ie = e.getProgramParameter(ae, Gu);
            G.profile && (A.stats.uniformsCount = ie);
            var ye = A.uniforms;
            for (fe = 0; fe < ie; ++fe)
              if (z = e.getActiveUniform(ae, fe), z)
                if (z.size > 1)
                  for (var Ee = 0; Ee < z.size; ++Ee) {
                    var se = z.name.replace("[0]", "[" + Ee + "]");
                    H(ye, new k(
                      se,
                      r.id(se),
                      e.getUniformLocation(ae, se),
                      z
                    ));
                  }
                else
                  H(ye, new k(
                    z.name,
                    r.id(z.name),
                    e.getUniformLocation(ae, z.name),
                    z
                  ));
            var J = e.getProgramParameter(ae, Mu);
            G.profile && (A.stats.attributesCount = J);
            var $ = A.attributes;
            for (fe = 0; fe < J; ++fe)
              z = e.getActiveAttrib(ae, fe), z && H($, new k(
                z.name,
                r.id(z.name),
                e.getAttribLocation(ae, z.name),
                z
              ));
          }
          G.profile && (l.getMaxUniformsCount = function() {
            var A = 0;
            return q.forEach(function(B) {
              B.stats.uniformsCount > A && (A = B.stats.uniformsCount);
            }), A;
          }, l.getMaxAttributesCount = function() {
            var A = 0;
            return q.forEach(function(B) {
              B.stats.attributesCount > A && (A = B.stats.attributesCount);
            }), A;
          });
          function ne() {
            D = {}, F = {};
            for (var A = 0; A < q.length; ++A)
              W(q[A], null, q[A].attributes.map(function(B) {
                return [B.location, B.name];
              }));
          }
          return {
            clear: function() {
              var A = e.deleteShader.bind(e);
              Lt(D).forEach(A), D = {}, Lt(F).forEach(A), F = {}, q.forEach(function(B) {
                e.deleteProgram(B.program);
              }), q.length = 0, Z = {}, l.shaderCount = 0;
            },
            program: function(A, B, Q, fe) {
              f.command(A >= 0, "missing vertex shader", Q), f.command(B >= 0, "missing fragment shader", Q);
              var z = Z[B];
              z || (z = Z[B] = {});
              var ue = z[A];
              if (ue && (ue.refCount++, !fe))
                return ue;
              var V = new oe(B, A);
              return l.shaderCount++, W(V, Q, fe), ue || (z[A] = V), q.push(V), _(V, {
                destroy: function() {
                  if (V.refCount--, V.refCount <= 0) {
                    e.deleteProgram(V.program);
                    var ae = q.indexOf(V);
                    q.splice(ae, 1), l.shaderCount--;
                  }
                  z[V.vertId].refCount <= 0 && (e.deleteShader(F[V.vertId]), delete F[V.vertId], delete Z[V.fragId][V.vertId]), Object.keys(Z[V.fragId]).length || (e.deleteShader(D[V.fragId]), delete D[V.fragId], delete Z[V.fragId]);
                }
              });
            },
            restore: ne,
            shader: Y,
            frag: -1,
            vert: -1
          };
        }
        var Bu = 6408, kr = 5121, Iu = 3333, dn = 5126;
        function Nu(e, r, l, G, D, F, k) {
          function H(q) {
            var re;
            r.next === null ? (f(
              D.preserveDrawingBuffer,
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
            var oe = 0, W = 0, ne = G.framebufferWidth, A = G.framebufferHeight, B = null;
            v(q) ? B = q : q && (f.type(q, "object", "invalid arguments to regl.read()"), oe = q.x | 0, W = q.y | 0, f(
              oe >= 0 && oe < G.framebufferWidth,
              "invalid x offset for regl.read"
            ), f(
              W >= 0 && W < G.framebufferHeight,
              "invalid y offset for regl.read"
            ), ne = (q.width || G.framebufferWidth - oe) | 0, A = (q.height || G.framebufferHeight - W) | 0, B = q.data || null), B && (re === kr ? f(
              B instanceof Uint8Array,
              "buffer must be 'Uint8Array' when reading from a framebuffer of type 'uint8'"
            ) : re === dn && f(
              B instanceof Float32Array,
              "buffer must be 'Float32Array' when reading from a framebuffer of type 'float'"
            )), f(
              ne > 0 && ne + oe <= G.framebufferWidth,
              "invalid width for read pixels"
            ), f(
              A > 0 && A + W <= G.framebufferHeight,
              "invalid height for read pixels"
            ), l();
            var Q = ne * A * 4;
            return B || (re === kr ? B = new Uint8Array(Q) : re === dn && (B = B || new Float32Array(Q))), f.isTypedArray(B, "data buffer for regl.read() must be a typedarray"), f(B.byteLength >= Q, "data buffer for regl.read() too small"), e.pixelStorei(Iu, 4), e.readPixels(
              oe,
              W,
              ne,
              A,
              Bu,
              re,
              B
            ), B;
          }
          function Y(q) {
            var re;
            return r.setFBO({
              framebuffer: q.framebuffer
            }, function() {
              re = H(q);
            }), re;
          }
          function Z(q) {
            return !q || !("framebuffer" in q) ? H(q) : Y(q);
          }
          return Z;
        }
        function yr(e) {
          return Array.prototype.slice.call(e);
        }
        function _r(e) {
          return yr(e).join("");
        }
        function Du() {
          var e = 0, r = [], l = [];
          function G(re) {
            for (var oe = 0; oe < l.length; ++oe)
              if (l[oe] === re)
                return r[oe];
            var W = "g" + e++;
            return r.push(W), l.push(re), W;
          }
          function D() {
            var re = [];
            function oe() {
              re.push.apply(re, yr(arguments));
            }
            var W = [];
            function ne() {
              var A = "v" + e++;
              return W.push(A), arguments.length > 0 && (re.push(A, "="), re.push.apply(re, yr(arguments)), re.push(";")), A;
            }
            return _(oe, {
              def: ne,
              toString: function() {
                return _r([
                  W.length > 0 ? "var " + W.join(",") + ";" : "",
                  _r(re)
                ]);
              }
            });
          }
          function F() {
            var re = D(), oe = D(), W = re.toString, ne = oe.toString;
            function A(B, Q) {
              oe(B, Q, "=", re.def(B, Q), ";");
            }
            return _(function() {
              re.apply(re, yr(arguments));
            }, {
              def: re.def,
              entry: re,
              exit: oe,
              save: A,
              set: function(B, Q, fe) {
                A(B, Q), re(B, Q, "=", fe, ";");
              },
              toString: function() {
                return W() + ne();
              }
            });
          }
          function k() {
            var re = _r(arguments), oe = F(), W = F(), ne = oe.toString, A = W.toString;
            return _(oe, {
              then: function() {
                return oe.apply(oe, yr(arguments)), this;
              },
              else: function() {
                return W.apply(W, yr(arguments)), this;
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
          var H = D(), Y = {};
          function Z(re, oe) {
            var W = [];
            function ne() {
              var z = "a" + W.length;
              return W.push(z), z;
            }
            oe = oe || 0;
            for (var A = 0; A < oe; ++A)
              ne();
            var B = F(), Q = B.toString, fe = Y[re] = _(B, {
              arg: ne,
              toString: function() {
                return _r([
                  "function(",
                  W.join(),
                  "){",
                  Q(),
                  "}"
                ]);
              }
            });
            return fe;
          }
          function q() {
            var re = [
              '"use strict";',
              H,
              "return {"
            ];
            Object.keys(Y).forEach(function(ne) {
              re.push('"', ne, '":', Y[ne].toString(), ",");
            }), re.push("}");
            var oe = _r(re).replace(/;/g, `;
`).replace(/}/g, `}
`).replace(/{/g, `{
`), W = Function.apply(null, r.concat(oe));
            return W.apply(null, l);
          }
          return {
            global: H,
            link: G,
            block: D,
            proc: Z,
            scope: F,
            cond: k,
            compile: q
          };
        }
        var br = "xyzw".split(""), eo = 5121, gr = 1, sa = 2, fa = 0, ua = 1, ca = 2, la = 3, hn = 4, to = 5, ro = 6, no = "dither", ao = "blend.enable", io = "blend.color", da = "blend.equation", ha = "blend.func", oo = "depth.enable", so = "depth.func", fo = "depth.range", uo = "depth.mask", ma = "colorMask", co = "cull.enable", lo = "cull.face", pa = "frontFace", va = "lineWidth", ho = "polygonOffset.enable", ya = "polygonOffset.offset", mo = "sample.alpha", po = "sample.enable", _a = "sample.coverage", vo = "stencil.enable", yo = "stencil.mask", ba = "stencil.func", ga = "stencil.opFront", Br = "stencil.opBack", _o = "scissor.enable", mn = "scissor.box", $t = "viewport", Ir = "profile", tr = "framebuffer", Nr = "vert", Dr = "frag", rr = "elements", nr = "primitive", ar = "count", pn = "offset", vn = "instances", Pr = "vao", Ea = "Width", xa = "Height", Er = tr + Ea, xr = tr + xa, Pu = $t + Ea, Uu = $t + xa, bo = "drawingBuffer", go = bo + Ea, Eo = bo + xa, $u = [
          ha,
          da,
          ba,
          ga,
          Br,
          _a,
          $t,
          mn,
          ya
        ], wr = 34962, zu = 34963, ju = 35632, Xu = 35633, xo = 3553, Vu = 34067, Hu = 2884, Wu = 3042, Yu = 3024, qu = 2960, Ku = 2929, Qu = 3089, Zu = 32823, Ju = 32926, ec = 32928, wa = 5126, yn = 35664, _n = 35665, bn = 35666, Aa = 5124, gn = 35667, En = 35668, xn = 35669, Ta = 35670, wn = 35671, An = 35672, Tn = 35673, Ur = 35674, $r = 35675, zr = 35676, jr = 35678, Xr = 35680, wo = 4, Vr = 1028, ir = 1029, Ao = 2304, Sa = 2305, tc = 32775, rc = 32776, nc = 519, Vt = 7680, To = 0, So = 1, Lo = 32774, ac = 513, Ro = 36160, ic = 36064, Nt = {
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
          frag: ju,
          vert: Xu
        }, La = {
          cw: Ao,
          ccw: Sa
        };
        function Sn(e) {
          return Array.isArray(e) || v(e) || Gt(e);
        }
        function Fo(e) {
          return e.sort(function(r, l) {
            return r === $t ? -1 : l === $t ? 1 : r < l ? -1 : 1;
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
            var D = e.data;
            return new _t(
              D.thisDep,
              D.contextDep,
              D.propDep,
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
              for (var F = !1, k = !1, H = !1, Y = 0; Y < e.data.length; ++Y) {
                var Z = e.data[Y];
                if (Z.type === ua)
                  H = !0;
                else if (Z.type === ca)
                  k = !0;
                else if (Z.type === la)
                  F = !0;
                else if (Z.type === fa) {
                  F = !0;
                  var q = Z.data;
                  q >= 1 && (k = !0), q >= 2 && (H = !0);
                } else Z.type === hn && (F = F || Z.data.thisDep, k = k || Z.data.contextDep, H = H || Z.data.propDep);
              }
              return new _t(
                F,
                k,
                H,
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
        function oc(e, r, l, G, D, F, k, H, Y, Z, q, re, oe, W, ne) {
          var A = Z.Record, B = {
            add: 32774,
            subtract: 32778,
            "reverse subtract": 32779
          };
          l.ext_blend_minmax && (B.min = tc, B.max = rc);
          var Q = l.angle_instanced_arrays, fe = l.webgl_draw_buffers, z = {
            dirty: !0,
            profile: ne.profile
          }, ue = {}, V = [], ae = {}, X = {};
          function ie(o) {
            return o.replace(".", "_");
          }
          function ye(o, t, h) {
            var E = ie(o);
            V.push(o), ue[E] = z[E] = !!h, ae[E] = t;
          }
          function Ee(o, t, h) {
            var E = ie(o);
            V.push(o), Array.isArray(h) ? (z[E] = h.slice(), ue[E] = h.slice()) : z[E] = ue[E] = h, X[E] = t;
          }
          ye(no, Yu), ye(ao, Wu), Ee(io, "blendColor", [0, 0, 0, 0]), Ee(
            da,
            "blendEquationSeparate",
            [Lo, Lo]
          ), Ee(
            ha,
            "blendFuncSeparate",
            [So, To, So, To]
          ), ye(oo, Ku, !0), Ee(so, "depthFunc", ac), Ee(fo, "depthRange", [0, 1]), Ee(uo, "depthMask", !0), Ee(ma, ma, [!0, !0, !0, !0]), ye(co, Hu), Ee(lo, "cullFace", ir), Ee(pa, pa, Sa), Ee(va, va, 1), ye(ho, Zu), Ee(ya, "polygonOffset", [0, 0]), ye(mo, Ju), ye(po, ec), Ee(_a, "sampleCoverage", [1, !1]), ye(vo, qu), Ee(yo, "stencilMask", -1), Ee(ba, "stencilFunc", [nc, 0, -1]), Ee(
            ga,
            "stencilOpSeparate",
            [Vr, Vt, Vt, Vt]
          ), Ee(
            Br,
            "stencilOpSeparate",
            [ir, Vt, Vt, Vt]
          ), ye(_o, Qu), Ee(
            mn,
            "scissor",
            [0, 0, e.drawingBufferWidth, e.drawingBufferHeight]
          ), Ee(
            $t,
            $t,
            [0, 0, e.drawingBufferWidth, e.drawingBufferHeight]
          );
          var se = {
            gl: e,
            context: oe,
            strings: r,
            next: ue,
            current: z,
            draw: re,
            elements: F,
            buffer: D,
            shader: q,
            attributes: Z.state,
            vao: Z,
            uniforms: Y,
            framebuffer: H,
            extensions: l,
            timer: W,
            isBufferArgs: Sn
          }, J = {
            primTypes: ur,
            compareFuncs: Ar,
            blendFuncs: Nt,
            blendEquations: B,
            stencilOps: Ht,
            glTypes: Kt,
            orientationType: La
          };
          f.optional(function() {
            se.isArrayLike = qe;
          }), fe && (J.backBuffer = [ir], J.drawBuffer = Et(G.maxDrawbuffers, function(o) {
            return o === 0 ? [0] : Et(o, function(t) {
              return ic + t;
            });
          }));
          var $ = 0;
          function ge() {
            var o = Du(), t = o.link, h = o.global;
            o.id = $++, o.batchId = "0";
            var E = t(se), T = o.shared = {
              props: "a0"
            };
            Object.keys(se).forEach(function(d) {
              T[d] = h.def(E, ".", d);
            }), f.optional(function() {
              o.CHECK = t(f), o.commandStr = f.guessCommand(), o.command = t(o.commandStr), o.assert = function(d, n, g) {
                d(
                  "if(!(",
                  n,
                  "))",
                  this.CHECK,
                  ".commandRaise(",
                  t(g),
                  ",",
                  this.command,
                  ");"
                );
              }, J.invalidBlendCombinations = Oo;
            });
            var p = o.next = {}, m = o.current = {};
            Object.keys(X).forEach(function(d) {
              Array.isArray(z[d]) && (p[d] = h.def(T.next, ".", d), m[d] = h.def(T.current, ".", d));
            });
            var b = o.constants = {};
            Object.keys(J).forEach(function(d) {
              b[d] = h.def(JSON.stringify(J[d]));
            }), o.invoke = function(d, n) {
              switch (n.type) {
                case fa:
                  var g = [
                    "this",
                    T.context,
                    T.props,
                    o.batchId
                  ];
                  return d.def(
                    t(n.data),
                    ".call(",
                    g.slice(0, Math.max(n.data.length + 1, 4)),
                    ")"
                  );
                case ua:
                  return d.def(T.props, n.data);
                case ca:
                  return d.def(T.context, n.data);
                case la:
                  return d.def("this", n.data);
                case hn:
                  return n.data.append(o, d), n.data.ref;
                case to:
                  return n.data.toString();
                case ro:
                  return n.data.map(function(S) {
                    return o.invoke(d, S);
                  });
              }
            }, o.attribCache = {};
            var s = {};
            return o.scopeAttrib = function(d) {
              var n = r.id(d);
              if (n in s)
                return s[n];
              var g = Z.scope[n];
              g || (g = Z.scope[n] = new A());
              var S = s[n] = t(g);
              return S;
            }, o;
          }
          function Se(o) {
            var t = o.static, h = o.dynamic, E;
            if (Ir in t) {
              var T = !!t[Ir];
              E = Je(function(m, b) {
                return T;
              }), E.enable = T;
            } else if (Ir in h) {
              var p = h[Ir];
              E = xt(p, function(m, b) {
                return m.invoke(b, p);
              });
            }
            return E;
          }
          function le(o, t) {
            var h = o.static, E = o.dynamic;
            if (tr in h) {
              var T = h[tr];
              return T ? (T = H.getFramebuffer(T), f.command(T, "invalid framebuffer object"), Je(function(m, b) {
                var s = m.link(T), d = m.shared;
                b.set(
                  d.framebuffer,
                  ".next",
                  s
                );
                var n = d.context;
                return b.set(
                  n,
                  "." + Er,
                  s + ".width"
                ), b.set(
                  n,
                  "." + xr,
                  s + ".height"
                ), s;
              })) : Je(function(m, b) {
                var s = m.shared;
                b.set(
                  s.framebuffer,
                  ".next",
                  "null"
                );
                var d = s.context;
                return b.set(
                  d,
                  "." + Er,
                  d + "." + go
                ), b.set(
                  d,
                  "." + xr,
                  d + "." + Eo
                ), "null";
              });
            } else if (tr in E) {
              var p = E[tr];
              return xt(p, function(m, b) {
                var s = m.invoke(b, p), d = m.shared, n = d.framebuffer, g = b.def(
                  n,
                  ".getFramebuffer(",
                  s,
                  ")"
                );
                f.optional(function() {
                  m.assert(
                    b,
                    "!" + s + "||" + g,
                    "invalid framebuffer object"
                  );
                }), b.set(
                  n,
                  ".next",
                  g
                );
                var S = d.context;
                return b.set(
                  S,
                  "." + Er,
                  g + "?" + g + ".width:" + S + "." + go
                ), b.set(
                  S,
                  "." + xr,
                  g + "?" + g + ".height:" + S + "." + Eo
                ), g;
              });
            } else
              return null;
          }
          function Fe(o, t, h) {
            var E = o.static, T = o.dynamic;
            function p(s) {
              if (s in E) {
                var d = E[s];
                f.commandType(d, "object", "invalid " + s, h.commandStr);
                var n = !0, g = d.x | 0, S = d.y | 0, N, P;
                return "width" in d ? (N = d.width | 0, f.command(N >= 0, "invalid " + s, h.commandStr)) : n = !1, "height" in d ? (P = d.height | 0, f.command(P >= 0, "invalid " + s, h.commandStr)) : n = !1, new _t(
                  !n && t && t.thisDep,
                  !n && t && t.contextDep,
                  !n && t && t.propDep,
                  function(ve, Re) {
                    var de = ve.shared.context, be = N;
                    "width" in d || (be = Re.def(de, ".", Er, "-", g));
                    var Te = P;
                    return "height" in d || (Te = Re.def(de, ".", xr, "-", S)), [g, S, be, Te];
                  }
                );
              } else if (s in T) {
                var I = T[s], K = xt(I, function(ve, Re) {
                  var de = ve.invoke(Re, I);
                  f.optional(function() {
                    ve.assert(
                      Re,
                      de + "&&typeof " + de + '==="object"',
                      "invalid " + s
                    );
                  });
                  var be = ve.shared.context, Te = Re.def(de, ".x|0"), ze = Re.def(de, ".y|0"), Ye = Re.def(
                    '"width" in ',
                    de,
                    "?",
                    de,
                    ".width|0:",
                    "(",
                    be,
                    ".",
                    Er,
                    "-",
                    Te,
                    ")"
                  ), bt = Re.def(
                    '"height" in ',
                    de,
                    "?",
                    de,
                    ".height|0:",
                    "(",
                    be,
                    ".",
                    xr,
                    "-",
                    ze,
                    ")"
                  );
                  return f.optional(function() {
                    ve.assert(
                      Re,
                      Ye + ">=0&&" + bt + ">=0",
                      "invalid " + s
                    );
                  }), [Te, ze, Ye, bt];
                });
                return t && (K.thisDep = K.thisDep || t.thisDep, K.contextDep = K.contextDep || t.contextDep, K.propDep = K.propDep || t.propDep), K;
              } else return t ? new _t(
                t.thisDep,
                t.contextDep,
                t.propDep,
                function(ve, Re) {
                  var de = ve.shared.context;
                  return [
                    0,
                    0,
                    Re.def(de, ".", Er),
                    Re.def(de, ".", xr)
                  ];
                }
              ) : null;
            }
            var m = p($t);
            if (m) {
              var b = m;
              m = new _t(
                m.thisDep,
                m.contextDep,
                m.propDep,
                function(s, d) {
                  var n = b.append(s, d), g = s.shared.context;
                  return d.set(
                    g,
                    "." + Pu,
                    n[2]
                  ), d.set(
                    g,
                    "." + Uu,
                    n[3]
                  ), n;
                }
              );
            }
            return {
              viewport: m,
              scissor_box: p(mn)
            };
          }
          function we(o, t) {
            var h = o.static, E = typeof h[Dr] == "string" && typeof h[Nr] == "string";
            if (E) {
              if (Object.keys(t.dynamic).length > 0)
                return null;
              var T = t.static, p = Object.keys(T);
              if (p.length > 0 && typeof T[p[0]] == "number") {
                for (var m = [], b = 0; b < p.length; ++b)
                  f(typeof T[p[b]] == "number", "must specify all vertex attribute locations when using vaos"), m.push([T[p[b]] | 0, p[b]]);
                return m;
              }
            }
            return null;
          }
          function Oe(o, t, h) {
            var E = o.static, T = o.dynamic;
            function p(n) {
              if (n in E) {
                var g = r.id(E[n]);
                f.optional(function() {
                  q.shader(Co[n], g, f.guessCommand());
                });
                var S = Je(function() {
                  return g;
                });
                return S.id = g, S;
              } else if (n in T) {
                var N = T[n];
                return xt(N, function(P, I) {
                  var K = P.invoke(I, N), ve = I.def(P.shared.strings, ".id(", K, ")");
                  return f.optional(function() {
                    I(
                      P.shared.shader,
                      ".shader(",
                      Co[n],
                      ",",
                      ve,
                      ",",
                      P.command,
                      ");"
                    );
                  }), ve;
                });
              }
              return null;
            }
            var m = p(Dr), b = p(Nr), s = null, d;
            return Wt(m) && Wt(b) ? (s = q.program(b.id, m.id, null, h), d = Je(function(n, g) {
              return n.link(s);
            })) : d = new _t(
              m && m.thisDep || b && b.thisDep,
              m && m.contextDep || b && b.contextDep,
              m && m.propDep || b && b.propDep,
              function(n, g) {
                var S = n.shared.shader, N;
                m ? N = m.append(n, g) : N = g.def(S, ".", Dr);
                var P;
                b ? P = b.append(n, g) : P = g.def(S, ".", Nr);
                var I = S + ".program(" + P + "," + N;
                return f.optional(function() {
                  I += "," + n.command;
                }), g.def(I + ")");
              }
            ), {
              frag: m,
              vert: b,
              progVar: d,
              program: s
            };
          }
          function $e(o, t) {
            var h = o.static, E = o.dynamic;
            function T() {
              if (rr in h) {
                var n = h[rr];
                Sn(n) ? n = F.getElements(F.create(n, !0)) : n && (n = F.getElements(n), f.command(n, "invalid elements", t.commandStr));
                var g = Je(function(N, P) {
                  if (n) {
                    var I = N.link(n);
                    return N.ELEMENTS = I, I;
                  }
                  return N.ELEMENTS = null, null;
                });
                return g.value = n, g;
              } else if (rr in E) {
                var S = E[rr];
                return xt(S, function(N, P) {
                  var I = N.shared, K = I.isBufferArgs, ve = I.elements, Re = N.invoke(P, S), de = P.def("null"), be = P.def(K, "(", Re, ")"), Te = N.cond(be).then(de, "=", ve, ".createStream(", Re, ");").else(de, "=", ve, ".getElements(", Re, ");");
                  return f.optional(function() {
                    N.assert(
                      Te.else,
                      "!" + Re + "||" + de,
                      "invalid elements"
                    );
                  }), P.entry(Te), P.exit(
                    N.cond(be).then(ve, ".destroyStream(", de, ");")
                  ), N.ELEMENTS = de, de;
                });
              }
              return null;
            }
            var p = T();
            function m() {
              if (nr in h) {
                var n = h[nr];
                return f.commandParameter(n, ur, "invalid primitve", t.commandStr), Je(function(S, N) {
                  return ur[n];
                });
              } else if (nr in E) {
                var g = E[nr];
                return xt(g, function(S, N) {
                  var P = S.constants.primTypes, I = S.invoke(N, g);
                  return f.optional(function() {
                    S.assert(
                      N,
                      I + " in " + P,
                      "invalid primitive, must be one of " + Object.keys(ur)
                    );
                  }), N.def(P, "[", I, "]");
                });
              } else if (p)
                return Wt(p) ? p.value ? Je(function(S, N) {
                  return N.def(S.ELEMENTS, ".primType");
                }) : Je(function() {
                  return wo;
                }) : new _t(
                  p.thisDep,
                  p.contextDep,
                  p.propDep,
                  function(S, N) {
                    var P = S.ELEMENTS;
                    return N.def(P, "?", P, ".primType:", wo);
                  }
                );
              return null;
            }
            function b(n, g) {
              if (n in h) {
                var S = h[n] | 0;
                return f.command(!g || S >= 0, "invalid " + n, t.commandStr), Je(function(P, I) {
                  return g && (P.OFFSET = S), S;
                });
              } else if (n in E) {
                var N = E[n];
                return xt(N, function(P, I) {
                  var K = P.invoke(I, N);
                  return g && (P.OFFSET = K, f.optional(function() {
                    P.assert(
                      I,
                      K + ">=0",
                      "invalid " + n
                    );
                  })), K;
                });
              } else if (g && p)
                return Je(function(P, I) {
                  return P.OFFSET = "0", 0;
                });
              return null;
            }
            var s = b(pn, !0);
            function d() {
              if (ar in h) {
                var n = h[ar] | 0;
                return f.command(
                  typeof n == "number" && n >= 0,
                  "invalid vertex count",
                  t.commandStr
                ), Je(function() {
                  return n;
                });
              } else if (ar in E) {
                var g = E[ar];
                return xt(g, function(P, I) {
                  var K = P.invoke(I, g);
                  return f.optional(function() {
                    P.assert(
                      I,
                      "typeof " + K + '==="number"&&' + K + ">=0&&" + K + "===(" + K + "|0)",
                      "invalid vertex count"
                    );
                  }), K;
                });
              } else if (p)
                if (Wt(p)) {
                  if (p)
                    return s ? new _t(
                      s.thisDep,
                      s.contextDep,
                      s.propDep,
                      function(P, I) {
                        var K = I.def(
                          P.ELEMENTS,
                          ".vertCount-",
                          P.OFFSET
                        );
                        return f.optional(function() {
                          P.assert(
                            I,
                            K + ">=0",
                            "invalid vertex offset/element buffer too small"
                          );
                        }), K;
                      }
                    ) : Je(function(P, I) {
                      return I.def(P.ELEMENTS, ".vertCount");
                    });
                  var S = Je(function() {
                    return -1;
                  });
                  return f.optional(function() {
                    S.MISSING = !0;
                  }), S;
                } else {
                  var N = new _t(
                    p.thisDep || s.thisDep,
                    p.contextDep || s.contextDep,
                    p.propDep || s.propDep,
                    function(P, I) {
                      var K = P.ELEMENTS;
                      return P.OFFSET ? I.def(
                        K,
                        "?",
                        K,
                        ".vertCount-",
                        P.OFFSET,
                        ":-1"
                      ) : I.def(K, "?", K, ".vertCount:-1");
                    }
                  );
                  return f.optional(function() {
                    N.DYNAMIC = !0;
                  }), N;
                }
              return null;
            }
            return {
              elements: p,
              primitive: m(),
              count: d(),
              instances: b(vn, !1),
              offset: s
            };
          }
          function et(o, t) {
            var h = o.static, E = o.dynamic, T = {};
            return V.forEach(function(p) {
              var m = ie(p);
              function b(s, d) {
                if (p in h) {
                  var n = s(h[p]);
                  T[m] = Je(function() {
                    return n;
                  });
                } else if (p in E) {
                  var g = E[p];
                  T[m] = xt(g, function(S, N) {
                    return d(S, N, S.invoke(N, g));
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
                  return b(
                    function(s) {
                      return f.commandType(s, "boolean", p, t.commandStr), s;
                    },
                    function(s, d, n) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          "typeof " + n + '==="boolean"',
                          "invalid flag " + p,
                          s.commandStr
                        );
                      }), n;
                    }
                  );
                case so:
                  return b(
                    function(s) {
                      return f.commandParameter(s, Ar, "invalid " + p, t.commandStr), Ar[s];
                    },
                    function(s, d, n) {
                      var g = s.constants.compareFuncs;
                      return f.optional(function() {
                        s.assert(
                          d,
                          n + " in " + g,
                          "invalid " + p + ", must be one of " + Object.keys(Ar)
                        );
                      }), d.def(g, "[", n, "]");
                    }
                  );
                case fo:
                  return b(
                    function(s) {
                      return f.command(
                        qe(s) && s.length === 2 && typeof s[0] == "number" && typeof s[1] == "number" && s[0] <= s[1],
                        "depth range is 2d array",
                        t.commandStr
                      ), s;
                    },
                    function(s, d, n) {
                      f.optional(function() {
                        s.assert(
                          d,
                          s.shared.isArrayLike + "(" + n + ")&&" + n + ".length===2&&typeof " + n + '[0]==="number"&&typeof ' + n + '[1]==="number"&&' + n + "[0]<=" + n + "[1]",
                          "depth range must be a 2d array"
                        );
                      });
                      var g = d.def("+", n, "[0]"), S = d.def("+", n, "[1]");
                      return [g, S];
                    }
                  );
                case ha:
                  return b(
                    function(s) {
                      f.commandType(s, "object", "blend.func", t.commandStr);
                      var d = "srcRGB" in s ? s.srcRGB : s.src, n = "srcAlpha" in s ? s.srcAlpha : s.src, g = "dstRGB" in s ? s.dstRGB : s.dst, S = "dstAlpha" in s ? s.dstAlpha : s.dst;
                      return f.commandParameter(d, Nt, m + ".srcRGB", t.commandStr), f.commandParameter(n, Nt, m + ".srcAlpha", t.commandStr), f.commandParameter(g, Nt, m + ".dstRGB", t.commandStr), f.commandParameter(S, Nt, m + ".dstAlpha", t.commandStr), f.command(
                        Oo.indexOf(d + ", " + g) === -1,
                        "unallowed blending combination (srcRGB, dstRGB) = (" + d + ", " + g + ")",
                        t.commandStr
                      ), [
                        Nt[d],
                        Nt[g],
                        Nt[n],
                        Nt[S]
                      ];
                    },
                    function(s, d, n) {
                      var g = s.constants.blendFuncs;
                      f.optional(function() {
                        s.assert(
                          d,
                          n + "&&typeof " + n + '==="object"',
                          "invalid blend func, must be an object"
                        );
                      });
                      function S(de, be) {
                        var Te = d.def(
                          '"',
                          de,
                          be,
                          '" in ',
                          n,
                          "?",
                          n,
                          ".",
                          de,
                          be,
                          ":",
                          n,
                          ".",
                          de
                        );
                        return f.optional(function() {
                          s.assert(
                            d,
                            Te + " in " + g,
                            "invalid " + p + "." + de + be + ", must be one of " + Object.keys(Nt)
                          );
                        }), Te;
                      }
                      var N = S("src", "RGB"), P = S("dst", "RGB");
                      f.optional(function() {
                        var de = s.constants.invalidBlendCombinations;
                        s.assert(
                          d,
                          de + ".indexOf(" + N + '+", "+' + P + ") === -1 ",
                          "unallowed blending combination for (srcRGB, dstRGB)"
                        );
                      });
                      var I = d.def(g, "[", N, "]"), K = d.def(g, "[", S("src", "Alpha"), "]"), ve = d.def(g, "[", P, "]"), Re = d.def(g, "[", S("dst", "Alpha"), "]");
                      return [I, ve, K, Re];
                    }
                  );
                case da:
                  return b(
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
                    function(s, d, n) {
                      var g = s.constants.blendEquations, S = d.def(), N = d.def(), P = s.cond("typeof ", n, '==="string"');
                      return f.optional(function() {
                        function I(K, ve, Re) {
                          s.assert(
                            K,
                            Re + " in " + g,
                            "invalid " + ve + ", must be one of " + Object.keys(B)
                          );
                        }
                        I(P.then, p, n), s.assert(
                          P.else,
                          n + "&&typeof " + n + '==="object"',
                          "invalid " + p
                        ), I(P.else, p + ".rgb", n + ".rgb"), I(P.else, p + ".alpha", n + ".alpha");
                      }), P.then(
                        S,
                        "=",
                        N,
                        "=",
                        g,
                        "[",
                        n,
                        "];"
                      ), P.else(
                        S,
                        "=",
                        g,
                        "[",
                        n,
                        ".rgb];",
                        N,
                        "=",
                        g,
                        "[",
                        n,
                        ".alpha];"
                      ), d(P), [S, N];
                    }
                  );
                case io:
                  return b(
                    function(s) {
                      return f.command(
                        qe(s) && s.length === 4,
                        "blend.color must be a 4d array",
                        t.commandStr
                      ), Et(4, function(d) {
                        return +s[d];
                      });
                    },
                    function(s, d, n) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          s.shared.isArrayLike + "(" + n + ")&&" + n + ".length===4",
                          "blend.color must be a 4d array"
                        );
                      }), Et(4, function(g) {
                        return d.def("+", n, "[", g, "]");
                      });
                    }
                  );
                case yo:
                  return b(
                    function(s) {
                      return f.commandType(s, "number", m, t.commandStr), s | 0;
                    },
                    function(s, d, n) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          "typeof " + n + '==="number"',
                          "invalid stencil.mask"
                        );
                      }), d.def(n, "|0");
                    }
                  );
                case ba:
                  return b(
                    function(s) {
                      f.commandType(s, "object", m, t.commandStr);
                      var d = s.cmp || "keep", n = s.ref || 0, g = "mask" in s ? s.mask : -1;
                      return f.commandParameter(d, Ar, p + ".cmp", t.commandStr), f.commandType(n, "number", p + ".ref", t.commandStr), f.commandType(g, "number", p + ".mask", t.commandStr), [
                        Ar[d],
                        n,
                        g
                      ];
                    },
                    function(s, d, n) {
                      var g = s.constants.compareFuncs;
                      f.optional(function() {
                        function I() {
                          s.assert(
                            d,
                            Array.prototype.join.call(arguments, ""),
                            "invalid stencil.func"
                          );
                        }
                        I(n + "&&typeof ", n, '==="object"'), I(
                          '!("cmp" in ',
                          n,
                          ")||(",
                          n,
                          ".cmp in ",
                          g,
                          ")"
                        );
                      });
                      var S = d.def(
                        '"cmp" in ',
                        n,
                        "?",
                        g,
                        "[",
                        n,
                        ".cmp]",
                        ":",
                        Vt
                      ), N = d.def(n, ".ref|0"), P = d.def(
                        '"mask" in ',
                        n,
                        "?",
                        n,
                        ".mask|0:-1"
                      );
                      return [S, N, P];
                    }
                  );
                case ga:
                case Br:
                  return b(
                    function(s) {
                      f.commandType(s, "object", m, t.commandStr);
                      var d = s.fail || "keep", n = s.zfail || "keep", g = s.zpass || "keep";
                      return f.commandParameter(d, Ht, p + ".fail", t.commandStr), f.commandParameter(n, Ht, p + ".zfail", t.commandStr), f.commandParameter(g, Ht, p + ".zpass", t.commandStr), [
                        p === Br ? ir : Vr,
                        Ht[d],
                        Ht[n],
                        Ht[g]
                      ];
                    },
                    function(s, d, n) {
                      var g = s.constants.stencilOps;
                      f.optional(function() {
                        s.assert(
                          d,
                          n + "&&typeof " + n + '==="object"',
                          "invalid " + p
                        );
                      });
                      function S(N) {
                        return f.optional(function() {
                          s.assert(
                            d,
                            '!("' + N + '" in ' + n + ")||(" + n + "." + N + " in " + g + ")",
                            "invalid " + p + "." + N + ", must be one of " + Object.keys(Ht)
                          );
                        }), d.def(
                          '"',
                          N,
                          '" in ',
                          n,
                          "?",
                          g,
                          "[",
                          n,
                          ".",
                          N,
                          "]:",
                          Vt
                        );
                      }
                      return [
                        p === Br ? ir : Vr,
                        S("fail"),
                        S("zfail"),
                        S("zpass")
                      ];
                    }
                  );
                case ya:
                  return b(
                    function(s) {
                      f.commandType(s, "object", m, t.commandStr);
                      var d = s.factor | 0, n = s.units | 0;
                      return f.commandType(d, "number", m + ".factor", t.commandStr), f.commandType(n, "number", m + ".units", t.commandStr), [d, n];
                    },
                    function(s, d, n) {
                      f.optional(function() {
                        s.assert(
                          d,
                          n + "&&typeof " + n + '==="object"',
                          "invalid " + p
                        );
                      });
                      var g = d.def(n, ".factor|0"), S = d.def(n, ".units|0");
                      return [g, S];
                    }
                  );
                case lo:
                  return b(
                    function(s) {
                      var d = 0;
                      return s === "front" ? d = Vr : s === "back" && (d = ir), f.command(!!d, m, t.commandStr), d;
                    },
                    function(s, d, n) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          n + '==="front"||' + n + '==="back"',
                          "invalid cull.face"
                        );
                      }), d.def(n, '==="front"?', Vr, ":", ir);
                    }
                  );
                case va:
                  return b(
                    function(s) {
                      return f.command(
                        typeof s == "number" && s >= G.lineWidthDims[0] && s <= G.lineWidthDims[1],
                        "invalid line width, must be a positive number between " + G.lineWidthDims[0] + " and " + G.lineWidthDims[1],
                        t.commandStr
                      ), s;
                    },
                    function(s, d, n) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          "typeof " + n + '==="number"&&' + n + ">=" + G.lineWidthDims[0] + "&&" + n + "<=" + G.lineWidthDims[1],
                          "invalid line width"
                        );
                      }), n;
                    }
                  );
                case pa:
                  return b(
                    function(s) {
                      return f.commandParameter(s, La, m, t.commandStr), La[s];
                    },
                    function(s, d, n) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          n + '==="cw"||' + n + '==="ccw"',
                          "invalid frontFace, must be one of cw,ccw"
                        );
                      }), d.def(n + '==="cw"?' + Ao + ":" + Sa);
                    }
                  );
                case ma:
                  return b(
                    function(s) {
                      return f.command(
                        qe(s) && s.length === 4,
                        "color.mask must be length 4 array",
                        t.commandStr
                      ), s.map(function(d) {
                        return !!d;
                      });
                    },
                    function(s, d, n) {
                      return f.optional(function() {
                        s.assert(
                          d,
                          s.shared.isArrayLike + "(" + n + ")&&" + n + ".length===4",
                          "invalid color.mask"
                        );
                      }), Et(4, function(g) {
                        return "!!" + n + "[" + g + "]";
                      });
                    }
                  );
                case _a:
                  return b(
                    function(s) {
                      f.command(typeof s == "object" && s, m, t.commandStr);
                      var d = "value" in s ? s.value : 1, n = !!s.invert;
                      return f.command(
                        typeof d == "number" && d >= 0 && d <= 1,
                        "sample.coverage.value must be a number between 0 and 1",
                        t.commandStr
                      ), [d, n];
                    },
                    function(s, d, n) {
                      f.optional(function() {
                        s.assert(
                          d,
                          n + "&&typeof " + n + '==="object"',
                          "invalid sample.coverage"
                        );
                      });
                      var g = d.def(
                        '"value" in ',
                        n,
                        "?+",
                        n,
                        ".value:1"
                      ), S = d.def("!!", n, ".invert");
                      return [g, S];
                    }
                  );
              }
            }), T;
          }
          function ft(o, t) {
            var h = o.static, E = o.dynamic, T = {};
            return Object.keys(h).forEach(function(p) {
              var m = h[p], b;
              if (typeof m == "number" || typeof m == "boolean")
                b = Je(function() {
                  return m;
                });
              else if (typeof m == "function") {
                var s = m._reglType;
                s === "texture2d" || s === "textureCube" ? b = Je(function(d) {
                  return d.link(m);
                }) : s === "framebuffer" || s === "framebufferCube" ? (f.command(
                  m.color.length > 0,
                  'missing color attachment for framebuffer sent to uniform "' + p + '"',
                  t.commandStr
                ), b = Je(function(d) {
                  return d.link(m.color[0]);
                })) : f.commandRaise('invalid data for uniform "' + p + '"', t.commandStr);
              } else qe(m) ? b = Je(function(d) {
                var n = d.global.def(
                  "[",
                  Et(m.length, function(g) {
                    return f.command(
                      typeof m[g] == "number" || typeof m[g] == "boolean",
                      "invalid uniform " + p,
                      d.commandStr
                    ), m[g];
                  }),
                  "]"
                );
                return n;
              }) : f.commandRaise('invalid or missing data for uniform "' + p + '"', t.commandStr);
              b.value = m, T[p] = b;
            }), Object.keys(E).forEach(function(p) {
              var m = E[p];
              T[p] = xt(m, function(b, s) {
                return b.invoke(s, m);
              });
            }), T;
          }
          function Be(o, t) {
            var h = o.static, E = o.dynamic, T = {};
            return Object.keys(h).forEach(function(p) {
              var m = h[p], b = r.id(p), s = new A();
              if (Sn(m))
                s.state = gr, s.buffer = D.getBuffer(
                  D.create(m, wr, !1, !0)
                ), s.type = 0;
              else {
                var d = D.getBuffer(m);
                if (d)
                  s.state = gr, s.buffer = d, s.type = 0;
                else if (f.command(
                  typeof m == "object" && m,
                  "invalid data for attribute " + p,
                  t.commandStr
                ), "constant" in m) {
                  var n = m.constant;
                  s.buffer = "null", s.state = sa, typeof n == "number" ? s.x = n : (f.command(
                    qe(n) && n.length > 0 && n.length <= 4,
                    "invalid constant for attribute " + p,
                    t.commandStr
                  ), br.forEach(function(ve, Re) {
                    Re < n.length && (s[ve] = n[Re]);
                  }));
                } else {
                  Sn(m.buffer) ? d = D.getBuffer(
                    D.create(m.buffer, wr, !1, !0)
                  ) : d = D.getBuffer(m.buffer), f.command(!!d, 'missing buffer for attribute "' + p + '"', t.commandStr);
                  var g = m.offset | 0;
                  f.command(
                    g >= 0,
                    'invalid offset for attribute "' + p + '"',
                    t.commandStr
                  );
                  var S = m.stride | 0;
                  f.command(
                    S >= 0 && S < 256,
                    'invalid stride for attribute "' + p + '", must be integer betweeen [0, 255]',
                    t.commandStr
                  );
                  var N = m.size | 0;
                  f.command(
                    !("size" in m) || N > 0 && N <= 4,
                    'invalid size for attribute "' + p + '", must be 1,2,3,4',
                    t.commandStr
                  );
                  var P = !!m.normalized, I = 0;
                  "type" in m && (f.commandParameter(
                    m.type,
                    Kt,
                    "invalid type for attribute " + p,
                    t.commandStr
                  ), I = Kt[m.type]);
                  var K = m.divisor | 0;
                  "divisor" in m && (f.command(
                    K === 0 || Q,
                    'cannot specify divisor for attribute "' + p + '", instancing not supported',
                    t.commandStr
                  ), f.command(
                    K >= 0,
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
                    Object.keys(m).forEach(function(de) {
                      f.command(
                        Re.indexOf(de) >= 0,
                        'unknown parameter "' + de + '" for attribute pointer "' + p + '" (valid parameters are ' + Re + ")",
                        ve
                      );
                    });
                  }), s.buffer = d, s.state = gr, s.size = N, s.normalized = P, s.type = I || d.dtype, s.offset = g, s.stride = S, s.divisor = K;
                }
              }
              T[p] = Je(function(ve, Re) {
                var de = ve.attribCache;
                if (b in de)
                  return de[b];
                var be = {
                  isStream: !1
                };
                return Object.keys(s).forEach(function(Te) {
                  be[Te] = s[Te];
                }), s.buffer && (be.buffer = ve.link(s.buffer), be.type = be.type || be.buffer + ".dtype"), de[b] = be, be;
              });
            }), Object.keys(E).forEach(function(p) {
              var m = E[p];
              function b(s, d) {
                var n = s.invoke(d, m), g = s.shared, S = s.constants, N = g.isBufferArgs, P = g.buffer;
                f.optional(function() {
                  s.assert(
                    d,
                    n + "&&(typeof " + n + '==="object"||typeof ' + n + '==="function")&&(' + N + "(" + n + ")||" + P + ".getBuffer(" + n + ")||" + P + ".getBuffer(" + n + ".buffer)||" + N + "(" + n + '.buffer)||("constant" in ' + n + "&&(typeof " + n + '.constant==="number"||' + g.isArrayLike + "(" + n + ".constant))))",
                    'invalid dynamic attribute "' + p + '"'
                  );
                });
                var I = {
                  isStream: d.def(!1)
                }, K = new A();
                K.state = gr, Object.keys(K).forEach(function(be) {
                  I[be] = d.def("" + K[be]);
                });
                var ve = I.buffer, Re = I.type;
                d(
                  "if(",
                  N,
                  "(",
                  n,
                  ")){",
                  I.isStream,
                  "=true;",
                  ve,
                  "=",
                  P,
                  ".createStream(",
                  wr,
                  ",",
                  n,
                  ");",
                  Re,
                  "=",
                  ve,
                  ".dtype;",
                  "}else{",
                  ve,
                  "=",
                  P,
                  ".getBuffer(",
                  n,
                  ");",
                  "if(",
                  ve,
                  "){",
                  Re,
                  "=",
                  ve,
                  ".dtype;",
                  '}else if("constant" in ',
                  n,
                  "){",
                  I.state,
                  "=",
                  sa,
                  ";",
                  "if(typeof " + n + '.constant === "number"){',
                  I[br[0]],
                  "=",
                  n,
                  ".constant;",
                  br.slice(1).map(function(be) {
                    return I[be];
                  }).join("="),
                  "=0;",
                  "}else{",
                  br.map(function(be, Te) {
                    return I[be] + "=" + n + ".constant.length>" + Te + "?" + n + ".constant[" + Te + "]:0;";
                  }).join(""),
                  "}}else{",
                  "if(",
                  N,
                  "(",
                  n,
                  ".buffer)){",
                  ve,
                  "=",
                  P,
                  ".createStream(",
                  wr,
                  ",",
                  n,
                  ".buffer);",
                  "}else{",
                  ve,
                  "=",
                  P,
                  ".getBuffer(",
                  n,
                  ".buffer);",
                  "}",
                  Re,
                  '="type" in ',
                  n,
                  "?",
                  S.glTypes,
                  "[",
                  n,
                  ".type]:",
                  ve,
                  ".dtype;",
                  I.normalized,
                  "=!!",
                  n,
                  ".normalized;"
                );
                function de(be) {
                  d(I[be], "=", n, ".", be, "|0;");
                }
                return de("size"), de("offset"), de("stride"), de("divisor"), d("}}"), d.exit(
                  "if(",
                  I.isStream,
                  "){",
                  P,
                  ".destroyStream(",
                  ve,
                  ");",
                  "}"
                ), I;
              }
              T[p] = xt(m, b);
            }), T;
          }
          function at(o, t) {
            var h = o.static, E = o.dynamic;
            if (Pr in h) {
              var T = h[Pr];
              return T !== null && Z.getVAO(T) === null && (T = Z.createVAO(T)), Je(function(m) {
                return m.link(Z.getVAO(T));
              });
            } else if (Pr in E) {
              var p = E[Pr];
              return xt(p, function(m, b) {
                var s = m.invoke(b, p);
                return b.def(m.shared.vao + ".getVAO(" + s + ")");
              });
            }
            return null;
          }
          function He(o) {
            var t = o.static, h = o.dynamic, E = {};
            return Object.keys(t).forEach(function(T) {
              var p = t[T];
              E[T] = Je(function(m, b) {
                return typeof p == "number" || typeof p == "boolean" ? "" + p : m.link(p);
              });
            }), Object.keys(h).forEach(function(T) {
              var p = h[T];
              E[T] = xt(p, function(m, b) {
                return m.invoke(b, p);
              });
            }), E;
          }
          function tt(o, t, h, E, T) {
            var p = o.static, m = o.dynamic;
            f.optional(function() {
              var de = [
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
              ].concat(V);
              function be(Te) {
                Object.keys(Te).forEach(function(ze) {
                  f.command(
                    de.indexOf(ze) >= 0,
                    'unknown parameter "' + ze + '"',
                    T.commandStr
                  );
                });
              }
              be(p), be(m);
            });
            var b = we(o, t), s = le(o), d = Fe(o, s, T), n = $e(o, T), g = et(o, T), S = Oe(o, T, b);
            function N(de) {
              var be = d[de];
              be && (g[de] = be);
            }
            N($t), N(ie(mn));
            var P = Object.keys(g).length > 0, I = {
              framebuffer: s,
              draw: n,
              shader: S,
              state: g,
              dirty: P,
              scopeVAO: null,
              drawVAO: null,
              useVAO: !1,
              attributes: {}
            };
            if (I.profile = Se(o), I.uniforms = ft(h, T), I.drawVAO = I.scopeVAO = at(o), !I.drawVAO && S.program && !b && l.angle_instanced_arrays) {
              var K = !0, ve = S.program.attributes.map(function(de) {
                var be = t.static[de];
                return K = K && !!be, be;
              });
              if (K && ve.length > 0) {
                var Re = Z.getVAO(Z.createVAO(ve));
                I.drawVAO = new _t(null, null, null, function(de, be) {
                  return de.link(Re);
                }), I.useVAO = !0;
              }
            }
            return b ? I.useVAO = !0 : I.attributes = Be(t, T), I.context = He(E), I;
          }
          function it(o, t, h) {
            var E = o.shared, T = E.context, p = o.scope();
            Object.keys(h).forEach(function(m) {
              t.save(T, "." + m);
              var b = h[m], s = b.append(o, t);
              Array.isArray(s) ? p(T, ".", m, "=[", s.join(), "];") : p(T, ".", m, "=", s, ";");
            }), t(p);
          }
          function ot(o, t, h, E) {
            var T = o.shared, p = T.gl, m = T.framebuffer, b;
            fe && (b = t.def(T.extensions, ".webgl_draw_buffers"));
            var s = o.constants, d = s.drawBuffer, n = s.backBuffer, g;
            h ? g = h.append(o, t) : g = t.def(m, ".next"), E || t("if(", g, "!==", m, ".cur){"), t(
              "if(",
              g,
              "){",
              p,
              ".bindFramebuffer(",
              Ro,
              ",",
              g,
              ".framebuffer);"
            ), fe && t(
              b,
              ".drawBuffersWEBGL(",
              d,
              "[",
              g,
              ".colorAttachments.length]);"
            ), t(
              "}else{",
              p,
              ".bindFramebuffer(",
              Ro,
              ",null);"
            ), fe && t(b, ".drawBuffersWEBGL(", n, ");"), t(
              "}",
              m,
              ".cur=",
              g,
              ";"
            ), E || t("}");
          }
          function ct(o, t, h) {
            var E = o.shared, T = E.gl, p = o.current, m = o.next, b = E.current, s = E.next, d = o.cond(b, ".dirty");
            V.forEach(function(n) {
              var g = ie(n);
              if (!(g in h.state)) {
                var S, N;
                if (g in m) {
                  S = m[g], N = p[g];
                  var P = Et(z[g].length, function(K) {
                    return d.def(S, "[", K, "]");
                  });
                  d(o.cond(P.map(function(K, ve) {
                    return K + "!==" + N + "[" + ve + "]";
                  }).join("||")).then(
                    T,
                    ".",
                    X[g],
                    "(",
                    P,
                    ");",
                    P.map(function(K, ve) {
                      return N + "[" + ve + "]=" + K;
                    }).join(";"),
                    ";"
                  ));
                } else {
                  S = d.def(s, ".", g);
                  var I = o.cond(S, "!==", b, ".", g);
                  d(I), g in ae ? I(
                    o.cond(S).then(T, ".enable(", ae[g], ");").else(T, ".disable(", ae[g], ");"),
                    b,
                    ".",
                    g,
                    "=",
                    S,
                    ";"
                  ) : I(
                    T,
                    ".",
                    X[g],
                    "(",
                    S,
                    ");",
                    b,
                    ".",
                    g,
                    "=",
                    S,
                    ";"
                  );
                }
              }
            }), Object.keys(h.state).length === 0 && d(b, ".dirty=false;"), t(d);
          }
          function dt(o, t, h, E) {
            var T = o.shared, p = o.current, m = T.current, b = T.gl;
            Fo(Object.keys(h)).forEach(function(s) {
              var d = h[s];
              if (!(E && !E(d))) {
                var n = d.append(o, t);
                if (ae[s]) {
                  var g = ae[s];
                  Wt(d) ? n ? t(b, ".enable(", g, ");") : t(b, ".disable(", g, ");") : t(o.cond(n).then(b, ".enable(", g, ");").else(b, ".disable(", g, ");")), t(m, ".", s, "=", n, ";");
                } else if (qe(n)) {
                  var S = p[s];
                  t(
                    b,
                    ".",
                    X[s],
                    "(",
                    n,
                    ");",
                    n.map(function(N, P) {
                      return S + "[" + P + "]=" + N;
                    }).join(";"),
                    ";"
                  );
                } else
                  t(
                    b,
                    ".",
                    X[s],
                    "(",
                    n,
                    ");",
                    m,
                    ".",
                    s,
                    "=",
                    n,
                    ";"
                  );
              }
            });
          }
          function Ke(o, t) {
            Q && (o.instancing = t.def(
              o.shared.extensions,
              ".angle_instanced_arrays"
            ));
          }
          function Le(o, t, h, E, T) {
            var p = o.shared, m = o.stats, b = p.current, s = p.timer, d = h.profile;
            function n() {
              return typeof performance > "u" ? "Date.now()" : "performance.now()";
            }
            var g, S;
            function N(de) {
              g = t.def(), de(g, "=", n(), ";"), typeof T == "string" ? de(m, ".count+=", T, ";") : de(m, ".count++;"), W && (E ? (S = t.def(), de(S, "=", s, ".getNumPendingQueries();")) : de(s, ".beginQuery(", m, ");"));
            }
            function P(de) {
              de(m, ".cpuTime+=", n(), "-", g, ";"), W && (E ? de(
                s,
                ".pushScopeStats(",
                S,
                ",",
                s,
                ".getNumPendingQueries(),",
                m,
                ");"
              ) : de(s, ".endQuery();"));
            }
            function I(de) {
              var be = t.def(b, ".profile");
              t(b, ".profile=", de, ";"), t.exit(b, ".profile=", be, ";");
            }
            var K;
            if (d) {
              if (Wt(d)) {
                d.enable ? (N(t), P(t.exit), I("true")) : I("false");
                return;
              }
              K = d.append(o, t), I(K);
            } else
              K = t.def(b, ".profile");
            var ve = o.block();
            N(ve), t("if(", K, "){", ve, "}");
            var Re = o.block();
            P(Re), t.exit("if(", K, "){", Re, "}");
          }
          function ht(o, t, h, E, T) {
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
            function b(s, d, n) {
              var g = p.gl, S = t.def(s, ".location"), N = t.def(p.attributes, "[", S, "]"), P = n.state, I = n.buffer, K = [
                n.x,
                n.y,
                n.z,
                n.w
              ], ve = [
                "buffer",
                "normalized",
                "offset",
                "stride"
              ];
              function Re() {
                t(
                  "if(!",
                  N,
                  ".buffer){",
                  g,
                  ".enableVertexAttribArray(",
                  S,
                  ");}"
                );
                var be = n.type, Te;
                if (n.size ? Te = t.def(n.size, "||", d) : Te = d, t(
                  "if(",
                  N,
                  ".type!==",
                  be,
                  "||",
                  N,
                  ".size!==",
                  Te,
                  "||",
                  ve.map(function(Ye) {
                    return N + "." + Ye + "!==" + n[Ye];
                  }).join("||"),
                  "){",
                  g,
                  ".bindBuffer(",
                  wr,
                  ",",
                  I,
                  ".buffer);",
                  g,
                  ".vertexAttribPointer(",
                  [
                    S,
                    Te,
                    be,
                    n.normalized,
                    n.stride,
                    n.offset
                  ],
                  ");",
                  N,
                  ".type=",
                  be,
                  ";",
                  N,
                  ".size=",
                  Te,
                  ";",
                  ve.map(function(Ye) {
                    return N + "." + Ye + "=" + n[Ye] + ";";
                  }).join(""),
                  "}"
                ), Q) {
                  var ze = n.divisor;
                  t(
                    "if(",
                    N,
                    ".divisor!==",
                    ze,
                    "){",
                    o.instancing,
                    ".vertexAttribDivisorANGLE(",
                    [S, ze],
                    ");",
                    N,
                    ".divisor=",
                    ze,
                    ";}"
                  );
                }
              }
              function de() {
                t(
                  "if(",
                  N,
                  ".buffer){",
                  g,
                  ".disableVertexAttribArray(",
                  S,
                  ");",
                  N,
                  ".buffer=null;",
                  "}if(",
                  br.map(function(be, Te) {
                    return N + "." + be + "!==" + K[Te];
                  }).join("||"),
                  "){",
                  g,
                  ".vertexAttrib4f(",
                  S,
                  ",",
                  K,
                  ");",
                  br.map(function(be, Te) {
                    return N + "." + be + "=" + K[Te] + ";";
                  }).join(""),
                  "}"
                );
              }
              P === gr ? Re() : P === sa ? de() : (t("if(", P, "===", gr, "){"), Re(), t("}else{"), de(), t("}"));
            }
            E.forEach(function(s) {
              var d = s.name, n = h.attributes[d], g;
              if (n) {
                if (!T(n))
                  return;
                g = n.append(o, t);
              } else {
                if (!T(Go))
                  return;
                var S = o.scopeAttrib(d);
                f.optional(function() {
                  o.assert(
                    t,
                    S + ".state",
                    "missing attribute " + d
                  );
                }), g = {}, Object.keys(new A()).forEach(function(N) {
                  g[N] = t.def(S, ".", N);
                });
              }
              b(
                o.link(s),
                m(s.info.type),
                g
              );
            });
          }
          function je(o, t, h, E, T) {
            for (var p = o.shared, m = p.gl, b, s = 0; s < E.length; ++s) {
              var d = E[s], n = d.name, g = d.info.type, S = h.uniforms[n], N = o.link(d), P = N + ".location", I;
              if (S) {
                if (!T(S))
                  continue;
                if (Wt(S)) {
                  var K = S.value;
                  if (f.command(
                    K !== null && typeof K < "u",
                    'missing uniform "' + n + '"',
                    o.commandStr
                  ), g === jr || g === Xr) {
                    f.command(
                      typeof K == "function" && (g === jr && (K._reglType === "texture2d" || K._reglType === "framebuffer") || g === Xr && (K._reglType === "textureCube" || K._reglType === "framebufferCube")),
                      "invalid texture for uniform " + n,
                      o.commandStr
                    );
                    var ve = o.link(K._texture || K.color[0]._texture);
                    t(m, ".uniform1i(", P, ",", ve + ".bind());"), t.exit(ve, ".unbind();");
                  } else if (g === Ur || g === $r || g === zr) {
                    f.optional(function() {
                      f.command(
                        qe(K),
                        "invalid matrix for uniform " + n,
                        o.commandStr
                      ), f.command(
                        g === Ur && K.length === 4 || g === $r && K.length === 9 || g === zr && K.length === 16,
                        "invalid length for matrix uniform " + n,
                        o.commandStr
                      );
                    });
                    var Re = o.global.def("new Float32Array([" + Array.prototype.slice.call(K) + "])"), de = 2;
                    g === $r ? de = 3 : g === zr && (de = 4), t(
                      m,
                      ".uniformMatrix",
                      de,
                      "fv(",
                      P,
                      ",false,",
                      Re,
                      ");"
                    );
                  } else {
                    switch (g) {
                      case wa:
                        f.commandType(K, "number", "uniform " + n, o.commandStr), b = "1f";
                        break;
                      case yn:
                        f.command(
                          qe(K) && K.length === 2,
                          "uniform " + n,
                          o.commandStr
                        ), b = "2f";
                        break;
                      case _n:
                        f.command(
                          qe(K) && K.length === 3,
                          "uniform " + n,
                          o.commandStr
                        ), b = "3f";
                        break;
                      case bn:
                        f.command(
                          qe(K) && K.length === 4,
                          "uniform " + n,
                          o.commandStr
                        ), b = "4f";
                        break;
                      case Ta:
                        f.commandType(K, "boolean", "uniform " + n, o.commandStr), b = "1i";
                        break;
                      case Aa:
                        f.commandType(K, "number", "uniform " + n, o.commandStr), b = "1i";
                        break;
                      case wn:
                        f.command(
                          qe(K) && K.length === 2,
                          "uniform " + n,
                          o.commandStr
                        ), b = "2i";
                        break;
                      case gn:
                        f.command(
                          qe(K) && K.length === 2,
                          "uniform " + n,
                          o.commandStr
                        ), b = "2i";
                        break;
                      case An:
                        f.command(
                          qe(K) && K.length === 3,
                          "uniform " + n,
                          o.commandStr
                        ), b = "3i";
                        break;
                      case En:
                        f.command(
                          qe(K) && K.length === 3,
                          "uniform " + n,
                          o.commandStr
                        ), b = "3i";
                        break;
                      case Tn:
                        f.command(
                          qe(K) && K.length === 4,
                          "uniform " + n,
                          o.commandStr
                        ), b = "4i";
                        break;
                      case xn:
                        f.command(
                          qe(K) && K.length === 4,
                          "uniform " + n,
                          o.commandStr
                        ), b = "4i";
                        break;
                    }
                    t(
                      m,
                      ".uniform",
                      b,
                      "(",
                      P,
                      ",",
                      qe(K) ? Array.prototype.slice.call(K) : K,
                      ");"
                    );
                  }
                  continue;
                } else
                  I = S.append(o, t);
              } else {
                if (!T(Go))
                  continue;
                I = t.def(p.uniforms, "[", r.id(n), "]");
              }
              g === jr ? (f(!Array.isArray(I), "must specify a scalar prop for textures"), t(
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
              )) : g === Xr && (f(!Array.isArray(I), "must specify a scalar prop for cube maps"), t(
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
                    'bad data or missing for uniform "' + n + '".  ' + Po
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
                switch (g) {
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
                  case Ur:
                    Ct(4);
                    break;
                  case $r:
                    Ct(9);
                    break;
                  case zr:
                    Ct(16);
                    break;
                  case jr:
                    Do(xo);
                    break;
                  case Xr:
                    Do(Vu);
                    break;
                }
              });
              var be = 1;
              switch (g) {
                case jr:
                case Xr:
                  var Te = t.def(I, "._texture");
                  t(m, ".uniform1i(", P, ",", Te, ".bind());"), t.exit(Te, ".unbind();");
                  continue;
                case Aa:
                case Ta:
                  b = "1i";
                  break;
                case gn:
                case wn:
                  b = "2i", be = 2;
                  break;
                case En:
                case An:
                  b = "3i", be = 3;
                  break;
                case xn:
                case Tn:
                  b = "4i", be = 4;
                  break;
                case wa:
                  b = "1f";
                  break;
                case yn:
                  b = "2f", be = 2;
                  break;
                case _n:
                  b = "3f", be = 3;
                  break;
                case bn:
                  b = "4f", be = 4;
                  break;
                case Ur:
                  b = "Matrix2fv";
                  break;
                case $r:
                  b = "Matrix3fv";
                  break;
                case zr:
                  b = "Matrix4fv";
                  break;
              }
              if (t(m, ".uniform", b, "(", P, ","), b.charAt(0) === "M") {
                var ze = Math.pow(g - Ur + 2, 2), Ye = o.global.def("new Float32Array(", ze, ")");
                Array.isArray(I) ? t(
                  "false,(",
                  Et(ze, function(bt) {
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
                  Et(ze, function(bt) {
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
          function _e(o, t, h, E) {
            var T = o.shared, p = T.gl, m = T.draw, b = E.draw;
            function s() {
              var Te = b.elements, ze, Ye = t;
              return Te ? ((Te.contextDep && E.contextDynamic || Te.propDep) && (Ye = h), ze = Te.append(o, Ye)) : ze = Ye.def(m, ".", rr), ze && Ye(
                "if(" + ze + ")" + p + ".bindBuffer(" + zu + "," + ze + ".buffer.buffer);"
              ), ze;
            }
            function d() {
              var Te = b.count, ze, Ye = t;
              return Te ? ((Te.contextDep && E.contextDynamic || Te.propDep) && (Ye = h), ze = Te.append(o, Ye), f.optional(function() {
                Te.MISSING && o.assert(t, "false", "missing vertex count"), Te.DYNAMIC && o.assert(Ye, ze + ">=0", "missing vertex count");
              })) : (ze = Ye.def(m, ".", ar), f.optional(function() {
                o.assert(Ye, ze + ">=0", "missing vertex count");
              })), ze;
            }
            var n = s();
            function g(Te) {
              var ze = b[Te];
              return ze ? ze.contextDep && E.contextDynamic || ze.propDep ? ze.append(o, h) : ze.append(o, t) : t.def(m, ".", Te);
            }
            var S = g(nr), N = g(pn), P = d();
            if (typeof P == "number") {
              if (P === 0)
                return;
            } else
              h("if(", P, "){"), h.exit("}");
            var I, K;
            Q && (I = g(vn), K = o.instancing);
            var ve = n + ".type", Re = b.elements && Wt(b.elements);
            function de() {
              function Te() {
                h(K, ".drawElementsInstancedANGLE(", [
                  S,
                  P,
                  ve,
                  N + "<<((" + ve + "-" + eo + ")>>1)",
                  I
                ], ");");
              }
              function ze() {
                h(
                  K,
                  ".drawArraysInstancedANGLE(",
                  [S, N, P, I],
                  ");"
                );
              }
              n ? Re ? Te() : (h("if(", n, "){"), Te(), h("}else{"), ze(), h("}")) : ze();
            }
            function be() {
              function Te() {
                h(p + ".drawElements(" + [
                  S,
                  P,
                  ve,
                  N + "<<((" + ve + "-" + eo + ")>>1)"
                ] + ");");
              }
              function ze() {
                h(p + ".drawArrays(" + [S, N, P] + ");");
              }
              n ? Re ? Te() : (h("if(", n, "){"), Te(), h("}else{"), ze(), h("}")) : ze();
            }
            Q && (typeof I != "number" || I >= 0) ? typeof I == "string" ? (h("if(", I, ">0){"), de(), h("}else if(", I, "<0){"), be(), h("}")) : de() : be();
          }
          function Me(o, t, h, E, T) {
            var p = ge(), m = p.proc("body", T);
            return f.optional(function() {
              p.commandStr = t.commandStr, p.command = p.link(t.commandStr);
            }), Q && (p.instancing = m.def(
              p.shared.extensions,
              ".angle_instanced_arrays"
            )), o(p, m, h, E), p.compile().body;
          }
          function De(o, t, h, E) {
            Ke(o, t), h.useVAO ? h.drawVAO ? t(o.shared.vao, ".setVAO(", h.drawVAO.append(o, t), ");") : t(o.shared.vao, ".setVAO(", o.shared.vao, ".targetVAO);") : (t(o.shared.vao, ".setVAO(null);"), ht(o, t, h, E.attributes, function() {
              return !0;
            })), je(o, t, h, E.uniforms, function() {
              return !0;
            }), _e(o, t, t, h);
          }
          function Qe(o, t) {
            var h = o.proc("draw", 1);
            Ke(o, h), it(o, h, t.context), ot(o, h, t.framebuffer), ct(o, h, t), dt(o, h, t.state), Le(o, h, t, !1, !0);
            var E = t.shader.progVar.append(o, h);
            if (h(o.shared.gl, ".useProgram(", E, ".program);"), t.shader.program)
              De(o, h, t, t.shader.program);
            else {
              h(o.shared.vao, ".setVAO(null);");
              var T = o.global.def("{}"), p = h.def(E, ".id"), m = h.def(T, "[", p, "]");
              h(
                o.cond(m).then(m, ".call(this,a0);").else(
                  m,
                  "=",
                  T,
                  "[",
                  p,
                  "]=",
                  o.link(function(b) {
                    return Me(De, o, t, b, 1);
                  }),
                  "(",
                  E,
                  ");",
                  m,
                  ".call(this,a0);"
                )
              );
            }
            Object.keys(t.state).length > 0 && h(o.shared.current, ".dirty=true;");
          }
          function Dt(o, t, h, E) {
            o.batchId = "a1", Ke(o, t);
            function T() {
              return !0;
            }
            ht(o, t, h, E.attributes, T), je(o, t, h, E.uniforms, T), _e(o, t, t, h);
          }
          function or(o, t, h, E) {
            Ke(o, t);
            var T = h.contextDep, p = t.def(), m = "a0", b = "a1", s = t.def();
            o.shared.props = s, o.batchId = p;
            var d = o.scope(), n = o.scope();
            t(
              d.entry,
              "for(",
              p,
              "=0;",
              p,
              "<",
              b,
              ";++",
              p,
              "){",
              s,
              "=",
              m,
              "[",
              p,
              "];",
              n,
              "}",
              d.exit
            );
            function g(ve) {
              return ve.contextDep && T || ve.propDep;
            }
            function S(ve) {
              return !g(ve);
            }
            if (h.needsContext && it(o, n, h.context), h.needsFramebuffer && ot(o, n, h.framebuffer), dt(o, n, h.state, g), h.profile && g(h.profile) && Le(o, n, h, !1, !0), E)
              h.useVAO ? h.drawVAO ? g(h.drawVAO) ? n(o.shared.vao, ".setVAO(", h.drawVAO.append(o, n), ");") : d(o.shared.vao, ".setVAO(", h.drawVAO.append(o, d), ");") : d(o.shared.vao, ".setVAO(", o.shared.vao, ".targetVAO);") : (d(o.shared.vao, ".setVAO(null);"), ht(o, d, h, E.attributes, S), ht(o, n, h, E.attributes, g)), je(o, d, h, E.uniforms, S), je(o, n, h, E.uniforms, g), _e(o, d, n, h);
            else {
              var N = o.global.def("{}"), P = h.shader.progVar.append(o, n), I = n.def(P, ".id"), K = n.def(N, "[", I, "]");
              n(
                o.shared.gl,
                ".useProgram(",
                P,
                ".program);",
                "if(!",
                K,
                "){",
                K,
                "=",
                N,
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
                P,
                ");}",
                K,
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
            var E = !1, T = !0;
            Object.keys(t.context).forEach(function(N) {
              E = E || t.context[N].propDep;
            }), E || (it(o, h, t.context), T = !1);
            var p = t.framebuffer, m = !1;
            p ? (p.propDep ? E = m = !0 : p.contextDep && E && (m = !0), m || ot(o, h, p)) : ot(o, h, null), t.state.viewport && t.state.viewport.propDep && (E = !0);
            function b(N) {
              return N.contextDep && E || N.propDep;
            }
            ct(o, h, t), dt(o, h, t.state, function(N) {
              return !b(N);
            }), (!t.profile || !b(t.profile)) && Le(o, h, t, !1, "a1"), t.contextDep = E, t.needsContext = T, t.needsFramebuffer = m;
            var s = t.shader.progVar;
            if (s.contextDep && E || s.propDep)
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
                var n = o.global.def("{}"), g = h.def(d, ".id"), S = h.def(n, "[", g, "]");
                h(
                  o.cond(S).then(S, ".call(this,a0,a1);").else(
                    S,
                    "=",
                    n,
                    "[",
                    g,
                    "]=",
                    o.link(function(N) {
                      return Me(or, o, t, N, 2);
                    }),
                    "(",
                    d,
                    ");",
                    S,
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
            var E = o.shared, T = E.current;
            it(o, h, t.context), t.framebuffer && t.framebuffer.append(o, h), Fo(Object.keys(t.state)).forEach(function(m) {
              var b = t.state[m], s = b.append(o, h);
              qe(s) ? s.forEach(function(d, n) {
                h.set(o.next[m], "[" + n + "]", d);
              }) : h.set(E.next, "." + m, s);
            }), Le(o, h, t, !0, !0), [rr, pn, ar, vn, nr].forEach(
              function(m) {
                var b = t.draw[m];
                b && h.set(E.draw, "." + m, "" + b.append(o, h));
              }
            ), Object.keys(t.uniforms).forEach(function(m) {
              var b = t.uniforms[m].append(o, h);
              Array.isArray(b) && (b = "[" + b.join() + "]"), h.set(
                E.uniforms,
                "[" + r.id(m) + "]",
                b
              );
            }), Object.keys(t.attributes).forEach(function(m) {
              var b = t.attributes[m].append(o, h), s = o.scopeAttrib(m);
              Object.keys(new A()).forEach(function(d) {
                h.set(s, "." + d, b[d]);
              });
            }), t.scopeVAO && h.set(E.vao, ".targetVAO", t.scopeVAO.append(o, h));
            function p(m) {
              var b = t.shader[m];
              b && h.set(E.shader, "." + m, b.append(o, h));
            }
            p(Nr), p(Dr), Object.keys(t.state).length > 0 && (h(T, ".dirty=true;"), h.exit(T, ".dirty=true;")), h("a1(", o.shared.context, ",a0,", o.batchId, ");");
          }
          function O(o) {
            if (!(typeof o != "object" || qe(o))) {
              for (var t = Object.keys(o), h = 0; h < t.length; ++h)
                if (St.isDynamic(o[t[h]]))
                  return !0;
              return !1;
            }
          }
          function ce(o, t, h) {
            var E = t.static[h];
            if (!E || !O(E))
              return;
            var T = o.global, p = Object.keys(E), m = !1, b = !1, s = !1, d = o.global.def("{}");
            p.forEach(function(g) {
              var S = E[g];
              if (St.isDynamic(S)) {
                typeof S == "function" && (S = E[g] = St.unbox(S));
                var N = xt(S, null);
                m = m || N.thisDep, s = s || N.propDep, b = b || N.contextDep;
              } else {
                switch (T(d, ".", g, "="), typeof S) {
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
                    T(o.link(S));
                    break;
                }
                T(";");
              }
            });
            function n(g, S) {
              p.forEach(function(N) {
                var P = E[N];
                if (St.isDynamic(P)) {
                  var I = g.invoke(S, P);
                  S(d, ".", N, "=", I, ";");
                }
              });
            }
            t.dynamic[h] = new St.DynamicVariable(hn, {
              thisDep: m,
              contextDep: b,
              propDep: s,
              ref: d,
              append: n
            }), delete t.static[h];
          }
          function Ge(o, t, h, E, T) {
            var p = ge();
            p.stats = p.link(T), Object.keys(t.static).forEach(function(b) {
              ce(p, t, b);
            }), $u.forEach(function(b) {
              ce(p, o, b);
            });
            var m = tt(o, t, h, E, p);
            return Qe(p, m), M(p, m), u(p, m), _(p.compile(), {
              destroy: function() {
                m.shader.program.destroy();
              }
            });
          }
          return {
            next: ue,
            current: z,
            procs: (function() {
              var o = ge(), t = o.proc("poll"), h = o.proc("refresh"), E = o.block();
              t(E), h(E);
              var T = o.shared, p = T.gl, m = T.next, b = T.current;
              E(b, ".dirty=false;"), ot(o, t), ot(o, h, null, !0);
              var s;
              Q && (s = o.link(Q)), l.oes_vertex_array_object && h(o.link(l.oes_vertex_array_object), ".bindVertexArrayOES(null);");
              for (var d = 0; d < G.maxAttributes; ++d) {
                var n = h.def(T.attributes, "[", d, "]"), g = o.cond(n, ".buffer");
                g.then(
                  p,
                  ".enableVertexAttribArray(",
                  d,
                  ");",
                  p,
                  ".bindBuffer(",
                  wr,
                  ",",
                  n,
                  ".buffer.buffer);",
                  p,
                  ".vertexAttribPointer(",
                  d,
                  ",",
                  n,
                  ".size,",
                  n,
                  ".type,",
                  n,
                  ".normalized,",
                  n,
                  ".stride,",
                  n,
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
                  n,
                  ".x,",
                  n,
                  ".y,",
                  n,
                  ".z,",
                  n,
                  ".w);",
                  n,
                  ".buffer=null;"
                ), h(g), Q && h(
                  s,
                  ".vertexAttribDivisorANGLE(",
                  d,
                  ",",
                  n,
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
              ), Object.keys(ae).forEach(function(S) {
                var N = ae[S], P = E.def(m, ".", S), I = o.block();
                I(
                  "if(",
                  P,
                  "){",
                  p,
                  ".enable(",
                  N,
                  ")}else{",
                  p,
                  ".disable(",
                  N,
                  ")}",
                  b,
                  ".",
                  S,
                  "=",
                  P,
                  ";"
                ), h(I), t(
                  "if(",
                  P,
                  "!==",
                  b,
                  ".",
                  S,
                  "){",
                  I,
                  "}"
                );
              }), Object.keys(X).forEach(function(S) {
                var N = X[S], P = z[S], I, K, ve = o.block();
                if (ve(p, ".", N, "("), qe(P)) {
                  var Re = P.length;
                  I = o.global.def(m, ".", S), K = o.global.def(b, ".", S), ve(
                    Et(Re, function(de) {
                      return I + "[" + de + "]";
                    }),
                    ");",
                    Et(Re, function(de) {
                      return K + "[" + de + "]=" + I + "[" + de + "];";
                    }).join("")
                  ), t(
                    "if(",
                    Et(Re, function(de) {
                      return I + "[" + de + "]!==" + K + "[" + de + "]";
                    }).join("||"),
                    "){",
                    ve,
                    "}"
                  );
                } else
                  I = E.def(m, ".", S), K = E.def(b, ".", S), ve(
                    I,
                    ");",
                    b,
                    ".",
                    S,
                    "=",
                    I,
                    ";"
                  ), t(
                    "if(",
                    I,
                    "!==",
                    K,
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
        function sc() {
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
        var fc = 34918, uc = 34919, Mo = 35007, cc = function(e, r) {
          if (!r.ext_disjoint_timer_query)
            return null;
          var l = [];
          function G() {
            return l.pop() || r.ext_disjoint_timer_query.createQueryEXT();
          }
          function D(Q) {
            l.push(Q);
          }
          var F = [];
          function k(Q) {
            var fe = G();
            r.ext_disjoint_timer_query.beginQueryEXT(Mo, fe), F.push(fe), W(F.length - 1, F.length, Q);
          }
          function H() {
            r.ext_disjoint_timer_query.endQueryEXT(Mo);
          }
          function Y() {
            this.startQueryIndex = -1, this.endQueryIndex = -1, this.sum = 0, this.stats = null;
          }
          var Z = [];
          function q() {
            return Z.pop() || new Y();
          }
          function re(Q) {
            Z.push(Q);
          }
          var oe = [];
          function W(Q, fe, z) {
            var ue = q();
            ue.startQueryIndex = Q, ue.endQueryIndex = fe, ue.sum = 0, ue.stats = z, oe.push(ue);
          }
          var ne = [], A = [];
          function B() {
            var Q, fe, z = F.length;
            if (z !== 0) {
              A.length = Math.max(A.length, z + 1), ne.length = Math.max(ne.length, z + 1), ne[0] = 0, A[0] = 0;
              var ue = 0;
              for (Q = 0, fe = 0; fe < F.length; ++fe) {
                var V = F[fe];
                r.ext_disjoint_timer_query.getQueryObjectEXT(V, uc) ? (ue += r.ext_disjoint_timer_query.getQueryObjectEXT(V, fc), D(V)) : F[Q++] = V, ne[fe + 1] = ue, A[fe + 1] = Q;
              }
              for (F.length = Q, Q = 0, fe = 0; fe < oe.length; ++fe) {
                var ae = oe[fe], X = ae.startQueryIndex, ie = ae.endQueryIndex;
                ae.sum += ne[ie] - ne[X];
                var ye = A[X], Ee = A[ie];
                Ee === ye ? (ae.stats.gpuTime += ae.sum / 1e6, re(ae)) : (ae.startQueryIndex = ye, ae.endQueryIndex = Ee, oe[Q++] = ae);
              }
              oe.length = Q;
            }
          }
          return {
            beginQuery: k,
            endQuery: H,
            pushScopeStats: W,
            update: B,
            getNumPendingQueries: function() {
              return F.length;
            },
            clear: function() {
              l.push.apply(l, F);
              for (var Q = 0; Q < l.length; Q++)
                r.ext_disjoint_timer_query.deleteQueryEXT(l[Q]);
              F.length = 0, l.length = 0;
            },
            restore: function() {
              F.length = 0, l.length = 0;
            }
          };
        }, lc = 16384, dc = 256, hc = 1024, mc = 34962, ko = "webglcontextlost", Bo = "webglcontextrestored", Io = 1, pc = 2, vc = 3;
        function No(e, r) {
          for (var l = 0; l < e.length; ++l)
            if (e[l] === r)
              return l;
          return -1;
        }
        function yc(e) {
          var r = hs(e);
          if (!r)
            return null;
          var l = r.gl, G = l.getContextAttributes(), D = l.isContextLost(), F = ms(l, r);
          if (!F)
            return null;
          var k = fs(), H = sc(), Y = F.extensions, Z = cc(l, Y), q = Xa(), re = l.drawingBufferWidth, oe = l.drawingBufferHeight, W = {
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
          }, B = tf(l, Y), Q = _f(
            l,
            H,
            r,
            z
          ), fe = Cu(
            l,
            Y,
            B,
            H,
            Q
          );
          function z(_e) {
            return fe.destroyBuffer(_e);
          }
          var ue = Cf(l, Y, Q, H), V = ku(l, k, H, r), ae = su(
            l,
            Y,
            B,
            function() {
              ye.procs.poll();
            },
            W,
            H,
            r
          ), X = fu(l, Y, B, H, r), ie = Ru(
            l,
            Y,
            B,
            ae,
            X,
            H
          ), ye = oc(
            l,
            k,
            Y,
            B,
            Q,
            ue,
            ae,
            ie,
            ne,
            fe,
            V,
            A,
            W,
            Z,
            r
          ), Ee = Nu(
            l,
            ie,
            ye.procs.poll,
            W,
            G,
            Y,
            B
          ), se = ye.next, J = l.canvas, $ = [], ge = [], Se = [], le = [r.onDestroy], Fe = null;
          function we() {
            if ($.length === 0) {
              Z && Z.update(), Fe = null;
              return;
            }
            Fe = Mn.next(we), dt();
            for (var _e = $.length - 1; _e >= 0; --_e) {
              var Me = $[_e];
              Me && Me(W, null, 0);
            }
            l.flush(), Z && Z.update();
          }
          function Oe() {
            !Fe && $.length > 0 && (Fe = Mn.next(we));
          }
          function $e() {
            Fe && (Mn.cancel(we), Fe = null);
          }
          function et(_e) {
            _e.preventDefault(), D = !0, $e(), ge.forEach(function(Me) {
              Me();
            });
          }
          function ft(_e) {
            l.getError(), D = !1, F.restore(), V.restore(), Q.restore(), ae.restore(), X.restore(), ie.restore(), fe.restore(), Z && Z.restore(), ye.procs.refresh(), Oe(), Se.forEach(function(Me) {
              Me();
            });
          }
          J && (J.addEventListener(ko, et, !1), J.addEventListener(Bo, ft, !1));
          function Be() {
            $.length = 0, $e(), J && (J.removeEventListener(ko, et), J.removeEventListener(Bo, ft)), V.clear(), ie.clear(), X.clear(), ae.clear(), ue.clear(), Q.clear(), fe.clear(), Z && Z.clear(), le.forEach(function(_e) {
              _e();
            });
          }
          function at(_e) {
            f(!!_e, "invalid args to regl({...})"), f.type(_e, "object", "invalid args to regl({...})");
            function Me(T) {
              var p = _({}, T);
              delete p.uniforms, delete p.attributes, delete p.context, delete p.vao, "stencil" in p && p.stencil.op && (p.stencil.opBack = p.stencil.opFront = p.stencil.op, delete p.stencil.op);
              function m(b) {
                if (b in p) {
                  var s = p[b];
                  delete p[b], Object.keys(s).forEach(function(d) {
                    p[b + "." + d] = s[d];
                  });
                }
              }
              return m("blend"), m("depth"), m("cull"), m("stencil"), m("polygonOffset"), m("scissor"), m("sample"), "vao" in T && (p.vao = T.vao), p;
            }
            function De(T, p) {
              var m = {}, b = {};
              return Object.keys(T).forEach(function(s) {
                var d = T[s];
                if (St.isDynamic(d)) {
                  b[s] = St.unbox(d, s);
                  return;
                } else if (p && Array.isArray(d)) {
                  for (var n = 0; n < d.length; ++n)
                    if (St.isDynamic(d[n])) {
                      b[s] = St.unbox(d, s);
                      return;
                    }
                }
                m[s] = d;
              }), {
                dynamic: b,
                static: m
              };
            }
            var Qe = De(_e.context || {}, !0), Dt = De(_e.uniforms || {}, !0), or = De(_e.attributes || {}, !1), u = De(Me(_e), !1), M = {
              gpuTime: 0,
              cpuTime: 0,
              count: 0
            }, O = ye.compile(u, or, Dt, Qe, M), ce = O.draw, Ge = O.batch, o = O.scope, t = [];
            function h(T) {
              for (; t.length < T; )
                t.push(null);
              return t;
            }
            function E(T, p) {
              var m;
              if (D && f.raise("context lost"), typeof T == "function")
                return o.call(this, null, T, 0);
              if (typeof p == "function")
                if (typeof T == "number")
                  for (m = 0; m < T; ++m)
                    o.call(this, null, p, m);
                else if (Array.isArray(T))
                  for (m = 0; m < T.length; ++m)
                    o.call(this, T[m], p, m);
                else
                  return o.call(this, T, p, 0);
              else if (typeof T == "number") {
                if (T > 0)
                  return Ge.call(this, h(T | 0), T | 0);
              } else if (Array.isArray(T)) {
                if (T.length)
                  return Ge.call(this, T, T.length);
              } else
                return ce.call(this, T);
            }
            return _(E, {
              stats: M,
              destroy: function() {
                O.destroy();
              }
            });
          }
          var He = ie.setFBO = at({
            framebuffer: St.define.call(null, Io, "framebuffer")
          });
          function tt(_e, Me) {
            var De = 0;
            ye.procs.poll();
            var Qe = Me.color;
            Qe && (l.clearColor(+Qe[0] || 0, +Qe[1] || 0, +Qe[2] || 0, +Qe[3] || 0), De |= lc), "depth" in Me && (l.clearDepth(+Me.depth), De |= dc), "stencil" in Me && (l.clearStencil(Me.stencil | 0), De |= hc), f(!!De, "called regl.clear with no buffer specified"), l.clear(De);
          }
          function it(_e) {
            if (f(
              typeof _e == "object" && _e,
              "regl.clear() takes an object as input"
            ), "framebuffer" in _e)
              if (_e.framebuffer && _e.framebuffer_reglType === "framebufferCube")
                for (var Me = 0; Me < 6; ++Me)
                  He(_({
                    framebuffer: _e.framebuffer.faces[Me]
                  }, _e), tt);
              else
                He(_e, tt);
            else
              tt(null, _e);
          }
          function ot(_e) {
            f.type(_e, "function", "regl.frame() callback must be a function"), $.push(_e);
            function Me() {
              var De = No($, _e);
              f(De >= 0, "cannot cancel a frame twice");
              function Qe() {
                var Dt = No($, Qe);
                $[Dt] = $[$.length - 1], $.length -= 1, $.length <= 0 && $e();
              }
              $[De] = Qe;
            }
            return Oe(), {
              cancel: Me
            };
          }
          function ct() {
            var _e = se.viewport, Me = se.scissor_box;
            _e[0] = _e[1] = Me[0] = Me[1] = 0, W.viewportWidth = W.framebufferWidth = W.drawingBufferWidth = _e[2] = Me[2] = l.drawingBufferWidth, W.viewportHeight = W.framebufferHeight = W.drawingBufferHeight = _e[3] = Me[3] = l.drawingBufferHeight;
          }
          function dt() {
            W.tick += 1, W.time = Le(), ct(), ye.procs.poll();
          }
          function Ke() {
            ae.refresh(), ct(), ye.procs.refresh(), Z && Z.update();
          }
          function Le() {
            return (Xa() - q) / 1e3;
          }
          Ke();
          function ht(_e, Me) {
            f.type(Me, "function", "listener callback must be a function");
            var De;
            switch (_e) {
              case "frame":
                return ot(Me);
              case "lost":
                De = ge;
                break;
              case "restore":
                De = Se;
                break;
              case "destroy":
                De = le;
                break;
              default:
                f.raise("invalid event, must be one of frame,lost,restore,destroy");
            }
            return De.push(Me), {
              cancel: function() {
                for (var Qe = 0; Qe < De.length; ++Qe)
                  if (De[Qe] === Me) {
                    De[Qe] = De[De.length - 1], De.pop();
                    return;
                  }
              }
            };
          }
          var je = _(at, {
            // Clear current FBO
            clear: it,
            // Short cuts for dynamic variables
            prop: St.define.bind(null, Io),
            context: St.define.bind(null, pc),
            this: St.define.bind(null, vc),
            // executes an empty draw command
            draw: at({}),
            // Resources
            buffer: function(_e) {
              return Q.create(_e, mc, !1, !1);
            },
            elements: function(_e) {
              return ue.create(_e, !1);
            },
            texture: ae.create2D,
            cube: ae.createCube,
            renderbuffer: X.create,
            framebuffer: ie.create,
            framebufferCube: ie.createCube,
            vao: fe.createVAO,
            // Expose context attributes
            attributes: G,
            // Frame rendering
            frame: ot,
            on: ht,
            // System limits
            limits: B,
            hasExtension: function(_e) {
              return B.extensions.indexOf(_e.toLowerCase()) >= 0;
            },
            // Read pixels
            read: Ee,
            // Destroy regl and all associated resources
            destroy: Be,
            // Direct GL state manipulation
            _gl: l,
            _refresh: Ke,
            poll: function() {
              dt(), Z && Z.update();
            },
            // Current time
            now: Le,
            // regl Statistics Information
            stats: H
          });
          return r.onDone(null, je), je;
        }
        return yc;
      }));
    })(On)), On.exports;
  }
  var al = nl();
  const qo = /* @__PURE__ */ Ia(al), il = Ic();
  class ol {
    constructor({
      pb: i = null,
      width: v = 1280,
      height: _ = 720,
      numSources: w = 4,
      numOutputs: L = 4,
      makeGlobal: te = !0,
      autoLoop: U = !0,
      detectAudio: pe = !0,
      enableStreamCapture: he = !0,
      canvas: Ve,
      precision: Pe,
      extendTransforms: Xe = {}
      // add your own functions on init
    } = {}) {
      if (Ko.init(), this.pb = i, this.width = v, this.height = _, this.renderAll = !1, this.detectAudio = pe, this._initCanvas(Ve), this.synth = {
        time: 0,
        bpm: 30,
        width: this.width,
        height: this.height,
        fps: void 0,
        stats: {
          fps: 0
        },
        speed: 1,
        mouse: il,
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
      }, te && (window.loadScript = this.loadScript), this.timeSinceLastUpdate = 0, this._time = 0, Pe && ["lowp", "mediump", "highp"].includes(Pe.toLowerCase()))
        this.precision = Pe.toLowerCase();
      else {
        let We = (/iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
        this.precision = We ? "highp" : "mediump";
      }
      if (this.extendTransforms = Xe, this.saveFrame = !1, this.captureStream = null, this.generator = void 0, this._initRegl(), this._initOutputs(L), this._initSources(w), this._generateGlslTransforms(), this.synth.screencap = () => {
        this.saveFrame = !0;
      }, he)
        try {
          this.captureStream = this.canvas.captureStream(25), this.synth.vidRecorder = new zc(this.captureStream);
        } catch (We) {
          console.warn(`[hydra-synth warning]
new MediaSource() is not currently supported on iOS.`), console.error(We);
        }
      pe && this._initAudio(), U && Rc(this.tick.bind(this)).start(), this.sandbox = new Vc(this.synth, te, ["speed", "update", "afterUpdate", "bpm", "fps"]);
    }
    eval(i) {
      this.sandbox.eval(i);
    }
    getScreenImage(i) {
      this.imageCallback = i, this.saveFrame = !0;
    }
    hush() {
      this.s.forEach((i) => {
        i.clear();
      }), this.o.forEach((i) => {
        this.synth.solid(0, 0, 0, 0).out(i);
      }), this.synth.render(this.o[0]), this.sandbox.set("update", (i) => {
      }), this.sandbox.set("afterUpdate", (i) => {
      });
    }
    loadScript(i = "") {
      return new Promise((_, w) => {
        var L = document.createElement("script");
        L.onload = function() {
          console.log(`loaded script ${i}`), _();
        }, L.onerror = (te) => {
          console.log(`error loading script ${i}`, "log-error"), _();
        }, L.src = i, document.head.appendChild(L);
      });
    }
    setResolution(i, v) {
      this.canvas.width = i, this.canvas.height = v, this.width = i, this.height = v, this.sandbox.set("width", i), this.sandbox.set("height", v), console.log(this.width), this.o.forEach((_) => {
        _.resize(i, v);
      }), this.s.forEach((_) => {
        _.resize(i, v);
      }), this.regl._refresh(), console.log(this.canvas.width);
    }
    canvasToImage(i) {
      const v = document.createElement("a");
      v.style.display = "none";
      let _ = /* @__PURE__ */ new Date();
      v.download = `hydra-${_.getFullYear()}-${_.getMonth() + 1}-${_.getDate()}-${_.getHours()}.${_.getMinutes()}.${_.getSeconds()}.png`, document.body.appendChild(v);
      var w = this;
      this.canvas.toBlob((L) => {
        w.imageCallback ? (w.imageCallback(L), delete w.imageCallback) : (v.href = URL.createObjectURL(L), console.log(v.href), v.click());
      }, "image/png"), setTimeout(() => {
        document.body.removeChild(v), window.URL.revokeObjectURL(v.href);
      }, 300);
    }
    _initAudio() {
      this.synth.a = new $c({
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
    _initCanvas(i) {
      i ? (this.canvas = i, this.width = i.width, this.height = i.height) : (this.canvas = document.createElement("canvas"), this.canvas.width = this.width, this.canvas.height = this.height, this.canvas.style.width = "100%", this.canvas.style.height = "100%", this.canvas.style.imageRendering = "pixelated", document.body.appendChild(this.canvas));
    }
    _initRegl() {
      const i = this.canvas.getContext("webgl2", {
        alpha: !0,
        antialias: !1,
        premultipliedAlpha: !1,
        preserveDrawingBuffer: !0
      });
      i ? this.regl = qo({
        gl: i,
        pixelRatio: 1
      }) : (console.warn("[hydra-synth] WebGL2 not available, falling back to WebGL1"), this.regl = qo({
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
    _initOutputs(i) {
      const v = this;
      this.o = Array(i).fill().map((_, w) => {
        var L = new bc({
          regl: this.regl,
          width: this.width,
          height: this.height,
          precision: this.precision,
          label: `o${w}`
        });
        return L.id = w, v.synth["o" + w] = L, L;
      }), this.output = this.o[0];
    }
    _initSources(i) {
      this.s = [];
      for (var v = 0; v < i; v++)
        this.createSource(v);
    }
    createSource(i) {
      let v = new Fc({ regl: this.regl, pb: this.pb, width: this.width, height: this.height, label: `s${i}` });
      return this.synth["s" + this.s.length] = v, this.s.push(v), v;
    }
    _generateGlslTransforms() {
      var i = this;
      this.generator = new el({
        defaultOutput: this.o[0],
        defaultUniforms: this.o[0].uniforms,
        extendTransforms: this.extendTransforms,
        changeListener: ({ type: v, method: _, synth: w }) => {
          v === "add" && (i.synth[_] = w.generators[_], i.sandbox && i.sandbox.add(_));
        }
      }), this.synth.setFunction = this.generator.setFunction.bind(this.generator);
    }
    _render(i) {
      i ? (this.output = i, this.isRenderingAll = !1) : this.isRenderingAll = !0;
    }
    // dt in ms
    tick(i, v) {
      try {
        if (this.sandbox.tick(), this.detectAudio === !0 && this.synth.a.tick(), this.sandbox.set("time", this.synth.time += i * 1e-3 * this.synth.speed), this.timeSinceLastUpdate += i, !this.synth.fps || this.timeSinceLastUpdate >= 1e3 / this.synth.fps) {
          if (this.synth.stats.fps = Math.ceil(1e3 / this.timeSinceLastUpdate), this.synth.update)
            try {
              this.synth.update(this.timeSinceLastUpdate);
            } catch (w) {
              console.log(w);
            }
          for (let w = 0; w < this.s.length; w++)
            this.s[w].tick(this.synth.time);
          const _ = this.synth.time;
          for (let w = 0; w < this.o.length; w++)
            this.o[w].tick({
              time: _,
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
            } catch (w) {
              console.log(w);
            }
          this.timeSinceLastUpdate = 0;
        }
        this.saveFrame === !0 && (this.canvasToImage(), this.saveFrame = !1);
      } catch (_) {
        console.warn("Error during tick():", _);
      }
    }
  }
  Zo.exports = ol;
});
export default sl();
