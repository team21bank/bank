import React, { useContext, useEffect, useRef, useState } from "react";
import "./StudentList.css";
import { Bank } from "../../../Interfaces/BankObject";
import { get_auth_users } from "../../../DatabaseFunctions/UserFunctions";
import { AuthUser, DEFAULT_AUTH_USER } from "../../../Interfaces/AuthUser";
import { BankUser, MasteryLevel, Role, getTitle } from "../../../Interfaces/BankUser";
import { delete_bank_users, update_bank_user } from "../../../DatabaseFunctions/BankUserFunctions";
import { Button, Col, Container, Form, Image, InputGroup, Modal, Overlay, Row, Table, Tooltip } from "react-bootstrap";
import { BankContext } from "../../../Authentication/auth";
import { Icon } from "../../../Avatar/Icon";
import { update_bank } from "../../../DatabaseFunctions/BankFunctions";


//This file is kind of a mess, sorry everyone

export interface UserPair {
    auth_user: AuthUser,
    bank_user: BankUser
}

export function StudentList(
        {current_bank}: {current_bank: Bank}
    ): JSX.Element {
        
    //Each BankUser in the class with its associated AuthUser
    const [studentList, setStudentList] = useState<UserPair[]>([]);
    
    //I dont like this, hopefully I'll change it later
    //Populates the studentList with AuthUsers and their associated BankUser
    //A default AuthUser with "DELETED USER" username will take its place if the bankUser's associated AuthUser doesnt exist
    //REALLY ONLY NEED TO GET USERNAMES HERE, MAYBE CHANGE TO REDUCE DATABASE READS
    useEffect(() => {
        get_auth_users(current_bank.studentList.map(user => user.uid)).then((auth_users: AuthUser[]) => {
            const pairs: UserPair[] = current_bank.studentList.map(bank_user => {
                return {
                    auth_user: auth_users.find(user => user.hash === bank_user.uid) ?? {...DEFAULT_AUTH_USER, username: "DELETED USER"},
                   bank_user: bank_user
                }
            })
            setStudentList(pairs);
        })
    }, [current_bank]);

    return (
        <Container fluid >
            <h2 className="student-list-header">Students</h2>
            <Table style={{ backgroundColor: "#FCF5E5" }} striped hover bordered className="student-table">
                <thead className="student-table-header">
                    <tr>
                        <th><h3>Username</h3></th>
                        <th><h3>Role</h3></th>
                        <th><h3>Balance</h3></th>
                    </tr>
                </thead>
                <tbody>
                    {studentList.map((user_pair, index) => <StudentRow key={index} user_pair={user_pair} />)}
                </tbody>
            </Table>
        </Container>
    )
}

