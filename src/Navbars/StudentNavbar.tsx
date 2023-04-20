import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth } from "../firebase";
import { signOut } from 'firebase/auth';
import { USER_STORAGE_KEY } from '../Authentication/auth';
import "./StudentNavbar.css";


export function StudentNavbar(): JSX.Element {
    const navigate = useNavigate();

    return (
    <div>
      <Navbar bg="light" sticky="top" expand="lg" style={{"flexDirection": "column"}}>
        <Container>
          <Navbar.Brand href="#/students/home">Student</Navbar.Brand>
          <Nav>
            <Nav.Link href="#/students/home">Back to home</Nav.Link>
          </Nav>
          <Nav className='justify-content-end'>
            <NavDropdown title="Manage Account" className="student-navbar-dropdown">
                <NavDropdown.Item href="#/editprofile">Edit Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={()=>{
                    signOut(auth);
                    window.sessionStorage.removeItem(USER_STORAGE_KEY);
                    navigate("/");
                }}>Log Out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
        <Outlet></Outlet>
      </Navbar>
    </div>
    );
}