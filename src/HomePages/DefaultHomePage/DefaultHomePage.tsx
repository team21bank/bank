import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import React from "react";
import "./DefaultHomePage.css";
import { QuizPage } from "../../Quizzes/QuizPage";
import { change_user } from "../../Authentication/auth";

export function DefaultHomePage(): JSX.Element {
  return (
    <div className="home-page">
      <header className="home-page-header">
        <h1>Banking Application</h1>
        <h5>{"(WIP)"}</h5>
      </header>
      <Link to="/login"><Button size="lg" className="start-button">Login</Button></Link>
      <Link to="/register"><Button size="lg" className="start-button">Register</Button></Link>
    </div>
  )
}