import request from '@/utils/request';

export async function getLives() {
  return request(`/api/index/lives`, {
    method: 'GET',
  });
}
// 同步
export async function syncLives(params) {
  return request(`/api/index/lives/sync`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function postDesc(params) {
  return request(`/api/index/live/${params.id}/desc`, {
    method: 'POST',
    data: {
      description: params.description,
    },
  });
}
export async function postDisplay(params) {
  return request(`/api/index/live/${params.id}/display`, {
    method: 'POST',
    data: {
      display: params.display,
    },
  });
}
