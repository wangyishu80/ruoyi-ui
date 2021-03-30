import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";


// 查询项目成本预估
export function selectPerIncome(item_id) {
  return request({
    url: '/project/info/selectPerIncome/' + item_id,
    method: 'get'
  })
}
// 导出人员成本信息
export function exportData(item_id) {
  return request({
    url: '/project/info/exportIncomeData/'+item_id,
    method: 'get'
  })
}


