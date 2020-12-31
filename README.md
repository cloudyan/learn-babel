# learn-babel

学习 babel

- 测试 [jest-use-babel7](https://github.com/cloudyan/jest-use-babel7)

## 关于polyfill

polyfill 虽然可以做到按需引入，但不会编译 node_modules 中的模块，所以存在风险

还有个叫做[polyfill.io](https://polyfill.io/v2/docs/)的神器，只要在浏览器引入 `https://cdn.polyfill.io/v3/polyfill.js` 服务器会更具浏览器的UserAgent返回对应的polyfill文件，很神奇，可以说这是目前最优雅的解决polyfill过大的方案。

## 配置

关于 defaults

- https://github.com/browserslist/browserslist#best-practices
  - There is a `defaults` query, which gives a reasonable configuration for most users:
- https://babeljs.io/docs/en/babel-preset-env#browserslist-integration
  - Please note that if you are relying on browserslist's `defaults` query (either explicitly or by having no browserslist config), you will want to check out the No targets section for information on preset-env's behavior.

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
