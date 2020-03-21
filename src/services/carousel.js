import request from '@/utils/request';
import urls from '@/utils/url';

/**
 * 查询所有轮播图列表
 */
export async function queryAll(params) {
    return request(urls.getCarouselList, {
        method: 'post',
        data: params
    });
}

/**
 * 添加获取修改轮播图信息
 */
export async function add(params) {
    return request(urls.addCarousel, {
        method: 'post',
        data: params
    });
}


export async function del(params) {
    return request(urls.delCarousel, {
        method: 'post',
        data: params
    });
}