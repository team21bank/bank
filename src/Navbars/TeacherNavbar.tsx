import { ListGroup, Button, Navbar, Container, Nav, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import "../firebase";


export function TeacherNavbar(): JSX.Element {
    return (
    <div>
      <Navbar bg="light" sticky="top" expand="lg" style={{"flexDirection": "column"}}>
        <Container>
          <Navbar.Brand href="/teachers/home">Teacher</Navbar.Brand>
          <Nav>
            <Nav.Link href="/teachers/home">Back to home</Nav.Link>
          </Nav>
        </Container>
        <Outlet></Outlet>
      </Navbar>
    </div>
    );
}