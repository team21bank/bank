import React, { useContext, useEffect } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext, BankContext, BANK_STORAGE_KEY, change_bank } from "../../Authentication/auth";
import { Bank } from '../../Interfaces/BankObject';
import { DEFAULT_BANK_USER, Role } from '../../Interfaces/BankUser';
import "./StudentClassPage.css";
import { AuthUser } from '../../Interfaces/AuthUser';
import { PendingTransactionPage } from './BankerTransactionsModal';
import { TransactionModal } from "./TransactionModal";
import { StudentQuizPage } from '../../Quizzes/StudentQuizPage';
import { StudentClassHomePage } from './StudentClassHomePage';

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
        <Container id="parchmentBackdrop" fluid className="student-class-page" style={{height:"100%"} }>
            <h1 style={{backgroundColor: bank.color, paddingBottom: ".5em", paddingTop: ".5em", fontSize: "70px", flexGrow: "1"}}>{bank.classTitle}</h1>
            <Tabs
                fill
                defaultActiveKey="Home"
                style={{ fontSize: "1.4vw", backgroundColor: '#FCF5E5'}}
            >
                <Tab eventKey="Home" title="Home">
                    <Container fluid className="tab-page-container">
                        <StudentClassHomePage/>
                    </Container>
                </Tab>
                <Tab eventKey="Quizzes" title="Quizzes">
                    <Container  fluid className="tab-page-container">
                        <StudentQuizPage/>
                    </Container>
                </Tab>
                <Tab eventKey="Pay" title="Pay Your Classmates">
                    <Container  fluid className="tab-page-container">
                        <TransactionModal />
                    </Container>
                </Tab>
                {bank_user.role[0]===Role.Banker ? (
                    <Tab eventKey="banker" title="Pending Transactions">
                        <Container style={{height:"100vh"}} className="tab-page-container">
                            <PendingTransactionPage />
                        </Container>
                    </Tab>
                ) : (<></>)}
            </Tabs>
        </Container>
    )
}
