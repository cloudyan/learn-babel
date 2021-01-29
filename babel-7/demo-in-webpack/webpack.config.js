const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
console.log(__dirname)

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
  },
  module: {
    rules: [
      {
        test:/\.js$/,
        loader:'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
  optimization: {
    // runtimeChunk: 'single', // 创建一个运行时文件，以供所有生成的块共享
    // runtimeChunk: {
    //   // name: entrypoint => `runtime~${entrypoint.name}`,
    //   name: 'runtime'
    // },
    splitChunks: {
      // chunks: 'all', // 这些都使用默认
      // minSize: 60000, // byte, 30kb
      // maxSize: 0,
      // minChunks: 1,
      // maxAsyncRequests: 5,
      // maxInitialRequests: 3,
      // automaticNameDelimiter: '~',
      // automaticNameMaxLength: 30,
      cacheGroups: {
        // 抽取第三方模块, 使用 dll 替代: npm run dll, 如果要可视化分析, 可打开此配置查看输出
        // libs: {
        //   name: `chunk-lib`,
        //   test: /[\\/]node_modules[\\/](vue|vue-router|vuex|axios)[\\/]/,
        //   priority: 0,
        //   chunks: 'initial',
        // },
        vendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial',
        },
        common: {
          name: `chunk-common`,
          minChunks: 1,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
  },
};
