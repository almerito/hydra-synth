/**
 * GLSL Upgrade Utility
 * Converts GLSL ES 1.00 / 3.00 to GLSL 4.50 for naga-wasm transpilation
 */

/**
 * Upgrades GLSL ES shader code to GLSL 4.50
 * @param {string} glslCode - The GLSL ES code to upgrade
 * @param {string} shaderType - 'fragment' or 'vertex'
 * @returns {string} GLSL 4.50 compatible code
 */
export function upgradeToGLSL450(glslCode, shaderType = 'fragment') {
    let code = glslCode;

    // Remove existing version directive if present
    code = code.replace(/^\s*#version\s+\d+(\s+es)?\s*/im, '');

    // Remove precision qualifiers (not needed in GLSL 4.50)
    code = code.replace(/\bprecision\s+(highp|mediump|lowp)\s+(float|int|sampler2D|samplerCube);\s*/g, '');

    // Replace texture2D with texture
    code = code.replace(/\btexture2D\s*\(/g, 'texture(');

    // Replace textureCube with texture
    code = code.replace(/\btextureCube\s*\(/g, 'texture(');

    // For vertex shaders: attribute -> in
    if (shaderType === 'vertex') {
        code = code.replace(/\battribute\s+/g, 'in ');
        code = code.replace(/\bvarying\s+/g, 'out ');
    }

    // For fragment shaders: varying -> in
    if (shaderType === 'fragment') {
        code = code.replace(/\bvarying\s+/g, 'in ');
        // gl_FragColor -> requires out variable
        if (code.includes('gl_FragColor')) {
            code = 'out vec4 fragColor;\n' + code;
            code = code.replace(/\bgl_FragColor\b/g, 'fragColor');
        }
    }

    // Add version header
    code = '#version 450\n' + code;

    return code;
}

/**
 * Wraps a shader function body into a complete GLSL 4.50 fragment shader
 * for transpilation purposes
 * @param {string} functionBody - The function body code
 * @param {object} shaderDef - The shader definition object
 * @returns {string} Complete GLSL 4.50 shader
 */
export function wrapAsFragmentShader(functionBody, shaderDef) {
    const { name, type, inputs = [] } = shaderDef;

    // Determine return type based on shader type
    const returnTypes = {
        'src': 'vec4',
        'color': 'vec4',
        'coord': 'vec2',
        'combine': 'vec4',
        'combineCoord': 'vec2'
    };

    // Determine first argument based on shader type
    const firstArgs = {
        'src': 'vec2 _st',
        'color': 'vec4 _c0',
        'coord': 'vec2 _st',
        'combine': 'vec4 _c0, vec4 _c1',
        'combineCoord': 'vec2 _st, vec4 _c0'
    };

    const returnType = returnTypes[type] || 'vec4';
    const firstArg = firstArgs[type] || 'vec2 _st';

    // Build input parameters
    const inputParams = inputs.map(input => {
        const glslType = input.type === 'sampler2D' ? 'sampler2D' : input.type;
        return `${glslType} ${input.name}`;
    }).join(', ');

    const allParams = inputParams ? `${firstArg}, ${inputParams}` : firstArg;

    return `#version 450

// Uniforms
uniform float time;
uniform vec2 resolution;

// Function definition
${returnType} ${name}(${allParams}) {
${functionBody}
}
`;
}

export default {
    upgradeToGLSL450,
    wrapAsFragmentShader
};
