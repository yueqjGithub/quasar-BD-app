<template>
  <q-card class="bg-white my-type">
    <div class="my-header text-black q-pa-sm bg-white my-border">
      <div class="my-header-l">
        <q-btn flat round icon="img:statics/images/back-B.png" @click="close"></q-btn>
      </div>
      <div class="my-header-m text-center">发放门店</div>
      <div class="my-header-r text-right">
        <q-btn flat unelevated label="保存" text-color="primary" class="word-no-wrap" @click="save"></q-btn>
      </div>
    </div>
    <!--------------------cont---------------------------->
    <div class="q-pa-sm">
      <div class="flex-row flex-align-center flex-space-between q-pa-md my-border" v-for="k in list" :key="k.id" @click="choose(k)">
        <span class="shop-name">{{k.shop_name}}</span>
        <img src="statics/images/check.png" alt="" class="my-check" v-if="cur.indexOf(k.id) !== -1">
        <div class="my-n-check" v-else></div>
      </div>
    </div>
  </q-card>
</template>

<script>
import urls from 'src/api/api'
export default {
  name: 'shopList',
  props: ['before'],
  data () {
    return {
      cur: [],
      list: []
    }
  },
  created () {
    if (this.before.length > 0) {
      for (let k in this.before) {
        this.cur.push(this.before[k])
      }
    }
    this.queryShopList()
  },
  methods: {
    close () {
      this.$emit('close')
    },
    queryShopList () {
      let vm = this
      let params = {
        'companyid': this.$q.localStorage.getItem('currentCompany').id
      }
      this.$axios(urls.getShops, params).then(res => {
        vm.list = res.list
      }, () => {})
    },
    choose (val) {
      if (this.cur.indexOf(val.id) === -1) {
        this.cur.push(val.id)
      } else {
        let num = this.cur.indexOf(val.id)
        this.cur.splice(num, 1)
      }
    },
    save () {
      let arr = [...this.cur]
      // for (let k in this.cur) {
      //   arr.push({'shopid': this.cur[k]})
      // }
      this.$emit('getShop', arr)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.my-border{
  border-bottom: 1px solid #e6e6e6 !important;
}
.shop-name{
  font-size: 1.6rem;
}
.my-check{
  width: 1.5rem;
  height: 1.5rem;
}
.my-n-check{
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 1px solid #A0A0A0;
}
</style>
