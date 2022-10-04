import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import "./NavigationLayout.css";


export function NavigationLayout({accountName}: {accountName: string;}): JSX.Element {
    const navigate = useNavigate();

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
          <div>{accountName !== "" ? 
            <div>Welcome, {accountName.replace(".", " ")}!</div> : 
            <div>Please Log In</div>}
          </div>
        </td>
      </table>
    </div>
    );
}