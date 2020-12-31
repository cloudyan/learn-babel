

module.exports = function(api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', // entry
        corejs: 3,
        // include: ['es6.map'],
        // targets: 'defaults', // 此处会和 .browserslistrc 配置合并处理
        targets: {
          browsers: [ // 也可以用数组 也可以应逗号隔开的字符串
            "ie >= 9",
            "chrome 60"
          ]
        },
      }
    ]
  ]

  const plugins = []

  return {
    presets,
    plugins,
  }
}
