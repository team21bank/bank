import React, { useContext, useState } from 'react';
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import "./StudentHomePage.css";
import { BankUser } from "../../Interfaces/BankUser";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import {JoinClassButton} from "../../ClassCode/JoinClass/JoinClass"
import {Button} from "react-bootstrap"
import { AvatarForm } from '../../Avatar/Avatar';

export function StudentHomePage(){
    const userContext = useContext(AuthContext);
    if(userContext.state == null) return <NoUserPage />; //display fail page if attempting to access user page without being logged in

    const [userObj, setUserObj]  = useState<BankUser>();
    if(!userObj) getCurrentUser(setUserObj);

    function goToClass(classID:string){
        return classID
    }

    return userObj ? (
        <div className="student-home">
            <h2>Hello {userObj.username}</h2>\
            <JoinClassButton></JoinClassButton>
            <AvatarForm></AvatarForm>
            <br></br>
            <div className="classes">
                {userObj.groups.map((classButton: string) => (
                    classButton !== "placeholder" ? <Button id={classButton.slice(0, 6)} onClick={() => goToClass(classButton.slice(0, 6))}>{classButton.slice(6)}</Button> : <br></br>
                ))}
            </div>\
        </div>
    ) : (
        <div className="student-home">
            <h2>LOADING...</h2>
        </div>
    )
}