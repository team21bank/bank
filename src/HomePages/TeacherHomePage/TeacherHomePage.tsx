import { LogoutButton } from "../../Authentication/Logout/Logout";
import { ClassCodeForm } from "../../ClassCode/ClassCodes";
import React, { useContext, useEffect, useState } from 'react';
import "./TeacherHomePage.css";
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import { BankUser } from "../../Interfaces/BankUser";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import { ImportRoster } from "../../Authentication/ImportRoster/ImportRoster";

export function TeacherHomePage(){
    const [userObj, setUserObj]  = useState<BankUser>();
    const userContext = useContext(AuthContext);
    if(userContext == null) return <NoUserPage />;

    if(!userObj) getCurrentUser(setUserObj);
    
    return userObj ? (
        <div className="teacher-home">
            <h2>Hello {userObj.username}</h2>
            <ClassCodeForm></ClassCodeForm>
            <LogoutButton></LogoutButton>
            <ImportRoster currentGroup="testgr"></ImportRoster>
        </div>
    ) : (
        <div className="teacher-home">
            <h2>LOADING...</h2>
        </div>
    )

}