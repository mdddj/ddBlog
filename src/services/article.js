import request from '@/utils/request';
import urls from '@/utils/url';

export async function addArticle(params) {
  return request(urls.addArticle,{
    method:'POST',
    data:params
  });
}

export async function searchArticle(params) {
  return request(urls.searchArticle,{
    method:'POST',
    data:params
  });
}

export async function findById(params) {
  return request(urls.findArticle,{
    method:'POST',
    data:params
  });
}

export async function delOne(params) {
  return request(urls.delArticle,{
    method:'POST',
    data:params
  });
}