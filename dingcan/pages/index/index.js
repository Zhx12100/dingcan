let app = getApp()

Page({
  data: {
    type:'',
    currentTab: 0,
    //这里只做tab名和显示图标
    PageItems1: [
      {
        "text": "统计",
        "iconPath": "/images/tongji1.png",
        "selectedIconPath": "/images/tongji2.png"
      },
      {
        "text": "审批",
        "iconPath": "/images/shenpi1.png",
        "selectedIconPath": "/images/shenpi2.png"
      },
      {
        "text": "我的",
        "iconPath": "/images/wode1.png",
        "selectedIconPath": "/images/wode2.png"
      }
    ],
    PageItems2: [
      {
        "text": "订餐",
        "iconPath": "/images/meishi1.png",
        "selectedIconPath": "/images/meishi.png"
      },
      {
        "text": "我的",
        "iconPath": "/images/wode1.png",
        "selectedIconPath": "/images/wode2.png"
      },
    ],
    items:[],
  },
  swichNav: function (e) {
    let that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({ 
        currentTab: e.target.dataset.current
      })
      that.setNavigationBarTitles()
    }
  },
  setNavigationBarTitles(){
    let that = this
    console.log(that.data.type,that.data.currentTab)
    if(that.data.type==1){
      if(that.data.currentTab===0){
        wx.setNavigationBarTitle({
          title: '订餐统计'
        })
      }else if(that.data.currentTab===1){
        wx.setNavigationBarTitle({
          title: '订餐审批'
        })
      }else if(that.data.currentTab===2){
        wx.setNavigationBarTitle({
          title: '我的'
        })
      }
    }else{
      if(that.data.currentTab===0){
        wx.setNavigationBarTitle({
          title: '订餐'
        })
      }else if(that.data.currentTab===2){
        wx.setNavigationBarTitle({
          title: '我的'
        })
      }
    }
  },
  onShow:function(){
    wx.hideHomeButton()
  },
  onLoad: function (options) {
    let that = this
    console.log(options)
    if(options.type){
      that.setData({
        type : options.type
      })
    }
    if(that.data.type==1){
      that.setData({
        items:that.data.PageItems1
      })
    }else{
      that.setData({
        items:that.data.PageItems2
      })
    }
    
    console.log(that.data.type,that.data.items)
    that.setNavigationBarTitles()
  }
})
