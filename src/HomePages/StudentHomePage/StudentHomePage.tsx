import { LogoutButton } from "../../Authentication/Logout/Logout";
import {useNavigate} from 'react-router-dom';
import React from 'react';
import { getCurrentUser } from "../../Authentication/auth";

export function StudentHomePage(){
    const currUser = getCurrentUser();


    console.log(currUser);
    return (
    <div>
        {currUser ? <div>Hello {currUser.username}</div> : <div> hello</div>}
        <LogoutButton></LogoutButton>
    </div>)
}