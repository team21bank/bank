import { Button } from "react-bootstrap";
import React, { useContext, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { AuthContext } from "../Authentication/auth";
import { getDatabase } from "@firebase/database";
import {ref, set} from "@firebase/database";


export function AvatarForm() {
    const userContext = useContext(AuthContext);

    /*
    function saveAvatar(avatar: string | undefined) {
        if(userContext && avatar) userContext.user.avatar=avatar;
        if(user.user) setUserObj({...userObj})
        if (userObj!==undefined){
            if (userContext.state!==null){
                set(ref(getDatabase(),"users/"+userContext.user.user.uid+"/userObj/avatar"),userObj.avatar)
            }
        }
        alert("Avatar updated!")
    }

    const [images, setImages] = React.useState([]);
    const maxNumber = 69;
    
    const onChange = (
        imageList: ImageListType,
        addUpdateIndex: number[] | undefined
    ) => {
        console.log(imageList, addUpdateIndex);
        setImages(imageList as never[]);
    };

     return(
         <div className="App">
             <ImageUploading
                 multiple
                 value={images}
                 onChange={onChange}
                 maxNumber={maxNumber}
             >
                 {({
                     imageList,
                     onImageUpload,
                     onImageRemoveAll,
                     isDragging,
                     dragProps
                }) => (
                    <div className="uploadimage-wrapper">
                        <Button
                            style={isDragging ? { color: "red" } : undefined}
                            onClick={onImageUpload}
                            {...dragProps}
                            size="sm"
                        >
                             Upload Avatar
                         </Button>
                         <Button onClick={onImageRemoveAll} size="sm">Remove Avatar</Button>
                       {imageList.map((image, index) => (
                            <div key={index} className="image-item">
                                 <img src={image.dataURL} alt="" width="100" />
                                 <Button onClick= {image.dataURL!==undefined ? ()=>saveAvatar(image.dataURL): undefined}>Save Avatar</Button>
                           </div>
                      ))}
                   </div>
                 )}
            </ImageUploading>
         </div>
    )
    */
   return <div></div>;
};
