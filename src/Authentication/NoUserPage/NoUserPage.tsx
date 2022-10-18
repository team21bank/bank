import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export function NoUserPage() {
    return(
        <div>
            <h2>You are not logged in!</h2>
            <Link to="/"><Button>Back To Home</Button></Link>
        </div>
    )
}