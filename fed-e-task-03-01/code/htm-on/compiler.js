
class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.html = null
        this.index = 0
        this.compiler(this.el)
    }
    compiler(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compilerText(node)
            }
            if (this.isElementNode(node)) {
                this.compilerElement(node)
            }
            if (node.childNodes && node.childNodes.length) {
                this.compiler(node)
            }
        })
    }
    //元素节点
    compilerElement(node) {
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                attrName = attrName.substr(2)
                if (attrName.indexOf(':') >= 0) {
                    this.onUpdater(node, attrName, attr.value)
                } else {
                    let key = attr.value
                    this.update(node, key, attrName)
                }

            }
        })
    }
    update(node, key, attrName) {
        let updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, key, this.vm[key])
    }
    //v-on
    onUpdater(node, attrName, value) {
        attrName = attrName.substr(3)
        const fn = this.vm.$options.methods[value]
        node.addEventListener(attrName, fn)
    }
    textUpdater(node, key, value) {
        node.textContent = value
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }
    // >>>作业  v-html，
    htmlUpdater(node, key, value) {
        //解析成为html，并且样式等
        const _this = this
        let textEnd = value.indexOf('<')
        if (textEnd === 0) {
            _this.dealHtml(value, node)
            new Watcher(_this.vm, key, (newValue) => {
                const child = node.childNodes[0]
                node.removeChild(child)
                _this.dealHtml(newValue, node)
            })
        }
        else {
            //如果不是尖括号开头，那么就当做字符串处理
            _this.textUpdater(node, key, value)
        }
    }
    dealHtml(value, node) {
        //获取标签->获取属性
        const res = this.parse(value)
        //渲染成真实的dom并插入
        const dom = this.appendDom(res)
        node.appendChild(dom)
    }
    appendDom(data) {
        let p = data
        let _this = this
        let els = null
        const tagName = p.tagName
        const text = p.text
        let attrs = []
        p.attrs.map(v => {
            attrs.push({
                name: v[1],
                value: v[3]
            })
        })
        els = _this.deal(tagName, attrs, text)
        if (p.children) {
            p.children.map(v => {
                const tmp = _this.appendDom(v)

                els.appendChild(tmp)
            })
        }
        return els
    }
    deal(tagName, attrs, text) {
        const el = document.createElement(tagName)
        attrs.map(v => {
            el.setAttribute(v.name, v.value)
        })
        el.innerHTML = text
        return el
    }
    //解析html字符串
    parse(html) {
        const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
        const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
        const qnameCapture = `((?:${ncname}\\:)?${ncname})`
        const startTagOpen = new RegExp(`^<${qnameCapture}`)
        const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
        const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
        const startTagClose = /^\s*(\/?)>/
        const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
        const comment = /^<!\--/
        const conditionalComment = /^<!\[/
        this.html = html
        let stack = []
        let text, rest, next
        while (this.html) {
            let match = {
                tagName: null,
                attrs: [],
                start: this.index,
                text: ''
            }
            const endTagMatch = this.html.match(endTag)
            if (endTagMatch) {
                stack.push({ isEnd: true })
                this.advance(endTagMatch[0].length)
                continue
            }
            let textEnd = this.html.indexOf('<')
            if (textEnd === 0) {
                const start = this.html.match(startTagOpen)
                if (start) {
                    match = {
                        tagName: start[1],
                        attrs: [],
                        start: this.index
                    }
                    this.advance(start[0].length)
                    let end, attr
                    while (!(end = this.html.match(startTagClose)) && (attr = this.html.match(dynamicArgAttribute) || this.html.match(attribute))) {
                        attr.start = this.index
                        this.advance(attr[0].length)
                        attr.end = this.index
                        match.attrs.push(attr)
                    }

                    if (end) {
                        match.unarySlash = end[1]
                        this.advance(end[0].length)
                        match.end = this.index
                    }
                }

            }
            if (textEnd >= 0) {
                rest = this.html.slice(textEnd)
                while (
                    !endTag.test(rest) &&
                    !startTagOpen.test(rest) &&
                    !comment.test(rest) &&
                    !conditionalComment.test(rest)
                ) {
                    next = rest.indexOf('<', 1)
                    if (next < 0) break
                    textEnd += next
                    rest = this.html.slice(textEnd)
                }
                text = this.html.substring(0, textEnd)
                match.text = text
                this.advance(text.length)
            }
            stack.push(match)
            if (textEnd < 0) {
                this.html = ''
            }

        }
        let j = 0
        for (let i = 1; i < stack.length && i >= 0; i++) {
            if (stack[i].isEnd) {
                j++
                stack.splice(i, 1)
                i--
            } else {
                if (j === 0) {
                    stack[i - 1].children = []
                    stack[i - 1].children.push(stack[i])
                }
                else {
                    if (i - j >= 0) {
                        stack[i - j - 1].children.push(stack[i])
                        j = 0
                    }
                }
            }
        }
        return stack[0]
    }
    advance(n) {
        this.index += n
        this.html = this.html.substring(n)
    }

    //v-model
    modelUpdater(node, key, value) {
        node.value = value
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })
        //双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }
    //文本节点
    compilerText(node) {
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }
    }
    //判断指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
    isTextNode(node) {
        return node.nodeType === 3
    }
    isElementNode(node) {
        return node.nodeType === 1
    }
}