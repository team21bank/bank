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

export function StudentHomePage(){
    const user = useContext(AuthContext);
    const placeholder_transaction = [{date: "02/09/2023", account: "student1", description: "starting balance", type: "debit", sender: "banker_1", amount: 42.06, balance: 42.06, account_uid: "idk what these formats are", sender_uid: "0"}, {date: "02/16/2023", account: "student1", description: "weekly money", type: "debit", sender: "banker_1", amount: 5.00, balance: 47.06, account_uid: "idk what these formats are", sender_uid: "0"}]
    return user.user ? (
        <div className="student-home">
            <h2>Hello {user.user.username}</h2>
            <br />
            <div>My Classes:</div>
            <ClassList classes={user.user.groups}/>
            <br />
            <JoinClassButton />
            <br />
            <ViewTransactions transactions={placeholder_transaction}></ViewTransactions>
            
        </div>
    ) : (
        <LoadingPage/>
    )
}