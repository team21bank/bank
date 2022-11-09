import React, { useContext } from 'react';
import { AuthContext } from "../../Authentication/auth";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import "./StudentClassPage.css";

export function StudentClassPage({classCode}:{classCode:string}){
    const user = useContext(AuthContext);

    return user.user ? (
        <div className="student-class-page">
            Welcome to {classCode.slice(6)}
        </div>
    ) : (
        <LoadingPage/>
    )
}