import React, { useState } from 'react';
import { ViewTransactions } from './ViewTransactions';
import { BalanceGraph } from './BalanceGraph';
import { EarningChart } from './EarningChart';
import { Transaction } from '../Interfaces/Transaction';
import { Button } from 'react-bootstrap';
import { BankUser } from '../Interfaces/BankUser';
import { AuthUser } from '../Interfaces/AuthUser';
import { push_transaction_to_completed, push_transaction_to_pending, remove_transaction_from_pending } from '../DatabaseFunctions/BankFunctions';

/**
 * Takes in bank and user information alongside transactions to display to the student information about how they've earned/used money
 * @param info The current information pertaining to the current student and bank  @property {AuthUser} current_auth_user, @property {BankUser} current_bank_user, @property {Transaction[]} bank_transactions, @property {string} bank_name
 */
export function BankingDashboard(info: {current_auth_user: AuthUser, current_bank_user: BankUser, bank_transactions: Transaction[], bank_name: string, bank_id: string}){
    const [showPie, setShowPie] = useState<boolean>(false);
    const [showGraph, setShowGraph] = useState<boolean>(false);
    return (
        <div className="student-home">
            <h2>
                Hello {info.current_auth_user.username}
            </h2>
            <br />

            <h3>
                Welcome to your banking dashboard for {"your class!" || info.bank_name}
            </h3>
            <br />

            <div style={{display: "block", justifyContent: "center"}}>
                <Button style={{margin: "1px"}} onClick={() => setShowPie(!showPie)}>
                    {showPie ? "Hide " : "Show "} Pie Chart
                </Button>
                <br />

                {showPie && 
                    <EarningChart transactions={info.bank_transactions} uid={info.current_bank_user.uid}></EarningChart>
                }

                <Button style={{margin: "1px"}} onClick={() => setShowGraph(!showGraph)}>
                    {showGraph ? "Hide " : "Show "} Balance History Graph
                </Button>
                <br />

                {showGraph && 
                <BalanceGraph transactions={info.bank_transactions} uid={info.current_bank_user.uid}></BalanceGraph>
                }
            </div>
            <br />

            <ViewTransactions transactions={info.bank_transactions} uid={info.current_bank_user.uid}></ViewTransactions>
        </div>
    );
}