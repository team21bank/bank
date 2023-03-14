import { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { BiEdit } from "react-icons/bi";
import { AuthUser, BankContext } from "../../../Authentication/auth";
import { update_bank_user } from "../../../DatabaseFunctions/BankUserFunctions";
import { DEFAULT_BANK } from "../../../Interfaces/BankObject";
import { BankUser } from "../../../Interfaces/BankUser";


export function AddToBalanceModal({bank_user}: {bank_user: BankUser}): JSX.Element {
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState(0);

    const current_bank = useContext(BankContext).bank ?? DEFAULT_BANK;

    return (
        <div>
            <Button size="sm" variant="transparent" onClick={() => setShowModal(true)}><BiEdit size="20"/></Button>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton style={{"fontSize": "150%"}}>
                    Editing balance for {bank_user.uid}
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>
                            Add to balance
                        </Form.Label>
                        <Form.Control 
                            type="number"
                            value={amount}
                            onChange={(event) => setAmount(parseInt(event.target.value))}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => update_bank_user(current_bank.bankId, bank_user.uid, {...bank_user, balance: bank_user.balance+amount})}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}