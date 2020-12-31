

module.exports = function(api) {
  api.cache(true);

  const presets = [
    // [
    //   '@babel/preset-env',
    //   {
    //     useBuiltIns: 'usage', // entry
    //     corejs: 2,
    //     // include: ['es6.map'],
    //     // targets: 'defaults', // 此处会和 .browserslistrc 配置合并处理
    //   }
    // ]
  ]

  const plugins = [
    ['@babel/plugin-transform-runtime', {
      corejs: 2
    }]
  ]

  return {
    presets,
    plugins,
  }
}
