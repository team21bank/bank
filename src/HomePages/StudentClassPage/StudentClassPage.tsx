import React, { useContext, useState } from 'react';
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import { BankUser } from "../../Interfaces/BankUser";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import { useParams } from "react-router-dom";
import {JoinClassButton} from "../../ClassCode/JoinClass/JoinClass"
import {Button} from "react-bootstrap"

export function StudentClassPage({classCode}:{classCode:string}){
    const userContext = useContext(AuthContext);
    if(userContext.state == null) return <NoUserPage />; //display fail page if attempting to access user page without being logged in

    const [userObj, setUserObj]  = useState<BankUser>();
    if(!userObj) getCurrentUser(setUserObj);

    return (<div><Button>hello</Button></div>)
}