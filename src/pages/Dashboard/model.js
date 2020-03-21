import { queryArticleList, queryCurrent } from './service';

const Model = {
  namespace: 'dashboard',
  state: {
    currentUser: undefined,
    articles: [],
  },
  effects: {
    *init({payload}, { put }) {
      yield put({
        type: 'fetchUserCurrent',
      });
      yield put({
        type:'fetchArticles',
        payload
      })
    },

    *fetchUserCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'save',
        payload: {
          currentUser: response.data,
        },
      });
    },

    *fetchArticles({payload}, { call, put }) {
      const { data:{rows} } = yield call(queryArticleList,payload);
      yield put({
        type: 'save',
        payload: {
          articles:rows
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },

    clear() {
      return {
        currentUser: undefined,
        articles: [],
      };
    },
  },
};
export default Model;
