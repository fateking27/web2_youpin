// 模块化
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由模块的创建和路由配置
const router = new VueRouter({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        needAuth: false,
        title: '用户登陆'
      }
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('@/views/home/index.vue'),
      meta: {
        needAuth: true,
        title: '后台首页'
      }
    }
  ]
})

// 导出
export default router
