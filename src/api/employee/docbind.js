/**
 * Created by lenovo on 2020/8/11.
 */
import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 附件挂接批次
export function listBatch(query) {
  return request({
    url: '/employee/batch/batchList',
    method: 'get',
    params: query
  })
}

// 附件挂接选择包，查询挂接结果。
export function listZip() {
  return request({
    url: '/employee/batch/zipList',
    method: 'get'
  })
}

// 附件挂接选择包
export function bindZipList() {
  return request({
    url: '/employee/batch/bindZipList',
    method: 'get'
  })
}
