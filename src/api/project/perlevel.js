import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询项目人员级别列表
export function listData(item_id) {
  return request({
    url: '/project/info/perlevellist/'+ item_id,
    method: 'get'
  })
}
// 查询级别是否存在
export function selectIsLevel(query) {
  return request({
    url: '/project/info/selectIsLevel',
    method: 'get',
    params: query
  })
}

// 查询项目人员级别详细
export function getData(item_level_id) {
  return request({
    url: '/project/info/perlevel/' + praseStrEmpty(item_level_id),
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/dictType/' + dictType,
    method: 'get'
  })
}

// 新增人员级别
export function addData(data) {
  return request({
    url: '/project/info/addPerLevel',
    method: 'post',
    data: data
  })
}

// 修改项目人员级别信息
export function updateData(data) {
  return request({
    url: '/project/info/updatedata',
    method: 'put',
    data: data
  })
}

// 删除外包级别数据
export function delData(item_level_id) {
  return request({
    url: '/project/info/deldata/' + item_level_id,
    method: 'delete'
  })
}

// 导出字典数据
export function exportData(query) {
  return request({
    url: '/system/dict/data/export',
    method: 'get',
    params: query
  })
}
