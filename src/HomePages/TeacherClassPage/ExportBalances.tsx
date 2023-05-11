import React, { useContext, useEffect, useState } from "react";
import { Bank } from "../../Interfaces/BankObject";
import { get_auth_users } from "../../DatabaseFunctions/UserFunctions";
import { AuthUser, DEFAULT_AUTH_USER } from "../../Interfaces/AuthUser";
import { BankUser, MasteryLevel, Role, getTitle } from "../../Interfaces/BankUser";
import { delete_bank_users, update_bank_user } from "../../DatabaseFunctions/BankUserFunctions";
import { Button, Container, Form, Image, InputGroup, Modal, Row, Table } from "react-bootstrap";
import { BankContext } from "../../Authentication/auth";
import { Icon } from "../../Avatar/Icon";
import { UserPair } from "./StudentList/StudentList";
import exp from "constants";


function exportFile(studentsList: UserPair[], current_bank: Bank) {
    //Write student emails and current balances to csv file and download
    let exportString = "";
    if(studentsList.length > 0){
        exportString += studentsList[0].auth_user.email + "," + studentsList[0].bank_user.balance
    }
    for(let i=1; i<studentsList.length; i++){
        exportString += "\n" + studentsList[i].auth_user.email + "," + studentsList[i].bank_user.balance
    }
    downloadBlob(
        exportString,
        `${current_bank.classTitle}-balances.csv`,
        "text/csv;charset=utf-8;"
    );
}

function downloadBlob(
    content: string,
    filename: string,
    contentType: string
) {
    // Create a blob
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);

    // Create a link to download it
    const pom = document.createElement("a");
    pom.href = url;
    pom.setAttribute("download", filename);
    pom.click();
}

export function ExportBalances(
    {current_bank}: {current_bank: Bank}
    ): JSX.Element{

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
        <Button onClick={() => exportFile(studentList, current_bank)}>Download Roster Balances</Button>
    )
}