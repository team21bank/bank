import React, { useEffect, useState } from "react";
import { ViewStudent } from "./ViewStudent";
import "./StudentList.css";
import { Bank } from "../../../Interfaces/BankObject";
import { get_auth_users } from "../../../DatabaseFunctions/UserFunctions";
import { AuthUser, DEFAULT_AUTH_USER } from "../../../Interfaces/AuthUser";
import { BankUser } from "../../../Interfaces/BankUser";
import { delete_bank_user } from "../../../DatabaseFunctions/BankUserFunctions";





export function StudentList(
        {current_bank}: {current_bank: Bank}
    ): JSX.Element {
        
    //Each BankUser in the class with its associated AuthUser
    const [studentList, setStudentList] = useState<[AuthUser, BankUser][]>([]);
    
    //I dont like this, hopefully I'll change it later
    //Populates the studentList with AuthUsers and their associated BankUser
    useEffect(() => {
        get_auth_users(current_bank.studentList.map(user => user.uid)).then((auth_users: AuthUser[]) => {
            const pairs: [AuthUser, BankUser][] = current_bank.studentList.map(bank_user => {
                return [
                    auth_users.find(user => user.hash === bank_user.uid) ?? {...DEFAULT_AUTH_USER, username: "DELETED_USER"},
                    bank_user
                ]
            })
            setStudentList(pairs);
        })
    }, [current_bank]);

    return (
        <div className="student-list">
            <h2 className="student-list-header">Students</h2>
            {studentList.map((user_pair, index) => {
                return (
                    <ViewStudent user_pair={user_pair} remove_student={() => delete_bank_user(current_bank.bankId, user_pair[1].uid)}/>
                )
            })}
        </div>
    )
}