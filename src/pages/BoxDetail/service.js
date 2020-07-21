import request from '@/utils/request';

export async function getBox(params) {
  return request(`/api/blindbox/${params.id}`, {
    method: 'GET',
  });
}
export async function getHistory(params) {
  return request(`/api/blindbox/${params.id}/history`, {
    params,
  });
}
export async function getSessionDetail(params) {
  return request(`/api/blindbox/session/detail`, {
    params,
  });
}
export async function updateBox(params) {
  return request(`/api/blindbox/${params.id}`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function graphicBox(params) {
  return request(`/api/blindbox/${params.id}/detail`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function updateBoxProduct(params) {
  return request(`/api/blindbox/${params.id}/product`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function deleteBoxProduct(params) {
  return request(`/api/blindbox/${params.id}/product`, {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

export async function createSession(params) {
  return request(`/api/blindbox/${params.id}/session`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function closeSession(params) {
  return request(`/api/blindbox/session/${params.id}/display`, {
    method: 'POST',
    data: {
      ...params,
      id: null,
    },
  });
}

export async function recallSession(params) {
  return request(`/api/blindbox/session/${params.id}/recall`, {
    method: 'POST',
  });
}

export async function fetchBrands(params) {
  return request('/api/seriesList', { params });
}
export async function bindSeries(params) {
  return request(`/api/blindbox/${params.id}/bindSeries`, {
    method: 'POST',
    data: {
      ...params,
      id: null,
    },
  });
}
export async function goodsArrive(params) {
  return request(`/api/blindbox/${params.id}/arrive`, {
    method: 'POST',
  });
}

export async function downloadHistory(params) {
  return request(`/api/cabinets/export`, {
    method: 'GET',
    params,
  });
}
