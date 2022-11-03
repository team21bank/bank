import React, { useContext, useState } from 'react';
import "./TeacherHomePage.css";
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import { AuthUser } from "../../Authentication/auth";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import { ClassList } from "../../ClassCode/ClassList";

export function TeacherHomePage(){
    const [userObj, setUserObj]  = useState<AuthUser>();
    const userContext = useContext(AuthContext);

    if(userContext == null) return <NoUserPage />;
    if(!userObj) getCurrentUser(userContext.state, setUserObj);

    
    return userObj ? (
        <div className="teacher-home">
            <h2>Hello {userObj.username}</h2>
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