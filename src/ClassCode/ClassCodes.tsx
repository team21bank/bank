import {Button, Form} from 'react-bootstrap'
import { ref, getDatabase, update, onValue, set} from '@firebase/database';
import "../firebase";
import {Bank} from "../BankTest/BankObject"
import React, { useContext, useState } from 'react';
import { AuthContext, getCurrentUser } from "../Authentication/auth";
import { BankUser } from "../Interfaces/BankUser";
import { NoUserPage } from "../Authentication/NoUserPage/NoUserPage";

import {Routes, Route, useNavigate} from 'react-router-dom';
import { stringify } from 'querystring';
import { exit } from 'process';
import { render } from '@testing-library/react';
import { isThisTypeNode } from 'typescript';

export function ClassCodeForm(){
    const userContext = useContext(AuthContext);
    if(userContext.state == null) return <NoUserPage />; //display fail page if attempting to access user page without being logged in

    const [userObj, setUserObj]  = useState<BankUser>();
    if(!userObj) getCurrentUser(userContext.state, setUserObj);

    const [className,setClassName] = useState<string>('');
    function updateClassName(event: React.ChangeEvent<HTMLInputElement>){
        setClassName(event.target.value)
    }

    function createCode(){
        if (className===''){
            alert("Please enter a class name")
            return 
        }
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
        let newBank: Bank={
            bankId:code,
            teacherID:userObj? userObj.id: '',
            studentBals:[],
            classTitle:className,
            classDescription:'',
        }
        userObj? userObj.groups.push(code+className): code='';
        update(ref(getDatabase(),"/groups/"+code),{bankObj:newBank});
        userObj? userContext.state? set(ref(getDatabase(),"/users/"+userContext.state.user.uid+"/userObj/groups"),userObj.groups):null:null;
        window.location.reload()
    }

    return (<div>
        <Form.Group controlId="createClass">
            <Form.Control
                value={className}
                onChange={updateClassName}/>
            <Button onClick={createCode}>Create Class Code</Button>
        </Form.Group>
    </div>)
}
