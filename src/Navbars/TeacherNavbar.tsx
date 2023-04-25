import { Navbar, Container, Nav, NavDropdown, NavLink, Row } from 'react-bootstrap';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import "../firebase";

import "./TeacherNavbar.css";
import { LogoutButton } from '../Authentication/Logout/Logout';


export function TeacherNavbar(): JSX.Element {
    return (
      <Container fluid>
          <Navbar bg="light" sticky="top" expand="lg" style={{fontSize: "140%", paddingInline: "3vw"}}>
            <Container fluid>
              <Navbar.Brand href="#/teachers/home" style={{fontSize: "140%"}}>Teacher</Navbar.Brand>
              <Nav className='me-auto' >
                <NavLink href="#/teachers/classes">View classes</NavLink>
              </Nav>
              <NavDropdown title="Manage Account" className="justify-content-end">
                  <NavDropdown.Item href="#/editprofile">Edit Profile</NavDropdown.Item>
                  <LogoutButton/>
              </NavDropdown>
            </Container>
          </Navbar>
        <Outlet/>
      </Container>
    );
}