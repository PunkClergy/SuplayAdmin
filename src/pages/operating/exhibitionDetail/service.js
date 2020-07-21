import request from '@/utils/request';
// 查询详情
export async function fetchExhibitions(params) {
  return request(`/api/exhibition/${params.id}`, {});
}
// 编辑保存
export async function updateExhibition(params) {
  console.log(params);
  return request(`/api/exhibition/${params.id}`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 添加商品
export async function addexhibition(params) {
  return request(`/api/exhibition/${params.id}/product`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 删除商品
export async function deleteExhibition(params) {
  return request(`/api/exhibition/${params.id}/product`, {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}
// 更新直播进程
export async function updateLiveDetail(params) {
  return request(`/api/exhibition/${params.id}/liveDetail`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 修改标题
export async function updateTitle(params) {
  return request(`/api/exhibition/${params.id}/title`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 归档
export async function updateArchive(params) {
  return request(`/api/exhibition/${params.id}/archive`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function addLiveDetail(params) {
  return request('/api/exhibition/liveDetail', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function addDetailImage(params) {
  return request(`/api/exhibition/${params.id}/partnerImage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
