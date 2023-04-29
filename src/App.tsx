import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import './App.css';
import "./firebase";
import { RegistrationForm } from './Authentication/Registration/Reg';
import ResetMessage from './Authentication/ResetPassword/ResetMessage';
import { Route, Routes, HashRouter } from 'react-router-dom';
import { StudentNavbar } from './Navbars/StudentNavbar';
import { TeacherNavbar } from './Navbars/TeacherNavbar';
import { StudentHomePage } from './HomePages/StudentHomePage/StudentHomePage'
import { TeacherHomePage } from './HomePages/TeacherHomePage/TeacherHomePage';
import { LoginForm } from './Authentication/Login/Login';
import { AuthContext, ContextProvider } from './Authentication/auth';
import { DefaultHomePage } from './HomePages/DefaultHomePage/DefaultHomePage';
import { StudentClassPage } from './HomePages/StudentClassPage/StudentClassPage';
import {TeacherClassPage} from './HomePages/TeacherClassPage/TeacherClassPage'
import { EditProfile } from './HomePages/EditProfilePage/EditProfilePage';
import { SubgroupsPage } from './HomePages/TeacherClassPage/SubgroupsPage';
import { CreateQuizPage } from './Quizzes/CreateQuizPage';
import { UserQuizPage } from './Quizzes/UserQuizPage';


function App() {
    return (
    <ContextProvider> {/*Provider wrapping the entire app to give components access to user and bank contexts */}
      <AppBody></AppBody>
    </ContextProvider>
  );
}


export default App;

function AppBody(): JSX.Element {
  const user = useContext(AuthContext).user;


  return <div>
    <HashRouter basename="/"> 
      <Routes>
        <Route path="/" element={<DefaultHomePage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/login/resetpassword" element={<ResetMessage />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/teachers" element={<TeacherNavbar />}>
          <Route path="groups" element={<TeacherHomePage/>}/>
          <Route path="home" element={<TeacherHomePage />}/>
          <Route path="classes" element={<TeacherHomePage/>}/>
          <Route path="createquiz" element={<CreateQuizPage/>}/>
          {/*Quizzes owned by a user*/}
          <Route path="quizzes" element={<UserQuizPage/>}/>
          {/*class pages*/}
          {user.groups.map(str => <Route path={str} key={str} element={<TeacherClassPage classCode={str} />}/>)}
          {/*Subgroups pages*/}
          {user.groups.map(str => <Route path={str+"/groups"} key={str} element={<SubgroupsPage classCode={str} />}/>)}
          
        </Route>
        <Route path="/students" element={<StudentNavbar />}>
          <Route path="home" element={<StudentHomePage />}/>
          {user.groups.map(str => <Route path={str.slice(0,6)} key={str} element={<StudentClassPage classCode={str} />}></Route>)}
        </Route>
      </Routes>
    </HashRouter>
  </div>
}