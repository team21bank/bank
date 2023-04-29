import React, { useContext, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { compareDates, Transaction } from '../Interfaces/Transaction'; //Used to sort the passed in Transactions by date
import './ViewTransactions.css'
import { AuthContext, BankContext } from '../Authentication/auth';

/**
 * Takes in the student's transactions, as well as their BankUser ID (BankUser.uid) and displays the transactions in a table.
 * @param transactionsAndUID An object with 2 fields; transactions, an Array of transactions, and uid, a string for the BankUser's id.
 */
export function ViewTransactions(): JSX.Element {
    //State variable to be able to expand/contract transactions
    const [viewAll, setViewAll] = useState<Boolean>(false);
    const bank = useContext(BankContext).bank;
    const user = useContext(AuthContext).user;

    //filter transactions to only contained ones where the current user is a receiver or sender, then sort the result, and slice it if viewAll is false
    const transactions = bank.completedList
                            .filter(t => user.hash === t.receiver_uid || user.hash === t.sender_uid)
                            .sort((a, b) => compareDates(b,a))
                            .slice(0, viewAll ? undefined : 5)

    return (
        <Container>
            <h4>Your Transactions:</h4>
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
                            {viewAll ? (
                                <Button onClick={()=>setViewAll(false)}>Collapse transactions</Button>
                            ) : (
                                <Button onClick={()=>setViewAll(true)}>View all transactions</Button>
                            )}
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    )
}
