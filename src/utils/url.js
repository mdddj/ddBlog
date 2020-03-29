const formatURL = link => `/api/antdPro${link}`;

/**
 * api 接口地址
 */
const urls = {
  login: formatURL('/login'),
  currentUser: formatURL('/currentUser'),
  logout: formatURL('/logout'),
  articleList: formatURL('/article/list'),
  categoryListAll: formatURL('/category/findAll'),
  tagListAll: formatURL('/tag/findAll'),
  tagList: formatURL('/tag/list'),
  addArticle: formatURL('/article/add'),
  searchArticle: formatURL('/search'),
  findArticle: formatURL('/article/find'),
  delArticle: formatURL('/article/del'),
  tagAdd: formatURL('/tag/add'),
  tagUpdate: formatURL('/tag/update'),
  tagDel: formatURL('/tag/'),
  upload: formatURL('/uploadFile'),
  addCategory: formatURL('/category/add'),
  updateCategory: formatURL('/category/update'),
  delCategory: formatURL('/category/del/'),
  getArticleCountByCategoryId: formatURL('/category/get/article/count'),
  getCarouselList: formatURL('/carousel/list'),
  addCarousel: formatURL('/carousel/add'),
  delCarousel: formatURL('/carousel/del'),
  linkList: formatURL('/link/list'),
  link: formatURL('/link'),
  me: formatURL('/me'),
  text: formatURL('/text'),
};

export default urls;
