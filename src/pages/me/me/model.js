import { update } from './service';
import { message } from 'antd';

export default {
  namespace: 'me',
  state: {
    text: 'loading...',
  },

  effects: {
    *update({payload}, { call, put }) {
      const response = yield call(update,payload);
      if(response.code===200){
        message.success(response.msg)
      }else{
        message.error(response.msg)
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
