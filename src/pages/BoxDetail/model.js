import {
  getBox,
  bindSeries,
  updateBox,
  updateBoxProduct,
  deleteBoxProduct,
  createSession,
  closeSession,
  recallSession,
  goodsArrive,
  graphicBox,
  downloadHistory,
} from './service';

export default {
  namespace: 'boxDetail',

  state: {
    boxDetail: {},
  },

  effects: {
    *getBox({ payload }, { call, put }) {
      const response = yield call(getBox, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *updateBox({ payload }, { call }) {
      yield call(updateBox, payload);
    },
    *graphicBox({ payload }, { call }) {
      yield call(graphicBox, payload);
    },
    *updateBoxProduct({ payload }, { call }) {
      yield call(updateBoxProduct, payload);
    },
    *bindSeries({ payload }, { call }) {
      yield call(bindSeries, payload);
    },
    *deleteBoxProduct({ payload }, { call }) {
      yield call(deleteBoxProduct, payload);
    },
    *createSession({ payload }, { call }) {
      yield call(createSession, payload);
    },
    *closeSession({ payload }, { call }) {
      yield call(closeSession, payload);
    },
    *recallSession({ payload }, { call }) {
      yield call(recallSession, payload);
    },
    *goodsArrival({ payload }, { call }) {
      yield call(goodsArrive, payload);
    },
    *download({ payload, callback }, { call }) {
      const response = yield call(downloadHistory, payload);
      callback(response);
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, boxDetail: payload };
    },
  },
};
