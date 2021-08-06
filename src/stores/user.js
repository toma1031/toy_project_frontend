import { createSlice } from "@reduxjs/toolkit";

// Stateの初期状態
const initialState = {
  // ここで初期のStateをログイン状態Falseに設定
  // ログインしているログインしていないをたらしめているのは
  // falseやtureの部分。isLoggedInは組み込み関数ではないのでisLoggedInという文字自体には特に意味はない
  isLoggedIn: false,
};

// Sliceを生成する
const slice = createSlice({
  // Sliceの名称
  name: "user",
  // Stateの初期値
  initialState,
  // どのようにステートを変更するかのロジック部分はreducers内で定義
  reducers: {
    // 下記（reducers内）でisLoggedInを変更するActionCreatorを定義
    isLoggedInOn: (state, action) => {
      return {
        // 従来のstateとisLoggedInをtrueにしたstateを返す
        ...state,
        isLoggedIn: true,
      };
    },
    isLoggedInOff: (state, action) => {
      return {
        // 従来のstateとisLoggedInをfalseにしたstateを返す
        ...state,
        isLoggedIn: false,
      };
    },
  }
});

// Reducerをエクスポートする
export default slice.reducer;

// Action Creatorsをエクスポートする
export const { isLoggedInOn, isLoggedInOff } = slice.actions;