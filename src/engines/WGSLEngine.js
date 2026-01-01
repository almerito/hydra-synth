import IRenderEngine from './IRenderEngine.js'
import glslFunctions from '../shaders/basic-functions.js'
import utilityFunctions from '../shaders/utility-functions.js'
import generateWgsl from './wgsl-generator.js'

/**
 * WGSLEngine - WebGPU render engine with WGSL shader support
 * Uses native WebGPU API
 * Note: Uses unified glsl-functions.js and reads 'wgsl' property from each shader
 */
class WGSLEngine extends IRenderEngine {
    constructor(options = {}) {
        super(options)
        this.engineId = Math.floor(Math.random() * 1000000) // Unique ID for zombie detection
        this.device = null
        this.context = null
        this.format = null
        this.pipelines = new Map()
        this.bindGroupLayouts = new Map()
        this.textures = new Map()
        this.buffers = new Map()
        this.uniformBuffer = null
        this.positionBuffer = null
        this.initialized = false

        // Track active resources for lifecycle management and resurrection
        this._activeFramebuffers = new Set()
        this._activeTextures = new Set()
    }

    // ============================================================
    // Lifecycle Methods
    // ============================================================

    init() {
        if (!navigator.gpu) {
            console.error('[WGSLEngine] WebGPU is not supported in this browser')
            this._initError = new Error('WebGPU is not supported in this browser')
            return this
        }
        this._initPromise = this._asyncInit().catch(err => {
            console.error('[WGSLEngine] Initialization failed:', err)
            this._initError = err
        })
        return this
    }

