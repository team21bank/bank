import React, { useContext, useState } from "react";
import { Form, Button, InputGroup, Modal } from "react-bootstrap";
import { AuthContext } from "../Authentication/auth";
import "./CreateClassModal.css";
import { create_new_bank } from "../DatabaseFunctions/BankFunctions";
import { DEFAULT_AUTH_USER } from "../Interfaces/AuthUser";
import { update_auth_user } from "../DatabaseFunctions/UserFunctions";
import { useNavigate } from "react-router-dom";


export function CreateClassModal(): JSX.Element {
    const user = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;
    const [bank_name, set_bank_name] = useState("");
    const [description, set_description] = useState("");

    const [show, setShow] = useState(false);
    
    const navigate = useNavigate()

    async function createCode() {  
        if(bank_name==="") {return Promise.reject("Bank name cannot be empty")}
        
        while(true) {
            //Create unique classcode
            let characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
            let code = ""
            for (var i=0;i<6;i++){
                code+=characters.charAt(Math.floor(Math.random()*characters.length))
            }
            try {
                await create_new_bank(code, user.hash, bank_name, description)
                await update_auth_user(user.hash, {...user, groups: [...user.groups, code]})
                return code;
            } finally {}
        }
    }


    return (
        <div className="new-class-modal">
            <Modal show={show} onHide={()=>setShow(false)} size="lg">
                <Modal.Header closeButton><h1>Create new class</h1></Modal.Header>
                <Modal.Body>
                    <div className="create-class-page">
                        <InputGroup className="input-box" size="lg" hasValidation>
                            <InputGroup.Text>Class Name: </InputGroup.Text>
                            <Form.Control
                                value={bank_name}
                                type="text"
                                onChange={(e) => set_bank_name(e.target.value)}
                                isInvalid={bank_name.length === 0}
                            />
                            <Form.Control.Feedback type="invalid">Class must have a name</Form.Control.Feedback>
                        </InputGroup>
                        <InputGroup className="input-box" size="lg">
                            <InputGroup.Text>Class Description: </InputGroup.Text>
                            <Form.Control
                                value={description}
                                type="text"
                                onChange={(e) => set_description(e.target.value)}
                                as="textarea"
                                rows={3}
                        />
                        </InputGroup>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="button-bar">
                        <Button
                            onClick={() => {set_bank_name(""); setShow(false);}}
                            variant="secondary"
                            className="submit-button"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => createCode().then((code) => navigate("/teachers/"+code))}
                            className="submit-button"
                            variant="success"
                        >
                            Create Class Code
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
            <Button size="lg" onClick={()=>setShow(true)}>Create new class</Button>
        </div>
    )
}

