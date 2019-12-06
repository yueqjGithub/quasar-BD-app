<template>
  <q-page>
    <q-header class="my-border">
      <div class="my-header text-black q-pa-sm bg-white">
        <div class="my-header-l">
          <q-btn flat round icon="img:statics/images/back-B.png" @click="goBack"></q-btn>
        </div>
        <div class="my-header-m text-center">门店管理</div>
        <div class="my-header-r">
          <q-btn rounded unelevated label="保存" color="primary" text-color="white" class="word-no-wrap" @click="save"></q-btn>
        </div>
      </div>
    </q-header>
    <transition
      appear
      enter-active-class="animated slideInRight"
      leave-active-class="animated slideOutLeft"
    >
      <q-page class="my-grey-bg">
        <q-form ref="myForm">
          <div class="my-list-card flex-column flex-align-start flex-just-start">
            <span class="card-tit">门店信息</span>
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-baseline flex-just-start">
              <span class="my-label">门店名称</span>
              <div class="my-input">
                <q-input
                  borderless
                  dense
                  :bottom-slots="false"
                  :hide-bottom-space="true"
                  v-model="store.shop_name"
                  placeholder="填写门店名称"
                  :rules="[
                  val => !!val || ''
                ]"
                />
              </div>
            </div>
            <!-------------item------------------->
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-baseline flex-just-start">
              <span class="my-label">门店推荐语</span>
              <div class="my-input">
                <q-input
                  borderless
                  dense
                  autogrow
                  :bottom-slots="false"
                  :hide-bottom-space="true"
                  v-model="store.recommend_product"
                  placeholder="请输入推荐菜或推荐语，最长16字"
                  :rules="[
                  val => val.length < 16 || ''
                ]"
                />
              </div>
            </div>
            <!-------------item------------------->
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-baseline flex-just-start">
              <span class="my-label">门店负责人</span>
              <div class="my-input">
                <q-input
                  borderless
                  dense
                  :bottom-slots="false"
                  :hide-bottom-space="true"
                  v-model="store.shop_username"
                  placeholder="填写负责人姓名"
                  :rules="[
                  val => !!val || ''
                ]"
                />
              </div>
            </div>
            <!-------------item------------------->
            <!-------------item------------------->
            <div class="my-list-item-last flex-row flex-align-baseline flex-just-start">
              <span class="my-label">联系方式</span>
              <div class="my-input">
                <q-input
                  borderless
                  dense
                  :bottom-slots="false"
                  :hide-bottom-space="true"
                  v-model="store.phone"
                  placeholder="填写负责人联系电话"
                  type="tel"
                  :rules="[
                  val => !!val || '',
                  // val => val.length == 11 || '请输入11位手机号',
                  val => (/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(19[0-9]{1})|(17[0-9]{1}))+\d{8})$/.test(val)) || ''
                ]"
                />
              </div>
            </div>
            <!-------------item------------------->
          </div>
          <!--------------------------登录信息-------------------------------->
          <div class="my-list-card flex-column flex-align-start flex-just-start">
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-baseline flex-just-start">
              <span class="my-label">登录账号</span>
              <div class="my-input">
                <q-input
                  borderless
                  dense
                  :bottom-slots="false"
                  :hide-bottom-space="true"
                  v-model="store.mobile"
                  placeholder="推荐使用手机号登录"
                  type="tel"
                  :rules="[
                  val => !!val || ''
                ]"
                />
              </div>
            </div>
            <!-------------item------------------->
            <!-------------item------------------->
            <div class="my-list-item-last flex-row flex-align-center flex-just-start">
              <span class="my-label">登录密码</span>
              <q-input
                borderless
                dense
                :bottom-slots="false"
                :hide-bottom-space="true"
                v-model="store.password"
                :readonly="editType === 2"
                :type="editType === 1 ? '' : 'password'"
                style="flex: 2"
                :rules="[
                  val => !!val || ''
              ]"
              />
              <q-btn flat rounded label="重置密码" icon-right="fa fa-angle-right" style="flex: 2;text-align: right;" text-color="grey" v-if="editType === 2" @click="toResetPWD"></q-btn>
            </div>
            <!-------------item------------------->
          </div>
          <!--------------------------银行信息-------------------------------->
          <div class="my-list-card flex-column flex-align-start flex-just-start">
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-baseline flex-just-start">
              <span class="my-label">银行户主</span>
              <div class="my-input">
                <q-input
                  borderless
                  dense
                  :bottom-slots="false"
                  :hide-bottom-space="true"
                  v-model="store.account_owner"
                  placeholder="填写银行户主姓名"
                  :rules="[
                  val => !!val || ''
                ]"
                />
              </div>
            </div>
            <!-------------item------------------->
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-baseline flex-just-start">
              <span class="my-label">银行卡号</span>
              <div class="my-input">
                <q-input
                  borderless
                  dense
                  :bottom-slots="false"
                  :hide-bottom-space="true"
                  v-model="store.bank_account"
                  placeholder="填写银行卡号"
                  :rules="[
                  val => !!val || ''
                ]"
                />
              </div>
            </div>
            <!-------------item------------------->
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-baseline flex-just-start">
              <span class="my-label">银行名称</span>
              <div class="my-input">
                <q-input
                  borderless
                  dense
                  :bottom-slots="false"
                  :hide-bottom-space="true"
                  v-model="store.bank_name"
                  placeholder="填写所开户银行"
                  :rules="[
                  val => !!val || ''
                ]"
                />
              </div>
            </div>
            <!-------------item------------------->
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-baseline flex-just-start">
              <span class="my-label">开户支行</span>
              <div class="my-input">
                <q-input
                  borderless
                  dense
                  :bottom-slots="false"
                  :hide-bottom-space="true"
                  v-model="store.bank_branch"
                  placeholder="填写开户的支行名称"
                  :rules="[
                  val => !!val || ''
                ]"
                />
              </div>
            </div>
            <!-------------item------------------->
            <div class="my-list-item-last flex-row flex-align-center flex-space-between">
              <span class="my-label">门店类型</span>
              <q-btn flat rounded text-color="grey" :label="store.type_name" icon-right="fa fa-angle-right" @click="openTypeList"></q-btn>
            </div>
          </div>
          <!-------------------------上传图片----------------------------------->
          <div class="my-list-card flex-column flex-align-start flex-just-start">
            <div class="card-tit">上传图片<span class="my-tips">（最多三张，第一张为主图）</span></div>
            <!---------隐藏上传触发input--------->
            <div style="display: none">
              <input type="file" accept="image/*"  capture="camera" multiple="multiple" ref="myInput" @change="updateByInput($event)"/>
            </div>
            <!--------------------上传控件-------------------------->
            <div class="my-photos">
              <div class="photo-item" v-for="k in store.photo" :key="k">
                <img :src="`https://${k}`" alt="" class="product-pic">
                <q-inner-loading :showing="k === 'no'">
                  <q-spinner size="50px" color="primary" />
                </q-inner-loading>
                <div class="remove-pic" @click="removePhoto(k)">
                  <div class="remove-icon"></div>
                </div>
              </div>
              <div class="photo-item photo-upload" v-if="store.photo.length < 3" @click="chooseUpload">
                <img src="statics/images/upload.png" alt="">
              </div>
            </div>
          </div>
          <!-------------------------地址----------------------------------->
          <div class="my-list-card flex-column flex-align-start flex-just-start">
            <span class="card-tit">添加地址</span>
            <!-------------item------------------->
            <div class="my-list-item-last flex-row flex-align-center flex-just-start">
              <span class="my-label">详细地址</span>
              <q-input
                borderless
                dense
                :bottom-slots="false"
                :hide-bottom-space="true"
                v-model="store.address"
                style="flex: 3"
                autogrow
                :rules="[
                  val => !!val || ''
                ]"
              />
              <div style="flex: 2" class="text-right" @click="getCoordinate">
                <span class="text-primary">位置</span>
                <q-btn flat rounded icon="fa fa-angle-right" text-color="grey"></q-btn>
              </div>
            </div>
            <!-------------item------------------->
          </div>
        </q-form>
      </q-page>
    </transition>
    <!------------------------dialog-type---------------------------->
    <q-dialog
      v-model="showType"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <type-list :cur="store.typeid" @closeType="closeType" @getChoose="getChoose"></type-list>
    </q-dialog>
    <!---------------------dialog-map--------------------------------------------->
    <q-dialog
      v-model="showMap"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <my-map v-if="showMap" @sub="getMapInfo" :lat1="store.lat" :lng1="store.lng" @closeDialog="closeMap"></my-map>
    </q-dialog>
  </q-page>
