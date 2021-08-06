import React,{ useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Row, Container } from 'react-bootstrap';

// useDispatchは更新用
import { useDispatch } from "react-redux";
// 使いたいactionCreatorをimport
import { isLoggedInOff } from "../stores/user";

const Logout = () => {

  const history = useHistory();
  // dispatchを使用する際に、インスタンス化する必要があります。
  const dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies();
  // async は非同期処理（DRFとの通信）の際に使います。Cookieの操作に関してはDRFは関係ないので、asyncを用いる必要はありません。ゆえにconst logout = async (data) =>みたいな書き方は必要ない
  useEffect(() =>{

      // JWTをCookieから削除しトップに遷移する
      removeCookie('accesstoken', { path: '/' }, { httpOnly: true });
      removeCookie('refreshtoken', { path: '/' }, { httpOnly: true });
      // dispatchしたい部分でactionCreatorを呼び出す
      dispatch(isLoggedInOff());
      history.push('/');
      }
  );

  return (
    <Container className="center">
      <Row className="justify-content-md-center">
        <div>
          <h2>Logged out!</h2>
          <div className="text-center">
            <Link to="/login">Go to login page</Link>
          </div>
        </div>
      </Row>
    </Container>
  );

}

export default Logout;