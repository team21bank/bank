import { LogoutButton } from "../../Authentication/Logout/Logout";
import { ClassCodeForm } from "../../ClassCode/ClassCodes";
import React, { useContext, useState } from 'react';
import "./TeacherHomePage.css";
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import { BankUser } from "../../Interfaces/BankUser";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import { ImportRoster } from "../../Authentication/ImportRoster/ImportRoster";
import {Button} from "react-bootstrap"
import { Navigate, useNavigate } from "react-router-dom";

export function TeacherHomePage(){
    const [userObj, setUserObj]  = useState<BankUser>();
    const userContext = useContext(AuthContext);
    if(userContext == null) return <NoUserPage />;

    if(!userObj) getCurrentUser(userContext.state, setUserObj);

    const navigate = useNavigate();

    function goToClass(classID: string) {
        console.log("navigating to ", classID);
        navigate("/teachers/"+classID);
    }
    
    return userObj ? (
        <div className="teacher-home">
            <h2>Hello {userObj.username}</h2>
            <ClassCodeForm></ClassCodeForm>
            <div className="classes">
                {userObj.groups.map((classButton:string)=>(
                    classButton !== "placeholder" ? <Button id={classButton.slice(0,6)} onClick={()=>goToClass(classButton.slice(0,6))}>{classButton.slice(6)}</Button> : <br></br>
                ))}
            </div>
            <LogoutButton></LogoutButton>
            <ImportRoster currentGroup="testgr"></ImportRoster>
        </div>
    ) : (
        <div className="teacher-home">
            <h2>LOADING...</h2>
        </div>
    )

}