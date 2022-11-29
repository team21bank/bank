import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { AuthUser } from "../../Authentication/auth";
import { Bank } from "../../Interfaces/BankObject";
import { BankUser } from "../../Interfaces/BankUser";



export function ViewStudentList({currStudents, currBank}: {currStudents: AuthUser[], currBank: Bank}) {
    const [showModal, setShowModal] = useState(false);

    function editStudent(event, hash){
        alert(hash);
    }

    return (
        <div className="view-students">
            <Modal show={showModal} onHide={()=>setShowModal(false)}>
                <Modal.Header closeButton>Your Students</Modal.Header>
                <Modal.Body>
                    {currStudents.map((student: AuthUser)=>(
                        <li onClick={event=>editStudent(event,student.hash)} key={student.hash}>{student.username}</li>
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