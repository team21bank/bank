import { ref, getDatabase, onValue } from 'firebase/database';
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from "../../Authentication/auth";
import { NoUserPage } from "../../Authentication/NoUserPage/NoUserPage";
import { BankUser } from '../../Interfaces/BankUser';
import {Button} from 'react-bootstrap'
import "./StudentClassPage.css";
import { auth } from '../../firebase';

export function StudentClassPage({classCode}:{classCode:string}){
    const user = useContext(AuthContext);
    const [currBankUser,setCurrBankUser] = useState<BankUser>({} as BankUser);

    useEffect(()=>{
        if (currBankUser.uid===undefined){
            console.log("HELLO")
            onValue(ref(getDatabase(),'/groups/'+classCode.slice(0,6)+'/bankObj/studentList/'),ss=>{
                if (ss.val()!==null){
                    let studentList=ss.val();
                    console.log(studentList[1]);
                    for (let i=1;;i++){
                        console.log(studentList[i].uid)
                        if (studentList[i].uid===auth.currentUser?.uid){
                            setCurrBankUser(studentList[i]);
                            break;
                        }
                    }
                }
                currBankUser.balance=5;
            })
        }
    },[currBankUser])

    if(user.user == null) {return <NoUserPage />;} //display fail page if attempting to access user page without being logged in

    return (<div className="student-class-page">
        Welcome to {classCode.slice(6)}
        <br></br>
        Your Total Balance: {currBankUser.balance}
    </div>)
}