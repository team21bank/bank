import { LogoutButton } from "../../Authentication/Logout/Logout";
import { ClassCodeForm } from "../../ClassCode/ClassCodes";
import React, { useContext, useEffect, useState } from 'react';
import "./TeacherHomePage.css";
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import { BankUser } from "../../Interfaces/BankUser";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";

export function TeacherHomePage(){
    const userContext = useContext(AuthContext);
    if(userContext == null) return <NoUserPage />;

    const [userObj, setUserObj]  = useState<BankUser>();
    if(!userObj) getCurrentUser(userContext.state, setUserObj);
    
    return userObj ? (
        <div className="teacher-home">
            <h2>Hello {userObj.username}</h2>
            <ClassCodeForm></ClassCodeForm>
            <LogoutButton></LogoutButton>
        </div>
    ) : (
        <div className="teacher-home">
            <h2>LOADING...</h2>
        </div>
    )

}