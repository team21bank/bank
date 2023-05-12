import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { BankContext } from '../Authentication/auth';
import "./StudentNavbar.css";
import { LogoutButton } from '../Authentication/Logout/Logout';
import { changeFontOfEverything } from '../FontFunctions/ChangeFont';


export function StudentNavbar(): JSX.Element {
    let bank = useContext(BankContext).bank;
    return (
    <Container fluid>
      <Navbar bg="light" sticky="top" expand="lg" style={{fontSize: "140%", paddingInline: "3vw"}}>
        <Container>
          <Navbar.Brand href="#/students/home" style={{fontSize: "140%"}}>Student</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#/students/home">Classes</Nav.Link>
            {bank.bankId!=="" ? (<Nav.Link href={"#/students/"+bank.bankId}>Back to Class</Nav.Link>) : (<></>)}
          </Nav>
          <NavDropdown title="Manage Account" className='justify-content-end'>
              <NavDropdown.Item href="#/editprofile">Edit Profile</NavDropdown.Item>
              <NavDropdown.Item id="fancyFontToggle" style={{fontFamily: "Papyrus, sans-serif"}} onClick={() => changeFontOfEverything("Papyrus, sans-serif")}>Select Fancy Font (persists until refresh)</NavDropdown.Item>
              <NavDropdown.Item id="plainFontToggle" style={{fontFamily: "Helvetica, sans-serif"}} onClick={() => changeFontOfEverything("Helvetica, sans-serif")}>Select Plain Font (persists until refresh)</NavDropdown.Item>
              <LogoutButton/>
          </NavDropdown>
        </Container>
      </Navbar>
      <Outlet/>
    </Container>
    );
}