// glslify noop for Vite - glslify is a browserify transform, not needed in Vite
// The gaussian blur shader uses glslify which is not compatible with Vite
// This provides a simple passthrough for development

export default function glsl(strings, ...values) {
    // If called as a template tag
    if (Array.isArray(strings)) {
        return strings.reduce((result, str, i) => {
            return result + str + (values[i] || '');
        }, '');
    }
    // If called with a file path (original glslify behavior)
    // In production, we'd need to handle this differently
    console.warn('[glslify] File imports are not supported in Vite mode:', strings);
    return '';
}
