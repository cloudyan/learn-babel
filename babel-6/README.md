# babel6

1. babel的作用是转换JS新的特性代码为大部分浏览器能运行的代码。
2. babel转码又分为两部分，一个是语法转换，一个是API转换（兼容新的 API）。
3. 对于API的转换又分为两部分，
   1. 一个是全局API例如Promise，Set，Map还有静态方法Object.assign，
   2. 另一个是实例方法例如Array.prototype.includes。
   3. 对于实例方法core-js@2是转换不了的，只有core-js@3才会转换。
4. babel代码转换依赖plugin，没有plugin的情况下babel做的事情只是 code => code。
5. plugin 有很多，一个个导入又特别麻烦，这时候使用 preset（是很多plugin的集合）。
6. API转换：babel-polyfill 的作用是兼容新的API。

注意: preset是从右往左（数组中从后向前）执行，plugin是从左往右执行，并且plugin先于preset执行

## 配置说明

只需要下面几个babel插件，就能解析大部分ES方法

1. babel-core //必备的核心库
2. babel-loader //webpack loader配置必备
3. babel-preset-env //有了它，你不再需要添加2015、2016、2017，全都支持
4. babel-preset-stage-0 //有了它，你不再需要添加stage-1,stage-2,stage-3,默认向后支持
5. babel-plugin-transform-runtime
6. babel-runtime //5和6是一起使用的，支持helpers，polyfill，regenerator配置

- babel-plugin-transform-decorators-legacy //支持修饰符语法 @connect
- babel-preset-react //支持解析react语法
- react-hot-loader //虽然它长得不像babel，但是它也需要在babelrc做配置

- babel-polyfill 兼容新的API

## babel6 中使用 polyfill 的四种方法

1. 直接引入（影响全局，一劳永逸）
   1. 在入口文件中 import 'babel-polyfill' / require('babel-polyfill')。
   2. 使用webpack的话也可以在entry中添加 entry: ['babel-polyfill', 'src/index.js']。
   3. 优点：
      1. 一次引入，全局使用。
      2. 会转换实例方法和静态方法，比较全面。
   4. 缺点：
      1. 影响全局作用域。
      2. 打出来的包比较大，不管用没用到都打进去了。
   5. 使用场景：
      1. 开发业务项目，比较全面，不会漏了从而出问题，比如Object.assign这样的方法在ios8上面还是需要polyfill的。
2. 在babel-runtime中单独引入
   1. 和直接在入口引入polyfill不同，该插件引入的polyfill是模块私有的。
   2. 对于需要的polyfill需要手动引入，import Promise from 'babel-runtime/core-js/promise'
   3. 优点：
      1. 该模块私有，不会影响到全局作用域。
      2. 打出来的包因为按需引入包不会很大。
   4. 缺点：
      1. 因为不影响全局作用域，所以不会转实例和静态方法这样的API。
      2. 手动引入所需，搞不好会漏掉。
   5. 使用场景：
      1. 开发库，框架之类可以使用，因为别人用你的东西然后不知情的情况下你改了别人的全局环境，然后出错了就尴尬了。
3. 使用[babel-plugin-transform-runtime](https://www.npmjs.com/package/babel-plugin-transform-runtime)按需引入
   1. 这个插件可不简单，有好几个功能：
      1. 和插件babel-runtime一样引入的polyfill是私有的，不会影响全局作用域。并且是自动按需引入需要的polyfill，不需要想babel-runtime一样一个一个手动引入。
      2. 可以提取语法转换时候每个模块都生成的各种helper，成一个引用。
      3. 自动转换generators/async。
   2. 优点：
      1. 该模块私有，不会影响到全局作用域。
      2. 打出来的包因为按需引入包不会很大。
      3. 自动按需引入，不需要手动，防止遗漏。
      4. 提取helper，大大减少冗余代码。
   3. 缺点：
      1. 因为不影响全局作用域，所以不会转实例和静态方法这样的API。
   4. 使用场景：
      1. 同babel-runtime。
   5. 注：对于polyfill的自动处理和helper的提取都是依赖babel-runtime完成的，所以该插件依赖babel-runtime。
4. 在babel-preset-env中设置配置项 useBuiltIns [corejs]
   1. useBuiltIns 选项是为了分割入口的 `import 'babel-polyfill'` / `require(babel-polyfill)` 按环境引入polyfill。
   2. 该方式同第一中引入polyfill的方式，但是会按照配置的环境去按需引入，稍微好点。

小结：

1. babel6的核心有 babel-core babel-cli babel-node babel-register babel-polyfill，这些在babel7会有所修改。
2. polyfill 是依赖core-js的
3. babel7.4放弃了@babel/polyfill直接依赖core-js@2或者3。

## 配置

```js
// .babelrc
{
  "presets": [
    ["env", {

      "useBuiltIns": false,
    }],
    "react",
    "stage-0"
  ],
  "plugins": [
    ["transform-runtime", {
      "helpers": false, //建议为false
      "polyfill": false, //是否开始polyfill，根据你的网站兼容性情况来看，通常我不开启，开启会增加很多额外的代码
      "regenerator": true //必须true，否则js就废了
    }],
    "react-hot-loader/babel", //热更新插件
    "transform-decorators-legacy" //修饰符语法转换插件
  ]
}
```

```js
// webpack.config.js
// ...
module: {
  rules: [{
    test: /\.jsx?$/,
    use: 'babel-loader'
  }]
}
```

参考：

- https://blog.csdn.net/letterTiger/article/details/100717666
