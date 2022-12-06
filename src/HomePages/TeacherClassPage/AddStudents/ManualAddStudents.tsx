import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { BsTrashFill } from "react-icons/bs";
import { RiPlayListAddFill } from "react-icons/ri";
import { AuthUser } from "../../../Authentication/auth";
import { firebaseConfig } from "../../../firebase";
import { Bank } from "../../../Interfaces/BankObject";

/*
I HAVE NO CLUE IF THIS IS A GOOD WAY TO GO ABOUT MAKING A LIST OF EDITABLE ITEMS.
I SHOULD PROBABLY REFACTOR THIS IN THE FUTURE.
*/

type InputEvent = React.ChangeEvent<HTMLInputElement>;

interface NewStudent{
    email: string;
    password: string;
}

export function AddStudentList({classID, setShowModal}: {classID: string, setShowModal: (b)=>void}): JSX.Element {
    const [studentList, setStudentList] = useState<NewStudent[]>([{email: "", password: ""}]);

    //sets the value of the 
    function setStudentAtIndex(index_to_edit: number, new_student_object: NewStudent | null) {
        if(new_student_object == null) {
            setStudentList(studentList.filter((_student, index) => index !== index_to_edit));
        } else {
            setStudentList(studentList.map((student, index) => index_to_edit===index ? new_student_object : student));
        }
    }

    return(
    <div>
        <Row>
            <Col><h6>Student's email:</h6></Col>
            <Col><h6>Student's password:</h6></Col>
            <Col xs={1}></Col>
        </Row>
        {studentList.map((student, index) => {
            return (
                <NewStudentForm
                    student={student}
                    setStudent={(new_student: NewStudent | null)=>setStudentAtIndex(index, new_student)}
                />
            )
        })}
        <Col className="text-center">
            <Button
                onClick={()=>setStudentList([...studentList, {email:"", password:""}])}
                style={{"marginTop": "10px"}}
            >
                <RiPlayListAddFill/>{" "}
                New Student
            </Button>
        </Col>
        <br/>
        <Button
            className="confirm-button"
            variant="success"
            onClick={()=>{
                createStudentAccountsFromList(classID.slice(0,6), studentList);
                setShowModal(false);
            }}
        >Create Student Accounts</Button>
    </div>
    )
}

function NewStudentForm({student, setStudent}: {student: NewStudent, setStudent: (s)=>void}): JSX.Element {
    return(
    <Row style={{"paddingTop": "5px"}}>
        <Col>
            <Form.Group controlId="email">
                <Form.Control
                    placeholder='example@test.com'
                    value={student.email}
                    onChange={(e: InputEvent) => setStudent({...student, email: e.target.value})}>
                </Form.Control>
            </Form.Group>
        </Col>
        <Col>
            <Form.Group controlId="password">
            <Form.Control
                    value={student.password}
                    onChange={(e: InputEvent) => setStudent({...student, password: e.target.value})}>
                </Form.Control>
            </Form.Group>
        </Col>
        <Col xs={1}>
            <Button
                variant="danger"
                size="sm"
                onClick={()=>setStudent(null)}
                style={{"marginTop": "3px"}}
            ><BsTrashFill/></Button>
        </Col>
    </Row>
    )
}

//create accounts for each student in the list and add them to the class
function createStudentAccountsFromList(classID: string, studentList: NewStudent[]) {
    let failed_list: string[] = [];
    let finished_list: string[] = [];
    studentList = studentList.filter((student) => student.email!=="" && student.password.length>5);

    let class_reference = ref(getDatabase(), "/groups/"+classID);
    const secondary_app = initializeApp(firebaseConfig, "secondary app");
    studentList.forEach((new_student, index) => {
        createUserWithEmailAndPassword(getAuth(secondary_app), new_student.email, new_student.password).then((new_credential) => {
            let user_reference = ref(getDatabase(), "/users/"+new_credential.user.uid);
            const new_auth_user: AuthUser = {
                username: new_student.email.split("@")[0],
                email: new_student.email,
                id: new_student.password,
                avatar: "",
                groups: ["placeholder", classID],
                isTeacher: false,
                hash: new_credential.user.uid
            }
            set(user_reference, {userObj:new_auth_user}).then((val) => {
                finished_list.push(new_credential.user.uid);
            });

            get(class_reference).then((snapshot) => {
                if(snapshot.val() == null) return;
                let bank_obj: Bank = snapshot.val().bankObj;
                bank_obj.studentList.push({
                    balance: 0,
                    isBanker: false,
                    uid: new_credential.user.uid
                });
                set(class_reference, {bankObj: {...bank_obj}});
            });
        }).catch((reason) => {
            failed_list.push(new_student.email);
        });
    });

    //weird stuff to wait until finished creating accounts
    function check_finished() {
        if(finished_list.length < studentList.length) {
            window.setTimeout(check_finished, 100);
        } else {
            return;
        }
    }
    check_finished();
}