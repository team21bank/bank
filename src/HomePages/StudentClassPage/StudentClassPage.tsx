import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Authentication/auth";
import { delete_student_from_bank } from '../../Authentication/EditProfilePage/DeleteAccount';
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import { auth } from '../../firebase';
import { BankUser } from '../../Interfaces/BankUser';
import { ViewTransactions } from '../../StudentComponents/ViewTransactions';
import "./StudentClassPage.css";

export function StudentClassPage({classCode}:{classCode:string}){
    const navigate = useNavigate();
    const user = useContext(AuthContext);

    //get the BankUser object of the current user 
    const [bankUser, setBankUser] = useState<BankUser | undefined>();
    useEffect(()=>{
        getBankUser(classCode, setBankUser);
    }, [user.user]);

    return user.user ? (
        <div className="student-class-page">
            Welcome to {classCode.slice(6)}
            <div>your total balance is {bankUser?.balance}</div>
            <Button variant="danger" onClick={()=>{
                delete_student_from_bank(classCode.slice(0,6), auth.currentUser ? auth.currentUser.uid : "");
                navigate("/students/home");
            }}>Leave Class</Button>
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