    async _asyncInit() {
        const adapter = await navigator.gpu.requestAdapter()
        if (!adapter) throw new Error('Failed to get WebGPU adapter')

        this.device = await adapter.requestDevice()
        this.context = this.canvas.getContext('webgpu')
        // Tag canvas with current engine ID to detect zombies
        this.canvas._wgpu_engine_id = this.engineId

        this.format = navigator.gpu.getPreferredCanvasFormat()

        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: 'premultiplied'
        })

        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
        this.positionBuffer = this.device.createBuffer({
            size: positions.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        })
        this.device.queue.writeBuffer(this.positionBuffer, 0, positions)

        this.uniformBuffer = this.device.createBuffer({
            size: 32, // time(4) + resolution(8) + padding
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })

        // Hydrate/Resurrect all active resources
        this._initPendingResources()

        this.initialized = true
        console.log('[WGSLEngine] WebGPU initialized successfully')
        this.clear({ color: [0, 0, 0, 1] })
        return this
    }

    _initPendingResources() {
        // Resurrect Framebuffers
        this._activeFramebuffers.forEach(({ fbo, options }) => {
            // Re-create resources for valid fbo objects
            if (fbo.texture) fbo.texture.destroy() // cleanup if random leftovers

            const { width, height } = options
            const texture = this.device.createTexture({
                size: [width, height, 1],
                format: this.format,
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST
            })
            fbo.texture = texture
            fbo.view = texture.createView()
        })

        // Resurrect Textures
        this._activeTextures.forEach(({ texWrapper, options }) => {
            if (texWrapper._texture) texWrapper._texture.destroy()

            const { width, height, shape, data } = options
            const texWidth = width || (shape && shape[0]) || 1
            const texHeight = height || (shape && shape[1]) || 1

            const texture = this.device.createTexture({
                size: [texWidth, texHeight, 1],
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
            })
            const sampler = this.device.createSampler({
                magFilter: 'nearest',
                minFilter: 'nearest'
            })

            texWrapper._texture = texture
            texWrapper.view = texture.createView()
            texWrapper.sampler = sampler

            // Re-upload data if possible (e.g. from static options)
            // Note: If data was a stream or dynamic, it needs to be updated by the user/engine loop separately
            if (data && (data instanceof HTMLVideoElement || data instanceof HTMLImageElement || data instanceof HTMLCanvasElement)) {
                createImageBitmap(data).then(imageBitmap => {
                    this.device.queue.copyExternalImageToTexture(
                        { source: imageBitmap },
                        { texture: texture },
                        [imageBitmap.width, imageBitmap.height]
                    )
                })
            }
        })
    }

    destroy() {
        // Clear GPU resources but KEEP tracking objects to support resurrection on re-init
        this.initialized = false // Stop rendering immediately

        if (this.device) {
            this.pipelines.clear()
            this.bindGroupLayouts.clear()

            // Destroy active resources
            this._activeFramebuffers.forEach(({ fbo }) => {
                if (fbo.texture) fbo.texture.destroy()
                fbo.texture = null
                fbo.view = null
            })

            this._activeTextures.forEach(({ texWrapper }) => {
                if (texWrapper._texture) texWrapper._texture.destroy()
                texWrapper._texture = null
                texWrapper.view = null
            })

            if (this.positionBuffer) this.positionBuffer.destroy()
            if (this.uniformBuffer) this.uniformBuffer.destroy()

            this.device = null
            this.context = null
            this.uniformBuffer = null
            this.positionBuffer = null
        }
    }

    refresh() {
        // WebGPU doesn't need explicit refresh
    }

    createFramebuffer(options) {
        // Create FBO object structure immediately
        const fbo = {
            texture: null,
            view: null,
            width: options.width,
            height: options.height,
            resize: (newWidth, newHeight) => {
                options.width = newWidth
                options.height = newHeight
                if (!this.device) return
                if (fbo.texture) fbo.texture.destroy()
                const newTexture = this.device.createTexture({
                    size: [newWidth, newHeight, 1],
                    format: this.format,
                    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST
                })
                fbo.texture = newTexture
                fbo.view = newTexture.createView()
                fbo.width = newWidth
                fbo.height = newHeight
            },
            destroy: () => {
                if (fbo.texture) fbo.texture.destroy()
                this._activeFramebuffers.delete(entry)
            }
        }

        const entry = { fbo, options }
        this._activeFramebuffers.add(entry)

        // If device ready, populate it
        if (this.device) {
            const { width, height } = options
            const texture = this.device.createTexture({
                size: [width, height, 1],
                format: this.format,
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST
            })
            fbo.texture = texture
            fbo.view = texture.createView()
        }

        return fbo
    }

    createTexture(options) {
        // Create wrapper structure immediately
        const texWrapper = {
            _texture: null,
            view: null,
            sampler: null,
            width: options.width || (options.shape && options.shape[0]) || 1,
            height: options.height || (options.shape && options.shape[1]) || 1,
            resize: (newWidth, newHeight) => {
                options.width = newWidth
                options.height = newHeight
                texWrapper.width = newWidth
                texWrapper.height = newHeight
                if (!this.device) return
                if (texWrapper._texture) texWrapper._texture.destroy()

                const newTexture = this.device.createTexture({
                    size: [newWidth, newHeight, 1],
                    format: 'rgba8unorm',
                    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
                })
                texWrapper._texture = newTexture
                texWrapper.view = newTexture.createView()
            },
            subimage: async (source) => {
                // If device not ready, changing source is tricky to cache for subimage, 
                // but typically subimage is called in render loop.
                if (!this.device) return
                if (source instanceof HTMLVideoElement || source instanceof HTMLImageElement || source instanceof HTMLCanvasElement) {
                    const imageBitmap = await createImageBitmap(source)
                    this.device.queue.copyExternalImageToTexture(
                        { source: imageBitmap },
                        { texture: texWrapper._texture },
                        [imageBitmap.width, imageBitmap.height]
                    )
                }
            },
            destroy: () => {
                if (texWrapper._texture) texWrapper._texture.destroy()
                this._activeTextures.delete(entry)
            },
            get texture() { return this._texture }
        }

        const entry = { texWrapper, options }
        this._activeTextures.add(entry)

        // If device ready, populate it
        if (this.device) {
            const { width, height, shape, data } = options
            const texWidth = width || (shape && shape[0]) || 1
            const texHeight = height || (shape && shape[1]) || 1

            const texture = this.device.createTexture({
                size: [texWidth, texHeight, 1],
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
            })

            const sampler = this.device.createSampler({
                magFilter: 'nearest',
                minFilter: 'nearest'
            })

            texWrapper._texture = texture
            texWrapper.view = texture.createView()
            texWrapper.sampler = sampler

            if (data && this.device) {
                // Handle initial data upload
                if (data instanceof HTMLVideoElement || data instanceof HTMLImageElement || data instanceof HTMLCanvasElement) {
                    createImageBitmap(data).then(imageBitmap => {
                        this.device.queue.copyExternalImageToTexture(
                            { source: imageBitmap },
                            { texture: texture },
                            [imageBitmap.width, imageBitmap.height]
                        )
                    })
                }
            }
        }

        return texWrapper
    }

    createBuffer(data) {
        // Guard: return stub if device not ready
        if (!this.device) {
            return null
        }
        const floatData = new Float32Array(data.flat())
        const buffer = this.device.createBuffer({
            size: floatData.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        })
        this.device.queue.writeBuffer(buffer, 0, floatData)
        return buffer
    }

    // ============================================================
    // Rendering Methods
    // ============================================================

    createDrawCommand(options) {
        const { frag, vert, uniforms, count, framebuffer } = options

        let pipeline = null
        let shaderModule = null

        // Return draw function immediately (lazy init)
        return (props) => {
            // Skip if device not fully initialized or buffers missing
            if (!this.initialized || !this.device || !this.context || !this.uniformBuffer) return

            // Initialize pipeline on first valid run
            if (!pipeline) {
                try {
                    const shaderCode = `
${vert}

${frag}
`
                    shaderModule = this.device.createShaderModule({
                        code: shaderCode
                    })

                    pipeline = this.device.createRenderPipeline({
                        layout: 'auto',
                        vertex: {
                            module: shaderModule,
                            entryPoint: 'vs_main',
                            buffers: [{
                                arrayStride: 8,
                                attributes: [{
                                    format: 'float32x2',
                                    offset: 0,
                                    shaderLocation: 0
                                }]
                            }]
                        },
                        fragment: {
                            module: shaderModule,
                            entryPoint: 'fs_main',
                            targets: [{
                                format: this.format
                            }]
                        },
                        primitive: {
                            topology: 'triangle-list'
                        }
                    })
                } catch (e) {
                    console.error('[WGSLEngine] Shader compilation error:', e)
                    // Prevent retrying every frame if compilation fails
                    pipeline = 'error'
                    return
                }
            }

            if (pipeline === 'error') return

            // Update uniform buffer
            // Note: In a real implementation, we should handle dynamic uniforms here
            const uniformData = new Float32Array([
                props.time || 0,
                0, // padding
                props.resolution ? props.resolution[0] : this.canvas.width,
                props.resolution ? props.resolution[1] : this.canvas.height
            ])
            this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData)

            // Get target texture
            let targetView
            if (framebuffer) {
                const fbo = typeof framebuffer === 'function' ? framebuffer() : framebuffer
                targetView = fbo.view
                // Skip render if framebuffer texture view is missing
                if (!targetView) {
                    return
                }
            } else {
                try {
                    targetView = this.context.getCurrentTexture().createView()
                } catch (e) {
                    // console.warn('[WGSLEngine] Context lost or invalid, skipping frame')
                    return
                }
            }

            const entries = [{
                binding: 0,
                resource: { buffer: this.uniformBuffer }
            }]

            // Handle tex0 for default shaders (and potentially src() if mapped similarly)
            // TODO: systematic handling of multiple textures based on shader reflection or options
            if (props.tex0) {
                // Determine view: prefer .view property (wrapper), else assume it's a direct view
                let texResource = props.tex0.view
                if (!texResource && props.tex0.constructor && props.tex0.constructor.name === 'GPUTextureView') {
                    texResource = props.tex0
                }

                if (texResource) {
                    entries.push({
                        binding: 1,
                        resource: texResource
                    })
                    entries.push({
                        binding: 2,
                        resource: props.tex0.sampler || this.device.createSampler({
                            magFilter: 'linear',
                            minFilter: 'linear'
                        })
                    })
                } else {
                    // Log warning if texture present but invalid view
                    // console.warn('WGSLEngine: Invalid texture prop', props.tex0)
                    // Do not add entries - this will likely cause layout mismatch error but better than hard crash
                }
            }

            const bindGroup = this.device.createBindGroup({
                layout: pipeline.getBindGroupLayout(0),
                entries: entries
            })

            // Create command encoder
            const commandEncoder = this.device.createCommandEncoder()
            const renderPass = commandEncoder.beginRenderPass({
                colorAttachments: [{
                    view: targetView,
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                    loadOp: 'clear',
                    storeOp: 'store'
                }]
            })

            renderPass.setPipeline(pipeline)
            renderPass.setBindGroup(0, bindGroup)
            // Warning: positionBuffer might be null if _ensureReady logic race condition happens, but checks above should prevent it
            if (this.positionBuffer) {
                renderPass.setVertexBuffer(0, this.positionBuffer)
                renderPass.draw(6)
            }
            renderPass.end()

            this.device.queue.submit([commandEncoder.finish()])
        }
    }

    clear(options) {
        if (!this.context) return

        const [r, g, b, a] = options.color || [0, 0, 0, 1]
        const commandEncoder = this.device.createCommandEncoder()
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: this.context.getCurrentTexture().createView(),
                clearValue: { r, g, b, a },
                loadOp: 'clear',
                storeOp: 'store'
            }]
        })
        renderPass.end()
        this.device.queue.submit([commandEncoder.finish()])
    }

    // ============================================================
    // Shader Language Methods
    // ============================================================

    getShaderLanguage() {
        return 'wgsl'
    }

    getShaderFunctions() {
        // Use unified glsl-functions, engine will read 'wgsl' property
        return glslFunctions()
    }

    getUtilityFunctions() {
        // Use unified utility-functions with wgsl property
        return utilityFunctions
    }

    generateShader(transforms) {
        return generateWgsl(transforms)
    }

    // Helper to get shader code - uses wgsl property if available
    getShaderCode(shader) {
        if (shader.wgsl) {
            return shader.wgsl
        }
        console.warn(`Shader "${shader.name}" has no WGSL implementation, will not work correctly`)
        return ''
    }

    compileShader(options) {
        const { shaderInfo, defaultUniforms } = options
        const uniforms = {}
        shaderInfo.uniforms.forEach((uniform) => {
            uniforms[uniform.name] = uniform.value
        })

        // Generate WGSL fragment shader
        const frag = `
struct Uniforms {
    time: f32,
    _padding: f32,
    resolution: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

${Object.values(this.getUtilityFunctions()).map((transform) => {
            return transform.wgsl.replace(/\b(uniforms\.)?time\b/g, 'uniforms.time').replace(/\b(uniforms\.)?resolution\b/g, 'uniforms.resolution')
        }).join('\n')}

${shaderInfo.glslFunctions.map((transform) => {
            return (transform.transform.wgsl || '').replace(/\b(uniforms\.)?time\b/g, 'uniforms.time').replace(/\b(uniforms\.)?resolution\b/g, 'uniforms.resolution')
        }).join('\n')}

@fragment
fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
    let st = uv;
    ${shaderInfo.fragColor}
    // Optimization guard: ensure uniforms are used
    let _keep = uniforms.time * 0.0000001;
    return c + vec4<f32>(_keep);
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
    // Default Shaders (WGSL)
    // ============================================================

    getDefaultVertexShader() {
        return `
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
}

@vertex
fn vs_main(@location(0) position: vec2<f32>) -> VertexOutput {
    var output: VertexOutput;
    output.position = vec4<f32>(position, 0.0, 1.0);
    output.uv = position * 0.5 + 0.5;
    return output;
}`
    }

    getRenderAllShader() {
        return `
struct Uniforms {
    time: f32,
    _padding: f32,
    resolution: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var tex0: texture_2d<f32>;
@group(0) @binding(2) var tex0Sampler: sampler;

@fragment
fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
    // Force usage of uniforms to prevent optimization removing binding 0
    let _dummy = uniforms.time * 0.000001;
    return textureSample(tex0, tex0Sampler, uv) + vec4<f32>(_dummy);
}`
    }

    getRenderFboShader() {
        return `
struct Uniforms {
    time: f32,
    _padding: f32,
    resolution: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var tex0: texture_2d<f32>;
@group(0) @binding(2) var tex0Sampler: sampler;

@fragment
fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
    // Force usage of uniforms to prevent optimization removing binding 0
    let _dummy = uniforms.time * 0.000001;
    return textureSample(tex0, tex0Sampler, vec2<f32>(1.0 - uv.x, uv.y)) + vec4<f32>(_dummy);
}`
    }
}

export default WGSLEngine
