import request from '@/utils/request';

export async function getOrder(params) {
  return request(`/api/order/${params.id}`, {
    method: 'GET',
  });
}
export async function updateOrder(params) {
  return request(`/api/order/${params.id}`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function splitOrder(params) {
  return request(`/api/order/${params.id}/split`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
