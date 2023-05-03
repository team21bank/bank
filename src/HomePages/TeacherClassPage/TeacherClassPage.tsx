import React, { useContext, useEffect, useState } from 'react';
import { BankContext, BANK_STORAGE_KEY, change_bank } from "../../Authentication/auth";
import { AddStudentsModal } from "./AddStudents/AddStudentsModal";
import { Bank, DEFAULT_BANK } from "../../Interfaces/BankObject"
import "./TeacherClassPage.css";
import { Button, Col, Container, Form, InputGroup, Modal, Tab, Tabs } from 'react-bootstrap';
import { StudentList } from './StudentList/StudentList';
import { AssignQuizzesPage } from './AssignQuizzesPage';
import { PendingTransactionPage } from '../StudentClassPage/BankerTransactionsModal';
import { update_bank } from '../../DatabaseFunctions/BankFunctions';
import { ExportBalances } from './ExportBalances';

export function TeacherClassPage({classCode}:{classCode:string}){
    const bank: Bank = useContext(BankContext).bank;

    useEffect(() => {
        if(window.sessionStorage.getItem(BANK_STORAGE_KEY) === classCode.slice(0,6)) {return;}
        change_bank(classCode.slice(0,6));
    }, []);

    const [show_edit_modal, set_show_edit_modal] = useState(false);
    
    return (
        <div className="teacher-class-page">
            <h1
                style={{backgroundColor: bank.color, paddingBottom: ".5em", paddingTop: ".5em", fontSize: "70px"}}
                className="class-header"
                onClick={() => set_show_edit_modal(true)}
            >
                {bank.classTitle}
            </h1>

            <Tabs
                fill
                defaultActiveKey="Students"
                style={{fontSize: "1.4vw"}}
            >
                <Tab eventKey="Students" title="Students">
                    <Container fluid className="tab-page-container">
                        <StudentList current_bank={bank} />
                        <AddStudentsModal classID={classCode} />
                        <ExportBalances current_bank={bank}></ExportBalances>
                    </Container>
                </Tab>
                <Tab eventKey="Class Quizzes" title="Class Quizzes">
                    <Container fluid className="tab-page-container">
                        <AssignQuizzesPage />
                    </Container>
                </Tab>
                <Tab eventKey="Pending Transactions" title="Pending Transactions">
                    <Container fluid className="tab-page-container">
                        <PendingTransactionPage />
                    </Container>
                </Tab>
            </Tabs>
            <EditClassModal show={show_edit_modal} set_show={set_show_edit_modal}/>
        </div>
    )
}


function EditClassModal({show, set_show}: {show: boolean, set_show: (b: boolean)=>void}): JSX.Element {
    const bank: Bank = useContext(BankContext).bank;
    const [class_name, set_class_name] = useState<null | string>(null);
    const [class_description, set_class_description] = useState<null | string>(null);
    const [class_color, set_class_color] = useState<null | string>(null);

    function hide() {
        set_show(false)
        set_class_name(null);
        set_class_description(null);
        set_class_color(null);
    }
    function save() {
        const new_bank: Bank = {...bank, classTitle: class_name??bank.classTitle, description: class_description??bank.description, color: class_color??bank.color};
        update_bank(bank.bankId, new_bank).then(() => hide());
    }

    return (
        <Modal show={show} onHide={hide} size="lg">
            <Modal.Header closeButton><h1>Edit Class Info</h1></Modal.Header>
            <Modal.Body>
                <InputGroup size="lg" style={{paddingTop: "10px"}}>
                    <InputGroup.Text>Class Name</InputGroup.Text>
                    <Form.Control
                        type="text"
                        value={class_name ?? bank.classTitle}
                        onChange={e => set_class_name(e.target.value)}
                    />
                </InputGroup>
                <InputGroup size="lg" style={{paddingTop: "10px"}}>
                    <InputGroup.Text>Class Description</InputGroup.Text>
                    <Form.Control
                        type="text"
                        as="textarea"
                        rows={2}
                        value={class_description ?? bank.description}
                        onChange={e => set_class_description(e.target.value)}
                    />
                </InputGroup>
                <InputGroup size="lg" style={{paddingTop: "10px"}}>
                    <InputGroup.Text>Class Color</InputGroup.Text>
                    <Form.Control
                        size="lg"
                        type="color"
                        value={class_color ?? bank.color}
                        onChange={e => set_class_color(e.target.value)}
                    />
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <Col>
                    <Button size="lg" variant="danger" onClick={hide}>Cancel</Button>
                </Col>
                <Button size="lg" variant="success" onClick={save}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}



//Add this in somewhere else at some point
//we dont really need it right now
function DeleteBankModal(
    {delete_bank_function, bank_name}: {delete_bank_function: ()=>void, bank_name: string}
): JSX.Element {
    const [showModal, setShowModal] = useState(false);


    return (
    <div>
        <Modal show={showModal} onHide={()=>setShowModal(false)}>
        <Modal.Header closeButton><h2>Delete Bank {bank_name}</h2></Modal.Header>
            <Modal.Body style={{"textAlign": "center", "fontSize": "150%", "color": "red"}}>
                Are you sure you want to delete bank {bank_name}? <br/>
                This action is irreversible!
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>setShowModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={delete_bank_function}>Confirm</Button>
            </Modal.Footer>
        </Modal>
        <Button variant="danger" onClick={()=>setShowModal(true)}>Delete Bank</Button>
    </div>
    )
}