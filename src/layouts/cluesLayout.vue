<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar  dense>
        <span style="width: 4rem;"></span>
        <q-toolbar-title class="text-center text-white">线索管理</q-toolbar-title>
        <q-btn flat dense class="text-white" label="新建线索" @click="createClues"/>
      </q-toolbar>
      <q-tabs
        dense
        class="text-black bg-white"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-route-tab
          label="私海"
          to="personalclues"
          exact
        />
        <q-route-tab
          label="公海"
          to="allclues"
          exact
        />
<!--        <q-route-tab-->
<!--          label="未通过"-->
<!--          to="auditfalse"-->
<!--          exact-->
<!--        />-->
<!--        <q-route-tab-->
<!--          label="草稿"-->
<!--          to="auditdraft"-->
<!--          exact-->
<!--        />-->
      </q-tabs>
    </q-header>
    <q-page-container class="bgs">
      <router-view />
    </q-page-container>
    <q-footer class="bg-white text-grey-14" bordered>
      <q-tabs no-caps  align="left" active-color="primary" indicator-color="transparent" shrink dense>
        <q-route-tab to="/index/user" label="首页" icon="fa fa-home"></q-route-tab>
        <!--          <q-route-tab to="/page/paysubmit" label="工作台" />-->
        <q-route-tab :to="{ name: 'PersonalClues' }" label="线索管理" icon="fa fa-users"/>
        <q-route-tab :to="{ name: 'AlreadyAudit' }" label="客户管理" icon="fa fa-briefcase"/>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: 'customerLayout',
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  methods: {
    createClues () {
      this.$router.push({ name: 'CluesInfo' })
    }
  }
}
</script>
