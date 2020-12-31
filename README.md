# learn-babel

学习 babel

- 测试 [jest-use-babel7](https://github.com/cloudyan/jest-use-babel7)
- 手动按需引入 https://github.com/zloirock/core-js/tree/v2/modules

## 关于polyfill

Babel 编译通常会排除 node_modules，所以 "useBuiltIns": "usage" 存在风险，可能无法为依赖包添加必要的 polyfill。

云谦在博客 [Polyfill 方案的过去、现在和未来](https://github.com/sorrycc/blog/issues/80) 也提到一些问题

还有个叫做[polyfill.io](https://polyfill.io/v2/docs/)的神器，只要在浏览器引入 `https://cdn.polyfill.io/v3/polyfill.min.js` 服务器会更具浏览器的UserAgent返回对应的polyfill文件，很神奇，可以说这是目前最优雅的解决polyfill过大的方案。

- https://polyfill.alicdn.com/polyfill.min.js?features=Promise
  现在覆盖了阿里系的绝大部分webview，以及chrome/safari/firefox/IE/EDGE这些，至于微信的webview还不支持
- http://polyfill.alicdn.com/modern/polyfill.min.js
  - 的默认带了es6/es7的比较全的集合，以及只带了基本的polyfill的链接
- polyfill.io 服务端的成本太大，如果用第三方提供的服务，不敢保证。

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

## core-js/library or core-js/modules？


core-js 提供了两种补丁方式。

- core-js/library，通过 helper 方法的方式提供
- core-js/module，通过覆盖全局变量的方式提供

目前推荐是用 core-js/modules，因为 node_modules 不走 babel 编译，所以 core-js/library 的方式无法为依赖库提供补丁。

对比示例 [babel-7/demo-1](./babel-7/demo-1) vs [babel-7/demo-2](./babel-7/demo-2) 的输出产物

corejs@3 的方式

- core-js/features/set 通过覆盖全局变量的方式提供
- import Set from "core-js-pure/features/set"; 通过 helper 方式提示，不污染全局



参考：

- Babel 7 升级实践 https://blog.hhking.cn/2019/04/02/babel-v7-update/
- Polyfill 方案的过去、现在和未来 https://github.com/sorrycc/blog/issues/80
- http://2ality.com/2011/12/shim-vs-polyfill.html
- https://babeljs.io/docs/en/next/babel-preset-env.html
- https://github.com/zloirock/core-js/tree/v2
- https://github.com/sl1673495/blogs/issues/13
