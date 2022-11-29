import React from "react";
import { AuthUser } from "../../../Authentication/auth";
import { BankUser } from "../../../Interfaces/BankUser";
import { ViewStudent } from "./ViewStudent";
import "./StudentList.css";





export function StudentList({bank_users, auth_users}: {bank_users: BankUser[], auth_users: AuthUser[]}): JSX.Element {


    return (
        <div className="student-list">
            <h2 className="student-list-header">Student List</h2>
            {auth_users.map((auth_user, index) => {
                //note that the bank_users begins with placeholder while auth_users does not
                return <ViewStudent auth_user={auth_user} bank_user={bank_users[index+1]}/>
            })}
        </div>
    )
}