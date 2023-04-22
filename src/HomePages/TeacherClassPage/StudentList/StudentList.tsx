import React, { useEffect, useState } from "react";
import { ViewStudent } from "./ViewStudent";
import "./StudentList.css";
import { Bank } from "../../../Interfaces/BankObject";
import { get_auth_users } from "../../../DatabaseFunctions/UserFunctions";
import { AuthUser, DEFAULT_AUTH_USER } from "../../../Interfaces/AuthUser";
import { BankUser } from "../../../Interfaces/BankUser";
import { delete_bank_users } from "../../../DatabaseFunctions/BankUserFunctions";



export interface UserPair {
    auth_user: AuthUser,
    bank_user: BankUser
}

export function StudentList(
        {current_bank}: {current_bank: Bank}
    ): JSX.Element {
        
    //Each BankUser in the class with its associated AuthUser
    const [studentList, setStudentList] = useState<UserPair[]>([]);
    
    //I dont like this, hopefully I'll change it later
    //Populates the studentList with AuthUsers and their associated BankUser
    //A default AuthUser with "DELETED USER" username will take its place if the bankUser's associated AuthUser doesnt exist
    //REALLY ONLY NEED TO GET USERNAMES HERE, MAYBE CHANGE TO REDUCE DATABASE READS
    useEffect(() => {
        get_auth_users(current_bank.studentList.map(user => user.uid)).then((auth_users: AuthUser[]) => {
            const pairs: UserPair[] = current_bank.studentList.map(bank_user => {
                return {
                    auth_user: auth_users.find(user => user.hash === bank_user.uid) ?? {...DEFAULT_AUTH_USER, username: "DELETED USER"},
                   bank_user: bank_user
                }
            })
            setStudentList(pairs);
        })
    }, [current_bank]);

    return (
        <div className="student-list">
            <h2 className="student-list-header">Students</h2>
            {studentList.map((user_pair) => {
                return (
                    <ViewStudent user_pair={user_pair} remove_student_function={() => delete_bank_users(current_bank, user_pair.bank_user.uid)}/>
                )
            })}
        </div>
    )
}