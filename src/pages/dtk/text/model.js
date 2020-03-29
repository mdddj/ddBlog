import { message } from 'antd';
import { list, add } from './service';

export default {
  namespace: 'text',
  state: {
    listData: null,
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: { listData: response.data },
        });
      } else {
        message.error(response.msg);
      }
    },
    *add({ payload }, { call, put }) {
      const response = yield call(add, payload);
      if (response.code === 200) {
        message.success(response.msg);
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
