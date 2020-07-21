import {
  fetchExhibitions,
  deleteExhibition,
  addexhibition,
  addLiveDetail,
  addDetailImage,
  updateExhibition,
  updateLiveDetail,
  updateTitle,
  updateArchive,
} from './service';

export default {
  namespace: 'exhibitionDetail',

  state: {
    exhibitionDetail: {},
  },

  effects: {
    *fetchExhibitions({ payload }, { call, put }) {
      const response = yield call(fetchExhibitions, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *updateExhibition({ payload }, { call }) {
      yield call(updateExhibition, payload);
    },
    *updateLiveDetail({ payload }, { call }) {
      yield call(updateLiveDetail, payload);
    },
    *updateTitle({ payload }, { call }) {
      yield call(updateTitle, payload);
    },
    *updateArchive({ payload }, { call }) {
      yield call(updateArchive, payload);
    },
    *addexhibition({ payload }, { call }) {
      yield call(addexhibition, payload);
    },
    *addLiveDetail({ payload }, { call }) {
      yield call(addLiveDetail, payload);
    },
    *addDetailImage({ payload }, { call }) {
      yield call(addDetailImage, payload);
    },
    *deleteExhibition({ payload }, { call }) {
      yield call(deleteExhibition, payload);
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, exhibitionDetail: payload };
    },
  },
};
