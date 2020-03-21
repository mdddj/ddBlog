import request from '@/utils/request';
import urls from '@/utils/url';

export async function queryAllTags() {
  return request(urls.tagListAll);
}

export async function addTags(params) {
  return request(urls.tagAdd, {
    method: 'post',
    data:params
  });
}
export async function list(params) {
  return request(urls.tagList, {
    method: 'post',
    data:params
  });
}
export async function update(params) {
  return request(urls.tagUpdate, {
    method: 'put',
    data:params
  });
}

export async function del(id) {
  return request(`${urls.tagDel}${id}`,{
    method:'delete'
  });
}