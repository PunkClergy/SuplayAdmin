import request from '@/utils/request';

// 用户详情
export async function getUserDetail(params) {
  return request(`/api/user/${params.id}`, {
    method: 'GET',
  });
}

// 修改手机号
export async function updateMobile(params) {
  return request(`/api/user/${params.id}`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 盒柜列表
export async function getCabinets(params) {
  return request(`/api/cabinets`, {
    params,
  });
}

// 订单列表
export async function getOrders(params) {
  return request(`/api/orders`, {
    params,
  });
}

// 付款记录
export async function getPayments(params) {
  return request(`/api/payments`, {
    params,
  });
}

// 钱包记录
export async function getWalletLogs(params) {
  return request(`/api/walletLogs`, {
    params,
  });
}
// 代金券列表
export async function getCouponss(params) {
  return request(`/api/user/${params.userId}/coupons`, {
    params,
  });
}

export async function destroy(params) {
  return request(`/api/cabinet/${params.id}/destroy`, {
    method: 'POST',
  });
}
export async function refund(params) {
  return request(`/api/cabinet/${params.id}/refund`, {
    method: 'POST',
  });
}
