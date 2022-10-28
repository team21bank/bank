import { Navbar, Container, Nav } from 'react-bootstrap';
import React from 'react';
import { Outlet } from 'react-router-dom';
import "../firebase";
import { LogoutButton } from "../Authentication/Logout/Logout";


export function StudentNavbar(): JSX.Element {
    return (
    <div>
      <Navbar bg="light" sticky="top" expand="lg" style={{"flexDirection": "column"}}>
        <Container>
          <Navbar.Brand href="/students/home">Student</Navbar.Brand>
          <Nav>
            <Nav.Link href="/students/home">Back to home</Nav.Link>
            <Nav.Link href="/students/joinclass">Join Class</Nav.Link>
            <LogoutButton></LogoutButton>
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