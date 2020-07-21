import { getSummary, getPayDataChart } from './service';

export default {
  namespace: 'analysis',

  state: {
    data: {},
    summary: { ua: {}, order: {}, consumption: {}, registers: {}, pu: {} },
  },

  effects: {
    *getSummary(_, { call, put }) {
      const response = yield call(getSummary, {});
      yield put({
        type: 'showSummary',
        payload: response,
      });
    },
    *getPayDataChart({ payload }, { call, put }) {
      const response = yield call(getPayDataChart, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
  },
  reducers: {
    showSummary(state, { payload }) {
      return { ...state, summary: payload };
    },
    show(state, { payload }) {
      return { ...state, data: payload };
    },
  },
};
