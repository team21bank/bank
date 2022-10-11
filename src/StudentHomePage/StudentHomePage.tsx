import { LogoutButton } from "../Logout/Logout";
import {useNavigate} from 'react-router-dom';
import React, { useState } from 'react';
import { Button, Form } from "react-bootstrap";
import { Students } from "../UserInterfaces/Students";
import { ref, getDatabase, push, child, update, get } from '@firebase/database';
import { idBal } from "../BankTest/idBalObject";
import { AddGroup } from "../AddGroup/AddGroup";
import { AvatarForm } from "../Avatar/Avatar";

export function StudentHomePage( {userID, currentUser, passUser, passID}:
    {userID: string, currentUser: Students; passUser: (passUser: Students) => void; passID: (passID: string) => void}){
    return (<div>
        <AddGroup userID={userID} currentUser={currentUser} passUser={passUser}></AddGroup>
        <LogoutButton passID={passID}></LogoutButton>
        <AvatarForm></AvatarForm>
    </div>)
}