import request from '@/utils/request';
import urls from '@/utils/url';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}
export async function queryActivities() {
  return request('/api/activities');
}
export async function queryArticleList(params) {
  return request(`${urls.articleList}?page=${params.page}&limit=${params.limit}`);
}
export async function queryCurrent() {
  return request(urls.currentUser);
}
