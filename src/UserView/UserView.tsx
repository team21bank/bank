import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import { ref, getDatabase, push, child, update,get  } from '@firebase/database';
import "../firebase";
import { auth } from '../firebase';
import {signInWithEmailAndPassword, Auth } from 'firebase/auth';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import {Routes, Route, useNavigate} from 'react-router-dom';

export function UserView({userAuth}: {userAuth: Auth}){
    const user = userAuth.currentUser;
    const [test, updateTest] = useState<string>("");
    if(user){
        let userRef=ref(getDatabase(),'/users/'+user.uid+'/username')
        get(userRef).then(ss=>{
            updateTest(ss.val());
        })
    }

    return (<div>{test}</div>)
}