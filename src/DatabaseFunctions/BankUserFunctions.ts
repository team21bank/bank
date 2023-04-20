import { BankUser } from "../Interfaces/BankUser";
import { get, set, ref, getDatabase } from "firebase/database";


////////////////////////////// DATABASE MODIFYING FUNCTIONS //////////////////////////////

/**Sets the BankUser object at /groups/bank_id/bankObj/studentList/index_of(user_id) to new_bank_user*/
export function update_bank_user(bank_id: string, user_id: string, new_bank_user: BankUser) {
    let student_list_ref = ref(getDatabase(), "/groups/"+bank_id+"/bankObj/studentList");
    get(student_list_ref).then(student_list_snapshot => {
        let student_list = student_list_snapshot.val();
        if( student_list == null ) {
            alert("Bank not found");
            return;
        }

        //get index of the BankUser with same uid as user_id
        let bank_user_index = student_list.findIndex(e => e.uid === user_id);
        if( bank_user_index===-1 ) {
            alert("Bank user not found");
            return;
        }

        //update the value of the bank user object
        set(ref(getDatabase(), "/groups/"+bank_id+"/bankObj/studentList/"+bank_user_index), new_bank_user);
    });
}

/**
 * Deletes the BankUser object at /groups/bank_id/studentList/index_of(user_id)

 * THIS DOES NOT REMOVE THE ASSOCIATED AUTHUSER'S REFERENCE TO THE BANK
*/
export async function delete_bank_users(bank_id: string, user_ids: string[]): Promise<void> {
    let student_list_ref = ref(getDatabase(), "/groups/"+bank_id+"/bankObj/studentList");
    let student_list_snapshot = await get(student_list_ref);

    let student_list: BankUser[] = student_list_snapshot.val();
    if( student_list == null ) {
        alert("Bank not found");
        return;
    }

    //Create new array with specified BankUsers removed
    let new_student_list = student_list.filter(bank_user => user_ids.findIndex(id => id===bank_user.uid) !== -1);

    //update the studentList
    await set(student_list_ref, new_student_list);
    return;
}

/**Adds a new BankUser object with uid user_id to the end /groups/bank_id/studentList*/
export async function create_bank_users(bank_id: string, user_ids: string[]): Promise<void> {
    let student_list_ref = ref(getDatabase(), "/groups/"+bank_id+"/bankObj/studentList");
    let student_list_snapshot = await get(student_list_ref);
    let student_list = student_list_snapshot.val();
    if( student_list == null ) {
        alert("Bank not found");
        return;
    }
    
    //Push new BankUser to the end of studentList
    user_ids.forEach(user_id => {
        student_list.push({
            uid: user_id,
            isBanker: false,
            balance: 0
        });
    })
    //update the studentList
    await set(student_list_ref, student_list);
    return;
}


