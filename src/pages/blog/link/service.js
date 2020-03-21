import request from '@/utils/request';
import urls from '@/utils/url';

export function list(params) {
  return request(`${urls.linkList}?page=${params.page}&limit=${params.limit}&name=${params.name}`);
}

export function add(params){
  return request(urls.link,{
    method:'post',
    data:params
  })
}

export function del(id){
  return request(`${urls.link}/${id}`,{
    method:'delete'
  })
}
