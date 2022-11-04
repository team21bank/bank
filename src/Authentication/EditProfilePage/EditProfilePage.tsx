import { ref, getDatabase, set } from "@firebase/database";
import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AvatarForm } from "../../Avatar/Avatar";
import { AuthContext } from "../auth";
import { ChangeUsernameButton } from "../ChangeUsername/ChangeUsername";
import { NoUserPage } from "../NoUserPage/NoUserPage";
import "./EditProfilePage.css";
import { DeleteAccountModal } from "./DeleteAccount";
import { auth } from "../../firebase";


export function EditProfile(): JSX.Element {

    const user = useContext(AuthContext);

    if(user.user == null) {return <NoUserPage />};

    //updates the database instance of currUser
    function saveToDatabase() {
        if(user.user==null) alert("Failed to push to database");
        else {
            if(auth.currentUser == null) return;
            let userRef = ref(getDatabase(), "/users/"+auth.currentUser.uid);
            set(userRef, {userObj:{...user.user}});
        }
    }

    const home_page = user.user?.isTeacher ? "/teachers/home" : "/students/home";

    return user.user ? (
        <div className="edit-profile-page">
            <h1>Edit Profile</h1>
            <div>Logged in as user {user.user ? user.user.username : ""}</div>

            <ChangeUsernameButton />
            <br />
            <AvatarForm />

            <br />
            <Link to={home_page}><Button onClick={saveToDatabase}>Save Changes</Button></Link>
            <Link to={home_page}><Button>Cancel Changes</Button></Link>

            <DeleteAccountModal />
        </div>
    ) : (
        <h1>Loading...</h1>
    )
}