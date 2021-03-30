import request from '@/utils/request'

export function getDocs(empId) {
  return request({
    url: '/employee/info/doc/' + empId,
    method: 'get'
  })
}

export function deleteDocs(docIds) {
  return request({
    url: '/employee/info/doc/' + docIds,
    method: 'delete'
  })
}

export async function submitUploadDoc(data){
  return request({
    url : '/employee/info/upload',
    method : 'post',
    data : data,
    headers : { "Content-Type" : "multipart/form-data" /*, "Authorization" : "Bearer " + getToken()*/ }
  });
}
