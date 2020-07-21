import request from '@/utils/request';

export async function fetchOrders(params) {
  return request('/api/orders', {
    params,
  });
}
export async function postSyncErp(params) {
  return request(`/api/order/${params.id}/pushToERP`, {
    method: 'POST',
  });
}
export async function cancelOrder(params) {
  return request(`/api/order/closeShopOrder/${params.id}`, {
    method: 'POST',
    data: {
      reason: '取消订单',
    },
  });
}
export async function cancelCabinetOrder(params) {
  return request(`/api/order/cancelCabinetOrder/${params.id}`, {
    method: 'POST',
  });
}
