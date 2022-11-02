import {Routes, Route, useNavigate} from 'react-router-dom';
import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import { FirebaseError } from '@firebase/util';
import './ResetMessage.css';
import { getDatabase, ref } from "firebase/database"
import { initializeApp } from "firebase/app";
import { get, query, onValue } from "firebase/database"
import {firebaseConfig, app} from "../../firebase"




export default function ResetMessage(){
//const accountRef =  firebase.database().ref('users');
    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const navigate = useNavigate();
    const auth = getAuth();

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

    const[showStudentError, setShowStudentError] = React.useState(false)
    const StudentError = () =>(
        <div id = "studentError">
        Ask your teacher!
        </div>
    )

    function resetPassword(){
        const triggerResetEmail = async () => {
            try{
                const db = await getDatabase(app)
                const usersSnapshot = await get(ref(db, '/'))
                var item = usersSnapshot.child('users').val();
                const JSonValues = Object.values(item);
                const parsedJSonValues = JSON.parse(JSON.stringify(JSonValues))
                var found = false
                for(let i = 0; i<parsedJSonValues.length;i++)
                {
                    //var found = false;
                    
                    if((parsedJSonValues[i]["userObj"]["email"]===email)&&(parsedJSonValues[i]["userObj"]["isTeacher"]===true))
                    {
                        sendPasswordResetEmail(auth,email)
                        setShowResults(true);
                        setShowEmailError(false);
                        setShowStudentError(false);
                        console.log("Password reset email sent");
                        found=true;
                        console.log(found)
                    }
                    else if((parsedJSonValues[i]["userObj"]["email"]===email)&&(parsedJSonValues[i]["userObj"]["isTeacher"]!==true))
                    {   
                        console.log("User is a student! Can't change password");
                        setShowResults(false);
                        setShowEmailError(false);
                        setShowStudentError(true);
                        found=true;
                        console.log("Value of found is")
                        console.log(found)

                    }
                    if(i===parsedJSonValues.length-1)
                    {
                    if(found===false){
                        
                        throw new Error}
                        
                    }
                        
                }
            }
            catch (e:unknown) {

                setShowResults(false)
                setShowStudentError(false)
                setShowEmailError(true)
                console.log(e)
                console.log("User not found")
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
                        console.log("Getting new error")
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
            { showStudentError ? <StudentError /> : null }
            <Button className = "reset-buttons" onClick={resetPassword}>Reset Password</Button>
            <Button className = "reset-buttons" onClick={()=>navigate("/login")}>Login</Button>
            </Form.Group>
    </div>)
}