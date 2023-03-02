import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthUser, BankContext, DEFAULT_AUTH_USER } from "../../Authentication/auth";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import { auth } from '../../firebase';
import { Bank, DEFAULT_BANK } from '../../Interfaces/BankObject';
import { BankUser, DEFAULT_BANK_USER } from '../../Interfaces/BankUser';
import { ViewTransactions } from '../../StudentComponents/ViewTransactions';
import "./StudentClassPage.css";

export function StudentClassPage({classCode}:{classCode:string}){
    const user = useContext(AuthContext);
    const current_user = user.user ? user.user : DEFAULT_AUTH_USER;
    const navigate = useNavigate()

    //Real transactions will eventually be saved in the database under a BankUser object
    const placeholder_transaction = [{date: "02/09/2023", account: "student1", description: "starting balance", type: "debit", sender: "banker_1", amount: 42.06, balance: 42.06, account_uid: "idk what these formats are", sender_uid: "0"}, {date: "02/16/2023", account: "student1", description: "weekly money", type: "debit", sender: "banker_1", amount: 5.00, balance: 47.06, account_uid: "idk what these formats are", sender_uid: "0"}]

    
    //Get AuthUser objects for each student in the class
    const [studentAuthUserList, setStudentAuthUserList] = useState<AuthUser[]>([]);

    const bank_context = useContext(BankContext);
    const current_bank: Bank = bank_context.bank ? bank_context.bank : DEFAULT_BANK;
    useEffect(() => { //Update the bank context if this page is navigated to
        onValue(ref(getDatabase(), "/groups/"+classCode.slice(0,6)+"/bankObj"), bank_snapshot => {
            if(bank_snapshot.exists() == false) {return;}
            getStudentList(bank_snapshot.val().studentList, setStudentAuthUserList);
            bank_context.setBank(bank_snapshot.val());
        });
    }, [classCode]);

    let current_bank_user = current_bank.studentList.find(val => val.uid===current_user.hash);
    current_bank_user ??= DEFAULT_BANK_USER;

    return (
        <div className="student-class-page">
            Welcome to {classCode.slice(6)}
            <div>your total balance is {current_bank_user.balance}</div>
            <Button onClick={()=>navigate("/students/"+classCode.slice(0,6)+"/quizzes")}> Go to Quizzes </Button>
            <ViewTransactions transactions={placeholder_transaction}></ViewTransactions>
        </div>
    )
}



//gets the AuthUser object for each BankUser in the bankUserList
function getStudentList(bankUserList: BankUser[], setStudentList: (students: AuthUser[])=>void) {
    let tmpStudentList: AuthUser[] = [];
    bankUserList.forEach((bankUser, index) => {
        if(bankUser.uid !== "") {
            //console.log("getting object for user ", bankUser.uid);
            onValue(ref(getDatabase(), "/users/"+bankUser.uid), (snapshot) => {
                if(snapshot.val() != null) {
                    //console.log("pushing to student list");
                    tmpStudentList.push(snapshot.val().userObj);
                }
            });
        }
    });


    //weird stuff to wait until the student list is populated
    function check_finished() {
        if(tmpStudentList.length < bankUserList.length - 1) {
            window.setTimeout(check_finished, 100);
        } else {
            setStudentList(tmpStudentList);
            return;
        }
    }
    check_finished();
}