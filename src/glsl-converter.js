/**
 * GLSL 1.0 to GLSL 3.0 ES Converter
 * 
 * Converts legacy GLSL 1.0 shader code to GLSL 3.0 ES syntax.
 * Used for external plugins and third-party libraries that use GLSL 1.0.
 */

/**
 * Converts GLSL 1.0 function body code to GLSL 3.0 ES
 * @param {string} glslCode - The GLSL 1.0 shader function body
 * @returns {string} - The converted GLSL 3.0 ES code
 */
export function convertGlsl1ToGlsl3(glslCode) {
    if (!glslCode || typeof glslCode !== 'string') {
        return glslCode;
    }

    let converted = glslCode;

    // Replace texture2D with texture (GLSL 3.0 uses generic texture())
    converted = converted.replace(/\btexture2D\s*\(/g, 'texture(');

    // Replace texture2DLod with textureLod
    converted = converted.replace(/\btexture2DLod\s*\(/g, 'textureLod(');

    // Replace texture2DProj with textureProj
    converted = converted.replace(/\btexture2DProj\s*\(/g, 'textureProj(');

    // Replace textureCube with texture
    converted = converted.replace(/\btextureCube\s*\(/g, 'texture(');

    // Replace textureCubeLod with textureLod
    converted = converted.replace(/\btextureCubeLod\s*\(/g, 'textureLod(');

    // Replace shadow2D with texture
    converted = converted.replace(/\bshadow2D\s*\(/g, 'texture(');

    // Replace shadow2DProj with textureProj
    converted = converted.replace(/\bshadow2DProj\s*\(/g, 'textureProj(');

    return converted;
}

/**
 * Checks if GLSL code contains GLSL 1.0 specific syntax that needs conversion
 * @param {string} glslCode - The shader code to check
 * @returns {boolean} - True if the code contains GLSL 1.0 syntax
 */
export function needsConversion(glslCode) {
    if (!glslCode || typeof glslCode !== 'string') {
        return false;
    }

    // Check for texture2D and other GLSL 1.0 specific functions
    const glsl1Patterns = [
        /\btexture2D\s*\(/,
        /\btexture2DLod\s*\(/,
        /\btexture2DProj\s*\(/,
        /\btextureCube\s*\(/,
        /\btextureCubeLod\s*\(/,
        /\bshadow2D\s*\(/,
        /\bshadow2DProj\s*\(/
    ];

    return glsl1Patterns.some(pattern => pattern.test(glslCode));
}

export default {
    convertGlsl1ToGlsl3,
    needsConversion
};
