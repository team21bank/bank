import { getDatabase, onValue, ref, get, update, set, push, remove } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthUser, BankContext, DEFAULT_AUTH_USER } from "../../Authentication/auth";
import { Bank, DEFAULT_BANK } from '../../Interfaces/BankObject';
import { BankUser, DEFAULT_BANK_USER } from '../../Interfaces/BankUser';
import { ViewTransactions } from '../../BankingComponents/ViewTransactions';
import { UserTransaction } from '../../BankingComponents/UserTransaction';
import "./StudentClassPage.css";
import { Transaction } from '../../Interfaces/Transaction';
import { app } from "../../firebase";
import { Subgroup } from "../../Interfaces/Subgroup";

export function StudentClassPage({classCode}:{classCode:string}){
    const current_user: AuthUser = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;
    const current_bank: Bank = useContext(BankContext).bank ?? DEFAULT_BANK;
    
    
    const navigate = useNavigate();

    //Real transactions will eventually be saved in the database under a BankUser object
    const placeholder_transactions:Transaction[] = [
        {
        date: new Date(),
        receiver_name: current_user?.id || "user",
        sender_name: "system",
        receiver_description: "starting balance",
        sender_description: "paid out starting balance",
        transfer_amount: 500,
        receiver_balance: 500,
        receiver_uid: current_user?.id || "0",
        },
        {
            date: new Date(),
            receiver_name: current_user?.username || "user",
            sender_name: "system",
            receiver_description: "weekly earnings",
            sender_description: "paid out weekly earnings",
            transfer_amount: 150,
            receiver_balance: 650,
            receiver_uid: current_user?.id || "0",
        },
        {
            date: new Date(),
            receiver_name: current_user?.username || "user",
            sender_name: "system",
            receiver_description: "quiz earnings",
            sender_description: "paid out quiz earnings",
            transfer_amount: 75,
            receiver_balance: 725,
            receiver_uid: current_user?.id || "0",
        },
        {
            date: new Date(),
            receiver_name: "candle merchant",
            sender_name: current_user?.username || "user",
            receiver_description: "sold candles",
            sender_description: "bought candles",
            transfer_amount: 25,
            receiver_balance: 700,
            receiver_uid: "0",
        }
    ]

    
    //Get AuthUser objects for each student in the class
    const [studentAuthUserList, setStudentAuthUserList] = useState<AuthUser[]>([]);

    const bank_context = useContext(BankContext);
    useEffect(() => { //Update the bank context if this page is navigated to
        onValue(ref(getDatabase(), "/groups/"+classCode.slice(0,6)+"/bankObj"), bank_snapshot => {
            if(bank_snapshot.exists() == false) {return;}
            getStudentList(bank_snapshot.val().studentList, setStudentAuthUserList);
            bank_context.setBank(bank_snapshot.val());
        });
        displayGroups();
    }, [classCode]);

    const current_bank_user = current_bank.studentList.find(val => val.uid===current_user.hash) ?? DEFAULT_BANK_USER;

    const [villages, setVillages] = React.useState<any[]>([]);//for storing list of subgroups from database, AKA villages
    const [villageArr, setVillageArr] = React.useState<any[]>([]);
    let villageA: any[] = []
    const displayGroups = () => {

        const object = async () => {
            const db = await getDatabase(app);
            const usersSnapshot = await get(ref(db, '/'))
            var item = usersSnapshot.child('groups/' + classCode.slice(0, 6) + '/bankObj/subgroups').val();
            const JSonValues = Object.values(item);
            const parsedJSonValues = (JSON.parse(JSON.stringify(JSonValues)))
            setVillages(parsedJSonValues)
            setVillages((current) =>current.filter((fruit) => fruit.name !== "placeholder"));
        }
        object();
        
    
        
    }

    return (
        <div className="student-class-page">
            Welcome to {classCode.slice(6)}
        <table align="center">

                <th>Village name</th>
                <th>Students</th>

                {villages.map((village, index) => (
                    <tr data-index={index}>
                        <td>{village.name}</td>
                        <td>{village.studentList.map((student, id) => (<tr data-index={id}>{student}</tr>))}</td>
                    </tr>
                ))}
            </table>
            <div>your total balance is {current_bank_user.balance}</div>
            <Button onClick={()=>navigate("/students/"+classCode.slice(0,6)+"/quizzes")}> Go to Quizzes </Button>
            <ViewTransactions transactions={placeholder_transactions} uid={current_bank_user.uid}></ViewTransactions>
        <div>
            <Button onClick={()=>navigate("/students/"+classCode.slice(0,6)+"/pay")}>Pay/Create Transaction</Button>
        </div>

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