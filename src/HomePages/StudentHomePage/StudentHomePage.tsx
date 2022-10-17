import { LogoutButton } from "../../Authentication/Logout/Logout";
import React, { useContext, useState } from 'react';
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import "./StudentHomePage.css";
import { BankUser } from "../../Interfaces/BankUser";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import {JoinClassButton} from "../../ClassCode/JoinClass/JoinClass"

export function StudentHomePage(){
    const userContext = useContext(AuthContext);
    if(userContext.state == null) return <NoUserPage />; //display fail page if attempting to access user page without being logged in

    const [userObj, setUserObj]  = useState<BankUser>();
    if(!userObj) getCurrentUser(setUserObj);

    
    return userObj ? (
        <div className="student-home">
            <h2>Hello {userObj.username}</h2>
            <JoinClassButton></JoinClassButton>
            <LogoutButton></LogoutButton>
        </div>
    ) : (
        <div className="student-home">
            <h2>LOADING...</h2>
        </div>
    )
}