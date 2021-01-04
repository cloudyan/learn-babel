

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
            "chrome 60", // 仅该项不会引入 polyfill，测试是否按需引入
          ]
        },
      }
    ]
  ]

  // 使用 useBuiltIns: 'usage' + core@3 不需要使用 runtime 就可以按需（targets）引入了
  const plugins = [
    // "@babel/transform-runtime"
  ]

  return {
    presets,
    plugins,
  }
}
