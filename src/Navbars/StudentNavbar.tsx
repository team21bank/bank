import { Navbar, Container, Nav, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import "../firebase";


export function StudentNavbar(): JSX.Element {
    return (
    <div>
      <Navbar bg="light" sticky="top" expand="lg" style={{"flexDirection": "column"}}>
        <Container>
          <Navbar.Brand href="/students/home">Student</Navbar.Brand>
          <Nav>
            <Nav.Link href="/students/home">Back to home</Nav.Link>
          </Nav>
        </Container>
        <Outlet></Outlet>
      </Navbar>
    </div>
    );
}