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
      <div class="flex-row flex-align-center flex-space-between q-pa-md my-border" v-for="k in list" :key="k.value" @click="choose(k)">
        <span class="shop-name">{{k.label}}</span>
        <img src="statics/images/check.png" alt="" class="my-check" v-if="cur === k.value">
        <div class="my-n-check" v-else></div>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'public',
  props: ['before'],
  data () {
    return {
      cur: [],
      list: [
        { label: '待审核', value: 0 },
        { label: '上架', value: 3 },
        { label: '下架', value: 4 }
      ]
    }
  },
  created () {
    this.cur = this.before
  },
  methods: {
    close () {
      this.$emit('close')
    },
    choose (val) {
      this.cur = val.value
    },
    save () {
      // let arr = [...this.cur]
      // for (let k in this.cur) {
      //   arr.push({'shopid': this.cur[k]})
      // }
      this.$emit('getPub', this.cur)
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
