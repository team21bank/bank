import { ListGroup, Button, Navbar, Container, Nav, Row, Col, NavDropdown } from 'react-bootstrap';
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
            <Nav.Link href="/teachers/classes">View your classes</Nav.Link>
            <Nav.Link href="/teachers/account">Manage your account</Nav.Link>
            <Nav.Link href="/teachers/home">Back to home</Nav.Link>
            <Nav.Link href="/teachers/changeusername">Change Username</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/editprofile">Edit Profile</Nav.Link>
          </Nav>
        </Container>
        <Outlet></Outlet>
      </Navbar>
    </div>
    );
}