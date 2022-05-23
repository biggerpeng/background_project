<template>
  <div>
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"> </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"> </el-table-column>
      <el-table-column label="默认图片" width="120">
        <template v-slot="{ row }">
          <img :src="row.skuDefaultImg" style="height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="width"> </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80"> </el-table-column>
      <el-table-column label="操作" width="width">
        <template v-slot="{ row }">
          <el-button type="success" icon="el-icon-top" size="mini"></el-button>
          <el-button type="success" icon="el-icon-bottom" size="mini"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-sizes="[5, 10, 20]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,total, sizes"
      :total="total"
      style="text-align: center; margin-top: 10px"
      @size-change="handleSizeChange"
      @current-change="getSkuList"
    >
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'Sku',
    data() {
      return {
        page: 1,
        limit: 5,
        total: 0,
        records: []
      }
    },
    methods: {
      // 获取sku列表
      async getSkuList(page = 1) {
        this.page = page
        const result = await this.$API.sku.reqSkuList(this.page, this.limit)
        if (result.code === 200) {
          this.total = result.data.total
          this.records = result.data.records
        }
      },
      // 改变每页大小
      handleSizeChange(limit) {
        this.limit = limit
        this.getSkuList()
      }
    },
    mounted() {
      this.getSkuList()
    }
  }
</script>

<style>
</style>