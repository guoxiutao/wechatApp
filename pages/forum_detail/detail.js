// pages/detail/datail.js
var WxParse = require('../../wxParse/wxParse.js');

const app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    pic:'',
    prolist:[],
    conmmentList:[],
  },
  
 
  pageNumber: 1,
  totalPage: 1,
  totalSize:1,
  pageSize:1,
  curPage:1,
  totalPage:1,
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('options',options)
    this.setData({ id: options.id})
    this.getData(options['id']);
    this.gainCommentData(options['id'],1);
    
  },
  

   //添加评论
  btn_send: function (e) {
    var that = this
    let data = {
      newsId: that.data.id,
      comment: e.detail.value,
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
      },
     
    })
 
  },


  //获取数据
  getData: function (newsId,completeCallback){
       //富文本 内容实现
    console.log('---0----', newsId)
   var that =this;
    let data = {
      newsId: that.data.id,
    }
    let customIndex = app.AddClientUrl("/get_news_bbs_detail.html", data) 
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.header,
      // method: 'GET',
     success: function (res){//对数据的处理 都写在SUCCESS 里
       console.log(res)
       that.setData({detail: res.data});
       WxParse.wxParse('content', 'html', res.data.content, that, 10);



       //评论列表渲染
       let commentData = that.data.detail;
       for (let i = 0; i < commentData.comments.length; i++) {
         commentData.comments[i].commentTime = commentData.comments[i].commentTime.slice(0, -9)//将评论里面的时间舍掉9个（从由到左）
         let str = commentData.comments[i].commentImagesJson;
         console.log('==str==', str)
         let commentImagesArray =''
         if (str!='[]'){
           commentImagesArray= str.slice(1, -1).split(',')
           //将str的字符串先舍去（1，-1）就是[]  再拆分成以,隔开的数组
         }
         for (let i=0;i<commentImagesArray.length;i++){
           console.log('==commentImagesArray[i]==',commentImagesArray[i])
           commentImagesArray[i] = JSON.parse(commentImagesArray[i]) //将字符串转化为数组
         }
         if (commentImagesArray.length > 3) {
           commentData.comments[i].commentImagesArray = commentImagesArray.slice(0, 3)
         } else {
           commentData.comments[i].commentImagesArray = commentImagesArray
         }
       }

       that.setData({ detail: commentData })
       console.log('===that=====', that.data.detail)
       if (completeCallback){
         completeCallback();
       }
     },
   })
   
  },



//选择图片
  bindblur: function (e) {
    console.log('1111111:', e.detail.value)
  },

  chooseImg: function () {
    let that = this
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0]
        console.log('======log========',res.tempFilePaths)
        that.setData({ images: res.tempFilePaths[0] }) //图片的本地文件路径列表
      }
    })
  },

// 再评论列表
  listToggle: function (re) {
    let that = this
    console.log('2222',re)
    let id = re.currentTarget.dataset.id
    wx.navigateTo({
      url: '../forum_reply/reply?id='+id,
       success: function (rrr) {
        console.log('====data====', rrr)
      },
      fail: function (rrr) { },
      complete: function (rrr) { },
    })
   

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

  showMoreRecomment: function (){
       
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('=======on========')
    var that = this;
    this.gainCommentData(this.data.id,1);
    wx.showNavigationBarLoading()
    this.getData(this.data.id,function(){
      console.log("========停止滚动=======");
      wx.stopPullDownRefresh()}) //停止下拉刷新
      wx.hideNavigationBarLoading() //完成停止加载});
  
  },
  //回复方法
  gainCommentData: function (newsId,page){
    let that=this;
    let data = {
      newsId: that.data.id,
    }
    let customIndex = app.AddClientUrl("/get_news_bbs_comments.html", data)
  wx.request({
    url: customIndex.url,
    data: customIndex.params,
    header: app.header,
    
    success: function (res) {
      console.log('====sssssss===', res)
      if(page==1){
      that.setData({ conmmentList: res.data.result})
      }else{
        console.log("====more page====");
        that.setData({ conmmentList: that.data.conmmentList.concat(res.data.result) })
      }
      that.totalSize = res.data.totalSize;
      that.curPage = page;
      that.pageSize = res.data.pageSize;
    },
    fail: function (res) {//获取数据失败就会进入这个方法
      wx.hideLoading()
    }
  })
},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('dddddddddddddd')
    if(this.totalSize){  
      if(this.totalSize>this.curPage*this.pageSize){
       
        this.gainCommentData(this.data.id, ++this.curPage);
      }else{
          //Toast.show("没有更多数据了");
          console.log("没有更多数据了");
      }
    }
   
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})

