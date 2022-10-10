import { Button, Form } from "react-bootstrap";
import React, { useRef, useState } from "react";

export function AvatarForm(){
    /*
    function uploadImage(event: React.ChangeEvent<HTMLImageElement>){
        //HTMLImageElement???
        setImage(event.target.src)
    }

    const [image, setImage] = useState<string>("");
    */
  
    return (
      <div>
        <Form.Group controlId="avatar">
        <Form.Label>Upload Image</Form.Label>
            <input type="file" id="myFile" name="filename"/>
            <input type="submit"></input>
        </Form.Group>
      </div>
    );
  }