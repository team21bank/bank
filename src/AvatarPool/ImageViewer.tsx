import React, { useContext, useState } from 'react';
import "./ImageGallery.css";

export function ImageViewer({avatar}: {avatar: string | undefined}){
    //Takes in the avatar string from a user to determine the profile picture to display.

    //Try catch block that'll display the user's profile picture if it exists; The default profile otherwise.
    try {
        return <span>
        <img className="image-gallery-image" width="50px" alt="Your Avatar" src={require("./" + avatar + ".png")} ></img>
        </span>
    } catch {
        return <span>
        <img className="image-gallery-image" width="50px" alt="Default Avatar" src={require("./default.png")} ></img>
        </span>
    }
}