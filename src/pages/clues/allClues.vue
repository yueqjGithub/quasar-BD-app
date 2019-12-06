<template>
  <q-page>
    <q-expansion-item dense expand-separator expand-icon-toggle class="bg-white custom-border-top" v-model="showSearch">
      <template v-slot:header>
        <div class="clues-search">
          <div class="clues-search-input">
            <q-input
              dense
              outlined
              v-model="searchContent.company_name"
              @input="search"
            >
              <template v-slot:prepend>
                <q-icon name="fa fa-search" size="xs"/>
              </template>
            </q-input>
          </div>
        </div>
      </template>

      <div class="clues-search-cont q-pa-md">
        <p class="text-grey">是否有BD跟进</p>
        <div>
          <q-radio v-model="searchContent.follow_status" :val="k.value" :label="k.label" v-for="k in filterOptions.hasBD" :key="k.label"/>
        </div>
        <p class="text-grey">是否已上单</p>
        <div>
          <q-radio v-model="searchContent.accomplish_status" :val="k.value" :label="k.label" v-for="k in filterOptions.hasOrder" :key="k.label"/>
        </div>
      </div>
      <div class="cluse-btn-group">
        <q-item clickable v-ripple class="cluse-btn" @click="resetSearch">
          <q-item-section>重置</q-item-section>
        </q-item>
        <q-item clickable v-ripple class="cluse-btn clues-btn-border-left">
          <q-item-section @click="btnSearch">搜索</q-item-section>
        </q-item>
      </div>
    </q-expansion-item>
    <!------------------------以下为列表------------------------------->
    <div class="clues-list q-pa-sm">
      <q-pull-to-refresh @refresh="refreshList">
        <q-infinite-scroll @load="turnPage" :offset="1" :disable="datas.length < 20 || page > totalPage" class="custom-infinite" ref="clues-all-infinite">
          <div class="custom-card q-pa-sm" v-for="k in datas" :key="k.index">
            <div class="custom-card-list row">
              <span class="font-sm col-5">
                {{k.company_name}}
              </span>
              <span :class="k.status === 2 ? 'text-green' : ''" class="col-4">BD人员：{{k.current_sales_name || '无'}}</span>
              <q-btn flat size="sm" @click="showMoreDialog(k)">更多></q-btn>
            </div>
            <div class="custom-card-list">
              <span class="font-xs text-black">地址：{{k.address}}</span>
              <span class="font-xs text-black">创建日期：{{k.create_time.substr(0,10)}}</span>
            </div>
            <div class="custom-btn-group" v-if="k.status === 0">
              <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="editClues(k)">修改详情</q-btn>
              <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="holdInMine(k)">跟进</q-btn>
            </div>
          </div>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
            <div class="q-pa-sm text-center" v-if="!showLoading" style="height: 40px">
              <span>没有更多啦</span>
            </div>
          </template>
        </q-infinite-scroll>
      </q-pull-to-refresh>
    </div>
    <!--------------------------------dialog0---------------------------------------------->
    <q-dialog v-model="showMore" :persistent="true">
      <div class="more-div">
        <q-card class="q-pa-md bg-white">
          <div class="more-list">
            <div class="more-label"></div>
            <div class="more-content">商家名称：{{detail.company_name}}</div>
          </div>
          <div class="more-list">
            <div class="more-label"></div>
            <div class="more-content">负责人姓名：{{detail.head_person}}</div>
          </div>
          <div class="more-list" v-if="detail.current_salesid === self || detail.status === 0">
            <div class="more-label"></div>
            <div class="more-content">负责人联系方式：{{detail.legal_mobile}}</div>
          </div>
          <div class="more-list">
            <div class="more-label"></div>
            <div class="more-content">地址：{{detail.address}}</div>
          </div>
