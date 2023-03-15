import { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { BiEdit } from "react-icons/bi";
import { AuthUser, BankContext } from "../../../Authentication/auth";
import { update_bank_user } from "../../../DatabaseFunctions/BankUserFunctions";
import { DEFAULT_BANK } from "../../../Interfaces/BankObject";
import { BankUser } from "../../../Interfaces/BankUser";
import { BsArrowRight } from "react-icons/bs";
import "./EditBalanceModal.css";


export function EditBalanceModal({bank_user}: {bank_user: BankUser}): JSX.Element {
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState(0);

    const current_bank = useContext(BankContext).bank ?? DEFAULT_BANK;

    return (
        <div>
            <Button style={{"marginTop": "-3.5%"}} size="sm" variant="transparent" onClick={() => setShowModal(true)}><BiEdit className="edit-icon" size="20"/></Button>
            <Modal show={showModal} 
                onHide={() => {
                    setShowModal(false);
                    setAmount(0);
                }}
            >
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
                            defaultValue={0}
                            onChange={(event) => {
                                let amt = parseInt(event.target.value);
                                setAmount(isNaN(amt) ? 0 : amt);
                            }}
                        />
                    </Form.Group>
                    <div style={{"fontSize": "300%"}}>
                        {bank_user.balance} <BsArrowRight/> {bank_user.balance+amount}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="success" 
                        onClick={() => {
                            update_bank_user(current_bank.bankId, bank_user.uid, {...bank_user, balance: bank_user.balance+amount});
                            setAmount(0);
                            setShowModal(false);
                        }}
                    >Confirm</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}