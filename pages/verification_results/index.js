var WxParse = require('../../wxParse/wxParse.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    verificationCodeData:{},
    allSelectState: false,
    allDisabledState: true,
  },
  allCheckboxChange: function (e) {
    let that=this;
    console.log('allCheckboxChange-checkbox发生change事件，携带value值为：', e.detail.value[0])
    let allSelectState = false
    if (e.detail.value[0]){
      allSelectState=true
    }
    let count=0;
    let verificationCodeData = that.data.verificationCodeData
    if (verificationCodeData.unverifyRecords.length != 0) {
      for (let i = 0; i < verificationCodeData.unverifyRecords.length; i++) {
        if (verificationCodeData.unverifyRecords[i].disabled){
          verificationCodeData.unverifyRecords[i].state = allSelectState ? true : false
        }
      }
    }
    that.setData({allSelectState: allSelectState, verificationCodeData: verificationCodeData})
  },
  checkboxChange:function(e){
    let that=this;
    console.log('checkboxChange-checkbox发生change事件，携带value值为：', e.detail.value)
    let selectData = e.detail.value;
    let verificationCodeData = that.data.verificationCodeData;
    let allSelectState=false;
    let count=0;
    if (selectData.length!=0){
      for (let i = 0; i < verificationCodeData.unverifyRecords.length; i++) {
        verificationCodeData.unverifyRecords[i].state = false
        if (verificationCodeData.unverifyRecords[i].disabled){
          count++
        }
      }
      for (let i = 0; i < selectData.length; i++) {
        verificationCodeData.unverifyRecords[selectData[i]].state=true;
      }
    } else {
      allSelectState = false
      for (let i = 0; i < verificationCodeData.unverifyRecords.length; i++) {
        verificationCodeData.unverifyRecords[i].state = false
      }
    }
    console.log("===count===", count)
    if (selectData.length == count) {
      allSelectState = true
    }
    that.setData({ allSelectState: allSelectState,verificationCodeData: verificationCodeData })
  },
  getVerificationCode: function () {
    var that = this
    var customIndex = app.AddClientUrl("/wx_get_scan_verify_parameter.html", that.onloadOpt)
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log("getVerificationCode", res.data)
        let verificationCodeData = res.data.relateObj ;
        let count = 0;
        let allDisabledState = true
        that.onloadOpt = Object.assign({}, that.onloadOpt, {
          verifySign: verificationCodeData.sign,
          verifySeq: verificationCodeData.seq
        })
        if (verificationCodeData.unverifyRecords.length!=0){
          for (let i = 0; i < verificationCodeData.unverifyRecords.length;i++){
            verificationCodeData.unverifyRecords[i].state = false
            if (verificationCodeData.unverifyRecords[i].count <= verificationCodeData.unverifyRecords[i].exhauseCount){
              verificationCodeData.unverifyRecords[i].disabled = false;
              count++
            }else{
              verificationCodeData.unverifyRecords[i].disabled = true
            }
          }
        }
        if (count == verificationCodeData.unverifyRecords.length) {
          allDisabledState = false
        }
        console.log("====verificationCodeData===", verificationCodeData)
        that.setData({ allSelectState:false, allDisabledState: allDisabledState, verificationCodeData: verificationCodeData })
      },
      complete: function (res) {

      }
    })
  },
  getVerificationResults: function () {
    var that = this
    let exhauseItems=[]
    let verificationCodeData = that.data.verificationCodeData;
    if (verificationCodeData.unverifyRecords.length != 0) {
      for (let i = 0; i < verificationCodeData.unverifyRecords.length; i++) {
        if (verificationCodeData.unverifyRecords[i].state){
          let itemData = { name: verificationCodeData.unverifyRecords[i].name, count: 1}
          exhauseItems.push(itemData)
        }
      }
      that.onloadOpt = Object.assign({}, that.onloadOpt,{
        exhauseItems: JSON.stringify(exhauseItems)
      })
    }
    if (exhauseItems.length==0){
      wx.showModal({
        title: '警告',
        content: '请您选择一项核销！！',
      })
      return
    }
    console.log("that.onloadOpt", that.onloadOpt)
    var customIndex = app.AddClientUrl("/wx_scan_verify.html", that.onloadOpt)
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log("getVerificationResults",res.data)
        that.getVerificationCode();
        if (res.data.errcode==0){
          wx.showToast({
            title: res.data.relateObj,
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showModal({
            title: '错误',
            content: res.data.errMsg,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      complete: function (res) {
      }
    })
  },
  repVerificationResults:function(){
    this.tipFun("主人~您确认要核销吗？")
  },
 continueVerificationResults: function () {
   wx.scanCode({
     onlyFromCamera: true,
     success: (scanRes) => {
       console.log("getVerificationCode", scanRes)
       wx.navigateTo({
         url: "/" + scanRes.path
       })
     }
   })
  },
  tipFun:function(data){
    let that=this;
    wx.showModal({
      title: '提示',
      content: data.relateObj||data,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.getVerificationResults()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  setNavColor: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.setting.platformSetting.defaultColor

    })
  },
  loginSuccess: function (user) {
    console.log("pre apply mendian login success call back!", user);
    this.checkState();
  },
  loginFailed: function (err) {
    console.log("login failed!!");

  },
  checkState: function () {
    console.log('======checkState.loginUser======', app.loginUser)
    this.setData({
      platformSetting: app.setting.platformSetting,
      loginUser: app.loginUser
    })
    this.setNavColor()
    this.getVerificationCode();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  conut: 1,
  onloadOpt:{},
  onLoad: function (options) {
    let that = this;
    that.onloadOpt = options
    console.log("==options===", options)
    if (app.loginUser) {
      this.checkState();
    } else {
      app.addLoginListener(this);
      // wx.showLoading({
      //   title: 'loading'
      // })
      app.showToastLoading('loading', true)
      console.log("====setTimeout1=====")
      that.setTimeoutLogin(that.conut)
    }
  
  },
  setTimeoutLogin: function (conuData) {
    let that = this;
    console.log("====setTimeout-init=====", conuData)
    that.conut = conuData;
    that.conut += 2;
    if (that.conut <= 5) {
      setTimeout(function () {
        if (app.loginUser) {
          wx.hideLoading()
        } else {
          that.setTimeoutLogin(that.conut)
        }
      }, that.conut * 1000)
    } else {
      wx.showModal({
        title: '失败了',
        content: '请求失败了，请下拉刷新！',
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})