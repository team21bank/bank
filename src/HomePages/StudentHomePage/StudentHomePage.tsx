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
import { EarningChart } from '../../BankingComponents/EarningChart';


export function StudentHomePage(){
    const current_user = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;
    return (
        <div className="student-home">
            <h2>Hello {current_user.username}</h2>
            <br />
            <div>My Classes:</div>
            <ClassList classes={current_user.groups}/>
            <br />
            <JoinClassButton />
            <br />
        </div>
    );
}