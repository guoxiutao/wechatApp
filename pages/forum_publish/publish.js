// pages/forum_publish/publish.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleCount: 0, //标题字数
    contentCount: 0, //正文字数
    title: '', //标题内容
    content: '' ,//正文内容
    showView: true,
    focus: false,
    selecttype: '交易',
    // 上传图片
    images: [],
    upLoadImageList: [],
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [ ],//下拉列表的数据
    index: 0//选择的下拉列表下标
  
  },


 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objectId = options.objectId; 
    console.log('===objectId====',objectId);
    // this.getDate(options); //实参  驼峰命名法 连拼首字母要大写
    //
  },

  // 获取类型
  getData: function (e) {
    console.log('=====type=====')
    var that = this;
    var formData = e.detail.value;
    let customIndex = app.AddClientUrl("/get_news_type_list.html")
    wx.request({
      url: customIndex.url,
      formData: customIndex.params,
      header: app.header,
      success: function (res) {
        console.log('res',res)
      }
    })
      
  },

  //下拉显示
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },

   
   

  
 //请输入标题
  titleWrite: function (e) {
    const value = e.detail.value
    this.data.title = value
    this.data.titleCount = value.length  //计算已输入的标题字数
   
    console.log('===biao ti ====',e.detail.value)
  },

// //请输入正文
  conentWrite: function (e) {
    const value = e.detail.value
    this.data.content = value
    this.data.contentCount = value.length  //计算已输入的正文字数
    
    console.log('===zhengwen  ====',e.detail.value)
  },

   //选择图片
  chooseImage: function (e) {
    var that = this
    console.log('---e-----'+e)
    wx.chooseImage({
      count: 9, 
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: function (res) {
         let tempFilePaths = res.tempFilePaths
        that.uploadImage(tempFilePaths, tempFilePaths.length)
      }
    })
  },


  uploadImage: function (tempFilePaths, count) {
    if (!app.loginUser) {
      app.echoErr('用户未登录')
      return
    }
    console.log(count)
    let that = this
    let param = {
      userId: app.loginUser.id
    }
    var customIndex = app.AddClientUrl("/file_uploading.html", param, 'POST')
    wx.uploadFile({
      url: customIndex.url, //仅为示例，非真实的接口地址
      header: {
        'content-type': 'multipart/form-data'
      },
      filePath: tempFilePaths[count - 1],
      name: 'file',
      formData: customIndex.params,
      success: function (res) {
        let upLoadImageList = that.data.upLoadImageList
        var data = res.data
        console.log(data)

        if (typeof (data) == 'string') {
          data = JSON.parse(data)
          console.log(data)
          if (data.errcode == 0) {
            upLoadImageList.push(data.relateObj.imageUrl)
            that.setData({
              upLoadImageList: upLoadImageList
            })
          }
        } else if (typeof (data) == 'object') {
          if (data.errcode == 0) {
            upLoadImageList.push(data.relateObj.imageUrl)
            that.setData({
              upLoadImageList: upLoadImageList
            })
          }
        }

        //do something
      }, fail: function (e) {
        console.log(e)
      }, complete: function (e) {
        if (count == 1 || count < 1) {
          return false;
        } else {
          that.uploadImage(tempFilePaths, --count)
        }

      }
    })
  },
  // 图片预览
  previewImage: function (e) {
    //console.log(this.data.images);
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.images
    })
  },
  //删除
  delete: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index; 
    var images = that.data.images;
    images.splice(index, 1);
    that.setData({
      images: images
    });
  },
 
//点击提交
  submit: function (e) {
    let that = this
    var formData = e.detail.value;
    let data = {
      imagePath: this.data.upLoadImageList,
      userId: app.loginUser.id,
      content:this.data.content,
      title: this.data.title,
      // newsType: this.data.clickChange,
    }
    console.log('11111111', data)
    let customIndex = app.AddClientUrl("/add_bbs_news.html", data , 'post')
    wx.request({
      url: customIndex.url,
      header: app.headerPost,
      method: 'POST',
      data: customIndex.params,
      success: function (res) {
        that.setData({
        data:data
        })
        console.log('===ti jiao===', res.data)
      }
    })

  },
  
})