import { ListGroup, Button, Navbar, Container, Nav, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import "../firebase";
import "./NavigationLayout.css";


export function StudentNavbar(): JSX.Element {
    return (
    <div>
      <Navbar bg="white" variant="light" sticky="top">
        <Container style={{"width": "100%"}}>
          <Navbar.Brand href="/">Student</Navbar.Brand>
          <Nav>
            <Nav.Link href="/">Back to home</Nav.Link>
          </Nav>
        </Container>
        <Outlet></Outlet>
      </Navbar>
    </div>
    );
}