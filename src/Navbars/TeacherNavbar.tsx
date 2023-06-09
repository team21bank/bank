import { Navbar, Container, Nav, NavDropdown, NavLink, Row } from 'react-bootstrap';
import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import "../firebase";

import "./TeacherNavbar.css";
import { LogoutButton } from '../Authentication/Logout/Logout';
import { BankContext } from '../Authentication/auth';
import { changeFontOfEverything } from '../FontFunctions/ChangeFont';


export function TeacherNavbar(): JSX.Element {
    const bank = useContext(BankContext).bank;

    return (
      <Container fluid>
          <Navbar bg="light" sticky="top" expand="lg" style={{fontSize: "140%", paddingInline: "3vw"}}>
            <Container>
              <Navbar.Brand href="#/teachers/home" style={{fontSize: "140%"}}>Teacher</Navbar.Brand>
              <Nav className='me-auto' >
                <NavLink href="#/teachers/classes">View classes</NavLink>
                {bank.bankId!=="" ? (<Nav.Link href={"#/teachers/"+bank.bankId}>Back to Class</Nav.Link>) : (<></>)}
                <Nav.Link href="#/teachers/quizzes">Quizzes</Nav.Link>
              </Nav>
              <NavDropdown title="Manage Account" className="justify-content-end">
                  <NavDropdown.Item href="#/editprofile">Edit Profile</NavDropdown.Item>
                  <NavDropdown.Item id="fancyFontToggle" style={{fontFamily: "Papyrus, sans-serif"}} onClick={() => changeFontOfEverything("Papyrus, sans-serif")}>Select Fancy Font (persists until refresh)</NavDropdown.Item>
                  <NavDropdown.Item id="fancyFontToggle" style={{fontFamily: "Helvetica, sans-serif"}} onClick={() => changeFontOfEverything("Helvetica, sans-serif")}>Select Plain Font (persists until refresh)</NavDropdown.Item>
                  <LogoutButton/>
              </NavDropdown>
            </Container>
          </Navbar>
        <Outlet/>
      </Container>
    );
}