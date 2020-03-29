import request from '@/utils/request';
import urls from '@/utils/url';

export function list(params) {
  return request(`${urls.text}/list?page=${params.page}&limit=${params.limit}`);
}

export function add(params) {
  return request(urls.text, {
    method: 'post',
    data: params,
  });
}