import { queryAllCategorys, addCategory, delCategoryById, getArticleCountByCategoryId, update } from '@/services/category';
import { message } from 'antd';


const CategoryModel = {
  namespace: 'category',
  state: {
    categorys: []
  },
  effects: {
    *fetchAll(_, { call, put }) {
      const response = yield call(queryAllCategorys);
      yield put({
        type: 'save',
        payload: { categorys: response.data },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(addCategory, payload);
      if (response.code === 200) {
        yield put({
          type: 'putNewCategory',
          payload: response.data
        })
        message.success("新增分类成功");
      } else {
        message.error(response.msg);
      }
    },
    *del({ payload }, { call, put }) {
      const response = yield call(delCategoryById, payload.id);
      if (response.code === 200) {
        yield put({
          type: 'delCategory',
          payload: { id: payload.id }
        })
        message.success("删除分类成功");
      } else {
        message.error("删除失败,请重试");
      }
    },
    *articleCount({ payload }, { call }) {
      const response = yield call(getArticleCountByCategoryId, { categoryId: payload.id });
      return response;
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(update, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateCategory',
          payload: response.data
        })
        if (callback && typeof callback === 'function') {
          callback();
        }
        message.success("修改分类成功");
      } else {
        message.error(response.msg);
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    putNewCategory(state, { payload }) {
      const { categorys } = state;
      categorys.unshift(payload);
      return { ...state, categorys }
    },
    delCategory(state, { payload }) {
      const { categorys } = state;
      const index = categorys.findIndex(item => item.id === payload.id);
      categorys.splice(index, 1);
      return { ...state, categorys }
    },
    updateCategory(state) {
      const { categorys } = state;
      return { ...state, categorys }
    }
  },
};
export default CategoryModel;