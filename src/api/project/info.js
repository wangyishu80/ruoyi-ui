import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询项目列表信息
export function listProject(query) {
  return request({
    url: '/project/info/list',
    method: 'get',
    params: query
  })
}
// 查询项目列表信息
export function selectProject(item_id) {
  return request({
    url: '/project/info/' + praseStrEmpty(item_id),
    method: 'get'
  })
}

// 新增项目基本信息
export function addProject(data) {
  return request({
    url: '/project/info/addProject',
    method: 'post',
    data: data
  })
}
// 修改项目列表信息
export function updateProject(data) {
  return request({
    url: '/project/info',
    method: 'put',
    data: data
  })
}
// 删除项目列表信息
export function deleteProject(item_id) {
  return request({
    url: '/project/info/'+ item_id,
    method: 'delete'
  
  })
}



// 下载文件
export function download(query) {
  return request({
    url: '/file/load/download',
    method: 'get',
    params: query
   
  })
}

// 文件列表查询
export function filelist(query) {
  return request({
    url: '/file/load/fileList',
    method: 'get',
    params: query
  })
}

// 文件列表数据删除
export function deleteFile(query) {
  return request({
    url: '/file/load/'+ query,
    method: 'delete'
  })
}

// 查询项目变更数据列表
export function recordlistProject(item_id) {
  return request({
    url: '/project/info/recordlist/' + item_id,
    method: 'get'
  })
}
// 查询项目成本预估
export function selectProjectCost(item_id) {
  return request({
    url: '/project/info/selectProjectCost/' + item_id,
    method: 'get'
  })
}
// 导出项目信息
export function exportProject(query) {
  return request({
    url: '/project/info/exportProject',
    method: 'get',
    params: query
  })
}
// 导出历史项目信息
export function exportHistory(item_id) {
  return request({
    url: '/project/info/exportHistory/' + item_id,
    method: 'get'
  })
}
// 获取客户名称
export function getCustomer(item_type) {
  return request({
    url: '/project/info/getCustomer/'+item_type,
    method: 'get'
  })
}
// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/file/load/importTemplate',
    method: 'get'
  })
}
// 查询项目成本预估
export function listPerBinding(item_id) {
  return request({
    url: '/project/info/listPerBinding/' + item_id,
    method: 'get'
  })
}
// 查询项目绑定信息
export function listDataBindingEmp(query) {
  return request({
    url: '/project/info/listDataBindingEmp',
    method: 'get',
    params: query
  })
}
// 查询用户列表
export function listemployee(query) {
  return request({
    url: '/project/info/listEmpinfo',
    method: 'get',
    params: query
  })
}
// 查询级别变更列表
export function getLevelChangeInfo() {
  return request({
    url: '/project/info/getLevelChangeInfo',
    method: 'get'
  })
}
// 查询级别变更历史列表
export function getLevelChangehisInfo() {
  return request({
    url: '/project/info/selectLevelChangeHisInfo',
    method: 'get'
  })
}
