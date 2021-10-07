import request from '@/utils/request'

//审核列表
export function getAuditList(data) {
  return request({
    url: '/admin/meal/list_order',
    method: 'post',
    data
  })
}
//审核详情
export function getAuditDetail(data) {
  return request({
    url: '/admin/meal/detail_order',
    method: 'post',
    data
  })
}

//更新信息
export function setAuditDriver(data) {
  return request({
    url: '/admin/meal/audit_order',
    method: 'post',
    data
  })
}

//q取消审核
export function cancelAudit(data) {
  return request({
    url: '/admin/order/cancel_order',
    method: 'post',
    data
  })
}

//导出
export function exportAudit(data) {
  return request({
    url: '/admin/meal/export_order',
    method: 'post',
    data
  })
}

