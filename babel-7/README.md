# 学习 babel7

babel7进行了较大的改动，废弃了 stage-x的preset，还增加了命名空间区分官方插件和非官方插件，@babel/core，@babel/cli等。

建议使用@babel/preset-env 。

在babel7中，原先的插件babel-plugin-transform-runtime也做了修改 -> @babel/plugin-transform-runtime。并且在功能上也变强大了。

移除了polyfill的配置项添，加了corejs配置项。

## useBuiltIns 配置

- `useBuiltIns: false`
  - 默认值是false，表示不会自动引入polyfills，并且不会处理 import “@babel/polyfill” 和 import “corejs”。
  - 此时不对 polyfill 做操作。如果引入 @babel/polyfill，则无视配置的浏览器兼容，引入所有的 polyfill。
  - 注：babel7.4会放弃 @babel/polyfill，所以建议直接使用 corejs。
- `useBuiltIns: 'usage', corejs: 2,`
  - 使用 usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需引入。
  - babel6 中需要手动引入 `import "babel-polyfill";`
  - babel7中 **需要指定 core-js 的版本**, 但无需如下说法，参见 [./demo-in-webpack](./demo-in-webpack)
  - ~~`corejs: 2` 需要在入口文件手动添加 `import '@babel/polyfill'`，会自动根据 browserslist 替换成浏览器不兼容的所有 polyfill。~~
  - ~~`corejs: 3`, 则 import '@babel/polyfill' 需要改成 `import 'core-js/stable';import 'regenerator-runtime/runtime';`~~
- `useBuiltIns: entry`
  - 只能在入口引入一次，多次会报错。
  - 会被自动分割为各个模块的导入。
- corejs 默认是 2
  - 该选项只会在 useBuiltIns选项为 usage或者 entry并且 @babel/preset-env正确导入对应的corejs版本的情况下起作用。
- @babel/polyfill不支持从core-js2到core-js3的平滑过渡，所以在babel 7.4版本中，已经废弃@babel/polyfill(只能用core-js2），而是直接引入core-js3和regenerator-runtime代替。

usage 按需引入。**同样会造成全局污染。**在我的理解中这个选项只是entry的一种增强，不需要在入口手动引入一次，并且可以按照使用特性多少按需引入。

参考：

- https://blog.csdn.net/letterTiger/article/details/100717666
