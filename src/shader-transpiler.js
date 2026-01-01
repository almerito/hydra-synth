/**
 * Shader Transpiler
 * Runtime GLSL → WGSL using re-ovo/web-naga
 * Direct translation without intermediate SPIR-V step
 */

let nagaInstance = null;
let initPromise = null;

async function initNaga() {
    if (nagaInstance) return nagaInstance;
    if (initPromise) return initPromise;

    initPromise = (async () => {
        try {
            // Import from re-ovo/web-naga package
            // Assuming it exports a default init function or similar
            const Naga = await import('web-naga');

            // Initialize if required (Naga might be ready or need init)
            // web-naga typically follows wasm-bindgen pattern: default export is init function
            await Naga.default();

            nagaInstance = Naga;
            console.log('[Hydra] Naga initialized (GLSL -> WGSL)');
            return nagaInstance;
        } catch (err) {
            console.error('[Hydra] Failed to initialize Naga:', err);
            throw err;
        }
    })();

    return initPromise;
}

/**
 * Transpile GLSL 4.50 code to WGSL
 * @param {string} glslCode - GLSL shader code
 * @param {string} shaderStage - 'fragment' or 'vertex'
 * @returns {Promise<string>} WGSL code
 */
export async function transpileGLSLtoWGSL(glslCode, shaderStage = 'fragment') {
    const naga = await initNaga();

    try {
        // API: glsl_to_wgsl(source, stage)
        // stage: "vertex" | "fragment" | "compute"
        const wgsl = naga.glsl_in(glslCode, shaderStage);

        // Check if result is string or object/error
        return wgsl;
    } catch (err) {
        console.error('[Hydra] Transpilation error:', err);
        console.error('[Hydra] GLSL code:\n', glslCode);
        throw err;
    }
}

export async function preloadTranspiler() {
    try {
        await initNaga();
        return true;
    } catch {
        return false;
    }
}

export const preloadNaga = preloadTranspiler;

export default {
    transpileGLSLtoWGSL,
    preloadTranspiler
};
