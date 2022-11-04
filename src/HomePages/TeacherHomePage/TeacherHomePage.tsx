import React, { useContext, useState } from 'react';
import "./TeacherHomePage.css";
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import { AuthUser } from "../../Authentication/auth";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import { ClassList } from "../../ClassCode/ClassList";

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