import { useState, useContext } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { BiEdit } from "react-icons/bi";
import { BankContext } from "../../../Authentication/auth";
import { update_bank_user } from "../../../DatabaseFunctions/BankUserFunctions";
import { DEFAULT_BANK } from "../../../Interfaces/BankObject";
import { BankUser, MasteryLevel, Role } from "../../../Interfaces/BankUser";


export function EditRoleModal({bank_user}: {bank_user: BankUser}): JSX.Element {
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState(bank_user.role ?? [Role.None, MasteryLevel.None]);

    const current_bank = useContext(BankContext).bank ?? DEFAULT_BANK;

    return (
        <div>
            <Button style={{"marginTop": "-3.5%"}} size="sm" variant="transparent" onClick={() => setShowModal(true)}><BiEdit className="edit-icon" size="20"/></Button>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton style={{"fontSize": "150%"}}>
                    Editing role for {bank_user.uid}
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>
                            Select profession and mastery level
                        </Form.Label>
                        <Form.Select 
                            onChange={select_event => setRole([parseInt(select_event.target.value), role[1]])}
                            defaultValue={role[0]}
                        >
                            <option value={Role.None}>None</option>
                            <option value={Role.Artist}>Artist</option>
                            <option value={Role.Ascetic}>Ascetic</option>
                            <option value={Role.Banker}>Banker</option>
                            <option value={Role.Explorer}>Explorer</option>
                            <option value={Role.Merchant}>Merchant</option>
                            <option value={Role.Noble}>Noble</option>
                        </Form.Select>
                        <br/>
                        <Form.Select
                            onChange={select_event => setRole([role[0], parseInt(select_event.target.value)])}
                            defaultValue={role[1]}
                        >
                            <option value={MasteryLevel.None}>None</option>
                            <option value={MasteryLevel.Apprentice}>Apprentice</option>
                            <option value={MasteryLevel.Journeyman}>Journeyman</option>
                            <option value={MasteryLevel.Master}>Master</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="success" 
                        onClick={() => {
                            update_bank_user(current_bank.bankId, bank_user.uid, {...bank_user, role: role});
                            setShowModal(false);
                        }}
                    >Confirm</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}