

module.exports = function(api) {
  api.cache(false);

  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', // entry
        corejs: 3,
        // include: ['es6.map'],
        // targets: 'defaults', // 此处会和 .browserslistrc 配置合并处理
      }
    ]
  ]

  const plugins = []

  return {
    presets,
    plugins,
  }
}
