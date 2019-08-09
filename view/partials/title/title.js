const app = getApp();
  Component({
  properties: {
   

    // 这里定义了innerText属性，属性值可以在组件使用时指定
    data: {
      type: JSON,
     
    }
  },
    data: {
      // 这里是一些组件内部数据
      someData: { },
      findNotifyTipsData:null,
      findNotifyTipsItem:null,
      showPopup:false,
      animationData:{},
      timer:null,
      numberTime:0,
  },
    ready: function () {
      let that=this;
      console.log("==========title=============", that.data.data)
      that.setData({ setting: app.setting })
      console.log("==========setting=============", that.data.setting.platformSetting.defaultColor)
      if (that.data.data.androidTemplate == "popup_page"){
        that.findNotifyTipsFun();
        app.addPopupNotifysList(this);
      }
    },
    methods: {
      // 这里是一个自定义方法
      findNotifyTipsFun: function () {
        var customIndex = app.AddClientUrl("/wx_find_notify_tips.html", { test: 1 })
        // app.showToastLoading('loading', true)
        var that = this
        wx.request({
          url: customIndex.url,
          header: app.header,
          success: function (res) {
            wx.hideLoading()
            console.log("findNotifyTipsFun", res.data)
            if (res.data.errcode == 0) {
              let findNotifyTipsData = res.data.relateObj.result
              that.setData({ findNotifyTipsData: findNotifyTipsData, showPopup: true })
              let count=0;
              let numberTime = that.data.numberTime
              setTimeout(function(){
                that.data.timer = setInterval(function () {
                  console.log("===========timer get order detail============");
                  if (count < findNotifyTipsData.length) {
                    that.getFindNotifyTipsItem(findNotifyTipsData[count])
                    count++
                  } else {
                    that.setData({ numberTime: 60000 })
                    that.clearInterval()
                    that.findNotifyTipsFun()
                  }
                }, 5000);
              }, numberTime)
            } else {

            }
            wx.hideLoading()
          },
          fail: function (res) {
            console.log("fail")
            wx.hideLoading()
            app.loadFail()
          }
        })
      },
      clearInterval:function(data){
        let that=this;
        console.log("=====clearInterval=====", data)
        if (that.data.showPopup){
          let timer = that.data.timer
          that.setData({ showPopup: false })
          clearInterval(timer);
          timer = null
        }
      },
      getFindNotifyTipsItem: function (findNotifyTipsItem){
        let that=this;
        let animation = wx.createAnimation({
          duration: 400,
          timingFunction: 'ease',
        })
        animation.opacity(1).step()
        that.setData({
          animationData: animation.export(),
        })
        console.log("=====findNotifyTipsItem====", findNotifyTipsItem)
        that.setData({ findNotifyTipsItem: findNotifyTipsItem })
        setTimeout(function(){
          animation.opacity(0).step()
          that.setData({
            animationData: animation.export(),
          })
        },4000)
      },
      
      /* 搜索 */
      changeSearchProductFun:function(data){
        let that=this;
        if (that.data.data.androidTemplate == "more_product_search"){
          console.log("===changeSearchProductFun===", data)
        }
      },
      searchProduct: function (e) {
        var product = e.detail.value
        console.log(product)
        var param = {}
        param.productName = product
        let postParam = app.jsonToStr(param)
        // app.productParam = param
        wx.navigateTo({
          url: '/pages/search_product/index' + postParam
        })
      },
      tolinkUrl: function (event) {
        console.log(event.currentTarget.dataset.link)
        app.linkEvent(event.currentTarget.dataset.link);


        // wx.navigateTo({
        //   url: '/pages/' + event.currentTarget.dataset.page + '/index'
        // })
      }
  }
})