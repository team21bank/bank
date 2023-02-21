import React, { useContext, useEffect, useState } from 'react';
import "./TeacherClassPage.css";
import { Modal, Button } from "react-bootstrap";
import { StudentsInClass } from "./SubgroupsAddStudentsModal";
import { getDatabase, ref, get } from 'firebase/database';
import { Form } from 'react-bootstrap';
import { app } from "../../firebase";
import { getAuth } from 'firebase/auth';



export function SubgroupsPage({ classCode }: { classCode: string }) {
    const [check, setCheck] = React.useState(null);
    if (check != null) {
        alert(check[0]["userObj"]["email"])
    }
    //below function does same thing as getStudentsInClass. kept here bc it was cool
    /*React.useEffect(() => {
        async function checkData() {
            const db = await getDatabase(app);
            const usersSnapshot = await get(ref(db, '/'))
            var item = usersSnapshot.child('users').val();
            const JSonValues = Object.values(item);
            const data = JSON.parse(JSON.stringify(JSonValues))
            setCheck(data);
        }
        checkData();

    }, []);
    */

    const [showModal, setShowModal] = useState(false);
    function getStudentsInClass() {
        const getStudents = async () => {
            const db = await getDatabase(app);
            const usersSnapshot = await get(ref(db, '/'))
            var item = usersSnapshot.child('users').val();
            const JSonValues = Object.values(item);
            const parsedJSonValues = JSON.parse(JSON.stringify(JSonValues))
            setCheck(parsedJSonValues);
        }
        getStudents();
    }


    return (
        <div>
            <Button onClick={getStudentsInClass}>HELP</Button>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><h2>Add Group</h2></Modal.Header>
                <Modal.Body>
                    <br /><br />
                    <StudentsInClass classID={classCode} setShowModal={setShowModal} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowModal(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            <Button onClick={() => setShowModal(true)}>Add Group</Button>
        </div>
    )
}
