##### 1、Vue3.0性能提升体现的方面？

答：

1、响应式：利用proxy对象，重写响应式，可以监听新增，删除的属性，以及数组的索引和length

2、编译优化：标记所有静态根节点，diff的时候，只需要对比动态节点内容。

3、源码体积比较小

##### 2：Vue 3.0 所采用的 Composition Api 与 Vue2.x使用的Options Api 有什么区别？

答：

在Vue2.0中：

- 逻辑处理分散在data，methods，computed，watch，当逻辑改变时，不得不在多个模块中同步更改这些功能。
- 当项目足够大，足够复杂的时候，变更逻辑的代价是比较大的。

在Vue3.0中：

- 是根据逻辑功能来组织的，一个功能所定义的所有api会放在一起（更加的高内聚，低耦合）
- 项目很大，功能很多，我们都能快速的定位到这个功能所用到的所有API
- 当抽取公共代码，和做代码混入的操作时，3.0更加快捷高效
##### 3、Proxy 相对于 Object.defineProperty 有哪些优点？
答：

proxy的优势:

- 可以监听新增，删除的属性
- 可以监听数组的索引和length
- Proxy 的拦截方法有多种，比defineProperty要丰富很多

##### 4、Vue 3.0 在编译方面有哪些优化？

2.0中在diff过程中会比较所有的新旧vnode，除了静态根节点外，静态节点依旧需要diff。

3.0中，标记和提升了所有的静态根节点，diff的时候，只需要对比动态节点即可

- fragments-片段特性，删除根节点后，会创建这个片段
- 静态节点会被提升到render外层，不需要重新创建
- 只会比较被pathcFlag标记的vnode
- 缓存事件处理函数

##### 5、Vue.js 3.0 响应式系统的实现原理

**reactive:**
- 接收一个参数，判断参数是不是对象
- 返回Proxy对象
- 创建拦截器对象handler，设置set/get/deleteProperty

**收集依赖：**

依赖收集过程中会创建三个集合：
- targetMap: new WeakMap() 记录目标对象
- depsMap：new Map() targetMap的值是depsMap，
- dep:new Set() depsMap的值是dep，它的值是effect

访问响应式对象属性时去收集依赖

**trigger:**

- 先去targetMap中寻找目标depsMap
- 在desMap中寻找key，遍历dep，找到effect，并执行

**ref:**

用reactive创建响应式对象，返回

```
const r = {
    __v_isRef: true,
    get value() {
      track(r, 'value')
      return value
    },
    set value(newValue) {
      if (newValue !== value) {
        raw = newValue;
        value = convert(raw)
        trigger(r, 'value')
      }
    }
}
return r
```


**toRefs:**

将传入对象全部转换为响应式对象，解构对象也会被转换为响应式。遍历传入的对象，返回一个具有set，get属性的新对象


