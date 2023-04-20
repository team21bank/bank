import React, { useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { delete_student_from_bank } from "../../EditProfilePage/DeleteAccount";
import { Bank } from "../../../Interfaces/BankObject";
import { BankUser, getTitle } from "../../../Interfaces/BankUser";
import "./ViewStudent.css";
import { EditBalanceModal } from "./EditBalanceModal";
import { EditRoleModal } from "./EditRoleModal";
import { AuthUser } from "../../../Interfaces/AuthUser";


export function ViewStudent(
    {bank_user, auth_user, bank, index}:
    {bank_user: BankUser, auth_user: AuthUser, bank: Bank, index:number}
): JSX.Element {
    function remove_student() {
        delete_student_from_bank(bank.bankId, bank_user.uid);
        //window.setTimeout(()=>window.location.reload(), 100);
    }

    return bank_user ? (
        <div className="student-list-item">
            <Row className="student-list-row">
                <Col>
                    {auth_user.username}
                </Col>
                <Col style={{"display": "flex"}}>
                    {getTitle(bank_user.role)}<EditRoleModal bank_user={bank_user}/>
                </Col>
                <Col style={{"display": "flex"}}>
                    balance:{bank_user.balance}<EditBalanceModal bank_user={bank_user}/>
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
        <Modal.Header closeButton><h2>Remove Student {student_name}</h2></Modal.Header>
            <Modal.Body style={{"textAlign": "center", "fontSize": "150%", "color": "red"}}>
                Are you sure you want to remove student {student_name} from this class?
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>setShowModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={()=>{remove_student_function(); setShowModal(false);}}>Confirm</Button>
            </Modal.Footer>
        </Modal>
        <Button variant="danger" size="sm" onClick={()=>setShowModal(true)}>Remove Student</Button>
    </div>
    )
}