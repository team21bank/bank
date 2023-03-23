import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, AuthUser, BankContext, DEFAULT_AUTH_USER } from "../../Authentication/auth";
import { AddStudentsModal } from "./AddStudents/AddStudentsModal";
import {Bank, DEFAULT_BANK} from "../../Interfaces/BankObject"
import { ref, getDatabase, onValue} from '@firebase/database';
import "./TeacherClassPage.css";
import { Button, Modal } from 'react-bootstrap';
import { delete_bank } from '../../Authentication/EditProfilePage/DeleteAccount';
import { Outlet, useNavigate } from 'react-router-dom';
import { StudentList } from './StudentList/StudentList';
import { Subgroups } from './Subgroups';
import { get_bank } from '../../DatabaseFunctions/BankFunctions';

export function TeacherClassPage({classCode}:{classCode:string}){
    const navigate = useNavigate();

    const current_user: AuthUser = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;
    const current_bank: Bank = useContext(BankContext).bank ?? DEFAULT_BANK;

    const bank_context = useContext(BankContext);
    useEffect(() => {
        get_bank(classCode.slice(0,6), bank_context.setBank)
    }, []);
    

    return (
        <div className="teacher-class-page">
            Welcome back to your class: {classCode.slice(6)}
            <AddStudentsModal classID={classCode} />
            <StudentList current_bank={current_bank} />
            <Subgroups classID={classCode}></Subgroups>
            <DeleteBankModal 
                delete_bank_function={()=>{
                    delete_bank(current_bank.bankId, current_user.id);
                    navigate("/teachers/home");
                    alert("class successfully deleted");
                }}
                bank_name={classCode.slice(6)}
            />
            <Button onClick={()=>navigate("/teachers/"+classCode.slice(0,6)+"/quizzes")}> Go to Quizzes </Button>
            <Outlet></Outlet>
        </div>
    )
}


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