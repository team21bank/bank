import { LogoutButton } from "../Logout/Logout";
import {useNavigate} from 'react-router-dom';
import { ClassCodeForm } from "../ClassCode/ClassCodes";
import React from 'react';
import { AvatarForm } from "../Avatar/Avatar";

export function TeacherHomePage({passID}:
    {passID: (passID: string) => void}){
    return (<div>
        <ClassCodeForm></ClassCodeForm>
        <LogoutButton passID={passID}></LogoutButton>
        <AvatarForm></AvatarForm>
    </div>)
}