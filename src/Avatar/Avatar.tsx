import { Button, Form } from "react-bootstrap";
import React, { ChangeEvent, useRef, useState } from "react";

export function AvatarForm(){
    /*
    function uploadImage(event: React.ChangeEvent<HTMLImageElement>){
        //HTMLImageElement???
        setImage(event.target.src)
    }

    const [image, setImage] = useState<string>("");
    */

    const [image, setImage] = useState<[{image: object}]>([{image: {}}])
    
    const handleSetImage = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
    }

    return (
      <div>
        <Form.Group controlId="avatar">
        <Form.Label>Upload Image</Form.Label>
            <input type="file" name="image" accept="image/gif, image/jpeg, image/png" onChange={e => handleSetImage(e)}/>
            <input type="submit"></input>
        </Form.Group>
      </div>
    );
  }