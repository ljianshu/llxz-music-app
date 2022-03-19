const registerRouter = require('./backend/router')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和mixin
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  devServer: {
    // 通过node服务去请求第三方数据，请求到数据后，处理数据再返回给前端页面
    before (app) {
      registerRouter(app)
    }
  }
}
