import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { apiURL } from './Default';
import  { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Signup = () => {
    // HookのuseFormを使う
    const { register, handleSubmit, formState: { errors } } = useForm();
    const history = useHistory();
    const [cookies, setCookie, removeCookie] = useCookies();
    // 下記の書き方の参考文献
    // https://qiita.com/soarflat/items/1a9613e023200bbebcb3
    const signup = async (data) =>{
      //ログインしていたら、ログアウトする
      removeCookie('accesstoken', { path: '/' }, { httpOnly: true });
      removeCookie('refreshtoken', { path: '/' }, { httpOnly: true });
      //console.log("ログアウトしました");
        const res = await axios.post(`${apiURL}users/`,
          {
            email:data.email,
            username:data.name,
            password:data.password,
          },
        )
        .then(function(response){
          alert("ユーザー登録完了！ログインしてください");
          // 新規登録完了したらpush()を用いてログイン画面に遷移させる
          history.push('/login');
        })
        .catch(err => {
            alert("すでに登録されているメールアドレスorユーザー名です");
            console.log(err);
        });
      };
    return (
      <div>
      {/* handleSubmit について
      使い方は二通り
      <form onSubmit={handleSubmit}>
      onSubmitに使うか
      <form onSubmit={handleSubmit}></form>
      onClickに使うか */}
      {/* handleSubmit はバリデーションを実行する。
      バリデーションが成功した場合は、form内のデータを使ってthis.props.onSubmit(data)を実行する。 */}
      {/* 参考文献
      https://tamiblog.xyz/2020/03/14/post-405/ */}
      <form onSubmit={handleSubmit(signup)}>
      <label for="email">Email：</label>
      <input placeholder="メールアドレス" className='form-control'
      {...register('email',
      { required: true,pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} />
      {errors.email && <p>有効なメールアドレスを入力して下さい</p>}
      <label for="name">UserName：</label>
      <input placeholder="ユーザーネーム" className='form-control' {...register('name', { required: true })} />
      {errors.name && <p>ユーザー名を入力して下さい</p>}
      <label for="password">Password：</label>
      <input placeholder="パスワード 半角英数字6文字以上で入力してください" className='form-control'
      {...register('password', { required: true, minLength: 6 })} />
      {errors.password && <p>パスワードは半角英数字6文字以上で入力して下さい</p>}
      <input className='btn btn-secondary' type="submit" value="新規ユーザー登録" />
      </form>
      </div>
    )
};
export default Signup;