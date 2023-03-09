import React, { useContext } from 'react';
import { AuthContext, DEFAULT_AUTH_USER } from "../../Authentication/auth";
import "./StudentHomePage.css";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import { JoinClassButton } from "../../ClassCode/JoinClass/JoinClass"
import { ClassList } from '../../ClassCode/ClassList';
import {Button} from "react-bootstrap"
import { useNavigate} from 'react-router-dom';
import { AvatarForm } from '../../Authentication/Avatar/Avatar';
import { QuizPage } from '../../Quizzes/QuizPage';
import { ViewTransactions } from '../../BankingComponents/ViewTransactions';
import { Transaction } from '../../Interfaces/Transaction';
import { BalanceGraph } from '../../BankingComponents/BalanceGraph';


export function StudentHomePage(){
    const current_user = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;
    const placeholder_transactions:Transaction[] = [
        {
        date: new Date(),
        receiver_name: current_user?.id || "user",
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
            date: new Date(),
            receiver_name: current_user?.username || "user",
            sender_name: "system",
            receiver_description: "quiz earnings",
            sender_description: "paid out quiz earnings",
            transfer_amount: 75,
            receiver_balance: 725,
            receiver_uid: current_user?.id || "0",
        },
        {
            date: new Date(),
            receiver_name: "candle merchant",
            sender_name: current_user?.username || "user",
            receiver_description: "sold candles",
            sender_description: "bought candles",
            transfer_amount: 25,
            receiver_balance: 700,
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
            <BalanceGraph transactions={placeholder_transactions}></BalanceGraph>
            <ViewTransactions transactions={placeholder_transactions} uid={current_user.id}></ViewTransactions>
            
        </div>
    );
}