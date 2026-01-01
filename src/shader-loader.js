/**
 * Shader Loader
 * Handles loading shader definitions with WGSL priority and GLSL fallback
 */

import { upgradeToGLSL450, wrapAsFragmentShader } from './glsl/glsl-upgrade.js';
import { transpileGLSLtoWGSL } from './shader-transpiler.js';

/**
 * Cache for transpiled shaders to avoid re-transpilation
 */
const transpileCache = new Map();

/**
 * Load shader code from a shader definition
 * Prioritizes native WGSL, falls back to GLSL transpilation
 * 
 * @param {object} definition - Shader definition object with glsl/glsl3/wgsl properties
 * @returns {Promise<{code: string, type: 'wgsl' | 'wgsl-transpiled', original: string}>}
 */
export async function loadShaderCode(definition) {
    const { name, glsl, glsl3, wgsl } = definition;

    // Priority 1: Native WGSL
    if (wgsl) {
        return {
            code: wgsl,
            type: 'wgsl',
            original: wgsl
        };
    }

    // Priority 2: GLSL3 or GLSL (needs transpilation)
    const glslCode = glsl3 || glsl;
    if (!glslCode) {
        throw new Error(`Shader "${name}" has no shader code defined`);
    }

    // Check cache
    const cacheKey = `${name}:${glslCode}`;
    if (transpileCache.has(cacheKey)) {
        return transpileCache.get(cacheKey);
    }

    // Wrap the function body as a complete shader
    const fullGlsl = wrapAsFragmentShader(glslCode, definition);

    // Upgrade to GLSL 4.50
    const glsl450 = upgradeToGLSL450(fullGlsl, 'fragment');

    // Transpile to WGSL
    const wgslCode = await transpileGLSLtoWGSL(glsl450, 'fragment');

    const result = {
        code: wgslCode,
        type: 'wgsl-transpiled',
        original: glslCode
    };

    // Cache the result
    transpileCache.set(cacheKey, result);

    return result;
}

/**
 * Synchronous shader code getter for use during shader compilation
 * Returns WGSL if available, otherwise returns GLSL for later async transpilation
 * 
 * @param {object} definition - Shader definition object
 * @returns {{code: string, type: 'wgsl' | 'glsl', needsTranspile: boolean}}
 */
export function getShaderCodeSync(definition) {
    const { wgsl, glsl3, glsl } = definition;

    if (wgsl) {
        return {
            code: wgsl,
            type: 'wgsl',
            needsTranspile: false
        };
    }

    const glslCode = glsl3 || glsl;
    return {
        code: glslCode,
        type: 'glsl',
        needsTranspile: true
    };
}

/**
 * Check if a shader definition has native WGSL
 * @param {object} definition - Shader definition object
 * @returns {boolean}
 */
export function hasNativeWGSL(definition) {
    return !!definition.wgsl;
}

/**
 * Clear the transpilation cache
 */
export function clearTranspileCache() {
    transpileCache.clear();
}

export default {
    loadShaderCode,
    getShaderCodeSync,
    hasNativeWGSL,
    clearTranspileCache
};
