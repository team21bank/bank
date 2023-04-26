import { getDatabase, ref, get } from 'firebase/database';
import React, { useContext, useEffect, useState  } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
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
        <Container className="student-class-page">
            Welcome to {bank.classTitle}
            <h3>Your total balance is ${bank_user.balance}</h3>
            <br></br>
            <TransactionModal classCode={bank.bankId} />
            
            <Button className = "stuButton" style={{backgroundColor: '#FF2E2E'}} onClick={() => navigate("/students/" + classCode.slice(0, 6) + "/quizzes")}> Go to Quizzes </Button>
            <br></br>
            <div>
                <br></br>
                <Button className="stuButton" onClick={()=>navigate("/students/"+classCode.slice(0,6)+"/banking")}> Go to Banking Dashboard</Button>
            </div>
            
            <br/>
            {bank_user.role[0]===Role.Banker ? <PendingTransactionModal pendingList = {bank.pendingList} /> : <></>}
        </Container>
    )
}
