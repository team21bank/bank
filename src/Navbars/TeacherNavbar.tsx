import { Navbar, Container, Nav, NavDropdown, NavLink } from 'react-bootstrap';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import "../firebase";
import { signOut } from 'firebase/auth';
import { USER_STORAGE_KEY } from '../Authentication/auth';
import { auth } from '../firebase';
import "./TeacherNavbar.css";
import { LogoutButton } from '../Authentication/Logout/Logout';


export function TeacherNavbar(): JSX.Element {
    const navigate = useNavigate();

    return (
    <div>
      <Navbar bg="light" sticky="top" expand="lg" style={{"flexDirection": "column"}}>
        <Container>
          <Navbar.Brand href="#/teachers/home">Teacher</Navbar.Brand>
          <Nav>
            <NavLink href="#/teachers/classes">View your classes</NavLink>
            <Nav.Link href="#/teachers/createclass">Create New Class</Nav.Link>
          </Nav>
          <Nav className='justify-content-end'>
            <NavDropdown title="Manage Account" className="teacher-nav-dropdown">
                <NavDropdown.Item href="#/editprofile">Edit Profile</NavDropdown.Item>
                <LogoutButton/>
            </NavDropdown>
          </Nav>
        </Container>
        <Outlet></Outlet>
      </Navbar>
    </div>
    );
}