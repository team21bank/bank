import React, { useContext, useState } from 'react';
import {Button, Form, InputGroup} from 'react-bootstrap'
import "../../firebase";
import { auth } from '../../firebase';
import {AuthError, User, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';
import { useNavigate, Link} from 'react-router-dom';
import { AuthContext, USER_STORAGE_KEY, change_user } from '../auth';
import { get_auth_user_then } from '../../DatabaseFunctions/UserFunctions';

export function LoginForm(){
    //Email and password variable holding log in information
    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const [showError, setShowError] = useState<boolean>(false);
    
    const navigate = useNavigate();

    //Setters for email and pass
    function updateEmail(event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value)
    }

    function updatePass(event: React.ChangeEvent<HTMLInputElement>){
        setPass(event.target.value)
    }


    //Function allowing user to login after clicking the login button
    function login(){
        signInWithEmailAndPassword(auth,email,pass).then(user_cred => {
            change_user(user_cred.user.uid);
            get_auth_user_then(user_cred.user.uid, (user) => user ? navigate(user.isTeacher ? "/teachers/home" : "/students/home") : alert("Error"));
        }).catch((error: AuthError) => {
            console.log(error.code);
            setShowError(true);
        });
    }

    function handle_key_press(event) {
        if(event.key === "Enter") {
            login()
        }
    }
    return <div className="login-page">
        <br/>
        <h1>Login</h1>
        <br/>
        <Form>
            <InputGroup size="lg" className="text-input-group" hasValidation>
                <InputGroup.Text className="text-input-info">Email:</InputGroup.Text>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={updateEmail}
                    onKeyUp={handle_key_press}
                    isInvalid={showError}
                />
            </InputGroup>
            <InputGroup size="lg" className="text-input-group" hasValidation>
                <InputGroup.Text className="text-input-info">Password:</InputGroup.Text>
                <Form.Control
                    type="password"
                    value={pass}
                    onChange={updatePass}
                    onKeyUp={handle_key_press}
                    isInvalid={showError}
                />
                <Form.Control.Feedback type="invalid" style={{"fontSize": "150%"}}>Wrong email/password</Form.Control.Feedback>
            </InputGroup>
            <Button className="button_reset" onClick={()=>navigate("/login/resetpassword")}>Forgot Password?</Button>
            <br/>
            <br/>
        </Form>
        <div>
            <Button onClick={()=>login()} className="login-button" size="lg">Login</Button>
            <Link to="/"><Button className="login-button" size="lg">Back to home</Button></Link>
        </div>
    </div>;
}