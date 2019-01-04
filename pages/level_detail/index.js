var WxParse = require('../../wxParse/wxParse.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  tolinkUrl: function (e) {
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  },
  getMembersListData: function (id) {
    let that = this
    let customIndex = app.AddClientUrl("/wx_find_user_levels.html")
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log('====getUserCardPackage-res===', res)
        if (res.data.errcode == 0) {
          let data = res.data.relateObj
          that.setData({ membersList: res.data.relateObj })
          for (let i = 0; i < data.length; i++) {
            if (data[i].id == id) {
              console.log("拥有会员")
              that.setData({ myMembers: data[i] })
            }
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '主人~请求超时！确认重新加载',
            success: function (res) {
              if (res.confirm) {
                that.getUserCardPackage()
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        console.log('===membersList===', that.data.membersList);
        console.log('===myMembers===', that.data.myMembers);
      },
      complete: function (res) {

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log('options', options)
    that.setData({ loginUser: app.loginUser, platformSetting: app.setting.platformSetting})
    console.log('loginUser', app.loginUser)
    that.getMembersListData(options.id||0)
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
 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})