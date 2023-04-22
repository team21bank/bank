import React, { useState } from 'react';
import {Button, Col, Form, FormGroup, InputGroup, Row} from 'react-bootstrap'
import './Reg.css'
import { ref, getDatabase, update  } from '@firebase/database';
import "../../firebase";
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { create_auth_user } from '../../DatabaseFunctions/UserFunctions';
import { useNavigate } from 'react-router-dom';
import { AuthUser } from '../../Interfaces/AuthUser';
import { validate } from 'email-validator';

type InputEvent = React.ChangeEvent<HTMLInputElement>;

export function RegistrationForm(){
    const navigate = useNavigate();

    //All information needed from user to register
    const [email, setEmail] = useState<string>('');
    const [username, setUser] = useState<string>('');
    const [p1, setP1] = useState<string>('');
    const [p2, setP2] = useState<string>('');

    
    //Allows user to register account if information is inputted correctly and email does not already have an account
    function register_new_user(){
        if (p1!==p2){
            alert("Passwords don't match");
            return;
        }
        if (username==='' || email==='' || p1===''||p2===''){
            alert("Please fill out empty textboxes");
            return;
        }
        createUserWithEmailAndPassword(auth,email,p1).then(somedata=>{
            const newUser: AuthUser={
                username:username,
                email:email,
                id:"",
                avatar:'',
                groups:[],
                isTeacher: true,
                hash: somedata.user.uid
            }
            create_auth_user(somedata.user.uid, newUser);
        }).catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            alert(errorMessage);
        }).finally(() => {
            navigate("/");
        })
    };

    //HTML for registration textboxes and button
    return (<div className='register-page'>
        <div className='register-header'>
            <h1 className='register-header-text'>Register For Team21 Bank</h1>
        </div>
        <Form className='register-forms'>
            <InputGroup hasValidation size="lg" className='form-input'>
                <InputGroup.Text className="form-info-text">Enter Password</InputGroup.Text>
                <Form.Control
                    type="email"
                    value={email}
                    placeholder='ex. example@test.com'
                    onChange={(e: InputEvent) => setEmail(e.target.value)}
                    required
                    isInvalid={!validate(email)}
                    isValid={validate(email)}
                />
                <Form.Control.Feedback type="invalid">Email must be valid</Form.Control.Feedback>
            </InputGroup>
            <InputGroup  size="lg" className='form-input'>
                <InputGroup.Text className="form-info-text">Enter Username</InputGroup.Text>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e: InputEvent) => setUser(e.target.value)}
                    required
                />
            </InputGroup>
            <InputGroup hasValidation size="lg" className='form-input'>
                <InputGroup.Text className="form-info-text">Enter Password</InputGroup.Text>
                <Form.Control
                    type="password"
                    value={p1}
                    onChange={(e: InputEvent) => setP1(e.target.value)}
                    required
                    isInvalid={is_password_invalid(p1, p2)[0]}
                    isValid={!is_password_invalid(p1, p2)[0]}
                />
                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
            </InputGroup>
            <InputGroup hasValidation size="lg" className='form-input'>
                <InputGroup.Text className="form-info-text">Confirm Password</InputGroup.Text>
                <Form.Control
                    type="password"
                    value={p2}
                    onChange={(e: InputEvent) => setP2(e.target.value)}
                    required
                    isInvalid={is_password_invalid(p1, p2)[0]}
                    isValid={!is_password_invalid(p1, p2)[0]}
                />
                <Form.Control.Feedback type="invalid">
                    {is_password_invalid(p1, p2)[1]}
                </Form.Control.Feedback>
            </InputGroup>
            <br/>
            <Button onClick={register_new_user} className="register-form-button">Register</Button>
            <Link to="/"><Button className="register-form-button">Back To Home</Button></Link>
        </Form>
    </div>);
}


function is_password_invalid(password1: string, password2: string): [boolean, string] {
    let message: string = ""
    if(password1.length < 6 && password2.length < 6) {
        message += "Password must be at least 6 characters long. "
    }
    if(password1 !== password2) {
        message += "Passwords must match."
    }

    return message.length>0 ? [true, message] : [false, message]
}
