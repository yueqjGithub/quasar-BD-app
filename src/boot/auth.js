import { LocalStorage, Dialog } from 'quasar'

export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    if (to.name === 'login') { // 登录页直接next
      return next()
    } else { // 判断是否有token，有则进入，没有则返回登录页
      let tok = LocalStorage.getItem('token')
      if (tok) {
        return next()
      } else {
        Dialog.create({
          title: '请登录',
          message: '请您先登录',
          cancel: false,
          persistent: true,
          ok: { 'label': '确定', 'flat': true }
        }).onOk(() => {
          return next({ name: 'login' })
        })
      }
    }
  })
}
