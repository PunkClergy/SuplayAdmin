import request from '@/utils/request';

export async function fetchProduct(params) {
  return request(`/api/product/${params.id}`, {
    method: 'GET',
  });
}
export async function updateBox(params) {
  return request(`/api/product/${params.id}`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function fetchSeries(params) {
  return request('/api/seriesList', {
    params,
  });
}

export async function fetchBrands(params) {
  return request('/api/brands', { params });
}

// 订单列表
export async function getOrders(params) {
  return request(`/api/product/${params.Id}/orders`, {
    params,
  });
}

export async function goodsArrive(params) {
  return request(`/api/product/${params.id}/arrive`, {
    method: 'POST',
  });
}
