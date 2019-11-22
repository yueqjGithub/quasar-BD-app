
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '/login', alias: ['/'], name: 'login', component: () => import('pages/login.vue') }
    ]
  },
  {
    path: '/index',
    component: () => import('layouts/userLayout.vue'),
    children: [
      { path: 'user', name: 'userIndex', component: () => import('pages/index/user.vue') }
    ]
  },
  {
    path: '/customer', // 商户管理
    component: () => import('layouts/customerLayout.vue'),
    children: [
      { path: 'auditsuc', alias: [''], name: 'AlreadyAudit', component: () => import('pages/customer/AuditSuc.vue') }, // 已审核
      { path: 'notaudit', name: 'WaitAudit', component: () => import('pages/customer/WaitAudit.vue') }, // 待审核
      { path: 'auditfalse', name: 'AuditFalse', component: () => import('pages/customer/AuditFalse.vue') }, // 未通过
      { path: 'auditdraft', name: 'AuditDraft', component: () => import('pages/customer/AuditDraft.vue') } // 未通过
    ]
  },
  {
    path: '/clue', // 线索管理
    component: () => import('layouts/cluesLayout.vue'),
    children: [
      { path: 'personalclues', alias: [''], name: 'PersonalClues', component: () => import('pages/clues/personalClues.vue') }, // 私海
      { path: 'allclues', name: 'AllClues', component: () => import('pages/clues/allClues.vue') } // 公海
    ]
  },
  {
    path: '/application', // 应用（无底部）
    component: () => import('layouts/applicationLayout.vue'),
    children: [
      { path: 'createcustomer', name: 'CreateCustomer', component: () => import('pages/application/CreateCustomer') }, // 创建商户
      { path: 'applist', name: 'AppList', component: () => import('pages/companyManage/appList') }, // 应用列表
      { path: 'companydetail', name: 'CompanyDetail', component: () => import('pages/customer/detail') }, // 商户详情
      { path: 'storelist', name: 'StoreList', component: () => import('pages/companyManage/StoresList') }, // 门店列表
      { path: 'storeinfo', name: 'StoreInfo', component: () => import('pages/companyManage/StoreInfo') }, // 门店详情
      { path: 'resetpwd', name: 'ResetPassword', component: () => import('pages/application/ResetPassword') }, // 重置门店密码
      { path: 'couponlist', name: 'CouponList', component: () => import('pages/companyManage/Coupon') }, // 优惠券列表
      { path: 'createcoupon', name: 'CreateCoupon', component: () => import('pages/companyManage/CreateCoupon') }, // 编辑优惠券
      { path: 'editcoupon', name: 'EditCoupon', component: () => import('pages/companyManage/EditCoupon') }, // 修改优惠券
      { path: 'cluesinfo', name: 'CluesInfo', component: () => import('pages/clues/cluesInfo') }, // 线索详情
      { path: 'addlogs', name: 'AddLogs', component: () => import('pages/clues/addLogs') }, // 添加日志
      { path: 'visiter', name: 'Visiter', component: () => import('pages/clues/Visiter') }, // 拜访对象
      { path: 'fmap', name: 'Fmap', component: () => import('pages/application/fightMap') } // 作战地图

    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
