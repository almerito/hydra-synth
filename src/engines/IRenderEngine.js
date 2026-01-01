/**
 * @abstract
 * Abstract interface for render engines.
 * All render engine implementations must extend this class.
 */
class IRenderEngine {
  /**
   * @param {Object} options - Engine configuration options
   * @param {HTMLCanvasElement} options.canvas - Target canvas element
   * @param {number} options.width - Canvas width
   * @param {number} options.height - Canvas height
   * @param {string} options.precision - Float precision ('lowp', 'mediump', 'highp')
   */
  constructor(options = {}) {
    if (this.constructor === IRenderEngine) {
      throw new Error('IRenderEngine is an abstract class and cannot be instantiated directly')
    }
    this.canvas = options.canvas
    this.width = options.width || 1280
    this.height = options.height || 720
    this.precision = options.precision || 'mediump'
  }

  // ============================================================
  // Lifecycle Methods
  // ============================================================

  /**
   * Initialize the render engine
   * @abstract
   * @returns {void}
   */
  init() {
    throw new Error('Method init() must be implemented by subclass')
  }

  /**
   * Destroy the render engine and release resources
   * @abstract
   * @returns {void}
   */
  destroy() {
    throw new Error('Method destroy() must be implemented by subclass')
  }

  /**
   * Refresh the engine state (e.g., after resize)
   * @abstract
   * @returns {void}
   */
  refresh() {
    throw new Error('Method refresh() must be implemented by subclass')
  }

  // ============================================================
  // Resource Creation Methods
  // ============================================================

  /**
   * Create a framebuffer for off-screen rendering
   * @abstract
   * @param {Object} options - Framebuffer options
   * @param {number} options.width - Framebuffer width
   * @param {number} options.height - Framebuffer height
   * @returns {Object} Framebuffer object
   */
  createFramebuffer(options) {
    throw new Error('Method createFramebuffer() must be implemented by subclass')
  }

  /**
   * Create a texture
   * @abstract
   * @param {Object} options - Texture options
   * @returns {Object} Texture object
   */
  createTexture(options) {
    throw new Error('Method createTexture() must be implemented by subclass')
  }

  /**
   * Create a position buffer
   * @abstract
   * @param {Array} data - Buffer data
   * @returns {Object} Buffer object
   */
  createBuffer(data) {
    throw new Error('Method createBuffer() must be implemented by subclass')
  }

  // ============================================================
  // Rendering Methods
  // ============================================================

  /**
   * Create a draw command from shader source and options
   * @abstract
   * @param {Object} options - Draw command options
   * @param {string} options.frag - Fragment shader source
   * @param {string} options.vert - Vertex shader source
   * @param {Object} options.attributes - Vertex attributes
   * @param {Object} options.uniforms - Shader uniforms
   * @param {number} options.count - Vertex count
   * @param {Object} options.framebuffer - Target framebuffer (optional)
   * @returns {Function} Draw function
   */
  createDrawCommand(options) {
    throw new Error('Method createDrawCommand() must be implemented by subclass')
  }

  /**
   * Clear the canvas or framebuffer
   * @abstract
   * @param {Object} options - Clear options
   * @param {Array} options.color - Clear color [r, g, b, a]
   * @returns {void}
   */
  clear(options) {
    throw new Error('Method clear() must be implemented by subclass')
  }

  // ============================================================
  // Shader Language Methods
  // ============================================================

  /**
   * Get the shader language identifier
   * @abstract
   * @returns {string} Shader language ('glsl1', 'glsl3', 'wgsl')
   */
  getShaderLanguage() {
    throw new Error('Method getShaderLanguage() must be implemented by subclass')
  }

  /**
   * Get the shader functions for this engine's language
   * @abstract
   * @returns {Array} Array of shader function definitions
   */
  getShaderFunctions() {
    throw new Error('Method getShaderFunctions() must be implemented by subclass')
  }

  /**
   * Get the utility shader functions for this engine's language
   * @abstract
   * @returns {Object} Utility functions object
   */
  getUtilityFunctions() {
    throw new Error('Method getUtilityFunctions() must be implemented by subclass')
  }

  /**
   * Generate shader code from transforms
   * @abstract
   * @param {Array} transforms - List of transform objects
   * @returns {Object} Shader info object { fragColor, uniforms, glslFunctions }
   */
  generateShader(transforms) {
    throw new Error('Method generateShader() must be implemented by subclass')
  }

  /**
   * Compile shader source for a transform chain
   * @abstract
   * @param {Object} options - Compilation options
   * @param {Object} options.shaderInfo - Generated shader info
   * @param {Object} options.uniforms - Uniforms object
   * @returns {Object} Compiled shader with frag/vert properties
   */
  compileShader(options) {
    throw new Error('Method compileShader() must be implemented by subclass')
  }

  // ============================================================
  // Uniform Helpers
  // ============================================================

  /**
   * Create a uniform property accessor (for dynamic uniforms)
   * @abstract
   * @param {string} name - Uniform name
   * @returns {Function} Property accessor function
   */
  prop(name) {
    throw new Error('Method prop() must be implemented by subclass')
  }
}

export default IRenderEngine
