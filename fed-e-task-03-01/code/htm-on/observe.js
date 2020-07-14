class Observer {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        if(!data || typeof data !== 'object') {
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    defineReactive(obj, key, val) {
        let dep = new Dep()
        this.walk(val)
        const _this = this
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                if(Dep.target) {
                    dep.addSub(Dep.target)
                }
                return val
            },
            set(newVal) {
                console.log('setting')
                if(newVal === obj[key]) {
                    return
                }
                val = newVal
                _this.walk(newVal)
                dep.notify()
                
            }
        })
    }
}