<template>
  <q-page>
    <q-header bordered class="bg-primary text-white  header-fix">
      <q-toolbar>
        <q-btn flat round dense class="text-white" @click="goBack" icon="keyboard_arrow_left" />
        <q-toolbar-title class="text-center text-white">门店({{storeList.length}})</q-toolbar-title>
        <q-btn flat dense class="text-white" @click="toEdit(1, null)" label="创建门店" />
      </q-toolbar>
    </q-header>
    <q-page class="q-pa-md bg-white">
      <div v-for="k in storeList" :key="k.id" class="my-shop flex-row q-pa-md">
        <div class="shop-img">
          <img :src="`https://${k.photo[0]}`" alt="">
        </div>
        <div class="shop-info flex-column">
          <span class="shop-name">{{k.shop_name}}</span>
          <span class="shop-count">上架菜品数量：{{k.total || 0}}</span>
        </div>
        <div class="shop-edit">
          <q-btn icon="img:statics/images/edit.png" flat round @click="toEdit(2, k)"></q-btn>
        </div>
      </div>
    </q-page>
  </q-page>
</template>

<script>
import urls from 'src/api/api'
export default {
  name: 'StoresList',
  data () {
    return {
      iconSize: '1rem',
      placeImg: '',
      storeList: []
    }
  },
  created () {
    // queryShopListByCompanyId
    let vm = this
    let params = {
      // 'isM': 'm',
      'companyid': this.$q.localStorage.getItem('currentCompany').id
    }
    vm.$axios(urls.queryShopListByCompanyId, params).then(res => {
      if (res.code === 'success') {
        for (let k in res.list) {
          if (res.list[k].photo) {
            let arr = res.list[k].photo.split(',')
            res.list[k].photo = arr
          }
        }
        vm.storeList = [...res.list]
      }
    }, err => {
      vm.$q.notify(JSON.stringify(err))
    })
    // let vm = this
    // getShopList(null).then(res => {
    //     vm.storeList = [...res.list]
    // }, err => {
    //     console.log(err)
    // })
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'AppList' })
    },
    toEdit (type, obj) {
      this.$router.push({ name: 'StoreInfo', params: { type: type, obj: obj } })
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
    height: calc((100vw - 5rem)/9*2);
    background: #F5F5F5;
  }
  .shop-img img{
    width: 100%;
    height: 100%;
  }
  .shop-info{
    flex: 6;
    justify-content: flex-start;
    margin-left: 1rem;
  }
  .shop-edit{
    flex: 1;
    justify-content: flex-start;
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
    margin-top: 2rem;
  }
</style>
