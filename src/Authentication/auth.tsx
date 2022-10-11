import { UserCredential } from "firebase/auth";
import React, { ReactNode, useContext, useState } from "react";
import { BankUser } from "../Interfaces/BankUser";
import { ref, get, getDatabase } from "@firebase/database";

export const STORAGE_KEY = "CurrentUser";

//React context to store the current user state and a function to modify it
export const AuthContext = React.createContext({
    state: null as UserCredential | null,
    setState: {} as (n: UserCredential | null) => void
});

//Provider component to wrap the entire app
export function CurrentUserProvider({children}: {children: ReactNode}): JSX.Element {
    let stateArg: UserCredential | null = null;
    //AuthContext is reset every time the page reloads so we need to get it from local storage here to stay logged in across links
    const currUserString = window.sessionStorage.getItem(STORAGE_KEY);
    if(currUserString != null) stateArg = JSON.parse(currUserString);

    const [CurrentUserCredential, setCurrentUserCredential] = useState<UserCredential | null>(stateArg);
    return (<AuthContext.Provider value={{state: CurrentUserCredential, setState: setCurrentUserCredential}}>{children}</AuthContext.Provider>);
}

//function to fetch the user's data from the database
export function getCurrentUser(setUser: (n: BankUser | undefined)=>void) {
    const userContext = useContext(AuthContext);
    if(userContext.state == null) {
        console.log("No user is currently logged in");
        return;
    }
    let userRef=ref(getDatabase(),'/users/'+userContext.state.user.uid+'/userObj/');
    get(userRef).then(snap => {
        setUser(snap.val());
    });
}


//--------------- HOW TO USE ---------------\\
/*
    AuthContext is essentially a global state accessible from any component rendered under CurrentUserProvider.
    In App.tsx, literally everything renders under CurrentUserProvider so it is accessible everywhere.

    To access this state copy paste this code into the top of your component:

        const userContext = useContext(AuthContext);              <--- gets the value of the global state, this just a reference to the logged in user in the database
        const [userObj, setUserObj]  = useState<BankUser>();      <--- create a local state variable to store the value fetched via the database reference
        if(!userObj) getCurrentUser(setUserObj);                  <--- fetch user info from the database and place it in the local state created above if the state isnt already set
                                                                       If the user cannot be found, the userObj state will remain undefined
                                                    
                                                                       
    If the component you want to display requires a user to be logged in,
    add this line between the first and second to make sure the component cannot be rendered without being logged in:

        if(userContext.state == null) return <NoUserPage />;

    
    userObj may remain undefined as the component tries to rerender a few times while fetching data from the database.
    To handle this, use a conditional return block like this:

        return userObj ? (
            <h1>Cool Page</h1>
        ) : (
            <h1>Loading...</h1>
        )
    maybe in the future we can make a neat spinny loady page thing

*/