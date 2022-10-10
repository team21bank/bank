import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import { ref, getDatabase, push, child, update,get  } from '@firebase/database';
import "../firebase";
import { auth, app } from '../firebase';
import {signOut, Auth, getAuth} from 'firebase/auth';
import { Students } from '../UserInterfaces/Students';

export function LogoutButton( {passID}:
        {passID: (passID: string) => void} ){

    //Function for button click logging out current user
    function logout(){
        signOut(auth).then(currUser =>{
            passID("");
        });
        alert("Successfully logged out!");
    }

    //HTML holding logout button
    return (<div>
        <Button onClick={logout}>Logout</Button>
    </div>)
}