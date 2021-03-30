import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

export function listEdu(empId) {
  return request({
    url: '/education/info/eduList/' + empId ,
    method: 'get'
  })
}

export function getEdu(eduId) {
  return request({
    url: '/education/info/' + eduId ,
    method: 'get'
  })
}

export function addEdu(data) {
  return request({
    url: '/education/info',
    method: 'post',
    data: data
  })
}

export function updateEdu(data) {
  return request({
    url: '/education/info',
    method: 'put',
    data: data
  })
}

export function delEdu(eduIds) {
  return request({
    url: '/education/info/' + eduIds,
    method: 'delete'
  })
}




