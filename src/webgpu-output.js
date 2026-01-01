/**
 * WebGPU Output
 * Handles WebGPU rendering pipeline and framebuffers
 */

class WebGPUOutput {
    constructor({ device, context, format, label = "", width, height }) {
        this.device = device;
        this.context = context;
        this.format = format;
        this.label = label;
        this.width = width;
        this.height = height;
        this.pingPongIndex = 0;

        // Resources will be initialized when device is available
        this.fbos = [];
        this.pipeline = null;
        this.bindGroup = null;
        this.uniformBuffer = null;
        this.vertexBuffer = null;
        this.sampler = null;

        if (this.device) {
            this.initDevice(this.device, this.context, this.format);
        }
    }

    setDevice(device, context, format) {
        this.device = device;
        this.context = context;
        this.format = format || this.format;
        this.initDevice(device, context, this.format);
    }

    initDevice(device, context, format) {
        // Create framebuffers for ping-pong rendering
        this.fbos = [
            this._createFramebuffer(),
            this._createFramebuffer()
        ];

        // Vertex buffer for fullscreen quad
        this.vertexBuffer = this._createVertexBuffer();

        // Sampler for textures
        this.sampler = device.createSampler({
            magFilter: 'nearest',
            minFilter: 'nearest',
        });

        this.init();
    }

    _createFramebuffer() {
        if (!this.device) return null;
        return this.device.createTexture({
            size: { width: this.width, height: this.height },
            format: this.format,
            usage: GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.RENDER_ATTACHMENT |
                GPUTextureUsage.COPY_SRC
        });
    }

    _createVertexBuffer() {
        if (!this.device) return null;
        // Fullscreen triangle vertices
        const vertices = new Float32Array([
            -1.0, -1.0,
            3.0, -1.0,
            -1.0, 3.0,
        ]);

        const buffer = this.device.createBuffer({
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true,
        });

        new Float32Array(buffer.getMappedRange()).set(vertices);
        buffer.unmap();

        return buffer;
    }

