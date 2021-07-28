import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';

const Header = (props) => {

    return (
      <div>
        <Navbar className="navbar navbar-dark bg-success">
          <Container>
            <Navbar.Brand href="/">Retro Toys</Navbar.Brand>
            <Nav className="me-right">
              <Nav.Link href="/">Top</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="">Register</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </div>
    );
  }

  export default Header ;