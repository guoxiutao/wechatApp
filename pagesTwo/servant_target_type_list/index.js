// pages/fx_center/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      setting: {},
      loginUser: null,
      properties: {},
      servantTargetTypes:{},
    },
    /* 组件事件集合 */
    tolinkUrl: function (e) {
      let linkUrl = e.currentTarget? e.currentTarget.dataset.link:e
      app.linkEvent(linkUrl)
    },
    switchChange:function(e){
      console.log("====switchChange====",e)
      let servantTargetTypeId = e.currentTarget.dataset.id
      let action = e.detail.value ? 1 : 2;
      this.setServantTargetTypes(servantTargetTypeId, action)
    },
  setServantTargetTypes: function (id, action) {
      console.log('-------设置服务对象分类(资料库)-------')
    let params = { servantTargetTypeIds: id, action: action}
      var customIndex = app.AddClientUrl("/wx_set_servant_target_types.html", params, 'post')
      var that = this
      app.showToastLoading('loading', true)
      wx.request({
        url: customIndex.url,
        data: customIndex.params,
        header: app.headerPost,
        method: 'POST',
        success: function (res) {
          console.log(res.data)
          if (res.data.errcode == '0') {
            let servantTargetTypes = res.data.relateObj
            that.setData({
              servantTargetTypes: servantTargetTypes
            })
          }
          else {
            wx.showModal({
              title: '失败了',
              content: res.data.errMsg,
            })
          }
          wx.hideLoading()
        },
        fail: function (res) {
          wx.showModal({
            title: '失败了',
            content: '请求失败了!',
          })
          wx.hideLoading()
          app.loadFail()
        }
      })
    },
    getServantTargetTypes: function () {
      console.log('-------服务对象分类(资料库)-------')
      let params = {}
      var customIndex = app.AddClientUrl("/wx_find_all_servant_target_types.html", params, 'post')
      var that = this
      app.showToastLoading('loading', true)
      wx.request({
        url: customIndex.url,
        data: customIndex.params,
        header: app.headerPost,
        method: 'POST',
        success: function (res) {
          console.log(res.data)
          if (res.data.errcode == '0') {
            let servantTargetTypes = res.data.relateObj
            that.setData({
              servantTargetTypes: servantTargetTypes
            })
          }
          else {
            wx.showModal({
              title: '失败了',
              content: res.data.errMsg,
            })
          }
          wx.hideLoading()
        },
        fail: function (res) {
          wx.showModal({
            title: '失败了',
            content: '请求失败了，请下拉刷新！',
          })
          wx.hideLoading()
          app.loadFail()
        }
      })
    },
    setNavColor: function () {
      console.log('setNavColor', app.setting)
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: app.setting.platformSetting.defaultColor
      })
    },
    setNav: function (servantTargetInfo) {
      console.log('setNav', app.setting)
      wx.setNavigationBarTitle({
        title: '服务对象类型',
        // servantTargetInfo.name
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
        setting: app.setting,
        loginUser: app.loginUser
      })
      this.setNavColor()
      this.getServantTargetTypes()
      if (!app.loginUser.platformUser.managerMendianId) {
        console.log("=========没有管理店铺=========")
        this.setData({ applyMendianType: false })
        return
      }else{

      }
    },
    conut: 1,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let that=this;
      console.log('======app.loginUser======', app.loginUser)
      console.log('====== app.setting======', app.setting)
      if (app.loginUser) {
        this.checkState();
      } else {
        app.addLoginListener(this);
        app.showToastLoading('loading', true)
        console.log("====setTimeout1=====")
        that.setTimeoutLogin(that.conut)
      }
      this.setData({
          setting: app.setting,
          loginUser: app.loginUser,
          properties: app.properties
      })
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
        this.onLoad()
        setTimeout(function () {
            wx.stopPullDownRefresh()
        }, 2000)

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
})
