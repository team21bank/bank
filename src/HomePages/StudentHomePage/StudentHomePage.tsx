import React, { useContext } from 'react';
import { AuthContext } from "../../Authentication/auth";
import "./StudentHomePage.css";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import { JoinClassButton } from "../../ClassCode/JoinClass/JoinClass"
import { ClassList } from '../../ClassCode/ClassList';
import {Button} from "react-bootstrap"
import { useNavigate} from 'react-router-dom';
import { AvatarForm } from '../../Authentication/Avatar/Avatar';
import { QuizMain } from '../../Quizzes/QuizMain';
import { ViewTransactions } from '../../BankingComponents/ViewTransactions';
import { userInfo } from 'os';
import { Transaction } from '../../Interfaces/Transaction'
import { BalanceGraph } from "../../BankingComponents/BalanceGraph";

export function StudentHomePage(){
    const user = useContext(AuthContext);
    //const placeholder_transaction = [{date: "02/09/2023", account: "student1", description: "starting balance", type: "debit", sender: "banker_1", amount: 42.06, balance: 42.06, account_uid: "idk what these formats are", sender_uid: "0"}, {date: "02/16/2023", account: "student1", description: "weekly money", type: "debit", sender: "banker_1", amount: 5.00, balance: 47.06, account_uid: "idk what these formats are", sender_uid: "0"}]
    const placeholder_transactions:Transaction[] = [
        {
        date: new Date(),
        receiver_name: user.user?.username || "user",
        sender_name: "system",
        receiver_description: "starting balance",
        sender_description: "paid out starting balance",
        transfer_amount: 500,
        receiver_balance: 500,
        receiver_uid: user.user?.id || "0",
        },
        {
            date: new Date(),
            receiver_name: user.user?.username || "user",
            sender_name: "system",
            receiver_description: "weekly earnings",
            sender_description: "paid out weekly earnings",
            transfer_amount: 150,
            receiver_balance: 650,
            receiver_uid: user.user?.id || "0",
        },
        {
            date: new Date(),
            receiver_name: user.user?.username || "user",
            sender_name: "system",
            receiver_description: "quiz earnings",
            sender_description: "paid out quiz earnings",
            transfer_amount: 75,
            receiver_balance: 725,
            receiver_uid: user.user?.id || "0",
        },
        {
            date: new Date(),
            receiver_name: "candle merchant",
            sender_name: user.user?.username || "user",
            receiver_description: "sold candles",
            sender_description: "bought candles",
            transfer_amount: 25,
            receiver_balance: 700,
            receiver_uid: "0",
        }
    ]
    return user.user ? (
        <div className="student-home">
            <h2>Hello {user.user.username}</h2>
            <br />
            <div>My Classes:</div>
            <ClassList classes={user.user.groups}/>
            <br />
            <JoinClassButton />
            <br />
            <BalanceGraph transactions={placeholder_transactions}></BalanceGraph>
            <ViewTransactions transactions={placeholder_transactions} uid={user.user.id}></ViewTransactions>
            
        </div>
    ) : (
        <LoadingPage/>
    )
}