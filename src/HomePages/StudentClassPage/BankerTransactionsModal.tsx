import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { Transaction } from '../../Interfaces/Transaction';


export function PendingTransactionModal({pendingList}: {pendingList:Transaction[]}){
    const [showModal, setShowModal] = useState(false);
    if (pendingList===undefined){
        pendingList=[]
    }
    return(
    <div>
        <Modal show={showModal} onHide={()=>setShowModal(false)}>
            <Modal.Header closeButton><h2>Accept or Reject Transactions</h2></Modal.Header>
            <Row>
                <Col>Sender</Col>
                <Col>Sender's Balance</Col>
                <Col>Amount to Transfer</Col>
                <Col>Receiver</Col>
                <Col>Receiver's Balance</Col>
            </Row>
            {pendingList.map((trans:Transaction)=>individualTransaction(trans))}
            
        </Modal>
        <form><Button onClick={() => setShowModal(true)}>View Pending Transactions</Button></form>
    </div>)
}

function individualTransaction(trans: Transaction){
    return(
        <div>
            <Row>
                <Col>{trans.sender_name}</Col>
                <Col>{trans.sender_balance}</Col>
                <Col>{trans.transfer_amount}</Col>
                <Col>{trans.receiver_name}</Col>
                <Col>{trans.receiver_balance}</Col>
            </Row>
        </div>
    )
}