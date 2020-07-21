import request from '@/utils/request';

export async function fetchSwitches(params) {
  return request('/api/switches', {
    params,
  });
}
