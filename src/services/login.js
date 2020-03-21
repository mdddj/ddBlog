import request from '@/utils/request';
import urls from '@/utils/url';


/**
 * 登录
 * @param {*} params 
 */
export async function fakeAccountLogin(params) {
  return request(urls.login, {
    method: 'POST',
    data: params,
  });
}

export async function logout() {
  return request(urls.logout);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
