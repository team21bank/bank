import React, { useContext } from 'react';
import { AuthContext } from "../../Authentication/auth";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import {Button} from "react-bootstrap"

export function StudentClassPage({classCode}:{classCode:string}){
    const user = useContext(AuthContext);
    
    if(user.user == null) return <NoUserPage />; //display fail page if attempting to access user page without being logged in


    return (<div>
        Welcome to {classCode.slice(6)}
        <Button>hello</Button>
    </div>)
}