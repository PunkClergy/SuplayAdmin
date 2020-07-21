import request from '@/utils/request';

export async function fetchProducts(params) {
  return request('/api/products', {
    params,
  });
}

export async function updateProduct(params) {
  if (params.id) {
    return request(`/api/product/${params.id}`, {
      method: 'POST',
      data: {
        ...params,
      },
    });
  }
  return request('/api/product', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addProductStock(params) {
  return request(`/api/product/${params.id}/stock`, {
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

export async function quantityItem(params) {
  return request(`/api/product/${params.id}/quantity`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
