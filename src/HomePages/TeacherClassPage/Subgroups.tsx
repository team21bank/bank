import { useNavigate} from 'react-router-dom';
import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap'
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import { FirebaseError } from '@firebase/util';
import { getDatabase, ref } from "firebase/database"
import { get } from "firebase/database"
import {app} from "../../firebase"



export function Subgroups({classID}: {classID: string}): JSX.Element  {
    const [contents, setContents] = useState<string>("");
    const [view, toggleView] = useState<boolean>(false);
    const navigate = useNavigate();
       // let groupRef = ref(getDatabase(), '/groups/' + currentGroup.slice(0,6) + '/bankObj/');
        //let studentListRef = ref(getDatabase(), '/groups/' + currentGroup.slice(0,6) + '/bankObj/studentList/');

                    
    return (
        <div>
        <Form.Group>
           <Button className = "groups-button" onClick={()=>navigate(`/teachers/${classID.slice(0,6)}/groups`)}>Manage Groups</Button>
        </Form.Group>
        </div>
    )
}
