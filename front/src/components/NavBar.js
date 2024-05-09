import React, { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavBar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar
      expanded={expanded}
      expand="lg"
      className="bg-body-tertiary"
      data-bs-theme="dark"
    >
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img
              alt=""
              src="favicon.ico"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            FlexFlexFlexFlex
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <LinkContainer to="/">
              <Nav.Link onClick={() => setExpanded(false)}>Search</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/settings">
              <Nav.Link onClick={() => setExpanded(false)}>Settings</Nav.Link>
            </LinkContainer>
            <Nav.Link
              onClick={() => {
                window.open(
                  "https://github.com/connbrack/flex-app-2",
                  "_blank"
                );
                setExpanded(false);
              }}
            >
              GitHub
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
