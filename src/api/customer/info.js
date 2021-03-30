import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询客户列表信息
export function listCustomer(query) {
  return request({
    url: '/customer/info/list',
    method: 'get',
    params: query
  })
}
// 查询项目列表信息
export function selectCustomer(customer_id) {
  return request({
    url: '/customer/info/' + praseStrEmpty(customer_id),
    method: 'get'
  })
}

// 新增客户基本信息
export function addCustomer(data) {
  return request({
    url: '/customer/info/addCustomer',
    method: 'post',
    data: data
  })
}
// 修改项目列表信息
export function updateCustomer(data) {
  return request({
    url: '/customer/info',
    method: 'put',
    data: data
  })
}
// 删除客户列表信息
export function deleteCustomer(customerids) {
  return request({
    url: '/customer/info/'+ customerids,
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
// 查询外包人员成本预估
export function selectOutsourcingCost(customerid) {
  return request({
    url: '/customer/info/selectOutsourcingCost/' + customerid,
    method: 'get'
  })
}
// 导出客户信息
export function exportCustomer(query) {
  return request({
    url: '/customer/info/exportCustomer',
    method: 'get',
    params: query
  })
}


