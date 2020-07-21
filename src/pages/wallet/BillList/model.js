import { downloadHistory } from './service';

export default {
  namespace: 'billDetail',

  state: {
    billDetail: {},
  },

  effects: {
    *download({ payload, callback }, { call }) {
      const response = yield call(downloadHistory, payload);
      callback(response);
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, billDetail: payload };
    },
  },
};
