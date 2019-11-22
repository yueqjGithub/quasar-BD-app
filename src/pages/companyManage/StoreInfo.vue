<template>
  <q-page class="store-info-main">
    <q-header bordered class="bg-primary text-white  header-fix">
      <q-toolbar>
        <q-btn flat round dense class="text-white" @click="goBack" icon="keyboard_arrow_left" />
        <q-toolbar-title class="text-center text-white">{{editType === 1 ? '创建门店' : '修改门店' }}</q-toolbar-title>
        <q-btn flat dense class="text-white" @click="saveStore" label="完成" />
      </q-toolbar>
    </q-header>
    <q-form class="q-pa-sm" ref="myForm">
      <q-card>
        <q-card-section>
          <span class="store-card-tit">门店信息</span>
        </q-card-section>
        <q-separator inset/>
        <q-card-section>
          <div class="store-info-row">
            <span class="store-info-label">门店名称</span>
            <div class="store-info-input">
              <q-input
                borderless
                dense
                v-model="storeInfo.shop_name"
                placeholder="填写门店名称"
                :rules="[
                  val => !!val || '请输入门店名称'
                ]"
              />
            </div>
          </div>
        </q-card-section>
        <!-------------账号---------------------------->
        <q-separator inset/>
        <q-card-section>
          <div class="store-info-row">
            <span class="store-info-label">账号</span>
            <div class="store-info-input">
              <q-input
                borderless
                dense
                v-model="storeInfo.mobile"
                :disable="editType === 2"
                placeholder="设置推荐手机号码或1至11位数字"
                :rules="[
                  val => !!val || '请输入账号',
                  val => (/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(19[0-9]{1})|(17[0-9]{1}))+\d{8})$/.test(val)) || '请输入正确的手机号'
                ]"
              />
            </div>
          </div>
        </q-card-section>
        <!-------------密码---------------------------->
        <q-separator inset/>
        <q-card-section>
          <div class="store-info-row">
            <span class="store-info-label">密码</span>
            <div class="store-info-input info-input-btn">
              <q-input
                :type="editType === 2 ? 'password': ''"
                borderless
                dense
                v-if="editType === 1"
                v-model="storeInfo.pwd"
                placeholder="设置1至11位数字"
                style="width: 60%"
                :rules="[
                  val => !!val || '请输入密码',
                  val => val.toString().length >= 1 || '不能小于1位',
                  val => val.toString().length <= 11 || '不能大于11位'
                ]"
              />
              <q-btn color="primary" size="sm" v-if="editType === 2" :to="{name: 'ResetPassword', params: {type: 2, id: storeInfo}}">重置密码</q-btn>
            </div>
          </div>
        </q-card-section>
        <!-------------是否开通营销活动---------------------------->
        <q-separator inset/>
        <q-card-section>
          <div class="store-info-row">
            <span class="store-info-label">
              <span class="text-red">*</span>
              营销活动
            </span>
            <div class="store-info-input info-input-btn">
              <q-select borderless v-model="storeInfo.market_status" :options="marketArr" label="" emit-value style="width: 100%" map-options
                        :rules="[
                  val => val !== undefined || ''
                ]"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <!------------------------------上传图片------------------------>
      <q-card class="q-pa-sm store-info-section">
        <q-card-section>
          <div class="store-img-div">
            <div class="store-img-left">
              <p class="store-card-tit">上传图片</p>
              <p>上传门店门头照片，更容易识别</p>
            </div>
            <div class="store-img-right">
              <q-avatar square size="4rem" color="primary" @click="updateAvatar">
                <img :src="'https://' + storeInfo.photo" v-if="storeInfo.photo">
                <span v-else class="text-white">+</span>
              </q-avatar>
            </div>
            <div style="display: none">
              <input type="file" accept="image/*"  capture="camera" ref="myInput" @change="changeAvator"/>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <!--------------------------负责人信息------------------------------>
      <q-card class="q-pa-sm store-info-section">
        <q-card-section>
          <span class="store-card-tit">负责人信息</span>
        </q-card-section>
        <q-separator inset/>
        <q-card-section>
          <div class="store-info-row">
            <span class="store-info-label">姓名</span>
            <div class="store-info-input">
              <q-input
                borderless
                dense
                v-model="storeInfo.shop_username"
                placeholder="负责人姓名"
              />
            </div>
          </div>
        </q-card-section>
        <!-------------负责人手机号---------------------------->
        <q-separator inset/>
        <q-card-section>
          <div class="store-info-row">
            <span class="store-info-label">手机号码</span>
            <div class="store-info-input">
              <q-input
                borderless
                dense
                v-model="storeInfo.phone"
                placeholder="负责人手机号码"
                :error="!valiPhone"
                :error-message="'手机号格式错误'"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <!-------------------------------地区信息----------------------------------->
      <q-card class="q-pa-sm store-info-section">
        <q-card-section>
          <span class="store-card-tit">添加地址</span>
        </q-card-section>
        <q-separator inset/>
        <!----------------------------地区选择------------------------------>
        <!-------------负责人手机号---------------------------->
        <q-separator inset/>
