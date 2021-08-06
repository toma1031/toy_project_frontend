import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useForm } from "react-hook-form";
import  { useHistory } from 'react-router-dom';
import { apiURL } from './Default';

// useDispatchは更新用
import { useDispatch } from "react-redux";
// 使いたいactionCreatorをimport
import { isLoggedInOn } from "../stores/user";

const Login = (props) => {
// 質問１、下記はなんでしょうか？
// React Hook APIの一つ（1）
// history APIにアクセスして、push()による遷移やlocationからパス位置の取得が可能
const history = useHistory();
// dispatchを使用する際に、インスタンス化する必要があります。
const dispatch = useDispatch();
// クッキーを管理するReact Hook機能の一つ（2）
const [cookies, setCookie] = useCookies();
// React Hook Form の初期化（3）
const { register, handleSubmit, watch, errors } = useForm();
// JWTを取得する関数
const getJwt = async (data) =>{
// Formで入力したデータがdataに格納されていることを確認
    console.log(data)
// JWT取得のためのDRF側のURLを指定（apiURLはDefault.jsで指定している）
    await axios.post(`${apiURL}auth/jwt/create/`,
      {
// JWT取得のための認証情報をセット（tomato様の場合DRFの使用上、email⇨usernameだと思います）
        username:data.username,
        password:data.password,
      },
    )
  // 認証リクエストがうまくいった場合のレスポンス
    .then(function (response) {
// レスポンスデータの確認（おそらくaccess・refreshトークンが返ってくる）
      console.log(response.data.access)
// 脆弱性の問題のためhttpOnly:trueは必須
// アクセストークンをブラウザのCookieに'accesstoken'という名前で格納
      setCookie('accesstoken', response.data.access, { path: '/' }, { httpOnly: true });
// リフレッシュトークンをブラウザのCookieに'refreshtoken'という名前で格納
      setCookie('refreshtoken', response.data.refresh, { path: '/' }, { httpOnly: true });
      // dispatchしたい部分でactionCreatorを呼び出す
      dispatch(isLoggedInOn());
      history.push('/');

    })
// 認証リクエストが失敗した場合
    .catch(err => {
        console.log("miss");
        alert("EmailかPasswordが違います");
    });
  };


    return (
        <div className="top-wrapper">
          <div class="login">
            <h3>Login</h3>
          </div>
          <div class="login-block">
            <form onSubmit={handleSubmit(getJwt)}>
              <label for="username">Username：</label>
              <input className='form-control' {...register('username')} />
              <label for="password">PassWord：</label>
              <input className='form-control' type="password" {...register('password', { required: true })} />
              <input className='btn btn-secondary' type="submit" value="ログイン" />
            </form>
          </div>
        </div>
    );
  }

  export default Login;