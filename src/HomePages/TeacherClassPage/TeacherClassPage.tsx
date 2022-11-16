import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, AuthUser } from "../../Authentication/auth";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import { ImportRoster } from "./ImportRoster";
import {Bank} from "../../Interfaces/BankObject"
import { ref, getDatabase, onValue} from '@firebase/database';
import { ViewStudentList } from "./ViewStudentList";
import "./TeacherClassPage.css";
import { BankUser } from '../../Interfaces/BankUser';

export function TeacherClassPage({classCode}:{classCode:string}){
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
            <ViewStudentList currStudents={studentList}/>
        </div>
    ): (
        <LoadingPage/>
    )
}

//gets the AuthUser object for each BankUser in the bankUserList
function getStudentList(bankUserList: BankUser[], setStudentList: (students: AuthUser[])=>void) {
    let tmpStudentList: AuthUser[] = [];
    bankUserList.map((bankUser) => {
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

    setStudentList(tmpStudentList);
}