import request from '@/utils/request';

export async function login(params) {
  return request('/api/authenticate', {
    method: 'POST',
    data: params,
  });
}
