import React, { useState, useEffect, onClick} from 'react';
import { useForm } from "react-hook-form";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useSelector } from "react-redux";
import { apiURL } from './Default';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useDispatch } from "react-redux";

// universal-cookieを使用する際のインスタンス化として必要な記述です。本コンポーネントではCookieに格納してあるJWTをheaderに付加してリクエストを送る必要があるため、Cookieから‘accesstoken’を取得しなければなりません。（この記述です⇨{cookies.get(‘accesstoken’)}）
const cookies = new Cookies();

const PostDetail = () => {

  // １、useState()でphoto_dataに空の初期値を設定（今回の場合は写真データは後から入れ込むので初期値は空の状態にする）
  // ２、setPhoto_dataでphoto_data変数を関数化（再度変数化みたいなもの？）する？
  // ３、useEffect内などの発火させたい地点でsetXXXX（実際に入れ込みたいデータ）;とし、データを表示させる
  // useParam()を用いてURLからパラメータを取得している。
  // この部分
  // const {id} = useParams();
  // で変数 id にURLから取得したパラメータ（ここではQuestionのID）を格納
  const {id} = useParams();
  
  // resultはthen()内でしか参照できません。ですので、useStateなどを用いてコンポーネント全体で参照できる変数にその中身を格納して用いると良いと思います！！
  // １、useState()でphoto_dataに空の初期値を設定（今回の場合は写真データは後から入れ込むので初期値は空の状態にする）
  // ２、const [photo_data,の部分で変数を設定、setPhoto_dataはその変数の中身を更新するときに使用するといった感じですね。
  // ３、useEffect内などの発火させたい地点でsetXXXX（実際に入れ込みたいデータ）;とし、データを表示させる
  // 使い方はuseEffectなどで更新させたい箇所でsetPhoto_data（更新させたいデータの中身）みたいなイメージです。
  // update_photoはuseStateで空のまま初期化
  const [update_photo, setUpdatePhoto] = useState(null);
  const [update_photo2, setUpdatePhoto2] = useState(null);
  const [update_photo3, setUpdatePhoto3] = useState(null);
  const [update_photo4, setUpdatePhoto4] = useState(null);
  const [update_photo5, setUpdatePhoto5] = useState(null);


  // そしてpostの中にDRFから取得したデータを保存し、return内ではmap関数で処理すると、リストに格納したデータを1つずつ表示できると思います。
  const [post, setPost] = useState([]);
  // userSelectorは簡単に言うと、Redux Store内のstateを取得するメソッドです。Loginの際などにdispatch()を用いてRedux store内のstateを更新したかと思いますが、useSelectorでそのstateを取得できます。このコンポーネントが表示された際にユーザーがログインしているかしていないかはRedux Store内のstate（isLoggedIn）を取得しないと分かりません。ですので、useSelectorを用いてisLoggedInをstoreから取得しています。
  const isLoggedIn= useSelector(state => state.user.isLoggedIn);
  const userID= useSelector(state => state.user.userID);

  const dispatch = useDispatch();
  // React Hook Form の初期化
  // そのエラーの原因は以前にもありましたように、Hook Formのエラーの定義の仕方です。正しい定義方法は以下です。
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();


  // Likeする用
  // const [ like, setLike ] = useState({});

  // Likeしてあるか、していないか判断用
  const [ liked, setLiked ] = useState(false);

  // Like数表示用
  const [ like_numbers, setLikeNumbers ] = useState(0);

  // 下記はDRFから既存のデータを取得する用
  useEffect(() => {
    // fetchDataという関数を定義しています。すみません、Login.jsをお送りした際には関数を使用していない記述となっており僕が間違えていたのですが、useEffect内に直接処理を記述することはあまり推奨されていないようです。もちろんfetchData()を定義せず直接Login.jsの時のように記述しても問題なく動きます。おそらくuseEffect内に直接処理を記述しているとwarningが出ていると思います。（今後バージョンアップが進むとエラーになる可能性？）「useEffect内に直接処理を記述することは非推奨となっている」と考えていただければ良いです。基本的に式の中（ここではuseEffect）に非同期関数を埋め込む場合はasync function文を用います。
    async function fetchData(){

      // serializerを2つ用意して、読み込み用のみ、それ専用のserializerを用いる方法はどうでしょうか？？
      // 先程の、serializerのphotoをmethodFieldにする方法は読み込みonlyになるそうで、書き込みが上手くできないという事です。
      // 書き込みや、アップデートには/posts/を
      const result = await axios.get(
        apiURL+'posts/' + id,
        {
          // DRFにリクエストを送る際のheaderです。content-typeはファイルの種類を表す情報、‘Authorization’: JWT はModHeaderに記載しているものと全く同じですのでJWT認証用の記法です。これについてもほとんど記法は固定されていますので、あまり変える必要はないと思います。（例えばファイルリクエストの際は‘content-type’: ‘multipart/form-data’,など。）HTTPリクエストのheaderについては、以下がわかりやすいかと思います。https://wa3.i-3-i.info/word1844.html
          // CookieからJWTを取り出して、headerにセットしています。
          headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `JWT ${cookies.get('accesstoken')}`
            }
        })
        // thenとcatchの使い方ですが、thenはリクエストが成功した際の処理、catchはリクエストが失敗した際の処理ですので、catch()内でphoto_dataを参照しても、then()内でのsetPhoto_data()は発火していないのでどちらにせよNullが出ています。
        // 定義したstateに実際に値を格納している部分です。setTitle()やsetMaker()で値をセットしているだけです。axiosで返ってくるPromiseオブジェクトをresultに格納しています。then内では、result変数を実行しているというよりは、Psomiseオブジェクトであるresultから欲しいデータを取得しているというイメージ
        .then(result => {
          // ここでのresult.data.userのuserはDRFのPostモデルのuserフィールド
          console.log(result.data.user);
          console.log(result.data.id);
          console.log(result.data.price);
          console.log(result.data.condition);
          console.log(result.data.photo);
          console.log(result.data);
          console.log(result.data.like_numbers);
          // ここでsetPostでconst [post, setPost] = useState([]);のpost変数にデータを取得させる
          setPost(result.data);
          // この部分でFormの初期値を直接指定している
          setValue('title',result.data.title);
          setValue('condition', result.data.condition);
          setValue('maker',result.data.maker);
          setValue('price',result.data.price);
          setValue('description',result.data.description);
          setValue('shipping_price',result.data.shipping_price);

          setLikeNumbers(result.data.like_numbers);

        })
        // エラーハンドリングのため記載しています。例えばエラーハンドリングを行わないと重大なシステム不備になる可能性も出てきますので、axiosの最後には基本的に「エラーが出た場合」を考えて処理を書いておきます。実際にはこの部分でエラーをキャッチしたらalertを表示させたり強制的にページ遷移をさせたりしてエラーハンドリングを行います。
        .catch(err => {
          // TopとMypageでdispatch(setUserID(result.data.id));ので、userIDにログイン中のユーザーのIDが格納されています。
          console.log(userID);
          console.log(post.user);
          // console.log(photo_data);
          console.log(err);
        });
    }
  // この上の部分まででfetchData()という関数の定義を行なっており、この行のfetchData()で実際に関数を実行しています。先にも述べましたが、useEffect内に直接処理を書くことが非推奨なため先に関数fetchData()を定義した後実行するという流れです。また、その後の ,[]  の部分は以前にも申し上げましたが、useEffect内の処理が無限ループしてしまうことを防ぐため1回だけuseEffect内の処理を行なうという意味の記述です。
  fetchData();
  // judgeLiked関数を呼ぶことによってlikedという変数がそのポストにいいねしているかどうかの状態を持てることになります。逆に考えると、judgeLiked()をどこからも呼ばなければ、likedという変数には初期値のfalseしか入っていません。
  // コンポーネントがレンダリングされる際に自動的に呼ばれる関数はuseEffect内に記述している関数だけです。judgeLiked()はuseEffect内には記述されていないし、どこかのタイミングで呼ばれていることもないので、関数として記述しているものの永遠に発火していない状況です。実際に発火しているかどうか確認するログを入れてみるとどこからも呼ばれていないことが明確に分かると思います。
  // それを踏まえて、judgeLiked()を発火させることによってliked変数にポストをいいねしているかどうかの状態を持たせたい場合、どこで発火させるべきでしょうか？
  // 答えはuseEffectの中です。judgeLiked()が役割を果たすのはただ一回、コンポーネントがレンダリングされる初回のみです。
  judgeLiked();
  },[liked]);

