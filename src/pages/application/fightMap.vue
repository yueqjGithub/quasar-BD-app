<template>
  <q-page>
    <div class="q-pa-sm" id="mapSec"></div>
  </q-page>
</template>

<script>
/* eslint-disable */
function TMap () {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(qq)
    }
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://map.qq.com/api/js?v=2.exp&callback=init&key=TGSBZ-3P6WI-GG2GB-5SJBC-SQR5V-OLB6K'
    script.onerror = reject
    document.head.appendChild(script)
  })
}
export default {
  name: 'fightMap',
  data () {
    return {
      lat: 30.65618,
      lng: 104.08329,
      map: undefined,
      marker: undefined
    }
  },
  created () {
    this.mapTX(this.lat, this.lng)
  },
  methods: {
    mapTX (lat=30.65618,lng=104.08329) {
      let _this = this
      TMap().then(qq => {
        _this.map = new qq.maps.Map(document.getElementById('mapSec'), {
          //这里经纬度代理表进入地图显示的中心区域
          center: new qq.maps.LatLng(_this.lat, _this.lng),
          zoom: 12
        })

        _this.marker = new qq.maps.Marker({
          position: new qq.maps.LatLng(_this.lat, _this.lng), // 纬度，经度,定位地址
          map: _this.map
        });
        //绑定单击事件添加参数
        qq.maps.event.addListener(_this.map, 'click', function(event) {
          _this.marker.setMap(null);
          let lat = event.latLng.getLat()
          let lng = event.latLng.getLng()
          _this.lng=lng
          _this.lat=lat

          _this.marker = new qq.maps.Marker({
            position: new qq.maps.LatLng(lat,lng), // 纬度，经度,定位地址
            map: _this.map
          });

          // qq.maps.event.addListener(map,'click',function(event) {
          //
          // });

        })
      })
    },
  }
}
  /* eslint-disable */
</script>

<style scoped>
#mapSec{
  width: 100%;
  height: 70vh;
}
</style>
