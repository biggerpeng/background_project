<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="attr in AttrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.saleAttrName" v-for="attr in spuSaleAttrList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.saleAttrValueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.spuSaleAttrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item>
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange"
          >>
          <el-table-column type="selection" width="80"> </el-table-column>
          <el-table-column label="图片" width="width">
            <template v-slot="{ row }">
              <img :src="row.imgUrl" alt="" style="height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"> </el-table-column>
          <el-table-column label="操作" width="width">
            <template v-slot="{ row }">
              <el-button type="primary" size="mini" v-if="!row.isDefault" @click="setDefaultImg(row)">设为默认</el-button>
              <el-button size="mini" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'SkuForm',
    data() {
      return {
        // 存储图片的信息
        spuImageList: [],
        // 销售属性
        spuSaleAttrList: [],
        // 平台属性
        AttrInfoList: [],
        //  收集sku数据的字段
        skuInfo: {
          // 第一类：父组件传递过来
          category3Id: 0,
          spuId: 0,
          tmId: 0,
          // 第二类：通过v-model
          skuName: '',
          price: '',
          weight: '',
          skuDesc: '',
          // 第三类：手动
          skuAttrValueList: [],
          skuDefaultImg: '',
          skuImageList: [],
          skuSaleAttrValueList: []
        },
        spu: {},
        // 收集选择的图片信息
        imageList: []
      }
    },
    methods: {
      // 获取skuForm数据
      async getData(spu, categoryId) {
        this.spu = spu
        this.skuInfo.category3Id = categoryId.category3Id
        this.skuInfo.spuId = spu.id
        this.skuInfo.tmId = spu.tmId
        // 获取图片
        const result = await this.$API.spu.reqSpuImageList(spu.id)
        if (result.code === 200) {
          const arr = result.data
          arr.forEach(item => {
            item.isDefault = 0
          })
          this.spuImageList = arr
        }
        // 获取销售属性
        const result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
        if (result1.code === 200) {
          this.spuSaleAttrList = result1.data
        }
        // 获取平台属性
        const { category1Id, category2Id, category3Id } = categoryId
        const result2 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, category3Id)
        if (result2.code === 200) {
          this.AttrInfoList = result2.data
        }
      },
      // 选择图片
      handleSelectionChange(selection) {
        this.imageList = selection
      },
      // 设置默认图片
      setDefaultImg(row) {
        this.spuImageList.forEach(item => {
          item.isDefault = 0
        })
        row.isDefault = 1
        this.skuInfo.skuDefaultImg = row.imgUrl
      }
    }
  }
</script>

<style>
</style>