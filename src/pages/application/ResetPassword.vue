<template>
  <q-page>
    <q-header class="bg-primary text-white  header-fix">
      <q-toolbar>
<!--        <q-btn flat round dense class="text-white" v-go-back="'/application/storelist'" icon="keyboard_arrow_left"-->
<!--               v-if="showOld"/>-->
        <q-btn flat round dense class="text-white" @click="backToStoreInfo" icon="keyboard_arrow_left"
               v-if="!showOld"/>
        <q-toolbar-title class="text-center text-white">重置密码</q-toolbar-title>
        <span class="tit-right-place"></span>
      </q-toolbar>
    </q-header>
    <div class="q-pa-md">
      <q-form ref="myForm">
        <q-input color="green"
                 placeholder="旧密码"
                 ref="input"
                 v-if="showOld"
                 v-model.trim="form.oldPWD"
                 :rules="[
              val => !!val || '请输入旧密码',
           ]"
                 lazy-rules
        >
        </q-input>
        <q-input color="green"
                 placeholder="新密码"
                 ref="input"
                 v-model.trim="form.newPWD"
                 :rules="[
              val => !!val || '请输入新密码',
           ]"
                 lazy-rules
        >
        </q-input>
        <q-input color="green"
                 placeholder="确认新密码"
                 ref="input"
                 v-model.trim='form.cPWD'
                 :rules="[
                    val => !!val || '请再次输入新密码',
                    val => val === form.newPWD || '与新密码输入不一致'
                  ]"
                 lazy-rules
        >
        </q-input>
      </q-form>
      <div class="custom-form-btn">
        <q-btn color="primary" @click="submit" :loading="loadingBtn" class="full-width">确定</q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
// import {resetShopPWD, resetBusPWD} from 'src/api/store'
// import {vm.$q.notify} from "../../utils/popups";
import urls from 'src/api/api'
export default {
  name: 'ResetPassword',
  data () {
    return {
      loadingBtn: false,
      showOld: true,
      shopId: '',
      form: {
        oldPWD: '',
        newPWD: '',
        cPWD: ''
      },
      saveInfo: {}
    }
  },
  created () {
    let vm = this
    let type = this.$route.params.type
    if (type === 2) {
      this.showOld = false
      this.shopId = this.$route.params.id.admin_userid
      Object.assign(vm.saveInfo, this.$route.params.id)
    }
  },
  methods: {
    backToStoreInfo () {
      // console.log(this.saveInfo)
      this.$router.push({ name: 'StoreInfo', params: { type: 2, shop: this.saveInfo } })
    },
    submit () {
      let vm = this
      this.$refs['myForm'].validate().then(suc => {
        if (suc) {
          vm.loadingBtn = true
          let params = {
            password: vm.form.newPWD
          }
          params['userid'] = vm.shopId
          vm.$axios(urls.resetShopPWD, params).then(res => {
            if (res.code === 'success') {
              vm.$q.notify(res.msg)
              vm.$router.push({ name: 'StoresList' })
            } else {
              vm.$q.notify(res.msg)
            }
            vm.loadingBtn = false
          }, err => {
            vm.$q.notify(JSON.stringify(err))
            vm.loadingBtn = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
