import { set, ref, getDatabase, remove } from "firebase/database";
import { AuthUser } from "../Authentication/auth";

//Sets the AuthUser object at /users/uid to new_object
export function update_auth_user(uid: string, new_object: AuthUser) {
    set(ref(getDatabase(), "/users/"+uid+"/userObj"), new_object);
}

//Deletes AuthUser object at /users/uid
//THIS FUNCTION DOES NOT DELETE THE BANKUSER OBJECT FROM BANKS
export function delete_auth_user(uid: string) {
    remove(ref(getDatabase(), "/users/"+uid));
}

//Creates a new auth user object and inserts it into the database.
//New AuthUser object is created under /users/uid
export function create_auth_user(uid: string, user_object: AuthUser) {
    set(ref(getDatabase(), "/users/"+uid+"/userObj"), user_object);
}

