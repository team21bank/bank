import { Unsubscribe } from "firebase/auth";
import { get, onValue, set, ref, getDatabase, remove } from "firebase/database";
import { AuthUser, DEFAULT_AUTH_USER } from "../Authentication/auth";

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

//Fetches an AuthUser object from the database and uses it in the setter function
export function get_auth_user(uid: string, setter: (AuthUser) => void): Unsubscribe {
    return onValue(ref(getDatabase(), "/users/"+uid+"/userObj"),
        snapshot => {
            setter(snapshot.val() ?? DEFAULT_AUTH_USER)
        }
    )
}

//Fetches a list of AuthUser objects
//THIS IS ONLY SUPPOSED TO BE USED ON THE TEACHER CLASS PAGE
//ONVALUE IS NOT USED SO UPDATES TO THE DATABASE ARE NOT REFLECTED ON THE WEBSITE UNTIL REFRESH
export function get_auth_users(uids: [string], setter: ([AuthUser]) => void) {
    const database = getDatabase()
    const users = uids.map(uid => get(ref(database, "/users/"+uid+"/userObj")))
    Promise.allSettled(users).then(settled_result => {
        console.log("got array: ", settled_result)
    })
}