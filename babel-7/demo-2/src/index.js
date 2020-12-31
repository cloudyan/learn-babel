
const arr = [1,2,3]

const arr2 = arr.map(item => item*2)

const index = arr2.findIndex(item => item > 3)

console.log(index)

Promise.resolve('foo').finally()
