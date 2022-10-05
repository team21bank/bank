import { Auth } from 'firebase/auth';
import React, { useState } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ref, getDatabase, push, child, update, get } from '@firebase/database';
import "../firebase";
import "./NavigationLayout.css";


export function NavigationLayout({userAuth}: {userAuth: Auth;}): JSX.Element {
    const navigate = useNavigate();
    const user = userAuth.currentUser;
    const [test, updateTest] = useState<string>("");
    if(user){
        let userRef=ref(getDatabase(),'/users/'+user.uid+'/username')
        get(userRef).then(ss=>{
            updateTest(ss.val());
        })
    }

    return (
    <div className='navigation-bar'>
      <table width="30%">
        <td width="50%">
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
          </ListGroup>
          <Outlet></Outlet>
          </td>
        <td width ="50%">
          <div>{test !== "" ? 
            <div>Welcome, {test}!</div> : 
            <div>Please Log In</div>}
          </div>
        </td>
      </table>
    </div>
    );
}