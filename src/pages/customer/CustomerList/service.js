import request from '@/utils/request';

export async function fetchUsers(params) {
  return request('/api/users', {
    params,
  });
}
