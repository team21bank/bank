import { LogoutButton } from "../Logout/Logout";
import {useNavigate} from 'react-router-dom';
import React from 'react';

export function StudentHomePage(){
    return (<div>
        <div>Loggen in</div>
        <LogoutButton></LogoutButton>
    </div>)
}