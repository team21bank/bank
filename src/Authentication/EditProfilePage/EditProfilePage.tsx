import { ref, getDatabase, set, update } from "@firebase/database";
import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { BankUser } from "../../Interfaces/BankUser";
import { AuthContext, getCurrentUser } from "../auth";
import { ChangeUsernameButton } from "../ChangeUsername/ChangeUsername";
import { NoUserPage } from "../NoUserPage/NoUserPage";


export function EditProfile(): JSX.Element {

    const userContext = useContext(AuthContext);
    const [currUser, setCurrUser] = useState<BankUser>(); //Current state of the user object
    if(userContext.state == null) return <NoUserPage />;
    
    if(!currUser) getCurrentUser(userContext.state, setCurrUser);

    //updates the database instance of currUser
    function saveToDatabase() {
        if(userContext.state==null) alert("Failed to push to database");
        else {
            let userRef = ref(getDatabase(), "/users/"+userContext.state.user.uid);
            set(userRef, {userObj:{...currUser}});
        }
    }

    return currUser ? (
        <div>
            <h1>Edit Profile</h1>
            <div>Logged in as user {currUser ? currUser.username : ""}</div>

            <ChangeUsernameButton currUser={currUser} setCurrUser={setCurrUser}/>


            <Button onClick={saveToDatabase}>Save Changes</Button>
        </div>
    ) : (
        <h1>Loading...</h1>
    )
}