    init() {
        if (!this.device) return;
        // Create uniform buffer for time and resolution
        this.uniformBuffer = this.device.createBuffer({
            size: 16, // vec2 resolution + float time + padding
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    }

    resize(width, height) {
        this.width = width;
        this.height = height;

        if (!this.device || this.fbos.length === 0) return;

        // Destroy old framebuffers
        this.fbos.forEach(fbo => fbo && fbo.destroy());

        // Create new framebuffers
        this.fbos = [
            this._createFramebuffer(),
            this._createFramebuffer()
        ];
    }

    getCurrent() {
        if (this.fbos.length === 0) return null;
        return this.fbos[this.pingPongIndex];
    }

    getTexture() {
        if (this.fbos.length === 0) return null;
        const index = this.pingPongIndex ? 0 : 1;
        return this.fbos[index];
    }

    getPrevBuffer() {
        if (this.fbos.length === 0) return null;
        return this.fbos[this.pingPongIndex];
    }

    /**
     * Compile and set up a render pipeline from WGSL shader code
     * @param {object} pass - Render pass with shader code and uniforms
     */
    async render(pass) {
        if (!this.device) return;
        const { wgsl, uniforms } = pass;

        // wgsl might be a string (old way) or object (new way)
        // support both for transition but prefer object
        let header = '';
        let body = '';

        if (typeof wgsl === 'object') {
            header = wgsl.header || '';
            body = wgsl.body || '';
        } else {
            body = wgsl || '';
        }

        // Create shader module
        const shaderModule = this.device.createShaderModule({
            code: this._buildFullShader(header, body),
        });

        // Create bind group layout
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: { type: 'filtering' }
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'float' }
                }
            ]
        });

        // Create pipeline layout
        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        // Create render pipeline
        this.pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
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
                targets: [{ format: this.format }]
            },
            primitive: {
                topology: 'triangle-list',
            }
        });

        // Create bind group
        this.bindGroup = this.device.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: this.uniformBuffer } },
                { binding: 1, resource: this.sampler },
                { binding: 2, resource: this.getPrevBuffer().createView() }
            ]
        });
    }

    _buildFullShader(header, fragmentCode) {
        return `
// Uniforms
struct Uniforms {
  resolution: vec2<f32>,
  time: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var texSampler: sampler;
@group(0) @binding(2) var prevBuffer: texture_2d<f32>;

// Vertex shader
struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@vertex
fn vs_main(@location(0) pos: vec2<f32>) -> VertexOutput {
  var output: VertexOutput;
  output.position = vec4<f32>(pos, 0.0, 1.0);
  output.uv = (pos + 1.0) * 0.5;
  return output;
}

// Fragment shader Helper Functions
${header}

// Main Fragment Shader
@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
  let time = uniforms.time;
  let resolution = uniforms.resolution;
  var _st = input.uv;
  var c = vec4<f32>(0.0, 0.0, 0.0, 0.0);
  
  ${fragmentCode}
  
  return c;
}
`;
    }

    /**
     * Execute a render pass with current pipeline
     * @param {object} props - Render properties (time, resolution)
     */
    tick(props) {
        if (!this.pipeline) return;

        // Update uniform buffer
        const uniformData = new Float32Array([
            props.resolution[0],
            props.resolution[1],
            props.time,
            0 // padding
        ]);
        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData);

        // Get the texture to READ from (previous frame's output)
        const prevBufferTexture = this.fbos[this.pingPongIndex];

        // Swap ping-pong AFTER getting prevBuffer reference
        this.pingPongIndex = this.pingPongIndex ? 0 : 1;

        // Get the texture to WRITE to (current frame's output)
        const currentRenderTarget = this.fbos[this.pingPongIndex];

        // Recreate bind group with correct prevBuffer texture
        // This ensures we read from the previous frame's texture, not the current render target
        const bindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: this.uniformBuffer } },
                { binding: 1, resource: this.sampler },
                { binding: 2, resource: prevBufferTexture.createView() }
            ]
        });

        // Create command encoder
        const commandEncoder = this.device.createCommandEncoder();

        // Render pass to framebuffer
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: currentRenderTarget.createView(),
                loadOp: 'clear',
                storeOp: 'store',
                clearValue: { r: 0, g: 0, b: 0, a: 1 }
            }]
        });

        renderPass.setPipeline(this.pipeline);
        renderPass.setBindGroup(0, bindGroup);
        renderPass.setVertexBuffer(0, this.vertexBuffer);
        renderPass.draw(3);
        renderPass.end();

        // Submit
        this.device.queue.submit([commandEncoder.finish()]);
    }

    /**
     * Render to the screen (final pass)
     * @param {object} props - Render properties
     */
    renderToScreen(props) {
        if (!this.pipeline) return;

        // After tick(), pingPongIndex points to the texture that was just rendered to
        // We want to read from that texture and display it on screen
        const textureToDisplay = this.fbos[this.pingPongIndex];

        // Create bind group with the correct texture
        const bindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: this.uniformBuffer } },
                { binding: 1, resource: this.sampler },
                { binding: 2, resource: textureToDisplay.createView() }
            ]
        });

        const commandEncoder = this.device.createCommandEncoder();

        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: this.context.getCurrentTexture().createView(),
                loadOp: 'clear',
                storeOp: 'store',
                clearValue: { r: 0, g: 0, b: 0, a: 1 }
            }]
        });

        renderPass.setPipeline(this.pipeline);
        renderPass.setBindGroup(0, bindGroup);
        renderPass.setVertexBuffer(0, this.vertexBuffer);
        renderPass.draw(3);
        renderPass.end();

        this.device.queue.submit([commandEncoder.finish()]);
    }

    destroy() {
        this.fbos.forEach(fbo => fbo.destroy());
        this.vertexBuffer.destroy();
        this.uniformBuffer.destroy();
    }
}

export default WebGPUOutput;
