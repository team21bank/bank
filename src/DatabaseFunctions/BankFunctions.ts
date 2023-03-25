import { onValue, ref, getDatabase } from "firebase/database";
import { Bank } from "../Interfaces/BankObject";


export function get_bank(bank_id: string, setter: (bank: Bank) => void) {
    onValue(ref(getDatabase(), "/groups/"+bank_id+"/bankObj"), bank_snapshot => {
        if(bank_snapshot.exists() === false) {
            alert("Bank does not exist, displaying default values.");
            return;
        }
        setter(bank_snapshot.val());
    });
}