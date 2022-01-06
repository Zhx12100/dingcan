// index.js
// 获取应用实例
const app = getApp()

Component({
  data: {
    motto: 'Hello World',
    userInfo: {},
    notice: '',
    ot: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  lifetimes: {
    // console.log('kpl')
    attached: function () {
      let that = this
      wx.request({
        url: app.globalData.baseUrl + '/system/get_notice',
        method: "post",
        header: {
          'token': app.globalData.token
        },
        data: {
          order_id: that.data.id
        },
        success: function (res) {
          console.log('获取公告', res.data)
          let data = res.data.data
          data.notice = data.notice.replace(/\n/g,"<br/>").replaceAll(" ","\xa0")
          that.setData({
            notice: data
          })
        }
      })
      wx.request({
        url: app.globalData.baseUrl + '/system/get_ot',
        method: "post",
        header: {
          'token': app.globalData.token
        },
        data: {
          order_id: that.data.id
        },
        success: function (res) {
          console.log('工作餐节假是否展示', res.data.data.ot_holiday_flag)
          that.setData({
            ot: res.data.data.ot_holiday_flag
          })
        }
      })
    },
    moved: function () {
      console.log('moved')
    },
    detached: function () {
      console.log('detached')
    },
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示  初始化数据的时候操作
      // this.onShows()
    },
  },
  methods: {
    goGzc(e) {
      console.log(e)
      let that = this
      wx.navigateTo({
        url: `/pages/User/gzc/gzc`
      })
    },
    goJbc(e) {
      console.log(e)
      let that = this
      wx.navigateTo({
        url: `/pages/User/jbc/jbc?type=` + e.currentTarget.dataset.type
      })
    },
  },

  onLoad() {

  },
})