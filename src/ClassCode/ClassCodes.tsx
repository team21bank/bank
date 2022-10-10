import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import { ref, getDatabase, push, child, update,get, onValue  } from '@firebase/database';
import "../firebase";
import { auth } from '../firebase';
import {signInWithEmailAndPassword } from 'firebase/auth';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';

import {Routes, Route, useNavigate} from 'react-router-dom';

export function ClassCodeForm(){
    function createCode(){
        let codeExists=true
        let characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
        let code=""
        while(codeExists)
            codeExists=false
            for (var i=0;i<6;i++){
                code+=characters.charAt(Math.floor(Math.random()*characters.length))
            }
            onValue(ref(getDatabase(),"/groups"),ss=>{
                let groupObj=ss.val();
                if (groupObj!==null){
                    let groupIDS=Object.keys(groupObj);
                    groupIDS.map(key=>{
                        if(key===code){
                            codeExists=true
                        }
                    })
                }
            })
        alert(code)
        push(ref(getDatabase(),"/groups/"+code),code);
    }

    return (<div>
        <Button onClick={createCode}>Create Class Code</Button>
    </div>)
}