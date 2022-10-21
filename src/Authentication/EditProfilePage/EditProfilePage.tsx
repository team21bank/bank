import { ref, getDatabase, set, update } from "@firebase/database";
import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { BankUser } from "../../Interfaces/BankUser";
import { AuthContext, getCurrentUser } from "../auth";
import { NoUserPage } from "../NoUserPage/NoUserPage";


export function EditProfile(): JSX.Element {

    const userContext = useContext(AuthContext);
    if(userContext.state == null) return <NoUserPage />;
    const [currUser, setCurrUser] = useState<BankUser>();
    if(!currUser) getCurrentUser(userContext.state, setCurrUser);

    //updates the database instance of currUser
    function saveToDatabase() {
        if(userContext.state==null) alert("Failed to push to database");
        else {
            let userRef = ref(getDatabase(), "/users/"+userContext.state.user.uid);
            update(userRef, {userObj:currUser});
        }
    }

    return currUser ? (
        <div>
            <h1>Edit Profile</h1>
            <div>Logged in as user {currUser ? currUser.username : ""}</div>


            <Button onClick={saveToDatabase}>Save Changes</Button>
        </div>
    ) : (
        <h1>Loading...</h1>
    )
}