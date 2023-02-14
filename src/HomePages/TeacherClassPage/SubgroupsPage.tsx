import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, AuthUser } from "../../Authentication/auth";
import { LoadingPage } from "../../Authentication/LoadingPage/LoadingPage";
import { AddStudentsModal } from "./AddStudents/AddStudentsModal";
import {Bank} from "../../Interfaces/BankObject"
import { ref, getDatabase, onValue} from '@firebase/database';
import "./TeacherClassPage.css";
import { BankUser } from '../../Interfaces/BankUser';
import { Subgroups } from "./Subgroups";
import { Button, Modal } from 'react-bootstrap';
import { delete_bank } from '../../Authentication/EditProfilePage/DeleteAccount';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { StudentList } from './StudentList/StudentList';

export function SubgroupsPage({classCode}:{classCode:string}){
	return(
		<div>
		<h1>HELLO WORLD</h1>
		</div>
	)
}