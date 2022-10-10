import { LogoutButton } from "../Logout/Logout";
import {useNavigate} from 'react-router-dom';
import React from 'react';

export function StudentHomePage( {passID}:
    {passID: (passID: string) => void}){
    return (<div>
        <LogoutButton passID={passID}></LogoutButton>
    </div>)
}