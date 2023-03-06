import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, AuthUser, BankContext, DEFAULT_AUTH_USER } from "../../Authentication/auth";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import { AddStudentsModal } from "./AddStudents/AddStudentsModal";
import {Bank, DEFAULT_BANK} from "../../Interfaces/BankObject"
import { ref, getDatabase, onValue} from '@firebase/database';
import "./TeacherClassPage.css";
import { BankUser } from '../../Interfaces/BankUser';
import { Button, Modal } from 'react-bootstrap';
import { delete_bank } from '../../Authentication/EditProfilePage/DeleteAccount';
import { auth } from '../../firebase';
import { Outlet, useNavigate } from 'react-router-dom';
import { StudentList } from './StudentList/StudentList';

export function TeacherClassPage({classCode}:{classCode:string}){
    const navigate = useNavigate();

    //Get AuthUser objects for each student in the class
    const [studentList, setStudentList] = useState<AuthUser[]>([]);

    const current_user = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;
    const current_bank: Bank = useContext(BankContext).bank ?? DEFAULT_BANK;

    const bank_context = useContext(BankContext);
    useEffect(() => { //Update the bank context if this page is navigated to
        onValue(ref(getDatabase(), "/groups/"+classCode.slice(0,6)+"/bankObj"), bank_snapshot => {
            if(bank_snapshot.exists() == false) {return;}
            getStudentList(bank_snapshot.val().studentList, setStudentList);
            bank_context.setBank(bank_snapshot.val());
        });
    }, [classCode]);
    

    return (
        <div className="teacher-class-page">
            Welcome back to your class: {classCode.slice(6)}
            <AddStudentsModal classID={classCode} />
            <StudentList current_bank={current_bank} auth_users={studentList}/>
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