import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(),
    // checker({
    //   eslint: {
    //     lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
    //   },
    //   overlay: {
    //     initialIsOpen: false,
    //   },
    // }),
  ],
  resolve: {
    alias: [
      // This will replace imports that start with '@/' with the 'src/' directory
      { find: /^@\//, replacement: path.resolve(__dirname, './src/') },
      // Existing aliases
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
    
  },
  server: {
    port: 5866,
  },
  preview: {
    port: 5866,
  },
});
