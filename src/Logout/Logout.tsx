import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import { ref, getDatabase, push, child, update,get  } from '@firebase/database';
import "../firebase";
import { auth, app } from '../firebase';
import {signOut, Auth, getAuth} from 'firebase/auth';

export function LogoutButton( {passAuth}:
        {passAuth: (theAuth: Auth) => void} ){

    //Function for button click logging out current user
    function logout(){
        signOut(auth).then(
            function() {
                passAuth(auth)
            }
        );
        alert("Successfully logged out!");
    }

    //HTML holding logout button
    return (<div>
        <Button onClick={logout}>Logout</Button>
    </div>)
}