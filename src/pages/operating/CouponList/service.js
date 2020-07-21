import request from '@/utils/request';

export async function fetchCoupon(params) {
  return request('/api/coupons', {
    params,
  });
}
export async function fetchCouponDetail(id) {
  return request(`api/coupon/${id}`);
}

export async function updateCouponDetail(id, params) {
  if (id) {
    return request(`api/coupon/${id}`, { method: 'POST', data: { ...params } });
  }
  return request(`api/coupon`, { method: 'POST', data: { ...params } });
}
export async function sendCoupon(params) {
  return request(`/api/send/coupon`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function fetchUsers(params) {
  return request('/api/users', {
    params,
  });
}
