import request from '@/utils/request';

export async function fetchTrades(params) {
  return request('/api/trades', {
    params,
  });
}
