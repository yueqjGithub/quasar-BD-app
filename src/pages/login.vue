<template>
  <q-page class="login-page">
    <div class="q-pa-lg login-logo">
      <img src="../assets/logo.png">
      <p>来者皆兄弟，共创百万军</p>
    </div>
    <div class="q-pa-xs login-form">
      <q-form ref="myForm">
        <q-input
          color="$primary"
          placeholder="用户名"
          type="tel"
          clearable
          dense
          v-model="userName"
          :rules="[
            val => !!val || '请输入手机号',
            val => val.length == 11 || '请输入11位手机号',
            val => (/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(19[0-9]{1})|(17[0-9]{1}))+\d{8})$/.test(val)) || '请输入正确的手机号'
          ]"
          lazy-rules>
          <template v-slot:prepend>
            <q-icon name="fa fa-mobile fa-2x"></q-icon>
          </template>
        </q-input>
        <q-input
          color="$primary"
          placeholder="密码"
          type="password"
          dense
          v-model="password"
          :rules="[
            val => !!val || '请输入密码',
            val => (/^[a-zA-Z0-9]{6,18}$/.test(val)) || '请输入6-18位密码'
          ]"
          lazy-rules>
          <template v-slot:prepend>
            <q-icon name="fa fa-lock fa-2x"></q-icon>
          </template>
        </q-input>
        <div class="row">
          <div class="col text-center">
            <q-btn size="md" color="primary" :loading="btnLoading" class="login-btn" @click="login">登录</q-btn>
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
// import logo from '..'
import api from 'src/api/api.js'
export default {
  name: 'login',
  data () {
    return {
      // logoSrc: logo
      userName: '',
      password: '',
      btnLoading: false// 登录按钮Loading状态控制
    }
  },
  created () {
    let tok = this.$q.localStorage.getItem('token')
    if (tok) {
      this.$router.push({ name: 'userIndex' })
    }
  },
  mounted () {
    // console.log('entry')
  },
  methods: {
    login () {
      let vm = this
      vm.btnLoading = true
      vm.$refs['myForm'].validate().then(suc => {
        if (suc) {
          let params = {
            'mobile': vm.userName,
            'password': vm.password
          }
          vm.$axios(api.login, params).then(res => {
            // vm.$q.localStorage.set('token', '11233aa')
            if (res.code === 'success') {
              vm.$q.localStorage.set('token', res.token)
              vm.$q.localStorage.set('userId', res.userid) // 存储市场人员id备用
              vm.$router.push({ name: 'userIndex' })
            } else {
              vm.$q.notify(res.msg)
            }
            vm.btnLoading = false
          }).catch(() => {
            vm.$q.notify('登录失败，请稍后再试')
            vm.btnLoading = false
          })
        } else {
          vm.btnLoading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.login-page{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.login-logo{
  text-align: center;
}
.login-form{
  width: 80%;
}
.login-btn{
  width: 80%;
}
</style>
