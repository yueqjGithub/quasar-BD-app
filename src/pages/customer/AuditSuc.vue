<template>
  <q-page class="q-pa-sm">
    <div class="custom-card q-pa-sm" v-for="k in dataList" :key="k.name">
      <div class="custom-card-list" @click="seeDetail(k)">
        <span class="font-sm">{{k.company_name}}</span>
        <span class="font-xs text-black" v-if="k.check_status === 0">草稿</span>
        <span class="font-xs text-warning" v-if="k.check_status === 1">待审核</span>
        <span class="font-xs text-negative" v-if="k.check_status === 2">未通过</span>
        <span class="font-xs text-primary" v-if="k.check_status === 3 && k.stop_status === 1">已审核</span>
        <span class="font-xs text-negative" v-if="k.check_status === 3 && k.stop_status === 0">已停业</span>
      </div>
      <div class="custom-card-list">
        <span class="font-xs text-black">商户负责人：{{k.legal_person}}</span>
        <span class="font-xs text-black">电话：{{k.mobile}}</span>
      </div>
      <div class="custom-card-list">
        <span class="font-xs text-black">地址：{{k.company_address}}</span>
        <span class="font-xs text-black">审核日期：{{k.passed_time ? k.passed_time.substr(0, 10) : ''}}</span>
      </div>
      <div class="custom-btn-group">
        <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="editCompany(k, 2)">修改详情</q-btn>
        <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="showRecharge(k)">充值</q-btn>
        <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="stopShop(k)" v-if="k.stop_status === 1">停业</q-btn>
<!--        <q-btn color="primary" size="sm" class="custom-btn-group-item" v-if="k.stop_status === 0">恢复营业</q-btn>-->
        <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="toCompanyPage(k)">商户管理</q-btn>
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
<!--              <img :src="wxCodeSrc" alt="" class="pay-code">-->
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
    <!-----------------------停业弹出------------------------------>
    <q-dialog
      v-model="showDialog"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <div class="bg-white">
        <q-toolbar class="text-white bg-primary">
          <q-toolbar-title>
            <span class="font-sm">请上传停业相关资料确认停业</span>
          </q-toolbar-title>
          <q-btn flat around class="text-white font-md" @click="showDialog = false" icon="fa fa-times"></q-btn>
        </q-toolbar>
        <div class="q-pa-sm">
          <q-card>
            <q-card-section>
              <q-form ref="stopForm">
                <div class="stop-form-item">
                  <div class="stop-form-label">上传图片:</div>
                  <div class="stop-form-content">
                    <q-avatar square size="8rem" color="primary"  @click="updateImg">
                      <span class="font-big text-white" v-if="!stopForm.imgUrl">+</span>
                      <img :src="'https://' + stopForm.imgUrl" alt="" v-else>
                    </q-avatar>
                  </div>
                  <div style="display: none">
                    <input type="file" accept="image/*"  capture="camera" multiple="multiple" ref="myInput" @change="changeAvator"/>
                  </div>
                </div>
                <div style="height: 1rem;"></div>
                <div class="stop-form-item">
                  <div class="stop-form-item">
                    <div class="stop-form-label">备注:</div>
                    <div class="stop-form-content">
                      <q-input
                        v-model="stopForm.remark"
                        filled
                        type="textarea"
                        :rules="[
                          val => !!val || '请填写备注'
                        ]"
                      />
                    </div>
                  </div>
                </div>
              </q-form>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="取消" color="primary" v-close-popup />
              <q-btn flat label="确认" color="primary" @click="subStopInfo"/>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </q-dialog>
    <!-----------------------停业弹出------------------------------>
  </q-page>
</template>

<script>
import urls from 'src/api/api'
export default {
  name: 'AuditSuc',
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
      stopInfo: {},
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
    let vm = this
    vm.queryInfo()
  },
  methods: {
    queryInfo () {
      let vm = this
      let params = {
        'check_status': 3
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
    seeDetail (obj) { // 查看详情
      this.$router.push({ name: 'CompanyDetail', params: { obj: obj } })
    },
    editCompany (obj, type) {
      this.$router.push({ name: 'CreateCustomer', params: { obj: obj, type: type } })
    },
    toCompanyPage (obj) {
      this.$q.localStorage.set('currentCompany', obj)
      this.$router.push({ name: 'AppList', params: { obj: obj } })
    },
    stopShop (obj) {
      this.showDialog = true
      this.stopInfo = obj
    },
    subStopInfo () { // 提交停业资料
      let vm = this
      this.$refs['stopForm'].validate().then(suc => {
        if (suc) {
          if (!vm.stopForm.imgUrl) {
            vm.$q.notify('请上传停业照片证明')
            return false
          }
          let params = {
            'remark_info': vm.stopForm.remark, // 备注信息
            'pictrue_address': vm.stopForm.imgUrl, // 图片地址
            'companyid': vm.stopInfo.id, // 商户ID
            'saleid': vm.$q.localStorage.getItem('userId')
          }
          vm.$axios(urls.closeCompany, params).then(res => {
            let code = res.code
            if (code === 'success') {
              this.$q.notify('设置成功')
              vm.queryInfo()
              setTimeout(() => {
                this.showDialog = false
              }, 1500)
            } else {
              vm.$q.notify(res.msg)
            }
          }, err => {
            vm.$q.notify(JSON.stringify(err))
          })
        }
      })
    },
    changeAvator (e) { // 从相册选择
      let vm = this
      let file = e.target.files[0]
      let params = {}
      let reader = new FileReader()
      reader.readAsDataURL(file)
      // 一定要在文件读取 成功完成时 再进行相应的操作：上传使用formdata上传
      reader.onload = function () {
        // vm.storeInfo.imgUrl = reader.result
        params = {
          fileName: file.name,
          fileData: reader.result
        }
        vm.$axios(urls.uploadImg, params).then(res => {
          if (res.code === 'success') {
            vm.stopForm.imgUrl = res.url
          } else {
            vm.$q.notify(res.message)
          }
        }, err => {
          vm.$q.notify(JSON.stringify(err))
        })
      }
    },
    updateImg () { // 点击停业图片上传
      let vm = this
      // this.$refs['myInput'].click()
      this.$q.bottomSheet({
        message: '',
        actions: [
          {
            label: '相机',
            id: 'camera'
          },
          {
            label: '从相册中选择',
            id: 'photo'
          }
        ]
      }).onOk(action => {
        // this.$q.notify(action.id)
        if (action.id === 'photo') {
          this.$refs['myInput'].click()
        } else if (action.id === 'camera') {
          // this.$q.notify(action.id)
          /* eslint-disable */
          navigator.camera.getPicture(
            data => { // on success
              let params = {
                fileName: `${Math.random()}pic`,
                fileData: `data:image/jpeg;base64,${data}`
              }
              vm.$axios(urls.uploadImg, params).then(res => {
                if (res.code === 'success') {
                  vm.stopForm.imgUrl = res.url
                } else {
                  vm.$q.notify(res.message)
                }
              }, () => {
                this.$q.notify('上传出错，请检查网络是否通畅')
              })
            },
            () => { // on fail
              this.$q.notify('Could not access device camera.')
            },
            {
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URL // 返回Base64编码字符串
            }
          )
          /* eslint-disable */
        }
      }).onCancel(() => {

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
    max-width: 48%;
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
