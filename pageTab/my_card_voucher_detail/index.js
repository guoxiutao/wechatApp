 
const app = getApp()
Page({ 

  /**
   * 页面的初始数据
   */ 

  data: {
   
  },

  getData: function (id) {
    let that = this
    let getParam = {}
    getParam.cardVoucherId = id
    let customIndex = app.AddClientUrl("/wx_find_user_card_voucher_instances.html", getParam, 'get')
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log(res.data)
        wx.hideLoading()
        let myCardVoucherDetail = res.data
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },


  /* 组件事件集合 */
  tolinkUrl: function (e) {
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  },

  optParam: {}, // option数据 用来转发和刷新
  onLoad: function (options) {
    console.log("options", options)
    this.optParam = options
    this.getData(options.id)
  },

  onReady: function () {
    this.setData({
      setting: app.setting,
      loginUser: app.loginUser,
      sysWidth: app.globalData.sysWidth,
      sysHeight: app.globalData.sysHeight,
    });
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

    this.data.List = {
      tab: [],
      listData: []
    }
    this.onLoad()

    wx.stopPullDownRefresh()
  },

  scrollTopToReflesh: function () {

  },
  scrollBottomToLoadMore: function () {
  },

  
})