<template>
  <q-page>
    <q-header class="my-border">
      <div class="my-header text-black q-pa-sm bg-white">
        <div class="my-header-l">
          <q-btn flat round icon="img:statics/images/back-B.png" @click="goBack"></q-btn>
        </div>
        <div class="my-header-m text-center no-wrap">新建菜品</div>
        <div class="my-header-r">
        </div>
      </div>
    </q-header>
    <transition
      appear
      enter-active-class="animated slideInRight"
      leave-active-class="animated slideOutLeft"
    >
      <q-page class="my-grey-bg">
        <q-form ref="myForm">
          <!------------------------------------------------------>
          <div class="my-list-card flex-column flex-align-start flex-just-start">
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-baseline flex-just-start">
              <span class="my-label">菜品名称</span>
              <div class="my-input">
                <q-input
                  borderless
                  dense
                  :bottom-slots="false"
                  :hide-bottom-space="true"
                  v-model="product.product_name"
                  placeholder="填写菜品名称"
                  :rules="[
                  val => !!val || ''
                ]"
                />
              </div>
            </div>
            <!-------------item------------------->
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-baseline flex-just-start">
              <span class="my-label">门店价格</span>
              <div class="my-input">
                <q-input
                  borderless
                  dense
                  type="number"
                  :bottom-slots="false"
                  :hide-bottom-space="true"
                  v-model="product.price"
                  placeholder="填写门店价格"
                  :rules="[
                  val => !!val || ''
                ]"
                />
              </div>
            </div>
            <!-------------item------------------->
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-baseline flex-just-start">
              <span class="my-label">采购价格</span>
              <div class="my-input">
                <q-input
                  borderless
                  dense
                  type="number"
                  :bottom-slots="false"
                  :hide-bottom-space="true"
                  v-model="product.buy_price"
                  placeholder="填写采购价格"
                  :rules="[
                  val => !!val || ''
                ]"
                />
              </div>
            </div>
            <!-------------item------------------->
          </div>
          <div class="my-list-card flex-column flex-align-start flex-just-start">
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-center flex-space-between">
              <span class="my-label">菜品类型</span>
              <div @click="openTypeList">
                <span class="text-primary" :class="product.typeid_name ? '' : 'text-grey'">{{product.typeid_name ? product.typeid_name : '选择菜品类型'}}</span>
                <q-btn flat rounded text-color="grey" icon-right="fa fa-angle-right"></q-btn>
              </div>
            </div>
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-center flex-space-between">
              <span class="my-label">菜品标签</span>
              <div class="flex-row flex-align-center" @click="openTags">
                <span class="text-primary" :class="product.tags ? '' : 'text-grey'">{{product.tags ? product.tags : '选择菜品标签'}}</span>
                <q-btn flat rounded text-color="grey" icon-right="fa fa-angle-right"></q-btn>
              </div>
            </div>
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-center flex-space-between">
              <span class="my-label">发放门店</span>
              <div class="flex-row flex-align-center" @click="openShops">
                <span class="text-primary" :class="product.shops.length > 0 ? '' : 'text-grey'">{{product.shops.length > 0 ? `${product.shops.length}家门店` : '选择发放门店'}}</span>
                <q-btn flat rounded text-color="grey" icon-right="fa fa-angle-right"></q-btn>
              </div>
            </div>
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-center flex-space-between">
              <span class="my-label">是否参加活动</span>
              <q-toggle
                v-model="product.market_type"
                :false-value="0"
                :true-value="1"
                keep-color
                color="primary"
              />
            </div>
            <!-------------item------------------->
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-baseline flex-just-start">
              <span class="my-label">活动库存</span>
              <div class="my-input">
                <q-input
                  borderless
                  dense
                  type="number"
                  :bottom-slots="false"
                  :hide-bottom-space="true"
                  v-model="product.total_count"
                  placeholder="填写库存总量"
                  :rules="[
                  val => !!val || ''
                ]"
                />
              </div>
            </div>
            <!-------------item------------------->
            <div class="my-list-item flex-row flex-align-center flex-space-between">
              <span class="my-label">是否上架</span>
              <div class="flex-row flex-align-center" @click="openPub">
                <span class="text-primary" :class="product.check_status ? '' : 'text-grey'" v-if="product.check_status === 0">待审核</span>
                <span class="text-primary" :class="product.check_status ? '' : 'text-grey'" v-if="product.check_status === 3">上架</span>
                <span class="text-primary" :class="product.check_status ? '' : 'text-grey'" v-if="product.check_status === 4">下架</span>
                <q-btn flat rounded text-color="grey" icon-right="fa fa-angle-right"></q-btn>
              </div>
            </div>
            <!-------------item------------------->
          </div>
          <div class="my-list-card flex-column flex-align-start flex-just-start">
            <!-------------item------------------->
            <div class="card-tit">上传图片<span class="my-tips">（最多三张，第一张为主图）</span></div>
            <!---------隐藏上传触发input--------->
            <div style="display: none">
              <input type="file" accept="image/*"  capture="camera" ref="myInput" @change="updateByInput($event)"/>
            </div>
            <!--------------------上传控件-------------------------->
            <div class="my-photos">
              <div class="photo-item" v-for="k in product.photo" :key="k">
                <img :src="`https://${k}`" alt="" class="product-pic">
                <q-inner-loading :showing="k === 'no'">
                  <q-spinner size="50px" color="primary" />
                </q-inner-loading>
                <div class="remove-pic" @click="removePhoto(k)">
                  <div class="remove-icon"></div>
                </div>
              </div>
              <div class="photo-item photo-upload" v-if="product.photo.length < 3" @click="chooseUpload">
                <img src="statics/images/upload.png" alt="">
              </div>
            </div>
            <div class="my-save q-pa-lg">
              <q-btn class="full-width" color="primary" unelevated @click="save">提交平台</q-btn>
            </div>
          </div>
        </q-form>
      </q-page>
    </transition>
    <!-------------------------------dialog-type---------------------------------------------->
    <q-dialog
      v-model="showType"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <type-list :cur="product.typeid" @closeType="closeType" @getChoose="getChoose"></type-list>
    </q-dialog>
    <!-------------------------------dialog-type---------------------------------------------->
    <q-dialog
      v-model="showPub"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <public-list :before="product.check_status" @close="closePub" @getPub="getPub"></public-list>
    </q-dialog>
    <!-------------------------------dialog-type---------------------------------------------->
    <q-dialog
      v-model="showTags"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <tag-list @close="closeTags" @getTags="getTag" :type="editType" :pId="product.productid"></tag-list>
    </q-dialog>
    <!-------------------------------dialog-type---------------------------------------------->
    <q-dialog
      v-model="showShops"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
