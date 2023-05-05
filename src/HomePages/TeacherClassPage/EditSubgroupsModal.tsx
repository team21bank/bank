import React, { useContext, useEffect, useState } from 'react';
import "./TeacherClassPage.css";
import { Modal, Button, Col } from "react-bootstrap";
import { Form } from 'react-bootstrap';
import { Subgroup } from "../../Interfaces/Subgroup";
import "./styles.css";
import { Multiselect } from "multiselect-react-dropdown";
import { AuthUser } from '../../Interfaces/AuthUser';
import { BankContext } from '../../Authentication/auth';
import { Bank } from '../../Interfaces/BankObject';
import { update_bank } from '../../DatabaseFunctions/BankFunctions';
import { BiEdit } from 'react-icons/bi';

export function EditSubgroupsModal({subgroup, students, index}: {subgroup: Subgroup, students: AuthUser[], index: number}) {
    const bank = useContext(BankContext).bank;

    const [show_modal, set_show_modal] = useState(false);
    function hide_modal() {
        set_show_modal(false);
    }
    const [new_name, set_new_name] = useState<string>(subgroup.name);
    //the new student list has to be a list of authusers because Multiselect is stupid and does not render plain old strings
    //it requires an object and the dislayValue attribute to determine what is rendered in the list
    const [new_student_list, set_new_student_list] = useState<AuthUser[]>(students.filter(a => subgroup.studentList.find(v => v===a.username) !== undefined));
    useEffect(() => {
        if(new_student_list.length !== 0) {return;}
        set_new_student_list(students.filter(a => subgroup.studentList.find(v => v===a.username) !== undefined))
    }, [students])

    function save_subgroup() {
        //save save the subgroup in the proper index then call update_bank
        const new_subgroup: Subgroup = {
            name: new_name,
            studentList: new_student_list.map(s => s.username)
        }
        const new_bank: Bank = {
            ...bank,
        }
        new_bank.subgroups.splice(index, 1, new_subgroup)

        update_bank(bank.bankId, new_bank);
    }

    return(
        <div>
            <Modal show={show_modal} onHide={hide_modal} size="lg">
                <Modal.Header closeButton><h2>Add Group</h2></Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label><h3>Enter group name</h3></Form.Label>
                        <Form.Control 
                            type="text"
                            value={new_name}
                            onChange={e => set_new_name(e.target.value)}
                        />
                    </Form.Group>
                    <br/>
                    <div className="App">
                        <h3>Select Students</h3>
                        <Multiselect
                            options={students} // Options to display in the dropdown
                            selectedValues={new_student_list}
                            onSelect={list => set_new_student_list(list)} // Function will trigger on select event
                            onRemove={list => set_new_student_list(list)} // Function will trigger on remove event
                            displayValue="username"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Col><Button variant="danger" onClick={hide_modal}>Cancel</Button></Col>
                    <Button variant="success" onClick={save_subgroup}>Save</Button>
                </Modal.Footer>
            </Modal>
            <Button onClick={() => set_show_modal(true)}><BiEdit/></Button>
        </div>
    )
}