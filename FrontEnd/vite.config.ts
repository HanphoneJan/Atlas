//该文件是Vite的配置文件，用于配置Vite的插件、服务器、构建等选项。
// Vite的配置文件是一个ES Module，导出一个配置对象。
// Vite会自动加载项目根目录下的vite.config.ts文件，如果没有找到该文件，Vite会使用默认配置。

import { defineConfig } from 'vite'  // 导入vite配置模块
import vue from '@vitejs/plugin-vue'  // 导入vue插件
import { createHtmlPlugin } from 'vite-plugin-html';  // 导入vite-plugin-html插件，自定义HTML模板
import path from 'path'  // 导入path模块
import {VitePWA} from 'vite-plugin-pwa'; // 导入 VitePWA
// https://vite.dev/config/

export default defineConfig({
  // 项目根目录，根据部署环境设置不同的路径
  base: process.env.NODE_ENV === "production" ? "/atlas/" : "/",
  // 插件配置
  plugins: [
    vue(), // 注册vue插件
    // 注册自定义HTML插件
    createHtmlPlugin({
      minify: false,  // 禁用HTML压缩
      template: 'public/index.html',  // 指定模板文件，public目录
      inject: {
        // data: {
        //   title: 'index',
        //   injectScript: `<script src="/inject.js"></script>`,
        // },
        // tags: [
        //   {
        //     injectTo: 'body-prepend',
        //     tag: 'div',
        //     attrs: {
        //       id: 'tag',
        //     },
        //   },
        // ],
      }, // 插入自定义标签
    }),
    // 注册 VitePWA 插件
    VitePWA({
      registerType: 'autoUpdate', // 自动更新 Service Worker  
      injectRegister:'auto',
      //PWA可能会导致缓存问题
      devOptions: {
        enabled: false, // 开发环境中不启用 PWA
      },
      manifest: {
        name: '寒枫的照片墙',
        short_name: '照片墙',
        description: '寒枫的照片墙',
        theme_color: '#42b983',
        background_color: '#ffffff',
        icons: [
          {
            src: 'https://www.hanphone.top/storage/atlas/msapplication-icon-144x144.webp',
            sizes: '144x144',
            type: 'image/webp',
          },
        ],
      },
      workbox: {
        cacheId: 'atlas-cache-v1.3', // 每次构建时，手动修改版本号，强制用户更新
        cleanupOutdatedCaches: true, // 清除过期缓存
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 将限制提高到 50MB
        //运行时缓存是在用户访问资源时执行的，会将请求的资源缓存到 Service Worker 中。
        runtimeCaching: [
          {
            urlPattern: /\/api\/.*\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache-v1.3',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|gif|svg)$/,// 匹配请求路径
            handler: 'CacheFirst',  // 网络优先，如果请求失败，使用缓存
            options: {
              cacheName: 'api-cache-v1.3', // 缓存名称
              expiration: {
                maxEntries: 100,  // 最大缓存数量
                maxAgeSeconds: 60 * 60 * 24 * 3, // 缓存7天
              },
            },
          },
        ],
        //预缓存是在Service Worker安装时执行的,会将指定的资源列表下载并存储在缓存中。
        // 这些资源在离线时可以直接从缓存中加载，无需再向服务器请求。
        globPatterns: [
          // 预缓存的资源类型
          '**/*.{html,css,js,ico,png,svg,jpg,woff,woff2,ttf,otf}',
        ],
      },
    }),
  ],
  publicDir: 'public', // 静态资源目录
  // 服务器配置
  server: {
    host: '0.0.0.0',    
    port: 3002, // 调试启动端口
    open: true
  },
  // 构建配置
  build: {
    minify: 'terser', // 明确指定使用 terser 进行压缩
    terserOptions: {
      compress: {
        drop_console: false, // 保留 console 语句
      },
    },
    target: 'esnext', // 目标输出环境
    outDir: 'atlas', // 输出目录
    assetsDir: 'assets', // 静态资源目录
    assetsInlineLimit: 4096, // 小于这个大小的资源会被内联到base64中
    rollupOptions: {
      // 传递给Rollup的配置选项
      output: {
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
        assetFileNames: 'assets/[name].[extname]',
      },
    },
  },
  // 别名配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')  // 设置@符号为src目录
    }
  }
})

