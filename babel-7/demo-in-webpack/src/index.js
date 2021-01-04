
import { mapTest1 } from './module-1'
import { mapTest2 } from './module-2'

const arr = [1,2,3]

const arr1 = mapTest1(arr) // arr.map(item => item*2)
const arr2 = mapTest2(arr) // arr.map(item => item*2)

const index1 = arr1.findIndex(item => item > 3)
const index2 = arr2.findIndex(item => item > 3)
// const index = arr.findIndex(function (item) {
//   return item == 2
// })

console.log('log:', index1, index2)

// Promise.resolve().finally()
