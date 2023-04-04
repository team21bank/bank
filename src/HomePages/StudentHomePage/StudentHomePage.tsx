import React, { useContext } from 'react';
import { AuthContext } from "../../Authentication/auth";
import "./StudentHomePage.css";
import { JoinClassButton } from "../../ClassCode/JoinClass/JoinClass"
import { ClassList } from '../../ClassCode/ClassList';
import { ViewTransactions } from '../../BankingComponents/ViewTransactions';
import { Transaction } from '../../Interfaces/Transaction';
import { BalanceGraph } from '../../BankingComponents/BalanceGraph';
import { DEFAULT_AUTH_USER } from '../../Interfaces/AuthUser';


export function StudentHomePage(){
    const current_user = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;
    const LaterDate = new Date();
    LaterDate.setHours(20);
    const placeholder_transactions:Transaction[] = [
        {
        date: new Date(),
        receiver_name: current_user?.username || "user",
        sender_name: "system",
        receiver_description: "starting balance",
        sender_description: "paid out starting balance",
        transfer_amount: 500,
        receiver_balance: 500,
        receiver_uid: current_user?.id || "0",
        },
        {
            date: new Date(),
            receiver_name: current_user?.username || "user",
            sender_name: "system",
            receiver_description: "weekly earnings",
            sender_description: "paid out weekly earnings",
            transfer_amount: 150,
            receiver_balance: 650,
            receiver_uid: current_user?.id || "0",
        },
        {
            date: LaterDate,
            receiver_name: current_user?.username || "user",
            sender_name: "system",
            receiver_description: "quiz earnings",
            sender_description: "paid out quiz earnings",
            transfer_amount: 75,
            receiver_balance: 700,
            receiver_uid: current_user?.id || "0",
        },
        {
            date: new Date(),
            receiver_name: "candle merchant",
            sender_name: current_user?.username || "user",
            receiver_description: "sold candles",
            sender_description: "bought candles",
            transfer_amount: 25,
            sender_balance: 625,
            receiver_balance: 1025,
            receiver_uid: "0",
        }
    ]
    return (
        <div className="student-home">
            <h2>Hello {current_user.username}</h2>
            <br />
            <div>My Classes:</div>
            <ClassList classes={current_user.groups}/>
            <br />
            <JoinClassButton />
            <br />
            <BalanceGraph transactions={placeholder_transactions} uid={current_user.id}></BalanceGraph>
            <ViewTransactions transactions={placeholder_transactions} uid={current_user.id}></ViewTransactions>
            
        </div>
    );
}