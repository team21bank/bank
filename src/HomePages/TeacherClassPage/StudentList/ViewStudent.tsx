import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { AuthUser } from "../../../Authentication/auth";
import { BankUser } from "../../../Interfaces/BankUser";
import "./ViewStudent.css";


export function ViewStudent({bank_user, auth_user}: {bank_user: BankUser, auth_user: AuthUser}): JSX.Element {



    return (
        <div className="student-list-item">
            <Row>
                <Col>
                    {auth_user.username}
                </Col>
                <Col>
                    balance: {bank_user.balance}
                </Col>
                <Col>
                    <Button variant="danger" size="sm">Remove Student</Button>
                </Col>
            </Row>
        </div>
    )
}