</template>

<script>
import urls from 'src/api/api'
import typeList from 'pages/companyManage/chooseType'
import myMap from 'pages/companyManage/mapOfstore'
export default {
  name: 'storeInfo',
  components: {
    typeList,
    myMap
  },
  data () {
    return {
      editType: 1,
      showType: false,
      showMap: false,
      store: {
        id: '',
        shop_name: '',
        shop_username: '',
        phone: '', // 联系方式
        mobile: '', // 登录账号
        password: '888888',
        account_owner: '',
        bank_account: '',
        bank_name: '', // 银行名称
        bank_branch: '', // 分行名称
        typeid: '',
        type_name: '',
        photo: [],
        address: '',
        lat: 30.55059,
        lng: 104.06502,
        recommend_product: ''
      }
    }
  },
  created () {
    let vm = this
    let param = this.$route.params
    if (param.type === 2) {
      this.editType = 2
      for (let k in param.obj) {
        if (vm.store.hasOwnProperty(k)) {
          vm.store[k] = param.obj[k]
        }
      }
    } else {
      vm.queryBank()
    }
  },
  computed: {
  },
  methods: {
    queryBank () {
      let vm = this
      let param = {
        'companyid': this.$q.localStorage.getItem('currentCompany').id
      }
      this.$axios(urls.getBankInfo, param).then(res => {
        for (let k in res.data) {
          if (vm.store.hasOwnProperty(k)) {
            vm.store[k] = res.data[k]
          }
        }
      })
    },
    toResetPWD () {
      this.$router.push({ name: 'ResetPassword', params: { type: 2, id: this.store } })
    },
    goBack () {
      this.$router.push({ name: 'StoreList' })
    },
    openTypeList () {
      this.showType = true
    },
    closeType () {
      this.showType = false
    },
    getChoose (obj) {
      this.store.typeid = obj.typeid
      this.store.type_name = obj.type_name
    },
    removePhoto (k) { // 删除某一张
      let vm = this
      let num = vm.store.photo.indexOf(k)
      if (k !== -1) {
        vm.store.photo.splice(num, 1)
      }
    },
    chooseUpload () { // 选择是相册还是相机上传
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
              vm.store.photo.push('no')
              vm.$axios(urls.uploadImg, params).then(res => {
                if (res.code === 'success') {
                  vm.store.photo.pop()
                  vm.store.photo.push(res.url)
                } else {
                  setTimeout(() => {
                    vm.store.photo.pop()
                    vm.$q.notify(res.message)
                  }, 1000)
                }
              }, () => {
                setTimeout(() => {
                  vm.store.photo.pop()
                  this.$q.notify('上传出错，请检查网络是否通畅')
                }, 1000)
              })
            },
            () => { // on fail
              // this.$q.notify('Could not access device camera.')
            },
            {
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URL, // 返回Base64编码字符串
            }
          )
          /* eslint-disable */
        }
      }).onCancel(() => {

      })
    },
    updateByInput (e) { // 通过input上传---相册上传
      let vm = this
      let file = e.target.files[0]
      let params = {}
      let reader = new FileReader()
      reader.readAsDataURL(file)
      // 一定要在文件读取 成功完成时 再进行相应的操作：上传使用formdata上传
      reader.onload = function () {
        // vm.storeInfo.photo = reader.result
        params = {
          fileName: file.name,
          fileData: reader.result
        }
        vm.store.photo.push('no')
        vm.$axios(urls.uploadImg, params).then(res => {
          if (res.code === 'success') {
            vm.store.photo.pop()
            vm.store.photo.push(res.url)
          } else {
            setTimeout(() => {
              vm.store.photo.pop()
              vm.$q.notify(res.message)
            }, 1000)
          }
        }, () => {
          setTimeout(() => {
            vm.store.photo.pop()
          }, 1000)
          // console.log(err)
        })
      }
    },
    //-------------以下为地图相关--------------
    closeMap () {
      this.showMap = false
    },
    geoSuccess (position) { // 获取地理位置成功
      this.store.lat = position.store.latitude
      this.store.lng = position.store.longitude
      return Promise.resolve()
    },
    geoError (error) { // 获取地理位置失败
      // console.log('error')
      // alert(error.message)
      return Promise.reject(new Error(error))
    },
    getCoordinate () {
      let that = this
      // let address
      if (that.store.address) {
        let param = { address: that.store.address }
        that.$axios(urls.getAddres, param).then(res => {
          if (res.status === 0) {
            that.store.lat = res.result.location.lat
            that.store.lng = res.result.location.lng
          } else if (res.status === 306) {
          } else {
            that.$q.notify(res.message)
          }
          that.showMap = true
        }).catch(() => {
          // that.$q.notify('定位失败，请检查网络是否通畅')
        })
      } else {
        /* eslint-disable */
        async function getGeo () {
          await navigator.geolocation.getCurrentPosition(that.geoSuccess, that.geoError)
        }
        getGeo().then(result => {
          that.showMap = true
        }, err => {
          that.showMap = true
        })
        /* eslint-disable */
      }
    },
    getMapInfo (info) { // 收取经纬度
      this.store.lng = info.lng
      this.store.lat = info.lat
      this.store.address = info.address
      this.showMap = false
    },
    save () { // 保存门店
      let vm = this
      let params = {}
      vm.$refs['myForm'].validate().then(suc => {
        if (suc) {
          // if (vm.store.photo.length < 1) {
          // }
          params = {
            'companyid': vm.$q.localStorage.getItem('currentCompany').id,
            'shop_name': vm.store.shop_name,//门店名称
            'mobile': vm.store.mobile,//登录账号
            'password': vm.store.password,//密码
            'photo': vm.store.photo.join(','),//照片
            'shop_username': vm.store.shop_username,//门店负责人姓名
            'phone': vm.store.phone,//门店电话
            'address': vm.store.address,//详细地址
            'province': '',//省
            'city': '',//市
            'district': '',//区/县
            'lng': vm.store.lng,//经度
            'lat': vm.store.lat,//纬度
            'bank_name': vm.store.bank_name,//银行名称
            'bank_branch': vm.store.bank_branch,//分行名称
            'bank_account': vm.store.bank_account,//银行账户
            'account_owner': vm.store.account_owner,//银行户主
            'typeid': vm.store.typeid,
            'recommend_product': vm.store.recommend_product
          }
          let URL
          if (vm.editType === 1) {
            URL = urls.createShop
            params['password'] = vm.store.password
          } else if (vm.editType === 2) {
            URL = urls.updateShop
            params['id'] = vm.store.id
          }
          vm.$axios(URL, params).then(res => {
            if (res.code === 'success') {
              vm.$q.notify('保存成功')
              setTimeout(() => {
                vm.$router.push({name: 'StoreList'})
              }, 1500)
            } else {
              vm.$q.notify(res.msg)
            }
          }).catch(() => {
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .my-list-card{
    background: #ffffff;
    margin-bottom: .5rem;
    padding: 0 1rem;
  }
  .my-border{
    border-bottom: 1px solid #e6e6e6;
  }
  .card-tit{
    margin-top: 1rem;
    font-size: 2rem;
    color: #000000;
    font-weight: bold;
    margin-bottom: 2rem;
  }
  .my-tips{
    font-size: 1.5rem;
    color: #999999;
  }
  .my-list-item{
    width: 100%;
    padding: 1rem 0;
    border-bottom: 1px solid #e6e6e6;
  }
  .my-list-item-last{
    width: 100%;
    padding: 1rem 0;
  }
  .my-label{
    width: 9rem;
    font-size: 1.6rem;
    color: #000000;
    margin-right: 1rem;
  }
  .my-input{
    flex: 2;
  }
  .my-photos{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .photo-item{
    width: 7rem;
    height: 7rem;
    border: 1px solid #e6e6e6;
    border-radius: .5rem;
    overflow: hidden;
    position: relative;
    margin-bottom: 1rem;
  }
  .product-pic{
    width: 100%;
    height: 100%;
  }
  .remove-pic{
    padding: .5rem 1rem;
    background: #FF3535;
    color: white;
    position: absolute;
    top: 0;
    right: -.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: .6rem;
  }
  .remove-icon{
    width: 1rem;
    border: 1px solid #ffffff;
  }
  .photo-item + .photo-item{
    margin-left: .7rem;
  }
  .photo-upload img{
    width: 100%;
    height: 100%;
  }
</style>
