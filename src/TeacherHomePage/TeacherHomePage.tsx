import { LogoutButton } from "../Authentication/Logout/Logout";
import {useNavigate} from 'react-router-dom';
import { ClassCodeForm } from "../ClassCode/ClassCodes";
import React from 'react';

export function TeacherHomePage(){
    return (<div>
        <div>logged in as teacher</div>
        <ClassCodeForm></ClassCodeForm>
        <LogoutButton></LogoutButton>
    </div>)
}