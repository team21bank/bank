import React from 'react';
import { Icon } from '../Avatar/Icon';
import { AuthUser } from '../Interfaces/AuthUser';
import { image_map } from './README';



export function ImageGallery({set_new_user, user}: {set_new_user: (AuthUser)=>void, user: AuthUser}): JSX.Element {

    function update(user: AuthUser, avatar: string) {
        set_new_user({...user, groups: [...user.groups], avatar: avatar});
    
    }

    return <div>
        <h5>Click a shape to select it as your profile picture!</h5>
        {image_map.map((avatar: number) =>
        <span onClick={() => update(user, avatar.toString())}>
        <Icon avatar={avatar.toString()}></Icon>
        </span>
        )}
        <br></br>
        <br></br>
        <h5>Current Selection:</h5>
        {<Icon avatar={user.avatar}></Icon>}
    </div>
    //Component to display the entire pool of images to the teacher so that they can make sure all of the avatars look good

    //Try catch block that'll display the user's profile picture if it exists; The default profile otherwises.
    /*
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
    
    return <div style={{display: "wrap", justifyContent: "center", alignItems: "stretch", width: "50%", margin: "auto"}}> 
    <h3>Select A New Profile Picture!</h3>
        {image_map.map((i: number): JSX.Element => {
        return <span tabIndex={i} id={"image_gallery_" + i.toString()} className="image-gallery" onClick={() => updateUserAvatar(i.toString())}><ImageViewer avatar={i.toString()}></ImageViewer></span>})}
        <div></div>
    </div>
    */
}