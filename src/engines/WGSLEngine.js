import IRenderEngine from './IRenderEngine.js'
import glslFunctions from '../shaders/basic-functions.js'
import utilityFunctions from '../shaders/utility-functions.js'

/**
 * WGSLEngine - WebGPU render engine with WGSL shader support
 * Uses native WebGPU API
 * Note: Uses unified glsl-functions.js and reads 'wgsl' property from each shader
 */
class WGSLEngine extends IRenderEngine {
    constructor(options = {}) {
        super(options)
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
    }

    // ============================================================
    // Lifecycle Methods
    // ============================================================

    async init() {
        if (!navigator.gpu) {
            throw new Error('WebGPU is not supported in this browser')
        }

        const adapter = await navigator.gpu.requestAdapter()
        if (!adapter) {
            throw new Error('Failed to get WebGPU adapter')
        }

        this.device = await adapter.requestDevice()
        this.context = this.canvas.getContext('webgpu')
        this.format = navigator.gpu.getPreferredCanvasFormat()

        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: 'premultiplied'
        })

        // Create position buffer for fullscreen quad
        const positions = new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1
        ])
        this.positionBuffer = this.device.createBuffer({
            size: positions.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        })
        this.device.queue.writeBuffer(this.positionBuffer, 0, positions)

        // Create uniform buffer for time, resolution, etc.
        this.uniformBuffer = this.device.createBuffer({
            size: 32, // time(4) + resolution(8) + padding
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })

        this.initialized = true
        this.clear({ color: [0, 0, 0, 1] })
        return this
    }

    destroy() {
        if (this.device) {
            this.pipelines.clear()
            this.bindGroupLayouts.clear()
            this.textures.forEach((tex) => tex.destroy())
            this.buffers.forEach((buf) => buf.destroy())
            this.textures.clear()
            this.buffers.clear()
            if (this.positionBuffer) this.positionBuffer.destroy()
            if (this.uniformBuffer) this.uniformBuffer.destroy()
            this.device = null
            this.context = null
        }
    }

    refresh() {
        // WebGPU doesn't need explicit refresh
    }

    // ============================================================
    // Resource Creation Methods
    // ============================================================

    createFramebuffer(options) {
        const { width, height } = options

        const texture = this.device.createTexture({
            size: [width, height, 1],
            format: this.format,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST
        })

        const fbo = {
            texture,
            view: texture.createView(),
            width,
            height,
            resize: (newWidth, newHeight) => {
                texture.destroy()
                const newTexture = this.device.createTexture({
                    size: [newWidth, newHeight, 1],
                    format: this.format,
                    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST
                })
                fbo.texture = newTexture
                fbo.view = newTexture.createView()
                fbo.width = newWidth
                fbo.height = newHeight
            }
        }

        return fbo
    }

    createTexture(options) {
        const { width, height, shape, data } = options

        const texWidth = width || (shape && shape[0]) || 1
        const texHeight = height || (shape && shape[1]) || 1

        const texture = this.device.createTexture({
            size: [texWidth, texHeight, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        })

        // Create sampler
        const sampler = this.device.createSampler({
            magFilter: 'nearest',
            minFilter: 'nearest'
        })

        const texWrapper = {
            _texture: texture,
            view: texture.createView(),
            sampler,
            width: texWidth,
            height: texHeight,
            resize: (newWidth, newHeight) => {
                texture.destroy()
                const newTexture = this.device.createTexture({
                    size: [newWidth, newHeight, 1],
                    format: 'rgba8unorm',
                    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
                })
                texWrapper._texture = newTexture
                texWrapper.view = newTexture.createView()
                texWrapper.width = newWidth
                texWrapper.height = newHeight
            },
            subimage: async (source) => {
                if (source instanceof HTMLVideoElement || source instanceof HTMLImageElement || source instanceof HTMLCanvasElement) {
                    const imageBitmap = await createImageBitmap(source)
                    this.device.queue.copyExternalImageToTexture(
                        { source: imageBitmap },
                        { texture: texWrapper._texture },
                        [imageBitmap.width, imageBitmap.height]
                    )
                }
            },
            get texture() { return texture }
        }

        // If data is provided, copy it to the texture
        if (data && (data instanceof HTMLVideoElement || data instanceof HTMLImageElement || data instanceof HTMLCanvasElement)) {
            createImageBitmap(data).then(imageBitmap => {
                this.device.queue.copyExternalImageToTexture(
                    { source: imageBitmap },
                    { texture: texture },
                    [imageBitmap.width, imageBitmap.height]
                )
            })
        }

        return texWrapper
    }

    createBuffer(data) {
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
        const self = this

        // Create shader module
        const shaderCode = `
${vert}

${frag}
`
        let shaderModule
        try {
            shaderModule = this.device.createShaderModule({
                code: shaderCode
            })
        } catch (e) {
            console.error('Shader compilation error:', e)
            throw e
        }

        // Create pipeline
        const pipeline = this.device.createRenderPipeline({
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

        // Return draw function
        return (props) => {
            // Update uniform buffer
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
            } else {
                targetView = this.context.getCurrentTexture().createView()
            }

            // Create bind group with uniforms
            const bindGroup = this.device.createBindGroup({
                layout: pipeline.getBindGroupLayout(0),
                entries: [{
                    binding: 0,
                    resource: { buffer: this.uniformBuffer }
                }]
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
            renderPass.setVertexBuffer(0, this.positionBuffer)
            renderPass.draw(6)
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
            return transform.wgsl
        }).join('\n')}

${shaderInfo.glslFunctions.map((transform) => {
            return transform.transform.wgsl || ''
        }).join('\n')}

@fragment
fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
    let st = uv;
    ${shaderInfo.fragColor.replace('gl_FragColor', 'return').replace('vec4', 'vec4<f32>')}
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
    return textureSample(tex0, tex0Sampler, uv);
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
    return textureSample(tex0, tex0Sampler, vec2<f32>(1.0 - uv.x, uv.y));
}`
    }
}

export default WGSLEngine
