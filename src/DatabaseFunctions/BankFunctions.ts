import { onValue, ref, getDatabase, get, set, remove, Unsubscribe } from "firebase/database";
import { Bank, DEFAULT_BANK } from "../Interfaces/BankObject";
import { Transaction } from "../Interfaces/Transaction";

/**
 * Deletes the bank object at /groups/bank_id
 * 
 * THIS DOES NOT DELETE AUTHUSER'S REFERENCES TO THE BANK
*/
export function delete_bank(bank_id: string): Promise<void> {
    return remove(ref(getDatabase(), "/groups/"+bank_id));
}

/**
 * Deletes multiple banks
 * 
 * DOES NOT DELETE AUTHUSER'S REFERENCES TO THE BANKS
 */
export function delete_banks(bank_ids: string[]): Promise<void[]> {
    let promises = bank_ids.map(id => delete_bank(id));
    return Promise.all(promises);
}


/**Gets a bank object then calls func on it if it exists*/
export function get_bank_then(bank_id: string, func: (bank: Bank) => void) {
    get(ref(getDatabase(), "/groups/"+bank_id+"/bankObj")).then(bank_snapshot => {
        if(bank_snapshot.exists()) {
            func(bank_snapshot.val());
        }
    });
}

/**Fetches a bank object using onvalue and uses setter whenever the database state changes*/
export function get_bank_updating(bank_id: string, setter: (bank: Bank) => void): Unsubscribe {
    return onValue(ref(getDatabase(), "/groups/"+bank_id+"/bankObj"),
        bank_snapshot => {
            setter(bank_snapshot.val() ?? DEFAULT_BANK);
        }
    );
}

export async function get_bank(bank_id: string): Promise<Bank | null> {
    let bank_snapshot = await get(ref(getDatabase(), "/groups/"+bank_id+"/bankObj"));
    return bank_snapshot.val();
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
        let pending_list: Transaction[] = pending_list_snapshot.val();
        if( pending_list == null ) {
            alert("There are no pending transactions in the current bank");
            return;
        }
        //Finds the index of the transaction to be removed
        let indexRemove = pending_list.findIndex((pending_transaction: Transaction) => JSON.stringify(pending_transaction) == JSON.stringify(transaction));
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
