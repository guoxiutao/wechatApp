const app = getApp();
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    formCommitId:{
      type: String,
    },
    showBtn: {
      type: String,
    },
    showTitle: {
      type: String,
    }
  },
  data: {
    formData:null,
    upLoadImageList:{},
    commentValue:"",
    conmmentList:[],
    recommentId:0,
    markers:[],
    loading:true,
    recommentReturn:false,
    address:null,
    pageData:{
      totalPage: 1,
      totalSize: 1,
      pageSize: 1,
      curPage: 1,
    }
  },
  // 返回
  ready: function () {
    let that=this;
    console.log("======formCommitId=====", that.data.formCommitId)
    console.log("======showBtn=====", that.data.showBtn)
    that.setData({ setting: app.setting })
    that.setData({ loginUser: app.loginUser })
    // that.data.formCommitId = that.data.formCommitId
    that.getDetail()
  },
  methods: {

    //物流单号 一键复制的事件
    copyText: function (e) {
      console.log("====copyText====",e)
      let value = e.currentTarget.dataset.value
      let that = this;
      wx.setClipboardData({
        data: value,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功',
                icon: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    tolinkUrl: function (event) {
      console.log(event.currentTarget.dataset.link)
      console.log("===========e==========", event.currentTarget.dataset.url)
      app.linkEvent(event.currentTarget.dataset.link);
    },
    saveImageToLocal: function (e) {
      let imgSrc = e.currentTarget.dataset.imageurl
      console.log(imgSrc)
      let PostImageSrc = imgSrc.replace(/http/, "https")
      // let PostImageSrc = imgSrc
      console.log(PostImageSrc)
      if (!imgSrc) {
        return
      }
      let urls = []
      urls.push(imgSrc)
      wx.previewImage({
        current: imgSrc, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    },
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
          that.data.pageData.totalSize = res.data.relateObj.totalSize;
          that.data.pageData.curPage = page;
          that.data.pageData.pageSize = res.data.relateObj.pageSize;
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
                let name = customForm.items[i].name
                console.log("===img_======", customForm.items[i].type, customForm.items[i].type == 7 || customForm.items[i].type == 11)
                if (customForm.items[i].type == 7 || customForm.items[i].type == 11) {
                  upLoadImageList['img_' + i] = [];
                  if (typeof (commitJson[name]) == "object") {
                    console.log("imgobject", commitJson[name].value)
                    if (typeof (commitJson[name].value) == "object") {
                      upLoadImageList['img_' + i] = commitJson[name].value
                    } else {
                      if (commitJson[name].value) {
                        upLoadImageList['img_' + i].push(commitJson[name].value)
                      }
                    }
                  } else {
                    console.log("imgstring", commitJson[name])
                    if (commitJson[name]) {
                      upLoadImageList['img_' + i].push(commitJson[name])
                    }
                  }
                  console.log("===upLoadImageList====", upLoadImageList)
                } else if (customForm.items[i].type == 9) {
                  if (typeof (commitJson[name]) == "object") {
                    customForm.items[i].defaultValue = commitJson[name].value
                  } else {
                    customForm.items[i].defaultValue = commitJson[name]
                  }
                } else if (customForm.items[i].type == 12) {
                  if (typeof (commitJson[name]) == "object") {
                    customForm.items[i].defaultValue = commitJson[name].value.value
                  }
                } else if (customForm.items[i].type == 9999) {
                  // if (customForm.items[i].splitStyle){
                  //   customForm.items[i].splitStyle = JSON.parse(customForm.items[i].splitStyle);
                  // }
                } else {
                  if (typeof (commitJson[name]) == "object") {
                    customForm.items[i].defaultValue = commitJson[name].value
                  } else {
                    customForm.items[i].defaultValue = commitJson[name]
                  }
                }
              }
              that.setData({ upLoadImageList: upLoadImageList })
              that.setData({ customForm: customForm })
              console.log("===customForm====", that.data.customForm)
              console.log("===upLoadImageList====", that.data.upLoadImageList)
            }
            if(that.data.showTitle!='false'){
              wx.setNavigationBarTitle({
                title: that.data.customForm.formName
              })
            }
          }else{
            wx.showToast({
              title: '加载失败...',
              icon: 'none',
              duration: 2000,
            })
            setTimeout(function () {
              wx.navigateBack(
                { delta: 1, }
              )}, 2000);
            
          }
        }
      })
  },
  onShow: function () {
    let that = this;
    if (that.data.recommentReturn) {
      that.getCommentData(that.data.allFormData.id, 1)
    }
  },
  onReachBottom: function () {
    let that = this;
    console.log('dddddddddddddd', that.data.pageData.totalSize)
    if (that.data.pageData.totalSize) {
      if (that.data.pageData.totalSize > that.data.pageData.curPage * that.data.pageData.pageSize) {
        that.getCommentData(that.data.allFormData.id, ++that.data.pageData.curPage);
      } else {
        console.log("没有更多数据了");
      }
    } else {

    }
  },
  onPullDownRefresh: function () {
    let that = this;
    that.getCommentData(that.data.allFormData.id, 1);
    that.getDetail()
  },
  }
})