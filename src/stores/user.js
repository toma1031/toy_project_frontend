import { createSlice } from "@reduxjs/toolkit";

// Stateの初期状態
const initialState = {
  // ここで初期のStateをログイン状態Falseに設定
  // ログインしているログインしていないをたらしめているのは
  // falseやtureの部分。isLoggedInは組み込み関数ではないのでisLoggedInという文字自体には特に意味はない
  isLoggedIn: false,
  // reducers　つまりどのようにステートを変更するかのロジック部分でありますので、その前にInitial State に用意する変数（格納したいstate）を定義する必要があります。
  // userIDにはからの文字列をセットします。
  // stores/use.jsでは、Redux stateの初期化を行なっているにすぎません。
  // initialState 部分で「用意するstateの初期化」を行なっている。
  // createSlice内のreducers部分で、「stateを変更するロジック部分を定義」を行なっている。
  userID: '',
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
    // reducerはセット・クリアをペアで定義することが普通ですので、setUserIDやclearUserIDなどの名前にし、2種類定義する必要があります。（これがなければ、例えばuserがログアウトした際にstateが削除されず以前ログインしているuserのIDが消えずにずっと保持されることとなる）
    // このように記述することで、userIDに値（文字列）が格納できます。
    setUserID: (state, action) => {
      // まず、Rducerにおけるactionとは、アクション（何が起きたのか）とそれに付随する情報を持つオブジェクトです。また、action.payloadとは、“アクションの実行に必要な任意のデータ“です。この例では、セットしたいuserIDがaction.payloadとなります。
      // そして、そのactionとstateに応じて変更されたstateを返すのがreducerです。
      // 結果として、action.payloadの中にはdispatch(setUserID())を行なった際の引数が格納されますので、おっしゃるような「action.payloadが値（ID）を拾ってくるみたいなイメージ」で正しいと思います！
      return Object.assign({}, state, { userID: action.payload })
    },
    clearUserID: state => {
      return Object.assign({}, state, { userID: "" })
    },
  }
});

// Reducerをエクスポートする
export default slice.reducer;

// Action Creatorsをエクスポートする
export const { isLoggedInOn, isLoggedInOff, setUserID, clearUserID  } = slice.actions;