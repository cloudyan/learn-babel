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
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
};
