import React, { useContext, useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import { BankUser } from '../../Interfaces/BankUser';
import { AuthContext, getCurrentUser } from '../auth';
import { NoUserPage } from '../NoUserPage/NoUserPage';
import './ChangeUsername.css'

export function ChangeUsernameButton(){
    const userContext = useContext(AuthContext);
    if(userContext == null) return <NoUserPage />;

    const [userObj, setUserObj]  = useState<BankUser>();
    if(!userObj) getCurrentUser(setUserObj);

    //New username information
    const [username, setUsername] = useState<string>('')

    function updateLocalUsername(event: React.ChangeEvent<HTMLInputElement>){
        setUsername(event.target.value)
    }

    function confirm() {
        if(userObj) setUserObj({...userObj, username: username});
        //THIS NEW USER OBJECT MUST BE PUSHED TO THE DATABASE TO SAVE CHANGES
        alert("Username updated!")
    }

    return userObj ? (
        <div className="change-username" >
            <h1>Change Username</h1>
            <Form.Group controlId="changename">
                <Form.Label>Enter Your New Username</Form.Label>
                <Form.Control
                    className="username-text-box"
                    value={username}
                    onChange={updateLocalUsername}/>
                <br/>
                <Button onClick={confirm}>Confirm</Button>
            </Form.Group>
            Hello, {userObj.username}!
        </div>
    ) : (
        <h2>LOADING...</h2>
    )

}
