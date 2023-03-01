// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
const path = require('path')
// __dirname它是node环境下全局内置变量
// 当前文件所在文件夹的绝对路径
const themePath = path.join(__dirname, './src/styles/cover.less')
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            // 'nav-bar-background-color': '#007bff',
            // 'nav-bar-text-color': '#fff',
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            // hack: 'true; @import "your-less-file-path.less";'
            hack: `true; @import "${themePath}";`
          }
        }
      }
    }
  }
}
