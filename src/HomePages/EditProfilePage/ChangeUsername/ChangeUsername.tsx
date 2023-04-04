import React, { useContext, useState } from 'react';
import {Button, Form, Modal} from 'react-bootstrap'
import './ChangeUsername.css'
import "../../../firebase";
import { auth } from '../../../firebase';
import { AuthContext } from '../../../Authentication/auth';

export function ChangeUsernameButton(){
    const user = useContext(AuthContext);

    const [showModal, setShowModal] = useState(false);

    //New username information
    const [username, setUsername] = useState<string>('')

    function updateLocalUsername(event: React.ChangeEvent<HTMLInputElement>){
        setUsername(event.target.value)
    }

    function confirm() {
        if(auth.currentUser && user.user) user.setUser({...user.user, username});
        setUsername("");
        setShowModal(false);
    }
    function cancel() {
        setUsername("");
        setShowModal(false);
    }

    return (
        <div className="change-username" >
            <Modal show={showModal} onHide={()=>setShowModal(false)}>
                <Modal.Header closeButton>Change Username</Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="changename">
                        <Form.Label>Enter Your New Username</Form.Label>
                        <Form.Control
                            className="username-text-box"
                            value={username}
                            onChange={updateLocalUsername}/>                        
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={confirm}>Confirm</Button>
                    <Button onClick={cancel}>Cancel</Button>
                </Modal.Footer>
                
            </Modal>
            <Button onClick={()=> setShowModal(true)}>Change Username</Button>
        </div>
    )
}
