import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import './Reg.css'
import { ref, getDatabase, push, child, update  } from '@firebase/database';
import "../firebase";
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {Students} from "../UserInterfaces/Students";

export function RegistrationForm(){
    let database_reference = ref(getDatabase());
    let users=child(database_reference,"users");

    //All information needed from user to register
    const [email, setEmail] = useState<string>('')
    const [username, setUser] = useState<string>('')
    const [id, setId] = useState<string>('')
    const [p1, setP1] = useState<string>('')
    const [p2, setP2] = useState<string>('')
    const [isTeacher, setIsTeacher] = useState<boolean>(false);

    //Setters for textbox values
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
    
    //Allows user to register account if information is inputted correctly and email does not already have an account
    function register(){
        if (p1!==p2){
            alert("Passwords don't match");
            return;
        }
        if (username==='' || email==='' || id==='' ||p1===''||p2===''){
            alert("Please fill out empty textboxes");
            return;
        }
        createUserWithEmailAndPassword(auth,email,p1).then(somedata=>{
            let uid=somedata.user.uid;
            let userRef=ref(getDatabase(),'/users/'+uid)
            const newUser: Students={
                username:username,
                email:email,
                id:id,
                avatar:'',
                groups:[],
                isTeacher: isTeacher
            }
            setEmail('')
            setP1('')
            setP2('')
            setId('')
            setUser('')
            update(userRef,{userObj:newUser});
        }).catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            alert(errorMessage);
        });
        console.log(email,username,id)
    };

    //HTML for registration textboxes and button
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
                type="password"
                value={p1}
                onChange={updateP1}/>
            <br/>
            <Form.Label>Confirm Your Password</Form.Label>
            <Form.Control
                type="password"
                value={p2}
                onChange={updateP2}/>
            <br/>
            <Form.Label>Select your role</Form.Label>
            <Form.Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setIsTeacher((e.target.value=="teacher")? true : false);
            }}>
                <option value="student">student</option>
                <option value="teacher">teacher</option>
            </Form.Select>
            <br/>
            <Button onClick={register}>Register</Button>
        </Form.Group>
    </div>);

}
