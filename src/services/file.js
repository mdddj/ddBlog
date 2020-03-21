import request from '@/utils/request';
import urls from '@/utils/url';

export async function uploadFile(files) {
  return request(urls.upload,{
      data:files
  });
}