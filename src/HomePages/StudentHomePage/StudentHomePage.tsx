import React, { useContext } from 'react';
import { AuthContext } from "../../Authentication/auth";
import "./StudentHomePage.css";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import { JoinClassButton } from "../../ClassCode/JoinClass/JoinClass"
import { ClassList } from '../../ClassCode/ClassList';
import { ViewTransactions } from '../../StudentComponents/ViewTransactions';

export function StudentHomePage(){
    const user = useContext(AuthContext);

    return user.user ? (
        <div className="student-home">
            <h2>Hello {user.user.username}</h2>
            <br />
            <div>My Classes:</div>
            <ClassList classes={user.user.groups}/>
            <br />
            <JoinClassButton />
            <br />
            <ViewTransactions transactions={["Transaction1", "Transaction2"]}></ViewTransactions>
            
        </div>
    ) : (
        <LoadingPage/>
    )
}