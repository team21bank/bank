import { LogoutButton } from "../../Authentication/Logout/Logout";
import { ClassCodeForm } from "../../ClassCode/ClassCodes";
import React from 'react';
import "./TeacherHomePage.css";

export function TeacherHomePage(){
    return (
        <div className="teacher-home">
            <h2>Teacher Home</h2>
            <ClassCodeForm></ClassCodeForm>
            <LogoutButton></LogoutButton>
        </div>
    );
}