<template>
  <q-page>
    <q-header class="my-border">
      <div class="my-header text-black q-pa-sm bg-white">
        <div class="my-header-l">
          <q-btn flat round icon="img:statics/images/back-B.png" @click="goBack"></q-btn>
        </div>
        <div class="my-header-m text-center" style="flex: 2;">菜品管理</div>
        <div class="my-header-r">
          <q-btn rounded unelevated flat label="新建菜品" text-color="primary" class="word-no-wrap" @click="toEdit(1, null)"></q-btn>
        </div>
      </div>
    </q-header>
    <transition
      appear
      enter-active-class="animated slideInRight"
      leave-active-class="animated slideOutLeft"
    >
      <q-page class="q-pa-sm bg-white">
        <div v-for="k in list" :key="k.productid" class="my-shop flex-row q-pa-md">
          <div class="shop-img">
            <img :src="`https://${k.photo[0]}`" alt="">
          </div>
          <div class="shop-info flex-column">
            <span class="shop-name">{{k.product_name}}</span>
            <span class="shop-count">门店价格：￥{{k.price}}</span>
            <span class="shop-count">供应价格：￥{{k.buy_price}}</span>
            <span class="shop-count">库存总量：{{k.total_count}}</span>
          </div>
          <div class="shop-edit flex-column flex-align-center flex-space-around">
              <span v-if="k.check_status === 0" class="text-warning">待审核</span>
<!--              <span v-if="k.check_status === 1" class="text-green-2">审核通过</span>-->
<!--              <span v-if="k.check_status === 2" class="text-negative">审核未通过</span>-->
              <span v-if="k.check_status === 3" class="text-info">上架</span>
              <span v-if="k.check_status === 4" class="text-tips">下架</span>
              <q-btn unelevated text-color="grey" outline size="sm" @click="toEdit(2, k)" style="margin-top: .4rem">编辑</q-btn>
          </div>
        </div>
      </q-page>
    </transition>
  </q-page>
</template>

<script>
import urls from 'src/api/api'
export default {
  name: 'StoresList',
  data () {
    return {
      list: []
    }
  },
  created () {
    // let param = this.$route.params
    this.queryInfo()
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'AppList' })
    },
    queryInfo () {
      let vm = this
      let params = {
        'companyid': this.$q.localStorage.getItem('currentCompany').id
      }
      this.$axios(urls.queryMyProduct, params).then(res => {
        if (res.code === 'success') {
          for (let k in res.list) {
            if (res.list[k].photo) {
              let arr = res.list[k].photo.split(',')
              res.list[k].photo = arr
            }
          }
          vm.list = [...res.list]
        }
      }, () => {
      })
    },
    toEdit (type, obj) {
      this.$router.push({ name: 'ProductInfo', params: { type: type, obj: obj } })
    }
  }
}
</script>

<style scoped>
  .my-header{
    border-bottom: 1px solid #E6E6E6;
  }
  .my-shop{
    border-bottom: 1px solid #e9e9e9;
  }
  .shop-img{
    flex: 2;
    border: 1px solid #e6e6e6;
    border-radius: 3px;
    height: calc((100vw - 5rem)/7*2);
    background: #F5F5F5;
  }
  .shop-img img{
    width: 100%;
    height: 100%;
  }
  .shop-info{
    flex: 3;
    justify-content: flex-start;
    margin-left: 1rem;
  }
  .shop-edit{
    flex: 2;
    justify-content: center;
    border-left: 1px dotted #e6e6e6;
  }
  .shop-name{
    margin-top: .5rem;
    color: #000000;
    font-size: 1.8rem;
    font-weight: bold;
  }
  .shop-count{
    font-size: 1.2rem;
    color: #666666;
    margin-top: .8rem;
    line-height: 1;
  }
</style>
