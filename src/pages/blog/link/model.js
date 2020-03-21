import { list, add , del} from './service';
import { message } from 'antd';

export default {
  namespace: 'link',
  state: {
    data: null,
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'save',
        payload: {
          data: response.data
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(add, payload);
      if (response.code === 200) {
        yield put({
          type: 'addItem',
          payload: response.data
        })
        message.success(response.msg);
      } else {
        message.error(response.msg)
      }
    },
    *del({payload},{call,put}){
      const response = yield call(del,payload);
      if(response.code===200){
        yield put({
          type:'delOne',
          payload
        })
        message.success(response.msg);
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
      const { data, data: { rows } } = state;
      rows.unshift(payload);
      return { ...state, data: { ...data, rows } }
    },
    delOne(state,{payload}){
      const {data,data:{rows}}=state;
      const newArr = rows.filter(item=>item.id!==payload);
      return {...state,data:{...data,rows:newArr}}
    }
  },
};
