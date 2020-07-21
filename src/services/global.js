import request from '@/utils/request';

// 搜索产品
export async function fetchProducts(params) {
  return request('/api/products', { params });
}

// 搜索系列
export async function fetchSeries(params) {
  return request('/api/seriesList', {
    params,
  });
}

// 用户信息
export async function getUserInfo(params) {
  return request(`/api/user/${params.id}`);
}
// 搜索展会新品卡片系列
export async function fetchCards(params) {
  return request('/api/products/cardList', {
    params,
  });
}
// 搜索抽选系列
export async function fetchlotteries(params) {
  return request('/api/lotteries', {
    params,
  });
}
// 搜索福袋系列
export async function fetchLuckBags(params) {
  return request('/api/luckybags', {
    params,
  });
}
// 搜索直播系列
export async function fetchLives(params) {
  return request('/api/index/lives', {
    params,
  });
}
// UUID搜USERID
export async function fetchUsers(params) {
  return request('/api/users', {
    params,
  });
}
