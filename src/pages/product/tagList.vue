<template>
  <q-card class="bg-white my-type">
    <div class="my-header text-black q-pa-sm bg-white my-border">
      <div class="my-header-l">
        <q-btn flat round icon="img:statics/images/back-B.png" @click="close"></q-btn>
      </div>
      <div class="my-header-m text-center">菜品标签</div>
      <div class="my-header-r">
        <q-btn flat unelevated label="保存" text-color="primary" class="word-no-wrap" @click="save"></q-btn>
      </div>
    </div>
    <!--------------------cont---------------------------->
    <div>
      <div v-for="k in list" :key='k.type.typeid' class="q-pa-sm">
        <div class="tag-type">{{k.type.type_name}}</div>
        <div class="tag-ul">
          <div
            v-for="j in k.tag"
            :key="j.index"
            class="tags text-center"
            @click="choose(j)"
            :class="{'choose-tags': j.checked}"
          >
            {{j.tag_name}}
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
import urls from 'src/api/api'
export default {
  name: 'typelist',
  props: ['type', 'pId'],
  data () {
    return {
      cur: [],
      list: []
    }
  },
  created () {
    this.getTags()
  },
  methods: {
    close () {
      this.$emit('close')
    },
    getTags () {
      let vm = this
      let params = {}
      if (this.type === 2) {
        params = {
          'productid': vm.pId
        }
      }
      vm.$axios(urls.queryTags, params).then(res => {
        if (res.code === 'success') {
          vm.list = res.data
          for (let k in res.data) {
            for (let j in res.data[k].tag) {
              if (res.data[k].tag[j].checked) {
                vm.cur.push(res.data[k].tag[j].tag_name)
              }
            }
          }
        } else {
          vm.$q.notify(res.msg)
        }
      }).catch(() => {})
    },
    choose (val) {
      let vm = this
      if (val.checked) {
        let num = vm.cur.indexOf(val.tag_name)
        vm.cur.splice(num, 1)
        val.checked = false
      } else {
        vm.cur.push(val.tag_name)
        val.checked = true
      }
    },
    save () {
      console.log(this.cur)
      let str = this.cur.join(`,`)
      this.$emit('getTags', str)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.my-border{
  border-bottom: 1px solid #e6e6e6 !important;
}
.tag-type{
  font-size: 1.5rem;
  color: #666666;
  margin-bottom: 1.7rem;
}
.tag-ul{
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.tags{
  width: 24%;
  padding: 1rem 1.8rem;
  border-radius: .5rem;
  background: #F8F8F8;
  color: #000000;
  margin-bottom: 1rem;
  margin-left: 1rem;
}
.choose-tags{
  background: #2D35A3;
  color: #ffffff;
}
</style>
