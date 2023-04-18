import React, { useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { Bank } from "../../../Interfaces/BankObject";
import { BankUser, getTitle } from "../../../Interfaces/BankUser";
import "./ViewStudent.css";
import { EditBalanceModal } from "./EditBalanceModal";
import { EditRoleModal } from "./EditRoleModal";
import { AuthUser } from "../../../Interfaces/AuthUser";


export function ViewStudent(
    {user_pair, remove_student}:
    {user_pair: [AuthUser, BankUser], remove_student: () => void}
): JSX.Element {
    return (
        <div className="student-list-item">
            <Row className="student-list-row">
                <Col>
                    {user_pair[0].username}
                </Col>
                <Col style={{"display": "flex"}}>
                    {getTitle(user_pair[1].role)}<EditRoleModal bank_user={user_pair[1]}/>
                </Col>
                <Col style={{"display": "flex"}}>
                    balance:{user_pair[1].balance}<EditBalanceModal bank_user={user_pair[1]}/>
                </Col>
                <Col>
                    <RemoveStudentModal remove_student_function={remove_student} student_name={user_pair[0].username} />
                </Col>
            </Row>
        </div>
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