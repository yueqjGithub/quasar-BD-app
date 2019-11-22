<template>
  <q-page class="bg-white">
    <q-header class="header-fix text-white bg-primary">
      <q-toolbar  dense>
        <q-btn icon="keyboard_arrow_left" flat dense round @click="goBack()"></q-btn>
        <q-toolbar-title class="text-center">{{editType === 1 ? '新建线索' : '修改线索'}}</q-toolbar-title>
        <span class="custom-tit-position"></span>
      </q-toolbar>
    </q-header>
    <q-form ref="myForm">
      <q-list separator>
        <q-item>
          <q-item-section>
            <span class="font-xs">商家名称</span>
          </q-item-section>
          <q-item-section></q-item-section>
          <q-item-section side>
            <q-input
              dense
              :items-aligned="true"
              :no-error-icon="true"
              :hide-bottom-space="true"
              borderless
              v-model="form.company_name"
              placeholder="请输入商家名称"
              :rules="[
                  val => !!val || '请输入商家名称'
                ]"
            ></q-input>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <span class="font-xs">负责人姓名</span>
          </q-item-section>
          <q-item-section></q-item-section>
          <q-item-section side>
            <q-input
              dense
              borderless
              :items-aligned="true"
              :no-error-icon="true"
              :hide-bottom-space="true"
              v-model="form.head_person"
              placeholder="请输入负责人姓名"
            ></q-input>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <span class="font-xs">负责人联系方式</span>
          </q-item-section>
          <q-item-section></q-item-section>
          <q-item-section side>
            <q-input
              dense
              borderless
              v-model="form.legal_mobile"
              placeholder="请输入手机号"
              :items-aligned="true"
              :no-error-icon="true"
              :hide-bottom-space="true"
              error-message="手机号格式错误"
              :error="!valiPhone"
            ></q-input>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <span class="font-xs">详细地址</span>
          </q-item-section>
          <q-item-section></q-item-section>
          <q-item-section side>
            <q-input
              borderless
              dense
              style="width: 80%"
              :items-aligned="true"
              :no-error-icon="true"
              :hide-bottom-space="true"
              v-model="form.address"
              autogrow
              placeholder="填写详细地址"
            >
              <template v-slot:append>
                <q-btn flat size="sm" @click="getCoordinate" icon="fa fa-angle-right"></q-btn>
              </template>
            </q-input>
<!--            <div>-->
<!--              <q-btn flat size="sm" @click="getCoordinate" icon="fa fa-angle-right"></q-btn>-->
<!--            </div>-->
          </q-item-section>
        </q-item>
<!--        <q-item>-->
<!--          <q-item-section>-->
<!--            <span class="font-xs">日志</span>-->
<!--          </q-item-section>-->
<!--          <q-item-section></q-item-section>-->
<!--          <q-item-section side>-->
<!--            <q-btn flat size="sm" icon="fa fa-angle-right" @click="toLogPage"></q-btn>-->
<!--          </q-item-section>-->
<!--        </q-item>-->
        <q-item>
          <q-item-section></q-item-section>
          <q-item-section>
            <q-btn color="primary" @click="subClues">保存</q-btn>
          </q-item-section>
          <q-item-section></q-item-section>
        </q-item>
      </q-list>
    </q-form>
    <q-dialog
      v-model="drawer"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <store-map v-if="drawer" @sub="getMapInfo" :lat1="form.lat" :lng1="form.lng" @closeDialog="closeDialog"></store-map>
    </q-dialog>
  </q-page>
</template>

<script>
import storeMap from 'src/pages/companyManage/mapOfstore'
import urls from 'src/api/api'
export default {
  name: 'shopInfo',
  components: {
    storeMap
  },
  data () {
    return {
      editType: 1, // 1-新建，2-修改
      drawer: false,
      form: {
        id: undefined,
        company_name: '', //
        head_person: '', //
        legal_mobile: '', //
        address: '', //
        lat: '',
        lng: ''
      }
    }
  },
  created () {
    let init = this.$route.params
    let vm = this
    if (init.type && init.type === 2) {
      vm.editType = 2
      let obj = init.obj
      for (let k in obj) {
        if (vm.form.hasOwnProperty(k)) {
          vm.form[k] = obj[k]
        }
      }
    }
  },
  computed: {
    valiPhone () {
      let r = true
      if (this.form.legal_mobile) {
        let reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(19[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (!reg.test(this.form.legal_mobile)) {
          r = false
        }
      }
      return r
    }
  },
  methods: {
    subClues () {
      let vm = this
      this.$refs['myForm'].validate().then(suc => {
        if (suc) {
          let param = {
            company_name: vm.form.company_name, //
            head_person: vm.form.head_person, //
            legal_mobile: vm.form.legal_mobile, //
            address: vm.form.address //
          }
          let URL = urls.createClues
          let path = 'AllClues'
          if (vm.editType === 2) {
            param['id'] = vm.form.id
            URL = urls.updateClues
            path = 'PersonalClues'
          }

          vm.$axios(URL, param).then(res => {
            let code = res.code
            if (code === 'success') {
              vm.$q.notify('操作成功')
              setTimeout(() => {
                vm.$router.push({ name: path })
              }, 1500)
            } else {
              vm.$q.notify(res.msg)
            }
          }, () => {
            vm.$q.notify('操作失败，请稍后再试')
          })
        }
      })
    },
    closeDialog () {
      this.drawer = false
    },
    getMapInfo (info) { // 收取经纬度
      this.form.lng = info.lng
      this.form.lat = info.lat
      this.form.address = info.address
      this.drawer = false
    },
    geoSuccess (position) { // 获取地理位置成功
      this.lat = position.coords.latitude
      this.lng = position.coords.longitude
    },
    geoError (error) { // 获取地理位置失败
      alert(error.message)
    },
    goBack () {
      this.$router.go(-1)
    },
    getCoordinate () { // 获取定位
      let that = this
      // let address
      if (that.form.address) {
        let param = { address: that.form.address }
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
  }
}
</script>

<style scoped>
.repair-input{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
