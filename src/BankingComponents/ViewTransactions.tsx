import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { compareDates, Transaction } from '../Interfaces/Transaction'; //Used to sort the passed in Transactions by date
import './ViewTransactions.css'

/**
 * Takes in the student's transactions, as well as their BankUser ID (BankUser.uid) and displays the transactions in a table.
 * @param transactionsAndUID An object with 2 fields; transactions, an Array of transactions, and uid, a string for the BankUser's id.
 */
export function ViewTransactions(transactionsAndUID: {transactions: Transaction[], uid: string}): JSX.Element {
    //State variable to be able to expand/contract transactions
    const [viewAll, setViewAll] = useState<Boolean>(false);
    return viewAll ? 
    //Uses html table to display all the passed in transaction information by mapping the relevant fields of the transaction into the cells of the table.
    <div style={{display: "wrap", justifyContent: "center", justifySelf: "center", alignItems: "stretch", width: "50%", margin: "auto"}}>
        <h4>Your Transactions:</h4>
        <table style={{all: "inherit"}}>
        <tbody>
            <th>Account</th>
            <th>To/From</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Date</th>
        {(transactionsAndUID.transactions).sort((a,b) => compareDates(b,a)).map((transaction: Transaction): JSX.Element => {
        return transaction.receiver_uid === transactionsAndUID.uid ? (
        <tr>
            <td>{transaction.receiver_name}</td>
            <td>{"From " + transaction.sender_name}</td>
            <td>{transaction.receiver_description}</td>
            <td className="transaction-history-gain">{transaction.transfer_amount.toFixed(2)}</td>
            <td>{transaction.receiver_balance.toFixed(2)}</td>
            <td>{new Date(Date.parse(transaction.date)).toLocaleString()}</td>
        </tr>
        )
        :
        (
        <tr>
            <td>{transaction.sender_name}</td>
            <td>{"To " + transaction.receiver_name}</td>
            <td>{transaction.sender_description}</td>
            <td className="transaction-history-loss">{(transaction.transfer_amount * -1).toFixed(2)}</td>
            <td>{(transaction.sender_balance || 0).toFixed(2)}</td>
            <td>{new Date(Date.parse(transaction.date)).toLocaleString()}</td>
        </tr>
        )
        })}
        </tbody>
        </table>
        <br />
        <Button onClick={() => setViewAll(false)}>Collapse Transactions</Button>
    </div>
    : 
    //Duplicate of the region above, except only shows the first 5 transactions in the array (may need to be change to last 5 depending on sort/style info)
    <div style={{display: "wrap", justifyContent: "center", alignItems: "stretch", width: "50%", margin: "auto"}}>
        <h4>Your Transactions:</h4>
        <table>
        <tbody>
            <th>Account</th>
            <th>To/From</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Date</th>
        {(transactionsAndUID.transactions).sort((a,b) => compareDates(b,a)).slice(0,5).map((transaction: Transaction): JSX.Element => {
        return transaction.receiver_uid === transactionsAndUID.uid ? (
        <tr>
            <td>{transaction.receiver_name}</td>
            <td>{"To " + transaction.sender_name}</td>
            <td>{transaction.receiver_description}</td>
            <td className="transaction-history-gain">{transaction.transfer_amount.toFixed(2)}</td>
            <td>{transaction.receiver_balance.toFixed(2)}</td>
            <td>{new Date(Date.parse(transaction.date)).toLocaleString()}</td>
        </tr>
        )
        :
        (
        <tr>
            <td>{transaction.sender_name}</td>
            <td>{"From " + transaction.receiver_name}</td>
            <td>{transaction.sender_description}</td>
            <td className="transaction-history-loss">{(transaction.transfer_amount * -1).toFixed(2)}</td>
            <td>{(transaction.sender_balance || 0).toFixed(2)}</td>
            <td>{new Date(Date.parse(transaction.date)).toLocaleString()}</td>
        </tr>
        )
        })}
        </tbody>
        </table>
        <br />
        <Button onClick={() => setViewAll(true)}>Expand Transactions</Button>
    </div>
}
