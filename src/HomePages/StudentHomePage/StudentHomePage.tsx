import React, { useContext } from 'react';
import { AuthContext } from "../../Authentication/auth";
import "./StudentHomePage.css";
import { JoinClassButton } from "../../ClassCode/JoinClass/JoinClass"
import { ClassList } from '../../ClassCode/ClassList';
import { DEFAULT_AUTH_USER } from '../../Interfaces/AuthUser';


export function StudentHomePage(){
    const current_user = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;
    return (
        <div className="student-home">
            <h2>Hello {current_user.username}</h2>
            <br />
            <div>My Classes:</div>
            <ClassList classes={current_user.groups}/>
            <br />
            <JoinClassButton />
            <br />
        </div>
    );
}