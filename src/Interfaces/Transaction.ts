export interface Transaction{
    date: string; //when the transaction occurred

    account: string; //the user who received (or lost) money

    description: string; //what the transaction was for

    type: string; //The type of transaction it was

    sender: string; //The name of who sent it

    amount: number; //the amount of money the transaction was for

    balance: number; //the total balance after the transaction

    account_uid: string; //uid of the account in this transaction

    sender_uid?: string; //uid of the sender account in this transaction (nullable? special IDs for non-account funds? I dunno.)

    
}
