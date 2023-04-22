import { Bank, DEFAULT_BANK } from "../Interfaces/BankObject";
import { BankUser, DEFAULT_BANK_USER } from "../Interfaces/BankUser";
import { get, set, ref, getDatabase } from "firebase/database";
import { get_bank, update_bank } from "./BankFunctions";


////////////////////////////// DATABASE MODIFYING FUNCTIONS //////////////////////////////

/**Sets the BankUser object at /groups/bank_id/bankObj/studentList/index_of(user_id) to new_bank_user*/
export async function update_bank_user(bank: string | Bank, user_id: string, new_bank_user: BankUser) {
    if(typeof bank === "string") {
        let bank_obj = await get_bank(bank) ?? DEFAULT_BANK;
        if(bank_obj === DEFAULT_BANK) {return Promise.reject("Bank does not exist");}
        
        //get index of the BankUser with same uid as user_id
        let bank_user_index = bank_obj.studentList.findIndex(e => e.uid === user_id);
        if( bank_user_index===-1 ) {
            alert("Bank user not found");
            return;
        }

        //update the value of the bank user object
        set(ref(getDatabase(), "/groups/"+bank+"/bankObj/studentList/"+bank_user_index), new_bank_user);
        return
    } else {
        //get index of the BankUser with same uid as user_id
        let bank_user_index = bank.studentList.findIndex(e => e.uid === user_id);
        if( bank_user_index===-1 ) {
            alert("Bank user not found");
            return;
        }

        //update the value of the bank user object
        set(ref(getDatabase(), "/groups/"+bank.bankId+"/bankObj/studentList/"+bank_user_index), new_bank_user);
        return
    }
    
}

/**
 * Deletes the BankUser object at /groups/bank_id/studentList/index_of(user_id)

 * THIS DOES NOT REMOVE THE ASSOCIATED AUTHUSER'S REFERENCE TO THE BANK
*/
export async function delete_bank_users(bank: string | Bank, ...user_ids: string[]): Promise<void> {
    if(typeof bank === "string" || bank instanceof String) {
        let student_list_ref = ref(getDatabase(), "/groups/"+bank+"/bankObj/studentList");
        let student_list_snapshot = await get(student_list_ref);

        let student_list: BankUser[] = student_list_snapshot.val();
        if( student_list == null ) {
            alert("Bank not found");
            return;
        }

        //Create new array with specified BankUsers removed
        let new_student_list = student_list.filter(bank_user => user_ids.findIndex(id => id===bank_user.uid) === -1);

        //update the studentList
        await set(student_list_ref, new_student_list);
        return;
    } else {
        let new_student_list = bank.studentList.filter(bank_user => user_ids.findIndex(id => id===bank_user.uid) === -1);

        let student_list_ref = ref(getDatabase(), "/groups/"+bank.bankId+"/bankObj/studentList");
        set(student_list_ref, new_student_list);
    }
}

/**Adds a new BankUser objects with user_ids to the end of /groups/bank_id/bankObj/studentList
 * @param bank A bank object to store new BankUsers in, or the id of a Bank to write to in the database
 * @param user_ids The new BankUsers' uids
*/
export async function create_bank_users(bank: string | Bank, ...user_ids: string[]): Promise<void> {
    if(typeof bank === "string") {
        //bank is string object
        let bank_obj = await get_bank(bank) ?? DEFAULT_BANK;

        if(bank_obj === DEFAULT_BANK) {
            return Promise.reject("Class does not exist")
        }
        
        //Push new BankUsers to the end of studentList
        bank_obj.studentList.push(...user_ids.map(
            (id): BankUser => {
                return {...DEFAULT_BANK_USER, uid: id}
            }
        ));
        //update the studentList
        update_bank(bank_obj.bankId, bank_obj)
    } else {
        //bank is Bank object
        //Add the new bank users onto the end of the studentList
        bank.studentList.push(...user_ids.map(
            (id): BankUser => {
                return {...DEFAULT_BANK_USER, uid: id}
            }
        ));
        //update the studentList
        let student_list_ref = ref(getDatabase(), "/groups/"+bank.bankId+"/bankObj/studentList");
        await set(student_list_ref, bank.studentList);
    }
}




