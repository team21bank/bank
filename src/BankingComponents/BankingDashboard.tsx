import React, { useState } from 'react';
import { ViewTransactions } from './ViewTransactions';
import { BalanceGraph } from './BalanceGraph';
import { EarningChart } from './EarningChart';
import { Transaction } from '../Interfaces/Transaction';
import { Button } from 'react-bootstrap';
import { BankUser } from '../Interfaces/BankUser';
import { AuthUser } from '../Authentication/auth';

/**
 * Takes in bank and user information alongside transactions to display to the student information about how they've earned/used money
 * @param info The current information pertaining to the current student and bank  @property {AuthUser} current_auth_user, @property {BankUser} current_bank_user, @property {Transaction[]} bank_transactions, @property {string} bank_name
 */
export function BankingDashboard(info: {current_auth_user: AuthUser, current_bank_user: BankUser, bank_transactions: Transaction[], bank_name: string}){
    const [showPie, setShowPie] = useState<boolean>(false);
    const [showGraph, setShowGraph] = useState<boolean>(false);
    return (
        <div className="student-home">
            <h2>Hello {info.current_auth_user.username}</h2>
            <br />
            <h3>Welcome to your banking dashboard for {"your class!" || info.bank_name}:</h3>
            <br />
            <div style={{display: "block", justifyContent: "center"}}>
                <Button style={{margin: "1px"}} onClick={() => setShowPie(!showPie)}>Toggle Earnings & Losses Pie Chart</Button>
                <br />
                <Button style={{margin: "1px"}} onClick={() => setShowGraph(!showGraph)}>Toggle Balance History Graph</Button>
            </div>
            {showPie && <EarningChart transactions={info.bank_transactions} uid={info.current_bank_user.uid}></EarningChart>}
            {showGraph && <BalanceGraph transactions={info.bank_transactions} uid={info.current_bank_user.uid}></BalanceGraph>}
            <br />
            <ViewTransactions transactions={info.bank_transactions} uid={info.current_bank_user.uid}></ViewTransactions>
        </div>
    );
}