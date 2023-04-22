import { Modal, Button } from "react-bootstrap";
import React, { useState } from "react";

export function DeleteAccountModal(): JSX.Element {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <Modal show={showModal} onHide={()=>setShowModal(false)}>
                <Modal.Header closeButton><h2>Delete Account</h2></Modal.Header>
                <Modal.Body style={{"textAlign": "center", "fontSize": "150%", "color": "red"}}>
                    Are you sure you want to continue?<br />
                    This action is irreversible!
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>setShowModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={()=>{alert("TODO. Still needs to be implemented")}}>Confirm</Button>
                </Modal.Footer>
            </Modal>
            <Button variant="danger" onClick={()=>setShowModal(true)}>Delete Account</Button>
        </div>
    )
}




