import { queryAllTags, addTags, list, update, del } from '@/services/tag';
import { message } from 'antd'

const TagModel = {
  namespace: 'tag',
  state: {
    tags: [],
    data: null
  },
  effects: {
    *fetchAll(_, { call, put }) {
      const response = yield call(queryAllTags);
      yield put({
        type: 'save',
        payload: {
          tags: response.data
        }
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(addTags, payload);
      yield put({
        type: 'pushNewTag',
        payload: response.data
      })
      return response;
    },
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            data: response.data
          }
        });
        
      }
    },
    *update({ payload }, { call, put }) {
      const response = yield call(update, payload);
      if (response.code === 200) {
        yield put({
          type: 'update',
          payload:response.data
        });
      }
      message.success('修改成功');
    },
    *del({payload},{call,put}) {
      const response = yield call(del,payload);
      if(response.code===200){
        message.success(response.msg);
        yield put({
          type:'delOne',
          payload
        })
      }else{
        message.error(response.msg);
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    pushNewTag(state, { payload }) {
      const { tags } = state;
      return { ...state, tags: tags.concat(payload) }
    },
    update(state,{payload}){
      const {data,data:{records}}=state;
      const index = records.findIndex(item => item.id ===payload.id);
      records.splice(index,1,payload);
      return {...state,data:{...data,records}}
    },
    delOne(state,{payload}){
      const {data,data:{records}}=state;
      const newArr = records.filter(item=>item.id!==payload);
      return {...state,data:{...data,records:newArr}}
    }
  },
};
export default TagModel;