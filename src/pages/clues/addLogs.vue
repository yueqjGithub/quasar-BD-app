<template>
  <q-page>
    <q-header class="header-fix text-white bg-primary">
      <q-toolbar  dense>
        <q-btn icon="keyboard_arrow_left" flat dense round @click="goBack()"></q-btn>
        <q-toolbar-title class="text-center">添加日志</q-toolbar-title>
        <span class="custom-tit-position"></span>
      </q-toolbar>
    </q-header>
    <q-card class="q-ma-sm">
      <q-card-section>
        <div class="visit-div">
          <div class="visit-left">
            <span>拜访对象：{{form.visit_person}}</span>
            <span>联系方式：{{form.visit_person_mobile}}</span>
          </div>
          <div class="visit-right">
            <q-btn flat size="sm" icon-right="fa fa-angle-right" label="选择拜访对象" @click="toVisiter"></q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card class="q-ma-sm">
      <q-card-section>
        <p>备注：</p>
        <q-input
          outlined
          autogrow
          :items-aligned="true"
          :no-error-icon="true"
          :hide-bottom-space="true"
          v-model="form.visit_content"
        ></q-input>
      </q-card-section>
    </q-card>
    <div class="q-ma-sm">
      <q-btn class="full-width" color="primary" @click="saveLog">保存</q-btn>
    </div>
  </q-page>
</template>

<script>
import urls from 'src/api/api'
export default {
  name: 'addLogs',
  data () {
    return {
      saveInfo: {},
      form: {
        visit_content: '', // 内容
        visit_person: '', // 拜访对象
        visit_person_mobile: '', // 拜访对象电话
        clueid: '' // 线索id
      }
    }
  },
  created () {
    let vm = this
    let type = vm.$route.params.type
    // console.log(type)
    if (type && type === 2) { // 从拜访对象跳转回来，将存储重新赋值
      Object.assign(vm.form, vm.$route.params.obj)
    } else {
      let id = vm.$route.params.id
      vm.form.clueid = id
    }
  },
  methods: {
    toVisiter () { // 跳转至拜访对象页面
      this.$router.push({ name: 'Visiter', params: { obj: this.form } })
    },
    goBack () {
      this.$router.push({ name: 'PersonalClues' })
    },
    saveLog () {
      let vm = this
      if (!vm.form.visit_person || !vm.form.visit_person_mobile) {
        vm.$q.notify('请选择有效拜访对象')
        return false
      }
      let params = {
        visit_content: vm.form.visit_content, // 内容
        visit_person: vm.form.visit_person, // 拜访对象
        visit_person_mobile: vm.form.visit_person_mobile, // 拜访对象电话
        clueid: vm.form.clueid // 线索id
      }
      vm.$axios(urls.addLogs, params).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.$q.notify('添加日志成功')
          setTimeout(() => {
            vm.$router.push({ name: 'PersonalClues' })
          }, 1500)
        } else {
          vm.$q.notify(res.msg)
        }
      }, err => {
        vm.$q.notify(JSON.stringify(err))
      })
    }
  }
}
</script>

<style scoped>
.visit-div{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.visit-left{
  width: 61%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
</style>
