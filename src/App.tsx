import { ref, getDatabase, push, child } from '@firebase/database';
import React from 'react';
import './App.css';
import "./firebase";

function App() {
    //Example of creating a node in the database and inserting string data under it
    //let database_reference = ref(getDatabase());
    //let c = child(database_reference, "test");
    //push(c, "Hello!");


    return (
    <div className="App">
      <header className="App-header">
        <h1>Banking Application</h1>
        <h5>{"(WIP)"}</h5>
      </header>
    </div>
  );
}

export default App;
