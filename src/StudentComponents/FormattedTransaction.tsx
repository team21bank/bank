import React, { useContext, useState } from 'react';

export function FormattedTransaction({transaction}: {transaction: string}): JSX.Element {
    //Takes in the student's transactions and displays them 
    return <span>Account (Personal or Group) / Source / Amount Gained {transaction} </span>
    //WORK IN PROGRESS; HAVE TO DECIDE HOW WE'RE FORMATTING THE TRANSACTIONS [STRINGS?]
}