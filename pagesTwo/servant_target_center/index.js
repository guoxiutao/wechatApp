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
      servantTargetInfo:{},
      servantTargetTypes:{},
      servantTargetTasks:{},
      servantTargetTypeFormData:{},
    },
    /* 组件事件集合 */
    tolinkUrl: function (e) {
      let linkUrl = e.currentTarget? e.currentTarget.dataset.link:e
      app.linkEvent(linkUrl)
    },
    ckeckServantTargetTypeList:function(event){
      console.log("====ckeckServantTargetTypeList===", event)
      let link = event.currentTarget.dataset.link;
      this.tolinkUrl(link)
    },
    checkServantTargetTypeForm: function (event) {
      let that = this
      console.log('-------查看档案里的表单-------', event);
      let link = event.currentTarget.dataset.link;
      this.tolinkUrl(link)
    },
    checkMyVolunteersList: function (event) {
      let that = this
      console.log('-------更多关注对象-------', event);
      let link = event.currentTarget.dataset.link;
      this.tolinkUrl(link)
    },
    getServantTargetInfo: function (callback) {
        console.log('-------服务对象信息-------')
        let params = {}
        var customIndex = app.AddClientUrl("/wx_get_servant_target_detail.html", params, 'post')
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
                  let servantTargetInfo = res.data.relateObj
                  that.setData({
                    servantTargetInfo: servantTargetInfo
                  })
                  that.setNav(servantTargetInfo)
                  if (callback){
                    callback(servantTargetInfo.id)
                  }
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
    getServantTargetTypes: function () {
      console.log('-------服务对象分类(资料库)-------')
      let params = {}
      var customIndex = app.AddClientUrl("/wx_find_servant_target_types.html", params, 'post')
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
            let servantTargetTypes = res.data.relateObj.result
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
    getServantTargetTasks: function (servantTargetId) {
      console.log('-------查找服务对象的表单任务-------')
      let params = { servantTargetId: servantTargetId||0}
      var customIndex = app.AddClientUrl("/wx_find_servant_target_custom_form_tasks.html", params, 'post')
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
            let servantTargetTasks = res.data.relateObj.result
            that.setData({
              servantTargetTasks: servantTargetTasks
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
    getServantTargetRelates: function () {
      console.log('-------服务对象关系-------');
      let that = this
      let params = {}
      params['type']=3
      let customIndex = app.AddClientUrl("/wx_find_servant_target_relates_by_servant_target.html", params, 'post')
      app.showToastLoading('loading', true)
      wx.request({
        url: customIndex.url,
        data: customIndex.params,
        header: app.headerPost,
        method: 'POST',
        success: function (res) {
          console.log(res.data)
          if (res.data.errcode == '0') {
            let servantTargetRelates = res.data.relateObj.result
            that.setData({
              servantTargetRelates: servantTargetRelates
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
        title: '服务对象中心',
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
      this.getServantTargetInfo(this.getServantTargetTasks)
      this.getServantTargetTypes();
      this.getServantTargetRelates();
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
      let that=this;
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
