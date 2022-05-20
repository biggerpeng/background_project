<template>
  <div>
    <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    <el-card>
      <div>
        <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
        <el-table style="width: 100%; margin: 20px 0" border>
          <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
          <el-table-column prop="prop" label="spu名称" width="width"> </el-table-column>
          <el-table-column prop="prop" label="spu描述" width="width"> </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <el-button type="success" icon="el-icon-plus" size="mini"></el-button>
            <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="info" icon="el-icon-info" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </el-table-column>
        </el-table>
        <!-- @size-change="handleSizeChange"
          @current-change="handleCurrentChange" -->
        <el-pagination
          :current-page="3"
          :page-sizes="[10, 20, 50]"
          :page-size="5"
          layout=" prev, pager, next, jumper,->,total, sizes"
          :total="50"
          style="text-align: center"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Spu',
    data() {
      return {
        categoryId: {},
        isShowTable: true //控制表格面板和三级联动是否可用
      }
    },
    methods: {
      // 获取分类id
      getCategoryId(categoryId) {
        this.categoryId = categoryId
        this.getAttr()
      }
    }
  }
</script>

<style>
</style>