import { auth } from "../../firebase"
import { get, set, getDatabase, ref, remove, Database } from "firebase/database";
import { Modal, Button } from "react-bootstrap";
import React, { useState } from "react";
import { AuthUser, STORAGE_KEY } from "../auth";
import { Bank } from "../../Interfaces/BankObject";
import { useNavigate } from "react-router-dom";
import { BankUser } from "../../Interfaces/BankUser";

export function DeleteAccountModal(): JSX.Element {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    return (
        <div>
            <Modal show={showModal} onHide={()=>setShowModal(false)}>
                <Modal.Header closeButton><h2>Delete Account</h2></Modal.Header>
                <Modal.Body style={{"textAlign": "center", "fontSize": "150%", "color": "red"}}>
                    Are you sure you want to continue?<br />
                    This action is irreversible!
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>setShowModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={()=>{delete_current_user(); navigate("/")}}>Confirm</Button>
                </Modal.Footer>
            </Modal>
            <Button variant="danger" onClick={()=>setShowModal(true)}>Delete Account</Button>
        </div>
    )
}


//////////////////////////////////// TODO //////////////////////////
//If a student is in multiple of a teacher's classes, if that teacher deletes their account,
//the student will not be removed from all the classes and will hold on to a reference to a 
//deleted bank object.

function delete_current_user(){
    const currUser = auth.currentUser;
    if(currUser == null) { return; }
    
    const user_ref = ref(getDatabase(), "/users/"+currUser.uid);
    get(user_ref).then(user_snapshot => {
        if(user_snapshot.val() == null) return;
        //For each group the user is in, get the group's object and remove the user from it.
        const current_user_object: AuthUser = user_snapshot.val().userObj; //get user value
        current_user_object.groups.forEach(bank_code => {
            if(bank_code === "placeholder") return;
            if(current_user_object.isTeacher) {
                delete_bank(bank_code.slice(0,6), currUser.uid);
            } else {
                delete_student_from_bank(bank_code.slice(0,6), currUser.uid);
            }
        });
    }).catch((reason) => {
        console.log(reason);
    }).finally(() => {
        remove(user_ref); //delete userObj from database
        currUser.delete(); //delete user from firebase authentication
        sessionStorage.removeItem(STORAGE_KEY); //remove login info from session storage
    });
    
}

//super sensitive function. dont touch
export function delete_bank(bank_code: string, teacher_code: string) {
    //delete each student from the bank then delete the bank itself and remove the teacher's reference to the bank
    const database: Database = getDatabase();

    const bank_ref = ref(database, "/groups/"+bank_code);
    get(bank_ref).then((bank_snapshot) => {
        if(bank_snapshot.val() == null) return;
        const bank: Bank = bank_snapshot.val().bankObj;
        //delete reference to the bank in each user's groups list
        bank.studentList.forEach((bank_user: BankUser) => {
            if(bank_user.uid === "") return;
            const bank_user_ref = ref(database, "/users/"+bank_user.uid);
            get(bank_user_ref).then((user_snapshot) => {
                if(user_snapshot.val() == null) return;
                const auth_user: AuthUser = user_snapshot.val().userObj;
                const new_groups_list = auth_user.groups.filter((user_bank_code) => user_bank_code.slice(0,6) !== bank_code);
                set(bank_user_ref, {userObj: {...auth_user, groups: new_groups_list}});
            });
        });
    });
    //delete the teacher's reference to the bank
    const teacher_ref = ref(database, "/users/"+teacher_code);
    get(teacher_ref).then((teacher_snapshot) => {
        if(teacher_snapshot.val() == null) return;
        const teacher_user: AuthUser = teacher_snapshot.val().userObj;
        const new_groups_list = teacher_user.groups.filter((teacher_bank_code) => teacher_bank_code.slice(0,6) !== bank_code);
        set(teacher_ref, {userObj: {...teacher_user, groups: new_groups_list}});
    });
    remove(bank_ref); //delete the bank object itself
}

//super sensitive function. dont touch
export function delete_student_from_bank(bank_code: string, student_code: string) {
    //delete student from list of BankUsers, the delete student's reference to the bank
    const database = getDatabase();

    //delete BankUser from bank studentList
    const bank_ref = ref(database, "/groups/"+bank_code);
    get(bank_ref).then((bank_snapshot) => {
        if(bank_snapshot.val() == null) return;
        const bank_object: Bank = bank_snapshot.val().bankObj;
        const new_student_list = bank_object.studentList.filter((bank_user) => bank_user.uid !== student_code);
        console.log("new student list ", new_student_list);
        set(bank_ref, {bankObj: {...bank_object, studentList: new_student_list}});
    });

    //delete bank code from student's groups list
    const user_ref = ref(database, "/users/"+student_code);
    get(user_ref).then((user_snapshot) => {
        if(user_snapshot.val() == null) return;
        const user_object: AuthUser = user_snapshot.val().userObj;
        const new_groups_list = user_object.groups.filter((student_bank_code) => student_bank_code.slice(0,6) !== bank_code);
        set(user_ref, {userObj: {...user_object, groups: new_groups_list}});
    });
}



