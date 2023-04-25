import { getDatabase, ref, get } from 'firebase/database';
import React, { useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, BankContext, BANK_STORAGE_KEY } from "../../Authentication/auth";
import { Bank, DEFAULT_BANK, copy_bank } from '../../Interfaces/BankObject';
import { DEFAULT_BANK_USER } from '../../Interfaces/BankUser';
import { ViewTransactions } from '../../BankingComponents/ViewTransactions';
import "./StudentBankingPage.css";
import { Transaction } from '../../Interfaces/Transaction';
import { get_bank_then } from '../../DatabaseFunctions/BankFunctions';
import { app } from "../../firebase";
import { Subgroup } from "../../Interfaces/Subgroup";
import { BankingDashboard } from '../../BankingComponents/BankingDashboard';
import { sampleTransactions } from '../../Interfaces/Transaction';
import { AuthUser, DEFAULT_AUTH_USER } from '../../Interfaces/AuthUser';

export function StudentBankingPage({classCode}:{classCode:string}){
    window.sessionStorage.setItem(BANK_STORAGE_KEY, classCode.slice(0,6));

    const current_user: AuthUser = useContext(AuthContext).user;
    const current_bank: Bank = useContext(BankContext).bank;
    
    
    //Real transactions will eventually be saved in the database under a BankUser object
    const current_bank_user = current_bank.studentList.find(val => val.uid===current_user.hash) ?? DEFAULT_BANK_USER;

    return (
        <div className="student-banking-page">
            <Link to={"/students/"+current_bank.bankId}><Button>Back to class</Button></Link>
            <BankingDashboard current_auth_user={current_user} current_bank_user={current_bank_user} bank_transactions={sampleTransactions} bank_name={current_bank.classTitle} bank_id={classCode.slice(0,6)}></BankingDashboard>
        </div>
        
    )
}
