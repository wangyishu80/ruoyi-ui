import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询项目收入预估
export function selectPerIncomeBudget(item_id) {
  return request({
    url: '/project/info/selectPerIncomeBudget/' + item_id,
    method: 'get'
  })
}
// 导出人员预估收入
export function exportBudgetIncomeData(item_id) {
  return request({
    url: '/project/info/exportBudgetIncomeData/'+item_id,
    method: 'get'
  })
}


