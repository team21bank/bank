import { Auth } from 'firebase/auth';
import React, { useState } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ref, getDatabase, push, child, update, get } from '@firebase/database';
import "../firebase";
import "./NavigationLayout.css";
import { Students } from '../UserInterfaces/Students';

export function NavigationLayout({currentUser}: {currentUser: Students;}): JSX.Element {
    const navigate = useNavigate();

    return (
    <div className='navigation-bar'>
      <table width="30%">
        <td width="60%">
          <ListGroup horizontal>
            <ListGroup.Item>
              <Button onClick={()=>navigate("/")}>Home</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button onClick={()=>navigate("/Register")}>Register</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button onClick={()=>navigate("/login")}>Login</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button onClick={()=>navigate("/changeUsername")}>Change Username</Button>
            </ListGroup.Item>
          </ListGroup>
          <Outlet></Outlet>
        </td>
        <td width ="40%">
          <div>{currentUser.username !== "" ? 
            <div>Welcome, {currentUser.username}!</div> : 
            <div>Please Log In</div>}
          </div>
        </td>
      </table>
    </div>
    );
}