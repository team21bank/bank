import {Button,Form, Modal } from 'react-bootstrap'
import { ref, getDatabase, onValue, set} from '@firebase/database';
import React, { useContext, useState } from 'react';
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import { BankUser } from "../../Interfaces/BankUser";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import {Bank} from "../../BankTest/BankObject"


export function JoinClassButton(){
    const [showModal, setShowModal] = useState(false);

    const userContext = useContext(AuthContext);
    const [userObj, setUserObj]  = useState<BankUser>();
    const [bank, setBank] = useState<string>('');
    if(userContext.state == null) {return <NoUserPage />;} //display fail page if attempting to access user page without being logged in

    if(!userObj) {getCurrentUser(userContext.state, setUserObj)};

    function updateBank(event: React.ChangeEvent<HTMLInputElement>){
        setBank(event.target.value)
    }

    function addClass(){
        let classId=bank;
        let className='';
        let currBank={} as Bank;
        if (userObj){
            onValue(ref(getDatabase(),"/groups/"+classId),ss=>{
                if (ss.val()!==null && !userObj.groups.includes(classId)){
                    className=ss.val().bankObj.classTitle
                    currBank=ss.val().bankObj
                    if (userObj){
                        userObj.groups.push(classId+className);
                        currBank.studentList.push(userObj.id)
                        if (userContext.state){
                            set(ref(getDatabase(),"/users/"+userContext.state.user.uid+"/userObj/groups"),userObj.groups);
                            alert("Group Added")
                        }
                    }
                }
            })
            if (currBank.bankId!==undefined){
                set(ref(getDatabase(),"/groups/"+classId+"/bankObj"),currBank)
            }
            setBank('')
            window.location.reload()
        }   
    }
    
    return (<div>
        <Modal show={showModal} onHide={()=>setShowModal(false)}>
            <Modal.Header closeButton><h1>Join Class</h1></Modal.Header>
            <Modal.Body>
                <Form.Group controlId="addClass">
                    <Form.Label>Enter Class Code</Form.Label>
                    <Form.Control
                        value={bank}
                        onChange={updateBank}/>
                        <br />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={addClass}>Add Class</Button>
                <Button onClick={()=>setBank("")}>Cancel</Button>
            </Modal.Footer>
        </Modal>
        <Button onClick={()=>setShowModal(true)} size="lg">Join Class</Button>
    </div>);
}
