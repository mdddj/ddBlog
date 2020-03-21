import { addArticle, searchArticle, findById, delOne } from '@/services/article';
import { Modal, message } from 'antd';

const ArticleModel = {
    namespace: 'article',
    state: {
        article: null,
        searchData: null,
        updateItem: null
    },
    effects: {
        *add({ payload }, { call }) {
            const response = yield call(addArticle, payload);
            if (response.code !== 200) {
                Modal.error({
                    title: `发布失败(code:${response.code})`,
                    content: response.msg,
                });
            } else {
                Modal.success({
                    content: '发布成功',
                });
            }
        },
        *search({ payload }, { call, put }) {
            const response = yield call(searchArticle, payload);
            if (response.code !== 200) {
                Modal.error({
                    title: `搜索失败(code:${response.code})`,
                    content: response.msg,
                });
            } else {
                message.success("检索成功");
                yield put({
                    type: 'save',
                    payload: {
                        searchData: response.data
                    }
                })
            }

        },
        *findById({ payload }, { call, put }) {
            const response = yield call(findById, payload);
            if (response.code === 200) {
                return response.data;
            }
            return null;
        },
        *del({payload},{call,put}){
            const response = yield call(delOne, payload);
            console.log(response);
        }
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};
export default ArticleModel;