function StudentRow({user_pair}: {user_pair: UserPair}): JSX.Element {
    const bank_user = user_pair.bank_user;
    const auth_user = user_pair.auth_user;

    const [showModal, setShowModal] = useState(false);
    function hide() {setShowModal(false);}

    const [new_bank_user, set_new_bank_user] = useState<BankUser>(bank_user);
    useEffect(() => {
        set_new_bank_user(bank_user);
    }, [bank_user])

    const bank = useContext(BankContext).bank;
    function save_changes() {
        update_bank_user(bank, bank_user.uid, new_bank_user);
        hide();
    }

    return (
        <>
            <tr onClick={() => setShowModal(true)} className="student-row">
                <td>
                    <Icon avatar={auth_user.avatar}></Icon>
                    {bank_user.alias==="" ? auth_user.username : bank_user.alias}
                </td>
                <td>{getTitle(bank_user.role)}</td>
                <td>{bank_user.balance}</td>
            </tr>
            <Modal show={showModal} onHide={hide} size="lg">
                <Modal.Header closeButton><h1>Editing student {auth_user.username}</h1></Modal.Header>
                <Modal.Body>
                    <EditBankUserForm bank_user={new_bank_user} set_bank_user={set_new_bank_user} set_show_modal={setShowModal}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hide}>Cancel</Button>
                    <Button 
                        variant="success"
                        onClick={save_changes}
                        disabled={are_bankusers_equal(new_bank_user, bank_user)}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

function are_bankusers_equal(a: BankUser, b: BankUser): boolean {
    return (a.uid === b.uid)
        && (a.role === b.role)
        && (a.finishedQuizzes === b.finishedQuizzes)
        && (a.balance === b.balance)
        && (a.alias === b.alias)
        && (a.isBanker === b.isBanker)
}


function EditBankUserForm({bank_user, set_bank_user, set_show_modal}: {bank_user: BankUser, set_bank_user: (b: BankUser) => void, set_show_modal: (b:boolean)=>void}): JSX.Element {
    return (
        <Container className="edit-form-container">
            {/*alias select form */}
            <Row className="edit-form-row">
                <InputGroup size = "lg">
                    <InputGroup.Text className="edit-text-form">Alias</InputGroup.Text>
                    <Form.Control
                        type="text"
                        value={bank_user.alias}
                        onChange={e => set_bank_user({...bank_user, alias: e.target.value})}
                    />
                </InputGroup>
            </Row>
            <Row className="edit-form-row">
            <InputGroup size = "lg">
                <InputGroup.Text className="edit-text-form">Balance</InputGroup.Text>
                <Form.Control
                    type="number"
                    value={bank_user.balance}
                    onChange={e => set_bank_user({...bank_user, balance: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)})}
                />
            </InputGroup>
            </Row>
            {/*role select form */}
            <Row className="edit-form-row">
                <InputGroup size="lg">
                    <InputGroup.Text className="edit-text-form">Role</InputGroup.Text>
                    <Form.Select
                        onChange={select_event => set_bank_user({...bank_user, role: [bank_user.role[0], parseInt(select_event.target.value)]})}
                        defaultValue={bank_user.role[1]}
                    >
                        <option value={MasteryLevel.None}>None</option>
                        <option value={MasteryLevel.Apprentice}>Apprentice</option>
                        <option value={MasteryLevel.Journeyman}>Journeyman</option>
                        <option value={MasteryLevel.Master}>Master</option>
                    </Form.Select>
                    <Form.Select 
                        onChange={select_event => set_bank_user({...bank_user, role: [parseInt(select_event.target.value), bank_user.role[1]]})}
                        defaultValue={bank_user.role[0]}
                    >
                        <option value={Role.None}>None</option>
                        <option value={Role.Artist}>Artist</option>
                        <option value={Role.Ascetic}>Ascetic</option>
                        <option value={Role.Banker}>Banker</option>
                        <option value={Role.Explorer}>Explorer</option>
                        <option value={Role.Merchant}>Merchant</option>
                        <option value={Role.Noble}>Noble</option>
                    </Form.Select>
                </InputGroup>
            </Row>
            <br/>
            <Col style={{textAlign: "center"}}><DeleteButton bank_user={bank_user} set_show_modal={set_show_modal}/></Col>
        </Container>
    )
}


function DeleteButton({bank_user, set_show_modal}: {bank_user: BankUser, set_show_modal: (b:boolean)=>void}): JSX.Element {
    const [show_tooltip, set_show_tooltip] = useState(false);
    const target = useRef(null);

    const bank = useContext(BankContext).bank;

    function delete_bank_user() {
        const new_bank = {
            ...bank,
            studentList: bank.studentList.filter(u => are_bankusers_equal(u, bank_user) === false)
        }
        update_bank(bank.bankId, new_bank).then(() => set_show_modal(false))
    }

    return (
        <>
            <Button variant="danger" ref={target} onClick={()=>set_show_tooltip(true)} onDoubleClick={delete_bank_user}>
                Delete User
            </Button>
            <Overlay target={target.current} show={show_tooltip} placement="right">
                <Tooltip>
                    Double click to delete!
                </Tooltip>
            </Overlay>
        </>
    )
}