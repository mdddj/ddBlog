import request from '@/utils/request';
import urls from '@/utils/url';

export function update(params) {
  return request(urls.me, {
    method: 'put',
    data: params
  });
}
