##### 作业解答：

1、点击按钮时，对象不是响应式的，因为对data数据，利用defineProperty做响应式时，并没有对新增的name属性做响应式处理。

解决方法：

```
this.$set(this.dog, 'name', 'Trump')
```
set方法会将name属性变为响应式的。

2、答：

- 在patch方法中会调用sameVnode方法
- 通过sameVnode方法判断newNode与oldNode是否相同
- 如果不相同，直接销毁oldNode，将newNode添加到dom中
- 如果相同，则调用patchVnode方法比较下属节点
- 如果oldVnode有子节点而newNode没有，则删除dom的子节点
- 如果他们都有文本节点并且不相等，那么将dom的文本节点设置为newNode的文本节点。
- 如果oldVnode没有子节点而newNode有，则将newNode的子节点真实化之后添加到dom
- 如果两者都有子节点，则执行updateChildren函数比较子节点
- 在updateChildren函数中，使用while循环遍历下面的子节点，并通过回调sameVnode方法继续进行判断，直到子节点对比完成

##### 编程题部分代码及思路：

1、模拟hash模式：

```
 window.location.href = "#" + this.to
```

2、实现v-html及v-on

通过解析字符串，获取标签名，标签属性，标签文本，最终将字符串整理成具有父子级的对象，生成真实文本并插入

3、利用snabbdom生成虚拟dom，映射到真实dom
