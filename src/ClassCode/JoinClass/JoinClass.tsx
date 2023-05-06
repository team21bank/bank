import {Button,Col,Container,Form, InputGroup, Modal, Row } from 'react-bootstrap'
import React, { useContext, useState } from 'react';
import { AuthContext } from "../../Authentication/auth";
import { AuthUser, DEFAULT_AUTH_USER } from '../../Interfaces/AuthUser';
import { create_bank_users } from '../../DatabaseFunctions/BankUserFunctions';
import { update_auth_user } from '../../DatabaseFunctions/UserFunctions';
import { get_bank } from '../../DatabaseFunctions/BankFunctions';

export function JoinClassButton(){
    const [showModal, setShowModal] = useState(false);
    function hide() {setShowModal(false); setBankCode("");}

    const user = useContext(AuthContext).user;
    const [bankCode, setBankCode] = useState<string>('');

    function updateBank(event: React.ChangeEvent<HTMLInputElement>){
        setBankCode(event.target.value)
    }

    async function addClass(): Promise<void>{
        if(user === DEFAULT_AUTH_USER) { //return if no user is logged in
            return Promise.reject("No user object found");
        }
        if(bankCode.length !== 6) { //return if bankCode is empty
            return;
        }

        try {
            let bank = await get_bank(bankCode);
            if(bank===null) {
                alert("This class does not exist");
                return;
            }
            if(bank?.studentList.find(u=>u.uid===user.hash) !== undefined) {
                alert("You have already joined this class!");
                return;
            }
            await create_bank_users(bank, user.hash);
            await update_auth_user(user.hash, {...user, groups: [...user.groups, bankCode]});
            setShowModal(false);
            setBankCode("");
        } catch(e: any) {
            alert("Error occurred: " + e);
        }
    }
    
    return (
        <div>
            <Modal show={showModal} onHide={hide} size="lg">
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
                    <Row>
                        <Col style={{"textAlign": "start"}}>
                            <Button onClick={hide} variant="secondary">Cancel</Button>
                        </Col>
                        <Col style={{"textAlign": "right"}}>
                            <Button onClick={addClass} variant="success">Add Class</Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
            <Button onClick={()=>setShowModal(true)} size="lg">Join Class</Button>
        </div>
    )
}
