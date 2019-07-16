
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    attendList: {},
  },
  tolinkUrl: function (e) {
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  },
  /* 获取数据 */
  getAttendListData: function (params) {
    let that = this
    let param = Object.assign({}, params, { page: that.pageData.curPage})
    let customIndex = app.AddClientUrl("/wx_find_custom_form_commit_attend_list.html", param)
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log('====getAttendListData-res===',res)
        if (res.data.errcode == 0) {
          let data = res.data.relateObj.result
          if (that.pageData.curPage==1){
            that.data.attendList=[];
          }else{
            data = that.data.attendList.concat(data)
          }
          console.log("=========attendList===========", data)
          that.setData({ attendList: data})
          that.pageData.pageSize = res.data.relateObj.pageSize
          that.pageData.totalSize = res.data.relateObj.totalSize
        }else{
          wx.showModal({
            title: '提示',
            content: '主人~请求超时！确认重新加载',
            success: function (res) {
              if (res.confirm) {
                that.getAttendListData(that.params)
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        console.log('===attendList===', that.data.attendList);
        console.log('===myAttend===', that.data.myAttend);
      },
      complete: function (res) {

      }
    })
  },
  getSessionUserInfo: function () {
    var that = this;
    // wx.showLoading({
    //   title: 'loading'
    // })
    app.showToastLoading('loading', true)
    var postParamUserBank = app.AddClientUrl("/get_session_userinfo.html")
    wx.request({
      url: postParamUserBank.url,
      data: postParamUserBank.params,
      header: app.headerPost,
      success: function (res) {
        console.log(res.data)
        let data = res.data.relateObj
        if (res.data.errcode == '0') {
          that.setData({
            loginUser: data
            })
        } else {
          wx.showToast({
            title: res.data.errMsg,
            image: '/images/icons/tip.png',
            duration: 1000
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: "请求错误",
          image: '/images/icons/tip.png',
          duration: 1000
        })
        console.log(res.data)
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })
  },
  pageData:{
    totalSize:0,
    curPage:1,
    pageSize:20
  },
  /**
   * 生命周期函数--监听页面加载
   */
  params:{},
  onLoad: function (options) {
    console.log('===options===', options)
    let that=this;
    that.params = options
    that.setData({
      setting: app.setting,
      loginUser: app.loginUser
    })
    that.getAttendListData(options);
    console.log("===loginUser====", that.data.loginUser)
    console.log("===setting====", that.data.setting)
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
    this.getSessionUserInfo()
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
    let that = this;
    that.pageData.curPage = 1;
    that.getAttendListData(that.params);
    that.setData({
      setting: app.setting,
      loginUser: app.loginUser
    })
    console.log("===loginUser====", that.data.loginUser)
    wx.stopPullDownRefresh() 
  },
  /**
   * 页面上拉触底事件的处理函数
   * pageData:{
        totalSize:0,
        curPage:1,
        pageSize:20
      },
   */
  onReachBottom: function () {
    console.log('===onReachBottom====')
    let that=this;
    if (that.pageData.totalSize > that.pageData.curPage * that.pageData.pageSize){
      that.pageData.curPage += 1;
      that.getAttendListData(that.params);
    }else{
      wx.showToast({
        title: "到底了~",
        image: '/images/icons/tip.png',
        duration: 1000
      })
    }
  },

})