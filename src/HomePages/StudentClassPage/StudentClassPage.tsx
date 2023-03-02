import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Authentication/auth";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import { auth } from '../../firebase';
import { BankUser } from '../../Interfaces/BankUser';
import { ViewTransactions } from '../../StudentComponents/ViewTransactions';
import "./StudentClassPage.css";

export function StudentClassPage({classCode}:{classCode:string}){
    const user = useContext(AuthContext);
    const navigate = useNavigate()

    //get the BankUser object of the current user 
    const [bankUser, setBankUser] = useState<BankUser | undefined>();
    useEffect(()=>{
        getBankUser(classCode, setBankUser);
    }, [classCode, user.user]);

    return user.user ? (
        <div className="student-class-page">
            Welcome to {classCode.slice(6)}
            <div>your total balance is {bankUser?.balance}</div>
            <Button onClick={()=>navigate("/students/"+classCode.slice(0,6)+"/quizzes")}> Go to Quizzes </Button>
        </div>
    ) : (
        <LoadingPage/>
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