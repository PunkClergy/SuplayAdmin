import request from '@/utils/request';

export async function fetchSeries(params) {
  return request('/api/seriesList', {
    params,
  });
}

export async function editSeries(params) {
  if (params.id) {
    return request(`/api/series/${params.id}`, {
      method: 'POST',
      data: { ...params },
    });
  }
  return request(`/api/series`, {
    method: 'POST',
    data: { ...params },
  });
}

export async function fetchBrands(params) {
  return request('/api/brands', { params });
}

// 获取系列详情
export async function fetchSeriesDetail(id) {
  return request(`/api/series/${id}`);
}

// 获取产品列表
export async function fetchProducts(params) {
  return request('/api/products', { params });
}

// 系列添加产品
export async function addProductToSeries(params) {
  return request(`/api/series/product`, {
    method: 'POST',
    data: { ...params },
  });
}

// 系列移除产品
export async function removeProductFromSeries(id, params) {
  return request(`/api/series/product`, {
    method: 'DELETE',
    data: { ...params },
  });
}

// 创建产品
export async function createProduct(params) {
  return request('/api/product', {
    method: 'POST',
    data: { ...params },
  });
}

// 产品到货
export async function createArrive(params) {
  return request(`/api/series/${params.id}/arrive`, {
    method: 'POST',
  });
}
