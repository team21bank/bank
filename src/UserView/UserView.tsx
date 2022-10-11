import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import { ref, getDatabase, push, child, update,get  } from '@firebase/database';
import "../firebase";
import { auth } from '../firebase';
import {signInWithEmailAndPassword, Auth } from 'firebase/auth';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import {Routes, Route, useNavigate} from 'react-router-dom';
import { Students } from '../Interfaces/User';

export function UserView(){
    const user = auth.currentUser;
    /*
    const [test, updateTest] = useState<string>("");
    if(user){
        let userRef=ref(getDatabase(),'/users/'+user.uid+'/userObj/username')
        get(userRef).then(ss=>{
            updateTest(ss.val());
        })
    }
    */

    return (user ? <div>hello {user.displayName}</div> : <div>not logged in</div>)
}