import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import Path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    uni(),
    createSvgIconsPlugin({
      iconDirs: [Path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  server: {
    port: 5170,
    host: '0.0.0.0',
    proxy: {
      '/test': {
        target: 'http://test.bx8988.com:20000/hjuser',
        changeOrigin: true,
        rewrite: path=> path.replace(/^\/test/, ''),
      },
      '/tess': {
        target: 'ws://test.bx8988.com:20000/hjws',
        changeOrigin: true,
        ws: true,
        rewrite: path=> path.replace(/^\/tess/, ''),
      },
    }
  },
  resolve: {
    alias: {
      '@front': Path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${Path.resolve('src/main.less')}";`,
        },
        javascriptEnabled: true,
      }
    }
  },
})
