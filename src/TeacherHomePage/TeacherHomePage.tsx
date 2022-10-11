import { LogoutButton } from "../Logout/Logout";
import {useNavigate} from 'react-router-dom';
import { ClassCodeForm } from "../ClassCode/ClassCodes";
import React from 'react';
import { AvatarForm } from "../Avatar/Avatar";

export function TeacherHomePage({passID}:
    {passID: (passID: string) => void}){
    return (<div>
        <ClassCodeForm></ClassCodeForm>
<<<<<<< HEAD
        <LogoutButton></LogoutButton>
        <AvatarForm></AvatarForm>
=======
        <LogoutButton passID={passID}></LogoutButton>
>>>>>>> ca3ab78222349204a2a6596191188f429522b735
    </div>)
}