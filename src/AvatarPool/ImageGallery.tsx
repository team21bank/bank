import React, { useContext, useState } from 'react';
import { ImageViewer } from './ImageViewer';
import { image_map } from './README';

export function ImageGallery(): JSX.Element {
    //Component to display the entire pool of images to the teacher so that they can make sure all of the avatars look good

    //Try catch block that'll display the user's profile picture if it exists; The default profile otherwises.
    return <div style={{display: "wrap", justifyContent: "center", alignItems: "stretch"}}> 
        {image_map.map((i: number): JSX.Element => {
        return <span><ImageViewer avatar={i.toString()}></ImageViewer></span>})};
    </div>
}