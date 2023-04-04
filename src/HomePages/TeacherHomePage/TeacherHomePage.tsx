import React, { useContext } from 'react';
import "./TeacherHomePage.css";
import { AuthContext, BankContext } from "../../Authentication/auth";
import { ClassList } from "../../ClassCode/ClassList";
import { QuizPage } from '../../Quizzes/QuizPage';
import { DEFAULT_AUTH_USER } from '../../Interfaces/AuthUser';

export function TeacherHomePage(){
    const current_user = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;

    
    return (
        <div className="teacher-home">
            <h2>Hello {current_user.username}</h2>
            <br />
            <div>Classes: </div>
            <ClassList classes={current_user.groups}/>
        </div>
    )

}