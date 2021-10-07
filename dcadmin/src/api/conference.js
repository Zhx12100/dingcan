import request from '@/utils/request'

// 获取房间列表
export function getConferenceList(data) {
  return request({
    url: '/admin/meal/list_room',
    method: 'post',
    data
  })
}
// 获取房间详情
export function getConferenceDetail(data) {
  return request({
    url: '/admin/meal/detail_room',
    method: 'post',
    data
  })
}
// 修改房间状态
export function changeConference(data) {
  return request({
    url: '/admin/meal/operate_room',
    method: 'post',
    data
  })
}

// 删除房间图
export function deleteConference(data) {
  return request({
    url: '/admin/meal/delete_room',
    method: 'post',
    data
  })
}
// 新增编辑房间列表
export function setConference(data) {
  return request({
    url: '/admin/meal/save_room',
    method: 'post',
    data
  })
}

//获取预定详情日历
export function getReserveDate(data) {
  return request({
    url: '/admin/meal/reserve_date',
    method: 'post',
    data
  })
}
//获取预定信息列表
export function getReserveMessage(data) {
  return request({
    url: '/admin/meal/reserve_message',
    method: 'post',
    data
  })
}
//获取预定信息详情
export function getReserveDetail(data) {
  return request({
    url: '/admin/meal/reserve_detail',
    method: 'post',
    data
  })
}
