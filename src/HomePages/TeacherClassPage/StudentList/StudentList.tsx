import React, { useEffect, useState } from "react";
import { ViewStudent } from "./ViewStudent";
import "./StudentList.css";
import { Bank } from "../../../Interfaces/BankObject";
import { get_auth_users } from "../../../DatabaseFunctions/UserFunctions";
import { AuthUser } from "../../../Interfaces/AuthUser";





export function StudentList({current_bank}: {current_bank: Bank}): JSX.Element {
    //Get AuthUser objects for each student in the class
    const [studentList, setStudentList] = useState<AuthUser[]>([]);
    
    useEffect(() => {
        get_auth_users(current_bank.studentList.map(user => user.uid), setStudentList)
    }, [current_bank])

    return (
        <div className="student-list">
            <h2 className="student-list-header">Students</h2>
            {studentList.map((auth_user, index) => {
                return (
                    <ViewStudent 
                        auth_user={auth_user}
                        //note that the bank_users begins with placeholder while auth_users does not, hence the index+1
                        bank_user={current_bank.studentList[index+1]}
                        bank={current_bank}
                        index={index+1}
                    />
                )
            })}
        </div>
    )
}