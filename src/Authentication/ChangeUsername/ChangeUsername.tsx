import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import './ChangeUsername.css'

export function UsernameForm(){
    //Still needs global variable(?)/way to keep username constant across different pages while logged in?

    //Username information
    const [username, setUser] = useState<string>('')

    function updateUser(event: React.ChangeEvent<HTMLInputElement>){
        setUser(event.target.value)
    }

    function confirm() {
        alert("Username updated!")
    }

    //HTML for username change textbox and button
    return (<div>
        <Form.Group controlId="changename">
            <Form.Label>Enter Your New Username</Form.Label>
            <Form.Control
                value={username}
                onChange={updateUser}/>
            <br/>
            <Button onClick={confirm}>Confirm</Button>
        </Form.Group>
        Hello, {username}!
    </div>);

}
