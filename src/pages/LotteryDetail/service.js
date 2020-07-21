import request from '@/utils/request';

export async function getLottery(params) {
  return request(`/api/lottery/${params.id}/detail`, {
    method: 'GET',
  });
}

export async function getWinners(params) {
  return request(`/api/lottery/${params.id}/winners`, {
    params,
  });
}

export async function updateLottery(params) {
  return request(`/api/lottery/${params.id}`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function auditLottery(params) {
  return request(`/api/lottery/${params.id}/review`, {
    method: 'POST',
    data: {
      ...params,
      id: null,
    },
  });
}
export async function auditRedraw(params) {
  return request(`/api/lottery/${params.id}/redraw`, {
    method: 'POST',
    data: {},
  });
}

export async function offLottery(params) {
  return request(`/api/lottery/${params.id}/close`, {
    method: 'POST',
    data: {
      ...params,
      id: null,
    },
  });
}

export async function downloadHistory(params) {
  return request(`/api/export/orders`, {
    method: 'GET',
    params,
  });
}
export async function updateDetailLottery(params) {
  return request(`/api/lottery/${params.id}/detail`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function updateLotteryProduct(param) {
  const { id, params } = param;
  return request(`/api/lottery/${id}/product`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addLotteryProduct(params) {
  const { id, ...bodyData } = params;
  return request(`/api/lottery/${id}/product`, {
    method: 'POST',
    data: {
      ...bodyData,
    },
  });
}
export async function deleteBoxProduct(params) {
  return request(`/api/lottery/${params.id}/product`, {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}
// 取消中奖资格
export async function cancelPrize(params) {
  console.log(params);
  return request(`/api/lottery/${params.lotteryId}/disqualify`, {
    method: 'POST',
    data: {
      userId: params.fields,
    },
  });
}
