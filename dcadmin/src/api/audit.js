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

//获取节假日加班餐
export function getAuditOt(data) {
  return request({
    url: '/system/get_ot',
    method: 'post',
    data
  })
}

//设置节假日加班餐
export function setAuditOt(data) {
  return request({
    url: '/system/set_ot',
    method: 'post',
    data
  })
}

//获取公告
export function getAuditNotice(data) {
  return request({
    url: '/system/get_notice',
    method: 'post',
    data
  })
}

//设置公告
export function setAuditNotice(data) {
  return request({
    url: '/system/save_notice',
    method: 'post',
    data
  })
}
