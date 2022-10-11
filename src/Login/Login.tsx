import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import { ref, getDatabase, push, child, update, get } from '@firebase/database';
import "../firebase";
import { auth } from '../firebase';
import {signInWithEmailAndPassword, Auth } from 'firebase/auth';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import './Login.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import { Students } from '../UserInterfaces/Students';

export function LoginForm( {currentUser, passID}:
        {currentUser: Students; passID: (theID: string) => void }){
    //Email and password variable holding log in information
    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const navigate = useNavigate();

    //Setters for email and pass
    function updateEmail(event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value)
    }

    function updatePass(event: React.ChangeEvent<HTMLInputElement>){
        setPass(event.target.value)
    }

    function changePass(){
        const auth = getAuth();
        navigate('/login/resetpassword');
        /*const triggerResetEmail = async () => {
            await sendPasswordResetEmail(auth,email)
            console.log("Password reset email sent")
        }
        triggerResetEmail();*/
    }

    //Function allowing user to login after clicking the login button
    function login(){
        signInWithEmailAndPassword(auth,email,pass).then(currUser=>{
            setEmail('')
            setPass('')
            passID('/users/'+currUser.user.uid)
            let userRef=ref(getDatabase(),'/users/'+currUser.user.uid+'/userObj/username')
            get(userRef).then(ss=>{
                alert(ss.val()+" just logged in")
            })
            if(!currentUser.isTeacher) {
                alert("now here")
                navigate('/studenthome')
            } else {
                alert("correct")
                navigate('/teacherhome')
            }
        }).catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
    }


    //HTML containing log in button and text boxes for email and pass
    return (<div>
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
                <Button className="button_reset" onClick={changePass}>Forgot Password?</Button>
            <br/>
            <Button onClick={login}>Login</Button>
            </Form.Group>
    </div>)
}