<!--      <tag-list @close="closeTags" @getTags="getTag"></tag-list>-->
      <shop-list @close="closeShops" @getShop="getShops" :before="product.shops"></shop-list>
    </q-dialog>
  </q-page>
</template>

<script>
import urls from 'src/api/api'
import typeList from 'pages/product/chooseType'
import tagList from 'src/pages/product/taglist'
import shopList from 'src/pages/product/shopList'
import publicList from 'src/pages/product/publicList'
export default {
  name: 'productInfo',
  components: {
    typeList,
    tagList,
    shopList,
    publicList
  },
  data () {
    return {
      showType: false,
      showTags: false,
      showShops: false,
      showPub: false,
      editType: 1,
      product: {
        productid: '',
        product_name: '',
        price: undefined,
        buy_price: undefined,
        total_count: '',
        typeid: '',
        typeid_name: '',
        tags: '',
        shops: [],
        photo: [],
        check_status: 0, // 上架状态
        market_type: 0 // 是否参加活动
      }
    }
  },
  created () {
    let vm = this
    let param = this.$route.params
    if (param.type === 2) {
      this.editType = 2
      for (let k in param.obj) {
        if (vm.product.hasOwnProperty(k)) {
          vm.product[k] = param.obj[k]
        }
      }
    }
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'Product' })
    },
    closePub () {
      this.showPub = false
    },
    openPub () {
      this.showPub = true
    },
    getPub (val) {
      this.product.check_status = val
    },
    closeType () {
      this.showType = false
    },
    openTypeList () {
      this.showType = true
    },
    getChoose (obj) {
      this.product.typeid = obj.typeid
      this.product.typeid_name = obj.type_name
    },
    openTags () {
      this.showTags = true
    },
    closeTags () {
      this.showTags = false
    },
    getTag (val) {
      // console.log(val)
      this.product.tags = val
    },
    openShops () {
      this.showShops = true
    },
    closeShops () {
      this.showShops = false
    },
    getShops (val) {
      this.product.shops = [...val]
    },
    // --------------提交
    save () {
      let vm = this
      let URL
      vm.$refs['myForm'].validate().then(suc => {
        if (suc) {
          let params = {
            // "productid":"17",//
            'product_name': vm.product.product_name, // 菜品名称
            'price': vm.product.price, // 门店价格
            'buy_price': vm.product.buy_price, // 供应价格
            'total_count': vm.product.total_count, // 库存总量
            'typeid': vm.product.typeid, // 类型
            'tags': vm.product.tags, // 标签
            'market_type': vm.product.market_type, // 标签
            'check_status': vm.product.check_status, // 标签
            'photo': vm.product.photo ? vm.product.photo.join(',') : '', // 标签
            'companyid': vm.$q.localStorage.getItem('currentCompany').id, // 商户id
            'shops': vm.product.shops // 发放门店
          }
          if (vm.editType === 2) {
            URL = urls.editProduct
            params['productid'] = vm.product.productid
          } else {
            URL = urls.createProduct
          }
          vm.$axios(URL, params).then(res => {
            if (res.code === 'success') {
              vm.$q.notify('提交成功')
              setTimeout(() => {
                vm.$router.push({ name: 'Product' })
              })
            } else {
              vm.$q.notify(res.msg)
            }
          }, () => {})
        }
      })
    },
    // -----------照片
    chooseUpload () { // 选择是相册还是相机上传
      let vm = this
      // this.$refs['myInput'].click()
      this.$q.bottomSheet({
        message: '',
        actions: [
          {
            label: '相机',
            id: 'camera'
          },
          {
            label: '从相册中选择',
            id: 'photo'
          }
        ]
      }).onOk(action => {
        // this.$q.notify(action.id)
        if (action.id === 'photo') {
          this.$refs['myInput'].click()
        } else if (action.id === 'camera') {
          // this.$q.notify(action.id)
          /* eslint-disable */
          navigator.camera.getPicture(
            data => { // on success
              let params = {
                fileName: `${Math.random()}pic`,
                fileData: `data:image/jpeg;base64,${data}`
              }
              vm.product.photo.push('no')
              vm.$axios(urls.uploadImg, params).then(res => {
                if (res.code === 'success') {
                  vm.product.photo.pop()
                  vm.product.photo.push(res.url)
                } else {
                  setTimeout(() => {
                    vm.product.photo.pop()
                    vm.$q.notify(res.message)
                  }, 1000)
                }
              }, () => {
                setTimeout(() => {
                  vm.product.photo.pop()
                  this.$q.notify('上传出错，请检查网络是否通畅')
                }, 1000)
              })
            },
            () => { // on fail
              // this.$q.notify('Could not access device camera.')
            },
            {
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URL, // 返回Base64编码字符串
            }
          )
          /* eslint-disable */
        }
      }).onCancel(() => {

      })
    },
    updateByInput (e) { // 通过input上传---相册上传
      let vm = this
      let file = e.target.files[0]
      let params = {}
      let reader = new FileReader()
      reader.readAsDataURL(file)
      // 一定要在文件读取 成功完成时 再进行相应的操作：上传使用formdata上传
      reader.onload = function () {
        // vm.storeInfo.photo = reader.result
        params = {
          fileName: file.name,
          fileData: reader.result
        }
        vm.product.photo.push('no')
        vm.$axios(urls.uploadImg, params).then(res => {
          if (res.code === 'success') {
            vm.product.photo.pop()
            vm.product.photo.push(res.url)
          } else {
            setTimeout(() => {
              vm.product.photo.pop()
              vm.$q.notify(res.message)
            }, 1000)
          }
        }, () => {
          setTimeout(() => {
            vm.product.photo.pop()
            this.$q.notify('上传出错，请检查网络是否通畅')
          }, 1000)
        })
      }
    },
    removePhoto (k) { // 删除某一张
      let vm = this
      let num = vm.product.photo.indexOf(k)
      if (k !== -1) {
        vm.product.photo.splice(num, 1)
      }
    }
  }
}
</script>

