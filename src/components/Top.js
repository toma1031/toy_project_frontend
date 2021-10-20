import React, { useState, useEffect, onClick} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { apiURL } from './Default';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom'

import { useDispatch } from "react-redux";
import { setUserID } from "../stores/user";

const cookies = new Cookies();

const Top = () => {
  // リストで定義するというのはつまり以下のような形です。
  // そしてpostの中にDRFから取得したデータを保存し、return内ではmap関数で処理すると、リストに格納したデータを1つずつ表示できると思います。
  const [post, setPost] = useState([]);
  const isLoggedIn= useSelector(state => state.user.isLoggedIn);
  // ここ追記
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData(){
      // posts/get_data/へGETリクエストを送りpostデータを格納する処理
      const result = await axios.get(
        apiURL+'posts/get_data/',
        {
          headers: {
              'Content-Type': 'application/json',
              // ここ追記
              // // ユーザーがログインした後、topページに遷移させuseEffect内にgetリクエストを記述し、storeにdispatchしています。
              // fetchData()内のpostを取得しているaxiosでheadersに、'Authorization'としてJWTを付加していることが問題です。ログインしていないユーザーならば、cookieにJWTを持っていないのでその部分を消す必要があります。
              // 'Authorization': `JWT ${cookies.get('accesstoken')}`
            }
        })
        .then(result => {
          setPost(result.data);
          console.log(result.data[0].photo)
          console.log(result.data[0].title)
          console.log(result.data)
        })
        .catch(err => {
          console.log(err);
        });

        // ログインユーザーのuserIDを返すエンドポイントは/mypage
        // mypage/へGETリクエストを送りユーザー情報をRedux storeへdispatchする処理（ユーザーがログインしている場合のみ）
        if (isLoggedIn) {
          const get_user = await axios.get(
            apiURL+'mypage/',
            {
              // DRFにリクエストを送る際のheaderです。content-typeはファイルの種類を表す情報、'Authorization': JWT はModHeaderに記載しているものと全く同じですのでJWT認証用の記法です。これについてもほとんど記法は固定されていますので、あまり変える必要はないと思います。（例えばファイルリクエストの際は'content-type': 'multipart/form-data',など。）HTTPリクエストのheaderについては、以下がわかりやすいかと思います。https://wa3.i-3-i.info/word1844.html
              // CookieからJWTを取り出して、headerにセットしています。
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `JWT ${cookies.get('accesstoken')}`
                }
            })
            // 定義したstateに実際に値を格納している部分です。setMyname()やsetMyemail()で値をセットしているだけです。axiosで返ってくるPromiseオブジェクトをresultに格納しています。then内では、result変数を実行しているというよりは、Psomiseオブジェクトであるresultから欲しいデータを取得しているというイメージ
            .then(get_user => {
  
              dispatch(setUserID(get_user.data.id));
            })
            // エラーハンドリングのため記載しています。例えばエラーハンドリングを行わないと重大なシステム不備になる可能性も出てきますので、axiosの最後には基本的に「エラーが出た場合」を考えて処理を書いておきます。実際にはこの部分でエラーをキャッチしたらalertを表示させたり強制的にページ遷移をさせたりしてエラーハンドリングを行います。
            .catch(err => {
              console.log("err");
            });
        }

    }
  fetchData();
  },[]);

  return (
      <div className="">
              {post.map(item => (
                <div>
                  <p>Title: {item.title}</p>
                  <p>Condition: {item.condition}</p>
                  <p>Maker: {item.maker}</p>
                  <p>Price: {item.price}</p>
                  <p>Description: {item.description}</p>
                  <p>User: {item.user}</p>
                  <p>Shipping price: {item.shipping_price}</p>
                  <img src={item.photo} />
                  <img src={item.photo2} />
                  <img src={item.photo3} />
                  <img src={item.photo4} />
                  <img src={item.photo5} />
                </div>

              ))}
      </div>
  );
}

export default Top;