import React, { useContext, useState } from 'react';

export function ImageViewer({avatar}: {avatar: string}){
    //Takes in the avatar string from a user to determine the profile picture to display.

    //Try catch block that'll display the user's profile picture if it exists; The default profile otherwise.
    try {
        return <div> USER PROFILE PICTURE LOADED SUCCESSFULLY:
        <img border-radius="50%" width="50px" alt="Your Avatar" src={require("./" + avatar + ".png")} ></img>
        </div>
    } catch {
        return <div> DEFAULT PROFILE PICTURE (USER FAILED):
        <img border-radius="50%" width="50px" alt="Default Avatar" src={require("./default.png")} ></img>
        </div>
    }
}