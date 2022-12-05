import React, { useContext, useState } from 'react';
import { FormattedTransaction } from './FormattedTransaction';

export function ViewTransactions({transactions}: {transactions: string[]}): JSX.Element {
    const [viewAll, setViewAll] = useState<Boolean>(false);
    //Takes in the student's transactions and displays them 
    return viewAll ? 
    <div style={{display: "wrap", justifyContent: "center", alignItems: "stretch", width: "50%", margin: "auto"}}>
        <h4>Your Transactions:</h4>
        <h3>{"Account\tSource\tChange"}</h3>
        {transactions.map((transaction: string): JSX.Element => {
        return <FormattedTransaction transaction={transaction}></FormattedTransaction>})} 
    </div>
    : 
    <div style={{display: "wrap", justifyContent: "center", alignItems: "stretch", width: "50%", margin: "auto"}}>
        <h4>Your Transactions:</h4>
        {transactions.map((transaction: string): JSX.Element => {
        return <FormattedTransaction transaction={transaction}></FormattedTransaction>})} 
    </div>
    //Replace {transaction} with a transaction viewer component; Something that 
}
