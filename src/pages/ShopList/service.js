import request from '@/utils/request';

export async function fetchShops(params) {
  return request('/api/shops', {
    params,
  });
}

export async function updateShop(params) {
  return request('/api/shop', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function shopStatus(params) {
  return request(` /api/shop/${params.id}/status `, {
    method: 'POST',
    data: {
      status: params.status,
    },
  });
}
