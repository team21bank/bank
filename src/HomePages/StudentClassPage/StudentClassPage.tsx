import React, { useContext, useState } from 'react';
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import { BankUser } from "../../Interfaces/BankUser";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import {Button} from "react-bootstrap"

export function StudentClassPage({classCode}:{classCode:string}){
    const userContext = useContext(AuthContext);
    const [userObj, setUserObj]  = useState<BankUser>();
    
    if(userContext.state == null) return <NoUserPage />; //display fail page if attempting to access user page without being logged in

    if(!userObj) getCurrentUser(userContext.state, setUserObj);

    return (<div>
        Welcome to {classCode.slice(6)}
        <Button>hello</Button>
    </div>)
}