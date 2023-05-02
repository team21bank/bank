import { ref, getDatabase, set, update } from "@firebase/database";
import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AvatarForm } from "./Avatar/Avatar";
import { AuthContext } from "../../Authentication/auth";
import { ChangeUsernameButton } from "./ChangeUsername/ChangeUsername";
import "./EditProfilePage.css";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { auth } from "../../firebase";
import { ImageGallery } from "../../AvatarPool/ImageGallery";
import { DEFAULT_AUTH_USER } from "../../Interfaces/AuthUser";
import { update_auth_user } from "../../DatabaseFunctions/UserFunctions";
import MonaLisa from "../../Images/MonaLisa.jpg";
import Leo from "../../Images/LeoDaVinci.jpg"


export function EditProfile(): JSX.Element {
    const user = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;

    const [new_user, set_new_user] = useState({...user, groups: [...user.groups]});

    //updates the database instance of currUser
    function saveToDatabase() {
        update_auth_user(user.hash, new_user)
    }

    const home_page = user.isTeacher ? "/teachers/home" : "/students/home";

    return (
        <div id = "parchmentBackground" className="edit-profile-page-row">

            <div >
                <img src={MonaLisa} className="edit-profile-page" />
            </div>
            <div className="edit-profile-page">
            <h1>Edit Profile</h1>
            <div>Logged in as user {user.username}</div>

            <ChangeUsernameButton />
            <br />
            <ImageGallery set_new_user={set_new_user} user={new_user}></ImageGallery>
            <AvatarForm />

            <br />
            <Link to={home_page}><Button onClick={saveToDatabase}>Save Changes</Button></Link>
            <Link to={home_page}><Button>Cancel Changes</Button></Link>

            <DeleteAccountModal />
         </div>
            <div >
                <img src={Leo} className="edit-profile-page" />
            </div>
        </div>
    )
}