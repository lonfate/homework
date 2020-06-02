#### 作业：
##### 第一题：

优点：
- 发现垃圾立即回收
- 最大限度减少程序暂停

缺点：
- 无法回收循环引用的对象
- 时间开销大

##### 第二题：
分标记和清除两个阶段：

标记阶段：遍历所有对象标记可达对象。

清除阶段：清除前会先整理，产生连续空间，然后遍历所有对象清除没有标记的对象，回收相应的空间。

##### 第三题：

新生代对象的回收，采用复制算法和标记整理。新生代的内存分为两个等大的空间：from和to。起初会将所有对象存储在from空间内,from空间达到某种程度触发GC，对活动对象进行标记整理，然后拷贝至to空间，最后进行from和to的交换空间释放。

##### 第四题：

增量标记是为了优化老生代的效率，垃圾回收会阻塞js的执行，所以会有停下来的时间。所以增量标记会将一整段的垃圾回收，分成多个小段进行。实现js与垃圾回收的交替执行。

##### 代码题1 (code中有执行代码)
```
//练习1
let isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)
isLastInStock(cars)

//练习2
let isFirstName = fp.flowRight(fp.prop('name'), fp.first)
isFirstName(cars)

//练习3
let _average = function(xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length
}
const averageDollarValue = fp.flowRight(_average, fp.map(v => v.dollar_value))
averageDollarValue(cars)

//1 练习4
let _underscore= fp.replace(/\W+/g, '__')
const sanitizeNames = fp.map(v => {
    v.name = fp.flowRight(_underscore, fp.toLower)(v.name)
    return v
})
sanitizeNames(cars)
```
##### 代码题2
```
//练习1
let maybe = Maybe.of([5, 6, 1])
/**
 * @param {number} num  需要加多少
 * @return {Object}
 */
let ex1 = (num) => maybe.map(v => fp.map(y => y = fp.add(num)(y))(v))
ex1(10)

//练习2
let xs = Container.of(['do','ray','me','fa','so','la','ti','do'])
let ex2 = xs.map(v => fp.first(v))

//练习3
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
ex3('name')(0) 

//练习4
let ex4 = (n) => Maybe.of(n).map(v => parseInt(v))
ex4('1.99')
```
