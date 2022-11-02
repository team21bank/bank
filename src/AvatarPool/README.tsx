/**
Instructions for teachers who wish to create or update the course pool:

Go into the AvatarPool directory/folder (the folder this README is in)

All student avatar images must be named in the format of n.png where n is an integer ex: 0.png, 5.png, etc. Ensure there are no duplicate filenames. 
Images are automatically scaled down and made circular; Centered, clear images work best! - 

default.png MUST EXIST. If you wish to update the default profile picture, remove the old one and ensure you replace it with a new default.png
*/

const total_images = 102; //Alter this value whenver you add/remove images! A value of 2 means you have images 0.png, 1.png (and default.png)

export const image_map = Array.from(Array(total_images).keys())