import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listemployee(query) {
  return request({
    url: '/employee/info/list',
    method: 'get',
    params: query
  })
}

export function addEmployee(data) {
  return request({
    url: '/employee/info',
    method: 'post',
    data: data
  })
}

export function getEmp(empId) {
  return request({
    url: '/employee/info/' + empId,
    method: 'get'
  })
}

// 修改员工信息
export function updateEmp(data) {
  return request({
    url: '/employee/info',
    method: 'put',
    data: data
  })
}

// 删除员工信息
export function delEmp(empId) {
  return request({
    url: '/employee/info/del/'+empId,
    method: 'get'
  })
}

// 查询闲置员工列表
export function listIdleEmp(query) {
  return request({
    url: '/employee/info/idle',
    method: 'get',
    params: query
  })
}

// 查询闲置员工列表
export function listIdleEmpHistory(query) {
  return request({
    url: '/employee/info/idleHistory',
    method: 'get',
    params: query
  })
}

// 员工闲置统计
export function empIdleStatistic(empId) {
  return request({
    url: '/employee/info/idleStatistic/' + empId,
    method: 'get'
  })
}

// 删除员工闲置条目
export function delEmpIdleData(idleId) {
  return request({
    url: '/employee/info/idleStatistic/' + idleId,
    method: 'delete'
  })
}



// 导出闲置员工
export function exportIdleEmp(query) {
  return request({
    url: '/employee/info/exportIdle',
    method: 'get',
    params: query
  })
}

// 导出员工信息
export function exportEmpInfo(query) {
  return request({
    url: '/employee/info/export',
    method: 'get',
    params: query
  })
}

// 导出选中员工信息
export function exportEmpInfoId(empId) {
  return request({
    url: '/employee/info/exportId/'+empId,
    method: 'get'
  })
}

// 下载员工信息导入模板
export function importTemplate(templateUrl) {
  return request({
    //url: '/employee/info/importTemplate',
    url: templateUrl,
    method: 'get'
  })
}

export function idleEmpPro(empId){
  return request({
    url:'/employee/info/idleEmpPro/'+empId,
    method:'get'
  })
}


export function timeFormat(row){
  if(row.updateTime){
    var date = new Date(row.updateTime);
    var year = date.getFullYear();
    var month =(date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    var h = date.getHours().toString();
    var m = date.getMinutes().toString();
    var s = date.getSeconds().toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    if (day.length == 1) {
      day = "0" + day;
    }
    if (h.length == 1) {
      h = "0" + h;
    }
    if (m.length == 1) {
      m = "0" + m;
    }
    if (s.length == 1) {
      s = "0" + s;
    }
    var dateTime = year + "-" + month + "-" + day + " "+ h + ":" + m +":"+ s;
    return dateTime.trim();
  }else{
    return '';
  }


}
