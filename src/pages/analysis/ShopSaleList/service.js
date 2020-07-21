import request from '@/utils/request';

export async function fetchSales(params) {
  return request('/api/stats/shop/sales', {
    params,
  });
}
