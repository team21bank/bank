import React, { useContext, useState } from "react";
import { Modal, Button, Row, Col, Table, Container } from "react-bootstrap";
import { Transaction } from '../../Interfaces/Transaction';
import { remove_transaction_from_pending } from "../../DatabaseFunctions/BankFunctions";
import { push_transaction_to_completed } from "../../DatabaseFunctions/BankFunctions";
import { BankContext } from "../../Authentication/auth";
import { Bank, DEFAULT_BANK, copy_bank } from "../../Interfaces/BankObject";
import { BankUser, DEFAULT_BANK_USER } from "../../Interfaces/BankUser";
import { update_bank_user } from "../../DatabaseFunctions/BankUserFunctions";


export function PendingTransactionPage({pendingList}: {pendingList:Transaction[]}){
    const bank: Bank = useContext(BankContext).bank;
    if (pendingList===undefined){
        pendingList=[]
    }

    return(
        <Container fluid style={{display: "flex", justifyContent: "center"}}>
            <Table striped bordered style={{maxWidth: "80%"}}>
                <thead style={{fontSize: "130%"}}>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Amount</th>
                        <th>Reason</th>
                        <th>Confirm or Reject</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingList.map((trans:Transaction, index) => 
                        <tr key={index}>
                            <td>{trans.sender_name}</td>
                            <td>{trans.receiver_name}</td>
                            <td>{trans.transfer_amount}</td>
                            <td>{trans.sender_description}</td>
                            <td>
                                <Button variant="success" onClick={()=>confirmTransaction(trans,bank)}> Confirm </Button>
                                <Button variant="danger" onClick={()=>rejectTransaction(trans,bank)} style={{marginLeft: "5px"}}>Reject </Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    )
}

function confirmTransaction(trans: Transaction,currBank: Bank){
    remove_transaction_from_pending(currBank.bankId,trans);
    let sender: BankUser = currBank.studentList.find(val => val.uid === trans.sender_uid) ?? DEFAULT_BANK_USER;
    sender.balance = Number(Number(sender.balance-Number(trans.transfer_amount.toFixed(2))).toFixed(2));
    update_bank_user(currBank.bankId,sender.uid,sender);
    let receiver: BankUser = currBank.studentList.find(val => val.uid === trans.receiver_uid) ?? DEFAULT_BANK_USER;
    receiver.balance = Number(Number(receiver.balance + Number(trans.transfer_amount.toFixed(2))).toFixed(2));
    update_bank_user(currBank.bankId,receiver.uid,receiver);
    push_transaction_to_completed(currBank.bankId,trans)
}

function rejectTransaction(trans: Transaction,currBank: Bank){
    remove_transaction_from_pending(currBank.bankId,trans);
}