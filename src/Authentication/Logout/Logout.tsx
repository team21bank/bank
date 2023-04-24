import React, { useContext } from 'react';
import {Button, NavDropdown} from 'react-bootstrap'
import "../../firebase";
import { auth } from '../../firebase';
import {signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AuthContext, USER_STORAGE_KEY, change_bank, change_user } from '../auth';

export function LogoutButton(){
    const navigate = useNavigate();
    
    const user = useContext(AuthContext);

    //Function for button click logging out current user
    function logout(){
        signOut(auth).then(() => {
            change_user(null);
            change_bank(null);
        })
    }

    //HTML holding logout button
    return (
        <NavDropdown.Item onClick={()=>{
            signOut(auth);
            change_user(null);
            change_bank(null);
            navigate("/");
        }}>Log Out</NavDropdown.Item>
    )
}