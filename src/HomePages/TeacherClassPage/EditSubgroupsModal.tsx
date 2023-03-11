import React, { useContext, useEffect, useState, useCallback } from 'react';
import "./TeacherClassPage.css";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { getDatabase, ref, get, update, set, push, remove } from 'firebase/database';
import { Form } from 'react-bootstrap';
import { app } from "../../firebase";
import { getAuth } from 'firebase/auth';
import { Subgroup } from "../../Interfaces/Subgroup";
import "./styles.css";
import { Subgroups } from './Subgroups';
import { Multiselect } from "multiselect-react-dropdown";

export function EditSubgroupsModal({ code, group }: { code: string , group: string}) {

    const [students, setStudents] = React.useState<any[]>([]);
    const [showModal, setShowModal] = React.useState(false);
    const [showDropDown, setShowDropDown] = React.useState(false);
    let dataArr: any[] = []
    const [emails, setEmails] = useState<string[]>([]);
    const [groupName, setgroupName] = useState<string>("")

    function hidemodals() {
        setShowModal(false)
        setShowDropDown(false)
    }

    const handleSelect = (selectedList) => {
        setEmails(selectedList);
    };

    const handleRemove = (selectedList) => {
        setEmails(selectedList);
    };
    const submitFormData = event => {}
    const DropDown = () => (

        <div className="App">
            <form onSubmit={submitFormData}>
            Select Students
            <Multiselect
                options={dataArr} // Options to display in the dropdown
                selectedValues={emails} // Preselected value to persist in dropdown
                onSelect={handleSelect} // Function will trigger on select event
                onRemove={handleRemove} // Function will trigger on remove event
                displayValue="email" // Property name to display in the dropdown options
                />
                {/**<div><small id="set"> {err}</small></div>**/}
           
                {/**Enter group name
                <br></br>
                <input autoFocus value={groupName} type="text" onChange={e => updateFormData(e)} >
                </input>
                <div>
                    <small id="set"> {errmsg}</small>
                </div>
                **/}
                <button type="submit">Submit</button>
            </form>


        </div>)


	function getStudentsInClass() {
        const getStudents = async () => {
            const db = await getDatabase(app);
            const usersSnapshot = await get(ref(db, '/'))
            
            let stuIDs:string[] = []
            let studentsList: any[] = []
            var students = usersSnapshot.child(`groups/${code.slice(0,6)}/bankObj/subgroups`).val();
            const studentsJson = Object.values(students)
            const parsedStudentsJson = JSON.parse(JSON.stringify(studentsJson))
            console.log(parsedStudentsJson)
        }
    }
    return(
        <div>
            <Button onClick={()=>setShowModal(true)}>Edit</Button>
            <Modal show={showModal} onHide={hidemodals}>
                <Modal.Header closeButton><h2>Add Group</h2></Modal.Header>
                <Modal.Body>
                    <br /><br />
                    { }
                    {/**{showDropDown ? <DropDown /> : null}**/}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={hidemodals}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}