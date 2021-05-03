const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html-webpack-plugin 可以为项目生成一个或多个 HTML 文件，并将 webpack 打包后输出的所有脚本文件自动添加到插件生成的 HTML 文件中。
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // CSS 样式抽离
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // CSS 样式压缩

const config = {
  entry: './src/index.js', // 入口文件相对路径
  output: {
    filename: '[name].[hash].js', // 输出文件名
    path: path.resolve(__dirname, '../dist'), // 输出文件路绝对路径
    publicPath: '/' // 输出目录对应的公开 URL，通常是 CDN 地址
  },
  module: {
    noParse: /jquery|lodash/, // 防止 webpack 解析指定的 library 提高构建性能
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              outputPath: 'assets',
              name: '[name]_[hash:6].[ext]',
              limit: 10240,
              esModule: false,
            }
          }
        ],
        exclude: /node_modules/
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // 模板入口路径
      filename: 'index.html', // 打包后的文件名
      minify: {
        removeAttributeQuotes: false, // 是否删除属性的双引号
        collapseWhitespace: false, // 是否折叠空白
      },
      hash: true, //是否加上 hash 默认是 false
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ],
  // 抽离公共代码是对于多页应用来说的，如果多个页面引入了一些公共模块，那么可以把这些公共的模块抽离出来，单独打包。公共代码只需要下载一次就缓存起来了，避免了重复下载。
  optimization: {
    splitChunks: { // 分割代码块
      cacheGroups: { // 缓存组
        vendor: { //第三方依赖
          priority: 1, // 设置优先级首先抽离第三方模块
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          minSize: 100, // 大小超过 100 个字节
          minChunks: 1 // 最少引入了一次
        },
        common: { //公共模块
          name: 'common',
          chunks: 'initial',
          minSize: 100, // 大小超过 100 个字节
          minChunks: 3 // 最少引入了三次
        }
      }
    },
    // 将包含 chunk 映射关系的列表从 main.js 中抽离出来，在配置了 splitChunk 时要配置 runtimeChunk.
    runtimeChunk: {
      name: 'mainifest' // 最终构建出来的文件中会生成一个 manifest.js
    },
    minimize: true, // 压缩代码，默认为 true
    minimizer: [
      // webpack v5 自带最新的 terser-webpack-plugin 压缩 js
      new CssMinimizerPlugin(),
    ],
  }
}

module.exports = config;
