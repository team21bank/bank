import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { AuthUser } from "../../../Authentication/auth";
import { delete_student_from_bank } from "../../../Authentication/EditProfilePage/DeleteAccount";
import { Bank } from "../../../Interfaces/BankObject";
import { BankUser } from "../../../Interfaces/BankUser";
import "./ViewStudent.css";


export function ViewStudent(
    {bank_user, auth_user, bank}:
    {bank_user: BankUser, auth_user: AuthUser, bank: Bank}
): JSX.Element {

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
                    <Button variant="danger" size="sm" onClick={remove_student}>Remove Student</Button>
                </Col>
            </Row>
        </div>
    ) : (
        <></>
    )
}