import { Navbar, Container, Nav, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import "../firebase";
import "./StudentNavbar.css";


export function StudentNavbar(): JSX.Element {
    return (
    <div>
      <Navbar bg="light" sticky="top" expand="lg" style={{"flexDirection": "column"}}>
        <Container className="student-nav-container">
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