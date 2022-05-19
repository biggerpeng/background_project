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
      <el-form style="width: 80%">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px">
          <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
        imageUrl: ''
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
      showDialog() {
        this.dialogFormVisible = true
      },
      updateTradeMark() {
        this.showDialog()
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