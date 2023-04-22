import React, { ReactNode, useEffect, useState } from "react";
import { Bank, DEFAULT_BANK, resolve_nullish_bank } from "../Interfaces/BankObject";
import { AuthUser, DEFAULT_AUTH_USER, resolve_nullish_authuser } from "../Interfaces/AuthUser";
import { Unsubscribe } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";





//React context to store the current user state and a function to modify it
export const AuthContext = React.createContext({user: DEFAULT_AUTH_USER});
export const BankContext = React.createContext({bank: DEFAULT_BANK})

export const USER_STORAGE_KEY = "CurrentUser";
export const BANK_STORAGE_KEY = "CurrentBank";


export function ContextProvider({children}: {children: ReactNode}): JSX.Element {
    const [user, set_user] = useState<AuthUser>(DEFAULT_AUTH_USER);
    const [bank, set_bank] = useState<Bank>(DEFAULT_BANK);

    let handle_change_user = () => {
        let new_user_id = window.sessionStorage.getItem(USER_STORAGE_KEY);
        if(new_user_id === null) {
            set_user(DEFAULT_AUTH_USER);
        } else {
            if(new_user_id === user.hash) {return;}
            get_auth_user_updating(new_user_id, set_user);
        }
    }
    let handle_change_bank = () => {
        let new_bank_id = window.sessionStorage.getItem(BANK_STORAGE_KEY);
        if((new_bank_id??"") === bank.bankId) {
            return;
        }

        if(new_bank_id === null) {
            set_bank(DEFAULT_BANK);
        } else {
            get_bank_updating(new_bank_id, set_bank);
        }
    }

    useEffect(() => {
        window.removeEventListener("change_user", handle_change_user);
        window.addEventListener("change user", handle_change_user);
        change_user(window.sessionStorage.getItem(USER_STORAGE_KEY));

        window.removeEventListener("change bank", handle_change_bank);
        window.addEventListener("change bank", handle_change_bank);
        change_bank(window.sessionStorage.getItem(BANK_STORAGE_KEY));
    }, [])
    

    return (
        <AuthContext.Provider value={{user: user}}>
            <BankContext.Provider value={{bank: bank}}>
                {children}
            </BankContext.Provider>
        </AuthContext.Provider>
    )
}


export function change_user(new_uid: string | null) {
    //if the new user is null, remove the storage key. Otherwise overwrite the value
    if(new_uid === null) {
        window.sessionStorage.removeItem(USER_STORAGE_KEY);
    } else {
        window.sessionStorage.setItem(USER_STORAGE_KEY, new_uid);
    }

    //Throw an event to update the auth context onvalue call
    let e = new CustomEvent("change user");
    window.dispatchEvent(e);
}

export function change_bank(new_bank_id: string | null) {
    if(new_bank_id === null) {
        window.sessionStorage.removeItem(BANK_STORAGE_KEY);
    } else {
        window.sessionStorage.setItem(BANK_STORAGE_KEY, new_bank_id);
    }

    //Throw an event to update the auth context onvalue call
    let e = new CustomEvent("change bank");
    window.dispatchEvent(e);
}


/**Fetches an AuthUser object from the database and uses it in the setter function*/
function get_auth_user_updating(uid: string, setter: (AuthUser: AuthUser) => void): Unsubscribe {
    return onValue(ref(getDatabase(), "/users/"+uid+"/userObj"),
        snapshot => {
            console.log("Setting user: ", snapshot.val() ?? DEFAULT_AUTH_USER);
            setter(resolve_nullish_authuser(snapshot.val() ?? DEFAULT_AUTH_USER))
        }
    )
}

/**Fetches a bank object using onvalue and uses setter whenever the database state changes*/
function get_bank_updating(bank_id: string, setter: (bank: Bank) => void): Unsubscribe {
    return onValue(ref(getDatabase(), "/groups/"+bank_id+"/bankObj"),
        bank_snapshot => {
            console.log("Setting bank: ", bank_snapshot.val() ?? DEFAULT_BANK);
            setter(resolve_nullish_bank(bank_snapshot.val() ?? DEFAULT_BANK));
        }
    );
}

