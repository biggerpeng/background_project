import request from '@/utils/request'

// 品牌列表
export const reqGetTradeMark = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })
