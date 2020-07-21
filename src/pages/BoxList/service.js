import request from '@/utils/request';

export async function fetchBoxes(params) {
  return request('/api/blindboxes', {
    params,
  });
}

export async function updateBox(params) {
  return request('/api/blindbox', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function blindboxStatus(params) {
  return request(` /api/blindbox/${params.id}/status `, {
    method: 'POST',
    data: {
      status: params.status,
    },
  });
}
export async function fetchSeries(params) {
  return request('/api/seriesList', {
    params,
  });
}
