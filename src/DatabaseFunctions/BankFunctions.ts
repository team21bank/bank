import { onValue, ref, getDatabase, get, set } from "firebase/database";
import { Bank } from "../Interfaces/BankObject";
import { Transaction } from "../Interfaces/Transaction";

export function get_bank(bank_id: string, setter: (bank: Bank) => void) {
    onValue(ref(getDatabase(), "/groups/"+bank_id+"/bankObj"), bank_snapshot => {
        if(bank_snapshot.exists() === false) {
            alert("Bank does not exist");
            return;
        }
        setter(bank_snapshot.val());
    });
}


/**
 * @param bank_id The bank the transaction will occur in
 * @param transaction The Transaction object representing the transaction that is being added to the pending list for approval from a banker
 */
//Adds the Transaction object provided to the end of /groups/bank_id/pendingList
export function push_transaction_to_pending(bank_id: string, transaction: Transaction) {
    let pending_list_ref = ref(getDatabase(), "/groups/"+bank_id+"/bankObj/pendingList");
    get(pending_list_ref).then(pending_list_snapshot => {
        let pending_list = pending_list_snapshot.val();
        if( pending_list == null ) {
            pending_list = [transaction]
            set(pending_list_ref, pending_list)
            return;
        }

        //Push new Transaction to the end of pendingList
        pending_list.push(transaction);

        //update the pendingList
        set(pending_list_ref, pending_list);
    });
}

/** Should be called when transactions are being approved
 * @param bank_id The bank the transaction will occur in
 * @param transaction The Transaction object representing the transaction that is being removed from the pending list for approval from a banker
 */
//Adds the Transaction object provided to the end of /groups/bank_id/pendingList
export function remove_transaction_from_pending(bank_id: string, transaction: Transaction) {
    let pending_list_ref = ref(getDatabase(), "/groups/"+bank_id+"/bankObj/pendingList");
    get(pending_list_ref).then(pending_list_snapshot => {
        let pending_list = pending_list_snapshot.val();
        if( pending_list == null ) {
            alert("There are no pending transactions in the current bank");
            return;
        }
        //Finds the index of the transaction to be removed
        let indexRemove = pending_list.indexOf(transaction);
        //If the transaction isn't in the array, do nothing
        if(indexRemove == -1) {
            alert("There was no transaction ")
            return;
        }
        //Removes the matching transaction from the array
        pending_list.splice(indexRemove, 1)
        //update the pendingList
        set(pending_list_ref, pending_list);
    });
}

/**
 * @param bank_id The bank the transaction is occurring in
 * @param transaction The Transaction object representing the transaction that is being added to the completed transaction list
 */
//Adds the Transaction object provided to the end of /groups/bank_id/completedList
export function push_transaction_to_completed(bank_id: string, transaction: Transaction) {
    let completed_list_ref = ref(getDatabase(), "/groups/"+bank_id+"/bankObj/completedList");
    get(completed_list_ref).then(completed_list_snapshot => {
        let completed_list = completed_list_snapshot.val();
        if( completed_list == null ) {
            completed_list = [transaction]
            set(completed_list_ref, completed_list)
            return;
        }

        //Push new Transaction to the end of pendingList
        completed_list.push(transaction);

        //update the pendingList
        set(completed_list_ref, completed_list);
    });
}