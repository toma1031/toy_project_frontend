import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
// useSelectorでReduxStoreから情報を取り出せる
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom'

const Header = (props) => {
  const isLoggedInOn = useSelector(state => state.user.isLoggedIn);

    return (
      <div>
        <Navbar className="navbar navbar-dark bg-success">
          <Container>
            <Navbar.Brand href="/">Retro Toys</Navbar.Brand>
            <Nav className="me-right">
              {/* Nav.Link はページをリロードさせるので、Reduxのstateを維持できません。<Link>を用いる必要があります。
              参考文献
              https://qiita.com/k-penguin-sato/items/e46725edba00013a8300 */}
              <Link to="/">Top</Link>
              <Link to="/about">About</Link>
              {/* ログインしていない時、表示 */}
              {(isLoggedInOn === false) &&
              <Link to="/login">Login</Link>}
              {/* ログインしていない時、表示 */}
              {(isLoggedInOn === false) &&
              <Link to="/signup">Signup</Link>}
              {/* ログインしていたら表示する */}
              {(isLoggedInOn === true) &&
              <Link to="/logout">Logout</Link>}
              {/* ログインしていたら表示する */}
              {(isLoggedInOn === true) &&
              <Link to="/mypage">My Page</Link>}
              {(isLoggedInOn === true) &&
              <Link to="/post">Post</Link>}
              {(isLoggedInOn === true) &&
              <Link to="/messagerooms">Message Room</Link>}

              {/* <Nav.Link href="/">Top</Nav.Link> */}
              {/* ログインしていない時、表示 */}
              {/* {(isLoggedInOn === false) &&
              <Nav.Link href="/login">Login</Nav.Link>} */}
              {/* ログインしていない時、表示 */}
              {/* {(isLoggedInOn === false) &&
              <Nav.Link href="/signup">Signup</Nav.Link>} */}
              {/* ログインしていたら表示する */}
              {/* {(isLoggedInOn === true) &&
              <Nav.Link href="/logout">Logout</Nav.Link>} */}
              
            </Nav>
          </Container>
        </Navbar>
      </div>
    );
  }

  export default Header ;