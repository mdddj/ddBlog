import { stringify } from 'querystring';
import { router } from 'umi';
import { fakeAccountLogin, logout } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

import { Modal, message } from 'antd';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.code === 200) {
        message.success('登入成功');
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        router.replace(redirect || '/');
      } else {
        Modal.error({
          title: `错误码:${response.code}`,
          content: response.msg
        });
      }
    },

    *logout( _, { call}) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        const response = yield call(logout);
        if (response.code === 200) {

          router.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          });

        }
      }

    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log(payload.currentAuthority)
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
