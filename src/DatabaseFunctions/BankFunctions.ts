import { ref, getDatabase, get, set, remove } from "firebase/database";
import { Bank, DEFAULT_BANK, copy_bank, resolve_nullish_bank } from "../Interfaces/BankObject";
import { Transaction } from "../Interfaces/Transaction";
import { FirebaseApp } from "firebase/app";
import { BankUser } from "../Interfaces/BankUser";

/** */
export async function update_bank(bank_id: string, new_bank: Bank, app?: FirebaseApp): Promise<void> {
    await set(ref(getDatabase(app), "/groups/"+bank_id+"/bankObj/"), new_bank);
    return;
}

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


/**Gets a bank object then calls func
*/
export function get_bank_then(bank_id: string, func: (bank: Bank | null) => void) {
    get(ref(getDatabase(), "/groups/"+bank_id+"/bankObj")).then(bank_snapshot => {
        if(bank_snapshot.exists()) {
            func(resolve_nullish_bank(bank_snapshot.val()));
        } else {
            func(null);
        }

    });
}


export async function get_bank(bank_id: string, app?: FirebaseApp): Promise<Bank | null> {
    let bank_snapshot = await get(ref(getDatabase(app), "/groups/"+bank_id+"/bankObj"));
    if(bank_snapshot.exists()) {
        return resolve_nullish_bank(bank_snapshot.val())
    }
    return null;
}

export async function create_new_bank(bank_id: string, teacher_id: string, bank_name: string, bank_description?: string, app?: FirebaseApp): Promise<void> {
    if((await get_bank(bank_id, app)) !== null) {
        return Promise.reject("Bank already exists")
    }

    let bank_reference = ref(getDatabase(app), "/groups/"+bank_id+"/bankObj/");
    set(bank_reference, {...copy_bank(DEFAULT_BANK), teacherID: teacher_id, bankId: bank_id, classTitle: bank_name, description: bank_description??""})
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
            pending_list = [transaction];
            set(pending_list_ref, pending_list);
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
            alert("There was no transaction ");
            return;
        }
        //Removes the matching transaction from the array
        pending_list.splice(indexRemove, 1);
        //update the pendingList
        set(pending_list_ref, pending_list);
    });
}


export function push_transaction_to_completed(bank_id: string, transaction: Transaction) {
    //Get reference to the completedList for the receiver
    let receiver_completed_list_ref = ref(getDatabase(), "/groups/"+bank_id+"/bankObj/completedList/" + transaction.receiver_uid);

    //Gets snapshot of the given path
    get(receiver_completed_list_ref).then(completed_list_snapshot => {

        //Local variable for the completedList 
        let completed_list = completed_list_snapshot.val();

        //If nothing there yet, just create the list and finish the get block
        if( completed_list == null ) {
            completed_list = [transaction];
            set(receiver_completed_list_ref, completed_list);
            return;
        }

        //Push new Transaction to the end of completedList
        completed_list.push(transaction);

        //update the completedList
        set(receiver_completed_list_ref, completed_list);
    });

    //If there's a sender student, repeat the above process for the sender's completedList
    if(transaction.sender_uid) {
        let sender_completed_list_ref = ref(getDatabase(), "/groups/"+bank_id+"/bankObj/completedList/" + transaction.sender_uid);
        get(sender_completed_list_ref).then(completed_list_snapshot => {
            let completed_list = completed_list_snapshot.val();
            if( completed_list == null ) {
                completed_list = [transaction];
                set(sender_completed_list_ref, completed_list);
                return;
            }

            //Push new Transaction to the end of completedList
            completed_list.push(transaction);

            //update the actual completedList
            set(sender_completed_list_ref, completed_list);
        });
    }

}

export function display_type_of_thing(bank_id: String) {
    let bank_completed_list_ref = ref(getDatabase(), "/groups/"+bank_id+"/bankObj/completedList/")
    get(bank_completed_list_ref).then(completed_list_snapshot => {
        let completed_list = completed_list_snapshot.val();
        console.log(completed_list);
        console.log(typeof(completed_list));
        console.log(Object.keys(completed_list.fields))
    });
}