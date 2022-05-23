<template>
  <div>
    <CategorySelect @getCategoryId="getCategoryId" :show="!!scene"></CategorySelect>
    <el-card>
      <div v-show="scene === 0">
        <el-button type="primary" icon="el-icon-plus" @click="addSpu" :disabled="!categoryId.category3Id">添加SPU</el-button>
        <el-table style="width: 100%; margin: 20px 0" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width"> </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width"> </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{ row }">
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></HintButton>
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></HintButton>
              <HintButton type="info" icon="el-icon-info" size="mini" title="spu信息" @click="handler(row)"></HintButton>
              <el-popconfirm title="确定删除吗？" @onConfirm="deleteSpu(row)">
                <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></HintButton>
              </el-popconfirm>
            </template>
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
      <SpuForm v-show="scene === 1" @goScene="goScene" ref="SpuForm"></SpuForm>
      <SkuForm v-show="scene === 2" @goScene="goScene" ref="SkuForm"></SkuForm>
      <!-- sku列表 -->
      <el-dialog :title="spu.spuName" :visible.sync="dialogTableVisible">
        <el-table :data="skuList" style="width: 100%" border v-loading="loading">
          <el-table-column prop="skuName" label="名称" width="width"> </el-table-column>
          <el-table-column prop="price" label="价格" width="width"> </el-table-column>
          <el-table-column prop="weight" label="重量" width="width"> </el-table-column>
          <el-table-column label="默认图片" width="width">
            <template v-slot="{ row }">
              <img :src="row.skuDefaultImg" style="height: 100px" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import SpuForm from './SpuForm'
  import SkuForm from './SkuForm'
  export default {
    name: 'Spu',
    data() {
      return {
        categoryId: {},
        page: 1,
        limit: 5,
        records: [],
        total: 1,
        scene: 0, //0代表显示spu列表  1代表显示添加或修改spu  2代表添加sku
        dialogTableVisible: false, //对话框
        spu: {},
        skuList: [],
        loading: true
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
      },
      // 添加spu
      addSpu() {
        this.scene = 1
        this.$refs.SpuForm.initAddSpuData(this.categoryId.category3Id)
      },
      // 修改spu
      updateSpu(row) {
        this.scene = 1
        this.$refs.SpuForm.initSpuData(row)
      },
      // 取消或保存sku编辑时
      goScene({ scene, type }) {
        this.scene = scene
        if (type === '修改' || '添加sku') {
          this.getSpuList(this.page)
        } else if (type === '保存sku') {
        } else {
          this.getSpuList()
        }
      },
      // 删除spu
      async deleteSpu(row) {
        const result = await this.$API.spu.reqDeleteSpu(row.id)
        if (result.code === 200) {
          this.$message.success('删除成功')
          this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
        }
      },
      // 添加sku
      addSku(spu) {
        this.scene = 2
        this.$refs.SkuForm.getData(spu, this.categoryId)
      },
      // 查看sku列表
      async handler(row) {
        this.skuList = []
        this.loading = true
        this.spu = row
        this.dialogTableVisible = true
        const result = await this.$API.spu.reqSkuList(row.id)
        if (result.code === 200) {
          this.skuList = result.data
        }
        this.loading = false
      }
    },
    components: {
      SpuForm,
      SkuForm
    }
  }
</script>

<style>
</style>