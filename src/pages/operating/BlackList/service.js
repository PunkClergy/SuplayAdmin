import request from '@/utils/request';

export async function fetchBlackLists(params) {
  return request('/api/blacklists', {
    params,
  });
}
export async function fetchUsers(params) {
  return request('/api/users', {
    params,
  });
}

export async function updateBox(params) {
  return request(`api/blacklist`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function deleteBoxProduct(params) {
  return request(`/api/blacklist`, {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}
