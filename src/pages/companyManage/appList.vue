<template>
  <q-page>
    <q-header class="bg-primary text-white  header-fix">
      <q-toolbar>
        <q-btn icon="keyboard_arrow_left" flat dense round class="text-white" @click="goBack()"></q-btn>
        <q-toolbar-title class="text-center text-white">商户管理</q-toolbar-title>
        <span class="custom-tit-position"></span>
      </q-toolbar>
    </q-header>
    <q-page>
      <div class="custom-list-item custom-section custom-mat-sm">
        <q-item clickable v-ripple @click="toLink('StoreList')">
          <q-item-section>
            <div class="my-list flex-row flex-space-between flex-align-center">
              <span class="link-word">门店管理</span>
              <q-btn flat round icon="fa fa-chevron-right" size="sm" class="c-tips"></q-btn>
            </div>
          </q-item-section>
        </q-item>
      </div>
      <div class="custom-list-item custom-section custom-mat-sm ma-tp">
        <q-item clickable v-ripple @click="toLink('Product')">
          <q-item-section>
            <div class="my-list flex-row flex-space-between flex-align-center">
              <span class="link-word">菜品管理</span>
              <q-btn flat round icon="fa fa-chevron-right" size="sm" class="c-tips"></q-btn>
            </div>
          </q-item-section>
        </q-item>
      </div>
    </q-page>
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
