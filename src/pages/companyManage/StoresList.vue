<template>
  <q-page>
    <q-header bordered class="bg-primary text-white  header-fix">
      <q-toolbar>
        <q-btn flat round dense class="text-white" @click="goBack" icon="keyboard_arrow_left" />
        <q-toolbar-title class="text-center text-white">门店({{storeList.length}})</q-toolbar-title>
        <q-btn flat dense class="text-white" :to="{name:'StoreInfo', params: {type: 1}}" label="创建门店" />
      </q-toolbar>
    </q-header>
    <div class="store-main q-pa-sm">
      <div class="store-item q-pa-md" v-for="k in storeList" :key="k.index">
        <div class="store-img">
          <q-img
            :src="'https://' + k.photo"
            spinner-color="white"
            style="width:5rem;height: 5rem;"
            :placeholder-src="placeImg"
          >
          </q-img>
        </div>
        <!---------------------------文字信息----------------------------------->
        <div class="store-info">
          <q-item>
            <q-item-section side>
              <span class="store-name">{{k.shop_name}}</span>
            </q-item-section>
            <q-item-section></q-item-section>
            <q-item-section side>
              <q-icon name="create" :size="iconSize" @click="toDetail(k)"></q-icon>
            </q-item-section>
          </q-item>
          <div class="store-address">
            <q-icon name="fa fa-map-marker" class="address-icon"></q-icon>
            <span>{{k.address}}</span>
          </div>
        </div>
      </div>
    </div>
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
      vm.storeList = [...res.list]
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
      this.$router.go(-1)
    },
    toDetail (info) {
      this.$router.push({ name: 'StoreInfo', params: { type: 2, shop: info } })
    }
  }
}
</script>

<style scoped>
.store-main{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.store-item{
  background: #ffffff;
  border-radius: 5px;
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: flex-start;
}
.store-info{
  width: calc(100vmin - 6rem);
}
.store-name{
  font-size: 1.2rem;
}
.address-icon{
  color: #757575;
  margin-right: .25rem;
  font-size: 1rem;
}
.store-address{
  padding: .5rem 1rem;
}
</style>
