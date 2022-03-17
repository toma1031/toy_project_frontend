import React, { useState, useEffect, onClick} from 'react';
import { useForm } from "react-hook-form";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useSelector } from "react-redux";
import { apiURL } from './Default';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useDispatch } from "react-redux";


const cookies = new Cookies();

// MssageRoomListそのもののConst
const MessageRoomList = () => {
  // ここで各変数を定義
  const history = useHistory();
  const [messagerooms, setMessageRoomList] = useState([]);
  const {id} = useParams();
  const isLoggedIn= useSelector(state => state.user.isLoggedIn);
  const userID= useSelector(state => state.user.userID);
  // JSX内での
  // messagerooms[0].inquiry_user.id
  // messagerooms[0].post.user
  // これらの記述か問題でしたので、
  // コンポーネント上部でuseStateで変数を用意し、その変数に最初のメッセージのユーザー情報を入れ込むのがいいかなと思います。
  const [inquiry_user,setInquiryUser] = useState('');
  const [post_user, setPostUser] = useState('');

// メッセージルームのリストをGetする用のミニConst（質問者用）
const getMessageRoomList = async(data) => {
  await axios.get(apiURL+'messagerooms/my_messagerooms',
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${cookies.get('accesstoken')}`
      },
    })
    .then(result => {
      // もし、レスポンスがstatus=status.HTTP_200_OKであれば、すなわちMessageRoomが1つでも既に作成済みであれば、下記を実行
    if (result.status === 200) {
        setInquiryUser(result.data[0].inquiry_user.id);
        setPostUser(result.data[0].post.user);
        console.log(result.data);
        console.log(result.data[0].id);
        console.log(result.data[0].post.id);
        console.log(result.data[0].username);
        console.log(result.data[0].inquiry_user.id);
        console.log(userID);
        console.log(result.data[0].post.user);
        setMessageRoomList(result.data);

    }
    })
    .catch(err => {
      if (err.response.status === 406){
        
        history.push('/');
      }
    });
}

useEffect(() => {
  getMessageRoomList();
},[]);

  return(
    <div>
        {/* メッセージルームを表示する用 */}
        {/* MeessageRoomのListがすでに作成済み時は下記を表示 */}
        {/* 参考文献
        https://chaika.hatenablog.com/entry/2019/05/16/083000 */}
        {/* ログインしているユーザーのIDと質問者のIDが一致、もしくは、
        ログインしているユーザーのIDと投稿者のIDが一致、
        しているなら下記を実行（そのユーザーのMessageroomsを表示） */}

        {messagerooms ?
          <>
        {inquiry_user === userID || post_user === userID ?
          <div>
              <div>
                  {messagerooms.map(item => (
                      <div>
                        <p>---------</p>
                        <p>Post ID: {item.post.id}</p>
                        <p>Post Title: {item.post.title}</p>
                        <p>Inquiry User: {item.inquiry_user.username}</p>
                        <p>Toy's Owner: {item.username}</p>
                        <Link to={`/messagerooms/${item.id}`} className='btn btn-primary'>Go to Message Room</Link>
                      </div>
                    ))}
              </div>
            <div>
              <Link to={`/`} className='btn btn-secondary'>Back to Top</Link>
            </div>
          </div>
        :
          <div>
            <p>Can't find Page</p>
          </div>
        }
        </>
        :
          <div>
            <p>Can't find Page</p>
          </div>
        }
    </div>
  )
}
export default MessageRoomList;


