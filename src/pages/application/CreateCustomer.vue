<template>
    <q-page class="bg-white">
      <q-header class="header-fix text-white bg-primary">
        <q-toolbar  dense>
          <q-btn icon="keyboard_arrow_left" flat dense round @click="goBack()"></q-btn>
          <q-toolbar-title class="text-center">{{editType === 1 ? '新建商户' : '修改商户'}}</q-toolbar-title>
          <span class="custom-tit-position"></span>
        </q-toolbar>
      </q-header>
      <q-form ref="myForm">
        <q-list separator>
          <q-item>
            <q-item-section>
              <span class="font-sm">商家名称</span>
            </q-item-section>
            <q-item-section side>
              <q-input
                dense
                borderless
                v-model="form.company_name"
                placeholder="请输入商家名称"
                :no-error-icon="true"
                :hide-bottom-space="true"
                :rules="[
                  val => !!val || '请输入商家名称'
                ]"
              ></q-input>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <span class="font-sm">法人姓名</span>
            </q-item-section>
            <q-item-section side>
              <q-input
                dense
                borderless
                v-model="form.legal_person"
                placeholder="请输入法人姓名"
                :no-error-icon="true"
                :hide-bottom-space="true"
                :rules="[
                  val => !!val || '请输入法人姓名'
                ]"
              ></q-input>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <span class="font-sm">法人身份证号</span>
            </q-item-section>
            <q-item-section side>
              <q-input
                dense
                borderless
                v-model="form.idcard_no"
                :no-error-icon="true"
                :hide-bottom-space="true"
                placeholder="请输入法人身份证号"
                :rules="[
                  val => !!val || '请输入法人身份证号',
                  val => (/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(val)) || '身份证格式错误'
                ]"
                lazy-rule
              ></q-input>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <span class="font-sm">登录账号</span>
            </q-item-section>
            <q-item-section side>
              <q-input
                dense
                borderless
                v-model="form.mobile"
                placeholder="请输入手机号"
                :no-error-icon="true"
                :hide-bottom-space="true"
                :rules="[
                    val => !!val || '请输入手机号',
                    val => (/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(19[0-9]{1})|(17[0-9]{1}))+\d{8})$/.test(val)) || '手机号格式错误'
                  ]"
              ></q-input>
            </q-item-section>
          </q-item>
          <q-item v-if="editType === 1">
            <q-item-section>
              <span class="font-sm">初始密码</span>
            </q-item-section>
            <q-item-section side>
              <q-input
                dense
                borderless
                v-model="form.password"
                placeholder="请输入初始密码"
                :no-error-icon="true"
                :hide-bottom-space="true"
                :rules="[
                  val => !!val || '请输入初始密码',
                ]"
              ></q-input>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <span class="font-sm">佣金规则</span>
            </q-item-section>
            <q-item-section side>
              <q-select borderless v-model="form.commission" :options="selectArr.ruleArr" color="primary" emit-value map-options
                        dense
                        :rules="[
                        val => !!val || '请选择佣金规则'
                        ]"
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <span class="font-sm">法人身份证正面</span>
            </q-item-section>
            <q-item-section side>
              <div @click="updateImg('idcard_photo_1')">
                <span v-if="!form.idcard_photo_1" class="text-grey">未上传</span>
                <span v-else class="text-primary">已上传</span>
              </div>
              <div style="display: none">
                <input type="file" accept="image/*"  capture="camera" multiple="multiple" ref="idcard_photo_1" @change="changeAvator($event, 'idcard_photo_1')"/>
              </div>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <span class="font-sm">法人身份证反面</span>
            </q-item-section>
            <q-item-section side>
