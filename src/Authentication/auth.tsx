import React, { ReactNode, useEffect, useState } from "react";
import { ref, getDatabase } from "@firebase/database";
import { onValue } from "firebase/database";

//Object to store information about a user
export interface AuthUser {
    email: string
    username: string
    id: string
    avatar: string
    groups: string[]
    isTeacher: boolean
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

    useEffect(() => {
        if(uid_string != null) {
            const user_ref = ref(getDatabase(), "/users/"+uid_string);
            onValue(user_ref, user_snapshot => {
                const user: AuthUser = user_snapshot.val().userObj;
                setCurrentAuthUser(user);
            });
        }
    }, [uid_string]);


    return (<AuthContext.Provider value={{user: CurrentAuthUser, setUser: setCurrentAuthUser}}>{children}</AuthContext.Provider>);
}


//--------------- HOW TO USE ---------------\\
/*
    AuthContext is essentially a global state accessible from any component rendered under CurrentUserProvider.
    In App.tsx, literally everything renders under CurrentUserProvider so it is accessible everywhere.

    To access this state copy paste this code into the top of your component:

        const userContext = useContext(AuthContext);              <--- gets the value of the global state, this just a reference to the logged in user in the database
        const [userObj, setUserObj]  = useState<BankUser>();      <--- create a local state variable to store the value fetched via the database reference
        if(!userObj) getCurrentUser(userContext.state, setUserObj);                  <--- fetch user info from the database and place it in the local state created above if the state isnt already set
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