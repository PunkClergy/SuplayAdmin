import request from '@/utils/request';

export async function fetchLogs(params) {
  return request('/api/requestLogs', {
    params,
  });
}
