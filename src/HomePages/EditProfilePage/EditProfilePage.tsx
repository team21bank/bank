import { ref, getDatabase, set, update } from "@firebase/database";
import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AvatarForm } from "./Avatar/Avatar";
import { AuthContext } from "../../Authentication/auth";
import { ChangeUsernameButton } from "./ChangeUsername/ChangeUsername";
import "./EditProfilePage.css";
import { DeleteAccountModal } from "./DeleteAccount";
import { auth } from "../../firebase";
import { ImageGallery } from "../../AvatarPool/ImageGallery";
import { DEFAULT_AUTH_USER } from "../../Interfaces/AuthUser";
import { update_auth_user } from "../../DatabaseFunctions/UserFunctions";


export function EditProfile(): JSX.Element {
    const user = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;

    const [new_user, set_new_user] = useState(user);

    //updates the database instance of currUser
    function saveToDatabase() {
        update_auth_user(user.id, new_user)
    }

    const home_page = user.isTeacher ? "/teachers/home" : "/students/home";

    return (
        <div className="edit-profile-page">
            <h1>Edit Profile</h1>
            <div>Logged in as user {user.username}</div>

            <ChangeUsernameButton />
            <br />
            <ImageGallery></ImageGallery>
            <AvatarForm />

            <br />
            <Link to={home_page}><Button onClick={saveToDatabase}>Save Changes</Button></Link>
            <Link to={home_page}><Button>Cancel Changes</Button></Link>

            <DeleteAccountModal />
        </div>
    )
}