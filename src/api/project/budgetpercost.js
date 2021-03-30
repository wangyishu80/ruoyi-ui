import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";


// 查询项目成本预估
export function selectPerCostBudget(item_id) {
  return request({
    url: '/project/info/selectPerCostBudget/' + item_id,
    method: 'get'
  })
}
// 导出人员预估成本信息
export function exportBudgetCostData(item_id) {
  return request({
    url: '/project/info/exportBudgetCostData/'+item_id,
    method: 'get'
  })
}


