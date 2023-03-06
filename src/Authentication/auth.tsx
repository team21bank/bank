import React, { ReactNode, useEffect, useState } from "react";
import { ref, getDatabase } from "@firebase/database";
import { onValue } from "firebase/database";
import { Bank } from "../Interfaces/BankObject";

//Object to store information about a user
export interface AuthUser {
    email: string
    username: string
    id: string
    avatar: string
    groups: string[]
    isTeacher: boolean
    hash: string
}
export const DEFAULT_AUTH_USER: AuthUser = {
    email: "", username: "", id: "", avatar: "", groups: [], isTeacher: false, hash: ""
} 

export const STORAGE_KEY = "CurrentUser";

//React context to store the current user state and a function to modify it
export const AuthContext = React.createContext({
    user: null as AuthUser | null,
    setUser: {} as (n: AuthUser | null) => void
});

//Provider component to wrap the entire app
export function CurrentUserProvider({children}: {children: ReactNode}): JSX.Element {
    let uid_string: string | null = null;
    //AuthContext is reset every time the page reloads so we need to get it from local storage here to stay logged in across links
    const currUserString = window.sessionStorage.getItem(STORAGE_KEY);
    if(currUserString != null) uid_string = currUserString;

    //THIS IS THE ACTUAL STATE THAT HOLDS THE CREDENTIALS OF THE CURRENTLY LOGGED IN USER
    //THIS STATE WILL BE NULL IF NO USER IS CURRENTLY LOGGED IN
    const [CurrentAuthUser, setCurrentAuthUser] = useState<AuthUser | null>(null);

    useEffect(() => { //update currentAuthUser if the state in the database changes
        if(uid_string != null) {
            const user_ref = ref(getDatabase(), "/users/"+uid_string);
            onValue(user_ref, user_snapshot => {
                const user = user_snapshot.val();
                if(user != null) setCurrentAuthUser(user.userObj);
            });
        }
    }, [uid_string]);

    return (<AuthContext.Provider value={{user: CurrentAuthUser, setUser: setCurrentAuthUser}}>{children}</AuthContext.Provider>);
}


//--------------- HOW TO USE ---------------\\
/*
    AuthContext is essentially a global state accessible from any component rendered under CurrentUserProvider.
    In App.tsx, literally everything renders under CurrentUserProvider so it is accessible everywhere.

    To access this state in your code use:
        const user = useContext(AuthContext);
    
    user.user is the actual AuthUser object that exists in the database.
    user.setUser allows you to set this user object.
    NOTE THAT IF THE OBJECT IS UPDATED IN THE USERBASE, THE CHANGES WILL BE IMMEDIATELY BE REFLECTED IN THE BROWSER

    If you need to get the uid of the logged in user, use:
        auth.currentUser.uid
*/


//Provides global access to the currently selected bank
//This is set when you navigate to a class page
export const BankContext = React.createContext({
    bank: null as Bank | null,
    setBank: {} as (n: Bank | null) => void
});

export function CurrentBankProvider({children}: {children: ReactNode}): JSX.Element {
    const [currentBank, setCurrentBank] = useState<Bank | null>(null);

    return (<BankContext.Provider value={{bank: currentBank, setBank: setCurrentBank}}>{children}</BankContext.Provider>);
}