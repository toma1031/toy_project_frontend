import React, { useState, useEffect, onClick} from 'react';
import axios from 'axios';
import { apiURL } from './Default';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const LikeButton = () => {
    const [ like, setLike ] = useState({ count: 0, liked: false });
    const {id} = useParams();

    const onClick = () => {
        setLike({
            count: like.count + (like.liked ? -1 : 1),
            liked: !like.liked
        });
    }
    
    // Likeする用のミニConst
    const Like = async(data) => {
      await axios.get(apiURL+'posts/'+ id + '/like/',
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
            setLike(result.data);
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

    useEffect(() => {
      Like();
    },[true]);

    return (
        <>
            <button onClick={onClick}>
            {like.liked ? '✔' : ''}いいね！
            </button>
            {like.count}
        </>
    );
}

export default LikeButton;