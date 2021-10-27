import * as echarts from '../../../ec-canvas/echarts';
let chartPie1=1;
function getOption(data) {
  var option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '5%',
      left: 'center',
      formatter: function (name) {
        return '{a|' + name + '}'
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
      center: ['50%', '135'],
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: false,
          fontSize: '40',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: data
    }]
  };
  return option
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
    form1Height:400,
    //加班餐工作日
    formData2: {
      start_date: '',
      end_date: '',
    },
    //加班餐节假日
    formData3: {
      start_date: '',
      end_date: '',
    },
    ec1: {
      
      lazyLoad: true
    },
    ec2: {
      onInit: '',
    },
    ec3: {
      onInit: '',
    },
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
      var end_date = getFullDate(cloneNowDate.setDate(endOfMonth)); //当月最后一天
      var starDate = getFullDate(cloneNowDate.setDate(1)); //当月第一天
      that.setData({
        ['formData1.start_date']: starDate,
        ['formData1.end_date']: end_date,
        ['formData2.start_date']: starDate,
        ['formData2.end_date']: end_date,
        ['formData3.start_date']: starDate,
        ['formData3.end_date']: end_date,
      })
      console.log(that.data.formData1)
      this.echartsComponnet1 = this.selectComponent('#mychart-dom-pie1');
      that.getForm1()
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
    getForm1(){
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
          that.setData({
            detail: res.data.data
          })
          console.log(chartPie1)
          
          
          that.onInit1()
          
        }
      })
    },

    onInit1: function (){
      this.echartsComponnet1.init((canvas, width, height) => {
        //初始化echarts元素，绑定到全局变量，方便更改数据
        chartPie1 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        // canvas.setChart(chartPie1);
        chartPie1.resize()
        var data = [
          {
            value: 1048,
            name: '区纪委监委机关'
          },
          {
            value: 735,
            name: '区纪委监委机关1'
          },
          {
            value: 580,
            name: '区机关事务管2理局'
          },
          {
            value: 484,
            name: '区机关事3务管理局'
          },
          {
            value: 300,
            name: '区机关事4务管理局'
          },
          {
            value: 300,
            name: '区机关事4务管3理局'
          },
          {
            value: 300,
            name: '区机关事4务3管理局'
          },
          {
            value: 300,
            name: '区机关事4务3管理局'
          },
          {
            value: 300,
            name: '区机关事4务3管理局'
          }
        ]
        var height;
        if(data.length<=2){
          height=200
        }else{
          height=200+Math.ceil((data.length-2)/2)*100
        }
        this.setData({
          form1Height: height
        })
        chartPie1.setOption(getOption(data))
        chartPie1.resize()
      })
      return chartPie1
      
      // chartPie1.resize();
      // chartPie1.resize({height:this.form1Height})

      //可以先不setOption，等数据加载好后赋值，
      //不过那样没setOption前，echats元素是一片空白，体验不好，所有我先set。
      // var xData = [1,2,3,4,5......];  // x轴数据 自己写
      // var option = getOption(xData);
      // chartLine.setOption(option);
    },

    bindDateChangeStart1: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        ['formData1.start_date']: e.detail.value,
      })
    },
    bindDateChangeEnd1: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        ['formData1.end_date']: e.detail.value,
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