import React, { useContext, useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import "../../firebase";
import { auth } from '../../firebase';
import {signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';
import { useNavigate, Link} from 'react-router-dom';
import { AuthContext, USER_STORAGE_KEY } from '../auth';
import { get_auth_user_then, get_auth_user_updating } from '../../DatabaseFunctions/UserFunctions';

export function LoginForm(){
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

    const userContext = useContext(AuthContext);

    //Function allowing user to login after clicking the login button
    function login(){
        signInWithEmailAndPassword(auth,email,pass).then(currUser=>{
            window.sessionStorage.setItem(USER_STORAGE_KEY, currUser.user.uid); //Add current user to browser storage
            get_auth_user_updating(currUser.user.uid, userContext.setUser) //Get the logged in AuthUser and set the context using an updating fetch
            get_auth_user_then(currUser.user.uid, user => navigate(user.isTeacher ? "/teachers/home" : "/students/home")) //Get the logged in user and navigate to home
        }).catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            alert("Wrong email/password")
        });
    }


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
            <Button onClick={()=>login()} className="login-button">Login</Button>
            <Link to="/"><Button className="login-button">Back to home</Button></Link>
        </div>
    </div>;
}