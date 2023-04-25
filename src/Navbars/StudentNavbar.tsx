import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth } from "../firebase";
import { signOut } from 'firebase/auth';
import { USER_STORAGE_KEY, change_bank, change_user } from '../Authentication/auth';
import "./StudentNavbar.css";
import { LogoutButton } from '../Authentication/Logout/Logout';


export function StudentNavbar(): JSX.Element {
    return (
    <Container fluid>
      <Navbar bg="light" sticky="top" expand="lg" style={{fontSize: "140%", paddingInline: "3vw"}}>
        <Container>
          <Navbar.Brand href="#/students/home" style={{fontSize: "140%"}}>Student</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#/students/home">View Classes</Nav.Link>
          </Nav>
          <NavDropdown title="Manage Account" className='justify-content-end'>
              <NavDropdown.Item href="#/editprofile">Edit Profile</NavDropdown.Item>
              <LogoutButton/>
          </NavDropdown>
        </Container>
      </Navbar>
      <Outlet/>
    </Container>
    );
}