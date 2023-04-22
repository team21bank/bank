import React, { useContext, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { Bank } from "../../../Interfaces/BankObject";
import { BankUser, getTitle } from "../../../Interfaces/BankUser";
import "./ViewStudent.css";
import { EditBalanceModal } from "./EditBalanceModal";
import { EditRoleModal } from "./EditRoleModal";
import { AuthUser } from "../../../Interfaces/AuthUser";
import { UserPair } from "./StudentList";
import { delete_bank_users } from "../../../DatabaseFunctions/BankUserFunctions";
import { BankContext } from "../../../Authentication/auth";


export function ViewStudent(
    {user_pair, remove_student_function}: {user_pair: UserPair, remove_student_function: () => void}
): JSX.Element {
    const bank_user = user_pair.bank_user;
    const auth_user = user_pair.auth_user;
    return (
        <div className="student-list-item">
            <Row className="student-list-row">
                <Col>
                    {(bank_user.alias??"")==="" ? auth_user.username : bank_user.alias}
                </Col>
                <Col style={{"display": "flex"}}>
                    {getTitle(user_pair.bank_user.role)}<EditRoleModal bank_user={user_pair.bank_user}/>
                </Col>
                <Col style={{"display": "flex"}}>
                    balance:{user_pair.bank_user.balance}<EditBalanceModal bank_user={user_pair.bank_user}/>
                </Col>
                <Col>
                    <RemoveStudentModal remove_student_function={remove_student_function} student_name={user_pair.auth_user.username} />
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