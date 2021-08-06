import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
// useSelectorでReduxStoreから情報を取り出せる
import { useSelector } from "react-redux";

const Header = (props) => {
  const isLoggedInOn = useSelector(state => state.user.isLoggedIn);

    return (
      <div>
        <Navbar className="navbar navbar-dark bg-success">
          <Container>
            <Navbar.Brand href="/">Retro Toys</Navbar.Brand>
            <Nav className="me-right">
              <Nav.Link href="/">Top</Nav.Link>
              {/* ログインしていない時、表示 */}
              {(isLoggedInOn === false) &&
              <Nav.Link href="/login">Login</Nav.Link>}
              {/* ログインしていない時、表示 */}
              {(isLoggedInOn === false) &&
              <Nav.Link href="/signup">Signup</Nav.Link>}
              {/* ログインしていたら表示する */}
              {(isLoggedInOn === true) &&
              <Nav.Link href="/logout">Logout</Nav.Link>}
            </Nav>
          </Container>
        </Navbar>
      </div>
    );
  }

  export default Header ;