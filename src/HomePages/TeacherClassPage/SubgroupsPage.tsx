import React, { useContext, useEffect, useState } from 'react';
import "./TeacherClassPage.css";
import { Modal, Button, Col, Row, Table } from "react-bootstrap";
import { Form } from 'react-bootstrap';
import { Subgroup } from "../../Interfaces/Subgroup";
import "./styles.css";
import { Multiselect } from "multiselect-react-dropdown";
import { EditSubgroupsModal } from './EditSubgroupsModal';
import { BsTrashFill } from "react-icons/bs";
import "./TeacherClassPage.css";
import { BankContext } from '../../Authentication/auth';
import { Bank } from '../../Interfaces/BankObject';
import { get_auth_users } from '../../DatabaseFunctions/UserFunctions';
import { AuthUser } from '../../Interfaces/AuthUser';
import { update_bank } from '../../DatabaseFunctions/BankFunctions';


export function SubgroupsPage({ classCode }: { classCode: string }) {
    const bank: Bank = useContext(BankContext).bank;
    const villages = bank.subgroups;
    const [students, set_students] = useState<AuthUser[]>([]);
    useEffect(() => {
        get_auth_users(bank.studentList.map(user => user.uid)).then((auth_users: AuthUser[]) => {
            set_students(auth_users);
        });
    }, [bank]);
    
    //Modal visibility logic
    const [showModal, setShowModal] = useState(false);
    function hidemodal() {
        setShowModal(false)
        set_selected_users([]);
        setgroupName("");
    }
    function showmodal() {
        setShowModal(true)
    }

    //selected users has to be an authuser array because Multiselect is stupid and does not render basig strings
    //it requires a displayValue attribute to tell you which property of the AuthUser object to render
    const [selected_users, set_selected_users] = useState<AuthUser[]>([])
    const [groupName, setgroupName] = useState<string>("")

    function save_subgroup() {
        const new_subgroup: Subgroup = {
            name: groupName,
            studentList: selected_users.map(u => u.username)
        }
        
        //PUSH SUBGROUP TO DATABASE HERE
        update_bank(bank.bankId, {...bank, subgroups: [...bank.subgroups, new_subgroup]}).then(() => {
            hidemodal();
        });
    }
    
    //deletes the subgroup at the proper index then saves it to the database
    function delete_subgroup_at_index(index: number) {
        const new_bank = {...bank}
        new_bank.subgroups.splice(index, 1);
        update_bank(bank.bankId, new_bank);
    }
    
    return (
        <div id = "hunterBackdrop" className="teacher-class-page">
            <Modal show={showModal} onHide={hidemodal} size="lg">
                <Modal.Header closeButton><h2>Add Group</h2></Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label><h3>Enter group name</h3></Form.Label>
                        <Form.Control 
                            type="text"
                            value={groupName}
                            onChange={e => setgroupName(e.target.value)}
                        />
                    </Form.Group>
                    <br/>
                    <div className="App">
                        <h3>Select Students</h3>
                        <Multiselect
                            options={students} // Options to display in the dropdown
                            selectedValues={selected_users}
                            onSelect={list => set_selected_users(list)} // Function will trigger on select event
                            onRemove={list => set_selected_users(list)} // Function will trigger on remove event
                            displayValue="username" // Property name to display in the dropdown options
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Col><Button variant="danger" onClick={hidemodal}>Cancel</Button></Col>
                    <Button variant="success" onClick={save_subgroup}>Create Group</Button>
                </Modal.Footer>
            </Modal>
            <br></br>
            <Button onClick={showmodal} size="lg">Add Group</Button>
            <br></br>
            <br></br>
            <Table style={{ backgroundColor: "#FCF5E5" }} striped bordered align="center">
                <thead>
                    <tr>
                        <th id="th-width" colSpan={2}>Village name</th>
                        <th id="th-width" >Students</th>
                    </tr>
                </thead>
                <tbody>
                    {villages.map((village, index) => (
                        <tr data-index={index} key={index}>
                            <td><Button variant="danger" onClick={() => delete_subgroup_at_index(index)}><BsTrashFill/></Button></td>
                            <td>{village.name}</td>
                            <td>
                                <Col style={{paddingLeft: "10px"}}>{village.studentList?.map((student, id) => 
                                    <Row key={id}>{student}</Row>
                                )}</Col>
                            </td>
                            <td><EditSubgroupsModal subgroup={village} students={students} index={index}/></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}
