import * as echarts from '../../../ec-canvas/echarts';
let chartPie1 = 1;
let chartPie2 = 1;
let chartPie3 = 1;
let chartPie4 = 1;

function getOption(data, top) {
  let count = 0;
  data.forEach((v, i) => {
    count = v.value + count
  })
  var option = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    disableTouch: true,
    legend: {
      bottom: '5%',
      left: 'center',
      formatter: function (name) {
        var val
        data.forEach((v, i) => {
          if (v.name == name) {
            val = v.value
          }
        })
        return '{a|' + name + ' ' + val + '}'
      },
      textStyle: {
        backgroundColor: "transparent", // 文字块背景色，一定要加上，否则对齐不会生效
        rich: {
          a: {
            width: 115
          },
        },
      },
    },
    series: [{
      name: 'Access From',
      type: 'pie',
      center: ['50%', top],
      radius: ['30%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      // label: {
      //   show: false,
      //   position: 'center'
      // },
      emphasis: {
        label: {
          show: true,
          fontSize: '40',
          fontWeight: 'bold'
        }
      },
      label: {
        alignTo: 'edge',
        // formatter: '{name|{b}}\n{time|''}',
        formatter: function (params) {
          // var val;
          // data.forEach((v, i) => {
          //   if (v.name == params.seriesName) {
          //     val = v.value
          //   }
          // })
          return `${params.name}\n${params.value} ${(Math.round(params.value/count * 10000) / 100.00)}%`
        },
        minMargin: 5,
        edgeDistance: 10,
        lineHeight: 15,
        rich: {
          time: {
            fontSize: 10,
            color: '#999'
          }
        }
      },
      labelLine: {
        normal: {
          show: true,
          length: 5,
          length2: 10
        }
      },
      data: data
    }]
  };
  return option
}

function getOption2(data, top, type) {
  if (type == 0) {
    let count = 0;
    data.forEach((v, i) => {
      count = v.value + count
    })
    var option = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      disableTouch: true,
      legend: {
        bottom: '5%',
        left: 'center',
        formatter: function (name) {
          var val
          data.forEach((v, i) => {
            if (v.name == name) {
              val = v.value
            }
          })
          return '{a|' + name + ' ' + val + '}'
        },
        textStyle: {
          backgroundColor: "transparent", // 文字块背景色，一定要加上，否则对齐不会生效
          rich: {
            a: {
              width: 115
            },
          },
        },
      },
      series: [{
        name: 'Access From',
        type: 'pie',
        center: ['50%', top],
        radius: ['30%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold'
          }
        },
        label: {
          alignTo: 'edge',
          // formatter: '{name|{b}}\n{time|''}',
          formatter: function (params) {
            return `${params.name}\n${params.value} ${(Math.round(params.value/count * 10000) / 100.00)}%`
          },
          minMargin: 5,
          edgeDistance: 10,
          lineHeight: 15,
          rich: {
            time: {
              fontSize: 10,
              color: '#999'
            }
          }
        },
        labelLine: {
          normal: {
            show: true,
            length: 5,
            length2: 10
          }
        },
        data: data
      }]
    };
    return option
  } else {
    var seriesData = []
    var leader_sum=0,worker_sum=0;
    var counts = []
    data.forEach((v,i) =>{
      leader_sum = v.leader_sum+leader_sum
      worker_sum = v.worker_sum+worker_sum
    })
    counts = [{name:'区领导用餐人数',value:leader_sum},{name:'工作人员用餐人数',value:worker_sum}]
    var count = leader_sum + worker_sum
    seriesData = [leader_sum,worker_sum]
    console.log('seriesData',seriesData)
    option = {
      xAxis: {
        type: 'category',
        data: ['区领导用餐人数', '工作人员用餐人数']
      },
      yAxis: {
        type: 'value'
      },
      grid:{left:40,top:20,bottom:40,right:20},
      legend: {data:['区领导用餐人数', '工作人员用餐人数']},
      // legend: {
      //   bottom: '5%',
      //   left: 'center',
      //   formatter: function (name) {
      //     var val
      //     counts.forEach((v, i) => {
      //       if (v.name == name) {
      //         val = v.value
      //       }
      //     })
      //     return '{a|' + name + ' ' + val + '}'
      //   },
      //   textStyle: {
      //     backgroundColor: "transparent", // 文字块背景色，一定要加上，否则对齐不会生效
      //     rich: {
      //       a: {
      //         width: 115
      //       },
      //     },
      //   },
      // },
      series: [{
        data: seriesData,
        type: 'bar',
        barWidth : 50,
        label: {
          normal: {
            show: true,
            position: 'top',
            // formatter: '{b}: {c}'  ${(Math.round(params.value/count * 10000) / 100.00)}%,
            formatter: function (params) {
              return `${params.value}`
            },
          },
          
        },
      }]
    };
    return option
  }
}


