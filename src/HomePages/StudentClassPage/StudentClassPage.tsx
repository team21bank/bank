import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthUser, BankContext, BANK_STORAGE_KEY, DEFAULT_AUTH_USER } from "../../Authentication/auth";
import { Bank, DEFAULT_BANK } from '../../Interfaces/BankObject';
import { BankUser, DEFAULT_BANK_USER } from '../../Interfaces/BankUser';
import { ViewTransactions } from '../../BankingComponents/ViewTransactions';
import "./StudentClassPage.css";
import { Transaction } from '../../Interfaces/Transaction';
import { get_bank } from '../../DatabaseFunctions/BankFunctions';

export function StudentClassPage({classCode}:{classCode:string}){
    window.sessionStorage.setItem(BANK_STORAGE_KEY, classCode.slice(0,6));

    const current_user: AuthUser = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;
    const current_bank: Bank = useContext(BankContext).bank ?? DEFAULT_BANK;
    
    
    const navigate = useNavigate();

    //Real transactions will eventually be saved in the database under a BankUser object
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

    
    //Get AuthUser objects for each student in the class
    //const [studentAuthUserList, setStudentAuthUserList] = useState<AuthUser[]>([]);

    const bank_context = useContext(BankContext);
    useEffect(() => { //Update the bank context if this page is navigated to
        get_bank(classCode.slice(0,6), bank_context.setBank)
    }, []);

    const current_bank_user = current_bank.studentList.find(val => val.uid===current_user.hash) ?? DEFAULT_BANK_USER;

    return (
        <div className="student-class-page">
            Welcome to {classCode.slice(6)}
            <div>your total balance is {current_bank_user.balance}</div>
            <Button onClick={()=>navigate("/students/"+classCode.slice(0,6)+"/quizzes")}> Go to Quizzes </Button>
            <ViewTransactions transactions={placeholder_transactions} uid={current_bank_user.uid}></ViewTransactions>
        </div>
    )
}
