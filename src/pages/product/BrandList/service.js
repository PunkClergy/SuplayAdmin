import request from '@/utils/request';

export async function fetchBrands(params) {
  return request('/api/brands', {
    params,
  });
}
export async function fetchBrandDetail(id) {
  return request(`api/brand/${id}`);
}
export async function updateBrand(id, params) {
  if (id) {
    return request(`api/brand/${id}`, { method: 'POST', data: { ...params } });
  }
  return request(`api/brand`, { method: 'POST', data: { ...params } });
}