// 下記はアップデート用axios
const conditionList = [{text:"Brand New",id:1},{text:"Mint",id:2},{text:"Excellent",id:3},{text:"Very Good",id:4},{text:"Good",id:5},
{text:"Fair",id:6},{text:"Poor",id:7},{text:"Non Functioning",id:8}
];

// 画像が変更された際には、changeImage()を用いてupdate_photoの中身を更新
// 画像が変更された時の処理
const changeImage = (e) => {
  console.log("changeImage in");
  console.log(e.target.files[0]);
  // photo にファイルを格納
  setUpdatePhoto(() => e.target.files[0]);
  // ファイルサイズが0ならば（ファイル中身がないなら）return（Returnは強制中断という意味）
  if (!e.target.files || e.target.files.length === 0) return;
    // fileという変数にフォームから取得したファイルを格納
    const file = e.target.files;
    // ファイル種別が jpeg / png でない場合は return（Returnは強制中断という意味）
    if (file.type !== "image/jpeg" && file.type !== "image/png") return;
}
// 画像が変更された時の処理
const changeImage2 = (e) => {
  console.log("changeImage in");
  console.log(e.target.files[0]);
  // photo にファイルを格納
  setUpdatePhoto2(() => e.target.files[0]);
  // ファイルサイズが0ならば（ファイル中身がないなら）return（Returnは強制中断という意味）
  if (!e.target.files || e.target.files.length === 0) return;
    // fileという変数にフォームから取得したファイルを格納
    const file = e.target.files;
    // ファイル種別が jpeg / png でない場合は return（Returnは強制中断という意味）
    if (file.type !== "image/jpeg" && file.type !== "image/png") return;
}
// 画像が変更された時の処理
const changeImage3 = (e) => {
  console.log("changeImage in");
  console.log(e.target.files[0]);
  // photo にファイルを格納
  setUpdatePhoto3(() => e.target.files[0]);
  // ファイルサイズが0ならば（ファイル中身がないなら）return（Returnは強制中断という意味）
  if (!e.target.files || e.target.files.length === 0) return;
    // fileという変数にフォームから取得したファイルを格納
    const file = e.target.files;
    // ファイル種別が jpeg / png でない場合は return（Returnは強制中断という意味）
    if (file.type !== "image/jpeg" && file.type !== "image/png") return;
}
// 画像が変更された時の処理
const changeImage4 = (e) => {
  console.log("changeImage in");
  console.log(e.target.files[0]);
  // photo にファイルを格納
  setUpdatePhoto4(() => e.target.files[0]);
  // ファイルサイズが0ならば（ファイル中身がないなら）return（Returnは強制中断という意味）
  if (!e.target.files || e.target.files.length === 0) return;
    // fileという変数にフォームから取得したファイルを格納
    const file = e.target.files;
    // ファイル種別が jpeg / png でない場合は return（Returnは強制中断という意味）
    if (file.type !== "image/jpeg" && file.type !== "image/png") return;
}
// 画像が変更された時の処理
const changeImage5 = (e) => {
  console.log("changeImage in");
  console.log(e.target.files[0]);
  // photo にファイルを格納
  setUpdatePhoto5(() => e.target.files[0]);
  // ファイルサイズが0ならば（ファイル中身がないなら）return（Returnは強制中断という意味）
  if (!e.target.files || e.target.files.length === 0) return;
    // fileという変数にフォームから取得したファイルを格納
    const file = e.target.files;
    // ファイル種別が jpeg / png でない場合は return（Returnは強制中断という意味）
    if (file.type !== "image/jpeg" && file.type !== "image/png") return;
}

  // useHistoryやuseFormはトップレベルでは読み込めません。
  // const Post = () => {の内部に書く必要があります。
  const history = useHistory();

  const condition_tag = [{text:"Brand New",id:1},{text:"Mint",id:2},{text:"Excellent",id:3},{text:"Very Good",id:4},{text:"Good",id:5},
  {text:"Fair",id:6},{text:"Poor",id:7},{text:"Non Functioning",id:8},
  ];

