import {
  getShop,
  updateShop,
  updateShopProduct,
  updateShopNum,
  deleteShopProduct,
  graphicShop,
  downloadHistory,
  fetchOrders,
} from './service';

export default {
  namespace: 'shopDetail',

  state: {
    shopDetail: {},
    orderList: {},
  },

  effects: {
    *getShop({ payload }, { call, put }) {
      const response = yield call(getShop, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *fetchOrders({ payload }, { call, put }) {
      const response = yield call(fetchOrders, payload);
      yield put({
        type: 'hstory_show',
        payload: response,
      });
    },
    *updateShop({ payload }, { call }) {
      yield call(updateShop, payload);
    },
    *graphicShop({ payload }, { call }) {
      yield call(graphicShop, payload);
    },
    *updateShopProduct({ payload }, { call }) {
      yield call(updateShopProduct, payload);
    },
    *updateShopNum({ payload }, { call }) {
      yield call(updateShopNum, payload);
    },
    *deleteShopProduct({ payload }, { call }) {
      yield call(deleteShopProduct, payload);
    },
    *download({ payload, callback }, { call }) {
      const response = yield call(downloadHistory, payload);
      callback(response);
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, shopDetail: payload };
    },
    hstory_show(state, { payload }) {
      return { ...state, orderList: payload };
    },
  },
};
