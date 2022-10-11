import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';
import "./firebase";
import { RegistrationForm } from './Authentication/registration/Reg';
import ResetMessage from './Authentication/ResetPassword/ResetMessage';
import {Route, BrowserRouter, Link, Routes} from 'react-router-dom';
import { StudentNavbar } from './Navbars/StudentNavbar';
import { TeacherNavbar } from './Navbars/TeacherNavbar';
import { StudentHomePage } from './HomePages/StudentHomePage/StudentHomePage'
import { TeacherHomePage } from './HomePages/TeacherHomePage/TeacherHomePage';
import { LoginForm } from './Authentication/Login/Login';
import { CurrentUserProvider } from './Authentication/auth';
import { DefaultHomePage } from './HomePages/DefaultHomePage/DefaultHomePage';


function App() {
    return (
    <CurrentUserProvider> {/*Provider wrapping the entire app to give components access to the current user context */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultHomePage />} />
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
