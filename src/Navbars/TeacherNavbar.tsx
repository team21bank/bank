import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import "../firebase";
import { signOut } from 'firebase/auth';
import { STORAGE_KEY } from '../Authentication/auth';
import { auth } from '../firebase';
import "./TeacherNavbar.css";


export function TeacherNavbar(): JSX.Element {
    const navigate = useNavigate();

    return (
    <div>
      <Navbar bg="light" sticky="top" expand="lg" style={{"flexDirection": "column"}}>
        <Container>
          <Navbar.Brand href="/teachers/home">Teacher</Navbar.Brand>
          <Nav>
            <Nav.Link href="/teachers/classes">View your classes</Nav.Link>
            <Nav.Link href="/teachers/home">Back to home</Nav.Link>
          </Nav>
          <Nav className='justify-content-end'>
            <NavDropdown title="Manage Account" className="teacher-nav-dropdown">
                <NavDropdown.Item href="/editprofile">Edit Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={()=>{
                    signOut(auth);
                    window.sessionStorage.removeItem(STORAGE_KEY);
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