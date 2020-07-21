import { getBox } from './service';

export default {
  namespace: 'cabinetDetail',

  state: {
    cabinetDetail: {},
  },

  effects: {
    *getBox({ payload }, { call, put }) {
      const response = yield call(getBox, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, cabinetDetail: payload };
    },
  },
};
