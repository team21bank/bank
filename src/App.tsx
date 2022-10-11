import 'bootstrap/dist/css/bootstrap.min.css';
import { ref, getDatabase, push, child, get } from '@firebase/database';
import React, { useState } from 'react';
import './App.css';
import "./firebase";
import { RegistrationForm } from './registration/Reg';
import {LogoutButton} from './Logout/Logout';
import ResetMessage from './Authentication/ResetMessage';
import {Route, BrowserRouter, Link, Routes, Outlet}
    from 'react-router-dom';
import { StudentNavbar } from './Navbars/StudentNavbar';
import { TeacherNavbar } from './Navbars/TeacherNavbar';
import { getAuth, Auth, User } from 'firebase/auth';
import { UserView } from './UserView/UserView';
import { UsernameForm } from './ChangeUsername/ChangeUsername';
import {ClassCodeForm} from './ClassCode/ClassCodes'
import { Students } from './Interfaces/User';
import {StudentHomePage} from './StudentHomePage/StudentHomePage'
import { TeacherHomePage } from './TeacherHomePage/TeacherHomePage';
import { LoginForm } from './Authentication/Login';
import { auth } from "./firebase";
import { Button } from 'react-bootstrap';



const IsLoggedIn = React.createContext<number>(0);




function App() {
    return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm/>}/>
          <Route path="/login/resetpassword" element={<ResetMessage />} />
          <Route path="/teachers" element={<TeacherNavbar />}>
            <Route path="teacherhome" element={<TeacherHomePage />}/>
          </Route>
          <Route path="/students" element={<StudentNavbar />}>
            <Route path="studenthome" element={<StudentHomePage />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


function HomePage(): JSX.Element {
  return (
  <div className="App">
    <header className="App-header">
      <h1>Banking Application</h1>
      <h5>{"(WIP)"}</h5>
    </header>
    <Link to="/login"><Button>login</Button></Link>
  </div>)
}