import React, { useState, useEffect, onClick} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { apiURL } from './Default';
import { useSelector } from "react-redux";
import { useParams, Link } from 'react-router-dom'

import { useDispatch } from "react-redux";
import { setUserID } from "../stores/user";

import { useForm } from "react-hook-form";

const cookies = new Cookies();

const Top = () => {
  // リストで定義するというのはつまり以下のような形です。
  // そしてpostの中にDRFから取得したデータを保存し、return内ではmap関数で処理すると、リストに格納したデータを1つずつ表示できると思います。
  const {id} = useParams();
  const [post, setPost] = useState();
  const isLoggedIn= useSelector(state => state.user.isLoggedIn);
  const userID= useSelector(state => state.user.userID);

  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Postがある状態のStateをuseStaeで設定
  const [len,setLen] = useState(0)

  // flugの使い方は、ページボトム参照
  const [flug, setFlug] = useState(true)

  // 「初期画面」を見分ける変数を用意してそこで条件分岐させる
  const [initial_screen, setInitial] = useState(true)

  // Likeする用
  const [ like, setLike ] = useState({});

  // Like数表示用
  const [ like_numbers, setLikeNumbers ] = useState(0);

  useEffect(() => {
    async function fetchData(){
      // posts/get_data/へGETリクエストを送りpostデータを格納する処理
      const result = await axios.get(
        apiURL+'posts/',
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
          setLen(result.data.length);
          // 検索後Backボタンを押してTopに戻った時、BackボタンがあったらおかしいのでsetInitial(true)で初期画面を表示させるようにする
          setInitial(true);
          // ここにいいね数も含めるようにする
          setLikeNumbers(result.data.like_numbers);
          console.log(result.data.like_numbers);
          console.log(result.data.length)
          console.log(userID)
          console.log(result.data[0].photo)
          console.log(result.data[0].title)
          console.log(result.data)
          console.log(isLoggedIn)
        })
        .catch(err => {
          console.log("err");
          console.log(err);
        // useEffectを再度実行時にuseEffectの第二引数を指定、ここでは第二引数にflug変数を設定し、Backボタンを押した時にPost一覧が再描画がされるようにする
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
              console.log(err)
            });
        }

    }
  fetchData();
  },[flug]);

  // 検索したPostをGetする用のミニConst
  const getSearchResult = async(data) => {
    console.log(data.search)
//     hook formの値を受け取る際は、data.xxxという記述をしなければなりません。
//     JSXのFORMでregisterを用いて入力された値を‘search’という名（name属性）で取得するようにしているからです。
// useStateなどで定義した変数はdata.などと記述する必要はありませんが、hook formで入力値を受け取る際にはこの書き方が必須となります。
    console.log(apiURL+'posts/?search='+ data.search)
    await axios.get(apiURL+'posts/?search='+ data.search,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(result => {
        // ここで検索キーワードをセット
        console.log(result.data);
        console.log(result.data.length);
        // 検索結果が数を格納
        setLen(result.data.length);
        setPost(result.data);
        // 何らかの検索を行なった際には
        // setInitial(false)
        // とすれば下の検索画面が表示されるはずです。
        setInitial(false);
        
      })
      .catch(err => {
        console.log("err");
        console.log(err)
      });
  }

  
  // Likeする用のミニConst
  // いいねボタンを押した時に発火させる
  const onClick = () => {
    const Like = async(data) => {
      await axios.post(apiURL+'posts/'+ id + '/like/',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${cookies.get('accesstoken')}`
          },
        })
        .then(result => {
        // もし、レスポンスがstatus=status.HTTP_200_OKであれば、すなわちLikeが既に作成済みであれば、下記を実行
        // レスポンスのstatusは以下で取得可能です．
        // result.status
        if (result.status === 200) {
          setLike(result.data.like);
        }
        })
        .catch(err => {
        // 406の場合、エラーのStatusですので、
        // .catch(err
        // の中に記述する必要があります。
        // エラーの場合は、then()節には入らずcatch()節に入ります。
        if (err.response.status === 406){
          
        }
          console.log(err.response.status)
          console.log(err);
        });
    }
  }


  return (
      <div className="">
        {/* onSubmitでgetSearchResultを発火させてやる */}
        {/* このregisterという部分は、imput要素のname属性と同じです。
        つまり、 name='title' と同義 */}
        {/* onSubmit とは、フォームが送信されたときに発火するイベントのようなものです。
        handleSubmit は、ラップした関数にformのdataをオブジェクトの形で渡してくれる機能であり、これにより先ほどのようにdata.xxxと値が取得できるようになります。 */}
            <form onSubmit={handleSubmit(getSearchResult)}>
            <label for="">Title or Maker：</label>
            <input placeholder="Title or Maker" className='form-control' {...register('search', { required: true })} />
            <input className='btn btn-secondary' type="submit" value="Search" />
            </form>
            <p>{len}</p>
            {len >= 1 ?
            // 「初期画面」を見分ける変数を用意してそこで条件分岐させる
            initial_screen ? 
            <>
            <div>
              {post.map(item => (
                <div>
                  <p>Title: {item.title}</p>
                  <p>Condition: {item.condition_name}</p>
                  <p>Maker: {item.maker}</p>
                  <p>Price: {item.price}</p>
                  <p>Description: {item.description}</p>
                  <p>User: {item.username}</p>
                  <p>Shipping price: {item.shipping_price}</p>
                  <img src={item.photo} />
                  <img src={item.photo2} />
                  <img src={item.photo3} />
                  <img src={item.photo4} />
                  <img src={item.photo5} />
                  <>
                    <button onClick={onClick}>
                    {like.liked ? '✔' : ''}いいね！
                    </button>
                    {like_numbers}
                  </>
                  <Link to={`/post/${item.id}`} className='btn btn-secondary'>Detail</Link>
                </div>
              ))}
            </div>
            </>
            :
            <>
            {/* setInitial(false)（検索後の画面）の時は下記を表示させてやる */}
            <div>
              {post.map(item => (
                <div>
                  <p>Title: {item.title}</p>
                  <p>Condition: {item.condition_name}</p>
                  <p>Maker: {item.maker}</p>
                  <p>Price: {item.price}</p>
                  <p>Description: {item.description}</p>
                  <p>User: {item.username}</p>
                  <p>Shipping price: {item.shipping_price}</p>
                  <img src={item.photo} />
                  <img src={item.photo2} />
                  <img src={item.photo3} />
                  <img src={item.photo4} />
                  <img src={item.photo5} />
                  <>
                    <button onClick={onClick}>
                    {like.liked ? '✔' : ''}いいね！
                    </button>
                    {like_numbers.count}
                  </>
                  <Link to={`/post/${item.id}`} className='btn btn-secondary'>Detail</Link>
                </div>
              ))}
              <button onClick={() => setFlug(!flug)} className='btn btn-secondary'>Back</button>
            </div>
            </>
            :
            <div>
              <p>{len}</p>
              <p>not found!</p>
              <button onClick={() => setFlug(!flug)} className='btn btn-secondary'>Back</button>
            </div>
          }
      </div>
  );
}

export default Top;


// ＊flugの使い方の説明＊

// １、
// まずflug変数をTureに設定しておく
// const [flug, setFlug] = useState(true)
// ２、
// そして、ユーザーが下記のボタンを押します。
// <button onClick={() => setFlug(!flug)} className='btn btn-secondary'>Back</button>
// すると
// !flugとあるので
// tureでない状態に変更されます。
// ３、
// tureでない状態に変更されたということは
// useEffectは、その第二引数に指定した変数が変更されたということ。
// fetchData();
//   },[flug]);
// 上記の部分が!flugになったということ。
// そして
// useEffectは、その第二引数に指定した変数が変更されると再発火するというルールがあるので
// useEffect内に
// あるすべてのPostを引っ張ってくる下記のコードが作動し
//     async function fetchData(){
//       // posts/get_data/へGETリクエストを送りpostデータを格納する処理
//       const result = await axios.get(
//         apiURL+'posts/',
//         {
//           headers: {
//               'Content-Type': 'application/json',
//               // ここ追記
//               // // ユーザーがログインした後、topページに遷移させuseEffect内にgetリクエストを記述し、storeにdispatchしています。
//               // fetchData()内のpostを取得しているaxiosでheadersに、'Authorization'としてJWTを付加していることが問題です。ログインしていないユーザーならば、cookieにJWTを持っていないのでその部分を消す必要があります。
//               // 'Authorization': `JWT ${cookies.get('accesstoken')}`
//             }
//         })
//         .then(result => {
//           setPost(result.data);
//           setLen(result.data.length)
//           console.log(result.data.length)
//           console.log(userID)
//           console.log(result.data[0].photo)
//           console.log(result.data[0].title)
//           console.log(result.data)
//           console.log(isLoggedIn)
//         })
// 全ポストが表示されるという仕組み


// trueでもfalseという文字列には意味はなく
// <button onClick={() => setFlug(!flug)} className='btn btn-secondary'>Back</button>
// をクリックすると
// flug
// がfalse→trueもしくはtrue→falseと変わって
// 第二引数に指定した変数が変更されたという事実ができあがる。
// そして第二引数に指定した変数が変更されるとUseEffectが発火する。
// なのでfalse→trueだろうがtrue→falseだろうが
// 変更されているにはかわりはない


