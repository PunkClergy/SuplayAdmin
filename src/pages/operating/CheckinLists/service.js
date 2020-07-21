import request from '@/utils/request';

export async function getCheckin() {
  return request(`/api/checkins`, {
    method: 'GET',
  });
}
// 编辑保存
export async function updateCheckin(params) {
  return request(`/api/checkin`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
