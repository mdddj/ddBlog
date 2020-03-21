import {queryAllTags, addTags} from '@/services/tag';


const TempModel = {
    namespace: 'temp',
    state: {

    },
    effects: {
      *fetchAll(_, { call, put }) {
        const response = yield call(queryAllTags);
        yield put({
          type: 'save',
          payload: {
            tags:response.data
          }
        });
      },
    },
    reducers: {
      save(state, {payload}) {
        return { ...state, ...payload };
      },
    },
  };
  export default TempModel;