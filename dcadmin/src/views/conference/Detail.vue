<template>
  <div class="app-container swiperDetail-container">
    <el-form ref="form" label-width="120px">
      <el-form-item label="房间号">
        <el-input v-model="formData.room_no" type="text" />
      </el-form-item>
      <el-form-item label="容纳人数">
        <el-input v-model="formData.people_count" type="text" />
      </el-form-item>
      <el-form-item label="使用状态">
        <!-- <el-select v-model="formData.status" placeholder="">
          <el-option label="启用" :value="true" />
          <el-option label="停用" :value="false" />
        </el-select> -->
        <el-switch v-model="formData.status"  active-text="启用"> </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="" size="medium" @click="GLOBAL.$backPage"
          >返回</el-button
        >
        <el-button
          type="primary"
          size="medium"
          :loading="buttonLoading"
          @click="setData"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getConferenceDetail, setConference } from "@/api/conference";
export default {
  name: "ConferenceDetail",
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      formData: {
        room_id: "",
        status: true,
        people_count: "",
        room_no: "",
      },
      buttonLoading: false,
    };
  },
  mounted() {
    var that = this;
    console.log(that.$route.query.room_id);
    if (that.$route.query.room_id) {
      that.formData.room_id = that.$route.query.room_id;
      that.getData();
    }
  },
  methods: {
    getData() {
      var that = this;
      getConferenceDetail({ room_id: that.formData.room_id }).then(
        (response) => {
          console.log("获取轮播详情", response);
          that.formData = response.data;
        }
      );
    },
    setData() {
      var that = this;
      var data = that.formData;
      data.people_count = data.people_count * 1;
      that.buttonLoading = true;
      setConference(data)
        .then((response) => {
          console.log("保存房间详情", response);
          that.$message({
            message: "保存成功",
            type: "success",
          });
          setTimeout(() => {
            that.$router.go(-1);
          }, 600);
          that.buttonLoading = false;
        })
        .catch((error) => {
          that.buttonLoading = false;
        });
    },
    handleAvatarSuccess(res, file) {
      var that = this;
      console.log(file);
      if (file.response.code == 2) {
        //导入失败
        var type = "warning";
      } else {
        var type = "success";
        that.formData.banner_pic = that.baseURL + file.response.data.file_path;
      }
      that.$message({
        message: file.response.message,
        type: type,
      });
    },
  },
  computed: {
    token() {
      return this.$store.state.user.token;
    },
  },
};
</script>

<style lang="scss">
.line {
  text-align: center;
}
.swiperDetail-container {
  .el-input,
  .el-textarea {
    width: 300px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: contain;
  }
  .el-alert--info.is-light {
    background: transparent;
    padding-left: 0;
  }
}
</style>

