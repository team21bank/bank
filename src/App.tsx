import 'bootstrap/dist/css/bootstrap.min.css';
import { ref, getDatabase, push, child, get } from '@firebase/database';
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
import { getAuth, Auth } from 'firebase/auth';
import { UserView } from './UserView/UserView';
import { UsernameForm } from './ChangeUsername/ChangeUsername';
import {ClassCodeForm} from './ClassCode/ClassCodes'
import { Students } from './UserInterfaces/Students';
import {StudentHomePage} from './StudentHomePage/StudentHomePage'
import { TeacherHomePage } from './TeacherHomePage/TeacherHomePage';

function App() {
  const [userID, setID] = useState<string>("");
  const [currentUser, setUser] = useState<Students>({
      email: "",
      username: "",
      id: "",
      avatar: "",
      groups: [],
      isTeacher: false
    });
  function passID(theID: string){
    setID(theID);
    if(theID !== ""){
      let userRef=ref(getDatabase(),theID+'/userObj')
      get(userRef).then(ss=>{
        alert(typeof(ss.val()))
        parseUser(ss.val())
        alert(currentUser.isTeacher)
        alert(currentUser.username)
      }
      );
    }/* else {
      setUser({
        email: "",
        username: "",
        id: "",
        avatar: "",
        groups: [],
        isTeacher: false
      })
    }*/
  }

  function parseUser(user: Students){
    console.log(user)
    /*const newUser: Students = {
      email: user.email,
      username: user.username,
      id: user.id,
      avatar: user.avatar,
      groups: [],
      isTeacher: user.isTeacher
    }*/
    currentUser.email=user.email
    currentUser.username=user.username
    currentUser.id=user.id
    currentUser.avatar=user.avatar
    currentUser.groups=user.groups
    currentUser.isTeacher=user.isTeacher
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
      <UserView currentUser={currentUser}></UserView>
    </div>)
  }

    return (
    <div> 
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavigationLayout currentUser={currentUser}/>}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<RegistrationForm />} />
          <Route path="login" element={<LoginForm currentUser={currentUser} passID={passID}/>}/>
          <Route path="login/resetpassword" element={<ResetMessage />} />
          <Route path="studenthome" element={<StudentHomePage passID={passID}/>}/>
          <Route path="teacherhome" element={<TeacherHomePage passID={passID}/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
