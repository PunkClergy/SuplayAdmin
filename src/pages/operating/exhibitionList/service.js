import request from '@/utils/request';

export async function fetchExhibitionLists(params) {
  return request('/api/exhibitions', {
    params,
  });
}

export async function createExhibition(params) {
  return request(`api/exhibition`, {
    method: 'POST',
    data: { ...params },
  });
}
