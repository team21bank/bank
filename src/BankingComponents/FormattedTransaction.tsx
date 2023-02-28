import React, { useContext, useState } from 'react';
import { Transaction } from '../Interfaces/Transaction';

export function FormattedTransaction({transaction}: {transaction: Transaction}): JSX.Element {
    //Takes in the student's transactions and displays them 
    //return <p> Account (Personal or Group) / Source / Amount Gained  {transaction.toString() + "\nis this working"} </p>
    //return <p>{transaction.account + "\t" + transaction.sender + "\t" + transaction.description + "\t" + transaction.amount + "\t" + transaction.balance}</p>
    //WORK IN PROGRESS; HAVE TO DECIDE HOW WE'RE FORMATTING THE TRANSACTIONS [STRINGS?]
    return <table>
        <tbody>
            <tr>
                <td>{transaction.account}</td>
                <td>{transaction.sender}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.balance}</td>
            </tr>
        </tbody>
    </table>
}