const post_update = async (data) =>{
  // 画像に関しては、FormDataオブジェクトとしてリクエストする必要があります。
  // つまり、以下の部分のようにdata.xxxという形式でリクエストしてもDRF側でエラーとなり保存できません。
  // photo:data.photo,
  
  let formdata = new FormData();
  // Form から取得した値をFormDataへ追加していく
  formdata.append('title', data.title);
  formdata.append('maker', data.maker);
  formdata.append('condition', data.condition);
  formdata.append('price', data.price);
  formdata.append('description', data.description);
  formdata.append('shipping_price', data.shipping_price);
  // photoが更新された場合のみformdata（リクエストデータ）にそのフィールドを追加
  formdata.append('photo', update_photo);
  formdata.append('photo2', update_photo2);
  formdata.append('photo3', update_photo3);
  formdata.append('photo4', update_photo4);
  formdata.append('photo5', update_photo5);



      // もちろんformにユーザー選択欄を設ければ上記で大丈夫ですが、わざわざログインユーザーに自分のIDを選択させるのは現実的ではありません。
      // 以前Redux stateでuserIDを格納する処理を記述しました。つまり、React側からuserのIDを送信する場合は、Redux stateからuseSelectorでPostの送信者（ログイン中ユーザー）userIDを取得する方法が考えられます。
      // user:userID,
    // },
      // DRFにリクエストを送る際のheaderです。content-typeはファイルの種類を表す情報、‘Authorization’: JWT はModHeaderに記載しているものと全く同じですのでJWT認証用の記法です。これについてもほとんど記法は固定されていますので、あまり変える必要はないと思います。（例えばファイルリクエストの際は‘content-type’: ‘multipart/form-data’,など。）HTTPリクエストのheaderについては、以下がわかりやすいかと思います。https://wa3.i-3-i.info/word1844.html
      // CookieからJWTを取り出して、headerにセットしています。
      const result = await axios.patch(`${apiURL}posts/`+id+'/', formdata,{
        headers: {
          'content-type': 'multipart/form-data',
          'Authorization': `JWT ${cookies.get('accesstoken')}`
      // {headers: {
      //     'Content-Type': 'application/json',
      //     // photoは他のフィールドと異なり、Fileとして扱う必要があるので、
      //     // 'Content-Type': 'application/json',
      //     // では送信できません。
      //     // 'Content-Type': 'multipart/form-data',
      //     'Authorization': `JWT ${cookies.get('accesstoken')}`
      //   },
  
    }})
    .then(function(response){
      console.log(response);
      // dispatch(userID(result.data.id));
      alert("Post is updated!");
      // 完了したらpush()を用いてTopに遷移させる
      history.push('/');
    })
    .catch(err => {
      console.log(data);
        alert("error");
        console.log(err);
        console.log(data.title);
    });
  };

