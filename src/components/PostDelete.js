import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { apiURL } from './Default';
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useHistory } from 'react-router-dom'

// 使いたいactionCreatorをimport、ここ追記
import { clearUserID } from "../stores/user";
import { isLoggedInOff } from "../stores/user";

// 下記はユーザー情報表示用axios

// universal-cookieを使用する際のインスタンス化として必要な記述です。本コンポーネントではCookieに格納してあるJWTをheaderに付加してリクエストを送る必要があるため、Cookieから‘accesstoken’を取得しなければなりません。（この記述です⇨{cookies.get(‘accesstoken’)}）
const cookies = new Cookies();

// 大事！
// １、store/users.js（Redux storeのこと）でユーザーIDを取ってくるsetUserID関数を作成
// ２、MyPage.jsに訪れた時点でsetUserIDをDispatchで発動させ、IDが格納されたuserIDがコンポーネントでどこでも使えるようにする
// ３、CancelMembership.jpでuseSelectorを用いてどこでも使える状態になっているuserIDを取得し、userIDという変数に格納
// ４、deleteData()内のaxiosのアクセスURLを、このuserIDを使用して指定していることにより、
// そのユーザーが消される

const CancelMembership = () => {
  const isLoggedIn= useSelector(state => state.user.isLoggedIn);
  // ＞ログインしているユーザー　というのはコードのどこで表現しているのでしょうか？
  // ずばりこの一文です。
  // const userID= useSelector(state => state.user.userID);
  // CancelMembership.js内で、useSelectorを用いてuserIDという変数にRedux store内のuserIDを格納しています。そしてdeleteData()内のaxiosのアクセスURLを、このuserIDを使用して指定していることがわかります。
  // setUserIDを使用したコンポーネント内だけでRedux stateを使えるのではありません。もしそうだとすれば、結局CancelMembership.js内でMyPageViewにアクセスしてDRFからuserIDを取得する必要があるはずです。
  // Redux stateとは、あるコンポーネントで変更（dispatch）したstateを、useSelectorを用いて取得しどのコンポーネントでも利用できる
  // これが肝です。つまり今回の場合は、「MyPage.jsでdispatch(setUserID())したstate（userID）を、CancelMembership.jでuseSelectorを用いて取得し、利用している」ということです。
  const userID= useSelector(state => state.user.userID);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
    async function deleteData(){
      // axiosを使う文法は決まっており、基本的には同じ形です。まずLogin.jsとMyPage.jsの根本的な違いはGETかPOSTかです。Login.jsの際はJWT、つまりheaderを付加する必要がなかったが認証のための情報（username、password）を送信する必要がありました。それに対して今回はJWTを付加する必要がありましたので、このような記載になっています。もちろんGETでもPOSTでもJWTが必要となるリクエストには全て今回のようにheader内にJWTを付加する必要があります。
      const result = await axios.delete(
        // apiURL+'users/{userID}'
        // また、上記の書き方ではログを見れば分かりますが,
        // {userID}の部分は文字列とみなされています。
        // userIDを変数としてURLを指定する場合、以下のように書く必要があります。
        apiURL+'posts/'+ id,
        {
          // DRFにリクエストを送る際のheaderです。content-typeはファイルの種類を表す情報、‘Authorization’: JWT はModHeaderに記載しているものと全く同じですのでJWT認証用の記法です。これについてもほとんど記法は固定されていますので、あまり変える必要はないと思います。（例えばファイルリクエストの際は‘content-type’: ‘multipart/form-data’,など。）HTTPリクエストのheaderについては、以下がわかりやすいかと思います。https://wa3.i-3-i.info/word1844.html
          // CookieからJWTを取り出して、headerにセットしています。
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `JWT ${cookies.get('accesstoken')}`
            },
            
        })
        // 定義したstateに実際に値を格納している部分です。setMyname()やsetMyemail()で値をセットしているだけです。axiosで返ってくるPromiseオブジェクトをresultに格納しています。then内では、result変数を実行しているというよりは、Psomiseオブジェクトであるresultから欲しいデータを取得しているというイメージ
        .then(result => {
          // ここ追記
          // アラートを出して
          alert("Your post is deleted");
          // Topへ移動させる
          history.push('/');
        })
        // エラーハンドリングのため記載しています。例えばエラーハンドリングを行わないと重大なシステム不備になる可能性も出てきますので、axiosの最後には基本的に「エラーが出た場合」を考えて処理を書いておきます。実際にはこの部分でエラーをキャッチしたらalertを表示させたり強制的にページ遷移をさせたりしてエラーハンドリングを行います。
        .catch(err => {
          console.log("err");
        });
    }
  // この上の部分まででfetchData()という関数の定義を行なっており、この行のfetchData()で実際に関数を実行しています。先にも述べましたが、useEffect内に直接処理を書くことが非推奨なため先に関数fetchData()を定義した後実行するという流れです。また、その後の ,[]  の部分は以前にも申し上げましたが、useEffect内の処理が無限ループしてしまうことを防ぐため1回だけuseEffect内の処理を行なうという意味の記述です。
  // delteData();
  // },[];


  return (
    <div>
      {/* if文よりも効率が良い三項演算子を用いた記述です。JavaScriptの三項演算子を参照してみてください。もちろんif文でも実装できますが、コードが長くなりますので三項演算子がJSX内ではよく使われます。
      https://www.javadrive.jp/javascript/ope/index14.html？ */}
      {isLoggedIn ?
        <div className="delete_post">
          {/* userIDはredux state、つまりコンポーネント全体で使えるので、いちいちdeleteData()の引数に渡さなくてもdeleteData内で参照できます。 */}
          <button className="btn btn-danger" onClick={() => deleteData()}>Delete Post</button><br></br>
          <Link to="/">Back to Top page</Link>
        </div> 
      }

    </div>
  )
};

export default CancelMembership;