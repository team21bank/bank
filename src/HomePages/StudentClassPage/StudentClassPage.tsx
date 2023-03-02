import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext, DEFAULT_AUTH_USER } from "../../Authentication/auth";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import { auth } from '../../firebase';
import { BankUser } from '../../Interfaces/BankUser';
import { ViewTransactions } from '../../StudentComponents/ViewTransactions';
import "./StudentClassPage.css";

export function StudentClassPage({classCode}:{classCode:string}){
    const user = useContext(AuthContext);
    const current_user = user.user ? user.user : DEFAULT_AUTH_USER;
    const navigate = useNavigate()

    //Real transactions will eventually be saved in the database under a BankUser object
    const placeholder_transaction = [{date: "02/09/2023", account: "student1", description: "starting balance", type: "debit", sender: "banker_1", amount: 42.06, balance: 42.06, account_uid: "idk what these formats are", sender_uid: "0"}, {date: "02/16/2023", account: "student1", description: "weekly money", type: "debit", sender: "banker_1", amount: 5.00, balance: 47.06, account_uid: "idk what these formats are", sender_uid: "0"}]

    //get the BankUser object of the current user 
    const [bankUser, setBankUser] = useState<BankUser | undefined>();
    useEffect(()=>{
        getBankUser(classCode, setBankUser);
    }, [classCode, user.user]);

    return (
        <div className="student-class-page">
            Welcome to {classCode.slice(6)}
            <div>your total balance is {bankUser?.balance}</div>
            <Button onClick={()=>navigate("/students/"+classCode.slice(0,6)+"/quizzes")}> Go to Quizzes </Button>
            <ViewTransactions transactions={placeholder_transaction}></ViewTransactions>
        </div>
    )
}

function getBankUser(classCode: string, setBankUser: (b)=>void) {
    const classRef = ref(getDatabase(), "/groups/"+classCode.slice(0,6));
    onValue(classRef, classSnapshot=>{
        const classObj = classSnapshot.val();
        if(classObj != null) {
            classObj.bankObj.studentList.map(bank_user => {
                if(bank_user.uid === auth.currentUser?.uid) {
                    setBankUser(bank_user);
                }
            });
        }
    })
}