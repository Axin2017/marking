import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/marking',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/Marking/index'),
        name: 'Marking',
        meta: { title: '评分列表', icon: 'list' }
      },
      {
        path: 'markingDetail/:id',
        name: 'MarkingDetail',
        hidden: true,
        props: true,
        meta: { title: '评分详细' },
        component: () => import('@/views/Marking/markingDetail')
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/markingManage',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '评分管理',
      icon: 'marking',
      roles: ['admin']
    },
    children: [
      {
        path: 'modify',
        component: () => import('@/views/manage/marking/modifyMarking'),
        name: 'ModifyMarking',
        meta: { title: '编辑评分', icon: 'edit', roles: ['admin'] }
      },
      {
        path: 'add',
        component: () => import('@/views/manage/marking/addMarking'),
        name: 'AddMarking',
        meta: { title: '添加评分', icon: 'add', noCache: false, roles: ['admin'] }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/manage/marking/editMarking'),
        name: 'EditMarking',
        hidden: true,
        props: true,
        meta: { title: '编辑评分内容', icon: 'edit', noCache: false, roles: ['admin'] }
      }
    ]
  },
  {
    path: '/standerdManage',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '评分标准管理',
      icon: 'standerd',
      roles: ['admin']
    },
    children: [
      {
        path: 'modify',
        component: () => import('@/views/manage/standerd/modifyStanderd'),
        name: 'ModifyStanderd',
        meta: { title: '编辑标准', icon: 'edit', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/userManage',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '用户管理',
      icon: 'user',
      roles: ['admin']
    },
    children: [
      {
        path: 'modify',
        component: () => import('@/views/manage/user/modifyUser'),
        name: 'ModifyUser',
        meta: { title: '编辑用户', icon: 'edit', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/orgManage',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '组织管理',
      icon: 'org',
      roles: ['admin']
    },
    children: [
      {
        path: 'modify',
        component: () => import('@/views/manage/organization/modifyOrg'),
        name: 'ModifyOrg',
        meta: { title: '编辑组织', icon: 'edit', roles: ['admin'] }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
