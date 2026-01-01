import IRenderEngine from './IRenderEngine.js'
import regl from 'regl'
import glslFunctions from '../shaders/basic-functions.js'
import utilityFunctions from '../shaders/utility-functions.js'
import generateGlsl from '../generate-glsl.js'

/**
 * ReglEngine - WebGL1 render engine using regl library
 * This is the default engine that maintains backward compatibility with original Hydra
 */
class ReglEngine extends IRenderEngine {
    constructor(options = {}) {
        super(options)
        this.regl = null
    }

    // ============================================================
    // Lifecycle Methods
    // ============================================================

    init() {
        this.regl = regl({
            canvas: this.canvas,
            pixelRatio: 1
        })

        this.clear({ color: [0, 0, 0, 1] })
        return this
    }

    destroy() {
        if (this.regl) {
            this.regl.destroy()
            this.regl = null
        }
    }

    refresh() {
        if (this.regl) {
            this.regl._refresh()
        }
    }

    // ============================================================
    // Resource Creation Methods
    // ============================================================

    createFramebuffer(options) {
        return this.regl.framebuffer({
            color: this.regl.texture({
                mag: 'nearest',
                width: options.width,
                height: options.height,
                format: 'rgba'
            }),
            depthStencil: false
        })
    }

    createTexture(options) {
        return this.regl.texture(options)
    }

    createBuffer(data) {
        return this.regl.buffer(data)
    }

    // ============================================================
    // Rendering Methods
    // ============================================================

    createDrawCommand(options) {
        return this.regl(options)
    }

    clear(options) {
        this.regl.clear(options)
    }

    // ============================================================
    // Shader Language Methods
    // ============================================================

    getShaderLanguage() {
        return 'glsl1'
    }

    getShaderFunctions() {
        return glslFunctions()
    }

    getUtilityFunctions() {
        return utilityFunctions
    }

    generateShader(transforms) {
        return generateGlsl(transforms)
    }

    compileShader(options) {
        const { shaderInfo, defaultUniforms } = options
        const uniforms = {}
        shaderInfo.uniforms.forEach((uniform) => {
            uniforms[uniform.name] = uniform.value
        })

        const frag = `
  precision ${this.precision} float;
  ${Object.values(shaderInfo.uniforms).map((uniform) => {
            let type = uniform.type
            switch (uniform.type) {
                case 'texture':
                    type = 'sampler2D'
                    break
            }
            return `
      uniform ${type} ${uniform.name};`
        }).join('')}
  uniform float time;
  uniform vec2 resolution;
  varying vec2 uv;
  uniform sampler2D prevBuffer;

  ${Object.values(this.getUtilityFunctions()).map((transform) => {
            return `
            ${transform.glsl}
          `
        }).join('')}

  ${shaderInfo.glslFunctions.map((transform) => {
            return `
            ${transform.transform.glsl}
          `
        }).join('')}

  void main () {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    st.y = 1.0 - st.y;

    ${shaderInfo.fragColor}
    gl_FragColor = c;
  }
  `

        return {
            frag,
            uniforms: Object.assign({}, defaultUniforms, uniforms)
        }
    }

    // ============================================================
    // Uniform Helpers
    // ============================================================

    prop(name) {
        return this.regl.prop(name)
    }

    // ============================================================
    // Default Shaders (used by HydraRenderer)
    // ============================================================

    getDefaultVertexShader() {
        return `
  precision ${this.precision} float;
  attribute vec2 position;
  varying vec2 uv;

  void main () {
    uv = position;
    gl_Position = vec4(2.0 * position - 1.0, 0, 1);
  }`
    }

    getRenderAllShader() {
        return `
  precision ${this.precision} float;
  varying vec2 uv;
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
      gl_FragColor = texture2D(tex0, st);
    } else if(quad==1){
      gl_FragColor = texture2D(tex1, st);
    } else if (quad==2){
      gl_FragColor = texture2D(tex2, st);
    } else {
      gl_FragColor = texture2D(tex3, st);
    }
  }
  `
    }

    getRenderFboShader() {
        return `
  precision ${this.precision} float;
  varying vec2 uv;
  uniform vec2 resolution;
  uniform sampler2D tex0;

  void main () {
    gl_FragColor = texture2D(tex0, vec2(1.0 - uv.x, uv.y));
  }
  `
    }
}

export default ReglEngine
