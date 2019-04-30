const app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');

Component({
  properties: {


    // 这里定义了innerText属性，属性值可以在组件使用时指定
    data: {
      type: JSON,
      value: 'default value',
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {},
    page:"1",
    shops:[],
    journey:[],//公里数
    locationAddress:"加载当前地址中...",
  },
  ready:function(){
    let that=this;
    console.log("================locationAddress============",that.data.data)
    this.getLocationAddress();
    if (app.setting.platformSetting.defaultColor && app.setting.platformSetting.defaultColor !=""){
      console.log("=========app.setting.platformSetting.defaultColor ==========", app.setting.platformSetting.defaultColor )
      // 有默认色
      this.setData({
        defaultColor: app.setting.platformSetting.defaultColor
      })
    }
    else{
      // 没有默认色
      this.setData({
        defaultColor: app.setting.platformSetting.defaultColor
      })
    }
  
 
  },
  methods: {
    changeSelectAddress: function (data) {
      let that=this;
      console.log("====changeSelectAddress====", data)
      let locationAddress = data.province + data.city + data.area + data.address
      that.setData({ locationAddress: locationAddress })
    },
    setLoctionAddr: function (pageParam) {
      let that = this
      let customIndex = app.AddClientUrl("/setLocation.html", pageParam, 'get')
      wx.request({
        url: customIndex.url,
        header: app.header,
        success: function (res) {
          console.log("=====setLoctionAddr====", res.data)
          wx.hideLoading()
        },
        fail: function (res) {
          wx.hideLoading()
          app.loadFail()
        }
      })
    },
    // 这里是一个自定义方法
    tolinkUrl: function (e) {
      console.log("e.currentTarget.dataset.link=====", e.currentTarget.dataset.link)
      let linkUrl = e.currentTarget.dataset.link
      app.linkEvent(linkUrl)
    },
    getLocationAddress:function(){
      let that=this;
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          console.log("=====getLocationAddress====", res)
          let latitude = res.latitude
          let longitude = res.longitude
          console.log(longitude + "..............." + latitude)
          // 获取附近店铺数据
          let pageParam = {
            "longitude": longitude,
            "latitude": latitude,
          }
          console.log(pageParam)
          that.getLoctionAddr(pageParam)
        }
      })
    },
    // 获取附近店铺数据
    getLoctionAddr: function (pageParam) {
      var that = this
      var param = {}
      param.longitude = pageParam.longitude
      param.latitude = pageParam.latitude
      var customIndex = app.AddClientUrl("/get_location_detail.html", param, 'get')
      wx.request({
        url: customIndex.url,
        header: app.header,
        success: function (res) {
          console.log("=====getLoctionAddr====", res.data)
          let data = res.data.result
          let params={
            longitude: pageParam.longitude,
            latitude: pageParam.latitude,
            province: data.addressComponent.province,
            city: data.addressComponent.city,
            street: data.addressComponent.street,
          }
          that.setLoctionAddr(params);
          let locationAddress;
          if (res.data.result.formatted_address){
            locationAddress = res.data.result.formatted_address
          }else{
            locationAddress = "加载当前地址失败..."
          }
          that.setData({ locationAddress: locationAddress })
          wx.hideLoading()
        },
        fail: function (res) {
          wx.hideLoading()
          app.loadFail()
        }
      })
    },
    getGreatCircleDistance: function (lng1, lat1, lng2, lat2){
      var EARTH_RADIUS = 6378.137; //地球半径
    lng1=parseFloat(lng1);
    lat1=parseFloat(lat1);
    lng2=parseFloat(lng2);
    lat2=parseFloat(lat2);
    // console.log("a,b", lng1, lat1, lng2, lat2)
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;

    var a = radLat1 - radLat2;
    var b = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0);

    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000.0;
   
    // console.log("公里数",s)
    // console.log("公里数", this.data.journey)
    s=s.toFixed(1);
    var journey = this.data.journey
    journey.push(s);
  
    this.setData({
      journey: journey
    })
    // console.log("公里数", this.data.journey)
    return s;
  },
  

  },
})