let _Vue = null
export default class VueRouter{
    static install(Vue) {
        //判断插件是否被安装
        // 把Vue构造函数记录到全局变量
        //把创建的Vue实例的时候，传入的router对象，注入到vue实例上

        if(VueRouter.install.installed) {
            return 
        }
        VueRouter.install.installed = true
        _Vue = Vue
        _Vue.mixin({
            beforeCreate() {
                if(this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                    this.$options.router.init()
                }
            }
        })
    }
    constructor(options) {
        this.options = options
        this.routeMap = {}
        this.data = _Vue.observable({
            current: '/'
        })
    }
    init() {
        this.createRouteMap()
        this.initComponents(_Vue)
        this.initEvent()
    }
    createRouteMap() {
        //遍历路由规则，把路由解析成键值对的形式
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        })
    }
    initComponents(Vue) {
        Vue.component('router-link', {
            props: {
                to: String
            },
            render(h) {
                return h('a', {
                    attrs: {
                        href: this.to
                    },
                    on: {
                        click: this.clickHandler
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandler(e) {
                    history.pushState({}, '', this.to)
                    this.$router.data.current = this.to
                    e.preventDefault()
                }
            }
            // template: '<a :href="to"><slot></slot></a>'
        })
        const self = this
        Vue.component('router-view', {
            render(h) {
                const component = self.routeMap[self.data.current]
                return h(component)
            }
        })
    }
    initEvent() {
        window.addEventListener('popstate', () => {
            this.data.current = window.location.pathname
        })
    }
}