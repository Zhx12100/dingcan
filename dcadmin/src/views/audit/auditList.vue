<template>
  <div class="auditList auditList-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <el-form ref="form" :inline="true" label-width="auto" size="medium">
      <el-form-item label="组织ID">
        <el-input v-model="formScreen.organize_id" />
      </el-form-item>
      <el-form-item label="订餐联系电话">
        <el-input type="number" v-model="formScreen.phone" />
      </el-form-item>
      <el-form-item label="订餐日期">
        <el-date-picker v-model="formScreendate" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订餐联系人">
        <el-input v-model="formScreen.name" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formScreen.audit_status" placeholder="">
          <el-option label="全部" value="" />
          <el-option label="审核中" :value="0" />
          <el-option label="审核通过" :value="1" />
          <el-option label="审核失败" :value="2" />
          <el-option label="已完成" :value="3" />
          <el-option label="已关闭" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="订餐类型">
        <el-select v-model="formScreen.meal_type" placeholder="">
          <el-option label="全部" value="" />
          <el-option label="二楼工作餐" :value="1" />
          <el-option label="工作日加班餐" :value="2" />
          <el-option label="节假日加班餐" :value="3" />
        </el-select>
      </el-form-item>
      <el-button type="primary" :loading="listLoading" @click="getList" size="medium">查询</el-button>
      <el-button type="" @click="allExport" size="medium">导出</el-button>
    </el-form>
    <el-form class="caozuo-box">
      <el-form-item label="小程序加班餐（节假日）">
        <el-switch v-model="get_ot" active-text="启用" @change="setOt"> </el-switch>
      </el-form-item>
      <el-button size="medium" @click="openNotice">公告设置</el-button>
    </el-form>
    <el-table v-loading="listLoading" :data="list" ref="multipleTable" element-loading-text="Loading">
      <el-table-column label="序号" type="index" align="center" width="55">
      </el-table-column>
      <el-table-column label="用户名称" align="center">
        <template slot-scope="scope">
          <img class="nick_image" :src="scope.row.head_image" alt="" />
          <span>{{ scope.row.nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.organize_id }}
        </template>
      </el-table-column>
      <el-table-column label="组织部门" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.organize_part }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订餐类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.meal_type }}
        </template>
      </el-table-column>
      <el-table-column label="订餐联系人" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="订餐联系电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="订餐日期" align="center">
        <template slot-scope="scope">
          {{ scope.row.reserve_date }}
        </template>
      </el-table-column>
      <el-table-column label="订餐时段" align="center">
        <template slot-scope="scope">
          {{ scope.row.meal_time }}
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.apply_time }}
        </template>
      </el-table-column>
      <el-table-column label="审核日期" align="center">
        <template slot-scope="scope">
          {{ scope.row.audit_time }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.audit_status }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" align="center">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.audit_status=='审核中'" size="small" @click="kjcz(scope.row.order_id)">审核</el-tag>
          <el-tag type="success" size="small" @click="getDetail(scope.row.order_id)">查看详情</el-tag>
          <!-- <el-tag
            type="warning"
            v-if="scope.row.status == '待支付' || scope.row.status == '待运输'"
            @click="cancelOrder(scope.row.order_id)"
            size="small"
            >取消订单</el-tag
          > -->
          <!-- <el-tag
            v-if="scope.row.status == '待运输'"
            size="small"
            @click="openDriver(0, scope.row.order_id)"
            >填写信息</el-tag
          >
          <el-tag
            v-if="scope.row.status == '运输中'"
            size="small"
            @click="openDriver(1, scope.row.order_id)"
            >更新信息</el-tag
          > -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination-box" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formScreen.page" :page-sizes="[5, 10, 20, 50, 100]" :page-size="formScreen.page_len" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog title="订餐详情" class="detail-box" :visible.sync="dialogVisibleDetail" width="600px">
      <el-form ref="form" label-width="140px">
        <el-form-item label="订餐联系人：">
          {{ detail.name }}
        </el-form-item>
        <el-form-item label="订餐联系电话：">
          {{ detail.phone }}
        </el-form-item>
        <el-form-item label="订餐房间：" v-if="detail.meal_type=='二楼工作餐'">
          {{ detail.work.room_no }}
        </el-form-item>
        <el-form-item label="区领导用餐人数：" v-if="detail.meal_type=='加班餐（工作日）'||detail.meal_type=='加班餐（节假日）'">
          {{ detail.leader_count }}
        </el-form-item>
        <el-form-item label="工作人员用餐人数：" v-if="detail.meal_type=='加班餐（工作日）'||detail.meal_type=='加班餐（节假日）'">
          {{ detail.worker_count }}
        </el-form-item>
        <!-- <el-form-item label="用餐人数：" v-if="detail.meal_type=='加班餐（节假日）'">
          {{ detail.dining_count }}
        </el-form-item> -->
        <el-form-item label="订餐日期：">
          {{ detail.reserve_date }}
        </el-form-item>
        <el-form-item label="订餐时段：">
          {{ detail.meal_time }}
        </el-form-item>
        <div v-if="detail.meal_type=='二楼工作餐'">
          <el-form-item label="最高级别用餐人：">
            <span>
              名称：{{detail.work.max_name}}<br />
              职务：{{detail.work.max_position}}
            </span>
          </el-form-item>
          <el-form-item label="结算单位：">
            {{ detail.work.settle_part }}
          </el-form-item>
          <el-form-item label="结算单位联系人：">
            {{ detail.work.pay_name }}
          </el-form-item>
          <el-form-item label="联系方式：">
            {{ detail.work.pay_phone }}
          </el-form-item>
          <el-form-item label="用餐人数：">
            {{ detail.dining_count }}
          </el-form-item>
          <el-form-item label="司陪人数：">
            {{ detail.work.other_count }}
          </el-form-item>
          <el-form-item label="就餐方式：">
            {{ detail.work.meal_way }}
          </el-form-item>
          <el-form-item label="用餐性质：">
            {{ detail.work.meal_property }}
          </el-form-item>
          <el-form-item label="接待函附件：">
            <a :href="baseURL + detail.work.extra_file" target="_blank" download="" rel="noopener noreferrer" style="color: #67c23a">{{ detail.work.extra_file }}</a>
          </el-form-item>
          <el-form-item label="水牌备注：">
            {{ detail.work.brand_note }}
          </el-form-item>
        </div>
        <!-- <el-form-item label="订餐备注：">
          {{ detail.reserve_note }}
        </el-form-item> -->
        <el-form-item label="用户名称：">
          {{ detail.nick_name }}
        </el-form-item>
        <el-form-item label="组织ID：">
          {{ detail.organize_id }}
        </el-form-item>
        <el-form-item label="组织部门：">
          {{ detail.organize_part }}
        </el-form-item>
        <el-form-item label="订餐类型：">
          {{ detail.meal_type }}
        </el-form-item>
        <el-form-item label="审核状态：">
          {{ detail.audit_status }}
        </el-form-item>
        <el-form-item label="申请时间：">
          {{ detail.apply_time }}
        </el-form-item>
        <el-form-item label="审核时间：">
          {{ detail.audit_time }}
        </el-form-item>
        <el-form-item label="理由：" v-if="detail.audit_status == '不通过'">
          {{ detail.audit_reason }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="detail.audit_status == '审核中'">
        <el-button type="warning" size="medium" @click="setDriver(false)">不通过</el-button>
        <el-button size="medium" type="primary" @click="setDriver(true)">审核通过</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑公告" class="notice-box" :close-on-click-modal="false" :visible.sync="dialogVisibleNotice" width="600px">
      <el-form ref="form2" :inline="false" label-width="auto" size="medium">
        <el-form-item label="标题">
          <el-input v-model="notice.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="notice.notice" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" size="medium" @click="dialogVisibleNotice = false">取消</el-button>
        <el-button size="medium" type="primary" @click="setNotice()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getAuditList,
  getAuditDetail,
  setAuditDriver,
  cancelAudit,
  exportAudit,
  getAuditOt,
  setAuditOt,
  getAuditNotice,
  setAuditNotice,
} from "@/api/audit";
export default {
  name: "AuditList",
  data() {
    return {
      list: null,
      listLoading: true,
      baseURL: process.env.VUE_APP_BASE_API,
      dialogVisibleDetail: false,
      dialogVisibleEditAdd: false,
      get_ot: false, //假日加班餐是否展示
      notice: {
        title: "",
        notice: "",
      },
      dialogVisibleNotice: false,
      formScreen: {
        organize_id: "",
        phone: "",
        audit_status: "",
        name: "",
        status: "",
        start_time: "",
        end_time: "",
        meal_type: "",
        page: 1,
        page_len: 10,
      },
      formScreendate: ["", ""],
      pageSize: 10,
      total: 0,
      detail: { work: {} },
      order_id: "",
    };
  },
  created() {
    this.getList();
    this.getOt();
    this.getNotice();
  },
  methods: {
    getList() {
      var that = this;
      that.listLoading = true;
      console.log(that.formScreendate);
      let data = that.formScreen;
      if (that.formScreendate == null) {
        that.formScreendate = ["", ""];
      }
      data.start_time = that.formScreendate[0];
      data.end_time = that.formScreendate[1];
      getAuditList(data).then((response) => {
        console.log("获取审核列表", response);
        that.listLoading = false;
        that.list = response.data.result;
        that.total = response.data.data_sum;
      });
    },
    getDetail(id) {
      var that = this;
      console.log(id);
      that.order_id = id;
      getAuditDetail({ order_id: id }).then((response) => {
        console.log("获取审核详情", response);
        // that.dialogVisibleDetail = false;
        that.dialogVisibleDetail = true;
        that.detail = response.data;
      });
    },
    //节假日加班餐是否展示
    getOt(id) {
      var that = this;
      console.log(id);
      getAuditOt({}).then((response) => {
        console.log("获取节假日加班餐是否展示", response);
        // that.dialogVisibleDetail = false;
        that.get_ot = response.data.ot_holiday_flag;
      });
    },
    //设置节假日加班餐是否展示
    setOt(id) {
      var that = this;
      console.log(id);
      setAuditOt({ ot_holiday_flag: that.get_ot }).then((response) => {
        console.log("设置节假日加班餐是否展示", response);
        that.$message({
          message: "保存成功",
          type: "success",
        });
        // that.get_ot = response.data;
      });
    },
    //获取公告
    getNotice(id) {
      var that = this;
      console.log(id);
      getAuditNotice({}).then((response) => {
        console.log("获取公告", response);
        // that.dialogVisibleDetail = false;
        that.notice = response.data;
      });
    },
    //设置公告
    setNotice(notice) {
      var that = this;
      var data = that.notice;
      setAuditNotice(data).then((response) => {
        console.log("公告", response);
        that.$message({
          message: "保存成功",
          type: "success",
        });
        that.dialogVisibleNotice = false;
      });
    },
    //打开公告
    openNotice() {
      let that = this;
      that.getNotice();
      that.dialogVisibleNotice = true;
    },
    //快速审核
    kjcz(id) {
      let that = this;
      that.order_id = id;
      that
        .$confirm("请选择审核操作", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "审核通过",
          cancelButtonText: "不通过",
          type: "warning",
          center: true,
        })
        .then(() => {
          that.setDriver(true);
        })
        .catch((action) => {
          if (action == "cancel") {
            //不通过
            that.setDriver(false);
          } else {
            console.log(action);
          }
        });
    },
    
    // openDriver(type, order_id) {
    //   let that = this;
    //   that.driverId = order_id;
    //   if (type == 0) {
    //     that.driverTitle = "填写信息";
    //     that.dialogVisibleEditAdd = true;
    //   } else {
    //     that.driverTitle = "更新信息";
    //     getAuditDetail({ order_id: order_id }).then((response) => {
    //       console.log("获取审核详情", response);
    //       that.driverForm.name = response.data.driver_info.name;
    //       that.driverForm.phone = response.data.driver_info.phone;
    //       that.driverForm.plate = response.data.driver_info.plate;
    //       that.dialogVisibleEditAdd = true;
    //     });
    //   }
    // },
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
    //全部导出
    allExport() {
      let that = this;
      var data = {};
      exportAudit(data).then((response) => {
        console.log("全部导出", response);
        if (response.code == 0) {
          window.location.href = that.baseURL + response.data.url;
        }
      });
    },
    setDriver(status) {
      let that = this;
      var data = {
        order_id: that.order_id,
        audit_flag: status,
        audit_reason: "",
      };
      if (status == false) {
        that
          .$prompt("请输入审核不通过的理由", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
          .then(({ value }) => {
            data.audit_reason = value;
            setAuditDriver(data).then((response) => {
              console.log("审核", response);
              if (response.code == 0) {
                that.$message({
                  type: "success",
                  message: "修改审核状态成功!",
                });
                that.dialogVisibleDetail = false;
                that.getList();
              }
            });
          })
          .catch(() => {});
      } else {
        setAuditDriver(data).then((response) => {
          console.log("审核", response);
          if (response.code == 0) {
            that.$message({
              type: "success",
              message: "修改审核状态成功!",
            });
            that.dialogVisibleDetail = false;
            that.getList();
          }
        });
      }
    },
    //关联订单导出
    // piliangExport2(ids){
    //   let that = this;
    //   var data = {
    //     nick_name: '',
    //     order_no: '',
    //     transport_way: '',
    //     pay_flag: '',
    //     status: '',
    //     invoice_flag: '',
    //     order_ids: ids
    //   }
    //   exportWaybill(data).then((response) => {
    //     console.log("关联订单导出", response);
    //     // return false
    //     if(response.code==0){
    //       window.location.href = that.baseURL + response.data.url
    //     }
    //   });
    // },
    getSwitchStatus: function (status) {
      console.log(status);
      switch (status) {
        case 0:
          return "待付款";
        case 1:
          return "待运输";
        case 2:
          return "运输中";
        case 3:
          return "已完成";
        case 4:
          return "已取消";
        case 5:
          return "（待）开票";
        case 6:
          return "历史开票";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.auditList {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  .pagination-box {
  }
  .caozuo-box {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-form-item {
      width: 500px;
      margin-bottom: 0;
    }
  }
}
.detail-box {
  .el-form-item {
    margin-bottom: 0;
  }
  p {
    line-height: 32px;
    margin: 5px 0;
    // display: flex;
    // justify-content: space-between;
  }
}
.driver-box {
  .el-form {
    width: 80%;
    margin: 0 auto;
  }
  .el-form .el-form-item:last-child {
    margin-bottom: 0;
  }
}
.pagination-box {
  text-align: center;
  margin-top: 20px;
}
</style>
