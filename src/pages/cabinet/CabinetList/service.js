import request from '@/utils/request';

export async function fetchCabinets(params) {
  return request('/api/cabinets', {
    params,
  });
}
export async function fetchSeries(params) {
  return request('/api/seriesList', {
    params,
  });
}
export async function destroy(params) {
  return request(`/api/cabinet/${params.id}/destroy`, {
    method: 'POST',
  });
}
export async function refund(params) {
  return request(`/api/cabinet/${params.id}/refund`, {
    method: 'POST',
  });
}
export async function modifyPredict(params) {
  console.log(params);
  return request(`/api/cabinets/modifyPredict`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
