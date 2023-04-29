import React, { useContext, useState } from 'react';
import { ViewTransactions } from './ViewTransactions';
import { BalanceGraph } from './BalanceGraph';
import { EarningChart } from './EarningChart';
import { Transaction } from '../Interfaces/Transaction';
import { Button } from 'react-bootstrap';
import { BankUser, DEFAULT_BANK_USER } from '../Interfaces/BankUser';
import { AuthUser } from '../Interfaces/AuthUser';
import { push_transaction_to_completed, push_transaction_to_pending, remove_transaction_from_pending } from '../DatabaseFunctions/BankFunctions';
import { sampleTransactions } from '../Interfaces/Transaction';
import { AuthContext, BankContext } from '../Authentication/auth';


export function BankingDashboard(){
    const user = useContext(AuthContext).user;
    const bank = useContext(BankContext).bank;
    const bank_user = bank.studentList.find(val => val.uid===user.hash) ?? DEFAULT_BANK_USER;
    
    const [showPie, setShowPie] = useState<boolean>(false);
    const [showGraph, setShowGraph] = useState<boolean>(false);
    return (
        <div className="student-home">
            <div style={{display: "block", justifyContent: "center"}}>
                <Button style={{margin: "1px"}} onClick={() => setShowPie(!showPie)}>
                    {showPie ? "Hide " : "Show "} Pie Chart
                </Button>
                <br />

                {showPie && 
                    <EarningChart transactions={bank.completedList} uid={user.hash}></EarningChart>
                }

                <Button style={{margin: "1px"}} onClick={() => setShowGraph(!showGraph)}>
                    {showGraph ? "Hide " : "Show "} Balance History Graph
                </Button>
                <br />

                {showGraph && 
                <BalanceGraph transactions={bank.completedList} uid={user.hash}></BalanceGraph>
                }
            </div>
            <br />

            <ViewTransactions/>
        </div>
    );
}