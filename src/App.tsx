import { ref, getDatabase, push, child } from '@firebase/database';
import React from 'react';
import './App.css';
import "./firebase";
import { RegistrationForm } from './registration/Reg';
import {LoginForm} from './Login/Login'

function App() {
    let database_reference = ref(getDatabase());
    //let c = child(database_reference, "test");
    //push(c, "Hello!");


    return (
    <div className="App">
      <header className="App-header">
        <h1>Banking Application</h1>
        <h5>{"(WIP)"}</h5>
      </header>
      <LoginForm></LoginForm>
      <RegistrationForm></RegistrationForm>
    </div>
  );
}

export default App;
