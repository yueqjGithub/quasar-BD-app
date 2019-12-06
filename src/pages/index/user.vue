<template>
  <q-page class="bgs q-pa-sm">
    <q-toolbar class="text-black">
      <q-toolbar-title>
        BD概况
      </q-toolbar-title>
<!--      <q-btn :to="{name: 'Fmap'}" flat color="primary">-->
      <q-btn color="negative" size="sm" @click="logout">
        退出登录
      </q-btn>
    </q-toolbar>
    <!---------------------概况--------------------------->
    <q-card class="q-pa-sm">
      <q-card-section>
        <div class="custom-status-div">
          <div class="status-left status-arrow-div">
            <div class="status-big text-center">
              <p class="text-primary font-big">{{indexInfo.all_company_num || 0}}</p>
              <p>签约商户</p>
            </div>
            <div class="status-mid">
              <div class="status-new text-center">
                <p class="text-primary font-sm">{{indexInfo.day_company_num || 0}}</p>
                <p>今日新增</p>
              </div>
              <div class="status-new text-center">
                <p class="text-primary font-sm">{{indexInfo.month_company_num || 0}}</p>
                <p>本月新增</p>
              </div>
            </div>
          </div>
          <div class="status-right status-arrow-div">
            <div class="status-big text-center">
              <p class="text-positive font-big">{{indexInfo.all_shopCount || 0}}</p>
              <p>签约门店</p>
            </div>
            <div class="status-mid">
              <div class="status-new text-center">
                <p class="text-positive font-sm">{{indexInfo.day_shopCount || 0}}</p>
                <p>今日新增</p>
              </div>
              <div class="status-new text-center">
                <p class="text-positive font-sm">{{indexInfo.month_shopCount || 0}}</p>
                <p>本月新增</p>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <!-------------加载---------------->
      <q-inner-loading :showing="showLoading1">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
    <!---------------------业绩情况--------------------------->
    <q-toolbar class="text-black">
      <q-toolbar-title>
        业绩情况
      </q-toolbar-title>
<!--      <q-btn tp="" flat color="primary">作战地图</q-btn>-->
    </q-toolbar>
    <q-table
      :data="indexInfo.results"
      :columns="columns"
      row-key="name"
      virtual-scroll
      :hide-bottom="true"
      table-style="max-height: 40vh"
      separator="none"
      :pagination="pageNation"
    >
    </q-table>
    <div class="row">
      <div class="col-6 text-left sum">合计</div>
      <div class="col-6 text-right sum">{{indexInfo.total}}</div>
    </div>
  </q-page>
</template>

<script>
import urls from 'src/api/api'
export default {
  name: 'user',
  data () {
    return {
      showLoading1: false,
      showLoading2: false,
      indexInfo: {
        all_company_num: 0, // 商户
        day_company_num: 0, // 今日新增
        month_company_num: 0, // 本月新增
        all_shopCount: 0, // 门店
        day_shopCount: 0, // 今日新增
        month_shopCount: 0, // 本月新增
        results: [],
        total: 0
      },
      columns: [
        { name: 'shop_name', label: '签约门店', field: 'shop_name', align: 'left' },
        { name: 'cost_coupon_count', label: '券核销量', field: 'cost_coupon_count' }
      ],
      pageNation: {
        rowsPerPage: 0
      }
    }
  },
  created () {
    let vm = this
    vm.showLoading1 = true
    vm.showLoading2 = true
    this.$axios(urls.selectDayFromCompany, {}).then(res => {
      let code = res.code
      if (code === 'success') {
        // alert(JSON.stringify(res))
        for (let k in res) {
          if (vm.indexInfo.hasOwnProperty(k)) {
            vm.indexInfo[k] = res[k]
          }
        }
      } else {
        vm.$q.notify(res.msg)
      }
      vm.showLoading1 = false
    }, err => {
      vm.$q.notify(JSON.stringify(err))
      vm.showLoading1 = false
    })
    this.$axios(urls.getSituation, {}).then(res => {
      this.indexInfo.results = res.shops
      this.indexInfo.total = res.total.total
      vm.showLoading2 = false
    }, () => {
      // console.log(err)
      vm.showLoading2 = false
    })
  },
  // beforeRouteLeave (to, from, next) {
  //   this.indexInfo = {
  //     all_company_num: 0, // 商户
  //     day_company_num: 0, // 今日新增
  //     month_company_num: 0, // 本月新增
  //     all_shopCount: 0, // 门店
  //     day_shopCount: 0, // 今日新增
  //     month_shopCount: 0, // 本月新增
  //     results: [],
  //     total: 0
  //   }
  //   next()
  // },
  methods: {
    logout () {
      this.$q.dialog({
        title: '提示',
        message: '确定要退出吗',
        ok: '确认',
        cancel: '取消'
      }).onOk(() => {
        this.$q.localStorage.clear()
        this.$router.push({ name: 'login' })
      }).onCancel(() => {
      })
    }
  }
}
</script>

<style scoped>
.custom-status-div{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status-arrow-div{
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.status-mid{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sum {
  padding: 7px 16px;
}
</style>
