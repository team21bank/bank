import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Bank } from "../Interfaces/BankObject";
import "./CreateClassPage.css";


export function CreateClassPage(): JSX.Element {
    const [newBank, setNewBank] = useState<Bank>({
        bankId: "",
        teacherID: "",
        studentList: [],
        classTitle: ""
    });

    return (
        <div className="create-class-page">
            <h1>Create new class</h1>
            <Form.Group>

            </Form.Group>
        </div>
    )
}