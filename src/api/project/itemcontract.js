import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询合同信息列表
export function listDataContract(item_id) {
  return request({
    url: '/project/info/contractlist/'+ item_id,
    method: 'get'
  })
}

// 查询合同信息详细
export function getData(contract_id) {
  return request({
    url: '/customer/info/selectContract/' + praseStrEmpty(contract_id),
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
    url: '/project/info/addContract',
    method: 'post',
    data: data
  })
}

// 修改合同信息
export function updateData(data) {
  return request({
    url: '/customer/info/updatecontract',
    method: 'put',
    data: data
  })
}

// 删除项目合同数据
export function delData(contract_id) {
  return request({
    url: '/customer/info/delcontract/' + contract_id,
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
// 获取附件数据
export function getDocs(contract_id) {
  return request({
    url: '/project/info/doc/' + contract_id,
    method: 'get'
  })
}
//删除附件信息
export function deleteDocs(docIds) {
  return request({
    url: '/project/info/doc/' + docIds,
    method: 'delete'
  })
}
