####  1、请简述 React 16 版本中初始渲染的流程

- render：为每一个react元素创建 Fiber 对象，在构建fiber对象的过程中，要构建其对应的DOM对象，并为 Fiber节点添加effectTag属性以记录当前 Fiber 节点要进行的 DOM 操作。
- commit: 获取到render 的结果， 根据 fiber 中的 effectTag 属性进行相应的 DOM 操作。

#### 2、 为什么 React 16 版本中 render 阶段放弃了使用递归
- 在16之前的版本中采用递归执行。递归耗内存，更新一旦开始，中途就无法中断。
- 当VirtualDOM 树的层级很深时，virtualDOM 的比对就会长期占用 JavaScript 主线程。
- 由于 JavaScript 又是单线程，无法同时执行其他任务，所以在比对的过程中无法响应用户操作，会造成页面卡顿的现象。

#### 3、 请简述 React 16 版本中 commit 阶段的三个子阶段分别做了什么事情
- DOM操作前，处理类组件的getSnapshotBeforeUpdate声明周期函数，并且把旧的props和states传递进去。
- DOM操作中，根据effectTag进行dom操作：
    - 插入节点：commitplacement
    - 更新节点：commitwork
    - 删除节点：commitdeletion
- DOM操作后，调用生命周期函数和钩子函数
#### 4、 请简述 workInProgress Fiber 树存在的意义是什么
实现双缓存技术, 在内存中构建 DOM 结构以及 DOM 更新, 在 commit 阶段实现 DOM 的快速更新。


- 在React中最多会同时存在两棵Fiber树。当前屏幕上显示内容对应的Fiber树称为current Fiber树。
- 当发生更新时，React 会在内存中重新构建一颗新的 Fiber 树，称为workInProgress Fiber树，这棵树由于构建在内存中，所以速度非常快。
- 当workInProgress Fiber 树构建完成后，React 会使用它直接替换 current Fiber 树达到快速更新 DOM 的目的。
