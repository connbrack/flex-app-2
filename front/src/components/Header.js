import {LinkContainer} from 'react-router-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function BasicExample() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme='dark'>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand >
            <img
              alt=""
              src="favicon.ico"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            FlexFlexFlexFlex
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <LinkContainer to="/">
              <Nav.Link>Search</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/settings">
              <Nav.Link>Settings</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;
