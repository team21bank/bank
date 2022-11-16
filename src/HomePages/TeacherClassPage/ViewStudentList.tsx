import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Bank } from "../../Interfaces/BankObject";
import { BankUser } from "../../Interfaces/BankUser";



export function ViewStudentList({currClass}: {currClass: Bank}) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="view-students">
            <Modal show={showModal} onHide={()=>setShowModal(false)}>
                <Modal.Header closeButton>Your Students</Modal.Header>
                <Modal.Body>
                    {currClass.studentList.map((student: BankUser)=>(
                        student.uid !== "" ? <li>{student.uid}</li>: <></>
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