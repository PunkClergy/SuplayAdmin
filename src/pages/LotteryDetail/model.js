import {
  getLottery,
  updateLottery,
  auditLottery,
  offLottery,
  downloadHistory,
  updateDetailLottery,
  updateLotteryProduct,
  addLotteryProduct,
  auditRedraw,
  getWinners,
  cancelPrize,
  deleteBoxProduct,
} from './service';

export default {
  namespace: 'lotteryDetail',
  state: {
    lotteryDetail: {},
    winnerList: {},
  },

  effects: {
    *getLottery({ payload }, { call, put }) {
      const response = yield call(getLottery, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *getWinners({ payload }, { call, put }) {
      const response = yield call(getWinners, payload);
      yield put({
        type: 'winnerShow',
        payload: response,
      });
    },
    *updateLottery({ payload }, { call }) {
      yield call(updateLottery, payload);
    },
    *cancelPrize({ payload }, { call }) {
      yield call(cancelPrize, payload);
    },
    *updateLotteryProduct({ payload }, { call }) {
      yield call(updateLotteryProduct, payload);
    },
    *addLotteryProduct({ payload }, { call }) {
      yield call(addLotteryProduct, payload);
    },
    *updateDetailLottery({ payload }, { call }) {
      yield call(updateDetailLottery, payload);
    },
    *auditLottery({ payload }, { call }) {
      yield call(auditLottery, payload);
    },
    *auditRedraw({ payload }, { call }) {
      yield call(auditRedraw, payload);
    },
    *offLottery({ payload }, { call }) {
      yield call(offLottery, payload);
    },
    *download({ payload, callback }, { call }) {
      const response = yield call(downloadHistory, payload);
      callback(response);
    },
    *deleteBoxProduct({ payload }, { call }) {
      yield call(deleteBoxProduct, payload);
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, lotteryDetail: payload };
    },
    winnerShow(state, { payload }) {
      return { ...state, winnerList: payload };
    },
  },
};
