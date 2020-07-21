import request from '@/utils/request';

export async function getOrder(params) {
  return request(`/api/switch/${params.id}`, {
    method: 'GET',
  });
}