<!--          <p style="margin: .3rem 0;">拜访日志：</p>-->
          <p style="margin: .3rem 0;" v-if="detail.status === 0 || detail.current_salesid === self">拜访日志：</p>
          <q-scroll-area class="word-break logs-content" :horizontal="false" v-if="detail.status === 0 || detail.current_salesid === self">
            <q-btn color="negative" flat icon="fa fa-exclamation" label="暂无拜访记录" disable class="full-width" v-if="detail.logs.length < 1"></q-btn>
            <div class="logs-item q-pa-sm" v-for="k in detail.logs" :key="k.index" v-else>
              <div class="logs-tit">
                <span>{{k.visit_time}}</span>
              </div>
              <div class="logs-tit">
                <span>拜访对象：{{k.visit_person}}</span>
                <span>{{k.visit_person_mobile}}</span>
              </div>
              <p>
                {{k.visit_content}}
              </p>
            </div>
          </q-scroll-area>
        </q-card>
        <div class="text-center q-ma-md">
          <q-btn round class="bg-white text-black" icon="fa fa-times" v-close-popup></q-btn>
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import urls from 'src/api/api'
export default {
  name: 'allClues',
  data () {
    return {
      showSearch: false,
      page: 1,
      pageCount: 20,
      totalPage: 0,
      showLoading: true,
      showMore: false,
      searchContent: {
        company_name: undefined,
        follow_status: undefined,
        accomplish_status: undefined
      },
      filterOptions: {
        hasBD: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
        hasOrder: [{ label: '是', value: 1 }, { label: '否', value: 0 }]
      },
      user: '',
      datas: [],
      detail: {
        logs: []
      }
    }
  },
  created () {
    let params = { 'thisPage': this.page, 'pageCount': this.pageCount }
    this.queryData(params)
    let saleid = this.$q.localStorage.getItem('userId')
    this.user = saleid // 赋值user用作判断是否显示单条线索下的按钮
  },
  computed: {
    self () {
      let a = this.$q.localStorage.getItem('userId')
      return Number(a)
    }
  },
  methods: {
    showMoreDialog (obj) { // 点击更多
      let vm = this
      Object.assign(vm.detail, obj)
      if (obj.status === 0) {
        let params = {
          'clueid': obj.id
        }
        vm.$axios(urls.queryLogOfPersonalClues, params).then(res => {
          let code = res.code
          if (code === 'success') {
            vm.detail['logs'] = [...res.list]
          } else {
            vm.$q.notify(res.msg)
          }
        }, () => {
        })
      }
      vm.showMore = true
    },
    holdInMine (k) { // 跟进
      let vm = this
      // /api/mkt2/service/mkt_clue/update.vm
      // console.log(k)
      vm.$q.dialog({
        title: '',
        message: '确认要跟进该线索吗',
        ok: '确认',
        cancel: '取消',
        persistent: true
      }).onOk(() => {
        let param = {
          'id': k.id,
          'private_or_public': 1, // 公海还是私海的状态0为公海状态1为私海状态
          'sale_follow_status': 1 // 销售人员跟进状态0为未跟进1为跟进中2为已成为商户
        }
        this.$axios(urls.holdInMine, param).then(res => {
          let code = res.code
          if (code === 'success') {
            vm.$q.notify('操作成功')
            vm.searchContent = {
              company_name: undefined,
              follow_status: undefined,
              accomplish_status: undefined
            }
            vm.refreshList()
          } else {
            vm.$q.notify(res.msg)
          }
        })
      }).onCancel(() => {})
    },
    editClues (obj) { // 修改线索
      this.$router.push({ name: 'CluesInfo', params: { type: 2, obj: obj } })
    },
    resetSearch () {
      this.searchContent = {
        company_name: '',
        follow_status: undefined,
        accomplish_status: undefined
      }
    },
    queryData (params) {
      // let params = {}
      this.loading = true
      this.$axios(urls.queryAllClues, params).then(res => {
        let code = res.code
        if (code === 'success') {
          this.datas = [...res.list]
          this.totalPage = res.totalPage
        } else {
          this.$q.notify(res.msg)
        }
        this.loading = false
      }, () => {
        this.$q.notify('获取公海数据失败，请稍后再试')
        this.loading = false
      })
    },
    btnSearch () { // 按钮搜索
      this.page = 1
      this.showLoading = true
      let params = {
        'thisPage': 1,
        'pageCount': this.pageCount,
        ...this.searchContent
      }
      this.queryData(params)
      this.showSearch = false
    },
    search () { // 搜索栏变更搜索
      let vm = this
      let oldVal = vm.searchContent.company_name
      vm.page = 1
      vm.showLoading = true
      setTimeout(() => {
        if (vm.searchContent.company_name === oldVal) {
          if (vm.searchContent.company_name) {
            let params = {
              'thisPage': 1,
              'pageCount': this.pageCount,
              ...vm.searchContent
            }
            vm.queryData(params)
          }
        }
      }, 800)
    },
    refreshList (done) { // 下拉刷新
      let vm = this
      vm.searchContent = {
        company_name: '',
        follow_status: undefined,
        accomplish_status: undefined
      }
      vm.page = 1
      vm.showLoading = true
      let params = {
        'thisPage': 1,
        'pageCount': this.pageCount
      }
      async function getInfo () {
        await vm.queryData(params)
        done()
      }
      getInfo()
    },
    turnPage (index, done) {
      let vm = this
      let params = {
        'thisPage': this.page + 1,
        'pageCount': this.pageCount,
        ...vm.searchContent
      }
      setTimeout(() => {
        vm.$axios(urls.queryAllClues, params).then(res => {
          let code = res.code
          if (code === 'success') {
            if (res.list.length > 0) {
              vm.datas = [...vm.datas, ...res.list]
              // Array.prototype.push.apply(vm.datas)
              vm.totalPage = res.totalPage
              vm.page++
            } else {
              vm.page++
              vm.$q.notify('没有更多啦')
            }
            done() // 终极方案，page+1，上啦加载执行条件，page-totalPage < 1
          } else {
            this.$q.notify(res.msg)
            vm.showLoading = false
          }
        }, () => {
          this.$q.notify('获取公海数据失败，请稍后再试')
        })
      }, 1000)
    }
  }
}
</script>

