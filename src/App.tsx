import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useState, Component} from 'react';
import './App.css';
import "./firebase";
import { RegistrationForm } from './Authentication/Registration/Reg';
import ResetMessage from './Authentication/ResetPassword/ResetMessage';
import {Route, BrowserRouter, Link, Routes} from 'react-router-dom';
import { StudentNavbar } from './Navbars/StudentNavbar';
import { TeacherNavbar } from './Navbars/TeacherNavbar';
import { StudentHomePage } from './HomePages/StudentHomePage/StudentHomePage'
import { TeacherHomePage } from './HomePages/TeacherHomePage/TeacherHomePage';
import { LoginForm } from './Authentication/Login/Login';
import { AuthContext, CurrentUserProvider, getCurrentUser } from './Authentication/auth';
import { DefaultHomePage } from './HomePages/DefaultHomePage/DefaultHomePage';
import { BankUser } from './Interfaces/BankUser';
import { EditProfile } from './Authentication/EditProfilePage/EditProfilePage';
import { JoinClassButton } from './ClassCode/JoinClass/JoinClass';
import { ChangeUsernameButton } from './Authentication/ChangeUsername/ChangeUsername';
import {StudentClassPage} from './HomePages/StudentClassPage/StudentClassPage'
import { AvatarForm } from './Avatar/Avatar';


function App() {
    return (
    <CurrentUserProvider> {/*Provider wrapping the entire app to give components access to the current user context */}
      <AppBody></AppBody>
    </CurrentUserProvider>
  );
}

export default App;

function AppBody(): JSX.Element {
  const userContext = useContext(AuthContext);
  const [currUser, setCurrUser] = useState<BankUser>();
  if(!currUser) getCurrentUser(setCurrUser);

  return <div>
    {userContext.state && currUser ? <div>logged in as {currUser.username}</div> : <div>not logged in</div>}
    <div>^ just for testing, will be removed later</div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultHomePage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/login/resetpassword" element={<ResetMessage />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/teachers" element={<TeacherNavbar />}>
          <Route path="home" element={<TeacherHomePage />}/>
          <Route path="classes" element={<TeacherHomePage/>}/>
          <Route path="account" element={<TeacherHomePage/>}/>
          <Route path="changeusername" element={<ChangeUsernameButton/>}/>
        </Route>
        <Route path="/students" element={<StudentNavbar />}>
          <Route path="home" element={<StudentHomePage />}/>
          <Route path="joinclass" element={<JoinClassButton/>}/>
          <Route path="changeusername" element={<ChangeUsernameButton/>}/>
          {currUser? currUser.groups.map((classCode:string)=>(
            classCode !== "placeholder" ? <Route path={classCode} element={<StudentClassPage classCode={classCode}/>}/>:null
          )):null}
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
}