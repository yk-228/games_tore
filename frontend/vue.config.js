const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',

  devServer: {
    port: 8081,
    open: true,
    hot: true,
    host: 'localhost',
    proxy: null,
    // 添加CORS头信息
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    }
  },

  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },

  chainWebpack: (config) => {
    // 配置别名
    config.resolve.alias
        .set('@', path.resolve(__dirname, 'src'))
        .set('@components', path.resolve(__dirname, 'src/components'))
        .set('@views', path.resolve(__dirname, 'src/views'))
        .set('@assets', path.resolve(__dirname, 'src/assets'))
        .set('@utils', path.resolve(__dirname, 'src/utils'))
        .set('@store', path.resolve(__dirname, 'src/store')) // 添加store别名
        .set('@stores', path.resolve(__dirname, 'src/store')) // 添加stores别名
  }
})