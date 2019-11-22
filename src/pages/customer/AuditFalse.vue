<template>
  <q-page class="q-pa-sm">
    <div class="custom-card q-pa-sm" v-for="k in dataList" :key="k.name">
      <div class="custom-card-list" @click="seeDetail(k)">
        <span class="font-sm">{{k.company_name}}</span>
        <span class="font-xs text-black" v-if="k.check_status === 0">草稿</span>
        <span class="font-xs text-warning" v-if="k.check_status === 1">待审核</span>
        <span class="font-xs text-negative" v-if="k.check_status === 2">未通过</span>
        <span class="font-xs text-primary" v-if="k.check_status === 3">已审核</span>
      </div>
      <div class="custom-card-list">
        <span class="font-xs text-black">商户负责人：{{k.legal_person}}</span>
        <span class="font-xs text-black">电话：{{k.mobile}}</span>
      </div>
      <div class="custom-card-list">
        <span class="font-xs text-black">地址：{{k.company_address}}</span>
        <span class="font-xs text-black">提交审核日期：{{k.commit_audit_time ? k.commit_audit_time.substr(0, 10) : ''}}</span>
      </div>
      <div class="custom-card-list">
        <span class="font-xs text-black">审核意见：{{k.audit_opinion}}</span>
      </div>
      <div class="custom-btn-group">
<!--        <q-btn color="primary" size="xs" class="custom-btn-group-item">充值</q-btn>-->
        <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="editCompany(k, 2)">修改详情</q-btn>
        <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="getAuditer">联系审核员</q-btn>
      </div>
    </div>
    <!------------------------审核员dialog---------------------------->
    <q-dialog v-model="showAudit">
      <q-card class="custom-width">
        <q-toolbar>
          <q-toolbar-title class="font-sm">审核员</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section v-for="k in auditList" :key="k.index" class="custom-section">
          <span>{{k.audit_person_name}}</span>
          <span>
            <a :href="'tel:' + k.audit_person_mobile">{{k.audit_person_mobile}}</a>
          </span>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!------------------------审核员dialog---------------------------->
  </q-page>
</template>

<script>
import urls from 'src/api/api'
export default {
  name: 'AuditFalse',
  data () {
    return {
      showAudit: false,
      auditList: [],
      showDialog: false,
      stopForm: {
        imgUrl: '',
        remark: ''
      },
      dataList: []
    }
  },
  created () {
    let vm = this
    let params = {
      'check_status': 2
    }
    vm.$axios(urls.queryCompanyList, params).then(res => {
      let code = res.code
      if (code === 'success') {
        vm.dataList = [...res.list]
      } else {
        vm.$q.notify(res.msg)
      }
    }, err => {
      vm.$q.notify(JSON.stringify(err))
    })
  },
  methods: {
    seeDetail (obj) { // 查看详情
      this.$router.push({ name: 'CompanyDetail', params: { obj: obj } })
    },
    getAuditer () {
      let vm = this
      vm.$axios(urls.queryAudit, null).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.auditList = [...res.list]
          vm.showAudit = true
        } else {
          vm.$q.notify(res.msg)
        }
      }, () => {
        vm.$q.notify('获取审核员信息失败，请稍后重试')
      })
    },
    editCompany (obj, type) { // 修改商户
      this.$router.push({ name: 'CreateCustomer', params: { obj: obj, type: type } })
    },
    stopShop () {
      this.showDialog = true
    }
  }
}
</script>

<style scoped>
  .custom-width{
    width: 70vw;
  }
  .custom-card-list{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .custom-card-list span{
    max-width: 48%;
  }
  .custom-card-list + .custom-card-list {
    margin-top: .25rem;
  }
  .custom-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .custom-btn-group{
    padding-top: .5rem;
    border-top: 1px solid #e0e0e0;
  }
  .stop-form-item{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .stop-form-item + .stop-form-item {
    margin-top: .5rem;
  }
  .stop-form-label{
    width: 4rem;
    margin-right: 1rem;
    text-align: right;
  }
  .stop-form-content{
    width: calc(100vmin - 8rem);
  }
</style>
