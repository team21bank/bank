import { LogoutButton } from "../../Authentication/Logout/Logout";
import { ClassCodeForm } from "../../ClassCode/ClassCodes";
import React, { useContext, useState } from 'react';
import "./TeacherHomePage.css";
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import { BankUser } from "../../Interfaces/BankUser";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import { ClassList } from "../../ClassCode/ClassList";

export function TeacherHomePage(){
    const [userObj, setUserObj]  = useState<BankUser>();
    const userContext = useContext(AuthContext);

    if(userContext == null) return <NoUserPage />;
    if(!userObj) getCurrentUser(userContext.state, setUserObj);

    
    return userObj ? (
        <div className="teacher-home">
            <h2>Hello {userObj.username}</h2>
            <ClassCodeForm></ClassCodeForm>
            <br />
            <div>Classes: </div>
            <ClassList classes={userObj.groups}/>
            
        </div>
    ) : (
        <div className="teacher-home">
            <h2>LOADING...</h2>
        </div>
    )

}