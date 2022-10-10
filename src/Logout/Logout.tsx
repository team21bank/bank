import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import { ref, getDatabase, push, child, update,get  } from '@firebase/database';
import "../firebase";
import { auth } from '../firebase';
import {signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export function LogoutButton(){
    const navigate = useNavigate();

    //Function for button click logging out current user
    function logout(){
        signOut(auth)
    }

    //HTML holding logout button
    return (<div>
        <Button onClick={() => {
            logout
            navigate("/")}}>Logout</Button>
    </div>)
}