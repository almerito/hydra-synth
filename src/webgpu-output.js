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
        const { wgsl, uniforms = {}, textureUniforms = [] } = pass;

        // Store uniforms for later use in tick()
        this.textureUniforms = textureUniforms;
        this.scalarUniforms = uniforms;  // Store scalar uniforms object

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

        // Generate texture declarations for WGSL shader
        // Textures start at binding 3 (0=uniforms, 1=sampler, 2=prevBuffer)
        let textureDeclarations = '';
        textureUniforms.forEach((tex, i) => {
            const bindingIndex = 3 + i;
            textureDeclarations += `@group(0) @binding(${bindingIndex}) var ${tex.name}: texture_2d<f32>;\n`;
        });

        // Build dynamic uniform struct members
        // Fixed members: resolution (vec2), time (f32), padding (f32)
        // Dynamic members: all scalar uniforms from shader
        const scalarUniformNames = Object.keys(uniforms).filter(k => k !== 'time' && k !== 'resolution');

        // Calculate uniform buffer size:
        // resolution (8 bytes) + time (4 bytes) + padding (4 bytes) = 16 bytes
        // Each additional f32 uniform = 4 bytes
        // Buffer size must be aligned to 16 bytes
        const baseSize = 16;
        const dynamicSize = scalarUniformNames.length * 4;
        const totalSize = Math.ceil((baseSize + dynamicSize) / 16) * 16;

        // Recreate uniform buffer if size changed
        if (!this.uniformBuffer || this.uniformBufferSize !== totalSize) {
            if (this.uniformBuffer) this.uniformBuffer.destroy();
            this.uniformBuffer = this.device.createBuffer({
                size: totalSize,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
            this.uniformBufferSize = totalSize;
        }

        // Store scalar uniform names for indexing in tick()
        this.scalarUniformNames = scalarUniformNames;

        // Create shader module
        const shaderModule = this.device.createShaderModule({
            code: this._buildFullShader(header, body, textureDeclarations, scalarUniformNames),
        });

        // Create bind group layout with dynamic texture entries
        const bindGroupLayoutEntries = [
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
        ];

        // Add entries for each texture uniform
        textureUniforms.forEach((tex, i) => {
            bindGroupLayoutEntries.push({
                binding: 3 + i,
                visibility: GPUShaderStage.FRAGMENT,
                texture: { sampleType: 'float' }
            });
        });

        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: bindGroupLayoutEntries
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

        // Note: bindGroup is now created dynamically in tick() and renderToScreen()
        // to get the current texture views
    }

    _buildFullShader(header, fragmentCode, textureDeclarations = '', scalarUniformNames = []) {
        // Generate dynamic uniform struct members
        const dynamicMembers = scalarUniformNames.map(name => `  ${name}: f32,`).join('\n');

        return `
// Uniforms
struct Uniforms {
  resolution: vec2<f32>,
  time: f32,
  _padding: f32,
${dynamicMembers}
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var texSampler: sampler;
@group(0) @binding(2) var prevBuffer: texture_2d<f32>;

// Dynamic texture bindings
${textureDeclarations}

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

        // Build uniform data array: resolution (2), time (1), padding (1), then dynamic uniforms
        const baseData = [
            props.resolution[0],
            props.resolution[1],
            props.time,
            0 // padding
        ];

        // Add dynamic scalar uniforms
        if (this.scalarUniformNames && this.scalarUniforms) {
            this.scalarUniformNames.forEach(name => {
                const uniformValue = this.scalarUniforms[name];
                // Uniform value can be a number or a function
                const value = typeof uniformValue === 'function' ? uniformValue(null, props, 0) : uniformValue;
                baseData.push(typeof value === 'number' ? value : 0);
            });
        }

        // Pad to match buffer size
        while (baseData.length * 4 < (this.uniformBufferSize || 16)) {
            baseData.push(0);
        }

        const uniformData = new Float32Array(baseData);
        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData);

        // Get the texture to READ from (previous frame's output)
        const prevBufferTexture = this.fbos[this.pingPongIndex];

        // Swap ping-pong AFTER getting prevBuffer reference
        this.pingPongIndex = this.pingPongIndex ? 0 : 1;

        // Get the texture to WRITE to (current frame's output)
        const currentRenderTarget = this.fbos[this.pingPongIndex];

        // Build bind group entries
        const bindGroupEntries = [
            { binding: 0, resource: { buffer: this.uniformBuffer } },
            { binding: 1, resource: this.sampler },
            { binding: 2, resource: prevBufferTexture.createView() }
        ];

        // Add dynamic texture uniform bindings
        if (this.textureUniforms) {
            this.textureUniforms.forEach((tex, i) => {
                // tex.value is a function that returns the texture
                const texture = tex.value();
                if (texture && texture.createView) {
                    bindGroupEntries.push({
                        binding: 3 + i,
                        resource: texture.createView()
                    });
                }
            });
        }

        // Recreate bind group with correct textures
        const bindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: bindGroupEntries
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

        // Build bind group entries
        const bindGroupEntries = [
            { binding: 0, resource: { buffer: this.uniformBuffer } },
            { binding: 1, resource: this.sampler },
            { binding: 2, resource: textureToDisplay.createView() }
        ];

        // Add dynamic texture uniform bindings
        if (this.textureUniforms) {
            this.textureUniforms.forEach((tex, i) => {
                const texture = tex.value();
                if (texture && texture.createView) {
                    bindGroupEntries.push({
                        binding: 3 + i,
                        resource: texture.createView()
                    });
                }
            });
        }

        // Create bind group with correct textures
        const bindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: bindGroupEntries
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
