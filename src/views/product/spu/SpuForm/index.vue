<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
          <el-option :value="tm.id" v-for="tm in trademarkList" :key="tm.id" :label="tm.tmName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="SPU描述" v-model="spuInfo.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="imageList"
          :on-success="handleAdd"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select value="" :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndName">
          <el-option :label="attr.name" :value="`${attr.id}:${attr.name}`" v-for="attr in unSelectSaleAttr" :key="attr.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndName" @click="addAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spuInfo.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width"> </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template v-slot="{ row }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(row.spuSaleAttrValueList, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                ref="saveTagInput"
                size="small"
                v-model="row.inputValue"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{ $index }">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttr($index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSkuInfo">保存</el-button>
        <el-button @click="goScene({ scene: 0, type: '' })">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'SpuForm',
    data() {
      return {
        // 图片墙相关
        dialogImageUrl: '',
        dialogVisible: false,

        trademarkList: [],
        saleAttrList: [],
        // 当前spu信息
        spuInfo: {
          spuName: '',
          description: '',
          category3Id: '',
          tmId: '',
          spuSaleAttrList: [],
          spuImageList: []
        },
        imageList: [], //整理后的图片数据
        attrIdAndName: '' //收集未选择属性的id
      }
    },
    methods: {
      // 图片墙相关
      handleAdd(response, file, fileList) {
        if (response.code === 200) {
          this.imageList = fileList
        } else {
          this.$message.error('上传失败')
          fileList.pop()
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
        // 把删除后剩下的图片信息重新赋值
        this.imageList = fileList
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },

      // 切换场景
      goScene(options) {
        this.$emit('goScene', options) //注意抛出的事件要写成字符串，不然会被当作变量
        // 清楚数据
        // this._data = this.$options.data()这样无效
        Object.assign(this._data, this.$options.data()) //可行，应该是响应式的问题
      },
      // 修改时获取spu数据
      async initSpuData(row) {
        // 获取品牌数据
        const trademarkListResult = await this.$API.spu.reqTrademarkList()
        if (trademarkListResult.code === 200) this.trademarkList = trademarkListResult.data
        // 获取销售属性
        const saleAttrListResult = await this.$API.spu.reqSaleAttrList()
        if (saleAttrListResult.code === 200) this.saleAttrList = saleAttrListResult.data
        // 获取某一个spu信息
        const spuInfoResult = await this.$API.spu.reqSpuById(row.id)
        if (spuInfoResult.code === 200) this.spuInfo = spuInfoResult.data
        // 获取spu图片
        const imageListResult = await this.$API.spu.reqImageList(row.id)
        if (imageListResult.code === 200) {
          /*  imageListResult.data.forEach(item => {
                                                                                                                                                                                                                                item.name = item.imgName
                                                                                                                                                                                                                                item.url = item.imgUrl
                                                                                                                                                                                                                              })
                                                                                                                                                                                                                              this.imageList = imageListResult.data */
          this.imageList = imageListResult.data.map(item => {
            return {
              name: item.imgName,
              url: item.imgUrl
            }
          })
        }
      },
      // 添加时获取spu数据
      async initAddSpuData(category3Id) {
        // 设置categoryId
        this.spuInfo.category3Id = category3Id
        // 获取品牌数据
        const trademarkListResult = await this.$API.spu.reqTrademarkList()
        if (trademarkListResult.code === 200) this.trademarkList = trademarkListResult.data
        // 获取销售属性
        const saleAttrListResult = await this.$API.spu.reqSaleAttrList()
        if (saleAttrListResult.code === 200) this.saleAttrList = saleAttrListResult.data
      },
      // 添加销售属性
      addAttr() {
        const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(':')
        this.spuInfo.spuSaleAttrList.push({ baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] })
        this.attrIdAndName = ''
      },
      // 添加销售属性值
      addAttrValue(row) {
        this.$set(row, 'inputVisible', true)
        this.$set(row, 'inputValue', '')
      },
      // 新增属性值input失去焦点时
      handleInputConfirm(row) {
        const { baseSaleAttrId, inputValue: saleAttrValueName } = row
        // 处理空值
        if (!saleAttrValueName.trim()) return this.$message.error('属性值不能为空')
        // 处理重复
        const noRepeat = row.spuSaleAttrValueList.every(item => item.saleAttrValueName !== saleAttrValueName)
        if (!noRepeat) return this.$message.error('属性值不能重复')
        // 添加数据
        row.spuSaleAttrValueList.push({ baseSaleAttrId, saleAttrValueName })
        row.inputVisible = false
      },
      // 删除属性值
      handleClose(spuSaleAttrValueList, index) {
        spuSaleAttrValueList.splice(index, 1)
      },
      // 删除属性
      deleteAttr(index) {
        this.spuInfo.spuSaleAttrList.splice(index, 1)
      },
      // 保存添加、修改spu
      async saveSkuInfo() {
        // 整理参数
        this.spuInfo.spuImageList = this.imageList.map(item => {
          return {
            imgName: item.name,
            imgUrl: item.response?.data || item.url
          }
        })
        // 发请求
        const result = await this.$API.spu.reqAddOrUpdateSpu(this.spuInfo)
        if (result.code === 200) {
          this.goScene({ scene: 0, type: this.spuInfo.id ? '修改' : '添加' })
          this.$message.success('保存成功')
        }
      }
    },
    computed: {
      unSelectSaleAttr() {
        return this.saleAttrList.filter(item => {
          return this.spuInfo.spuSaleAttrList.every(item1 => {
            return item1.saleAttrName !== item.name
          })
        })
      }
    }
  }
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>