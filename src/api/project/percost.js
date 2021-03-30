import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";


// 查询项目成本
export function selectPerCost(item_id) {
  return request({
    url: '/project/info/selectPerCost/' + item_id,
    method: 'get'
  })
}
// 导出人员成本信息
export function exportData(item_id) {
  return request({
    url: '/project/info/exportData/'+item_id,
    method: 'get'
  })
}


