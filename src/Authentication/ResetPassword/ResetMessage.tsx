import {Routes, Route, useNavigate} from 'react-router-dom';
import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import { FirebaseError } from '@firebase/util';
import './ResetMessage.css';

import { getDatabase, ref } from "firebase/database"
import { initializeApp } from "firebase/app";
import { get, query, onValue } from "firebase/database"

export const firebaseConfig = {
  apiKey: "AIzaSyAA0b6LN-jkBbviEcl6GeKAFDPJQ169lcM",
  authDomain: "banking-application-abbda.firebaseapp.com",
  databaseURL: "https://banking-application-abbda-default-rtdb.firebaseio.com",
  projectId: "banking-application-abbda",
  storageBucket: "banking-application-abbda.appspot.com",
  messagingSenderId: "616492109802",
  appId: "1:616492109802:web:7d02eb116a01291807ac93",
  measurementId: "G-EWWD2G1WP9"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app) 
const dbRef = ref(db, "/users")
const usersSnapshot = get(query(dbRef)) 
onValue(query(dbRef), snapshot => {
console.log("getting value")
  console.log(snapshot.val())
})

export default function ResetMessage(){
//const accountRef =  firebase.database().ref('users');

    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const navigate = useNavigate();

    const [showResults, setShowResults] = React.useState(false)
    const Results = () => (
        <div id="results">
        Please check your email for link to reset your password. Be sure to check your spam/junk if link does not appear
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
            <Button className = "reset-buttons" onClick={resetPassword}>Reset Password</Button>
            <Button className = "reset-buttons" onClick={()=>navigate("/login")}>Login</Button>
            </Form.Group>
    </div>)
}