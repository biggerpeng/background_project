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
        <el-select value="" :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrId">
          <el-option :label="attr.name" :value="attr.id" v-for="attr in unSelectSaleAttr" :key="attr.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrId">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spuInfo.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width"> </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template v-slot="{ row }">
              <el-tag :key="tag.id" v-for="tag in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="handleClose(tag)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{ row }">
              <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="goScene">取消</el-button>
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
          category3Id: 0,
          tmId: 0,
          spuSaleAttrList: [
            {
              id: 11,
              spuId: 6,
              baseSaleAttrId: 1,
              saleAttrName: '颜色',
              spuSaleAttrValueList: [
                { id: 25, spuId: 6, baseSaleAttrId: 1, saleAttrValueName: '黑', saleAttrName: '颜色', isChecked: null },
                { id: 26, spuId: 6, baseSaleAttrId: 1, saleAttrValueName: '青', saleAttrName: '颜色', isChecked: null },
                { id: 27, spuId: 6, baseSaleAttrId: 1, saleAttrValueName: '蓝', saleAttrName: '颜色', isChecked: null }
              ]
            }
          ],
          spuImageList: []
        },
        imageList: [], //整理后的图片数据
        attrId: '' //收集未选择属性的id
      }
    },
    methods: {
      // 图片墙相关
      handleAdd(response, file, fileList) {
        console.log(response, file, fileList)
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

      goScene() {
        this.$emit('goScene', 0) //注意抛出的事件要写成字符串，不然会被当作变量
      },
      // 获取spu数据
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