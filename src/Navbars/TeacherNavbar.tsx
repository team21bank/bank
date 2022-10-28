import { Navbar, Container, Nav } from 'react-bootstrap';
import React from 'react';
import { Outlet } from 'react-router-dom';
import "../firebase";


export function TeacherNavbar(): JSX.Element {
    return (
    <div>
      <Navbar bg="light" sticky="top" expand="lg" style={{"flexDirection": "column"}}>
        <Container>
          <Navbar.Brand href="/teachers/home">Teacher</Navbar.Brand>
          <Nav>
            <Nav.Link href="/teachers/classes">View your classes</Nav.Link>
            <Nav.Link href="/teachers/home">Back to home</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/editprofile">Manage Account</Nav.Link>
          </Nav>
        </Container>
        <Outlet></Outlet>
      </Navbar>
    </div>
    );
}