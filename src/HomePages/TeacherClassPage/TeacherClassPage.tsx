import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, AuthUser } from "../../Authentication/auth";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import { ImportRoster } from "./ImportRoster";
import {Bank} from "../../Interfaces/BankObject"
import { ref, getDatabase, onValue} from '@firebase/database';
import "./TeacherClassPage.css";
import { BankUser } from '../../Interfaces/BankUser';
import { Button } from 'react-bootstrap';
import { delete_bank } from '../../Authentication/EditProfilePage/DeleteAccount';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { StudentList } from './StudentList/StudentList';

export function TeacherClassPage({classCode}:{classCode:string}){
    const navigate = useNavigate();

    const user = useContext(AuthContext);   
    const [currClass, setCurrClass] = useState<Bank>({
        bankId:'',
        teacherID:'',
        studentList:[],
        classTitle:'',
    });

    //Get AuthUser objects for each student in the class
    const [studentList, setStudentList] = useState<AuthUser[]>([]);
    useEffect(() => {
        getStudentList(currClass.studentList, setStudentList);
    }, [currClass.studentList]);

    if (currClass.bankId===''){
        onValue(ref(getDatabase(),"/groups/"+classCode.slice(0,6)+"/bankObj"),ss=>{
            setCurrClass(ss.val());
        })
    }

    return user.user ? (
        <div className="teacher-class-page">
            Welcome back to your class: {classCode.slice(6)}
            <ImportRoster currentGroup={classCode}></ImportRoster>
            <StudentList bank_users={currClass.studentList} auth_users={studentList}/>
            <Button variant="danger" onClick={()=>{
                delete_bank(currClass.bankId, auth.currentUser ? auth.currentUser.uid : "");
                navigate("/teachers/home");
                alert("class successfully deleted");
            }}>Delete Bank</Button>
        </div>
    ): (
        <LoadingPage/>
    )
}

//gets the AuthUser object for each BankUser in the bankUserList
function getStudentList(bankUserList: BankUser[], setStudentList: (students: AuthUser[])=>void) {
    let tmpStudentList: AuthUser[] = [];
    bankUserList.forEach((bankUser, index) => {
        if(bankUser.uid !== "") {
            //console.log("getting object for user ", bankUser.uid);
            onValue(ref(getDatabase(), "/users/"+bankUser.uid), (snapshot) => {
                if(snapshot.val() != null) {
                    //console.log("pushing to student list");
                    tmpStudentList.push(snapshot.val().userObj);
                }
            });
        }
    });


    //weird stuff to wait until the student list is populated
    function check_finished() {
        if(tmpStudentList.length < bankUserList.length - 1) {
            window.setTimeout(check_finished, 100);
        } else {
            setStudentList(tmpStudentList);
            return;
        }
    }
    check_finished();
}