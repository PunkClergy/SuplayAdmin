import request from '@/utils/request';

export async function getTerms() {
  return request(`/api/index/terms`, {
    method: 'GET',
  });
}
export async function updateTerms(params) {
  return request(`/api/index/terms`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
