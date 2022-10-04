import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import { ref, getDatabase, push, child, update,get  } from '@firebase/database';
import "../firebase";
import { auth } from '../firebase';
import {signInWithEmailAndPassword } from 'firebase/auth';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import {Routes, Route, useNavigate} from 'react-router-dom';

export function UserView(){
    const user = auth.currentUser;
    let test;
    if(user){
        console.log();
        test = user.uid;
    }

    return (<div>{test}</div>)
}