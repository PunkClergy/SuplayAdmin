import request from '@/utils/request';

export async function fetchBags(params) {
  return request('/api/luckybags', {
    params,
  });
}

export async function updateBag(params) {
  return request('/api/luckybag', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
