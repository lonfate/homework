
import { h, thunk, init } from "snabbdom"

import style from 'snabbdom/modules/style'
import eventlisteners from 'snabbdom/modules/eventlisteners'
import data from './data.js'

let patch = init([
    style,
    eventlisteners
])
let vnode = null
let count = 5
let p = data.map((item, k) => {
    item.key = k
    return item
})
let datas = JSON.parse(JSON.stringify(p))
let dataSource = datas.slice(0,count)

let keyArr = []
dataSource.map(item => {
    keyArr.push(item.key)
})
function movie() {
    return h('div', {
        style: {
            maxWidth: '500px',
            margin: '0 auto'
        }
    }, [
        h('h1', '省面积总览'),
        h('div', {
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }
        }, [
            h('div.sort', {
                style: {
                    display: 'flex',
                    alignItems: 'center'
                }
            }, [
                h('span', '排序：'),
                h('div.btns', [
                    h('a.btn', {
                        on: {
                            click: [sortFn, 1]
                        }
                    }, '正序'),
                    h('a.btn', {
                        on: {
                            click: [sortFn, 0]
                        }
                    }, '倒序')
                ]),

            ]),
            h('a.btn.add', { on: { click: add } }, 'Add')
        ]),
        h('div.list', dataSource.map((item, k) => 
            h('div.row', [
                h('span', {
                    style: {
    
                    }
                }, `${item.name}(${item.short})`),
                h('span', {
                    style: {
    
                    }
                }, `${item.num}万平方公里`),
                h('span', {
                    style: {
                        cursor: 'pointer'
                    },
                    on: {
                        click: [remove, item.key, k]
                    }
                }, `X`)
            ])
        ))

    ])
}
function sortFn(type) {
    if(type === 1) {
        dataSource = dataSource.sort((a,b) => b.num - a.num)
    } else {
        dataSource = dataSource.sort((a,b) => a.num - b.num)
    }
    render()
}
function add() {
    const tmp = []
    datas.map((item) => {
        if(keyArr.indexOf(item.key) < 0) {
            tmp.push(item)
        }
    })
    if(!tmp.length) return
    const t = tmp.slice(0,1)
    dataSource.unshift(t[0])
    keyArr.push(t[0].key)
    render()
}
function remove(key, k) {
    keyArr = keyArr.filter(item => item !== key)
    dataSource.splice(k, 1)
    render()
}
let app = document.querySelector('#app')

function render() {
    if(!vnode) vnode = app
    vnode = patch(vnode, movie())
}
render()
