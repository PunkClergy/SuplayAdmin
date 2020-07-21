import request from '@/utils/request';

export async function getShop(params) {
  return request(`/api/shop/${params.id}`, {
    method: 'GET',
  });
}
export async function updateShop(params) {
  return request(`/api/shop/${params.id}`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function graphicShop(params) {
  const { id, detail } = params;
  return request(`/api/shop/${id}/detail`, {
    method: 'POST',
    data: {
      detail,
    },
  });
}
export async function updateShopProduct(params) {
  const { id, ...bodyData } = params;
  return request(`/api/shop/${id}/product`, {
    method: 'POST',
    data: {
      ...bodyData,
    },
  });
}
export async function updateShopNum(params) {
  const { id, ...bodyData } = params;
  return request(`/api/shop/${id}/quantity`, {
    method: 'POST',
    data: {
      ...bodyData,
    },
  });
}

export async function deleteShopProduct(params) {
  const { id, productId } = params;
  return request(`/api/shop/${id}/product`, {
    method: 'DELETE',
    data: {
      productId,
    },
  });
}
export async function downloadHistory(params) {
  return request(`/api/export/orders`, {
    method: 'GET',
    params,
  });
}
export async function fetchOrders(params) {
  return request('/api/orders', {
    params,
  });
}
