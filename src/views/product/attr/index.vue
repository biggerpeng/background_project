<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <el-table :data="attrList" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="100px" align="center"> </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150px"> </el-table-column>
        <el-table-column label="属性值列表" width="width">
          <!-- 注意elementUi插槽prop传过来的为row\$index -->
          <template v-slot="{ row }">
            <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id" style="margin: 0 10px">{{
              attrValue.valueName
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="200px">
          <template v-solt="{ row }">
            <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Attr',
    data() {
      return {
        categoryId: {},
        attrList: []
      }
    },
    methods: {
      // 获取分类id
      getCategoryId(categoryId) {
        this.categoryId = categoryId
        this.getAttr()
      },
      // 获取属性数据
      async getAttr() {
        const result = await this.$API.attr.reqGetAttr(this.categoryId)
        if (result.code === 200) {
          this.attrList = result.data
        }
      }
    }
  }
</script>

<style>
</style>