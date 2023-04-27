import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, BankContext, BANK_STORAGE_KEY, change_bank } from "../../Authentication/auth";
import { AddStudentsModal } from "./AddStudents/AddStudentsModal";
import {Bank, DEFAULT_BANK} from "../../Interfaces/BankObject"
import "./TeacherClassPage.css";
import { Button, Modal } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';
import { StudentList } from './StudentList/StudentList';
import { Subgroups } from './Subgroups';
import { delete_bank } from '../../DatabaseFunctions/BankFunctions';
import { AuthUser, DEFAULT_AUTH_USER } from '../../Interfaces/AuthUser';
import { AssignQuizzesModal } from './AssignQuizzesModal';

export function TeacherClassPage({classCode}:{classCode:string}){



    const navigate = useNavigate();

    const current_user: AuthUser = useContext(AuthContext).user;
    const current_bank: Bank = useContext(BankContext).bank;

    useEffect(() => {
        if(window.sessionStorage.getItem(BANK_STORAGE_KEY) === classCode.slice(0,6)) {return;}
        change_bank(classCode.slice(0,6));
    }, []);
    
    return (
        <div className="teacher-class-page">
            Welcome back to your class: {current_bank.classTitle}
            <AddStudentsModal classID={classCode} />
            <StudentList current_bank={current_bank} />
            <Subgroups classID={classCode}></Subgroups>
            <AssignQuizzesModal />
            <Outlet></Outlet>
        </div>
    )
}



//Add this in somewhere else at some point
//we dont really need it right now
function DeleteBankModal(
    {delete_bank_function, bank_name}: {delete_bank_function: ()=>void, bank_name: string}
): JSX.Element {
    const [showModal, setShowModal] = useState(false);


    return (
    <div>
        <Modal show={showModal} onHide={()=>setShowModal(false)}>
        <Modal.Header closeButton><h2>Delete Bank {bank_name}</h2></Modal.Header>
            <Modal.Body style={{"textAlign": "center", "fontSize": "150%", "color": "red"}}>
                Are you sure you want to delete bank {bank_name}? <br/>
                This action is irreversible!
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>setShowModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={delete_bank_function}>Confirm</Button>
            </Modal.Footer>
        </Modal>
        <Button variant="danger" onClick={()=>setShowModal(true)}>Delete Bank</Button>
    </div>
    )
}