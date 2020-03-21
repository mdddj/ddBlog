import { queryAll, add,del } from '@/services/carousel';
import { message } from 'antd';


const CarouselModel = {
  namespace: 'carousel',
  state: {
    list: [],
    data: null
  },
  effects: {
    *fetchAll({ payload }, { call, put }) {
      const response = yield call(queryAll, payload);
      yield put({
        type: 'save',
        payload: {
          data: response.data
        }
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(add, payload);
      if (response && response.code === 200) {
        message.success("操作成功");

        if (payload.id) {
          yield put({
            type:'updateItem',
            payload:response.data
          })
        } else {
          yield put({
            type:'addItem',
            payload:response.data
          })
        }
      }
    },
    *del({payload},{call,put}) {
      const response = yield call(del, payload);
     if(response.code===200){
       message.success("删除成功")
     }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    updateItem(state, { payload }) {
      const {data,data:{content}} = state;
      const index = content.findIndex(item=>item.id ===payload.id)
      content.splice(index,1,payload);
      return {...state,data:{...data,content}}
    },
    addItem(state, { payload }) {
      const {data,data:{content}} = state;
      content.unshift(payload);
      return {...state,data:{...data,content}}
    }
  },
};
export default CarouselModel;