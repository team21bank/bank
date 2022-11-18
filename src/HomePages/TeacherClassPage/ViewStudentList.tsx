import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { AuthUser } from "../../Authentication/auth";
import { Bank } from "../../Interfaces/BankObject";
import { BankUser } from "../../Interfaces/BankUser";



export function ViewStudentList({currStudents}: {currStudents: AuthUser[]}) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="view-students">
            <Modal show={showModal} onHide={()=>setShowModal(false)}>
                <Modal.Header closeButton>Your Students</Modal.Header>
                <Modal.Body>
                    {currStudents.map((student: AuthUser)=>(
                        <li key={student.username+student.id}>{student.username}</li>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Button onClick={()=>setShowModal(true)}>View Students</Button>
        </div>
    )
}