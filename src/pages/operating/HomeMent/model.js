import { getTerms, updateTerms } from './service';

export default {
  namespace: 'homeMent',

  state: {
    homeMent: {},
  },

  effects: {
    *getTerms({ payload }, { call, put }) {
      const response = yield call(getTerms, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *updateTerms({ payload }, { call }) {
      yield call(updateTerms, payload);
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, homeMent: payload };
    },
  },
};
