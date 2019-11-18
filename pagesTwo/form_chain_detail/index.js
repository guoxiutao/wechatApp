
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formChainData:null,
    curCommitformId:'',
    formData:null,
    processType: false,
    refProductFormType: false,
    productId:0,
    formId:0,
    chainId:0,
    reqLocation:false,
    locationList:{},
    locationIndex:"",
    sendOptionData:null,
    sendPageDataState:false,
    sendFormData:null,
  },
  params: {
    formJson: '',
    customFormId: '',
    miniNotifyFormId: '',
  },
  // 关闭海报
  getChilrenPoster(e) {
    let that = this;
    that.setData({
      posterState: false,
    })
  },
  showPoster: function () {
    let that = this;
    console.log('===showPoster====', that.params.customFormId)
    let ewmImgUrl = app.getQrCode({ type: "form_detail", id: that.params.customFormId })
    that.setData({
      posterState: true,
      ewmImgUrl: ewmImgUrl,
    })
  },
  tolinkUrl: function (e) {
    if (!app.loginUser) {
      wx.showModal({
        title: '提示',
        content: '主人~您还在登陆哦!稍等片刻',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    let that = this;
    let linkUrl = e.currentTarget ? e.currentTarget.dataset.link:e;
    let index = e.currentTarget ? e.currentTarget.dataset.index:0;
    if (linkUrl.indexOf("select_location.html") != -1) {
      console.log("选择位置")
      that.setData({ reqLocation: true, locationIndex: "position_" + index})
    } else {
      that.setData({ reqLocation: false })
    }
    app.linkEvent(linkUrl)
  },
  selectPsotion: function (e) {
    let that = this;
    console.log("===selectPsotion===",e)
    let locationIndex = e.detail.locationIndex
    that.setData({ reqLocation: true, locationIndex: locationIndex })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    let sendFormData = JSON.stringify({ title: 'noTitle', url: "form_chain_" + options.chainId })
    that.setData({ sendFormData: sendFormData })
    that.data.gainActionEvent = options.actionEvent
    that.setData({ chainId: options.chainId})
    that.params.chainId = options.chainId;
    if (options && options.actionEvent) {
      that.data.processType = true;
    } else {
      that.data.processType = false;
    }
    if (options && options.productId){
      that.data.refProductFormType=true;
      that.data.productId = options.productId
      if (options.params) {
        that.data.skuData = JSON.parse(options.params)
      }else{
        that.data.skuData = that.skuData;
      }
    }else{
      that.data.refProductFormType = false;
    }
    if (options.chainInstanceId){
      that.params.chainInstanceId = options.chainInstanceId 
    }
    if (options.chainId) {
      that.params.chainId = options.chainId
    }
    that.getFormChainDataFun(options,'init')
  },
  getFormChainDataFun: function (options,reqType,index,callback){
    let that=this;
    console.log("===getFormChainDataFun===", options)
    let params = { chainId: options.chainId || 0, chainInstanceId: options.chainInstanceId || 0 }
    let formChainDataUrl = app.AddClientUrl("/wx_create_new_or_get_custom_form_chain_instance.html", params , 'get')
    wx.request({
      url: formChainDataUrl.url,
      data: formChainDataUrl.params,
      header: app.headerPost,
      method: 'get',
      success: function (res) {
        console.log(res)
        let formChainData = res.data.relateObj;
        if (formChainData.customFormChainBean && formChainData.customFormChainBean.formsJson) {
          try {
            formChainData.customFormChainBean.formsJson = JSON.parse(formChainData.customFormChainBean.formsJson);
          } catch (e) {
            formChainData.customFormChainBean.formsJson = formChainData.customFormChainBean.formsJson
            console.log(e);
          }
        }
        console.log("formChainData", formChainData)
        that.setData({ formChainData: formChainData })
        if (formChainData.customFormChainBean.formsJson.forms && formChainData.customFormChainBean.formsJson.forms.length > 0) {
          let initIndex=0
          if (index){
            initIndex=index
          }
          let formId = formChainData.customFormChainBean.formsJson.forms[initIndex].formId;
          let totalLength = formChainData.customFormChainBean.formsJson.forms.length;
          let detailFormId=''
          if (formChainData.commits[initIndex]){
            console.log("===initIndex===", formChainData.commits[initIndex])
            detailFormId = formChainData.commits[initIndex].id
          }
          that.getSomeFormData(formId, initIndex, totalLength, formChainData.id, detailFormId)
        }
        if (reqType == 'init') {
          wx.setNavigationBarTitle({
            title: that.data.formChainData.chainName
          })
        }
        if (callback){
          callback(formChainData)
        }
      }
    })
  },
  perStepFun: function (data) {
    console.log("===perStepFun===", data)
    let that = this;
    let perStepIndex = data.detail.perStepIndex;
    let formChainData = that.data.formChainData;
    let params = { chainId: that.params.chainId || 0, chainInstanceId: formChainData.id || 0 }
    let formId = formChainData.customFormChainBean.formsJson.forms[perStepIndex].formId;
    let totalLength = formChainData.customFormChainBean.formsJson.forms.length
    that.getFormChainDataFun(params, 'next', perStepIndex)
    console.log("===perStepIndex===", perStepIndex); 
  },
  nextStepFun:function(data){
    console.log("===nextStepFun===",data)
    let that=this;
    let nextStepIndex = data.detail.nextStepIndex;
    let formChainData = that.data.formChainData;
    console.log("===nextStepIndex===", nextStepIndex);
    let totalLength = formChainData.customFormChainBean.formsJson.forms.length
    let params = { chainId: that.params.chainId || 0, chainInstanceId: formChainData.id || 0 }
    if (nextStepIndex < totalLength) {
      let formId = formChainData.customFormChainBean.formsJson.forms[nextStepIndex].formId;
      that.getFormChainDataFun(params, 'next', nextStepIndex)
    }else{
      console.log("已提交完所有数据");
      that.tolinkUrl("form_chain_success.html")
    }
  },
  getSomeFormData: function (formId, curIndex, totalLength, chainInstanceId,detailFormId){
    console.log("===getSomeFormData===", formId, detailFormId)
    let that = this;
    let sendOptionData = { customFormId: formId, formChainData: { curIndex: curIndex, totalLength: totalLength, chainInstanceId: chainInstanceId }}
    that.setData({ curCommitformId: detailFormId, formId: formId, sendPageDataState:false})
    that.setData({ sendOptionData: sendOptionData, sendPageDataState: true})
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({ setting: app.setting })
    this.setData({ loginUser: app.loginUser })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if (that.data.reqLocation) {
      // that.setData({ sendPageDataState: false })
      // that.setData({ sendPageDataState: true })
      let locationList = {};
      console.log("从选择地点页面返回", that.data.selectAddress)
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1]; //当前页面
      console.log(currPage) //就可以看到data里mydata的值了
      if (that.data.selectAddress) {
        console.log("选择了地点")
        console.log("locationIndex", that.data.locationIndex)
        locationList[that.data.locationIndex] = that.data.selectAddress
        that.data.locationList = Object.assign({}, that.data.locationList, locationList)
        that.setData({ locationList: that.data.locationList })
        console.log("==locationList==", locationList)
        console.log("==that.data.locationList ==", that.data.locationList )
      }else{
        console.log("没选择地点")
      }
      that.selectComponent("#selectAddress").selectAddress();
    }
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})