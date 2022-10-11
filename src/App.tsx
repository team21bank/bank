import 'bootstrap/dist/css/bootstrap.min.css';
import { ref, getDatabase, push, child } from '@firebase/database';
import React from 'react';
import './App.css';
import "./firebase";
import { RegistrationForm } from './registration/Reg';
import {LoginForm} from './Login/Login';
import {LogoutButton} from './Logout/Logout';
import ResetMessage from './Login/ResetMessage';
import {Route, BrowserRouter, Link, Routes, Outlet}
    from 'react-router-dom';
import { NavigationLayout } from './Navigation/NavigationLayout';
import {ClassCodeForm} from './ClassCode/ClassCodes'
import {StudentHomePage} from './StudentHomePage/StudentHomePage'
import { TeacherHomePage } from './TeacherHomePage/TeacherHomePage';

function App() {
  //Example of creating a node in the database and inserting string data under it
  //let database_reference = ref(getDatabase());
  //let c = child(database_reference, "test");
  //push(c, "Hello!");

    return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavigationLayout />}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<RegistrationForm />} />
          <Route path="login" element={<LoginForm />}/>
          <Route path="login/resetpassword" element={<ResetMessage />} />
          <Route path="studenthome" element={<StudentHomePage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

function HomePage(): JSX.Element {
  return (
  <div className="App">
    <header className="App-header">
      <h1>Banking Application</h1>
      <h5>{"(WIP)"}</h5>
    </header>
  </div>)
}

export default App;
