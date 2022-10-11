import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import { ref, getDatabase, push, child, update,get  } from '@firebase/database';
import "../firebase";
import { auth, app } from '../firebase';
import {signOut, Auth, getAuth} from 'firebase/auth';
import { Students } from '../UserInterfaces/Students';
import { useNavigate } from 'react-router-dom';

export function LogoutButton( {passID}:
        {passID: (passID: string) => void} ){
    const navigate = useNavigate();
    //Function for button click logging out current user
    function logout(){
        signOut(auth)
        alert("Successfully logged out!");
    }

    //HTML holding logout button
    return (<div>
        <Button onClick={() => {
            passID("")
            logout()
            navigate("/")}}>Logout</Button>
    </div>)
}