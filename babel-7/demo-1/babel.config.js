

module.exports = function(api) {
  api.cache(false);

  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', // entry
        corejs: 2,
        // include: ['es6.map'],
        targets: {
          ie: 9,
        },
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
