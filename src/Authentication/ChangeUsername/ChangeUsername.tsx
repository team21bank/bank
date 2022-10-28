import React, { useContext, useState } from 'react';
import {Button, Form, Modal} from 'react-bootstrap'
import { BankUser } from '../../Interfaces/BankUser';
import { AuthContext, getCurrentUser } from '../auth';
import { NoUserPage } from '../NoUserPage/NoUserPage';
import './ChangeUsername.css'
import { ref, getDatabase, set, update  } from '@firebase/database';
import "../../firebase";

export function ChangeUsernameButton(){
    const [showModal, setShowModal] = useState(false);

    let database_reference = ref(getDatabase());
    const userContext = useContext(AuthContext);
    const [userObj, setUserObj]  = useState<BankUser>();
    //New username information
    const [username, setUsername] = useState<string>('')

    if(userContext == null) {return <NoUserPage />};
    
    if(!userObj) {getCurrentUser(userContext.state, setUserObj);};

    function updateLocalUsername(event: React.ChangeEvent<HTMLInputElement>){
        setUsername(event.target.value)
    }

    function confirm() {
        if(userObj) userObj.username=username;
        if(userObj) setUserObj({...userObj})
        if (userObj!==undefined){
            if (userContext.state!==null){
                set(ref(getDatabase(),"users/"+userContext.state.user.uid+"/userObj/username"),userObj.username)
            }
        }
        setShowModal(false);
    }
    function cancel() {
        setUsername("");
        setShowModal(false)
    }

    return userObj ? (
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
                    <Button onClick={confirm}>Save</Button>
                    <Button onClick={cancel}>Cancel</Button>
                </Modal.Footer>
                
            </Modal>
            <Button onClick={()=> setShowModal(true)}>Change Username</Button>
        </div>
    ) : (
        <h2>LOADING...</h2>
    )

}
