import request from '@/utils/request';
import urls from '@/utils/url';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request(urls.currentUser);
}
export async function queryNotices() {
  return request('/api/notices');
}
