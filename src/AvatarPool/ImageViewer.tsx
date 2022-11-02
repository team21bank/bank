import React, { useContext, useState } from 'react';

export function ImageViewer({avatar}: {avatar: string | undefined}){
    //Takes in the avatar string from a user to determine the profile picture to display.

    //Try catch block that'll display the user's profile picture if it exists; The default profile otherwise.
    try {
        return <span>
        <img style={{borderRadius: "50%"}} width="50px" alt="Your Avatar" src={require("./" + avatar + ".png")} ></img>
        </span>
    } catch {
        return <span>
        <img style={{borderRadius: "50%"}} width="50px" alt="Default Avatar" src={require("./default.png")} ></img>
        </span>
    }
}