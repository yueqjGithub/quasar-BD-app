<template>
  <q-page>
    <q-header class="bg-primary text-white  header-fix">
      <q-toolbar>
        <q-btn icon="keyboard_arrow_left" flat dense round class="text-white" @click="goBack()"></q-btn>
        <q-toolbar-title class="text-center text-white">商户管理</q-toolbar-title>
        <span class="custom-tit-position"></span>
      </q-toolbar>
    </q-header>
    <div class="custom-list-item custom-section custom-mat-sm">
      <q-item clickable v-ripple @click="toLink('StoreList')">
        <q-item-section side>
          <q-icon name="fa fa-map-marker" :size="iconSize"></q-icon>
        </q-item-section>
        <q-item-section>
          <span class="mine-list-tit">门店</span>
        </q-item-section>
        <q-item-section side>
          <q-icon name="fa fa-chevron-right" :size="iconSize"></q-icon>
        </q-item-section>
      </q-item>
    </div>
    <div class="custom-list-item custom-section custom-mat-sm">
      <q-item clickable v-ripple @click="toLink('CouponList')">
        <q-item-section side>
          <q-icon name="img:https://pic.iidingyun.com/8696022/upload/merchantapp/icon1@2x.png" :size="iconSize"></q-icon>
        </q-item-section>
        <q-item-section>
          <span class="mine-list-tit">优惠券</span>
        </q-item-section>
        <q-item-section side>
          <q-icon name="fa fa-chevron-right" :size="iconSize"></q-icon>
        </q-item-section>
      </q-item>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'AppList',
  data () {
    return {
      iconSize: '1rem'
    }
  },
  created () {
  },
  methods: {
    toLink (name) {
      let id = this.$q.localStorage.getItem('currentCompany').id
      this.$router.push({ name: name, params: { id: id } })
    },
    goBack () {
      this.$router.push({ name: 'AlreadyAudit' })
    }
  }
}
</script>

<style scoped>

</style>
