import 'bootstrap/dist/css/bootstrap.min.css';
import { ref, getDatabase, push, child } from '@firebase/database';
import React, { useState } from 'react';
import './App.css';
import "./firebase";
import { RegistrationForm } from './registration/Reg';
import {LoginForm} from './Login/Login';
import {LogoutButton} from './Logout/Logout';
import ResetMessage from './Login/ResetMessage';
import {Route, BrowserRouter, Link, Routes, Outlet}
    from 'react-router-dom';
import { NavigationLayout } from './Navigation/NavigationLayout';
import { Auth } from 'firebase/auth';
import { UserView } from './UserView/UserView';

function App() {
  const [accountName, setAccount] = useState<string>("");
  function accountPasser(newName: string){
    setAccount(newName);
  }
  const [userAuth, setAuth] = useState<Auth>();
  function passAuth(theAuth: Auth){
    setAuth(theAuth);
  }
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
      <LogoutButton accountPasser={accountPasser}></LogoutButton>
    </div>)
  }

    return (
    <div> 
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<NavigationLayout accountName={accountName} />}>
              <Route index element={<HomePage />} />
              <Route path="register" element={<RegistrationForm />} />
              <Route path="login" element={<LoginForm accountPasser={accountPasser}/>}>
              <Route path="resetpassword" element={<ResetMessage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
