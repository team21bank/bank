import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import './App.css';
import "./firebase";
import { RegistrationForm } from './Authentication/Registration/Reg';
import ResetMessage from './Authentication/ResetPassword/ResetMessage';
import {Route, BrowserRouter, Routes} from 'react-router-dom';
import { StudentNavbar } from './Navbars/StudentNavbar';
import { TeacherNavbar } from './Navbars/TeacherNavbar';
import { StudentHomePage } from './HomePages/StudentHomePage/StudentHomePage'
import { TeacherHomePage } from './HomePages/TeacherHomePage/TeacherHomePage';
import { LoginForm } from './Authentication/Login/Login';
import { AuthContext, CurrentUserProvider } from './Authentication/auth';
import { DefaultHomePage } from './HomePages/DefaultHomePage/DefaultHomePage';
import { StudentClassPage } from './HomePages/StudentClassPage/StudentClassPage';
import {TeacherClassPage} from './HomePages/TeacherClassPage/TeacherClassPage'
import { EditProfile } from './Authentication/EditProfilePage/EditProfilePage';
import { CreateClassPage } from './ClassCode/CreateClassPage';
import { QuizMain } from './Quizzes/QuizMain';

function App() {
    return (
    <CurrentUserProvider> {/*Provider wrapping the entire app to give components access to the current user context */}
      <AppBody></AppBody>
    </CurrentUserProvider>
  );
}


export default App;

function AppBody(): JSX.Element {
  let classes: string[] = [];

  const user = useContext(AuthContext);
  if(user.user) classes = [...(user.user.groups)];

  return <div>
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
          <Route path="quizzes" element={<QuizMain/>} />
          <Route path="createclass" element={<CreateClassPage/>}/>
          {classes.map(str => {
            return <Route path={str.slice(0,6)} key={str} element={<TeacherClassPage classCode={str} />}></Route>
          })}
        </Route>
        <Route path="/students" element={<StudentNavbar />}>
          <Route path="home" element={<StudentHomePage />}/>
          {classes.map(str => {
            return <Route path={str.slice(0,6)} key={str} element={<StudentClassPage classCode={str} />}></Route>
          })}
          <Route path="quizzes" element={<QuizMain/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
}