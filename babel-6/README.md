# babel6

1. babel的作用是转换JS新的特性代码为大部分浏览器能运行的代码。
2. babel转码又分为两部分，一个是语法转换，一个是API转换（兼容新的 API）。
3. 对于API的转换又分为两部分，
   1. 一个是全局API例如Promise，Set，Map还有静态方法Object.assign，
   2. 另一个是实例方法例如Array.prototype.includes。
   3. 对于实例方法core-js@2是转换不了的，只有core-js@3才会转换。
4. babel代码转换依赖plugin，没有plugin的情况下babel做的事情只是 code => code。
5. plugin 有很多，一个个导入又特别麻烦，这时候使用 preset（预设很多plugin的集合）。
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

- babel-polyfill 是为了兼容新的API
  - 通过向全局对象和内置对象的prototype上添加方法来模拟完整的 ES2015+ 环境。
  - polyfill 是依赖core-js的。
  - babel7.4放弃了@babel/polyfill直接依赖core-js@2或者3。

注意：

- 通过 plugins 对应的如 `transform-es2015-classes` 插件添加的 polyfill 只会引入到当前模块中，实际开发中存在多个都会引入相同的 polyfill，导致大重复代码出现在项目中
- 而且不能保证手动引入的 transform 一定正确，所以推荐使用 transform-runtime 方案
- transform-runtime 依赖 babel-runtime
- babel-runtime 由三部分组成
  - core-js  core-js极其强悍，通过ES3实现了大部分的ES5、6、7的垫片，作者zloirock是来自战斗名族的程序员，一个人维护着core-js
  - regenerator  regenerator来自facebook的一个库，用于实现 generator functions
  - helpers  babel的一些工具函数，没错，这个helpers和前面使用babel-external-helpers生成的helpers是同一个东西


## 比较transform-runtime与babel-polyfill引入垫片的差异：

1. 使用runtime是按需引入，需要用到哪些polyfill，runtime就自动帮你引入哪些，不需要再手动一个个的去配置plugins，只是引入的polyfill不是全局性的，有些局限性。而且runtime引入的polyfill不会改写一些实例方法，比如Object和Array原型链上的方法，像前面提到的Array.protype.includes。
2. babel-polyfill就能解决runtime的那些问题，它的垫片是全局的，而且全能，基本上ES6中要用到的polyfill在babel-polyfill中都有，它提供了一个完整的ES6+的环境。babel官方建议只要不在意babel-polyfill的体积，最好进行全局引入，因为这是最稳妥的方式。
3. 一般的建议是开发一些框架或者库的时候使用不会污染全局作用域的babel-runtime，而开发web应用的时候可以全局引入babel-polyfill避免一些不必要的错误，而且大型web应用中全局引入babel-polyfill可能还会减少你打包后的文件体积（相比起各个模块引入重复的polyfill来说）。

## babel6 中使用 polyfill 的四种方法

使用babel-polify时，需要在你的业务代码中，在使用ES6的新函数 前通过`<script>` 或require 等 引入 babel-polyfill（就像引入jquery一样），她会把promise等函数添加到全局对象上；

1. 直接引入（影响全局，一劳永逸）
   1. 在入口文件中 import 'babel-polyfill' / require('babel-polyfill')。
   2. 使用webpack的话也可以在entry中添加 entry: ['babel-polyfill', 'src/index.js']。
   3. 优点：
      1. 一次引入，全局使用。
      2. 会转换实例方法和静态方法，比较全面。
   4. 缺点：
      1. 影响全局作用域。
      2. 打出来的包比较大，不管用没用到都打进去了。（大概增加 251kb（未压缩））
   5. 使用场景：
      1. 开发业务项目，比较全面，不会漏了从而出问题，比如Object.assign这样的方法在ios8上面还是需要polyfill的。
2. 在babel-runtime中单独引入
   1. 和直接在入口引入polyfill不同，该插件引入的polyfill是模块私有的。
   2. 对于需要的polyfill需要手动引入，import Promise from 'babel-runtime/core-js/promise'
   3. 优点：
      1. 该模块私有，不会影响到全局作用域。
      2. 打出来的包因为按需引入包不会很大。
   4. 缺点：
      1. 因为不影响全局作用域，所以**不会转实例和静态方法这样的API**。
      2. 手动引入所需，搞不好会漏掉。
   5. 使用场景：
      1. 开发库，框架之类可以使用，因为别人用你的东西然后不知情的情况下你改了别人的全局环境，然后出错了就尴尬了。
3. 使用[babel-plugin-transform-runtime](https://www.npmjs.com/package/babel-plugin-transform-runtime)，和插件babel-runtime一样引入的polyfill是私有的，不会影响全局作用域。并且是自动按需引入需要的polyfill，不需要像 babel-runtime 一样一个一个手动引入。
   1. 这个插件做了三件事：
      1. 当你使用 generators/async 函数时，自动引入 babel-runtime/regenerator 转换（使用 regenerator 运行时而不会污染当前环境
      2. 自动引入 babel-runtime/core-js 并映射 ES6 静态方法和内置插件（实现polyfill的功能且无全局污染，但是实例方法无法正常使用，如 "foobar".includes("foo") ）
      3. 移除内联的 Babel helper 并使用模块 babel-runtime/helpers 代替（提取babel转换语法的代码），这样可以提取语法转换时候每个模块都生成的各种helper，成一个引用。
      4. 以上分别对应三个配置项，默认为 true `{"regenerator": true, "polyfill": true, "helpers": true}`
   2. 优点：
      1. 该模块私有，不会影响到全局作用域。
      2. 打出来的包因为按需引入包不会很大。
      3. 自动按需引入，不需要手动，防止遗漏。
      4. 提取helper，大大减少冗余代码。
   3. 缺点：
      1. 因为不影响全局作用域，所以**不会转实例和静态方法这样的API**。
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
