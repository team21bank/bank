import { ref, getDatabase, set } from "@firebase/database";
import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AvatarForm } from "../../Avatar/Avatar";
import { AuthUser } from "../../Authentication/auth";
import { AuthContext, getCurrentUser } from "../auth";
import { ChangeUsernameButton } from "../ChangeUsername/ChangeUsername";
import { NoUserPage } from "../NoUserPage/NoUserPage";
import "./EditProfilePage.css";


export function EditProfile(): JSX.Element {

    const userContext = useContext(AuthContext);
    const [currUser, setCurrUser] = useState<AuthUser>(); //Current state of the user object

    if(userContext.state == null) {return <NoUserPage />};
    if(!currUser) getCurrentUser(userContext.state, setCurrUser);

    //updates the database instance of currUser
    function saveToDatabase() {
        if(userContext.state==null) alert("Failed to push to database");
        else {
            let userRef = ref(getDatabase(), "/users/"+userContext.state.user.uid);
            set(userRef, {userObj:{...currUser}});
        }
    }

    const home_page = currUser?.isTeacher ? "/teachers/home" : "/students/home";

    return currUser ? (
        <div className="edit-profile-page">
            <h1>Edit Profile</h1>
            <div>Logged in as user {currUser ? currUser.username : ""}</div>

            <ChangeUsernameButton currUser={currUser} setCurrUser={setCurrUser}/>
            <br />
            <AvatarForm />

            <br />
            <Link to={home_page}><Button onClick={saveToDatabase}>Save Changes</Button></Link>
            <Link to={home_page}><Button>Cancel Changes</Button></Link>
        </div>
    ) : (
        <h1>Loading...</h1>
    )
}