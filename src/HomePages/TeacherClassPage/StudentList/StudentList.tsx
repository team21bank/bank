import React, { useEffect, useState } from "react";
import { ViewStudent } from "./ViewStudent";
import "./StudentList.css";
import { Bank } from "../../../Interfaces/BankObject";
import { get_auth_users } from "../../../DatabaseFunctions/UserFunctions";
import { AuthUser, DEFAULT_AUTH_USER } from "../../../Interfaces/AuthUser";
import { BankUser, getTitle } from "../../../Interfaces/BankUser";
import { delete_bank_users } from "../../../DatabaseFunctions/BankUserFunctions";
import { Button, Modal, Table } from "react-bootstrap";



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
        <div>
            <h2 className="student-list-header">Students</h2>
            <Table striped hover bordered className="student-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {studentList.map((user_pair) => <StudentRow user_pair={user_pair}/>)}
                </tbody>
            </Table>
        </div>
    )
}

function StudentRow({user_pair}: {user_pair: UserPair}): JSX.Element {
    const [showModal, setShowModal] = useState(false);
    function hide() {setShowModal(false);}

    function save_changes() {
        alert("TODO: This feature is still being worked on");
    }

    return (
        <>
            <tr onClick={() => setShowModal(true)} className="student-row">
                <td>{user_pair.auth_user.username}</td>
                <td>{getTitle(user_pair.bank_user.role)}</td>
                <td>{user_pair.bank_user.balance}</td>
            </tr>
            <Modal show={showModal} onHide={hide} size="lg">
                <Modal.Header><h1>Editing student {user_pair.auth_user.username}</h1></Modal.Header>
                <Modal.Body>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hide}>Cancel</Button>
                    <Button variant="success" onClick={save_changes}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}