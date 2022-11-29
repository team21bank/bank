import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import React from "react";
import "./DefaultHomePage.css";
import { QuizMain } from "../../Quiz/QuizMain";

export function DefaultHomePage(): JSX.Element {
  const vis = false;

  return (
  <div className="home-page">
    <header className="home-page-header">
      <h1>Banking Application</h1>
      <h5>{"(WIP)"}</h5>
    </header>
    <Link to="/login"><Button className="start-button">Login</Button></Link>
    <Link to="/register"><Button className="start-button">Register</Button></Link>
    {vis && <QuizMain></QuizMain>}
  </div>)
}