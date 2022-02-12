import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

// userのslice.reducer を default export している前提
import userReducer from "./user";

// import { applyMiddleware, createStore } from "redux"

// Import the necessary methods for saving and loading
// 結論だけでいえば、Reactでリロードを使えるようにするには
// １、まず
// npm install --save redux-localstorage-simple
// でイントール
// ２、stores/index.jsに
// import { save, load } from "redux-localstorage-simple"

// const store = configureStore(
//   { reducer,
//     preloadedState: load(),
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(save()), },
//   );
// で問題ないでしょうか？
// そうですね、手順としてはその通りです！！
import { save, load } from "redux-localstorage-simple"

// combineReducers - 各SliceのReducerを結合
const reducer = combineReducers({
  user: userReducer,
});

// configureStore - 結合したReducerを渡しStoreを作成
const store = configureStore(
  { reducer,
    // 下記は、コードの中身としては、storeを生成するタイミングで
    // （storeとは，ページの状態ではなく，Redux storeの状態を決めておくものです。
    // Storeはこちらがわかりやすい。https://qiita.com/jima-r20/items/4a5d0074e24add0df3fc）
    // preloadedStateでloadをセットする
    // （まず前提として，今回用いているredux-localstorage-simpleライブラリは，Redux store に格納しているstateを一時的にlocalstorageに格納し，状況に応じて（ページのリロード時など）stateを取り出すという処理を行います．
    // つまり，load()とは，localstorageから保存済みのstateを取り出すこと，save()とは，localstorageへstateを格納すること　と考えていただくとわかりやすいかと思います．）
    preloadedState: load(),
    // getDefaultMiddlewareで取得した上でsaveを結合する
    // （getDefaultMiddlewareとは，storeにmiddleware（追加の機能）を持たせるようなカスタマイズを設定することです．上記で記述したように，localstorageへstateを書き出すsave()をmiddlewareとしてstoreに追加するという意味です．）
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(save()), },
  );

export default store;