<!--              <q-avatar square size="6rem" color="primary"  @click="updateImg">-->
<!--&lt;!&ndash;                <span class="font-big text-white" v-if="!form.idcard_photo_2">+</span>&ndash;&gt;-->
<!--&lt;!&ndash;                <img :src="form.idcard_photo_2" alt="" v-else>&ndash;&gt;-->
<!--              </q-avatar>-->
              <div @click="updateImg('idcard_photo_2')" class="text-grey">
                <span v-if="!form.idcard_photo_2" class="text-grey">未上传</span>
                <span v-else class="text-primary">已上传</span>
              </div>
              <div style="display: none">
                <input type="file" accept="image/*"  capture="camera" multiple="multiple" ref="idcard_photo_2" @change="changeAvator($event, 'idcard_photo_2')"/>
              </div>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <span class="font-sm">营业执照照片</span>
            </q-item-section>
            <q-item-section side>
              <div @click="updateImg('business_license')">
                <span v-if="!form.business_license" class="text-grey">未上传</span>
                <span v-else class="text-primary">已上传</span>
              </div>
              <div style="display: none">
                <input type="file" accept="image/*"  capture="camera" multiple="multiple" ref="business_license" @change="changeAvator($event, 'business_license')"/>
              </div>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <span class="font-sm">电子合同</span>
            </q-item-section>
            <q-item-section side>
              <div>
                <span v-if="form.e_contract_address === ''" class="text-grey" @click="openContract">未签约</span>
                <span v-else class="text-primary" @click="openContract">已签约</span>
              </div>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <span class="font-sm">关联门店</span>
            </q-item-section>
            <q-item-section side>
              <q-btn flat icon="fa fa-angle-right" @click="showShopList" style="padding-right: 0"></q-btn>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <span class="font-sm">详细地址</span>
            </q-item-section>
            <q-item-section side>
              <div class="cus-address">
                <q-input
                  borderless
                  dense
                  autogrow
                  type="textarea"
                  style="width: 60%"
                  v-model="form.company_address"
                  placeholder="填写详细地址"
                />
                <q-btn color="primary" size="sm" @click="getCoordinate">定位</q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="q-pa-md">
          <q-btn class="full-width" color="primary" v-if="editType === 1 || (editType === 2 && form.check_status === 0)" @click="saveDraft" :loading="btnLoading">保存为草稿</q-btn>
          <q-btn class="full-width" color="primary" @click="subCompanyInfo" :loading="btnLoading">提交平台审核</q-btn>
        </div>
      </q-form>
      <!-----------------------------关联门店---------------------------------------------->
      <q-dialog
        v-model="showShop"
        persistent
        :maximized="true"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <shop-list v-if="showShop" @closeShop="closeShop" @sub="getChoose" :before="form.clues_list"></shop-list>
      </q-dialog>
      <!---------------------------------------地图层------------------------------------------------------>
      <q-dialog
        v-model="drawer"
        persistent
        :maximized="true"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <store-map v-if="drawer" @sub="getMapInfo" :lat1="form.lat" :lng1="form.lng" @closeDialog="closeDrawer"></store-map>
      </q-dialog>
      <!----------------------------------电子合同弹出层--------------------------------------------->
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
              <span class="font-sm">电子合同</span>
            </q-toolbar-title>
            <q-btn flat class="text-white font-md" @click="closeDialog" icon="fa fa-times"></q-btn>
          </q-toolbar>
          <div class="contract-tit q-pa-sm">
            <span>合同名称：{{constract.tit}}</span>
            <span>合同编号：{{constract.code}}</span>
          </div>
          <q-scroll-area class="q-pa-sm constract-cont word-break" :horizontal="false">
            <div class="text-black" v-html="constract.content"></div>
          </q-scroll-area>
          <div id="customCanvas"></div>
          <div class="btn-group">
            <q-btn ref="save" id="saveName" color="primary">保存</q-btn>
            <q-btn ref="clear" id="clearName" color="primary">重置</q-btn>
          </div>
        </div>
      </q-dialog>
      <!------------------------------------------------------------------------------->
    </q-page>
</template>