<!--        <q-card-section>-->
<!--          <div class="store-info-row">-->
<!--            <span class="store-info-label">所在地区</span>-->
<!--            <div class="store-info-input area-select">-->
<!--              <q-select borderless v-model="province1" :options="cityList" @input="getProvince" label="省"-->
<!--                :rules="[-->
<!--                  val => !!val || ''-->
<!--                ]"-->
<!--              />-->
<!--              <q-select borderless v-model="city1" :options="cityArr" label="市" @input="getCity"-->
<!--                  :rules="[-->
<!--                  val => !!val || ''-->
<!--                ]"-->
<!--              />-->
<!--              <q-select borderless v-model="district1" :options="districtArr" label="区" @input="getDistrict"-->
<!--                  :rules="[-->
<!--                  val => !!val || ''-->
<!--                ]"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->
<!--        </q-card-section>-->
        <!----------------------------详细地址------------------------->
        <q-separator inset/>
        <q-card-section>
          <div class="store-info-row">
            <span class="store-info-label">详细地址</span>
            <div class="store-info-input area-select">
              <q-input
                borderless
                dense
                autogrow
                type="textarea"
                style="width: 60%"
                v-model="storeInfo.address"
                placeholder="填写详细地址"
              />
              <q-btn color="primary" size="sm" @click="getCoordinate">定位</q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-form>
    <q-dialog
      v-model="drawer"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <store-map v-if="drawer" @sub="getMapInfo" :lat1="storeInfo.lat" :lng1="storeInfo.lng" @closeDialog="closeDialog"></store-map>
    </q-dialog>
  </q-page>
</template>

