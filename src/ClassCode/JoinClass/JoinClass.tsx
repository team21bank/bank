import {Button,Form, Modal } from 'react-bootstrap'
import { ref, getDatabase, set} from '@firebase/database';
import React, { useContext, useState } from 'react';
import { AuthContext, getCurrentUser } from "../../Authentication/auth";
import { AuthUser } from "../../Authentication/auth";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import { auth } from '../../firebase';
import { get } from 'firebase/database';
import { Bank } from '../../Interfaces/BankObject';

export function JoinClassButton(){
    const [showModal, setShowModal] = useState(false);

    const userContext = useContext(AuthContext);
    const [userObj, setUserObj]  = useState<AuthUser>();
    const [bankCode, setBankCode] = useState<string>('');
    if(userContext.state == null) {return <NoUserPage />;} //display fail page if attempting to access user page without being logged in

    if(!userObj) {getCurrentUser(userContext.state, setUserObj)};

    function updateBank(event: React.ChangeEvent<HTMLInputElement>){
        setBankCode(event.target.value)
    }

    function addClass(){
        const currUser = auth.currentUser;
        if(!currUser) { //return if no user is logged in
            alert("No user found");
            return;
        }
        if(bankCode === "") { //return if bankCode is empty
            alert("Class Not Found");
            return;
        }

        const user_ref = ref(getDatabase(), "/users/"+currUser.uid);
        const bank_ref = ref(getDatabase(), "/groups/"+bankCode);
        get(bank_ref).then(bank_snapshot => { //get bank object
            let bank: Bank = bank_snapshot.val().bankObj;
            if(!bank) { //return if bank with bankCode is not found
                alert("Class Not Found");
                return;
            }
            //create BankUser object for user
            bank.studentList = [...bank.studentList, {uid: currUser.uid, isBanker: false, balance: 0}];
            set(bank_ref, {bankObj: bank});

            get(user_ref).then(user_snapshot => { //add bank Id to user object
                const current_user_object: AuthUser = user_snapshot.val().userObj;
                const new_user_groups = [...current_user_object.groups, bankCode+bank.classTitle];
                set(user_ref, {userObj: {...current_user_object, groups: new_user_groups}});
            });
        });
    }
    
    return (<div>
        <Modal show={showModal} onHide={()=>setShowModal(false)}>
            <Modal.Header closeButton><h1>Join Class</h1></Modal.Header>
            <Modal.Body>
                <Form.Group controlId="addClass">
                    <Form.Label>Enter Class Code</Form.Label>
                    <Form.Control
                        value={bankCode}
                        onChange={updateBank}/>
                        <br />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={addClass}>Add Class</Button>
                <Button onClick={()=>{setBankCode(""); setShowModal(false);}}>Cancel</Button>
            </Modal.Footer>
        </Modal>
        <Button onClick={()=>setShowModal(true)} size="lg">Join Class</Button>
    </div>);
}
