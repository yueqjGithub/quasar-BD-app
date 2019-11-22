<template>
<q-layout view="lHh Lpr lFf">
  <q-page-container>
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
  name: 'userLayout',

  data () {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>
