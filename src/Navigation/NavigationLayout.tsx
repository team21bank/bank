import React from 'react';
import { ListGroup, Button, Navbar, Container, Nav, Row } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import "./NavigationLayout.css";


export function NavigationLayout(): JSX.Element {

    return (
    <div>
      <Navbar bg="white" variant="light" sticky="top" fixed="top">
        <Container>
          <Row>
            <Navbar.Brand>UDEL</Navbar.Brand>
            <Nav>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/login">login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </Nav>
          </Row>
        </Container>
        <Outlet></Outlet>
      </Navbar>
    </div>
    );
}