import request from '@/utils/request';

export async function getAdmins() {
  return request(`/api/admins`, {
    method: 'GET',
  });
}

export async function changePassword(params) {
  return request(`/api/changePassword`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function deleteUser(params) {
  return request(`/api/admin/${params.id}`, {
    method: 'DELETE',
  });
}
