import { getUserDetail, updateMobile } from './service';

export default {
  namespace: 'userDetail',

  state: {
    userDetail: {},
  },

  effects: {
    *getUserDetail({ payload }, { call, put }) {
      const response = yield call(getUserDetail, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *updateMobile({ payload }, { call }) {
      yield call(updateMobile, payload);
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, userDetail: payload };
    },
  },
};
