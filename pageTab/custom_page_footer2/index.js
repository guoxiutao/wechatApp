

var util = require('../../utils/util.js');
const app = getApp()
var timer; // 计时器
Page({
  
  data: {  
    listenerId: null,
    /* seeting */ 
    setting:null,
    renderData:null,
    PaiXuPartials:[], 
    sysWidth: 750,//图片大小
    partialsName:'',
    loginUser:null,

  },

  setNavBar: function (){
    console.warn("1111111111111")
    if (app.setting.platformSetting.siteTitle == '') {
      wx.setNavigationBarTitle({
        title: '首页',
      })
    } else {
      wx.setNavigationBarTitle({
        title: app.setting.platformSetting.siteTitle,
      })
    }

    if (app.setting.platformSetting.topColor =='') {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000',
      })
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: app.setting.platformSetting.topColor,
      })
    }
  },
  getData: function () {
    console.log('---------------index - getsetting --------------')
    var that = this
    if (!app.setting) {
      console.log('-------------hasNoneSetting-----------')
      app.getSetting(that)
    } else {
      console.log('-------------hasSetting-----------')
      this.setData({ setting: app.setting })
      console.log(this.data.setting)
    }
  },
  /*onload*/
  onLoad: function (options) {
    // wx.hideTabBar({})
    console.warn("======onLoad:options======", options)
    console.log('--------------- custom_index --------------')
    if(!app.setting){
      app.promiseonLaunch(this)
    }else{
       this.setData({
          sysWidth: app.globalData.sysWidth
        });
       //this.getData()
       //this.getParac()
      this.setData({ partialsName:'footer2'})
        if (!!app.setting) {
          this.setNavBar()
        }
    }
    // 

     
    // }
   
  
  },

  onReady: function () { 
    
  },
  onShow: function () {
    console.log('-----------------a---------------')
    
  },
  // /* 分享 app.js862行*/
  // onShareAppMessage: function () {
  //   console.log(app.miniIndexPage)

  //   return app.shareForFx2(app.miniIndexPage)
    
  // },
  onPullDownRefresh: function () {
    // 下拉刷新的时候首先判断存不存在tab
  },
})