import React, { useContext } from 'react';
import "./TeacherHomePage.css";
import { AuthContext } from "../../Authentication/auth";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import { ClassList } from "../../ClassCode/ClassList";
import { QuizMain } from '../../Quizzes/QuizMain';

export function TeacherHomePage(){
    const user = useContext(AuthContext);

    
    return user.user ? (
        <div className="teacher-home">
            <h2>Hello {user.user.username}</h2>
            <br />
            <div>Classes: </div>
            <ClassList classes={user.user.groups}/>
        </div>
    ) : (
        <LoadingPage/>
    )

}