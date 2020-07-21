import request from '@/utils/request';

export async function fetchBanner(params) {
  return request('/api/banners', {
    params,
  });
}
export async function fetchBannerDetail(id) {
  return request(`api/banner/${id}`);
}

export async function updateBannerDetail(id, params) {
  if (id) {
    return request(`api/banner/${id}`, { method: 'POST', data: { ...params } });
  }
  return request(`api/banner`, { method: 'POST', data: { ...params } });
}
