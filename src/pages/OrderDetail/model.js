import { getOrder, updateOrder, splitOrder } from './service';

export default {
  namespace: 'orderDetail',

  state: {
    orderDetail: {},
  },

  effects: {
    *getOrder({ payload }, { call, put }) {
      const response = yield call(getOrder, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *updateOrder({ payload }, { call }) {
      yield call(updateOrder, payload);
    },
    *splitOrder({ payload }, { call }) {
      yield call(splitOrder, payload);
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, orderDetail: payload };
    },
  },
};
