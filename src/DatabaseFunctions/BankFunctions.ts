import { onValue, ref, getDatabase, get, Unsubscribe, remove } from "firebase/database";
import { Bank, DEFAULT_BANK } from "../Interfaces/BankObject";

//This deletes ONLY the bank object. Users references to the bank still exist so must be handled
export function delete_bank(bank_id: string): Promise<void> {
    return remove(ref(getDatabase(), "/groups/"+bank_id));
}

export function delete_banks(bank_ids: string[]): Promise<void[]> {
    let promises = bank_ids.map(id => delete_bank(id));
    return Promise.all(promises);
}


//Gets a bank object then calls func on it if it exists
export function get_bank_then(bank_id: string, func: (bank: Bank) => void) {
    get(ref(getDatabase(), "/groups/"+bank_id+"/bankObj")).then(bank_snapshot => {
        if(bank_snapshot.exists()) {
            func(bank_snapshot.val());
        }
    });
}

//Fetches a bank object using onvalue and uses setter whenever the database changes
export function get_bank_updating(bank_id: string, setter: (bank: Bank) => void): Unsubscribe {
    return onValue(ref(getDatabase(), "/groups/"+bank_id+"/bankObj"),
        bank_snapshot => {
            setter(bank_snapshot.val() ?? DEFAULT_BANK);
        }
    );
}