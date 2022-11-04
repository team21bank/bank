import React, { useState } from 'react';
import {Button, Form, Modal} from 'react-bootstrap'
import { AuthUser } from '../../Authentication/auth';
import { NoUserPage } from '../NoUserPage/NoUserPage';
import './ChangeUsername.css'
import "../../firebase";

export function ChangeUsernameButton(
    {currUser, setCurrUser}: {currUser: AuthUser | null, setCurrUser: (n: AuthUser | null)=>void}
){
    const [showModal, setShowModal] = useState(false);

    //New username information
    const [username, setUsername] = useState<string>('')

    if(!currUser) {return <NoUserPage />};

    function updateLocalUsername(event: React.ChangeEvent<HTMLInputElement>){
        setUsername(event.target.value)
    }

    function confirm() {
        if(currUser) setCurrUser({...currUser, username});
        setUsername("");
        setShowModal(false);
    }
    function cancel() {
        setUsername("");
        setShowModal(false);
    }

    return currUser ? (
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
    ) : (
        <h2>LOADING...</h2>
    )

}
