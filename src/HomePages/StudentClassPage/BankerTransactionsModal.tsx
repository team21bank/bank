import React, { useContext, useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { Transaction } from '../../Interfaces/Transaction';
import { remove_transaction_from_pending } from "../../DatabaseFunctions/BankFunctions";
import { push_transaction_to_completed } from "../../DatabaseFunctions/BankFunctions";
import { BankContext } from "../../Authentication/auth";
import { Bank, DEFAULT_BANK, copy_bank } from "../../Interfaces/BankObject";
import { BankUser, DEFAULT_BANK_USER } from "../../Interfaces/BankUser";
import { update_bank_user } from "../../DatabaseFunctions/BankUserFunctions";


export function PendingTransactionModal({pendingList}: {pendingList:Transaction[]}){
    const [showModal, setShowModal] = useState(false);
    const current_bank: Bank = useContext(BankContext).bank;
    if (pendingList===undefined){
        pendingList=[]
    }
    return(
    <div>
        <Modal size='lg' show={showModal} onHide={()=>setShowModal(false)}>
            <Modal.Header closeButton><h2>Accept or Reject Transactions</h2></Modal.Header>
            <Row>
                <Col>Sender</Col>
                <Col>Sender's Balance</Col>
                <Col>Amount to Transfer</Col>
                <Col>Receiver</Col>
                <Col>Receiver's Balance</Col>
                <Col>Confirm Transaction</Col>
                <Col>Reject Transaction</Col>
            </Row>
            {pendingList.map((trans:Transaction)=>individualTransaction(trans,current_bank))}
            
        </Modal>
            <form><Button style={{ backgroundColor: '#592693' }} onClick={() => setShowModal(true)}>View Pending Transactions</Button></form>
    </div>)
}

function confirmTransaction(trans: Transaction,currBank: Bank){
    remove_transaction_from_pending(currBank.bankId,trans);
    let sender: BankUser = currBank.studentList.find(val => val.uid === trans.sender_uid) ?? DEFAULT_BANK_USER;
    sender.balance = sender.balance-trans.transfer_amount;
    update_bank_user(currBank.bankId,sender.uid,sender);
    let receiver: BankUser = currBank.studentList.find(val => val.uid === trans.receiver_uid) ?? DEFAULT_BANK_USER;
    receiver.balance = receiver.balance + trans.transfer_amount;
    update_bank_user(currBank.bankId,receiver.uid,receiver);
    push_transaction_to_completed(currBank.bankId,trans)
}

function rejectTransaction(trans: Transaction,currBank: Bank){
    remove_transaction_from_pending(currBank.bankId,trans);
}

function individualTransaction(trans: Transaction,currBank: Bank){
    return(
        <div>
            <Row>
                <Col>{trans.sender_name}</Col>
                <Col>{trans.sender_balance}</Col>
                <Col>{trans.transfer_amount}</Col>
                <Col>{trans.receiver_name}</Col>
                <Col>{trans.receiver_balance}</Col>
                <Col><Button className = "tButton" onClick={()=>confirmTransaction(trans,currBank)}> Confirm </Button></Col>
                <Col><Button className="tButton" onClick={()=>rejectTransaction(trans,currBank)}>Reject </Button></Col>
            </Row>
        </div>
    )
}