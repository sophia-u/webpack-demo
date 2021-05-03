const path = require('path');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.js');

const config = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'), // 指定了服务器资源的根目录，默认是当前执行的目录,一般是项目的根目录。
    hot: true, // 模块替换换功能，DevServer 默认行为是在发现源代码被更新后通过自动刷新整个页面来做到实时预览的。但是开启模块热替换功能后，它是通过在不刷新整个页面的情况下通过使用新模块替换旧模块来做到实时预览的。
    open: false, // 自第一次构建完成时自动打开浏览器，默认 true。
    inline: true, //默认开启 inline 模式，如果设置为 false 开启 iframe 模式。
    compress: true, // 是否启用 gzip 压缩，默认 false。
    overlay: true, // 用来在编译出错的时候在浏览器页面上显示错误，默认 false。
    stats: 'errors-only', // 指定编译时在命令行中输出的内容，默认 'normal'，其余有 'minimal', 'verbose'。
    proxy: {
      '/api': {
        target: 'http://news.baidu.com', // 目标接口的域名
        secure: true,  // https 的时候使用该参数
        changeOrigin: true,  // 是否跨域，默认 false
        pathRewrite: {
          '^/api': ''  // 重写路径
        }
      }
    }
  }
});

module.exports = config;
