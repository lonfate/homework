class Watcher{
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb
        //记录当前对象
        Dep.target = this
        this.oldValue = vm[key]
        Dep.target = null
    }
    update() {
        let newVal = this.vm[this.key]
        if(this.oldValue === newVal) {
            return
        }
        this.cb(newVal)
    }
    
}