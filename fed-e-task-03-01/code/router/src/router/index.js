import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter from './hashRouter'
import Login from '../components/login.vue'
import Detail from '../components/detail.vue'
import Index from '../components/index.vue'
Vue.use(VueRouter)
const routes = [
    {
        path: '/login',
        component: Login
    },
    {
        path: '/detail',
        component: Detail
    },
    {
        path: '/',
        component: Index
    }
]
const router = new VueRouter({
    routes 
  })
export default router