import request from '@/utils/request';

export async function getBox(params) {
  return request(`/api/cabinet/${params.id}/trace`, {
    method: 'GET',
  });
}
