# learn-babel

学习 babel

- 测试 [jest-use-babel7](https://github.com/cloudyan/jest-use-babel7)

## 配置

```js
  // targets 会和 .browserslistrc 配置合并处理
  // 此处未指定目标的情况下，它的行为类似：preset-env将所有ES2015-ES2020代码转换为与ES5兼容。
  // targets: 'defaults', // 这个是什么，是否默认查询，需要明确指定
  targets: {
    // chrome: '80',

    // browsers 格式是字符串
    browsers: [
      // '> 1%',
      // 'not ie <= 8',
      // 'Android >= 4.0',
      // 'Android >= 4.4',
      // 'iOS >= 7',
      'chrome 80',
      // 'last 2 versions'
    ].join('')
  }
```

参考：

- Babel 7 升级实践 https://blog.hhking.cn/2019/04/02/babel-v7-update/
- Polyfill 方案的过去、现在和未来 https://github.com/sorrycc/blog/issues/80
- http://2ality.com/2011/12/shim-vs-polyfill.html
- https://babeljs.io/docs/en/next/babel-preset-env.html
- https://github.com/zloirock/core-js/tree/v2
