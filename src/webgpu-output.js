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

        // Create framebuffers for ping-pong rendering
        this.fbos = [
            this._createFramebuffer(),
            this._createFramebuffer()
        ];

        // Current pipeline and bind group
        this.pipeline = null;
        this.bindGroup = null;
        this.uniformBuffer = null;

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
        return this.device.createTexture({
            size: { width: this.width, height: this.height },
            format: this.format,
            usage: GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.RENDER_ATTACHMENT |
                GPUTextureUsage.COPY_SRC
        });
    }

    _createVertexBuffer() {
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
        // Create uniform buffer for time and resolution
        this.uniformBuffer = this.device.createBuffer({
            size: 16, // vec2 resolution + float time + padding
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    }

    resize(width, height) {
        this.width = width;
        this.height = height;

        // Destroy old framebuffers
        this.fbos.forEach(fbo => fbo.destroy());

        // Create new framebuffers
        this.fbos = [
            this._createFramebuffer(),
            this._createFramebuffer()
        ];
    }

    getCurrent() {
        return this.fbos[this.pingPongIndex];
    }

    getTexture() {
        const index = this.pingPongIndex ? 0 : 1;
        return this.fbos[index];
    }

    getPrevBuffer() {
        return this.fbos[this.pingPongIndex];
    }

    /**
     * Compile and set up a render pipeline from WGSL shader code
     * @param {object} pass - Render pass with shader code and uniforms
     */
    async render(pass) {
        const { wgslCode, uniforms } = pass;

        // Create shader module
        const shaderModule = this.device.createShaderModule({
            code: this._buildFullShader(wgslCode),
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

    _buildFullShader(fragmentCode) {
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

// Fragment shader
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

        // Swap ping-pong
        this.pingPongIndex = this.pingPongIndex ? 0 : 1;

        // Create command encoder
        const commandEncoder = this.device.createCommandEncoder();

        // Render pass to framebuffer
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: this.fbos[this.pingPongIndex].createView(),
                loadOp: 'clear',
                storeOp: 'store',
                clearValue: { r: 0, g: 0, b: 0, a: 1 }
            }]
        });

        renderPass.setPipeline(this.pipeline);
        renderPass.setBindGroup(0, this.bindGroup);
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
        renderPass.setBindGroup(0, this.bindGroup);
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
