import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./LoadingPage.css";

export function LoadingPage() {
    return(
        <div className="loading-page">
            <h1>LOADING...</h1>
            <Link to="/"><Button>Back To Home</Button></Link>
        </div>
    )
}