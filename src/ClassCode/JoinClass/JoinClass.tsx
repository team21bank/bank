import {Button,Form} from 'react-bootstrap'
import { ref, getDatabase, onValue, set} from '@firebase/database';
import React, { useContext, useState } from 'react';
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import { BankUser } from "../../Interfaces/BankUser";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";

export function JoinClassButton(){
    const userContext = useContext(AuthContext);
    const [userObj, setUserObj]  = useState<BankUser>();
    const [bankCode, setBankCode] = useState<string>('');
    if(userContext.state == null) {return <NoUserPage />;} //display fail page if attempting to access user page without being logged in

    if(!userObj) {getCurrentUser(userContext.state, setUserObj)};

    function updateBank(event: React.ChangeEvent<HTMLInputElement>){
        setBankCode(event.target.value)
    }

    function addClass(){
        let classId=bankCode;
        let className='';
        let currBankStudents=[''];
        let count=0;
        if (userObj){
            onValue(ref(getDatabase(),"/groups/"+classId),ss=>{
                if (ss.val()!==null){
                    className=ss.val().bankObj.classTitle
                    if(!userObj.groups.includes(classId+className) && count<1){
                        count++
                        currBankStudents=ss.val().bankObj.studentList
                        if (userObj){
                            userObj.groups.push(classId+className);
                            if (userContext.state){
                                set(ref(getDatabase(),"/users/"+userContext.state.user.uid+"/userObj/groups"),userObj.groups);
                                alert("Group Added")
                            }
                        }
                    }
                    else{
                        alert("Already Part of Class")
                        setBankCode('')
                        return
                    }
                }
            })
            setTimeout(function waitForData() {
                if(currBankStudents[0] !== ''){
                    currBankStudents.push(userObj.id)
                    set(ref(getDatabase(),"/groups/"+classId+"/bankObj/studentList"),currBankStudents)
                    setBankCode('')
                    window.location.reload()
                }
            },1000);
        }   
    }
    
    return (<div>
        <Form.Group controlId="addClass">
            <Form.Label>Enter Class Code</Form.Label>
            <Form.Control
                value={bankCode}
                onChange={updateBank}/>
            <Button onClick={addClass}>Add Class</Button>
        </Form.Group>
    </div>);
}