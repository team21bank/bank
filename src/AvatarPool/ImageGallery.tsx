import { getDatabase, ref, set } from 'firebase/database';
import React, { useContext} from 'react';
import { Button } from 'react-bootstrap';
import { AuthContext } from '../Authentication/auth';
import { auth } from '../firebase';
import { ImageViewer } from './ImageViewer';
import { image_map } from './README';
import "./ImageGallery.css";

export function ImageGallery(): JSX.Element {
    //Component to display the entire pool of images to the teacher so that they can make sure all of the avatars look good

    //Try catch block that'll display the user's profile picture if it exists; The default profile otherwises.
    const user = useContext(AuthContext);
    function updateProfile() {
        if(user.user==null) alert("Failed to push to database");
        else {
            if(auth.currentUser == null) return;
            let userRef = ref(getDatabase(), "/users/"+auth.currentUser.uid);
            console.log(user)
            set(userRef, {userObj:{...user.user}});
            alert("Successfully updated your profile picture!")
        }
    }
    function updateUserAvatar(imageIndex: string) {
        if(user.user==null) alert("Failed to push to database");
        else {
            user.setUser({...user.user, avatar: imageIndex})
            console.log("Profile Picture Updated!")
        }
        document.getElementById("image_gallery_" + imageIndex.toString())?.focus();
    }
    return <div style={{display: "wrap", justifyContent: "center", alignItems: "stretch"}}> 
        {image_map.map((i: number): JSX.Element => {
        return <span id={"image_gallery_" + i.toString()} className="image-gallery" onClick={() => updateUserAvatar(i.toString())}><ImageViewer avatar={i.toString()}></ImageViewer></span>})}
        <div></div>
        <Button onClick={() => updateProfile()}>Save New Profile Picture</Button>
    </div>
}