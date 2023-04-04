import React, { ReactNode, useEffect, useState } from "react";
import { Bank } from "../Interfaces/BankObject";
import { get_auth_user } from "../DatabaseFunctions/UserFunctions";
import { get_bank } from "../DatabaseFunctions/BankFunctions";
import { AuthUser } from "../Interfaces/AuthUser";


//--------------- HOW TO USE ---------------\\
/*
    AuthContext is essentially a global state accessible from any component rendered under CurrentUserProvider.
    In App.tsx. Everything renders under CurrentUserProvider so it is accessible everywhere.

    To access this state in your code use:
        const user: AuthUser = useContext(AuthContext) ?? DEFAULT_AUTH_USER;
    
    user.user is the actual AuthUser object that exists in the database.
    user.setUser allows you to set this user object.
    NOTE THAT IF THE OBJECT IS UPDATED IN THE USERBASE, THE CHANGES WILL BE IMMEDIATELY BE REFLECTED IN THE BROWSER

    If you need to get the uid of the logged in user, use:
        auth.currentUser.uid
*/


//React context to store the current user state and a function to modify it
export const AuthContext = React.createContext({
    user: null as AuthUser | null,
    setUser: {} as (n: AuthUser | null) => void
});

export const USER_STORAGE_KEY = "CurrentUser";

//Provider component to wrap the entire app
export function CurrentUserProvider({children}: {children: ReactNode}): JSX.Element {
    const [CurrentAuthUser, setCurrentAuthUser] = useState<AuthUser | null>(null);

    //AuthContext is reset every time the page reloads so we need to get it from local storage here to stay logged in across links
    const currUserString = window.sessionStorage.getItem(USER_STORAGE_KEY);
    useEffect(() => { //update currentAuthUser if the state in the database changes
        if(currUserString != null) {
            get_auth_user(currUserString, setCurrentAuthUser)
        }
    }, [currUserString]);    

    return (<AuthContext.Provider value={{user: CurrentAuthUser, setUser: setCurrentAuthUser}}>{children}</AuthContext.Provider>);
}



//Provides global access to the currently selected bank
//This is set when you navigate to a class home page
export const BankContext = React.createContext({
    bank: null as Bank | null,
    setBank: {} as (n: Bank | null) => void
});

export const BANK_STORAGE_KEY = "CurrentBank";

export function CurrentBankProvider({children}: {children: ReactNode}): JSX.Element {
    const [currentBank, setCurrentBank] = useState<Bank | null>(null);

    const currBankString = window.sessionStorage.getItem(BANK_STORAGE_KEY);
    useEffect(() => {
        if(currBankString != null) {
            get_bank(currBankString, setCurrentBank)
        }
    }, [currBankString]);

    return (<BankContext.Provider value={{bank: currentBank, setBank: setCurrentBank}}>{children}</BankContext.Provider>);
}