// 下記は投稿削除用
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

  // Likeする用のミニConst
  // いいねボタンを押した時に発火させる
// Likeする用のミニConst
// いいねボタンを押した時に発火させる
const changeLiked = async() => {
  console.log("changeLiked() 発火");
  const result = await axios.get(apiURL+'posts/'+ id + '/like/',
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${cookies.get('accesstoken')}`
        },
      })
      .then(result => {
        console.log(result.data);
        // ここでlikedにデフォルトでSetされているfalseをtrueに切り替えることでlikeすることになる
        setLiked(!liked);
        console.log('like押した');
      })
      .catch(err => {
        console.log(err);
        console.log('like失敗');
      });
  }


  // いいね状態の取得
  // judgeLiked()によってsetLiked(result.data);される。
  // 対象Postにいいね済みの場合　-> likedにtrueをセット（result.dataがtrue）
  // 対象Postにいいね済みではない場合　-> likedにfalseをセット（result.dataがfalse）
  const judgeLiked = async() => {
    console.log("judgeLiked() 発火");
    const result = await axios.get(apiURL+'posts/'+id+'/judgeLiked/',{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${cookies.get('accesstoken')}`
      }
    })
    .then(result => {
      console.log(result.data);
      setLiked(result.data);
    })
    .catch(err => {
      console.log(err);
    });
  }

    return (
      <div className="detail-body">
        {/* 他のコンポーネントで書いたようにreturn内で以下のように条件分岐を行わないとログインしていない場合にもpostができてしまいます。
        {isLoggedIn ? 
        ログインしている場合の内容
        :
        ログインしていない場合の内容
        } */}
        {/* JSX内で条件分岐等JavaScriptを記述する際には{}で括る必要があります。 */}
        {(post.user === userID) ?
          <div>
            <h1>ログインしてます。</h1>
              <p>post.user = {post.user}</p>
              <p>userID = {userID}</p>
          </div>
          :
          <div>
            <h1>ログインしていません</h1>
            <p>post.user = {post.user}</p>
            <p>userID = {userID}</p>
          </div>
        }
        
        {/* 下記は投稿者用のPostdeatilのページ */}
        {isLoggedIn && post.user === userID ? 
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
            <form onSubmit={handleSubmit(post_update)}>
            <label for="title">Title：</label>
            {/* ...register('title', は‘title’という名で取り出せますよという意味です。 */}
            {/* <input placeholder="Title" className='form-control' {...register('title', { required: true })} />
            このregisterという部分は、imput要素のname属性と同じです。
            つまり、 name='title' と同義であり、setValueの'title'はそこで紐づけられます。
            Hook Form のドキュメントにはより詳しい記載がありますので、ぜひ参考になさってください。
            https://react-hook-form.com/api/useform/register/
            https://react-hook-form.com/jp/api/#setValue */}
            <input placeholder="Title" className='form-control' {...register('title', { required: true })} />
            {errors.title && <p>Please put title</p>}
            <label for="maker">Maker：</label>
            <input placeholder="Maker" className='form-control' {...register('maker', { required: true })} />
            {errors.maker && <p>Please put maker</p>}
            <label for="condition">Condition：</label>
            <select className='form-control' name="condition" {...register('condition', { required: true })}>
            {condition_tag.map(item => (<option value={item.id} selected>{item.text}</option>))}
            </select>
            <label for="price">Price($)：</label>
            <input placeholder="Price" className='form-control' type="number" {...register('price', { required: true })} />
            {errors.price && <p>Please put price</p>}
            <label for="description">Description：</label>
            <input placeholder="Description" className='form-control' {...register('description', { required: true })} />
            {errors.description && <p>Please put description</p>}
            <label for="shipping_price">Shipping Price($)：</label>
            <input placeholder="Shipping Price" className='form-control' type="number" {...register('shipping_price', { required: true })} />
            {errors.shipping_price && <p>Please put shipping price</p>}
            <label for="photo">Photo：</label>
            {/* すでにある画像を表示（プレビュー）
            <img …/> を用いてresult.data.photoで得た元々登録されている画像を表示 */}
            <img src={post.photo} />
            {/* 変更用フォームの設置
            <input …/> を用いて新たな画像を登録 */}
            <input type="file" onChange={changeImage} className='form-control' accept="image/*"/>
            <label for="photo2">Photo2：</label>
            <img src={post.photo2} />
            <input type="file" onChange={changeImage2} className='form-control' accept="image/*"/>
            <label for="photo3">Photo3：</label>
            <img src={post.photo3} />
            <input type="file" onChange={changeImage3} className='form-control' accept="image/*"/>
            <label for="photo4">Photo4：</label>
            <img src={post.photo4} />
            <input type="file" onChange={changeImage4} className='form-control' accept="image/*"/>
            <label for="photo5">Photo5：</label>
            <img src={post.photo5} />
            <input type="file" onChange={changeImage5} className='form-control' accept="image/*"/>
      
            <input className='btn btn-secondary' type="submit" value="Update" />
            </form>
            <div className="delete_post">
            {/* userIDはredux state、つまりコンポーネント全体で使えるので、いちいちdeleteData()の引数に渡さなくてもdeleteData内で参照できます。 */}
            <button className="btn btn-danger" onClick={() => deleteData()}>Delete Post</button><br></br>
            <Link to="/">Back to Top page</Link>
            </div> 
          </div>
          :
          // 下記は投稿者以外のログインユーザー用のPostdeatilのページ
          isLoggedIn ? 
          <div>
                <div>
                  <p>Title: {post.title}</p>
                  <p>User: {post.username}</p>
                  <p>Condition: {post.condition_name}</p>
                  <p>Maker: {post.maker}</p>
                  <p>Price: {post.price}</p>
                  <p>Description: {post.description}</p>
                  {/* <p>User: {user}</p> */}
                  <p>Shipping price: {post.shipping_price}</p>
                  <img src={post.photo} />
                  <img src={post.photo2} />
                  <img src={post.photo3} />
                  <img src={post.photo4} />
                  <img src={post.photo5} />
                  <Link to={`/post/`+ post.id + `/open_messageroom`} className='btn btn-secondary'>Contact {post.username}</Link>
                  <>
                    <button onClick={changeLiked}>
                      {/* Likeしてあると✔を表示、していないと{like}でいいねできるようにする */}
                    {liked ? '✔' : 'いいね！'}
                    </button>
                    {like_numbers}
                  </>

                </div>
          </div>
          // 下記はログインしていないユーザー用のPostdeatilのページ
          :
          <div>
                <div>
                  <p>Title: {post.title}</p>
                  <p>User: {post.username}</p>
                  <p>Condition: {post.condition_name}</p>
                  <p>Maker: {post.maker}</p>
                  <p>Price: {post.price}</p>
                  <p>Description: {post.description}</p>
                  {/* <p>User: {user}</p> */}
                  <p>Shipping price: {post.shipping_price}</p>
                  <img src={post.photo} />
                  <img src={post.photo2} />
                  <img src={post.photo3} />
                  <img src={post.photo4} />
                  <img src={post.photo5} />
                  <Link to={"/signup"} className='btn btn-secondary'>Sign up for sending message!</Link>
                </div>
          </div>
        }
      </div>

    )
};
export default PostDetail;