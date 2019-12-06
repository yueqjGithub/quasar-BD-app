<template>
  <q-page class="bg-white">
    <q-header class="header-fix text-white bg-primary">
      <q-toolbar  dense>
        <q-btn icon="keyboard_arrow_left" flat dense round @click="goBack()"></q-btn>
        <q-toolbar-title class="text-center">客户详情</q-toolbar-title>
        <span class="custom-tit-position"></span>
      </q-toolbar>
    </q-header>
    <div class="q-pa-sm">
      <div class="custom-list-no-border custom-flex-start">
        商家名称：{{mode.company_name}}
      </div>
      <div class="custom-list-no-border custom-flex-start">
        法人姓名：{{mode.legal_person}}
      </div>
      <div class="custom-list-no-border custom-flex-start">
        法人身份证号：{{mode.idcard_no}}
      </div>
      <div class="custom-list-no-border custom-flex-start">
        联系方式：{{mode.mobile}}
      </div>
      <div class="custom-list-no-border custom-flex-start">
        佣金规则：{{commissionRule.find(item => item.value === mode.commission) ? commissionRule.find(item => item.value === mode.commission).label : '未设置'}}
      </div>
      <div class="custom-list-no-border custom-flex-start">
        充值金额：{{mode.deposit || 0}}元
      </div>
      <p class="custom-tit-along-line">法人身份证</p>
      <div class="custom-list-border-bottom custom-flex-between">
        <img class="custom-img" :src="`https://${mode.idcard_photo_1}`" alt="" v-if="mode.idcard_photo_1 !== ''">
        <div class="custom-img text-center bg-negative text-white" v-else>未上传</div>
        <img class="custom-img" :src="`https://${mode.idcard_photo_2}`" alt="" v-if="mode.idcard_photo_2 !== ''">
        <div v-else class="custom-img text-center bg-negative text-white">未上传</div>
      </div>
      <p class="custom-tit-along-line">营业执照</p>
      <div class="custom-list-border-bottom custom-flex-between">
        <img :src="`https://${mode.business_license}`" alt="" v-if="mode.business_license !== ''" class="custom-img">
        <div v-else class="custom-img text-center bg-negative text-white">未上传</div>
      </div>
      <p class="custom-tit-along-line">电子合同签名
      <div class="custom-list-border-bottom custom-flex-between">
<!--        <q-img-->
<!--          :src="mode.e_contract_address"-->
<!--          style="height: 180px; max-width: 90vw"-->
<!--          spinner-color="primary"-->
<!--        >-->
<!--          <template v-slot:error>-->
<!--            <div class="absolute-full flex flex-center bg-negative text-white">-->
<!--              加载失败-->
<!--            </div>-->
<!--          </template>-->
<!--        </q-img>-->
        <img :src="`https://${mode.e_contract_address}`" alt="" v-if="mode.e_contract_address !== ''" class="custom-img">
        <div v-else class="custom-img text-center bg-negative text-white">未上传</div>
      </div>
    </div>
<!--    <div>-->
<!--      <img :src="`https://${mode.idcard_photo_1}`" alt="" style="width: 150px;height: 150px;">-->
<!--      <img :src="`http://${mode.idcard_photo_1}`" alt="" style="width: 150px;height: 150px;">-->
<!--      <p>{{mode.idcard_photo_1}}</p>-->
<!--    </div>-->
  </q-page>
</template>

<script>
import urls from 'src/api/api'
export default {
  name: 'detail',
  data () {
    return {
      commissionRule: [],
      mode: {
        company_name: '',
        legal_person: '',
        idcard_no: null,
        mobile: '',
        commission: 1,
        deposit: '',
        idcard_photo_1: '',
        idcard_photo_2: '',
        business_license: '',
        e_contract_address: null,
        id: null
      }
    }
  },
  created () {
    let vm = this
    let obj = this.$route.params.obj
    for (let k in obj) {
      if (vm.mode.hasOwnProperty(k)) {
        vm.mode[k] = obj[k]
      }
    }
    // 拉取佣金规则
    this.$axios(urls.queryCommisionRule, {}).then(res => {
      let code = res.code
      if (code === 'success') {
        let arr = []
        for (let k in res.list) {
          arr.push({ label: res.list[k].rule, value: res.list[k].id })
        }
        this.commissionRule = [...arr]
      } else {
        this.$q.notify(res.msg)
      }
    }, err => {
      this.$q.notify(JSON.stringify(err))
    })
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.custom-img{
  min-width: 38vw;
  max-width: 90vw;
  height: 180px;
}
</style>
