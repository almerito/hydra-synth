import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
    plugins: [wasm()],
    build: {
        lib: {
            entry: './src/index.js',
            name: 'Hydra',
            formats: ['es', 'umd'],
            fileName: (format) => `hydra-synth-wgsl.${format}.js`
        },
        outDir: 'dist',
        rollupOptions: {
            external: [],
            output: {
                globals: {}
            }
        }
    },
    server: {
        port: 8000,
        open: '/dev/index.html'
    },
    optimizeDeps: {
        exclude: []
    }
});
