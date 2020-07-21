import request from '@/utils/request';
// 详情
export async function getLuckyBag(params) {
  return request(`/api/luckybag/${params.id}`, {
    method: 'GET',
  });
}
// 购买记录
export async function getHistory(params) {
  return request(`/api/luckybag/${params.id}/history`, {
    params,
  });
}

// 保存编辑
export async function updateLuckyBag(params) {
  return request(`/api/luckybag/${params.id}`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 添加详情
export async function graphicLuckyBag(params) {
  return request(`/api/luckybag/${params.id}/detail`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 创建福袋场次
export async function createSession(params) {
  return request(`/api/luckybag/${params.id}/session`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 下架场次
export async function closeSession(params) {
  console.log(params);
  return request(`/api/luckybag/session/${params.id}/available`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 退回场次商品
export async function recallSession(params) {
  return request(`/api/luckybag/session/${params.id}/recall`, {
    method: 'POST',
  });
}
// 添加福袋场次 查询系列列表
export async function fetchSeries(params) {
  return request('/api/seriesList', { params });
}
// 查询产品
export async function fetchProducts(params) {
  return request('/api/products', {
    params,
  });
}
// 添加商品
export async function addProduct(params) {
  return request(`/api/luckybag/session/product`, {
    method: 'POST',
    data: { ...params },
  });
}
// 删除场次商品
export async function removeBoxProduct(params) {
  return request(`/api/luckybag/session/product`, {
    method: 'DELETE',
    data: { ...params },
  });
}
export async function graphicBox(params) {
  return request(`/api/luckybag/${params.id}/detail`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 添加福袋场次 查询系列列表
export async function fetchSessions(params) {
  return request(`/api/luckybag/${params.id}/sessions`, {
    params,
  });
}
// 福袋记录导出
export async function downloadHistory(params) {
  return request(`/api/cabinets/export`, {
    method: 'GET',
    params,
  });
}
