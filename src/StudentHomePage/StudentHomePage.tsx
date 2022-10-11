import { LogoutButton } from "../Logout/Logout";
import {useNavigate} from 'react-router-dom';
import React, { useState } from 'react';
import { Button, Form } from "react-bootstrap";
import { Students } from "../UserInterfaces/Students";
import { ref, getDatabase, push, child, update, get } from '@firebase/database';

export function StudentHomePage( {userID, currentUser, passUser}:
    {userID: string, currentUser: Students; passUser: (passUser: Students) => void}){
    const [courseCode, setCode] = useState<string>("");
    function updatePass(event: React.ChangeEvent<HTMLInputElement>){
        setCode(event.target.value)
    }
    function addCourseCode(){
        let groupRef=ref(getDatabase(),'groups')
        let userRef=ref(getDatabase(), userID + '/userObj/groups')
        get(groupRef).then(ss=>{
            let newStudent = {...currentUser, groups: [...currentUser.groups]}
            const getGroups = Object.keys(ss.val())
            const filterAllGroups = [...getGroups].filter((groupKey: string): boolean => groupKey === courseCode);
            const filtercurrentGroups = [...currentUser.groups].filter((groupKey: string): boolean => groupKey === courseCode);
            if(filterAllGroups.length > 0 && filtercurrentGroups.length === 0){
                newStudent = {...newStudent, groups: [...newStudent.groups, courseCode]}
                update(userRef,{[courseCode]: courseCode});
                passUser({...currentUser, groups: [...currentUser.groups, courseCode]});
            }
        });
        setCode("");
    }
    return (<div>
        Current Groups:
        <ul>
            {currentUser.groups.map((aGroup: string): JSX.Element => {
                return <div><li>{aGroup}</li></div>
            })}
        </ul>
        <Form.Group controlId="addCourse">
        <Form.Label>Enter Course Code</Form.Label>
            <Form.Control
                value={courseCode}
                onChange={updatePass}/>
            <Button onClick={addCourseCode}>Add Course</Button>
        </Form.Group>
    </div>)
}