import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { apiURL } from './Default';
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom'

// 下記はユーザー情報表示用axios

// universal-cookieを使用する際のインスタンス化として必要な記述です。本コンポーネントではCookieに格納してあるJWTをheaderに付加してリクエストを送る必要があるため、Cookieから‘accesstoken’を取得しなければなりません。（この記述です⇨{cookies.get(‘accesstoken’)}）
const cookies = new Cookies();

const MyPagePasswordUpdate = () => {
  const [my_password, setValue] = useState(null);
  //同様にmy_IDを定義
  const [my_ID,setMyID] = useState(null);
  // userSelectorは簡単に言うと、Redux Store内のstateを取得するメソッドです。Loginの際などにdispatch()を用いてRedux store内のstateを更新したかと思いますが、useSelectorでそのstateを取得できます。このコンポーネントが表示された際にユーザーがログインしているかしていないかはRedux Store内のstate（isLoggedIn）を取得しないと分かりません。ですので、useSelectorを用いてisLoggedInをstoreから取得しています。
  const isLoggedIn= useSelector(state => state.user.isLoggedIn);

  // React Hook Form の初期化
  const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    // fetchDataという関数を定義しています。すみません、Login.jsをお送りした際には関数を使用していない記述となっており僕が間違えていたのですが、useEffect内に直接処理を記述することはあまり推奨されていないようです。もちろんfetchData()を定義せず直接Login.jsの時のように記述しても問題なく動きます。おそらくuseEffect内に直接処理を記述しているとwarningが出ていると思います。（今後バージョンアップが進むとエラーになる可能性？）「useEffect内に直接処理を記述することは非推奨となっている」と考えていただければ良いです。基本的に式の中（ここではuseEffect）に非同期関数を埋め込む場合はasync function文を用います。
    async function fetchData(){
      // axiosを使う文法は決まっており、基本的には同じ形です。まずLogin.jsとMyPage.jsの根本的な違いはGETかPOSTかです。Login.jsの際はJWT、つまりheaderを付加する必要がなかったが認証のための情報（username、password）を送信する必要がありました。それに対して今回はJWTを付加する必要がありましたので、このような記載になっています。もちろんGETでもPOSTでもJWTが必要となるリクエストには全て今回のようにheader内にJWTを付加する必要があります。
      const result = await axios.get(
        apiURL+'mypage/',
        {
          // DRFにリクエストを送る際のheaderです。content-typeはファイルの種類を表す情報、‘Authorization’: JWT はModHeaderに記載しているものと全く同じですのでJWT認証用の記法です。これについてもほとんど記法は固定されていますので、あまり変える必要はないと思います。（例えばファイルリクエストの際は‘content-type’: ‘multipart/form-data’,など。）HTTPリクエストのheaderについては、以下がわかりやすいかと思います。https://wa3.i-3-i.info/word1844.html
          // CookieからJWTを取り出して、headerにセットしています。
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `JWT ${cookies.get('accesstoken')}`
            }
        })
        // 定義したstateに実際に値を格納している部分です。setMyname()やsetMyemail()で値をセットしているだけです。axiosで返ってくるPromiseオブジェクトをresultに格納しています。then内では、result変数を実行しているというよりは、Psomiseオブジェクトであるresultから欲しいデータを取得しているというイメージ
        .then(result => {
          // この部分でFormの初期値を直接指定している
          setValue(result.data.password);
          setMyID(result.data.id);
        })
        // エラーハンドリングのため記載しています。例えばエラーハンドリングを行わないと重大なシステム不備になる可能性も出てきますので、axiosの最後には基本的に「エラーが出た場合」を考えて処理を書いておきます。実際にはこの部分でエラーをキャッチしたらalertを表示させたり強制的にページ遷移をさせたりしてエラーハンドリングを行います。
        .catch(err => {
          console.log("err");
        });
    }
  // この上の部分まででfetchData()という関数の定義を行なっており、この行のfetchData()で実際に関数を実行しています。先にも述べましたが、useEffect内に直接処理を書くことが非推奨なため先に関数fetchData()を定義した後実行するという流れです。また、その後の ,[]  の部分は以前にも申し上げましたが、useEffect内の処理が無限ループしてしまうことを防ぐため1回だけuseEffect内の処理を行なうという意味の記述です。
  fetchData();
  },[]);


// 下記はアップデート用axios
const update = async (data) =>{
  // Formで入力したデータがdataに格納されていることを確認
      console.log(data)
  // JWT取得のためのDRF側のURLを指定（apiURLはDefault.jsで指定している）
      await axios.patch(`${apiURL}users/`+my_ID+'/',
        {

          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${cookies.get('accesstoken')}`
          },
  // JWT取得のための認証情報をセット（tomato様の場合DRFの使用上、email⇨usernameだと思います）
          password:data.password,
        },
        // alertを処理完了後に表示させる場合、then()内に記述する必要があります！
      ).then(message => {
        alert("Updated!")
      })
  // 認証リクエストが失敗した場合
      .catch(err => {
          console.log("miss");
          alert("The characters are invalid");
      });
    };

  return (
    <div>
      {/* if文よりも効率が良い三項演算子を用いた記述です。JavaScriptの三項演算子を参照してみてください。もちろんif文でも実装できますが、コードが長くなりますので三項演算子がJSX内ではよく使われます。
      https://www.javadrive.jp/javascript/ope/index14.html？ */}
      {isLoggedIn ?
        <div class="update-block">
          <form onSubmit={handleSubmit(update)}>
          <label for="password">Password：</label>
          <input className='form-control' type="password" {...register('password')} />
          <input className='btn btn-secondary' type="submit" value="Update" />
          </form>
          <Link to="/mypage">Back to My Pgae</Link>
        </div> :
        <div>
              Logout
        </div>
      }

    </div>
  )
};

export default MyPagePasswordUpdate;