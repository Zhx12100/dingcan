<template>
  <div class="basic-container basic">
    <div class="container">
      <el-row :gutter="10" class="number-box">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="grid-content bg-purple">
            <div class="title">当日加班人数</div>
            <div class="count">{{ data.ot.today_count || 0 }}</div>
            <div class="yestday">
              对比昨日新增人数:{{ data.ot.diff_count || 0 }}
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="grid-content bg-purple-light">
            <div class="title">当日二楼工作餐人数</div>
            <div class="count">{{ data.work.today_count || 0 }}</div>
            <div class="yestday">
              对比昨日新增人数:{{ data.work.diff_count || 0 }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="number-box">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="grid-content bg-purple">
            <div class="search">
              <div class="title">当日订餐人数</div>
              <div>
                <el-date-picker
                  size="mini"
                  v-model="date1"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="cont">
              <div
                id="myChart1"
                :style="{ width: '100%', height: '300px' }"
              ></div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="grid-content bg-purple-light">
            <div class="search">
              <div class="title">订餐人数</div>
              <div>
                <el-radio-group v-model="value2" size="mini" @change="changeDay">
                  <el-radio-button :label="7">近七日</el-radio-button>
                  <el-radio-button :label="30">近三十日</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="cont">
              <div
                id="myChart2"
                :style="{ width: '100%', height: '300px' }"
              ></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getToday_meal, getGet_date } from "@/api/basic";
export default {
  name: "Basic",
  data() {
    return {
      date1: new Date(),
      value2: 7,
      data: {
        ot: {},
        work: {},
      },
    };
  },
  created() {
    // this.getList();
  },
  mounted() {
    let that = this;
    that.getData();
    
    that.getDate()
    // that.getChart2();
  },
  methods: {
    getData() {
      let that = this;
      getToday_meal({}).then((response) => {
        console.log("获取订餐数据", response);
        that.data = response.data;
        that.getChart1(that.data);
      });
    },
    //获取订餐人数
    getDate() {
      let that = this;
      getGet_date({day:that.value2}).then((response) => {
        console.log("获取订餐人数", response.data);
        // that.data = response.data;
        that.getChart2(response.data)
      });
    },
    changeDay(val){
      let that = this
      console.log(that.value2)
      that.getDate()
    },
    getChart1(data) {
      let myChart = this.$echarts.init(
        document.getElementById("myChart1"),
        "light"
      );
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: data.ot.today_count, name: "加班餐" },
              { value: data.work.today_count, name: "二楼工作餐" },
            ],
          },
        ],
      });
    },
    getChart2(data) {
      let myChart = this.$echarts.init(
        document.getElementById("myChart2"),
        "light"
      );
      var dateArr = []
      var data1 = {
        data: [],
        type: "bar",
        name: "加班餐",
      }
      var data2 = {
        data: [],
        type: "bar",
        name: "二楼工作餐",
      }
      if(data.length>0){
        data.forEach((v,i)=>{
          data1.data.push(v.ot_count)
          data2.data.push(v.work_count)
          dateArr.push(v.date)
        })
      }
      console.log('dateArr',dateArr)
      
      // 绘制图表
      myChart.setOption({
        xAxis: {
          type: "category",
          data: dateArr,
        },
        yAxis: {
          type: "value",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          data1,
          data2,
        ],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.basic {
  &-container {
    margin: 30px;
    // padding: 20px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  .number-box {
    .grid-content {
      padding: 15px;
      text-align: center;
      box-shadow: 4px 4px 40px rgb(0 0 0 / 5%);
      border-color: rgba(0, 0, 0, 0.05);
      border-radius: 4px;
      width: 90%;
      margin: 0 auto 30px;
      .search {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
        .title {
          margin-bottom: 0;
          font-size: 16px;
          font-weight: bold;
        }
      }
      .title {
        font-size: 18px;
        color: #333;
        margin-bottom: 10px;
      }
      .count {
        font-size: 32px;
        color: #6cd9fd;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .yestday {
        color: #999;
        font-size: 16px;
      }
    }
  }
  .pagination-box {
  }
}
.pagination-box {
  text-align: center;
  margin-top: 20px;
}
</style>
