/**
 * Engine Registry - Maps engine identifiers to engine classes
 * Allows both string-based and class-based engine initialization
 */

import ReglEngine from './ReglEngine.js'
import WebGL2Engine from './WebGL2Engine.js'
import WGSLEngine from './WGSLEngine.js'

const engineRegistry = {
    'glsl1': ReglEngine,
    'webgl1': ReglEngine,
    'regl': ReglEngine,
    'glsl3': WebGL2Engine,
    'webgl2': WebGL2Engine,
    'wgsl': WGSLEngine,
    'webgpu': WGSLEngine
}

/**
 * Creates an engine instance from either a string identifier or a class
 * @param {string|Object|Function} engine - Engine identifier, class, or instance
 * @param {Object} options - Engine options (canvas, width, height, precision)
 * @returns {IRenderEngine} Engine instance
 */
export function createEngine(engine, options) {
    // If already an engine instance, return it
    if (engine && typeof engine.init === 'function' && typeof engine.getShaderLanguage === 'function') {
        return engine
    }

    // If it's a class/constructor, instantiate it
    if (typeof engine === 'function') {
        return new engine(options)
    }

    // If it's a string, look up in registry
    if (typeof engine === 'string') {
        const engineId = engine.toLowerCase()
        const EngineClass = engineRegistry[engineId]
        if (!EngineClass) {
            throw new Error(`Unknown engine: "${engine}". Available engines: ${Object.keys(engineRegistry).join(', ')}`)
        }
        return new EngineClass(options)
    }

    // Default to ReglEngine (GLSL1)
    return new ReglEngine(options)
}

/**
 * Register a custom engine
 * @param {string} name - Engine identifier
 * @param {Function} EngineClass - Engine class constructor
 */
export function registerEngine(name, EngineClass) {
    engineRegistry[name.toLowerCase()] = EngineClass
}

/**
 * Get list of available engine identifiers
 * @returns {string[]} Array of engine identifiers
 */
export function getAvailableEngines() {
    return Object.keys(engineRegistry)
}

export { ReglEngine, WebGL2Engine, WGSLEngine }
export default { createEngine, registerEngine, getAvailableEngines, ReglEngine, WebGL2Engine, WGSLEngine }

