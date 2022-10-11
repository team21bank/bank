import { LogoutButton } from "../../Authentication/Logout/Logout";
import React from 'react';
import { getCurrentUser } from "../../Authentication/auth";
import "./StudentHomePage.css";

export function StudentHomePage(){
    const currUser = getCurrentUser();

    return (
    <div className="student-home">
        <h2>Student Home</h2>
        {currUser ? <div>Hello {currUser.username}</div> : <div> hello</div>}
        <LogoutButton></LogoutButton>
    </div>)
}