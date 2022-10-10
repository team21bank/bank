import { ListGroup, Button, Navbar, Container, Nav, Row } from 'react-bootstrap';
import { Auth } from 'firebase/auth';
import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ref, getDatabase, push, child, update, get } from '@firebase/database';
import "../firebase";
import "./NavigationLayout.css";
import { Students } from '../UserInterfaces/Students';


export function NavigationLayout({currentUser}: {currentUser: Students}): JSX.Element {

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