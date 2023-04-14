import { AuthUser } from "./AuthUser";
import { BankUser } from "./BankUser";

/**
 * @property {string} date- toISOString of a Date Object for when the transaction occurred.
 * @property {number} receiver_balance - The balance of the receiver after the transaction (i.e if their balance was 500 and they gained 50 dollars, this field would be 550)
 * @property {string} receiver_description - Description of the transaction from the receiver's point of view
 * @property {string} receiver_name - The username of the person receiving money
 * @property {string} receiver_uid - The uid of the person gaining money
 * @property {number} sender_balance - (optional in case of system payouts) The balance of the sender after the transaction (i.e if their balance was 500 and they sent 50 dollars, this field would be 450)
 * @property {string} sender_description - Description of the transaction from the sender's point of view
 * @property {string} sender_name - (optional) The username of the person sending money
 * @property {string} sender_uid - (optional in case of system payouts) The uid of the person sending money
 * @property {number} transfer_amount - The absolute value of the transaction amount
 * @property {string} type - (optional, defauls to misc) Types like: "academic" / "commerce" / "transfers" / "misc"
 */
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

    date: string; //When the transaction occurred

    receiver_balance: number; //The total balance of the receiver after the transaction

    receiver_name: string; //The name of the user/entity who received money

    //Description of what the transaction was for, i.e: "Quiz Reward", "Interest", "Starting Balance"
    receiver_description: string; //Desc from the perspective of the person received money.

    receiver_uid: string; //uid of the account in this transaction

    sender_balance?: number; //The total balance of the sender after the transaction 

    sender_description: string; //Desc from the perspective of the person who sent money.

    sender_name?: string; //The name of the user/entity who sent money

    sender_uid?: string; //uid of the sender account in this transaction (nullable? special IDs for non-account funds? I dunno.)

    transfer_amount: number; //The amount of money the transaction was for

    type?: string; //The type of transaction: academic / commerce / transfers / misc. A


    
}
/*
Comparison function to sort transactions by date. Passed in when you're calling .sort on an array, i.e:
transactionList.sort((a, b) => compareDates(a, b))

NOTE FOR USE: .sort() sorts from low to high, if you want to sort from newest to oldest, you'll need to reverse it
*/
/**
 * Comparison function to sort transactions by date. Passed in when you're calling .sort on an array, i.e:
transactionList.sort((a, b) => compareDates(a, b))

NOTE FOR USE: .sort() sorts from low to high, if you want to sort from newest to oldest, you'll need to reverse it
 * @param a Transaction 1 to be compared
 * @param b Transaction 2 to be compared
 * @returns 1 if a happened before b, -1 if b happened before a, and 0 if they happned at the exact same time. (used for sorting)
 */
export function compareDates(a: Transaction, b: Transaction) {
    if (Date.parse(a.date) > Date.parse(b.date)) { 
        return 1;
    }
    if (Date.parse(a.date) < Date.parse(b.date)) {
        return -1;
    }
    return 0
}

/**
 * Function to create a transaction object between 2 students given: 
 * @param senderAuth - The AuthUser of the sender in the transaction
 * @param senderBank - The BankUser of the sender in the transaction
 * @param receiverAuth - The AuthUser of the receiver in the transaction
 * @param receiverBank - The BankUser of the receiver in the transaction
 * @param amount - The numeric amount that the transaction is for (positive)
 * @param shopPurchase - true if this was the result of a sale of goods, sets the type to "commerce", false otherwise, sets the type to "transfer"
 * @param receiverDesc - (optional) A string description of the transaction from the perspective of the receiver, defaults to "got paid by (username)"
 * @param senderDesc - (optional) A string description of the transaction from the perspective of the sender, defaults to "paid (username)"
 * @returns A transaction object corresponding to the given transaction information.
 */

export function makeStudentToStudentTransaction(
    senderAuth: AuthUser, senderBank: BankUser, 
    receiverAuth: AuthUser, receiverBank: BankUser, 
    amount: number, shopPurchase: boolean,
    receiverDesc?: string, senderDesc?: string
    ): Transaction {
    const transaction: Transaction = {
        date: new Date().toISOString(),
        receiver_balance: receiverBank.balance + amount,
        receiver_description: senderDesc || "got paid by" + senderAuth.username,
        receiver_name: receiverAuth.username,
        receiver_uid: receiverBank.uid,
        sender_balance: senderBank.balance - amount,
        sender_description: receiverDesc || "paid" + receiverAuth.username,
        sender_name: senderAuth.username,
        sender_uid: senderBank.uid,
        transfer_amount: amount,
        type: shopPurchase ? "commerce" : "transfer"
    };
    return transaction;
}
/**
 * 
 * @param receiverAuth - The AuthUser of the receiver in the transaction
 * @param receiverBank - The BankUser of the sender in the transaction
 * @param amount - The numeric amount the transaction is for (positive)
 * @param type - A string for the type of the transaction (i.e "academic" for quiz payouts, "misc" for some sort of starting balance, etc)
 * @param systemName - A string for the name of the system giving this out ("quizzes", "system", etc.)
 * @param receiverDesc - (optional) A string description of the transaction from the receiver's perspective
 * @param senderDesc - (optional) A string description of the transaction from the sender's perspective
 * @returns A transaction object corresponding to the given transaction information
 */
export function makeSystemToStudentTransaction(
    receiverAuth: AuthUser, receiverBank: BankUser, 
    amount: number, type: string,
    systemName: string,
    receiverDesc?: string, senderDesc?: string,
    ): Transaction {
    const transaction: Transaction = {
        date: new Date().toISOString(),
        receiver_balance: receiverBank.balance + amount,
        receiver_description: senderDesc || "got paid by" + systemName,
        receiver_name: receiverAuth.username,
        receiver_uid: receiverBank.uid,
        sender_description: receiverDesc || "paid" + receiverAuth.username,
        transfer_amount: amount,
        type: type || "misc"
    };
    return transaction;
}

const LaterDate = new Date();
LaterDate.setHours(20);
export const sampleTransactions:Transaction[] = [
    {
    date: "2023-04-14T03:16:46.782Z",
    receiver_balance: 500,
    receiver_description: "starting balance",
    receiver_name: "testUser" || "user",
    receiver_uid: "4FLcNX4wNMXnmIIcf5Dp6QY1Vas2" || "0",
    sender_description: "paid out starting balance",
    sender_name: "system",
    transfer_amount: 500,
    type: "misc"
    },
    {
        date: new Date().toISOString(),
        receiver_name: "testUser" || "user",
        sender_name: "system",
        receiver_description: "weekly earnings",
        sender_description: "paid out weekly earnings",
        transfer_amount: 150,
        receiver_balance: 650,
        receiver_uid: "4FLcNX4wNMXnmIIcf5Dp6QY1Vas2" || "0",
        type: "misc"
    },
    {
        date: LaterDate.toISOString(),
        receiver_name: "testUser" || "user",
        sender_name: "system",
        receiver_description: "quiz earnings",
        sender_description: "paid out quiz earnings",
        transfer_amount: 75,
        receiver_balance: 700,
        receiver_uid: "4FLcNX4wNMXnmIIcf5Dp6QY1Vas2" || "0",
        type: "academics"
    },
    {
        date: new Date().toISOString(),
        receiver_name: "candle merchant",
        sender_name: "testUser" || "user",
        receiver_description: "sold candles",
        sender_description: "bought candles",
        transfer_amount: 25,
        sender_balance: 625,
        receiver_balance: 1025,
        receiver_uid: "0",
        type: "commerce"
    }
]