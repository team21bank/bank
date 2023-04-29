import { getDatabase, ref, get, set } from 'firebase/database';
import React, { useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, BankContext, BANK_STORAGE_KEY } from "../../Authentication/auth";
import { Bank, DEFAULT_BANK, copy_bank } from '../../Interfaces/BankObject';
import { DEFAULT_BANK_USER } from '../../Interfaces/BankUser';
import { ViewTransactions } from '../../BankingComponents/ViewTransactions';
import "./StudentBankingPage.css";
import { Transaction } from '../../Interfaces/Transaction';
import { display_type_of_thing, get_bank_then } from '../../DatabaseFunctions/BankFunctions';
import { app } from "../../firebase";
import { Subgroup } from "../../Interfaces/Subgroup";
import { BankingDashboard } from '../../BankingComponents/BankingDashboard';
import { sampleTransactions } from '../../Interfaces/Transaction';
import { AuthUser, DEFAULT_AUTH_USER } from '../../Interfaces/AuthUser';

export function StudentBankingPage(){
    const user: AuthUser = useContext(AuthContext).user;
    const bank: Bank = useContext(BankContext).bank;
    
    
    //Real transactions will eventually be saved in the database under a BankUser object
    const bank_user = bank.studentList.find(val => val.uid===user.hash) ?? DEFAULT_BANK_USER;

    return (
        <div className="student-banking-page">
            <Link to={"/students/"+bank.bankId}><Button>Back to class</Button></Link>
            <BankingDashboard 
            current_auth_user={user} 
            current_bank_user={bank_user} 
            bank_transactions={
                (bank.completedList as Record<string, Transaction[]>)[bank_user.uid] || []
            }
            bank_name={bank.classTitle} 
            bank_id={bank.bankId}></BankingDashboard>
        </div>
        
    )
}
