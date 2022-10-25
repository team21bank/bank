import { LogoutButton } from "../../Authentication/Logout/Logout";
import { ClassCodeForm } from "../../ClassCode/ClassCodes";
import React, { useContext, useState } from 'react';
import "./TeacherHomePage.css";
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import { BankUser } from "../../Interfaces/BankUser";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import {Button} from "react-bootstrap"
import { useNavigate } from "react-router-dom";

export function TeacherHomePage(){
    const userContext = useContext(AuthContext);
    const [userObj, setUserObj]  = useState<BankUser>();
    const navigate = useNavigate();

    if(userContext == null) return <NoUserPage />;
    if(!userObj) getCurrentUser(userContext.state, setUserObj);

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
        </div>
    ) : (
        <div className="teacher-home">
            <h2>LOADING...</h2>
        </div>
    )

}