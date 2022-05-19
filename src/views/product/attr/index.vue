<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!categoryId.category3Id" @click="addOrChangeAttr"> 添加</el-button>
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
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="addOrChangeAttr">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus">添加属性值</el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table style="width: 100%" border>
          <el-table-column type="index" label="序号" width="100px" align="center"> </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width"> </el-table-column>
          <el-table-column prop="prop" label="操作" width="width"> </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Attr',
    data() {
      return {
        categoryId: {},
        attrList: [],
        isShowTable: true
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
      },
      // 添加或修改平台属性
      addOrChangeAttr() {
        this.isShowTable = false
      },
      // 取消添加或修改
      cancel() {
        this.isShowTable = true
      }
    }
  }
</script>

<style>
</style>