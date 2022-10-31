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


async function returntruthy(dbEmail:string){
    var truthy = false
    const db = await getDatabase(app)
    const usersSnapshot = await get(ref(db, '/'))
    var item = usersSnapshot.child('users').val();
    var items:string[]=[]
    const JSonValues = Object.values(item);
    const parsedJSonValues = JSON.parse(JSON.stringify(JSonValues))
    for(let i = 0; i<parsedJSonValues.length;i++){
        if((parsedJSonValues[i]["userObj"]["email"]===dbEmail)&&(parsedJSonValues[i]["userObj"]["isTeacher"]===true)){
            truthy = true
        }
        else{
            truthy = false
        }
        if(truthy===true)
            break
    }
    return truthy;
}
function canResetPW(dbEmail: string){
    const db = getDatabase(app)
    const dbRef = ref(db, "/users")
    const usersSnapshot = get(query(dbRef))
    let truthy = onValue(query(dbRef), snapshot => {
        var items:string[] = [] 
        snapshot.forEach((child) => {
            items.push({
                _key: child.key,
                ...child.val()
            });
        });
        for(var i=0;i<items.length;i++){
            //console.log(JSON.stringify(items[i]))
            const k = JSON.parse(JSON.stringify(items[i]))
            if(k["userObj"]["email"]===dbEmail){
                if(k["userObj"]["isTeacher"]){
                console.log("Teacher is true")
                return true;
                }
            }
            else{
                return false
            }
        }
    })
    console.log("TRUTH IS")
    console.log(truthy)
}

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

    const[showStudentError, setShowStudentError] = React.useState(false)
    const StudentError = () =>(
        <div id = "studentError">
        Ask your teacher!
        </div>
    )

    function resetPassword(){
        const auth = getAuth()
        
        console.log("now printing truthy value ")
        var truthy = returntruthy(email)
        truthy.then(value=>{
            console.log(value)
        })
        console.log(truthy)

        const triggerResetEmail = async () => {
            try{

                const value = await returntruthy(email)
                console.log("*****************")
                console.log("Value and email are")
                console.log(value)
                console.log(email)
                console.log("*****************")
                if(value){
                await sendPasswordResetEmail(auth,email)
                setShowResults(true)
                setShowEmailError(false)
                setShowStudentError(false)
                console.log("Password reset email sent")}
                else{
                setShowResults(false)
                setShowEmailError(false)
                setShowStudentError(true)
                }
            }
            catch (e:unknown) {
                setShowResults(false)
                setShowStudentError(false)
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
            { showStudentError ? <StudentError /> : null }
            <Button className = "reset-buttons" onClick={resetPassword}>Reset Password</Button>
            <Button className = "reset-buttons" onClick={()=>navigate("/login")}>Login</Button>
            </Form.Group>
    </div>)
}