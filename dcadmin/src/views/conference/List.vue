<template>
  <div class="ConferenceList-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <el-form :inline="true" :model="formScreen" size="medium">
      <el-form-item label="房间名称">
        <el-input v-model="formScreen.name" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formScreen.status" placeholder="">
          <el-option label="全部" value="" />
          <el-option label="使用中" :value="true" />
          <el-option label="已禁用" :value="false" />
        </el-select>
      </el-form-item>
      <el-button type="primary" :loading="listLoading" @click="getList" size="medium">查询</el-button>
      <el-button size="medium" @click="goAddEdit()" icon="el-icon-plus">新增</el-button>
    </el-form>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading">
      <el-table-column label="ID" align="center" width="55">
        <template slot-scope="scope">
          {{ scope.row.room_id }}
        </template>
      </el-table-column>
      <el-table-column label="房间号" align="center">
        <template slot-scope="scope">
          {{ scope.row.room_no }}
        </template>
      </el-table-column>
      <el-table-column label="容纳人数" align="center">
        <template slot-scope="scope">
          {{ scope.row.people_count }}
        </template>
      </el-table-column>
      <el-table-column label="当日已预订时段" align="center">
        <template slot-scope="scope">
          {{ scope.row.already_meal }}
        </template>
      </el-table-column>
      <el-table-column label="预订数" align="center">
        <template slot-scope="scope">
          {{ scope.row.reserve_count }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.create_time }}
        </template>
      </el-table-column>
      <el-table-column label="使用状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.status ? "使用中" : "已停用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tag @click="goAddEdit(scope.row.room_id)" size="medium">编辑</el-tag>
          <el-tag type="success" @click="getReserve(scope.row.room_id)" size="medium">预定详情</el-tag>
          <el-tag type="warning" @click="changeItem(scope.row.room_id,scope.row.status?false:true)" size="medium">{{scope.row.status ? "停用" : "启用"}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination-box" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formScreen.page" :page-sizes="[1,10, 20, 50, 100]" :page-size="formScreen.page_len"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog class="calendar-box" title="预定详情" :visible.sync="dialogVisible" width="800px" :before-close="handleClose">
      <div>
        <el-calendar v-model="calendarMonth">
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <template slot="dateCell" slot-scope="{date, data}">
            <el-badge :value="getReserveNum(data.day)" class="item" type="primary">
              <p :class="data.isSelected ? 'is-selected' : ''" @click="reserveMessage(data.day)">
                {{ data.day.split('-').slice(1).join('-') }}
              </p>
            </el-badge>
          </template>
        </el-calendar>
        <el-collapse accordion>
          <el-collapse-item v-for="(item,index) in dateMessageList" :key="index">
            <template slot="title">
              <div class="flex">
                <div>
                  <div>预约联系人：{{item.name}} -- 预约电话：{{item.phone}}</div>
                  <!-- <div></div> -->
                </div>
                <div>{{item.meal_time}}</div>
              </div>
            </template>
            <div class="detail-list">
              <el-form :inline="true" size="mini">
                <el-form-item label="订餐联系人：">
                  {{ item.detail.name }}
                </el-form-item>
                <el-form-item label="订餐联系电话：">
                  {{ item.detail.phone }}
                </el-form-item>
                <el-form-item label="用餐房间：" v-if="item.detail.meal_type=='二楼工作餐'">
                  {{ item.detail.work.room_no }}
                </el-form-item>
                <el-form-item label="用餐人数：">
                  {{ item.detail.dining_count }}
                </el-form-item>
                <el-form-item label="订餐日期：">
                  {{ item.detail.reserve_date }}
                </el-form-item>
                <el-form-item label="订餐时段：">
                  {{ item.detail.meal_time }}
                </el-form-item>
                <div v-if="item.detail.meal_type=='二楼工作餐'">
                  <el-form-item label="最高级别用餐人：">
                    <span>
                      名称：{{item.detail.work.max_name}}<br />
                      职务：{{item.detail.work.max_position}}
                    </span>
                  </el-form-item>
                  <el-form-item label="结算单位：">
                    {{ item.detail.work.settle_part }}
                  </el-form-item>
                  <el-form-item label="司陪人数：">
                    {{ item.detail.work.other_count }}
                  </el-form-item>
                  <el-form-item label="就餐方式：">
                    {{ item.detail.work.meal_way }}
                  </el-form-item>
                  <el-form-item label="用餐性质：">
                    {{ item.detail.work.meal_property }}
                  </el-form-item>
                  <el-form-item label="接待函附件：">
                    <a :href="baseURL + item.detail.work.extra_file" target="_blank" download="" rel="noopener noreferrer" style="color: #67c23a">{{ item.detail.work.extra_file }}</a>
                  </el-form-item>
                  <el-form-item label="水牌备注：">
                    {{ item.detail.work.brand_note }}
                  </el-form-item>
                </div>
                <!-- <el-form-item label="订餐备注：">
          {{ item.detail.reserve_note }}
        </el-form-item> -->
                <el-form-item label="用户名称：">
                  {{ item.detail.nick_name }}
                </el-form-item>
                <el-form-item label="组织ID：">
                  {{ item.detail.organize_id }}
                </el-form-item>
                <el-form-item label="组织部门：">
                  {{ item.detail.organize_part }}
                </el-form-item>
                <el-form-item label="订餐类型：">
                  {{ item.detail.meal_type }}
                </el-form-item>
                <el-form-item label="审核状态：">
                  {{ item.detail.audit_status }}
                </el-form-item>
                <el-form-item label="申请时间：">
                  {{ item.detail.apply_time }}
                </el-form-item>
                <el-form-item label="审核时间：">
                  {{ item.detail.audit_time }}
                </el-form-item>
                <el-form-item label="理由：" v-if="item.detail.audit_status == '审核失败'">
                  {{ item.detail.audit_man }}
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getConferenceList,
  changeConference,
  getReserveDate,
  getReserveMessage,
  getReserveDetail,
} from "@/api/conference";
export default {
  name: "ConferenceList",
  data() {
    return {
      list: [],
      listLoading: true,
      formScreen: {
        page: 1,
        page_len: 10,
        name: "",
        status: "",
      },
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      calendarMonth: new Date(),
      dateList: [],
      dateMessageList: [],
      activeNames: ["1"],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //获取列表
    getList() {
      var that = this;
      that.listLoading = true;
      let data = that.formScreen;
      getConferenceList(data).then((response) => {
        console.log("获取房间列表", response);
        that.listLoading = false;
        that.list = response.data.result;
        that.total = response.data.data_sum;
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      var that = this;
      that.formScreen.page_len = val;
      that.formScreen.page = 1;
      that.getList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      var that = this;
      that.formScreen.page = val;
      that.getList();
    },
    //获取预定消息
    getReserve(room_id) {
      let that = this;
      that.room_id = room_id;
      that.reserveDate(room_id, new Date().getMonth() + 1);
    },
    //获取预定数量
    getReserveNum(month) {
      let that = this;
      console.log(month);
      for (let a = 0; a < that.dateList.length; a++) {
        if (that.dateList[a].date == month && that.dateList[a].count > 0) {
          return that.dateList[a].count;
        }
      }
    },
    //获取预定详情日历
    reserveDate(room_id, month) {
      let that = this;
      var date = new Date();
      let data = {
        room_id: room_id,
        year: date.getFullYear(),
        month: month,
      };
      getReserveDate(data).then((response) => {
        console.log("获取预定详情日历", response);
        that.dialogVisible = true;
        that.dateList = response.data;
        var date = that.calendarMonth;
        that.reserveMessage(
          `${date.getFullYear()}-${that.GLOBAL.$getMonth(
            date.getMonth() + 1
          )}-${date.getDate()}`
        );
      });
    },
    //获取预定信息列表
    reserveMessage(day) {
      let that = this;
      that.dateMessageList = [];
      getReserveMessage({ date: day, room_id: that.room_id }).then(
        (response) => {
          console.log("获取预定信息列表", response);
          // return false
          if (response.data) {
            that.dateMessageList = response.data;
            // console.log(that.dateMessageList[0])
          }
        }
      );
    },
    //获取预定信息详情
    // reserveDetail() {
    //   let that = this;
    // },
    handleClose() {
      let that = this;
      that.dialogVisible = false;
    },
    // 前往新增列表
    goAddEdit(room_id) {
      var that = this;
      that.$router.push({
        name: "ConferenceDetail",
        query: {
          room_id: room_id || "",
        },
      });
    },
    collapseChange(val) {
      console.log(val);
    },

    //改变状态
    changeItem(room_id, status) {
      var that = this;
      console.log(room_id);
      that
        .$confirm(
          `此操作将${status ? "启用" : "停用"}该房间, 是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
        .then(() => {
          changeConference({ room_id: room_id, status: status }).then(
            (response) => {
              that.$message({
                type: "success",
                message: status ? "启用" : "停用" + "成功!",
              });
              that.getList();
            }
          );
        })
        .catch(() => {});
    },
  },
  watch: {
    calendarMonth(newVlue, oldValue) {
      this.calendarMonth = newVlue;
      if (newVlue.getMonth() != oldValue.getMonth()) {
        this.reserveDate(this.room_id, newVlue.getMonth() + 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ConferenceList-container {
  margin: 30px;
  .avatar {
    width: 100px;
    height: auto;
    display: inline-block;
    object-fit: contain;
    font-size: 0;
  }
  .pagination-box {
  }
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }
  .flex > div {
    margin-top: 3px;
  }
  .flex > div > div {
    height: auto;
    line-height: 1.4;
    color: #666;
  }
  .detail-list {
    padding: 0 20px;
    .el-form-item {
      width: 50%;
      margin-right: 0;
      margin-bottom: 0;
    }
  }
}
.calendar-box {
  ::v-deep .el-dialog__body {
    padding-top: 0;
  }
  ::v-deep .el-badge {
    width: 100%;
  }
  ::v-deep .el-badge__content.is-fixed {
    top: 8px;
    right: 19px;
  }
  ::v-deep .el-calendar-table {
    td.is-selected {
      background: #c5e2ff !important;
    }
  }
  ::v-deep .el-calendar-table .el-calendar-day {
    height: 58px;
    padding: 0;
    p {
      margin: 0;
      text-align: center;
      line-height: 58px;
    }
  }
  ::v-deep .el-form-item__label{
    width: 130px;
  }
  ::v-deep .el-form-item__content{
        width: 229px;
  }
}
.pagination-box {
  text-align: center;
  margin-top: 20px;
}
</style>
s