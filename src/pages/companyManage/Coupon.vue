<template>
  <q-page>
    <q-header bordered class="bg-primary text-white  header-fix">
      <q-toolbar>
        <q-btn flat round dense class="text-white" @click="goBack" icon="keyboard_arrow_left"/>
        <q-toolbar-title class="text-center text-white">优惠券管理</q-toolbar-title>
        <q-btn flat dense class="text-white" :to="{name:'CreateCoupon'}" label="新增优惠券"/>
      </q-toolbar>
    </q-header>
    <div class="coupon-list" ref="scrollTargetRef">
      <q-pull-to-refresh @refresh="refresh" color="positive" icon="lightbulb">
<!--        <q-infinite-scroll  @load="onLoadRef" :offset="300" :scroll-target="$refs.scrollTargetRef">-->

        <div class="row no-wrap li" v-for="(item, index) in items" :key="index">
          <div class="col-2">
            <div class="fl coupon-avator">
                <span v-if="item.coupon_type == 1" class="coupon-avator-icon">
                  ¥<span class="coupon-cost">{{item.save ? item.save : 0}}</span>
                </span>
              <span v-if="item.coupon_type == 2" class="coupon-avator-icon">
                  ¥<span class="coupon-cost">{{item.price - item.discount_price}}</span>
                </span>
              <!--                <img :src="item.photo">-->
              <div class="coupon-avator-split"></div>
              <span class="coupon-invent">库存{{item.inventory ? item.inventory : 0}}</span>
            </div>
          </div>
          <div class="col-7">
            <div class="center">
              <div class="h3">{{item.coupon_name}}</div>
              <div class="strong" v-if="item.coupon_type == 1">满<span>{{item.total_cost}}</span>元可用</div>
              <div class="strong" v-else-if="item.coupon_type == 2">
                <del class="before-price">原价¥{{item.price}}</del>
                现价¥<span>{{item.discount_price}}</span></div>
              <div class="span">{{item.create_time | timeFilter}}至{{item.expired_time | timeFilter}}</div>
            </div>
          </div>
          <div class="col-3">
            <div class="fr">
              <div class="h4">{{item.coupon_status_name}}</div>
              <div class="btns" v-if="item.coupon_status == 1" @click="toCouponStatus(item.id,0)">下架</div>
              <div v-else-if="item.coupon_status ==0">
                <div class="btns no" @click="toCouponStatus(item.id,2)">上架</div>
                <div class="btns no borderno" @click="toCouponStatus(item,5)">编辑</div>
              </div>
              <div class="btns" v-else-if="item.coupon_status ==2" @click="toCouponStatus(item,5)">编辑</div>
              <div class="btns" v-else-if="item.coupon_status ==3" @click="toCouponStatus(item,5)">修改</div>
            </div>
          </div>
        </div>
<!--        <template v-slot:loading>-->
<!--          <div class="row justify-center q-my-md">-->
<!--            <q-spinner-dots color="primary" size="40px" />-->
<!--          </div>-->
<!--        </template>-->

<!--        </q-infinite-scroll>-->
      </q-pull-to-refresh>
    </div>

  </q-page>
</template>

<script>
// import { date } from 'quasar'
// import { this.$q.notify } from 'src/utils/popups'
import { toTime } from 'src/api/filter.js'
// import {getCouponApi, updataCouponApi} from 'src/api/coupon'
import urls from 'src/api/api'
export default {
  name: 'Coupon',
  data () {
    return {
      items: [],
      page: 1,
      pageCount: 200
    }
  },
  created () {
    this.onLoadRef()
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'AppList' })
    },
    onLoadRef () {
      // setTimeout(() => {
      let data = { 'thisPage': this.page, 'pageCount': this.pageCount, 'companyid': this.$q.localStorage.getItem('currentCompany').id }
      this.$axios(urls.queryCouponList, data).then(res => {
        if (res.list.length !== 0) {
          this.items = [...this.items, ...res.list]
          // done()
        }
      }).catch(err => {
        this.$q.notify(JSON.stringify(err))
      })

      // }, 2000)
    },
    refresh (done) {
      setTimeout(() => {
        this.items = []
        let data = { 'thisPage': 1, 'pageCount': this.pageCount }
        this.$axios(data).then(res => {
          this.items = [...res.list]
          done()
        }).catch(() => {
          // console.log(err)
        })
      }, 1000)
    },
    toCouponStatus (id, stat) {
      if (stat === 5) {
        this.$router.push({
          name: 'EditCoupon',
          params: id
        })
      } else {
        let that = this
        let data = { id: id, coupon_status: stat }
        this.$axios(data).then(res => {
          if (res.code === 'success') {
            if (stat === 0) {
              this.$q.notify('下架优惠券成功')
              that.items = []
              that.onLoadRef()
            } else if (stat === 2) {
              this.$q.notify('上架优惠券成功')
              that.items = []
              that.onLoadRef()
            }
          }
        }).catch(() => {
          // console.log(err)
        })
      }
    }
  },
  filters: {
    timeFilter (time) {
      let times = toTime(time) || ''
      return times[0]
    }
  }
}
</script>
<style scoped>
  .coupon-list .li {
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
  }

  .coupon-list .fl {
    position: relative;
  }

  .coupon-list .fl img {
    width: 100%;
    border: 1px solid #ccc;
  }

  /*background-color: rgba(0, 0, 0, 0.6);*/
  /*.coupon-list .fl span{width: 100%;height: 20px;font-size: 12px;color: #fff;position: absolute;left: 0;bottom: 0;z-index: 1;display: block;text-align: center;line-height: 20px;}*/
  .coupon-list .center {
    text-align: left;
    margin: 0 10px;
  }

  .coupon-list .center .h3 {
    font-size: 12px;
    margin: 5px 0;
  }

  .coupon-list .center .strong, .coupon-list .center .p {
    font-size: 12px;
    color: #333;
    margin: 5px 0;
  }

  .coupon-list .center .strong span {
    color: #fc6701;
    font-weight: bold
  }

  .coupon-list .center .span {
    margin-top: 10px;
    color: #888;
    font-size: 0.6rem;
  }

  .coupon-list .fr {
    width: 100%;
  }

  .coupon-list .fr .h4 {
    text-align: center;
    font-size: 12px;
    margin-top: 5px
  }

  .coupon-list .fr .btns {
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin-top: 5px;
    border: 1px solid #8dc550;
    border-radius: 3px;
    font-size: 12px;
    color: #8dc550
  }

  .coupon-list .fr .btns.no {
    margin-top: 5px;
  }

  .coupon-list .fr .btns.borderno {
    border: 0
  }

  .coupon-avator {
    height: 16vw;
    /*margin-top: 2%;*/
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .coupon-avator span {
    color: #ffffff;
  }

  .coupon-cost {
    font-size: 1.5rem;
    font-weight: bold;
    color: #fc8801 !important;
  }

  .coupon-avator-icon {
    color: #fc8801 !important;
  }

  .coupon-invent {
    white-space: nowrap;
    font-size: 12px;
  }

  .coupon-status {
    color: red;
  }

  .coupon-avator-split {
    height: 1px;
    width: 100%;
    background: #cccccc;
  }

  .before-price {
    color: #888888;
    margin-right: 4px;
  }
</style>
