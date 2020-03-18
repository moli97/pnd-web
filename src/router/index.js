import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

let router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login'),
      props: true,
      meta: {title: '登录'}
    },
    {
      path: '',
      redirect: '/folder/0',
      component: () => import('@/views/layout/Layout'),
      children: [
        {
          path: 'folder/:folderId',
          component: () => import('@/views/file'),
          props: true,
          meta: {title: '文件列表'}
        },
        {
          path: '/system',
          component: () => import('@/views/system'),
          meta: {title: '系统信息'}
        },
        {
          path: '/video/:fileId',
          component: () => import('@/views/video'),
          props: true,
          meta: {title: '播放视频'}
        },
      ]
    },
    {path: '*', component: () => import('@/views/404')}
  ]
})

router.beforeEach((to, _, next) => {
  /*路由发生改变修改页面的title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (localStorage.getItem("accessToken") && to.name == "login"){
    next({
      path: ''
    });
  }else if (!localStorage.getItem("accessToken") && to.name != "login") {
    next({
      name: 'login'
    })
  }else {
    next({})
  }
})

export default router
