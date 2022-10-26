import { ref, getDatabase, update } from "firebase/database";
import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { BankUser } from "../../Interfaces/BankUser";
import { AuthContext, getCurrentUser } from "../auth";
import { NoUserPage } from "../NoUserPage/NoUserPage";


export function EditProfile(): JSX.Element {
    const userContext = useContext(AuthContext);
    const [userObj, setUserObj]  = useState<BankUser>();
    if(userContext.state == null) { return <NoUserPage />;}
    if(!userObj) getCurrentUser(userContext.state, setUserObj);

    //updates the database instance of currUser
    function saveToDatabase() {
        if(userContext.state==null) alert("Failed to push to database");
        else {
            let userRef = ref(getDatabase(), "/users/"+userContext.state.user.uid);
            update(userRef, {userObj:userObj});
        }
    }


    return userObj ? (
        <div>
            <h1>Edit Profile</h1>
            <div>Logged in as user {userObj ? userObj.username : ""}</div>

            <Button onClick={saveToDatabase}>Save Changes</Button>
        </div>
    ) : (
        <h1>Loading...</h1>
    )
}