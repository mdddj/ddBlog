import { message } from 'antd';
import { list, add, del } from './service';

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
    *del({payload},{call,put}){
      const response = yield call(del,payload);
      if(response.code===200){
        message.success(response.msg);
        yield put({
          type:'removeItem',
          payload
        })
      }else{
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
      const {listData, listData: { content } } = state;
      content.unshift(payload);
      return { ...state, listData: { ...listData, content } };
    },
    removeItem(state,{payload}){
      const {listData,listData:{content}} = state;
     const newContent = content.filter(item=>item.id!==payload);
     return {...state,listData:{...listData,content:newContent}};
    }
  },
};
