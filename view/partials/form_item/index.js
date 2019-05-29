const app = getApp();
Component({
  properties: {


    // 这里定义了innerText属性，属性值可以在组件使用时指定
    data: {
      type: Object,
      value: 'default value',
    },
    formListStyle: {
      type: Object,
      value: 'default value',
    },
  },
  data: {
    setting: null, // setting   
    formCommitItem:{},
    width:'',
    height:'',
  },
  ready: function () {
    let that = this;
    console.log("====form-item-formCommitItem======", that.data.data);
    console.log("====form-item-formListStyle=====", that.data.formListStyle);
    that.setData({ formCommitItem: that.data.data})
    that.setData({ width: Number(that.data.formListStyle.width) || 0 })
    that.setData({ height: Number(that.data.formListStyle.height) || 0 })
    console.log("====form-item-width=====", that.data.width);
    console.log("====form-item-height=====", that.data.height);
  },
  methods: {
    calling: function (e) {
      console.log('====e===', e)
      let phoneNumber = e.currentTarget.dataset.phonenumber
      wx.makePhoneCall({
        phoneNumber: phoneNumber, //此号码并非真实电话号码，仅用于测试
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
    },
    //获取产品分类
    getOrganizesType: function (parentCategoryId, categoryId, callback) {
      var customIndex = app.AddClientUrl("/wx_get_categories_only_by_parent.html", { categoryId: parentCategoryId })
      wx.showLoading({
        title: 'loading'
      })
      var that = this
      wx.request({
        url: customIndex.url,
        header: app.header,
        success: function (res) {
          wx.hideLoading()
          console.log("getOrganizesType", res.data)
          if (res.data.errcode == 0) {
            that.setData({ organizesType: res.data.relateObj })
          } else {
            that.setData({ organizesType: that.data.organizesType })
          }
          that.data.organizesType.unshift({ id: categoryId || parentCategoryId, name: "全部" })
          for (let i = 0; i < that.data.organizesType.length; i++) {
            that.data.organizesType[i].colorAtive = '#888';
          }
          that.data.organizesType[0].colorAtive = that.data.setting.platformSetting.defaultColor;
          that.data.organizesType[0].active = true;
          that.setData({ organizesType: that.data.organizesType })
          wx.hideLoading()
        },
        fail: function (res) {
          console.log("fail")
          wx.hideLoading()
          app.loadFail()
        }
      })
    },
    toIndex() {
      app.toIndex()
    },
    tolinkUrl: function (e) {
      let linkUrl = e.currentTarget.dataset.link
      app.linkEvent(linkUrl)
    },
    initSetting() {
      this.setData({ setting: app.setting })
      for (let i = 0; i < this.data.setting.platformSetting.categories.length; i++) {
        this.data.setting.platformSetting.categories[i].colorAtive = '#888';
      }
      this.data.setting.platformSetting.categories[0].colorAtive = this.data.setting.platformSetting.defaultColor;
      this.setData({
        setting: this.data.setting,
      })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

      this.data.params.name = ""
      this.data.listPage.page = 1
      this.data.params.page = 1
      this.getData(this.data.params)

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      var that = this
      if (that.data.listPage.totalSize > that.data.listPage.curPage * that.data.listPage.pageSize) {
        that.data.listPage.page++
        that.data.params.page++
        that.getData(that.data.params);
      }
    },
  }
})