##### 作业解答：

##### 1、Vue首次渲染过程：

首先，会执行一些初始化操作比如：
- initMixin() 初始化vm，在Vue原型上添加_init方法
- staticMixin() 注册vm的$data,$props $set $delete $watch
- eventMixin() 初始化事件相关的$on $off $emit $once
- lifecycleMixin() 上添加_update方法，生命周期相关的$forceupdate,$destory
- renderMixin() 初始化$nextTick() _render方法

其次：在实例化vue的时候，会执行函数体内的_init方法，在vm上挂载一些属性和方法，比如$children, $parent $createElement等，最后执行$mount->mountComponent

在mountComponent中，最重要的是实例化渲染watcher，执行updateComponent-> vm._update(_vm.render())
- _render()返回vnode，
- _update会执行patch函数，将vnode转换成为真实vnode，并渲染在页面上

##### 2、Vue响应式原理

vue响应式借助**Object.defineProperty()**,将data属性通过设置get和set变成响应式的，同时每个data属性都会实例化一个deps类用于收集相关的watcher

在执行render生成vnode的时候，触发defineProperty中的get方法
- 执行dep.depend()方法,将当前的watcher记录在this.subs的数组中。
- 当前watcher也会在newDeps中收集到dep

当数据发生改变时:

- 触发set() -> dep.notify()遍历this.subs中的watcher执行update方法
- update() -> queueWatcher()维护一个queue数组，数组中添加watcher队列，将每个watcher插入到合适的位置
- 每个data可能含有多个watcher，只有第一个update执行时，会触发nextTick(),waiting=true。以后的update只会在queue中添加watcher，可以使多次渲染合并一次执行。
- 在nextTick函数中，callbacks数组中添加flushSchedulerQueue，执行timeFunc，遍历callbacks数组，执行flushSchedulerQueue->watcher.run()->watcher.get()触发渲染函数

##### 3、key的好处
当没有key或者key是index下标时，子sameVnode判断中，即使两个元素不一样，也会判定为sameVnode，这样一来就会出现多次渲染的情况。而使用唯一的key，在sameVnode判断中，就更准确，渲染的次数也会减少。

##### 4、Vue模板渲染过程
- parse过程，将模板解析成为ast语法树，用js对象来表示模板的结构。
- optimize过程，是对ast的优化，这时会标记静态根节点和静态节点。
1.  子元素有一个不是静态节点，整个节点就不是静态节点
1.  只有一个子元素，或者只是纯文本节点，也不是静态根节点
- generate 将ast语法树转换成为字符串形式的js代码
- 最后用new Function()将字符串转换为render函数
