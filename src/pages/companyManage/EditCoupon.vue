<template>
  <q-page padding>
    <!-- content -->
    <q-header bordered class="bg-primary text-white  header-fix">
      <q-toolbar>
        <q-btn flat round dense class="text-white" :to="{name: 'CouponList'}" icon="keyboard_arrow_left"/>
        <q-toolbar-title class="text-center text-white">编辑优惠券</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <div class="q-pa-md margins">

      <div class="q-gutter-md">
        <q-input outlined color="green" placeholder="请输入优惠券名称" ref="input" label="优惠券名称" v-model="form.name"
                 :rules="[
            val => !!val || '请输入优惠券名称',
            val => val.length <= 30 || '请输入30字符以内优惠券名称'
          ]">
          <template v-slot:append v-if="form.name !== ''">
            <q-icon name="close" @click="form.name = ''" class="cursor-pointer"/>
          </template>
        </q-input>

        <q-select multiple outlined v-model="form.shopid" :options="shop" ref="input" label="选门店" color="green"
                  emit-value map-options
                  :display-value="`${form.shopid.length ? form.shopid.length : 0 }家门店`"
                  :rules="[
            val => !!val || '请选择门店'
          ]"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section>
                <q-item-label v-html="scope.opt.label" v-model="form.shopid" :val="scope.opt.value"></q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select outlined color="green" v-model="form.couponStat" ref="input" :options="couponStatList" label="优惠券类型"
                  :rules="[
            val => !!val || '请选择优惠券类型'
          ]"
        ></q-select>

        <!-- 满减券 -->
        <q-input v-if="form.couponStat.value == 1" outlined color="green" placeholder="请输入满多少元金额" ref="input"
                 label="满多少元" v-model="form.fullmoney"
                 :rules="[
            val => !!val || '请输入满多少元金额',
            val => (/(^[1-9]\d*$)/.test(val)) || '请输入正确金额'
          ]">
          <template v-slot:append v-if="form.fullmoney !== ''">
            <q-icon name="close" @click="form.fullmoney = ''" class="cursor-pointer"/>
          </template>
        </q-input>

        <q-input v-if="form.couponStat.value == 1" outlined color="green" placeholder="请输入满多少元抵扣金额" ref="input"
                 label="抵扣金额" v-model="form.deduction"
                 :rules="[
            val => !!val || '请输入满多少元抵扣金额',
            val => (/(^[1-9]\d*$)/.test(val)) || '请输入正确金额'
          ]">
          <template v-slot:append v-if="form.deduction !== ''">
            <q-icon name="close" @click="form.deduction = ''" class="cursor-pointer"/>
          </template>
        </q-input>

        <!--        <q-input v-if="form.couponStat.value == 1" outlined color="green" placeholder="请输入需花费知了贝数量" ref="input" label="花费知了贝" v-model="form.cost_dc"-->
        <!--                 :rules="[-->
        <!--            val => !!val || '请输入正确数值',-->
        <!--            val => (/(^[1-9]\d*$)/.test(val)) || '请输入正确数值'-->
        <!--          ]">-->
        <!--          <template v-slot:append v-if="form.cost_dc !== ''">-->
        <!--            <q-icon name="close" @click="form.cost_dc = ''" class="cursor-pointer" />-->
        <!--          </template>-->
        <!--        </q-input>-->

        <!-- 套餐券 -->
        <q-input v-if="form.couponStat.value == 2" outlined color="green" placeholder="请输入套餐名称" ref="input" label="套餐名称"
                 v-model="form.product_name"
                 :rules="[
            val => !!val || '请输入套餐名称'
          ]">
          <template v-slot:append v-if="form.product_name !== ''">
            <q-icon name="close" @click="form.product_name = ''" class="cursor-pointer"/>
          </template>
        </q-input>
        <q-input v-if="form.couponStat.value == 2" outlined color="green" placeholder="请输入原价金额" ref="input" label="原价"
                 v-model="form.original"
                 :rules="[
            val => !!val || '请输入原价金额',
            val => (/(^[1-9]\d*$)/.test(val)) || '请输入正确原价'
          ]">
          <template v-slot:append v-if="form.original !== ''">
            <q-icon name="close" @click="form.original = ''" class="cursor-pointer"/>
          </template>
        </q-input>

        <q-input v-if="form.couponStat.value == 2" outlined color="green" placeholder="请输入现价金额" ref="input" label="现价"
                 v-model="form.present"
                 :rules="[
            val => !!val || '请输入现价金额',
            val => (/(^[1-9]\d*$)/.test(val)) || '请输入正确金额'
          ]">
          <template v-slot:append v-if="form.present !== ''">
            <q-icon name="close" @click="form.present = ''" class="cursor-pointer"/>
          </template>
        </q-input>
        <!--        <q-input v-if="form.couponStat.value == 2" outlined color="green" placeholder="请输入需花费知了贝数量" ref="input" label="花费知了贝" v-model="form.cost_dc"-->
        <!--                 :rules="[-->
        <!--            val => !!val || '请输入正确数值',-->
        <!--            val => (/(^[1-9]\d*$)/.test(val)) || '请输入正确数值'-->
        <!--          ]">-->
        <!--          <template v-slot:append v-if="form.cost_dc !== ''">-->
        <!--            <q-icon name="close" @click="form.cost_dc = ''" class="cursor-pointer" />-->
        <!--          </template>-->
        <!--        </q-input>-->

        <q-input outlined color="green" placeholder="请选择时间" ref="input" label="生效时间" v-model="form.startDate"
                 :rules="[val => !!val || '请选择生效时间']">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="form.startDate" mask="YYYY-MM-DD HH:mm"/>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="form.startDate" mask="YYYY-MM-DD HH:mm" format24h/>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input outlined color="green" placeholder="请选择时间" ref="input" label="失效时间" v-model="form.endDate"
                 :rules="[val => !!val || '请选择失效时间']">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="form.endDate" mask="YYYY-MM-DD HH:mm"/>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="form.endDate" mask="YYYY-MM-DD HH:mm" format24h/>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input outlined color="green" placeholder="请输入发放数量" ref="input" label="发放数量" v-model="form.nums"
                 :rules="[
            val => !!val || '请输入发放数量',
            val => (/(^[1-9]\d*$)/.test(val)) || '请输入正确数量'
          ]">
          <template v-slot:append v-if="form.nums !== ''">
            <q-icon name="close" @click="form.nums = ''" class="cursor-pointer"/>
          </template>
        </q-input>

        <q-input outlined color="green" type="textarea" placeholder="请输入优惠券介绍" ref="input" label="优惠券介绍"
                 v-model="form.desc">
          <template v-slot:append v-if="form.desc !== ''">
            <q-icon name="close" @click="form.desc = ''" class="cursor-pointer"/>
          </template>
        </q-input>

        <!-- <div class="q-pa-xs">
          <q-btn color="green" class="full-width" :disable="loginbtn" @click="submitCheck" label="编辑优惠券"></q-btn>
        </div> -->

      </div>
      <div class="custom-form-btn text-center q-pa-sm">
        <q-btn class="text-white" color="primary" @click="submitCheck">保存优惠券</q-btn>
      </div>
    </div>
    <!--    <q-footer class="footer" @click="submitCheck">保存优惠券</q-footer>-->
  </q-page>
