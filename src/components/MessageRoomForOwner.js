import React, { useState, useEffect, onClick} from 'react';
import { useForm } from "react-hook-form";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useSelector } from "react-redux";
import { apiURL } from './Default';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useDispatch } from "react-redux";

const cookies = new Cookies();


// essageRoomそのもののConst
const MessageRoomForOwner = () => {
  // ここで各変数を定義
  const [messages, setMessages] = useState([]);
  const [message_room, setMessageRoom] = useState([]);
  const [post_message, setPostMessage] = useState(false);
  const {id} = useParams();
  const isLoggedIn= useSelector(state => state.user.isLoggedIn);
  const userID= useSelector(state => state.user.userID);
  const dispatch = useDispatch();
  // resetはFormが送信されたときに、打ち込んだテキストをリセットするときに使用する
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();

  // メッセージルームをGetする用のミニConst(投稿者用)
  const getMessageRoomFromPostUser = async(data) => {
    await axios.get(apiURL+'messagerooms/' + id,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${cookies.get('accesstoken')}`
        },
      })
      .then(result => {
      // もし、レスポンスがstatus=status.HTTP_200_OKであれば、すなわちMessageRoomが既に作成済みであれば、下記を実行
      // レスポンスのstatusは以下で取得可能です．
      // result.status
      if (result.status === 200) {
        setMessageRoom(result.data);
        setMessages(result.data.messages);
      }

      })
      .catch(err => {
        console.log(err);
      });
  }

  // コンポーネントマウント時の処理
  //   今回、useEffectの依存配列がキーワードと言いましたが、useEffectの依存配列とはある変数が変更された場合に再描画（useEffectを実行）させる働きです。
  // useEffect(() => {
  //     getMessageRoom();
  //   },[]);
  // 上の例ですと、useEffectの第二引数は[]であり、空なので初回レンダー時のみuseEffectが発火します。
  // useEffect(() => {
  //     getMessageRoom();
  //   },[count]);
  // ですが、この例ですとuseEffectの第二引数にcountが指定されており、countが変更されるたびにuseEffectが発火し、再描画されることになります。
  // ＊countという変数は例ですが、このcountに指定した部分にあるフラグ（true or falseなど）を指定してあげて、MessageがPOSTされるたびにそのフラグを切り替えることで、MessageがPOSTされるたびに画面が再描画（画面上に新たなMessageが表示）されることとなります。
  useEffect(() => {
    getMessageRoomFromPostUser();
  },[post_message]);


  // メッセージをPostする用のミニConst
  const PostMessage = async (data) => {
    // こちらは以前にもありましたが、formdata形式でリクエストを送るために、空のFormDataオブジェクトを生成しています。それに、append()を用いてキーと値を追加して行っているということです。
    // https://developer.mozilla.org/ja/docs/Web/API/FormData/FormData
    let formdata = new FormData();
    // Form から取得した値をFormDataへ追加していく
    formdata.append('message', data.message);
    // ReactのuseEffect内（getMessageRoom ()）で，/open_messageroomにアクセスしてMessageRoomの情報はあらかじめ取得しております．
    // そしてそのMessageRoomの情報をsetMessageRoom()を用いてmessage_roomという変数に格納していますよね？
    // つまり，以下のようにformdataに追加し，リクエストすれば良いはずです．
    formdata.append('message_room', message_room.id);
    const result = await axios.post(
      apiURL+'messages/',formdata,{
        headers: {
          'content-type': 'multipart/form-data',
          'Authorization': `JWT ${cookies.get('accesstoken')}`
    }})
    // 上記の意味は、「axiosを用いてapiURL+'messages/'というエンドポイントに、formdataをpostします。また、その際にリクエストヘッダに‘content-type’の種類やJWTを付加します」
    // ということです。
    // そして、上記で述べたaxios形式でしたら、リクエストの中身がformdataになります。
    // ですのでformdataという変数に‘message’と‘message_roomフィールド’を追加し、あらかじめ用意しているということです。
    // 極端に言えば、別にformdataを用いず（‘content-type’: ‘multipart/form-data’）ではなくJSON形式でaxiosリクエストを送る方法でも可能です。JSON形式の場合は‘content-Type’: ‘application/json’となり、以下のようにリクエストできます。この場合、formdataというFormData形式の変数は用いなくて大丈夫です。
    // await axios.post(apiURL+'messages/',{
    //   message: data.message,
    //   message_room: message_room.id,
    // },{
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `JWT ${cookies.get('accesstoken')}`
    //   }
    // })
    // ＊ただし、画像を含むリクエスト内容を送信する場合はJSONではなくformdata形式でリクエストする必要があります。
    .then(result => {
      // const [flug,setFlug] = useState(false)
      // のようにフラグに用いる変数をセットし
      // MessageをPostした際に
      // setFlug(!flug)
      // とすることでtrue / false の切り替えが可能になります．
      // then()の内部は、postが成功した後の処理を記述します。
      console.log(result.data.id);
      setPostMessage(!post_message);
      // resetはFormが送信されたときに、打ち込んだテキストをリセットするときに使用する
      reset();
    })
    .catch(err => {
      alert("error");
      console.log(err);
    });
  }

  return(
    <div>
        {/* 下記は過去のメッセージのやりとりを表示する用 */}
        {/* messageroomでMeessageがすでに作成済み時は下記を表示 */}
        {/* 参考文献
        https://chaika.hatenablog.com/entry/2019/05/16/083000 */}
        <div>
          {messages && 
            <div>
                {messages.map(item => (
                    <div>
                      <p>{item.message}</p>
                      <p>{item.message_user}</p>
                      <p>{item.create_time}</p>
                    </div>
                  ))}
            </div>
          }
        </div>
        {/* register関数を用いることでフォーム入力の要素を引数の名前（仮にxxx）で登録し、data.xxxで取得できるようになっています。
        今回の例ですと、messageを入力するフィールドに
        {...register('message', { required: true })}
        とすることでmessageという名前がつけられており、data.messageとすることでその中身が取り出せるという流れです。register関数の第二引数はそのフィールドのルール（バリデーション）を追加できます。例では入力必須というルールが追加されています。 */}

        <form onSubmit={handleSubmit(PostMessage)}>
        <label for="message"></label>
        <input placeholder="Message" className='form-control' {...register('message', { required: true })} />
        {errors.title && <p>Please put title</p>}
        <input className='btn btn-secondary' type="submit" value="Send" />
        </form>
        <Link to={`/post/id`} className='btn btn-secondary'>Back to Detail</Link>
    </div>
    )
}
export default MessageRoomForOwner;