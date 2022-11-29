import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { AuthUser } from "../../../Authentication/auth";
import { delete_student_from_bank } from "../../../Authentication/EditProfilePage/DeleteAccount";
import { Bank } from "../../../Interfaces/BankObject";
import { BankUser } from "../../../Interfaces/BankUser";
import { ref, getDatabase, onValue, set} from '@firebase/database';
import "./ViewStudent.css";


export function ViewStudent(
    {bank_user, auth_user, bank, index}:
    {bank_user: BankUser, auth_user: AuthUser, bank: Bank, index:number}
): JSX.Element {

    function editBalance(){
        let money=Number((document.getElementById('deposit-withdrawal') as HTMLInputElement).value);
        set(ref(getDatabase(),'/groups/'+bank.bankId+'/bankObj/studentList/'+String(index)+'/balance'),bank_user.balance+money);
    }

    function remove_student() {
        delete_student_from_bank(bank.bankId, bank_user.uid);
        window.setTimeout(()=>window.location.reload(), 100);
    }

    return bank_user ? (
        <div className="student-list-item">
            <Row>
                <Col>
                    {auth_user.username}
                </Col>
                <Col>
                    balance: {bank_user.balance}
                </Col>
                <Col>
                    <input id='deposit-withdrawal' type='number'></input>
                    <Button onClick={editBalance}>Add/Subtract From Student Balance</Button>
                </Col>
                <Col>
                    <Button variant="danger" size="sm" onClick={remove_student}>Remove Student</Button>
                </Col>
            </Row>
        </div>
    ) : (
        <></>
    )
}