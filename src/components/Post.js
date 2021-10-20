import React, { useState, useEffect, onClick} from 'react';
import { useForm } from "react-hook-form";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useSelector } from "react-redux";
import { apiURL } from './Default';
import  { useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setUserID } from "../stores/user";
// universal-cookieを使用する際のインスタンス化として必要な記述です。本コンポーネントではCookieに格納してあるJWTをheaderに付加してリクエストを送る必要があるため、Cookieから‘accesstoken’を取得しなければなりません。（この記述です⇨{cookies.get(‘accesstoken’)}）
const cookies = new Cookies();



const Post = () => {

  const [photo, setPhoto] = useState('');
  const [photo2, setPhoto2] = useState('');
  const [photo3, setPhoto3] = useState('');
  const [photo4, setPhoto4] = useState('');
  const [photo5, setPhoto5] = useState('');
  // 画像が変更された時の処理
  const changeImage = (e) => {
    // ファイルサイズが0ならば（ファイル中身がないなら）return（Returnは強制中断という意味）
    if (!e.target.files || e.target.files.length === 0) return;
      // fileという変数にフォームから取得したファイルを格納
      const file = e.target.files[0];
      // ファイル種別が jpeg / png でない場合は return（Returnは強制中断という意味）
      if (file.type !== "image/jpeg" && file.type !== "image/png") return;
      // photo にファイルを格納
      setPhoto(() => e.target.files[0]);
  }
  // 画像が変更された時の処理
  const changeImage2 = (e) => {
    // ファイルサイズが0ならば（ファイル中身がないなら）return（Returnは強制中断という意味）
    if (!e.target.files || e.target.files.length === 0) return;
      // fileという変数にフォームから取得したファイルを格納
      const file = e.target.files[0];
      // ファイル種別が jpeg / png でない場合は return（Returnは強制中断という意味）
      if (file.type !== "image/jpeg" && file.type !== "image/png") return;
      // photo にファイルを格納
      setPhoto2(() => e.target.files[0]);
  }
  // 画像が変更された時の処理
  const changeImage3 = (e) => {
    // ファイルサイズが0ならば（ファイル中身がないなら）return（Returnは強制中断という意味）
    if (!e.target.files || e.target.files.length === 0) return;
      // fileという変数にフォームから取得したファイルを格納
      const file = e.target.files[0];
      // ファイル種別が jpeg / png でない場合は return（Returnは強制中断という意味）
      if (file.type !== "image/jpeg" && file.type !== "image/png") return;
      // photo にファイルを格納
      setPhoto3(() => e.target.files[0]);
  }
  // 画像が変更された時の処理
  const changeImage4 = (e) => {
    // ファイルサイズが0ならば（ファイル中身がないなら）return（Returnは強制中断という意味）
    if (!e.target.files || e.target.files.length === 0) return;
      // fileという変数にフォームから取得したファイルを格納
      const file = e.target.files[0];
      // ファイル種別が jpeg / png でない場合は return（Returnは強制中断という意味）
      if (file.type !== "image/jpeg" && file.type !== "image/png") return;
      // photo にファイルを格納
      setPhoto4(() => e.target.files[0]);
  }
  // 画像が変更された時の処理
  const changeImage5 = (e) => {
    // ファイルサイズが0ならば（ファイル中身がないなら）return（Returnは強制中断という意味）
    if (!e.target.files || e.target.files.length === 0) return;
      // fileという変数にフォームから取得したファイルを格納
      const file = e.target.files[0];
      // ファイル種別が jpeg / png でない場合は return（Returnは強制中断という意味）
      if (file.type !== "image/jpeg" && file.type !== "image/png") return;
      // photo にファイルを格納
      setPhoto5(() => e.target.files[0]);
  }

    // useHistoryやuseFormはトップレベルでは読み込めません。
    // const Post = () => {の内部に書く必要があります。
    const history = useHistory();
    // 以下の部分が原因のようです。
    // const { register, handleSubmit, setValue, errors } = useForm();
    // hook form のv7以降はこのように定義する必要があります。
    const { register, handleSubmit, formState: { errors } } = useForm();

    // userSelectorは簡単に言うと、Redux Store内のstateを取得するメソッドです。Loginの際などにdispatch()を用いてRedux store内のstateを更新したかと思いますが、useSelectorでそのstateを取得できます。このコンポーネントが表示された際にユーザーがログインしているかしていないかはRedux Store内のstate（isLoggedIn）を取得しないと分かりません。ですので、useSelectorを用いてisLoggedInをstoreから取得しています。
    const isLoggedIn= useSelector(state => state.user.isLoggedIn);

    const userID= useSelector(state => state.user.setUserID);
    const dispatch = useDispatch();

    const condition_tag = [{text:"Brand New",id:1},{text:"Mint",id:2},{text:"Excellent",id:3},{text:"Very Good",id:4},{text:"Good",id:5},
    {text:"Fair",id:6},{text:"Poor",id:7},{text:"Non Functioning",id:8},
    ];

    const post = async (data) =>{
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
      formdata.append('photo', photo);
      formdata.append('photo2', photo2);
      formdata.append('photo3', photo3);
      formdata.append('photo4', photo4);
      formdata.append('photo5', photo5);
      // const result = await axios.post(
      //   apiURL+'posts/',
          // {// postリクエストを送っているものの、
          // 肝心のデータがリクエストに付加されていないため、400番エラーBad requestがでてます。
          // formから取得した値をリクエストに含める必要があります。
          
          // title:data.title,
          // maker:data.maker,
          // condition:data.condition,
          // price:data.price,
          // description:data.description,
          // shipping_price:data.shipping_price,
          

          // もちろんformにユーザー選択欄を設ければ上記で大丈夫ですが、わざわざログインユーザーに自分のIDを選択させるのは現実的ではありません。
          // 以前Redux stateでuserIDを格納する処理を記述しました。つまり、React側からuserのIDを送信する場合は、Redux stateからuseSelectorでPostの送信者（ログイン中ユーザー）userIDを取得する方法が考えられます。
          // user:userID,
        // },
          // DRFにリクエストを送る際のheaderです。content-typeはファイルの種類を表す情報、‘Authorization’: JWT はModHeaderに記載しているものと全く同じですのでJWT認証用の記法です。これについてもほとんど記法は固定されていますので、あまり変える必要はないと思います。（例えばファイルリクエストの際は‘content-type’: ‘multipart/form-data’,など。）HTTPリクエストのheaderについては、以下がわかりやすいかと思います。https://wa3.i-3-i.info/word1844.html
          // CookieからJWTを取り出して、headerにセットしています。
          const result = await axios.post(
          apiURL+'posts/',formdata,{
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
          alert("Post is completed!");
          // 完了したらpush()を用いてTopに遷移させる
          history.push('/');
        })
        .catch(err => {
          console.log(data);
          console.log(userID);
            alert("error");
            console.log(err);
        });
      };
    return (
      <div>
        {/* 他のコンポーネントで書いたようにreturn内で以下のように条件分岐を行わないとログインしていない場合にもpostができてしまいます。
        {isLoggedIn ? 
        ログインしている場合の内容
        :
        ログインしていない場合の内容
        } */}
        {isLoggedIn ?
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
            <form onSubmit={handleSubmit(post)}>
            <label for="title">Title：</label>
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
            <input type="file" onChange={changeImage} className='form-control' accept="image/*"/>
            <label for="photo2">Photo2：</label>
            <input type="file" onChange={changeImage2} className='form-control' accept="image/*"/>
            <label for="photo3">Photo3：</label>
            <input type="file" onChange={changeImage3} className='form-control' accept="image/*"/>
            <label for="photo4">Photo4：</label>
            <input type="file" onChange={changeImage4} className='form-control' accept="image/*"/>
            <label for="photo5">Photo5：</label>
            <input type="file" onChange={changeImage5} className='form-control' accept="image/*"/>
      
            <input className='btn btn-secondary' type="submit" value="post" />
            </form>
          </div>
          :
          <div>
                Logout
          </div>
        }
      </div>

    )
};
export default Post;