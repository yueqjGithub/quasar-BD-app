const apiList = {
  login: '/api/mkt2/service/login/login.vm',
  uploadImg: '/api/common/upload/upload.vm', // 图片上传
  getAddres: '/api/service/common/geo.vm', // 获取经纬度
  recharge: '/api/pay/order/recharge_order.vm', // 获取充值url
  // 门店
  getBankInfo: '/api/company/service/shop/get_bank.vm', // 获取银行信息
  createShop: '/api/company/service/shop/create.vm', // 创建门店
  updateShop: '/api/company/service/shop/update.vm', // 创建门店
  queryShopTypeList: '/api/company/service/shop/shop_type/list.vm', // 查询门店类型列表
  queryContract: '/api/mkt2/service/mkt_contract/get_by_type.vm', // 拉取电子合同内容
  resetShopPWD: '/api/common/login/change_password.vm', // 修改门店密码
  queryCouponList: '/api/company/service/coupon/list.vm', // 拉取优惠券列表
  queryCouponShop: '/api/service/shop/get_coupon_shop.vm', // 拉取优惠券门店
  saveCreateCoupon: '/api/company/service/coupon/create.vm', // 创建优惠券
  saveUpdateCoupon: '/api/company/service/coupon/update.vm', // 编辑优惠券
  // 菜品管理
  queryMyProduct: '/api/mkt2/product/product/list.vm', // 查询菜品列表
  queryTags: '/api/mkt2/product/tags/list.vm', // 查询菜品标签
  getShops: '/api/b/shop/list.vm', // 获取发放门店
  queryProductTypeList: '/api/mkt2/product/product/get_product_type.vm', // 菜品类型
  editProduct: '/api/mkt2/product/product/update.vm', // 修改菜品
  createProduct: '/api/mkt2/product/product/create.vm', // 创建菜品
  // 首页
  selectDayFromCompany: '/api/mkt2/service/mkt_clue/select_company_shop_num.vm', // 首页统计信息
  getSituation: '/api/mkt2/service/mtk_sale_performance/situation.vm', // 首页销售业绩
  // 商户管理
  queryCompanyList: '/api/mkt2/service/company/list.vm', // 拉取商户列表
  createCompany: '/api/mkt2/service/company/create.vm', // 创建商户
  updateCompany: '/api/mkt2/service/company/update_company.vm', // 更新商户
  queryCommisionRule: '/api/mkt2/service/commission_rules/list.vm', // 拉取佣金规则
  closeCompany: '/api/mkt2/service/mkt_close_down_info/create.vm', // 停业商家
  queryAudit: '/api/mkt2/service/mkt_audit_person/select_audit.vm', // 联系审核员
  queryShopListByCompanyId: '/api/company/service/shop/list.vm', // 根据商家id查询门店
  // 线索
  createClues: '/api/mkt2/service/mkt_clue/create.vm', // 新建线索
  updateClues: '/api/mkt2/service/mkt_clue_public/update.vm', // 更新线索
  giveUpClues: '/api/mkt2/service/mkt_private_giveup/create.vm', // 男人不说放弃
  queryVisiter: '/api/mkt2/service/mkt_clues_log/get_visit_person.vm', // 拉取拜访对象
  createVister: '/api/mkt2/service/mkt_visit_log/create_accest_object.vm', // 创建拜访对象
  addLogs: '/api/mkt2/service/mkt_clues_log/insert_or_update_clue.vm', // 新增日志
  queryAllClues: '/api/mkt2/service/mkt_clue_public/list.vm', // 拉取公海
  holdInMine: '/api/mkt2/service/mkt_clue/update.vm', // 跟进公海线索
  queryPersonalClues: '/api/mkt2/service/mkt_private_clue/list.vm', // 拉取私海
  queryLogOfPersonalClues: '/api/mkt2/service/mkt_clues_log/select_all_visit.vm', // 根据线索id和token认证用户获取当前线索日志
  sendContract: '/api/mkt2/service/mkt_contract/send_sms.vm', // 发送电子合同
  cancelOrder: '/api/pay/order/close_order.vm' // 关闭充值订单
}

export default apiList
