import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { ImportRoster } from "./ImportRoster";
import { AddStudentList } from "./ManualAddStudents";

export function AddStudentsModal({classID}: {classID: string}): JSX.Element {
    const [showModal, setShowModal] = useState(false);
    const [showImportCSV, setShowImportCSV] = useState(false)

    return(
    <div>
        <Modal show={showModal} onHide={()=>setShowModal(false)}>
        <Modal.Header closeButton><h2>Create Student Accounts</h2></Modal.Header>
            <Modal.Body>
                <Button onClick={()=>setShowImportCSV(!showImportCSV)}>
                    {showImportCSV ? "Manually add students instead" : "Import as CSV instead"}
                </Button>
                <br/><br/>
                {showImportCSV ? (
                    <ImportRoster currentGroup={classID} setShowModal={setShowModal}/>
                ) : (
                    <AddStudentList classID={classID} setShowModal={setShowModal}/>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>setShowModal(false)}>Cancel</Button>
            </Modal.Footer>
            </Modal>
            <form><Button onClick={() => setShowModal(true)}>Create Student Accounts</Button></form>
    </div>
    )
}