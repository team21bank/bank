import React, { useState } from 'react';
import {Button, Form, Row} from 'react-bootstrap'
import { ref, getDatabase, push, child, update, get } from '@firebase/database';
import "../firebase";
import { auth } from '../firebase';
import {signInWithEmailAndPassword, Auth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import './Login.css';
import {Routes, Route, useNavigate, Link} from 'react-router-dom';
import { Students } from '../Interfaces/User';

export function LoginForm(){
    //Email and password variable holding log in information
    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();

    //Setters for email and pass
    function updateEmail(event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value)
    }

    function updatePass(event: React.ChangeEvent<HTMLInputElement>){
        setPass(event.target.value)
    }

    
    //Function allowing user to login after clicking the login button
    function login(){
        signInWithEmailAndPassword(auth,email,pass).then(currUser=>{
            setEmail('')
            setPass('')
            let userRef=ref(getDatabase(),'/users/'+currUser.user.uid+'/userObj/username')
            get(userRef).then(ss=>{
                alert(ss.val()+" just logged in");
                ss.val().isTeacher ? navigate('/teachers/teacherhome') : navigate('/students/studenthome')
            })
        }).catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
    }


    //HTML containing log in button and text boxes for email and pass
    return (
    <div>
        <Form.Group controlId="login">
            <Form.Label>Enter Your Email:</Form.Label>
            <Form.Control
                value={email}
                onChange={updateEmail}/>
            <br/>
            <Form.Label>Enter Your Password:</Form.Label>
            <Form.Control
                type="password"
                value={pass}
                onChange={updatePass}/>
                <Button className="button_reset" onClick={()=>navigate("/login/resetpassword")}>Forgot Password?</Button>
            <br/>
            
        </Form.Group>
        <div>
            <Button onClick={login}>Login</Button>
            <Button onClick={() => signInWithPopup(auth, provider)}>Sign in with Google</Button>
            <Link to="/"><Button>Back to home</Button></Link>
        </div>
    </div>)
}