<style scoped>
  .my-list-card{
    background: #ffffff;
    margin-bottom: .5rem;
    padding: 0 1rem;
  }
  .my-border{
    border-bottom: 1px solid #e6e6e6;
  }
  .card-tit{
    margin-top: 1rem;
    font-size: 2rem;
    color: #000000;
    font-weight: bold;
    margin-bottom: 2rem;
  }
  .my-tips{
    font-size: 1.5rem;
    color: #999999;
  }
  .my-list-item{
    width: 100%;
    padding: 1rem 0;
    border-bottom: 1px solid #e6e6e6;
  }
  .my-list-item-last{
    width: 100%;
    padding: 1rem 0;
  }
  .my-label{
    width: 9rem;
    font-size: 1.6rem;
    color: #000000;
    margin-right: 1rem;
  }
  .my-input{
    flex: 2;
  }
  .my-photos{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .photo-item{
    width: 7rem;
    height: 7rem;
    border: 1px solid #e6e6e6;
    border-radius: .5rem;
    overflow: hidden;
    position: relative;
    margin-bottom: 1rem;
  }
  .product-pic{
    width: 100%;
    height: 100%;
  }
  .remove-pic{
    padding: .5rem 1rem;
    background: #FF3535;
    color: white;
    position: absolute;
    top: 0;
    right: -.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: .6rem;
  }
  .remove-icon{
    width: 1rem;
    border: 1px solid #ffffff;
  }
  .photo-item + .photo-item{
    margin-left: .7rem;
  }
  .photo-upload img{
    width: 100%;
    height: 100%;
  }
  .my-save{
    width: 100%;
  }
</style>
