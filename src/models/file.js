import {uploadFile} from '@/services/file';

const fileModel = {
    namespace: 'file',
    state: {
      data: [],
    },
    effects: {
      *upload({payload}, { call, put }) {
        const response = yield call(uploadFile,payload);
        console.log(response);
        yield put({
          type: 'save',
          payload:{data:response} ,
        });
      },
    },
    reducers: {
      save(state, {payload}) {
        return { ...state, ...payload };
      },
    },
  };
  export default fileModel;