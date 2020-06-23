#### 作业解答：
##### 一、简答题

##### 第一题：

答案： webpack的构建流程主要由以下环节：

1. 解析webpack的配置参数，初始化参数
1. 根据配置参数，注册相应的plugin插件，插件会监听webpack的生命周期，在不同的生命周期调用不同的插件。达到优化的目的。
1. webpack启动后，会从entry配置开始，递归解析entry依赖的所有module。
1. 对于不同的module，根据module中rules的loader规则进行相应的解析，转换成标准的js代码。之后，收集其中的依赖关系，生成代码块
2. 输出代码到文件

##### 第二题：
答案：

- loader：是资源加载器，可以对不同类型的资源，配置相应 的规则，对它进行解析或转换，最终生成js代码。比如，对css的处理，用css-loader/style-loader；图片的处理用到url-loader/file-loader
- plugin：是插件，增强了webpack自动化的能力，解决了除了资源加载之外的其他自动化功能。比如，清除目录，压缩代码，拷贝文件等。实现了大部分的前端工程化的工作。

###### 开发思路：

loader:

1. 明确处理资源的类型
1. 编写资源文件，其中，loader处理资源时，可以多次设置不同的loader来处理，最终返回一段js代码。loader的执行是数组中，从右向左执行。


```
module.exports = source => {
    const html = marked(source)
    return `export default ${JSON.stringify(html)}`
}
```

plugin:

- plugin通过钩子机制开发，通过在生命周期的钩子函数中挂载函数实现扩展。
- 必须是一个函数或者包含apply方法的对象


```
class OnePlugin{
    apply(compile) {
        compile.hooks.emit.tap('OnePlugin', cm => {
            //cm是打包上下文
            for(const name in cm.assets) {
                //name 所有的文件名
                //cm.assets[name].source()获取文件的内容
                //do sth...
                const content = cm.assets[name].source()
                cm.assets[name] = {
                    source: () => content,
                    size: () => content.length
                }
            }
        })
    }
}
```





