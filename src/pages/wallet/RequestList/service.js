import request from '@/utils/request';

export async function fetchRequests(params) {
  return request('/api/withdraw/requests', {
    params,
  });
}

export async function updateRequests(params) {
  return request(`/api/withdraw/${params.id}/audit`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function fetchUsers(params) {
  return request('/api/users', {
    params,
  });
}
// 此接口为临时替代接口
export async function createWithdrawRequest(params) {
  return request(`/api/withdraw`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
