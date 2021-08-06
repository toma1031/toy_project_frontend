import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

// userのslice.reducer を default export している前提
import userReducer from "./user";

// combineReducers - 各SliceのReducerを結合
const reducer = combineReducers({
  user: userReducer,
});

// configureStore - 結合したReducerを渡しStoreを作成
const store = configureStore({ reducer });

export default store;