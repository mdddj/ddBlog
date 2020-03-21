import request from '@/utils/request';
import urls from '@/utils/url';

/**
 * 查询全部分类
 */
export async function queryAllCategorys() {
  return request(urls.categoryListAll);
}

/**
 * 添加新分类
 * {
 *    id:忽略
 *    name:String(名称)
 *    intro:String(介绍)
 *    icon:String(图标Url)
 * }
 * @param {Object} params 
 */
export async function addCategory(params) {
  return request(urls.addCategory,{
    method:'post',
    data:params
  });
}

/**
 * 根据id删除分类
 * {
 *    id:Long (分类主键id)
 * }
 * @param {Object} params 
 */
export async function delCategoryById(id) {
  return request(`${urls.delCategory}${id}`,{
    method:'delete'
  });
}

export async function getArticleCountByCategoryId(params){
  return request(urls.getArticleCountByCategoryId,{
    method:'post',
    data:params
  })
}

export async function update(params){
  return request(urls.updateCategory,{
    method:'put',
    data:params
  })
}