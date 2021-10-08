import request from '@/utils/request'

// 获取顶部数据
export function getToday_meal(data) {
  return request({
    url: '/admin/meal/today_meal',
    method: 'post',
    data
  })
}

// 获取订餐人数
export function getGet_date(data) {
  return request({
    url: '/admin/meal/get_date',
    method: 'post',
    data
  })
}

// 根据日期获取订餐人数
export function getDay_date(data) {
  return request({
    url: '/admin/meal/date_order',
    method: 'post',
    data
  })
}