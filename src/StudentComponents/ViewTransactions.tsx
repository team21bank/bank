import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Transaction } from '../Interfaces/Transaction';
import { FormattedTransaction } from './FormattedTransaction';

export function ViewTransactions({transactions}: {transactions: Transaction[]}): JSX.Element {
    const [viewAll, setViewAll] = useState<Boolean>(false);
    //Takes in the student's transactions and displays them 
    //<h3>{"Account\tSource\tChange"}</h3>
    return viewAll ? 
    <div style={{display: "wrap", justifyContent: "center", alignItems: "stretch", width: "50%", margin: "auto"}}>
        <h4>Your Transactions:</h4>
        <h3>{"Account\t\tSource\t\tChange"}</h3>
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
            <td>{transaction.amount}</td>
            <td>{transaction.balance}</td>
        </tr>})}
        </tbody>
        </table>
        <Button onClick={() => setViewAll(false)}>Collapse Transactions</Button>
    </div>
    : 
    <div style={{display: "wrap", justifyContent: "center", alignItems: "stretch", width: "50%", margin: "auto"}}>
        <h4>Your Transactions:</h4>
        <h3>{"Account\t\tSource\t\tChange"}</h3>
        <table>
        <tbody>
        {transactions.slice(0,5).map((transaction: Transaction): JSX.Element => {
        return <tr>
        <td>{transaction.account}</td>
        <td>{transaction.sender}</td>
        <td>{transaction.description}</td>
        <td>{transaction.amount}</td>
        <td>{transaction.balance}</td>
    </tr>})}
    </tbody>
    </table>
        <Button onClick={() => setViewAll(true)}>Expand All Transactions</Button>
    </div>
    //Replace {transaction} with a transaction viewer component; Something that 
}
