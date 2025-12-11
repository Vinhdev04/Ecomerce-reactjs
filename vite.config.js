import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@styles': path.resolve(__dirname, './src/assets/styles'),
            '@icons': path.resolve(__dirname, './src/assets/icons'),
            '@images': path.resolve(__dirname, './src/assets/images'),
            '@hooks': path.resolve(__dirname, './src/hooks')
        }
    }
});
