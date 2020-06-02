const fp = require('lodash/fp')

const cars = [
    {
        name: 'Ferrari FF',
        horsepower: 660,
        dollar_value: 700000,
        in_stock: true
    },
    {
        name: 'Spyker C12 Zagato',
        horsepower: 650,
        dollar_value: 648000,
        in_stock: false
    },
    {
        name: 'Jaguar XKR-S',
        horsepower: 550,
        dollar_value: 132000,
        in_stock: false
    },
    {
        name: 'Audi R8',
        horsepower: 525,
        dollar_value: 114200,
        in_stock: false
    },
    {
        name: 'Aston Martin One-77',
        horsepower: 750,
        dollar_value: 1850000,
        in_stock: true
    },
    {
        name: 'Pagani Huayra',
        horsepower: 700,
        dollar_value: 1300000,
        in_stock: false
    },
]

//代码题1
//1 练习1
let isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)
const result1 = isLastInStock(cars)
console.log('1-1答案：', result1)


//1 练习2
let isFirstName = fp.flowRight(fp.prop('name'), fp.first)
const result2 = isFirstName(cars)
console.log('1-2答案：', result2)


//1 练习3
let _average = function(xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length
}
const averageDollarValue = fp.flowRight(_average, fp.map(v => v.dollar_value))
const result3 = averageDollarValue(cars)
console.log('1-3答案：', result3)


//1 练习4
let _underscore= fp.replace(/\W+/g, '__')
const sanitizeNames = fp.map(v => {
    v.name = fp.flowRight(_underscore, fp.toLower)(v.name)
    return v
})
const result4 = sanitizeNames(cars)
console.log('1-4答案：', result4)

//----------------------//

//代码题2
class Container{
    static of (value) {
        return new Container(value)
    }
    constructor(value) {
        this._value = value
    }
    map(fn) {
        return Container.of(fn(this._value))
    }
}

class Maybe {
    static of(x) {
        return new Maybe(x)
    }
    isNoting() {
        return this._value === null || this._value === undefined
    }
    constructor(x) {
        this._value = x
    }
    map(fn) {
        return this.isNoting() ? this : Maybe.of(fn(this._value))
    }
}

//2 练习1
let maybe = Maybe.of([5, 6, 1])
/**
 * @param {number} num  需要加多少
 * @return {Object}
 */
let ex1 = (num) => maybe.map(v => fp.map(y => y = fp.add(num)(y))(v))
const res1 = ex1(10)
console.log('2-1答案：都加10', res1._value)

//2 练习2
let xs = Container.of(['do','ray','me','fa','so','la','ti','do'])
let ex2 = xs.map(v => fp.first(v))
console.log('2-2答案：', ex2._value)

//2 练习3
let safeProp = fp.curry(function(x,o) {
    return Maybe.of(o[x])
})
let user = {id: 2, name: 'Albert'}
/**
 * @param {string} name  需要的属性
 * @param {number} index 属性的第几个
 * @return {Object}
 */
let ex3 = fp.curry(function(name, index) {
    return safeProp(index)(fp.split('')(user[name]))
})
const res3 = ex3('name')(0) 
console.log('2-3答案：', res3)

//2 练习4
let ex4 = (n) => Maybe.of(n).map(v => parseInt(v))
const res4 = ex4('1.99')
console.log('2-4答案：', res4)
