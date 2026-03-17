import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";

import { signout } from "../actions/userActions";

export default function MainHeader() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userState);

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>NotaryHub</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <LinkContainer to="/subscription">
              <Nav.Link>Subscription</Nav.Link>
            </LinkContainer>
            {userInfo && (
              <LinkContainer to="/profile">
                <Nav.Link>Profile</Nav.Link>
              </LinkContainer>
            )}
            {userInfo && (
              <LinkContainer to="/chatbot">
                <Nav.Link>AI Chatbot</Nav.Link>
              </LinkContainer>
            )}
            {userInfo?.role === "Admin" && (
              <>
                <LinkContainer to="/admin/users">
                  <Nav.Link>Users</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin/subscriptions">
                  <Nav.Link>Subscription List</Nav.Link>
                </LinkContainer>
              </>
            )}
            {userInfo?.role === "Seller" && (
              <LinkContainer to="/seller/dashboard">
                <Nav.Link>Seller Dashboard</Nav.Link>
              </LinkContainer>
            )}
            {userInfo && (
              <LinkContainer to="/apply-seller">
                <Nav.Link>Apply Seller</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          <Nav>
            {userInfo ? (
              <Button variant="light" size="sm" onClick={() => dispatch(signout())}>
                Sign Out
              </Button>
            ) : (
              <>
                <LinkContainer to="/signin">
                  <Nav.Link>Sign In</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/signup">
                  <Nav.Link>Sign Up</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
