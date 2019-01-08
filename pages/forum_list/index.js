//index.js
//获取应用实例
const app = getApp()

Page({
  //存储初始数据  需修改和存储数据需在setDate内
  data: {   
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    ifnumber:3,
    postsList:[],
    
    pageNumber: 1,
    totalPage: 1,

  },

//页面加载的方法（基本每个页面都会有）
  onLoad: function () { 
    this.getData(1);//加载此方法  getData是获取数据的方法
  },
  

  //获取数据的方法
  getData: function () {
    var that = this;
    let data = {
      page: that.data.pageNumber } //变量 等同于在url后面加&page 但由于是变量不能加
    let customIndex = app.AddClientUrl("/more_news_bbs_list.html", data)
    wx.request({
      url: customIndex.url,
      data: customIndex.params,
      header: app.header,
        
      
      success: function (res) {
        console.log('====res===', res)
        wx.hideLoading()//隐藏获取的数据
        let data = res.data.result
        let totalSize = res.data.totalSize
        let pageSize = res.data.pageSize
        let postsList = data

        for (let i = 0; i < data.length; i++) {
          if (data[i].newsImageJson.length > 3) {
            data[i].imgArray = data[i].newsImageJson.slice(0, 3)
          } else {
            data[i].imgArray = data[i].newsImageJson
          }
        }
        
        if (that.data.pageNumber==1){
          postsList =postsList   //刷新
        }else{
          postsList=that.data.postsList.concat(data)
        }
        // 将新获取的数据 res.data.list，concat到前台显示的showlist中即可。
       
        that.setData({
           postsList:postsList,
          totalPage: totalSize % pageSize == 0 ? parseInt(totalSize / pageSize) : parseInt(totalSize / pageSize) + 1 //parseInt 将字符串转化为整数
        })
      },
      fail: function (res) { 
        wx.hideLoading()
      }
    })
  },

 
 //页面上拉触底事件的处理函数
  onReachBottom: function () {
    var that = this;
    // 当前页+1
    var pageNumber = that.data.pageNumber + 1;

    console.log('====onReachBottom=====', pageNumber, that.data.totalPage)
    that.setData({
      pageNumber: pageNumber,
    })

    if (pageNumber < that.data.totalPage) {
      console.log('====pageNumber < that.data.totalSize=====')
      wx.showLoading({
        title: '加载中',
      }) //显示加载中
      // 请求后台，获取下一页的数据。
      this.getData();
    }
  },


  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
     that.data.pageNumber = 1;

    wx.showNavigationBarLoading() //在标题栏中显示刷新
   
    this.getData();
    wx.stopPullDownRefresh() //停止下拉刷新
    wx.hideNavigationBarLoading() //完成停止加载
  },
    

  //详情页点击事件
  toast : function(event){
    let that=this
    console.log('====q====', event)
    let id = event.currentTarget.dataset.id
     wx.navigateTo({//页面跳转
     url: '../forum_detail/detail?id='+id, //跳转到详情页
     success: function(res) {
       console.log('====data====', res)
     },
    
     fail: function(res) {},
     complete: function(res) {},
   })
  },

publish_icon : function (event) {
    let that = this
    console.log('====publish====', event)
    let id = event.currentTarget.dataset.id
    wx.navigateTo({//页面跳转
      url: '../forum_publish/publish?id=' + id, //跳转到发表帖子页
      success: function (res) {
        console.log('====ppppp====', res)
      },

      fail: function (res) { },
      complete: function (res) { },
    })
  }


})

  