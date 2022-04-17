import React, { useState, useEffect, onClick} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { apiURL } from './Default';
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom'
import { useDispatch } from "react-redux";
// 使いたいactionCreatorをimport、ここ追記
import { setUserID } from "../stores/user";
// 下記はユーザー情報表示用axios

// universal-cookieを使用する際のインスタンス化として必要な記述です。本コンポーネントではCookieに格納してあるJWTをheaderに付加してリクエストを送る必要があるため、Cookieから‘accesstoken’を取得しなければなりません。（この記述です⇨{cookies.get(‘accesstoken’)}）
const cookies = new Cookies();

const MyPage = () => {
  // 質問２、この時点では、まだDRFにアクセスしていないためusernameやemailは未知です。ですので、null（もしくは ‘’ でも可）を初期値として設定しています。この記述はstateの初期化であり、中に値を入れる必要はありませんし、未知の値を入れることはそもそも不可能です。後にuseEffect内でsetMyname()やsetEmail()を使いますので、その際にこれらのstateにDRFから取得した値が格納されます。
  const [my_name,setMyname] = useState(null);
  const [my_email,setMyemail] = useState(null);
  const [my_password,setMypassword] = useState(null);
  // ここでのstate（useStateで用意している‘state’）は、mypage/にPOSTリクエストを送り、その情報を格納するための変数です。このstateを利用し、セレクトボックスの初期値を設定しています。
  const [state,setState] = useState(null);
  const [address,setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [zipcode,setZipcode] = useState(null);
  const [phone_number,setPhonenumber] = useState(null);
  //同様にmy_IDを定義
  const [my_ID,setMyID] = useState(null);
  // userSelectorは簡単に言うと、Redux Store内のstateを取得するメソッドです。Loginの際などにdispatch()を用いてRedux store内のstateを更新したかと思いますが、useSelectorでそのstateを取得できます。このコンポーネントが表示された際にユーザーがログインしているかしていないかはRedux Store内のstate（isLoggedIn）を取得しないと分かりません。ですので、useSelectorを用いてisLoggedInをstoreから取得しています。
  const isLoggedIn= useSelector(state => state.user.isLoggedIn);


  const dispatch = useDispatch();
  // React Hook Form の初期化
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();



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
          // この部分でFormの初期値を直接指定している（stateとMyIDに関してはformに関係ないので、useStateを使用しています）
          setValue('username',result.data.username);
          setValue('email',result.data.email);
          // setMypassword(result.data.password);
          setState(result.data.state);
          setValue('city',result.data.city);
          setValue('address',result.data.address);
          setValue('zipcode',result.data.zipcode);
          setValue('phone_number',result.data.phone_number);
          setMyID(result.data.id);
        // MyPage.js内で、‘users/ユーザーのID/’ というurlにアクセスできているのは、useEffect()内で‘mypage/’にgetリクエストを送り、ログインユーザーのIDをuseStateを用いて取得・格納しているためです。
        // 次に、現在問題であるCancelMembership.js内で同様に‘users/ユーザーのID/’ というurlにアクセスできないのは、MyPage.jsのようにログインユーザーのIDをあらかじめ取得できていないためです。
        // つまり、異なるコンポーネント間でstateを共有化したいときにRedux stateを使えば便利だという話です。
        // 「id（Redux state）は定義しなくてもどこでも使える」という概念は半分間違いであり、store/users.jsで初期化したのち、どこかでその値をdiapatch（セット）しなければ初期化時の空の値しか得ることができません。userIDに値がなくパスワードのアップデートがうまく行っていないのは、dispatchができていないからです。
        // 一度userIDにdispatchしてしまえば、その後はどこのコンポーネントでも使えるようになります。
        // 送っていただいたコードのようにMyPage.jsにdispatch(setUserID(id))を記述するのであれば、そのidがDRFから返ってきている場所に記述しなければスクショのようにエラーが出ます。
        // CancelMembership.jsでuserIDを使いたい場合は、Login.js（axiosでDRFにアクセスし、userIDの情報を取得できる部分）でisLoggedInOnと同様にsetUserIDを呼び出し、値をセットする必要があります。
        // DRFでログインユーザーの情報を返すのはMyPageViewです。つまり、MyPageViewにアクセスするaxiosでuserIDを格納する必要があるかと思います。
        // 正しい場所で呼び出したとしても、dispatch(setUserID());とすると引数が空ですので、userIDに値がはいりません。例えばidという名の変数の中身をdispatchしたい場合には、dispatch(setUserID(id)); と記述しなければ保存されません。
          dispatch(setUserID(result.data.id));
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
const stateList = [{text:"Alabama",id:1},{text:"Alaska",id:2},{text:"Arizona",id:3},{text:"Arkansas",id:4},{text:"California",id:5},
{text:"Colorado",id:6},{text:"Connecticut",id:7},{text:"Delaware",id:8},{text:"District Of Columbia",id:9},{text:"Florida",id:10},{text:"Georgia",id:11},{text:"Hawaii",id:12},{text:"Idaho",id:13},{text:"Illinois",id:14},{text:"Indiana",id:15},
{text:"Iowa",id:16},{text:"Kansas",id:17},{text:"Kentucky",id:18},{text:"Louisiana",id:19},{text:"Maine",id:20},{text:"Maryland",id:21},{text:"Massachusetts",id:22},{text:"Michigan",id:23},{text:"Minnesota",id:24},{text:"Mississippi",id:25},
{text:"Missouri",id:26},{text:"Montana",id:27},{text:"Nebraska",id:28},{text:"Nevada",id:29},{text:"New Hampshire",id:30},{text:"New Jersey",id:31},{text:"New Mexico",id:32},{text:"New York",id:33},{text:"North Carolina",id:34},{text:"North Dakota",id:35},
{text:"Ohio",id:36},{text:"Oklahoma",id:37},{text:"Oregon",id:38},{text:"Pennsylvania",id:39},{text:"Rhode Island",id:40},{text:"South Carolina",id:41},{text:"South Dakota",id:42},{text:"Tennessee",id:43},{text:"Texas",id:44},{text:"Utah",id:45},
{text:"Vermont",id:46},{text:"CVirginia",id:47},{text:"Washington",id:48},{text:"West Virginia",id:49},{text:"Wisconsin",id:50},{text:"Wyoming",id:51},
];
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
        
          username:data.username,
          email:data.email,
          // password:data.password,
          state:data.state,
          // state:1,
          city:data.city,
          address:data.address,
          zipcode:data.zipcode,
          phone_number:data.phone_number,
        },
        // alertを処理完了後に表示させる場合、then()内に記述する必要があります！
      ).then(message => {
        alert("Updated!")
      })
  // 認証リクエストが失敗した場合
      .catch(err => {
          console.log("miss");
          console.log(data.email);
          alert("The characters are invalid");
      });
    };

