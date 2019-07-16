const app = getApp();
Component({
  properties: {


    // 这里定义了innerText属性，属性值可以在组件使用时指定
    data: {
      type: Object,
      value: 'default value',
    },
    params: {
      type: Object,
      value: {},
    },
  },

  /**
   * 页面的初始数据
   */
  data: {
    formCommitList: [],
    moneyAmount: 0,
    mendian: null,
    loading:true,
    publishState:false,
    customFormId:0,
    selectTab:[],
    selectTabIndex:-1,
    selectResultsObj:{},
    showCount:false,
    formType:[],
    showTop: false,
    params: {},
    listPage: {
      page: 1,
      pageSize: 20,
      totalSize: 0,
      customFormId: "",
    },
    componentState:false,
    limitState:0,
    customFormData: {},
    formListStyle: null,
    commitJson: null,
    reqUrl: "/wx_find_decorate_custom_form_commits.html",
    controlLimitState:false,
    showMoreSelectState:false,
    oldSelectResultsData:{},
  },
  ready: function () {
    let that = this;
    console.log("====form-commit-list-data=====", that.data.data);
    let options = that.data.data;
    if (options.reqUrl){
      that.setData({ reqUrl: options.reqUrl })
    }
    if (options.controlLimit) {
      that.setData({ controlLimitState: true })
    }
    if (that.data.data.jsonData && that.data.data.jsonData.count) {
      that.setData({ limitState: that.data.data.jsonData.count, componentState:true})
    }
    that.initSetting();
    console.log('===options===', options)
    if (options.customFormId) {
      console.log("提交按钮后返回的页面")
      that.setData({ showTop: false })
      // that.setData({ customFormId: options.customFormId })
      that.data.listPage.page = 1
      that.data.listPage.customFormId = options.customFormId
      that.getData(this.data.selectResultsObj);
      that.getFormDetail()
    } else {
      console.log("点击类型返回的页面")
      that.setData({ showTop: true })
      // options.groupName ? options.groupName : "";
      let groupName = options.groupName || (options.jsonData && options.jsonData.groupName ? options.jsonData.groupName:"")||''
      that.getFormType(groupName, that.getData);
      that.data.params = options;
    }
  },
  methods: {
    showMore:function(e){
      console.log("==showMore===",e)
      let that=this;
      let type = e.currentTarget.dataset.type;
      let index = e.currentTarget.dataset.index;
      let length = e.currentTarget.dataset.length||2;
      let state = type == "show" ? true:false;
      let showNum = type == "show" ? length : 2;
      that.data.formCommitList[index].showMoreState = state
      that.data.formCommitList[index].showNum = showNum
      that.setData({ formCommitList: that.data.formCommitList})
    },
    /* 组件事件集合 */
    tolinkUrl: function (data) {
      let linkUrl = data.currentTarget ? data.currentTarget.dataset.link : data;
      console.log("==linkUrl===", linkUrl)
      app.linkEvent(linkUrl)
    },
    checkFormDetail: function (data) {
      let that = this;
      console.log("====data===", data)
      let formId = data.currentTarget.dataset.id ? data.currentTarget.dataset.id : 0;
      let belongFormType = data.currentTarget.dataset.belongformtype ? data.currentTarget.dataset.belongformtype : 0;
      if (belongFormType ==0){
        console.log("普通表单")
        wx.showActionSheet({
          itemList: ['查看用户提交的表单'],
          success: function (res) {
            console.log(res.tapIndex)
            if (!formId) {
              wx.showModal({
                title: '提示',
                content: '主人~该表单没有内容哦!',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            } else {
              let url = "check_form_detail.html?custom_form_commit_id=" + formId
              that.tolinkUrl(url)
            }
          },
          fail: function (res) {
            console.log(res.errMsg)
          }
        })
      } else {
        console.log("信息发布表单")
        if (!formId) {
          wx.showModal({
            title: '提示',
            content: '主人~该表单没有内容哦!',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          let url = "check_form_detail.html?custom_form_commit_id=" + formId
          that.tolinkUrl(url)
        }
      }
    },
    toFormRewardList: function (event) {
      console.log('===event===', event)
      let id = event.currentTarget.dataset.id
      let a = "form_reward_list.html?bussinessRecordId=" + id;
      app.linkEvent(a);
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
    //获取表单分类
    getFormType: function (groupName, callback) {
      let customIndex = app.AddClientUrl("/wx_find_custom_forms.html", { groupName: groupName })
      // wx.showLoading({
      //   title: 'loading'
      // })
      app.showToastLoading('loading', true)
      let that = this
      wx.request({
        url: customIndex.url,
        header: app.header,
        success: function (res) {
          wx.hideLoading()
          console.log("getFormType", res.data)
          if (res.data.errcode == 0) {
            that.data.formType = res.data.relateObj.result
          }
          console.log("that.data.formType", that.data.formType, that.data.setting)
          if (that.data.formType.length != 0) {
            for (let i = 0; i < that.data.formType.length; i++) {
              that.data.formType[i].colorAtive = '#888';
            }
            that.data.formType[0].colorAtive = that.data.setting.platformSetting.defaultColor;
            that.data.formType[0].active = true;
            that.setData({ formType: that.data.formType })
            console.log("that.data.formType2", that.data.formType)
            if (callback) {
              that.data.listPage.customFormId = that.data.formType[0].id;
              console.log("====that.data.listPage=====", that.data.listPage)
              that.getFormDetail();
              that.setData({ customFormId: that.data.formType[0].id })
              that.getData(that.data.selectResultsObj)
            }
          } else {
            that.setData({ formType: null })
          }
          wx.hideLoading()
        },
        fail: function (res) {
          console.log("fail")
          wx.hideLoading()
          app.loadFail()
        }
      })
    },
    /* 点击分类大项 */
    bindTypeItem: function (event) {
      console.log(event)
      let onId;
      if (event && event.currentTarget) {
        onId = event.currentTarget.dataset.type.id
        console.log('====bindTypeItem currentTarget====', onId)
      } else if (event && !event.currentTarget) {
        onId = event
        console.log('====bindTypeItem event====', onId)
      }
      for (let i = 0; i < this.data.formType.length; i++) {
        if (this.data.formType[i].id == onId) {
          this.data.formType[i].active = true
          this.data.formType[i].colorAtive = this.data.setting.platformSetting.defaultColor;
        }
        else {
          this.data.formType[i].active = false
          this.data.formType[i].colorAtive = '#888';
        }
      }
      this.setData({
        formType: this.data.formType,
      })

      this.data.listPage.page = 1
      this.data.listPage.customFormId = onId
      this.setData({ customFormId: onId })
      this.getData(this.data.selectResultsObj,'upload')
      this.getFormDetail()
    },
    /* 获取数据 */
    getData: function (selectData,state) {
      let that = this;
      if (!app.checkIfLogin()) {
        return
      }
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
      })
      console.log("selectData", selectData)
      console.log("that.data.listPage", that.data.listPage)
      let getParams = {};
      getParams = that.data.listPage
      if (JSON.stringify(selectData)!='{}') {
        console.log("============selectData===============")
        let jsonData = JSON.stringify(selectData);
        getParams = Object.assign({}, getParams, { search: jsonData})
      }
      console.log("getParams", getParams)
      let customIndex = app.AddClientUrl(that.data.reqUrl, getParams)
      wx.request({
        url: customIndex.url,
        header: app.header,
        success: function (res) {
          console.log(res.data)
          if (res.data.errcode == 0) {
            that.data.listPage.pageSize = res.data.relateObj.pageSize
            that.data.listPage.totalSize = res.data.relateObj.totalSize
            let dataArr = that.data.formCommitList
            if (that.data.listPage.page == 1) {
              that.setData({ formCommitList: null })
            }
            if ((!res.data.relateObj.result || res.data.relateObj.result.length == 0) || that.data.listPage.page==1) {
              dataArr=[];
            } 
            dataArr = dataArr.concat(res.data.relateObj.result)
            console.log("=========dataArr=========", dataArr)
            let obj;
            for (let i = 0; i < dataArr.length; i++) {
              
              dataArr[i].showMoreState =false;
              dataArr[i].showNum = 2;
              dataArr[i].commitArr=[];
              if (dataArr[i].commitJson){
                if (typeof (dataArr[i].commitJson)=='object'){
                  obj = dataArr[i].commitJson
                }else{
                  obj = JSON.parse(dataArr[i].commitJson)
                }
                dataArr[i].commitJson = obj
                for (let key in obj){
                  if (key == 'telno') {
                    dataArr[i].telno = obj[key].value||""
                  }
                  if (obj[key].type == 4) {
                    
                  }
                  dataArr[i].commitArr.push(obj[key])
                }
              }
            }
            for (let i = 0; i < dataArr.length; i++){
              if (dataArr[i].commitArr.length != 0) {
                let lengthStr = 0;
                for (let j = 0; j < dataArr[i].commitArr.length; j++) {
                  if (dataArr[i].commitArr[j].showInList == 1) {
                    lengthStr++
                  }
                }
                console.log("======lengthStr====", lengthStr)
                dataArr[i].lengthStr = lengthStr
              }
            }
            // for (let i = 0; i < dataArr.length;i++){
            //   dataArr[i] = JSON.stringify(dataArr[i])
            // }
            that.setData({ formCommitList: dataArr })
            console.log("===formCommitList====", that.data.formCommitList,)

            wx.hideLoading();
            that.setData({ loading: false })
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
          console.log('===formCommitList===', that.data.formCommitList);
        },
        complete: function (res) {

        }
      })
    },
    getFormDetail:function(){
      let that=this;
      let formListStyle;
      let formDetailData = app.AddClientUrl("/wx_get_custom_form.html", { customFormId: that.data.listPage.customFormId || "" }, 'get')
      console.log('==formDetailData===', formDetailData)
      wx.request({
        url: formDetailData.url,
        data: formDetailData.params,
        header: app.headerPost,
        method: 'get',
        success: function (res) {
          console.log(res)
          if(res.data.errcode==0){
            let data = res.data.relateObj;
            that.setData({ customFormData: data })
            if (data && data.decorateListStyle) {
              formListStyle = JSON.parse(data.decorateListStyle);
              console.log("有装修列表", formListStyle)
              that.setData({ formListStyle: null })
              that.setData({ formListStyle: formListStyle })
              that.setData({ width: Number(that.data.formListStyle.width) || 0 })
              that.setData({ height: Number(that.data.formListStyle.height) || 0 })
            } else {
              that.setData({ formListStyle: null })
              console.log("没有装修列表")
              that.setData({ width: 0})
              that.setData({ height: 0 })
            }
            console.log("===formListStyle====", that.data.formListStyle, that.data.banner, that.data.width, that.data.height)

            if (res.data.relateObj.formType!=0){
              that.setData({ publishState:true})
            }else{
              that.setData({ publishState: false })
            }
            if (data.items.length != 0) {
              let selectTab = [];
              let selectResultsObj = {};
              for (let i = 0; i < data.items.length; i++) {
                let listValues = [];
                let selectTabItem = {};
                if (data.items[i].type == 2 || data.items[i].type == 4){
                  selectResultsObj[data.items[i].name]=""//选择值的初始化
                  selectTabItem.title = data.items[i].title;//选择Tab标题
                  selectTabItem.type = data.items[i].type == 2?'pull-down':'multi-select';//选择Tab类型(下拉)
                  selectTabItem.name = data.items[i].name;//选择Tab键值
                  selectTabItem.state = false;//选择Tab状态
                  if (data.items[i].listValues){//选择Tab的值
                    if (data.items[i].listValues.indexOf(",") != -1) {
                      listValues = data.items[i].listValues.split(',')
                    } else {
                      listValues=[data.items[i].listValues]
                    }
                    for (let j = 0; j < listValues.length; j++) {
                      let obj = {};
                      obj.value = listValues[j];
                      obj.state = false;
                      listValues[j] = obj
                    }
                    selectTabItem.listValues = listValues;
                  }
                  console.log("===selectTabItem===", selectTabItem)
                  selectTab.push(selectTabItem)
                } else if (data.items[i].type == 13){//级联组件类型
                  selectResultsObj[data.items[i].name] = ""//选择值的初始化
                }
              }
              console.log("==selectTab===", selectTab)
              console.log("==selectResultsObj===", selectResultsObj)
              that.setData({ selectTab: selectTab, selectResultsObj: selectResultsObj})
            }else{
              that.setData({ selectTab: [] })
            }
          }
        }
      })
    },
    selectTab:function(e){
      console.log("====selectTab====",e)
      let that=this;
      let selectTab = that.data.selectTab
      let index = e.currentTarget.dataset.index;
      if (that.data.selectTabIndex!=index){
        that.setData({ showCount: true  ,showMoreSelectState: false})
        that.setData({ selectTabIndex: index })
        for (let i = 0; i < selectTab.length;i++){
          selectTab[i].state=false;
        }
        that.data.selectTab[index].state=true
        that.setData({ selectTab: selectTab })
      } else {
        that.closeZhezhao()
      }
    },
    selectResult:function(e){
      let that=this;
      console.log("===selectResult===",e);
      let index = e.currentTarget.dataset.index;//选项的位置
      let type = e.currentTarget.dataset.type;//选项的类型
      let indexFather = e.currentTarget.dataset.father;//tab的位置(更多里面点击时传的)
      let selectTabIndex = indexFather||that.data.selectTabIndex;//tab的位置
      let selectTab = that.data.selectTab//tab数据
      that.data.oldSelectResultsData = JSON.parse(JSON.stringify(that.data.selectResultsObj))
      let selectResultsObj = that.data.selectResultsObj//搜索数据
      if (selectTab[selectTabIndex].type =='pull-down'){
        if (index == -1) {
          console.log("======pull-down选择了全部=====")
          selectResultsObj[selectTab[selectTabIndex].name] = ""
        } else {
          console.log("======pull-down选择了其他选项=====")
          selectResultsObj[selectTab[selectTabIndex].name] = selectTab[selectTabIndex].listValues[index].value
          for (let i = 0; i < selectTab[selectTabIndex].listValues.length;i++){
            selectTab[selectTabIndex].listValues[i].state=false;
          }
          selectTab[selectTabIndex].listValues[index].state = true
        }
        if (!type && type !='more_select'){
          that.closeZhezhao()
        }
      } else if (selectTab[selectTabIndex].type == 'multi-select'){
        if (index == -1) {
          console.log("======multi-select选择了全部=====")
          selectResultsObj[selectTab[selectTabIndex].name] = ""
          for (let i = 0; i < selectTab[selectTabIndex].listValues.length; i++) {
            selectTab[selectTabIndex].listValues[i].state = false;
          }
        } else {
          console.log("======multi-select选择了其他选项=====")
          let resultData =[]
          if (selectResultsObj[selectTab[selectTabIndex].name]){
            resultData = selectResultsObj[selectTab[selectTabIndex].name]
          }
          if (!selectTab[selectTabIndex].listValues[index].state){
            resultData.push(selectTab[selectTabIndex].listValues[index].value)
          }else{
            for (let i = 0; i < resultData.length;i++){
              if (resultData[i] == selectTab[selectTabIndex].listValues[index].value){
                resultData.splice(i,1)
              }
            }
          }
          selectResultsObj[selectTab[selectTabIndex].name] = resultData;
          selectTab[selectTabIndex].listValues[index].state = selectTab[selectTabIndex].listValues[index].state ? false : true;
        }
      }
      that.getData(selectResultsObj);
      console.log("==selectResultsObj===", selectResultsObj)
      console.log("==oldSelectResultsData===", that.data.oldSelectResultsData)
      that.setData({ selectResultsObj: selectResultsObj, selectTab: selectTab})
    },
    sureSelect: function (){
      let that=this;
      that.getData(that.data.selectResultsObj);
      that.closeZhezhao()
    },
    clearSelect:function(){
      let that = this;
      let selectTabIndex = that.data.selectTabIndex;//tab的位置
      let selectTab = that.data.selectTab//tab数据
      let selectResultsObj = that.data.selectResultsObj//搜索数据
      selectResultsObj[selectTab[selectTabIndex].name] = '';
      for (let i = 0; i < selectTab[selectTabIndex].listValues.length;i++){
        selectTab[selectTabIndex].listValues[i].state =false
      }
      that.setData({ selectResultsObj: selectResultsObj, selectTab: selectTab })
      that.getData(selectResultsObj);
      setTimeout(function(){
        that.closeZhezhao()
      },1000)
    },
    moreSelectFun:function(){
      let that = this;
      let showMoreSelectState=false
      let selectTab = that.data.selectTab
      for (let i = 0; i < selectTab.length; i++) {
        selectTab[i].state = false;
      }
      if (!that.data.showMoreSelectState){
        showMoreSelectState=true
      }
      that.setData({ showMoreSelectState: showMoreSelectState, showCount: false, selectTab: selectTab, selectTabIndex: -1 })
    },
    closeZhezhao: function () {
      let that = this;
      let selectTab = that.data.selectTab
      that.setData({ showCount: false, showMoreSelectState: false})
      that.setData({ selectTabIndex: -1 })
      for (let i = 0; i < selectTab.length; i++) {
        selectTab[i].state = false;
      }
      that.setData({ selectTab: selectTab })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    initSetting() {
      this.setData({ setting: app.setting })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      this.data.Data = []

      this.data.listPage.page = 1
      this.getData(this.data.selectResultsObj);
      wx.stopPullDownRefresh()
    },


   
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      console.log('组件===onReachBottom====')
      let that = this
      if (that.data.listPage.totalSize > that.data.listPage.page * that.data.listPage.pageSize) {
        that.data.listPage.page++
        that.getData(that.data.selectResultsObj,'upload');
      }
    },
  }
})