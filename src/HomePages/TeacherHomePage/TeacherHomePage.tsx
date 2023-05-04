import React, { useContext } from 'react';
import "./TeacherHomePage.css";
import { AuthContext, BankContext } from "../../Authentication/auth";
import { ClassList } from "../../ClassCode/ClassList";
import { DEFAULT_AUTH_USER } from '../../Interfaces/AuthUser';
import { CreateClassModal } from '../../ClassCode/CreateClassModal';

export function TeacherHomePage(){
    const current_user = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;

    
    return (
        <div id = "feastBackdrop" className="teacher-home">
            <h2 style={{ backgroundColor: "white" }}>Hello {current_user.username}</h2>
            <br />
            <ClassList classes={current_user.groups}/>
            <CreateClassModal/>
        </div>
    )

}