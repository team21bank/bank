import { UserCredential } from "firebase/auth";
import React, { Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { BankUser } from "../Interfaces/BankUser";
import { ref, get, getDatabase } from "@firebase/database";


export const AuthContext = React.createContext({
    state: {} as UserCredential | null,
    setState: {} as Dispatch<SetStateAction<UserCredential | null>>
});

export function CurrentUserProvider({children}: {children: ReactNode}): JSX.Element {

    const [CurrentUserCredential, setCurrentUserCredential] = useState<UserCredential | null>(null);

    return (<AuthContext.Provider value={{state: CurrentUserCredential, setState: setCurrentUserCredential}}>{children}</AuthContext.Provider>);
}

export function getCurrentUser(): BankUser | null {
    let ret: BankUser | null = null;

    const userContext = useContext(AuthContext);
    if(userContext.state == null) return null;

    
    let userRef=ref(getDatabase(),'/users/'+userContext.state.user.uid+'/userObj/');
    get(userRef).then(snap => {
        ret = snap.val();
        return snap.val();
    }).catch(function(error){
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    });
    return ret;
}