<script>
// import {notify} from 'src/utils/popups'
import urls from 'src/api/api'
import cityList from 'src/api/cityList'
import storeMap from 'src/pages/companyManage/mapOfstore'
// import { getAddress, createShop, uploadImg, updateShop } from 'src/api/store'
export default {
  name: 'StoreInfo',
  components: {
    storeMap
  },
  data () {
    return {
      editType: 1, // 1-创建，2-修改
      drawer: false,
      cityList: cityList,
      cityArr: [],
      districtArr: [],
      province1: undefined,
      city1: undefined,
      district1: undefined,
      marketArr: [{ label: '开通营销活动', value: 1 }, { label: '不开通营销活动', value: 0 }],
      storeInfo: {
        admin_userid: '',
        id: '',
        shop_name: '', // 店名
        mobile: '', // 账号
        pwd: '',
        photo: '', // 图片
        shop_username: '', // 负责人姓名
        phone: '', // 负责人电话
        province: undefined,
        city: undefined,
        district: undefined,
        address: '',
        lng: undefined,
        lat: undefined,
        market_status: undefined // 是否开通营销活动
      }
    }
  },
  computed: {
    valiPhone () {
      let val = this.storeInfo.phone
      let r = true
      if (val) {
        let reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(19[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (!reg.test(val)) {
          r = false
        }
      }
      return r
    }
  },
  created () {
    let opt = this.$route.params
    this.editType = opt.type
    if (opt.type === 2) { // 编辑已有门店时
      // console.log(opt.shop)
      this.storeInfo.id = opt.shop.id
      this.storeInfo.admin_userid = opt.shop.admin_userid
      this.storeInfo.shop_name = opt.shop.shop_name
      this.storeInfo.mobile = opt.shop.mobile
      this.storeInfo.market_status = opt.shop.market_status
      // this.pwd = opt.shop.
      this.storeInfo.photo = opt.shop.photo
      this.storeInfo.shop_username = opt.shop.shop_username
      this.storeInfo.phone = opt.shop.phone
      // let cityList = this.cityList.find(item => item.value === Number(opt.shop.province))
      // this.storeInfo.province = cityList.value
      // this.province1 = cityList
      // this.cityArr = cityList.children
      // let districtList = cityList.children.find(item => item.value === Number(opt.shop.city))
      // this.storeInfo.city = districtList.value
      // this.city1 = districtList
      // this.districtArr = districtList.children
      // let areaList = districtList.children.find(item => item.value === Number(opt.shop.district))
      // this.storeInfo.district = areaList.value
      // this.district1 = areaList
      this.storeInfo.address = opt.shop.address
      this.storeInfo.lng = opt.shop.lng
      this.storeInfo.lat = opt.shop.lat
    }
  },
  methods: {
    geoSuccess (position) { // 获取地理位置成功
      this.storeInfo.lat = position.coords.latitude
      this.storeInfo.lng = position.coords.longitude
    },
    geoError (error) { // 获取地理位置失败
      alert(error.message)
    },
    goBack () {
      this.$router.go(-1)
    },
    closeDialog () {
      this.drawer = false
    },
    getCoordinate () {
      let that = this
      // let address
      if (that.storeInfo.address) {
        let param = { address: that.storeInfo.address }
        that.$axios(urls.getAddres, param).then(res => {
          // console.log(res)
          if (res.status === 0) {
            that.storeInfo.lat = res.result.location.lat
            that.storeInfo.lng = res.result.location.lng
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
      this.storeInfo.lng = info.lng
      this.storeInfo.lat = info.lat
      this.storeInfo.address = info.address
      this.drawer = false
    },
    updateAvatar () {
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
                  vm.storeInfo.photo = res.url
                } else {
                  vm.$q.notify(res.message)
                }
              }, () => {
                this.$q.notify('上传出错，请检查网络是否通畅')
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
    changeAvator (e) {
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
          vm.$axios(urls.uploadImg, params).then(res => {
            if (res.code === 'success') {
                vm.storeInfo.photo = res.url
            } else {
                vm.$q.notify(res.message)
            }
          }, () => {
              // console.log(err)
          })
      }
    },
    getProvince (val) {
        // console.log(val)
        let list = this.cityList.find(item => item.value === val.value).children
        this.cityArr = [...list]
        this.storeInfo.province = val.value
    },
    getCity (val) {
        let list = this.cityArr.find(item => item.value === val.value).children
        this.districtArr = [...list]
        this.storeInfo.city = val.value
    },
    getDistrict (val) {
      this.storeInfo.district = val.value
    },
    saveStore () { // 保存门店
      let vm = this
      // let fm = new FormData()
      let params = {}
      vm.$refs['myForm'].validate().then(suc => {
        if (suc) { // 验证完毕
            // if (!vm.storeInfo.photo) {
            //   vm.$q.notify('请上传门店照片')
            //   return false
            // }
            if (!vm.storeInfo.lat || !vm.storeInfo.lng) {
              vm.$q.notify('请点击定位获取经纬度')
              return false
            }
            params['shop_name'] =  vm.storeInfo.shop_name
            params['companyid'] =  vm.$q.localStorage.getItem('currentCompany').id
            params['mobile'] =  vm.storeInfo.mobile
            params['photo'] =  vm.storeInfo.photo
            params['shop_username'] =  vm.storeInfo.shop_username
            params['phone'] =  vm.storeInfo.phone
            params['market_status'] =  vm.storeInfo.market_status
            params['address'] =  vm.storeInfo.address
            params['province'] =  vm.storeInfo.province
            params['district'] =  vm.storeInfo.district
            params['city'] =  vm.storeInfo.city
            params['lng'] =  vm.storeInfo.lng
            params['lat'] =  vm.storeInfo.lat
            if (vm.editType === 1) { // 创建时
              // fm.append('passowrd', vm.storeInfo.pwd)
              params['passowrd'] =  vm.storeInfo.pwd
            } else {
              // fm.append('id', vm.storeInfo.id)
              params['id'] =  vm.storeInfo.id
            }
            // 以下两行代码将formdata转换为object，传到后台超长，报错
            // let params = {}
            // fm.forEach((value, key) => params[key] = value)
            if (vm.editType === 1) {
                vm.$axios(urls.createShop, params).then(res => { // 创建时
                  if (res.code === 'success') {
                    vm.$q.notify(res.msg)
                    vm.$router.push({name: 'StoreList'})
                  } else {
                    vm.$q.notify(res.msg)
                  }
                }).catch(() => {
                    // console.log(err)
                })
            } else if (vm.editType === 2) { // 修改时
                vm.$axios(urls.updateShop, params).then(res => {
                  if (res.code === 'success') {
                    vm.$q.notify(res.msg)
                    vm.$router.push({name: 'StoreList'})
                  } else {
                    vm.$q.notify(res.msg)
                  }
                }).catch(() => {
                    // console.log(err)
                })
            }
        }
      })

    }
  }
}
</script>

<style scoped>
.store-info-main .q-card__section{
  padding: .3rem 1rem;
}
.store-card-tit{
  font-size: 1.2rem;
}
.store-info-row{
  display: flex;
  justify-content: space-around;
  align-items: baseline;
}
.store-info-label{
  width: 6rem;
  font-size: 1rem;
}
.store-info-input{
  width: calc(100vmin - 8rem);
}
.info-input-btn{
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: nowrap;
}
.store-img-div{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.store-img-left{
  width: calc(100vmin - 8rem);
}
.store-info-section{
  margin-top: 1rem;
}
.area-select{
  display: flex;
  align-items: baseline;
  justify-content: space-around;
}
</style>
