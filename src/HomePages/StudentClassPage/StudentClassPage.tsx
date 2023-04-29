import React, { useContext, useEffect, useState  } from 'react';
import { Modal, Button, Container, Row, Col, Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext, BankContext, BANK_STORAGE_KEY, change_bank } from "../../Authentication/auth";
import { Bank } from '../../Interfaces/BankObject';
import { DEFAULT_BANK_USER, Role, getTitle } from '../../Interfaces/BankUser';
import "./StudentClassPage.css";
import { push_transaction_to_pending } from '../../DatabaseFunctions/BankFunctions';
import { app } from "../../firebase";
import CurrencyInput from "react-currency-input-field";

import { AuthUser, DEFAULT_AUTH_USER } from '../../Interfaces/AuthUser';
import { PendingTransactionModal } from './BankerTransactionsModal';
import Select from 'react-select';
import { BankUser } from "../../Interfaces/BankUser";
import { TransactionModal } from "./TransactionModal";
import { UserQuizPage } from '../../Quizzes/UserQuizPage';
import { StudentQuizPage } from '../../Quizzes/StudentQuizPage';
import { StudentBankingPage } from '../StudentBankingPage/StudentBankingPage';

export function StudentClassPage({classCode}:{classCode:string}){
    

    const user: AuthUser = useContext(AuthContext).user;
    const bank: Bank = useContext(BankContext).bank;
    const bank_user = bank.studentList.find(val => val.uid === user.hash) ?? DEFAULT_BANK_USER;

    const navigate = useNavigate();

    useEffect(() => { //Update the bank context if this page is navigated to
        if(window.sessionStorage.getItem(BANK_STORAGE_KEY) === classCode.slice(0,6)) {return;}
        change_bank(classCode);
    }, []);


    return (
        <Container fluid className="student-class-page">
            <h1 style={{backgroundColor: bank.color, paddingBottom: ".5em", paddingTop: ".5em", fontSize: "70px"}}>{bank.classTitle}</h1>
            <Tabs
                fill
                defaultActiveKey="Home"
            >
                <Tab eventKey="Home" title="Home">
                    <Container fluid className="tab-page-container">
                        <h3>Your total balance is ${bank_user.balance}</h3>
                    </Container>
                </Tab>
                <Tab eventKey="Quizzes" title="Quizzes">
                    <Container fluid className="tab-page-container">
                        <StudentQuizPage/>
                    </Container>
                </Tab>
                <Tab eventKey="Banking" title="Banking">
                    <Container fluid className="tab-page-container">
                        <StudentBankingPage />
                    </Container>
                </Tab>
                <Tab eventKey="Pay" title="Pay Your Classmates">
                    <Container fluid className="tab-page-container">
                        <TransactionModal />
                    </Container>
                </Tab>
                {bank_user.role[0]===Role.Banker ? (
                    <Tab eventKey="banker" title="Pending Transactions">
                        <Container fluid className="tab-page-container">
                            <PendingTransactionModal pendingList = {bank.pendingList} />
                        </Container>
                    </Tab>
                ) : (<></>)}
            </Tabs>
        </Container>
    )
}
