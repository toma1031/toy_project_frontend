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
          alert("Signup is completed! Please login.");
          // 新規登録完了したらpush()を用いてログイン画面に遷移させる
          history.push('/login');
        })
        .catch(err => {
            alert("Email address or user name that has already been registered.");
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
      <input placeholder="Email address" className='form-control'
      {...register('email',
      { required: true,pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} />
      {errors.email && <p>Please enter a valid email address</p>}
      <label for="name">UserName：</label>
      <input placeholder="Username" className='form-control' {...register('name', { required: true })} />
      {errors.name && <p>Please enter your username</p>}
      <label for="password">Password：</label>
      <input placeholder="Please enter at least 6 single-byte alphanumeric characters" className='form-control'
      {...register('password', { required: true, minLength: 6 })} />
      {errors.password && <p>Please enter at least 6 single-byte alphanumeric characters</p>}
      <input className='btn btn-secondary' type="submit" value="Signup" />
      </form>
      </div>
    )
};
export default Signup;