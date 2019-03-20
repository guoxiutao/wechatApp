
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData:null,
    sexArray:['男','女'],
    pickerIndex:0,
    upLoadImageList:{},
    dataAndTime:{},
    processType:false,
    gainActionEvent: {},
    commentValue:"",
    region: "请选择您的地址",
    conmmentList:[],
    recommentId:0,
    markers:[],
    formCommitId:0,
    loading:true,
    recommentReturn:false,
    address:null,
  },
  totalPage: 1,
  totalSize: 1,
  pageSize: 1,
  curPage: 1,
  // 返回
  back:function(){
    wx.navigateBack()
  },
  // 定位
  clickCatch: function (e) {
    let latitude = 26.074790;
    let longitude = 119.272080;
    let name = "福州至诚学院";
    let address = "福州至诚学院";
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 12,
      name: name,
      address: address
    })
  },
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
  tolinkUrl: function (e) {
    let that=this;
    that.data.recommentReturn=true;
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  },
  saveData:function(data){
    let that=this
    console.log("===saveData==",data)
    that.data.commentValue = data.detail.value;
  },
  sendComments: function (e) {
    console.log("===sendComments==", e)
    var that = this
    let value= e?e.detail.value:""
    that.commentInput(value)
  },
  //添加评论
  commentInput: function (commentValue) {
    console.log("===sendComments==", commentValue)
    var that = this
    let data = {
      customFormInstanceId: that.data.allFormData.id,
      comment: commentValue || that.data.commentValue,
    }
    console.log('文本输入框: input_value :', data);
    let customIndex = app.AddClientUrl("/add_bbs_comments.html", data, 'post')
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.headerPost,
      method: 'POST',
      success: function (res) {
        console.log('==res===', res)
        if (res.data.errcode==0){
          that.getCommentData(that.data.allFormData.id, 1)
          wx.showToast({
            title: "评论成功",
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: "评论失败",
            icon: "none",
            duration: 2000
          })
        }
      },

    })

  },
  //获取评论数据
  getCommentData: function (customFormInstanceId, page) {
    let that = this;
    let data = {
      customFormInstanceId: customFormInstanceId,
      page: page
    }
    let customIndex = app.AddClientUrl("/get_news_bbs_comments.html", data)
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.header,
      success: function (res) {
        console.log('====sssssss===', res)
        if (page == 1) {
          that.setData({ conmmentList: res.data.relateObj.result })
        } else {
          console.log("====more page====");
          that.setData({ conmmentList: that.data.conmmentList.concat(res.data.relateObj.result) })
        }
        that.totalSize = res.data.relateObj.totalSize;
        that.curPage = page;
        that.pageSize = res.data.relateObj.pageSize;
      },
      fail: function (res) {//获取数据失败就会进入这个方法
        wx.hideLoading()
      }
    })
  },
  // 定位
  clickCatch: function (e) {
    console.log("===定位====",e)
    let itemData = e.currentTarget.dataset.item
    let latitude = itemData.latitude;
    let longitude = itemData.longitude;
    let name = itemData.value;
    let address = itemData.value
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 12,
      name: name,
      address: address
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    console.log("that.data.markers",that.data.markers)
    console.log(options)
    that.data.formCommitId = options.custom_form_commit_id;
    that.getDetail()
  },
  getDetail: function (formCommitId){
    let that=this;
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
    })
    let formDetailData = app.AddClientUrl("/wx_get_custom_form_commit.html", { formCommitId: that.data.formCommitId }, 'get')
    wx.request({
      url: formDetailData.url,
      data: formDetailData.params,
      header: app.headerPost,
      method: 'get',
      success: function (res) {
        console.log("====success====",res)
        if (res.data.errcode==0){
          wx.hideLoading()
          that.setData({ allFormData: res.data.relateObj, loading:false})
          let customForm = that.data.allFormData.customForm;
          that.getCommentData(that.data.allFormData.id, 1)
          let commitJson = JSON.parse(that.data.allFormData.commitJson);
          customForm.commitArr = [];
          for (let key in commitJson) {
            if (key == 'telno') {
              customForm.telno = commitJson[key].value
            } else if (key == 'address'){
              that.setData({ address: commitJson[key].value })
            }
            customForm.commitArr.push(commitJson[key])
          }
          console.log("===commitJson==", commitJson)
          if (customForm.items.length > 0) {
            let upLoadImageList = {};
            for (let i = 0; i < customForm.items.length; i++) {
              for (let j in commitJson) {
                if (customForm.items[i].type == 7) {
                  if (customForm.items[i].name == j) {
                    if (typeof (commitJson[j]) == "object") {
                      upLoadImageList['img_' + i] = commitJson[j].value
                    } else {
                      upLoadImageList['img_' + i] = commitJson[j]
                    }
                  }
                } else if (customForm.items[i].type == 9) {
                  if (customForm.items[i].name == j) {
                    if (typeof (commitJson[j]) == "object") {
                      customForm.items[i].defaultValue = commitJson[j].value
                    } else {
                      customForm.items[i].defaultValue = commitJson[j]
                    }
                  }
                } else {
                  if (customForm.items[i].name == j) {
                    if (typeof (commitJson[j]) == "object") {
                      customForm.items[i].defaultValue = commitJson[j].value
                    } else {
                      customForm.items[i].defaultValue = commitJson[j]
                    }
                  }
                }
              }
            }
            that.setData({ upLoadImageList: upLoadImageList })
            that.setData({ customForm: customForm })
            console.log(that.data.customForm)
          }
          wx.setNavigationBarTitle({
            title: that.data.customForm.formName
          })
        }else{
          wx.showToast({
            title: '加载失败...',
            icon: 'none',
            duration: 2000,
          })
          wx.navigateBack(
            { delta: 1, }
          )
        }
      }
    })
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
    let that=this;
    if (that.data.recommentReturn){
      that.getCommentData(that.data.allFormData.id, 1)
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
    let that=this;
    that.getCommentData(that.data.allFormData.id, 1);
    that.getDetail()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('dddddddddddddd')
    let that=this;
    if (that.totalSize) {
      if (that.totalSize > that.curPage * that.pageSize) {
        that.getCommentData(that.data.allFormData.id, ++that.curPage);
      } else {
        console.log("没有更多数据了");
      }
    }
  },

})