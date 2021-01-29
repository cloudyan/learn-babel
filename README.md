# learn-babel

学习 babel

- 测试 [jest-use-babel7](https://github.com/cloudyan/jest-use-babel7)
- 插件列表 https://babeljs.io/docs/en/plugins/

## Babel编译转码的范围

Babel默认只转换新的JavaScript语法，而不转换新的API。 例如，Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转译。 如果想使用这些新的对象和方法，则需要为当前环境提供一个垫片(polyfill)。

## @babel/polyfill

babel-polyfill通过向全局对象和内置对象的prototype上添加方法来模拟完整的 ES2015+ 环境。

- @babel/polyfill主要用于应用程序(如浏览器，babel-node), 而不是库/工具, 并且使用babel-node时，这个polyfill会自动加载。
- @babel/polyfill包括 core-js2和regenerator runtime模块。
- @babel/polyfill是一次性引入你的项目中的，并且同项目代码一起编译到生产环境。
- 问题1: @babel/polyfill包含所有补丁，不管浏览器是否支持，也不管你的项目是否有用到，都全量引了, 在浏览器中，这些代码体积比较大。
- 问题2: 会污染全局变量。像Map，Array.prototype.find这些就存在于全局空间中。
- 新版本@babel/polyfill 加入了core-js3支持。

## babel-runtime

babel转译代码的时候需要一些工具方法，这些方法默认都会加到用到他们的文件的开头，有时这些方法会很长。babel-runtime就是为了优化这种情况的，将这些工具方法抽离出来，不用每个文件都引入。

- babel-runtime可以看作是一种库/工具，搭配babel-plugin-transform-runtime，一般在开发第三方类库时使用。
- babel-runtime不会污染全局空间和内置对象原型。
- 多次使用只会打包一次。
- 弥补了babel-polyfill的缺点，达到了按需加载的效果。
- 一般在开发第三方类库或工具时使用，一般放在'devDependencies'里。
- babel-runtime的问题: 不能转码实例方法。

babel-plugin-transform-runtime的作用是分析我们的 ast，通过映射关系插入 babel-rumtime 中的垫片, runtime 编译器插件做了以下三件事：

- 当你使用 generators/async 函数时，自动引入 babel-runtime/regenerator 。
- 自动引入 babel-runtime/core-js 并映射 ES6 静态方法和内置插件。
- 移除内联的 Babel helper 并使用模块 babel-runtime/helpers 代替。

## 关于polyfill

Babel 编译通常会排除 node_modules，所以 "useBuiltIns": "usage" 存在风险，可能无法为依赖包添加必要的 polyfill。

云谦在博客 [Polyfill 方案的过去、现在和未来](https://github.com/sorrycc/blog/issues/80) 也提到一些问题

还有个叫做[polyfill.io](https://polyfill.io/v2/docs/)的神器，只要在浏览器引入 `https://cdn.polyfill.io/v3/polyfill.min.js` 服务器会更具浏览器的UserAgent返回对应的polyfill文件，很神奇，可以说这是目前最优雅的解决polyfill过大的方案。

polyfill.io 不旦提供了 cdn 的服务，也开源了自己的实现方案 [polyfill-service](https://github.com/Financial-Times/polyfill-service)。

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

### 补丁方案

```js
// .babelrc的配置说明:
{
  "presets": [
    // 预设, Babel 插件的组合套餐
    // 插件的执行顺序：
    // 插件在 Presets 前运行。
    // 插件顺序从前往后排列。
    // Preset 顺序是颠倒的(从后往前)
    "@babel/preset-react",
    // 支持react特有的一些语法，如jsx等
    ["@babel/preset-env", {
      "modules": false,
       //该参数的含义是：启用将ES6模块语法转换为另一种模块类型/模块的导入导出方式。将该设置为false就不会转换模块。默认为 auto, 基本会是'commonjs'。
       //该值可以有如下：'amd' | 'umd' | 'systemjs' | 'commonjs' | auto | false
       //设置为false的原因: 以前我们需要使用babel来将ES6的模块语法转换为AMD, CommonJS，UMD之类的模块化标准语法，但是现在webpack都帮我做了这件事了，所以我们不需要babel来做，因此需要在babel配置项中设置modules为false,这里导成其他的模块类型也没问题，因为webpack的模块支持这些方式。
      "targets": {
        // tagets 指支持的运行环境
        // 运行环境: chrome, opera, edge, firefox, safari, ie, ios, android, node, electron
        // 如果不设置，就相当于声明了所有ES2015+的plugin
        "browsers": ["last 2 versions", "safari 7",  "chrome": 49],
        // 支持每个浏览器最后两个版本和safari大于等于7版本所需的polyfill代码转换。
        // 支持chrome49所需的polyfill代码转换。
        "node": "current"
        // 如果通过Babel编译Node.js代码的话，可以设置 "target.node" 是 'current', 含义是 支持的是当前运行版本的nodejs。
      },
      "loose": false,
       // 含义是：允许它们为这个 preset 的任何插件启用"loose" 转换, 默认为false。
       // babel编译时，对class的属性采用赋值表达式，而不是Object.defineProperty（更简洁）
       // 默认情况下，当在 Babel 下使用模块（module）时，将导出（export）一个不可枚举的 __esModule 属性。
      "useBuiltIns": "usage",
       // "usage" | "entry" | false, 默认是false
       // entry的含义是找到入口文件里引入的 @babel/polyfill，并替换为 targets 浏览器/环境需要的补丁列表。
       // usage指按需引入。
       // false指不动态添加polyfills，并且不转译 import "core-js" 和 import "@babel/polyfill"，会引入全部的polyfills。
      "corejs": 2,
       // 新版本的@babel/polyfill包含了core-js@2和core-js@3版本，所以需要声明版本，否则webpack运行时会报warning，此处使用core-js@2版本
      "debug": false,
      // 是否在转码时打印debug信息
      "include": [], // 总是启用的 plugins, 可以让babel加载指定名称的插件。
      "exclude": [],  // 强制不启用的 plugins,可以让babel去除指定名称的插件。
      "forceAllTransforms": false, // 强制使用所有的plugins，用于只能支持ES5的uglify可以正确压缩代码
    }]
  ],
  "plugins": [
    [ "transform-runtime", {
      // enables the re-use of Babel's injected helper code to save on codesize.
      "corejs": false,
      // 默认false，或者数字：{ corejs: 2/3 }，代表需要使用corejs的版本。
      // 如果是false则使用@babel/runtime，如果是2则使用@babel/runtime-corejs2，除了runtime中的helpers，另外含有Promise，Symbol等。
      "helpers": true, // 默认是true，是否替换helpers。
      "polyfill": false, // v7无该属性
      "regenerator": true, // 默认true，generator是否被转译成用regenerator runtime包装不污染全局作用域的代码。
      "useBuiltIns": false, // v7无该属性
      "useESModules": false, // 默认false，如果是true将不会用@babel/plugin-transform-modules-commonjs进行转译，这样会减小打包体积，因为不需要保持语义。
      "absoluteRuntime": false
    }],
    [ "import", { "libraryName": "antd", "style": true } ]
  ]
  "env": {
    "development":{
      "plugins": [ "dva-hmr" ]
    },
    "production": {}
  }
}
```

### core-js/library or core-js/modules？

core-js 提供了两种补丁方式。

- core-js/library，通过 helper 方法的方式提供
- core-js/module，通过覆盖全局变量的方式提供

目前推荐是用 core-js/modules，因为 node_modules 不走 babel 编译，所以 core-js/library 的方式无法为依赖库提供补丁。

对比示例 [babel-7/demo-1](./babel-7/demo-1) vs [babel-7/demo-2](./babel-7/demo-2) 的输出产物

corejs@3 的方式

- core-js/features/set 通过覆盖全局变量的方式提供
- import Set from "core-js-pure/features/set"; 通过 helper 方式提示，不污染全局

### corejs@3 与 corejs@2 有什么不同



### 非 core-js 里的特性，如何打补丁？

手动引入，比如 [Intl.js](https://github.com/andyearnshaw/Intl.js/)、URL 等。但是得小心有些规范后续加入 ecmascript 之后可能的冗余，比如 [URL](https://github.com/zloirock/core-js/pull/454)。

## babel编译代码的几种方式

1. 直接执行es6代码 `babel-node xxx.es6.js`
2. babel-register 该库引入后会重写你的require加载器，让你的Node代码中require模块时自动进行ES6转码。`import 'babel-register'`
3. babel命令编译 `babel src -d lib -s`
4. API调用babel实现源码编译 `babel.transform('xxx code', options, (err, result) => {})`
5. 通过babel-loader调用babel


参考：

- [Babel 7 升级实践](https://blog.hhking.cn/2019/04/02/babel-v7-update/)
- [关于Babel](https://github.com/Kehao/Blog/issues/1)
- [Polyfill 方案的过去、现在和未来](https://github.com/sorrycc/blog/issues/80)
- [babel7的配置与优化](https://github.com/sl1673495/blogs/issues/13)
- http://2ality.com/2011/12/shim-vs-polyfill.html
- https://babeljs.io/docs/en/next/babel-preset-env.html
- https://github.com/zloirock/core-js/tree/v2
- https://www.sitixi.com/Babel%20Polyfill/