</template>

<script>
// import {that.$q.notify} from 'src/utils/popups'
// import {getShopApi, submitUpdataCouponApi} from 'src/api/coupon'

// function getNowFormatDate (day) {
//   let now = new Date()
//   if (day == 1) {
//     var date = new Date(now.getTime() + 24 * 60 * 60 * 1000);
//   } else {
//     var date = new Date(now.getTime());
//   }
//   let seperator1 = "-";
//   let seperator2 = ":";
//   let month = date.getMonth() + 1;
//   let strDate = date.getDate();
//   if (month >= 1 && month <= 9) {
//     month = "0" + month;
//   }
//
//   if (strDate >= 0 && strDate <= 9) {
//     strDate = "0" + strDate;
//   }
//
//   var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes()
//     + seperator2 + date.getSeconds();
//   return currentdate;
//
// }

import urls from 'src/api/api'
export default {
  name: 'CreateCoupon',
  data () {
    return {
      loginbtn: false,
      shop: [],
      couponStatList: [{ label: '满减券', value: 1 }, { label: '套餐券', value: 2 }],
      form: {
        name: '',
        product_name: '',
        shopid: [],
        couponStat: { label: '满减券', value: 1 },
        fullmoney: '',
        deduction: '',
        cost_dc: undefined,
        original: '',
        present: '',
        startDate: '',
        endDate: '',
        nums: '',
        desc: ''
      }
    }
  },
  created () {
    // console.log(this.$route.params)
    this.form.fullmoney = this.$route.params.total_cost || ''
    this.form.present = this.$route.params.discount_price || ''
    this.form.deduction = this.$route.params.save || ''
    this.form.endDate = this.$route.params.expired_time || ''
    this.form.nums = this.$route.params.inventory || ''
    this.form.desc = this.$route.params.coupon_desc || ''
    this.form.couponStat.label = this.$route.params.coupon_type_name || ''
    this.form.original = this.$route.params.price || ''
    this.form.cost_dc = this.$route.params.cost_dc || 0
    this.form.name = this.$route.params.coupon_name || ''
    this.form.product_name = this.$route.params.product_name || ''
    this.form.startDate = this.$route.params.valid_time || ''
    this.form.couponStat.value = this.$route.params.coupon_type || ''
    this.form.id = this.$route.params.id || ''
    this.form.coupon_status = this.$route.params.coupon_status || ''
    this.getCouponShop(this.$route.params.id)
  },
  methods: {
    reset () {
      this.$refs.input.resetValidation()
    },
    submitCheck () {
      let that = this
      if (this.form.name === '') {
        that.$q.notify('请输入优惠券名称')
      } else if (this.form.shopid.length === 0) {
        that.$q.notify('请选择门店')
      } else if (this.form.couponStat === '1') {
        that.$q.notify('请选择优惠券类型')
      } else if (this.form.fullmoney === '' && this.form.couponStat === '1') {
        that.$q.notify('请输入满多少元金额')
      } else if (this.form.deduction === '' && this.form.couponStat === '1') {
        that.$q.notify('请输入满多少元抵扣金额')
      } else if (this.form.original === '' && this.form.couponStat === '2') {
        that.$q.notify('请输入原价金额')
      } else if (this.form.present === '' && this.form.couponStat === '2') {
        that.$q.notify('请输入现价金额')
      } else if (this.form.nums === '') {
        that.$q.notify('请输入优惠券数量')
      } else if (this.form.id === '') {
        that.$q.notify('编辑优惠券错误，请从新编辑')
        setTimeout(() => {
          this.$router.push({ name: 'Coupon' })
        }, 1500)
      } else {
        that.loginbtn = true
        that.submit()
      }
    },
    submit () {
      // console.log(this.form.coupon_status)
      let that = this
      let data = {
        'shopids': this.form.shopid,
        'total_cost': this.form.fullmoney,
        'discount_price': this.form.present,
        'save': this.form.deduction,
        'expired_time': this.form.endDate,
        'inventory': this.form.nums,
        'coupon_desc': this.form.desc,
        'coupon_name': this.form.name,
        'companyid': this.$route.params.companyid,
        'cost_dc': this.form.cost_dc,
        'price': this.form.original,
        'product_name': this.form.product_name,
        'valid_time': this.form.startDate,
        'coupon_type': this.form.couponStat.value,
        'id': this.form.id,
        'coupon_status': this.form.coupon_status
      }
      this.$axios(urls.saveUpdateCoupon, data).then(res => {
        if (res.code === 'success') {
          that.$q.notify('编辑优惠券成功')
          setTimeout(() => {
            that.$router.push({ name: 'Coupon' })
          }, 1500)
        } else {
          that.$q.notify(res.message)
        }
      }).catch(err => {
        that.loginbtn = false
        that.$q.notify(JSON.stringify(err))
      })
    },
    getCouponShop (id) {
      let data = { 'couponid': id, 'companyid': this.$q.localStorage.getItem('currentCompany').id }
      this.$axios(urls.queryCouponShop, data).then(res => {
        // console.log('res', res)
        let data = res.allShop
        let newData = []
        let oneDate = []
        for (let i = 0; i < data.length; i++) {
          newData.push({ label: data[i].shop_name, value: data[i].id })
        }
        for (let j = 0; j < res.checkedShop.length; j++) {
          oneDate.push(res.checkedShop[j])
        }
        this.shop = newData
        this.form.shopid = oneDate
      }).catch(err => {
        this.$q.notify(JSON.stringify(err))
      })
    }
  }
}
</script>
<style scoped>
  .q-item {
    margin-bottom: 5px;
  }

  .q-item--active {
    background-color: rgba(33, 186, 69, 0.1)
  }

  .list-from {
    padding-bottom: 20px;
  }

  .footer {
    height: 50px;
    line-height: 50px;
    background-color: #8dc550;
    text-align: center;
    position: fixed;
    bottom: 0;
    font-size: 16px;
  }
</style>
