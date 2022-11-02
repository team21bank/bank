import React, { useContext, useState } from 'react';
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import "./StudentHomePage.css";
import { BankUser } from "../../Interfaces/BankUser";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import { JoinClassButton } from "../../ClassCode/JoinClass/JoinClass"
import { ClassList } from '../../ClassCode/ClassList';

export function StudentHomePage(){
    const userContext = useContext(AuthContext);
    const [userObj, setUserObj]  = useState<BankUser>();

    if(userContext.state == null) return <NoUserPage />; //display fail page if attempting to access user page without being logged in
    if(!userObj) getCurrentUser(userContext.state, setUserObj);

    return userObj ? (
        <div className="student-home">
            <h2>Hello {userObj.username}</h2>
            <br />
            <div>My Classes:</div>
            <ClassList classes={userObj.groups}/>
            <br />
            <JoinClassButton />
            
        </div>
    ) : (
        <div className="student-home">
            <h2>LOADING...</h2>
        </div>
    )
}