import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/index'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/changeinfo',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:item_id(\\d+)',
        component: (resolve) => require(['@/views/project/changeinfo/data'], resolve),
        name: 'Record',
        meta: { title: '项目变更数据', icon: '' }
      }
    ]
  },
  {
    path: '/perlevel',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/index/:item_id(\\d+)',
        component: (resolve) => require(['@/views/project/perlevel/index'], resolve),
        name: 'Perlevel',
        meta: { title: '项目人员级别配置', icon: '' }
      }
    ]
  },
  {
    path: '/assignper',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/index/:item_id(\\d+)',
        component: (resolve) => require(['@/views/project/assignper/index'], resolve),
        name: 'Assignper',
        meta: { title: '项目人员分配', icon: '' }
      }
    ]
  },
  {
    path: '/Outsourcingper',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/index',
        component: (resolve) => require(['@/views/project/Outsourcingper/index'], resolve),
        name: 'Outsourcingper',
        meta: { title: '外包人员分配', icon: '' }
      }
    ]
  },
  {
    path: '/itemcontract',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/index/:item_id(\\d+)',
        component: (resolve) => require(['@/views/project/itemcontract/index'], resolve),
        name: 'Contract',
        meta: { title: '合同基本信息', icon: '' }
      }
    ]
  },
  {
    path: '/percost',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/index/:item_id(\\d+)',
        component: (resolve) => require(['@/views/project/percost/index'], resolve),
        name: 'Percost',
        meta: { title: '项目人员成本', icon: '' }
      }
    ]
  },
  {
    path: '/budgetpercost',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/index/:item_id(\\d+)',
        component: (resolve) => require(['@/views/project/budgetpercost/index'], resolve),
        name: 'Percostbudget',
        meta: { title: '项目人员成本预估', icon: '' }
      }
    ]
  },

  {
    path: '/budgetperincome',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/index/:item_id(\\d+)',
        component: (resolve) => require(['@/views/project/budgetperincome/index'], resolve),
        name: 'PerIncomebudget',
        meta: { title: '项目人员收入预估', icon: '' }
      }
    ]
  },
  {
    path: '/perincome',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/index/:item_id(\\d+)',
        component: (resolve) => require(['@/views/project/perincome/index'], resolve),
        name: 'Perincome',
        meta: { title: '外包人员收入', icon: '' }
      }
    ]
  },
  {
    path: '/levelchangeinfo',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/index',
        component: (resolve) => require(['@/views/project/levelchangeinfo/index'], resolve),
        name: 'Message',
        meta: { title: '外包人员级别变更信息', icon: '' }
      }
    ]
  },
  {
    path: '/levelchangehisinfo',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/index',
        component: (resolve) => require(['@/views/project/levelchangehisinfo/index'], resolve),
        name: 'MessageHis',
        meta: { title: '外包人员级别变更记录', icon: '' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: (resolve) => require(['@/views/monitor/job/log'], resolve),
        name: 'JobLog',
        meta: { title: '调度日志' }
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit',
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  }
]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
