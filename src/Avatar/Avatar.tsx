import { Button, Form } from "react-bootstrap";
import React, { ChangeEvent, useContext, useRef, useState, useEffect } from "react";
import ImageUploading, { ImageListType, ImageType } from "react-images-uploading";
import { BankUser } from "../Interfaces/BankUser";
import { AuthContext, getCurrentUser } from "../Authentication/auth";
import { getDatabase } from "@firebase/database";
import { auth } from "../firebase";
import {ref, update, child} from "@firebase/database";
import { url } from "inspector";
import { upload } from "@testing-library/user-event/dist/upload";
//import { useAuth, upload } from "../firebase";


export function AvatarForm() {

    let database_reference = ref(getDatabase());
    let users=child(database_reference,"users");

    const [images, setImages] = React.useState([]);
    const maxNumber = 69;

    const userContext = useContext(AuthContext);
    const [userObj, setUserObj]  = useState<BankUser>();
    if(!userObj) getCurrentUser(setUserObj);

  
    function saveAvatar(){
        if(userContext.state){
            update(ref(getDatabase(), '/users/'+userContext.state.user.uid), {...userObj, avatar: ImageData})
        }
        /*
        UserProfileChangeRequest profileUpdates = new UserProfileChangeRequest.Builder()
        .setDisplayName("Jane Q. User")
        .setPhotoUri(Uri.parse("https://example.com/jane-q-user/profile.jpg"))
        .build();
        */
    }

    //userContext.state ... userCredential
    //userContext.user.uid
    //ref with getDatabase /users/+uid

    
    const onChange = (
        imageList: ImageListType,
        addUpdateIndex: number[] | undefined
    ) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setImages(imageList as never[]);
    };

    //use CSS to force an image into a specific size

    return (
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
                    //onImageUpdate,
                    //onImageRemove,
                    isDragging,
                    dragProps
                }) => (
                    // write your building UI
                    <div className="uploadimage-wrapper">
                        <Button
                            style={isDragging ? { color: "red" } : undefined}
                            onClick={onImageUpload}
                            {...dragProps}
                            size="sm"
                        >
                            Upload Image
                        </Button>
                        <Button onClick={saveAvatar}>Save Avatar</Button>
                        <Button onClick={onImageRemoveAll} size="sm">Remove all images</Button>
                        {imageList.map((image, index) => (
                            <div key={index} className="image-item">
                                <img src={image.dataURL} alt="" width="100" />
                                {/*  map dataURL string to userObj.avatar*/}
                                {/* <div className="image-itembtn-wrapper">
                                    <Button onClick={() => onImageUpdate(index)}>Update</Button>
                                    <Button onClick={() => onImageRemove(index)}>Remove</Button>
                                </div> */}
                            </div>
                        ))}
                    </div>
                )}
            </ImageUploading>
        </div>
    );
};
