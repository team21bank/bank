import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Transaction } from '../Interfaces/Transaction';

export function ViewTransactions({transactions}: {transactions: Transaction[]}): JSX.Element {
    const [viewAll, setViewAll] = useState<Boolean>(false);
    //Takes in the student's transactions and displays them in a table
    return viewAll ? 
    <div style={{display: "wrap", justifyContent: "center", alignItems: "stretch", width: "50%", margin: "auto"}}>
        <h4>Your Transactions:</h4>
        <table>
        <tbody>
            <th>Account</th>
            <th>Sender</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Balance</th>
        {transactions.map((transaction: Transaction): JSX.Element => {
        return <tr>
            <td>{transaction.account}</td>
            <td>{transaction.sender}</td>
            <td>{transaction.description}</td>
            <td>{transaction.amount.toFixed(2)}</td>
            <td>{transaction.balance.toFixed(2)}</td>
        </tr>})}
        </tbody>
        </table>
        <Button onClick={() => setViewAll(false)}>Collapse Transactions</Button>
    </div>
    : 
    <div style={{display: "wrap", justifyContent: "center", alignItems: "stretch", width: "50%", margin: "auto"}}>
        <h4>Your Transactions:</h4>
        <table>
        <tbody>
        <th>Account</th>
        <th>Sender</th>
        <th>Description</th>
        <th>Amount</th>
        <th>Balance</th>
        {transactions.slice(0,5).map((transaction: Transaction): JSX.Element => {
        return <tr>
        <td>{transaction.account}</td>
        <td>{transaction.sender}</td>
        <td>{transaction.description}</td>
        <td>{transaction.amount.toFixed(2)}</td>
        <td>{transaction.balance.toFixed(2)}</td>
    </tr>})}
    </tbody>
    </table>
        <Button onClick={() => setViewAll(true)}>Expand All Transactions</Button>
    </div>
}
