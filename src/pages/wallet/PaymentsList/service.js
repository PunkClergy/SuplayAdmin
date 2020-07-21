import request from '@/utils/request';

export async function fetchPayment(params) {
  return request('/api/payments', {
    params,
  });
}
export async function addPaymentRefund(params) {
  return request(`/api/payment/${params.id}/refund`, {
    method: 'POST',
    data: {
      ...params,
      id: null,
    },
  });
}
