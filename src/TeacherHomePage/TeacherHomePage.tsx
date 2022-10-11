import { LogoutButton } from "../Logout/Logout";
import {useNavigate} from 'react-router-dom';
import { ClassCodeForm } from "../ClassCode/ClassCodes";
import React from 'react';

export function TeacherHomePage(){
    return (<div>
        <ClassCodeForm></ClassCodeForm>
        <LogoutButton></LogoutButton>
    </div>)
}