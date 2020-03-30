import { message } from 'antd';
import { list, add, del, update } from './service';

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
        yield put({
          type: 'addItem',
          payload: response.data
        })
      } else {
        message.error(response.msg);
      }
    },
    *del({ payload }, { call, put }) {
      const response = yield call(del, payload);
      if (response.code === 200) {
        message.success(response.msg);
        yield put({
          type: 'removeItem',
          payload
        })
      } else {
        message.error(response.msg);
      }
    },
    *update({ payload }, { call, put }) {
      const response = yield call(update, payload);
      if (response.code === 200) {
        message.success(response.msg);
        yield put({
          type: 'updateItem',
          payload: response.data
        })
      } else {
        message.error(response.msg);
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    addItem(state, { payload }) {
      const { listData, listData: { content } } = state;
      content.unshift(payload);
      return { ...state, listData: { ...listData, content } };
    },
    removeItem(state, { payload }) {
      const { listData, listData: { content } } = state;
      const newContent = content.filter(item => item.id !== payload);
      return { ...state, listData: { ...listData, content: newContent } };
    },
    updateItem(state, { payload }) {
      const { listData, listData: { content } } = state;
      const curUpdateIndex = content.findIndex(item => item.id === payload.id); // 将要修改的item下标
      content.replice(curUpdateIndex, 1, payload);
      return { ...state, listData: { ...listData, content: content.splice(curUpdateIndex, 1, payload) } };
    }
  },
};
