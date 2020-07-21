import request from '@/utils/request';

export async function fetchLotteries(params) {
  return request('/api/lotteries', {
    params,
  });
}
export async function updateLottery(params) {
  return request('/api/lottery', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
