import { configureStore, createSlice } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { categoryApi, gradeApi, stampApi, unitApi, userApi, videoApi, wordApi } from "../features/api/api-slice";

const videoSlice = createSlice({
  name: "videos",
  initialState: {},
  reducers: {
    setVideoNormalCount: (state, action) => {
      const { videoId, count, stamps } = action.payload;
      state[videoId] = {
        ...state[videoId],
        normalCount: count,
        normalStamps: stamps,
      };
    },
    setVideoGoodCount: (state, action) => {
      const { videoId, count, stamps } = action.payload;
      state[videoId] = {
        ...state[videoId],
        goodCount: count,
        goodStamps: stamps,
      };
    },
    setVideoBestCount: (state, action) => {
      const { videoId, count, stamps } = action.payload;
      state[videoId] = {
        ...state[videoId],
        bestCount: count,
        bestStamps: stamps,
      };
    },
    setVideoQuestion: (state, action) => {
      const { videoId, question } = action.payload;
      state[videoId] = {
        ...state[videoId],
        question: question,
      };
    },
  },
});

export const store = configureStore({
  reducer: {
    [videoApi.reducerPath]: videoApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [gradeApi.reducerPath]: gradeApi.reducer,
    [unitApi.reducerPath]: unitApi.reducer,
    [wordApi.reducerPath]: wordApi.reducer,
    [stampApi.reducerPath]: stampApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    videos: videoSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware().concat(
    //   videoApi.middleware,
    //   categoryApi.middleware,
    //   gradeApi.middleware,
    //   unitApi.middleware
    // ),
    getDefaultMiddleware()
      .concat(videoApi.middleware)
      .concat(categoryApi.middleware)
      .concat(unitApi.middleware)
      .concat(gradeApi.middleware)
      .concat(wordApi.middleware)
      .concat(stampApi.middleware)
      .concat(userApi.middleware),
});

export const {
  setVideoNormalCount,
  setVideoGoodCount,
  setVideoBestCount,
  setVideoQuestion,
} = videoSlice.actions;

setupListeners(store.dispatch);
