const app = getApp();
Component({
  properties: {


    // 这里定义了innerText属性，属性值可以在组件使用时指定
    data: {
      type: Object,
      value: 'default value',
    },
    locationList2: {
      type: Object,
    },
    showBtn: {
      type: String,
    },
    showTitle: {
      type: String,
    },
    userAddressCustomFormCommitId: {
      type: String,
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {},
    sysWidth:"",
  },
  ready:function(){
    console.log("====jifen======", this.data.data,app.setting)
    this.setData({
      sysWidth: app.globalData.sysWidth,
      setting:app.setting
    });
  },
  methods: {
    // 这里是一个自定义方法
    buttom: function () {
      // console.log("1111111111111")
      app.wxLogin(1011)
      // wx.chooseAddress({
      //   success: function (res) {
      //     console.log(res.userName)
      //     console.log(res.postalCode)
      //     console.log(res.provinceName)
      //     console.log(res.cityName)
      //     console.log(res.countyName)
      //     console.log(res.detailInfo)
      //     console.log(res.nationalCode)
      //     console.log(res.telNumber)
      //   }
      // })
    },
    tolinkUrl: function (e) {
      console.log(e.currentTarget.dataset.info)
      let info = e.currentTarget.dataset.info
      let jifenId = info.id
      let productId = info.productId
      let couponId = info.couponId
      let jifenNum = info.needJifen
      let jifenCount = info.count
      if (productId) {
        var a = "jifen_product_detail.html?type=jifen&productId=" + productId + '&jifenNum=' + jifenNum + '&jifenId=' + jifenId + '&jifenCount=' + jifenCount;
      }
      if (couponId) {
        var a = "coupon_detail.html?type=jifen&couponId=" + couponId;
      }
      app.linkEvent(a);
    },
  },
})