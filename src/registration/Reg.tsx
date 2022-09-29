import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import './Reg.css'

function Reg(){
    const [email, setEmail] = useState<string>('')
    const [username, setUser] = useState<string>('')
    const [id, setId] = useState<string>('')
    const [p1, setP1] = useState<string>('')
    const [p2, setP2] = useState<string>('')

    function updateEmail(event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value)
    }

    function updateUser(event: React.ChangeEvent<HTMLInputElement>){
        setUser(event.target.value)
    }

    function updateId(event: React.ChangeEvent<HTMLInputElement>){
        setId(event.target.value)
    }

    function updateP1(event: React.ChangeEvent<HTMLInputElement>){
        setP1(event.target.value)
    }

    function updateP2(event: React.ChangeEvent<HTMLInputElement>){
        setP2(event.target.value)
    }

    function log(){
        console.log(email,username,id)
    }

    return (<div>
        <Form.Group controlId="registration">
            <Form.Label>Enter Your Email</Form.Label>
            <Form.Control
                value={email}
                onChange={updateEmail}/>
            <br/>
            <Form.Label>Enter Your Username</Form.Label>
            <Form.Control
                value={username}
                onChange={updateUser}/>
            <br/>
            <Form.Label>Enter Your School ID</Form.Label>
            <Form.Control
                value={id}
                onChange={updateId}/>
            <br/>
            <Form.Label>Enter Your Password</Form.Label>
            <Form.Control
                value={p1}
                onChange={updateP1}/>
            <br/>
            <Form.Label>Confirm Your Password</Form.Label>
            <Form.Control
                value={p2}
                onChange={updateP2}/>
            <br/>
            <Button onClick={log}>Register</Button>
        </Form.Group>
    </div>);

}

export default Reg;