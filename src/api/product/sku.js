import request from '@/utils/request'

// 获取sku列表
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}` })
