import { getOrder } from './service';

export default {
  namespace: 'switchDetail',

  state: {
    switchDetail: {},
  },

  effects: {
    *getOrder({ payload }, { call, put }) {
      const response = yield call(getOrder, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, switchDetail: payload };
    },
  },
};
