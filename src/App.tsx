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
import { NavigationLayout } from './Navbars/StudentNavbar';
import { getAuth, Auth, User } from 'firebase/auth';
import { UserView } from './UserView/UserView';
import { UsernameForm } from './ChangeUsername/ChangeUsername';
import {ClassCodeForm} from './ClassCode/ClassCodes'
import { Students } from './Interfaces/User';
import {StudentHomePage} from './StudentHomePage/StudentHomePage'
import { TeacherHomePage } from './TeacherHomePage/TeacherHomePage';
import { LoginForm } from './Authentication/Login';
import { auth } from "./firebase";



const AuthContext = React.createContext<number>(0);




function App() {
  

  //Example of creating a node in the database and inserting string data under it
  //let database_reference = ref(getDatabase());
  //let c = child(database_reference, "test");
  //push(c, "Hello!");

  function HomePage(): JSX.Element {
    return (
    <div className="App">
      <header className="App-header">
        <h1>Banking Application</h1>
        <h5>{"(WIP)"}</h5>
      </header>
      <UserView></UserView>
    </div>)
  }


    return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route index element={<HomePage />} />
        <Route path="/" element={<NavigationLayout />}>
          <Route path="register" element={<RegistrationForm />} />
          <Route path="login" element={<LoginForm/>}/>
          <Route path="login/resetpassword" element={<ResetMessage />} />
          <Route path="studenthome" element={<StudentHomePage />}/>
          <Route path="teacherhome" element={<TeacherHomePage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
