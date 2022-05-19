<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showDialog" style="margin-bottom: 30px">添加</el-button>
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center"> </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"> </el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <template v-slot="{ row }">
          <img :src="row.logoUrl" style="width: 60px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark">修改 </el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 5, 8]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,total, sizes"
      :total="total"
      style="text-align: center; margin-top: 20px"
      @current-change="getData"
      @size-change="sizeChange"
    >
    </el-pagination>

    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form style="width: 80%" :model="tmForm">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'TradeMark',
    data() {
      return {
        page: 1,
        limit: 3,
        total: 0,
        list: [],
        // 显示隐藏对话框
        dialogFormVisible: false,
        tmForm: {
          tmName: '',
          logoUrl: ''
        }
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      async getData(page = 1) {
        this.page = page
        const result = await this.$API.tradeMark.reqGetTradeMark(this.page, this.limit)
        this.list = result.data.records
        this.total = result.data.total
      },
      sizeChange(size) {
        this.limit = size
        this.getData()
      },
      // 添加按钮
      showDialog() {
        this.dialogFormVisible = true
        this.tmForm = { tmName: '', logoUrl: '' }
      },
      // 修改按钮
      updateTradeMark() {
        this.showDialog()
      },
      // 图片上传成功后执行的函数
      handleAvatarSuccess(res) {
        if (res.code === 200) {
          this.tmForm.logoUrl = res.data
        }
      },
      // 图片上传之前
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 png 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      // 确认添加或修改
      async addOrUpdateTradeMark() {
        const result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
        if (result.code === 200) {
          this.$message(this.tmForm.id ? '修改品牌成功' : '添加品牌成功')
          this.dialogFormVisible = false
          this.getData()
        }
      }
    }
  }
</script>

<style>
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
  }
</style>