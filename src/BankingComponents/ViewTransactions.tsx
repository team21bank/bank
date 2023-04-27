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
        <table className="viewtransactions"style={{all: "inherit"}}>
        <tbody>
            <th className="viewtransactions_inner">Account</th>
            <th className="viewtransactions_inner">To/From</th>
            <th className="viewtransactions_inner">Description</th>
            <th className="viewtransactions_inner">Amount</th>
            <th className="viewtransactions_inner">Balance</th>
            <th className="viewtransactions_inner">Date</th>
        {(transactionsAndUID.transactions).sort((a,b) => compareDates(b,a)).map((transaction: Transaction): JSX.Element => {
        return transaction.receiver_uid === transactionsAndUID.uid ? (
        <tr>
            <td className="viewtransactions">{transaction.receiver_name}</td>
            <td className="viewtransactions">{"From " + transaction.sender_name}</td>
            <td className="viewtransactions">{transaction.receiver_description}</td>
            <td className="transaction-history-gain">{transaction.transfer_amount.toFixed(2)}</td>
            <td className="viewtransactions">{transaction.receiver_balance.toFixed(2)}</td>
            <td className="viewtransactions">{new Date(Date.parse(transaction.date)).toLocaleString()}</td>
        </tr>
        )
        :
        (
        <tr>
            <td className="viewtransactions">{transaction.sender_name}</td>
            <td className="viewtransactions">{"To " + transaction.receiver_name}</td>
            <td className="viewtransactions">{transaction.sender_description}</td>
            <td className="transaction-history-loss">{(transaction.transfer_amount * -1).toFixed(2)}</td>
            <td className="viewtransactions">{(transaction.sender_balance || 0).toFixed(2)}</td>
            <td className="viewtransactions">{new Date(Date.parse(transaction.date)).toLocaleString()}</td>
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
        <table className="viewtransactions">
        <tbody>
            <th className="viewtransactions_inner">Account</th>
            <th className="viewtransactions_inner">To/From</th>
            <th className="viewtransactions_inner">Description</th>
            <th className="viewtransactions_inner">Amount</th>
            <th className="viewtransactions_inner">Balance</th>
            <th className="viewtransactions_inner">Date</th>
        {(transactionsAndUID.transactions).sort((a,b) => compareDates(b,a)).slice(0,5).map((transaction: Transaction): JSX.Element => {
        return transaction.receiver_uid === transactionsAndUID.uid ? (
        <tr>
            <td className="viewtransactions">{transaction.receiver_name}</td>
            <td className="viewtransactions">{"To " + transaction.sender_name}</td>
            <td className="viewtransactions">{transaction.receiver_description}</td>
            <td className="transaction-history-gain">{transaction.transfer_amount.toFixed(2)}</td>
            <td className="viewtransactions">{transaction.receiver_balance.toFixed(2)}</td>
            <td className="viewtransactions">{new Date(Date.parse(transaction.date)).toLocaleString()}</td>
        </tr>
        )
        :
        (
        <tr>
            <td className="viewtransactions">{transaction.sender_name}</td>
            <td className="viewtransactions">{"From " + transaction.receiver_name}</td>
            <td className="viewtransactions">{transaction.sender_description}</td>
            <td className="transaction-history-loss">{(transaction.transfer_amount * -1).toFixed(2)}</td>
            <td className="viewtransactions">{(transaction.sender_balance || 0).toFixed(2)}</td>
            <td className="viewtransactions">{new Date(Date.parse(transaction.date)).toLocaleString()}</td>
        </tr>
        )
        })}
        </tbody>
        </table>
        <br />
        <Button onClick={() => setViewAll(true)}>Expand Transactions</Button>
    </div>
}
