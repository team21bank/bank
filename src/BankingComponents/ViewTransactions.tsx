import React, { useContext, useState } from 'react';
import { Alert, Button, Container, Table } from 'react-bootstrap';
import { compareDates, Transaction } from '../Interfaces/Transaction'; //Used to sort the passed in Transactions by date
import './ViewTransactions.css'
import { AuthContext, BankContext } from '../Authentication/auth';

export function ViewTransactions(): JSX.Element {
    //State variable to be able to expand/contract transactions
    const [viewAll, setViewAll] = useState<Boolean>(false);
    const bank = useContext(BankContext).bank;
    const user = useContext(AuthContext).user;

    //filter transactions to only contained ones where the current user is a receiver or sender, then sort the result, and slice it if viewAll is false
    const transactions = (bank.completedList as Record<string, Transaction[]>)[user.hash].sort((a, b) => compareDates(a, b));

    return (
        <Container style={{paddingTop: "8vh"}}>
            <h2>Your Transactions:</h2>
            <Table striped>
                <thead>
                    <tr>
                        <th>Account</th>
                        <th>To/From</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Balance</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t, index) => 
                        <tr key={index}>
                            <td>{t.receiver_name}</td>
                            <td>{t.sender_name}</td>
                            <td>{t.receiver_description}</td>
                            <td style={{backgroundColor: (user.hash===t.sender_uid) ? "pink" : "lightgreen"}}>{t.transfer_amount.toFixed(2)}</td>
                            <td>{t.receiver_balance.toFixed(2)}</td>
                            <td>{new Date(Date.parse(t.date)).toLocaleString()}</td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan={6}>
                            {transactions.length===0 ? (
                                <Alert variant="info">No transactions!</Alert>
                            ) : (
                                viewAll ? (
                                    <Button onClick={()=>setViewAll(false)}>Collapse transactions</Button>
                                ) : (
                                    <Button onClick={()=>setViewAll(true)}>View all transactions</Button>
                                )
                            )}
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    )
}
