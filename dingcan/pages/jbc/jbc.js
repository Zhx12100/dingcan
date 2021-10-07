// pages/Administration/auditDetail/auditDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    id: '',
    startTime:'',
    meal_time:[
      {meal:'午餐',meal_id:2},
      {meal:'晚餐',meal_id:3},
    ],
    detail: {
    },
    loadingHidden: true,
    detailTop: 100,
    audit_reason: '',
    roomText: '',
    formData: {
      order_id:'',
      name: '',
      phone: '',
      reserve_date:'',
      meal_time:'',
      meal_note: '',
      dining_count:'',
    },
    extra_file_name: '',
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this

    let yy = new Date().getFullYear()
    let mm = new Date().getMonth() + 1
    let dd = new Date().getDate()
    that.setData({
      id: options.id,
      startTime: `${yy}-${mm}-${dd}`,
      ['formData.meal_type']:options.type*1
    })
    console.log(this.data.startTime)
    
    
    // that.getDetail()
    // that.showDetail()
  },

  getDetail() {
    let that = this
    wx.pageScrollTo({
      scrollTop: 0
    })
    let url = '/applet/meal/list_room'
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    wx.request({
      url: app.globalData.baseUrl + url,
      method: "post",
      header: {
        'token': app.globalData.token
      },
      data: {
        meet_id: that.data.id
      },
      success: function (res) {
        console.log('获取房间列表', res.data.data)
        wx.hideToast();
        that.setData({
          ['detail.room_list']: res.data.data
        })
      }
    })
  },


  bindReason: function (e) {
    this.setData({
      audit_reason: e.detail.value
    })
  },

  bindName: function (e) {
    this.setData({
      ['formData.name']: e.detail.value
    })
  },
  bindPhone: function (e) {
    this.setData({
      ['formData.phone']: e.detail.value
    })
  },
  bindDiningCount: function (e) {
    this.setData({
      ['formData.dining_count']: e.detail.value*1
    })
  },
  bindStartTimeChange: function (e) {
		console.log(`switch发生change事件，携带值为`, e.detail.value)
		this.setData({
			['formData.reserve_date']: e.detail.value
		})
  },
  changeMealTime: function (e) {
		console.log(`switch发生change事件，携带值为`, e.detail.value*1)
		this.setData({
			['formData.meal_time']: e.detail.value*1
		})
  },
  
  bindReserveNote: function (e) {
    this.setData({
      ['formData.meal_note']: e.detail.value
    })
  },

  //提交预约
  auditTure() {
    let that = this
    let data = that.data.formData
    // data.meet_id = that.data.id
    for(let key in data){
      if(data[key]==''&&key!='meal_note'&&key!='order_id'){
        wx.showToast({
          title: '请填写完整信息',
          icon: 'error',
          duration: 1000
        });
        return false
      }
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    wx.request({
      url: app.globalData.baseUrl + "/applet/meal/save_overtime",
      method: "POST",
      header: {
        'token': app.globalData.token
      },
      data: data,
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 1000
          })
          wx.requestSubscribeMessage({
            tmplIds: ['gGBPqiJ-EXT8BuDD9QdGu47HuCpRVMJuxg--3bBQV4A', 'Y2viY0Kt30Io2-2LRKTTp7xl-n7myxTliC7jQySlTHM'],
            success(dingy) {
              console.log('成功订阅', dingy)
              wx.showToast({
                title: '成功订阅',
                icon: 'success',
                duration: 2000
              })
              setTimeout(() => {
                // that.getDetail()
                wx.navigateBack({ //返回
                  delta: 1
                })
              }, 1000)
            },
            fail(res) { // 接口调用失败的回调函数
              if (res.errCode === 20004) {
                wx.showModal({
                  title: "温馨提示",
                  content: "您已拒绝授权，将无法在微信中收到回复通知！",
                  showCancel: false,
                  success: res => {
                    if (res.confirm) {
                      setTimeout(() => {
                        // that.getDetail()
                        wx.navigateBack({ //返回
                          delta: 1
                        })
                      }, 1000)
                    }
                  }
                });
              }
            }
          })
        } else {
          // wx.showToast({
          //   title: res.data.message,
          //   icon: 'error',
          //   duration: 2000
          // })
          wx.hideToast();
          wx.showModal({
            title: '错误提示',
            content: res.data.message,
            showCancel: false,
            success: function (res) {}
          })
        }
      }
    })
  },

  //上传附件
  goFiles() {
    let that = this
    console.log('gggg')
    // return false
    wx.chooseMessageFile({
      count: 1, //最多可以选择的文件总数  
      type: 'all', // 可以指定是原图还是压缩图，默认二者都有  
      success: function (res) {
        var tempFilePaths = res.tempFiles
        if (tempFilePaths.length == 0) {
          wx.showModal({
            title: '错误提示',
            content: '文件损坏或过期,请重新选择',
            showCancel: false,
            success: function (res) {}
          })
          return false
        }
        console.log('选择的文件', res)
        let types = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt', 'jpg', 'png', 'gif', 'mp4']
        const fileType = types.find(i => tempFilePaths[0].path.endsWith(i))
        if (types.indexOf(fileType) == -1) {
          wx.showModal({
            title: '错误提示',
            content: '文件类型不符合要求，请重新上传',
            showCancel: false,
            success: function (res) {}
          })
          return false
        }
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        wx.uploadFile({
          // url: app.globalData.baseUrl + '/system/upload',
          url: app.globalData.baseUrl + '/system/upload',
          header: {
            'token': app.globalData.token,
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
          },
          filePath: tempFilePaths[0].path,
          name: 'file',
          formData: {
            // 'token': app.globalData.token  
          },
          success: function (ress) {
            var data = JSON.parse(ress.data);
            console.log('上传的文件', data)
            wx.hideToast();
            that.setData({
              ['formData.extra_file']: data.data.file_path,
              extra_file_name: tempFilePaths[0].name
            })
          },
          fail: function (res) {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传文件失败',
              showCancel: false,
              success: function (res) {}
            })
          }
        });
      }
    })
  },

  //删除文件
  deleteFiles() {
    let that = this
    that.setData({
      ['formData.extra_file']: '',
      extra_file_name: ''
    })
  },



  //审批不通过
  auditFalse() {
    let that = this
    that.setData({
      detailTop: 0
    })
  },

  //下载附件
  downLoadFile() {
    let that = this
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    console.log('downloadFile', that.data.baseUrl + that.data.detail.meet_order.extra_file)
    wx.downloadFile({
      url: that.data.baseUrl + that.data.detail.meet_order.extra_file,
      success: function (res) {
        var filePath = res.tempFilePath;
        console.log(res)
        //页面显示加载动画
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
            wx.hideToast();
          },
          fail: function (error) {
            console.log('error', error)
          },
        })
      }
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