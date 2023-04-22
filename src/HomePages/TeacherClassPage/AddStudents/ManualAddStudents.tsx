import React, { useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { BsTrashFill } from "react-icons/bs";
import { RiPlayListAddFill } from "react-icons/ri";
import { NewStudent } from "./AddStudentsModal";

/*
I HAVE NO CLUE IF THIS IS A GOOD WAY TO GO ABOUT MAKING A LIST OF EDITABLE ITEMS.
I SHOULD PROBABLY REFACTOR THIS IN THE FUTURE.
*/

type InputEvent = React.ChangeEvent<HTMLInputElement>;



export function AddStudentList(
    {studentList, setStudentList}: {studentList: NewStudent[], setStudentList: (n: NewStudent[]) => void}
): JSX.Element {

    //sets the value of the 
    function setStudentAtIndex(index_to_edit: number, new_student_object: NewStudent | null) {
        if(new_student_object == null) {
            setStudentList(studentList.filter((_student, index) => index !== index_to_edit));
        } else {
            setStudentList(studentList.map((student, index) => index_to_edit===index ? new_student_object : student));
        }
    }

    useEffect(() => {
        if(studentList.length === 0 || (studentList[studentList.length-1].email !== "" && studentList[studentList.length-1].password !== "")) {
            setStudentList([...studentList, {email: "", password: ""}])
        }
    }, [studentList, setStudentList]);
    

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
        <br/>
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

