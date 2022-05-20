<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 属性表格结构 -->
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!categoryId.category3Id" @click="addAttr"> 添加</el-button>
        <el-table :data="attrList" style="width: 100%; margin: 20px 0" border>
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
            <template v-slot="{ row }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 修改或添加属性结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addArrtValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table style="width: 100%" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="100px" align="center"> </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template v-slot="{ row, $index }">
              <el-input
                v-model.trim="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                v-if="row.flag"
                @blur="edited(row)"
                @keyup.native.enter="row.flag = false"
                :ref="$index"
              ></el-input>
              <!-- 这里自动获取焦点待解决 -->
              <span v-else @dblclick="toEdit(row, $index)" style="display: block; height: 23px">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{ row, $index }">
              <el-popconfirm :title="`确定删除${row.valueName}吗`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttr">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  // 引入深拷贝
  import cloneDeep from 'lodash/cloneDeep'
  export default {
    name: 'Attr',
    data() {
      return {
        categoryId: {},
        attrList: [],
        // 决定属性表格是否展示
        isShowTable: true,
        // 添加或修改属性需要发送的数据
        attrInfo: {
          attrName: '',
          attrValueList: [],
          categoryId: 0,
          categoryLevel: 3
        }
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
      // 添加平台属性
      addAttr() {
        this.isShowTable = false
        this.attrInfo = {
          attrName: '',
          attrValueList: [],
          categoryId: this.categoryId.category3Id,
          categoryLevel: 3
        }
      },
      // 取消添加或修改
      cancel() {
        this.isShowTable = true
      },
      // 添加属性值
      addArrtValue() {
        this.attrInfo.attrValueList.push({
          attrId: this.attrInfo.id,
          valueName: '',
          flag: true //控制显示模式还是编辑模式
        })
        // 实现自动聚焦
        this.$nextTick(() => {
          this.$refs[this.attrInfo.attrValueList.length - 1].focus() //注意$refs是一个对象，不是数组，索引没问题
        })
      },
      // 修改属性
      updateAttr(row) {
        this.isShowTable = false
        this.attrInfo = cloneDeep(row) //深拷贝
        // 解决显示模式切换
        this.attrInfo.attrValueList.forEach(item => {
          this.$set(item, 'flag', false)
        })
      },
      // 编辑属性完成
      edited(row) {
        // 判断属性值输入为空格或没有输入的情况
        if (!row.valueName) {
          this.$message.error('请输入正确的属性值')
          return
        }
        // 判断属性值重复的情况
        const isRepeat = this.attrInfo.attrValueList.some(item => {
          if (item !== row) {
            return item.valueName === row.valueName
          }
        })
        if (isRepeat) {
          this.$message.error('输入的属性值重复')
          return
        }
        row.flag = false
      },
      // 切换到编辑模式
      toEdit(row, index) {
        row.flag = true
        // 实现自动聚焦
        this.$nextTick(() => {
          this.$refs[index].focus()
        })
      },
      // 删除属性值
      deleteAttrValue(index) {
        this.attrInfo.attrValueList.splice(index, 1)
      },
      // 保存添加或修改
      async saveAttr() {
        // 处理属性值数组
        this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
          delete item.flag
          return item.valueName !== ''
        })
        //发送网络请求
        try {
          await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
          this.isShowTable = true
          this.$message.success('保存成功')
          this.getAttr()
        } catch (error) {
          this.$message.error(error.message)
        }
      }
    }
  }
</script>

<style>
</style>