// const update = (data) =>{
//   // Formで入力したデータがdataに格納されていることを確認
//       console.log(data)
//       // console.log(stateList)
//     };
  return (
    <div>
      {/* if文よりも効率が良い三項演算子を用いた記述です。JavaScriptの三項演算子を参照してみてください。もちろんif文でも実装できますが、コードが長くなりますので三項演算子がJSX内ではよく使われます。
      https://www.javadrive.jp/javascript/ope/index14.html？ */}
      {isLoggedIn ?
        // <div>
        //      <p>ユーザー名：{my_name}</p>
        //      <p>メールアドレス：{my_email}</p>
        // </div> :
        // <div>
        //       未ログイン
        // </div>
        // このregisterという部分は、imput要素のname属性と同じです。
        // つまり、 name='title' と同義であり、setValueの'title'はそこで紐づけられます。
        <div class="update-block">
          <form onSubmit={handleSubmit(update)}>
          <label for="username">Username：</label>
          {/* Form内に初期値を設定するにはdefaultValueで表示できる */}
          <input className='form-control' defaultValue={my_name} {...register('username', { required: true })} />
          {errors.username && <p>Please put username</p>}
          <label for="email">Email：</label>
          <input className='form-control' defaultValue={my_email} type="email" {...register('email', { required: true })} />
          {errors.email && <p>Please put email</p>}
          {/* <label for="password">Password：</label>
          <input className='form-control' type="password" {...register('password')} /> */}
          {/* ここでのstate（register（Hook Form）で用意している‘state’）は、useStateで用意している‘state’とは違い
          ユーザーがformから選択したstateを格納します。
          これらの二つのstateは全く異なる役割をしており、名前混同する可能性があります。 */}
          <label for="state">State：</label>
          {/* 例えばAlabamaを選択された時にstateが“AL”という文字列になっていると思います。そしてそれをそのままリクエストするのではなく、“AL”ならば1（数値は仮です。実際はstateモデル内のオブジェクトとリンクさせる必要があります）というように変換を行う必要があります。
          ですので、value内を数値に変更する必要がある */}
          
          {/* <select className='form-control' name="state" {...register('state')}>
            <option value="1">Alabama</option>
            <option value="2">Alaska</option>
            <option value="3">Arizona</option>
            <option value="4">Arkansas</option>
            <option value="5">California</option>
            <option value="6">Colorado</option>
            <option value="7">Connecticut</option>
            <option value="8">Delaware</option>
            <option value="9">District Of Columbia</option>
            <option value="10">Florida</option>
            <option value="11">Georgia</option>
            <option value="12">Hawaii</option>
            <option value="13">Idaho</option>
            <option value="14">Illinois</option>
            <option value="15">Indiana</option>
            <option value="16">Iowa</option>
            <option value="17">Kansas</option>
            <option value="18">Kentucky</option>
            <option value="19">Louisiana</option>
            <option value="20">Maine</option>
            <option value="21">Maryland</option>
            <option value="22">Massachusetts</option>
            <option value="23">Michigan</option>
            <option value="24">Minnesota</option>
            <option value="25">Mississippi</option>
            <option value="26">Missouri</option>
            <option value="27">Montana</option>
            <option value="28">Nebraska</option>
            <option value="29">Nevada</option>
            <option value="30">New Hampshire</option>
            <option value="31">New Jersey</option>
            <option value="32">New Mexico</option>
            <option value="33">New York</option>
            <option value="34">North Carolina</option>
            <option value="35">North Dakota</option>
            <option value="36">Ohio</option>
            <option value="37">Oklahoma</option>
            <option value="38">Oregon</option>
            <option value="39">Pennsylvania</option>
            <option value="40">Rhode Island</option>
            <option value="41">South Carolina</option>
            <option value="42">South Dakota</option>
            <option value="43">Tennessee</option>
            <option value="44">Texas</option>
            <option value="45">Utah</option>
            <option value="46">Vermont</option>
            <option value="47">Virginia</option>
            <option value="48">Washington</option>
            <option value="49">West Virginia</option>
            <option value="50">Wisconsin</option>
            <option value="51">Wyoming</option>
          </select> */}
          <select className='form-control' name="state" {...register('state')}>
                      {stateList.map(item => (
                        (state === item.id) ?
                          <option value={item.id} selected>{item.text}</option>
                        :
                          <option value={item.id}>{item.text}</option>
                        ))}
          </select>
          {/* 51個あるstateの選択肢を上記のように一度配列で定義してmap関数でreturn内に<option>を表記する方がコードも少なく効率的かと思います。
          三項演算子を用いて、ユーザーが登録しているstateと選択肢のidが一致する場合には<option>要素にselectedを追加、そうでない場合には普通の<option>要素を表示できるようになっています */}
          <label for="city">City：</label>
          <input className='form-control' defaultValue={city} type="city" {...register('city')} />
          {errors.city && <p>Please put city</p>}
          <label for="address">Address：</label>
          <input className='form-control' defaultValue={address} type="address" {...register('address')} />
          {errors.address && <p>Please put address</p>}
          <label for="zipcode">Zipcode：</label>
          <input className='form-control' defaultValue={zipcode} type="zipcode" {...register('zipcode')} />
          {errors.zipcode && <p>Please put zipcode</p>}
          <label for="phone_number">Phone number：</label>
          <input className='form-control' defaultValue={phone_number} type="phone_number" {...register('phone_number')} />
          {errors.phone_number && <p>Please put phone_number</p>}
          <input className='btn btn-secondary' type="submit" value="Update" />
          </form>
          {/* リンクはDefault.jsの                      <Route exact path="/mypage_password_update" component={MyPagePasswordUpdate} />
          の箇所で設定している */}
          <Link to="/mypage_password_update">Need to Update Password</Link><br></br>
          <Link to="/cancel_membership">Cancel Membership</Link>
        </div> :
        <div>
              Logout
        </div>
      }

    </div>
  )
};

export default MyPage;