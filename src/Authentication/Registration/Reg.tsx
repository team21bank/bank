import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import './Reg.css'
import { ref, getDatabase, child, update  } from '@firebase/database';
import "../../firebase";
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {BankUser} from "../../Interfaces/BankUser";
import { Link } from 'react-router-dom';

type InputEvent = React.ChangeEvent<HTMLInputElement>;

export function RegistrationForm(){
    //All information needed from user to register
    const [email, setEmail] = useState<string>('');
    const [username, setUser] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [p1, setP1] = useState<string>('');
    const [p2, setP2] = useState<string>('');

    
    //Allows user to register account if information is inputted correctly and email does not already have an account
    function register_new_user(){
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
            let userRef=ref(getDatabase(),'/users/'+uid);
            const newUser: BankUser={
                username:username,
                email:email,
                id:id,
                avatar:'',
                groups:['placeholder'],
                isTeacher: true,
            }
            setEmail(''); setP1(''); setP2(''); setId(''); setUser('');
            update(userRef,{userObj:newUser});
        }).catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            alert(errorMessage);
        });
        console.log("Created user: ",email,username,id)
    };

    //HTML for registration textboxes and button
    return (<div className='register-page'>
        <div className='register-header'>
            <h1 className='register-header-text'>Register For Team21 Bank</h1>
        </div>
        <div className='register-forms'>
            <Form.Group controlId="registration">
                <div className="form-wrapper">
                    <Form.Label className="register-form-header">Enter Your Email</Form.Label>
                    <Form.Control
                        className='register-text-box'
                        placeholder='ex. example@test.com'
                        size='lg'
                        value={email}
                        onChange={(e: InputEvent) => setEmail(e.target.value)}/>
                </div>
                <div className="form-wrapper">
                    <Form.Label className="register-form-header">Enter Your Username</Form.Label>
                    <Form.Control
                        className='register-text-box'
                        size='lg'
                        value={username}
                        onChange={(e: InputEvent) => setUser(e.target.value)}/>
                </div>
                <div className="form-wrapper">
                    <Form.Label className="register-form-header">Enter Your School ID</Form.Label>
                    <Form.Control
                        className='register-text-box'
                        size='lg'
                        value={id}
                        onChange={(e: InputEvent) => setId(e.target.value)}/>
                </div>
                <div className="form-wrapper">
                    <Form.Label className="register-form-header">Enter Your Password</Form.Label>
                    <Form.Control
                        className='register-text-box'
                        size='lg'
                        type="password"
                        value={p1}
                        onChange={(e: InputEvent) => setP1(e.target.value)}/>
                </div>
                <div className="form-wrapper">
                    <Form.Label className="register-form-header">Confirm Your Password</Form.Label>
                    <Form.Control
                        className='register-text-box'
                        size='lg'
                        type="password"
                        value={p2}
                        onChange={(e: InputEvent) => setP2(e.target.value)}/>
                </div>
                <br/>
                <Button onClick={register_new_user} className="register-form-button">Register</Button>
                <Link to="/"><Button className="register-form-button">Back To Home</Button></Link>
            </Form.Group>
        </div>
    </div>);

}
