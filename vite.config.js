import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    // Polyfill 'global' for Node.js-style packages (like raf-loop)
    define: {
        global: 'window'
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'Hydra',
            fileName: (format) => `hydra-synth.${format}.js`,
            formats: ['es', 'umd']
        },
        outDir: 'dist',
        rollupOptions: {
            // External dependencies that should not be bundled
            external: [],
            output: {
                globals: {}
            }
        }
    },
    resolve: {
        alias: {
            // Handle glslify imports (used in renderpass-functions.js)
            'glslify': resolve(__dirname, 'src/lib/glslify-noop.js')
        }
    },
    server: {
        port: 8000,
        open: '/index.html'
    },
    preview: {
        port: 9000
    }
});
