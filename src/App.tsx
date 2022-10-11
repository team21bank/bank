import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';
import "./firebase";
import { RegistrationForm } from './Authentication/registration/Reg';
import ResetMessage from './Authentication/ResetPassword/ResetMessage';
import {Route, BrowserRouter, Link, Routes} from 'react-router-dom';
import { StudentNavbar } from './Navbars/StudentNavbar';
import { TeacherNavbar } from './Navbars/TeacherNavbar';
import {StudentHomePage} from './HomePages/StudentHomePage/StudentHomePage'
import { TeacherHomePage } from './HomePages/TeacherHomePage/TeacherHomePage';
import { LoginForm } from './Authentication/Login/Login';
import { Button } from 'react-bootstrap';
import { CurrentUserProvider } from './Authentication/auth';






function App() {
    return (
    <CurrentUserProvider> {/*Provider wrapping the entire app to give components access to the current user context */}
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
    </CurrentUserProvider>
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
    <Link to="/login"><Button>Login</Button></Link>
    <Link to="/register"><Button>Register</Button></Link>
  </div>)
}