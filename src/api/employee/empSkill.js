import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

export function listSkill(empId) {
  return request({
    url: 'empSkill/info/list/' + empId ,
    method: 'get'
  })
}

export function getSkill(skillId) {
  return request({
    url: '/empSkill/info/' + skillId ,
    method: 'get'
  })
}

export function addSkill(data) {
  return request({
    url: '/empSkill/info',
    method: 'post',
    data: data
  })
}

export function updateSkill(data) {
  return request({
    url: '/empSkill/info',
    method: 'put',
    data: data
  })
}

export function delSkill(skillIds) {
  return request({
    url: '/empSkill/info/' + skillIds,
    method: 'delete'
  })
}


