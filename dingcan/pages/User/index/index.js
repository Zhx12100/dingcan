// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  goGzc(e) {
    console.log(e)
    let that = this
    wx.navigateTo({
      url: `/pages/gzc/gzc`
    })
  },
  goJbc(e) {
    console.log(e)
    let that = this
    wx.navigateTo({
      url: `/pages/jbc/jbc?type=`+e.currentTarget.dataset.type
    })
  },
  onLoad() {
  },
})