<script>
import urls from 'src/api/api'
import storeMap from 'src/pages/companyManage/mapOfstore'
import shopList from 'src/components/shopList'
export default {
  name: 'CreateCustomer',
  components: {
    storeMap,
    shopList
  },
  data () {
    return {
      btnLoading: false,
      drawer: false,
      showShop: false,
      editType: 1, // 1-创建，2-修改
      showDialog: false, // 电子合同显示
      canvas: undefined, // 存放画布对象
      cxt: undefined, // 存放ctx对象
      selectArr: {
        ruleArr: []
      },
      constract: { // 电子合同
        content: '',
        tit: '',
        code: ''
      },
      form: {
        id: '',
        company_name: '',
        legal_person: '',
        check_status: undefined, // 从修改进入时需要把check_status带过来赋值，控制保存到草稿按钮的显示
        commission: '',
        idcard_no: '',
        mobile: '',
        password: '888888',
        rule: '',
        idcard_photo_1: '',
        idcard_photo_2: '',
        business_license: '',
        e_contract_status: 0, // 电子合同状态
        e_contract_address: '', // 电子合同签名存放地址
        clueid: '', // 线索id，线索转客户的时候用
        lat: 30.55055,
        lng: 104.06502,
        company_address: '',
        clues_list: []
      }
    }
  },
  created () {
    let params = this.$route.params
    if (params.type === 2) { // 修改状态
      this.editType = 2
      for (let k in params.obj) {
        if (this.form.hasOwnProperty(k)) { // 赋值初始化
          this.form[k] = params.obj[k]
        }
      }
    } else if (params.type === 1 && params.obj) { // 转客户状态
      for (let k in params.obj) {
        if (this.form.hasOwnProperty(k)) { // 赋值初始化
          this.form[k] = params.obj[k]
        }
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
        this.selectArr.ruleArr = [...arr]
      } else {
        this.$q.notify(res.msg)
      }
    }, err => {
      this.$q.notify(JSON.stringify(err))
    })
  },
  methods: {
    getChoose (list) { // 收取选择的线索id
      this.form.clues_list = [...list]
    },
    showShopList () {
      this.showShop = true
    },
    closeShop () {
      this.showShop = false
    },
    geoSuccess (position) { // 获取地理位置成功
      this.form.lat = position.coords.latitude
      this.form.lng = position.coords.longitude
    },
    geoError (error) { // 获取地理位置失败
      alert(error.message)
    },
    getCoordinate () {
      let that = this
      // let address
      if (that.form.company_address) {
        let param = { address: that.form.company_address }
        that.$axios(urls.getAddres, param).then(res => {
          // console.log(res)
          if (res.status === 0) {
            that.form.lat = res.result.location.lat
            that.form.lng = res.result.location.lng
          } else if (res.status === 306) {
          } else {
            that.$q.notify(res.message)
          }
          that.drawer = true
        }).catch(() => {
          // that.$q.notify('定位失败，请检查网络是否通畅')
        })
      } else {
        /* eslint-disable */
        async function getGeo () {
          await navigator.geolocation.getCurrentPosition(that.geoSuccess, that.geoError)
          that.drawer = true
        }
        getGeo()
        /* eslint-disable */
      }
    },
    getMapInfo (info) { // 收取经纬度
      this.form.lng = info.lng
      this.form.lat = info.lat
      this.form.company_address = info.address
      this.drawer = false
    },
    saveDraft () { // 保存为草稿
      let vm = this
      let params = {
        'legal_person': vm.form.legal_person, // 法人名称
        'check_status': 0, // 审核状态:草稿0,待审核1,审核未通过2,审核通过3
        'commission': vm.form.commission, // 佣金
        'business_license': vm.form.business_license,
        'idcard_photo_1': vm.form.idcard_photo_1,
        'idcard_photo_2': vm.form.idcard_photo_2,
        'company_name': vm.form.company_name,
        // 'company_desc': '',
        'mobile': vm.form.mobile,
        // 'password': vm.form.password,
        'idcard_no': vm.form.idcard_no,
        'e_contract_address': vm.form.e_contract_address,
        // 'e_contract_status': vm.form.e_contract_status,
        'lat': vm.form.lat,
        'lng': vm.form.lng,
        'company_address': vm.form.company_address,
        'clues_list': vm.form.clues_list
      }
      let URL = ''
      if (vm.editType === 1) {
        if (vm.form.clueid) {
          params['clueid'] = vm.form.clueid // 线索转客户时，传入线索id供后台识别
        }
        params['password'] = vm.form.password
        URL = urls.createCompany
      } else if (vm.editType === 2) {
        params['id'] = vm.form.id
        URL = urls.updateCompany
      }
      vm.btnLoading = true
      vm.$axios(URL, params).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.$q.notify('保存成功')
          setTimeout(() => {
            vm.$router.push({ name: 'AuditDraft' })
          }, 1500)
        } else {
          vm.$q.notify(res.msg)
        }
        vm.btnLoading = false
      }, err => {
        vm.$q.notify(JSON.stringify(err))
        vm.btnLoading = false
      })
    },
    subCompanyInfo () { // 提交商户信息到审核
      let vm = this
      this.$refs['myForm'].validate().then(suc => {
        if (suc) {
          let dictionary = {
            'idcard_photo_1': '法人身份证正面未上传',
            'idcard_photo_2': '法人身份证反面未上传',
            'business_license': '营业执照照片未上传',
            'e_contract_address': '电子合同未签约'
          }
          for (let k in dictionary) {
            if (!vm.form[k]) {
              vm.$q.notify(dictionary[k])
              return false
            }
          }
          if (vm.form.company_address === '') {
            vm.$q.notify('请填写详细地址')
            return false
          }
          if (vm.editType === 1 && vm.$route.params.obj && vm.form.clues_list.length < 1) {
            vm.$q.notify('请关联门店')
            return false
          }
          let params = {
            'legal_person': vm.form.legal_person, // 法人名称
            'check_status': 1, // 审核状态:草稿0,待审核1,审核未通过2,审核通过3
            'commission': vm.form.commission, // 佣金
            'business_license': vm.form.business_license,
            'idcard_photo_1': vm.form.idcard_photo_1,
            'idcard_photo_2': vm.form.idcard_photo_2,
            'company_name': vm.form.company_name,
            // 'company_desc': '',
            'mobile': vm.form.mobile,
            // 'password': vm.form.password,
            'idcard_no': vm.form.idcard_no,
            'e_contract_address': vm.form.e_contract_address,
            // 'e_contract_status': vm.form.e_contract_status,
            'lat': vm.form.lat,
            'lng': vm.form.lng,
            'company_address': vm.form.company_address,
            'clues_list': vm.form.clues_list
          }
          let URL = ''
          if (vm.editType === 1) {
            params['password'] = vm.form.password
            // params['check_status'] = 1
            if (vm.form.clueid) {
              params['clueid'] = vm.form.clueid // 线索转客户时，传入线索id供后台识别
            }
            URL = urls.createCompany
          } else if (vm.editType === 2) {
            params['id'] = vm.form.id
            URL = urls.updateCompany
          }
          vm.btnLoading = true
          vm.$axios(URL, params).then(res => {
            let code = res.code
            if (code === 'success') {
              vm.$q.notify('保存成功')
              setTimeout(() => {
                vm.$router.push({ name: 'WaitAudit' })
              }, 1500)
            } else {
              vm.$q.notify(res.msg)
            }
            vm.btnLoading = false
          }, err => {
            vm.$q.notify(JSON.stringify(err))
            vm.btnLoading = false
          })
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    // 打开电子合同
    openContract () {
      let params = {
        'type': 1
      }
      this.$axios(urls.queryContract, params).then(res => {
        let code = res.code
        if (code === 'success') {
          this.constract.content = res.content
          this.constract.tit = res.name
          this.constract.code = res.contract_code
        } else {
          this.$q.notify(res.msg)
        }
      }, () => {
        this.$q.dialog('获取合同内容失败，请稍后再试')
      })
      this.showDialog = true
      this.init_lineCanvas()
    },
    closeDrawer () {
      this.drawer = false
    },
    closeDialog () {
      this.showDialog = false
      document.removeEventListener('touchmove', this.prevent, false)
      document.removeEventListener('touchmove', this.prevent, true)
    },
    prevent (event) {
      event.preventDefault()
    },
    changeAvator (e, obj) { // 从相册选择
      let vm = this
      // console.log(e)
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
            // vm.form.imgUrl = res.url
            vm.form[obj] = res.url
          } else {
            vm.$q.notify(res.message)
          }
        }, () => {
          // console.log(err)
        })
      }
    },
    updateImg (obj) { // 点击停业图片上传
      let vm = this
      // this.$refs['myInput'].click()
      // console.log(obj)
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
          this.$refs[obj].click()
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
                  vm.form[obj] = `data:image/jpeg;base64,${data}`
                } else {
                  vm.$q.notify(res.message)
                }
              }, () => {
                this.$q.notify('上传出错，请检查网络是否通畅')
              })
            },
            () => { // on fail
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
    },
    init_lineCanvas () { // 生成签字板
      document.addEventListener(
        "touchmove",
        this.prevent,
        { passive: false }
      );
      new this.lineCanvas({
        // el: document.getElementById("customCanvas"), // 绘制canvas的父级div
        that: this,
        linewidth: 3, // 线条粗细，选填
        color: "#000000", // 线条颜色，选填
        background: "#ffffff" // 背景，选填
      })
    },
    lineCanvas (obj) { // canvas设置
      let vm = this
      let setting = {}
      for (let i in obj) {
        setting[i] = obj[i]
      }
      this.canvas = document.createElement("canvas");
      let el
      setTimeout(() => {
        el = document.getElementById("customCanvas")
        el.appendChild(this.canvas);
        vm.cxt = vm.canvas.getContext("2d");
        vm.canvas.width = 333;
        vm.canvas.height = 147;
        vm.cxt.fillStyle = setting.background;
        vm.cxt.fillRect(0, 0, vm.canvas.width, vm.canvas.height);
        vm.cxt.strokeStyle = setting.color;
        vm.cxt.lineWidth = setting.linewidth;
        vm.cxt.lineCap = "round";
        // 开始绘制
        // 获取offset
        let offsetT = el.offsetTop
        let offsetL = el.offsetLeft
        vm.canvas.addEventListener(
          "touchstart",
          function(e) {
            vm.cxt.beginPath();
            vm.cxt.moveTo(e.changedTouches[0].pageX - offsetL, e.changedTouches[0].pageY - offsetT);
          },
          false
        );
        // 绘制中
        vm.canvas.addEventListener(
          "touchmove",
          function(e) {
            // console.log(e.changedTouches[0].pageX - offsetL, e.changedTouches[0].pageY - offsetT)
            vm.cxt.lineTo(e.changedTouches[0].pageX - offsetL, e.changedTouches[0].pageY - offsetT);
            vm.cxt.stroke();
          },
          false
        );
        // 结束绘制
        vm.canvas.addEventListener(
          "touchend",
          function() {
            vm.cxt.closePath()
          },
          false
        )
        // 清除画布
        let clear = document.getElementById('clearName')
        clear.addEventListener(
          "click",
          function() {
            // console.log('清除画布')
            // console.log(this)
            this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
          }.bind(this),
          false
        )
        // 保存图片
        let save = document.getElementById('saveName')
        save.addEventListener(
          'click',
          function () {
            let imgBase64 = this.canvas.toDataURL()
            let contractInfo = {
              fileName: `${Math.random()}contract`,
              fileData: imgBase64
            }
            obj.that.subContract(contractInfo)
          }.bind(this),
          false
        )
      }, 1500)
    },
    subContract (param) {
      let vm = this
      this.$axios(urls.uploadImg, param).then(res => {
        if (res.code === 'success') {
          vm.form['e_contract_address'] = res.url
          vm.form['e_contract_status'] = 1
          vm.$q.notify('已成功保存')
          setTimeout(() => {
            vm.showDialog = false
            document.removeEventListener('touchmove', vm.prevent, false)
            document.removeEventListener('touchmove', this.prevent, true)
          }, 1000)
        } else {
          vm.$q.notify(res.message)
        }
      }, () => {
        vm.$q.notify('保存出错，请检查网络是否通畅')
      })
    }
  }
}
</script>

<style scoped>
.full-width + .full-width {
  margin-top: .8rem;
}
.constract-cont{
  max-width: 100%;
  height: 45vmax;
}
#customCanvas{
  width: 333px;
  height: 149px;
  margin: 1vmax auto;
}
.btn-group {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.contract-tit{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.cus-address{
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
}
.cus-address .q-btn{
  /*padding: 0;*/
}
</style>
