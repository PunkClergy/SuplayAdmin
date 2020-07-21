import { changePassword, getUser } from './service';

export default {
  namespace: 'userDetail',

  state: {
    userDetail: {},
  },

  effects: {
    *getUser({ payload }, { call, put }) {
      const response = yield call(getUser, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *changePassword({ payload }, { call }) {
      yield call(changePassword, payload);
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, userDetail: payload };
    },
  },
};
