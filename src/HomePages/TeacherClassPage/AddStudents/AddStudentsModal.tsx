import React, { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { ImportRoster } from "./ImportRoster";
import { AddStudentList } from "./ManualAddStudents";
import { validate } from "email-validator";
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { get_bank } from "../../../DatabaseFunctions/BankFunctions";
import { create_bank_users } from "../../../DatabaseFunctions/BankUserFunctions";
import { create_auth_user } from "../../../DatabaseFunctions/UserFunctions";
import { AuthUser, default_authuser } from "../../../Interfaces/AuthUser";
import { Bank, DEFAULT_BANK, copy_bank } from "../../../Interfaces/BankObject";
import { firebaseConfig } from "../../../firebase";

export interface NewStudent{
    email: string;
    password: string;
}

export function AddStudentsModal({classID}: {classID: string}): JSX.Element {
    const [showModal, setShowModal] = useState(false);
    function hide() {setStudentList([]); setShowModal(false);}
    const [showImportCSV, setShowImportCSV] = useState(false)
    const [studentList, setStudentList] = useState<NewStudent[]>([{email: "", password: ""}]);
    const [errors, set_errors] = useState<[NewStudent, string][]>([]);

    return(
    <div>
        <Modal show={showModal} onHide={hide} size="lg">
            <Modal.Header closeButton><h2>Create Student Accounts</h2></Modal.Header>
            <Modal.Body>
                {/*<Button onClick={()=>setShowImportCSV(!showImportCSV)}>
                    {showImportCSV ? "Manually add students instead" : "Import as CSV instead"}
                </Button>*/}
                <br/><br/>
                {showImportCSV ? (
                    <ImportRoster currentGroup={classID} setShowModal={setShowModal}/>
                ) : (
                    <AddStudentList studentList={studentList} setStudentList={setStudentList}/>
                )}
                {errors.length > 0 ? (
                    <Alert variant="danger">
                        <h3>The following student accounts could not be created: </h3>
                        {errors.map(e => {
                            return <p>{e[0].email+", "+e[0].password+": "+e[1]}</p>
                        })}
                    </Alert>
                ) : (
                    <></>
                )}

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>setShowModal(false)}>Cancel</Button>
                <Button
                    className="confirm-button"
                    variant="success"
                    onClick={()=>{
                        createStudentAccountsFromList(classID, studentList).then((errors) => {
                            if(errors.length > 0) {
                                set_errors(errors);
                                setStudentList(errors.map(e => e[0]));
                            } else {
                                hide()
                            }
                        });
                    }}
                >
                    Create Student Accounts
                </Button>
            </Modal.Footer>
        </Modal>
            <form><Button onClick={() => setShowModal(true)}>Create Student Accounts</Button></form>
    </div>
    )
}


//create accounts for each student in the list and add them to the class
export async function createStudentAccountsFromList(bank_id: string, student_list: NewStudent[]): Promise<[NewStudent, string][]> {
    //A list of failed NewStudents and a string explaining why they couldnt be created
    let failed_list: [NewStudent, string][] = [];

    //remove new users with invalid emails or passwords
    //Also adds failed students to the failed_list
    let new_student_list = student_list.filter((student) => {
        if(student.email==="" && student.password==="") {return false;}
        if( validate(student.email) === false ) {
            failed_list.push([student, "Invalid email"]);
            return false;
        }
        if( student.password.length < 6 ) {
            failed_list.push([student, "Password too short"]);
            return false;
        } 
        return true;
    });
    
    //Fail if a Bank object with bank_id cannot be found
    let bank: Bank = await get_bank(bank_id) ?? copy_bank(DEFAULT_BANK);
    if( bank === DEFAULT_BANK ) {
        alert("Bank object not found while creating student accounts. Maybe refresh the page and try again. :(");
        return student_list.map(student => [student, "Error accessing bank object"]);
    }

    //create firebase authenticated users and AuthUser objects for each new student
    let success_list: string[] = []; 
    const secondary_app = initializeApp(firebaseConfig, "secondary app");
    for( let new_student of new_student_list ) {
        try {
            let new_user_credential = await createUserWithEmailAndPassword(getAuth(secondary_app), new_student.email, new_student.password);
            const new_auth_user: AuthUser = {
                ...default_authuser(),
                username: new_student.email.split("@")[0],
                email: new_student.email,
                groups: [bank_id],
                isTeacher: false,
                hash: new_user_credential.user.uid
            }
            await create_auth_user(new_user_credential.user.uid, new_auth_user, secondary_app);
            success_list.push(new_user_credential.user.uid);
        } catch( error: any ) {
            failed_list.push([new_student, error.code])
        }
    }

    //Add BankUser objects to the bank object
    await create_bank_users(bank, ...success_list);

    return failed_list;
}