import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./DefaultHomePage.css";
import { changeFontOfEverything } from "../../FontFunctions/ChangeFont";

export function DefaultHomePage(): JSX.Element {

  return (
    <div className="home-page">
      <div className="home-page-contents">
        <header className="home-page-header">
          <h1>Banking Application</h1>
        </header>
        <Link to="/login"><Button size="lg" className="start-button">Login</Button></Link>
        <Link to="/register"><Button size="lg" className="start-button">Register</Button></Link>
        <br />
        <Button id="plainFontToggle" style={{fontFamily: "Helvetica, sans-serif"}} onClick={() => changeFontOfEverything("Helvetica, sans-serif")}>Enable Plain Font (persists until refresh)</Button>
        <div style={{padding: "2px"}}></div>
        <Button id="fancyFontToggle" style={{fontFamily: "Papyrus, sans-serif"}} onClick={() => changeFontOfEverything("Papyrus, sans-serif")}>Enable Fancy Font (persists until refresh)</Button>
        <br />
        <span id="plainFontToggle" style={{fontFamily: "Helvetica, sans-serif", color: "white"}}>The fonts can also be toggled on and off after you are logged in.</span>
        
      </div>
    </div>
  )
}