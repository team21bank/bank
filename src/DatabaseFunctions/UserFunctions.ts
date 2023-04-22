import { get, set, ref, getDatabase, remove } from "firebase/database";
import { AuthUser, DEFAULT_AUTH_USER, resolve_nullish_authuser } from "../Interfaces/AuthUser";
import { FirebaseApp } from "firebase/app";

//DATABASE READING FUNCTIONS

/**Sets the AuthUser object at /users/uid to new_object*/
export async function update_auth_user(uid: string, new_object: AuthUser, app?: FirebaseApp) {
    await set(ref(getDatabase(app), "/users/"+uid+"/userObj"), new_object);
}

/**
 * Deletes AuthUser object at /users/uid

 * THIS FUNCTION DOES NOT DELETE THE BANKUSER OBJECT FROM BANKS.
   Instead the BankUser's username will appear as "DELETED_USER"
*/
export async function delete_auth_user(uid: string, app?: FirebaseApp) {
    await remove(ref(getDatabase(app), "/users/"+uid));
}

/**
 * Creates a new auth user object and inserts it into the database.

*New AuthUser object is created under /users/uid
*/
export async function create_auth_user(uid: string, user_object: AuthUser, app?: FirebaseApp) {
    await set(ref(getDatabase(app), "/users/"+uid+"/userObj"), user_object);
}



/**fetch the AuthUser object then use the callback function on it*/
export function get_auth_user_then(uid: string, func: (user: AuthUser | null) => void, app?: FirebaseApp) {
    get(ref(getDatabase(app), "/users/"+uid+"/userObj")).then(data => {
        if(data.exists()) {
            func(resolve_nullish_authuser(data.val()));
        } else {
            func(null)
        }
    })
}


export async function get_auth_user(uid, app?: FirebaseApp): Promise<AuthUser | null> {
    let snapshot = await get(ref(getDatabase(app), "/users/"+uid+"/userObj"));
    if(snapshot.exists()) {
        return resolve_nullish_authuser(snapshot.val());
    }
    return null;
}

/**
*Returns a list of AuthUser objects.
Users that dont exist will not be present in the result

*If one promise is rejected, the entire returned promise will be rejected. This shouldn't be a problem unless database read rules are added 
*/
export async function get_auth_users(uids: string[], app?: FirebaseApp): Promise<AuthUser[]> {
    const database = getDatabase(app);
    const users = await Promise.all(uids.map(uid => get(ref(database, "/users/"+uid+"/userObj"))))
    return users.filter(snapshot => snapshot.exists()).map<AuthUser>(snapshot => resolve_nullish_authuser(snapshot.val()))
}



