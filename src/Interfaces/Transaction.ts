import { AuthUser } from "../Authentication/auth";
import { BankUser } from "./BankUser";

export interface Transaction{
    /*
    Representation of Transactions in the database - Contains all the information you'd need about any transaction.

    "Sender" is always the person/entity LOSING money
    
    "Receiver" is always the person/entity GAINING money

    Sender fields are nullable since the sender may be a non-account entity (i.e the quizzes or other types of rewards)

    When displaying transactions (ViewTransactions.tsx), the relation between the table labels and fields are:
    "Account" <-> "Receiver/Sender Name" [Always the one that's the stufent]
    "From/To" <-> "Sender/Receiver Name" [Always the one that's not the student]
    */

    date: Date; //When the transaction occurred

    receiver_name: string; //The name of the user/entity who received money

    sender_name?: string; //The name of the user/entity who sent money

    //Description of what the transaction was for, i.e: "Quiz Reward", "Interest", "Starting Balance"
    receiver_description: string; //Desc from the perspective of the person received money.

    sender_description: string; //Desc from the perspective of the person who sent money.

    type?: string; //The type of transaction it was [Is this necessary? I don't know if this means anything.

    transfer_amount: number; //The amount of money the transaction was for

    receiver_balance: number; //The total balance of the receiver after the transaction

    sender_balance?: number; //The total balance of the sender after the transaction 

    receiver_uid: string; //uid of the account in this transaction

    sender_uid?: string; //uid of the sender account in this transaction (nullable? special IDs for non-account funds? I dunno.)

    
}
/*
Comparison function to sort transactions by date. Passed in when you're calling .sort on an array, i.e:
transactionList.sort((a, b) => compareDates(a, b))

NOTE FOR USE: .sort() sorts from low to high, if you want to sort from oldest to newest, you'll need to reverse it
*/
export function compareDates(a: Transaction, b: Transaction) {
    if (a.date > b.date) { 
        return 1;
    }
    if (a.date < b.date) {
        return -1;
    }
    return 0
}

/*
Function to create a transaction object given parameters:
*/
export function makeTransaction(
    senderAuth: AuthUser, senderBank: BankUser, 
    receiverAuth: AuthUser, receiverBank: BankUser, 
    amount: number, type?: string, 
    receiver_desc?: string, sender_desc?: string,
    ): Transaction {
    const transaction: Transaction = {
        date: new Date(),
        receiver_name: receiverAuth.username,
        sender_name: senderAuth.username,
        receiver_description: sender_desc || "got paid by" + senderAuth.username,
        sender_description: receiver_desc || "paid" + receiverAuth.username,
        type: type || "misc",
        transfer_amount: amount,
        receiver_balance: receiverBank.balance + amount,
        sender_balance: senderBank.balance - amount,
        receiver_uid: receiverBank.uid,
        sender_uid: senderBank.uid
    };
    return transaction;
}