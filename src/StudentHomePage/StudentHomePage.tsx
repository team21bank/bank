import { LogoutButton } from "../Logout/Logout";
import {useNavigate} from 'react-router-dom';
import React, { useState } from 'react';
import { Button, Form } from "react-bootstrap";
import { Students } from "../UserInterfaces/Students";
import { ref, getDatabase, push, child, update, get } from '@firebase/database';
import { idBal } from "../BankTest/idBalObject";
import { AddGroup } from "../AddGroup/AddGroup";

export function StudentHomePage( {userID, currentUser, passUser}:
    {userID: string, currentUser: Students; passUser: (passUser: Students) => void}){
    return (<div>
        <AddGroup userID={userID} currentUser={currentUser} passUser={passUser}></AddGroup>
    </div>)
}