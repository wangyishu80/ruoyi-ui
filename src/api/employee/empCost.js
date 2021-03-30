import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

export function listEmpCost(query) {
  return request({
    url: '/employee/cost/list',
    method: 'get',
    params: query
  })
}

export function listEmpCostHistory(empId) {
  return request({
    url: '/employee/cost/history/' + empId,
    method: 'get',
  })
}

export function addCost(data) {
  return request({
    url: '/employee/cost',
    method: 'post',
    data: data
  })
}

export function getCost(empId) {
  return request({
    url: '/employee/cost/' + empId,
    method: 'get'
  })
}

export function updateCost(data) {
  return request({
    url: '/employee/cost',
    method: 'put',
    data: data
  })
}

export function delCostHistory(costId) {
  return request({
    url: '/employee/cost/delHistory/'+ costId,
    method: 'delete'
  })
}

export function exportEmpCost(query) {
  return request({
    url: '/employee/cost/exportCost',
    method: 'get',
    params: query
  })
}

// 下载员工成本导入模板
export function importTemplate() {
  return request({
    url: '/employee/cost/importTemplate',
    method: 'get'
  })
}
