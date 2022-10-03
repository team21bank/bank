import {Routes, Route, useNavigate} from 'react-router-dom';
import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import { ref, getDatabase, push, child, update,get  } from '@firebase/database';
import "../firebase";
import { auth } from '../firebase';
import {signInWithEmailAndPassword } from 'firebase/auth';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import './Login.css';
import { FirebaseError } from '@firebase/util';

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

    const [showEmailError, setShowEmailError] = React.useState(false)
    const EmailError = () => (
        <div id="emailError">
        Invalid email, try again
        </div>
    )

    function resetPassword(){
        const auth = getAuth()
        const triggerResetEmail = async () => {
            try{
                await sendPasswordResetEmail(auth,email)
                setShowResults(true)
                setShowEmailError(false)
                console.log("Password reset email sent")
            }
            catch (e:unknown) {
                setShowResults(false)
                if(e instanceof FirebaseError){
                    if(e.code==='auth/invalid-email'){
                        console.error(e.code)
                        setShowEmailError(true)
                    }
                    else if(e.code==='auth/user-not-found'){
                        console.error(e.code)
                        setShowEmailError(true)
                    }
                    else{
                        console.error(e.code)
                    }
                }

            }
        }
        triggerResetEmail();
    }
    function updateEmail(event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value)
    }
    return (<div>
        <h1>RESET PASSWORD PAGE</h1>
        <Form.Group controlId="resetpassword">
            <Form.Label>Enter Your Email For Link to Reset Password</Form.Label>
            <Form.Control
                value={email}
                onChange={updateEmail}
                />
            <br/>
            { showEmailError ? <EmailError /> : null }
            { showResults ? <Results /> : null }
            <Button onClick={resetPassword}>Reset Password</Button>
            </Form.Group>
    </div>)
}