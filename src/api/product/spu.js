import request from '@/utils/request'

// 获取spu列表
export const reqSpuList = (page, limit, category3Id) =>
  request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id }
  })

// 获取品牌数据 /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList = () =>
  request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'get'
  })
// 获取销售属性 /admin/product/baseSaleAttrList
export const reqSaleAttrList = () =>
  request({
    url: '/admin/product/baseSaleAttrList',
    method: 'get'
  })
// 获取某一个spu信息 /admin/product/getSpuById/{id}
export const reqSpuById = spuId =>
  request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get'
  })
// 获取spu图片 /admin/product/spuImageList/{id}
export const reqImageList = spuId =>
  request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
  })

// 修改或添加spu
export const reqAddOrUpdateSpu = skuInfo => {
  if (skuInfo.id) {
    return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: skuInfo })
  } else {
    return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: skuInfo })
  }
}
// 删除spu
export const reqDeleteSpu = id =>
  request({
    url: `/admin/product/deleteSpu/${id}`,
    method: 'delete'
  })

// 获取图片
export const reqSpuImageList = spuId => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取销售属性
export const reqSpuSaleAttrList = spuId => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 获取平台属性
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 保存添加sku
export const reqAddSku = skuInfo => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })
