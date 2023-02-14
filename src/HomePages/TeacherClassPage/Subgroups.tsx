import { useNavigate} from 'react-router-dom';
import React, { useState } from 'react';
import {Button, Form} from 'react-bootstrap';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import { FirebaseError } from '@firebase/util';
import { getDatabase, ref } from "firebase/database";
import { get } from "firebase/database";
import {app} from "../../firebase";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import { SubgroupsPage } from './SubgroupsPage';
import { AuthContext } from "../../Authentication/auth";
import { useContext } from 'react';



export function Subgroups({classID}: {classID: string}): JSX.Element  {
    const [contents, setContents] = useState<string>("");
    const [view, toggleView] = useState<boolean>(false);
    const navigate = useNavigate();
       // let groupRef = ref(getDatabase(), '/groups/' + currentGroup.slice(0,6) + '/bankObj/');
        //let studentListRef = ref(getDatabase(), '/groups/' + currentGroup.slice(0,6) + '/bankObj/studentList/');

                    
    const user = useContext(AuthContext);

    
    return user.user ? (
        <div className="teacher-home">
            <br />
            <div>Classes: </div>
            <SubgroupsPage classCode={user.user.groups}/>
        </div>
    ) : (
        <LoadingPage/>
    )

}