import React, { useContext } from 'react';
import {Button, Form} from 'react-bootstrap'
import "../../firebase";
import { auth, app } from '../../firebase';
import {signOut, Auth, getAuth, UserCredential} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AuthContext, STORAGE_KEY } from '../auth';

export function LogoutButton(){
    const navigate = useNavigate();
    
    const userContext = useContext(AuthContext);

    //Function for button click logging out current user
    function logout(){
        signOut(auth);
        userContext.setState(null);
        window.sessionStorage.removeItem(STORAGE_KEY)
        alert("Successfully logged out!");
    }

    //HTML holding logout button
    return (<div>
        <Button onClick={() => {
            logout();
            navigate("/");
            }
        }>Logout</Button>
    </div>)
}