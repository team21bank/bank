import React from "react";
import { AuthUser } from "../../../Authentication/auth";
import { ViewStudent } from "./ViewStudent";
import "./StudentList.css";
import { Bank } from "../../../Interfaces/BankObject";





export function StudentList(
    {current_bank, auth_users}: 
    {current_bank: Bank, auth_users: AuthUser[]
}): JSX.Element {


    return (
        <div className="student-list">
            <h2 className="student-list-header">Students</h2>
            {auth_users.map((auth_user, index) => {
                return <ViewStudent 
                    auth_user={auth_user}
                    //note that the bank_users begins with placeholder while auth_users does not, hence the index+1
                    bank_user={current_bank.studentList[index+1]}
                    bank={current_bank}
                />
            })}
        </div>
    )
}