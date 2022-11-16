import React, { useContext, useState } from 'react';
import { AuthContext } from "../../Authentication/auth";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import {Button, Modal} from "react-bootstrap"
import { ImportRoster } from "./ImportRoster";
import {Bank} from "../../Interfaces/BankObject"
import { ref, getDatabase, onValue} from '@firebase/database';
import { BankUser } from '../../Interfaces/BankUser';
import { ViewStudentList } from "./ViewStudentList";
import "./TeacherClassPage.css";

export function TeacherClassPage({classCode}:{classCode:string}){
    const user = useContext(AuthContext);   
    const [currClass, setCurrClass] = useState<Bank>({
        bankId:'',
        teacherID:'',
        studentList:[],
        classTitle:'',
    });

    if (currClass.bankId===''){
        onValue(ref(getDatabase(),"/groups/"+classCode.slice(0,6)+"/bankObj"),ss=>{
            setCurrClass(ss.val());
        })
    }

    return user.user ? (
        <div className="teacher-class-page">
            Welcome back to your class: {classCode.slice(6)}
            <ImportRoster currentGroup={classCode}></ImportRoster>
            <ViewStudentList currClass={currClass}/>
        </div>
    ): (
        <LoadingPage/>
    )
}