import {
  getLuckyBag,
  updateLuckyBag,
  createSession,
  closeSession,
  recallSession,
  addProduct,
  removeBoxProduct,
  graphicBox,
  downloadHistory,
  fetchSessions,
} from './service';

export default {
  namespace: 'luckBagDetail',

  state: {
    luckBagDetail: {},
    sessionsData: {},
  },

  effects: {
    *getLuckyBag({ payload }, { call, put }) {
      const response = yield call(getLuckyBag, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    *fetchSessions({ payload }, { call, put }) {
      const response = yield call(fetchSessions, payload);
      yield put({
        type: 'hstory_show',
        payload: response,
      });
    },

    *updateLuckyBag({ payload }, { call }) {
      yield call(updateLuckyBag, payload);
    },

    *createSession({ payload }, { call }) {
      const response = yield call(createSession, payload);
      return response;
    },
    *closeSession({ payload }, { call }) {
      yield call(closeSession, payload);
    },
    *recallSession({ payload }, { call }) {
      yield call(recallSession, payload);
    },
    *addProduct({ payload }, { call }) {
      yield call(addProduct, payload);
    },
    *removeBoxProduct({ payload }, { call }) {
      yield call(removeBoxProduct, payload);
    },
    *graphicBox({ payload }, { call }) {
      yield call(graphicBox, payload);
    },
    // *fetchSessions(_, { call, put }) {
    //   const response = yield call(fetchSessions, {});
    //   yield put({
    //     type: 'hstory_show',
    //     payload: response,
    //   });
    // },
    *download({ payload, callback }, { call }) {
      const response = yield call(downloadHistory, payload);
      callback(response);
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, luckBagDetail: payload };
    },
    hstory_show(state, { payload }) {
      return { ...state, sessionsData: payload };
    },
  },
};
