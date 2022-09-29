import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/views/layout'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'user-info',
        component: () => import('@/views/user/userinfo')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/user/userAvatar')
      },
      {
        path: 'user-pwd',
        component: () => import('@/views/user/userPwd')
      },
      {
        path: 'art-cate',
        component: () => import('@/views/article/artCate')
      },
      {
        path: 'art-list',
        component: () => import('@/views/article/artList')
      }
    ]
  },
  {
    path: '/reg',
    component: () => import('@/views/register')
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }
]

const router = new VueRouter({
  routes
})
// 全局前置路由守卫
// 浏览器第一次打开项目页面，会触发一次全局前置路由守卫
// 判断登录与否 有token则是登录(因为登录后会把token值存储在localstorage) 无token则未登录
// next() 如果前置切换路由地址 会再次走路由守卫再次去匹配路由规则
router.beforeEach((to, from, next) => {
  const token = store.state.token
  // 无需验证token的页面 白名单
  const whiteList = ['/login', '/reg']
  if (token) {
    if (!store.state.userinfo.username) {
      // 有 token 并且本地没有 username 值才去获取用户信息
      store.dispatch('getUserInfoActions')
    }
    // 路由放行
    next()
  } else {
    // 没有 token 但是 to.path 是白名单里面的路由就放行
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 没有 token 访问路径也不是白名单里面的路由 则强制跳转到
      next('/login')
    }
  }
})

export default router
