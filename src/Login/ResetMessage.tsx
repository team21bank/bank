import {Routes, Route, useNavigate} from 'react-router-dom';
import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import { ref, getDatabase, push, child, update,get  } from '@firebase/database';
import "../firebase";
import { auth } from '../firebase';
import {signInWithEmailAndPassword } from 'firebase/auth';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import './Login.css';
  
/*const ResetMessage = () => {
  return (
    <h1>Enter your email(username=email)</h1>
  );
};
function changePass(){
        const auth = getAuth();
        navigate('/resetpassword');
        /*const triggerResetEmail = async () => {
            await sendPasswordResetEmail(auth,email)
            console.log("Password reset email sent")
        }
        triggerResetEmail();
    }
  
export default ResetMessage;*/

export default function ResetMessage(){

    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const navigate = useNavigate();

    const [showResults, setShowResults] = React.useState(false)
    const Results = () => (
        <div id="results">
        If email is valid, we will send a link to reset your password. It may be in your spam/junk mail
        </div>
    )

    function resetPassword(){
        const auth = getAuth()
        const triggerResetEmail = async () => {
            await sendPasswordResetEmail(auth,email)
            setShowResults(true)
            console.log("Password reset email sent")
        }
        triggerResetEmail();
    }
    function updateEmail(event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value)
    }
    return (<div>
        <Form.Group controlId="resetpassword">
            <Form.Label>Enter Your Email</Form.Label>
            <Form.Control
                value={email}
                onChange={updateEmail}
                />
            <br/>
            { showResults ? <Results /> : null }
            <Button onClick={resetPassword}>Reset Password</Button>
            </Form.Group>
    </div>)
}