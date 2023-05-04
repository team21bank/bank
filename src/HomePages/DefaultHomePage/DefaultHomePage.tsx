import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./DefaultHomePage.css";

export function DefaultHomePage(): JSX.Element {
  //@ts-expect-error
  const globalFontStylesheet = [...document.styleSheets].find((sheet) => 
  //@ts-expect-error
  [...sheet.cssRules].reduce((rules: String, curRule: CSSRule) => curRule.style ? rules += curRule.style.cssText : "", "").includes("appcss"));
  
  const bodyRule = globalFontStylesheet ? [...globalFontStylesheet.cssRules].find(
    (r) => r.selectorText === "body"): null;
    
  const codeRule = globalFontStylesheet ? [...globalFontStylesheet.cssRules].find(
    (r) => r.selectorText === "code") : null;

  function disableGlobalFont(): void {
    if (bodyRule) {
      bodyRule.style.setProperty("font-family", "Helvetica, sans-serif");
    }
    if (codeRule) {
      codeRule.style.setProperty("font-family", "Helvetica, sans-serif");
    }
  }

  return (
    <div className="home-page">
      <header className="home-page-header">
        <h1>Banking Application</h1>
        <h5>{"(WIP)"}</h5>
      </header>
      <Link to="/login"><Button size="lg" className="start-button">Login</Button></Link>
      <Link to="/register"><Button size="lg" className="start-button">Register</Button></Link>
      <span style={{fontFamily: "sans-serif"}}>
      <Button onClick={() => disableGlobalFont()}>Enable Plain Font (persists until refresh)</Button>
      </span>
    </div>
  )
}