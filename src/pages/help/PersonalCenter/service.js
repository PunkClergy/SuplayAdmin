import request from '@/utils/request';

export async function changePassword(params) {
  return request(`/api/changePassword`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function getUser() {
  return request(`/api/currentUser`, {
    method: 'GET',
  });
}
