import React, { useContext, useEffect, useState } from 'react';
import "./TeacherClassPage.css";
import { Modal, Button } from "react-bootstrap";
import { StudentsInClass } from "./SubgroupsAddStudentsModal";

export function SubgroupsPage({ classCode }: { classCode: string }) {
	const [showModal, setShowModal] = useState(false);

	function addStudentsToGroup() {

    }
	return (
        <div>
                <Modal.Body>
                    <br /><br />
                    <StudentsInClass classID={classCode} setShowModal={setShowModal}/>
                </Modal.Body>
                
        </div>
	)
}
