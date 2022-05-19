import request from '@/utils/request'

// 品牌列表
export const reqGetTradeMark = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 新增或修改品牌
export const reqAddOrUpdateTradeMark = trademark => {
  if (trademark.id) {
    return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: trademark })
  } else {
    return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: trademark })
  }
}

// 删除品牌
export const reqDeleteTradeMark = id =>
  request({
    url: `admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
