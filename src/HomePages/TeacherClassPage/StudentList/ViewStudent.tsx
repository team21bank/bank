import React, { useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { AuthUser } from "../../../Authentication/auth";
import { delete_student_from_bank } from "../../../Authentication/EditProfilePage/DeleteAccount";
import { Bank } from "../../../Interfaces/BankObject";
import { BankUser } from "../../../Interfaces/BankUser";
import { ref, getDatabase, onValue, set} from '@firebase/database';
import "./ViewStudent.css";


export function ViewStudent(
    {bank_user, auth_user, bank, index}:
    {bank_user: BankUser, auth_user: AuthUser, bank: Bank, index:number}
): JSX.Element {

    function editBalance(){
        let money=Number((document.getElementById(String(index)) as HTMLInputElement).value);
        set(ref(getDatabase(),'/groups/'+bank.bankId+'/bankObj/studentList/'+String(index)+'/balance'),bank_user.balance+money);
    }

    function remove_student() {
        delete_student_from_bank(bank.bankId, bank_user.uid);
        window.setTimeout(()=>window.location.reload(), 100);
    }

    return bank_user ? (
        <div className="student-list-item">
            <Row>
                <Col>
                    {auth_user.username}
                </Col>
                <Col>
                    balance: {bank_user.balance}
                </Col>
                <Col>
                    <input id={String(index)} type='number'></input>
                    <Button onClick={editBalance}>Add/Subtract From Student Balance</Button>
                </Col>
                <Col>
                    <RemoveStudentModal remove_student_function={remove_student} student_name={auth_user.username} />
                </Col>
            </Row>
        </div>
    ) : (
        <></>
    )
}

function RemoveStudentModal(
    {remove_student_function, student_name}: {remove_student_function: ()=>void, student_name: string}
): JSX.Element {
    const [showModal, setShowModal] = useState(false);


    return (
    <div>
        <Modal show={showModal} onHide={()=>setShowModal(false)}>
        <Modal.Header closeButton><h2>Remove Student</h2></Modal.Header>
            <Modal.Body style={{"textAlign": "center", "fontSize": "150%", "color": "red"}}>
                Are you sure you want to remove student {student_name} from this class?
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>setShowModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={remove_student_function}>Confirm</Button>
            </Modal.Footer>
        </Modal>
        <Button variant="danger" onClick={()=>setShowModal(true)}>Remove Student</Button>
    </div>
    )
}