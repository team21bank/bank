import { Button, Form } from "react-bootstrap";
import React, { ChangeEvent, useRef, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
//import myImageList which is a list of appropriate images that users can pick from
//for their avatar profile


export function AvatarForm() {

    const [images, setImages] = React.useState([]);
    //teacher uploads her pool of images into the class... students pick from that pool
    const maxNumber = 69;

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
                        <Button onClick={onImageRemoveAll} size="sm">Remove all images</Button>
                        {imageList.map((image, index) => (
                            <div key={index} className="image-item">
                                <img src={image.dataURL} alt="" width="100" />
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