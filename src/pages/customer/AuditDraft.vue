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
      </div>
      <div class="custom-btn-group">
        <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="editCompany(k, 2)">修改详情</q-btn>
        <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="showRecharge(k)">充值</q-btn>
        <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="changeToAudit(k)">提交审核</q-btn>
        <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="sendContract(k)">发送合同</q-btn>
      </div>
    </div>
    <!------------------------------充值二维码弹出----------------------------------->
    <q-dialog
      v-model="Recharge"
      transition-show="slide-up"
      transition-hide="slide-down"
      persistent
    >
      <q-card class="pay-card">
        <q-card-section>
          <p>请将二维码展示给客户扫描</p>
        </q-card-section>
        <q-card-section>
          <div class="code-list">
            <div class="pay-type">
<!--              <q-img-->
<!--                class="pay-code"-->
<!--                :src="wxCodeSrc"-->
<!--              ></q-img>-->
              <img :src="`https://${wxCodeSrc}`" alt="" class="pay-code">
              <span>微信</span>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-right">
            <q-btn text-color="primary" flat @click="cancelRecharge">取消</q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import urls from 'src/api/api'
export default {
  name: 'AuditDraft',
  data () {
    return {
      wxCodeSrc: '',
      wsUrl: '',
      Recharge: false,
      showDialog: false,
      stopForm: {
        imgUrl: '',
        remark: ''
      },
      dataList: [],
      curOrderId: '', // 当前充值订单id
      websock: null,
      reconnectData: null,
      lockReconnect: false, // 避免重复连接，因为onerror之后会立即触发 onclose
      timeout: 10000, // 10s一次心跳检测
      timeoutObj: null,
      serverTimeoutObj: null
    }
  },
  created () {
    let params = {
      'check_status': 0
    }
    this.queryInfo(params)
  },
  methods: {
    initWebSocket (url) {
      // console.log('启动中')
      // let wsurl = this.wsUrl
      this.websock = new WebSocket(url)
      this.websock.onopen = this.websocketonopen // 连接成功
      this.websock.onmessage = this.websocketonmessage // 广播成功
      this.websock.onerror = this.websocketonerror // 连接断开，失败
      this.websock.onclose = this.websocketclose // 连接关闭
    },
    websocketonopen () {
      console.log('连接成功')
    },
    websocketonerror () {
      console.log('连接失败')
      this.reconnect()
    },
    websocketclose () {
      console.log('断开连接')
      this.reconnect()
    },
    websocketonmessage (data) {
      // this.heatBeat();      //收到消息会刷新心跳检测，如果一直收到消息，就推迟心跳发送
      // console.log(data.data)
      let vm = this
      let response = JSON.parse(data.data)
      if (response.code === 'success') {
        vm.Recharge = false
        vm.$q.notify('充值成功')
        vm.queryInfo()
        this.websock.close() // 离开路由之后断开websocket连接
        clearTimeout(this.reconnectData) // 离开清除 timeout
        clearTimeout(this.timeoutObj) // 离开清除 timeout
        clearTimeout(this.serverTimeoutObj) // 离开清除 timeout
      } else {
        vm.$q.notify(response.msg)
        this.websock.close() // 离开路由之后断开websocket连接
        clearTimeout(this.reconnectData) // 离开清除 timeout
        clearTimeout(this.timeoutObj) // 离开清除 timeout
        clearTimeout(this.serverTimeoutObj) // 离开清除 timeout
      }
    },
    reconnect () {
      if (this.lockReconnect) { // 这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
        return
      }
      this.lockReconnect = true
      this.reconnectData && clearTimeout(this.reconnectData)
      this.reconnectData = setTimeout(() => {
        this.initWebSocket()
        this.lockReconnect = false
      }, 5000)
    },
    cancelRecharge (id) { // 关闭二维码
      let vm = this
      vm.$q.dialog({
        title: '',
        message: '确认取消该笔订单',
        ok: '确认',
        cancel: '点错了'
      }).onOk(() => {
        let params = {
          'orderid': vm.curOrderId
        }
        vm.$axios(urls.cancelOrder, params).then(res => {
          if (res.code === 'success') {
            vm.$q.notify('已取消该笔订单')
            vm.Recharge = false
            this.websock.close() // 离开路由之后断开websocket连接
            clearTimeout(this.reconnectData) // 离开清除 timeout
            clearTimeout(this.timeoutObj) // 离开清除 timeout
            clearTimeout(this.serverTimeoutObj) // 离开清除 timeout
          } else {
            vm.$q.notify(res.msg)
          }
        }).catch(() => {
        })
      }).onCancel(() => {
      })
    },
    showRecharge (obj) { // 打开充值二维码
      let vm = this
      this.$q.dialog({
        title: '',
        message: '请输入充值金额',
        prompt: {
          model: '',
          type: 'number' // optional
        },
        ok: '确认',
        cancel: '取消',
        persistent: true
      }).onOk(data => {
        let params = {
          'companyid': obj.id,
          'salesid': vm.$q.localStorage.getItem('userId'),
          'amount': data
        }
        // console.log(params)
        vm.$axios(urls.recharge, params).then(res => {
          // console.log(JSON.parse(res))
          if (res.code === 'success') {
            vm.wxCodeSrc = res.code_img
            vm.Recharge = true
            vm.curOrderId = res.orderid
            // vm.wsUrl = res.websocket_url
            vm.initWebSocket(res.websocket_url)
          } else {
            vm.$q.notify(res.msg)
          }
        }, err => {
          console.log(err)
        })
      }).onCancel(() => {
        vm.$q.notify('已取消充值')
      })
    },
    sendContract (obj) { // 送电子合同
      let vm = this
      this.$q.dialog({
        title: '',
        message: '请输入用户手机号',
        prompt: {
          model: '',
          type: 'tel'
        },
        ok: '发送',
        cancel: '取消',
        persistent: true
      }).onOk(data => {
        let params = {
          'mobile': data,
          'companyid': obj.id
        }
        vm.$axios(urls.sendContract, params).then(res => {
          let code = res.code
          if (code === 'success') {
            vm.$q.notify('已将合同信息发送')
          } else {
            vm.$q.notify(res.msg)
          }
        }).catch(err => {
          vm.$q.notify(JSON.stringify(err))
        })
      }).onCancel(() => {
        vm.$q.notify('取消发送')
      })
    },
    changeToAudit (obj) { // 提交平台审核
      let vm = this
      for (let k in obj) {
        if (obj[k] === undefined || obj[k] === '') {
          this.$q.notify('该草稿信息不完整，无法提交')
          return false
        }
      }
      // let params = {}
      // Object.assign(params, obj)
      let params = {
        'id': obj.id,
        'legal_person': obj.legal_person, // 法人名称
        'check_status': 1, // 审核状态:草稿0,待审核1,审核未通过2,审核通过3
        'commission': obj.commission, // 佣金
        'business_license': obj.business_license,
        'idcard_photo_1': obj.idcard_photo_1,
        'idcard_photo_2': obj.idcard_photo_2,
        'company_name': obj.company_name,
        'lat': obj.lat,
        'lng': obj.lng,
        'company_address': obj.company_address,
        // 'company_desc': '',
        'mobile': obj.mobile,
        // 'account': vm.form.account,
        'idcard_no': obj.idcard_no,
        'e_contract_address': obj.e_contract_address,
        'e_contract_status': obj.e_contract_status,
        'clues_list': obj.clues_list
      }
      vm.$axios(urls.updateCompany, params).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.$q.notify('操作成功')
          vm.$router.push({ name: 'WaitAudit' })
        } else {
          vm.$q.notify(res.msg)
        }
      }, () => {
        vm.$q.notify('操作失败，请稍后再试')
      })
    },
    seeDetail (obj) { // 查看详情
      this.$router.push({ name: 'CompanyDetail', params: { obj: obj } })
    },
    queryInfo (opt) {
      let vm = this
      vm.$axios(urls.queryCompanyList, opt).then(res => {
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
    editCompany (obj, type) { // 修改商户
      this.$router.push({ name: 'CreateCustomer', params: { obj: obj, type: type } })
    },
    stopShop () {
      this.showDialog = true
    },
    draftToAudit (obj) { // 草稿转待审核
      let vm = this
      let params = {
        'legal_person': '', // 法人名称
        'check_status': 1, // 审核状态:草稿0,待审核1,审核未通过2,审核通过3
        'commission': '', // 佣金
        'business_license': '', // 营业执照
        'idcard_photo_1': '',
        'idcard_photo_2': '',
        'company_name': '',
        // 'company_desc': '',
        'mobile': '',
        // 'account': vm.form.account,
        'idcard_no': '',
        'e_contract_address': '',
        'e_contract_status': undefined
      }
      for (let k in obj) {
        if (params.hasOwnProperty(k)) {
          if (obj[k]) {
            params[k] = obj[k] // 验证字段非空性，
          } else {
            vm.$q.notify('当前草稿信息未填写完整')
            return false
          }
        }
      }
      // 赋值结束，验证各字段非空性
      vm.$axios(urls.updateCompany, params).then(res => {
        if (res.code === 'success') {
          vm.$q.notify('提交成功，请到待审核中查看')
          let opt = {
            'check_status': 0
          }
          vm.queryInfo(opt)
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
  .custom-card-list{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .custom-card-list span{
    /*max-width: 48%;*/
  }
  .custom-card-list + .custom-card-list {
    margin-top: .25rem;
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
  .pay-card{
    width: 70vmin;
  }
  .code-list{
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .pay-type{
    width: 49%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
</style>
