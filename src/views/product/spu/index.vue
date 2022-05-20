<template>
  <div>
    <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    <el-card>
      <div>
        <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
        <el-table style="width: 100%; margin: 20px 0" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width"> </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width"> </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <HintButton type="success" icon="el-icon-plus" size="mini" title="添加spu"></HintButton>
            <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改spu"></HintButton>
            <HintButton type="info" icon="el-icon-info" size="mini" title="spu信息"></HintButton>
            <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除spu"></HintButton>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="page"
          :page-sizes="[5, 10, 20]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,total, sizes"
          :total="total"
          style="text-align: center"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
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
        isShowTable: true, //控制表格面板和三级联动是否可用
        page: 1,
        limit: 5,
        records: [],
        total: 1
      }
    },
    methods: {
      // 获取分类id
      getCategoryId(categoryId) {
        this.categoryId = categoryId
        this.getSpuList()
      },
      // 获取spu列表
      async getSpuList(page = 1) {
        this.page = page
        const result = await this.$API.spu.reqSpuList(this.page, this.limit, this.categoryId.category3Id)
        if (result.code === 200) {
          this.records = result.data.records
          this.total = result.data.total
        }
      },
      // 页面条数变化时
      handleSizeChange(limit) {
        this.limit = limit
        this.getSpuList()
      }
    }
  }
</script>

<style>
</style>