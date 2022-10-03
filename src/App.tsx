import { ref, getDatabase, push, child } from '@firebase/database';
import React from 'react';
import './App.css';
import "./firebase";
import { RegistrationForm } from './registration/Reg';
import {LoginForm} from './Login/Login';
import {LogoutButton} from './Logout/Logout';
import ResetMessage from './Login/ResetMessage';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';

function App() {
    let database_reference = ref(getDatabase());
    //let c = child(database_reference, "test");
    //push(c, "Hello!");


    return (
    <div className="App">
      <Routes>
      <Route path='/resetpassword' element={<ResetMessage/>} />
      </Routes>
      <header className="App-header">
        <h1>Banking Application</h1>
        <h5>{"(WIP)"}</h5>
      </header>
      <LoginForm></LoginForm>
      <LogoutButton></LogoutButton>
      <RegistrationForm></RegistrationForm>
    </div>
  );
}

export default App;
