import IRenderEngine from './IRenderEngine.js'
import glslFunctions from '../shaders/basic-functions.js'
import utilityFunctions from '../shaders/utility-functions.js'
import generateGlsl from '../generate-glsl.js'

// Helper to convert GLSL1 to GLSL3 (texture2D -> texture)
function convertToGlsl3(glslCode) {
    return glslCode.replace(/texture2D\s*\(/g, 'texture(')
}

/**
 * WebGL2Engine - WebGL2 render engine with GLSL ES 3.0 support
 * Uses native WebGL2 API without regl dependency
 */
class WebGL2Engine extends IRenderEngine {
    constructor(options = {}) {
        super(options)
        this.gl = null
        this.programs = new Map()
        this.framebuffers = new Map()
        this.textures = new Map()
        this.buffers = new Map()
        this.currentProgram = null
        this.positionBuffer = null
        this.vao = null
    }

    // ============================================================
    // Lifecycle Methods
    // ============================================================

    init() {
        this.gl = this.canvas.getContext('webgl2', {
            alpha: true,
            antialias: false,
            depth: false,
            stencil: false,
            premultipliedAlpha: false
        })

        if (!this.gl) {
            throw new Error('WebGL2 is not supported in this browser')
        }

        // Disable global settings (match Regl default)
        // this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)

        // Create position buffer for fullscreen quad
        const positions = new Float32Array([
            -2, 0,
            0, -2,
            2, 2
        ])
        this.positionBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW)

        // Create VAO
        this.vao = this.gl.createVertexArray()
        this.gl.bindVertexArray(this.vao)

        this.clear({ color: [0, 0, 0, 1] })
        return this
    }

    destroy() {
        if (this.gl) {
            // Clean up all resources
            this.programs.forEach((prog) => this.gl.deleteProgram(prog))
            this.framebuffers.forEach((fb) => this.gl.deleteFramebuffer(fb.framebuffer))
            this.textures.forEach((tex) => this.gl.deleteTexture(tex))
            this.buffers.forEach((buf) => this.gl.deleteBuffer(buf))

            if (this.positionBuffer) this.gl.deleteBuffer(this.positionBuffer)
            if (this.vao) this.gl.deleteVertexArray(this.vao)

            this.programs.clear()
            this.framebuffers.clear()
            this.textures.clear()
            this.buffers.clear()
            this.gl = null
        }
    }

    refresh() {
        // WebGL2 doesn't need explicit refresh like regl
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    }

    // ============================================================
    // Resource Creation Methods
    // ============================================================

    createFramebuffer(options) {
        const gl = this.gl
        const { width, height } = options

        // Create texture for framebuffer
        const texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        // Create framebuffer
        const framebuffer = gl.createFramebuffer()
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

        const fbo = {
            framebuffer,
            texture,
            width,
            height,
            resize: (newWidth, newHeight) => {
                gl.bindTexture(gl.TEXTURE_2D, texture)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, newWidth, newHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
                fbo.width = newWidth
                fbo.height = newHeight
            }
        }

        return fbo
    }

    createTexture(options) {
        const gl = this.gl
        const texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)

        const { width, height, shape, data, mag = 'nearest' } = options

        // Determine dimensions - support both width/height and shape
        let texWidth = width || (shape && shape[0]) || 1
        let texHeight = height || (shape && shape[1]) || 1

        // Handle different data types
        if (data && (data instanceof HTMLVideoElement || data instanceof HTMLImageElement || data instanceof HTMLCanvasElement)) {
            // DOM element - use texImage2D with element
            texWidth = data.videoWidth || data.width || texWidth
            texHeight = data.videoHeight || data.height || texHeight
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data)
        } else if (data) {
            // ArrayBuffer or typed array
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texWidth, texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, data)
        } else {
            // No data - create empty texture
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texWidth, texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag === 'linear' ? gl.LINEAR : gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        // Create a texture wrapper object with resize and subimage methods (like regl)
        const self = this
        const texWrapper = {
            _texture: texture,
            width: texWidth,
            height: texHeight,
            resize: function (newWidth, newHeight) {
                gl.bindTexture(gl.TEXTURE_2D, texture)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, newWidth, newHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
                this.width = newWidth
                this.height = newHeight
            },
            subimage: function (source) {
                gl.bindTexture(gl.TEXTURE_2D, texture)
                if (source instanceof HTMLVideoElement || source instanceof HTMLImageElement || source instanceof HTMLCanvasElement) {
                    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, source)
                }
            },
            // For uniform binding compatibility
            get texture() { return texture }
        }

        return texWrapper
    }

    createBuffer(data) {
        const gl = this.gl
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.flat()), gl.STATIC_DRAW)
        return buffer
    }

    // ============================================================
    // Shader Compilation Helpers
    // ============================================================

    _compileShader(type, source) {
        const gl = this.gl
        const shader = gl.createShader(type)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader)
            gl.deleteShader(shader)
            throw new Error(`Shader compilation error: ${error}`)
        }

        return shader
    }

    _createProgram(vertSource, fragSource) {
        const gl = this.gl
        const vertShader = this._compileShader(gl.VERTEX_SHADER, vertSource)
        const fragShader = this._compileShader(gl.FRAGMENT_SHADER, fragSource)

        const program = gl.createProgram()
        gl.attachShader(program, vertShader)
        gl.attachShader(program, fragShader)
        gl.linkProgram(program)

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(program)
            gl.deleteProgram(program)
            throw new Error(`Program linking error: ${error}`)
        }

        gl.deleteShader(vertShader)
        gl.deleteShader(fragShader)

        return program
    }

    // ============================================================
    // Rendering Methods
    // ============================================================

    createDrawCommand(options) {
        const gl = this.gl
        const { frag, vert, attributes, uniforms, count, framebuffer } = options

        // Create or get cached program
        const programKey = frag + vert
        let program = this.programs.get(programKey)
        if (!program) {
            program = this._createProgram(vert, frag)
            this.programs.set(programKey, program)
        }

        // Return a draw function that mimics regl's behavior
        return (props) => {
            gl.useProgram(program)

            // Set up framebuffer if provided
            let targetFbo = null
            if (framebuffer) {
                targetFbo = typeof framebuffer === 'function' ? framebuffer() : framebuffer
                gl.bindFramebuffer(gl.FRAMEBUFFER, targetFbo.framebuffer)
                gl.viewport(0, 0, targetFbo.width, targetFbo.height)
            } else {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null)
                gl.viewport(0, 0, this.canvas.width, this.canvas.height)
            }

            // Set up position attribute
            const positionLoc = gl.getAttribLocation(program, 'position')
            if (positionLoc >= 0) {
                // Use attribute from options if available and VALID, otherwise fallback
                let bufferToBind = this.positionBuffer
                if (attributes && attributes.position && attributes.position instanceof WebGLBuffer) {
                    bufferToBind = attributes.position
                }

                gl.bindBuffer(gl.ARRAY_BUFFER, bufferToBind)
                gl.enableVertexAttribArray(positionLoc)
                gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)
            }

            // Set uniforms
            let textureUnit = 0
            for (const [name, value] of Object.entries(uniforms)) {
                const loc = gl.getUniformLocation(program, name)
                if (loc === null) continue

                let uniformValue = typeof value === 'function' ? value(null, props) : value

                if (uniformValue && uniformValue.framebuffer !== undefined) {
                    // It's a framebuffer texture
                    gl.activeTexture(gl.TEXTURE0 + textureUnit)
                    gl.bindTexture(gl.TEXTURE_2D, uniformValue.texture)
                    gl.uniform1i(loc, textureUnit)
                    textureUnit++
                } else if (uniformValue && uniformValue.texture instanceof WebGLTexture) {
                    // It's a texture wrapper (from createTexture)
                    gl.activeTexture(gl.TEXTURE0 + textureUnit)
                    gl.bindTexture(gl.TEXTURE_2D, uniformValue.texture)
                    gl.uniform1i(loc, textureUnit)
                    textureUnit++
                } else if (uniformValue && uniformValue instanceof WebGLTexture) {
                    gl.activeTexture(gl.TEXTURE0 + textureUnit)
                    gl.bindTexture(gl.TEXTURE_2D, uniformValue)
                    gl.uniform1i(loc, textureUnit)
                    textureUnit++
                } else if (Array.isArray(uniformValue)) {
                    if (uniformValue.length === 2) {
                        gl.uniform2fv(loc, uniformValue)
                    } else if (uniformValue.length === 3) {
                        gl.uniform3fv(loc, uniformValue)
                    } else if (uniformValue.length === 4) {
                        gl.uniform4fv(loc, uniformValue)
                    }
                } else if (typeof uniformValue === 'number') {
                    gl.uniform1f(loc, uniformValue)
                }
            }

            gl.drawArrays(gl.TRIANGLES, 0, count)
        }
    }

    clear(options) {
        const gl = this.gl
        const [r, g, b, a] = options.color || [0, 0, 0, 1]
        gl.clearColor(r, g, b, a)
        gl.clear(gl.COLOR_BUFFER_BIT)
    }

    // ============================================================
    // Shader Language Methods
    // ============================================================

    getShaderLanguage() {
        return 'glsl3'
    }

    getShaderFunctions() {
        // Use unified glsl-functions, engine will convert texture2D -> texture
        return glslFunctions()
    }

    getUtilityFunctions() {
        return utilityFunctions
    }

    generateShader(transforms) {
        return generateGlsl(transforms)
    }

    // Helper to get shader code with GLSL3 conversion
    getShaderCode(shader) {
        // If shader has glsl3 property, use it; otherwise convert glsl
        if (shader.glsl3) {
            return shader.glsl3
        }
        return convertToGlsl3(shader.glsl)
    }

    compileShader(options) {
        const { shaderInfo, defaultUniforms } = options
        const uniforms = {}
        shaderInfo.uniforms.forEach((uniform) => {
            uniforms[uniform.name] = uniform.value
        })

        const frag = `#version 300 es
precision ${this.precision} float;
${Object.values(shaderInfo.uniforms).map((uniform) => {
            let type = uniform.type
            switch (uniform.type) {
                case 'texture':
                    type = 'sampler2D'
                    break
            }
            return `uniform ${type} ${uniform.name};`
        }).join('\n')}
uniform float time;
uniform vec2 resolution;
uniform sampler2D prevBuffer;
in vec2 uv;
out vec4 fragColor;

${Object.values(this.getUtilityFunctions()).map((transform) => {
            return convertToGlsl3(transform.glsl)
        }).join('\n')}

${shaderInfo.glslFunctions.map((transform) => {
            // Use glsl3 if available, otherwise convert glsl
            return this.getShaderCode(transform.transform)
        }).join('\n')}

void main () {
  vec2 st = gl_FragCoord.xy/resolution.xy;
  st.y = 1.0 - st.y;

  ${shaderInfo.fragColor}
  fragColor = c;
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
        return (context, props) => props[name]
    }

    // ============================================================
    // Default Shaders (GLSL 3.0 ES)
    // ============================================================

    getDefaultVertexShader() {
        return `#version 300 es
precision ${this.precision} float;
in vec2 position;
out vec2 uv;

void main () {
  uv = position;
  gl_Position = vec4(2.0 * position - 1.0, 0, 1);
}`
    }

    getRenderAllShader() {
        return `#version 300 es
precision ${this.precision} float;
in vec2 uv;
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform sampler2D tex2;
uniform sampler2D tex3;
out vec4 fragColor;

void main () {
  vec2 st = vec2(1.0 - uv.x, uv.y);
  st *= vec2(2);
  vec2 q = floor(st).xy * vec2(2.0, 1.0);
  int quad = int(q.x) + int(q.y);
  st.x += step(1., mod(st.y, 2.0));
  st.y += step(1., mod(st.x, 2.0));
  st = fract(st);
  if(quad == 0){
    fragColor = texture(tex0, st);
  } else if(quad == 1){
    fragColor = texture(tex1, st);
  } else if (quad == 2){
    fragColor = texture(tex2, st);
  } else {
    fragColor = texture(tex3, st);
  }
}
`
    }

    getRenderFboShader() {
        return `#version 300 es
precision ${this.precision} float;
in vec2 uv;
uniform vec2 resolution;
uniform sampler2D tex0;
out vec4 fragColor;

void main () {
  fragColor = texture(tex0, vec2(1.0 - uv.x, uv.y));
}
`
    }
}

export default WebGL2Engine
