在import Vue的时候，会执行一系列Mixin操作，

比如：
```
initMixin()
stateMixin()
eventMixin()
lifecyleMixin()
renderMixin()
```
##### 在initMixin中：
- 在Vue原型上定义_init()方法
- 执行一系列的初始化操作比如：initLifecycle(),initEvents(),initRender(),initState()等方法

##### 在initState中：
- 在Vue原型上定义$data,$props,$watcher,$set,$delete


##### 在eventMixin中：
- 在Vue原型上定义了$on $once $off $emit方法

##### 在lifecyleMixin中：
- 在Vue原型上定义了_update, $forceUpdate,$destory方法

##### 在renderMixin中：
- 定义了Vue原型上的_render方法及$nextTick

当new Vue的时候，会执行里面的this._init方法，
进而执行一系列的初始化操作比如：


```
initLifecycle(vm)
initEvents(vm)
initRender(vm)
callHook(vm, 'beforeCreate') //执行生命周期
initInjections(vm)  
initState(vm)
initProvide(vm) 
callHook(vm, 'created')//执行生命周期
最后执行vm.$mount
```
##### 在initRender中：
- 在vm上挂载$creatElement
- defineReactive(vm, '$attrs')
- defineReactive(vm, '$listeners')

##### 在initState中：
- initProps()
- initMethods()
- initData()
- initComputed()
- initWatch()

初始化操作过后，会执行$mount操作，在$mount中，会执行mountComponent，在其中：
- new一个渲染wathcer，执行_render方法，返回vnode，将vnode传入_update方法，进行pathc渲染的操作

##### =>先看_render方法：
render中会执行$createElement,他的参数就是组件编译的结果
###### createElement中：
通过传入的tag参数是不是字符串类型，来判断是否是组件形式
- 如果不是组件形式，就会创建一个Vnode实例，
- 如果是组件形式，就会调用createCompoent，在其中，会执行Vue上的extend方法，这个方法的作用是：

1. 创建组件对象Sub，将Vue的原型挂载到sub的原型上
1. 将Vue的options根据不同的策略进行合并
1. 如果有props或者computed就分别执行他们的初始化操作
1. 返回这个组件的构造函数
执行installComponentHooks(),将init,insert,prepatch,destory,在data.hook上挂载。

最终返回Vode，如果是组件返回组件构造函数，如果不是就返回vnode实例
##### =>再看_update即patch过程

patch的过程中，执行createPatchFunction,首先会将dom操作的一些方法传入，还有create，updata，remove这些不同时期的方法。

其中：
1. 将这些不同时期的方法，分门别类存储在cbs中
2. 执行patch，执行createElm方法
3. createElm中：（不是组件vnode）
    1. vnode.elm = 创建一个tag的真实节点，
    2. 执行createChildren，其实就是递归createElm，children是不是数组，直到他是一个基础类型，将它添加到vnode.elm中
    3. invokeCreateHooks,遍历cbs中的create方法，将vnode传入并执行
    4. insert，将vnode.elm插入他的父级
4. createElm(是组件vnode):
    1. 执行createComponent，执行定义在组件vnode上的hook中的init方法，在init方法中就会实例化组件构造函数。
        1. 将当前你vnode及当前activeInstance即当前的vm传入
        2. 调用$mount
    2. 最终执行完一圈后，会执行initComponent,执行cbs中的create相关方法
    3. 执行insert将它插入到body上
    
执行完后createElm，会执行invokeInsertHook(),最终返回vnode.elm

##### new watcher相关：

在new wathcer的时候，执行一个叫做this.get的方法，其中：

- 设置当前的this为dep.target,将当前的this保存在targetStack栈中
- 执行传入的第二个参数函数
- 执行完后，将最后一个target弹出，将前一个作为当前dep.target



##### 接下来看看state初始化相关=>
###### initData:
在initData中，主要执行observe(),observe的作用就是查看是否有__ob__这个属性,如果有就返回，没有的话就new Observer()

class Observer中：

- 遍历出入的data对象，执行defineReactive()给他们添加响应式。
###### defineReactive中：
- 会对每个data对象，创建一个dep实例
- 利用Object.defineProperty()，向data中的属性添加响应式。主要是get,set

在执行_render，生成vnode时，必然会读取到data相关的值，那么就会触发属性中的get方法:

> ->触发dep.depend()
> 
> ->触发watcher中的addDep即dep.target.addDep()
> 
> ->addDep，将当前dep的id，push进入newDepIds中，当前dep实例，保存进入newDeps中，最后触发dep的addSub
> 
> ->addSub，向this.subs中，订阅当前的watcher

##### 接下里看看触发set都干了什么？
当我们尝试改变某个值的时候：

> -->触发dep.notify方法，在notify中，会遍历this.subs中订阅的watcher实例，并触发watcher的update方法

> -->在update中，判断当前的watcher的lazy属性，如果是false且不是异步组件，就会执行queueWatcher

> -->queueWatcher中，将当前watcher添加进入queue数组中，然后会配合nextTick执行flushSchedulerQueue方法，这里可以看到，数据的更新是异步的

> -->nextTick函数接受flushScheduleQueue方法，将flushScheulerQueue保存在callbacks数组中，当当前队列执行完之后，遍历callbacks，执行callback，也就是flushScheduleQueue

> -->在flushScheduleQueue中，遍历queue数组，执行watcher中的run方法

> --> 在run方法中，就会执行watcher的get方法，如果是渲染wather的话，就会调用updateComponent进行渲染








