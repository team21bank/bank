import React, { useContext } from 'react';
import { AuthContext } from "../../Authentication/auth";
import "./StudentHomePage.css";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import { JoinClassButton } from "../../ClassCode/JoinClass/JoinClass"
import { ClassList } from '../../ClassCode/ClassList';
import {Button} from "react-bootstrap"
import { useNavigate} from 'react-router-dom';
import { AvatarForm } from '../../Authentication/Avatar/Avatar';
import { QuizMain } from '../../Quiz/QuizMain';

export function StudentHomePage(){
    const user = useContext(AuthContext);

    if(user.user == null) return <NoUserPage />; //display fail page if attempting to access user page without being logged in

    return user.user ? (
        <div className="student-home">
            <h2>Hello {user.user.username}</h2>
            <br />
            <div>My Classes:</div>
            <ClassList classes={user.user.groups}/>
            <br />
            <JoinClassButton />
            
        </div>
    ) : (
        <div className="student-home">
            <h2>LOADING...</h2>
        </div>
    )
}