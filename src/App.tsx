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
import { CreateClassModal } from './ClassCode/CreateClassModal';
import { QuizPage } from './Quizzes/QuizPage';
import { StudentQuizMain } from './Quizzes/StudentQuiz';
import { SubgroupsPage } from './HomePages/TeacherClassPage/SubgroupsPage';

import { StudentBankingPage } from './HomePages/StudentBankingPage/StudentBankingPage';


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
          {user.groups.map(str => {
            return <Route path={str.slice(0, 6)+"/groups"} key={str} element={<SubgroupsPage classCode={str} />}></Route>
          })}
          <Route path="createclass" element={<CreateClassModal/>}/>
          {/*Render the class pages*/}
          {user.groups.map(str => <Route path={str.slice(0,6)} key={str} element={<TeacherClassPage classCode={str} />}/>)}
          {/*Render the quiz pages. This needs to be done in a separate map because nested routes also render their parent element*/}
          {user.groups.map(str => <Route path={str.slice(0,6)+"/quizzes"} key={str} element={<QuizPage/>}/>)}
        </Route>
        <Route path="/students" element={<StudentNavbar />}>
          <Route path="home" element={<StudentHomePage />}/>
          {user.groups.map(str => <Route path={str.slice(0,6)} key={str} element={<StudentClassPage classCode={str} />}></Route>)}
          {user.groups.map(str => <Route path={str.slice(0,6)+"/quizzes"} key={str} element={<StudentQuizMain/>} />)}
          {user.groups.map(str => <Route path={str.slice(0,6)+"/banking"} key={str} element={<StudentBankingPage classCode={str}/>} />)}
        </Route>
      </Routes>
    </HashRouter>
  </div>
}