import React, { useContext, useState } from 'react';
import {Button, Form, Row} from 'react-bootstrap'
import { ref, getDatabase, push, child, update, get } from '@firebase/database';
import "../../firebase";
import { auth } from '../../firebase';
import {signInWithEmailAndPassword, Auth, signInWithPopup, GoogleAuthProvider, UserCredential } from 'firebase/auth';
import './Login.css';
import { useNavigate, Link} from 'react-router-dom';
import { AuthContext, STORAGE_KEY } from '../auth';

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

    const userContext = useContext(AuthContext);

    //Function allowing user to login after clicking the login button
    function login(){
        signInWithEmailAndPassword(auth,email,pass).then(currUser=>{
            setEmail('')
            setPass('')
            window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currUser)) //Add current user to browser storage
            userContext.setState(currUser);
            let userRef=ref(getDatabase(),'/users/'+currUser.user.uid+'/userObj/isTeacher')
            get(userRef).then(ss=>{
                ss.val() ? navigate('/teachers/home') : navigate('/students/home')
            })
        }).catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
    }


    return (<AuthContext.Consumer>{(value) => {
        return <div className="login-page">
        <h1>Login</h1>
        <br/>
        <Form.Group controlId="login">
            <div className="login-field">
                <Form.Label className="login-field-text">Enter Your Email:</Form.Label>
                <Form.Control
                    className="login-text-box"
                    value={email}
                    onChange={updateEmail}/>
            </div>
            <br/>
            <div className="login-field">
                <Form.Label className="login-field-text">Enter Your Password:</Form.Label>
                <Form.Control
                    className="login-text-box"
                    type="password"
                    value={pass}
                    onChange={updatePass}/>
            </div>
            <Button className="button_reset" onClick={()=>navigate("/login/resetpassword")}>Forgot Password?</Button>
            <br/>
            <br/>
        </Form.Group>
        <div>
            <Button onClick={() => {login(); value.setState(null)}} className="login-button">Login</Button>
            <Button onClick={() => signInWithPopup(auth, provider)} className="login-button">Sign in with Google</Button>
            <Link to="/"><Button className="login-button">Back to home</Button></Link>
        </div>
    </div>;
    }}</AuthContext.Consumer>)
}