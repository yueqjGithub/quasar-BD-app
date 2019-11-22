<template>
  <div class="bgs">
    <q-toolbar class="text-white bg-primary">
      <q-toolbar-title>
        <span class="font-sm">关联门店</span>
      </q-toolbar-title>
      <q-btn flat class="text-white font-md" @click="close" icon="fa fa-times"></q-btn>
    </q-toolbar>
    <div class="clues-list q-pa-sm">
      <div v-for="k in cluesList" :key="k.id" class="q-pa-sm clues-item bg-white">
        <div style="flex: 1">
          <q-checkbox v-model="choose" :val="k.id" />
        </div>
        <div style="flex: 5">
          <div class="item-row">
            <div>{{k.company_name}}</div>
            <div>创建日期：{{k.create_time}}</div>
          </div>
          <div class="text-left">
            <div>地址：{{k.address}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-bottom bg-primary text-white text-center">
      <q-btn flat size="md" class="full-width" @click="subChoose">保存</q-btn>
    </div>
  </div>
</template>

<script>
import urls from 'src/api/api'
export default {
  name: 'shopList',
  props: {
    before: {
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      cluesList: [],
      choose: []
    }
  },
  created () {
    let vm = this
    if (vm.before.length > 0) {
      vm.choose.push(...vm.before)
    }
    this.$axios(urls.queryPersonalClues, null).then(res => {
      // console.log(res)
      vm.cluesList = [...res.list]
    }, err => {
      console.log(err)
    })
  },
  methods: {
    close () {
      this.$emit('closeShop')
    },
    subChoose () {
      this.$emit('sub', this.choose)
      this.$emit('closeShop')
    }
  }
}
</script>

<style scoped>
.clues-item{
  box-shadow: 2px 2px 2px 0px #e0e0e0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.clues-item + .clues-item {
  margin-top: 4px;
}
.item-row{
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
</style>
