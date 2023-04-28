import React, { useContext, useEffect, useState } from 'react';
import { Button, Table, Container, Form, InputGroup, Col, Modal, Alert } from 'react-bootstrap';
import { AuthContext, BankContext, BANK_STORAGE_KEY, change_bank } from "../../Authentication/auth";
import { Bank } from '../../Interfaces/BankObject';
import { AuthUser, default_authuser } from '../../Interfaces/AuthUser';
import { push_transaction_to_pending } from '../../DatabaseFunctions/BankFunctions';
import { makeStudentToStudentTransaction } from '../../Interfaces/Transaction';
import { BankUser, DEFAULT_BANK_USER } from '../../Interfaces/BankUser';
import { UserPair } from '../TeacherClassPage/StudentList/StudentList';
import { get_auth_users } from '../../DatabaseFunctions/UserFunctions';

export function TransactionModal() {
    const user: AuthUser = useContext(AuthContext).user;
    const bank: Bank = useContext(BankContext).bank;
    const bank_user: BankUser = bank.studentList.find(val => val.uid === user.hash) ?? DEFAULT_BANK_USER;

    const [show_confirm_modal, set_show_confirm_modal] = useState(false);

    const [receiver, set_receiver] = useState<UserPair | null>(null);
    const [description, set_description] = useState("");
    const [amount, set_amount] = useState(0);

    //Each BankUser in the class with its associated AuthUser
    const [studentList, setStudentList] = useState<UserPair[]>([]);
    //Populates the studentList with AuthUsers and their associated BankUser
    //A default AuthUser with "DELETED USER" username will take its place if the bankUser's associated AuthUser doesnt exist
    //REALLY ONLY NEED TO GET USERNAMES HERE, MAYBE CHANGE TO REDUCE DATABASE READS
    useEffect(() => {
        get_auth_users(bank.studentList.map(user => user.uid)).then((auth_users: AuthUser[]) => {
            const pairs: UserPair[] = bank.studentList.map(bank_user => {
                return {
                    auth_user: auth_users.find(user => user.hash === bank_user.uid) ?? {...default_authuser(), username: "DELETED USER"},
                   bank_user: bank_user
                }
            }).filter(user_pair => user_pair.bank_user.uid !== user.hash)
            setStudentList(pairs);
        })
    }, [bank]);

    //makeStudentToStudentTransaction
    //push_transaction_to_pending

    //Push the transaction to the pending list
    function send() {
        if(receiver === null) {return;}
        let transaction = makeStudentToStudentTransaction(user, bank_user, receiver.auth_user, receiver.bank_user, amount, false, undefined, description);

        push_transaction_to_pending(bank.bankId, transaction);


        set_show_confirm_modal(true);
        set_receiver(null);
        set_description("");
        set_amount(0);
    }

    
    return (
        <Container fluid style={{width: "80%"}}>
            <Col>
                <div style={{textAlign: "left"}}><Form.Label style={{fontSize: "25px"}}>Select recipient</Form.Label></div>
                <Form.Select size="lg" onChange={e => set_receiver(studentList[e.target.value])}>
                    <option disabled={receiver!==null}>Select a classmate</option>
                    {studentList.map((user_pair, index) => <option key={index} value={index}>{user_pair.auth_user.username}</option>)}
                </Form.Select>
                <br/>
                <InputGroup size="lg" hasValidation>
                    <InputGroup.Text>How much money?</InputGroup.Text>
                    <Form.Control 
                        type="number"
                        value={amount}
                        onChange={e => set_amount(isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value))}
                        isInvalid={amount > bank_user.balance}
                    />
                    <Form.Control.Feedback type="invalid">You only have ${bank_user.balance} to send!</Form.Control.Feedback>
                </InputGroup>
                <br />
                <InputGroup size="lg">
                    <InputGroup.Text>What is this for?</InputGroup.Text>
                    <Form.Control 
                        type="test"
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={e => set_description(e.target.value)}
                    />
                </InputGroup>
                <br/>
                <Button
                    size="lg"
                    variant="success"
                    onClick={send}
                    disabled={receiver===null || amount > bank_user.balance}    
                >Send</Button>
            </Col>
            <Modal show={show_confirm_modal} onHide={() => set_show_confirm_modal(false)}>
                <Modal.Header closeButton><h2>Confirmed!</h2></Modal.Header>
                <Modal.Body>
                    <Alert>
                        <div>Your transaction has been sent to the bankers for review!</div>
                    </Alert>
                </Modal.Body>
            </Modal>
        </Container>
    )
}
