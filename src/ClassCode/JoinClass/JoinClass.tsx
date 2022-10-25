import {Button,Form, useAccordionButton} from 'react-bootstrap'
import { ref, getDatabase, update, onValue, set} from '@firebase/database';
import React, { useContext, useState } from 'react';
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import { BankUser } from "../../Interfaces/BankUser";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import { Await } from 'react-router-dom';
import { truncateSync } from 'fs';

export function JoinClassButton(){
    const userContext = useContext(AuthContext);
    if(userContext.state == null) return <NoUserPage />; //display fail page if attempting to access user page without being logged in

    const [userObj, setUserObj]  = useState<BankUser>();
    if(!userObj) getCurrentUser(userContext.state, setUserObj);

    const [bank, setBank] = useState<string>('');

    function updateBank(event: React.ChangeEvent<HTMLInputElement>){
        setBank(event.target.value)
    }

    function addClass(){
        let classId=bank;
        let className='';
        onValue(ref(getDatabase(),"/groups/"+classId),ss=>{
            if (ss.val()!==null){
                onValue(ref(getDatabase(),"/groups/"+classId+"/bankObj/classTitle"),ss=>{
                    className=ss.val()
                })
                userObj? userObj.groups.push(classId+className): classId='';
                userObj? userContext.state? set(ref(getDatabase(),"/users/"+userContext.state.user.uid+"/userObj/groups"),userObj.groups):null:null;
                setBank('')
                window.location.reload()
            }
        })
    }
    
    return (<div>
        <Form.Group controlId="addClass">
            <Form.Label>Enter Class Code</Form.Label>
            <Form.Control
                value={bank}
                placeholder="Enter Class Code"
                onChange={updateBank}/>
            <Button onClick={addClass}>Add Class</Button>
        </Form.Group>
    </div>);
}