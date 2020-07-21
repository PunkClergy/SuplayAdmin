import { fetchOrders } from './service';

export default {
  namespace: 'orderList',

  state: {
    orderList: {},
  },

  effects: {
    *fetchOrders({ payload }, { call, put }) {
      const response = yield call(fetchOrders, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, orderList: payload };
    },
  },
};
