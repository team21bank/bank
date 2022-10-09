import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import "./NavigationLayout.css";


export function NavigationLayout(): JSX.Element {
    const navigate = useNavigate();

    return (
    <div className='navigation-bar'>
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
    </div>
    );
}