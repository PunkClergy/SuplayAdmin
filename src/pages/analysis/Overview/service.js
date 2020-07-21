import request from '@/utils/request';

export async function getPayDataChart(params) {
  return request(`/api/stats/payment/metrics`, {
    method: 'GET',
    params,
  });
}
export async function getSummary() {
  return request(`/api/stats/summary`, {
    method: 'GET',
  });
}
