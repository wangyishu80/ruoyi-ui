import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询项目人员列表
export function listDataEmp(query) {
  return request({
    url: '/project/info/assignperlist',
    method: 'get',
    params: query
  })
}
// 查询用户列表
export function listEmp(query) {
  return request({
    url: '/project/info/listEmp',
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

// 绑定人员
export function addData(query) {
  return request({
    url: '/project/info/addProPer',
    method: 'get',
    params: query
  })
}

// 解绑项目人员
export function updateData(data) {
  return request({
    url: '/project/info/updateProPer',
    method: 'put',
    data: data
  })
}
// 修改项目人员，重新绑定
export function updateBinding(data) {
  return request({
    url: '/project/info/updateBinding',
    method: 'put',
    data: data
  })
}

// 查询员工列表是否已经绑定此项目
export function listIsBindEmp(query) {
  return request({
    url: '/project/info/listIsBindEmp',
    method: 'get',
    params: query
  })
}

// 判断项目开始日期是否小于当日
export function CompareItemdate(query) {
  return request({
    url: '/project/info/CompareItemdate',
    method: 'get',
    params: query
  })
}
// 查询是否解绑此项目
export function unBindEmp(query) {
  return request({
    url: '/project/info/unBindEmp',
    method: 'get',
    params: query
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

// 查询项目人员列表
export function listDataPer(item_level_id) {
  return request({
    url: '/project/info/outsourcingperlist/'+ item_level_id,
    method: 'get'
  })
}
//查询员工是否设置工资信息
export function selectEmpcost(query) {
  return request({
    url: '/project/info/selectEmpcost',
    method: 'get',
    params: query
  })
}

//查询员工绑定项目人数
export function selectEmpNum(query) {
  return request({
    url: '/project/info/selectEmpNum',
    method: 'get',
    params: query
  })
}