const app = getApp()
Component({

  /**
   * 页面的初始数据
   */
  data: {
    //工作餐
    formData1: {
      start_date: '',
      end_date: '',
    },
    form1Height: 400,
    //加班餐工作日
    formData2: {
      start_date: '',
      end_date: '',
    },
    form2Height: 400,
    //加班餐节假日
    formData3: {
      start_date: '',
      end_date: '',
    },
    form3Height: 400,
    //当日订餐人数
    formData4: {
      date: '',
    },
    formData4Type: 1,
    form4Height: 200,
    ec1: {
      lazyLoad: true
    },
    ec2: {
      lazyLoad: true
    },
    ec3: {
      lazyLoad: true
    },
    ec4: {
      lazyLoad: true
    },
    isIOS: false,
    switch1Checked: true,
  },

  lifetimes: {
    attached: function () {
      let that = this
      var nowDate = new Date();
      var cloneNowDate = new Date();
      var fullYear = nowDate.getFullYear();
      var month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
      var endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
      function getFullDate(targetDate) {
        var D, y, m, d;
        if (targetDate) {
          D = new Date(targetDate);
          y = D.getFullYear();
          m = D.getMonth() + 1;
          d = D.getDate();
        } else {
          y = fullYear;
          m = month;
          d = date;
        }
        m = m > 9 ? m : '0' + m;
        d = d > 9 ? d : '0' + d;
        return y + '-' + m + '-' + d;
      };
      var day = nowDate.getDate();
      var end_date = getFullDate(cloneNowDate.setDate(endOfMonth)); //当月最后一天
      var starDate = getFullDate(cloneNowDate.setDate(1)); //当月第一天
      console.log()
      that.setData({
        ['formData1.start_date']: starDate,
        ['formData1.end_date']: end_date,
        ['formData2.start_date']: starDate,
        ['formData2.end_date']: end_date,
        ['formData3.start_date']: starDate,
        ['formData3.end_date']: end_date,
        ['formData4.date']: `${fullYear}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`,
      })
      console.log(that.data.formData4)
      that.getOt()
      that.getForm1()
      that.getForm2()
      that.getForm3()
      that.getForm4()
      let res = wx.getSystemInfoSync();
      console.log(res)
      if (res.platform == 'ios') {
        this.setData({
          isIOS: true
        })
      }
      console.log('ios', this.data.isIOS)
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
    //表格1
    getForm1() {
      let that = this
      let data = that.data.formData1
      data.meal_type = 1
      wx.request({
        url: app.globalData.baseUrl + '/applet/meal/manager/index_data',
        method: "post",
        header: {
          'token': app.globalData.token
        },
        data: data,
        success: function (res) {
          console.log('统计数据', res.data.data)
          wx.hideToast();
          console.log(chartPie1)
          that.onInit1(res.data.data)
        }
      })
    },
    //表格2
    getForm2() {
      let that = this
      let data = that.data.formData2
      data.meal_type = 2
      wx.request({
        url: app.globalData.baseUrl + '/applet/meal/manager/index_data',
        method: "post",
        header: {
          'token': app.globalData.token
        },
        data: data,
        success: function (res) {
          console.log('统计数据', res.data.data)
          wx.hideToast();
          that.onInit2(res.data.data)
        }
      })
    },
    //表格3
    getForm3() {
      let that = this
      let data = that.data.formData3
      data.meal_type = 3
      wx.request({
        url: app.globalData.baseUrl + '/applet/meal/manager/index_data',
        method: "post",
        header: {
          'token': app.globalData.token
        },
        data: data,
        success: function (res) {
          console.log('统计数据', res.data.data)
          wx.hideToast();
          that.onInit3(res.data.data)
        }
      })
    },
    //表格4
    getForm4() {
      let that = this
      let data = that.data.formData4
      wx.request({
        url: app.globalData.baseUrl + '/admin/meal/date_order',
        method: "post",
        header: {
          'token': app.globalData.token
        },
        // data: data,
        data: {
          date: that.data.formData4.date
        },
        success: function (res) {
          console.log('当日订餐人数', res.data.data)
          wx.hideToast();
          that.onInit4(res.data.data)
        }
      })
    },

    onInit1: function (data) {
      var data = data
      // var data = [{
      //     value: 1048,
      //     name: '区纪委监委机关'
      //   },
      //   {
      //     value: 735,
      //     name: '区纪委监委机关1'
      //   },
      //   {
      //     value: 580,
      //     name: '区机关事务管2理局'
      //   },
      //   {
      //     value: 484,
      //     name: '区机关事3务管理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务管理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务管3理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务3管理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务3管理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务3管理局'
      //   }
      // ]
      var height;
      if (data.length <= 2) {
        height = 200
      } else {
        height = 200 + Math.ceil((data.length - 2) / 2) * 60
      }
      this.setData({
        form1Height: height
      })
      this.echartsComponnet1 = this.selectComponent('#mychart-dom-pie1');
      const getPixelRatio = () => {
        let pixelRatio = 0
        wx.getSystemInfo({
          success: function (res) {
            pixelRatio = res.pixelRatio
          },
          fail: function () {
            pixelRatio = 0
          }
        })
        return pixelRatio
      }
      var dpr = getPixelRatio()
      this.echartsComponnet1.init((canvas, width, height) => {
        //初始化echarts元素，绑定到全局变量，方便更改数据
        chartPie1 = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        });
        chartPie1.setOption(getOption(data, height / 3))
      })
      return chartPie1
    },
    onInit2: function (data) {
      var data = data
      // var data = [{
      //     value: 1048,
      //     name: '区纪委监委机关'
      //   },
      //   {
      //     value: 735,
      //     name: '区纪委监委机关1'
      //   },
      //   {
      //     value: 580,
      //     name: '区机关事务管2理局'
      //   },
      //   {
      //     value: 484,
      //     name: '区机关事3务管理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务管理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务管3理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务3管理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务3管理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务3管理局'
      //   }
      // ]
      var height;
      if (data.length <= 2) {
        height = 200
      } else {
        height = 200 + Math.ceil((data.length - 2) / 2) * 60
      }
      this.setData({
        form2Height: height
      })
      this.echartsComponnet2 = this.selectComponent('#mychart-dom-pie2');
      const getPixelRatio = () => {
        let pixelRatio = 0
        wx.getSystemInfo({
          success: function (res) {
            pixelRatio = res.pixelRatio
          },
          fail: function () {
            pixelRatio = 0
          }
        })
        return pixelRatio
      }
      var dpr = getPixelRatio()
      this.echartsComponnet2.init((canvas, width, height) => {
        //初始化echarts元素，绑定到全局变量，方便更改数据
        chartPie2 = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        });
        chartPie2.setOption(getOption(data, height / 3))
      })
      return chartPie2
    },
    onInit3: function (data) {
      var data = data
      // var data = [{
      //     value: 1048,
      //     name: '区纪委监委机关'
      //   },
      //   {
      //     value: 735,
      //     name: '区纪委监委机关1'
      //   },
      //   {
      //     value: 580,
      //     name: '区机关事务管2理局'
      //   },
      //   {
      //     value: 484,
      //     name: '区机关事3务管理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务管理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务管3理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务3管理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务3管理局'
      //   },
      //   {
      //     value: 300,
      //     name: '区机关事4务3管理局'
      //   }
      // ]
      var height;
      if (data.length <= 2) {
        height = 200
      } else {
        height = 200 + Math.ceil((data.length - 2) / 2) * 60
      }
      this.setData({
        form3Height: height
      })
      this.echartsComponnet3 = this.selectComponent('#mychart-dom-pie3');
      const getPixelRatio = () => {
        let pixelRatio = 0
        wx.getSystemInfo({
          success: function (res) {
            pixelRatio = res.pixelRatio
          },
          fail: function () {
            pixelRatio = 0
          }
        })
        return pixelRatio
      }
      var dpr = getPixelRatio()
      this.echartsComponnet3.init((canvas, width, height) => {
        //初始化echarts元素，绑定到全局变量，方便更改数据
        chartPie3 = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        });
        chartPie3.setOption(getOption(data, height / 3))
      })
      return chartPie3
    },

    bindDateChangeStart1: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        ['formData1.start_date']: e.detail.value,
      })
      this.getForm1()
    },
    bindDateChangeEnd1: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        ['formData1.end_date']: e.detail.value,
      })
      this.getForm1()
    },
    bindDateChangeStart2: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        ['formData2.start_date']: e.detail.value,
      })
      this.getForm2()
    },
    bindDateChangeEnd2: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        ['formData2.end_date']: e.detail.value,
      })
      this.getForm2()
    },
    bindDateChangeStart3: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        ['formData3.start_date']: e.detail.value,
      })
      this.getForm3()
    },
    bindDateChangeEnd3: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        ['formData3.end_date']: e.detail.value,
      })
      this.getForm3()
    },

    qieZ: function () {
      let that = this
      if (that.data.formData4Type == 0) {
        that.setData({
          formData4Type: 1
        })
      } else {
        that.setData({
          formData4Type: 0
        })
      }
      that.getForm4()
    },
    onInit4: function (data, type) {
      var height;
      console.log(this.data.formData4Type)
      if (this.data.formData4Type == 0) { //饼图图
        var datas = [{
            value: data.ot_count,
            name: '加班餐'
          },
          {
            value: data.work_count,
            name: '工作餐'
          },
        ]
        if (datas.length <= 2) {
          height = 200
        } else {
          height = 200 + Math.ceil((dadatasta.length - 2) / 2) * 60
        }
        this.setData({
          form4Height: height
        })
        this.echartsComponnet4 = this.selectComponent('#mychart-dom-pie4');
        const getPixelRatio = () => {
          let pixelRatio = 0
          wx.getSystemInfo({
            success: function (res) {
              pixelRatio = res.pixelRatio
            },
            fail: function () {
              pixelRatio = 0
            }
          })
          return pixelRatio
        }
        var dpr = getPixelRatio()
        this.echartsComponnet4.init((canvas, width, height) => {
          //初始化echarts元素，绑定到全局变量，方便更改数据
          chartPie4 = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr
          });
          chartPie4.setOption(getOption2(datas, height / 3, this.data.formData4Type))
        })
        return chartPie4
      } else {
        this.echartsComponnet4 = this.selectComponent('#mychart-dom-pie4');
        const getPixelRatio = () => {
          let pixelRatio = 0
          wx.getSystemInfo({
            success: function (res) {
              pixelRatio = res.pixelRatio
            },
            fail: function () {
              pixelRatio = 0
            }
          })
          return pixelRatio
        }
        var dpr = getPixelRatio()
        this.echartsComponnet4.init((canvas, width, height) => {
          //初始化echarts元素，绑定到全局变量，方便更改数据
          chartPie4 = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr
          });
          chartPie4.setOption(getOption2(data.ot_result, height / 3, this.data.formData4Type))
        })
        return chartPie4
      }
    },

    getOt: function () {
      let that = this
      wx.request({
        url: app.globalData.baseUrl + '/system/get_ot',
        method: "post",
        header: {
          'token': app.globalData.token
        },
        data: {},
        success: function (res) {
          console.log('节假日加班餐', res.data.data)
          that.setData({
            switch1Checked: res.data.data.ot_holiday_flag
          })
        }
      })
    },
    switch1Change: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        switch1Checked: e.detail.value,
      })
      wx.request({
        url: app.globalData.baseUrl + '/system/applet/set_ot',
        method: "post",
        header: {
          'token': app.globalData.token
        },
        data: {
          ot_holiday_flag: e.detail.value
        },
        success: function (res) {
          console.log('设置', res.data.data)
        }
      })
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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