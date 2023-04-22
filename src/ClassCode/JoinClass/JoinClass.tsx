import {Button,Form, InputGroup, Modal } from 'react-bootstrap'
import { ref, getDatabase, set} from '@firebase/database';
import React, { useContext, useState } from 'react';
import { AuthContext } from "../../Authentication/auth";
import { auth } from '../../firebase';
import { get } from 'firebase/database';
import { Bank } from '../../Interfaces/BankObject';
import { DEFAULT_BANK_USER } from '../../Interfaces/BankUser';
import { AuthUser } from '../../Interfaces/AuthUser';

export function JoinClassButton(){
    const [showModal, setShowModal] = useState(false);

    const user = useContext(AuthContext);
    const [bankCode, setBankCode] = useState<string>('');

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
            bank.studentList = [...bank.studentList, {...DEFAULT_BANK_USER, uid: currUser.uid}];
            set(bank_ref, {bankObj: bank});

            get(user_ref).then(user_snapshot => { //add bank Id to user object
                const current_user_object: AuthUser = user_snapshot.val().userObj;
                const new_user_groups = [...current_user_object.groups, bankCode+bank.classTitle];
                set(user_ref, {userObj: {...current_user_object, groups: new_user_groups}});
            });
        }).finally(() => {
            setShowModal(false);
            setBankCode("");
        });
    }
    
    return (
        <div>
            <Modal show={showModal} onHide={()=>setShowModal(false)}>
                <Modal.Header closeButton><h1>Join Class</h1></Modal.Header>
                <Modal.Body>
                    <InputGroup hasValidation>
                        <InputGroup.Text>Enter Class Code </InputGroup.Text>
                        <Form.Control
                            type="text"
                            value={bankCode}
                            onChange={updateBank}
                            required
                            isInvalid={bankCode.length!==6}
                            isValid={bankCode.length===6}
                        />
                        <Form.Control.Feedback type="invalid">
                            Class Codes are 6 characters long
                        </Form.Control.Feedback>
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={addClass}>Add Class</Button>
                    <Button onClick={()=>{setBankCode(""); setShowModal(false);}}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            <Button onClick={()=>setShowModal(true)} size="lg">Join Class</Button>
        </div>
    )
}
