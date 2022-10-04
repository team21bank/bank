import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import { ref, getDatabase, push, child, update,get  } from '@firebase/database';
import "../firebase";
import { auth } from '../firebase';
import {signOut } from 'firebase/auth';

export function LogoutButton( {accountPasser}:
        {accountPasser: (newName: string) => void;} ){

    //Function for button click logging out current user
    function logout(){
        signOut(auth);
        accountPasser("");
        alert("Successfully logged out!");
    }

    //HTML holding logout button
    return (<div>
        <Button onClick={logout}>Logout</Button>
    </div>)
}