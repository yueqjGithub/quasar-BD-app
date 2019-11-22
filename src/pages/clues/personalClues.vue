<template>
  <q-page>
    <!----------------------------sous----------------------------->
    <div class="clues-search bg-white custom-border-top">
      <div class="clues-search-input">
        <q-input
          dense
          outlined
          v-model.lazy="searchContent.content"
          @input="search"
        >
          <template v-slot:prepend>
            <q-icon name="fa fa-search" size="xs"/>
          </template>
        </q-input>
      </div>
    </div>
    <!----------------------------sous----------------------------->
    <div class="clues-list q-pa-sm">
      <q-pull-to-refresh @refresh="refreshList">
        <div class="custom-card q-pa-sm" v-for="k in datas" :key="k.company_name">
          <div class="custom-card-list">
            <span class="font-sm">
              {{k.company_name}}
              <q-badge align="top" color="warning">剩余{{k.time_remaining}}天</q-badge>
            </span>
            <q-btn flat size="sm" @click="showMoreDialog(k)">更多></q-btn>
          </div>
          <!--        <div class="custom-card-list">-->
          <!--          <span class="font-xs text-black">商户负责人：{{k.legal_person}}</span>-->
          <!--          <span class="font-xs text-black">电话：{{k.mobile}}</span>-->
          <!--        </div>-->
          <div class="custom-card-list">
            <span class="font-xs text-black">地址：{{k.address}}</span>
            <span class="font-xs text-black">创建日期：{{k.create_time.substr(0,10)}}</span>
          </div>
          <div class="custom-btn-group">
            <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="addLogs(k.id)">添加日志</q-btn>
            <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="editClues(k)">修改详情</q-btn>
            <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="addToCustom(k)">转客户</q-btn>
            <q-btn color="primary" size="sm" class="custom-btn-group-item" @click="giveUp(k.id)">放弃</q-btn>
          </div>
        </div>
        <q-inner-loading :showing="loading">
          <q-spinner-dots size="50px" color="primary" />
        </q-inner-loading>
      </q-pull-to-refresh>
    </div>
    <!--------------------------------------------dialog-------------------------------------------------->
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
          <div class="more-list">
            <div class="more-label"></div>
            <div class="more-content">负责人联系方式：{{detail.legal_mobile}}</div>
          </div>
          <div class="more-list">
            <div class="more-label"></div>
            <div class="more-content">地址：{{detail.address}}</div>
          </div>
          <p style="margin: .3rem 0;">拜访日志：</p>
          <q-scroll-area class="word-break logs-content" :horizontal="false">
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
// import { date } from 'quasar'
export default {
  name: 'personalClues',
  data () {
    return {
      loading: false,
      showMore: false,
      searchContent: {
        content: ''
      },
      detail: {
        'sale_id': undefined,
        'address': undefined,
        'create_sales_id': undefined, // 创建此条线索销售的ID
        'for_21_day': undefined, // 加入私海21天后的时间
        'legal_mobile': undefined, // 负责人联系方式
        'head_person': undefined, // 负责人
        'join_time': undefined, // 加入私海时间
        'private_or_public': undefined, // 公海私海状态
        'interval_21_day': undefined, // 剩余天数
        'company_name': undefined, // 商户名
        'id': undefined, // 线索ID
        'clue_careta_time': undefined, // 线索创建时间
        'sale_follow_status': undefined, // 跟进状态
        'logs': []
      },
      page: 1,
      pageCount: 20,
      datas: []
    }
  },
  created () {
    this.queryData(null)
    // let time1 = '2019-11-01 17:22:37'
    // let timeStr = new Date(time1.replace(/-/g, '/')) // 转换为可用时间格式
    // let timeStamp = timeStr.getTime() // 转换为时间戳
    //
    // let time2 = Date.now()
    //
    // let diff = date.getDateDiff(time2, timeStamp, 'days')
    // console.log(diff)
    // 时间处理
  },
  methods: {
    giveUp (id) {
      this.$q.dialog({
        title: '警告',
        message: '确认放弃了吗',
        cancel: { label: '算了', flat: true },
        ok: { label: '确认', color: 'negative' },
        persistent: true
      }).onOk(() => {
        let parmas = {
          'clueid': id
        }
        this.$axios(urls.giveUpClues, parmas).then(res => {
          let code = res.code
          if (code === 'success') {
            this.$q.notify('已放弃该线索')
            this.queryData(null)
          } else {
            this.$q.notify(res.msg)
          }
        }, err => {
          this.$q.notify(JSON.stringify(err))
        })
      }).onCancel(() => {
      })
    },
    editClues (obj) { // 修改线索
      this.$router.push({ name: 'CluesInfo', params: { type: 2, obj: obj } })
    },
    addLogs (id) { // 跳到添加日志
      this.$router.push({ name: 'AddLogs', params: { id: id } })
    },
    showMoreDialog (obj) {
      let vm = this
      Object.assign(vm.detail, obj)
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
      vm.showMore = true
    },
    queryData (param) {
      let vm = this
      vm.loading = true
      this.$axios(urls.queryPersonalClues, param).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.datas = [...res.list]
        } else {
          vm.$q.notify(res.msg)
        }
        vm.loading = false
      }, err => {
        vm.$q.notify(JSON.stringify(err))
        vm.loading = false
      })
    },
    refreshList (done) { // 下拉加载
      let vm = this
      vm.searchContent.content = ''
      async function getInfo () {
        await vm.queryData(null)
        done()
      }
      getInfo()
    },
    search () {
      let vm = this
      let oldVal = vm.searchContent.content
      setTimeout(() => {
        if (vm.searchContent.content === oldVal) {
          if (vm.searchContent.content) {
            let params = {
              'company_name': vm.searchContent.content
            }
            vm.queryData(params)
          }
        }
      }, 800)
    },
    addToCustom (obj) { // 转为客户
      // console.log(obj)
      let custom = {
        'legal_person': '', //  法人名称
        'check_status': undefined, // 审核状态:草稿0,待审核1,审核未通过2,审核通过3
        'commission': '', // 佣金
        'business_license': '',
        'idcard_photo_1': '',
        'idcard_photo_2': '',
        'company_name': obj.company_name,
        'company_desc': '',
        'mobile': obj.legal_mobile,
        'account': '',
        'idcard_no': '',
        'e_contract_address': '',
        'e_contract_status': 0,
        'clueid': obj.id,
        'clues_list': [obj.id]
      }
      this.$router.push({ name: 'CreateCustomer', params: { type: 1, obj: custom } })
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
    padding: 5px;
    /*position: fixed;*/
    /*top: 12vh;*/
    /*z-index: 2;*/
  }
  .clues-search-input{
    width: 100%;
    /*margin-right: 3%;*/
  }
  .custom-border-top{
    border-top: 1px solid #e0e0e0;
    /*padding: 5px 0 0 0;*/
  }
  .clues-search-cont{
  }
  .cluse-btn-group{
    width: 100%;
    border-top: 1px solid #e0e0e0;
    display: flex;
  }
  .cluse-btn{
    width: 50%;
    text-align: center;
  }
  .clues-btn-border-left{
    border-left: 1px solid #e0e0e0;
  }
  /*---------------------------列表样式------------------*/
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
  .custom-section{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .more-div{
    width: 80vw;
    min-height: 60vh;
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
  /*.clues-list{*/
  /*  margin-top: 7vmax;*/
  /*}*/
</style>
