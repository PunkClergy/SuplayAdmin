import request from '@/utils/request';

export async function fetchPayment(params) {
  return request('/api/payment/list', {
    params,
  });
}
export async function downloadHistory(params) {
  return request(`/api/payment/download`, {
    method: 'GET',
    params,
  });
}
