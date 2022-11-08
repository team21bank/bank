import React, { useContext } from 'react';
import "./TeacherHomePage.css";
import { AuthContext } from "../../Authentication/auth";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import { ClassList } from "../../ClassCode/ClassList";
import { QuizMain } from '../../Quizzes/QuizMain';

export function TeacherHomePage(){
    const user = useContext(AuthContext);

    if(user.user == null) return <NoUserPage />;
    
    return user.user ? (
        <div className="teacher-home">
            <h2>Hello {user.user.username}</h2>
            <br />
            <div>Classes: </div>
            <ClassList classes={user.user.groups}/>
        </div>
    ) : (
        <div className="teacher-home">
            <h2>LOADING...</h2>
        </div>
    )

}