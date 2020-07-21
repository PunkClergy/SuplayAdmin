import { fetchProduct, updateBox, goodsArrive } from './service';

export default {
  namespace: 'productDetail',

  state: {
    productDetail: {},
  },

  effects: {
    *fetchProduct({ payload }, { call, put }) {
      const response = yield call(fetchProduct, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *goodsArrival({ payload }, { call }) {
      yield call(goodsArrive, payload);
    },
    *updateBox({ payload }, { call }) {
      yield call(updateBox, payload);
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, productDetail: payload };
    },
  },
};
