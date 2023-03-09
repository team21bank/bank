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
