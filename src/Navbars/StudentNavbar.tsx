import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { BankContext } from '../Authentication/auth';
import "./StudentNavbar.css";
import { LogoutButton } from '../Authentication/Logout/Logout';


export function StudentNavbar(): JSX.Element {
    let bank = useContext(BankContext).bank;
  
  /**Code that can change the font according to the style sheets, disabling the papyrus-styled fonts.*/
  //@ts-expect-error
  const globalFontStylesheet = [...document.styleSheets].find((sheet) => 
  //@ts-expect-error
  [...sheet.cssRules].reduce((rules: String, curRule: CSSRule) => curRule.style ? rules += curRule.style.cssText : "", "").includes("appcss"));
  
  const bodyRule = globalFontStylesheet ? [...globalFontStylesheet.cssRules].find(
    (r) => r.selectorText === "body"): null;
    
  const codeRule = globalFontStylesheet ? [...globalFontStylesheet.cssRules].find(
    (r) => r.selectorText === "code") : null;

  function enableGlobalFont(): void {
    if (bodyRule) {
      bodyRule.style.setProperty("font-family", "\"appcss\", Papyrus, fantasy");
    }
    if (codeRule) {
      codeRule.style.setProperty("font-family", "\"appcss\", Papyrus, fantasy");
    }
  }
  
  function disableGlobalFont(): void {
    if (bodyRule) {
      bodyRule.style.setProperty("font-family", "\"appcss\", Helvetica, sans-serif");
    }
    if (codeRule) {
      codeRule.style.setProperty("font-family", "\"appcss\", Helvetica, sans-serif");
    }
  }
  /**END GLOBAL FONT CODE*/
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
              <NavDropdown.Item style={{fontFamily: "Papyrus, Fantasy, sans-serif"}} onClick={() => enableGlobalFont()}>Select Fancy Font (persists until refresh)</NavDropdown.Item>
              <NavDropdown.Item style={{fontFamily: "Helvetica"}} onClick={() => disableGlobalFont()}>Select Plain Font (persists until refresh)</NavDropdown.Item>
              <LogoutButton/>
          </NavDropdown>
        </Container>
      </Navbar>
      <Outlet/>
    </Container>
    );
}