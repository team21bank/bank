import React, { useContext } from 'react';
import { AuthContext } from "../../Authentication/auth";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import "./StudentClassPage.css";

export function StudentClassPage({classCode}:{classCode:string}){
    const user = useContext(AuthContext);
    
    if(user.user == null) return <NoUserPage />; //display fail page if attempting to access user page without being logged in


    return (<div className="student-class-page">
        Welcome to {classCode.slice(6)}
    </div>)
}