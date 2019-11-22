<template>
  <q-page>
    <q-header class="header-fix text-white bg-primary">
      <q-toolbar  dense>
        <q-btn icon="keyboard_arrow_left" flat dense round @click="goBack()"></q-btn>
        <q-toolbar-title class="text-center">选择拜访对象</q-toolbar-title>
        <q-btn flat dense @click="insetVisiter">新建对象</q-btn>
      </q-toolbar>
    </q-header>
    <div class="q-pa-sm">
      <ul v-if="visiterList.length > 0">
        <li v-for="k in visiterList" :key="k.index" class="visiter-item" :class="k.visit_person_mobile === curVisiter ? 'visiter-checked' : ''">
          <q-radio v-model="curVisiter" :val="k.visit_person_mobile" :label="`${k.visit_person}  ${k.visit_person_mobile}`" :style="{'width': '100%'}"></q-radio>
        </li>
      </ul>
      <p class="text-center">当前线索暂未添加拜访对象</p>
    </div>
    <div class="custom-btn-group q-pa-md">
      <q-btn class="full-width" color="primary" @click="subVisiter">确定</q-btn>
    </div>
    <!-------------------新建对象-------------------------->
    <q-dialog
      v-model="drawer"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card-section>
          <q-form ref="visitForm">
            <div class="custom-form-item">
              <div class="custom-form-label">
                姓名：
              </div>
              <div>
                <q-input
                  dense
                  :items-aligned="true"
                  :no-error-icon="true"
                  :hide-bottom-space="true"
                  outlined
                  v-model="visiterInfo.head_person"
                  placeholder="请输入拜访对象姓名"
                  :rules="[
                  val => !!val || ''
                ]"
                ></q-input>
              </div>
            </div>
            <div class="custom-form-item">
              <div class="custom-form-label">
                手机：
              </div>
              <div>
                <q-input
                  dense
                  :items-aligned="true"
                  :no-error-icon="true"
                  :hide-bottom-space="true"
                  outlined
                  v-model="visiterInfo.head_person_mobile"
                  placeholder="请输拜访对象联系方式"
                  :rules="[
                  val => !!val || ''
                ]"
                ></q-input>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-separator />
        <div class="custom-btn-group q-pa-sm">
          <q-btn color="primary" style="margin-right: .3rem" v-close-popup>取消</q-btn>
          <q-btn color="primary" @click="saveVisiter">确认</q-btn>
        </div>
      </q-card>
    </q-dialog>
    <!-------------------新建对象-------------------------->
  </q-page>
</template>

<script>
import urls from 'src/api/api'
export default {
  name: 'Visiter',
  data () {
    return {
      drawer: false,
      saveInfo: {},
      curVisiter: undefined, // 当前选择的拜访对象
      visiterList: [
        /* eslint-disable */
        // {
        //   "visit_person": "张总",
        //   "visit_person_mobile": "15228638462"
        // },
        // {
        //   "visit_person": "张经理",
        //   "visit_person_mobile": "13546138292"
        // },
        // {
        //   "visit_person": "张老板",
        //   "visit_person_mobile": "15228638110"
        // },
        // {
        //   "visit_person": "王总",
        //   "visit_person_mobile": "15228638466"
        // }
        /* eslint-disable */
      ],
      visiterInfo: {
        bind_clue_id: '', // 线索ID
        head_person: '', // 负责人名
        head_person_mobile: ''
      }
    }
  },
  created () {
    let vm = this
    let obj = this.$route.params.obj
    Object.assign(vm.saveInfo, obj)
    // console.log(vm.saveInfo)
    vm.visiterInfo['bind_clue_id'] = obj.clueid
    vm.queryInfo()
  },
  methods: {
    subVisiter () { // 返回拜访对象
      let vm = this
      vm.saveInfo['visit_person'] = vm.visiterList.find(item => item.visit_person_mobile === vm.curVisiter).visit_person
      vm.saveInfo['visit_person_mobile'] = vm.curVisiter
      vm.$router.push({ name: 'AddLogs', params: { type: 2, obj: this.saveInfo } })
    },
    queryInfo () {
      let vm = this
      let params = {
        'clueid': vm.saveInfo.clueid
      }
      // alert(params)
      vm.$axios(urls.queryVisiter, params).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.visiterList = [...res.list]
          // vm.visiterList.push(res.list)
        } else {
          vm.$q.notify(res.msg)
        }
      }, err => {
        vm.$q.notify(JSON.stringify(err))
      })
    },
    goBack () {
      this.$router.push({ name: 'AddLogs', params: { type: 2, obj: this.saveInfo } })
    },
    insetVisiter () {
      this.drawer = true
    },
    saveVisiter () {
      let vm = this
      vm.$refs['visitForm'].validate().then(suc => {
        if (suc) {
          let params = {
            clueid: vm.visiterInfo.bind_clue_id, // 线索ID
            visit_person: vm.visiterInfo.head_person, // 负责人名
            visit_person_mobile: vm.visiterInfo.head_person_mobile
          }
          vm.$axios(urls.createVister, params).then(res => {
            let code = res.code
            if (code === 'success') {
              vm.$q.notify('添加成功')
              vm.queryInfo()
              vm.drawer = false
            } else {
              vm.$q.notify(res.msg)
            }
          }, err => {
            vm.$q.notify(JSON.stringify(err))
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .cluse-btn-group{
    width: 100%;
    border-top: 1px solid #e0e0e0;
    display: flex;
  }
  .cluse-btn{
    width: 50%;
    text-align: center;
  }
  .clues-btn-border-left{
    border-left: 1px solid #e0e0e0;
  }
.custom-form-item{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: .3rem;
}
.custom-form-label{
  width: 3rem;
  margin-right: .4rem;
}
.visiter-item{
  border: 1px solid #e0e0e0;
  margin-bottom: .4rem;
  transition: all linear 0.5s;
}
.visiter-checked{
  background: rgba(0,155,255,0.7);
  color: #ffffff;
}
</style>