<style scoped>
.clues-search{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.clues-search-input{
  width: 100%;
  /*margin-right: 3%;*/
}
.custom-border-top{
  border-top: 1px solid #e0e0e0;
  padding: 5px 0 5px 0;
}
.clues-search-cont{
}
.cluse-btn-group{
  width: 100%;
  border-top: 1px solid #e0e0e0;
  display: flex;
}
/*.clues-list{*/
/*  margin-top: 7vmax;*/
/*}*/
.cluse-btn{
  width: 50%;
  text-align: center;
}
.clues-btn-border-left{
  border-left: 1px solid #e0e0e0;
}
.custom-card-list{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.custom-card-list + .custom-card-list {
  margin-top: .25rem;
}
.custom-btn-group{
  padding-top: .5rem;
  border-top: 1px solid #e0e0e0;
}
.custom-list-div{
  min-height: 72vh;
}
.more-div{
  width: 80vw;
  min-height: 30vh;
  background: transparent;
  box-shadow: none;
}
.more-list{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.more-list + .more-list {
  margin-top: .3rem;
}
.more-label {
  /*width: 4.5rem;*/
  /*margin-right: .3rem;*/
}
.clues-log{
  margin-top: .5rem;
  height: 40vh;
}
.logs-item{
  border: 1px solid #e0e0e0;
}
.logs-item + .logs-item{
  margin-top: .4rem;
  margin-bottom: 2px;
}
.logs-tit{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logs-content{
  height: 40vh;
}
.custom-infinite{
  min-height: 130vh;
}
</style>
