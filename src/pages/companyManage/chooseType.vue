<template>
  <q-card class="bg-white my-type">
    <div class="my-header text-black q-pa-sm bg-white my-border">
      <div class="my-header-l">
        <q-btn flat round icon="img:statics/images/back-B.png" @click="close"></q-btn>
      </div>
      <div class="my-header-m text-center">标签管理</div>
      <div class="my-header-r">
        <q-btn flat unelevated label="保存" text-color="primary" class="word-no-wrap" @click="sub"></q-btn>
      </div>
    </div>
    <!----------cont--------------->
    <div class="list-ul q-pa-sm">
      <div v-for="k in list" :key="k.typeid" class="list-li normal-list" :class="{'choose-list': k.typeid === myCur.typeid}" @click="changeType(k)">{{k.type_name}}</div>
    </div>
  </q-card>
</template>

<script>
import urls from 'src/api/api'
export default {
  name: 'chooseType',
  props: ['cur'],
  data () {
    return {
      list: [],
      myCur: {
        type_name: '',
        typeid: null
      }
    }
  },
  created () {
    this.myCur.typeid = this.cur
    this.getType()
  },
  methods: {
    getType () {
      this.$axios(urls.queryShopTypeList, {}).then(res => {
        if (res.code === 'success') {
          this.list = res.list
        }
      }, () => {})
    },
    close () {
      this.$emit('closeType')
    },
    changeType (k) {
      if (this.myCur.typeid !== k.typeid) {
        this.myCur.typeid = k.typeid
        this.myCur.type_name = k.type_name
      } else {
        this.myCur = {
          type_name: '',
          typeid: null
        }
      }
    },
    sub () {
      this.$emit('getChoose', this.myCur)
      this.$emit('closeType')
    }
  }
}
</script>

<style scoped>
.my-border{
  border-bottom: 1px solid #e6e6e6 !important;
}
.list-ul{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.list-li{
  width: 49%;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6rem;
  padding: 2rem;
  border-radius: 5px;
  /*border: 1px solid red;*/
}
.normal-list{
  background: #F8F8F8;
  color: #000000;
}
.choose-list{
  background: #2D35A3;
  color: #ffffff;
}
</style>
