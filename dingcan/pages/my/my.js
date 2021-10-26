// pages/my/my.js
const app = getApp()
Component({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    role:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  lifetimes: {
    // console.log('kpl')
    attached: function () {
      this.getDetail()
      console.log('attached',app.globalData.userInfo.role)
      this.setData({
        role:app.globalData.userInfo.role
      })
    },
    moved: function () {
      console.log('moved')
    },
    detached: function () {
      console.log('detached')
    },
  },

  methods:{
    getDetail() {
      let that = this
      let url = ''
      wx.request({
        url: app.globalData.baseUrl + '/applet/user/detail_info',
        method: "post",
        header: {
          'token': app.globalData.token
        },
        data: {},
        success: function (res) {
          console.log('获取个人数据', res.data.data)
          that.setData({
            detail: res.data.data
          })
        }
      })
    },
    //跳转反馈页面
    goFeedBack(event) {
      wx.navigateTo({
        url: `/pages/feedBack/feedBack`
      })
    },
    //跳转订餐列表
    goAuditBill(event) {
      wx.navigateTo({
        url: `/pages/User/auditBill/auditBill`
      })
    },
  },
  


  // call: function () {
  //   wx.makePhoneCall({
  //     phoneNumber: this.data.detail.service_phone,
  //   })
  // },



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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})