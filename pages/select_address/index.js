
const app = getApp()
Page({

  data: {
    setting: null,
    loginUser: null,
    addrData:null,
    selectAddressData:{},
  },  
  selectAddress:function(e){
    console.log("======e=======",e);
    let that=this;
    let addressInfo = e.currentTarget.dataset.info;
    that.setData({ selectAddressData: addressInfo})
    that.getNearMenDian(addressInfo)
  },
  //  附近门店取第一个
  getNearMenDian: function (addressInfo) {
    let that = this;
    let latitude = addressInfo.latitude
    let longitude = addressInfo.longitude
    let menDian = {
      longitude: longitude,
      latitude: latitude

    }
    // longitude 经度        
    // 获取门店的样式
    let menDianYangShi = app.AddClientUrl("/find_mendians.html", menDian, 'get')
    wx.request({
      url: menDianYangShi.url,
      data: menDianYangShi.params,
      header: app.headerPost,
      method: 'GET',
      success: function (res) {
        console.log("===附近门店取第一个", res.data)
        if (res.data.errcode == "-1") {
          wx.showToast({
            title: res.data.errMessage,
            image: '/images/icons/tip.png',
            duration: 2000
          })
        }
        else {
          let firstMendian = res.data.relateObj.result;
          if (firstMendian.length!=0 && firstMendian[0].id) {
            // 当数据都存在，然后就开始设置门店
            that.setUpMenDian(firstMendian[0].id);
          }else{
            wx.showToast({
              title: "您附近没有相关门店哦!",
              image: '/images/icons/tip.png',
              duration: 2000
            })
          }
        }
      }
    })
  },

  // 设置门店（当门店信息都有的时候，将门店id传到服务器。）
  setUpMenDian: function (menDianID) {
    let that=this;
    let id = menDianID
    let menDianParameter = {
      mendianId: id
    }

    let menDianYangShi = app.AddClientUrl("/location_mendian.html", menDianParameter, 'get')
    wx.request({
      url: menDianYangShi.url,
      data: menDianYangShi.params,
      header: app.headerPost,
      method: 'GET',
      success: function (res) {
        console.log('=====setUpMenDian====',res)
        if (res.data.errcode == "-1") {
          wx.showToast({
            title: res.data.errMessage,
            image: '/images/icons/tip.png',
            duration: 2000
          })
        }
        else {
          console.log("设置成功")
          let pages = getCurrentPages();//当前页面
          let prevPage = pages[pages.length - 2];//上一页面
          prevPage.setData({//直接给上移页面赋值
            selectAddress: that.data.selectAddressData,
          });
          wx.navigateBack(
            { delta: 1, }
          )
        }
      }
    })
  },
/* 编辑 */
  writeAddr: function (e) {
    var addrId = e.currentTarget.dataset.id
    for (let i = 0; i < this.data.addrData.length;i++){
      if (addrId == this.data.addrData[i].id){
        
        app.EditAddr = this.data.addrData[i]
      }
    }
    wx.navigateTo({
      url: '../add_address/index?addrId=' + addrId,
    })
  },
 
  getAddr: function () {
    if (!app.checkIfLogin()) {
      return
    }
    var customIndex = app.AddClientUrl("/get_login_user_address_list.html")
    var that = this
    wx.showLoading({
      title: 'loading'
    })
    //拿custom_page 
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log('-------地址---------')
        console.log(res.data)
        if (res.data.result.errcode == '-1'){
          console.log('err')
          app.echoErr(res.data.result.errMsg)
        }else{
          that.setData({ addrData: res.data.result })
        }
        
        wx.hideLoading()
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ setting: app.setting })
    this.setData({ loginUser: app.loginUser })
    this.getAddr()
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
    this.getAddr()
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
    this.getAddr()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})