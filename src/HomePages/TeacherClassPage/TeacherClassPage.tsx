import React, { useContext, useState } from 'react';
import { AuthContext } from "../../Authentication/auth";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import {Button, Modal} from "react-bootstrap"
import { ImportRoster } from "./ImportRoster";
import {Bank} from "../../Interfaces/BankObject"
import { ref, getDatabase, onValue} from '@firebase/database';
import { BankUser } from '../../Interfaces/BankUser';
import "./TeacherClassPage.css";

export function TeacherClassPage({classCode}:{classCode:string}){
    const user = useContext(AuthContext);   
    const [showModal, setShowModal] = useState(false);
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

    function closeStudentView(){
        setShowModal(false)
    }

    return user.user ? (
        <div className="teacher-class-page">
            Welcome back to your class: {classCode.slice(6)}
            <ImportRoster currentGroup={classCode}></ImportRoster>
            <div className="view-students">
                <Modal show={showModal} onHide={()=>setShowModal(false)}>
                    <Modal.Header closeButton>Your Students</Modal.Header>
                    <Modal.Body>
                        {currClass.studentList.map((student: BankUser)=>(
                            student.uid !== "" ? <li>{student.uid}</li>: <></>
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={closeStudentView}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Button onClick={()=>setShowModal(true)}>View Students</Button>
            </div>
        </div>
    ): (
        <LoadingPage/>
    )
}