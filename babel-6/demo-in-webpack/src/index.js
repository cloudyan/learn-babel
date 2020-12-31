
import "babel-polyfill";

const arr = [1,2,3]

const arr2 = arr.map(item => item*2)

const index = arr2.findIndex(item => item > 3)
// const index = arr.findIndex(function (item) {
//   return item == 2
// })

console.log(index)
